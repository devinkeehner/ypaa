import { createLocalReq, type Payload, type TypedUser, type Where } from "payload";
import { canEditCRM } from "./crm-access";

export class CorrectionError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const idOf = (value: unknown): string => typeof value === "string" || typeof value === "number" ? String(value) : value && typeof value === "object" && "id" in value ? String(value.id) : "";
const clean = (value: unknown): string => typeof value === "string" ? value.trim() : "";

export async function saveCRMCorrection(payload: Payload, user: TypedUser | null, input: Record<string, unknown>) {
  if (!canEditCRM(user)) throw new CorrectionError("Administrator access or registration management permission is required to save corrections.", 403);
  const reason = clean(input.reason);
  if (!reason || reason.length > 4000) throw new CorrectionError("Add a correction note of at most 4,000 characters.");
  if (!["same_person_name_variation", "attendee_reassigned"].includes(String(input.resolution))) throw new CorrectionError("Choose a valid correction type.");
  if (!idOf(input.registrationID) || !idOf(input.entitlementID) || !clean(input.expectedUpdatedAt) || !clean(input.expectedEntitlementUpdatedAt)) throw new CorrectionError("Reload the CRM and select a registration and paid seat.", 409);

  const req = await createLocalReq({ user: user! }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new CorrectionError("Corrections require database transactions. No changes were saved.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: false, depth: 0 } as const;
  try {
    const registration = await payload.findByID({ ...options, collection: "attendees", id: idOf(input.registrationID) });
    const entitlement = await payload.findByID({ ...options, collection: "registration-entitlements", id: idOf(input.entitlementID) });
    if (registration.updatedAt !== input.expectedUpdatedAt || entitlement.updatedAt !== input.expectedEntitlementUpdatedAt) throw new CorrectionError("This record changed since you opened it. Reload before saving.", 409);
    if (idOf(entitlement.registration) !== registration.id) throw new CorrectionError("The selected seat is no longer attached to this registration.", 409);
    if (["refunded", "voided", "redeemed"].includes(entitlement.status)) throw new CorrectionError("This seat is refunded, voided, or already redeemed. Review its status before reassigning it.", 409);
    const order = await payload.findByID({ ...options, collection: "checkout-orders", id: idOf(entitlement.checkoutOrder) });
    const siblings = await payload.find({ ...options, collection: "registration-entitlements", pagination: false, where: { registration: { equals: registration.id } } });
    const split = input.resolution === "attendee_reassigned" && siblings.docs.length > 1;
    const details = input.contact && typeof input.contact === "object" ? input.contact as Record<string, unknown> : {};
    const contactData = { displayName: clean(details.displayName), email: clean(details.email).toLowerCase(), state: clean(details.state), homegroupCommittee: clean(details.homegroupCommittee) };
    const renaming = input.resolution === "same_person_name_variation";
    if (renaming || input.mode === "new") {
      if (!contactData.displayName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) throw new CorrectionError("Enter an attendee name and valid email.");
    }
    let target;
    if (renaming) {
      if (!idOf(registration.contact)) throw new CorrectionError("This registration needs a contact before its name can be corrected.");
      target = await payload.update({ ...options, collection: "contacts", id: idOf(registration.contact), data: contactData });
    } else if (input.mode === "existing" && idOf(input.contactID)) {
      target = await payload.findByID({ ...options, collection: "contacts", id: idOf(input.contactID) });
    } else if (input.mode === "new") {
      const existing = await payload.find({ ...options, collection: "contacts", limit: 1, where: { and: [{ email: { equals: contactData.email } }, { displayName: { equals: contactData.displayName } }] } });
      target = existing.docs[0] || await payload.create({ ...options, collection: "contacts", data: { ...contactData, contactKey: `contact:${crypto.randomUUID()}`, communicationConsent: "unknown", tags: ["attendee"] } });
    } else throw new CorrectionError("Choose an existing contact or create a new one.");
    const before = { contact: idOf(registration.contact), attendeeName: registration.attendeeName, attendeeEmail: registration.attendeeEmail, state: registration.state, homegroupCommittee: registration.homegroupCommittee, entitlement: entitlement.id, registration: registration.id };
    const after = { contact: target.id, attendeeName: target.displayName, attendeeEmail: target.email, state: target.state || registration.state || "Unknown", homegroupCommittee: target.homegroupCommittee || "", canonicalNameConfirmed: renaming };
    let destination = registration;
    if (split) {
      destination = await payload.create({ ...options, collection: "attendees", data: {
        ...after, sourceKey: `correction:${entitlement.id}`, checkoutOrder: order.id, entitlement: entitlement.id,
        purchaserName: order.purchaserName, purchaserEmail: order.purchaserEmail,
        registrationPriceCents: registration.registrationPriceCents, attendanceStatus: "expected",
        attendanceBasis: entitlement.entitlementType === "specific_scholarship" ? "scholarship_recipient" : "self_registration",
        paymentSource: order.paymentSource, paymentStatus: order.paymentStatus, dataOrigin: order.dataOrigin,
        purchasedAt: order.purchasedAt, stripeCheckoutSessionId: order.stripeCheckoutSessionId, stripePaymentIntentId: order.stripePaymentIntentId, stripeChargeId: order.stripeChargeId,
        policyAcknowledgments: { status: "pending" },
      } });
      // Keep the original roster's primary seat pointing to a seat that still belongs to it.
      if (idOf(registration.entitlement) === entitlement.id) {
        const remaining = siblings.docs.find((seat) => seat.id !== entitlement.id)!;
        await payload.update({ ...options, collection: "attendees", id: registration.id, data: { entitlement: remaining.id, checkoutOrder: idOf(remaining.checkoutOrder) } });
      }
    } else {
      destination = await payload.update({ ...options, collection: "attendees", id: registration.id, data: {
        ...after, ...(!renaming ? { policyAcknowledgments: { status: "pending", signatureName: null, signedAt: null, readPolicy: false, understandQuestions: false, acknowledgeBehavior: false, understandAdmission: false, understandReporting: false, understandInvestigation: false, signatureAgreement: false }, attendanceStatus: "expected" as const } : {}),
      } });
    }
    const identifiers: Where[] = [];
    for (const field of ["stripeCheckoutSessionId", "stripePaymentIntentId", "stripeChargeId"] as const) if (order[field]) identifiers.push({ [field]: { equals: order[field] } });
    const ambiguousTickets = siblings.docs.some((seat) => seat.id !== entitlement.id && idOf(seat.checkoutOrder) === order.id);
    const tickets = identifiers.length && !ambiguousTickets ? await payload.find({ ...options, collection: "breakfast-tickets", pagination: false, where: { and: [{ attendee: { equals: registration.id } }, { or: identifiers }] } }) : { docs: [] };
    for (const ticket of tickets.docs) await payload.update({ ...options, collection: "breakfast-tickets", id: ticket.id, data: { attendee: destination.id, holderContact: target.id } });
    await payload.update({ ...options, collection: "registration-entitlements", id: entitlement.id, data: { attendeeContact: target.id, registration: destination.id, status: "assigned", assignedAt: new Date().toISOString(), assignmentNote: reason } });
    // Only this server workflow may create audit records; the actor comes from the session.
    await payload.create({ ...options, overrideAccess: true, collection: "registration-corrections", data: { registration: registration.id, entitlement: entitlement.id, checkoutOrder: order.id, correctionType: renaming ? "same_person_name_variation" : "attendee_reassigned", fromContact: idOf(registration.contact) || undefined, toContact: target.id, reason, changedBy: user!.id, changedAt: new Date().toISOString(), before, after: { ...after, registration: destination.id, split, ticketsMoved: tickets.docs.map((ticket) => ticket.id), ambiguousTickets } } });
    await payload.db.commitTransaction(transactionID);
    return { registrationID: destination.id, split, ticketsMoved: tickets.docs.length, ambiguousTickets };
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  }
}
