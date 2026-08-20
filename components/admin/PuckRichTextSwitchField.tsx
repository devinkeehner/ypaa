"use client";

import { useCallback, useMemo } from "react";
import { Pilcrow, Type } from "lucide-react";
import type { Field } from "@puckeditor/core";

import { PuckLexicalTextEditor } from "./PuckLexicalTextEditor";
import { usePuck } from "./puck-context";
import { emptyLexicalValue, getPlainTextFromLexical, isLexicalValue, type LexicalBlockType } from "@/puck/lexical-value";
import { richTextToPlainText } from "@/puck/native-rich-text";
import styles from "./puck-lexical-editor.module.css";

type StorageEntry = { enabled?: boolean; value?: unknown };

function pathSegments(path: string) {
  return path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
}

function getDeep(value: unknown, path: string): unknown {
  return pathSegments(path).reduce<unknown>((current, segment) => {
    if (current == null) return undefined;
    if (Array.isArray(current)) return current[Number(segment)];
    return typeof current === "object" ? (current as Record<string, unknown>)[segment] : undefined;
  }, value);
}

function setDeep(value: Record<string, unknown>, path: string, nextValue: unknown) {
  const segments = pathSegments(path);
  const cloneContainer = (container: unknown): Record<string, unknown> | unknown[] => (
    Array.isArray(container)
      ? [...container]
      : container && typeof container === "object"
        ? { ...(container as Record<string, unknown>) }
        : {}
  );
  const root = cloneContainer(value) as Record<string, unknown>;
  let current: Record<string, unknown> | unknown[] = root;
  segments.forEach((segment, index) => {
    const last = index === segments.length - 1;
    const nextIsArray = /^\d+$/.test(segments[index + 1] || "");
    if (Array.isArray(current)) {
      const position = Number(segment);
      if (last) current[position] = nextValue;
      else {
        current[position] = cloneContainer(current[position] ?? (nextIsArray ? [] : {}));
        current = current[position] as Record<string, unknown> | unknown[];
      }
    } else if (last) current[segment] = nextValue;
    else {
      current[segment] = cloneContainer(current[segment] ?? (nextIsArray ? [] : {}));
      current = current[segment] as Record<string, unknown> | unknown[];
    }
  });
  return root;
}

function storagePath(fieldPath: string) {
  const index = fieldPath.lastIndexOf(".");
  return index === -1 ? `puckRichText.${fieldPath}` : `${fieldPath.slice(0, index)}.puckRichText.${fieldPath.slice(index + 1)}`;
}

function defaultType(fieldName: string, blockType?: LexicalBlockType): LexicalBlockType {
  if (blockType) return blockType;
  const name = fieldName.toLowerCase();
  if (name.includes("heading") || name.includes("headline") || name === "title") return "h2";
  if (name === "quote") return "quote";
  return "paragraph";
}

export function PuckRichTextSwitchField({ field, fieldName, value, onChange, readOnly, defaultBlockType, plainType = "text" }: {
  field: Field;
  fieldName: string;
  value: unknown;
  onChange: (value: unknown) => void;
  readOnly?: boolean;
  defaultBlockType?: LexicalBlockType;
  plainType?: "text" | "textarea";
}) {
  const selectedItem = usePuck((state) => state.selectedItem);
  const dispatch = usePuck((state) => state.dispatch);
  const getItemById = usePuck((state) => state.getItemById);
  const getSelectorForId = usePuck((state) => state.getSelectorForId);
  const props = selectedItem?.props && typeof selectedItem.props === "object" ? selectedItem.props as Record<string, unknown> : {};
  const entry = getDeep(props, storagePath(fieldName));
  const storage = isLexicalValue(entry)
    ? { enabled: true, value: entry }
    : entry && typeof entry === "object" && !Array.isArray(entry)
      ? entry as StorageEntry
      : undefined;
  const directRichValue = isLexicalValue(value) ? value : null;
  const richValue = directRichValue || (isLexicalValue(storage?.value) ? storage.value : null);
  const enabled = Boolean(directRichValue || storage?.enabled && richValue);
  const plainValue = directRichValue ? getPlainTextFromLexical(directRichValue) : typeof value === "string" ? richTextToPlainText(value) : typeof value === "number" ? String(value) : "";
  const blockType = defaultType(fieldName, defaultBlockType);
  const fallback = useMemo(() => emptyLexicalValue(plainValue, blockType), [blockType, plainValue]);

  const update = useCallback((text: string, nextStorage?: StorageEntry) => {
    const id = props.id == null ? "" : String(props.id);
    const item = id ? getItemById(id) : null;
    const selector = id ? getSelectorForId(id) : null;
    if (!item || !selector) {
      onChange(text);
      return;
    }
    const itemProps = item.props && typeof item.props === "object" ? item.props as Record<string, unknown> : {};
    let nextProps = setDeep(itemProps, fieldName, text);
    if (nextStorage) nextProps = setDeep(nextProps, storagePath(fieldName), nextStorage);
    dispatch({ type: "replace", data: { ...item, props: { ...nextProps, id } }, destinationIndex: selector.index, destinationZone: selector.zone, ui: { field: { focus: fieldName }, itemSelector: selector, leftSideBarVisible: true, plugin: { current: "fields" }, rightSideBarVisible: false } });
  }, [dispatch, fieldName, getItemById, getSelectorForId, onChange, props.id]);

  const toggle = () => update(plainValue, { enabled: !enabled, value: richValue || fallback });

  return <div className={styles.switchField} data-rich-mode={enabled ? "true" : "false"}>
    <div className={styles.switchHeader}><span>{field.label || fieldName}</span><button aria-pressed={enabled} disabled={readOnly} onClick={toggle} type="button">{enabled ? <Pilcrow /> : <Type />}<span>{enabled ? "Use plain" : "Use rich"}</span></button></div>
    {enabled ? <PuckLexicalTextEditor commitMode="blur" defaultBlockType={blockType} toolbarLabel={String(field.label || fieldName)} toolbarMode="none" value={richValue || fallback} onChange={(next) => update(getPlainTextFromLexical(next), { enabled: true, value: next })} readOnly={readOnly} /> : plainType === "textarea" ? <textarea disabled={readOnly} onChange={(event) => update(event.target.value, storage ? { enabled: false, value: richValue || fallback } : undefined)} value={plainValue} /> : <input disabled={readOnly} onChange={(event) => update(event.target.value, storage ? { enabled: false, value: richValue || fallback } : undefined)} value={plainValue} />}
  </div>;
}
