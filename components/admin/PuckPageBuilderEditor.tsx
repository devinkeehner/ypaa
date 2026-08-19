"use client";

import "@puckeditor/core/puck.css";

import { createUsePuck, Drawer, fieldsPlugin, Puck, registerOverlayPortal, type Config, type Data, type Plugin } from "@puckeditor/core";
import { ArrowLeft, BarChart3, Box, Clipboard, ClipboardPaste, Columns2, FileText, GalleryHorizontal, HandHeart, ImageIcon, LayoutTemplate, ListTree, MousePointerClick, Palette, Quote, Save, Search, TextQuote, Type } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { nestedElementTypes, puckConfig } from "@/puck/config";
import { campaignAltDefinitions, campaignAltTypesByPalette } from "@/puck/campaign-alt-definitions";
import { emptyLexicalValue, getPlainTextFromLexical, isLexicalValue, type LexicalBlockType } from "@/puck/lexical-value";
import type { NECYPAAData } from "@/puck/types";
import type { TenantTheme } from "@/components/site/TenantThemeProvider";

import { PuckLexicalTextEditor } from "./PuckLexicalTextEditor";
import styles from "./puck-builder.module.css";

const usePuck = createUsePuck();
const PUCK_RICH_TEXT_FIELD_NAME = "puckRichText";
type ThemeColors = Omit<TenantTheme, "logoAlt" | "logoUrl">;
const THEME_FIELDS: Array<{ key: keyof ThemeColors; label: string }> = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Dark background" },
  { key: "surface", label: "Dark surface" },
  { key: "lightBackground", label: "Light background" },
  { key: "darkText", label: "Text on light" },
  { key: "lightText", label: "Text on dark" },
];
const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const ThemePreviewContext = createContext<ThemeColors | null>(null);

function themeColors(theme: TenantTheme): ThemeColors {
  return { primary: theme.primary, secondary: theme.secondary, accent: theme.accent, background: theme.background, surface: theme.surface, lightBackground: theme.lightBackground, darkText: theme.darkText, lightText: theme.lightText };
}

function themeVariables(colors: ThemeColors) {
  return {
    "--tenant-primary": colors.primary,
    "--tenant-secondary": colors.secondary,
    "--tenant-accent": colors.accent,
    "--tenant-background": colors.background,
    "--tenant-surface": colors.surface,
    "--tenant-light-background": colors.lightBackground,
    "--tenant-dark-text": colors.darkText,
    "--tenant-light-text": colors.lightText,
  } as CSSProperties;
}

function ThemePreviewFrame({ children }: { children: React.ReactNode }) {
  const colors = useContext(ThemePreviewContext);
  return <div className="tenant-theme" style={colors ? themeVariables(colors) : undefined}>{children}</div>;
}

function colorPickerValue(value: string) {
  return HEX_COLOR.test(value) ? value : "#000000";
}

type PathSegment = number | string;
type RichField = Record<string, unknown> & { arrayFields?: Record<string, unknown>; richTextDefault?: string };
type InspectorFieldRenderProps = { id: string; name: string; onChange: (value: unknown) => void; readOnly?: boolean; value: unknown };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function getValueAtPath(value: unknown, path: PathSegment[]) {
  return path.reduce<unknown>((current, segment) => {
    if (Array.isArray(current)) return typeof segment === "number" ? current[segment] : undefined;
    return isPlainRecord(current) ? current[segment] : undefined;
  }, value);
}

function setValueAtPath<T extends Record<string, unknown>>(value: T, path: PathSegment[], nextValue: unknown): T {
  const root = { ...value } as T;
  let current: Record<string, unknown> | unknown[] = root;
  path.forEach((segment, index) => {
    const last = index === path.length - 1;
    const nextSegment = path[index + 1];
    if (Array.isArray(current)) {
      if (typeof segment !== "number") return;
      if (last) current[segment] = nextValue;
      else {
        const child = Array.isArray(current[segment]) ? [...current[segment] as unknown[]] : isPlainRecord(current[segment]) ? { ...current[segment] } : typeof nextSegment === "number" ? [] : {};
        current[segment] = child;
        current = child;
      }
      return;
    }
    if (last) current[segment] = nextValue;
    else {
      const child = Array.isArray(current[segment]) ? [...current[segment] as unknown[]] : isPlainRecord(current[segment]) ? { ...current[segment] } : typeof nextSegment === "number" ? [] : {};
      current[segment] = child;
      current = child;
    }
  });
  return root;
}

