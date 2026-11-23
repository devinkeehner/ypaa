import type { Access, CollectionConfig } from "payload";
import { historicalSourceField } from "./fields/historical-import";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const BreakfastTickets: CollectionConfig = {
  slug: "breakfast-tickets",
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "ticketCode",
    defaultColumns: ["ticketCode", "breakfastDay", "purchaserName", "status", "paymentSource", "purchasedAt"],
    description: "One record per breakfast admission, including Stripe purchases, cash purchases, and Stripe backfills.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "ticketCode", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "breakfastDay", type: "select", required: true, index: true, options: ["friday", "saturday", "sunday"] },
    { name: "status", type: "select", required: true, defaultValue: "valid", options: ["valid", "used", "refunded", "voided"] },
    { name: "unitPriceCents", type: "number", required: true, min: 0, defaultValue: 2500 },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true, index: true },
    { name: "attendee", type: "relationship", relationTo: "attendees" },
    { name: "checkoutOrder", type: "relationship", relationTo: "checkout-orders", index: true },
    { name: "holderContact", label: "Ticket holder", type: "relationship", relationTo: "contacts", index: true, admin: { description: "Who will use this ticket. The purchaser remains unchanged." } },
    { name: "paymentSource", type: "select", required: true, options: ["stripe", "cash", "manual"] },
    { name: "paymentStatus", type: "select", required: true, options: ["paid", "recorded", "refunded", "disputed", "voided"] },
    { name: "dataOrigin", type: "select", required: true, options: ["live_checkout", "stripe_webhook", "stripe_backfill", "cash_checkout", "historical_import"] },
    { name: "purchasedAt", type: "date", required: true, index: true },
    { name: "stripeCheckoutSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "stripeChargeId", type: "text", index: true },
    { name: "stripeCustomerId", type: "text", index: true },
    { name: "cashTransaction", type: "relationship", relationTo: "cash-transactions" },
    historicalSourceField(true),
    { name: "rawMetadata", type: "json" },
  ],
};
