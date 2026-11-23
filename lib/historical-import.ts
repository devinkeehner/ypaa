import { createHash } from "node:crypto";
import type { Payload, PayloadRequest, Where } from "payload";
import {
  HistoricalInputError, parseHistoricalImport as parseManifest, stripePaymentAliases as stripeAliases,
  type HistoricalImport, type HistoricalPayment, type HistoricalRegistration, type HistoricalReview,
} from "./historical-import-input";
import { ImportError } from "./registration-tracker";

export type { HistoricalImport, HistoricalReview } from "./historical-import-input";

const days = ["friday", "saturday", "sunday"] as const;
type Day = typeof days[number];
type PaymentSource = HistoricalPayment["source"];
type Person = { name?: string; email?: string };
type SourceRow = NonNullable<HistoricalRegistration["provenance"]>;

type ProductCounts = {
  registrations: number; namedAttendees: number; breakfasts: number; scholarships: number; merchandise: number;
};
type AnswerCounts = { fellowship: number; accommodations: number; interpretation: number; mobility: number; service: number };
export type HistoricalImportPlanRow = ProductCounts & {
  sourceKey: string; source: PaymentSource; action: "new" | "matched" | "conflict"; message: string;
  grossCents: number; purchasedAt: string | null; fingerprint: string; answers: AnswerCounts;
};
export type HistoricalImportPlan = {
  fingerprint: string; rows: HistoricalImportPlanRow[]; review: HistoricalReview[]; answerCounts: AnswerCounts;
  counts: ProductCounts & { new: number; matched: number; skipped: number; conflicts: number; review: number };
};
type CreatedRecord = { collection: string; id: string; sourceKey: string };
export type HistoricalImportJournal = {
  sources: string[]; created: CreatedRecord[]; counts: ProductCounts & { receipts: number; checkoutOrders: number; cashTransactions: number };
};

export class HistoricalImportError extends ImportError {}

const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function parseHistoricalImport(bytes: Uint8Array): HistoricalImport {
  let manifest: HistoricalImport;
  try {
    manifest = parseManifest(bytes);
  } catch (error) {
    if (error instanceof HistoricalInputError) throw new HistoricalImportError(error.message, error.status);
    throw error;
  }
  const admissions = manifest.payments.reduce((total, payment) => {
    const counts = getCounts(payment);
    return total + counts.registrations + counts.breakfasts;
  }, 0);
  if (admissions > 5_000) throw new HistoricalImportError("Split the import into batches with at most 5,000 registration and breakfast admissions total.");
  return manifest;
}

function matchKeys(payment: HistoricalPayment) {
  const keys = [payment.sourceKey];
  if (payment.source === "stripe") {
    for (const alias of stripeAliases(payment)) keys.push(`stripe:${alias}`, `stripe:csv:${alias}`);
  }
  if (payment.source !== "stripe" && payment.cashReference && payment.cashReference !== "legacy-customer") {
    keys.push(payment.cashReference, `cash:${payment.cashReference}`);
  }
  return [...new Set(keys)];
}

function claimAliases(payment: HistoricalPayment) {
  const explicitCashReference = payment.cashReference && payment.cashReference !== "legacy-customer" ? payment.cashReference : undefined;
  return [...new Set([payment.sourceKey, ...stripeAliases(payment).map((alias) => `stripe:${alias}`),
    ...(explicitCashReference ? [`${payment.source}:${explicitCashReference}`] : [])])];
}

function canonicalOrderKey(payment: HistoricalPayment) {
  if (payment.source !== "stripe") return payment.sourceKey;
  const stripe = payment.stripe;
  if (stripe?.checkoutSessionId) return `stripe:${stripe.checkoutSessionId}`;
  const id = stripe?.chargeId || stripe?.paymentId || stripe?.paymentIntentId;
  return id ? `stripe:csv:${id}` : payment.sourceKey;
}

function hasIdentity(person?: Person): person is Required<Person> {
  return Boolean(person?.name && person.email);
}

