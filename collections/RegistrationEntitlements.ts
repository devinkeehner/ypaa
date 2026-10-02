import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const RegistrationEntitlements: CollectionConfig = {
  slug: "registration-entitlements",
  labels: { singular: "Registration Entitlement", plural: "Registration Entitlements" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: () => false },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["entitlementType", "status", "attendeeContact", "checkoutOrder", "updatedAt"],
    description: "One paid registration or scholarship unit. Connects the immutable checkout and payer to the assigned attendee and roster registration.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true, admin: { description: "The direct checkout for a purchased seat. Pooled donation-funded seats use Funding contributions instead." } },
    { name: "purchaserContact", type: "relationship", relationTo: "contacts", index: true, admin: { description: "The original payer for a directly purchased seat. Pooled seats can have multiple contributors." } },
    { name: "entitlementType", type: "select", required: true, index: true, options: [
      { label: "Registration", value: "registration" },
      { label: "Specific-person scholarship", value: "specific_scholarship" },
      { label: "General scholarship", value: "general_scholarship" },
    ] },
    { name: "status", type: "select", required: true, defaultValue: "unassigned", index: true, options: ["unassigned", "assigned", "redeemed", "refunded", "voided"] },
    { name: "attendeeContact", label: "Assigned attendee", type: "relationship", relationTo: "contacts", index: true },
    { name: "registration", type: "relationship", relationTo: "attendees", index: true },
    { name: "assignedAt", type: "date", index: true },
    { name: "assignmentNote", type: "textarea" },
    { name: "fundingSource", type: "select", required: true, defaultValue: "direct_checkout", index: true, options: [
      { label: "Direct checkout", value: "direct_checkout" },
      { label: "Pooled contributions", value: "pooled_contributions" },
    ] },
    { name: "fundingContributions", type: "relationship", relationTo: "scholarship-contributions", hasMany: true, admin: { description: "Donation or scholarship contributions that funded this seat." } },
    { name: "sourceMetadata", type: "json" },
  ],
};
