"use client";

import { $createLinkNode, $isLinkNode, AutoLinkNode, LinkNode } from "@payloadcms/richtext-lexical/client";
import {
  $createParagraphNode,
  $createRangeSelectionFromDom,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $setSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type EditorState,
  type ElementFormatType,
  REDO_COMMAND,
  type LexicalNode,
  type RangeSelection,
  type TextFormatType,
  UNDO_COMMAND,
} from "@payloadcms/richtext-lexical/lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListItemNode,
  ListNode,
} from "@payloadcms/richtext-lexical/lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
  type HeadingTagType,
} from "@payloadcms/richtext-lexical/lexical/rich-text";
import { $getSelectionStyleValueForProperty, $patchStyleText, $setBlocksType } from "@payloadcms/richtext-lexical/lexical/selection";
import { LexicalComposer, type InitialConfigType } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { ContentEditable } from "@payloadcms/richtext-lexical/lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@payloadcms/richtext-lexical/lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@payloadcms/richtext-lexical/lexical/react/LexicalRichTextPlugin";
import { AlignCenter, AlignLeft, AlignRight, Bold, Code2, Eraser, Heading, Italic, Link2, List, ListOrdered, Palette, Quote, Redo2, Strikethrough, Underline, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { createPortal } from "react-dom";

import { emptyLexicalValue, normalizeLexicalValue, type LexicalBlockType } from "@/puck/lexical-value";

import styles from "./puck-lexical-editor.module.css";

function normalizeEditorValue(value: unknown, defaultBlockType: LexicalBlockType) {
  return typeof value === "string" ? emptyLexicalValue(value, defaultBlockType) : normalizeLexicalValue(value);
}

function ExternalValuePlugin({
  defaultBlockType,
  draftRef,
  focusedRef,
  lastCommittedRef,
  latestRef,
  value,
}: {
  defaultBlockType: LexicalBlockType;
  draftRef: MutableRefObject<unknown>;
  focusedRef: MutableRefObject<boolean>;
  lastCommittedRef: MutableRefObject<string>;
  latestRef: MutableRefObject<string>;
  value: unknown;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const normalized = normalizeEditorValue(value, defaultBlockType);
    const serialized = JSON.stringify(normalized);
    if (focusedRef.current || serialized === latestRef.current) return;
    draftRef.current = normalized;
    lastCommittedRef.current = serialized;
    latestRef.current = serialized;
    editor.setEditorState(editor.parseEditorState(serialized));
  }, [defaultBlockType, draftRef, editor, focusedRef, lastCommittedRef, latestRef, value]);

  return null;
}

type ActiveFormats = { alignment: ElementFormatType; block: string; bold: boolean; italic: boolean; underline: boolean; strikethrough: boolean; code: boolean; color: string };
const EMPTY_FORMATS: ActiveFormats = { alignment: "", block: "paragraph", bold: false, italic: false, underline: false, strikethrough: false, code: false, color: "" };

function ToolbarButton({ active, children, disabled, label, onClick }: { active?: boolean; children: React.ReactNode; disabled?: boolean; label: string; onClick: () => void }) {
  return <button aria-label={label} aria-pressed={active} data-active={active || undefined} disabled={disabled} onClick={onClick} onMouseDown={(event) => event.preventDefault()} title={label} type="button">{children}</button>;
}

function AutoFocusPlugin({ enabled }: { enabled: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!enabled) return;
    window.requestAnimationFrame(() => editor.focus());
  }, [editor, enabled]);

  return null;
}

function getLinkAncestor(node: LexicalNode) {
  let parent = node.getParent();
  while (parent) {
    if ($isLinkNode(parent)) return parent;
    parent = parent.getParent();
  }
  return null;
}

function unwrapLinkNode(linkNode: LinkNode) {
  linkNode.getChildren().forEach((child) => linkNode.insertBefore(child));
  linkNode.remove();
}

function applyCustomLink(url: string | null) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return;
  const nodes = selection.extract();

  if (!url) {
    nodes.forEach((node) => {
      const linkNode = $isLinkNode(node) ? node : getLinkAncestor(node);
      if (linkNode) unwrapLinkNode(linkNode);
    });
    return;
  }
  if (!nodes.length) return;

  const firstNode = nodes[0];
  const existingLink = $isLinkNode(firstNode) ? firstNode : getLinkAncestor(firstNode);
  if (existingLink) {
    existingLink.setFields({ doc: null, linkType: "custom", newTab: false, url });
    return;
  }

  const linkNode = $createLinkNode({ fields: { doc: null, linkType: "custom", newTab: false, url } });
  firstNode.insertBefore(linkNode);
  nodes.forEach((node) => {
    if ($isElementNode(node) && !node.isInline()) return;
    if ($isLinkNode(node)) {
      linkNode.append(...node.getChildren());
      node.remove();
      return;
    }
    linkNode.append(node);
  });
}

