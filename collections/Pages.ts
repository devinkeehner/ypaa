import type { CollectionConfig } from "payload";

import { defaultPageData } from "@/puck/default-data";

function formatSlug(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "Build public pages visually with the NECYPAA section library.",
    components: {
      views: {
        edit: {
          visual: {
            Component: "@/components/admin/PuckPageBuilderView",
            path: "/visual",
            tab: { href: "/visual", label: "Visual Builder" },
          },
        },
      },
    },
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value }) => formatSlug(value)] },
    },
    {
      name: "builderData",
      type: "json",
      defaultValue: defaultPageData,
      admin: { hidden: true },
    },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
  versions: {
    drafts: { autosave: { interval: 1000 } },
    maxPerDoc: 30,
  },
};
