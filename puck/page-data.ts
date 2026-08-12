import type { ComponentData } from "@puckeditor/core";

import { defaultPageData } from "./default-data";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
} from "./list-values";
import type { NECYPAAData, PageDocument } from "./types";
import { normalizeLayoutColumns } from "./layout-utils.mjs";

const COMPONENT_TYPES = new Set([
  "HeroCountdown",
  "About",
  "MeetingInfo",
  "Events",
  "MeetingDirectory",
  "CallToAction",
  "Image",
  "RichText",
  "FreeText",
  "Text",
  "Button",
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
]);

const NESTED_ZONES: Partial<Record<string, "cards" | "columns" | "tabs">> = {
  IssueCards: "cards",
  ContentRow: "columns",
  RowOneColumn: "columns",
  RowTwoColumns: "columns",
  RowLeftWide: "columns",
  RowRightWide: "columns",
  RowThreeColumns: "columns",
  RowFourColumns: "columns",
  ActionTabs: "tabs",
};
const DIRECT_NESTED_TYPES = new Set(["Section", "Column"]);

function payloadBlockType(type: string) {
  if (type.startsWith("Row")) return "ContentRow";
  if (type === "Text") return "FreeText";
  return type;
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

  if (["ContentRow", "Row", "RowOneColumn", "RowTwoColumns", "RowLeftWide", "RowRightWide", "RowThreeColumns", "RowFourColumns"].includes(type)) {
    const layout = typeof props.layout === "string"
      ? props.layout
      : type === "RowOneColumn" ? "one"
        : type === "RowThreeColumns" ? "three"
          : type === "RowFourColumns" ? "four"
            : "two";
    props.columns = normalizeLayoutColumns(layout, props.columns);
  }

  if (type === "MeetingInfo") {
    props.importantDates = normalizeImportantDates(props.importantDates);
  }
  if (type === "Events") {
    props.pastEvents = normalizePastEvents(props.pastEvents);
  }
  if (type === "MeetingDirectory") {
    props.meetings = normalizeMeetings(props.meetings);
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

function zoneID(parentID: string, collection: "cards" | "columns" | "tabs", index: number) {
  return `${parentID}:${collection}.${index}.blocks`;
}

function nestedLayoutToContent(value: unknown): ComponentData<Record<string, unknown>>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.blockType !== "string" || !COMPONENT_TYPES.has(block.blockType)) return [];
    const { blockType, ...storedProps } = block;
    const id = typeof block.id === "string" ? block.id : `${blockType}-nested-${index}`;
    return [{ type: blockType, props: { ...normalizeProps(blockType, expandTextStyles(storedProps)), id } } as ComponentData<Record<string, unknown>>];
  });
}

function layoutToContent(layout: unknown): { content: ComponentData<Record<string, unknown>>[]; zones: Record<string, ComponentData<Record<string, unknown>>[]> } {
  if (!Array.isArray(layout)) return { content: [], zones: {} };
  const zones: Record<string, ComponentData<Record<string, unknown>>[]> = {};

  const content = layout.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.blockType !== "string") return [];
    if (!COMPONENT_TYPES.has(block.blockType)) return [];
    const { blockType, ...storedProps } = block;
    delete storedProps.blockName;
    const id = typeof block.id === "string" ? block.id : `${blockType}-${index}`;
    if (DIRECT_NESTED_TYPES.has(blockType) && Array.isArray(storedProps.blocks)) {
      storedProps.blocks = nestedLayoutToContent(storedProps.blocks);
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

    const props = normalizeProps(blockType, {
      ...expandTextStyles(storedProps),
      id,
    });

    return [{ type: blockType, props: { ...props, id } } as ComponentData<Record<string, unknown>>];
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
    const props = normalizeProps(item.type, item.props);
    const id = typeof props.id === "string" ? props.id : `${item.type}-${index}`;
    return [{ ...item, type: item.type, props: { ...props, id } }];
  });

  return {
    ...value,
    root: isRecord(value.root) ? value.root : { props: {} },
    content,
    zones: isRecord(value.zones) ? value.zones : {},
  } as NECYPAAData;
}

export function pageDocumentToPuckData(page: PageDocument): NECYPAAData {
  if (Array.isArray(page.layout) && page.layout.length) {
    return pageLayoutToPuckData(page);
  }

  const data = normalizePuckData(page.builderData);
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
    const packedProps = packMedia(item.type, packTextStyles({ ...props, id }));
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

export function puckDataToLayout(value: unknown): Array<Record<string, unknown>> {
  const data = normalizePuckData(value);
  const zones = isRecord(data.zones) ? data.zones : {};
  return data.content.flatMap((item, index) => {
    if (!COMPONENT_TYPES.has(item.type)) return [];
    const props = isRecord(item.props) ? normalizeProps(item.type, item.props) : {};
    const id = typeof props.id === "string" ? props.id : `${item.type}-${index}`;
    const withNested = packNestedZones(item.type, id, { ...props, id }, zones);
    if (DIRECT_NESTED_TYPES.has(item.type) && Array.isArray(withNested.blocks)) {
      withNested.blocks = contentToNestedLayout(withNested.blocks);
    }
    const packed = packMedia(item.type, packTextStyles(withNested));
    return [{ ...packed, id, blockType: item.type }];
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
