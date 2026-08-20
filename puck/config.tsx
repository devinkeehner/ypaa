"use client";

import { Render, type ComponentConfig, type Config, type Field } from "@puckeditor/core";
import { BadgeDollarSign, BriefcaseBusiness, CalendarDays, Check, ChevronDown, ChevronRight, Heading, HeartHandshake, Landmark, MapPin, Megaphone, ShieldCheck, Users, Vote, X } from "lucide-react";
import { createContext, Fragment, isValidElement, useContext, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import { Countdown } from "@/components/site/Countdown";
import { ProgramExplorer } from "@/components/site/ProgramExplorer";
import { PuckRichTextSwitchField } from "@/components/admin/PuckRichTextSwitchField";
import { PuckCanvasRichTextField } from "@/components/admin/PuckCanvasRichTextContext";
import { isLexicalValue, type LexicalBlockType } from "@/puck/lexical-value";
import { layoutColumnCount } from "@/puck/layout-utils.mjs";
import { lexicalToHTML, normalizeNativeRichTextProps, richTextToPlainText, type NativeRichTextField } from "@/puck/native-rich-text";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
  normalizeScheduleMeetings,
  normalizeUpcomingEvents,
} from "@/puck/list-values";
import type { ImportantDate, MediaValue, MeetingListing, PastEvent, ScheduleMeeting, UpcomingEvent } from "@/puck/list-values";
import { ctMeetingSchedule } from "@/puck/ct-meeting-schedule-data";
import { campaignAltDefinitions, campaignAltTypes, campaignAltTypesByPalette, type CampaignAltDefinition, type CampaignAltType } from "@/puck/campaign-alt-definitions";
import { AFTER_CONTENT_BLOCK_TYPES, ELEMENT_DROP_TYPES } from "@/puck/drop-zones";
import type { NECYPAAData } from "@/puck/types";

import styles from "./puck.module.css";

function summaryText(value: unknown): string {
  if (typeof value === "string") return richTextToPlainText(value).trim();
  if (typeof value === "number") return String(value);
  if (!value || typeof value !== "object") return "";
  if (Array.isArray(value)) return value.map(summaryText).filter(Boolean).join(" ");

  const record = value as Record<string, unknown>;
  if (typeof record.text === "string") return record.text.trim();
  return Object.values(record).map(summaryText).filter(Boolean).join(" ");
}

function itemSummary(fallback: string, ...values: unknown[]): string {
  return values.map(summaryText).find(Boolean) || fallback;
}

function slotLabel(value: unknown, fallback: string): string {
  if (typeof value === "string") return value.trim() || fallback;
  if (typeof value === "number") return String(value);
  return fallback;
}

type Base = { id?: string };
type CanvasBase = Base & { puck?: { isEditing?: boolean } };
const PuckRenderPropsContext = createContext<CanvasBase | undefined>(undefined);

function PuckRenderContent({ render, props }: { render: (props: Record<string, unknown>) => ReactNode; props: Record<string, unknown> }) {
  return <>{render(props)}</>;
}

function PuckRenderScope({ render, props }: { render: (props: Record<string, unknown>) => ReactNode; props: Record<string, unknown> }) {
  return <PuckRenderPropsContext.Provider value={props as CanvasBase}><PuckRenderContent props={props} render={render} /></PuckRenderPropsContext.Provider>;
}

function richStoragePath(path: string) {
  const index = path.lastIndexOf(".");
  return index === -1 ? `puckRichText.${path}` : `${path.slice(0, index)}.puckRichText.${path.slice(index + 1)}`;
}

function hasEnabledRichText(props: Record<string, unknown>, path: string, value: unknown) {
  const parts = richStoragePath(path).replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
  const entry = parts.reduce<unknown>((current, part) => {
    if (current == null) return undefined;
    return Array.isArray(current) ? current[Number(part)] : typeof current === "object" ? (current as Record<string, unknown>)[part] : undefined;
  }, props);
  return isLexicalValue(value) || isLexicalValue(entry) || Boolean(entry && typeof entry === "object" && !Array.isArray(entry) && (entry as Record<string, unknown>).enabled);
}
type NestedSlot = (options?: { allow?: string[]; className?: string; minEmptyHeight?: number }) => ReactNode;
type NestedSlotValue = NestedSlot | unknown[];
type Hero = Base & {
  eyebrow: string;
  heading: string;
  body: string;
  eventDate: string;
  eventLocation: string;
  countdownTarget: string;
  registerLabel: string;
  registerUrl: string;
  hotelLabel: string;
  hotelUrl: string;
  foregroundImage?: MediaValue | null;
  backgroundImage?: MediaValue | null;
  backgroundPosterImage?: MediaValue | null;
  backgroundDarkness: number;
  /** Retained so older pages that used the original single image field keep working. */
  image?: MediaValue | null;
};
type About = Base & { eyebrow: string; heading: string; body: string; advisoryHeading: string; advisoryBody: string; image?: MediaValue | null };
type Meeting = Base & { eyebrow: string; heading: string; body: string; date: string; time: string; location: string; actionLabel: string; actionUrl: string; importantDates: ImportantDate[] };
type Events = Base & { eyebrow: string; heading: string; upcomingLabel: string; upcomingTitle: string; upcomingBody: string; upcomingDate: string; upcomingLocation: string; upcomingImage?: MediaValue | null; upcomingEvents: UpcomingEvent[]; pastEvents: PastEvent[] };
type Directory = Base & { eyebrow: string; heading: string; body: string; meetings: MeetingListing[] };
type CTMeetingSchedule = Base & { heading: string; introduction: string; meetings: ScheduleMeeting[] };
type CTA = Base & { eyebrow: string; heading: string; body: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; image?: MediaValue | null };
type ImageBlock = Base & { image?: MediaValue | null; caption: string; aspectRatio: "natural" | "landscape" | "portrait" | "square"; width: "full" | "wide" | "content" };
type FreeText = Base & { text: string; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };
type TextBlockProps = Base & { text: string; fontSize: string; color: string; alignment: "left" | "center" | "right" };
type ButtonBlockProps = Base & { label: string; url: string; style: "solid" | "outline" };
type CountdownBlockProps = Base & { target: string; label: string };
type RichTextSection = Base & { content: unknown; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };
type ProgramSchedule = Base & { heading: string; introduction: string };
type ButtonRow = Base & { primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; alignment: "left" | "center" | "right" };
type Issue = { title: string; body: string; icon: string };
type IssuesSection = Base & { eyebrow: string; heading: string; body: string; issues: Issue[] };
type IssueCard = { label: string; heading: string; body: string; image?: MediaValue | null; linkLabel?: string; linkUrl?: string; blocks?: NestedSlotValue };
type IssueCards = Base & { heading: string; intro: string; variant: "cards" | "editorial" | "image"; cards: IssueCard[] };
type Quote = Base & { heading: string; quote: string; attribution: string; role: string; image?: MediaValue | null };
type ResultStat = { value: string; label: string; detail: string };
type ResultsStats = Base & { heading: string; intro: string; stats: ResultStat[] };
type SupporterLogo = { name: string; image?: MediaValue | null };
type SupporterLogos = Base & { heading: string; intro: string; logos: SupporterLogo[] };
type ActionTab = { label: string; description: string; blocks?: NestedSlotValue };
type ActionTabs = Base & { heading: string; intro: string; tabs: ActionTab[] };
type GalleryItem = { image?: MediaValue | null; caption: string; size: "small" | "medium" | "large" };
type MediaGallery = Base & { heading: string; intro: string; items: GalleryItem[] };
type ContentColumn = { label: string; blocks?: NestedSlotValue };
type Section = Base & { heading: string; background: "light" | "dark" | "muted" | "themeLight" | "themeDark" | "themeSurface" | "themePrimary" | "themeSecondary" | "themeAccent"; blocks?: NestedSlotValue };
type Column = Base & { label: string; blocks?: NestedSlotValue };
type LinkItem = { label: string; url: string };
type Navigation = Base & { brand: string; links: LinkItem[] };
type Headline = Base & { text: string; level: "h1" | "h2" | "h3"; alignment: "left" | "center" | "right" };
type Divider = Base & { style: "solid" | "dashed" | "dotted"; color: string };
type FollowLinks = Base & { heading: string; links: LinkItem[] };
type BulletedList = Base & { items: { text: string }[] };
type InlineForm = Base & { heading: string; intro: string; submitLabel: string; actionUrl: string; fields: { label: string; name: string; type: "text" | "email" }[] };
type ImageCaption = Base & { image?: MediaValue | null; caption: string };
type Video = Base & { video?: MediaValue | null; url: string; caption: string };
type Embed = Base & { url: string; title: string };
type PayPal = Base & { label: string; url: string; amount: string };
type ContentRow = Base & { layout: "one" | "two" | "leftWide" | "rightWide" | "three" | "four"; columns: ContentColumn[]; column1?: NestedSlotValue; column2?: NestedSlotValue; column3?: NestedSlotValue; column4?: NestedSlotValue; puck?: { isEditing?: boolean } };
type CampaignAltItem = { id?: number | string; label?: string; heading?: string; text?: string; value?: string; linkLabel?: string; url?: string; icon?: string; attribution?: string; role?: string; image?: MediaValue | null };
type CampaignAltSlotItem = CampaignAltItem & { blocks?: NestedSlotValue };
type CampaignAltProps = Base & { variant: string; presentation: string; eyebrow: string; heading: string; intro: string; body: string; media?: MediaValue | null; backgroundMedia?: MediaValue | null; headingLogo?: MediaValue | null; qrImage?: MediaValue | null; highlightTitle: string; highlightText: string; backgroundOverlay: string; textPanelColor: string; textPanelOpacity: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; quote: string; quoteAttribution: string; electionDay: string; earlyVote: string; phone: string; email: string; website: string; qrCaption: string; disclaimer: string; afterContent?: NestedSlotValue; items: CampaignAltItem[]; cards: CampaignAltSlotItem[]; columns: CampaignAltSlotItem[]; tabs: CampaignAltSlotItem[]; puck?: { isEditing?: boolean } };
type CampaignAltComponents = { [K in CampaignAltType]: CampaignAltProps };

type Components = { HeroCountdown: Hero; About: About; MeetingInfo: Meeting; Events: Events; MeetingDirectory: Directory; CTMeetingSchedule: CTMeetingSchedule; CallToAction: CTA; Image: ImageBlock; RichText: RichTextSection; FreeText: FreeText; Text: TextBlockProps; Button: ButtonBlockProps; Countdown: CountdownBlockProps; Section: Section; Column: Column; ProgramSchedule: ProgramSchedule; ButtonRow: ButtonRow; IssuesSection: IssuesSection; IssueCards: IssueCards; QuoteBlock: Quote; ResultsStats: ResultsStats; SupporterLogos: SupporterLogos; ActionTabs: ActionTabs; MediaGallery: MediaGallery; Navigation: Navigation; Headline: Headline; Divider: Divider; FollowLinks: FollowLinks; BulletedList: BulletedList; InlineForm: InlineForm; ImageCaption: ImageCaption; Video: Video; Embed: Embed; PayPal: PayPal; ContentRow: ContentRow; Row: ContentRow; RowOneColumn: ContentRow; RowTwoColumns: ContentRow; RowLeftWide: ContentRow; RowRightWide: ContentRow; RowThreeColumns: ContentRow; RowFourColumns: ContentRow } & CampaignAltComponents;

const campaignAltEditableFields = Object.fromEntries(campaignAltDefinitions.map((definition) => {
  const fields = ["eyebrow", "heading", "body", "primaryLabel", "secondaryLabel"];
  if (["AboutAlt", "CardsGridAlt", "PalmCardPointsAlt", "TestimonialAlt", "PalmCardAlt", "PalmCardContactAlt"].includes(definition.type)) fields.push("intro");
  if (["PalmCardBioAlt", "PalmCardAlt"].includes(definition.type)) fields.push("quote", "quoteAttribution");
  if (definition.type === "HeroAlt") fields.push("highlightTitle", "highlightText");
  if (definition.type === "PalmCardContactAlt") fields.push("disclaimer");
  return [definition.type, fields];
})) as Record<CampaignAltType, string[]>;

