import type { CollectionConfig } from "payload";
import { isAdministrator } from "@/lib/crm-access";
import { REGISTRATION_EVENT, validTrackingSlug } from "@/lib/registration-sources";

export const RegistrationSources: CollectionConfig = {
  slug: "registration-sources",
  admin: { useAsTitle: "name", defaultColumns: ["name", "slug", "active"],
    description: "Tracking links at https://reg.necypaact.com/<slug>. Disable a link to stop new visits; historical attribution is retained." },
  access: {
    read: ({ req }) => isAdministrator(req.user), create: ({ req }) => isAdministrator(req.user),
    update: ({ req }) => isAdministrator(req.user), delete: () => false,
  },
  hooks: { beforeChange: [({ data, originalDoc }) => {
    if (originalDoc && data.slug && data.slug !== originalDoc.slug) throw new Error("Tracking slugs cannot be renamed. Disable this link and create another.");
    return { ...data, event: REGISTRATION_EVENT };
  }] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true,
      validate: (value: unknown) => validTrackingSlug(value) || "Use up to 80 lowercase letters, numbers and single hyphens. Application routes are reserved." },
    { name: "active", type: "checkbox", defaultValue: true },
    { name: "event", type: "text", required: true, defaultValue: REGISTRATION_EVENT, admin: { readOnly: true, hidden: true } },
    { name: "notes", type: "textarea" },
  ],
};
