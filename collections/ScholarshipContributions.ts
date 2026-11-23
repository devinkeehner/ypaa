import type { Access, CollectionConfig } from "payload";
import { APIError } from "payload";
import { relationship } from "payload/shared";
import { historicalSourceField } from "./fields/historical-import";

const authenticated: Access = ({ req }) => Boolean(req.user);

const requireKnownContributor: typeof relationship = (value, args) => {
  const { dataOrigin } = args.siblingData as { dataOrigin?: string };
  if (!(value === undefined ? args.previousValue : value) && dataOrigin !== "historical_import") {
    return "Select a contributor contact.";
  }
  return relationship(value, args);
};

export const ScholarshipContributions: CollectionConfig = {
  slug: "scholarship-contributions",
  labels: { singular: "Scholarship Contribution", plural: "Scholarship Fund" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: () => false },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["contributionType", "amountCents", "allocatedCents", "availableCents", "contributorContact", "purchasedAt"],
    description: "Auditable scholarship principal, allocations, and available balances linked to the original payment or historical receipt.",
  },
  hooks: { beforeValidate: [({ data, originalDoc }) => {
    const record = { ...originalDoc, ...data };
    const receiptOnly = record.dataOrigin === "historical_import" && record.historicalReceipt;
    if (!receiptOnly && (!record.checkoutOrder || !record.purchasedAt)) {
      throw new APIError("A checkout order and purchase date are required for a scholarship contribution.", 400);
    }
    return data;
  }] },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true, admin: { description: "The original payment that supplied this contribution." } },
    {
      name: "historicalReceipt", type: "relationship", relationTo: "historical-receipts", index: true,
      access: { create: () => false, update: () => false },
      admin: { readOnly: true, description: "Source receipt for a historical contribution, including undated offline entries." },
    },
    {
      name: "contributorContact",
      type: "relationship",
      relationTo: "contacts",
      index: true,
      validate: requireKnownContributor,
    },
    { name: "dataOrigin", type: "select", options: ["historical_import"], access: { create: () => false, update: () => false }, admin: { readOnly: true } },
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
    { name: "purchasedAt", type: "date", index: true },
    { name: "status", type: "select", required: true, defaultValue: "active", index: true, options: ["active", "refunded", "voided"] },
    { name: "notes", type: "textarea" },
    historicalSourceField(true),
    { name: "sourceMetadata", type: "json" },
  ],
};
