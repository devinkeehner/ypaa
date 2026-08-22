"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, ChevronLeft, ChevronRight, GripVertical, Pencil, Plus, RotateCw, Save, Trash2, X } from "lucide-react";
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
type DropTarget = { roomID: string; time: string };
type EditableRoom = ProgramRoom & {
  capacity: number | null;
  accessible: boolean;
  directions: string;
  mapX: number | null;
  mapY: number | null;
  notes: string;
};
type RoomFormState = {
  id?: string | number;
  name: string;
  shortLabel: string;
  floor: string;
  capacity: string;
  accessible: boolean;
  directions: string;
  displayOrder: string;
  mapX: string;
  mapY: string;
  color: string;
  notes: string;
};

const CONVENTION_DAYS = ["2026-12-31", "2027-01-01", "2027-01-02", "2027-01-03"];
const EMPTY_FORM: FormState = { title: "", sessionType: "panel", date: CONVENTION_DAYS[0], startTime: "09:00", endTime: "10:00", room: "", shortDescription: "", language: "English", audience: "", accessibility: "", status: "published", featured: false, internalNotes: "" };
const EMPTY_ROOM_FORM: RoomFormState = { name: "", shortLabel: "", floor: "Convention level", capacity: "", accessible: true, directions: "", displayOrder: "0", mapX: "", mapY: "", color: "#E85E27", notes: "" };
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

export function relationshipID(value: string) {
  return /^\d+$/.test(value) ? Number(value) : value;
}

