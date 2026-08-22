import type { ComponentData } from "@puckeditor/core";

import { defaultPageData } from "./default-data";
import { ctMeetingSchedule } from "./ct-meeting-schedule-data";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
  normalizeScheduleMeetings,
  normalizeUpcomingEvents,
} from "./list-values";
import type { NECYPAAData, PageDocument } from "./types";
import { normalizeLayoutColumns } from "./layout-utils.mjs";
import { campaignAltDefinitions, campaignAltTypes } from "./campaign-alt-definitions";
import { isLexicalValue } from "./lexical-value";
import { lexicalToHTML, stripNativeRichTextForPayload } from "./native-rich-text";
import { AFTER_CONTENT_BLOCK_TYPES, afterContentZoneID, bottomContentZoneID } from "./drop-zones";
import { hydrateExpandedMedia } from "./runtime-data.mjs";

const COMPONENT_TYPES = new Set([
  "HeroCountdown",
  "About",
  "MeetingInfo",
  "Events",
  "MeetingDirectory",
  "CTMeetingSchedule",
  "CallToAction",
  "Image",
  "RichText",
  "FreeText",
  "Text",
  "Button",
  "Icon",
  "Countdown",
  "Section",
  "Column",
  "ButtonRow",
  "IssuesSection",
  "IssueCards",
  "QuoteBlock",
  "ResultsStats",
  "SupporterLogos",
  "ActionTabs",
  "MediaGallery",
  "ContentRow",
  "Row",
  "RowOneColumn",
  "RowTwoColumns",
  "RowLeftWide",
  "RowRightWide",
  "RowThreeColumns",
  "RowFourColumns",
  "ProgramSchedule",
  "Navigation",
  "Headline",
  "Divider",
  "FollowLinks",
  "BulletedList",
  "InlineForm",
  "ImageCaption",
  "Video",
  "Embed",
  "PayPal",
  ...campaignAltTypes,
]);

const NESTED_ZONES: Partial<Record<string, "cards" | "columns" | "tabs">> = {
  IssueCards: "cards",
  ContentRow: "columns",
  Row: "columns",
  RowOneColumn: "columns",
  RowTwoColumns: "columns",
  RowLeftWide: "columns",
  RowRightWide: "columns",
  RowThreeColumns: "columns",
  RowFourColumns: "columns",
  ActionTabs: "tabs",
  ...Object.fromEntries(campaignAltDefinitions.flatMap((definition) => definition.nestedCollection ? [[definition.type, definition.nestedCollection]] : [])),
};
const DIRECT_NESTED_TYPES = new Set(["Section", "Column"]);
const COZY_VERTICAL_PADDING_TYPES = new Set([
  "Section",
  "ContentRow",
  "Row",
  "RowOneColumn",
  "RowTwoColumns",
  "RowLeftWide",
  "RowRightWide",
  "RowThreeColumns",
  "RowFourColumns",
  "IssuesSection",
  "IssueCards",
  "QuoteBlock",
  "ResultsStats",
  "SupporterLogos",
  "ActionTabs",
  "MediaGallery",
]);
const CAMPAIGN_VERTICAL_PADDING_DEFAULTS = new Map(
  campaignAltDefinitions.map((definition) => [
    definition.type,
    definition.palette === "elements" ? "none" : definition.type === "HeroAlt" ? "comfortable" : "cozy",
  ] as const),
);

function payloadBlockType(type: string) {
  if (type.startsWith("Row")) return "ContentRow";
  if (type === "Text") return "FreeText";
  return type;
}

function editorComponentType(type: string) {
  return type === "PayPal" ? "Button" : type;
}

function legacyEditorProps(type: string, value: unknown) {
  const props = isRecord(value) ? value : {};
  if (type !== "PayPal") return props;
  return {
    ...props,
    style: "solid",
    backgroundColor: "var(--tenant-primary, #E85E27)",
    textColor: "var(--tenant-light-text, #F4E8D3)",
  };
}

