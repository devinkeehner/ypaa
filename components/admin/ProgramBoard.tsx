"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, GripVertical, Plus, RotateCw, Save, Trash2, X } from "lucide-react";
import Link from "next/link";

import type { ProgramRoom, ProgramSession } from "@/components/site/program-types";
import { SESSION_TYPE_LABELS } from "@/components/site/program-types";

type EditorState = "loading" | "ready" | "unauthorized" | "error";
type FormState = {
  id?: string | number;
  title: string;
  sessionType: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  shortDescription: string;
  language: string;
  audience: string;
  accessibility: string;
  status: string;
  featured: boolean;
  internalNotes: string;
};

const CONVENTION_DAYS = ["2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03"];
const EMPTY_FORM: FormState = { title: "", sessionType: "panel", date: CONVENTION_DAYS[0], startTime: "09:00", endTime: "10:00", room: "", shortDescription: "", language: "English", audience: "", accessibility: "", status: "published", featured: false, internalNotes: "" };
const TIME_ZONE = "America/New_York";

function dateKey(value: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(value));
  const find = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${find("year")}-${find("month")}-${find("day")}`;
}

function timeValue(value: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value));
  return `${parts.find((part) => part.type === "hour")?.value || "00"}:${parts.find((part) => part.type === "minute")?.value || "00"}`;
}

function dayLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", month: "short", day: "numeric" }).format(new Date(`${key}T12:00:00-05:00`));
}

function iso(date: string, time: string) {
  return new Date(`${date}T${time}:00-05:00`).toISOString();
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeRoom(value: unknown): ProgramRoom | null {
  if (!value || typeof value !== "object") return null;
  const room = value as Record<string, unknown>;
  return { id: room.id as string | number, name: String(room.name || "Room"), shortLabel: String(room.shortLabel || room.name || "Room"), floor: typeof room.floor === "string" ? room.floor : null, displayOrder: Number(room.displayOrder || 0), color: typeof room.color === "string" ? room.color : null };
}

function normalizeSession(value: unknown, rooms: ProgramRoom[]): ProgramSession | null {
  if (!value || typeof value !== "object") return null;
  const doc = value as Record<string, unknown>;
  const related = normalizeRoom(doc.room);
  const room = related || rooms.find((candidate) => String(candidate.id) === String(doc.room));
  if (!room) return null;
  return { id: doc.id as string | number, title: String(doc.title || "Untitled session"), slug: String(doc.slug || doc.id), sessionType: String(doc.sessionType || "panel"), startAt: String(doc.startAt), endAt: String(doc.endAt), room, shortDescription: typeof doc.shortDescription === "string" ? doc.shortDescription : null, language: typeof doc.language === "string" ? doc.language : null, audience: typeof doc.audience === "string" ? doc.audience : null, accessibility: typeof doc.accessibility === "string" ? doc.accessibility : null, featured: Boolean(doc.featured), status: typeof doc.status === "string" ? doc.status : null, tracks: Array.isArray(doc.tracks) ? doc.tracks.map(String) : null };
}

export function ProgramBoard() {
  const [state, setState] = useState<EditorState>("loading");
  const [rooms, setRooms] = useState<ProgramRoom[]>([]);
  const [sessions, setSessions] = useState<ProgramSession[]>([]);
  const [day, setDay] = useState(CONVENTION_DAYS[0]);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    try {
      const authResponse = await fetch("/api/users/me", { credentials: "same-origin" });
      const authJSON = authResponse.ok ? await authResponse.json() as { user?: unknown } : null;
      if (!authJSON?.user) {
        setState("unauthorized");
        return;
      }
      const [roomResponse, sessionResponse] = await Promise.all([
        fetch("/api/rooms?limit=100&sort=displayOrder&depth=0", { credentials: "same-origin" }),
        fetch("/api/program-sessions?limit=500&sort=startAt&depth=1", { credentials: "same-origin" }),
      ]);
      if (roomResponse.status === 401 || roomResponse.status === 403 || sessionResponse.status === 401 || sessionResponse.status === 403) {
        setState("unauthorized");
        return;
      }
      if (!roomResponse.ok || !sessionResponse.ok) throw new Error("Unable to load program data");
      const roomJSON = await roomResponse.json() as { docs?: unknown[] };
      const nextRooms = (roomJSON.docs || []).map(normalizeRoom).filter((value): value is ProgramRoom => Boolean(value));
      const sessionJSON = await sessionResponse.json() as { docs?: unknown[] };
      const nextSessions = (sessionJSON.docs || []).map((value) => normalizeSession(value, nextRooms)).filter((value): value is ProgramSession => Boolean(value));
      setRooms(nextRooms);
      setSessions(nextSessions);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const daySessions = useMemo(() => sessions.filter((session) => dateKey(session.startAt) === day), [day, sessions]);

  function startCreate(roomID?: string, startTime = "09:00") {
    const [hour, minute] = startTime.split(":").map(Number);
    const endMinutes = hour * 60 + minute + 60;
    setMessage("");
    setForm({ ...EMPTY_FORM, date: day, startTime, endTime: `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`, room: roomID || String(rooms[0]?.id || "") });
  }

  function startEdit(session: ProgramSession) {
    setMessage("");
    setForm({ id: session.id, title: session.title, sessionType: session.sessionType, date: dateKey(session.startAt), startTime: timeValue(session.startAt), endTime: timeValue(session.endAt), room: String(session.room.id), shortDescription: session.shortDescription || "", language: session.language || "English", audience: session.audience || "", accessibility: session.accessibility || "", status: session.status || "published", featured: Boolean(session.featured), internalNotes: "" });
  }

  function overlapping(candidate: { id?: string | number; room: string; startAt: string; endAt: string }) {
    const start = new Date(candidate.startAt).getTime();
    const end = new Date(candidate.endAt).getTime();
    return sessions.find((session) => String(session.id) !== String(candidate.id || "") && String(session.room.id) === candidate.room && start < new Date(session.endAt).getTime() && end > new Date(session.startAt).getTime());
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!form) return;
    const startAt = iso(form.date, form.startTime);
    const endAt = iso(form.date, form.endTime);
    if (new Date(endAt) <= new Date(startAt)) { setMessage("End time must be later than start time."); return; }
    const conflict = overlapping({ id: form.id, room: form.room, startAt, endAt });
    if (conflict) { setMessage(`That overlaps “${conflict.title}” in the same room.`); return; }
    setSaving(true);
    setMessage("");
    const payload = { title: form.title, slug: `${slugify(form.title)}-${form.date}-${form.startTime.replace(":", "")}`, sessionType: form.sessionType, startAt, endAt, room: form.room, shortDescription: form.shortDescription, language: form.language, audience: form.audience, accessibility: form.accessibility, status: form.status, featured: form.featured, internalNotes: form.internalNotes };
    const response = await fetch(form.id ? `/api/program-sessions/${form.id}` : "/api/program-sessions", { method: form.id ? "PATCH" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!response.ok) { const result = await response.json().catch(() => ({})) as { errors?: Array<{ message?: string }> }; setMessage(result.errors?.[0]?.message || "The session could not be saved."); return; }
    setForm(null);
    await load();
  }

  async function remove() {
    if (!form?.id || !window.confirm(`Delete “${form.title}”? This cannot be undone.`)) return;
    setSaving(true);
    const response = await fetch(`/api/program-sessions/${form.id}`, { method: "DELETE", credentials: "same-origin" });
    setSaving(false);
    if (!response.ok) { setMessage("The session could not be deleted."); return; }
    setForm(null);
    await load();
  }

  async function moveSession(sessionID: string, roomID: string, startTime: string) {
    const session = sessions.find((candidate) => String(candidate.id) === sessionID);
    if (!session) return;
    const duration = new Date(session.endAt).getTime() - new Date(session.startAt).getTime();
    const startAt = iso(day, startTime);
    const endAt = new Date(new Date(startAt).getTime() + duration).toISOString();
    const conflict = overlapping({ id: session.id, room: roomID, startAt, endAt });
    if (conflict) { setMessage(`Move blocked: “${conflict.title}” already uses that room and time.`); return; }
    setMessage("Saving move…");
    const response = await fetch(`/api/program-sessions/${session.id}`, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room: roomID, startAt, endAt }) });
    if (!response.ok) { setMessage("The move could not be saved."); return; }
    setMessage("Move saved.");
    await load();
  }

  if (state === "unauthorized") return <main className="program-board-gate"><CalendarDays aria-hidden="true" /><h1>Program Board</h1><p>Sign in to Payload before opening the committee planning board.</p><Link href="/admin">Sign in to Payload</Link></main>;
  if (state === "error") return <main className="program-board-gate"><h1>Program Board</h1><p>The schedule could not be loaded.</p><button onClick={() => { setState("loading"); void load(); }} type="button"><RotateCw aria-hidden="true" /> Try again</button></main>;

  const startMinute = 8 * 60;
  const slots = 32;
  const slotHeight = 58;
  return (
    <main className="program-board-page">
      <header className="program-board-header"><div><Link href="/admin"><ArrowLeft aria-hidden="true" /> Payload admin</Link><h1>Program Board</h1><p>Drag sessions to move them. Click an empty time to add one.</p></div><div><Link href="/program" target="_blank">View public program</Link><button onClick={() => startCreate()} type="button"><Plus aria-hidden="true" /> Add session</button></div></header>
      <div className="program-board-toolbar"><div role="tablist" aria-label="Convention day">{CONVENTION_DAYS.map((value) => <button aria-selected={day === value} key={value} onClick={() => setDay(value)} role="tab" type="button">{dayLabel(value)}</button>)}</div><p aria-live="polite">{message || `${daySessions.length} sessions · ${rooms.length} rooms`}</p></div>
      {state === "loading" ? <div className="program-board-loading">Loading program records…</div> : (
        <div className="program-board-scroll">
          <div className="program-board-grid" style={{ "--room-count": rooms.length, "--slot-height": `${slotHeight}px` } as React.CSSProperties}>
            <div className="program-board-corner">Time</div>
            {rooms.map((room) => <div className="program-board-room" key={room.id}><span style={{ background: room.color || undefined }} /><strong>{room.shortLabel}</strong><small>{room.floor}</small></div>)}
            <div className="program-board-axis" style={{ height: slots * slotHeight }}>{Array.from({ length: slots }, (_, index) => { const minutes = startMinute + index * 30; const hour = Math.floor(minutes / 60); const minute = minutes % 60; return <span key={index} style={{ top: index * slotHeight }}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-05:00`))}</span>; })}</div>
            {rooms.map((room) => <div className="program-board-track" key={room.id} style={{ height: slots * slotHeight }}>{Array.from({ length: slots }, (_, index) => { const minutes = startMinute + index * 30; const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; return <button aria-label={`Add session in ${room.name} at ${time}`} className="program-board-cell" key={time} onClick={() => startCreate(String(room.id), time)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void moveSession(event.dataTransfer.getData("text/program-session"), String(room.id), time); }} style={{ height: slotHeight, top: index * slotHeight }} type="button" />; })}{daySessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => { const [hour, minute] = timeValue(session.startAt).split(":").map(Number); const top = Math.max(0, ((hour * 60 + minute) - startMinute) / 30 * slotHeight + 3); const height = Math.max(slotHeight - 6, (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / 60000 / 30 * slotHeight - 6); return <button className="program-board-event" draggable key={session.id} onClick={() => startEdit(session)} onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/program-session", String(session.id)); }} style={{ background: room.color || undefined, height, top }} type="button"><GripVertical aria-hidden="true" /><span>{timeValue(session.startAt)}</span><strong>{session.title}</strong><small>{SESSION_TYPE_LABELS[session.sessionType] || session.sessionType}</small></button>; })}</div>)}
          </div>
        </div>
      )}
      {form ? <div className="program-board-modal-backdrop"><section aria-labelledby="program-form-title" aria-modal="true" className="program-board-modal" role="dialog"><header><div><p>{form.id ? "Edit program record" : "New program record"}</p><h2 id="program-form-title">{form.id ? form.title : "Add a session"}</h2></div><button aria-label="Close form" onClick={() => setForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={save}><label className="program-board-wide"><span>Title</span><input autoFocus onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></label><label><span>Type</span><select onChange={(event) => setForm({ ...form, sessionType: event.target.value })} value={form.sessionType}>{Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>Room</span><select onChange={(event) => setForm({ ...form, room: event.target.value })} required value={form.room}>{rooms.map((value) => <option key={value.id} value={String(value.id)}>{value.name}</option>)}</select></label><label><span>Date</span><input onChange={(event) => setForm({ ...form, date: event.target.value })} required type="date" value={form.date} /></label><label><span>Starts</span><input onChange={(event) => setForm({ ...form, startTime: event.target.value })} required step="1800" type="time" value={form.startTime} /></label><label><span>Ends</span><input onChange={(event) => setForm({ ...form, endTime: event.target.value })} required step="1800" type="time" value={form.endTime} /></label><label><span>Status</span><select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}><option value="published">Published</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></label><label className="program-board-wide"><span>Public description</span><textarea onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} rows={3} value={form.shortDescription} /></label><label><span>Language</span><input onChange={(event) => setForm({ ...form, language: event.target.value })} value={form.language} /></label><label><span>Audience / affinity</span><input onChange={(event) => setForm({ ...form, audience: event.target.value })} value={form.audience} /></label><label className="program-board-wide"><span>Accessibility information</span><textarea onChange={(event) => setForm({ ...form, accessibility: event.target.value })} rows={2} value={form.accessibility} /></label><label className="program-board-wide"><span>Internal committee notes</span><textarea onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} rows={2} value={form.internalNotes} /></label><label className="program-board-check"><input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" /> Feature this session</label>{message ? <p className="program-board-form-error">{message}</p> : null}<footer>{form.id ? <button className="program-board-delete" disabled={saving} onClick={() => void remove()} type="button"><Trash2 aria-hidden="true" /> Delete</button> : <span /> }<div><button onClick={() => setForm(null)} type="button">Cancel</button><button disabled={saving} type="submit"><Save aria-hidden="true" /> {saving ? "Saving…" : "Save session"}</button></div></footer></form></section></div> : null}
    </main>
  );
}
