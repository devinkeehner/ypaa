import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const Rooms: CollectionConfig = {
  slug: "rooms",
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "shortLabel", "floor", "capacity", "displayOrder"],
    description: "Convention rooms used by the public program and visual planning board.",
  },
  defaultSort: "displayOrder",
  fields: [
    { name: "name", type: "text", required: true, unique: true, index: true },
    { name: "shortLabel", type: "text", required: true },
    { name: "floor", type: "text", defaultValue: "Convention level" },
    { name: "capacity", type: "number", min: 0 },
    { name: "accessible", type: "checkbox", defaultValue: true },
    { name: "directions", type: "textarea" },
    { name: "displayOrder", type: "number", required: true, defaultValue: 0, index: true },
    {
      type: "row",
      fields: [
        { name: "mapX", label: "Map position X (%)", type: "number", min: 0, max: 100 },
        { name: "mapY", label: "Map position Y (%)", type: "number", min: 0, max: 100 },
      ],
    },
    { name: "color", type: "text", defaultValue: "#E85E27", admin: { description: "Six-digit hex color used on the planning board." } },
    { name: "notes", type: "textarea", access: { read: authenticated, create: authenticated, update: authenticated }, admin: { description: "Internal notes; never displayed publicly." } },
  ],
};