function normalizeRoom(value: unknown): EditableRoom | null {
  if (!value || typeof value !== "object") return null;
  const room = value as Record<string, unknown>;
  return { id: room.id as string | number, name: String(room.name || "Room"), shortLabel: String(room.shortLabel || room.name || "Room"), floor: typeof room.floor === "string" ? room.floor : null, capacity: typeof room.capacity === "number" ? room.capacity : null, accessible: room.accessible !== false, directions: typeof room.directions === "string" ? room.directions : "", displayOrder: Number(room.displayOrder || 0), mapX: typeof room.mapX === "number" ? room.mapX : null, mapY: typeof room.mapY === "number" ? room.mapY : null, color: typeof room.color === "string" ? room.color : null, notes: typeof room.notes === "string" ? room.notes : "" };
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
  const [rooms, setRooms] = useState<EditableRoom[]>([]);
  const [sessions, setSessions] = useState<ProgramSession[]>([]);
  const [day, setDay] = useState(CONVENTION_DAYS[0]);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedSessionID, setDraggedSessionID] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [movingSessionIDs, setMovingSessionIDs] = useState<Set<string>>(() => new Set());
  const [roomForm, setRoomForm] = useState<RoomFormState | null>(null);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");
  const [roomOrdering, setRoomOrdering] = useState(false);

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
      const nextRooms = (roomJSON.docs || []).map(normalizeRoom).filter((value): value is EditableRoom => Boolean(value));
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

  function startCreateRoom() {
    const nextOrder = rooms.length ? Math.max(...rooms.map((room) => room.displayOrder)) + 10 : 0;
    setRoomMessage("");
    setRoomForm({ ...EMPTY_ROOM_FORM, displayOrder: String(nextOrder) });
  }

  function startEditRoom(room: EditableRoom) {
    setRoomMessage("");
    setRoomForm({ id: room.id, name: room.name, shortLabel: room.shortLabel, floor: room.floor || "", capacity: room.capacity == null ? "" : String(room.capacity), accessible: room.accessible, directions: room.directions, displayOrder: String(room.displayOrder), mapX: room.mapX == null ? "" : String(room.mapX), mapY: room.mapY == null ? "" : String(room.mapY), color: room.color || "#E85E27", notes: room.notes });
  }

  async function saveRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!roomForm) return;
    setRoomSaving(true);
    setRoomMessage("");
    const payload = { name: roomForm.name, shortLabel: roomForm.shortLabel, floor: roomForm.floor, capacity: roomForm.capacity === "" ? null : Number(roomForm.capacity), accessible: roomForm.accessible, directions: roomForm.directions, displayOrder: Number(roomForm.displayOrder), mapX: roomForm.mapX === "" ? null : Number(roomForm.mapX), mapY: roomForm.mapY === "" ? null : Number(roomForm.mapY), color: roomForm.color, notes: roomForm.notes };
    const response = await fetch(roomForm.id ? `/api/rooms/${roomForm.id}` : "/api/rooms", { method: roomForm.id ? "PATCH" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setRoomSaving(false);
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { errors?: Array<{ message?: string }> };
      setRoomMessage(result.errors?.[0]?.message || "The room could not be saved.");
      return;
    }
    setRoomForm(null);
    await load();
  }

  async function moveRoom(roomID: string, direction: -1 | 1) {
    const currentIndex = rooms.findIndex((room) => String(room.id) === roomID);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rooms.length || roomOrdering) return;

    const previousRooms = rooms;
    const reordered = [...rooms];
    [reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
    const normalized = reordered.map((room, index) => ({ ...room, displayOrder: index * 10 }));
    setRooms(normalized);
    setRoomOrdering(true);
    setMessage("Saving room order…");

    try {
      const responses = await Promise.all(normalized.map((room) => fetch(`/api/rooms/${room.id}`, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayOrder: room.displayOrder }) })));
      if (responses.some((response) => !response.ok)) throw new Error("Room order failed");
      setMessage("Room order saved.");
    } catch {
      setRooms(previousRooms);
      setMessage("The room order could not be saved.");
      await load();
    } finally {
      setRoomOrdering(false);
    }
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
    const payload = { title: form.title, slug: `${slugify(form.title)}-${form.date}-${form.startTime.replace(":", "")}`, sessionType: form.sessionType, startAt, endAt, room: relationshipID(form.room), shortDescription: form.shortDescription, language: form.language, audience: form.audience, accessibility: form.accessibility, status: form.status, featured: form.featured, internalNotes: form.internalNotes };
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
    const nextRoom = rooms.find((room) => String(room.id) === roomID);
    if (!nextRoom) return;

    // Land the card immediately. Payload saves in the background and the card
    // only returns to its old position if that request is rejected.
    setSessions((current) => current.map((candidate) => String(candidate.id) === sessionID
      ? { ...candidate, room: nextRoom, startAt, endAt }
      : candidate));
    setMovingSessionIDs((current) => new Set(current).add(sessionID));
    setMessage("Saving move…");
    const response = await fetch(`/api/program-sessions/${session.id}`, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room: relationshipID(roomID), startAt, endAt }) });
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { errors?: Array<{ message?: string }> };
      setSessions((current) => current.map((candidate) => String(candidate.id) === sessionID ? session : candidate));
      setMovingSessionIDs((current) => { const next = new Set(current); next.delete(sessionID); return next; });
      setMessage(result.errors?.[0]?.message || "The move could not be saved.");
      return;
    }
    setMovingSessionIDs((current) => { const next = new Set(current); next.delete(sessionID); return next; });
    setMessage("Move saved.");
  }

  if (state === "unauthorized") return <main className="program-board-gate"><CalendarDays aria-hidden="true" /><h1>Program Board</h1><p>Sign in to Payload before opening the committee planning board.</p><Link href="/admin">Sign in to Payload</Link></main>;
  if (state === "error") return <main className="program-board-gate"><h1>Program Board</h1><p>The schedule could not be loaded.</p><button onClick={() => { setState("loading"); void load(); }} type="button"><RotateCw aria-hidden="true" /> Try again</button></main>;

  const startMinute = 8 * 60;
  const slots = 32;
  const slotHeight = 58;
  const draggedSession = sessions.find((session) => String(session.id) === draggedSessionID);
  const dropStartIndex = dropTarget
    ? (Number(dropTarget.time.slice(0, 2)) * 60 + Number(dropTarget.time.slice(3, 5)) - startMinute) / 30
    : -1;
  const dropDurationSlots = draggedSession
    ? Math.max(1, Math.ceil((new Date(draggedSession.endAt).getTime() - new Date(draggedSession.startAt).getTime()) / 1_800_000))
    : 1;
  return (
    <main className="program-board-page">
      <header className="program-board-header"><div><Link href="/admin"><ArrowLeft aria-hidden="true" /> Payload admin</Link><h1>Program Board</h1><p>Drag sessions to move them. Click an empty time to add one.</p></div><div><span aria-live="polite">Public program temporarily unavailable</span><button className="program-board-secondary-action" onClick={startCreateRoom} type="button"><Building2 aria-hidden="true" /> Add room</button><button onClick={() => startCreate()} type="button"><Plus aria-hidden="true" /> Add session</button></div></header>
      <div className="program-board-toolbar"><div role="tablist" aria-label="Convention day">{CONVENTION_DAYS.map((value) => <button aria-selected={day === value} key={value} onClick={() => setDay(value)} role="tab" type="button">{dayLabel(value)}</button>)}</div><p aria-live="polite">{message || `${daySessions.length} sessions · ${rooms.length} rooms`}</p></div>
      {state === "loading" ? <div className="program-board-loading">Loading program records…</div> : (
        <div className="program-board-scroll">
          <div className="program-board-grid" style={{ "--room-count": rooms.length, "--slot-height": `${slotHeight}px` } as React.CSSProperties}>
            <div className="program-board-corner">Time</div>
            {rooms.map((room, index) => <div className="program-board-room" key={room.id}><span style={{ background: room.color || undefined }} /><strong>{room.shortLabel}</strong><small>{room.floor}</small><div className="program-board-room-actions"><button aria-label={`Move ${room.name} left`} disabled={index === 0 || roomOrdering} onClick={() => void moveRoom(String(room.id), -1)} title="Move room left" type="button"><ChevronLeft aria-hidden="true" /></button><button aria-label={`Edit ${room.name}`} onClick={() => startEditRoom(room)} title={`Edit ${room.name}`} type="button"><Pencil aria-hidden="true" /></button><button aria-label={`Move ${room.name} right`} disabled={index === rooms.length - 1 || roomOrdering} onClick={() => void moveRoom(String(room.id), 1)} title="Move room right" type="button"><ChevronRight aria-hidden="true" /></button></div></div>)}
            <div className="program-board-axis" style={{ height: slots * slotHeight }}>{Array.from({ length: slots }, (_, index) => { const minutes = startMinute + index * 30; const hour = Math.floor(minutes / 60); const minute = minutes % 60; return <span key={index} style={{ top: index * slotHeight }}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-05:00`))}</span>; })}</div>
            {rooms.map((room) => <div className="program-board-track" key={room.id} onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(null); }} style={{ height: slots * slotHeight }}>{Array.from({ length: slots }, (_, index) => { const minutes = startMinute + index * 30; const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; const highlighted = dropTarget?.roomID === String(room.id) && index >= dropStartIndex && index < dropStartIndex + dropDurationSlots; return <button aria-label={`Add session in ${room.name} at ${time}`} className="program-board-cell" data-drop-active={highlighted || undefined} data-drop-end={highlighted && index === dropStartIndex + dropDurationSlots - 1 || undefined} data-drop-start={highlighted && index === dropStartIndex || undefined} key={time} onClick={() => startCreate(String(room.id), time)} onDragEnter={(event) => { event.preventDefault(); setDropTarget({ roomID: String(room.id), time }); }} onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }} onDrop={(event) => { event.preventDefault(); const sessionID = event.dataTransfer.getData("text/program-session"); setDropTarget(null); setDraggedSessionID(null); void moveSession(sessionID, String(room.id), time); }} style={{ height: slotHeight, top: index * slotHeight }} type="button" />; })}{daySessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => { const sessionID = String(session.id); const [hour, minute] = timeValue(session.startAt).split(":").map(Number); const top = Math.max(0, ((hour * 60 + minute) - startMinute) / 30 * slotHeight + 3); const height = Math.max(slotHeight - 6, (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / 60000 / 30 * slotHeight - 6); const moving = movingSessionIDs.has(sessionID); return <button aria-busy={moving} className="program-board-event" data-moving={moving || undefined} draggable={!moving} key={session.id} onClick={() => startEdit(session)} onDragEnd={() => { setDraggedSessionID(null); setDropTarget(null); }} onDragStart={(event) => { event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/program-session", sessionID); setDraggedSessionID(sessionID); }} style={{ background: room.color || undefined, height, top }} type="button"><GripVertical aria-hidden="true" /><span>{timeValue(session.startAt)}</span><strong>{session.title}</strong><small>{moving ? "Saving…" : SESSION_TYPE_LABELS[session.sessionType] || session.sessionType}</small></button>; })}</div>)}
          </div>
        </div>
      )}
      {form ? <div className="program-board-modal-backdrop"><section aria-labelledby="program-form-title" aria-modal="true" className="program-board-modal" role="dialog"><header><div><p>{form.id ? "Edit program record" : "New program record"}</p><h2 id="program-form-title">{form.id ? form.title : "Add a session"}</h2></div><button aria-label="Close form" onClick={() => setForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={save}><label className="program-board-wide"><span>Title</span><input autoFocus onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></label><label><span>Type</span><select onChange={(event) => setForm({ ...form, sessionType: event.target.value })} value={form.sessionType}>{Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>Room</span><select onChange={(event) => setForm({ ...form, room: event.target.value })} required value={form.room}>{rooms.map((value) => <option key={value.id} value={String(value.id)}>{value.name}</option>)}</select></label><label><span>Date</span><input onChange={(event) => setForm({ ...form, date: event.target.value })} required type="date" value={form.date} /></label><label><span>Starts</span><input onChange={(event) => setForm({ ...form, startTime: event.target.value })} required step="1800" type="time" value={form.startTime} /></label><label><span>Ends</span><input onChange={(event) => setForm({ ...form, endTime: event.target.value })} required step="1800" type="time" value={form.endTime} /></label><label><span>Status</span><select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}><option value="published">Published</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></label><label className="program-board-wide"><span>Public description</span><textarea onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} rows={3} value={form.shortDescription} /></label><label><span>Language</span><input onChange={(event) => setForm({ ...form, language: event.target.value })} value={form.language} /></label><label><span>Audience / affinity</span><input onChange={(event) => setForm({ ...form, audience: event.target.value })} value={form.audience} /></label><label className="program-board-wide"><span>Accessibility information</span><textarea onChange={(event) => setForm({ ...form, accessibility: event.target.value })} rows={2} value={form.accessibility} /></label><label className="program-board-wide"><span>Internal committee notes</span><textarea onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} rows={2} value={form.internalNotes} /></label><label className="program-board-check"><input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" /><span>Mark as featured <small>Saved for future homepage or program spotlight sections; it does not currently change the schedule display.</small></span></label>{message ? <p className="program-board-form-error">{message}</p> : null}<footer>{form.id ? <button className="program-board-delete" disabled={saving} onClick={() => void remove()} type="button"><Trash2 aria-hidden="true" /> Delete</button> : <span /> }<div><button onClick={() => setForm(null)} type="button">Cancel</button><button disabled={saving} type="submit"><Save aria-hidden="true" /> {saving ? "Saving…" : "Save session"}</button></div></footer></form></section></div> : null}
      {roomForm ? <div className="program-board-modal-backdrop"><section aria-labelledby="room-form-title" aria-modal="true" className="program-board-modal" role="dialog"><header><div><p>{roomForm.id ? "Edit room record" : "New room record"}</p><h2 id="room-form-title">{roomForm.id ? roomForm.name : "Add a room"}</h2></div><button aria-label="Close room form" onClick={() => setRoomForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={saveRoom}><label className="program-board-wide"><span>Full room name</span><input autoFocus onChange={(event) => setRoomForm({ ...roomForm, name: event.target.value })} required value={roomForm.name} /></label><label><span>Short grid label</span><input maxLength={30} onChange={(event) => setRoomForm({ ...roomForm, shortLabel: event.target.value })} required value={roomForm.shortLabel} /></label><label><span>Floor / area</span><input onChange={(event) => setRoomForm({ ...roomForm, floor: event.target.value })} value={roomForm.floor} /></label><label><span>Capacity</span><input min="0" onChange={(event) => setRoomForm({ ...roomForm, capacity: event.target.value })} type="number" value={roomForm.capacity} /></label><label><span>Grid order</span><input onChange={(event) => setRoomForm({ ...roomForm, displayOrder: event.target.value })} required type="number" value={roomForm.displayOrder} /></label><label><span>Room color</span><input className="program-board-color-input" onChange={(event) => setRoomForm({ ...roomForm, color: event.target.value })} type="color" value={roomForm.color} /></label><label><span>Map position X (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapX: event.target.value })} type="number" value={roomForm.mapX} /></label><label><span>Map position Y (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapY: event.target.value })} type="number" value={roomForm.mapY} /></label><label className="program-board-wide"><span>Public directions</span><textarea onChange={(event) => setRoomForm({ ...roomForm, directions: event.target.value })} rows={2} value={roomForm.directions} /></label><label className="program-board-wide"><span>Internal room notes</span><textarea onChange={(event) => setRoomForm({ ...roomForm, notes: event.target.value })} rows={2} value={roomForm.notes} /></label><label className="program-board-check"><input checked={roomForm.accessible} onChange={(event) => setRoomForm({ ...roomForm, accessible: event.target.checked })} type="checkbox" /><span>Accessible room</span></label>{roomMessage ? <p className="program-board-form-error">{roomMessage}</p> : null}<footer><span /><div><button onClick={() => setRoomForm(null)} type="button">Cancel</button><button disabled={roomSaving} type="submit"><Save aria-hidden="true" /> {roomSaving ? "Saving…" : "Save room"}</button></div></footer></form></section></div> : null}
    </main>
  );
}
