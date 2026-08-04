"use client";

import type { Config, Field } from "@puckeditor/core";
import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";

import { Countdown } from "@/components/site/Countdown";
import { normalizeLexicalValue } from "@/puck/lexical-value";
import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
} from "@/puck/list-values";
import type { ImportantDate, MeetingListing, PastEvent } from "@/puck/list-values";
import type { NECYPAAData } from "@/puck/types";

import styles from "./puck.module.css";

type Base = { id?: string };
type Hero = Base & { eyebrow: string; heading: string; body: string; eventDate: string; eventLocation: string; countdownTarget: string; registerLabel: string; registerUrl: string; hotelLabel: string; hotelUrl: string };
type About = Base & { eyebrow: string; heading: string; body: string; advisoryHeading: string; advisoryBody: string };
type Meeting = Base & { eyebrow: string; heading: string; body: string; date: string; time: string; location: string; actionLabel: string; actionUrl: string; importantDates: ImportantDate[] };
type Events = Base & { eyebrow: string; heading: string; upcomingLabel: string; upcomingTitle: string; upcomingBody: string; upcomingDate: string; upcomingLocation: string; pastEvents: PastEvent[] };
type Directory = Base & { eyebrow: string; heading: string; body: string; meetings: MeetingListing[] };
type CTA = Base & { eyebrow: string; heading: string; body: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string };
type FreeText = Base & { text: string; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };
type RichTextSection = Base & { content: unknown; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };

type Components = { HeroCountdown: Hero; About: About; MeetingInfo: Meeting; Events: Events; MeetingDirectory: Directory; CallToAction: CTA; RichText: RichTextSection; FreeText: FreeText };

export const editableFieldsByType: Record<keyof Components, string[]> = {
  HeroCountdown: ["eyebrow", "heading", "body", "eventDate", "eventLocation", "registerLabel", "hotelLabel"],
  About: ["eyebrow", "heading", "body", "advisoryHeading", "advisoryBody"],
  MeetingInfo: ["eyebrow", "heading", "body", "date", "time", "location", "actionLabel"],
  Events: ["eyebrow", "heading", "upcomingLabel", "upcomingTitle", "upcomingBody", "upcomingDate", "upcomingLocation"],
  MeetingDirectory: ["eyebrow", "heading", "body"],
  CallToAction: ["eyebrow", "heading", "body", "primaryLabel", "secondaryLabel"],
  RichText: ["content"],
  FreeText: ["text"],
};

const text = (label: string) => ({ type: "text" as const, label, contentEditable: true });
const area = (label: string) => ({ type: "textarea" as const, label, contentEditable: true });
const plainText = (label: string) => ({ type: "text" as const, label });

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
  defaultItemProps: { title: "", date: "" },
  arrayFields: { title: plainText("Title"), date: plainText("Date") },
  getItemSummary: (item) => item.title || item.date || "Past event",
};

