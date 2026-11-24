import type { CollectionConfig } from "payload";
import { canAccessArea } from "@/lib/crm-access";

export const MobileAnnouncements: CollectionConfig = {
  slug: "mobile-announcements",
  admin: { useAsTitle: "title", description: "Published announcements appear in the convention app. Push alerts are sent separately." },
  access: {
    read: ({ req }) => Boolean(req.user) && canAccessArea(req.user, "program"),
    create: ({ req }) => canAccessArea(req.user, "program", true),
    update: ({ req }) => canAccessArea(req.user, "program", true),
    delete: ({ req }) => canAccessArea(req.user, "program", true),
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 120 },
    { name: "message", type: "textarea", required: true, maxLength: 3000 },
    { name: "published", type: "checkbox", defaultValue: false, index: true },
    {
      name: "pushControl",
      type: "ui",
      admin: { components: { Field: "@/components/admin/SendMobileAnnouncement#SendMobileAnnouncement" } },
    },
  ],
};
