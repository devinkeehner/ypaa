import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const Contacts: CollectionConfig = {
  slug: "contacts",
  labels: { singular: "Contact", plural: "Contacts" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "displayName",
    defaultColumns: ["displayName", "email", "state", "homegroupCommittee"],
    description: "Canonical people directory. Purchases and registrations may point to different contacts.",
  },
  fields: [
    { name: "contactKey", type: "text", required: true, unique: true, index: true, defaultValue: () => `contact:${crypto.randomUUID()}`, admin: { readOnly: true } },
    { name: "displayName", type: "text", required: true, index: true },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text" },
    { name: "state", type: "text" },
    { name: "homegroupCommittee", type: "text" },
    { name: "communicationConsent", type: "select", required: true, defaultValue: "unknown", options: ["unknown", "opted_in", "opted_out"] },
    { name: "tags", type: "select", hasMany: true, options: ["attendee", "purchaser", "scholarship_recipient", "volunteer", "donor", "committee"] },
    { name: "notes", type: "textarea", admin: { description: "Permanent contact notes. Event-specific accommodations remain on the registration." } },
  ],
};