const STYLE_SUFFIXES = ["Color", "FontSize", "FontWeight", "TextAlign"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDefaultData(): NECYPAAData {
  return JSON.parse(JSON.stringify(defaultPageData)) as NECYPAAData;
}

function normalizeProps(type: string, value: unknown): Record<string, unknown> {
  const props = isRecord(value) ? { ...value } : {};
  if (type === "Button") {
    if (props.style !== "solid" && props.style !== "outline" && props.style !== "text") props.style = "solid";
    if (typeof props.alignment !== "string") props.alignment = "left";
  }
  const defaultVerticalPadding = CAMPAIGN_VERTICAL_PADDING_DEFAULTS.get(type)
    ?? (COZY_VERTICAL_PADDING_TYPES.has(type) ? "cozy" : undefined);

  // Keep the first server render and Puck's client-side default merge identical
  // for pages created before section spacing became an explicit field.
  if (defaultVerticalPadding && typeof props.verticalPadding !== "string") {
    props.verticalPadding = defaultVerticalPadding;
  }

  if (["ContentRow", "Row", "RowOneColumn", "RowTwoColumns", "RowLeftWide", "RowRightWide", "RowThreeColumns", "RowFourColumns"].includes(type)) {
    const layout = typeof props.layout === "string"
      ? props.layout
      : type === "RowOneColumn" ? "one"
        : type === "RowThreeColumns" ? "three"
          : type === "RowFourColumns" ? "four"
            : "two";
    props.columns = normalizeLayoutColumns(layout, props.columns).map((column) => isRecord(column) && !("blocks" in column) ? { ...column, blocks: [] } : column);
  }

  if (DIRECT_NESTED_TYPES.has(type) && !("blocks" in props)) props.blocks = [];
  const nestedCollection = NESTED_ZONES[type];
  if (nestedCollection && Array.isArray(props[nestedCollection])) {
    props[nestedCollection] = props[nestedCollection].map((item) => isRecord(item) && !("blocks" in item) ? { ...item, blocks: [] } : item);
  }
  if (AFTER_CONTENT_BLOCK_TYPES.has(type)) {
    if (!("afterContent" in props)) props.afterContent = [];
    if (!("bottomContent" in props)) props.bottomContent = [];
  }

  if (type === "MeetingInfo") {
    props.importantDates = normalizeImportantDates(props.importantDates);
  }
  if (type === "Events") {
    props.pastEvents = normalizePastEvents(props.pastEvents);
    props.upcomingEvents = normalizeUpcomingEvents(props.upcomingEvents);
  }
  if (type === "MeetingDirectory") {
    props.meetings = normalizeMeetings(props.meetings);
  }
  if (type === "CTMeetingSchedule") {
    const meetings = normalizeScheduleMeetings(props.meetings);
    props.meetings = meetings.length || Array.isArray(props.meetings) ? meetings : ctMeetingSchedule;
  }

  return props;
}

function pageRoot(page: PageDocument, previousRoot?: unknown) {
  const root = isRecord(previousRoot) ? previousRoot : {};
  const previousProps = isRecord(root.props) ? root.props : {};
  const meta = isRecord(page.meta) ? page.meta : {};

  return {
    ...root,
    props: {
      ...previousProps,
      metaDescription:
        typeof meta.description === "string"
          ? meta.description
          : typeof previousProps.metaDescription === "string"
            ? previousProps.metaDescription
            : "",
      metaTitle:
        typeof meta.title === "string"
          ? meta.title
          : typeof previousProps.metaTitle === "string"
            ? previousProps.metaTitle
            : "",
      slug:
        typeof page.slug === "string"
          ? page.slug
          : typeof previousProps.slug === "string"
            ? previousProps.slug
            : "",
      title:
        typeof page.title === "string"
          ? page.title
          : typeof previousProps.title === "string"
            ? previousProps.title
            : "",
    },
  };
}

function expandTextStyles(props: Record<string, unknown>) {
  const textStyles = isRecord(props.textStyles) ? props.textStyles : {};
  const rest = { ...props };
  delete rest.textStyles;
  return { ...rest, ...textStyles };
}

function packTextStyles(props: Record<string, unknown>) {
  const payloadProps: Record<string, unknown> = {};
  const textStyles: Record<string, unknown> = {};

  Object.entries(props).forEach(([key, value]) => {
    if (STYLE_SUFFIXES.some((suffix) => key.endsWith(suffix))) {
      textStyles[key] = value;
    } else if (key !== "puck") {
      payloadProps[key] = value;
    }
  });

  if (Object.keys(textStyles).length) payloadProps.textStyles = textStyles;
  return payloadProps;
}

function mediaID(value: unknown) {
  if (typeof value === "string" || typeof value === "number") return value;
  if (!isRecord(value)) return null;
  return typeof value.id === "string" || typeof value.id === "number" ? value.id : null;
}

function packMedia(type: string, props: Record<string, unknown>) {
  const packed = { ...props };
  if (campaignAltTypes.includes(type as (typeof campaignAltTypes)[number])) {
    packed.media = mediaID(packed.media);
    packed.backgroundMedia = mediaID(packed.backgroundMedia);
    packed.headingLogo = mediaID(packed.headingLogo);
    packed.qrImage = mediaID(packed.qrImage);
    if (Array.isArray(packed.items)) packed.items = packed.items.map((item) => isRecord(item) ? { ...item, image: mediaID(item.image) } : item);
    if (Array.isArray(packed.cards)) packed.cards = packed.cards.map((item) => isRecord(item) ? { ...item, image: mediaID(item.image) } : item);
  }
  if (type === "HeroCountdown") {
    packed.foregroundImage = mediaID(packed.foregroundImage);
    packed.backgroundImage = mediaID(packed.backgroundImage);
    packed.backgroundPosterImage = mediaID(packed.backgroundPosterImage);
    packed.image = mediaID(packed.image);
  }
  if (type === "About" || type === "CallToAction" || type === "Image" || type === "ImageCaption") {
    packed.image = mediaID(packed.image);
  }
  if (type === "Video") packed.video = mediaID(packed.video);
  if (type === "Events") {
    packed.upcomingImage = mediaID(packed.upcomingImage);
    if (Array.isArray(packed.pastEvents)) {
      packed.pastEvents = packed.pastEvents.map((event) =>
        isRecord(event) ? { ...event, image: mediaID(event.image) } : event,
      );
    }
  }
  if (type === "IssueCards" && Array.isArray(packed.cards)) {
    packed.cards = packed.cards.map((card) => isRecord(card) ? { ...card, image: mediaID(card.image) } : card);
  }
  if (type === "QuoteBlock") packed.image = mediaID(packed.image);
  if (type === "SupporterLogos" && Array.isArray(packed.logos)) {
    packed.logos = packed.logos.map((logo) => isRecord(logo) ? { ...logo, image: mediaID(logo.image) } : logo);
  }
  if (type === "MediaGallery" && Array.isArray(packed.items)) {
    packed.items = packed.items.map((item) => isRecord(item) ? { ...item, image: mediaID(item.image) } : item);
  }
  return packed;
}

function materializePuckRichText(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(materializePuckRichText);
  if (!isRecord(value)) return value;

  const next = Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, materializePuckRichText(entry)])) as Record<string, unknown>;
  const storage = isRecord(next.puckRichText) ? next.puckRichText : null;
  if (!storage) return next;

  Object.entries(storage).forEach(([fieldName, entry]) => {
    const richValue = isLexicalValue(entry)
      ? entry
      : isRecord(entry) && entry.enabled === true && isLexicalValue(entry.value)
        ? entry.value
        : null;
    if (!richValue) return;
    next[fieldName] = lexicalToHTML(richValue);
  });
  return next;
}