function registrationEntries(payment: HistoricalPayment) {
  const registrations = [...payment.registrations];
  const specific = payment.scholarships.filter(({ kind }) => kind === "specific");
  const represented = registrations.filter(({ kind }) => kind === "specific-scholarship").length;
  for (const [index, scholarship] of specific.entries()) {
    if (index < represented) continue;
    const recipient = scholarship.recipient ?? { unitPriceCents: scholarship.priceCents || scholarship.amountCents, answers: {} };
    registrations.push({ ...recipient, kind: "specific-scholarship" });
  }
  return registrations;
}

function getCounts(payment: HistoricalPayment): ProductCounts {
  const registrations = registrationEntries(payment);
  return {
    registrations: registrations.length,
    namedAttendees: registrations.filter(hasIdentity).length,
    breakfasts: payment.breakfasts.reduce((count, ticket) => count + ticket.quantity, 0),
    scholarships: payment.scholarships.length,
    merchandise: payment.merchandise.reduce((count, item) => count + item.quantity, 0),
  };
}

function samePaymentStatus(payment: HistoricalPayment) {
  return payment.status === (payment.source === "stripe" ? "paid" : "recorded");
}

type MatchCollection = "checkout-orders" | "historical-receipts" | "cash-transactions" | "attendees" | "breakfast-tickets" | "merchandise-orders";
type MatchDocument = {
  id: string; updatedAt?: string; sourceKey?: string | null; paymentAliases?: string[] | null;
  stripePaymentId?: string | null; stripeChargeId?: string | null; stripeCheckoutSessionId?: string | null; stripePaymentIntentId?: string | null;
  stripeCustomerId?: string | null; cashReference?: string | null; receiptReference?: string | null;
  rawMetadata?: unknown; paymentSource?: string; breakfastDay?: Day;
};
const stripeIdFields = ["stripePaymentId", "stripeChargeId", "stripeCheckoutSessionId", "stripePaymentIntentId"] as const;
const inValues = (key: string, values: string[]) => values.length ? [{ [key]: { in: values } }] : [];
const unique = (values: string[]) => [...new Set(values)].sort();

function readMatches(collection: MatchCollection, doc: MatchDocument) {
  const metadata = doc.rawMetadata && typeof doc.rawMetadata === "object" ? doc.rawMetadata as Record<string, unknown> : undefined;
  const sourceKey = collection === "attendees" || collection === "breakfast-tickets"
    ? doc.sourceKey?.replace(/:(?:breakfast:[^:]+|registration|scholarship):\d+$/, "") : doc.sourceKey;
  return {
    collection, doc,
    keys: unique([sourceKey, doc.receiptReference, doc.cashReference, ...stripeIdFields.map((field) => doc[field]), metadata?.csv_id,
      ...(doc.paymentAliases || [])].filter((value): value is string => typeof value === "string")),
  };
}

