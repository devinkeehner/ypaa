import { createLocalReq, type Payload, type PayloadRequest, type TypedUser, type Where } from "payload";
import { isAdministrator } from "./crm-access";
import { ImportError, importDigest, parseTracker, type TrackerData, type TrackerRow } from "./registration-tracker";

export { ImportError } from "./registration-tracker";
type Entity = { id: string; updatedAt: string };
type Journal = { attendees: Entity[]; seats: Entity[]; orders: string[]; contacts: string[]; sources: string[] };
export type ImportPlanRow = TrackerRow & { action: "new" | "matched" | "conflict"; existing: Array<{ collection: string; id: string; updatedAt: string }>; reason: string };
export type ImportPlan = Omit<TrackerData, "rows"> & { rows: ImportPlanRow[]; fingerprint: string; counts: { new: number; matched: number; conflicts: number; seats: number; namedAttendees: number; excluded: number } };
const idOf = (v: unknown): string => typeof v === "string" ? v : v && typeof v === "object" && "id" in v ? String(v.id) : "";
const json = <T,>(v: unknown) => v as T;
const authorized = (user: TypedUser | null) => { if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403); };
const identifiers = (row: TrackerRow): Where => ({ or: [
  { sourceKey: { equals: row.sourceKey } }, { sourceKey: { equals: `stripe:csv:${row.reference}` } },
  ...(row.source === "stripe" ? [
    { stripeChargeId: { equals: row.reference } }, { stripePaymentIntentId: { equals: row.reference } },
    { "rawMetadata.csv_id": { equals: row.reference } },
  ] : [{ stripeCustomerId: { equals: row.reference } }]),
] });

export async function planRegistrationImport(payload: Payload, data: TrackerData, req?: PayloadRequest): Promise<ImportPlan> {
  const rows: ImportPlanRow[] = [];
  const options = { overrideAccess: true, depth: 0, pagination: false, req } as const;
  for (const source of data.rows) {
    const row: ImportPlanRow = { ...source, action: source.errors.length ? "conflict" : "new", existing: [], reason: source.errors.join(" ") || "New registration records. Purchaser identity is left unknown unless an existing checkout supplies it." };
    if (source.errors.length) { rows.push(row); continue; }
    const orders = (await payload.find({ ...options, collection: "checkout-orders", where: identifiers(source) })).docs;
    const registrations = (await payload.find({ ...options, collection: "attendees", where: identifiers(source) })).docs;
    const seats = orders.length === 1 ? (await payload.find({ ...options, collection: "registration-entitlements", where: { and: [{ checkoutOrder: { equals: orders[0].id } }, { entitlementType: { equals: "registration" } }] } })).docs : [];
    row.existing = [ ...orders.map((d) => ({ collection: "checkout-orders", id: d.id, updatedAt: d.updatedAt })), ...registrations.map((d) => ({ collection: "attendees", id: d.id, updatedAt: d.updatedAt })), ...seats.map((d) => ({ collection: "registration-entitlements", id: d.id, updatedAt: d.updatedAt })) ];
    if (orders.length > 1 || registrations.length > source.quantity) { row.action = "conflict"; row.reason = "Multiple existing source matches. Resolve in Event CRM before importing."; }
    else if (orders.some((o) => !["paid", "recorded"].includes(o.paymentStatus)) || registrations.some((r) => !["paid", "recorded"].includes(r.paymentStatus) || r.attendanceStatus === "cancelled") || seats.some((s) => ["refunded", "voided"].includes(s.status))) { row.action = "conflict"; row.reason = "Existing refunded, disputed, voided, cancelled, or unpaid records are preserved. Import cannot reactivate them."; }
    else if (orders.length && (orders[0].totalCents !== source.totalCents || orders[0].paymentSource !== source.source)) { row.action = "conflict"; row.reason = "Existing checkout payment details disagree with the tracker. No overwrite is allowed."; }
    else if (seats.length >= source.quantity || registrations.length === source.quantity) { row.action = "matched"; row.reason = "Existing registrations/seats are preserved, including assignments, corrected identities, policy acknowledgments and attendance."; }
    else if (seats.length || registrations.length) { row.action = "conflict"; row.reason = "Partial existing roster or seat allocation. Resolve it in Event CRM before importing."; }
    if (row.action === "new") for (const person of source.attendees) {
      const contacts = await payload.find({ ...options, collection: "contacts", limit: 2, where: { and: [{ email: { equals: person.email } }, { displayName: { equals: person.name } }] } });
      row.existing.push(...contacts.docs.map((d) => ({ collection: "contacts", id: d.id, updatedAt: d.updatedAt })));
      if (contacts.docs.length > 1) { row.action = "conflict"; row.reason = "Multiple canonical contacts match this attendee. Resolve them in Event CRM before importing."; }
    }
    rows.push(row);
  }
  // Payment/source identity determines registrations; sharing an email does not merge or block receipts.
  const fingerprint = importDigest(rows);
  return { ...data, rows, fingerprint, counts: { new: rows.filter((r) => r.action === "new").length, matched: rows.filter((r) => r.action === "matched").length, conflicts: rows.filter((r) => r.action === "conflict").length, seats: rows.filter((r) => r.action === "new").reduce((sum, r) => sum + r.quantity, 0), namedAttendees: rows.filter((r) => r.action === "new").reduce((sum, r) => sum + r.attendees.length, 0), excluded: data.excluded.length } };
}

