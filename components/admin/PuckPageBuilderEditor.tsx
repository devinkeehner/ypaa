"use client";

import "@puckeditor/core/puck.css";

import { Drawer, fieldsPlugin, Puck, type Config, type Data, type Plugin } from "@puckeditor/core";
import { ArrowLeft, BarChart3, Box, Clipboard, ClipboardPaste, Columns2, Contrast, FileText, GalleryHorizontal, HandHeart, ImageIcon, LayoutTemplate, ListTree, Moon, MousePointerClick, Palette, Quote, Save, Search, Sparkles, Sun, TextQuote, Type } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { normalizePuckRichTextData, puckConfig } from "@/puck/config";
import { campaignAltDefinitions } from "@/puck/campaign-alt-definitions";
import { ELEMENT_DROP_TYPES, REUSABLE_ROW_TYPES, REUSABLE_SECTION_TYPES } from "@/puck/drop-zones";
import type { NECYPAAData } from "@/puck/types";
import type { TenantTheme } from "@/components/site/TenantThemeProvider";

import styles from "./puck-builder.module.css";
import { usePuck } from "./puck-context";

type ThemeColors = Pick<TenantTheme, "primary" | "secondary" | "accent" | "background" | "surface" | "lightBackground" | "darkText" | "lightText">;
type PreviewMode = "dark" | "light";
type ThemePreview = { colors: ThemeColors; contrast: boolean; mode: PreviewMode };
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
const ThemePreviewContext = createContext<ThemePreview | null>(null);

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
  const preview = useContext(ThemePreviewContext);
  const className = preview ? `tenant-theme theme-${preview.mode}${preview.contrast ? " high-contrast" : ""}` : "tenant-theme theme-dark";
  return <div className={className} style={preview ? themeVariables(preview.colors) : undefined}>{children}</div>;
}

function colorPickerValue(value: string) {
  return HEX_COLOR.test(value) ? value : "#000000";
}

function relativeLuminance(hex: string) {
  const channels = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
}

function contrastRatio(first: string, second: string) {
  if (!HEX_COLOR.test(first) || !HEX_COLOR.test(second)) return 0;
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + .05) / (darker + .05);
}

function ThemePanel({ initialTheme, initialTenantId, onPreviewTheme }: { initialTheme: TenantTheme; initialTenantId?: string; onPreviewTheme: (colors: ThemeColors) => void }) {
  const [tenantId, setTenantId] = useState(initialTenantId);
  const [colors, setColors] = useState<ThemeColors>(() => themeColors(initialTheme));
  const [status, setStatus] = useState("");
  const contrastWarnings = useMemo(() => [
    { background: colors.background, foreground: colors.lightText, label: "Text on dark background" },
    { background: colors.surface, foreground: colors.lightText, label: "Text on dark surface" },
    { background: colors.lightBackground, foreground: colors.darkText, label: "Text on light background" },
    { background: colors.primary, foreground: colors.lightText, label: "Text on primary buttons" },
    { background: colors.secondary, foreground: colors.lightText, label: "Text on secondary backgrounds" },
    { background: colors.accent, foreground: colors.darkText, label: "Text on accent backgrounds" },
  ].map((pair) => ({ ...pair, ratio: contrastRatio(pair.background, pair.foreground) })).filter((pair) => pair.ratio < 4.5), [colors]);

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

  return <div className={styles.themePlugin}><section aria-label="Site theme defaults" className={styles.themePanel}><div className={styles.themePanelHeading}><strong>Theme colors</strong><span>Changes preview instantly. Save when you want them applied across the entire site.</span></div><div className={styles.themeFields}>{THEME_FIELDS.map(({ key, label }) => <label key={key}><span>{label}</span><div><input aria-label={`${label} color picker`} onChange={(event) => updateColor(key, event.target.value)} type="color" value={colorPickerValue(colors[key])} /><input aria-invalid={!HEX_COLOR.test(colors[key])} aria-label={`${label} hex code`} maxLength={7} onChange={(event) => updateColor(key, event.target.value)} value={colors[key]} /></div></label>)}</div>{contrastWarnings.length ? <div aria-live="polite" className={styles.contrastWarnings}><strong>Contrast review</strong><p>These pairs are below 4.5:1 for normal text:</p><ul>{contrastWarnings.map((warning) => <li key={warning.label}>{warning.label}: {warning.ratio.toFixed(2)}:1</li>)}</ul></div> : <p className={styles.contrastPass}>All standard text pairs meet 4.5:1 contrast.</p>}<footer><span aria-live="polite">{status}</span><button onClick={() => void saveTheme()} type="button"><Save /> Save theme</button></footer></section></div>;
}

