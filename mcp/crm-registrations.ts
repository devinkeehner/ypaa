import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { createLocalReq, type PayloadRequest } from "payload";
import { z } from "zod/v3";
import { canEditCRM } from "../lib/crm-access";
import { CorrectionError, saveCRMCorrection } from "../lib/crm-correction";
import { normalizeAffiliation, validateAffiliation } from "../lib/registration-affiliation";

type Tools = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>;
type Parameters = Tools[number]["parameters"];
const id = z.string().regex(/^[a-f0-9]{24}$/i);
const timestamp = z.string().datetime();
const reason = z.string().trim().min(1).max(4000);
const shortText = (length: number) => z.string().trim().min(1).max(length).regex(/^[^\x00-\x1f\x7f]+$/);
const answer = z.enum(["yes", "no", "unanswered"]);
const profile = z.strictObject({
  state: shortText(120).optional(),
  homegroup: shortText(120).nullable().optional(),
  committee: shortText(120).nullable().optional(),
  fellowships: z.array(z.enum(["aa", "al_anon", "other"])).max(3).optional(),
  fellowshipOther: shortText(80).nullable().optional(),
  accommodations: z.string().trim().min(1).max(1000).nullable().optional(),
  interpretationNeededAnswer: answer.optional(),
  mobilityAccessibilityAnswer: answer.optional(),
  willingToServeAnswer: answer.optional(),
});
const createInput = z.strictObject({ contactId: id, profile: profile.optional() });
const editParameters = z.strictObject({
  id,
  expectedUpdatedAt: timestamp,
  profile: profile.optional(),
  pendingContactId: id.optional(),
  reason,
});
const editInput = editParameters.refine(({ profile, pendingContactId }) => Boolean(pendingContactId || (profile && Object.keys(profile).length)));
const correctionInput = z.strictObject({
  registrationId: id,
  entitlementId: id,
  expectedUpdatedAt: timestamp,
  expectedEntitlementUpdatedAt: timestamp,
  reason,
  correction: z.discriminatedUnion("kind", [
    z.strictObject({ kind: z.literal("correct_name_or_email"), displayName: shortText(200), email: z.string().email().max(254) }),
    z.strictObject({ kind: z.literal("reassign_seat"), contactId: id }),
  ]),
});

const result = (data: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(data) }] });
const pendingSourceKey = (contactId: string) => `mcp:pending-registration:${contactId}`;

