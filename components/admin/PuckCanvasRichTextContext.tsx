"use client";

import { registerOverlayPortal } from "@puckeditor/core";
import { useEffect, useRef, type SyntheticEvent } from "react";

import { emptyLexicalValue, getPlainTextFromLexical, isLexicalValue, type LexicalBlockType } from "@/puck/lexical-value";

import { PuckLexicalTextEditor } from "./PuckLexicalTextEditor";
import { usePuck } from "./puck-context";
import styles from "./puck-lexical-editor.module.css";

type RecordValue = Record<string, unknown>;
type CanvasRequest = { props?: RecordValue; fieldPath: string; fieldName?: string; value: unknown; defaultBlockType: LexicalBlockType; label: string };
function segments(path: string) { return path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean); }

function getDeep(value: unknown, path: string) {
  return segments(path).reduce<unknown>((current, segment) => {
    if (current == null) return undefined;
    return Array.isArray(current) ? current[Number(segment)] : typeof current === "object" ? (current as RecordValue)[segment] : undefined;
  }, value);
}

function setDeep(value: unknown, path: string, nextValue: unknown): RecordValue {
  const parts = segments(path);
  const clone = (current: unknown, array: boolean) => Array.isArray(current) ? [...current] : current && typeof current === "object" ? { ...(current as RecordValue) } : array ? [] : {};
  const root = clone(value, false) as RecordValue;
  let current: RecordValue | unknown[] = root;
  parts.forEach((part, index) => {
    const last = index === parts.length - 1;
    const nextArray = /^\d+$/.test(parts[index + 1] || "");
    if (Array.isArray(current)) {
      const position = Number(part);
      if (last) current[position] = nextValue;
      else { current[position] = clone(current[position], nextArray); current = current[position] as RecordValue | unknown[]; }
    } else if (last) current[part] = nextValue;
    else { current[part] = clone(current[part], nextArray); current = current[part] as RecordValue | unknown[]; }
  });
  return root;
}

function storagePath(fieldPath: string) {
  const index = fieldPath.lastIndexOf(".");
  return index === -1 ? `puckRichText.${fieldPath}` : `${fieldPath.slice(0, index)}.puckRichText.${fieldPath.slice(index + 1)}`;
}

function CanvasEditor({ request, editorValue, onChange }: { request: CanvasRequest; editorValue: unknown; onChange: (value: unknown) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    return registerOverlayPortal(ref.current, { disableDrag: true });
  }, []);
  const stopPuckInteraction = (event: SyntheticEvent) => event.stopPropagation();
  const handlePortalClickCapture = (event: SyntheticEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest('[data-puck-rich-text-toolbar="true"]')) return;
    event.stopPropagation();
  };
  return <div className={styles.canvasEditorOverlay} data-puck-overlay-portal="true" data-puck-rich-text-editor="true" onClick={stopPuckInteraction} onClickCapture={handlePortalClickCapture} onDragStart={(event) => event.preventDefault()} onMouseDown={stopPuckInteraction} onPointerDown={stopPuckInteraction} ref={ref}>
    <PuckLexicalTextEditor commitMode="blur" defaultBlockType={request.defaultBlockType} surface="canvas" toolbarLabel={request.label} toolbarMode="global" value={editorValue} onChange={onChange} />
  </div>;
}

export function PuckCanvasRichTextField({ request }: { request: CanvasRequest }) {
  const dispatch = usePuck((state) => state.dispatch);
  const getItemById = usePuck((state) => state.getItemById);
  const getSelectorForId = usePuck((state) => state.getSelectorForId);
  const props = request.props;
  const entry = props ? getDeep(props, storagePath(request.fieldPath)) : undefined;
  const directRichValue = isLexicalValue(request.value) ? request.value : null;
  const storage = directRichValue
    ? { enabled: true, value: directRichValue }
    : isLexicalValue(entry)
      ? { enabled: true, value: entry }
      : entry && typeof entry === "object" && !Array.isArray(entry)
        ? entry as { enabled?: boolean; value?: unknown }
        : undefined;

  if (!props || !storage?.enabled) return null;

  const plain = typeof request.value === "string" || typeof request.value === "number" ? String(request.value) : "";
  const editorValue = isLexicalValue(storage.value) ? storage.value : emptyLexicalValue(plain, request.defaultBlockType);
  const update = (nextValue: unknown) => {
    const id = props.id == null ? "" : String(props.id);
    const item = id ? getItemById(id) : null;
    const selector = id ? getSelectorForId(id) : null;
    if (!item || !selector) return;
    const itemProps = item.props && typeof item.props === "object" ? item.props as RecordValue : {};
    const nextProps = setDeep(setDeep(itemProps, request.fieldPath, getPlainTextFromLexical(nextValue)), storagePath(request.fieldPath), { enabled: true, value: nextValue });
    dispatch({ type: "replace", data: { ...item, props: { ...nextProps, id } }, destinationIndex: selector.index, destinationZone: selector.zone, ui: { field: { focus: request.fieldPath }, itemSelector: selector, leftSideBarVisible: true, plugin: { current: "fields" }, rightSideBarVisible: false } });
  };

  return <CanvasEditor editorValue={editorValue} onChange={update} request={request} />;
}