async function findMatches(payload: Payload, payments: HistoricalPayment[], req?: PayloadRequest) {
  const result: ReturnType<typeof readMatches>[] = [];
  const collections: MatchCollection[] = ["checkout-orders", "historical-receipts", "cash-transactions", "attendees", "breakfast-tickets", "merchandise-orders"];
  // Query in bounded groups. MongoDB does not support parallel operations on one transaction session.
  for (let start = 0; start < payments.length; start += 100) {
    const group = payments.slice(start, start + 100);
    const keys = unique(group.flatMap(matchKeys));
    const stripeIDs = unique(group.flatMap(stripeAliases));
    const cashReferences = unique(group.flatMap(({ cashReference }) =>
      cashReference && cashReference !== "legacy-customer" ? [cashReference] : []));
    const cashCustomers = unique(group.flatMap((p) => p.source === "cash" && p.stripe?.customerId ? [p.stripe.customerId] : []));
    const aliases = unique(group.flatMap(claimAliases));
    const childKeys = unique(group.flatMap((payment) => matchKeys(payment).flatMap((key) => {
      const registrations = registrationEntries(payment);
      return [
        ...registrations.flatMap((_, index) => [`${key}:registration:${index + 1}`, `${key}:scholarship:${index + 1}`]),
        ...days.flatMap((day) => Array.from({ length: payment.breakfasts.filter((item) => item.day === day).reduce((qty, item) => qty + item.quantity, 0) },
          (_, index) => `${key}:breakfast:${day}:${index + 1}`)),
      ];
    })));
    for (const collection of collections) {
      const where: Where[] = inValues("sourceKey", collection === "attendees" || collection === "breakfast-tickets" ? childKeys : keys);
      if (collection === "historical-receipts") where.push(...inValues("paymentAliases", aliases), ...inValues("receiptReference", cashReferences));
      if (collection === "checkout-orders" || collection === "attendees" || collection === "breakfast-tickets") {
        const fields = collection === "checkout-orders" ? stripeIdFields : stripeIdFields.slice(1);
        for (const field of fields) where.push(...inValues(field, stripeIDs));
        where.push(...inValues("rawMetadata.csv_id", stripeIDs));
        if (cashCustomers.length) where.push({ and: [
          { stripeCustomerId: { in: cashCustomers } }, { paymentSource: { equals: "cash" } },
        ] });
      }
      if (collection === "cash-transactions") where.push(...inValues("cashReference", cashReferences), ...inValues("stripeCustomerId", cashCustomers));
      if (!where.length) continue;
      const matches = await payload.find({ collection, overrideAccess: true, req, depth: 0, pagination: false,
        context: { skipCheckoutPurchaseDisplay: true }, where: { or: where } });
      result.push(...matches.docs.map((doc) => readMatches(collection, doc as MatchDocument)));
    }
  }
  return [...new Map(result.map((match) => [`${match.collection}:${match.doc.id}`, match])).values()];
}

function countAnswers(entries: HistoricalRegistration[]): AnswerCounts {
  const answers = entries.map((entry) => entry.answers);
  return {
    fellowship: answers.filter((answer) => answer.fellowships?.length || answer.fellowshipOther).length,
    accommodations: answers.filter((answer) => answer.accommodations !== undefined).length,
    interpretation: answers.filter((answer) => answer.interpretationNeeded !== undefined).length,
    mobility: answers.filter((answer) => answer.mobilityAccessibility !== undefined).length,
    service: answers.filter((answer) => answer.willingToServe !== undefined).length,
  };
}

