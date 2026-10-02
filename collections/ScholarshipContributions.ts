import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const ScholarshipContributions: CollectionConfig = {
  slug: "scholarship-contributions",
  labels: { singular: "Scholarship Contribution", plural: "Scholarship Fund" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: () => false },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["contributionType", "amountCents", "allocatedCents", "availableCents", "contributorContact", "purchasedAt"],
    description: "Auditable money contributed toward scholarships. Original payments stay in Checkout Orders; this ledger shows how their principal funds seats.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", required: true, index: true, admin: { description: "The immutable payment that supplied this contribution." } },
    { name: "contributorContact", type: "relationship", relationTo: "contacts", required: true, index: true },
    { name: "contributionType", type: "select", required: true, index: true, options: [
      { label: "General donation to scholarship pool", value: "general_donation" },
      { label: "General scholarship purchase", value: "general_scholarship" },
      { label: "Specific-person scholarship", value: "specific_person_scholarship" },
    ] },
    { name: "amountCents", label: "Contributed principal (cents)", type: "number", required: true, min: 0 },
    { name: "allocatedCents", label: "Allocated to seats (cents)", type: "number", required: true, min: 0, defaultValue: 0 },
    { name: "availableCents", label: "Unallocated balance (cents)", type: "number", required: true, min: 0, defaultValue: 0 },
    { name: "seatPriceCents", label: "Seat price when contributed (cents)", type: "number", required: true, min: 1, defaultValue: 4000 },
    { name: "specificRecipientContact", type: "relationship", relationTo: "contacts", index: true },
    { name: "fundedEntitlements", type: "relationship", relationTo: "registration-entitlements", hasMany: true, admin: { description: "Seats funded in whole or in part by this contribution. A pooled seat may have multiple contributing payments." } },
    { name: "purchasedAt", type: "date", required: true, index: true },
    { name: "status", type: "select", required: true, defaultValue: "active", index: true, options: ["active", "refunded", "voided"] },
    { name: "notes", type: "textarea" },
    { name: "sourceMetadata", type: "json" },
  ],
};