function parseFieldPath(path: string): PathSegment[] {
  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .map((segment) => /^\d+$/.test(segment) ? Number(segment) : segment);
}

function richTextEntryPath(fieldPath: PathSegment[]): PathSegment[] {
  if (!fieldPath.length) return [];
  return [...fieldPath.slice(0, -1), PUCK_RICH_TEXT_FIELD_NAME, fieldPath[fieldPath.length - 1]];
}

function humanFieldLabel(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function defaultRichTextBlockType(componentType: string, fieldName: string, path: PathSegment[]): LexicalBlockType {
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

function CanvasRichTextEditor({ defaultBlockType, label, onChange, value }: { defaultBlockType: LexicalBlockType; label: string; onChange: (value: unknown) => void; value: unknown }) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!portalRef.current) return;
    return registerOverlayPortal(portalRef.current, { disableDrag: true });
  }, []);
  const stopOverlayClick = useCallback((event: React.SyntheticEvent) => event.stopPropagation(), []);
  return <div className={styles.canvasRichTextShell}><div className={styles.canvasRichText} data-puck-overlay-portal="true" data-puck-rich-text-editor="true" onClick={(event) => event.stopPropagation()} onClickCapture={stopOverlayClick} onDragStart={(event) => event.preventDefault()} onPointerDown={(event) => event.stopPropagation()} ref={portalRef}><PuckLexicalTextEditor defaultBlockType={defaultBlockType} onChange={onChange} surface="canvas" toolbarLabel={label} toolbarMode="global" value={value} /></div></div>;
}

function CanvasRichTextBlock({ componentType, fields, RenderComponent, props }: { componentType: string; fields: Record<string, unknown>; RenderComponent: React.ComponentType<Record<string, unknown>>; props: Record<string, unknown> }) {
  const dispatch = usePuck((state) => state.dispatch);
  const getItemById = usePuck((state) => state.getItemById);
  const getSelectorForId = usePuck((state) => state.getSelectorForId);
  const componentId = typeof props.id === "string" ? props.id : "";

  const updateRichText = useCallback((containerPath: PathSegment[], fieldName: string, nextValue: unknown) => {
    if (!componentId) return;
    const item = getItemById(componentId);
    const selector = getSelectorForId(componentId);
    if (!item || !selector) return;
    const itemProps = item.props as Record<string, unknown>;
    const plainPath = [...containerPath, fieldName];
    const currentPlain = getValueAtPath(itemProps, plainPath);
    const storedValue = isLexicalValue(currentPlain) ? nextValue : getPlainTextFromLexical(nextValue);
    const entryPath = [...containerPath, PUCK_RICH_TEXT_FIELD_NAME, fieldName];
    let nextProps = setValueAtPath(itemProps, plainPath, storedValue);
    nextProps = setValueAtPath(nextProps, entryPath, { enabled: true, value: nextValue });
    dispatch({ type: "replace", data: { ...item, props: { ...nextProps, id: componentId } }, destinationIndex: selector.index, destinationZone: selector.zone, ui: { itemSelector: selector, leftSideBarVisible: true, rightSideBarVisible: false } });
  }, [componentId, dispatch, getItemById, getSelectorForId]);

  const previewProps = useMemo(() => {
    const visit = (container: unknown, fieldMap: Record<string, unknown>, path: PathSegment[]): unknown => {
      if (!isPlainRecord(container)) return container;
      let next: Record<string, unknown> | null = null;
      const mutable = () => (next ??= { ...container });

      Object.entries(fieldMap).forEach(([fieldName, rawField]) => {
        if (!isPlainRecord(rawField)) return;
        const field = rawField as RichField;
        if (field.type === "custom" && (field.richText === true || field.label === "Rich text")) {
          const richMap = isPlainRecord(container[PUCK_RICH_TEXT_FIELD_NAME]) ? container[PUCK_RICH_TEXT_FIELD_NAME] as Record<string, unknown> : {};
          const storedEntry = richMap[fieldName];
          const entry = isLexicalValue(storedEntry)
            ? { enabled: true, value: storedEntry }
            : isPlainRecord(storedEntry)
              ? storedEntry
              : {};
          const plainValue = container[fieldName];
          const blockType = defaultRichTextBlockType(componentType, fieldName, path);
          const fallbackText = typeof plainValue === "string" || typeof plainValue === "number" ? String(plainValue) : field.richTextDefault || "";
          const editorValue = isLexicalValue(entry.value) ? entry.value : isLexicalValue(plainValue) ? plainValue : emptyLexicalValue(fallbackText, blockType);
          mutable()[PUCK_RICH_TEXT_FIELD_NAME] = {
            ...richMap,
            [fieldName]: {
              ...entry,
              enabled: true,
              value: <CanvasRichTextEditor defaultBlockType={blockType} label={typeof field.label === "string" ? field.label : humanFieldLabel(fieldName)} onChange={(value) => updateRichText(path, fieldName, value)} value={editorValue} />,
            },
          };
        } else if (field.type === "array" && isPlainRecord(field.arrayFields) && Array.isArray(container[fieldName])) {
          const source = container[fieldName] as unknown[];
          const items = source.map((item, index) => visit(item, field.arrayFields as Record<string, unknown>, [...path, fieldName, index]));
          if (items.some((item, index) => item !== source[index])) mutable()[fieldName] = items;
        }
      });
      return next ?? container;
    };
    return visit(props, fields, []) as Record<string, unknown>;
  }, [componentType, fields, props, updateRichText]);

  return <RenderComponent {...previewProps} />;
}