async function buildPlan(payload: Payload, manifest: HistoricalImport, req?: PayloadRequest, onlySources?: ReadonlySet<string>): Promise<HistoricalImportPlan> {
  const payments = onlySources ? manifest.payments.filter((payment) => onlySources.has(payment.sourceKey)) : manifest.payments;
  const matches = await findMatches(payload, payments, req);
  const aliasCounts = new Map<string, number>();
  for (const payment of manifest.payments) for (const alias of claimAliases(payment)) aliasCounts.set(alias, (aliasCounts.get(alias) || 0) + 1);
  const rows: HistoricalImportPlanRow[] = payments.map((payment) => {
    const aliases = new Set([...matchKeys(payment), ...claimAliases(payment), ...stripeAliases(payment)]);
    const exact = matches.filter(({ keys }) => keys.some((key) => aliases.has(key)));
    const checkouts = exact.filter(({ collection }) => collection === "checkout-orders");
    const existingPayments = exact.filter(({ collection }) => collection === "checkout-orders" || collection === "cash-transactions" || collection === "historical-receipts");
    const hasCashCustomerMatch = payment.source === "cash" && payment.stripe?.customerId &&
      matches.some(({ collection, doc }) => doc.stripeCustomerId === payment.stripe?.customerId &&
        (collection === "cash-transactions" || doc.paymentSource === "cash") &&
        (payment.cashReference === "legacy-customer" || (!doc.cashReference &&
          !doc.sourceKey?.startsWith(`registration-import:cash:${payment.stripe?.customerId}:`)) ||
          doc.cashReference === "legacy-customer" || doc.sourceKey?.endsWith(":legacy-customer")));
    const products = getCounts(payment);
    const row: HistoricalImportPlanRow = {
      sourceKey: payment.sourceKey, source: payment.source, grossCents: payment.grossCents, purchasedAt: payment.purchasedAt,
      ...products, action: "new", answers: countAnswers(registrationEntries(payment)),
      fingerprint: digest([payment, exact.map(({ collection, doc }) => [collection, doc.id, doc.updatedAt]).sort()]),
      message: payment.purchasedAt ? "New payment and supported records." : "New undated receipt. Line items will be kept on the receipt.",
    };
    function conflict(message: string): HistoricalImportPlanRow {
      return { ...row, action: "conflict", message };
    }
    if (claimAliases(payment).some((alias) => (aliasCounts.get(alias) || 0) > 1)) return conflict("The upload has more than one payment with this receipt or Stripe identifier.");
    if (checkouts.length > 1 || existingPayments.filter(({ collection }) => collection === "historical-receipts").length > 1 ||
      existingPayments.filter(({ collection }) => collection === "cash-transactions").length > 1) return conflict("More than one existing payment matches these identifiers.");
    if (existingPayments.length) {
      const tickets = exact.filter(({ collection }) => collection === "breakfast-tickets");
      const missingBreakfastDays = days.flatMap((day) => {
        const expected = payment.breakfasts.filter((item) => item.day === day).reduce((total, item) => total + item.quantity, 0);
        const missing = expected - tickets.filter(({ doc }) => doc.breakfastDay === day).length;
        return missing > 0 ? [`${missing} ${day}`] : [];
      });
      const missingAttendees = row.namedAttendees - exact.filter(({ collection }) => collection === "attendees").length;
      const notes = [
        missingBreakfastDays.length ? `Breakfast records to review (${missingBreakfastDays.join(", ")}).` : "",
        missingAttendees > 0 ? `Named attendee records to review (${missingAttendees}).` : "",
        row.namedAttendees > 0 ? "Existing attendee answers and check-in status were left as recorded." : "",
      ].filter(Boolean);
      return { ...row, action: "matched", message: ["An existing payment matches and will be skipped.", ...notes].join(" ") };
    }
    if (exact.length) return conflict("Related website records exist without a uniquely matched payment. Review in Event CRM.");
    if (hasCashCustomerMatch) return conflict("This Stripe customer already has a cash record. Verify the individual receipt before importing.");
    if (!samePaymentStatus(payment)) return conflict("Payment status requires review. Only paid Stripe or recorded offline receipts can be imported.");
    if (payment.reviewReasons?.length) return conflict("The source payment was flagged for review.");
    if (payment.source === "stripe" && !stripeAliases(payment).length) return conflict("A Stripe payment identifier is required.");
    if (payment.source !== "stripe" && !payment.cashReference) return conflict("A stable cash or manual receipt reference is required.");
    if (payment.checkoutFeeCents > payment.grossCents) return conflict("The checkout fee exceeds the gross amount.");
    if (payment.registrations.some(({ kind }) => kind === "specific-scholarship") &&
      payment.scholarships.some(({ kind }) => kind === "specific")) return conflict("A specific scholarship cannot be represented as both a registration charge and a scholarship contribution.");
    if (!payment.purchasedAt && (row.namedAttendees || row.breakfasts)) return conflict("Named attendees or breakfast tickets require a verified purchase date.");
    if (!payment.purchasedAt) return { ...row, registrations: 0 };
    return payment.unallocatedCents
      ? { ...row, message: "New payment. The gross amount includes an unexplained allocation difference recorded separately." }
      : row;
  });
  const counts = rows.reduce((totals, row) => {
    if (row.action === "new") {
      totals.new++;
      for (const key of ["registrations", "namedAttendees", "breakfasts", "scholarships", "merchandise"] as const) totals[key] += row[key];
    } else if (row.action === "matched") {
      totals.matched++;
      totals.skipped++;
    } else totals.conflicts++;
    return totals;
  }, { new: 0, matched: 0, skipped: 0, conflicts: 0, registrations: 0, namedAttendees: 0, breakfasts: 0, scholarships: 0, merchandise: 0, review: manifest.review.length });
  const answerCounts = countAnswers(payments.filter((payment) => rows.some((row) =>
    row.sourceKey === payment.sourceKey && row.action === "new")).flatMap(registrationEntries));
  return { rows, counts, answerCounts, review: manifest.review, fingerprint: digest([manifest, rows]) };
}

