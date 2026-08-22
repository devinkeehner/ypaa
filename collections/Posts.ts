import {
  AlignFeature,
  BlockquoteFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  StrikethroughFeature,
  UnderlineFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

function formatSlug(value: unknown, title: unknown) {
  return String(value || title || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || undefined;
}

const postEditor = lexicalEditor({
  features: [
    ParagraphFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4"] }),
    BoldFeature(),
    ItalicFeature(),
    UnderlineFeature(),
    StrikethroughFeature(),
    AlignFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    BlockquoteFeature(),
    LinkFeature(),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
});

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "publishedAt", "_status", "updatedAt"],
    description: "Write news and blog posts directly in Lexical—no page-builder setup required.",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ data, value }) => formatSlug(value, data?.title)] },
    },
    { name: "excerpt", type: "textarea", admin: { description: "A short summary used on the blog index and in search previews." } },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "content",
      type: "richText",
      editor: postEditor,
      required: true,
      admin: { description: "Use headings, lists, links, quotes, alignment, and inline formatting." },
    },
    { name: "publishedAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" }, position: "sidebar" } },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data._status === "published" && !data.publishedAt && !originalDoc?.publishedAt) {
          data.publishedAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
  versions: {
    drafts: { autosave: { interval: 1500 } },
    maxPerDoc: 30,
  },
};
