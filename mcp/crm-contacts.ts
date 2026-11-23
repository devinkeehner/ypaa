import { createHash } from "node:crypto";
import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { createLocalReq, type PayloadRequest } from "payload";
import { z } from "zod/v3";
import { canEditCRM } from "../lib/crm-access";
import { normalizeAffiliation, validateAffiliation } from "../lib/registration-affiliation";
import type { Contact } from "../payload-types";

type Tool = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>[number];
type DirectoryIdentity = Pick<Contact, "displayName" | "email">;

class ContactError extends Error {}

const line = (max: number) => z.string().trim().min(1).max(max).regex(/^[^\x00-\x1f\x7f]+$/u);
const email = z.string().trim().max(254).email().transform((value) => value.toLowerCase());
const nullableLine = (max: number) => line(max).nullable().optional();
const profileFields = {
  phone: nullableLine(80),
  state: nullableLine(120),
  homegroup: nullableLine(120),
  committee: nullableLine(120),
  fellowships: z.array(z.enum(["aa", "al_anon", "other"])).max(3).optional(),
  fellowshipOther: nullableLine(80),
};
const createInput = z.strictObject({
  displayName: line(200),
  email,
  ...profileFields,
});
const updateInput = z.strictObject({
  id: z.string().regex(/^[a-f0-9]{24}$/i),
  expectedUpdatedAt: z.string().datetime(),
  patch: z.strictObject({
    displayName: line(200).optional(),
    email: email.optional(),
    ...profileFields,
  }).refine((patch) => Object.keys(patch).length > 0),
});

type ProfilePatch = z.infer<typeof updateInput>["patch"];

const comparableName = (name: string) => name.normalize("NFKC").trim().replace(/\s+/gu, " ").toLowerCase();

function identityKey({ email, displayName }: DirectoryIdentity) {
  return JSON.stringify([email.trim().toLowerCase(), comparableName(displayName)]);
}

const hashKey = (identity: DirectoryIdentity, staleOwner?: string) =>
  `mcp-contact:${createHash("sha256").update(JSON.stringify([identityKey(identity), staleOwner])).digest("hex")}`;

async function contactClaim(req: PayloadRequest, identity: DirectoryIdentity) {
  let contactKey = hashKey(identity);
  // Keep old keys stable after identity corrections, while allowing reuse of the old name and email.
  for (let attempt = 0; attempt < 10; attempt++) {
    const { docs: [owner] } = await req.payload.find({
      collection: "contacts", req, overrideAccess: false, depth: 0, limit: 1,
      where: { contactKey: { equals: contactKey } },
      select: { displayName: true, email: true, updatedAt: true },
    });
    if (!owner) return { contactKey };
    if (identityKey(owner) === identityKey(identity)) return { owner };
    contactKey = hashKey(identity, owner.id);
  }
  throw new ContactError("This identity has several former contact records. Review it in the contact directory.");
}

function contactProfile(patch: ProfilePatch, existing?: Contact) {
  if (patch.fellowships === undefined && patch.fellowshipOther === undefined) return patch;
  const affiliation = normalizeAffiliation({
    fellowships: patch.fellowships ?? existing?.fellowships,
    fellowshipOther: patch.fellowshipOther === undefined ? existing?.fellowshipOther : patch.fellowshipOther,
  });
  const error = validateAffiliation(affiliation);
  if (error) throw new ContactError(error);
  if (patch.fellowshipOther && !affiliation.fellowships.includes("other")) {
    throw new ContactError("Select Other before setting an Other fellowship name.");
  }
  return { ...patch, fellowships: affiliation.fellowships, fellowshipOther: affiliation.fellowshipOther || null };
}

async function findExactContacts(req: PayloadRequest, identity: DirectoryIdentity) {
  // The Mongo adapter's case-insensitive search supplies candidates for older emails.
  const { docs, hasNextPage } = await req.payload.find({
    collection: "contacts",
    req,
    overrideAccess: false,
    depth: 0,
    limit: 100,
    select: { displayName: true, email: true, updatedAt: true },
    where: { email: { like: identity.email.trim().toLowerCase() } },
  });
  if (hasNextPage) throw new ContactError("The contact search found too many candidates. Review this identity in the contact directory.");
  const key = identityKey(identity);
  return docs.filter((contact) => identityKey(contact) === key);
}