export async function planHistoricalImport(payload: Payload, manifest: HistoricalImport, req?: PayloadRequest): Promise<HistoricalImportPlan> {
  return buildPlan(payload, manifest, req);
}

type Line = {
  kind: "registration" | "breakfast" | "scholarship" | "merchandise" | "shipping" | "fee" | "other";
  sourceLineId: string; quantity: number; amountCents: number; unitPriceCents?: number; label?: string;
  breakfastDay?: Day; fulfillment?: string; ticketEquivalents?: number; historicalSource?: SourceRow;
};

function purchaseLines(payment: HistoricalPayment): Line[] {
  const lines: Line[] = [];
  const add = (line: Omit<Line, "sourceLineId">) => lines.push({ ...line, sourceLineId: `${line.kind}:${lines.length + 1}` });
  for (const registration of payment.registrations) {
    add({ kind: registration.kind === "specific-scholarship" ? "scholarship" : "registration", quantity: 1,
      amountCents: registration.unitPriceCents, unitPriceCents: registration.unitPriceCents,
      historicalSource: registration.provenance });
  }
  for (const item of payment.breakfasts) add({ kind: "breakfast", quantity: item.quantity, amountCents: item.unitPriceCents * item.quantity,
    unitPriceCents: item.unitPriceCents, breakfastDay: item.day, historicalSource: item.provenance });
  for (const item of payment.scholarships) add({ kind: "scholarship", quantity: 1, amountCents: item.amountCents,
    label: item.kind === "fund" ? "Scholarship fund" : "Specific scholarship", historicalSource: item.provenance,
    ticketEquivalents: item.priceCents ? item.amountCents / item.priceCents : undefined });
  for (const item of payment.merchandise) add({ kind: "merchandise", quantity: item.quantity, amountCents: item.valueCents,
    label: item.description, fulfillment: item.fulfillment, historicalSource: item.provenance,
    unitPriceCents: item.valueCents % item.quantity === 0 ? item.valueCents / item.quantity : undefined });
  if (payment.shippingCents) add({ kind: "shipping", quantity: 1, amountCents: payment.shippingCents });
  if (payment.checkoutFeeCents) add({ kind: "fee", quantity: 1, amountCents: payment.checkoutFeeCents });
  return lines;
}

function contactKey(person: Required<Person>) {
  return digest([person.email, person.name.normalize("NFC").toLowerCase()]);
}
const yesNo = (value?: boolean): "yes" | "no" | "unanswered" => value === undefined ? "unanswered" : value ? "yes" : "no";
const unknownName = "Purchaser not recorded in source";
const unknownEmail = "unknown@registration-import.invalid";

