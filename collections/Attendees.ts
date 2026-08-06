import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const Attendees: CollectionConfig = {
  slug: "attendees",
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "attendeeName",
    defaultColumns: ["attendeeName", "attendeeEmail", "paymentSource", "paymentStatus", "purchasedAt"],
    description: "The working convention roster: paid registrants, identified scholarship recipients, cash registrations, and manually managed expected attendees.",
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true, defaultValue: () => `manual:${crypto.randomUUID()}`, admin: { readOnly: true } },
    { name: "attendeeName", type: "text", required: true, index: true },
    { name: "attendeeEmail", type: "email", required: true, index: true },
    { name: "state", type: "text", required: true },
    { name: "homegroupCommittee", type: "text" },
    { name: "attendanceStatus", type: "select", required: true, defaultValue: "expected", index: true, options: ["expected", "checked_in", "cancelled"] },
    { name: "attendanceBasis", type: "select", required: true, defaultValue: "manual_expected", options: ["self_registration", "scholarship_recipient", "manual_expected"] },
    {
      type: "collapsible",
      label: "Accessibility and service information",
      admin: { initCollapsed: false },
      fields: [
        { name: "accommodations", type: "textarea" },
        { name: "interpretationNeeded", type: "checkbox", defaultValue: false },
        { name: "mobilityAccessibility", type: "checkbox", defaultValue: false },
        { name: "willingToServe", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true, index: true },
    { name: "registrationPriceCents", type: "number", required: true, min: 0, defaultValue: 0 },
    { name: "paymentSource", type: "select", required: true, defaultValue: "manual", options: ["stripe", "cash", "manual"] },
    { name: "paymentStatus", type: "select", required: true, defaultValue: "pending", options: ["pending", "paid", "recorded", "refunded", "disputed", "voided"] },
    { name: "dataOrigin", type: "select", required: true, defaultValue: "manual", options: ["live_checkout", "stripe_webhook", "stripe_backfill", "cash_checkout", "manual"] },
    { name: "purchasedAt", label: "Registration / roster date", type: "date", required: true, index: true },
    { name: "stripeCheckoutSessionId", type: "text", index: true },
    { name: "stripePaymentIntentId", type: "text", index: true },
    { name: "stripeChargeId", type: "text", index: true },
    { name: "stripeCustomerId", type: "text", index: true },
    { name: "cashTransaction", type: "relationship", relationTo: "cash-transactions" },
    {
      name: "policyAcknowledgments",
      type: "group",
      label: "Non-Discrimination and Anti-Harassment Policy",
      fields: [
        { name: "status", type: "select", required: true, defaultValue: "pending", options: ["pending", "signed", "waived"] },
        { name: "signatureName", type: "text" },
        { name: "signedAt", label: "Signed at (ISO date/time)", type: "text" },
        { name: "readPolicy", type: "checkbox", defaultValue: false },
        { name: "understandQuestions", type: "checkbox", defaultValue: false },
        { name: "acknowledgeBehavior", type: "checkbox", defaultValue: false },
        { name: "understandAdmission", type: "checkbox", defaultValue: false },
        { name: "understandReporting", type: "checkbox", defaultValue: false },
        { name: "understandInvestigation", type: "checkbox", defaultValue: false },
        { name: "signatureAgreement", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "notes", type: "textarea", admin: { description: "Internal roster notes. This field is editable in Payload and is not sent to Stripe." } },
    { name: "rawMetadata", type: "json" },
  ],
};