export async function previewRegistrationImport(payload: Payload, user: TypedUser | null, bytes: Uint8Array, filename: string) {
  authorized(user);
  if (!/\.xlsx$/i.test(filename)) throw new ImportError("Download the complete Google Sheet as Microsoft Excel (.xlsx), then upload it here.");
  const active = await payload.count({ collection: "registration-imports", overrideAccess: true, where: { and: [{ createdBy: { equals: user!.id } }, { status: { equals: "preview" } }, { expiresAt: { greater_than: new Date().toISOString() } }] } });
  if (active.totalDocs >= 100) throw new ImportError("Too many recent previews. Retry after an earlier preview expires.", 429);
  const plan = await planRegistrationImport(payload, parseTracker(bytes));
  const batch = await payload.create({ collection: "registration-imports", overrideAccess: true, data: { filename: filename.replace(/[\r\n]/g, "").slice(0, 200), fileDigest: importDigest(Array.from(bytes)), status: "preview", createdBy: user!.id, expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), preview: plan } });
  return { id: batch.id, plan };
}

export async function confirmRegistrationImport(payload: Payload, user: TypedUser | null, input: Record<string, unknown>) {
  authorized(user);
  if (input.confirmPayment !== true || input.confirmAttendees !== true || input.confirmScope !== true) throw new ImportError("Confirm current paid receipts, attendee identities, and registration-only scope.");
  if (typeof input.id !== "string" || !Array.isArray(input.sources) || !input.sources.length || input.sources.some((v) => typeof v !== "string") || new Set(input.sources).size !== input.sources.length) throw new ImportError("Select valid registration sources from the preview.");
  const sources = input.sources as string[];
  const req = await createLocalReq({ user: user! }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new ImportError("Imports require a database replica set with transactions. No registrations were changed.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: true, depth: 0 } as const;
  try {
    const batch = await payload.findByID({ ...options, collection: "registration-imports", id: input.id });
    if (idOf(batch.createdBy) !== user!.id) throw new ImportError("Only the administrator who reviewed this preview can confirm it.", 403);
    if (batch.status === "imported") { await payload.db.rollbackTransaction(transactionID); return { id: batch.id, result: json<Journal>(batch.result), alreadyImported: true }; }
    if (batch.status !== "preview" || Date.parse(batch.expiresAt) <= Date.now()) throw new ImportError("This preview expired or was rolled back. Upload a fresh preview.", 409);
    const original = json<ImportPlan>(batch.preview);
    if (input.fingerprint !== original.fingerprint) throw new ImportError("The preview does not match this import.", 409);
    const current = await planRegistrationImport(payload, original, req);
    if (current.fingerprint !== original.fingerprint) throw new ImportError("CRM records changed since the preview. Upload again to review the current matches.", 409);
    const selected = current.rows.filter((r) => sources.includes(r.sourceKey));
    if (selected.length !== sources.length || selected.some((r) => r.action !== "new")) throw new ImportError("Only new, validated preview rows can be imported.", 409);
    const journal: Journal = { attendees: [], seats: [], orders: [], contacts: [], sources: selected.map((r) => r.sourceKey) };
    for (const row of selected) {
      const identifiers = row.source === "stripe" ? (row.reference.startsWith("ch_") ? { stripeChargeId: row.reference } : row.reference.startsWith("pi_") ? { stripePaymentIntentId: row.reference } : {}) : { stripeCustomerId: row.reference };
      let order = row.existing.find((d) => d.collection === "checkout-orders") ? await payload.findByID({ ...options, collection: "checkout-orders", id: row.existing.find((d) => d.collection === "checkout-orders")!.id }) : undefined;
      const metadata = { registrationImportBatch: batch.id, trackerSourceKey: row.sourceKey, csv_id: row.source === "stripe" ? row.reference : undefined, trackerRows: row.sourceRows, registrationQuantity: row.quantity, scope: "registration-only", otherProductsNotImported: true, purchaserIdentityKnown: Boolean(order), paymentConfirmedBy: user!.id };
      if (!order) {
        // A roster/cardholder fallback is not evidence of who purchased the checkout.
        order = await payload.create({ ...options, collection: "checkout-orders", data: { sourceKey: row.sourceKey, ...identifiers, purchaserName: "Purchaser not recorded in tracker", purchaserEmail: "unknown@registration-import.invalid", subtotalCents: row.totalCents - row.feeCents, processingFeeCents: row.feeCents, totalCents: row.totalCents, paymentSource: row.source, paymentStatus: row.source === "cash" ? "recorded" : "paid", dataOrigin: row.source === "cash" ? "cash_checkout" : "stripe_backfill", purchasedAt: row.purchasedAt, order: { importScope: "registration-only", registrationQuantity: row.quantity, registrationValueCents: row.priceCents * row.quantity, originalGrossCents: row.totalCents, purchaserIdentityUnknown: true }, rawMetadata: metadata } });
        journal.orders.push(order.id);
      }
      for (let index = 0; index < row.quantity; index++) {
        const person = row.attendees[index];
        let registration, contact;
        if (person) {
          const matches = await payload.find({ ...options, collection: "contacts", limit: 2, where: { and: [{ email: { equals: person.email } }, { displayName: { equals: person.name } }] } });
          if (matches.docs.length > 1) throw new ImportError("Multiple canonical contacts match. Resolve this in Event CRM and preview again.", 409);
          contact = matches.docs[0];
          if (!contact) { contact = await payload.create({ ...options, collection: "contacts", data: { contactKey: `registration-import:contact:${importDigest(person)}`, displayName: person.name, email: person.email, communicationConsent: "unknown", tags: ["attendee"] } }); journal.contacts.push(contact.id); }
          registration = await payload.create({ ...options, collection: "attendees", data: { sourceKey: `${row.sourceKey}:registration:${index + 1}`, contact: contact.id, checkoutOrder: order.id, ...identifiers, attendeeName: person.name, attendeeEmail: person.email, state: contact.state || "Unknown", purchaserName: order.purchaserName, purchaserEmail: order.purchaserEmail, registrationPriceCents: row.priceCents, attendanceStatus: "expected", attendanceBasis: "self_registration", paymentSource: row.source, paymentStatus: row.source === "cash" ? "recorded" : "paid", dataOrigin: row.source === "cash" ? "cash_checkout" : "stripe_backfill", purchasedAt: row.purchasedAt, policyAcknowledgments: { status: "pending" }, rawMetadata: metadata } });
        }
        const seat = await payload.create({ ...options, collection: "registration-entitlements", data: { sourceKey: `${row.sourceKey}:entitlement:registration:${index + 1}`, checkoutOrder: order.id, purchaserContact: idOf(order.purchaserContact) || undefined, entitlementType: "registration", status: registration ? "assigned" : "unassigned", attendeeContact: contact?.id, registration: registration?.id, assignedAt: registration ? new Date().toISOString() : undefined, fundingSource: "direct_checkout", sourceMetadata: metadata } });
        journal.seats.push({ id: seat.id, updatedAt: seat.updatedAt });
        if (registration) { const linked = await payload.update({ ...options, collection: "attendees", id: registration.id, data: { entitlement: seat.id } }); journal.attendees.push({ id: linked.id, updatedAt: linked.updatedAt }); }
      }
    }
    await payload.update({ ...options, collection: "registration-imports", id: batch.id, data: { status: "imported", confirmedAt: new Date().toISOString(), result: journal } });
    await payload.db.commitTransaction(transactionID);
    return { id: batch.id, result: journal, alreadyImported: false };
  } catch (error) { await payload.db.rollbackTransaction(transactionID); throw error; }
}

export async function rollbackRegistrationImport(payload: Payload, user: TypedUser | null, input: Record<string, unknown>) {
  authorized(user);
  if (typeof input.id !== "string" || typeof input.reason !== "string" || !input.reason.trim() || input.reason.length > 2000 || input.confirmRollback !== true) throw new ImportError("Confirm rollback and add a reason of at most 2,000 characters.");
  const req = await createLocalReq({ user: user! }, payload), transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new ImportError("Rollback requires database transactions.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: true, depth: 0 } as const;
  try {
    const batch = await payload.findByID({ ...options, collection: "registration-imports", id: input.id });
    if (batch.status === "rolled_back") { await payload.db.rollbackTransaction(transactionID); return { id: batch.id, alreadyRolledBack: true }; }
    if (batch.status !== "imported") throw new ImportError("Only a completed import can be rolled back.", 409);
    const journal = json<Journal>(batch.result);
    // A later correction, transfer, redemption or check-in prevents a destructive reversal.
    for (const item of journal.attendees) {
      const r = await payload.findByID({ ...options, collection: "attendees", id: item.id });
      if (r.updatedAt !== item.updatedAt || r.attendanceStatus !== "expected") throw new ImportError("An imported registration changed or was checked in. Resolve it in Event CRM; batch rollback is blocked.", 409);
      const related = await payload.find({ ...options, collection: "registration-entitlements", pagination: false, where: { registration: { equals: r.id } } });
      if (related.docs.some((s) => !journal.seats.some((own) => own.id === s.id))) throw new ImportError("Another paid seat now references this attendee. Rollback is blocked.", 409);
    }
    for (const item of journal.seats) {
      const s = await payload.findByID({ ...options, collection: "registration-entitlements", id: item.id });
      if (s.updatedAt !== item.updatedAt || !["assigned", "unassigned"].includes(s.status)) throw new ImportError("An imported seat changed or was redeemed. Rollback is blocked.", 409);
    }
    for (const item of journal.attendees) await payload.update({ ...options, collection: "attendees", id: item.id, data: { attendanceStatus: "cancelled", notes: `Import rolled back: ${input.reason.trim()}` } });
    for (const item of journal.seats) await payload.update({ ...options, collection: "registration-entitlements", id: item.id, data: { status: "voided", assignmentNote: `Import rolled back: ${input.reason.trim()}` } });
    await payload.update({ ...options, collection: "registration-imports", id: batch.id, data: { status: "rolled_back", rolledBackAt: new Date().toISOString(), rolledBackBy: user!.id, rollbackReason: input.reason.trim() } });
    await payload.db.commitTransaction(transactionID);
    return { id: batch.id, alreadyRolledBack: false };
  } catch (error) { await payload.db.rollbackTransaction(transactionID); throw error; }
}
