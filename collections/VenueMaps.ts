import type { Access, CollectionConfig } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);

export const VenueMaps: CollectionConfig = {
  slug: "venue-maps",
  labels: { singular: "Hotel map", plural: "Hotel maps" },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: "published" } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "floor", "status", "displayOrder"],
    description: "Upload a hotel floor plan here. Room markers use the X/Y positions stored on each Room.",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "floor", type: "text", required: true, defaultValue: "Convention level" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "altText", type: "textarea", required: true, defaultValue: "Schematic convention-level hotel map." },
    { name: "description", type: "textarea" },
    { name: "status", type: "select", required: true, defaultValue: "published", index: true, options: ["draft", "published"] },
    { name: "displayOrder", type: "number", required: true, defaultValue: 0 },
  ],
};