function Toolbar({ readOnly }: { readOnly?: boolean }) {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState<ActiveFormats>(EMPTY_FORMATS);
  const lastSelection = useRef<RangeSelection | null>(null);

  const updateActive = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;
    lastSelection.current = selection.clone();
    const anchor = selection.anchor.getNode();
    const element = anchor.getKey() === "root" ? anchor : anchor.getTopLevelElementOrThrow();
    const parent = element.getParent();
    const block = element.getType() === "heading" && "getTag" in element ? String((element as unknown as { getTag: () => string }).getTag()) : element.getType() === "quote" ? "quote" : parent?.getType() === "list" && "getListType" in parent ? String((parent as unknown as { getListType: () => string }).getListType()) : element.getType();
    const alignment = "getFormatType" in element ? (element as unknown as { getFormatType: () => ElementFormatType }).getFormatType() : "";
    setActive({ alignment, block, bold: selection.hasFormat("bold"), italic: selection.hasFormat("italic"), underline: selection.hasFormat("underline"), strikethrough: selection.hasFormat("strikethrough"), code: selection.hasFormat("code"), color: $getSelectionStyleValueForProperty(selection, "color", "") });
  }, []);

  useEffect(() => {
    const removeUpdate = editor.registerUpdateListener(({ editorState }) => editorState.read(updateActive));
    const removeSelection = editor.registerCommand(SELECTION_CHANGE_COMMAND, () => { updateActive(); return false; }, COMMAND_PRIORITY_LOW);
    return () => { removeUpdate(); removeSelection(); };
  }, [editor, updateActive]);

  const restoreSelection = useCallback(() => {
    const root = editor.getRootElement();
    const domSelection = root?.ownerDocument.getSelection();
    const fromDom = domSelection?.rangeCount ? $createRangeSelectionFromDom(domSelection, editor) : null;
    if ($isRangeSelection(fromDom)) {
      $setSelection(fromDom);
      lastSelection.current = fromDom.clone();
      return fromDom;
    }
    const current = $getSelection();
    if ($isRangeSelection(current)) {
      lastSelection.current = current.clone();
      return current;
    }
    if (!lastSelection.current) return null;
    try {
      const restored = lastSelection.current.clone();
      $setSelection(restored);
      return restored;
    } catch {
      lastSelection.current = null;
      return null;
    }
  }, [editor]);

  const runToolbarUpdate = useCallback((action: (selection: RangeSelection | null) => void) => {
    editor.update(() => {
      const selection = restoreSelection();
      action(selection);
      const next = $getSelection();
      if ($isRangeSelection(next)) lastSelection.current = next.clone();
    }, { discrete: true, onUpdate: () => editor.focus(undefined, { defaultSelection: "rootEnd" }) });
  }, [editor, restoreSelection]);

  const format = (value: TextFormatType) => runToolbarUpdate((selection) => selection?.formatText(value));
  const block = (tag: "paragraph" | "quote" | HeadingTagType) => {
    runToolbarUpdate((selection) => {
      if (!selection) return;
      $setBlocksType(selection, () => (tag === "paragraph" ? $createParagraphNode() : tag === "quote" ? $createQuoteNode() : $createHeadingNode(tag)));
    });
  };
  const alignment = (value: ElementFormatType) => runToolbarUpdate(() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, value));
  const color = (value: string) => runToolbarUpdate((selection) => {
    if (selection) $patchStyleText(selection, { color: value || null });
  });
  const captureSelection = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) lastSelection.current = selection.clone();
    });
  }, [editor]);
  const clearFormatting = () => runToolbarUpdate((selection) => {
    if (!selection) return;
    selection.getNodes().forEach((node) => {
      if ("setFormat" in node && typeof node.setFormat === "function") (node as unknown as { setFormat: (format: number) => void }).setFormat(0);
      if ("setStyle" in node && typeof node.setStyle === "function") (node as unknown as { setStyle: (style: string) => void }).setStyle("");
    });
  });
  const setLink = () => {
    const url = window.prompt("Link URL");
    if (url === null) return;
    runToolbarUpdate(() => applyCustomLink(url.trim() || null));
  };

  return (
    <div className={styles.toolbar} aria-label="Rich text formatting">
      <label className={styles.toolbarSelect}><Heading /><select aria-label="Text style" disabled={readOnly} onChange={(event) => block(event.target.value as "paragraph" | HeadingTagType)} value={["paragraph", "h1", "h2", "h3", "h4", "quote"].includes(active.block) ? active.block : "paragraph"}>
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
        <option value="quote">Quote</option>
      </select></label>
      <ToolbarButton active={active.bold} disabled={readOnly} label="Bold" onClick={() => format("bold")}><Bold /></ToolbarButton>
      <ToolbarButton active={active.italic} disabled={readOnly} label="Italic" onClick={() => format("italic")}><Italic /></ToolbarButton>
      <ToolbarButton active={active.underline} disabled={readOnly} label="Underline" onClick={() => format("underline")}><Underline /></ToolbarButton>
      <ToolbarButton active={active.strikethrough} disabled={readOnly} label="Strikethrough" onClick={() => format("strikethrough")}><Strikethrough /></ToolbarButton>
      <ToolbarButton active={active.code} disabled={readOnly} label="Inline code" onClick={() => format("code")}><Code2 /></ToolbarButton>
      <ToolbarButton active={active.block === "bullet"} disabled={readOnly} label="Bulleted list" onClick={() => runToolbarUpdate(() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined))}><List /></ToolbarButton>
      <ToolbarButton active={active.block === "number"} disabled={readOnly} label="Numbered list" onClick={() => runToolbarUpdate(() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined))}><ListOrdered /></ToolbarButton>
      <ToolbarButton active={active.block === "quote"} disabled={readOnly} label="Quote" onClick={() => block("quote")}><Quote /></ToolbarButton>
      <ToolbarButton disabled={readOnly} label="Add or remove link" onClick={setLink}><Link2 /></ToolbarButton>
      <ToolbarButton disabled={readOnly} label="Clear formatting" onClick={clearFormatting}><Eraser /></ToolbarButton>
      <span className={styles.toolbarDivider} />
      <ToolbarButton active={active.alignment === "left"} disabled={readOnly} label="Align left" onClick={() => alignment("left")}><AlignLeft /></ToolbarButton>
      <ToolbarButton active={active.alignment === "center"} disabled={readOnly} label="Align center" onClick={() => alignment("center")}><AlignCenter /></ToolbarButton>
      <ToolbarButton active={active.alignment === "right"} disabled={readOnly} label="Align right" onClick={() => alignment("right")}><AlignRight /></ToolbarButton>
      <label className={styles.colorPicker} title="Text color"><Palette /><input aria-label="Text color" disabled={readOnly} onInput={(event) => color(event.currentTarget.value)} onPointerDownCapture={captureSelection} type="color" value={/^#[0-9a-f]{6}$/i.test(active.color) ? active.color : "#171b20"} /></label>
      <span className={styles.toolbarDivider} />
      <ToolbarButton disabled={readOnly} label="Undo" onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}><Undo2 /></ToolbarButton>
      <ToolbarButton disabled={readOnly} label="Redo" onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}><Redo2 /></ToolbarButton>
    </div>
  );
}