function InspectorRichTextField({ defaultBlockType, defaultText, id, label, name, onChange, readOnly, value }: InspectorFieldRenderProps & { defaultBlockType: LexicalBlockType; defaultText?: string; label: string }) {
  const selectedItem = usePuck((state) => state.selectedItem);
  const dispatch = usePuck((state) => state.dispatch);
  const getItemById = usePuck((state) => state.getItemById);
  const getSelectorForId = usePuck((state) => state.getSelectorForId);
  const fieldPath = useMemo(() => parseFieldPath(name), [name]);
  const storagePath = useMemo(() => richTextEntryPath(fieldPath), [fieldPath]);
  const selectedProps = isPlainRecord(selectedItem?.props) ? selectedItem.props : {};
  const selectedId = typeof selectedProps.id === "string" ? selectedProps.id : id;
  const storedEntry = getValueAtPath(selectedProps, storagePath);
  const richEntry = isLexicalValue(storedEntry) ? { enabled: true, value: storedEntry } : isPlainRecord(storedEntry) ? storedEntry : {};
  const plainText = typeof value === "string" || typeof value === "number" ? String(value) : defaultText || "";
  const editorValue = isLexicalValue(richEntry.value) ? richEntry.value : isLexicalValue(value) ? value : emptyLexicalValue(plainText, defaultBlockType);

  const update = useCallback((nextValue: unknown) => {
    const item = selectedId ? getItemById(selectedId) : null;
    const selector = selectedId ? getSelectorForId(selectedId) : null;
    if (!item || !selector || !fieldPath.length || !storagePath.length) {
      onChange(getPlainTextFromLexical(nextValue));
      return;
    }
    const itemProps = item.props as Record<string, unknown>;
    const currentPlain = getValueAtPath(itemProps, fieldPath);
    const nextPlain = isLexicalValue(currentPlain) ? nextValue : getPlainTextFromLexical(nextValue);
    let nextProps = setValueAtPath(itemProps, fieldPath, nextPlain);
    nextProps = setValueAtPath(nextProps, storagePath, { enabled: true, value: nextValue });
    dispatch({ type: "replace", data: { ...item, props: { ...nextProps, id: selectedId } }, destinationIndex: selector.index, destinationZone: selector.zone, ui: { field: { focus: name }, itemSelector: selector, leftSideBarVisible: true, plugin: { current: "fields" }, rightSideBarVisible: false } });
  }, [dispatch, fieldPath, getItemById, getSelectorForId, name, onChange, selectedId, storagePath]);

  return <div className={styles.inspectorRichText}><span>{label}</span><PuckLexicalTextEditor compact defaultBlockType={defaultBlockType} onChange={update} readOnly={readOnly} toolbarLabel={label} toolbarMode="none" value={editorValue} /><small>Click the preview for formatting controls.</small></div>;
}

