"use client";

import type { Config } from "@puckeditor/core";
import type { CSSProperties, ElementType, ReactNode } from "react";

import { Countdown } from "@/components/site/Countdown";

import styles from "./puck.module.css";

type Base = { id?: string } & Record<string, unknown>;
type Hero = Base & { eyebrow: string; heading: string; body: string; eventDate: string; eventLocation: string; countdownTarget: string; registerLabel: string; registerUrl: string; hotelLabel: string; hotelUrl: string };
type About = Base & { eyebrow: string; heading: string; body: string; advisoryHeading: string; advisoryBody: string };
type Meeting = Base & { eyebrow: string; heading: string; body: string; date: string; time: string; location: string; actionLabel: string; actionUrl: string; importantDates: string };
type Events = Base & { eyebrow: string; heading: string; upcomingLabel: string; upcomingTitle: string; upcomingBody: string; upcomingDate: string; upcomingLocation: string; pastEvents: string };
type Directory = Base & { eyebrow: string; heading: string; body: string; meetings: string };
type CTA = Base & { eyebrow: string; heading: string; body: string; primaryLabel: string; primaryUrl: string; secondaryLabel: string; secondaryUrl: string };
type FreeText = Base & { text: string; fontSize: string; color: string; fontWeight: string; alignment: "left" | "center" | "right" };

type Components = { HeroCountdown: Hero; About: About; MeetingInfo: Meeting; Events: Events; MeetingDirectory: Directory; CallToAction: CTA; FreeText: FreeText };

export const editableFieldsByType: Record<keyof Components, string[]> = {
  HeroCountdown: ["eyebrow", "heading", "body", "eventDate", "eventLocation", "registerLabel", "hotelLabel"],
  About: ["eyebrow", "heading", "body", "advisoryHeading", "advisoryBody"],
  MeetingInfo: ["eyebrow", "heading", "body", "date", "time", "location", "actionLabel"],
  Events: ["eyebrow", "heading", "upcomingLabel", "upcomingTitle", "upcomingBody", "upcomingDate", "upcomingLocation"],
  MeetingDirectory: ["eyebrow", "heading", "body"],
  CallToAction: ["eyebrow", "heading", "body", "primaryLabel", "secondaryLabel"],
  FreeText: ["text"],
};

const text = (label: string) => ({ type: "text" as const, label, contentEditable: true });
const area = (label: string) => ({ type: "textarea" as const, label, contentEditable: true });