function zoneID(parentID: string, collection: "cards" | "columns" | "tabs", index: number) {
  return `${parentID}:${collection}.${index}.blocks`;
}

function nestedLayoutToContent(value: unknown): ComponentData<Record<string, unknown>>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.blockType !== "string" || !COMPONENT_TYPES.has(block.blockType)) return [];
    const { blockType, ...storedProps } = block;
    const editorType = editorComponentType(blockType);
    const id = typeof block.id === "string" ? block.id : `${editorType}-nested-${index}`;
    return [{ type: editorType, props: { ...normalizeProps(editorType, legacyEditorProps(blockType, expandTextStyles(storedProps))), id } } as ComponentData<Record<string, unknown>>];
  });
}

function layoutToContent(layout: unknown): { content: ComponentData<Record<string, unknown>>[]; zones: Record<string, ComponentData<Record<string, unknown>>[]> } {
  if (!Array.isArray(layout)) return { content: [], zones: {} };
  const zones: Record<string, ComponentData<Record<string, unknown>>[]> = {};

  const content = layout.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.blockType !== "string") return [];
    if (!COMPONENT_TYPES.has(block.blockType)) return [];
    const { blockType, ...storedProps } = block;
    const editorType = editorComponentType(blockType);
    delete storedProps.blockName;
    const id = typeof block.id === "string" ? block.id : `${blockType}-${index}`;
    if (DIRECT_NESTED_TYPES.has(blockType) && Array.isArray(storedProps.blocks)) {
      storedProps.blocks = nestedLayoutToContent(storedProps.blocks);
    }
    if (AFTER_CONTENT_BLOCK_TYPES.has(blockType) && Array.isArray(storedProps.afterContentBlocks)) {
      zones[afterContentZoneID(id)] = nestedLayoutToContent(storedProps.afterContentBlocks);
      delete storedProps.afterContentBlocks;
    }
    if (AFTER_CONTENT_BLOCK_TYPES.has(blockType) && Array.isArray(storedProps.bottomContentBlocks)) {
      zones[bottomContentZoneID(id)] = nestedLayoutToContent(storedProps.bottomContentBlocks);
      delete storedProps.bottomContentBlocks;
    }
    const nestedCollection = NESTED_ZONES[blockType];
    if (nestedCollection && Array.isArray(storedProps[nestedCollection])) {
      storedProps[nestedCollection] = storedProps[nestedCollection].map((item, nestedIndex) => {
        if (!isRecord(item)) return item;
        const { blocks, ...itemProps } = item;
        const nestedContent = nestedLayoutToContent(blocks);
        zones[zoneID(id, nestedCollection, nestedIndex)] = nestedContent;
        return { ...itemProps, blocks: nestedContent };
      });
    }

    const props = normalizeProps(editorType, {
      ...legacyEditorProps(blockType, expandTextStyles(storedProps)),
      id,
    });

    return [{ type: editorType, props: { ...props, id } } as ComponentData<Record<string, unknown>>];
  });

  return { content, zones };
}