function ThemePanel({ initialTheme, initialTenantId, onPreviewTheme }: { initialTheme: TenantTheme; initialTenantId?: string; onPreviewTheme: (colors: ThemeColors) => void }) {
  const [tenantId, setTenantId] = useState(initialTenantId);
  const [colors, setColors] = useState<ThemeColors>(() => themeColors(initialTheme));
  const [status, setStatus] = useState("");

  const updateColor = useCallback((key: keyof ThemeColors, value: string) => {
    const next = { ...colors, [key]: value.toUpperCase() };
    setColors(next);
    onPreviewTheme(next);
    setStatus("Previewing unsaved colors");
  }, [colors, onPreviewTheme]);

  async function saveTheme() {
    if (THEME_FIELDS.some(({ key }) => !HEX_COLOR.test(colors[key]))) {
      setStatus("Each color needs a six-digit hex code");
      return;
    }
    setStatus("Saving…");
    try {
      const response = await fetch(tenantId ? `/api/tenants/${tenantId}` : "/api/tenants", { method: tenantId ? "PATCH" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tenantId ? { theme: colors } : { name: "NECYPAA XXXVI", logoAlt: "NECYPAA XXXVI", theme: colors }) });
      if (!response.ok) throw new Error(await response.text());
      const result = await response.json() as { doc?: { id?: string | number }; id?: string | number };
      const nextId = result.doc?.id ?? result.id;
      if (nextId != null) setTenantId(String(nextId));
      setStatus("Theme saved");
    } catch {
      setStatus("Could not save theme");
    }
  }

  return <div className={styles.themePlugin}><section aria-label="Site theme defaults" className={styles.themePanel}><div className={styles.themePanelHeading}><strong>Theme colors</strong><span>Changes preview instantly. Save when you want them applied across the entire site.</span></div><div className={styles.themeFields}>{THEME_FIELDS.map(({ key, label }) => <label key={key}><span>{label}</span><div><input aria-label={`${label} color picker`} onChange={(event) => updateColor(key, event.target.value)} type="color" value={colorPickerValue(colors[key])} /><input aria-invalid={!HEX_COLOR.test(colors[key])} aria-label={`${label} hex code`} maxLength={7} onChange={(event) => updateColor(key, event.target.value)} value={colors[key]} /></div></label>)}</div><footer><span aria-live="polite">{status}</span><button onClick={() => void saveTheme()} type="button"><Save /> Save theme</button></footer></section></div>;
}

function BuilderHeader({ children, pageId, pageTitle }: { children: React.ReactNode; pageId: string; pageTitle: string }) {
  return <header className={styles.header}><div className={styles.topline}><div className={styles.identity}><a aria-label="Back to page" href={`/admin/collections/pages/${pageId}`}><ArrowLeft /></a><div><span>Visual builder</span><strong>{pageTitle}</strong></div></div><div className={styles.headerControls}>{children}</div></div><div className={styles.richToolbarRow}><span className={styles.richToolbarHint}>Click any text in the preview to edit and format it.</span><div className={styles.richToolbarHost} id="necypaa-puck-rich-toolbar" /></div></header>;
}

function richTextEditorField(field: Record<string, unknown>, componentType: string) {
  return {
    ...field,
    type: "custom",
    contentEditable: false,
    render: ({ id, name, onChange, readOnly, value }: InspectorFieldRenderProps) => {
      const path = parseFieldPath(name);
      const fieldName = String(path[path.length - 1] || name);
      return <InspectorRichTextField defaultBlockType={defaultRichTextBlockType(componentType, fieldName, path.slice(0, -1))} defaultText={typeof field.richTextDefault === "string" ? field.richTextDefault : undefined} id={id} label={typeof field.label === "string" ? field.label : humanFieldLabel(fieldName)} name={name} onChange={onChange} readOnly={readOnly} value={value} />;
    },
  };
}

