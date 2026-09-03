import type { Access, CollectionConfig } from "payload";

import { sendCashScholarshipAlert, sendScholarshipNotification } from "@/lib/scholarship-email";

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
        deliveryStatus = data.notificationType === "cash_scholarship_requested"
          ? await sendCashScholarshipAlert({ recipientEmail: data.recipientEmail, scholarshipAmountCents: Number(data.scholarshipAmountCents || 4000) })
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
        { label: "Scholarship reserved for recipient", value: "scholarship_recipient_reserved" },
      ],
    },
    { name: "recipientEmail", label: "Send test to", type: "email", required: true },
    { name: "purchaserName", type: "text", defaultValue: "Test purchaser", admin: { condition: (data) => data?.notificationType === "scholarship_recipient_reserved" } },
    { name: "recipientName", type: "text", defaultValue: "Test recipient", admin: { condition: (data) => data?.notificationType === "scholarship_recipient_reserved" } },
    { name: "scholarshipAmountCents", label: "Scholarship amount (cents)", type: "number", min: 1, defaultValue: 4000, admin: { condition: (data) => data?.notificationType === "cash_scholarship_requested" } },
    { name: "deliveryStatus", type: "select", defaultValue: "sending", admin: { readOnly: true }, options: ["sending", "sent", "pending_configuration", "failed"] },
    { name: "deliveryError", type: "textarea", admin: { readOnly: true } },
  ],
};