export const editableFieldsByType: Record<keyof Components, string[]> = {
  HeroCountdown: ["eyebrow", "heading", "body", "eventDate", "eventLocation", "registerLabel", "hotelLabel"],
  About: ["eyebrow", "heading", "body", "advisoryHeading", "advisoryBody"],
  MeetingInfo: ["eyebrow", "heading", "body", "date", "time", "location", "actionLabel"],
  Events: ["eyebrow", "heading", "upcomingLabel", "upcomingTitle", "upcomingBody", "upcomingDate", "upcomingLocation"],
  MeetingDirectory: ["eyebrow", "heading", "body"],
  CTMeetingSchedule: ["heading", "introduction"],
  CallToAction: ["eyebrow", "heading", "body", "primaryLabel", "secondaryLabel"],
  Image: ["caption"],
  RichText: ["content"],
  FreeText: ["text"],
  Text: ["text"],
  Button: ["label"],
  Countdown: ["label"],
  Section: ["heading"],
  Column: ["label"],
  ProgramSchedule: ["heading", "introduction"],
  ButtonRow: ["primaryLabel", "secondaryLabel"],
  IssuesSection: ["eyebrow", "heading", "body"],
  IssueCards: ["heading", "intro"],
  QuoteBlock: ["heading", "quote", "attribution", "role"],
  ResultsStats: ["heading", "intro"],
  SupporterLogos: ["heading", "intro"],
  ActionTabs: ["heading", "intro"],
  MediaGallery: ["heading", "intro"],
  Navigation: ["brand"],
  Headline: ["text"],
  Divider: [],
  FollowLinks: ["heading"],
  BulletedList: [],
  InlineForm: ["heading", "intro", "submitLabel"],
  ImageCaption: ["caption"],
  Video: ["caption"],
  Embed: ["title"],
  PayPal: ["label", "amount"],
  ContentRow: [],
  Row: [],
  RowOneColumn: [],
  RowTwoColumns: [],
  RowLeftWide: [],
  RowRightWide: [],
  RowThreeColumns: [],
  RowFourColumns: [],
  ...campaignAltEditableFields,
};

const richTextField = (label: string, richTextDefault?: string, richTextBlockType?: LexicalBlockType, initialHeight = 120): Field & NativeRichTextField => {
  return {
    type: "custom",
    label,
    contentEditable: true,
    render: ({ name, value, onChange, readOnly }) => <PuckRichTextSwitchField defaultBlockType={richTextBlockType} field={{ type: "text", label }} fieldName={name} plainType={initialHeight > 100 ? "textarea" : "text"} value={value} onChange={onChange} readOnly={readOnly} />,
    richTextBlockType,
    richTextDefault,
  };
};
const text = (label: string) => richTextField(label, undefined, undefined, 76);
const area = (label: string) => richTextField(label, undefined, undefined, 144);
const heading = (label = "Heading", level: Extract<LexicalBlockType, "h1" | "h2" | "h3" | "h4"> = "h2") => richTextField(label, undefined, level, 92);
const plainText = (label: string) => ({ type: "text" as const, label });

