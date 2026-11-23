import type { CollectionConfig } from "payload";
import { isAdministrator } from "../lib/crm-access";
import { historicalSourceField, purchaseLinesField } from "./fields/historical-import";

export const HistoricalReceipts: CollectionConfig = {
  slug: "historical-receipts",
  labels: { singular: "Historical Receipt", plural: "Historical Receipts" },
  access: {
    read: ({ req }) => isAdministrator(req.user),
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: "receiptReference",
    defaultColumns: ["receiptReference", "paymentSource", "grossCents", "paymentStatus", "purchasedAt", "checkoutOrder"],
    description: "Imported payment provenance and offline receipts. Linked records refer to the same payment.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true },
    { name: "paymentAliases", type: "text", hasMany: true, required: true, minRows: 1, unique: true, index: true, admin: { readOnly: true } },
    { name: "receiptReference", type: "text", required: true },
    { name: "paymentSource", type: "select", required: true, options: ["stripe", "cash", "manual"] },
    { name: "paymentMethod", type: "select", options: ["cash", "venmo", "unspecified", "offline"] },
    { name: "paymentStatus", type: "select", required: true, options: ["paid", "recorded", "refunded", "disputed", "voided"] },
    { name: "purchasedAt", type: "date", index: true },
    { name: "currency", type: "select", required: true, options: ["USD"] },
    { name: "grossCents", type: "number", min: 0, required: true },
    { name: "stripeFeeCents", label: "Stripe fee (cents)", type: "number", min: 0 },
    { name: "netDepositedCents", type: "number" },
    { name: "shippingCents", type: "number", min: 0 },
    { name: "registrationDiscountCents", type: "number", min: 0 },
    { name: "unallocatedCents", label: "Unallocated payment amount (cents)", type: "number" },
    { name: "checkoutFeeCents", type: "number", min: 0 },
    { name: "purchaserName", type: "text" },
    { name: "purchaserEmail", type: "email" },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true },
    { name: "cashTransaction", type: "relationship", relationTo: "cash-transactions", index: true },
    historicalSourceField(true),
    purchaseLinesField(),
  ],
};