async function registrationWrite<T>(req: PayloadRequest, work: (localReq: PayloadRequest) => Promise<T>) {
  if (!req.user || !canEditCRM(req.user)) throw new Error("Registration management access is required.");
  const { payload } = req;
  const localReq = await createLocalReq({ user: req.user }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new Error("Registration changes require database transactions.");
  localReq.transactionID = transactionID;
  try {
    const saved = await work(localReq);
    await payload.db.commitTransaction(transactionID);
    return saved;
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw new Error(error instanceof CorrectionError ? error.message : "The registration change could not be saved. Look up the entry and try again.");
  }
}

function profileData(changes: z.infer<typeof profile>, existing: { fellowships?: unknown; fellowshipOther?: unknown } = {}) {
  if (changes.fellowships === undefined && changes.fellowshipOther === undefined) return changes;
  const affiliation = normalizeAffiliation({
    fellowships: changes.fellowships ?? existing.fellowships,
    fellowshipOther: changes.fellowshipOther === undefined ? existing.fellowshipOther : changes.fellowshipOther,
  });
  const validation = validateAffiliation(affiliation);
  if (validation) throw new CorrectionError(validation);
  if (changes.fellowshipOther && !affiliation.fellowships.includes("other")) throw new CorrectionError("Select Other when entering another fellowship name.");
  return { ...changes, fellowships: affiliation.fellowships, fellowshipOther: affiliation.fellowshipOther || null };
}

export const crmRegistrationTools: Tools = [
  {
    name: "create-pending-registration",
    description: "Add a pending manual registration for an existing contact. This roster entry has no paid seat. If an active registration already exists for the contact, return its ID.",
    parameters: createInput.shape as unknown as Parameters,
    async handler(args, req) {
      const input = createInput.parse(args);
      return registrationWrite(req, async (localReq) => {
        const { payload } = req;
        const options = { req: localReq, overrideAccess: false, depth: 0 } as const;
        const contact = await payload.findByID({ ...options, collection: "contacts", id: input.contactId, disableErrors: true });
        if (!contact) throw new CorrectionError("Contact was not found.");
        const { docs } = await payload.find({
          ...options, collection: "attendees", limit: 2,
          where: { contact: { equals: contact.id }, attendanceStatus: { not_equals: "cancelled" } },
          select: { updatedAt: true, paymentStatus: true },
        });
        if (docs.length > 1) throw new CorrectionError("More than one active registration exists for this contact. Review the registrations first.");
        if (docs[0]) return result({ id: docs[0].id, updatedAt: docs[0].updatedAt, paymentStatus: docs[0].paymentStatus, created: false });
        const sourceKey = pendingSourceKey(contact.id);
        const previous = await payload.count({ ...options, collection: "attendees", where: { sourceKey: { equals: sourceKey } } });
        if (previous.totalDocs) throw new CorrectionError("This contact already has a cancelled manual entry. Review it in Event CRM.");
        const record = await payload.create({ ...options, collection: "attendees", data: {
          sourceKey,
          contact: contact.id,
          attendeeName: contact.displayName,
          attendeeEmail: contact.email,
          state: contact.state || "Unknown",
          purchaserName: "Purchaser not recorded",
          purchaserEmail: "unknown@registration-import.invalid",
          dataOrigin: "manual",
          paymentSource: "manual",
          paymentStatus: "pending",
          registrationPriceCents: 0,
          policyAcknowledgments: { status: "pending" },
          purchasedAt: new Date().toISOString(),
          attendanceBasis: "manual_expected",
          attendanceStatus: "expected",
          interpretationNeededAnswer: "unanswered",
          mobilityAccessibilityAnswer: "unanswered",
          willingToServeAnswer: "unanswered",
          ...profileData(input.profile ?? {}, contact),
        } });
        return result({ id: record.id, updatedAt: record.updatedAt, paymentStatus: record.paymentStatus, created: true });
      });
    },
  },
  {
    name: "update-registration-profile",
    description: "Update an attendee's fellowship, accommodations, service answers, or state using the current record timestamp and a correction reason. An unlinked pending manual registration can also be moved to another contact.",
    parameters: editParameters.shape as unknown as Parameters,
    async handler(args, req) {
      const input = editInput.parse(args);
      return registrationWrite(req, async (localReq) => {
        const { payload } = req;
        const options = { req: localReq, overrideAccess: false, depth: 0 } as const;
        const record = await payload.findByID({ ...options, collection: "attendees", id: input.id, disableErrors: true });
        if (!record) throw new CorrectionError("Registration was not found.");
        if (record.updatedAt !== input.expectedUpdatedAt) throw new CorrectionError("This registration changed. Examine it again before updating.");
        let identityChange;
        if (input.pendingContactId) {
          if (record.paymentSource !== "manual" || record.paymentStatus !== "pending" || record.checkoutOrder || record.entitlement ||
            record.attendanceStatus !== "expected" || record.policyAcknowledgments?.status !== "pending") {
            throw new CorrectionError("Only an unlinked pending manual registration can move directly to another contact. Use the paid registration correction for a linked seat.");
          }
          if (!record.sourceKey.startsWith("mcp:pending-registration:")) throw new CorrectionError("Use Event CRM to move this pending entry.");
          if (record.contact === input.pendingContactId) throw new CorrectionError("The pending entry already belongs to that contact.");
          const tickets = await payload.count({ ...options, collection: "breakfast-tickets", where: { attendee: { equals: record.id } } });
          if (tickets.totalDocs) throw new CorrectionError("Resolve the linked breakfast tickets in Event CRM before moving this pending entry.");
          const exists = await payload.count({ ...options, collection: "attendees", where: {
            id: { not_equals: record.id }, contact: { equals: input.pendingContactId }, attendanceStatus: { not_equals: "cancelled" },
          } });
          if (exists.totalDocs) throw new CorrectionError("The target contact already has an active registration.");
          const contact = await payload.findByID({ ...options, collection: "contacts", id: input.pendingContactId, disableErrors: true });
          if (!contact) throw new CorrectionError("Contact was not found.");
          identityChange = {
            contact: contact.id, attendeeName: contact.displayName, attendeeEmail: contact.email, sourceKey: pendingSourceKey(contact.id),
            state: contact.state || "Unknown", homegroup: null, committee: null, homegroupCommittee: null,
            fellowships: [], fellowshipOther: null, soberDate: null, notes: null, accommodations: null, canonicalNameConfirmed: false,
            interpretationNeededAnswer: "unanswered" as const, mobilityAccessibilityAnswer: "unanswered" as const, willingToServeAnswer: "unanswered" as const,
          };
        }
        const change = { ...identityChange, ...profileData(input.profile ?? {}, identityChange ? {} : record) };
        const fields = Object.keys(change);
        const saved = await payload.update({ ...options, collection: "attendees", id: record.id, data: change });
        await payload.create({ ...options, overrideAccess: true, collection: "registration-corrections", data: {
          registration: saved.id,
          correctionType: "contact_details_corrected",
          changedBy: localReq.user!.id,
          changedAt: new Date().toISOString(),
          reason: input.reason,
          before: { updatedAt: record.updatedAt },
          after: { updatedAt: saved.updatedAt, fields },
        } });
        return result({ id: saved.id, updatedAt: saved.updatedAt, fields });
      });
    },
  },
  {
    name: "correct-paid-registration",
    description: "Use the audited CRM workflow to correct a registered person's name or email, or reassign an existing paid seat to another contact. Requires the registration and paid seat timestamps.",
    parameters: correctionInput.shape as unknown as Parameters,
    async handler(args, req) {
      const input = correctionInput.parse(args);
      const identity = input.correction.kind === "correct_name_or_email" ? input.correction : undefined;
      if (!req.user || !canEditCRM(req.user)) throw new Error("Registration management access is required.");
      try {
        return result(await saveCRMCorrection(req.payload, req.user, {
          registrationID: input.registrationId,
          entitlementID: input.entitlementId,
          expectedUpdatedAt: input.expectedUpdatedAt,
          expectedEntitlementUpdatedAt: input.expectedEntitlementUpdatedAt,
          reason: input.reason,
          resolution: identity ? "same_person_name_variation" : "attendee_reassigned",
          mode: "existing",
          contactID: input.correction.kind === "reassign_seat" ? input.correction.contactId : undefined,
          contact: identity && { displayName: identity.displayName, email: identity.email },
        }));
      } catch (error) {
        throw new Error(error instanceof CorrectionError ? error.message : "The registration correction could not be saved. Look up both records and try again.");
      }
    },
  },
];
