import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Global footer",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "heading", type: "text", required: true, defaultValue: "See you in Hartford" },
    { name: "text", type: "textarea", defaultValue: "The 36th Northeast Convention of Young People in Alcoholics Anonymous." },
    {
      name: "links",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
        { name: "newTab", label: "Open in a new tab", type: "checkbox", defaultValue: false },
        { name: "showWarning", label: "Show leaving-site warning", type: "checkbox", defaultValue: false },
      ],
    },
    { name: "legal", label: "Copyright / legal text", type: "text", required: true, defaultValue: "NECYPAA XXXVI · Northeast Convention of Young People in Alcoholics Anonymous" },
  ],
};
