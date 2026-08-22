import type { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  label: "Global header",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Logo displayed in the global public header." },
    },
    { name: "logoAlt", type: "text", required: true, defaultValue: "NECYPAA XXXVI" },
    {
      name: "navigation",
      label: "Navigation items",
      type: "array",
      admin: { description: "Link items appear in the primary navigation. Button-style items appear as header actions." },
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
  ],
};
