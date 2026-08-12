"use client";

import { Render, type Config, type Field, type Slot } from "@puckeditor/core";
import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import { Fragment, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

import { Countdown } from "@/components/site/Countdown";
import { ProgramExplorer } from "@/components/site/ProgramExplorer";
import { normalizeLexicalValue } from "@/puck/lexical-value";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
} from "@/puck/list-values";
import type { ImportantDate, MediaValue, MeetingListing, PastEvent } from "@/puck/list-values";
import type { NECYPAAData } from "@/puck/types";

import styles from "./puck.module.css";

type Base = { id?: string };
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
type Events = Base & { eyebrow: string; heading: string; upcomingLabel: string; upcomingTitle: string; upcomingBody: string; upcomingDate: string; upcomingLocation: string; upcomingImage?: MediaValue | null; pastEvents: PastEvent[] };
type Directory = Base & { eyebrow: string; heading: string; body: string; meetings: MeetingListing[] };
type CTA = Base & { eyebrow: string; heading: string; body: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; image?: MediaValue | null };
type ImageBlock = Base & { image?: MediaValue | null; caption: string; aspectRatio: "natural" | "landscape" | "portrait" | "square"; width: "full" | "wide" | "content" };
type FreeText = Base & { text: string; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };
type RichTextSection = Base & { content: unknown; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };
type ProgramSchedule = Base & { heading: string; introduction: string };
type ButtonRow = Base & { primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string; alignment: "left" | "center" | "right" };
type Issue = { title: string; body: string; icon: string };
type IssuesSection = Base & { eyebrow: string; heading: string; body: string; issues: Issue[] };
type IssueCard = { label: string; heading: string; body: string; image?: MediaValue | null; linkLabel?: string; linkUrl?: string; blocks?: Slot };
type IssueCards = Base & { heading: string; intro: string; variant: "cards" | "editorial" | "image"; cards: IssueCard[] };
type Quote = Base & { heading: string; quote: string; attribution: string; role: string; image?: MediaValue | null };
type ResultStat = { value: string; label: string; detail: string };
type ResultsStats = Base & { heading: string; intro: string; stats: ResultStat[] };
type SupporterLogo = { name: string; image?: MediaValue | null };
type SupporterLogos = Base & { heading: string; intro: string; logos: SupporterLogo[] };
type ActionTab = { label: string; description: string; blocks?: Slot };
type ActionTabs = Base & { heading: string; intro: string; tabs: ActionTab[] };
type GalleryItem = { image?: MediaValue | null; caption: string; size: "small" | "medium" | "large" };
type MediaGallery = Base & { heading: string; intro: string; items: GalleryItem[] };
type ContentColumn = { label: string; blocks?: Slot };
type ContentRow = Base & { layout: "one" | "two" | "leftWide" | "rightWide" | "three" | "four"; columns: ContentColumn[]; column1?: Slot; column2?: Slot; column3?: Slot; column4?: Slot; puck?: { isEditing?: boolean; renderDropZone?: (options: { zone: string; allow: string[]; minEmptyHeight: number }) => ReactNode } };

type Components = { HeroCountdown: Hero; About: About; MeetingInfo: Meeting; Events: Events; MeetingDirectory: Directory; CallToAction: CTA; Image: ImageBlock; RichText: RichTextSection; FreeText: FreeText; ProgramSchedule: ProgramSchedule; ButtonRow: ButtonRow; IssuesSection: IssuesSection; IssueCards: IssueCards; QuoteBlock: Quote; ResultsStats: ResultsStats; SupporterLogos: SupporterLogos; ActionTabs: ActionTabs; MediaGallery: MediaGallery; ContentRow: ContentRow; RowOneColumn: ContentRow; RowTwoColumns: ContentRow; RowLeftWide: ContentRow; RowRightWide: ContentRow; RowThreeColumns: ContentRow; RowFourColumns: ContentRow };

