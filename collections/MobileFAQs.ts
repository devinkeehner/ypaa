import type { CollectionConfig } from "payload";
import { canAccessArea } from "@/lib/crm-access";

export const MobileFAQs: CollectionConfig = {
  slug: "mobile-faqs",
  labels: { singular: "Mobile FAQ", plural: "Mobile FAQs" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "published", "displayOrder"],
    description: "Publish a new answer or replace one of the answers included in the app.",
  },
  access: {
    read: ({ req }) => Boolean(req.user) && canAccessArea(req.user, "program"),
    create: ({ req }) => canAccessArea(req.user, "program", true),
    update: ({ req }) => canAccessArea(req.user, "program", true),
    delete: ({ req }) => canAccessArea(req.user, "program", true),
  },
  fields: [
    { name: "question", type: "text", required: true, maxLength: 160 },
    { name: "answer", type: "textarea", required: true, maxLength: 4000 },
    {
      name: "replaces",
      type: "select",
      admin: { description: "Leave blank to add a new question. Unpublishing a replacement restores the built-in answer." },
      options: [
        { value: "venue", label: "When and where" },
        { value: "attendance", label: "Who can attend" },
        { value: "registration", label: "Registration" },
        { value: "sessions", label: "Finding and saving sessions" },
        { value: "updates", label: "Schedule changes" },
        { value: "anonymity", label: "Anonymity" },
      ],
    },
    {
      name: "displayOrder",
      type: "number",
      required: true,
      defaultValue: 100,
      admin: { description: "Lower numbers appear first among added questions. Replacements keep the built-in question’s position." },
    },
    { name: "published", type: "checkbox", defaultValue: false, index: true },
  ],
};
