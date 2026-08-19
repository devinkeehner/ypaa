import type { CollectionConfig } from "payload";

import { PAGE_LAYOUT_BLOCKS } from "@/blocks/page-blocks";
import { defaultPageData } from "@/puck/default-data";
import { isPuckData, pageLayoutToPuckData, puckDataToLayout } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

function formatSlug(value: unknown) {
  const input = String(value ?? "").trim();

  if (!input) return undefined;

  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const Pages: CollectionConfig = {
  slug: "pages",
  disableBulkDelete: true,
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "Build public pages visually with the NECYPAA section library.",
    components: {
      edit: {
        beforeDocumentControls: ["@/components/admin/DeletePageButton"],
      },
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
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "layout",
              type: "blocks",
              blocks: PAGE_LAYOUT_BLOCKS,
              admin: {
                description:
                  "The same structured sections power the Payload form, visual builder, and public page.",
                initCollapsed: true,
              },
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "meta",
              type: "group",
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "builderData",
      type: "json",
      defaultValue: defaultPageData,
      admin: {
        hidden: true,
        description: "Compatibility mirror for pages created before structured layout blocks were added.",
      },
    },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        const page = doc as PageDocument;
        if ((!Array.isArray(page.layout) || page.layout.length === 0) && page.builderData) {
          page.layout = puckDataToLayout(page.builderData);
        }
        return page;
      },
    ],
    beforeChange: [
      ({ context, data, originalDoc }) => {
        if (context?.puckVisualBuilder === true && isPuckData(data.builderData)) {
          data.layout = puckDataToLayout(data.builderData);
          return data;
        }
        if (Array.isArray(data.layout)) {
          data.builderData = pageLayoutToPuckData({
            ...(originalDoc as PageDocument),
            ...(data as PageDocument),
          });
        }
        return data;
      },
    ],
  },
  versions: {
    drafts: { autosave: { interval: 1000 } },
    maxPerDoc: 30,
  },
};
