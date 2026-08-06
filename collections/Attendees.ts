import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const Attendees: CollectionConfig = {
  slug: "attendees",
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "attendeeName",
    defaultColumns: ["attendeeName", "attendeeEmail", "paymentSource", "paymentStatus", "purchasedAt"],
    description: "Convention registrations from Stripe, cash entry, and historical Stripe backfills.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "attendeeName", type: "text", required: true, index: true },
    { name: "attendeeEmail", type: "email", required: true, index: true },
    { name: "state", type: "text", required: true },
    { name: "homegroupCommittee", type: "text" },
    { name: "accommodations", type: "textarea" },
    { name: "interpretationNeeded", type: "checkbox", defaultValue: false },
    { name: "mobilityAccessibility", type: "checkbox", defaultValue: false },
    { name: "willingToServe", type: "checkbox", defaultValue: false },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true, index: true },
    { name: "registrationPriceCents", type: "number", required: true, min: 0, defaultValue: 4000 },
    { name: "paymentSource", type: "select", required: true, options: ["stripe", "cash"] },
    { name: "paymentStatus", type: "select", required: true, options: ["paid", "recorded", "refunded", "disputed", "voided"] },
    { name: "dataOrigin", type: "select", required: true, options: ["live_checkout", "stripe_webhook", "stripe_backfill", "cash_checkout"] },
    { name: "purchasedAt", type: "date", required: true, index: true },
    { name: "stripeCheckoutSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "stripeChargeId", type: "text", index: true },
    { name: "stripeCustomerId", type: "text", index: true },
    { name: "cashTransaction", type: "relationship", relationTo: "cash-transactions" },
    {
      name: "policyAcknowledgments",
      type: "group",
      fields: [
        { name: "readPolicy", type: "checkbox", defaultValue: false },
        { name: "understandQuestions", type: "checkbox", defaultValue: false },
        { name: "acknowledgeBehavior", type: "checkbox", defaultValue: false },
        { name: "understandAdmission", type: "checkbox", defaultValue: false },
        { name: "understandReporting", type: "checkbox", defaultValue: false },
        { name: "understandInvestigation", type: "checkbox", defaultValue: false },
        { name: "signatureAgreement", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "rawMetadata", type: "json" },
  ],
};