function styleFor(props: Base, field: string): CSSProperties {
  const cap = `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
  const fontSize = props[`${field}FontSize`];
  const color = props[`${field}Color`];
  const fontWeight = props[`${field}FontWeight`];
  const textAlign = props[`${field}TextAlign`];
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
    "Flexible elements": { components: ["FreeText"] },
  },
  root: {
    fields: { title: text("Page title") },
    render: ({ children }) => <main className={styles.canvas}>{children}</main>,
  },
  components: {
    HeroCountdown: {
      label: "Hero + countdown",
      defaultProps: { eyebrow: "Escaping the Mad Realm", heading: "NECYPAA XXXVI", body: "Connection, service, and recovery.", eventDate: "December 31, 2026 – January 3, 2027", eventLocation: "Hartford, Connecticut", countdownTarget: "2026-12-31T17:00:00-05:00", registerLabel: "Register", registerUrl: "#", hotelLabel: "Book a hotel room", hotelUrl: "#" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Introduction"), eventDate: text("Dates"), eventLocation: text("Location"), countdownTarget: text("Countdown ISO date"), registerLabel: text("Register label"), registerUrl: text("Register URL"), hotelLabel: text("Hotel label"), hotelUrl: text("Hotel URL") },
      render: (props) => <section className={styles.hero} id={props.id}><div className={styles.heroArt} aria-hidden="true"><i /><i /><i /></div><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h1" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable><div className={styles.meta}><Editable field="eventDate" props={props}>{props.eventDate}</Editable><Editable field="eventLocation" props={props}>{props.eventLocation}</Editable></div><div className={styles.actions}><Button href={props.registerUrl}><Editable field="registerLabel" props={props}>{props.registerLabel}</Editable></Button><Button href={props.hotelUrl} outline><Editable field="hotelLabel" props={props}>{props.hotelLabel}</Editable></Button></div><Countdown target={props.countdownTarget} /></div></section>,
    },
    About: {
      label: "About + advisory",
      defaultProps: { eyebrow: "About NECYPAA", heading: "A weekend built around connection", body: "Add the convention story here.", advisoryHeading: "Anonymity matters", advisoryBody: "Please protect personal anonymity." },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), advisoryHeading: text("Advisory heading"), advisoryBody: area("Advisory body") },
      render: (props) => <section className={styles.dark} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div className={styles.artPlaceholder} role="img" aria-label="Convention artwork placeholder"><span>Mad Realm imagery</span></div><div><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><aside className={styles.advisory}><Editable as="h3" field="advisoryHeading" props={props}>{props.advisoryHeading}</Editable><Editable as="p" field="advisoryBody" props={props}>{props.advisoryBody}</Editable></aside></div></div></section>,
    },
    MeetingInfo: {
      label: "Business meeting",
      defaultProps: { eyebrow: "Host committee", heading: "Business meeting", body: "Join the host committee.", date: "Date", time: "Time", location: "Zoom", actionLabel: "Join on Zoom", actionUrl: "#", importantDates: "Important date — Details" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), date: text("Date"), time: text("Time"), location: text("Location"), actionLabel: text("Action label"), actionUrl: text("Action URL"), importantDates: area("Important dates") },
      render: (props) => <section className={styles.light} id={props.id}><div className={`${styles.shell} ${styles.meeting}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.body} field="body" props={props}>{props.body}</Editable><dl><div><dt>Date</dt><dd><Editable field="date" props={props}>{props.date}</Editable></dd></div><div><dt>Time</dt><dd><Editable field="time" props={props}>{props.time}</Editable></dd></div><div><dt>Where</dt><dd><Editable field="location" props={props}>{props.location}</Editable></dd></div></dl><Button href={props.actionUrl}><Editable field="actionLabel" props={props}>{props.actionLabel}</Editable></Button></div><aside className={styles.dates}><strong>Important dates</strong><ul>{props.importantDates.split("\n").filter(Boolean).map((item) => <li key={item}>{item}</li>)}</ul></aside></div></section>,
    },
    Events: {
      label: "Upcoming + past events",
      defaultProps: { eyebrow: "Gather with us", heading: "Upcoming and past events", upcomingLabel: "Next up", upcomingTitle: "Upcoming event", upcomingBody: "Event details", upcomingDate: "Date", upcomingLocation: "Location", pastEvents: "Past event — Date" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), upcomingLabel: text("Upcoming label"), upcomingTitle: text("Upcoming title"), upcomingBody: area("Upcoming description"), upcomingDate: text("Upcoming date"), upcomingLocation: text("Upcoming location"), pastEvents: area("Past events") },
      render: (props) => <section className={styles.events} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><div className={styles.eventBlend}><article className={styles.upcoming}><div className={styles.flyer}>Upcoming flyer</div><div><Editable as="p" className={styles.eventLabel} field="upcomingLabel" props={props}>{props.upcomingLabel}</Editable><Editable as="h3" field="upcomingTitle" props={props}>{props.upcomingTitle}</Editable><Editable as="p" field="upcomingBody" props={props}>{props.upcomingBody}</Editable><Editable as="strong" field="upcomingDate" props={props}>{props.upcomingDate}</Editable><Editable as="span" field="upcomingLocation" props={props}>{props.upcomingLocation}</Editable></div></article><div className={styles.archive}><span>From the archive</span><div>{props.pastEvents.split("\n").filter(Boolean).map((item) => { const [title, date] = item.split("—").map((part) => part.trim()); return <article key={item}><div>Event flyer</div><small>{date}</small><strong>{title}</strong></article>; })}</div></div></div></div></section>,
    },
    MeetingDirectory: {
      label: "YPAA directory",
      defaultProps: { eyebrow: "Across the Northeast", heading: "YPAA meetings near you", body: "Find fellowship near you.", meetings: "Connecticut YPAA — Connecticut" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), meetings: area("Meetings") },
      render: (props) => <section className={styles.directory} id={props.id}><div className={`${styles.shell} ${styles.twoCol}`}><div><Editable as="p" className={styles.eyebrowDark} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" field="body" props={props}>{props.body}</Editable></div><ul>{props.meetings.split("\n").filter(Boolean).map((item) => { const [name, place] = item.split("—").map((part) => part.trim()); return <li key={item}><strong>{name}</strong><span>{place}</span></li>; })}</ul></div></section>,
    },
    CallToAction: {
      label: "Call to action",
      defaultProps: { eyebrow: "See you there", heading: "Ready for NECYPAA?", body: "Register and reserve your room.", primaryLabel: "Register", primaryUrl: "#", secondaryLabel: "Book a hotel room", secondaryUrl: "#" },
      fields: { eyebrow: text("Eyebrow"), heading: text("Heading"), body: area("Body"), primaryLabel: text("Primary label"), primaryUrl: text("Primary URL"), secondaryLabel: text("Secondary label"), secondaryUrl: text("Secondary URL") },
      render: (props) => <section className={styles.cta} id={props.id}><div className={styles.shell}><Editable as="p" className={styles.eyebrow} field="eyebrow" props={props}>{props.eyebrow}</Editable><Editable as="h2" field="heading" props={props}>{props.heading}</Editable><Editable as="p" className={styles.lede} field="body" props={props}>{props.body}</Editable><div className={styles.actions}><Button href={props.primaryUrl}><Editable field="primaryLabel" props={props}>{props.primaryLabel}</Editable></Button><Button href={props.secondaryUrl} outline><Editable field="secondaryLabel" props={props}>{props.secondaryLabel}</Editable></Button></div></div></section>,
    },
    FreeText: {
      label: "Free text",
      defaultProps: { text: "Click to edit this text.", fontSize: "1rem", color: "#171b20", fontWeight: "400", alignment: "left" },
      fields: { text: area("Text"), fontSize: text("Font size"), color: text("Color"), fontWeight: text("Weight"), alignment: { type: "select", label: "Alignment", options: [{ label: "Left", value: "left" }, { label: "Center", value: "center" }, { label: "Right", value: "right" }] } },
      render: (props) => <section className={styles.freeText}><Editable as="p" field="text" props={{ ...props, textFontSize: props.fontSize, textColor: props.color, textFontWeight: props.fontWeight, textTextAlign: props.alignment }}>{props.text}</Editable></section>,
    },
  },
};