function enhanceRichTextFields(field: unknown, componentType: string): unknown {
  if (!field || typeof field !== "object" || Array.isArray(field)) return field;
  const record = field as Record<string, unknown>;
  if (record.type === "custom" && (record.richText === true || record.label === "Rich text")) return richTextEditorField(record, componentType);
  if (record.type === "array" && record.arrayFields && typeof record.arrayFields === "object") {
    return { ...record, arrayFields: Object.fromEntries(Object.entries(record.arrayFields as Record<string, unknown>).map(([key, value]) => [key, enhanceRichTextFields(value, componentType)])) };
  }
  return record;
}

type SelectedLocation = { index: number; zone?: string } | null;
type ClipboardState = { data: Data; ui: { itemSelector?: SelectedLocation } };
type ClipboardDispatch = (action: { type: "setData"; data: Partial<Data> }) => void;
type ClipboardPayload = { item: Data["content"][number]; zones: Record<string, unknown> };

function zoneContent(data: Data, zone?: string) {
  return zone && data.zones?.[zone] ? data.zones[zone] : data.content;
}

function freshCopy<T>(value: T): T {
  const source = JSON.parse(JSON.stringify(value)) as unknown;
  const visit = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(visit);
    if (!item || typeof item !== "object") return item;
    const record = item as Record<string, unknown>;
    if (typeof record.type === "string" && record.props && typeof record.props === "object") {
      const nextId = `${record.type}-${crypto.randomUUID()}`;
      const next = Object.fromEntries(Object.entries(record).map(([key, entry]) => [key, visit(entry)]));
      next.id = nextId;
      next.props = { ...(next.props as Record<string, unknown>), id: nextId };
      return next;
    }
    const next = Object.fromEntries(Object.entries(record).map(([key, entry]) => [key, visit(entry)]));
    if (typeof record.id === "string") {
      next.id = `${record.type || "item"}-${crypto.randomUUID()}`;
    }
    return next;
  };
  return visit(source) as T;
}

function ClipboardActions({ state, dispatch }: { state: ClipboardState; dispatch: ClipboardDispatch }) {
  const selection = state.ui.itemSelector;
  const source = selection ? zoneContent(state.data, selection.zone)?.[selection.index] : null;
  const copy = useCallback(() => {
    if (!source) return;
    const sourceId = typeof source.props?.id === "string" ? source.props.id : "";
    const zones = Object.fromEntries(Object.entries(state.data.zones || {}).filter(([key]) => sourceId && key.startsWith(`${sourceId}:`)));
    sessionStorage.setItem("necypaa:puck-clipboard", JSON.stringify({ item: source, zones } satisfies ClipboardPayload));
  }, [source, state.data.zones]);
  const paste = useCallback(() => {
    const stored = sessionStorage.getItem("necypaa:puck-clipboard");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as ClipboardPayload | Data["content"][number];
      const payload = "item" in parsed ? parsed : { item: parsed, zones: {} };
      const item = freshCopy(payload.item) as Data["content"][number];
      const zone = selection?.zone;
      const current = [...zoneContent(state.data, zone)];
      current.splice(selection ? selection.index + 1 : current.length, 0, item);
      const oldId = typeof payload.item.props?.id === "string" ? payload.item.props.id : "";
      const newId = typeof item.props?.id === "string" ? item.props.id : "";
      const copiedZones = Object.fromEntries(Object.entries(payload.zones).map(([key, value]) => [newId && oldId ? `${newId}${key.slice(oldId.length)}` : key, freshCopy(value) as Data["content"]])) as Record<string, Data["content"]>;
      dispatch({ type: "setData", data: zone ? { ...state.data, zones: { ...state.data.zones, ...copiedZones, [zone]: current } } : { ...state.data, zones: { ...state.data.zones, ...copiedZones }, content: current } });
    } catch {
      sessionStorage.removeItem("necypaa:puck-clipboard");
    }
  }, [dispatch, selection, state.data]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || (event.target instanceof HTMLElement && (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)))) return;
      if (event.key.toLowerCase() === "c") { event.preventDefault(); copy(); }
      if (event.key.toLowerCase() === "v") { event.preventDefault(); paste(); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [copy, paste]);
  return <><button aria-label="Copy selected block" disabled={!source} onClick={copy} title="Copy selected block" type="button"><Clipboard /></button><button aria-label="Paste block" onClick={paste} title="Paste block after selection" type="button"><ClipboardPaste /></button></>;
}