function result(contact: { id: string; updatedAt: string }, outcome: "created" | "existing" | "updated") {
  return { content: [{ type: "text" as const, text: JSON.stringify({ id: contact.id, updatedAt: contact.updatedAt, outcome }) }] };
}

function requireRegistrationManagement(req: PayloadRequest) {
  if (!canEditCRM(req.user)) throw new ContactError("Registration management permission is required.");
}

const createContact: Tool = {
  name: "create-registration-contact",
  description: "Create a contact directory entry with profile and fellowship fields. An exact normalized name and email match returns the existing contact ID.",
  parameters: createInput.shape as unknown as Tool["parameters"],
  async handler(args, req) {
    requireRegistrationManagement(req);
    const input = createInput.safeParse(args);
    if (!input.success) throw new ContactError("Enter a valid contact name, email address, and profile fields.");
    const { displayName, email, ...patch } = input.data;
    const identity = { displayName, email };
    const data = contactProfile(patch);
    let existing = await findExactContacts(req, identity);
    if (existing.length > 1) throw new ContactError("More than one contact matches this name and email. Review the contact directory.");
    if (existing[0]) return result(existing[0], "existing");

    // A deterministic unique key closes simultaneous creates for the same identity.
    const claim = await contactClaim(req, identity);
    if (claim.owner) return result(claim.owner, "existing");
    try {
      const contact = await req.payload.create({
        collection: "contacts", req, overrideAccess: false, depth: 0,
        data: { ...data, ...identity, contactKey: claim.contactKey, communicationConsent: "unknown" },
      });
      return result(contact, "created");
    } catch {
      existing = await findExactContacts(req, identity);
      if (existing.length === 1) return result(existing[0], "existing");
      throw new ContactError("The contact could not be created. Review the contact directory before retrying.");
    }
  },
};

const updateContact: Tool = {
  name: "update-registration-contact",
  description: "Update a contact profile by record ID and its current updatedAt value. Linked attendee name and email changes go through the registration correction workflow.",
  parameters: updateInput.shape as unknown as Tool["parameters"],
  async handler(args, req) {
    requireRegistrationManagement(req);
    const input = updateInput.safeParse(args);
    if (!input.success) throw new ContactError("Provide the contact ID, current updatedAt timestamp, and one or more allowed profile fields.");
    const { id, expectedUpdatedAt, patch } = input.data;
    const payload = req.payload;
    const transactionReq = await createLocalReq({ user: req.user ?? undefined }, payload);
    const transactionID = await payload.db.beginTransaction();
    if (!transactionID) throw new ContactError("Contact edits require database transaction support.");
    transactionReq.transactionID = transactionID;
    const options = { req: transactionReq, overrideAccess: false, depth: 0 } as const;
    try {
      const current = await payload.findByID({ ...options, collection: "contacts", id, disableErrors: true });
      if (!current) throw new ContactError("Contact was not found.");
      if (Date.parse(current.updatedAt) !== Date.parse(expectedUpdatedAt)) throw new ContactError("This contact changed since you read it. Retrieve the current record before editing.");
      const nextIdentity = { displayName: patch.displayName ?? current.displayName, email: patch.email ?? current.email };
      if (nextIdentity.displayName !== current.displayName || nextIdentity.email !== current.email) {
        const linked = await payload.count({ ...options, collection: "attendees", where: { contact: { equals: id } } });
        if (linked.totalDocs) throw new ContactError("This contact is linked to an attendee. Use the registration correction workflow to change their name or email.");
        const duplicates = await findExactContacts(transactionReq, nextIdentity);
        if (duplicates.some((contact) => contact.id !== id)) throw new ContactError("Another contact already has this name and email.");
      }
      const contact = await payload.update({ ...options, collection: "contacts", id, data: contactProfile(patch, current) });
      await payload.db.commitTransaction(transactionID);
      return result(contact, "updated");
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID);
      if (error instanceof ContactError) throw error;
      throw new ContactError("The contact could not be updated. Retrieve the current record before retrying.");
    }
  },
};

export const crmContactTools = [createContact, updateContact];
