import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type LexicalValue = SerializedEditorState;

export function emptyLexicalValue(text = ""): LexicalValue {
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "paragraph",
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
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "root" in value &&
    value.root &&
    typeof value.root === "object"
  ) {
    return value as LexicalValue;
  }
  return emptyLexicalValue();
}
