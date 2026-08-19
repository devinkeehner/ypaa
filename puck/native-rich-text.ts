import { isLexicalValue, type LexicalBlockType } from "./lexical-value";

export type NativeRichTextField = {
  arrayFields?: Record<string, NativeRichTextField>;
  label?: unknown;
  objectFields?: Record<string, NativeRichTextField>;
  richTextBlockType?: LexicalBlockType;
  richTextDefault?: string;
  type?: string;
};

const HTML_TAG = /<\/?[a-z][\s\S]*>/i;
const COLOR_STYLE = /(?:^|;)\s*color\s*:\s*(#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|rgba?\([^)]*\)|hsla?\([^)]*\))\s*(?:;|$)/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function escapeHTML(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function alignmentStyle(value: unknown) {
  const numeric = typeof value === "number" ? { 1: "left", 2: "center", 3: "right", 4: "justify", 5: "start", 6: "end" }[value] : undefined;
  const alignment = typeof value === "string" ? value : numeric;
  return ["left", "center", "right", "justify", "start", "end"].includes(alignment || "")
    ? ` style="text-align: ${alignment}"`
    : "";
}

function lexicalChildren(node: Record<string, unknown>) {
  return Array.isArray(node.children) ? node.children : [];
}

function lexicalNodeToHTML(value: unknown): string {
  if (!isRecord(value)) return "";
  const type = typeof value.type === "string" ? value.type : "";
  const children = lexicalChildren(value).map(lexicalNodeToHTML).join("");

  if (type === "root") return children;
  if (type === "linebreak") return "<br>";
  if (type === "horizontalrule") return "<hr>";
  if (type === "text") {
    let text = escapeHTML(value.text);
    const format = typeof value.format === "number" ? value.format : 0;
    if (format & 16) text = `<code>${text}</code>`;
    if (format & 1) text = `<strong>${text}</strong>`;
    if (format & 2) text = `<em>${text}</em>`;
    if (format & 8) text = `<u>${text}</u>`;
    if (format & 4) text = `<s>${text}</s>`;
    if (format & 32) text = `<sub>${text}</sub>`;
    if (format & 64) text = `<sup>${text}</sup>`;
    const color = typeof value.style === "string" ? value.style.match(COLOR_STYLE)?.[1] : undefined;
    return color ? `<span style="color: ${escapeHTML(color)}">${text}</span>` : text;
  }

  if (type === "heading") {
    const tag = typeof value.tag === "string" && /^h[1-6]$/.test(value.tag) ? value.tag : "h2";
    return `<${tag}${alignmentStyle(value.format)}>${children}</${tag}>`;
  }
  if (type === "quote") return `<blockquote${alignmentStyle(value.format)}>${children}</blockquote>`;
  if (type === "paragraph") return `<p${alignmentStyle(value.format)}>${children}</p>`;
  if (type === "list") {
    const tag = value.tag === "ol" || value.listType === "number" ? "ol" : "ul";
    const start = tag === "ol" && typeof value.start === "number" && value.start > 1 ? ` start="${value.start}"` : "";
    return `<${tag}${start}>${children}</${tag}>`;
  }
  if (type === "listitem") return `<li>${children}</li>`;
  if (type === "link" || type === "autolink") {
    const fields = isRecord(value.fields) ? value.fields : {};
    const href = typeof value.url === "string" ? value.url : typeof fields.url === "string" ? fields.url : "#";
    const target = value.target === "_blank" || fields.newTab === true ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${escapeHTML(href)}"${target}>${children}</a>`;
  }
  return children;
}

export function lexicalToHTML(value: unknown) {
  return isLexicalValue(value) ? lexicalNodeToHTML(value.root) : "";
}