export function isPuckData(value: unknown): value is NECYPAAData {
  return isRecord(value) && Array.isArray(value.content);
}

export function normalizePuckData(value: unknown): NECYPAAData {
  if (!isPuckData(value)) return cloneDefaultData();

  const content = value.content.flatMap((item, index) => {
    if (!isRecord(item) || typeof item.type !== "string" || !COMPONENT_TYPES.has(item.type)) {
      return [];
    }
    const editorType = editorComponentType(item.type);
    const props = normalizeProps(editorType, legacyEditorProps(item.type, item.props));
    const id = typeof props.id === "string" ? props.id : `${editorType}-${index}`;
    return [{ ...item, type: editorType, props: { ...props, id } }];
  });

  const zones = isRecord(value.zones)
    ? Object.fromEntries(Object.entries(value.zones).map(([zone, items]) => [zone, Array.isArray(items) ? items.map((item, index) => {
      if (!isRecord(item) || typeof item.type !== "string" || !COMPONENT_TYPES.has(item.type)) return item;
      const editorType = editorComponentType(item.type);
      const props = normalizeProps(editorType, legacyEditorProps(item.type, item.props));
      const id = typeof props.id === "string" ? props.id : `${editorType}-zone-${index}`;
      return { ...item, type: editorType, props: { ...props, id } };
    }) : items]))
    : {};

  return {
    ...value,
    root: isRecord(value.root) ? value.root : { props: {} },
    content,
    zones,
  } as NECYPAAData;
}

export function pageDocumentToPuckData(page: PageDocument, options: { materializeRichText?: boolean } = {}): NECYPAAData {
  let data: NECYPAAData;
  if (isPuckData(page.builderData)) {
    data = normalizePuckData(page.builderData);
    if (Array.isArray(page.layout) && page.layout.length) {
      data = hydrateExpandedMedia(data, pageLayoutToPuckData(page));
    }
  } else if (Array.isArray(page.layout) && page.layout.length) {
    data = pageLayoutToPuckData(page);
  } else {
    data = cloneDefaultData();
  }

  if (options.materializeRichText) {
    data = normalizePuckData(materializePuckRichText(data));
  }

  return { ...data, root: pageRoot(page, data.root) } as NECYPAAData;
}

