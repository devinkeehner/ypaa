import type { CollectionConfig } from "payload";

function formatSlug(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const Merchandise: CollectionConfig = {
  slug: "merchandise",
  labels: { singular: "Merchandise item", plural: "Merchandise" },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "featured", "_status", "updatedAt"],
    description: "Each entry is one sellable item and appears as one card in the merchandise portal.",
  },
  fields: [
    { name: "name", type: "text", required: true, index: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Used in links. Example: escaping-the-mad-realm" },
      hooks: { beforeValidate: [({ value, siblingData }) => formatSlug(value || siblingData?.name)] },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Main product image shown in the merchandise portal." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
      admin: { description: "A short description of the design. This text is searchable." },
    },
    {
      name: "type",
      type: "select",
      required: true,
      index: true,
      options: [
        { label: "T-shirt", value: "t-shirt" },
        { label: "Long-sleeve shirt", value: "long-sleeve" },
        { label: "Hoodie", value: "hoodie" },
        { label: "Crewneck sweatshirt", value: "crewneck" },
        { label: "Hat", value: "hat" },
        { label: "Sticker", value: "sticker" },
        { label: "Pin", value: "pin" },
        { label: "Tote bag", value: "tote" },
        { label: "Mug", value: "mug" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
      admin: { description: "Price in dollars." },
    },
    {
      name: "sizes",
      type: "text",
      admin: { description: "Optional. Example: S–3XL or One size." },
    },
    {
      name: "available",
      type: "checkbox",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "searchTerms",
      type: "text",
      admin: { description: "Optional comma-separated keywords visitors might search for." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar" },
    },
  ],
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
};
