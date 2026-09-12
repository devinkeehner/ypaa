import type { Access, CollectionConfig } from "payload";

import { sendCashScholarshipAlert, sendPurchaserConfirmation, sendScholarshipNotification, sendStripeScholarshipAlert, sendMerchandiseShippingUpdate, sendMerchandiseOrderAlert } from "@/lib/scholarship-email";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const EmailTests: CollectionConfig = {
  slug: "email-tests",
  labels: { singular: "Email Test", plural: "Email Tests" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "recipientEmail",
    defaultColumns: ["notificationType", "recipientEmail", "deliveryStatus", "createdAt"],
    description: "Create a test to send one real email. Tests never notify the internal recipient list.",
  },
  hooks: {
    beforeChange: [async ({ data, operation }) => {
      if (operation !== "create") return data;
      let deliveryStatus: "sent" | "pending_configuration" | "failed" = "failed";
      let deliveryError = "";
      try {
        deliveryStatus = data.notificationType === "merchandise_order"
          ? await sendMerchandiseOrderAlert({ recipientEmail: data.recipientEmail, purchaserName: "Test purchaser", purchaserEmail: "buyer@example.com", reference: `test-${Date.now()}`, fulfillmentMethod: data.fulfillmentMethod || "shipping", paymentSource: "stripe", items: [{ name: "NECYPAA shirt", quantity: 2, size: "L", color: "Purple" }], shippingAddress: { line1: "123 Example Street", city: "Hartford", state: "CT", postalCode: "06103" } })
          : data.notificationType === "stripe_scholarship_paid"
          ? await sendStripeScholarshipAlert({ recipientEmail: data.recipientEmail, scholarshipAmountCents: Number(data.scholarshipAmountCents || 4000), purchaserName: data.purchaserName || "Test purchaser", reference: `test-${Date.now()}` })
          : data.notificationType === "merchandise_shipped"
          ? await sendMerchandiseShippingUpdate({ recipientEmail: data.recipientEmail, purchaserName: data.purchaserName || "Test purchaser", reference: `test-${Date.now()}`, carrier: "Test carrier", trackingNumber: "TEST123456" })
          : data.notificationType === "cash_scholarship_requested"
          ? await sendCashScholarshipAlert({ recipientEmail: data.recipientEmail, scholarshipAmountCents: Number(data.scholarshipAmountCents || 4000) })
          : data.notificationType === "purchaser_confirmation"
            ? await sendPurchaserConfirmation({ recipientEmail: data.recipientEmail, purchaserName: data.purchaserName || "Test purchaser", paymentMethod: "card", reference: `test-confirmation-${Date.now()}`, totalCents: 6500, items: ["NECYPAA XXXVI Registration", "Breakfast - Saturday"] })
            : await sendScholarshipNotification({ recipientEmail: data.recipientEmail, recipientName: data.recipientName || "Test recipient", purchaserName: data.purchaserName || "Test purchaser" });
      } catch (error) {
        deliveryError = error instanceof Error ? error.message : "The test email could not be sent.";
      }
      return { ...data, deliveryStatus, deliveryError: deliveryError || undefined };
    }],
  },
  fields: [
    {
      name: "notificationType",
      label: "Email to test",
      type: "select",
      required: true,
      defaultValue: "cash_scholarship_requested",
      options: [
        { label: "Cash scholarship requested", value: "cash_scholarship_requested" },
        { label: "Stripe general scholarship fund donation paid", value: "stripe_scholarship_paid" },
        { label: "Merchandise shipped", value: "merchandise_shipped" },
        { label: "Any merchandise order", value: "merchandise_order" },
        { label: "Scholarship reserved for recipient", value: "scholarship_recipient_reserved" },
        { label: "Purchaser order confirmation", value: "purchaser_confirmation" },
      ],
    },
    { name: "recipientEmail", label: "Send test to", type: "email", required: true },
    { name: "fulfillmentMethod", label: "Merchandise delivery", type: "select", defaultValue: "shipping", options: [{ label: "Shipping required", value: "shipping" }, { label: "Receive now", value: "receive_now" }, { label: "Event pickup", value: "event_pickup" }], admin: { condition: (data) => data?.notificationType === "merchandise_order" } },
    { name: "purchaserName", type: "text", defaultValue: "Test purchaser", admin: { condition: (data) => data?.notificationType === "scholarship_recipient_reserved" } },
    { name: "recipientName", type: "text", defaultValue: "Test recipient", admin: { condition: (data) => data?.notificationType === "scholarship_recipient_reserved" } },
    { name: "scholarshipAmountCents", label: "Scholarship amount (cents)", type: "number", min: 1, defaultValue: 4000, admin: { condition: (data) => ["cash_scholarship_requested", "stripe_scholarship_paid"].includes(data?.notificationType) } },
    { name: "deliveryStatus", type: "select", defaultValue: "sending", admin: { readOnly: true }, options: ["sending", "sent", "pending_configuration", "failed"] },
    { name: "deliveryError", type: "textarea", admin: { readOnly: true } },
  ],
};