const meetingsField: Field<MeetingListing[]> = {
  type: "array",
  label: "Meetings",
  defaultItemProps: { name: "", location: "" },
  arrayFields: { name: plainText("Name"), location: plainText("Location") },
  getItemSummary: (item) => item.name || item.location || "Meeting",
};

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
    "NECYPAA sections": { components: ["HeroCountdown", "About", "MeetingInfo", "Events", "MeetingDirectory", "CallToAction"] },
    "Flexible elements": { components: ["RichText", "FreeText"] },
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
      defaultProps: { eyebrow: "Escaping the Mad Realm", heading: "NECYPAA XXXVI", body: "Connection, service, and recovery.", eventDate: "December 31, 2026 – January 3, 2027", eventLocation: "Hartford, Connecticut", countdownTarget: "2026-12-31T17:00:00-05:00", registerLabel: "Register", registerUrl: "#", hotelLabel: "Book a hotel room", hotelUrl: "#" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Introduction"), eventDate: text("Dates"), eventLocation: text("Location"), countdownTarget: plainText("Countdown ISO date"), registerLabel: text("Register label"), registerUrl: plainText("Register URL"), hotelLabel: text("Hotel label"), hotelUrl: plainText("Hotel URL") },
      render: (props) => <section className={styles.hero} id={props.id}><div className={styles.shell}><div className={styles.heroCopy}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h1" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable><div className={styles.meta}><Editable field="eventDate" props={props}>{props.eventDate}</Editable><Editable field="eventLocation" props={props}>{props.eventLocation}</Editable></div><div className={styles.actions}><Button href={props.registerUrl}><Editable field="registerLabel" props={props}>{props.registerLabel}</Editable></Button><Button href={props.hotelUrl} outline><Editable field="hotelLabel" props={props}>{props.hotelLabel}</Editable></Button></div></div><div className={styles.heroArt} aria-hidden="true"><i /><i /><i /></div><Countdown target={props.countdownTarget} /></div></section>,
    },
    About: {
      label: "About + advisory",
      defaultProps: { eyebrow: "About NECYPAA", heading: "A weekend built around connection", body: "Add the convention story here.", advisoryHeading: "Anonymity matters", advisoryBody: "Please protect personal anonymity." },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), advisoryHeading: text("Advisory heading"), advisoryBody: area("Advisory body") },
      render: (props) => <section className={styles.dark} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div className={styles.artPlaceholder} role="img" aria-label="Convention artwork placeholder"><span>Mad Realm imagery</span></div><div><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><aside className={styles.advisory}><Editable as="h3" field="advisoryHeading" props={props}>{props.advisoryHeading}</Editable><Editable as="p" field="advisoryBody" props={props}>{props.advisoryBody}</Editable></aside></div></div></section>,
    },
    MeetingInfo: {
      label: "Business meeting",
      defaultProps: { eyebrow: "Host committee", heading: "Business meeting", body: "Join the host committee.", date: "Date", time: "Time", location: "Zoom", actionLabel: "Join on Zoom", actionUrl: "#", importantDates: [{ date: "Date", label: "Details" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), date: text("Date"), time: text("Time"), location: text("Location"), actionLabel: text("Action label"), actionUrl: plainText("Action URL"), importantDates: importantDatesField },
      render: (props) => <section className={styles.light} id={props.id}><div className={`${styles.shell} ${styles.meeting}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><dl><div><dt>Date</dt><dd><Editable field="date" props={props}>{props.date}</Editable></dd></div><div><dt>Time</dt><dd><Editable field="time" props={props}>{props.time}</Editable></dd></div><div><dt>Where</dt><dd><Editable field="location" props={props}>{props.location}</Editable></dd></div></dl><Button href={props.actionUrl}><Editable field="actionLabel" props={props}>{props.actionLabel}</Editable></Button></div><aside className={styles.dates}><strong>Important dates</strong><ul>{normalizeImportantDates(props.importantDates).map((item, index) => <li key={`${item.date}-${item.label}-${index}`}><strong>{item.date}</strong>{item.label ? ` — ${item.label}` : ""}</li>)}</ul></aside></div></section>,
    },
    Events: {
      label: "Upcoming + past events",
      defaultProps: { eyebrow: "Gather with us", heading: "Upcoming and past events", upcomingLabel: "Next up", upcomingTitle: "Upcoming event", upcomingBody: "Event details", upcomingDate: "Date", upcomingLocation: "Location", pastEvents: [{ title: "Past event", date: "Date" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), upcomingLabel: text("Upcoming label"), upcomingTitle: text("Upcoming title"), upcomingBody: area("Upcoming description"), upcomingDate: text("Upcoming date"), upcomingLocation: text("Upcoming location"), pastEvents: pastEventsField },
      render: (props) => <section className={styles.events} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><div className={styles.eventBlend}><article className={styles.upcoming}><div className={styles.flyer}>Upcoming flyer</div><div><Editable as="p" className={styles.eventLabel} field="upcomingLabel" props={props}>{props.upcomingLabel}</Editable><Editable as="h3" field="upcomingTitle" props={props}>{props.upcomingTitle}</Editable><Editable as="p" field="upcomingBody" props={props}>{props.upcomingBody}</Editable><Editable as="strong" field="upcomingDate" props={props}>{props.upcomingDate}</Editable><Editable as="span" field="upcomingLocation" props={props}>{props.upcomingLocation}</Editable></div></article><div className={styles.archive}><span>From the archive</span><div>{normalizePastEvents(props.pastEvents).map((item, index) => <article key={`${item.title}-${item.date}-${index}`}><div>Event flyer</div><small>{item.date}</small><strong>{item.title}</strong></article>)}</div></div></div></div></section>,
    },
    MeetingDirectory: {
      label: "YPAA directory",
      defaultProps: { eyebrow: "Across the Northeast", heading: "YPAA meetings near you", body: "Find fellowship near you.", meetings: [{ name: "Connecticut YPAA", location: "Connecticut" }] },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), meetings: meetingsField },
      render: (props) => <section className={styles.directory} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable></div><ul>{normalizeMeetings(props.meetings).map((item, index) => <li key={`${item.name}-${item.location}-${index}`}><strong>{item.name}</strong><span>{item.location}</span></li>)}</ul></div></section>,
    },
    CallToAction: {
      label: "Call to action",
      defaultProps: { eyebrow: "See you there", heading: "Ready for NECYPAA?", body: "Register and reserve your room.", primaryLabel: "Register", primaryUrl: "#", secondaryLabel: "Book a hotel room", secondaryUrl: "#" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), primaryLabel: text("Primary label"), primaryUrl: plainText("Primary URL"), secondaryLabel: text("Secondary label"), secondaryUrl: plainText("Secondary URL") },
      render: (props) => <section className={styles.cta} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable><div className={styles.actions}><Button href={props.primaryUrl}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button><Button href={props.secondaryUrl} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button></div></div></section>,
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
  },
};

export function PublicPuckRender({ data }: { data: NECYPAAData }) {
  const renderers = puckConfig.components as unknown as Record<
    string,
    { render: (props: Base) => ReactNode }
  >;

  return (
    <main className={styles.canvas}>
      {data.content.map((item, index) => {
        const renderer = renderers[item.type];
        if (!renderer) return null;
        const key = typeof item.props.id === "string" ? item.props.id : `${item.type}-${index}`;
        return <Fragment key={key}>{renderer.render(item.props as Base)}</Fragment>;
      })}
    </main>
  );
}
