"use client";

import "@puckeditor/core/puck.css";

import { createUsePuck, Puck, type Config, type Data } from "@puckeditor/core";
import { AlignCenter, AlignLeft, AlignRight, ArrowLeft, Bold, Redo2, Undo2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { editableFieldsByType, puckConfig } from "@/puck/config";
import type { NECYPAAData } from "@/puck/types";

import { PuckLexicalTextEditor } from "./PuckLexicalTextEditor";
import styles from "./puck-builder.module.css";

const usePuck = createUsePuck();
const EMPTY_FIELDS: string[] = [];

function property(type: string, field: string, kind: "Color" | "FontSize" | "FontWeight" | "TextAlign") {
  if ((type === "FreeText" && field === "text") || (type === "RichText" && field === "content")) {
    return kind === "Color" ? "color" : kind === "FontSize" ? "fontSize" : kind === "FontWeight" ? "fontWeight" : "alignment";
  }
  return `${field}${kind}`;
}

function FormattingBar() {
  const dispatch = usePuck((state) => state.dispatch);
  const getItemById = usePuck((state) => state.getItemById);
  const getSelectorForId = usePuck((state) => state.getSelectorForId);
  const selectedItem = usePuck((state) => state.selectedItem) as { props?: Record<string, unknown>; type?: string } | null;
  const [focus, setFocus] = useState({ componentId: "", field: "" });
  const itemType = selectedItem?.type || "";
  const componentId = typeof selectedItem?.props?.id === "string" ? selectedItem.props.id : "";
  const fields = editableFieldsByType[itemType as keyof typeof editableFieldsByType] || EMPTY_FIELDS;
  const activeField = focus.componentId === componentId && fields.includes(focus.field) ? focus.field : fields[0] || "";

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      const message = event.data as { type?: string; componentId?: string; field?: string };
      if (event.origin === window.location.origin && message.type === "necypaa:puck-text-focus" && message.componentId === componentId && message.field && fields.includes(message.field)) setFocus({ componentId, field: message.field });
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [componentId, fields]);

  const update = useCallback((name: string, value: unknown) => {
    if (!componentId) return;
    const current = getItemById(componentId);
    const selector = getSelectorForId(componentId);
    if (!current || !selector) return;
    dispatch({ type: "replace", data: { ...current, props: { ...current.props, id: componentId, [name]: value } }, destinationIndex: selector.index, destinationZone: selector.zone, ui: { field: { focus: activeField }, itemSelector: selector, leftSideBarVisible: true, rightSideBarVisible: false } });
  }, [activeField, componentId, dispatch, getItemById, getSelectorForId]);

  if (!selectedItem || !activeField) return <div className={styles.formatEmpty}>Select a section, then click its text to format it.</div>;
  const props = selectedItem.props || {};
  const sizeName = property(itemType, activeField, "FontSize");
  const colorName = property(itemType, activeField, "Color");
  const weightName = property(itemType, activeField, "FontWeight");
  const alignName = property(itemType, activeField, "TextAlign");
  const size = typeof props[sizeName] === "string" ? props[sizeName] : "";
  const color = typeof props[colorName] === "string" && /^#[0-9a-f]{6}$/i.test(props[colorName] as string) ? props[colorName] as string : "#171b20";
  const weight = String(props[weightName] || "400");
  const align = String(props[alignName] || "left");

  const activeValue = props[activeField];

  return <div className={styles.formatBar} aria-label="Selected text formatting">
    <label><span>Text</span><select value={activeField} onChange={(event) => setFocus({ componentId, field: event.target.value })}>{fields.map((field) => <option key={field} value={field}>{field.replace(/([A-Z])/g, " $1")}</option>)}</select></label>
    {typeof activeValue === "string"
      ? <input className={styles.copyInput} aria-label="Text content" value={activeValue} onChange={(event) => update(activeField, event.target.value)} />
      : <span className={styles.richHint}>Edit the copy in the rich-text panel; style the whole block here.</span>}
    <label><span>Size</span><input aria-label="Font size in pixels" min="10" max="120" placeholder="px" type="number" value={size.endsWith("px") ? size.slice(0, -2) : ""} onChange={(event) => update(sizeName, event.target.value ? `${event.target.value}px` : "")} /></label>
    <label><span>Color</span><input aria-label="Text color" type="color" value={color} onChange={(event) => update(colorName, event.target.value)} /></label>
    <button aria-label="Bold" aria-pressed={weight === "700"} onClick={() => update(weightName, weight === "700" ? "400" : "700")} type="button"><Bold /></button>
    <div className={styles.align}><button aria-label="Align left" aria-pressed={align === "left"} onClick={() => update(alignName, "left")} type="button"><AlignLeft /></button><button aria-label="Align center" aria-pressed={align === "center"} onClick={() => update(alignName, "center")} type="button"><AlignCenter /></button><button aria-label="Align right" aria-pressed={align === "right"} onClick={() => update(alignName, "right")} type="button"><AlignRight /></button></div>
  </div>;
}