function BuilderHeaderActions({ message, onPublish }: { message: string; onPublish: (data: Data) => void }) {
  const appState = usePuck((state) => state.appState) as ClipboardState;
  const dispatch = usePuck((state) => state.dispatch) as ClipboardDispatch;
  return <div className={styles.publish}><ClipboardActions dispatch={dispatch} state={appState} /><span aria-live="polite">{message}</span><button onClick={() => onPublish(appState.data)} type="button">Publish</button></div>;
}

type BlockPalette = "sections" | "rows" | "elements";

const BLOCK_LIBRARY: Record<string, { icon?: React.ReactNode; label: string; rowColumns?: number[] }> = {
  HeroCountdown: { icon: <LayoutTemplate />, label: "Countdown Hero" },
  About: { icon: <FileText />, label: "Introduction" },
  MeetingInfo: { icon: <ListTree />, label: "Meeting Details" },
  Events: { icon: <GalleryHorizontal />, label: "Events" },
  MeetingDirectory: { icon: <ListTree />, label: "Meeting Directory" },
  CTMeetingSchedule: { icon: <ListTree />, label: "CT Meeting schedule" },
  ProgramSchedule: { icon: <ListTree />, label: "Program Schedule" },
  CallToAction: { icon: <MousePointerClick />, label: "Action Banner" },
  IssuesSection: { icon: <HandHeart />, label: "Feature Section" },
  IssueCards: { icon: <Columns2 />, label: "Feature Cards" },
  QuoteBlock: { icon: <Quote />, label: "Quote" },
  ResultsStats: { icon: <BarChart3 />, label: "Statistics" },
  SupporterLogos: { icon: <HandHeart />, label: "Partner Logos" },
  ActionTabs: { icon: <ListTree />, label: "Content Tabs" },
  MediaGallery: { icon: <GalleryHorizontal />, label: "Media Gallery" },
  Navigation: { icon: <ListTree />, label: "Navigation" },
  Section: { icon: <LayoutTemplate />, label: "Section" },
  Column: { icon: <Columns2 />, label: "Column" },
  Row: { icon: <Columns2 />, label: "Row" },
  Text: { icon: <Type />, label: "Text" },
  Button: { icon: <MousePointerClick />, label: "Button" },
  Countdown: { icon: <LayoutTemplate />, label: "Countdown" },
  Headline: { icon: <Type />, label: "Headline" },
  Divider: { icon: <Box />, label: "Divider" },
  FollowLinks: { icon: <MousePointerClick />, label: "Follow Links" },
  BulletedList: { icon: <ListTree />, label: "Bulleted List" },
  InlineForm: { icon: <FileText />, label: "Inline Form" },
  ImageCaption: { icon: <ImageIcon />, label: "Image + Caption" },
  Video: { icon: <GalleryHorizontal />, label: "Video" },
  Embed: { icon: <Box />, label: "Embed" },
  PayPal: { icon: <MousePointerClick />, label: "PayPal Button" },
  ContentRow: { icon: <Columns2 />, label: "Custom Row" },
  RowOneColumn: { label: "1 Column", rowColumns: [1] },
  RowTwoColumns: { label: "2 Columns", rowColumns: [1, 1] },
  RowLeftWide: { label: "Left Wide", rowColumns: [2, 1] },
  RowRightWide: { label: "Right Wide", rowColumns: [1, 2] },
  RowThreeColumns: { label: "3 Columns", rowColumns: [1, 1, 1] },
  RowFourColumns: { label: "4 Columns", rowColumns: [1, 1, 1, 1] },
  ButtonRow: { icon: <MousePointerClick />, label: "Button Row" },
  Image: { icon: <ImageIcon />, label: "Image" },
  RichText: { icon: <TextQuote />, label: "Rich Text" },
  FreeText: { icon: <Type />, label: "Text Snippet" },
};