const backgroundDarknessField: Field<number> = {
  type: "custom",
  label: "Background darkness",
  render: ({ value, onChange, readOnly }) => {
    const darkness = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 45;
    return (
      <div style={{ alignItems: "center", display: "grid", gap: 10, gridTemplateColumns: "1fr 52px" }}>
        <input
          aria-label="Background darkness"
          disabled={readOnly}
          max={100}
          min={0}
          onChange={(event) => onChange(Number(event.currentTarget.value))}
          step={1}
          type="range"
          value={darkness}
        />
        <output style={{ fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{darkness}%</output>
      </div>
    );
  },
};

function normalizeMedia(value: unknown): MediaValue | null {
  if (typeof value === "string" && value.trim()) return { url: value.trim(), alt: "" };
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (typeof record.url !== "string" || !record.url.trim()) return null;
  return {
    id: typeof record.id === "string" || typeof record.id === "number" ? record.id : undefined,
    url: record.url,
    alt: typeof record.alt === "string" ? record.alt : "",
    filename: typeof record.filename === "string" ? record.filename : undefined,
    mimeType: typeof record.mimeType === "string" ? record.mimeType : undefined,
    width: typeof record.width === "number" ? record.width : undefined,
    height: typeof record.height === "number" ? record.height : undefined,
  };
}

const mediaField = (label: string, allowVideo = false): Field<MediaValue | null | undefined> => ({
  type: "external",
  label,
  placeholder: "Choose from Payload Media",
  showSearch: true,
  cache: { enabled: false },
  fetchList: async ({ query }) => {
    const response = await fetch("/api/media?limit=100&sort=-createdAt&depth=0", { credentials: "same-origin" });
    if (!response.ok) return [];
    const result = await response.json() as { docs?: unknown[] };
    const docs = Array.isArray(result.docs) ? result.docs : [];
    const compatibleDocs = allowVideo ? docs : docs.filter((value) => {
      if (!value || typeof value !== "object") return false;
      const mimeType = (value as Record<string, unknown>).mimeType;
      return typeof mimeType !== "string" || mimeType.startsWith("image/");
    });
    const needle = query.trim().toLowerCase();
    if (!needle) return compatibleDocs;
    return compatibleDocs.filter((value) => {
      if (!value || typeof value !== "object") return false;
      const record = value as Record<string, unknown>;
      return [record.alt, record.filename].some((item) => typeof item === "string" && item.toLowerCase().includes(needle));
    });
  },
  mapProp: (value) => normalizeMedia(value) || { url: "", alt: "" },
  mapRow: (value) => {
    const media = normalizeMedia(value);
    const isVideo = media?.mimeType?.startsWith("video/") || /\.(?:mp4|webm)(?:\?.*)?$/i.test(media?.url || "");
    return {
      Preview: media?.url ? (isVideo ? <video aria-label="Video preview" muted preload="metadata" src={media.url} style={{ aspectRatio: "4 / 3", height: 58, objectFit: "cover", width: 76 }} /> : <img alt="" src={media.url} style={{ aspectRatio: "4 / 3", height: 58, objectFit: "cover", width: 76 }} />) : "No preview",
      Name: media?.alt || media?.filename || "Untitled media",
      Size: media?.width && media?.height ? `${media.width} × ${media.height}` : "—",
    };
  },
  getItemSummary: (value) => value?.alt || value?.filename || "Selected image",
  renderFooter: () => <a href="/admin/collections/media/create" rel="noreferrer" target="_blank">Upload a new image in Media</a>,
});

const richTextPlaceholder = richTextField("Rich text", "Write rich text here.", "paragraph");

const importantDatesField: Field<ImportantDate[]> = {
  type: "array",
  label: "Important dates",
  defaultItemProps: { date: "", label: "" },
  arrayFields: { date: text("Date"), label: text("Details") },
  getItemSummary: (item) => item.label || item.date || "Important date",
};

const pastEventsField: Field<PastEvent[]> = {
  type: "array",
  label: "Past events",
  defaultItemProps: { title: "", date: "", image: null },
  arrayFields: { title: text("Title"), date: text("Date"), image: mediaField("Event flyer") },
  getItemSummary: (item) => item.title || item.date || "Past event",
};

const meetingsField: Field<MeetingListing[]> = {
  type: "array",
  label: "Meetings",
  defaultItemProps: { name: "", location: "", date: "", url: "" },
  arrayFields: { name: text("Name"), location: text("Location"), date: text("Date"), url: plainText("Name URL") },
  getItemSummary: (item) => item.name || item.location || "Meeting",
};
const upcomingEventsField: Field<UpcomingEvent[]> = {
  type: "array",
  label: "More upcoming events",
  defaultItemProps: { title: "", date: "" },
  arrayFields: { title: text("Event name"), date: text("Date") },
  getItemSummary: (item) => item.title || item.date || "Upcoming event",
};

const scheduleMeetingsField: Field<ScheduleMeeting[]> = {
  type: "array",
  label: "Meetings",
  defaultItemProps: { day: "", time: "", name: "", url: "", location: "", city: "", attendance: "", address: "", types: "" },
  arrayFields: {
    day: text("Day"),
    time: text("Time"),
    name: text("Meeting name"),
    url: plainText("Meeting URL"),
    location: text("Location"),
    city: text("City"),
    attendance: text("Attendance"),
    address: text("Address"),
    types: text("Meeting types"),
  },
  getItemSummary: (item) => item.name || item.day || "Meeting",
};

const issueField: Field<Issue[]> = {
  type: "array",
  label: "Features",
  defaultItemProps: { title: "", body: "", icon: "" },
  arrayFields: { title: richTextField("Title"), body: area("Description"), icon: plainText("Icon or short label") },
  getItemSummary: (item) => itemSummary("Issue", item.title),
};

export const nestedElementTypes = ELEMENT_DROP_TYPES;

const issueCardsField: Field<IssueCard[]> = {
  type: "array",
  label: "Feature cards",
  defaultItemProps: { label: "", heading: "", body: "", image: null, linkLabel: "", linkUrl: "", blocks: [] },
  arrayFields: { label: plainText("Editor label"), heading: richTextField("Heading"), body: area("Description"), image: mediaField("Card image"), linkLabel: text("Link label"), linkUrl: plainText("Link URL"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => itemSummary("Issue card", item.heading, item.label),
};

const statsField: Field<ResultStat[]> = {
  type: "array",
  label: "Statistics",
  defaultItemProps: { value: "", label: "", detail: "" },
  arrayFields: { value: text("Value"), label: text("Label"), detail: area("Detail") },
  getItemSummary: (item) => item.label || item.value || "Result",
};

const logosField: Field<SupporterLogo[]> = {
  type: "array",
  label: "Partners",
  defaultItemProps: { name: "", image: null },
  arrayFields: { name: text("Name"), image: mediaField("Logo") },
  getItemSummary: (item) => item.name || "Supporter",
};

const tabsField: Field<ActionTab[]> = {
  type: "array",
  label: "Content tabs",
  defaultItemProps: { label: "", description: "", blocks: [] },
  arrayFields: { label: text("Tab label"), description: area("Description"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => item.label || "Action tab",
};

const galleryItemsField: Field<GalleryItem[]> = {
  type: "array",
  label: "Gallery items",
  defaultItemProps: { image: null, caption: "", size: "medium" },
  arrayFields: { image: mediaField("Image"), caption: text("Caption"), size: { type: "select", label: "Tile size", options: [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }] } },
  getItemSummary: (item) => item.caption || "Gallery item",
};

const columnsField: Field<ContentColumn[]> = {
  type: "array",
  label: "Columns",
  defaultItemProps: { label: "", blocks: [] },
  arrayFields: { label: plainText("Editor label"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => item.label || "Column",
};

const contentRowFields = { layout: { type: "select" as const, label: "Columns", options: [{ label: "One column", value: "one" }, { label: "Two equal", value: "two" }, { label: "Left wide", value: "leftWide" }, { label: "Right wide", value: "rightWide" }, { label: "Three equal", value: "three" }, { label: "Four equal", value: "four" }] }, columns: columnsField };

function visibleColumnCount(layout: ContentRow["layout"]) {
  return layoutColumnCount(layout);
}

type SlotTone = "light" | "dark";

function LabeledSlot({ children, label, tone = "light" }: { children: ReactNode; label: string; tone?: SlotTone }) {
  return <div className={styles.nestedDropZone} data-slot-label={label} data-tone={tone}>
    <div className={styles.nestedDropZoneLabel}><span aria-hidden="true" className={styles.nestedDropZonePlus} /><span>Drop elements here</span></div>
    {children}
  </div>;
}

function SlotContent({ content, label, fallback, minEmptyHeight = 150, tone = "light" }: { content?: NestedSlotValue; label: string; fallback: ReactNode; minEmptyHeight?: number; tone?: SlotTone }) {
  const renderProps = useContext(PuckRenderPropsContext);
  const editing = Boolean(renderProps?.puck?.isEditing);
  if (typeof content === "function") {
    const Content = content;
    const slot = <Content className={styles.nestedSlot} minEmptyHeight={minEmptyHeight} allow={nestedElementTypes} />;
    return editing ? <LabeledSlot label={label} tone={tone}>{slot}</LabeledSlot> : slot;
  }
  return <>{fallback}</>;
}

function contentRowRender(props: ContentRow) {
  const columns = (props.columns || []).slice(0, visibleColumnCount(props.layout));
  return <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{columns.map((column, index) => { const label = slotLabel(column.label, `Column ${index + 1}`); return <article key={`${label}-${index}`}>{props.puck?.isEditing ? <span>{label}</span> : null}<SlotContent content={column.blocks} label={label} minEmptyHeight={150} fallback={null} /></article>; })}</div></div></section>;
}

function ActionTabsRender(props: ActionTabs & { puck?: { isEditing?: boolean } }) {
  const [active, setActive] = useState(0);
  const tabs = props.tabs?.length ? props.tabs : [];
  const editing = Boolean(props.puck?.isEditing);
  return (
    <section className={styles.actionTabs} id={props.id}>
      <div className={styles.shell}>
        <Editable as="h2" field="heading" props={props}>{props.heading}</Editable>
        <Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable>
        <div className={styles.tabList} role="tablist">
          {tabs.map((tab, index) => {
            return (
              <button aria-selected={active === index} key={`${tab.label || index}-${index}`} onClick={() => setActive(index)} role="tab" type="button">
                <RichCopy as="span" path={`tabs[${index}].label`} field="label" props={props} value={tab.label || `Tab ${index + 1}`} />
              </button>
            );
          })}
        </div>
        <div className={styles.tabPanels}>
          {tabs.map((tab, index) => (editing || active === index)
            ? (
                <section aria-label={slotLabel(tab.label, `Tab ${index + 1}`)} className={styles.tabPanel} hidden={!editing && active !== index} key={`${tab.label || index}-${index}`}>
                <RichCopy as="p" path={`tabs[${index}].description`} field="description" props={props} value={tab.description} />
                <SlotContent content={tab.blocks} label={slotLabel(tab.label, `Tab ${index + 1}`)} minEmptyHeight={180} fallback={null} />
              </section>
            )
            : null)}
        </div>
      </div>
    </section>
  );
}

function styleFor(props: Base, field: string): CSSProperties {
  const values = props as unknown as Record<string, unknown>;
  const cap = `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
  const fontSize = values[`${field}FontSize`];
  const color = values[`${field}Color`];
  const fontWeight = values[`${field}FontWeight`];
  const textAlign = values[`${field}TextAlign`];
  return {
    fontSize: typeof fontSize === "string" ? fontSize : undefined,
    color: typeof color === "string" ? color : undefined,
    fontWeight: typeof fontWeight === "string" ? fontWeight : undefined,
    textAlign: textAlign === "center" || textAlign === "right" ? textAlign : undefined,
    ["--field" as string]: cap,
  };
}

function RichValue({
  as: Tag,
  className,
  field,
  path,
  value,
  style,
  props,
}: {
  as: ElementType;
  className?: string;
  field?: string;
  path?: string;
  value: unknown;
  style?: CSSProperties;
  props?: CanvasBase;
}) {
  const richAs = typeof Tag === "string" ? Tag : undefined;
  const scopedProps = useContext(PuckRenderPropsContext);
  const renderProps = (props || scopedProps) as Record<string, unknown> | undefined;
  const fieldPath = path || field || "text";
  const defaultBlockType: LexicalBlockType = richAs === "h1" || richAs === "h2" || richAs === "h3" || richAs === "h4" ? richAs : "paragraph";
  const directCanvasEditor = Boolean((renderProps?.puck as CanvasBase["puck"])?.isEditing) && renderProps && hasEnabledRichText(renderProps, fieldPath, value)
    ? <PuckCanvasRichTextField request={{ props: renderProps, fieldPath, fieldName: field, value, defaultBlockType, label: field || "Text" }} />
    : null;
  if (directCanvasEditor) return <div className={`${className || ""} ${styles.richInline}`} data-puck-text-field={fieldPath} data-rich-content="editor" data-rich-default-as={richAs} style={style}>{directCanvasEditor}</div>;
  // Puck can pass its own InlineTextField element as the child for plain
  // custom fields. Preserve the complete nested path here; using only the
  // leaf name makes every `items[0].heading` look like the top-level
  // `heading` field and prevents the canvas editor from addressing it.
  if (isValidElement(value)) return <div className={`${className || ""} ${styles.richInline}`} data-puck-text-field={path || field} data-rich-as={richAs} style={style}>{value}</div>;
  if (isLexicalValue(value)) return <div className={`${className || ""} ${styles.richInline}`} data-puck-text-field={path || field} data-rich-content="rendered" data-rich-default-as={richAs} style={style} dangerouslySetInnerHTML={{ __html: lexicalToHTML(value) }} />;
  if (typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value)) return <div className={`${className || ""} ${styles.richInline}`} data-puck-text-field={path || field} data-rich-content="rendered" data-rich-default-as={richAs} style={style} dangerouslySetInnerHTML={{ __html: value }} />;
  return (
    <Tag className={className} data-puck-text-field={path || field} style={style}>
      {typeof value === "string" || typeof value === "number" ? value : ""}
    </Tag>
  );
}

function Editable({
  as: Tag = "span",
  props,
  field,
  path,
  children,
  className,
}: { as?: ElementType; props: CanvasBase; field: string; path?: string; children: ReactNode; className?: string }) {
  return <RichValue as={Tag} className={className} field={field} path={path} props={props} style={styleFor(props, field)} value={children} />;
}

function RichCopy({ value, as: Tag = "p", className, field, path, props }: { value: unknown; as?: ElementType; className?: string; field?: string; path?: string; props?: CanvasBase }) {
  return <RichValue as={Tag} className={className} field={field} path={path} props={props} value={value} />;
}

function Button({ href, children, outline = false }: { href: string; children: ReactNode; outline?: boolean }) {
  return <a className={styles.button} data-outline={outline} href={href || "#"}>{children}</a>;
}

function CTMeetingScheduleBlock(props: CTMeetingSchedule) {
  const meetings = normalizeScheduleMeetings(props.meetings);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return <section className={styles.schedule} id={props.id}><div className={styles.shell}>
    <Editable as="h2" field="heading" props={props}>{props.heading}</Editable>
    <Editable as="p" className={styles.scheduleIntroduction} field="introduction" props={props}>{props.introduction}</Editable>
    <div aria-label="CT meeting schedule" className={styles.scheduleTable} role="table">
      <div className={styles.scheduleHeader} role="row"><span role="columnheader">Day</span><span role="columnheader">Time</span><span role="columnheader">Meeting</span><span role="columnheader">Location</span><span role="columnheader">City</span><span role="columnheader">Attendance</span><span aria-label="Details" role="columnheader" /> </div>
      {meetings.map((item, index) => {
        const isOpen = openIndex === index;
        return <Fragment key={`${item.day}-${item.time}-${item.name}-${index}`}>
          <div className={styles.scheduleRow} role="row">
            <span data-label="Day" role="cell"><RichCopy as="span" path={`meetings[${index}].day`} field="day" props={props} value={item.day} /></span>
            <span data-label="Time" role="cell"><RichCopy as="span" path={`meetings[${index}].time`} field="time" props={props} value={item.time} /></span>
            <span className={styles.scheduleName} data-label="Meeting" role="cell">{item.url ? <a href={item.url} rel="noreferrer" target="_blank"><RichCopy as="span" path={`meetings[${index}].name`} field="name" props={props} value={item.name} /></a> : <RichCopy as="span" path={`meetings[${index}].name`} field="name" props={props} value={item.name} />}</span>
            <span data-label="Location" role="cell"><RichCopy as="span" path={`meetings[${index}].location`} field="location" props={props} value={item.location} /></span>
            <span data-label="City" role="cell"><RichCopy as="span" path={`meetings[${index}].city`} field="city" props={props} value={item.city} /></span>
            <span data-label="Attendance" role="cell"><RichCopy as="span" path={`meetings[${index}].attendance`} field="attendance" props={props} value={item.attendance} /></span>
            <span className={styles.scheduleDetailsToggle} role="cell"><button aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} details for ${item.name}`} onClick={() => setOpenIndex(isOpen ? null : index)} type="button">{isOpen ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}</button></span>
          </div>
          {isOpen ? <div className={styles.scheduleDetails} role="row"><div role="cell"><strong>Address</strong><RichCopy as="span" path={`meetings[${index}].address`} field="address" props={props} value={item.address || "Not listed"} /></div><div role="cell"><strong>Meeting types</strong><RichCopy as="span" path={`meetings[${index}].types`} field="types" props={props} value={item.types || "Not listed"} /></div></div> : null}
        </Fragment>;
      })}
    </div>
  </div></section>;
}

const campaignItemsField: Field<CampaignAltItem[]> = {
  type: "array",
  label: "Items",
  defaultItemProps: { label: "", heading: "New item", text: "Add details", value: "", linkLabel: "Learn more", url: "", icon: "check", attribution: "", role: "", image: null },
  arrayFields: { label: text("Label"), heading: heading("Heading", "h3"), text: area("Text"), value: text("Value"), linkLabel: richTextField("Link label", "Learn more", "paragraph", 76), url: plainText("URL"), icon: plainText("Icon"), attribution: text("Attribution"), role: text("Role"), image: mediaField("Image") },
  getItemSummary: (item) => itemSummary("Item", item.heading, item.label, item.value),
};

const campaignIconOptions = ["none", "check", "people", "family", "mapPin", "dollar", "shieldCheck", "landmark", "briefcase", "vote", "handshake", "megaphone", "calendar"].map((value) => ({ label: campaignOptionLabel(value), value }));

type CampaignItemArrayField = Extract<Field<CampaignAltItem[]>, { type: "array" }>;

function campaignItems(label: string, fields: CampaignItemArrayField["arrayFields"], defaults: CampaignAltItem): Field<CampaignAltItem[]> {
  return {
    type: "array",
    label,
    defaultItemProps: defaults,
    arrayFields: fields,
    getItemSummary: (item) => itemSummary(label.replace(/s$/, ""), item.heading, item.attribution, item.label, item.text),
  };
}

const bioHighlightsField = campaignItems("Highlights", { text: area("Highlight") }, { text: "A concise proof point" });
const issueCardsAltField = campaignItems("Issue cards", { heading: heading("Heading", "h3"), icon: { type: "select", label: "Icon", options: campaignIconOptions }, text: area("Description"), image: mediaField("Background image"), linkLabel: richTextField("Link label", "Learn more", "paragraph", 76), url: plainText("Link URL") }, { heading: "Community priority", icon: "check", text: "Explain the practical outcome.", image: null, linkLabel: "Learn more", url: "" });
const palmPointsField = campaignItems("Palm card points", { icon: { type: "select", label: "Icon", options: campaignIconOptions }, text: area("Point") }, { icon: "check", text: "Palm card point" });
const palmContentField = campaignItems("Palm card points", { icon: { type: "select", label: "Icon", options: campaignIconOptions }, heading: heading("Heading", "h3"), text: area("Supporting text") }, { icon: "check", heading: "A clear priority", text: "Add one concise sentence explaining why this point matters." });
const testimonialsField = campaignItems("Testimonials", { text: area("Quote"), attribution: text("Attribution"), role: text("Role"), image: mediaField("Photo") }, { text: "This work is rooted in what our community needs.", attribution: "Community supporter", role: "Resident", image: null });
const contactLinksField = campaignItems("Contact links", { label: text("Label"), value: text("Display value"), url: plainText("URL") }, { label: "Website", value: "example.org", url: "https://example.org" });

const campaignNestedField: Field<CampaignAltSlotItem[]> = {
  type: "array",
  label: "Nested content",
  defaultItemProps: { label: "", heading: "New item", text: "Add details", image: null },
  arrayFields: { label: text("Label"), heading: heading("Heading", "h3"), text: area("Text"), image: mediaField("Image"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => itemSummary("Item", item.heading, item.label),
};

function campaignOptionLabel(value: string) {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (letter) => letter.toUpperCase());
}

function CampaignIcon({ name }: { name?: string }) {
  const icons: Record<string, ElementType> = { briefcase: BriefcaseBusiness, calendar: CalendarDays, check: Check, dollar: BadgeDollarSign, family: HeartHandshake, handshake: HeartHandshake, landmark: Landmark, mapPin: MapPin, megaphone: Megaphone, people: Users, shieldCheck: ShieldCheck, vote: Vote };
  const Icon = name && name !== "none" ? icons[name] || Check : null;
  return Icon ? <span className={styles.campaignAltIcon}><Icon aria-hidden="true" /></span> : null;
}

function CampaignSectionHeader({ props, centered = false }: { props: CampaignAltProps; centered?: boolean }) {
  const intro = props.intro || props.body;
  const editing = Boolean(props.puck?.isEditing);
  return <header className={styles.campaignAltHeader} data-centered={centered}>{props.eyebrow || editing ? <Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable> : null}<Editable as="h2" field="heading" props={props}>{props.heading}</Editable>{intro || editing ? <Editable as="p" field={props.intro || !props.body ? "intro" : "body"} props={props}>{intro}</Editable> : null}</header>;
}

function CampaignActions({ props }: { props: CampaignAltProps }) {
  if (!props.primaryLabel && !props.secondaryLabel) return null;
  return <div className={styles.actions}>{props.primaryLabel ? <Button href={props.primaryUrl || "#"}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button> : null}{props.secondaryLabel ? <Button href={props.secondaryUrl || "#"} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button> : null}</div>;
}

function CampaignImage({ media, className }: { media?: MediaValue | null; className?: string }) {
  const image = normalizeMedia(media);
  return image ? <figure className={className}><img alt={image.alt || ""} src={image.url} /></figure> : null;
}

const campaignAltDefinitionByType = Object.fromEntries(campaignAltDefinitions.map((definition) => [definition.type, definition])) as Partial<Record<CampaignAltType, CampaignAltDefinition>>;

function CampaignBridge({ type, props }: { type: CampaignAltType; props: CampaignAltProps }) {
  const definition = campaignAltDefinitionByType[type];
  if (!definition || !AFTER_CONTENT_BLOCK_TYPES.has(type)) return null;
  return <SlotContent content={props.afterContent} label={`${definition.label} content`} minEmptyHeight={96} tone={campaignBridgeTone(definition, props)} fallback={null} />;
}

function campaignItemKey(scope: string, item: CampaignAltItem, index: number) {
  return `${scope}-${item.id ?? index}`;
}

function HeroAltRender({ props }: { props: CampaignAltProps }) {
  const background = normalizeMedia(props.backgroundMedia);
  const headingLogo = normalizeMedia(props.headingLogo);
  return <section className={`${styles.campaignAlt} ${styles.heroAlt}`} data-overlay={props.backgroundOverlay || "standard"} data-panel-color={props.textPanelColor || "primary"} data-panel-opacity={props.textPanelOpacity || "translucent"} data-presentation={props.presentation} data-variant={props.variant} id={props.id}>
    {background ? <img aria-hidden="true" alt="" className={styles.campaignAltBackground} src={background.url} /> : null}
    <div className={styles.shell}>
      <div className={styles.campaignAltCopy}>{props.eyebrow || props.puck?.isEditing ? <Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable> : null}{headingLogo ? <><img alt={props.heading || headingLogo.alt || "Heading"} className={styles.heroAltLogo} src={headingLogo.url} />{props.puck?.isEditing ? <div className={styles.heroAltHeadingEditor}><small>Heading text (the logo replaces this on the published page)</small><Editable as="h1" field="heading" props={props}>{props.heading}</Editable></div> : null}</> : <Editable as="h1" field="heading" props={props}>{props.heading}</Editable>}<Editable as="p" field="body" props={props}>{props.body}</Editable>{props.highlightTitle || props.highlightText || props.puck?.isEditing ? <aside className={styles.heroAltHighlight}>{props.highlightTitle || props.puck?.isEditing ? <Editable as="strong" field="highlightTitle" props={props}>{props.highlightTitle}</Editable> : null}{props.highlightText || props.puck?.isEditing ? <Editable as="span" field="highlightText" props={props}>{props.highlightText}</Editable> : null}</aside> : null}<CampaignActions props={props} /></div>
      <CampaignImage className={styles.heroAltMedia} media={props.media} />
    </div>
  </section>;
}

function BioSectionRender({ props }: { props: CampaignAltProps }) {
  return <section className={`${styles.campaignAlt} ${styles.bioSectionAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><CampaignImage className={styles.campaignAltProfileMedia} media={props.media} /><div className={styles.bioSectionCopy}><CampaignSectionHeader props={props} />{(props.body && props.intro) || props.puck?.isEditing ? <Editable as="p" className={styles.campaignAltLongCopy} field="body" props={props}>{props.body}</Editable> : null}<CampaignBridge props={props} type="AboutAlt" />{props.items.length ? <div className={styles.bioHighlights}>{props.items.map((item, index) => <div key={campaignItemKey("about-highlight", item, index)}><CampaignIcon name={item.icon} /><Editable as="p" path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable></div>)}</div> : null}</div></div></section>;
}

function IssuesCardsRender({ props }: { props: CampaignAltProps }) {
  return <section className={`${styles.campaignAlt} ${styles.issuesCardsAlt}`} data-count={props.items.length} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><CampaignSectionHeader centered={props.variant !== "editorialGrid"} props={props} /><CampaignBridge props={props} type="CardsGridAlt" /><div className={styles.issuesCardsAltGrid}>{props.items.map((item, index) => { const image = normalizeMedia(item.image); return <article data-featured={index === 0} key={campaignItemKey("cards-grid-item", item, index)}>{image ? <img alt={image.alt || ""} src={image.url} /> : null}<div><CampaignIcon name={item.icon} /><Editable as="h3" path={`items[${index}].heading`} field="heading" props={props}>{item.heading}</Editable>{item.text || props.puck?.isEditing ? <Editable path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable> : null}{item.url ? <a href={item.url}><Editable as="span" path={`items[${index}].linkLabel`} field="linkLabel" props={props}>{item.linkLabel || "Learn more"}</Editable></a> : null}</div></article>; })}</div></div></section>;
}

function PalmCardPointsRender({ props }: { props: CampaignAltProps }) {
  return <section className={`${styles.campaignAlt} ${styles.palmPointsAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><CampaignSectionHeader centered props={props} /><CampaignBridge props={props} type="PalmCardPointsAlt" /><div className={styles.palmPointsGrid}>{props.items.map((item, index) => <article key={`${item.text}-${index}`}><CampaignIcon name={item.icon} /><Editable as="p" path={`items[${index}].${item.text ? "text" : "heading"}`} field={item.text ? "text" : "heading"} props={props}>{item.text || item.heading}</Editable></article>)}</div></div></section>;
}

function PalmCardBioRender({ props }: { props: CampaignAltProps }) {
  return <section className={`${styles.campaignAlt} ${styles.palmBioAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><CampaignImage className={styles.campaignAltProfileMedia} media={props.media} /><div><CampaignSectionHeader props={props} /><CampaignBridge props={props} type="PalmCardBioAlt" />{props.body || props.puck?.isEditing ? <Editable as="p" className={styles.campaignAltLongCopy} field="body" props={props}>{props.body}</Editable> : null}{props.quote || props.puck?.isEditing ? <figure className={styles.campaignAltQuote}><Editable as="blockquote" field="quote" props={props}>{props.quote}</Editable>{props.quoteAttribution || props.puck?.isEditing ? <Editable as="figcaption" field="quoteAttribution" props={props}>{props.quoteAttribution}</Editable> : null}</figure> : null}</div></div></section>;
}

function TestimonialAltRender({ props }: { props: CampaignAltProps }) {
  return <section className={`${styles.campaignAlt} ${styles.testimonialsAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><CampaignSectionHeader centered={props.variant === "contained"} props={props} /><CampaignBridge props={props} type="TestimonialAlt" /><div className={styles.testimonialsAltGrid}>{props.items.map((item, index) => { const image = normalizeMedia(item.image); const isAttribution = Boolean(item.attribution); const isRole = Boolean(item.role); return <figure data-lead={index === 0} key={`${item.attribution}-${index}`}>{image ? <img alt={image.alt || ""} src={image.url} /> : null}<Editable as="blockquote" path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable><figcaption><Editable as="strong" path={`items[${index}].${isAttribution ? "attribution" : "heading"}`} field={isAttribution ? "attribution" : "heading"} props={props}>{isAttribution ? item.attribution : item.heading}</Editable>{isRole || item.label ? <Editable as="span" path={`items[${index}].${isRole ? "role" : "label"}`} field={isRole ? "role" : "label"} props={props}>{isRole ? item.role : item.label}</Editable> : null}</figcaption></figure>; })}</div></div></section>;
}

function PalmCardContentRender({ props }: { props: CampaignAltProps }) {
  const isEditing = Boolean(props.puck?.isEditing);
  const isSplitProfile = props.variant === "splitProfile";
  const quote = props.quote || isEditing ? <figure className={styles.campaignAltQuote}><Editable as="blockquote" field="quote" props={props}>{props.quote}</Editable>{props.quoteAttribution || isEditing ? <Editable as="figcaption" field="quoteAttribution" props={props}>{props.quoteAttribution}</Editable> : null}</figure> : null;
  return <section className={`${styles.campaignAlt} ${styles.palmContentAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><div className={styles.palmContentIntro}><CampaignSectionHeader props={props} /><CampaignBridge props={props} type="PalmCardAlt" />{isSplitProfile ? quote : null}</div><CampaignImage className={styles.campaignAltProfileMedia} media={props.media} /><div className={styles.palmContentGrid}>{props.items.map((item, index) => <article key={campaignItemKey("palm-card-item", item, index)}><CampaignIcon name={item.icon} /><div className={styles.palmContentCopy}><div className={styles.palmContentEditorField} data-editing={isEditing || undefined}><span aria-hidden="true" className={styles.palmContentEditorLabel}>Heading</span><Editable as="h3" path={`items[${index}].heading`} field="heading" props={props}>{item.heading}</Editable></div><div className={styles.palmContentEditorField} data-editing={isEditing || undefined}><span aria-hidden="true" className={styles.palmContentEditorLabel}>Supporting text</span><Editable as="p" path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable></div></div></article>)}</div>{isSplitProfile ? null : quote}</div></section>;
}

function PalmCardContactRender({ props }: { props: CampaignAltProps }) {
  const qr = normalizeMedia(props.qrImage);
  const details = [{ field: "electionDay", label: "Election day", value: props.electionDay }, { field: "earlyVote", label: "Early vote", value: props.earlyVote }, { field: "phone", label: "Phone", value: props.phone }, { field: "email", label: "Email", value: props.email }, { field: "website", label: "Website", value: props.website }].filter((item) => item.value);
  return <section className={`${styles.campaignAlt} ${styles.palmContactAlt}`} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><div><CampaignSectionHeader props={props} /><CampaignBridge props={props} type="PalmCardContactAlt" /><div className={styles.palmContactDetails}>{details.map((item) => <div key={item.label}><small>{item.label}</small><Editable as="strong" field={item.field} props={props}>{item.value}</Editable></div>)}</div>{props.items.length ? <nav className={styles.palmContactLinks}>{props.items.map((item, index) => item.url ? <a href={item.url} key={`${item.label}-${index}`}><Editable as="span" path={`items[${index}].${item.label ? "label" : "value"}`} field={item.label ? "label" : "value"} props={props}>{item.label || item.value}</Editable></a> : <Editable as="span" path={`items[${index}].${item.label ? "label" : "value"}`} field={item.label ? "label" : "value"} props={props} key={`${item.label}-${index}`}>{item.label || item.value}</Editable>)}</nav> : null}</div>{qr ? <figure className={styles.palmContactQr}><img alt={qr.alt || props.qrCaption || "QR code"} src={qr.url} />{props.qrCaption ? <Editable as="figcaption" field="qrCaption" props={props}>{props.qrCaption}</Editable> : null}</figure> : null}{props.disclaimer ? <Editable as="small" className={styles.palmContactDisclaimer} field="disclaimer" props={props}>{props.disclaimer}</Editable> : null}</div></section>;
}

function CampaignAltTabs({ props }: { props: CampaignAltProps }) {
  const [active, setActive] = useState(0);
  return <div className={styles.campaignAltTabs} data-variant={props.variant}><div role="tablist">{props.tabs.map((tab, index) => {
    const tabLabelField = tab.label ? "label" : "heading";
    const tabLabel = slotLabel(tab.label || tab.heading, `Tab ${index + 1}`);
    return <button aria-selected={active === index} key={`${tabLabel}-${index}`} onClick={() => setActive(index)} role="tab" type="button"><Editable as="span" path={`tabs[${index}].${tabLabelField}`} field={tabLabelField} props={props}>{tab.label || tab.heading || `Tab ${index + 1}`}</Editable></button>;
  })}</div>{props.tabs.map((tab, index) => { const tabLabel = slotLabel(tab.label || tab.heading, `Tab ${index + 1}`); return <section hidden={!props.puck?.isEditing && active !== index} key={`${tabLabel}-${index}`}><Editable as="h3" path={`tabs[${index}].heading`} field="heading" props={props}>{tab.heading}</Editable>{tab.text ? <Editable as="p" path={`tabs[${index}].text`} field="text" props={props}>{tab.text}</Editable> : null}<SlotContent content={tab.blocks} label={tabLabel} minEmptyHeight={180} fallback={null} /></section>; })}</div>;
}

function campaignBridgeTone(definition: CampaignAltDefinition, props: CampaignAltProps): SlotTone {
  if (definition.type === "TestimonialAlt") return "dark";
  if (definition.type === "CardsGridAlt" && props.variant === "imageOverlay") return "dark";
  if (definition.type === "PalmCardBioAlt" && props.variant === "quoteBio") return "dark";
  if (definition.type === "PalmCardContactAlt" && props.variant === "footerBand") return "dark";
  return "light";
}

function CampaignAltRender({ definition, props }: { definition: CampaignAltDefinition; props: CampaignAltProps }) {
  if (definition.type === "HeroAlt") return <HeroAltRender props={props} />;
  if (definition.type === "AboutAlt") return <BioSectionRender props={props} />;
  if (definition.type === "CardsGridAlt") return <IssuesCardsRender props={props} />;
  if (definition.type === "PalmCardPointsAlt") return <PalmCardPointsRender props={props} />;
  if (definition.type === "PalmCardBioAlt") return <PalmCardBioRender props={props} />;
  if (definition.type === "TestimonialAlt") return <TestimonialAltRender props={props} />;
  if (definition.type === "PalmCardAlt") return <PalmCardContentRender props={props} />;
  if (definition.type === "PalmCardContactAlt") return <PalmCardContactRender props={props} />;
  if (definition.type === "InlineRichTextAlt" || definition.type === "TextElementAlt") return <section className={`${styles.campaignAlt} ${styles.richText}`} data-kind="content" data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><Editable field="body" props={props}>{props.body}</Editable></div></section>;

  const media = normalizeMedia(props.media);
  const background = normalizeMedia(props.backgroundMedia);
  const nestedItems = definition.nestedCollection === "cards" ? props.cards : definition.nestedCollection === "columns" ? props.columns : [];

  if (definition.kind === "tabs") return <section className={styles.campaignAlt} data-kind="tabs" data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable><CampaignAltTabs props={props} /></div></section>;

  if (definition.kind === "columns" || definition.nestedCollection === "cards") {
    return <section className={styles.campaignAlt} data-kind={definition.kind} data-presentation={props.presentation} data-variant={props.variant} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable><div className={styles.campaignAltGrid}>{nestedItems.map((item, index) => { const label = slotLabel(item.label, `${definition.nestedCollection === "columns" ? "Column" : "Card"} ${index + 1}`); return <article key={`${item.heading}-${index}`}><Editable as="span" path={`items[${index}].label`} field="label" props={props}>{item.label || label}</Editable><Editable as="h3" path={`items[${index}].heading`} field="heading" props={props}>{item.heading}</Editable>{item.text ? <Editable path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable> : null}<SlotContent content={item.blocks} label={label} minEmptyHeight={definition.nestedCollection === "columns" ? 150 : 120} fallback={null} /></article>; })}</div></div></section>;
  }

  const isHero = definition.kind === "hero";
  return <section className={styles.campaignAlt} data-kind={definition.kind} data-presentation={props.presentation} data-variant={props.variant} id={props.id}>{background ? <img aria-hidden="true" alt="" className={styles.campaignAltBackground} src={background.url} /> : null}<div className={styles.shell}><div className={styles.campaignAltCopy}>{props.eyebrow ? <Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable> : null}<Editable as={isHero ? "h1" : "h2"} field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable>{props.primaryLabel || props.secondaryLabel ? <div className={styles.actions}>{props.primaryLabel ? <Button href={props.primaryUrl || "#"}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button> : null}{props.secondaryLabel ? <Button href={props.secondaryUrl || "#"} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button> : null}</div> : null}</div>{media ? <figure><img alt={media.alt || ""} src={media.url} /></figure> : null}{props.items.length ? <div className={styles.campaignAltItems}>{props.items.map((item, index) => <article key={`${item.heading}-${item.label}-${index}`}>{item.image && normalizeMedia(item.image) ? <img alt={normalizeMedia(item.image)?.alt || ""} src={normalizeMedia(item.image)?.url} /> : null}{item.label ? <Editable as="small" path={`items[${index}].label`} field="label" props={props}>{item.label}</Editable> : null}<Editable as="h3" path={`items[${index}].${item.heading ? "heading" : "value"}`} field={item.heading ? "heading" : "value"} props={props}>{item.heading || item.value}</Editable>{item.text ? <Editable as="p" path={`items[${index}].text`} field="text" props={props}>{item.text}</Editable> : null}{item.url ? <a href={item.url}><Editable as="span" path={`items[${index}].linkLabel`} field="linkLabel" props={props}>{item.linkLabel || "Learn more"}</Editable></a> : null}</article>)}</div> : null}</div></section>;
}

function campaignAltDefaults(definition: CampaignAltDefinition): Omit<CampaignAltProps, "id"> {
  const base = { variant: definition.variants[0], presentation: definition.presentations?.[0] || "contained", eyebrow: "", heading: definition.label, intro: "", body: "Add campaign-facing content here.", media: null, backgroundMedia: null, headingLogo: null, qrImage: null, highlightTitle: "", highlightText: "", backgroundOverlay: "standard", textPanelColor: "primary", textPanelOpacity: "translucent", primaryLabel: "Learn more", primaryUrl: "#", secondaryLabel: "", secondaryUrl: "#", quote: "", quoteAttribution: "", electionDay: "", earlyVote: "", phone: "", email: "", website: "", qrCaption: "", disclaimer: "", afterContent: [], items: [{ label: "", heading: "First item", text: "Add details", value: "", linkLabel: "Learn more", url: "", icon: "check", attribution: "", role: "", image: null }], cards: [], columns: [], tabs: [] };

  if (definition.type === "HeroAlt") return { ...base, variant: "civicOutdoors", eyebrow: "NECYPAA XXXVI", heading: "A bold alternate opening", body: "Use the hero variant that best fits the message, media, and call to action.", highlightTitle: "Hartford, Connecticut", highlightText: "Connection, service, and recovery.", primaryLabel: "Register", secondaryLabel: "Learn more" };
  if (definition.type === "AboutAlt") return { ...base, heading: "Our story", intro: "A clear introduction to the people and purpose behind the work.", body: "Use this space for the fuller biography or organizational story.", items: [{ text: "Built through service", icon: "check" }, { text: "Rooted in community", icon: "check" }, { text: "Focused on the next person", icon: "check" }] };
  if (definition.type === "CardsGridAlt") return { ...base, variant: "iconCards", presentation: "wide", heading: "Priorities", intro: "Use these cards for issues, services, promises, or voter actions.", body: "", items: [{ heading: "Public safety", icon: "shieldCheck", text: "A short, specific priority with a credible outcome.", image: null, linkLabel: "Learn more" }, { heading: "Local opportunity", icon: "handshake", text: "Explain how the work improves life in the community.", image: null, linkLabel: "Learn more" }, { heading: "Responsive service", icon: "mapPin", text: "Keep each card focused and easy to scan.", image: null, linkLabel: "Learn more" }] };
  if (definition.type === "PalmCardPointsAlt") return { ...base, presentation: "wide", heading: "Working for you", intro: "", body: "", items: [{ icon: "check", text: "Palm card point" }, { icon: "check", text: "Palm card point" }, { icon: "check", text: "Palm card point" }] };
  if (definition.type === "PalmCardBioAlt") return { ...base, presentation: "wide", eyebrow: "About", heading: "Candidate name", body: "Use this short biography to introduce experience, values, and community ties.", quote: "Leadership starts by listening.", quoteAttribution: "Candidate name", items: [] };
  if (definition.type === "TestimonialAlt") return { ...base, heading: "What people are saying", intro: "Use quotes for social proof, endorsements, or community voices.", body: "", items: [{ text: "This work is focused on what our community needs right now.", attribution: "Community supporter", role: "Resident", image: null }, { text: "The message is clear, practical, and rooted in local priorities.", attribution: "Local leader", role: "Endorser", image: null }] };
  if (definition.type === "PalmCardAlt") return { ...base, presentation: "wide", heading: "Palm card content", intro: "Use each card for one memorable idea and one short explanation.", body: "", items: [{ icon: "check", heading: "A clear priority", text: "Add one concise sentence explaining why this point matters." }, { icon: "check", heading: "A practical next step", text: "Describe the action or result people should remember." }, { icon: "check", heading: "A reason to get involved", text: "Close with a specific invitation, benefit, or outcome." }] };
  if (definition.type === "PalmCardContactAlt") return { ...base, presentation: "wide", eyebrow: "Voting information", heading: "Everything you need to take action", intro: "Keep essential dates and contact details together.", body: "", electionDay: "Election Day: Nov. 3", earlyVote: "Vote early: Oct. 19 - Nov. 1", website: "example.org", disclaimer: "Paid for by the campaign. Approved by the candidate.", items: [{ label: "Website", value: "example.org", url: "https://example.org" }, { label: "Facebook", value: "Follow the campaign", url: "#" }] };
  return base;
}

function campaignAltFields(definition: CampaignAltDefinition) {
  const common = { variant: { type: "select" as const, label: "Variant", options: definition.variants.map((value) => ({ label: campaignOptionLabel(value), value })) }, presentation: { type: "select" as const, label: "Presentation", options: (definition.presentations || ["contained"]).map((value) => ({ label: campaignOptionLabel(value), value })) } };
  const header = { eyebrow: text("Eyebrow"), heading: heading("Heading", "h2"), intro: area("Introduction") };
  const bridge = AFTER_CONTENT_BLOCK_TYPES.has(definition.type) ? { afterContent: { type: "slot" as const, allow: nestedElementTypes } } : {};

  if (definition.type === "HeroAlt") return { ...common, eyebrow: text("Eyebrow"), heading: heading("Heading", "h1"), headingLogo: mediaField("Heading logo"), body: area("Body"), highlightTitle: text("Highlight title"), highlightText: area("Highlight text"), media: mediaField("Primary media"), backgroundMedia: mediaField("Background media"), backgroundOverlay: { type: "select", label: "Background overlay", options: ["none", "off", "subtle", "standard", "strong"].map((value) => ({ label: campaignOptionLabel(value), value })) }, textPanelColor: { type: "select", label: "Panel color", options: ["primary", "accent", "foreground", "background", "white"].map((value) => ({ label: campaignOptionLabel(value), value })) }, textPanelOpacity: { type: "select", label: "Panel opacity", options: ["translucent", "solid"].map((value) => ({ label: campaignOptionLabel(value), value })) }, primaryLabel: text("Primary action label"), primaryUrl: plainText("Primary action URL"), secondaryLabel: text("Secondary action label"), secondaryUrl: plainText("Secondary action URL") };
  if (definition.type === "AboutAlt") return { ...common, ...header, ...bridge, body: area("Body"), media: mediaField("Portrait or feature image"), items: bioHighlightsField };
  if (definition.type === "CardsGridAlt") return { ...common, ...bridge, eyebrow: text("Eyebrow"), heading: richTextField("Heading", undefined, "h2"), intro: area("Introduction"), body: area("Body fallback"), items: issueCardsAltField };
  if (definition.type === "PalmCardPointsAlt") return { ...common, ...header, ...bridge, items: palmPointsField };
  if (definition.type === "PalmCardBioAlt") return { ...common, ...bridge, eyebrow: text("Eyebrow"), heading: heading("Heading", "h2"), body: area("Biography"), quote: richTextField("Quote", undefined, "quote", 144), quoteAttribution: text("Quote attribution"), media: mediaField("Photo") };
  if (definition.type === "TestimonialAlt") return { ...common, ...bridge, heading: heading("Heading", "h2"), intro: area("Introduction"), items: testimonialsField };
  if (definition.type === "PalmCardAlt") return { ...common, ...header, ...bridge, body: area("Body fallback"), media: mediaField("Photo"), items: palmContentField, quote: area("Quote"), quoteAttribution: text("Quote attribution") };
  if (definition.type === "PalmCardContactAlt") return { ...common, ...header, ...bridge, electionDay: text("Election day"), earlyVote: text("Early vote"), phone: text("Phone"), email: text("Email"), website: text("Website"), items: contactLinksField, qrImage: mediaField("QR image"), qrCaption: text("QR caption"), disclaimer: text("Paid for / disclaimer") };
  return { ...common, eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), media: mediaField("Primary media"), backgroundMedia: mediaField("Background media"), primaryLabel: text("Primary action label"), primaryUrl: plainText("Primary action URL"), secondaryLabel: text("Secondary action label"), secondaryUrl: plainText("Secondary action URL"), items: campaignItemsField };
}

const campaignAltComponents = Object.fromEntries(campaignAltDefinitions.map((definition) => {
  const nestedDefaults = definition.nestedCollection === "columns"
    ? [{ label: "Column 1", heading: "", text: "", blocks: [] }, { label: "Column 2", heading: "", text: "", blocks: [] }]
    : definition.nestedCollection === "tabs"
      ? [{ label: "First tab", heading: "First tab", text: "Add tab content", blocks: [] }, { label: "Second tab", heading: "Second tab", text: "Add tab content", blocks: [] }]
      : definition.nestedCollection === "cards"
        ? [{ label: "Card 1", heading: "First card", text: "Add card content", blocks: [] }, { label: "Card 2", heading: "Second card", text: "Add card content", blocks: [] }]
        : [];
  const nestedFields = definition.nestedCollection ? { [definition.nestedCollection]: campaignNestedField } : {};
  return [definition.type, {
    label: definition.label,
    defaultProps: { ...campaignAltDefaults(definition), cards: definition.nestedCollection === "cards" ? nestedDefaults : [], columns: definition.nestedCollection === "columns" ? nestedDefaults : [], tabs: definition.nestedCollection === "tabs" ? nestedDefaults : [] },
    fields: { ...campaignAltFields(definition), ...nestedFields },
    render: (props: CampaignAltProps) => <CampaignAltRender definition={definition} props={props} />,
  }];
})) as unknown as Record<CampaignAltType, ComponentConfig<CampaignAltProps>>;

export const puckConfig: Config<Components> = {
  categories: {
    "Home page": { components: ["HeroCountdown", "About", "MeetingInfo", "Events", "MeetingDirectory", "CTMeetingSchedule", "ProgramSchedule", "CallToAction"] },
    "Features & content": { components: ["IssuesSection", "IssueCards"] },
    "Quotes & highlights": { components: ["QuoteBlock", "ResultsStats", "SupporterLogos"] },
    "Actions & tabs": { components: ["ActionTabs", "ButtonRow"] },
    "Media & layout": { components: ["MediaGallery", "ContentRow", "Row", "RowOneColumn", "RowTwoColumns", "RowLeftWide", "RowRightWide", "RowThreeColumns", "RowFourColumns", "Section", "Column"] },
    "Elements for rows": { components: ["Headline", "Text", "Button", "Countdown", "Image", "RichText", "FreeText", "Divider", "BulletedList", "FollowLinks", "InlineForm", "PayPal", "Navigation", "ImageCaption", "Video", "Embed"] },
    "Campaign alternatives": { components: campaignAltTypes },
  },
  root: {
    fields: {
      title: plainText("Page title"),
      slug: plainText("Slug"),
      metaTitle: plainText("SEO title"),
      metaDescription: { type: "textarea", label: "SEO description" },
    },
    render: ({ children }) => <main className={styles.canvas}>{children}</main>,
  },
  components: {
    HeroCountdown: {
      label: "Hero + countdown",
      defaultProps: { eyebrow: "Escaping the Mad Realm", heading: "NECYPAA XXXVI", body: "Connection, service, and recovery.", eventDate: "December 31, 2026 – January 3, 2027", eventLocation: "Hartford, Connecticut", countdownTarget: "2026-12-31T17:00:00-05:00", registerLabel: "Register", registerUrl: "#", hotelLabel: "Book a hotel room", hotelUrl: "#", foregroundImage: null, backgroundImage: null, backgroundPosterImage: null, backgroundDarkness: 45 },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Introduction"), eventDate: text("Dates"), eventLocation: text("Location"), countdownTarget: plainText("Countdown ISO date"), registerLabel: text("Register label"), registerUrl: plainText("Register URL"), hotelLabel: text("Hotel label"), hotelUrl: plainText("Hotel URL"), foregroundImage: mediaField("Foreground image"), backgroundImage: mediaField("Background image or video (optional)", true), backgroundPosterImage: mediaField("Video poster image (optional)"), backgroundDarkness: backgroundDarknessField },
      render: (props) => {
        const foregroundImage = normalizeMedia(props.foregroundImage) || normalizeMedia(props.image);
        const selectedBackground = normalizeMedia(props.backgroundImage);
        const selectedPoster = normalizeMedia(props.backgroundPosterImage);
        const backgroundSource = selectedBackground?.url || "/media/necypaa-portal-background.mp4";
        const backgroundPoster = selectedPoster?.url || (selectedBackground ? undefined : "/images/necypaa-portal-background.webp");
        const backgroundIsVideo = selectedBackground
          ? selectedBackground.mimeType?.startsWith("video/") || /\.(?:mp4|webm)(?:\?.*)?$/i.test(selectedBackground.url)
          : true;
        const foregroundSource = foregroundImage?.url || "/images/necypaa-floating-hotel-hero.webp";
        const foregroundAlt = foregroundImage?.alt || "Hartford Marriott Downtown flying above a floating island with two illustrated mascots";
        const darkness = Number.isFinite(props.backgroundDarkness) ? Math.min(100, Math.max(0, props.backgroundDarkness)) : 45;
        const darknessScale = darkness / 45;
        const overlayStyle = {
          "--hero-overlay-left": Math.min(.96, .7 * darknessScale).toFixed(3),
          "--hero-overlay-middle": Math.min(.96, .46 * darknessScale).toFixed(3),
          "--hero-overlay-right": Math.min(.75, .14 * darknessScale).toFixed(3),
          "--hero-overlay-bottom": Math.min(.9, .28 * darknessScale).toFixed(3),
        } as CSSProperties;

        return (
          <section className={styles.hero} data-has-background="true" id={props.id} style={overlayStyle}>
            {backgroundIsVideo ? (
              <>
                {backgroundPoster ? <img aria-hidden="true" alt="" className={`${styles.heroBackground} ${styles.heroBackgroundPoster}`} src={backgroundPoster} /> : null}
                <video aria-hidden="true" autoPlay className={`${styles.heroBackground} ${styles.heroBackgroundVideo}`} loop muted playsInline poster={backgroundPoster} preload="metadata">
                  <source src={backgroundSource} type={selectedBackground?.mimeType || "video/mp4"} />
                </video>
              </>
            ) : <img aria-hidden="true" alt="" className={styles.heroBackground} src={backgroundSource} />}
            <div className={styles.shell}>
              <div className={styles.heroCopy}>
                <Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable>
                <Editable as="h1" field="heading" props={props}>{props.heading}</Editable>
                <Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable>
                <div className={styles.meta}>
                  <Editable field="eventDate" props={props}>{props.eventDate}</Editable>
                  <Editable field="eventLocation" props={props}>{props.eventLocation}</Editable>
                </div>
                <div className={styles.actions}>
                  <Button href={props.registerUrl}><Editable field="registerLabel" props={props}>{props.registerLabel}</Editable></Button>
                  <Button href={props.hotelUrl} outline><Editable field="hotelLabel" props={props}>{props.hotelLabel}</Editable></Button>
                </div>
              </div>
              <div className={styles.heroArt} data-has-image="true">
                <img alt={foregroundAlt} src={foregroundSource} />
              </div>
              <Countdown target={props.countdownTarget} />
            </div>
          </section>
        );
      },
    },
    About: {
      label: "About + advisory",
      defaultProps: { eyebrow: "About NECYPAA", heading: "A weekend built around connection", body: "Add the convention story here.", advisoryHeading: "Anonymity matters", advisoryBody: "Please protect personal anonymity.", image: null },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), advisoryHeading: text("Advisory heading"), advisoryBody: area("Advisory body"), image: mediaField("About artwork") },
      render: (props) => { const image = normalizeMedia(props.image); return <section className={styles.dark} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div className={styles.artPlaceholder} data-has-image={Boolean(image)}>{image ? <img alt={image.alt || ""} src={image.url} /> : <span>Mad Realm imagery</span>}</div><div><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><aside className={styles.advisory}><Editable as="h3" field="advisoryHeading" props={props}>{props.advisoryHeading}</Editable><Editable as="p" field="advisoryBody" props={props}>{props.advisoryBody}</Editable></aside></div></div></section>; },
    },
    MeetingInfo: {
      label: "Business meeting",
      defaultProps: { eyebrow: "Host committee", heading: "Business meeting", body: "Join the host committee.", date: "Date", time: "Time", location: "Zoom", actionLabel: "Join on Zoom", actionUrl: "#", importantDates: [{ date: "Date", label: "Details" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), date: text("Date"), time: text("Time"), location: text("Location"), actionLabel: text("Action label"), actionUrl: plainText("Action URL"), importantDates: importantDatesField },
      render: (props) => <section className={styles.light} id={props.id}><div className={`${styles.shell} ${styles.meeting}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><dl><div><dt>Date</dt><dd><Editable field="date" props={props}>{props.date}</Editable></dd></div><div><dt>Time</dt><dd><Editable field="time" props={props}>{props.time}</Editable></dd></div><div><dt>Where</dt><dd><Editable field="location" props={props}>{props.location}</Editable></dd></div></dl><Button href={props.actionUrl}><Editable field="actionLabel" props={props}>{props.actionLabel}</Editable></Button></div><aside className={styles.dates}><strong>Important dates</strong><ul>{normalizeImportantDates(props.importantDates).map((item, index) => <li key={`${item.date}-${item.label}-${index}`}><RichCopy as="strong" path={`importantDates[${index}].date`} field="date" value={item.date} />{item.label ? <><span> — </span><RichCopy as="span" path={`importantDates[${index}].label`} field="label" value={item.label} /></> : null}</li>)}</ul></aside></div></section>,
    },
    Events: {
      label: "Upcoming + past events",
      defaultProps: { eyebrow: "Gather with us", heading: "Upcoming and past events", upcomingLabel: "Next up", upcomingTitle: "Upcoming event", upcomingBody: "Event details", upcomingDate: "Date", upcomingLocation: "Location", upcomingImage: null, upcomingEvents: [], pastEvents: [{ title: "Past event", date: "Date", image: null }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), upcomingLabel: text("Upcoming label"), upcomingTitle: text("Upcoming title"), upcomingBody: area("Upcoming description"), upcomingDate: text("Upcoming date"), upcomingLocation: text("Upcoming location"), upcomingImage: mediaField("Upcoming flyer"), upcomingEvents: upcomingEventsField, pastEvents: pastEventsField },
      render: (props) => { const upcomingImage = normalizeMedia(props.upcomingImage); const upcomingEvents = normalizeUpcomingEvents(props.upcomingEvents); return <section className={styles.events} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><div className={styles.eventBlend}><article className={styles.upcoming}><div className={styles.flyer} data-has-image={Boolean(upcomingImage)}>{upcomingImage ? <img alt={upcomingImage.alt || ""} src={upcomingImage.url} /> : "Upcoming flyer"}</div><div><Editable as="p" className={styles.eventLabel} field="upcomingLabel" props={props}>{props.upcomingLabel}</Editable><Editable as="h3" field="upcomingTitle" props={props}>{props.upcomingTitle}</Editable><Editable as="p" field="upcomingBody" props={props}>{props.upcomingBody}</Editable><Editable as="strong" field="upcomingDate" props={props}>{props.upcomingDate}</Editable><Editable as="span" field="upcomingLocation" props={props}>{props.upcomingLocation}</Editable></div></article>{upcomingEvents.length ? <div className={styles.futureEvents}><span>More upcoming events</span><ul>{upcomingEvents.map((item, index) => <li key={`${item.title}-${item.date}-${index}`}><RichCopy as="strong" path={`upcomingEvents[${index}].title`} field="title" value={item.title} /><RichCopy as="time" path={`upcomingEvents[${index}].date`} field="date" value={item.date} /></li>)}</ul></div> : null}<div className={styles.archive}><span>From the archive</span><div>{normalizePastEvents(props.pastEvents).map((item, index) => { const image = normalizeMedia(item.image); return <article key={`${item.title}-${item.date}-${index}`}><div data-has-image={Boolean(image)}>{image ? <img alt={image.alt || ""} src={image.url} /> : "Event flyer"}</div><RichCopy as="small" path={`pastEvents[${index}].date`} field="date" value={item.date} /><RichCopy as="strong" path={`pastEvents[${index}].title`} field="title" value={item.title} /></article>; })}</div></div></div></div></section>; },
    },
    MeetingDirectory: {
      label: "YPAA directory",
      defaultProps: { eyebrow: "Across the Northeast", heading: "YPAA meetings near you", body: "Find fellowship near you.", meetings: [{ name: "Connecticut YPAA", location: "Connecticut" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), meetings: meetingsField },
      render: (props) => <section className={styles.directory} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable></div><ul>{normalizeMeetings(props.meetings).map((item, index) => <li key={`${item.name}-${item.location}-${index}`}><div>{item.url ? <a href={item.url} rel="noreferrer" target="_blank"><RichCopy as="span" path={`meetings[${index}].name`} field="name" value={item.name} /></a> : <RichCopy as="strong" path={`meetings[${index}].name`} field="name" value={item.name} />}<RichCopy as="span" path={`meetings[${index}].location`} field="location" value={item.location} />{item.date ? <RichCopy as="small" path={`meetings[${index}].date`} field="date" value={item.date} /> : null}</div></li>)}</ul></div></section>,
    },
    CTMeetingSchedule: {
      label: "CT Meeting schedule",
      defaultProps: { heading: "Young People's Meetings in Connecticut", introduction: "Click any meeting name for the CT-AA details. Use the arrow to expand the address and meeting types.", meetings: ctMeetingSchedule },
      fields: { heading: text("Heading"), introduction: area("Introduction"), meetings: scheduleMeetingsField },
      render: (props) => <CTMeetingScheduleBlock {...props} />,
    },
    CallToAction: {
      label: "Call to action",
      defaultProps: { eyebrow: "See you there", heading: "Ready for NECYPAA?", body: "Register and reserve your room.", primaryLabel: "Register", primaryUrl: "#", secondaryLabel: "Book a hotel room", secondaryUrl: "#", image: null },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), primaryLabel: text("Primary label"), primaryUrl: plainText("Primary URL"), secondaryLabel: text("Secondary label"), secondaryUrl: plainText("Secondary URL"), image: mediaField("Closing artwork") },
      render: (props) => { const image = normalizeMedia(props.image); return <section className={styles.cta} data-has-image={Boolean(image)} id={props.id}>{image ? <img className={styles.ctaImage} alt={image.alt || ""} src={image.url} /> : null}<div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable><div className={styles.actions}><Button href={props.primaryUrl}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button><Button href={props.secondaryUrl} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button></div></div></section>; },
    },
    Image: {
      label: "Image",
      defaultProps: { image: null, caption: "", aspectRatio: "natural", width: "wide" },
      fields: { image: mediaField("Image"), caption: text("Caption"), aspectRatio: { type: "select", label: "Crop", options: [{ label: "Natural", value: "natural" }, { label: "Landscape", value: "landscape" }, { label: "Portrait", value: "portrait" }, { label: "Square", value: "square" }] }, width: { type: "select", label: "Width", options: [{ label: "Full width", value: "full" }, { label: "Wide", value: "wide" }, { label: "Content", value: "content" }] } },
      render: (props) => { const image = normalizeMedia(props.image); return <figure className={styles.imageBlock} data-aspect={props.aspectRatio} data-width={props.width} id={props.id}>{image ? <img alt={image.alt || ""} src={image.url} /> : <div className={styles.imageEmpty}>Choose an image from Payload Media</div>}{props.caption ? <Editable as="figcaption" field="caption" props={props}>{props.caption}</Editable> : null}</figure>; },
    },
    RichText: {
      label: "Rich text",
      defaultProps: { content: "Write rich text here.", fontSize: "1rem", color: "#171b20", fontWeight: "400", alignment: "left" },
      fields: { content: richTextPlaceholder, fontSize: plainText("Font size"), color: plainText("Color"), fontWeight: { type: "select", label: "Weight", options: [{ label: "Regular", value: "400" }, { label: "Bold", value: "700" }] }, alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      render: (props) => <section className={styles.richText} id={props.id} style={{ color: props.color, fontSize: props.fontSize, fontWeight: props.fontWeight, textAlign: props.alignment }}><div className={styles.shell}><Editable field="content" props={props}>{props.content as ReactNode}</Editable></div></section>,
    },
    FreeText: {
      label: "Free text",
      defaultProps: { text: "Click to edit this text.", fontSize: "1rem", color: "#171b20", fontWeight: "400", alignment: "left" },
      fields: { text: area("Text"), fontSize: plainText("Font size"), color: plainText("Color"), fontWeight: plainText("Weight"), alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      render: (props) => <section className={styles.freeText}><Editable as="p" field="text" props={{ ...props, textFontSize: props.fontSize, textColor: props.color, textFontWeight: props.fontWeight, textTextAlign: props.alignment } as unknown as Base}>{props.text}</Editable></section>,
    },
    ProgramSchedule: {
      label: "Live program",
      defaultProps: { heading: "Your weekend, mapped out", introduction: "Search the live convention schedule by day, room, or session type." },
      fields: { heading: text("Heading"), introduction: area("Introduction") },
      render: (props) => <section id={props.id}><ProgramExplorer embedded heading={<Editable as="h2" field="heading" props={props}>{props.heading}</Editable>} introduction={<Editable as="p" field="introduction" props={props}>{props.introduction}</Editable>} /></section>,
    },
    ButtonRow: {
      label: "Button row",
      defaultProps: { primaryLabel: "Learn more", primaryUrl: "#", secondaryLabel: "Get involved", secondaryUrl: "#", alignment: "left" },
      fields: { primaryLabel: text("Primary label"), primaryUrl: plainText("Primary URL"), secondaryLabel: text("Secondary label"), secondaryUrl: plainText("Secondary URL"), alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      render: (props) => <div className={styles.buttonRow} data-align={props.alignment} id={props.id}><Button href={props.primaryUrl}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button>{props.secondaryLabel ? <Button href={props.secondaryUrl} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button> : null}</div>,
    },
    IssuesSection: {
      label: "Feature section",
      defaultProps: { eyebrow: "What matters", heading: "Priorities for a stronger weekend", body: "Give visitors a clear view of the issues and ideas guiding this work.", issues: [{ title: "Connection", body: "Make meaningful recovery connection easier to find.", icon: "01" }, { title: "Service", body: "Create practical ways to be part of the convention.", icon: "02" }, { title: "Accessibility", body: "Build a welcoming weekend for every attendee.", icon: "03" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Introduction"), issues: issueField },
      render: (props) => <section className={styles.issuesSection} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><div className={styles.issuesGrid}>{props.issues.map((issue, index) => <article key={`${issue.title}-${index}`}><span>{issue.icon || String(index + 1).padStart(2, "0")}</span><RichCopy as="h3" path={`issues[${index}].title`} field="title" value={issue.title} /><RichCopy path={`issues[${index}].body`} field="body" value={issue.body} /></article>)}</div></div></section>,
    },
    IssueCards: {
      label: "Feature cards",
      defaultProps: { heading: "The work in focus", intro: "Use cards for detailed priorities, workshops, or ways to help.", variant: "cards", cards: [{ label: "Recovery", heading: "Bring the next person in", body: "Create a convention experience that makes newcomers feel at home.", image: null, blocks: [] }, { label: "Fellowship", heading: "Make room for connection", body: "Build spaces where people can meet, laugh, and stay involved.", image: null, blocks: [] }, { label: "Service", heading: "Put gratitude into action", body: "Invite people into the work that makes the weekend possible.", image: null, blocks: [] }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), variant: { type: "select", label: "Card style", options: [{ label: "Cards", value: "cards" }, { label: "Editorial", value: "editorial" }, { label: "Image overlay", value: "image" }] }, cards: issueCardsField },
      render: (props) => <section className={styles.issueCards} data-variant={props.variant} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div className={styles.issueCardGrid} data-count={props.cards.length}>{props.cards.map((card, index) => { const image = normalizeMedia(card.image); const label = slotLabel(card.label, `Card ${index + 1}`); return <article data-has-image={Boolean(image)} key={`${card.heading}-${index}`}>{image ? <img alt={image.alt || ""} src={image.url} /> : null}<div>{card.label ? <RichCopy as="small" path={`cards[${index}].label`} field="label" value={card.label} /> : null}<RichCopy as="h3" path={`cards[${index}].heading`} field="heading" value={card.heading} /><RichCopy path={`cards[${index}].body`} field="body" value={card.body} />{card.linkLabel && card.linkUrl ? <a className={styles.cardLink} href={card.linkUrl}><RichCopy as="span" path={`cards[${index}].linkLabel`} field="linkLabel" value={card.linkLabel} /></a> : null}<SlotContent content={card.blocks} label={label} minEmptyHeight={120} fallback={null} /></div></article>; })}</div></div></section>,
    },
    QuoteBlock: {
      label: "Quote / testimonial",
      defaultProps: { heading: "In their own words", quote: "Recovery is not something we do alone. It is something we learn to live together.", attribution: "NECYPAA member", role: "Host committee", image: null },
      fields: { heading: text("Heading"), quote: area("Quote"), attribution: text("Attribution"), role: text("Role"), image: mediaField("Portrait") },
      render: (props) => { const image = normalizeMedia(props.image); return <section className={styles.quote} id={props.id}><div className={styles.shell}><div>{image ? <img alt={image.alt || ""} src={image.url} /> : <span className={styles.quoteMark}>“</span>}</div><div><Editable as="p" className={styles.eyebrow} field="heading" props={props}>{props.heading}</Editable><Editable as="blockquote" field="quote" props={props}>{props.quote}</Editable><Editable as="strong" field="attribution" props={props}>{props.attribution}</Editable><Editable as="span" field="role" props={props}>{props.role}</Editable></div></div></section>; },
    },
    ResultsStats: {
      label: "Statistics",
      defaultProps: { heading: "What we are building", intro: "A few concrete markers of a weekend built by and for the fellowship.", stats: [{ value: "4", label: "days together", detail: "Speakers, workshops, dancing, service, and fellowship." }, { value: "9", label: "states represented", detail: "Young people and young-at-heart members across the Northeast." }, { value: "1", label: "shared purpose", detail: "Carry the message and make space for recovery." }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), stats: statsField },
      render: (props) => <section className={styles.resultsStats} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.stats.map((stat, index) => <article key={`${stat.label}-${index}`}><RichCopy as="strong" path={`stats[${index}].value`} field="value" value={stat.value} /><RichCopy as="span" path={`stats[${index}].label`} field="label" value={stat.label} /><RichCopy path={`stats[${index}].detail`} field="detail" value={stat.detail} /></article>)}</div></div></section>,
    },
    SupporterLogos: {
      label: "Partner logos",
      defaultProps: { heading: "With support from", intro: "Recognize the groups, committees, and partners helping make the weekend possible.", logos: [{ name: "Connecticut YPAA", image: null }, { name: "New England Area", image: null }, { name: "Host Committee", image: null }, { name: "Recovery Community", image: null }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), logos: logosField },
      render: (props) => <section className={styles.supporterLogos} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.logos.map((logo, index) => { const image = normalizeMedia(logo.image); return <article key={`${logo.name}-${index}`}>{image ? <img alt={image.alt || logo.name} src={image.url} /> : <span>{logo.name.slice(0, 2).toUpperCase()}</span>}<RichCopy as="strong" path={`logos[${index}].name`} field="name" value={logo.name} /></article>; })}</div></div></section>,
    },
    ActionTabs: {
      label: "Content tabs",
      defaultProps: { heading: "Choose how to join in", intro: "Give visitors a clear next step and add richer content inside each action tab.", tabs: [{ label: "Register", description: "Save your place for NECYPAA XXXVI.", blocks: [] }, { label: "Volunteer", description: "Join the committee work that brings the convention to life.", blocks: [] }, { label: "Stay connected", description: "Follow announcements, meetings, and upcoming events.", blocks: [] }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), tabs: tabsField },
      render: ActionTabsRender,
    },
    Navigation: { label: "Navigation", defaultProps: { brand: "NECYPAA XXXVI", links: [{ label: "About", url: "#about" }, { label: "Register", url: "#register" }] }, fields: { brand: text("Brand"), links: { type: "array", label: "Links", arrayFields: { label: text("Label"), url: plainText("URL") } } }, render: (props) => <nav className={styles.navigation} id={props.id}><Editable as="strong" field="brand" props={props}>{props.brand}</Editable><div>{props.links.map((link, index) => <a href={link.url || "#"} key={`${link.label}-${index}`}><RichCopy as="span" path={`links[${index}].label`} field="label" value={link.label} /></a>)}</div></nav> },
    Text: { label: "Text", defaultProps: { text: "Add text", fontSize: "1rem", color: "#171b20", alignment: "left" }, fields: { text: area("Text"), fontSize: plainText("Font size"), color: plainText("Color"), alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } }, render: (props) => <section className={styles.freeText} id={props.id} style={{ color: props.color, fontSize: props.fontSize, textAlign: props.alignment }}><Editable field="text" props={props}>{props.text}</Editable></section> },
    Button: { label: "Button", defaultProps: { label: "Learn more", url: "#", style: "solid" }, fields: { label: text("Label"), url: plainText("URL"), style: { type: "select", label: "Style", options: [{ label: "Solid", value: "solid" }, { label: "Outline", value: "outline" }] } }, render: (props) => <a className={styles.button} data-outline={props.style === "outline"} href={props.url || "#"} id={props.id}><Editable field="label" props={props}>{props.label}</Editable></a> },
    Countdown: { label: "Countdown", defaultProps: { target: "2026-12-31T17:00:00-05:00", label: "Time remaining" }, fields: { target: plainText("Target ISO date"), label: text("Label") }, render: (props) => <div className={styles.standaloneCountdown} id={props.id}><Editable field="label" props={props}>{props.label}</Editable><Countdown target={props.target} /></div> },
    Section: { label: "Section", defaultProps: { heading: "Section heading", background: "themeLight", blocks: [] }, fields: { heading: text("Heading"), background: { type: "select", label: "Background", options: [{ label: "Theme light", value: "themeLight" }, { label: "Theme dark", value: "themeDark" }, { label: "Theme surface", value: "themeSurface" }, { label: "Theme primary", value: "themePrimary" }, { label: "Theme secondary", value: "themeSecondary" }, { label: "Theme accent", value: "themeAccent" }, { label: "Muted neutral", value: "muted" }] }, blocks: { type: "slot", allow: nestedElementTypes } }, render: (props) => <section className={styles.builderSection} data-background={props.background} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><SlotContent content={props.blocks} label="section" minEmptyHeight={150} tone={["themeDark", "themePrimary", "themeSecondary"].includes(props.background) ? "dark" : "light"} fallback={<div />}/></div></section> },
    Column: { label: "Column", defaultProps: { label: "Column", blocks: [] }, fields: { label: plainText("Editor label"), blocks: { type: "slot", allow: nestedElementTypes } }, render: (props) => <div className={styles.builderColumn} data-label={props.label} id={props.id}><SlotContent content={props.blocks} label={props.label} minEmptyHeight={150} fallback={<div />}/></div> },
    Headline: { label: "Headline", defaultProps: { text: "Add a headline", level: "h2", alignment: "left" }, fields: { text: text("Headline"), level: { type: "select", label: "Level", options: [{ label: "Heading 1", value: "h1" }, { label: "Heading 2", value: "h2" }, { label: "Heading 3", value: "h3" }] }, alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } }, render: (props) => <Editable as={props.level} className={styles.headline} field="text" props={{ ...props, textTextAlign: props.alignment } as unknown as Base}>{props.text}</Editable> },
    Divider: { label: "Divider", defaultProps: { style: "solid", color: "#d8d0c4" }, fields: { style: { type: "select", label: "Style", options: [{ label: "Solid", value: "solid" }, { label: "Dashed", value: "dashed" }, { label: "Dotted", value: "dotted" }] }, color: { type: "text", label: "Color" } }, render: (props) => <hr className={styles.divider} id={props.id} style={{ borderTopStyle: props.style, borderTopColor: props.color }} /> },
    FollowLinks: { label: "Follow links", defaultProps: { heading: "Follow along", links: [{ label: "Instagram", url: "#" }, { label: "Facebook", url: "#" }] }, fields: { heading: text("Heading"), links: { type: "array", label: "Links", arrayFields: { label: text("Label"), url: plainText("URL") } } }, render: (props) => <section className={styles.followLinks} id={props.id}><Editable as="strong" field="heading" props={props}>{props.heading}</Editable><div>{props.links.map((link, index) => <a href={link.url || "#"} key={`${link.label}-${index}`}><RichCopy as="span" path={`links[${index}].label`} field="label" value={link.label} /></a>)}</div></section> },
    BulletedList: { label: "Bulleted list", defaultProps: { items: [{ text: "Add a list item" }] }, fields: { items: { type: "array", label: "Items", arrayFields: { text: text("Item") } } }, render: (props) => <ul className={styles.bulletedList} id={props.id}>{props.items.map((item, index) => <li key={`${item.text}-${index}`}><RichCopy as="span" path={`items[${index}].text`} field="text" value={item.text} /></li>)}</ul> },
    InlineForm: { label: "Inline form", defaultProps: { heading: "Stay in the loop", intro: "Get updates from the campaign.", submitLabel: "Submit", actionUrl: "#", fields: [{ label: "Email", name: "email", type: "email" }] }, fields: { heading: text("Heading"), intro: area("Introduction"), submitLabel: text("Submit label"), actionUrl: plainText("Action URL"), fields: { type: "array", label: "Fields", arrayFields: { label: text("Label"), name: plainText("Name"), type: { type: "select", label: "Type", options: [{ label: "Text", value: "text" }, { label: "Email", value: "email" }] } } } }, render: (props) => <form action={props.actionUrl || "#"} className={styles.inlineForm} id={props.id} method="post"><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="intro" props={props}>{props.intro}</Editable>{props.fields.map((field, index) => <label key={`${field.name}-${index}`}><RichCopy as="span" path={`fields[${index}].label`} field="label" value={field.label} /><input name={field.name || `field-${index}`} type={field.type} /></label>)}<button className={styles.button} type="submit"><Editable field="submitLabel" props={props}>{props.submitLabel}</Editable></button></form> },
    ImageCaption: { label: "Image + caption", defaultProps: { image: null, caption: "Add an image caption" }, fields: { image: mediaField("Image"), caption: text("Caption") }, render: (props) => { const image = normalizeMedia(props.image); return <figure className={styles.imageCaption} id={props.id}>{image ? <img alt={image.alt || ""} src={image.url} /> : <div>Choose media</div>}<Editable as="figcaption" field="caption" props={props}>{props.caption}</Editable></figure>; } },
    Video: { label: "Video", defaultProps: { video: null, url: "", caption: "" }, fields: { video: mediaField("Video", true), url: plainText("Video URL"), caption: text("Caption") }, render: (props) => { const video = normalizeMedia(props.video); const source = video?.url || props.url; return <figure className={styles.video} id={props.id}>{source ? <video controls src={source} /> : <div>Choose a video</div>}{props.caption ? <Editable as="figcaption" field="caption" props={props}>{props.caption}</Editable> : null}</figure>; } },
    Embed: { label: "Embed", defaultProps: { url: "https://example.com", title: "Embedded content" }, fields: { url: plainText("Embed URL"), title: plainText("Accessible title") }, render: (props) => <iframe className={styles.embed} id={props.id} src={props.url} title={props.title} /> },
    PayPal: { label: "PayPal button", defaultProps: { label: "Donate with PayPal", url: "#", amount: "" }, fields: { label: text("Button label"), url: plainText("PayPal URL"), amount: text("Amount") }, render: (props) => <div className={styles.payPal} id={props.id}><a className={styles.button} href={props.url || "#"}><Editable field="label" props={props}>{props.label}</Editable></a>{props.amount ? <Editable field="amount" props={props}>{props.amount}</Editable> : null}</div> },
    MediaGallery: {
      label: "Media gallery",
      defaultProps: { heading: "From the fellowship", intro: "Add flyers, event moments, and artwork from Payload Media.", items: [{ image: null, caption: "Add a gallery image", size: "large" }, { image: null, caption: "Add a gallery image", size: "medium" }, { image: null, caption: "Add a gallery image", size: "small" }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), items: galleryItemsField },
      render: (props) => <section className={styles.mediaGallery} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.items.map((item, index) => { const image = normalizeMedia(item.image); return <figure data-size={item.size} key={`${item.caption}-${index}`}>{image ? <img alt={image.alt || item.caption} src={image.url} /> : <div>Choose media</div>}<RichCopy as="figcaption" path={`items[${index}].caption`} field="caption" value={item.caption} /></figure>; })}</div></div></section>,
    },
    ContentRow: {
      label: "Content row",
      defaultProps: { layout: "two", columns: [{ label: "Column 1", blocks: [] }, { label: "Column 2", blocks: [] }] },
      fields: contentRowFields,
      render: contentRowRender,
    },
    Row: { label: "Row", defaultProps: { layout: "two", columns: [{ label: "Column 1", blocks: [] }, { label: "Column 2", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowOneColumn: { label: "1 column row", defaultProps: { layout: "one", columns: [{ label: "Column 1", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowTwoColumns: { label: "2 column row", defaultProps: { layout: "two", columns: [{ label: "Column 1", blocks: [] }, { label: "Column 2", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowLeftWide: { label: "left wide row", defaultProps: { layout: "leftWide", columns: [{ label: "Main column", blocks: [] }, { label: "Side column", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowRightWide: { label: "right wide row", defaultProps: { layout: "rightWide", columns: [{ label: "Side column", blocks: [] }, { label: "Main column", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowThreeColumns: { label: "3 column row", defaultProps: { layout: "three", columns: [{ label: "Column 1", blocks: [] }, { label: "Column 2", blocks: [] }, { label: "Column 3", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    RowFourColumns: { label: "4 column row", defaultProps: { layout: "four", columns: [{ label: "Column 1", blocks: [] }, { label: "Column 2", blocks: [] }, { label: "Column 3", blocks: [] }, { label: "Column 4", blocks: [] }] }, fields: contentRowFields, render: contentRowRender },
    ...campaignAltComponents,
  },
};

function normalizeRichTextItem(item: NECYPAAData["content"][number], editor = false) {
  const component = (puckConfig.components as unknown as Record<string, ComponentConfig<Record<string, unknown>>>)[item.type];
  if (!component) return item;
  return {
    ...item,
    props: normalizeNativeRichTextProps(
      (component.fields || {}) as Record<string, NativeRichTextField>,
      item.props as Record<string, unknown>,
      item.type,
      [],
      { editor },
    ),
  } as NECYPAAData["content"][number];
}

Object.entries(puckConfig.components).forEach(([componentType, component]) => {
  const config = component as ComponentConfig<Record<string, unknown>>;
  const render = config.render;
  if (render) {
    config.render = ((props: Record<string, unknown>) => <PuckRenderScope props={props} render={render as unknown as (props: Record<string, unknown>) => ReactNode} />) as typeof config.render;
  }
  config.defaultProps = normalizeNativeRichTextProps(
    (config.fields || {}) as Record<string, NativeRichTextField>,
    config.defaultProps as Record<string, unknown>,
    componentType,
  );
});

export function normalizePuckRichTextData(data: NECYPAAData, editor = false): NECYPAAData {
  return {
    ...data,
    content: data.content.map((item) => normalizeRichTextItem(item, editor)),
    zones: Object.fromEntries(Object.entries(data.zones || {}).map(([zone, content]) => [zone, content.map((item) => normalizeRichTextItem(item, editor))])),
  };
}

export function PublicPuckRender({ data }: { data: NECYPAAData }) {
  return <Render config={puckConfig as unknown as Config} data={normalizePuckRichTextData(data)} />;
}
