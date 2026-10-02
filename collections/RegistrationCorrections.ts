import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const RegistrationCorrections: CollectionConfig = {
  slug: "registration-corrections",
  labels: { singular: "Correction", plural: "Correction Log" },
  access: { create: () => false, read: authenticated, update: () => false, delete: () => false },
  admin: {
    useAsTitle: "reason",
    defaultColumns: ["registration", "correctionType", "reason", "changedBy", "changedAt"],
    description: "Immutable audit history for registration and ticket corrections.",
  },
  fields: [
    { name: "registration", type: "relationship", relationTo: "attendees", required: true, index: true },
    { name: "correctionType", type: "select", required: true, options: ["same_person_name_variation", "attendee_reassigned", "contact_details_corrected", "breakfast_holder_reassigned", "other"] },
    { name: "entitlement", type: "relationship", relationTo: "registration-entitlements", index: true },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true },
    { name: "fromContact", type: "relationship", relationTo: "contacts" },
    { name: "toContact", type: "relationship", relationTo: "contacts" },
    { name: "reason", type: "textarea", required: true },
    { name: "changedBy", type: "relationship", relationTo: "users", required: true },
    { name: "changedAt", type: "date", required: true, defaultValue: () => new Date().toISOString(), index: true },
    { name: "before", type: "json", required: true },
    { name: "after", type: "json", required: true },
  ],
};
