import type { CollectionConfig } from "payload";
import { crmWrite, canAccessArea } from "@/lib/crm-access";

export const CashCodeRecipients: CollectionConfig = {
  slug: "cash-code-recipients",
  access: {
    create: crmWrite,
    read: ({ req }) => canAccessArea(req.user, "registration"),
    update: crmWrite,
    delete: crmWrite,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "active", "updatedAt"],
    description: "Email addresses approved to request a cash registration access code.",
  },
  fields: [
    { name: "email", type: "email", required: true, unique: true, index: true,
      hooks: { beforeValidate: [({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value] } },
    { name: "active", type: "checkbox", required: true, defaultValue: true },
    { name: "notes", type: "textarea" },
  ],
};