export function PuckLexicalTextEditor({
  autoFocus = false,
  commitMode = "change",
  compact = false,
  defaultBlockType = "paragraph",
  onChange,
  readOnly,
  registerCommit,
  surface = "field",
  toolbarLabel = "Text",
  toolbarMode = "inline",
  value,
}: {
  autoFocus?: boolean;
  commitMode?: "blur" | "change";
  compact?: boolean;
  defaultBlockType?: LexicalBlockType;
  onChange: (value: unknown) => void;
  readOnly?: boolean;
  registerCommit?: (commit: () => void) => () => void;
  surface?: "canvas" | "field";
  toolbarLabel?: string;
  toolbarMode?: "global" | "inline" | "none";
  value: unknown;
}) {
  const [initialValue] = useState(() => normalizeEditorValue(value, defaultBlockType));
  const [initialState] = useState(() => JSON.stringify(initialValue));
  const draft = useRef<unknown>(initialValue);
  const focused = useRef(false);
  const lastCommitted = useRef(initialState);
  const latest = useRef(initialState);
  const onChangeRef = useRef(onChange);
  const fieldRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [toolbarTarget, setToolbarTarget] = useState<HTMLElement | null>(null);
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const useGlobalToolbar = surface === "canvas" && toolbarMode === "global";

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const commitDraft = useCallback(() => {
    if (commitMode !== "blur" || latest.current === lastCommitted.current) return;
    lastCommitted.current = latest.current;
    onChangeRef.current(draft.current);
  }, [commitMode]);

  useEffect(() => registerCommit?.(commitDraft), [commitDraft, registerCommit]);

  useEffect(() => {
    if (!useGlobalToolbar) return;
    const ownerDocument = fieldRef.current?.ownerDocument;
    if (!ownerDocument) return;
    const frame = ownerDocument.defaultView?.frameElement;
    const parentDocument = frame instanceof HTMLElement ? frame.ownerDocument : ownerDocument;
    setToolbarTarget(parentDocument.getElementById("necypaa-puck-rich-toolbar") || parentDocument.body);
  }, [useGlobalToolbar]);

  useEffect(() => {
    if (!useGlobalToolbar || !toolbarOpen) return;
    const ownerDocument = fieldRef.current?.ownerDocument;
    const toolbarDocument = toolbarTarget?.ownerDocument;
    if (!ownerDocument) return;

    const closeOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && fieldRef.current?.contains(target)) return;
      if (target && toolbarRef.current?.contains(target)) return;
      setToolbarOpen(false);
    };
    const documents = new Set([ownerDocument, toolbarDocument].filter(Boolean) as Document[]);
    documents.forEach((document) => {
      document.addEventListener("focusin", closeOutside, true);
      document.addEventListener("pointerdown", closeOutside, true);
    });
    return () => documents.forEach((document) => {
      document.removeEventListener("focusin", closeOutside, true);
      document.removeEventListener("pointerdown", closeOutside, true);
    });
  }, [toolbarOpen, toolbarTarget, useGlobalToolbar]);

  const initialConfig = useMemo<InitialConfigType>(() => ({
    editable: !readOnly,
    editorState: initialState,
    namespace: "NECYPAA-Puck-RichText",
    nodes: [AutoLinkNode, LinkNode, HeadingNode, QuoteNode, ListNode, ListItemNode],
    onError: (nextError) => setError(nextError.message),
    theme: {
      heading: { h1: styles.h1, h2: styles.h2, h3: styles.h3, h4: styles.h4 },
      list: { ol: styles.ol, ul: styles.ul },
      paragraph: styles.paragraph,
      quote: styles.quote,
      text: { bold: styles.bold, italic: styles.italic, underline: styles.underline },
    },
  }), [initialState, readOnly]);

  const handleChange = useCallback((editorState: EditorState) => {
    const next = editorState.toJSON();
    const serialized = JSON.stringify(next);
    draft.current = next;
    latest.current = serialized;
    setError(null);
    if (commitMode === "change") {
      lastCommitted.current = serialized;
      onChangeRef.current(next);
    }
  }, [commitMode]);

  const handleBlur = useCallback((event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget as Node | null;
    if (nextTarget && fieldRef.current?.contains(nextTarget)) return;
    focused.current = false;
    commitDraft();
  }, [commitDraft]);

  const handleFocus = useCallback(() => {
    focused.current = true;
    if (useGlobalToolbar) setToolbarOpen(true);
  }, [useGlobalToolbar]);

  return (
    <div
      className={styles.field}
      data-compact={compact || undefined}
      data-surface={surface}
      data-toolbar-mode={toolbarMode}
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerDownCapture={() => useGlobalToolbar && setToolbarOpen(true)}
      ref={fieldRef}
    >
      <LexicalComposer initialConfig={initialConfig}>
        {toolbarMode === "inline" ? <Toolbar readOnly={readOnly} /> : null}
        {useGlobalToolbar && toolbarOpen && toolbarTarget ? createPortal(
          <div
            className={styles.canvasToolbar}
            data-puck-overlay-portal="true"
            data-puck-rich-text-toolbar="true"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
            ref={toolbarRef}
          >
            <span className={styles.canvasToolbarLabel}>{toolbarLabel}</span>
            <Toolbar readOnly={readOnly} />
          </div>,
          toolbarTarget,
        ) : null}
        <div className={styles.editor}>
          <RichTextPlugin
            contentEditable={<ContentEditable aria-label={toolbarLabel} aria-placeholder="Write rich text" className={styles.content} placeholder={<span className={styles.placeholder}>Write rich text</span>} />}
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={null}
          />
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePlugin ignoreSelectionChange onChange={handleChange} />
          <AutoFocusPlugin enabled={autoFocus} />
          <ExternalValuePlugin defaultBlockType={defaultBlockType} draftRef={draft} focusedRef={focused} lastCommittedRef={lastCommitted} latestRef={latest} value={value} />
        </div>
      </LexicalComposer>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}