const BLOCK_PALETTES: Array<{ blocks: string[]; description: string; id: BlockPalette; label: string }> = [
  {
    id: "sections",
    label: "Sections",
    description: "Complete, ready-to-customize page sections.",
    blocks: ["HeroCountdown", "About", "MeetingInfo", "Events", "MeetingDirectory", "CTMeetingSchedule", "ProgramSchedule", "CallToAction", "IssuesSection", "IssueCards", "QuoteBlock", "ResultsStats", "SupporterLogos", "ActionTabs", "MediaGallery", ...campaignAltTypesByPalette.sections],
  },
  {
    id: "rows",
    label: "Rows",
    description: "Flexible column layouts for custom page compositions.",
    blocks: ["Section", "RowOneColumn", "RowTwoColumns", "RowLeftWide", "RowRightWide", "RowThreeColumns", "RowFourColumns", "Column", ...campaignAltTypesByPalette.rows],
  },
  {
    id: "elements",
    label: "Elements",
    description: "Smaller building blocks for rows, cards, and tabs.",
    blocks: [...nestedElementTypes, ...campaignAltTypesByPalette.elements],
  },
];

const READY_SECTION_BLOCKS = new Set([
  "HeroAlt",
  "AboutAlt",
  "CardsGridAlt",
  "PalmCardPointsAlt",
  "PalmCardBioAlt",
  "TestimonialAlt",
  "PalmCardAlt",
  "PalmCardContactAlt",
]);

const CAMPAIGN_ALT_LABELS = Object.fromEntries(campaignAltDefinitions.map((definition) => [definition.type, definition.label])) as Record<string, string>;

function blockPaletteLabel(name: string) {
  return BLOCK_LIBRARY[name]?.label || CAMPAIGN_ALT_LABELS[name] || name.replace(/([A-Z])/g, " $1").trim();
}

function PaletteTabIcon({ palette }: { palette: BlockPalette }) {
  const Icon = palette === "sections" ? LayoutTemplate : palette === "rows" ? Columns2 : Box;
  return <span className={styles.blockPaletteTabIcon}><Icon aria-hidden="true" /></span>;
}

function RowSkeleton({ columns }: { columns: number[] }) {
  return <span className={styles.blockPaletteRowSkeleton}>{columns.map((column, index) => <span key={index} style={{ flex: column }} />)}</span>;
}

function BlockPaletteItem({ name }: { children?: React.ReactNode; name: string }) {
  const item = BLOCK_LIBRARY[name] || { icon: <Box />, label: blockPaletteLabel(name) };
  return <div className={styles.blockPaletteItem} data-kind={item.rowColumns ? "row" : "standard"}>
    {item.rowColumns ? <RowSkeleton columns={item.rowColumns} /> : <span className={styles.blockPaletteIcon}>{item.icon}</span>}
    <span className={styles.blockPaletteLabel}>{item.label}</span>
  </div>;
}

function BlockDrawerPanel({ palette }: { palette: (typeof BLOCK_PALETTES)[number] }) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const matchingBlocks = palette.blocks.filter((name) => blockPaletteLabel(name).toLocaleLowerCase().includes(normalizedQuery));
  const readyBlocks = palette.id === "sections" && !normalizedQuery ? matchingBlocks.filter((name) => READY_SECTION_BLOCKS.has(name)) : [];
  const remainingBlocks = readyBlocks.length ? matchingBlocks.filter((name) => !READY_SECTION_BLOCKS.has(name)) : matchingBlocks;
  const renderBlocks = (blocks: string[]) => <Drawer>{blocks.map((name) => <Drawer.Item key={name} label={blockPaletteLabel(name)} name={name}>{BlockPaletteItem}</Drawer.Item>)}</Drawer>;

  return <div aria-label={`${palette.label}. ${palette.description}`} className={styles.blockDrawerPanel} data-palette={palette.id}>
    <div className={styles.blockDrawerHeader}><strong>{palette.label}</strong><span>{matchingBlocks.length}</span></div>
    <label className={styles.blockDrawerSearch}>
      <Search aria-hidden="true" />
      <input aria-label={`Search ${palette.label.toLocaleLowerCase()}`} onChange={(event) => setQuery(event.target.value)} placeholder="Search blocks" type="search" value={query} />
    </label>
    {matchingBlocks.length ? <>
      {readyBlocks.length ? <section className={styles.blockDrawerGroup}>
        <h3>Ready to use</h3>
        {renderBlocks(readyBlocks)}
      </section> : null}
      {remainingBlocks.length ? <section className={styles.blockDrawerGroup}>
        {readyBlocks.length ? <h3>More sections</h3> : null}
        {renderBlocks(remainingBlocks)}
      </section> : null}
    </> : <p className={styles.blockDrawerEmpty}>No matching blocks.</p>}
  </div>;
}

