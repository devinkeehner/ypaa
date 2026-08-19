import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type LexicalValue = SerializedEditorState;

export type LexicalBlockType = "paragraph" | "quote" | "h1" | "h2" | "h3" | "h4";

export function isLexicalValue(value: unknown): value is LexicalValue {
  return Boolean(
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "root" in value &&
    value.root &&
    typeof value.root === "object",
  );
}

export function emptyLexicalValue(text = "", blockType: LexicalBlockType = "paragraph"): LexicalValue {
  const isHeading = blockType.startsWith("h");
  const isQuote = blockType === "quote";
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: isHeading ? "heading" : isQuote ? "quote" : "paragraph",
          ...(isHeading ? { tag: blockType } : {}),
          direction: "ltr",
          format: "",
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: "",
          children: text
            ? [
                {
                  type: "text",
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text,
                  version: 1,
                },
              ]
            : [],
        },
      ],
    },
  } as unknown as SerializedEditorState;
}

export function normalizeLexicalValue(value: unknown): LexicalValue {
  if (typeof value === "string") return emptyLexicalValue(value);
  if (isLexicalValue(value)) return value;
  return emptyLexicalValue();
}

function nodeChildren(value: unknown): unknown[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const children = (value as { children?: unknown }).children;
  return Array.isArray(children) ? children : [];
}

function nodeText(value: unknown): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const node = value as { text?: unknown; type?: unknown };
  if (node.type === "text") return typeof node.text === "string" ? node.text : "";
  if (node.type === "linebreak") return "\n";
  return nodeChildren(value).map(nodeText).join("");
}

export function getPlainTextFromLexical(value: unknown): string {
  if (!isLexicalValue(value)) return "";
  return nodeChildren(value.root).map(nodeText).join("\n").replace(/\n{3,}/g, "\n\n");
}
