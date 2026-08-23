import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const CheckoutOrders: CollectionConfig = {
  slug: "checkout-orders",
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["purchaserName", "totalCents", "paymentSource", "paymentStatus", "purchasedAt"],
    description: "One paid checkout record, linked by source key to its attendee, breakfast, and merchandise records.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true, index: true },
    { name: "subtotalCents", type: "number", required: true, min: 0 },
    { name: "processingFeeCents", type: "number", required: true, min: 0, defaultValue: 0 },
    { name: "totalCents", type: "number", required: true, min: 0 },
    { name: "paymentSource", type: "select", required: true, options: ["stripe", "cash"] },
    { name: "paymentStatus", type: "select", required: true, options: ["paid", "recorded", "refunded", "disputed", "voided"] },
    { name: "dataOrigin", type: "select", required: true, options: ["live_checkout", "stripe_webhook", "stripe_backfill", "cash_checkout"] },
    { name: "purchasedAt", type: "date", required: true, index: true },
    { name: "stripeCheckoutSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "stripeChargeId", type: "text", index: true },
    { name: "stripeCustomerId", type: "text", index: true },
    { name: "order", type: "json", required: true },
    { name: "rawMetadata", type: "json" },
  ],
};
