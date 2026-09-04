"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { Accessibility, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Grid3X3, List, Map as MapIcon, MapPin, Search, SlidersHorizontal, X } from "lucide-react";

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

function shortDayLabel(key: string) {
  const value = new Date(`${key}T12:00:00-05:00`);
  return {
    weekday: new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short" }).format(value),
    day: new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, day: "numeric" }).format(value),
  };
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

function MobileProgram({
  data,
  days,
  selectedDay,
  onDayChange,
  search,
  onSearchChange,
  type,
  onTypeChange,
  sessionTypes,
  sessions,
}: {
  data: ProgramData;
  days: string[];
  selectedDay: string;
  onDayChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  sessionTypes: string[];
  sessions: ProgramSession[];
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [roomIndex, setRoomIndex] = useState(0);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const filtersActive = Boolean(search.trim() || type !== "all");
  const rooms = useMemo(() => data.rooms.filter((candidate) => sessions.some((session) => String(session.room.id) === String(candidate.id))), [data.rooms, sessions]);
  const sessionsByRoom = useMemo(() => {
    const grouped = new Map<string, ProgramSession[]>();
    for (const session of sessions) {
      const key = String(session.room.id);
      const values = grouped.get(key);
      if (values) values.push(session);
      else grouped.set(key, [session]);
    }
    return grouped;
  }, [sessions]);
  const activeRoom = rooms[roomIndex] || rooms[0];
  const activeRoomSessions = activeRoom ? sessionsByRoom.get(String(activeRoom.id)) || [] : [];

  useEffect(() => {
    setRoomIndex(0);
    setExpandedSessionId(null);
  }, [selectedDay]);

  useEffect(() => {
    if (roomIndex < rooms.length) return;
    setRoomIndex(Math.max(0, rooms.length - 1));
  }, [roomIndex, rooms.length]);

  function goToRoom(index: number) {
    const next = Math.max(0, Math.min(index, rooms.length - 1));
    setRoomIndex(next);
    setExpandedSessionId(null);
  }

  function beginRoomSwipe(event: PointerEvent<HTMLDivElement>) {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
  }

  function finishRoomSwipe(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;
    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    if (Math.abs(distanceX) < 44 || Math.abs(distanceX) < Math.abs(distanceY) * 1.2) return;
    if (distanceX < 0) goToRoom(roomIndex + 1);
    else goToRoom(roomIndex - 1);
  }

  return (
    <div className="program-mobile-app">
      <div className="program-mobile-sticky">
        <header className="program-mobile-appbar">
          <div><strong>NECYPAA XXXVI</strong><span>Convention program</span></div>
          <button aria-expanded={filtersOpen} aria-label="Search and filter sessions" data-active={filtersActive} onClick={() => setFiltersOpen((value) => !value)} type="button"><SlidersHorizontal aria-hidden="true" /><span>Filter</span>{filtersActive ? <i aria-hidden="true" /> : null}</button>
        </header>
        <div aria-label="Program day" className="program-mobile-days" role="tablist" style={{ "--program-day-count": Math.max(days.length, 1) } as React.CSSProperties}>
          {days.map((value) => {
            const label = shortDayLabel(value);
            return <button aria-selected={selectedDay === value} key={value} onClick={() => onDayChange(value)} role="tab" type="button"><span>{label.weekday}</span><strong>{label.day}</strong></button>;
          })}
        </div>
        {filtersOpen ? <div className="program-mobile-filters"><label><Search aria-hidden="true" /><span className="sr-only">Search sessions</span><input autoFocus onChange={(event) => onSearchChange(event.target.value)} placeholder="Search sessions or topics" value={search} /></label><label><span className="sr-only">Session type</span><select onChange={(event) => onTypeChange(event.target.value)} value={type}><option value="all">All session types</option>{sessionTypes.map((value) => <option key={value} value={value}>{typeLabel(value)}</option>)}</select></label>{filtersActive ? <button className="program-mobile-filter-clear" onClick={() => { onSearchChange(""); onTypeChange("all"); }} type="button">Clear filters</button> : null}</div> : null}
        {activeRoom ? <div className="program-mobile-room-nav">
          <button aria-label="Previous room" disabled={roomIndex === 0} onClick={() => goToRoom(roomIndex - 1)} type="button"><ChevronLeft aria-hidden="true" /></button>
          <div aria-live="polite"><strong>{activeRoom.name}</strong><span>{roomIndex + 1} of {rooms.length}{activeRoom.floor ? ` · ${activeRoom.floor}` : ""}</span></div>
          <button aria-label="Next room" disabled={roomIndex === rooms.length - 1} onClick={() => goToRoom(roomIndex + 1)} type="button"><ChevronRight aria-hidden="true" /></button>
        </div> : null}
      </div>

      {activeRoom ? <div aria-label="Swipe between program rooms" className="program-mobile-room-stage" data-room-position={`${roomIndex + 1}-${rooms.length}`} onPointerCancel={() => { swipeStartRef.current = null; }} onPointerDown={beginRoomSwipe} onPointerUp={finishRoomSwipe} role="region">
        <section aria-label={`${activeRoom.name} schedule`} className="program-mobile-room-panel" key={activeRoom.id}>
          <div className="program-mobile-room-context"><span style={{ background: activeRoom.color || undefined }} /><p>{roomIndex < rooms.length - 1 ? "Swipe left for the next room" : roomIndex > 0 ? "Swipe right for the previous room" : "Only room for this day"}</p></div>
          {activeRoomSessions.length ? <div className="program-mobile-agenda">{activeRoomSessions.map((session) => {
            const sessionId = String(session.id);
            const expanded = expandedSessionId === sessionId;
            const detailsId = `program-mobile-session-${sessionId}`;
            return <article className="program-mobile-session-item" data-expanded={expanded} key={session.id} style={{ "--room-color": activeRoom.color || "var(--tenant-primary)" } as React.CSSProperties}>
              <button aria-controls={detailsId} aria-expanded={expanded} className="program-mobile-session" onClick={() => setExpandedSessionId(expanded ? null : sessionId)} type="button"><time dateTime={session.startAt}><strong>{timeLabel(session.startAt)}</strong><span>{timeLabel(session.endAt)}</span></time><span className="program-mobile-session-marker" style={{ background: activeRoom.color || undefined }} /><span className="program-mobile-session-copy"><small>{typeLabel(session.sessionType)}</small><strong>{session.title}</strong></span><ChevronDown aria-hidden="true" /></button>
              {expanded ? <div className="program-mobile-session-details" id={detailsId}>
                {session.shortDescription ? <p>{session.shortDescription}</p> : null}
                <dl>
                  <div><dt>When</dt><dd>{dayLabel(dateKey(session.startAt))}<br />{timeLabel(session.startAt)}–{timeLabel(session.endAt)}</dd></div>
                  <div><dt>Where</dt><dd>{session.room.name}{session.room.floor ? <><br />{session.room.floor}</> : null}</dd></div>
                  {session.accessibility ? <div><dt>Accessibility</dt><dd>{session.accessibility}</dd></div> : null}
                </dl>
                {session.tracks?.length ? <p className="program-mobile-session-tracks"><strong>Tracks</strong> {session.tracks.join(" · ")}</p> : null}
              </div> : null}
            </article>;
          })}</div> : <div className="program-empty">No sessions in this room match your filters.</div>}
        </section>
      </div> : <div className="program-empty program-mobile-empty">{filtersActive ? "No sessions match your filters." : "No rooms or sessions are scheduled for this day."}{filtersActive ? <button onClick={() => { onSearchChange(""); onTypeChange("all"); }} type="button">Clear filters</button> : null}</div>}
      <div className="program-mobile-map"><VenueMapView data={data} /></div>
    </div>
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
  const mobileFiltered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return data.sessions.filter((session) => {
      if (selectedDay && dateKey(session.startAt) !== selectedDay) return false;
      if (type !== "all" && session.sessionType !== type) return false;
      if (needle && ![session.title, session.shortDescription, session.room.name, ...(session.tracks || [])].join(" ").toLowerCase().includes(needle)) return false;
      return true;
    }).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [data.sessions, search, selectedDay, type]);
  const filtered = useMemo(() => mobileFiltered.filter((session) => room === "all" || String(session.room.id) === room), [mobileFiltered, room]);

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [selected]);

  return (
    <div className={embedded ? "program-embed" : "program-page"}>
      {!embedded ? <section className="program-hero" id="program"><div className="program-shell"><div><CalendarDays aria-hidden="true" /><h1>Convention<br /><em>program</em></h1></div>{typeof introduction === "string" ? <p>{introduction}</p> : introduction}</div></section> : null}
      {!embedded ? <MobileProgram data={data} days={days} onDayChange={setDay} onSearchChange={setSearch} onTypeChange={setType} search={search} selectedDay={selectedDay} sessionTypes={sessionTypes} sessions={mobileFiltered} type={type} /> : null}
      <section className={`program-explorer-section${embedded ? "" : " program-desktop-only"}`}>
        <div className="program-shell">
          <div className="program-heading"><div><p>NECYPAA XXXVI</p>{typeof heading === "string" ? <h2>{heading}</h2> : heading}{embedded ? typeof introduction === "string" ? <p className="program-heading-description">{introduction}</p> : introduction : null}</div>{!embedded ? <a href="#hotel-map"><MapIcon aria-hidden="true" /> Hotel map</a> : null}</div>
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
      {!embedded ? <div className="program-shell program-desktop-only"><VenueMapView data={data} /></div> : null}
      {selected ? <div className="program-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section aria-labelledby="program-dialog-title" aria-modal="true" className="program-dialog" role="dialog"><button aria-label="Close session details" onClick={() => setSelected(null)} type="button"><X aria-hidden="true" /></button><p>{typeLabel(selected.sessionType)}</p><h2 id="program-dialog-title">{selected.title}</h2><dl><div><dt><Clock3 aria-hidden="true" />Time</dt><dd>{dayLabel(dateKey(selected.startAt))}, {timeLabel(selected.startAt)}–{timeLabel(selected.endAt)}</dd></div><div><dt><MapPin aria-hidden="true" />Room</dt><dd>{selected.room.name}{selected.room.floor ? ` · ${selected.room.floor}` : ""}</dd></div>{selected.accessibility ? <div><dt><Accessibility aria-hidden="true" />Accessibility</dt><dd>{selected.accessibility}</dd></div> : null}</dl>{selected.shortDescription ? <p className="program-dialog-description">{selected.shortDescription}</p> : null}{selected.tracks?.length ? <ul>{selected.tracks.map((track) => <li key={track}>{track}</li>)}</ul> : null}</section></div> : null}
    </div>
  );
}