export const editableFieldsByType: Record<keyof Components, string[]> = {
  HeroCountdown: ["eyebrow", "heading", "body", "eventDate", "eventLocation", "registerLabel", "hotelLabel"],
  About: ["eyebrow", "heading", "body", "advisoryHeading", "advisoryBody"],
  MeetingInfo: ["eyebrow", "heading", "body", "date", "time", "location", "actionLabel"],
  Events: ["eyebrow", "heading", "upcomingLabel", "upcomingTitle", "upcomingBody", "upcomingDate", "upcomingLocation"],
  MeetingDirectory: ["eyebrow", "heading", "body"],
  CallToAction: ["eyebrow", "heading", "body", "primaryLabel", "secondaryLabel"],
  Image: ["caption"],
  RichText: ["content"],
  FreeText: ["text"],
  ProgramSchedule: ["heading", "introduction"],
  ButtonRow: ["primaryLabel", "secondaryLabel"],
  IssuesSection: ["eyebrow", "heading", "body"],
  IssueCards: ["heading", "intro"],
  QuoteBlock: ["heading", "quote", "attribution", "role"],
  ResultsStats: ["heading", "intro"],
  SupporterLogos: ["heading", "intro"],
  ActionTabs: ["heading", "intro"],
  MediaGallery: ["heading", "intro"],
  ContentRow: [],
  RowOneColumn: [],
  RowTwoColumns: [],
  RowLeftWide: [],
  RowRightWide: [],
  RowThreeColumns: [],
  RowFourColumns: [],
};

const text = (label: string) => ({ type: "text" as const, label, contentEditable: true });
const area = (label: string) => ({ type: "textarea" as const, label, contentEditable: true });
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

const richTextPlaceholder = {
  type: "custom" as const,
  label: "Rich text",
  render: () => <></>,
};

const importantDatesField: Field<ImportantDate[]> = {
  type: "array",
  label: "Important dates",
  defaultItemProps: { date: "", label: "" },
  arrayFields: { date: plainText("Date"), label: plainText("Details") },
  getItemSummary: (item) => item.label || item.date || "Important date",
};

const pastEventsField: Field<PastEvent[]> = {
  type: "array",
  label: "Past events",
  defaultItemProps: { title: "", date: "", image: null },
  arrayFields: { title: plainText("Title"), date: plainText("Date"), image: mediaField("Event flyer") },
  getItemSummary: (item) => item.title || item.date || "Past event",
};

const meetingsField: Field<MeetingListing[]> = {
  type: "array",
  label: "Meetings",
  defaultItemProps: { name: "", location: "" },
  arrayFields: { name: plainText("Name"), location: plainText("Location") },
  getItemSummary: (item) => item.name || item.location || "Meeting",
};

const issueField: Field<Issue[]> = {
  type: "array",
  label: "Features",
  defaultItemProps: { title: "", body: "", icon: "" },
  arrayFields: { title: plainText("Title"), body: area("Description"), icon: plainText("Icon or short label") },
  getItemSummary: (item) => item.title || "Issue",
};

const nestedElementTypes = ["Image", "RichText", "FreeText", "ButtonRow"];