export function pageLayoutToPuckData(page: PageDocument): NECYPAAData {
  const converted = layoutToContent(page.layout);
  return {
    root: pageRoot(page),
    content: converted.content,
    zones: converted.zones,
  } as NECYPAAData;
}

function contentToNestedLayout(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!isRecord(item) || typeof item.type !== "string" || !COMPONENT_TYPES.has(item.type)) return [];
    const props = isRecord(item.props) ? normalizeProps(item.type, item.props) : {};
    const id = typeof props.id === "string" ? props.id : `${item.type}-nested-${index}`;
    const materializedProps = materializePuckRichText({ ...props, id }) as Record<string, unknown>;
    const packedProps = stripNativeRichTextForPayload(packMedia(item.type, packTextStyles(materializedProps))) as Record<string, unknown>;
    if (DIRECT_NESTED_TYPES.has(item.type) && Array.isArray(packedProps.blocks)) {
      packedProps.blocks = contentToNestedLayout(packedProps.blocks);
    }
    return [{ ...packedProps, id, blockType: payloadBlockType(item.type) }];
  });
}

function packNestedZones(type: string, id: string, props: Record<string, unknown>, zones: Record<string, unknown>) {
  const collection = NESTED_ZONES[type];
  if (!collection || !Array.isArray(props[collection])) return props;
  return {
    ...props,
    [collection]: props[collection].map((item, index) => isRecord(item)
      ? { ...item, blocks: contentToNestedLayout(Array.isArray(item.blocks) ? item.blocks : zones[zoneID(id, collection, index)]) }
      : item),
  };
}

function packAfterContentZone(type: string, id: string, props: Record<string, unknown>, zones: Record<string, unknown>) {
  if (!AFTER_CONTENT_BLOCK_TYPES.has(type)) return props;

  const packed = { ...props };
  delete packed.afterContent;
  delete packed.bottomContent;
  const zone = zones[afterContentZoneID(id)];
  if (Array.isArray(zone)) {
    packed.afterContentBlocks = contentToNestedLayout(zone);
  }
  const bottomZone = zones[bottomContentZoneID(id)];
  if (Array.isArray(bottomZone)) {
    packed.bottomContentBlocks = contentToNestedLayout(bottomZone);
  }
  return packed;
}

export function puckDataToLayout(value: unknown): Array<Record<string, unknown>> {
  const data = normalizePuckData(value);
  const zones = isRecord(data.zones) ? data.zones : {};
  return data.content.flatMap((item, index) => {
    if (!COMPONENT_TYPES.has(item.type)) return [];
    const props = isRecord(item.props) ? normalizeProps(item.type, item.props) : {};
    const id = typeof props.id === "string" ? props.id : `${item.type}-${index}`;
    const withNested = packAfterContentZone(item.type, id, packNestedZones(item.type, id, { ...props, id }, zones), zones);
    if (DIRECT_NESTED_TYPES.has(item.type) && Array.isArray(withNested.blocks)) {
      withNested.blocks = contentToNestedLayout(withNested.blocks);
    }
    const materializedProps = materializePuckRichText(withNested) as Record<string, unknown>;
    const packed = stripNativeRichTextForPayload(packMedia(item.type, packTextStyles(materializedProps))) as Record<string, unknown>;
    return [{ ...packed, id, blockType: payloadBlockType(item.type) }];
  });
}

function optionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function puckDataToPagePatch(value: unknown, currentPage?: PageDocument | null) {
  const data = normalizePuckData(value);
  const root = isRecord(data.root) && isRecord(data.root.props) ? data.root.props : {};
  const currentMeta = currentPage && isRecord(currentPage.meta) ? currentPage.meta : {};
  const title = optionalText(root.title);
  const slug = optionalText(root.slug);

  return {
    ...(title ? { title } : {}),
    ...(slug ? { slug } : {}),
    builderData: data,
    layout: puckDataToLayout(data),
    meta: {
      ...currentMeta,
      title: optionalText(root.metaTitle),
      description: optionalText(root.metaDescription),
    },
  };
}

export function invalidPuckComponentTypes(value: unknown): string[] {
  if (!isPuckData(value)) return [];
  return Array.from(
    new Set(
      value.content.flatMap((item) =>
        isRecord(item) && typeof item.type === "string" && !COMPONENT_TYPES.has(item.type)
          ? [item.type]
          : [],
      ),
    ),
  );
}