function decodeHTMLEntities(value: string) {
  const named: Record<string, string> = { amp: "&", apos: "'", gt: ">", lt: "<", nbsp: " ", quot: '"' };
  return value.replace(/&(#x?[\da-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const hexadecimal = entity[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

export function richTextToPlainText(value: unknown) {
  if (typeof value !== "string") return "";
  if (!HTML_TAG.test(value)) return value;
  return decodeHTMLEntities(
    value
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/(?:blockquote|div|h[1-6]|li|ol|p|pre|ul)>/gi, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function defaultNativeRichTextBlockType(
  componentType: string,
  fieldName: string,
  path: Array<number | string>,
  configuredType?: LexicalBlockType,
): LexicalBlockType {
  if (configuredType) return configuredType;
  const name = fieldName.toLowerCase();
  if (["HeroCountdown", "HeroAlt"].includes(componentType) && name === "heading") return "h1";
  if (componentType === "QuoteBlock" && name === "heading") return "paragraph";
  if (componentType === "Headline" && name === "text") return "h2";
  if (name === "quote") return "quote";
  if (name === "value" && componentType === "ResultsStats") return "h3";
  if (path.some((segment) => typeof segment === "number") && (name.includes("heading") || name.includes("headline") || name === "title" || name.endsWith("title"))) return "h3";
  if (name === "advisoryheading" || name.endsWith("title")) return "h3";
  if (name.includes("heading") || name.includes("headline") || name === "title") return "h2";
  return "paragraph";
}

function wrapPlainText(value: string, blockType: LexicalBlockType) {
  const tag = blockType === "quote" ? "blockquote" : blockType;
  const paragraphs = value.split(/\n{2,}/).map((paragraph) => escapeHTML(paragraph).replaceAll("\n", "<br>"));
  if (tag !== "paragraph") return `<${tag}>${paragraphs.join("<br>")}</${tag}>`;
  return (paragraphs.length ? paragraphs : [""]).map((paragraph) => `<p>${paragraph}</p>`).join("");
}

function nativeRichTextValue(value: unknown, blockType: LexicalBlockType, fallback = "") {
  if (isLexicalValue(value)) return lexicalToHTML(value);
  if (isRecord(value) && value.type === "doc") return value;
  const text = typeof value === "string" || typeof value === "number" ? String(value) : fallback;
  return HTML_TAG.test(text) ? text : wrapPlainText(text, blockType);
}

function legacyRichTextValue(map: Record<string, unknown>, fieldName: string) {
  const entry = map[fieldName];
  if (isLexicalValue(entry)) return entry;
  if (isRecord(entry) && isLexicalValue(entry.value)) return entry.value;
  return null;
}

export function normalizeNativeRichTextProps(
  fields: Record<string, NativeRichTextField>,
  props: Record<string, unknown>,
  componentType: string,
  path: Array<number | string> = [],
) {
  const next = { ...props };
  const storedMap = isRecord(props.puckRichText) ? { ...props.puckRichText } : {};

  Object.entries(fields).forEach(([fieldName, field]) => {
    if (field.type === "richtext") {
      const blockType = defaultNativeRichTextBlockType(componentType, fieldName, path, field.richTextBlockType);
      const legacyValue = legacyRichTextValue(storedMap, fieldName);
      next[fieldName] = nativeRichTextValue(legacyValue ?? props[fieldName], blockType, field.richTextDefault);
      delete storedMap[fieldName];
      return;
    }

    if (field.type === "array" && field.arrayFields && Array.isArray(props[fieldName])) {
      next[fieldName] = (props[fieldName] as unknown[]).map((item, index) => isRecord(item)
        ? normalizeNativeRichTextProps(field.arrayFields || {}, item, componentType, [...path, fieldName, index])
        : item);
      return;
    }

    if (field.type === "object" && field.objectFields && isRecord(props[fieldName])) {
      next[fieldName] = normalizeNativeRichTextProps(field.objectFields, props[fieldName] as Record<string, unknown>, componentType, [...path, fieldName]);
    }
  });

  if (Object.keys(storedMap).length) next.puckRichText = storedMap;
  else delete next.puckRichText;
  return next;
}

export function stripNativeRichTextForPayload(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripNativeRichTextForPayload);
  if (!isRecord(value)) return typeof value === "string" && HTML_TAG.test(value) ? richTextToPlainText(value) : value;
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== "puckRichText")
      .map(([key, entry]) => [key, stripNativeRichTextForPayload(entry)]),
  );
}
