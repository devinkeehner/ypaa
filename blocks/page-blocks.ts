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

import { campaignAltDefinitions } from "@/puck/campaign-alt-definitions";
import { AFTER_CONTENT_BLOCK_TYPES } from "@/puck/drop-zones";

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
      name: "upcomingEvents",
      type: "array",
      labels: { singular: "More upcoming event", plural: "More upcoming events" },
      fields: [
        { name: "title", type: "text" },
        { name: "date", type: "text" },
      ],
    },
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
        { name: "date", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    textStyles,
  ],
};

export const CTMeetingScheduleBlock: Block = {
  slug: "CTMeetingSchedule",
  labels: { singular: "CT Meeting schedule", plural: "CT Meeting schedules" },
  admin: { group: "Convention sections" },
  fields: [
    { name: "heading", type: "text", defaultValue: "Young People's Meetings in Connecticut" },
    { name: "introduction", type: "textarea", defaultValue: "Click any meeting name for the CT-AA details. Use the arrow to expand the address and meeting types." },
    {
      name: "meetings",
      type: "array",
      labels: { singular: "CT meeting", plural: "CT meetings" },
      fields: [
        { name: "day", type: "text" },
        { name: "time", type: "text" },
        { name: "name", type: "text" },
        { name: "url", type: "text" },
        { name: "location", type: "text" },
        { name: "city", type: "text" },
        { name: "attendance", type: "text" },
        { name: "address", type: "text" },
        { name: "types", type: "text" },
      ],
    },
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

export const TextBlock: Block = { slug: "Text", labels: { singular: "Text", plural: "Text blocks" }, admin: { group: "Flexible content" }, fields: [{ name: "text", type: "textarea" }, { name: "fontSize", type: "text", defaultValue: "1rem" }, { name: "color", type: "text", defaultValue: "#171b20" }, { name: "alignment", type: "select", defaultValue: "left", options: ["left", "center", "right"] }] };
export const ButtonBlock: Block = { slug: "Button", labels: { singular: "Button", plural: "Buttons" }, admin: { group: "Flexible content" }, fields: [{ name: "label", type: "text" }, { name: "url", type: "text" }, { name: "style", type: "select", defaultValue: "solid", options: ["solid", "outline"] }] };
export const CountdownBlock: Block = { slug: "Countdown", labels: { singular: "Countdown", plural: "Countdowns" }, admin: { group: "Flexible content" }, fields: [{ name: "target", type: "text" }, { name: "label", type: "text" }] };

const linkFields = [{ name: "label", type: "text" as const }, { name: "url", type: "text" as const }];

export const NavigationBlock: Block = { slug: "Navigation", labels: { singular: "Navigation", plural: "Navigations" }, admin: { group: "Page blocks" }, fields: [{ name: "brand", type: "text" }, { name: "links", type: "array", fields: linkFields }] };
export const HeadlineBlock: Block = { slug: "Headline", labels: { singular: "Headline", plural: "Headlines" }, admin: { group: "Page blocks" }, fields: [{ name: "text", type: "text" }, { name: "level", type: "select", defaultValue: "h2", options: ["h1", "h2", "h3"] }, { name: "alignment", type: "select", defaultValue: "left", options: ["left", "center", "right"] }] };
export const DividerBlock: Block = { slug: "Divider", labels: { singular: "Divider", plural: "Dividers" }, admin: { group: "Page blocks" }, fields: [{ name: "style", type: "select", defaultValue: "solid", options: ["solid", "dashed", "dotted"] }, { name: "color", type: "text", defaultValue: "#d8d0c4" }] };
export const FollowLinksBlock: Block = { slug: "FollowLinks", labels: { singular: "Follow links", plural: "Follow links" }, admin: { group: "Page blocks" }, fields: [{ name: "heading", type: "text", defaultValue: "Follow along" }, { name: "links", type: "array", fields: linkFields }] };
export const BulletedListBlock: Block = { slug: "BulletedList", labels: { singular: "Bulleted list", plural: "Bulleted lists" }, admin: { group: "Page blocks" }, fields: [{ name: "items", type: "array", fields: [{ name: "text", type: "text" }] }] };
export const InlineFormBlock: Block = { slug: "InlineForm", labels: { singular: "Inline form", plural: "Inline forms" }, admin: { group: "Page blocks" }, fields: [{ name: "heading", type: "text" }, { name: "intro", type: "textarea" }, { name: "submitLabel", type: "text", defaultValue: "Submit" }, { name: "actionUrl", type: "text" }, { name: "fields", type: "array", fields: [{ name: "label", type: "text" }, { name: "name", type: "text" }, { name: "type", type: "select", defaultValue: "text", options: ["text", "email"] }] }] };
export const ImageCaptionBlock: Block = { slug: "ImageCaption", labels: { singular: "Image + caption", plural: "Images + captions" }, admin: { group: "Page blocks" }, fields: [{ name: "image", type: "upload", relationTo: "media", required: true }, { name: "caption", type: "text" }] };
export const VideoBlock: Block = { slug: "Video", labels: { singular: "Video", plural: "Videos" }, admin: { group: "Page blocks" }, fields: [{ name: "video", type: "upload", relationTo: "media" }, { name: "url", type: "text" }, { name: "caption", type: "text" }] };
export const EmbedBlock: Block = { slug: "Embed", labels: { singular: "Embed", plural: "Embeds" }, admin: { group: "Page blocks" }, fields: [{ name: "url", type: "text" }, { name: "title", type: "text" }] };
export const PayPalBlock: Block = { slug: "PayPal", labels: { singular: "PayPal button", plural: "PayPal buttons" }, admin: { group: "Page blocks" }, fields: [{ name: "label", type: "text", defaultValue: "Donate with PayPal" }, { name: "url", type: "text" }, { name: "amount", type: "text" }] };

const nestedElementBlocks: Block[] = [ImageBlock, RichTextBlock, FreeTextBlock, TextBlock, ButtonBlock, CountdownBlock, NavigationBlock, HeadlineBlock, DividerBlock, FollowLinksBlock, BulletedListBlock, InlineFormBlock, ImageCaptionBlock, VideoBlock, EmbedBlock, PayPalBlock];

const afterContentBlocksField: Field = {
  name: "afterContentBlocks",
  type: "blocks",
  blocks: nestedElementBlocks,
  admin: { hidden: true },
};

const bottomContentBlocksField: Field = {
  name: "bottomContentBlocks",
  type: "blocks",
  blocks: nestedElementBlocks,
  admin: { hidden: true },
};

export const SectionBlock: Block = { slug: "Section", labels: { singular: "Section", plural: "Sections" }, admin: { group: "Layout" }, fields: [{ name: "heading", type: "text" }, { name: "background", type: "select", defaultValue: "light", options: ["light", "dark", "muted"] }, { name: "blocks", type: "blocks", blocks: nestedElementBlocks }] };
export const ColumnBlock: Block = { slug: "Column", labels: { singular: "Column", plural: "Columns" }, admin: { group: "Layout" }, fields: [{ name: "label", type: "text" }, { name: "blocks", type: "blocks", blocks: nestedElementBlocks }] };

export const ButtonRowBlock: Block = {
  slug: "ButtonRow",
  labels: { singular: "Button row", plural: "Button rows" },
  admin: { group: "Flexible content" },
  fields: [
    { name: "primaryLabel", type: "text" },
    { name: "primaryUrl", type: "text" },
    { name: "secondaryLabel", type: "text" },
    { name: "secondaryUrl", type: "text" },
    { name: "alignment", type: "select", defaultValue: "left", options: ["left", "center", "right"] },
  ],
};

nestedElementBlocks.push(ButtonRowBlock);

const campaignItemFields: Field[] = [
  { name: "label", type: "text" },
  { name: "heading", type: "text" },
  { name: "text", type: "textarea" },
  { name: "value", type: "text" },
  { name: "linkLabel", type: "text" },
  { name: "url", type: "text" },
  { name: "icon", type: "text" },
  { name: "attribution", type: "text" },
  { name: "role", type: "text" },
  { name: "image", type: "upload", relationTo: "media" },
];

function campaignSourceFields(type: string): Field[] {
  if (type === "HeroAlt") {
    return [
      { name: "headingLogo", type: "upload", relationTo: "media" },
      { name: "highlightTitle", type: "text" },
      { name: "highlightText", type: "textarea" },
      { name: "backgroundOverlay", type: "select", defaultValue: "standard", options: ["none", "off", "subtle", "standard", "strong"] },
      { name: "textPanelColor", type: "select", defaultValue: "primary", options: ["primary", "accent", "foreground", "background", "white"] },
      { name: "textPanelOpacity", type: "select", defaultValue: "translucent", options: ["translucent", "solid"] },
    ];
  }

  if (["AboutAlt", "CardsGridAlt", "PalmCardPointsAlt", "TestimonialAlt", "PalmCardAlt", "PalmCardContactAlt"].includes(type)) {
    const fields: Field[] = [{ name: "intro", type: "textarea" }];
    if (type === "PalmCardAlt") fields.push({ name: "quote", type: "textarea" }, { name: "quoteAttribution", type: "text" });
    if (type === "PalmCardContactAlt") {
      fields.push(
        { name: "electionDay", type: "text" },
        { name: "earlyVote", type: "text" },
        { name: "phone", type: "text" },
        { name: "email", type: "email" },
        { name: "website", type: "text" },
        { name: "qrImage", type: "upload", relationTo: "media" },
        { name: "qrCaption", type: "text" },
        { name: "disclaimer", type: "text" },
      );
    }
    return fields;
  }

  if (type === "PalmCardBioAlt") {
    return [{ name: "quote", type: "textarea" }, { name: "quoteAttribution", type: "text" }];
  }

  return [];
}

function campaignNestedField(collection: "cards" | "columns" | "tabs"): Field {
  return {
    name: collection,
    type: "array",
    labels: { singular: collection === "columns" ? "Column" : collection === "tabs" ? "Tab" : "Card", plural: collection },
    fields: [
      { name: "label", type: "text" },
      { name: "heading", type: "text" },
      { name: "text", type: "textarea" },
      { name: "image", type: "upload", relationTo: "media" },
      { name: "blocks", type: "blocks", blocks: nestedElementBlocks },
    ],
  };
}

function createCampaignAltBlock(definition: (typeof campaignAltDefinitions)[number]): Block {
  return {
    slug: definition.type,
    labels: { singular: definition.label, plural: `${definition.label} blocks` },
    admin: { group: definition.palette === "elements" ? "Campaign elements" : definition.palette === "rows" ? "Campaign rows" : "Campaign sections" },
    fields: [
      { name: "variant", type: "select", defaultValue: definition.variants[0], options: [...definition.variants] },
      ...(definition.presentations ? [{ name: "presentation", type: "select" as const, defaultValue: definition.presentations[0], options: [...definition.presentations] }] : []),
      { name: "eyebrow", type: "text" },
      { name: "heading", type: "textarea" },
      { name: "body", type: "textarea" },
      { name: "media", type: "upload", relationTo: "media" },
      { name: "backgroundMedia", type: "upload", relationTo: "media" },
      { name: "primaryLabel", type: "text" },
      { name: "primaryUrl", type: "text" },
      { name: "secondaryLabel", type: "text" },
      { name: "secondaryUrl", type: "text" },
      { name: "items", type: "array", labels: { singular: "Item", plural: "Items" }, fields: campaignItemFields },
      ...campaignSourceFields(definition.type),
      ...(definition.nestedCollection ? [campaignNestedField(definition.nestedCollection)] : []),
      ...(AFTER_CONTENT_BLOCK_TYPES.has(definition.type) ? [{ name: "enableAfterContent", type: "checkbox" as const, defaultValue: true, admin: { hidden: true } }, afterContentBlocksField, bottomContentBlocksField] : []),
    ],
  };
}

const CAMPAIGN_ALT_ELEMENT_BLOCKS = campaignAltDefinitions.filter((definition) => definition.palette === "elements").map(createCampaignAltBlock);
nestedElementBlocks.push(...CAMPAIGN_ALT_ELEMENT_BLOCKS);

export const CAMPAIGN_ALT_BLOCKS: Block[] = [
  ...CAMPAIGN_ALT_ELEMENT_BLOCKS,
  ...campaignAltDefinitions.filter((definition) => definition.palette !== "elements").map(createCampaignAltBlock),
];

export const IssuesSectionBlock: Block = {
  slug: "IssuesSection",
  labels: { singular: "Issues section", plural: "Issues sections" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "eyebrow", type: "text" },
    { name: "heading", type: "text" },
    { name: "body", type: "textarea" },
    {
      name: "issues",
      type: "array",
      labels: { singular: "Issue", plural: "Issues" },
      fields: [{ name: "title", type: "text" }, { name: "body", type: "textarea" }, { name: "icon", type: "text" }],
    },
  ],
};

export const IssueCardsBlock: Block = {
  slug: "IssueCards",
  labels: { singular: "Issue cards", plural: "Issue card sections" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    { name: "variant", type: "select", defaultValue: "cards", options: ["cards", "editorial", "image"] },
    {
      name: "cards",
      type: "array",
      labels: { singular: "Issue card", plural: "Issue cards" },
      fields: [
        { name: "label", type: "text" },
        { name: "heading", type: "text" },
        { name: "body", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        { name: "linkLabel", type: "text" },
        { name: "linkUrl", type: "text" },
        { name: "blocks", type: "blocks", blocks: nestedElementBlocks },
      ],
    },
  ],
};

export const QuoteBlock: Block = {
  slug: "QuoteBlock",
  labels: { singular: "Quote", plural: "Quotes" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "quote", type: "textarea" },
    { name: "attribution", type: "text" },
    { name: "role", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
  ],
};

export const ResultsStatsBlock: Block = {
  slug: "ResultsStats",
  labels: { singular: "Results stats", plural: "Results stat sections" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Result", plural: "Results" },
      fields: [{ name: "value", type: "text" }, { name: "label", type: "text" }, { name: "detail", type: "textarea" }],
    },
  ],
};

export const SupporterLogosBlock: Block = {
  slug: "SupporterLogos",
  labels: { singular: "Supporter logos", plural: "Supporter logo sections" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    {
      name: "logos",
      type: "array",
      labels: { singular: "Supporter", plural: "Supporters" },
      fields: [{ name: "name", type: "text" }, { name: "image", type: "upload", relationTo: "media" }],
    },
  ],
};

export const ActionTabsBlock: Block = {
  slug: "ActionTabs",
  labels: { singular: "Action tabs", plural: "Action tab sections" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    {
      name: "tabs",
      type: "array",
      labels: { singular: "Action tab", plural: "Action tabs" },
      fields: [
        { name: "label", type: "text" },
        { name: "description", type: "textarea" },
        { name: "blocks", type: "blocks", blocks: nestedElementBlocks },
      ],
    },
  ],
};

export const MediaGalleryBlock: Block = {
  slug: "MediaGallery",
  labels: { singular: "Media gallery", plural: "Media galleries" },
  admin: { group: "Campaign-inspired sections" },
  fields: [
    { name: "heading", type: "text" },
    { name: "intro", type: "textarea" },
    {
      name: "items",
      type: "array",
      labels: { singular: "Gallery item", plural: "Gallery items" },
      fields: [
        { name: "image", type: "upload", relationTo: "media" },
        { name: "caption", type: "text" },
        { name: "size", type: "select", defaultValue: "medium", options: ["small", "medium", "large"] },
      ],
    },
  ],
};

export const ContentRowBlock: Block = {
  slug: "ContentRow",
  labels: { singular: "Content row", plural: "Content rows" },
  admin: { group: "Layout rows" },
  fields: [
    { name: "layout", type: "select", defaultValue: "two", options: ["one", "two", "leftWide", "rightWide", "three", "four"] },
    {
      name: "columns",
      type: "array",
      labels: { singular: "Column", plural: "Columns" },
      fields: [{ name: "label", type: "text" }, { name: "blocks", type: "blocks", blocks: nestedElementBlocks }],
    },
  ],
};

const pageLayoutBlocks: Block[] = [
  HeroCountdownBlock,
  AboutBlock,
  MeetingInfoBlock,
  EventsBlock,
  MeetingDirectoryBlock,
  CTMeetingScheduleBlock,
  CallToActionBlock,
  ImageBlock,
  RichTextBlock,
  FreeTextBlock,
  ButtonRowBlock,
  IssuesSectionBlock,
  IssueCardsBlock,
  QuoteBlock,
  ResultsStatsBlock,
  SupporterLogosBlock,
  ActionTabsBlock,
  MediaGalleryBlock,
  ContentRowBlock,
  ProgramScheduleBlock,
  NavigationBlock,
  TextBlock,
  ButtonBlock,
  CountdownBlock,
  SectionBlock,
  ColumnBlock,
  HeadlineBlock,
  DividerBlock,
  FollowLinksBlock,
  BulletedListBlock,
  InlineFormBlock,
  ImageCaptionBlock,
  VideoBlock,
  EmbedBlock,
  PayPalBlock,
  ...CAMPAIGN_ALT_BLOCKS,
];

type RichTextReadyField = Record<string, unknown> & {
  blocks?: Block[];
  fields?: RichTextReadyField[];
  tabs?: Array<Record<string, unknown> & { fields?: RichTextReadyField[] }>;
};

const puckRichTextStorageField: RichTextReadyField = {
  name: "puckRichText",
  type: "json",
  admin: { hidden: true },
};

function withPuckRichTextStorage(fields: RichTextReadyField[]) {
  return fields.some((field) => field.name === "puckRichText")
    ? fields
    : [...fields, { ...puckRichTextStorageField }];
}

function makePuckRichTextFieldReady(field: unknown): unknown {
  if (!field || typeof field !== "object" || Array.isArray(field)) return field;
  const next = { ...(field as RichTextReadyField) };

  if (Array.isArray(next.fields)) {
    const children = next.fields.map(makePuckRichTextFieldReady) as RichTextReadyField[];
    next.fields = next.type === "array" || next.type === "group"
      ? withPuckRichTextStorage(children)
      : children;
  }

  if (Array.isArray(next.tabs)) {
    next.tabs = next.tabs.map((tab) => ({
      ...tab,
      fields: Array.isArray(tab.fields)
        ? tab.fields.map(makePuckRichTextFieldReady) as RichTextReadyField[]
        : tab.fields,
    }));
  }

  if (Array.isArray(next.blocks)) {
    next.blocks = next.blocks.map(makePuckRichTextReady);
  }

  return next;
}

function makePuckRichTextReady(block: Block): Block {
  const fields = block.fields.map(makePuckRichTextFieldReady) as RichTextReadyField[];
  return { ...block, fields: withPuckRichTextStorage(fields) as Block["fields"] };
}

export const PAGE_LAYOUT_BLOCKS: Block[] = pageLayoutBlocks.map(makePuckRichTextReady);
