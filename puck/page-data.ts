import type { ComponentData } from "@puckeditor/core";

import { defaultPageData } from "./default-data";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
} from "./list-values";
import type { NECYPAAData, PageDocument } from "./types";

const COMPONENT_TYPES = new Set([
  "HeroCountdown",
  "About",
  "MeetingInfo",
  "Events",
  "MeetingDirectory",
  "CallToAction",
  "RichText",
  "FreeText",
]);

const STYLE_SUFFIXES = ["Color", "FontSize", "FontWeight", "TextAlign"];

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function cloneDefaultData(): NECYPAAData {
  return JSON.parse(JSON.stringify(defaultPageData)) as NECYPAAData;
}

function normalizeProps(type: string, value: unknown): Record<string, unknown> {
  const props = isRecord(value) ? { ...value } : {};

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

function layoutToContent(layout: unknown): ComponentData<Record<string, unknown>>[] {
  if (!Array.isArray(layout)) return [];

  return layout.flatMap((block, index) => {
    if (!isRecord(block) || typeof block.blockType !== "string") return [];
    if (!COMPONENT_TYPES.has(block.blockType)) return [];
    const { blockType, ...storedProps } = block;
    delete storedProps.blockName;
    const id = typeof block.id === "string" ? block.id : `${blockType}-${index}`;

    const props = normalizeProps(blockType, {
          ...expandTextStyles(storedProps),
          id,
        });

    return [{ type: blockType, props: { ...props, id } } as ComponentData<Record<string, unknown>>];
  });
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
  return {
    root: pageRoot(page),
    content: layoutToContent(page.layout),
    zones: {},
  } as NECYPAAData;
}

export function puckDataToLayout(value: unknown): Array<Record<string, unknown>> {
  const data = normalizePuckData(value);
  return data.content.flatMap((item, index) => {
    if (!COMPONENT_TYPES.has(item.type)) return [];
    const props = isRecord(item.props) ? normalizeProps(item.type, item.props) : {};
    const id = typeof props.id === "string" ? props.id : `${item.type}-${index}`;
    const packed = packTextStyles({ ...props, id });
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