const issueCardsField: Field<IssueCard[]> = {
  type: "array",
  label: "Feature cards",
  defaultItemProps: { label: "", heading: "", body: "", image: null, linkLabel: "", linkUrl: "" },
  arrayFields: { label: plainText("Editor label"), heading: plainText("Heading"), body: area("Description"), image: mediaField("Card image"), linkLabel: plainText("Link label"), linkUrl: plainText("Link URL"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => item.heading || item.label || "Issue card",
};

const statsField: Field<ResultStat[]> = {
  type: "array",
  label: "Statistics",
  defaultItemProps: { value: "", label: "", detail: "" },
  arrayFields: { value: plainText("Value"), label: plainText("Label"), detail: area("Detail") },
  getItemSummary: (item) => item.label || item.value || "Result",
};

const logosField: Field<SupporterLogo[]> = {
  type: "array",
  label: "Partners",
  defaultItemProps: { name: "", image: null },
  arrayFields: { name: plainText("Name"), image: mediaField("Logo") },
  getItemSummary: (item) => item.name || "Supporter",
};

const tabsField: Field<ActionTab[]> = {
  type: "array",
  label: "Content tabs",
  defaultItemProps: { label: "", description: "" },
  arrayFields: { label: plainText("Tab label"), description: area("Description"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => item.label || "Action tab",
};

const galleryItemsField: Field<GalleryItem[]> = {
  type: "array",
  label: "Gallery items",
  defaultItemProps: { image: null, caption: "", size: "medium" },
  arrayFields: { image: mediaField("Image"), caption: plainText("Caption"), size: { type: "select", label: "Tile size", options: [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }] } },
  getItemSummary: (item) => item.caption || "Gallery item",
};

const columnsField: Field<ContentColumn[]> = {
  type: "array",
  label: "Columns",
  defaultItemProps: { label: "" },
  arrayFields: { label: plainText("Editor label"), blocks: { type: "slot", allow: nestedElementTypes } },
  getItemSummary: (item) => item.label || "Column",
};

const contentRowFields = { layout: { type: "select" as const, label: "Columns", options: [{ label: "One column", value: "one" }, { label: "Two equal", value: "two" }, { label: "Left wide", value: "leftWide" }, { label: "Right wide", value: "rightWide" }, { label: "Three equal", value: "three" }, { label: "Four equal", value: "four" }] }, columns: columnsField };

function NestedDropZone({ children, label }: { children: ReactNode; label: string }) {
  return <div className={styles.nestedDropZone}><span>{label}</span>{children}</div>;
}

function renderZone(props: Base & { puck?: { isEditing?: boolean; renderDropZone?: (options: { zone: string; allow: string[]; minEmptyHeight: number }) => ReactNode } }, zone: string, label: string) {
  const content = props.puck?.renderDropZone ? props.puck.renderDropZone({ zone, allow: nestedElementTypes, minEmptyHeight: 96 }) : null;
  return props.puck?.isEditing ? <NestedDropZone label={label}>{content}</NestedDropZone> : <>{content}</>;
}

function SlotContent({ content, label, fallback }: { content?: Slot; label: string; fallback: ReactNode }) {
  if (typeof content === "function") {
    const Content = content;
    return <Content className={styles.nestedSlot} minEmptyHeight={96} allow={nestedElementTypes} />;
  }
  return <>{fallback}</>;
}

function contentRowRender(props: ContentRow) {
  return <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{(props.columns || []).map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}<SlotContent content={column.blocks} label={column.label || `column ${index + 1}`} fallback={renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)} /></article>)}</div></div></section>;
}