function BuilderHeader({ actions, pageId, pageTitle }: { actions: React.ReactNode; pageId: string; pageTitle: string }) {
  const history = usePuck((state) => state.history);
  return <header className={styles.header}><div className={styles.topline}><div className={styles.identity}><a aria-label="Back to page" href={`/admin/collections/pages/${pageId}`}><ArrowLeft /></a><div><span>Visual builder</span><strong>{pageTitle}</strong></div></div><div className={styles.headerActions}><button disabled={!history.hasPast} aria-label="Undo" onClick={() => history.back()} type="button"><Undo2 /></button><button disabled={!history.hasFuture} aria-label="Redo" onClick={() => history.forward()} type="button"><Redo2 /></button>{actions}</div></div><FormattingBar /></header>;
}

export function PuckPageBuilderEditor({ initialData, pageId, pageTitle }: { initialData: NECYPAAData; pageId: string; pageTitle: string }) {
  const [data, setData] = useState(initialData);
  const latest = useRef(initialData);
  const lastSaved = useRef(JSON.stringify(initialData));
  const timer = useRef<number | null>(null);
  const [message, setMessage] = useState("Autosave on");

  const save = useCallback(async (next: Data, publish = false) => {
    setMessage(publish ? "Publishing…" : "Saving…");
    try {
      const response = await fetch(`/api/puck/pages/${pageId}${publish ? "/publish" : ""}`, { method: publish ? "POST" : "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: next }) });
      if (!response.ok) throw new Error(await response.text());
      lastSaved.current = JSON.stringify(next);
      setMessage(publish ? "Published" : "Saved");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save"); }
  }, [pageId]);

  useEffect(() => {
    latest.current = data;
    if (JSON.stringify(data) === lastSaved.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void save(latest.current), 900);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [data, save]);

  const overrides = useMemo(() => ({ header: ({ actions }: { actions: React.ReactNode }) => <BuilderHeader actions={actions} pageId={pageId} pageTitle={pageTitle} /> }), [pageId, pageTitle]);
  const editorConfig = useMemo(() => {
    const richText = puckConfig.components.RichText;
    return {
      ...puckConfig,
      components: {
        ...puckConfig.components,
        RichText: {
          ...richText,
          fields: {
            ...richText.fields,
            content: {
              type: "custom",
              label: "Rich text",
              render: ({ value, onChange, readOnly }: { value: unknown; onChange: (value: unknown) => void; readOnly?: boolean }) => <PuckLexicalTextEditor value={value} onChange={onChange} readOnly={readOnly} />,
            },
          },
        },
      },
    };
  }, []);
  return <div className={styles.wrapper}><Puck config={editorConfig as unknown as Config} data={data} height="100dvh" onChange={(next) => setData(next as NECYPAAData)} onPublish={(next) => save(next, true)} overrides={overrides} renderHeaderActions={({ state }) => <div className={styles.publish}><span aria-live="polite">{message}</span><button onClick={() => void save(state.data, true)} type="button">Publish</button></div>} viewports={[{ width: 390, height: "auto", label: "Mobile" }, { width: 768, height: "auto", label: "Tablet" }, { width: 1280, height: "auto", label: "Desktop" }]} /></div>;
}
