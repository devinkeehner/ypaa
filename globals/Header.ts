import type { GlobalConfig } from "payload";
import { HEADER_CHILD_LIMIT, validateHeaderChildren, validateNavigationLabel, validateNavigationRows, validateNavigationUrl } from "../lib/header-navigation";

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
      validate: validateNavigationRows,
      admin: { description: "Link items appear in the primary navigation and can have one level of child links. Parent labels always follow their URL; a separate toggle opens the children. Button-style items remain direct header actions." },
      fields: [
        { name: "label", type: "text", required: true, validate: validateNavigationLabel },
        { name: "url", type: "text", required: true, validate: validateNavigationUrl },
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
        {
          name: "children",
          label: "Child links",
          type: "array",
          maxRows: HEADER_CHILD_LIMIT,
          validate: (value, { siblingData }) => validateHeaderChildren(value, siblingData),
          admin: {
            condition: (_data, siblingData) => siblingData?.style !== "button" || Boolean(siblingData?.children?.length),
            description: "Optional: up to 12 child links, shown in a desktop dropdown or an expandable mobile group. No grandchildren. Leave empty to keep a flat link.",
          },
          fields: [
            { name: "label", type: "text", required: true, validate: validateNavigationLabel },
            { name: "url", type: "text", required: true, validate: validateNavigationUrl },
            { name: "newTab", label: "Open in a new tab", type: "checkbox", defaultValue: false },
            { name: "showWarning", label: "Show leaving-site warning", type: "checkbox", defaultValue: false },
          ],
        },
      ],
    },
  ],
};
