import type { CollectionConfig, Validate } from "payload";

const hexColor: Validate<string | null | undefined> = (value) =>
  !value || /^#[0-9a-f]{6}$/i.test(value)
    ? true
    : "Enter a six-digit hex color such as #E85E27.";

const colorField = (name: string, label: string, defaultValue: string) => ({
  name,
  label,
  type: "text" as const,
  required: true,
  defaultValue,
  validate: hexColor,
  admin: {
    description: "Choose a color or paste an exact six-digit hex code.",
    components: { Field: "@/components/admin/HexColorField" },
  },
});

export const Tenants: CollectionConfig = {
  slug: "tenants",
  labels: { singular: "Tenant / site settings", plural: "Tenant / site settings" },
  admin: {
    useAsTitle: "name",
    description: "Branding shared by the homepage, registration, cash entry, merchandise, and cart.",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true, defaultValue: "NECYPAA XXXVI" },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Header logo. Leave blank to use the NECYPAA 36 fallback mark." },
    },
    { name: "logoAlt", type: "text", defaultValue: "NECYPAA XXXVI" },
    {
      name: "headerNavigation",
      label: "Header navigation",
      type: "array",
      admin: { description: "Links shown in the global header. Button-style items appear as header actions." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
        {
          name: "style",
          type: "select",
          defaultValue: "link",
          options: [
            { label: "Navigation link", value: "link" },
            { label: "Button / action", value: "button" },
          ],
        },
        { name: "newTab", label: "Open in a new tab", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "footer",
      type: "group",
      label: "Global footer",
      fields: [
        { name: "heading", type: "text", defaultValue: "See you in Hartford" },
        { name: "text", type: "textarea", defaultValue: "The 36th Northeast Convention of Young People in Alcoholics Anonymous." },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
            { name: "newTab", label: "Open in a new tab", type: "checkbox", defaultValue: false },
          ],
        },
        { name: "legal", label: "Copyright / legal text", type: "text", defaultValue: "NECYPAA XXXVI · Northeast Convention of Young People in Alcoholics Anonymous" },
      ],
    },
    {
      type: "group",
      name: "theme",
      label: "Theme colors",
      fields: [
        colorField("primary", "Primary", "#E85E27"),
        colorField("secondary", "Secondary", "#31275A"),
        colorField("accent", "Accent", "#FFD76A"),
        colorField("background", "Dark background", "#0C0D0E"),
        colorField("surface", "Dark surface", "#15181A"),
        colorField("lightBackground", "Light background", "#F5EEE1"),
        colorField("darkText", "Text on light backgrounds", "#171614"),
        colorField("lightText", "Text on dark backgrounds", "#F4E8D3"),
      ],
    },
  ],
};
