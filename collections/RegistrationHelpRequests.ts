import type { CollectionConfig } from "payload";
import { crmWrite, canAccessArea } from "@/lib/crm-access";

export const RegistrationHelpRequests: CollectionConfig = {
  slug: "registration-help-requests",
  access: { create: crmWrite, read: ({ req }) => canAccessArea(req.user, "registration"), update: crmWrite, delete: crmWrite },
  admin: { useAsTitle: "name", defaultColumns: ["name", "email", "status", "notificationStatus", "createdAt"], description: "Private registration assistance queue. Pending notifications need staff follow-up. Remove resolved requests according to the committee's retention policy." },
  fields: [
    { name: "requestKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "name", type: "text", required: true, maxLength: 100 },
    { name: "email", type: "email", required: true },
    { name: "details", type: "textarea", required: true, maxLength: 1000 },
    { name: "status", type: "select", required: true, defaultValue: "new", options: ["new", "in_progress", "resolved"] },
    { name: "notificationStatus", type: "select", required: true, defaultValue: "pending", options: ["pending", "sent"], admin: { readOnly: true } },
  ],
};
