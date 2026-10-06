import type { Access, CollectionConfig } from "payload";
import { readCheckoutPurchase, snapshotCheckoutPurchase } from "@/lib/checkout-order-hooks";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const CheckoutOrders: CollectionConfig = {
  slug: "checkout-orders",
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  hooks: { beforeChange: [snapshotCheckoutPurchase], beforeRead: [readCheckoutPurchase] },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["purchaserName", "purchaseSummary", "totalCents", "paymentSource", "paymentStatus", "purchasedAt"],
    description: "One paid checkout record, linked by source key to its attendee, breakfast, and merchandise records.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true, index: true },
    { name: "purchaserContact", type: "relationship", relationTo: "contacts", index: true, admin: { description: "Canonical contact for the original payer." } },
    { name: "purchaseSummary", label: "Purchased", type: "text", virtual: true, admin: { readOnly: true, disableListFilter: true, description: "Categories derived on read; historical records require no backfill." } },
    { name: "purchaseDetails", type: "json", virtual: true, admin: { readOnly: true, disableListColumn: true, components: { Field: "@/components/admin/CheckoutOrderDetails#CheckoutOrderDetails" } } },
    { name: "purchaseSnapshot", type: "json", access: { create: () => false, update: () => false }, admin: { readOnly: true, hidden: true, description: "Derived purchase details captured on creation only. Historical records are not backfilled." } },
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
    { name: "stripeCardId", label: "Stripe card / payment method ID", type: "text", index: true },
    { name: "cardholderName", type: "text", index: true, admin: { description: "Billing name supplied by Stripe. This can differ from the attendee." } },
    { name: "cardBrand", type: "text" },
    { name: "cardLast4", label: "Card last four", type: "text" },
    { name: "cardFingerprint", type: "text", index: true, admin: { description: "Stripe fingerprint used to identify repeated use of the same card." } },
    { name: "paymentSourceType", type: "text" },
    { name: "checkoutLineItemSummary", type: "textarea" },
    { name: "entitlements", type: "join", collection: "registration-entitlements", on: "checkoutOrder", admin: { defaultColumns: ["entitlementType", "status", "attendeeContact"] } },
    { name: "scholarshipContributions", type: "join", collection: "scholarship-contributions", on: "checkoutOrder", admin: { defaultColumns: ["contributionType", "amountCents", "allocatedCents", "availableCents"] } },
    { name: "order", type: "json", required: true },
    { name: "rawMetadata", type: "json" },
    { name: "stripeScholarshipNotifiedEmails", type: "json", admin: { readOnly: true, description: "Recipients already notified of this Stripe general scholarship donation." } },
  ],
};