function PreviewControls({ contrast, mode, onContrastChange, onModeChange }: { contrast: boolean; mode: PreviewMode; onContrastChange: (value: boolean) => void; onModeChange: (mode: PreviewMode) => void }) {
  return <div aria-label="Preview display" className={styles.previewControls} role="group"><button aria-label="Preview dark theme" aria-pressed={mode === "dark"} onClick={() => onModeChange("dark")} title="Dark preview" type="button"><Moon /></button><button aria-label="Preview light theme" aria-pressed={mode === "light"} onClick={() => onModeChange("light")} title="Light preview" type="button"><Sun /></button><button aria-label="Preview extra contrast" aria-pressed={contrast} onClick={() => onContrastChange(!contrast)} title="Extra contrast preview" type="button"><Contrast /></button></div>;
}

function BuilderHeader({ children, contrast, mode, onContrastChange, onModeChange, pageId, pageTitle }: { children: React.ReactNode; contrast: boolean; mode: PreviewMode; onContrastChange: (value: boolean) => void; onModeChange: (mode: PreviewMode) => void; pageId: string; pageTitle: string }) {
  return <header className={styles.header}><div className={styles.topline}><div className={styles.identity}><a aria-label="Back to page" href={`/admin/collections/pages/${pageId}`}><ArrowLeft /></a><div><span>Visual builder</span><strong>{pageTitle}</strong></div></div><PreviewControls contrast={contrast} mode={mode} onContrastChange={onContrastChange} onModeChange={onModeChange} /><div className={styles.headerControls}>{children}</div></div><div className={styles.richToolbarRow}><span className={styles.richToolbarHint}>Click any text in the preview to edit and format it.</span><div className={styles.richToolbarHost} id="necypaa-puck-rich-toolbar" /></div></header>;
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

function BuilderHeaderActions({ message, onPublish }: { message: string; onPublish: () => void }) {
  const appState = usePuck((state) => state.appState) as ClipboardState;
  const dispatch = usePuck((state) => state.dispatch) as ClipboardDispatch;
  return <div className={styles.publish}><ClipboardActions dispatch={dispatch} state={appState} /><span aria-live="polite">{message}</span><button onClick={onPublish} type="button">Publish</button></div>;
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
  Icon: { icon: <Sparkles />, label: "Icon" },
  Countdown: { icon: <LayoutTemplate />, label: "Countdown" },
  Headline: { icon: <Type />, label: "Headline" },
  Divider: { icon: <Box />, label: "Divider" },
  FollowLinks: { icon: <MousePointerClick />, label: "Follow Links" },
  BulletedList: { icon: <ListTree />, label: "Bulleted List" },
  InlineForm: { icon: <FileText />, label: "Inline Form" },
  ImageCaption: { icon: <ImageIcon />, label: "Image + Caption" },
  Video: { icon: <GalleryHorizontal />, label: "Video" },
  Embed: { icon: <Box />, label: "Embed" },
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
    blocks: REUSABLE_SECTION_TYPES,
  },
  {
    id: "rows",
    label: "Rows",
    description: "Flexible column layouts for custom page compositions.",
    blocks: REUSABLE_ROW_TYPES,
  },
  {
    id: "elements",
    label: "Elements",
    description: "Smaller building blocks for rows, cards, and tabs.",
    blocks: ELEMENT_DROP_TYPES,
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
        {readyBlocks.length ? <h3>More reusable sections</h3> : null}
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
  const data = useMemo(() => normalizePuckRichTextData(initialData, true), [initialData]);
  const [previewTheme, setPreviewTheme] = useState<ThemeColors>(() => themeColors(tenantTheme));
  const [previewMode, setPreviewMode] = useState<PreviewMode>("dark");
  const [previewContrast, setPreviewContrast] = useState(false);
  const preview = useMemo(() => ({ colors: previewTheme, contrast: previewContrast, mode: previewMode }), [previewContrast, previewMode, previewTheme]);
  const latest = useRef(data);
  const lastSaved = useRef(JSON.stringify(data));
  const timer = useRef<number | null>(null);
  const publishTimer = useRef<number | null>(null);
  const saving = useRef(false);
  const pendingSave = useRef(false);
  const pendingPublish = useRef(false);
  const [message, setMessage] = useState("Autosave on");
  const messageRef = useRef(message);
  messageRef.current = message;

  const save = useCallback(async (next: Data, publish = false) => {
    if (saving.current) {
      pendingSave.current = true;
      pendingPublish.current = pendingPublish.current || publish;
      return;
    }
    saving.current = true;
    setMessage(publish ? "Publishing…" : "Saving…");
    try {
      const response = await fetch(`/api/puck/pages/${pageId}${publish ? "/publish" : ""}`, { method: publish ? "POST" : "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: next }) });
      if (!response.ok) throw new Error(await response.text());
      lastSaved.current = JSON.stringify(next);
      setMessage(publish ? "Published" : "Saved");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save"); }
    finally {
      saving.current = false;
      if (pendingSave.current) {
        const shouldPublish = pendingPublish.current;
        pendingSave.current = false;
        pendingPublish.current = false;
        const current = latest.current;
        if (shouldPublish || JSON.stringify(current) !== lastSaved.current) void save(current, shouldPublish);
      }
    }
  }, [pageId]);

  const scheduleSave = useCallback(() => {
    if (JSON.stringify(latest.current) === lastSaved.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      void save(latest.current);
    }, 900);
  }, [save]);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
    if (publishTimer.current) window.clearTimeout(publishTimer.current);
  }, []);

  const publishLatest = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    if (publishTimer.current) window.clearTimeout(publishTimer.current);
    // Give a focused rich-text field one frame to commit its blur update, then
    // publish the newest Puck value through the same serialized save queue.
    publishTimer.current = window.setTimeout(() => {
      publishTimer.current = null;
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      void save(latest.current, true);
    }, 150);
  }, [save]);

  const handleDataChange = useCallback((next: Data) => {
    const nextData = next as NECYPAAData;
    latest.current = nextData;
    scheduleSave();
  }, [scheduleSave]);

  const overrides = useMemo(() => ({
    header: ({ children }: { children: React.ReactNode }) => <BuilderHeader contrast={previewContrast} mode={previewMode} onContrastChange={setPreviewContrast} onModeChange={setPreviewMode} pageId={pageId} pageTitle={pageTitle}>{children}</BuilderHeader>,
    headerActions: () => <BuilderHeaderActions message={messageRef.current} onPublish={publishLatest} />,
    iframe: ThemePreviewFrame,
  }), [pageId, pageTitle, previewContrast, previewMode, publishLatest]);
  const plugins = useMemo<Plugin[]>(() => [
    ...BLOCK_PALETTES.map(createBlockLibraryPlugin),
    fieldsPlugin({ desktopSideBar: "left" }),
    ...(pageSlug === "home" ? [{ name: "theme", label: "Theme", icon: <Palette />, render: () => <ThemePanel initialTenantId={tenantId} initialTheme={tenantTheme} onPreviewTheme={setPreviewTheme} /> }] : []),
  ], [pageSlug, tenantId, tenantTheme]);
  return <ThemePreviewContext.Provider value={preview}><div className={`${styles.wrapper} tenant-theme theme-${previewMode}${previewContrast ? " high-contrast" : ""}`} style={themeVariables(previewTheme)}><Puck config={puckConfig as unknown as Config} data={data} height="100dvh" onChange={handleDataChange} onPublish={publishLatest} overrides={overrides} permissions={{ delete: true, drag: true, duplicate: true, edit: true, insert: true }} plugins={plugins} viewports={[{ width: 390, height: "auto", label: "Mobile" }, { width: 768, height: "auto", label: "Tablet" }, { width: 1280, height: "auto", label: "Desktop" }]} /></div></ThemePreviewContext.Provider>;
}
