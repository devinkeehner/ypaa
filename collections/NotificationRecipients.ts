import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const NotificationRecipients: CollectionConfig = {
  slug: "notification-recipients",
  labels: { singular: "Notification Recipient", plural: "Notification Recipients" },
  access: { create: authenticated, read: authenticated, update: authenticated, delete: authenticated },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "triggers", "active", "updatedAt"],
    description: "Add internal recipients here and select which notification triggers they should receive.",
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true, index: true },
    { name: "name", type: "text" },
    {
      name: "triggers",
      label: "Notification triggers",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["cash_scholarship_requested"],
      options: [
        { label: "Cash scholarship requested", value: "cash_scholarship_requested" },
      ],
      admin: { description: "More triggers can be added here without changing the recipient list." },
    },
    { name: "active", type: "checkbox", required: true, defaultValue: true },
  ],
};
