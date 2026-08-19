"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Accessibility, CalendarDays, Clock3, Grid3X3, List, Map, MapPin, Search, X } from "lucide-react";

import type { ProgramData, ProgramRoom, ProgramSession } from "./program-types";
import { SESSION_TYPE_LABELS } from "./program-types";

const TIME_ZONE = "America/New_York";
const EMPTY_DATA: ProgramData = { rooms: [], sessions: [], maps: [] };

function dateKey(value: string | Date) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const find = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${find("year")}-${find("month")}-${find("day")}`;
}

function dayLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "long", month: "short", day: "numeric" }).format(new Date(`${key}T12:00:00-05:00`));
}

function timeLabel(value: string | Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function minutesInDay(value: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value));
  const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
  const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
  return hour * 60 + minute;
}

function typeLabel(type: string) {
  return SESSION_TYPE_LABELS[type] || type.replaceAll("_", " ");
}

function SessionCard({ session, onOpen, compact = false }: { session: ProgramSession; onOpen: (session: ProgramSession) => void; compact?: boolean }) {
  return (
    <button className="program-session-card" data-compact={compact} data-type={session.sessionType} onClick={() => onOpen(session)} type="button">
      <span className="program-session-time">{timeLabel(session.startAt)}{compact ? "" : `–${timeLabel(session.endAt)}`}</span>
      <strong>{session.title}</strong>
      {!compact ? <span className="program-session-room"><MapPin aria-hidden="true" />{session.room.shortLabel}</span> : null}
    </button>
  );
}

function Agenda({ sessions, onOpen }: { sessions: ProgramSession[]; onOpen: (session: ProgramSession) => void }) {
  if (!sessions.length) return <div className="program-empty">No sessions match these filters.</div>;
  return (
    <div className="program-agenda">
      {sessions.map((session) => <SessionCard key={session.id} onOpen={onOpen} session={session} />)}
    </div>
  );
}

function ScheduleGrid({ rooms, sessions, onOpen }: { rooms: ProgramRoom[]; sessions: ProgramSession[]; onOpen: (session: ProgramSession) => void }) {
  const startMinute = 8 * 60;
  const endMinute = 24 * 60;
  const slotHeight = 54;
  const slots = (endMinute - startMinute) / 30;
  const visibleRooms = rooms.filter((room) => sessions.some((session) => String(session.room.id) === String(room.id)));
  if (!sessions.length) return <div className="program-empty">No sessions match these filters.</div>;

  return (
    <div className="program-grid-scroll">
      <div className="program-grid" style={{ "--room-count": Math.max(visibleRooms.length, 1), "--slot-height": `${slotHeight}px` } as React.CSSProperties}>
        <div className="program-grid-corner">Time</div>
        {visibleRooms.map((room) => <div className="program-grid-room" key={room.id}><strong>{room.shortLabel}</strong><span>{room.floor}</span></div>)}
        <div className="program-time-axis" style={{ height: slots * slotHeight }}>
          {Array.from({ length: slots }, (_, index) => <span key={index} style={{ top: index * slotHeight }}>{timeLabel(new Date(`2027-01-01T${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}:00-05:00`))}</span>)}
        </div>
        {visibleRooms.map((room) => (
          <div className="program-room-track" key={room.id} style={{ height: slots * slotHeight }}>
            {sessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => {
              const top = Math.max(0, (minutesInDay(session.startAt) - startMinute) / 30 * slotHeight);
              const duration = Math.max(30, (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / 60000);
              const height = Math.max(slotHeight - 8, Math.min(duration / 30 * slotHeight - 8, slots * slotHeight - top - 4));
              return <div className="program-grid-event" key={session.id} style={{ background: room.color || undefined, height, top }}><SessionCard compact onOpen={onOpen} session={session} /></div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function VenueMapView({ data }: { data: ProgramData }) {
  const map = data.maps[0];
  return (
    <section className="program-map-section" id="hotel-map">
      <div className="program-map-copy">
        <p>Find your room</p>
        <h2>{map?.title || "Convention-level map"}</h2>
        <p>{map?.description || "A planning map for the convention rooms. Upload the final hotel floor plan in Payload when it is available."}</p>
      </div>
      <div className="program-map" data-has-image={Boolean(map?.image?.url)}>
        {map?.image?.url ? <img alt={map.image.alt || map.altText} src={map.image.url} /> : <div className="program-map-schematic"><span className="program-map-core">Registration<br />Elevators</span></div>}
        {data.rooms.map((room) => room.mapX != null && room.mapY != null ? (
          <span className="program-map-pin" key={room.id} style={{ left: `${room.mapX}%`, top: `${room.mapY}%`, "--room-color": room.color || "var(--tenant-primary)" } as React.CSSProperties}>{room.shortLabel}</span>
        ) : null)}
      </div>
    </section>
  );
}

export function ProgramExplorer({ initialData, heading = "Your weekend, mapped out", introduction = "Search the convention program, compare rooms, and open any session for details.", embedded = false }: { initialData?: ProgramData; heading?: ReactNode; introduction?: ReactNode; embedded?: boolean }) {
  const [data, setData] = useState(initialData || EMPTY_DATA);
  const [loading, setLoading] = useState(!initialData);
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [type, setType] = useState("all");
  const [room, setRoom] = useState("all");
  const [view, setView] = useState<"agenda" | "grid">("grid");
  const [selected, setSelected] = useState<ProgramSession | null>(null);

  useEffect(() => {
    if (initialData) return;
    let active = true;
    fetch("/api/program-data")
      .then((response) => response.json())
      .then((result) => { if (active) setData(result as ProgramData); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [initialData]);

  const days = useMemo(() => Array.from(new Set(data.sessions.map((session) => dateKey(session.startAt)))).sort(), [data.sessions]);
  const selectedDay = day || days[0] || "";
  const sessionTypes = useMemo(() => Array.from(new Set(data.sessions.map((session) => session.sessionType))).sort(), [data.sessions]);
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return data.sessions.filter((session) => {
      if (selectedDay && dateKey(session.startAt) !== selectedDay) return false;
      if (type !== "all" && session.sessionType !== type) return false;
      if (room !== "all" && String(session.room.id) !== room) return false;
      if (needle && ![session.title, session.shortDescription, session.room.name, ...(session.tracks || [])].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [data.sessions, room, search, selectedDay, type]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  return (
    <div className={embedded ? "program-embed" : "program-page"}>
      {!embedded ? <section className="program-hero" id="program"><div className="program-shell"><div><CalendarDays aria-hidden="true" /><h1>Convention<br /><em>program</em></h1></div>{typeof introduction === "string" ? <p>{introduction}</p> : introduction}</div></section> : null}
      <section className="program-explorer-section">
        <div className="program-shell">
          <div className="program-heading"><div><p>NECYPAA XXXVI</p>{typeof heading === "string" ? <h2>{heading}</h2> : heading}{embedded ? typeof introduction === "string" ? <p className="program-heading-description">{introduction}</p> : introduction : null}</div>{!embedded ? <a href="#hotel-map"><Map aria-hidden="true" /> Hotel map</a> : null}</div>
          <div className="program-day-tabs" role="tablist" aria-label="Program day">
            {days.map((value) => <button aria-selected={selectedDay === value} key={value} onClick={() => setDay(value)} role="tab" type="button">{dayLabel(value)}</button>)}
          </div>
          <div className="program-toolbar">
            <label className="program-search"><Search aria-hidden="true" /><span className="sr-only">Search sessions</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search sessions, topics, or rooms" value={search} /></label>
            <label><span className="sr-only">Session type</span><select onChange={(event) => setType(event.target.value)} value={type}><option value="all">All types</option>{sessionTypes.map((value) => <option key={value} value={value}>{typeLabel(value)}</option>)}</select></label>
            <label><span className="sr-only">Room</span><select onChange={(event) => setRoom(event.target.value)} value={room}><option value="all">All rooms</option>{data.rooms.map((value) => <option key={value.id} value={String(value.id)}>{value.shortLabel}</option>)}</select></label>
            <div className="program-view-toggle" aria-label="Schedule view"><button aria-pressed={view === "agenda"} onClick={() => setView("agenda")} type="button"><List aria-hidden="true" /> Agenda</button><button aria-pressed={view === "grid"} onClick={() => setView("grid")} type="button"><Grid3X3 aria-hidden="true" /> Room grid</button></div>
          </div>
          {loading ? <div className="program-empty">Loading the program…</div> : view === "grid" ? <ScheduleGrid onOpen={setSelected} rooms={data.rooms} sessions={filtered} /> : <Agenda onOpen={setSelected} sessions={filtered} />}
        </div>
      </section>
      {!embedded ? <div className="program-shell"><VenueMapView data={data} /></div> : null}
      {selected ? <div className="program-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section aria-labelledby="program-dialog-title" aria-modal="true" className="program-dialog" role="dialog"><button aria-label="Close session details" onClick={() => setSelected(null)} type="button"><X aria-hidden="true" /></button><p>{typeLabel(selected.sessionType)}</p><h2 id="program-dialog-title">{selected.title}</h2><dl><div><dt><Clock3 aria-hidden="true" />Time</dt><dd>{dayLabel(dateKey(selected.startAt))}, {timeLabel(selected.startAt)}–{timeLabel(selected.endAt)}</dd></div><div><dt><MapPin aria-hidden="true" />Room</dt><dd>{selected.room.name}{selected.room.floor ? ` · ${selected.room.floor}` : ""}</dd></div>{selected.accessibility ? <div><dt><Accessibility aria-hidden="true" />Accessibility</dt><dd>{selected.accessibility}</dd></div> : null}</dl>{selected.shortDescription ? <p className="program-dialog-description">{selected.shortDescription}</p> : null}{selected.tracks?.length ? <ul>{selected.tracks.map((track) => <li key={track}>{track}</li>)}</ul> : null}</section></div> : null}
    </div>
  );
}
