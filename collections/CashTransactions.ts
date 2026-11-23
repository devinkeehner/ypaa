import type { CollectionConfig } from "payload";
import { historicalSourceField } from "./fields/historical-import";

export const CashTransactions: CollectionConfig = {
  slug: "cash-transactions",
  admin: {
    useAsTitle: "purchaserName",
    defaultColumns: ["purchaserName", "purchaserEmail", "recordedValueCents", "status", "createdAt"],
    description: "In-person cash orders recorded by the registration site or brought in from the historical tracker.",
  },
  access: { create: ({ req }) => Boolean(req.user), read: ({ req }) => Boolean(req.user), update: ({ req }) => Boolean(req.user), delete: ({ req }) => Boolean(req.user) },
  fields: [
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true },
    { name: "recordedValueCents", type: "number", required: true, min: 0 },
    { name: "status", type: "select", required: true, defaultValue: "recorded", options: ["recorded", "voided"] },
    { name: "stripeCustomerId", type: "text" },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true },
    { name: "cashReference", type: "text", index: true },
    { name: "purchasedAt", type: "date", index: true },
    { name: "accessCode", type: "relationship", relationTo: "access-codes" },
    { name: "sourceKey", type: "text", unique: true, index: true, admin: { readOnly: true } },
    { name: "order", type: "json", required: true },
    { name: "metadata", type: "json", required: true },
    historicalSourceField(true),
    { name: "notificationStatus", label: "Cash scholarship alert status", type: "select", defaultValue: "not_required", options: ["not_required", "sent", "pending_configuration", "failed"], admin: { description: "Delivery status for the internal cash-scholarship alert." } },
  ],
};
