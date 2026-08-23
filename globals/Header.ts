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
      type: "row",
      fields: [
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          admin: { description: "Logo displayed in the global public header.", width: "50%" },
        },
        {
          name: "logoAlt",
          label: "Logo alt text",
          type: "text",
          required: true,
          defaultValue: "NECYPAA XXXVI",
          admin: { description: "Describe the logo for visitors using screen readers.", width: "50%" },
        },
      ],
    },
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
        {
          name: "appearance",
          label: "Button appearance",
          type: "select",
          defaultValue: "solid",
          options: [
            { label: "Solid", value: "solid" },
            { label: "Outline", value: "outline" },
          ],
          admin: { condition: (_data, siblingData) => siblingData?.style === "button" },
        },
        { name: "newTab", label: "Open in a new tab", type: "checkbox", defaultValue: false },
        { name: "showWarning", label: "Show leaving-site warning", type: "checkbox", defaultValue: false },
      ],
    },
  ],
};