export async function applyHistoricalImport(
  payload: Payload, manifest: HistoricalImport,
  { sources, req, expectedFingerprint, expectedRows, batchID }: {
    sources: string[]; req: PayloadRequest; expectedFingerprint?: string;
    expectedRows?: { sourceKey: string; fingerprint: string }[]; batchID?: string;
  },
): Promise<HistoricalImportJournal> {
  if (req.transactionID == null) throw new HistoricalImportError("Historical imports require a database transaction.", 503);
  if (!sources.length || new Set(sources).size !== sources.length) throw new HistoricalImportError("Select one or more distinct payments.");
  const approved = new Set(sources);
  const current = await buildPlan(payload, manifest, req, expectedRows ? approved : undefined);
  const previewFingerprints = expectedRows && new Map(expectedRows.map(({ sourceKey, fingerprint }) => [sourceKey, fingerprint]));
  const stale = previewFingerprints
    ? expectedRows?.length !== sources.length || previewFingerprints.size !== sources.length
      || current.rows.some(({ sourceKey, fingerprint }) => previewFingerprints.get(sourceKey) !== fingerprint)
    : current.fingerprint !== expectedFingerprint;
  if (stale) throw new HistoricalImportError("The import preview changed. Upload the file again to review current matches.", 409);
  const eligible = current.rows.filter((row) => approved.has(row.sourceKey) && row.action === "new");
  if (eligible.length !== approved.size) throw new HistoricalImportError("Only new, validated payments can be imported.", 409);
  const journal: HistoricalImportJournal = {
    sources: eligible.map(({ sourceKey }) => sourceKey), created: [],
    counts: { receipts: 0, checkoutOrders: 0, cashTransactions: 0, registrations: 0, namedAttendees: 0, breakfasts: 0, scholarships: 0, merchandise: 0 },
  };
  const options = { overrideAccess: true, depth: 0, req } as const;
  const contacts = new Map<string, string>();
  const track = (collection: string, id: string, sourceKey: string) => journal.created.push({ collection, id, sourceKey });

  async function ensureContact(person: Person | undefined, tag: "purchaser" | "attendee" | "scholarship_recipient") {
    if (!hasIdentity(person)) return undefined;
    const key = contactKey(person);
    const cached = contacts.get(key);
    if (cached) return cached;
    const matches = await payload.find({ ...options, collection: "contacts", pagination: false, where: { email: { equals: person.email } } });
    const named = matches.docs.filter(({ displayName }) => contactKey({ email: person.email, name: displayName }) === key);
    if (named.length > 1) throw new HistoricalImportError("More than one directory contact matches a source identity. Resolve it in Event CRM and preview again.", 409);
    let existing = named[0];
    if (!existing) {
      const sourceKey = `historical-import:contact:${key}`;
      existing = await payload.create({ ...options, collection: "contacts", data: {
        contactKey: sourceKey, email: person.email, displayName: person.name, communicationConsent: "unknown", tags: [tag],
      } });
      track("contacts", existing.id, sourceKey);
    }
    contacts.set(key, existing.id);
    return existing.id;
  }

  for (const payment of manifest.payments) {
    if (!approved.has(payment.sourceKey)) continue;
    const sourceKey = canonicalOrderKey(payment);
    const purchasedAt = payment.purchasedAt;
    const paymentSource = payment.source;
    const paymentStatus = payment.source === "stripe" ? "paid" : "recorded";
    const dataOrigin = "historical_import";
    const purchaseData = {
      currency: payment.currency, stripeFeeCents: payment.stripeFeeCents,
      netDepositedCents: payment.netCents, shippingCents: payment.shippingCents,
      registrationDiscountCents: payment.discountCents, unallocatedCents: payment.unallocatedCents,
      historicalSource: payment.provenance, purchaseLines: purchaseLines(payment),
    };
    const stripeFields = {
      stripeChargeId: payment.stripe?.chargeId, stripeCheckoutSessionId: payment.stripe?.checkoutSessionId,
      stripePaymentIntentId: payment.stripe?.paymentIntentId, stripeCustomerId: payment.stripe?.customerId,
    };
    const receiptReference = payment.cashReference || payment.stripe?.paymentId || stripeAliases(payment)[0] || payment.sourceKey;
    const receipt = await payload.create({ ...options, collection: "historical-receipts", data: {
      ...purchaseData, sourceKey: payment.sourceKey, paymentAliases: claimAliases(payment),
      receiptReference, paymentSource, paymentStatus, grossCents: payment.grossCents,
      checkoutFeeCents: payment.checkoutFeeCents, purchasedAt, paymentMethod: payment.method,
      purchaserName: payment.purchaser?.name, purchaserEmail: payment.purchaser?.email,
    } });
    journal.counts.receipts++;
    track("historical-receipts", receipt.id, payment.sourceKey);
    const productCounts = getCounts(payment);
    journal.counts.merchandise += productCounts.merchandise;
    journal.counts.scholarships += productCounts.scholarships;
    if (!purchasedAt) continue;

    const purchaserName = payment.purchaser?.name || unknownName;
    const purchaserEmail = payment.purchaser?.email || unknownEmail;
    const purchaserContact = await ensureContact(payment.purchaser, "purchaser");
    const breakfast = Object.fromEntries(days.map((day) => [day, payment.breakfasts.filter((item) => item.day === day).reduce((qty, item) => qty + item.quantity, 0)]));
    const firstScholarship = payment.scholarships[0];
    const order = {
      selfRegistration: payment.registrations.some(({ kind }) => kind !== "specific-scholarship"),
      breakfast,
      scholarship: {
        enabled: Boolean(firstScholarship), kind: firstScholarship?.kind === "specific" ? "specific" : "general",
        amountCents: payment.scholarships.reduce((amount, line) => amount + line.amountCents, 0),
      },
      merchandise: payment.merchandise.map((item) => ({
        name: item.description, quantity: item.quantity,
        unitPriceCents: item.valueCents % item.quantity === 0 ? item.valueCents / item.quantity : undefined,
      })),
      fulfillmentMethod: payment.merchandise.map(({ fulfillment }) => fulfillment).find(Boolean),
    };
    const metadata = {
      historicalReceipt: receipt.id, historicalImportBatch: batchID,
      ...(payment.stripe?.paymentId ? { csv_id: payment.stripe.paymentId } : {}),
      self_registration_quantity: String(payment.registrations.filter(({ kind }) => kind !== "specific-scholarship").length),
      necy_scholarship_qty: String(payment.scholarships.length),
    };
    const checkout = await payload.create({ ...options, collection: "checkout-orders",
      context: { checkoutPurchaseDisplayOrder: order }, data: {
        ...purchaseData, ...stripeFields, stripePaymentId: payment.stripe?.paymentId,
        sourceKey, purchaserName, purchaserEmail, purchaserContact, paymentSource, paymentStatus, dataOrigin, purchasedAt,
        paymentSourceType: payment.method, totalCents: payment.grossCents, processingFeeCents: payment.checkoutFeeCents,
        subtotalCents: payment.grossCents - payment.checkoutFeeCents, order, rawMetadata: metadata,
      },
    });
    journal.counts.checkoutOrders++;
    track("checkout-orders", checkout.id, sourceKey);
    let cashTransaction: string | undefined;
    if (paymentSource === "cash") {
      const cash = await payload.create({ ...options, collection: "cash-transactions", data: {
        sourceKey, purchaserName, purchaserEmail, recordedValueCents: payment.grossCents, status: "recorded",
        stripeCustomerId: payment.stripe?.customerId, checkoutOrder: checkout.id,
        cashReference: payment.cashReference, purchasedAt, historicalSource: payment.provenance,
        order, metadata, notificationStatus: "not_required",
      } });
      cashTransaction = cash.id;
      journal.counts.cashTransactions++;
      track("cash-transactions", cash.id, sourceKey);
    }
    await payload.update({ ...options, collection: "historical-receipts", id: receipt.id,
      data: { checkoutOrder: checkout.id, cashTransaction } });

    let registrationNumber = 0;
    let scholarshipNumber = 0;
    const scholarshipAssignments: { seat?: string; contact?: string }[] = [];
    for (const entry of registrationEntries(payment)) {
      const scholarship = entry.kind === "specific-scholarship";
      const ordinal = scholarship ? ++scholarshipNumber : ++registrationNumber;
      const attendeeSourceKey = `${sourceKey}:${scholarship ? "scholarship" : "registration"}:${ordinal}`;
      const seatSourceKey = `${sourceKey}:entitlement:${scholarship ? "specific-scholarship" : "registration"}:${ordinal}`;
      const attendeeContact = await ensureContact(entry, scholarship ? "scholarship_recipient" : "attendee");
      let registration: string | undefined;
      if (attendeeContact && hasIdentity(entry)) {
        const answer = entry.answers;
        const attendee = await payload.create({ ...options, collection: "attendees", data: {
          ...stripeFields, sourceKey: attendeeSourceKey, contact: attendeeContact, checkoutOrder: checkout.id,
          attendeeName: entry.name, attendeeEmail: entry.email, state: answer.state || "Unknown",
          purchaserName, purchaserEmail, registrationPriceCents: entry.unitPriceCents, attendanceStatus: "expected",
          attendanceBasis: scholarship ? "scholarship_recipient" : "self_registration",
          paymentSource, paymentStatus, dataOrigin, purchasedAt, cashTransaction,
          policyAcknowledgments: { status: "pending" },
          homegroup: answer.homegroup, committee: answer.committee, homegroupCommittee: answer.homegroupCommittee,
          fellowships: answer.fellowships, fellowshipOther: answer.fellowshipOther, soberDate: answer.soberDate,
          accommodations: answer.accommodations, interpretationNeeded: answer.interpretationNeeded,
          mobilityAccessibility: answer.mobilityAccessibility, willingToServe: answer.willingToServe,
          interpretationNeededAnswer: yesNo(answer.interpretationNeeded), mobilityAccessibilityAnswer: yesNo(answer.mobilityAccessibility),
          willingToServeAnswer: yesNo(answer.willingToServe), historicalSource: entry.provenance || payment.provenance,
        } });
        registration = attendee.id;
        journal.counts.namedAttendees++;
        track("attendees", attendee.id, attendeeSourceKey);
      }
      const seat = await payload.create({ ...options, collection: "registration-entitlements", data: {
        sourceKey: seatSourceKey, checkoutOrder: checkout.id, purchaserContact,
        entitlementType: scholarship ? "specific_scholarship" : "registration", registration, attendeeContact,
        status: registration ? "assigned" : "unassigned", fundingSource: "direct_checkout", sourceMetadata: metadata,
      } });
      if (registration) await payload.update({ ...options, collection: "attendees", id: registration, data: { entitlement: seat.id } });
      if (scholarship) scholarshipAssignments.push({ seat: seat.id, contact: attendeeContact });
      journal.counts.registrations++;
      track("registration-entitlements", seat.id, seatSourceKey);
    }

    let specificIndex = 0;
    for (const [index, item] of payment.scholarships.entries()) {
      const specific = item.kind === "specific";
      const assignment = specific ? scholarshipAssignments[specificIndex++] : undefined;
      if (!item.priceCents) continue;
      const contributionKey = `${sourceKey}:contribution:${index + 1}`;
      const contribution = await payload.create({ ...options, collection: "scholarship-contributions", data: {
        sourceKey: contributionKey, checkoutOrder: checkout.id, contributorContact: purchaserContact,
        contributionType: specific ? "specific_person_scholarship" : "general_donation",
        amountCents: item.amountCents, allocatedCents: assignment?.seat ? item.amountCents : 0,
        availableCents: assignment?.seat ? 0 : item.amountCents, seatPriceCents: item.priceCents,
        specificRecipientContact: assignment?.contact, fundedEntitlements: assignment?.seat ? [assignment.seat] : [],
        purchasedAt, status: "active", dataOrigin, historicalSource: item.provenance || payment.provenance,
        sourceMetadata: { historicalReceipt: receipt.id },
      } });
      track("scholarship-contributions", contribution.id, contributionKey);
    }
    const breakfastNumber = { friday: 0, saturday: 0, sunday: 0 };
    for (const entry of payment.breakfasts) for (let index = 0; index < entry.quantity; index++) {
      const ordinal = ++breakfastNumber[entry.day];
      const ticketKey = `${sourceKey}:breakfast:${entry.day}:${ordinal}`;
      const ticket = await payload.create({ ...options, collection: "breakfast-tickets", data: {
        ...stripeFields, sourceKey: ticketKey, ticketCode: `BF-${entry.day}-${sourceKey}-${ordinal}`.toUpperCase(),
        breakfastDay: entry.day, unitPriceCents: entry.unitPriceCents, status: "valid", checkoutOrder: checkout.id,
        purchaserName, purchaserEmail, paymentSource, paymentStatus, dataOrigin, purchasedAt, cashTransaction,
        historicalSource: entry.provenance || payment.provenance,
      } });
      journal.counts.breakfasts++;
      track("breakfast-tickets", ticket.id, ticketKey);
    }
  }
  return journal;
}