function ActionTabsRender(props: ActionTabs & { puck?: { isEditing?: boolean; renderDropZone?: (options: { zone: string; allow: string[]; minEmptyHeight: number }) => ReactNode } }) {
  const [active, setActive] = useState(0);
  const tabs = props.tabs?.length ? props.tabs : [];
  const editing = Boolean(props.puck?.isEditing);
  return <section className={styles.actionTabs} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div className={styles.tabList} role="tablist">{tabs.map((tab, index) => <button aria-selected={active === index} key={`${tab.label}-${index}`} onClick={() => setActive(index)} role="tab" type="button">{tab.label || `Tab ${index + 1}`}</button>)}</div><div className={styles.tabPanels}>{tabs.map((tab, index) => (editing || active === index) ? <section aria-label={tab.label || `Tab ${index + 1}`} className={styles.tabPanel} hidden={!editing && active !== index} key={`${tab.label}-${index}`}><Editable as="p" field="intro" props={props}>{tab.description}</Editable><SlotContent content={tab.blocks} label={tab.label || `tab ${index + 1}`} fallback={renderZone(props, `${props.id}:tabs.${index}.blocks`, `Drop elements in ${tab.label || `tab ${index + 1}`}`)} /></section> : null)}</div></div></section>;
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

function Editable({ as: Tag = "span", props, field, children, className }: { as?: ElementType; props: Base; field: string; children: ReactNode; className?: string }) {
  const focus = () => {
    if (typeof props.id !== "string") return;
    window.parent.postMessage({ type: "necypaa:puck-text-focus", componentId: props.id, field }, window.location.origin);
  };
  return <Tag className={className} data-puck-text-field={field} onFocus={focus} onPointerDown={focus} style={styleFor(props, field)}>{children}</Tag>;
}

function Button({ href, children, outline = false }: { href: string; children: ReactNode; outline?: boolean }) {
  return <a className={styles.button} data-outline={outline} href={href || "#"}>{children}</a>;
}

export const puckConfig: Config<Components> = {
  categories: {
    "Home page": { components: ["HeroCountdown", "About", "MeetingInfo", "Events", "MeetingDirectory", "ProgramSchedule", "CallToAction"] },
    "Features & content": { components: ["IssuesSection", "IssueCards"] },
    "Quotes & highlights": { components: ["QuoteBlock", "ResultsStats", "SupporterLogos"] },
    "Actions & tabs": { components: ["ActionTabs", "ButtonRow"] },
    "Media & layout": { components: ["MediaGallery", "ContentRow"] },
    "Elements for rows": { components: ["Image", "RichText", "FreeText"] },
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
      render: (props) => <section className={styles.light} id={props.id}><div className={`${styles.shell} ${styles.meeting}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><dl><div><dt>Date</dt><dd><Editable field="date" props={props}>{props.date}</Editable></dd></div><div><dt>Time</dt><dd><Editable field="time" props={props}>{props.time}</Editable></dd></div><div><dt>Where</dt><dd><Editable field="location" props={props}>{props.location}</Editable></dd></div></dl><Button href={props.actionUrl}><Editable field="actionLabel" props={props}>{props.actionLabel}</Editable></Button></div><aside className={styles.dates}><strong>Important dates</strong><ul>{normalizeImportantDates(props.importantDates).map((item, index) => <li key={`${item.date}-${item.label}-${index}`}><strong>{item.date}</strong>{item.label ? ` — ${item.label}` : ""}</li>)}</ul></aside></div></section>,
    },
    Events: {
      label: "Upcoming + past events",
      defaultProps: { eyebrow: "Gather with us", heading: "Upcoming and past events", upcomingLabel: "Next up", upcomingTitle: "Upcoming event", upcomingBody: "Event details", upcomingDate: "Date", upcomingLocation: "Location", upcomingImage: null, pastEvents: [{ title: "Past event", date: "Date", image: null }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), upcomingLabel: text("Upcoming label"), upcomingTitle: text("Upcoming title"), upcomingBody: area("Upcoming description"), upcomingDate: text("Upcoming date"), upcomingLocation: text("Upcoming location"), upcomingImage: mediaField("Upcoming flyer"), pastEvents: pastEventsField },
      render: (props) => { const upcomingImage = normalizeMedia(props.upcomingImage); return <section className={styles.events} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><div className={styles.eventBlend}><article className={styles.upcoming}><div className={styles.flyer} data-has-image={Boolean(upcomingImage)}>{upcomingImage ? <img alt={upcomingImage.alt || ""} src={upcomingImage.url} /> : "Upcoming flyer"}</div><div><Editable as="p" className={styles.eventLabel} field="upcomingLabel" props={props}>{props.upcomingLabel}</Editable><Editable as="h3" field="upcomingTitle" props={props}>{props.upcomingTitle}</Editable><Editable as="p" field="upcomingBody" props={props}>{props.upcomingBody}</Editable><Editable as="strong" field="upcomingDate" props={props}>{props.upcomingDate}</Editable><Editable as="span" field="upcomingLocation" props={props}>{props.upcomingLocation}</Editable></div></article><div className={styles.archive}><span>From the archive</span><div>{normalizePastEvents(props.pastEvents).map((item, index) => { const image = normalizeMedia(item.image); return <article key={`${item.title}-${item.date}-${index}`}><div data-has-image={Boolean(image)}>{image ? <img alt={image.alt || ""} src={image.url} /> : "Event flyer"}</div><small>{item.date}</small><strong>{item.title}</strong></article>; })}</div></div></div></div></section>; },
    },
    MeetingDirectory: {
      label: "YPAA directory",
      defaultProps: { eyebrow: "Across the Northeast", heading: "YPAA meetings near you", body: "Find fellowship near you.", meetings: [{ name: "Connecticut YPAA", location: "Connecticut" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), meetings: meetingsField },
      render: (props) => <section className={styles.directory} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable></div><ul>{normalizeMeetings(props.meetings).map((item, index) => <li key={`${item.name}-${item.location}-${index}`}><strong>{item.name}</strong><span>{item.location}</span></li>)}</ul></div></section>,
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
      defaultProps: { content: normalizeLexicalValue("Write rich text here."), fontSize: "1rem", color: "#171b20", fontWeight: "400", alignment: "left" },
      fields: { content: richTextPlaceholder, fontSize: plainText("Font size"), color: plainText("Color"), fontWeight: { type: "select", label: "Weight", options: [{ label: "Regular", value: "400" }, { label: "Bold", value: "700" }] }, alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      render: (props) => <section className={styles.richText} id={props.id} onPointerDown={() => { if (typeof props.id === "string") window.parent.postMessage({ type: "necypaa:puck-text-focus", componentId: props.id, field: "content" }, window.location.origin); }} style={{ color: props.color, fontSize: props.fontSize, fontWeight: props.fontWeight, textAlign: props.alignment }}><div className={styles.shell}><PayloadRichText data={normalizeLexicalValue(props.content)} /></div></section>,
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
      render: (props) => <section id={props.id}><ProgramExplorer embedded heading={props.heading} introduction={props.introduction} /></section>,
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
      render: (props) => <section className={styles.issuesSection} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><div className={styles.issuesGrid}>{props.issues.map((issue, index) => <article key={`${issue.title}-${index}`}><span>{issue.icon || String(index + 1).padStart(2, "0")}</span><h3>{issue.title}</h3><p>{issue.body}</p></article>)}</div></div></section>,
    },
    IssueCards: {
      label: "Feature cards",
      defaultProps: { heading: "The work in focus", intro: "Use cards for detailed priorities, workshops, or ways to help.", variant: "cards", cards: [{ label: "Recovery", heading: "Bring the next person in", body: "Create a convention experience that makes newcomers feel at home.", image: null }, { label: "Fellowship", heading: "Make room for connection", body: "Build spaces where people can meet, laugh, and stay involved.", image: null }, { label: "Service", heading: "Put gratitude into action", body: "Invite people into the work that makes the weekend possible.", image: null }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), variant: { type: "select", label: "Card style", options: [{ label: "Cards", value: "cards" }, { label: "Editorial", value: "editorial" }, { label: "Image overlay", value: "image" }] }, cards: issueCardsField },
      render: (props) => <section className={styles.issueCards} data-variant={props.variant} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div className={styles.issueCardGrid}>{props.cards.map((card, index) => { const image = normalizeMedia(card.image); return <article data-has-image={Boolean(image)} key={`${card.heading}-${index}`}>{image ? <img alt={image.alt || ""} src={image.url} /> : null}<div><small>{card.label}</small><h3>{card.heading}</h3><p>{card.body}</p>{card.linkLabel && card.linkUrl ? <a className={styles.cardLink} href={card.linkUrl}>{card.linkLabel}</a> : null}<SlotContent content={card.blocks} label={card.label || `card ${index + 1}`} fallback={renderZone(props, `${props.id}:cards.${index}.blocks`, `Drop elements in ${card.label || `card ${index + 1}`}`)} /></div></article>; })}</div></div></section>,
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
      render: (props) => <section className={styles.resultsStats} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.stats.map((stat, index) => <article key={`${stat.label}-${index}`}><strong>{stat.value}</strong><span>{stat.label}</span><p>{stat.detail}</p></article>)}</div></div></section>,
    },
    SupporterLogos: {
      label: "Partner logos",
      defaultProps: { heading: "With support from", intro: "Recognize the groups, committees, and partners helping make the weekend possible.", logos: [{ name: "Connecticut YPAA", image: null }, { name: "New England Area", image: null }, { name: "Host Committee", image: null }, { name: "Recovery Community", image: null }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), logos: logosField },
      render: (props) => <section className={styles.supporterLogos} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.logos.map((logo, index) => { const image = normalizeMedia(logo.image); return <article key={`${logo.name}-${index}`}>{image ? <img alt={image.alt || logo.name} src={image.url} /> : <span>{logo.name.slice(0, 2).toUpperCase()}</span>}<strong>{logo.name}</strong></article>; })}</div></div></section>,
    },
    ActionTabs: {
      label: "Content tabs",
      defaultProps: { heading: "Choose how to join in", intro: "Give visitors a clear next step and add richer content inside each action tab.", tabs: [{ label: "Register", description: "Save your place for NECYPAA XXXVI." }, { label: "Volunteer", description: "Join the committee work that brings the convention to life." }, { label: "Stay connected", description: "Follow announcements, meetings, and upcoming events." }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), tabs: tabsField },
      render: ActionTabsRender,
    },
    MediaGallery: {
      label: "Media gallery",
      defaultProps: { heading: "From the fellowship", intro: "Add flyers, event moments, and artwork from Payload Media.", items: [{ image: null, caption: "Add a gallery image", size: "large" }, { image: null, caption: "Add a gallery image", size: "medium" }, { image: null, caption: "Add a gallery image", size: "small" }] },
      fields: { heading: text("Heading"), intro: area("Introduction"), items: galleryItemsField },
      render: (props) => <section className={styles.mediaGallery} id={props.id}><div className={styles.shell}><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="intro" props={props}>{props.intro}</Editable><div>{props.items.map((item, index) => { const image = normalizeMedia(item.image); return <figure data-size={item.size} key={`${item.caption}-${index}`}>{image ? <img alt={image.alt || item.caption} src={image.url} /> : <div>Choose media</div>}<Editable as="figcaption" field="intro" props={props}>{item.caption}</Editable></figure>; })}</div></div></section>,
    },
    ContentRow: {
      label: "Content row",
      defaultProps: { layout: "two", columns: [{ label: "Column 1" }, { label: "Column 2" }] },
      fields: contentRowFields,
      render: contentRowRender,
    },
    RowOneColumn: { label: "1 column row", defaultProps: { layout: "one", columns: [{ label: "Column 1" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
    RowTwoColumns: { label: "2 column row", defaultProps: { layout: "two", columns: [{ label: "Column 1" }, { label: "Column 2" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
    RowLeftWide: { label: "left wide row", defaultProps: { layout: "leftWide", columns: [{ label: "Main column" }, { label: "Side column" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
    RowRightWide: { label: "right wide row", defaultProps: { layout: "rightWide", columns: [{ label: "Side column" }, { label: "Main column" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
    RowThreeColumns: { label: "3 column row", defaultProps: { layout: "three", columns: [{ label: "Column 1" }, { label: "Column 2" }, { label: "Column 3" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
    RowFourColumns: { label: "4 column row", defaultProps: { layout: "four", columns: [{ label: "Column 1" }, { label: "Column 2" }, { label: "Column 3" }, { label: "Column 4" }] }, fields: contentRowFields, render: (props) => <section className={styles.contentRow} data-layout={props.layout} id={props.id}><div className={styles.shell}><div>{props.columns.map((column, index) => <article key={`${column.label}-${index}`}>{props.puck?.isEditing ? <span>{column.label || `Column ${index + 1}`}</span> : null}{renderZone(props, `${props.id}:columns.${index}.blocks`, `Drop elements in ${column.label || `column ${index + 1}`}`)}</article>)}</div></div></section> },
  },
};

export function PublicPuckRender({ data }: { data: NECYPAAData }) {
  return <Render config={puckConfig as unknown as Config} data={data} />;
}