function BlockLibraryPanel({ palette }: { palette: (typeof BLOCK_PALETTES)[number] }) {
  return <div className={styles.blockLibraryPanel}><BlockDrawerPanel palette={palette} /></div>;
}

function createBlockLibraryPlugin(palette: (typeof BLOCK_PALETTES)[number]): Plugin {
  // Reuse Puck's built-in key for Sections so the catch-all Blocks tab is replaced.
  const name = palette.id === "sections" ? "blocks" : `library-${palette.id}`;
  return { name, label: palette.label, icon: <PaletteTabIcon palette={palette.id} />, render: () => <BlockLibraryPanel palette={palette} /> };
}

export function PuckPageBuilderEditor({ initialData, pageId, pageSlug, pageTitle, tenantId, tenantTheme }: { initialData: NECYPAAData; pageId: string; pageSlug: string; pageTitle: string; tenantId?: string; tenantTheme: TenantTheme }) {
  const [data, setData] = useState(initialData);
  const [previewTheme, setPreviewTheme] = useState<ThemeColors>(() => themeColors(tenantTheme));
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

  const overrides = useMemo(() => ({
    header: ({ children }: { children: React.ReactNode }) => <BuilderHeader pageId={pageId} pageTitle={pageTitle}>{children}</BuilderHeader>,
    headerActions: () => <BuilderHeaderActions message={message} onPublish={(next) => void save(next, true)} />,
    ...(pageSlug === "home" ? { iframe: ThemePreviewFrame } : {}),
  }), [message, pageId, pageSlug, pageTitle, save]);
  const plugins = useMemo<Plugin[]>(() => [
    ...BLOCK_PALETTES.map(createBlockLibraryPlugin),
    fieldsPlugin({ desktopSideBar: "left" }),
    ...(pageSlug === "home" ? [{ name: "theme", label: "Theme", icon: <Palette />, render: () => <ThemePanel initialTenantId={tenantId} initialTheme={tenantTheme} onPreviewTheme={setPreviewTheme} /> }] : []),
  ], [pageSlug, tenantId, tenantTheme]);
  const editorConfig = useMemo(() => {
    const richComponents = Object.fromEntries(Object.entries(puckConfig.components).map(([type, component]) => {
      const fields = Object.fromEntries(Object.entries(component.fields || {}).map(([fieldName, field]) => [fieldName, enhanceRichTextFields(field, type)]));
      const RenderComponent = component.render as unknown as React.ComponentType<Record<string, unknown>>;
      return [type, {
        ...component,
        fields,
        render: (props: Record<string, unknown>) => <CanvasRichTextBlock componentType={type} fields={fields} RenderComponent={RenderComponent} props={props} />,
      }];
    }));
    return {
      ...puckConfig,
      components: richComponents,
    };
  }, []);
  return <ThemePreviewContext.Provider value={previewTheme}><div className={styles.wrapper}><Puck config={editorConfig as unknown as Config} data={data} height="100dvh" onChange={(next) => setData(next as NECYPAAData)} onPublish={(next) => save(next, true)} overrides={overrides} permissions={{ delete: true, drag: true, duplicate: true, edit: true, insert: true }} plugins={plugins} viewports={[{ width: 390, height: "auto", label: "Mobile" }, { width: 768, height: "auto", label: "Tablet" }, { width: 1280, height: "auto", label: "Desktop" }]} /></div></ThemePreviewContext.Provider>;
}
