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
import type { Block, Field } from "payload";

const textStyles: Field = {
  name: "textStyles",
  type: "json",
  admin: { hidden: true },
};

const richTextEditor = lexicalEditor({
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

export const HeroCountdownBlock: Block = {
  slug: "HeroCountdown",
  labels: { singular: "Hero + countdown", plural: "Hero + countdowns" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    { name: "eventDate", type: "text" },
    { name: "eventLocation", type: "text" },
    { name: "countdownTarget", type: "text", admin: { description: "ISO date and time, including timezone." } },
    { name: "registerLabel", type: "text" },
    { name: "registerUrl", type: "text" },
    { name: "hotelLabel", type: "text" },
    { name: "hotelUrl", type: "text" },
    {
      name: "foregroundImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "The transparent artwork layered in front of the hero." },
    },
    {
      name: "backgroundImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional full-bleed image or muted looping video behind the hero." },
    },
    {
      name: "backgroundPosterImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional still image shown while a background video loads and when reduced motion is preferred." },
    },
    {
      name: "backgroundDarkness",
      type: "number",
      defaultValue: 45,
      min: 0,
      max: 100,
      admin: { description: "0 leaves the background untouched; 100 applies the strongest readability overlay." },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { hidden: true },
    },
    textStyles,
  ],
};

export const AboutBlock: Block = {
  slug: "About",
  labels: { singular: "About + advisory", plural: "About + advisory sections" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    { name: "advisoryHeading", type: "text" },
    { name: "advisoryBody", type: "textarea" },
    { name: "image", type: "upload", relationTo: "media" },
    textStyles,
  ],
};

export const MeetingInfoBlock: Block = {
  slug: "MeetingInfo",
  labels: { singular: "Business meeting", plural: "Business meetings" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    { name: "date", type: "text" },
    { name: "time", type: "text" },
    { name: "location", type: "text" },
    { name: "actionLabel", type: "text" },
    { name: "actionUrl", type: "text" },
    {
      name: "importantDates",
      type: "array",
      labels: { singular: "Important date", plural: "Important dates" },
      fields: [
        { name: "date", type: "text" },
        { name: "label", type: "text" },
      ],
    },
    textStyles,
  ],
};

export const EventsBlock: Block = {
  slug: "Events",
  labels: { singular: "Upcoming + past events", plural: "Upcoming + past event sections" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "upcomingLabel", type: "text" },
    { name: "upcomingTitle", type: "text" },
    { name: "upcomingBody", type: "textarea" },
    { name: "upcomingDate", type: "text" },
    { name: "upcomingLocation", type: "text" },
    { name: "upcomingImage", type: "upload", relationTo: "media" },
    {
      name: "pastEvents",
      type: "array",
      labels: { singular: "Past event", plural: "Past events" },
      fields: [
        { name: "title", type: "text" },
        { name: "date", type: "text" },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    textStyles,
  ],
};

export const MeetingDirectoryBlock: Block = {
  slug: "MeetingDirectory",
  labels: { singular: "YPAA directory", plural: "YPAA directories" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    {
      name: "meetings",
      type: "array",
      labels: { singular: "Meeting", plural: "Meetings" },
      fields: [
        { name: "name", type: "text" },
        { name: "location", type: "text" },
      ],
    },
    textStyles,
  ],
};

export const CallToActionBlock: Block = {
  slug: "CallToAction",
  labels: { singular: "Call to action", plural: "Calls to action" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    { name: "primaryLabel", type: "text" },
    { name: "primaryUrl", type: "text" },
    { name: "secondaryLabel", type: "text" },
    { name: "secondaryUrl", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    textStyles,
  ],
};

export const ImageBlock: Block = {
  slug: "Image",
  labels: { singular: "Image", plural: "Images" },
  admin: { group: "Flexible content" },
  fields: [
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "caption", type: "text" },
    {
      name: "aspectRatio",
      type: "select",
      defaultValue: "natural",
      options: ["natural", "landscape", "portrait", "square"],
    },
    {
      name: "width",
      type: "select",
      defaultValue: "wide",
      options: ["full", "wide", "content"],
    },
  ],
};

export const FreeTextBlock: Block = {
  slug: "FreeText",
  labels: { singular: "Free text", plural: "Free text sections" },
  admin: { group: "Flexible content" },
  fields: [
    { name: "text", type: "textarea" },
    { name: "fontSize", type: "text", defaultValue: "1rem" },
    { name: "color", type: "text", defaultValue: "#171b20" },
    {
      name: "fontWeight",
      type: "select",
      defaultValue: "400",
      options: [
        { label: "Regular", value: "400" },
        { label: "Bold", value: "700" },
      ],
    },
    {
      name: "alignment",
      type: "select",
      defaultValue: "left",
      options: ["left", "center", "right"],
    },
  ],
};

export const RichTextBlock: Block = {
  slug: "RichText",
  labels: { singular: "Rich text", plural: "Rich text sections" },
  admin: { group: "Flexible content" },
  fields: [
    {
      name: "content",
      type: "richText",
      editor: richTextEditor,
      admin: { description: "Headings, links, lists, quotes, alignment, and inline formatting." },
    },
    { name: "fontSize", type: "text", defaultValue: "1rem" },
    { name: "color", type: "text", defaultValue: "#171b20" },
    {
      name: "fontWeight",
      type: "select",
      defaultValue: "400",
      options: [
        { label: "Regular", value: "400" },
        { label: "Bold", value: "700" },
      ],
    },
    {
      name: "alignment",
      type: "select",
      defaultValue: "left",
      options: ["left", "center", "right"],
    },
  ],
};

export const ProgramScheduleBlock: Block = {
  slug: "ProgramSchedule",
  labels: { singular: "Live program", plural: "Live program blocks" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "heading", type: "text", defaultValue: "Your weekend, mapped out" },
    { name: "introduction", type: "textarea", defaultValue: "Search the live convention schedule by day, room, or session type." },
  ],
};

export const PAGE_LAYOUT_BLOCKS: Block[] = [
  HeroCountdownBlock,
  AboutBlock,
  MeetingInfoBlock,
  EventsBlock,
  MeetingDirectoryBlock,
  CallToActionBlock,
  ImageBlock,
  RichTextBlock,
  FreeTextBlock,
  ProgramScheduleBlock,
];
