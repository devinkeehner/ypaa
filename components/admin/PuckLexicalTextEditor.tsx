"use client";

import { AutoLinkNode, LinkNode } from "@payloadcms/richtext-lexical/client";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  type EditorState,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "@payloadcms/richtext-lexical/lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@payloadcms/richtext-lexical/lexical/list";
import {
  $createHeadingNode,
  HeadingNode,
  QuoteNode,
  type HeadingTagType,
} from "@payloadcms/richtext-lexical/lexical/rich-text";
import { $setBlocksType } from "@payloadcms/richtext-lexical/lexical/selection";
import { LexicalComposer, type InitialConfigType } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { ContentEditable } from "@payloadcms/richtext-lexical/lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@payloadcms/richtext-lexical/lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalRichTextPlugin";
import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";

import { normalizeLexicalValue } from "@/puck/lexical-value";

import styles from "./puck-lexical-editor.module.css";

function ExternalValuePlugin({ value, latestRef }: { value: unknown; latestRef: MutableRefObject<string> }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const serialized = JSON.stringify(normalizeLexicalValue(value));
    if (serialized === latestRef.current) return;
    latestRef.current = serialized;
    editor.setEditorState(editor.parseEditorState(serialized));
  }, [editor, latestRef, value]);

  return null;
}

function Toolbar({ readOnly }: { readOnly?: boolean }) {
  const [editor] = useLexicalComposerContext();

  const format = (value: TextFormatType) => editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
  const block = (tag: "paragraph" | HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      $setBlocksType(selection, () => (tag === "paragraph" ? $createParagraphNode() : $createHeadingNode(tag)));
    });
  };

  return (
    <div className={styles.toolbar} aria-label="Rich text formatting">
      <select aria-label="Text style" disabled={readOnly} defaultValue="paragraph" onChange={(event) => block(event.target.value as "paragraph" | HeadingTagType)}>
        <option value="paragraph">Paragraph</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>
      <button aria-label="Bold" disabled={readOnly} onClick={() => format("bold")} type="button"><Bold /></button>
      <button aria-label="Italic" disabled={readOnly} onClick={() => format("italic")} type="button"><Italic /></button>
      <button aria-label="Underline" disabled={readOnly} onClick={() => format("underline")} type="button"><Underline /></button>
      <button aria-label="Bulleted list" disabled={readOnly} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} type="button"><List /></button>
      <button aria-label="Numbered list" disabled={readOnly} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} type="button"><ListOrdered /></button>
    </div>
  );
}

export function PuckLexicalTextEditor({ value, onChange, readOnly }: { value: unknown; onChange: (value: unknown) => void; readOnly?: boolean }) {
  const [initialState] = useState(() => JSON.stringify(normalizeLexicalValue(value)));
  const latest = useRef(initialState);
  const [error, setError] = useState<string | null>(null);

  const initialConfig = useMemo<InitialConfigType>(() => ({
    editable: !readOnly,
    editorState: initialState,
    namespace: "NECYPAA-Puck-RichText",
    nodes: [AutoLinkNode, LinkNode, HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError: (nextError) => setError(nextError.message),
    theme: {
      heading: { h2: styles.h2, h3: styles.h3, h4: styles.h4 },
      list: { ol: styles.ol, ul: styles.ul },
      paragraph: styles.paragraph,
      quote: styles.quote,
      text: { bold: styles.bold, italic: styles.italic, underline: styles.underline },
    },
  }), [initialState, readOnly]);

  const handleChange = useCallback((editorState: EditorState) => {
    const next = editorState.toJSON();
    latest.current = JSON.stringify(next);
    setError(null);
    onChange(next);
  }, [onChange]);

  return (
    <div className={styles.field}>
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar readOnly={readOnly} />
        <div className={styles.editor}>
          <RichTextPlugin
            contentEditable={<ContentEditable aria-placeholder="Write rich text" className={styles.content} placeholder={<span className={styles.placeholder}>Write rich text</span>} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={null}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
          <ExternalValuePlugin latestRef={latest} value={value} />
        </div>
      </LexicalComposer>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
