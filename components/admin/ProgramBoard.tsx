"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, ChevronLeft, ChevronRight, Eye, GripVertical, Pencil, Plus, RotateCw, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { ProgramDialog } from "./ProgramDialog";
import { clampResizeDelta, planResize } from "@/lib/program-board-planning";
import { canAccessArea } from "@/lib/crm-access";

import type { ProgramRoom, ProgramSession } from "@/components/site/program-types";
import { SESSION_TYPE_LABELS } from "@/components/site/program-types";

type EditorState = "loading" | "ready" | "unauthorized" | "error";
type EditableSession = ProgramSession & { internalNotes: string; updatedAt: string; scheduleRevision: number };
type FormState = {
  expectedUpdatedAt?: string;
  expectedRevision?: number;
  endDate: string;
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
type ResizeEdge = "start" | "end";
type ResizePreview = { sessionID: string; edge: ResizeEdge; pointerStartY: number; scrollStartY: number; deltaSlots: number };
type ResizeRange = { startAt: string; endAt: string };
type ResizePlan = { changes: Map<string, ResizeRange>; error?: string };
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
const EMPTY_FORM: FormState = { title: "", sessionType: "panel", date: CONVENTION_DAYS[0], endDate: CONVENTION_DAYS[0], startTime: "09:00", endTime: "10:00", room: "", shortDescription: "", language: "English", audience: "", accessibility: "", status: "published", featured: false, internalNotes: "" };
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

function displayTime(value: string) {
  const [hourPart, minute = "00"] = value.split(":");
  const hour = Number(hourPart);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
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

function normalizeSession(value: unknown, rooms: ProgramRoom[]): EditableSession | null {
  if (!value || typeof value !== "object") return null;
  const doc = value as Record<string, unknown>;
  const related = normalizeRoom(doc.room);
  const room = related || rooms.find((candidate) => String(candidate.id) === String(doc.room));
  if (!room) return null;
  return { internalNotes: typeof doc.internalNotes === "string" ? doc.internalNotes : "", updatedAt: String(doc.updatedAt || ""), scheduleRevision: Number(doc.scheduleRevision || 0), id: doc.id as string | number, title: String(doc.title || "Untitled session"), slug: String(doc.slug || doc.id), sessionType: String(doc.sessionType || "panel"), startAt: String(doc.startAt), endAt: String(doc.endAt), room, shortDescription: typeof doc.shortDescription === "string" ? doc.shortDescription : null, language: typeof doc.language === "string" ? doc.language : null, audience: typeof doc.audience === "string" ? doc.audience : null, accessibility: typeof doc.accessibility === "string" ? doc.accessibility : null, featured: Boolean(doc.featured), status: typeof doc.status === "string" ? doc.status : null, tracks: Array.isArray(doc.tracks) ? doc.tracks.map(String) : null };
}

async function allDocs(path: string) {
    const docs: unknown[] = [];
    let page = 1;
    for (;;) {
      const response = await fetch(`${path}&page=${page}`, { credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(20_000) });
      if (!response.ok) throw new Error("Unable to load program data");
      const result = await response.json() as { docs?: unknown[]; hasNextPage?: boolean };
      docs.push(...(result.docs || []));
      if (!result.hasNextPage) return docs;
      page += 1;
    }
  }

export function ProgramBoard() {
  const [state, setState] = useState<EditorState>("loading");
  const [canManage, setCanManage] = useState(false);
  const [rooms, setRooms] = useState<EditableRoom[]>([]);
  const [sessions, setSessions] = useState<EditableSession[]>([]);
  const [day, setDay] = useState(CONVENTION_DAYS[0]);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [draggedSessionID, setDraggedSessionID] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null);
  const [movingSessionIDs, setMovingSessionIDs] = useState<Set<string>>(() => new Set());
  const [roomForm, setRoomForm] = useState<RoomFormState | null>(null);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");
  const [roomOrdering, setRoomOrdering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [needsReload, setNeedsReload] = useState(false);
  const mutationRef = useRef(false);
  const [pendingResize, setPendingResize] = useState<ResizePlan | null>(null);
  const [undoChanges, setUndoChanges] = useState<Array<{ id: string; expectedUpdatedAt: string; expectedRevision: number; data: ResizeRange & { room: string } }> | null>(null);
  const dragImageRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    try {
      const authResponse = await fetch("/api/users/me", { credentials: "same-origin", cache: "no-store", signal: AbortSignal.timeout(20_000) });
      const authJSON = authResponse.ok ? await authResponse.json() as { user?: unknown } : null;
      if (!canAccessArea(authJSON?.user, "program")) {
        setState("unauthorized");
        return;
      }
      setCanManage(canAccessArea(authJSON?.user, "program", true));
      const [roomDocs, sessionDocs] = await Promise.all([
        allDocs("/api/rooms?limit=100&sort=displayOrder&depth=0"),
        allDocs("/api/program-sessions?limit=500&sort=startAt&depth=1"),
      ]);
      const nextRooms = roomDocs.map(normalizeRoom).filter((value): value is EditableRoom => Boolean(value));
      const nextSessions = sessionDocs.map((value) => normalizeSession(value, nextRooms)).filter((value): value is EditableSession => Boolean(value));
      setRooms(nextRooms);
      setSessions(nextSessions);
      setState("ready");
      setNeedsReload(false);
      return true;
    } catch {
      setNeedsReload(true);
      setState(current => current === "loading" ? "error" : current);
      setMessage("The schedule could not be refreshed. Check your connection and reload before saving.");
      return false;
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const daySessions = useMemo(() => sessions.filter((session) => dateKey(session.startAt) === day), [day, sessions]);

  function startCreate(roomID?: string, startTime = "09:00") {
    if (!canManage || mutationRef.current || pendingResize || needsReload) return;
    const [hour, minute] = startTime.split(":").map(Number);
    const endMinutes = hour * 60 + minute + 60;
    setMessage("");
    setForm({ ...EMPTY_FORM, date: day, endDate: endMinutes >= 1440 ? dateKey(new Date(new Date(iso(day, "12:00")).getTime() + 86_400_000).toISOString()) : day, startTime, endTime: `${String(Math.floor(endMinutes / 60) % 24).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`, room: roomID || String(rooms[0]?.id || "") });
  }

  function startEdit(session: EditableSession) {
    if (!canManage || mutationRef.current || needsReload || pendingResize) return;
    setMessage("");
    setForm({ id: session.id, expectedUpdatedAt: session.updatedAt, expectedRevision: session.scheduleRevision, endDate: dateKey(session.endAt), title: session.title, sessionType: session.sessionType, date: dateKey(session.startAt), startTime: timeValue(session.startAt), endTime: timeValue(session.endAt), room: String(session.room.id), shortDescription: session.shortDescription || "", language: session.language || "English", audience: session.audience || "", accessibility: session.accessibility || "", status: session.status || "published", featured: Boolean(session.featured), internalNotes: session.internalNotes });
  }

  function startCreateRoom() {
    if (!canManage) return;
    const nextOrder = rooms.length ? Math.max(...rooms.map((room) => room.displayOrder)) + 10 : 0;
    setRoomMessage("");
    setRoomForm({ ...EMPTY_ROOM_FORM, displayOrder: String(nextOrder) });
  }

  function startEditRoom(room: EditableRoom) {
    if (!canManage) return;
    setRoomMessage("");
    setRoomForm({ id: room.id, name: room.name, shortLabel: room.shortLabel, floor: room.floor || "", capacity: room.capacity == null ? "" : String(room.capacity), accessible: room.accessible, directions: room.directions, displayOrder: String(room.displayOrder), mapX: room.mapX == null ? "" : String(room.mapX), mapY: room.mapY == null ? "" : String(room.mapY), color: room.color || "#E85E27", notes: room.notes });
  }

  async function saveRoom(event: React.FormEvent) {
    event.preventDefault();
    if (!canManage) return;
    if (!roomForm) return;
    setRoomSaving(true);
    setRoomMessage("");
    const payload = { name: roomForm.name, shortLabel: roomForm.shortLabel, floor: roomForm.floor, capacity: roomForm.capacity === "" ? null : Number(roomForm.capacity), accessible: roomForm.accessible, directions: roomForm.directions, displayOrder: Number(roomForm.displayOrder), mapX: roomForm.mapX === "" ? null : Number(roomForm.mapX), mapY: roomForm.mapY === "" ? null : Number(roomForm.mapY), color: roomForm.color, notes: roomForm.notes };
    try {
    const response = await fetch(roomForm.id ? `/api/rooms/${roomForm.id}` : "/api/rooms", { method: roomForm.id ? "PATCH" : "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: AbortSignal.timeout(20_000) });
    setRoomSaving(false);
    if (!response.ok) {
      const result = await response.json().catch(() => ({})) as { errors?: Array<{ message?: string }> };
      setRoomMessage(result.errors?.[0]?.message || "The room could not be saved.");
      return;
    }
    setRoomForm(null);
    await load();
    } catch (error) { setRoomMessage(failureMessage(error)); }
    finally { setRoomSaving(false); }
  }

  async function moveRoom(roomID: string, direction: -1 | 1) {
    if (!canManage) return;
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
      const responses = await Promise.all(normalized.map((room) => fetch(`/api/rooms/${room.id}`, { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayOrder: room.displayOrder }), signal: AbortSignal.timeout(20_000) })));
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

  async function sendSchedule(input: unknown) {
    const response = await fetch("/api/admin/program-schedule", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input), signal: AbortSignal.timeout(20_000) });
    const result = await response.json().catch(() => ({})) as { error?: string; docs?: unknown[] };
    if (!response.ok) throw new Error(result.error || "The change could not be saved. Reload and reopen the session to review your change.");
    return (result.docs || []).map(doc => normalizeSession(doc, rooms)).filter((doc): doc is EditableSession => Boolean(doc));
  }
  function failureMessage(error: unknown) {
    return error instanceof TypeError || (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name))
      ? "Connection lost. The save result is unknown. Reload the schedule before trying again; any open form has been preserved."
      : error instanceof Error ? error.message : "The change could not be saved. Reload and reopen the session to review your change.";
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!canManage) return;
    if (!form) return;
    const startAt = iso(form.date, form.startTime);
    const endAt = iso(form.endDate, form.endTime);
    if (new Date(endAt) <= new Date(startAt)) { setMessage("End time must be later than start time."); return; }
    const conflict = overlapping({ id: form.id, room: form.room, startAt, endAt });
    if (conflict) { setMessage(`That overlaps “${conflict.title}” in the same room.`); return; }
    if (mutationRef.current || needsReload) return;
    mutationRef.current = true;
    setSaving(true);
    setMessage("");
    const payload = { title: form.title, slug: `${slugify(form.title)}-${form.date}-${form.startTime.replace(":", "")}`, sessionType: form.sessionType, startAt, endAt, room: relationshipID(form.room), shortDescription: form.shortDescription, language: form.language, audience: form.audience, accessibility: form.accessibility, status: form.status, featured: form.featured, internalNotes: form.internalNotes };
    try {
      await sendSchedule(form.id ? { action: "update", changes: [{ id: String(form.id), expectedUpdatedAt: form.expectedUpdatedAt, expectedRevision: form.expectedRevision, data: payload }] } : { action: "create", data: payload });
      setForm(null);
      setUndoChanges(null);
      await load();
    } catch (error) { setNeedsReload(true); setMessage(failureMessage(error)); }
    finally { setSaving(false); mutationRef.current = false; }
  }

  async function remove() {
    if (!canManage || !form?.id || mutationRef.current || !window.confirm(`Delete “${form.title}”? This cannot be undone.`)) return;
    mutationRef.current = true; setSaving(true);
    try {
      await sendSchedule({ action: "delete", changes: [{ id: String(form.id), expectedUpdatedAt: form.expectedUpdatedAt, expectedRevision: form.expectedRevision }] });
      setForm(null); setUndoChanges(null); await load();
    } catch (error) { setNeedsReload(true); setMessage(failureMessage(error)); }
    finally { setSaving(false); mutationRef.current = false; }
  }

  async function commitRanges(changes: Map<string, ResizeRange & { room?: string }>, undo = false) {
    if (!canManage || mutationRef.current || needsReload) return;
    const originals = sessions.filter(session => changes.has(String(session.id)));
    if (originals.length !== changes.size) { setMessage("The schedule changed. Reload before applying this operation."); return; }
    mutationRef.current = true;
    setMovingSessionIDs(new Set(changes.keys()));
    setMessage("Saving schedule…");
    try {
      const docs = await sendSchedule({ action: "update", changes: originals.map(session => ({ id: String(session.id), expectedUpdatedAt: session.updatedAt, expectedRevision: session.scheduleRevision, data: changes.get(String(session.id)) })) });
      if (docs.length !== originals.length) throw new Error("The server response was incomplete. Reload to check the saved schedule.");
      setSessions(current => current.map(session => docs.find(doc => String(doc.id) === String(session.id)) || session));
      setUndoChanges(undo ? null : originals.map(session => {
        const saved = docs.find(doc => String(doc.id) === String(session.id))!;
        return { id: String(session.id), expectedUpdatedAt: saved.updatedAt, expectedRevision: saved.scheduleRevision, data: { startAt: session.startAt, endAt: session.endAt, room: String(session.room.id) } };
      }));
      setMessage(undo ? "Schedule change undone." : "Schedule saved. You can undo this change.");
    } catch (error) { const message = failureMessage(error); await load(); setMessage(message); }
    finally { setMovingSessionIDs(new Set()); mutationRef.current = false; }
  }

  async function undoSchedule() {
    if (!undoChanges || mutationRef.current || needsReload) return;
    mutationRef.current = true; setSaving(true);
    try {
      await sendSchedule({ action: "update", changes: undoChanges });
      setUndoChanges(null); await load(); setMessage("Schedule change undone.");
    } catch (error) { setNeedsReload(true); setMessage(failureMessage(error)); }
    finally { mutationRef.current = false; setSaving(false); }
  }

  async function moveSession(sessionID: string, roomID: string, startTime: string) {
    if (!canManage || mutationRef.current || needsReload || pendingResize) return;
    const session = sessions.find(candidate => String(candidate.id) === sessionID);
    if (!session) return;
    const startAt = iso(day, startTime);
    const endAt = new Date(Date.parse(startAt) + Date.parse(session.endAt) - Date.parse(session.startAt)).toISOString();
    const boardEnd = Date.parse(`${day}T00:00:00-05:00`) + 86_400_000;
    if (Date.parse(endAt) > boardEnd) { setMessage("Move blocked: the session would end after midnight. Use Edit to set an overnight session."); return; }
    const conflict = overlapping({ id: session.id, room: roomID, startAt, endAt });
    if (conflict) { setMessage(`Move blocked: “${conflict.title}” already uses that room and time.`); return; }
    await commitRanges(new Map([[sessionID, { startAt, endAt, room: roomID }]]));
  }

  function buildResizePlan(session: ProgramSession, edge: ResizeEdge, delta: number) {
    return planResize(sessions, session, edge, delta);
  }

  async function resizeSession(session: ProgramSession, edge: ResizeEdge, deltaSlots: number) {
    if (!canManage || !deltaSlots || mutationRef.current || needsReload || pendingResize) return;
    const plan = buildResizePlan(session, edge, deltaSlots);
    if (plan.error) { setMessage(plan.error); return; }
    if (plan.changes.size > 1) { setPendingResize(plan); setMessage("Review the affected sessions before applying this resize."); return; }
    await commitRanges(plan.changes);
  }

  function resizeHandleProps(session: ProgramSession, edge: ResizeEdge, top: number, height: number) {
    return {
      "aria-label": `Resize ${edge === "start" ? "start" : "end"} of ${session.title}`,
      className: `program-board-resize-handle program-board-resize-${edge}`,
      disabled: !canManage || needsReload || saving || movingSessionIDs.size > 0 || Boolean(pendingResize),
      onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!canManage) return;
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        setResizePreview({ sessionID: String(session.id), edge, pointerStartY: event.clientY, scrollStartY: scrollRef.current?.scrollTop || 0, deltaSlots: 0 });
      },
      onPointerMove: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (resizePreview?.sessionID !== String(session.id) || resizePreview.edge !== edge) return;
        const deltaSlots = clampResizeDelta(session, edge, Math.round((event.clientY - resizePreview.pointerStartY + (scrollRef.current?.scrollTop || 0) - resizePreview.scrollStartY) / slotHeight));
        setResizePreview({ ...resizePreview, deltaSlots });
      },
      onPointerUp: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (resizePreview?.sessionID !== String(session.id) || resizePreview.edge !== edge) return;
        const deltaSlots = clampResizeDelta(session, edge, Math.round((event.clientY - resizePreview.pointerStartY + (scrollRef.current?.scrollTop || 0) - resizePreview.scrollStartY) / slotHeight));
        setResizePreview(null);
        void resizeSession(session, edge, deltaSlots);
      },
      onPointerCancel: () => setResizePreview(null),
      onLostPointerCapture: () => setResizePreview(null),
      onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Escape") { event.preventDefault(); setResizePreview(null); return; }
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        if (!canManage) return;
        void resizeSession(session, edge, clampResizeDelta(session, edge, event.key === "ArrowUp" ? -1 : 1));
      },
      // Keep the whole hit target inside the card so the grip reads as part of it.
      style: { top: edge === "start" ? top : top + height - 24 },
      type: "button" as const,
    };
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
    ? Math.max(0.01, (new Date(draggedSession.endAt).getTime() - new Date(draggedSession.startAt).getTime()) / 1_800_000)
    : 1;
  const dropStartAt = dropTarget ? iso(day, dropTarget.time) : null;
  const dropEndAt = dropStartAt && draggedSession ? new Date(Date.parse(dropStartAt) + Date.parse(draggedSession.endAt) - Date.parse(draggedSession.startAt)).toISOString() : null;
  const dropConflict = dropTarget && dropStartAt && dropEndAt && draggedSession ? overlapping({ id: draggedSession.id, room: dropTarget.roomID, startAt: dropStartAt, endAt: dropEndAt }) : null;
  const dropError = dropConflict ? `Overlaps ${dropConflict.title}` : dropEndAt && Date.parse(dropEndAt) > Date.parse(`${day}T00:00:00-05:00`) + 86_400_000 ? "Ends after midnight" : null;
  const resizePreviewSession = resizePreview ? sessions.find((session) => String(session.id) === resizePreview.sessionID) : null;
  const resizePreviewPlan = resizePreviewSession && resizePreview
    ? buildResizePlan(resizePreviewSession, resizePreview.edge, resizePreview.deltaSlots)
    : null;
  return (
    <main className="program-board-page">
      <header className="program-board-header"><div><Link href="/admin"><ArrowLeft aria-hidden="true" /> Payload admin</Link><h1>Program Board</h1><p>{canManage ? "All times Eastern. Drag to move; use the grips or arrow keys to resize. Click a session to edit its room and times." : "View-only program access. Browse the schedule or open the program preview."}</p></div><div><Link className="program-board-preview-action" href="/program-preview"><Eye aria-hidden="true" /> Preview public page</Link><button className="program-board-secondary-action" disabled={!canManage} onClick={startCreateRoom} type="button"><Building2 aria-hidden="true" /> Add room</button><button disabled={!canManage} onClick={() => startCreate()} type="button"><Plus aria-hidden="true" /> Add session</button></div></header>
      <div className="program-board-toolbar"><div role="tablist" aria-label="Convention day">{CONVENTION_DAYS.map((value) => <button aria-selected={day === value} key={value} disabled={Boolean(pendingResize) || movingSessionIDs.size > 0} onClick={() => { setDay(value); setResizePreview(null); }} role="tab" type="button">{dayLabel(value)}</button>)}</div><p aria-live="polite">{resizePreviewPlan?.error || message || `${daySessions.length} sessions · ${rooms.length} rooms`}</p><button type="button" disabled={saving || movingSessionIDs.size > 0 || Boolean(pendingResize)} onClick={() => void load()}>Reload schedule</button><button type="button" disabled={!undoChanges || saving || movingSessionIDs.size > 0 || Boolean(pendingResize)} onClick={() => void undoSchedule()}>Undo last change</button></div>
      {pendingResize ? <section className="program-board-resize-review" aria-label="Review resize"><h2>Review affected sessions</h2><ul>{[...pendingResize.changes].map(([id, range]) => { const original = sessions.find(session => String(session.id) === id)!; return <li key={id}><strong>{original.title}</strong>: {displayTime(timeValue(original.startAt))}–{displayTime(timeValue(original.endAt))} → {displayTime(timeValue(range.startAt))}–{displayTime(timeValue(range.endAt))}</li>; })}</ul><button type="button" onClick={() => { const changes = pendingResize.changes; setPendingResize(null); void commitRanges(changes); }}>Apply resize</button><button type="button" onClick={() => { setPendingResize(null); setMessage("Resize cancelled."); }}>Cancel resize</button></section> : null}
      {state === "loading" ? <div className="program-board-loading">Loading program records…</div> : (
        <div ref={scrollRef} className="program-board-scroll">
          <div className="program-board-grid" style={{ "--room-count": rooms.length, "--slot-height": `${slotHeight}px` } as React.CSSProperties}>
            <div className="program-board-corner">Time</div>
            {rooms.map((room, index) => <div className="program-board-room" key={room.id}><span style={{ background: room.color || undefined }} /><strong>{room.shortLabel}</strong><small>{room.floor}</small><div className="program-board-room-actions"><button aria-label={`Move ${room.name} left`} disabled={!canManage || index === 0 || roomOrdering} onClick={() => void moveRoom(String(room.id), -1)} title="Move room left" type="button"><ChevronLeft aria-hidden="true" /></button><button disabled={!canManage} aria-label={`Edit ${room.name}`} onClick={() => startEditRoom(room)} title={`Edit ${room.name}`} type="button"><Pencil aria-hidden="true" /></button><button aria-label={`Move ${room.name} right`} disabled={!canManage || index === rooms.length - 1 || roomOrdering} onClick={() => void moveRoom(String(room.id), 1)} title="Move room right" type="button"><ChevronRight aria-hidden="true" /></button></div></div>)}
            <div className="program-board-axis" style={{ height: slots * slotHeight }}>{Array.from({ length: slots }, (_, index) => { const minutes = startMinute + index * 30; const hour = Math.floor(minutes / 60); const minute = minutes % 60; return <span key={index} style={{ top: index * slotHeight }}>{new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "numeric", minute: "2-digit" }).format(new Date(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-05:00`))}</span>; })}</div>
            {rooms.map((room) => (
              <div
                className="program-board-track"
                onDragOver={event => {
                  if (!draggedSessionID || !canManage) return;
                  event.preventDefault();
                  const y = event.clientY - event.currentTarget.getBoundingClientRect().top;
                  const index = Math.max(0, Math.min(slots - 1, Math.floor(y / slotHeight)));
                  const minutes = startMinute + index * 30;
                  setDropTarget({ roomID: String(room.id), time: `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}` });
                  const scroller = scrollRef.current;
                  if (scroller) { const rect = scroller.getBoundingClientRect(); scroller.scrollBy({ top: event.clientY > rect.bottom - 44 ? 18 : event.clientY < rect.top + 90 ? -18 : 0, left: event.clientX > rect.right - 44 ? 18 : event.clientX < rect.left + 90 ? -18 : 0 }); }
                }}
                onDrop={event => {
                  event.preventDefault();
                  if (!dropTarget) return;
                  const id = event.dataTransfer.getData("text/program-session");
                  const target = dropTarget;
                  setDropTarget(null); setDraggedSessionID(null);
                  void moveSession(id, target.roomID, target.time);
                }}
                key={room.id}
                style={{ height: slots * slotHeight }}
              >
                {Array.from({ length: slots }, (_, index) => {
                  const minutes = startMinute + index * 30;
                  const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
                  const highlighted = dropTarget?.roomID === String(room.id) && index >= dropStartIndex && index < dropStartIndex + dropDurationSlots;
                  return (
                    <button
                      aria-label={`Add session in ${room.name} at ${time}`}
                      tabIndex={index === 0 ? 0 : -1}
                      onKeyDown={event => { if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return; event.preventDefault(); const cells = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(".program-board-cell"); cells?.[Math.max(0, Math.min(slots - 1, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus(); }}
                      disabled={!canManage}
                      className="program-board-cell"
                      data-drop-active={highlighted || undefined}
                      data-drop-end={highlighted && index === Math.ceil(dropStartIndex + dropDurationSlots) - 1 || undefined}
                      data-drop-start={highlighted && index === dropStartIndex || undefined}
                      key={time}
                      onClick={() => startCreate(String(room.id), time)}
                      onDragEnter={(event) => { event.preventDefault(); setDropTarget({ roomID: String(room.id), time }); }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        if (!canManage) return;
                        event.dataTransfer.dropEffect = "move";
                        setDropTarget({ roomID: String(room.id), time });
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        if (!canManage) return;
                        event.stopPropagation();
                        const sessionID = event.dataTransfer.getData("text/program-session");
                        setDropTarget(null);
                        setDraggedSessionID(null);
                        void moveSession(sessionID, String(room.id), time);
                      }}
                      style={{ height: slotHeight, top: index * slotHeight }}
                      type="button"
                    />
                  );
                })}
                {daySessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => {
                  const sessionID = String(session.id);
      const visualPlan = pendingResize || resizePreviewPlan;
                  const previewRange = visualPlan && !visualPlan.error ? visualPlan.changes.get(sessionID) : undefined;
                  const visualStartAt = previewRange?.startAt || session.startAt;
                  const visualEndAt = previewRange?.endAt || session.endAt;
                  const [hour, minute] = timeValue(visualStartAt).split(":").map(Number);
                  const top = Math.max(0, ((hour * 60 + minute) - startMinute) / 30 * slotHeight + 3);
                  const height = Math.max(slotHeight - 6, (new Date(visualEndAt).getTime() - new Date(visualStartAt).getTime()) / 60000 / 30 * slotHeight - 6);
                  const moving = movingSessionIDs.has(sessionID);
                  return (
                    <React.Fragment key={session.id}>
                    <button
                      aria-busy={moving}
                      className="program-board-event"
                      data-dragging={draggedSessionID === sessionID || undefined}
                      data-moving={moving || undefined}
                      draggable={canManage && !saving && movingSessionIDs.size === 0 && !pendingResize}
                      key={session.id}
                      disabled={saving || movingSessionIDs.size > 0 || Boolean(pendingResize)}
                      onClick={() => startEdit(session)}
                      onDragEnd={() => {
                        setDraggedSessionID(null);
                        setDropTarget(null);
                        dragImageRef.current?.remove();
                        dragImageRef.current = null;
                      }}
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/program-session", sessionID);
                        setDraggedSessionID(sessionID);

                        // Use a deliberate, high-contrast drag image instead of
                        // the browser's pale, semi-transparent button snapshot.
                        const dragImage = document.createElement("div");
                        dragImage.className = "program-board-drag-image";
                        dragImage.style.backgroundColor = session.room.color || "#ffc928";
                        const title = document.createElement("strong");
                        title.textContent = session.title;
                        const destination = document.createElement("span");
                        destination.textContent = SESSION_TYPE_LABELS[session.sessionType] || session.sessionType;
                        dragImage.append(title, destination);
                        document.body.append(dragImage);
                        dragImageRef.current?.remove();
                        dragImageRef.current = dragImage;
                        event.dataTransfer.setDragImage(dragImage, 18, 18);
                      }}
                      style={{ background: room.color || undefined, height, top }}
                      type="button"
                    >
                      <GripVertical aria-hidden="true" />
                      <span>{displayTime(timeValue(visualStartAt))}</span>
                      <strong>{session.title}</strong>
                      <small>{moving ? "Saving…" : SESSION_TYPE_LABELS[session.sessionType] || session.sessionType}</small>
                    </button>
                    <button {...resizeHandleProps(session, "start", top, height)} />
                    <button {...resizeHandleProps(session, "end", top, height)} />
                    </React.Fragment>
                  );
                })}
                {dropTarget?.roomID === String(room.id) && draggedSession ? (
                  <div
                    aria-hidden="true"
                    className="program-board-drop-preview"
                    data-invalid={Boolean(dropError)}
                    style={{
                      height: Math.max(slotHeight - 6, dropDurationSlots * slotHeight - 6),
                      top: dropStartIndex * slotHeight + 3,
                    }}
                  >
                    <span>{room.shortLabel} · {dropError || "drop here"}</span>
                    <span>{displayTime(dropTarget.time)}–{dropEndAt ? displayTime(timeValue(dropEndAt)) : ""} · {dropDurationSlots * 30} min</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
      {form ? <ProgramDialog labelledBy="program-form-title" onClose={() => setForm(null)} busy={saving}><header><div><p>{form.id ? "Edit program record" : "New program record"}</p><h2 id="program-form-title">{form.id ? form.title : "Add a session"}</h2></div><button aria-label="Close form" disabled={saving} onClick={() => setForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={save}><label className="program-board-wide"><span>Title</span><input autoFocus onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></label><label><span>Type</span><select onChange={(event) => setForm({ ...form, sessionType: event.target.value })} value={form.sessionType}>{Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>Room</span><select onChange={(event) => setForm({ ...form, room: event.target.value })} required value={form.room}>{rooms.map((value) => <option key={value.id} value={String(value.id)}>{value.name}</option>)}</select></label><label><span>Date</span><input onChange={(event) => setForm({ ...form, date: event.target.value, endDate: form.date === form.endDate ? event.target.value : form.endDate })} required type="date" value={form.date} /></label><label><span>Starts</span><input onChange={(event) => setForm({ ...form, startTime: event.target.value })} required step="1800" type="time" value={form.startTime} /></label><label><span>End date</span><input type="date" required value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} /></label><label><span>Ends</span><input onChange={(event) => setForm({ ...form, endTime: event.target.value })} required step="1800" type="time" value={form.endTime} /></label><label><span>Status</span><select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}><option value="published">Published</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></label><label className="program-board-wide"><span>Public description</span><textarea onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} rows={3} value={form.shortDescription} /></label><label><span>Language</span><input onChange={(event) => setForm({ ...form, language: event.target.value })} value={form.language} /></label><label><span>Audience / affinity</span><input onChange={(event) => setForm({ ...form, audience: event.target.value })} value={form.audience} /></label><label className="program-board-wide"><span>Accessibility information</span><textarea onChange={(event) => setForm({ ...form, accessibility: event.target.value })} rows={2} value={form.accessibility} /></label><label className="program-board-wide"><span>Internal committee notes</span><textarea onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} rows={2} value={form.internalNotes} /></label><label className="program-board-check"><input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" /><span>Mark as featured <small>Saved for future homepage or program spotlight sections; it does not currently change the schedule display.</small></span></label>{message ? <div role="alert" className="program-board-form-error">{message}{needsReload ? <button type="button" onClick={() => void load()}>Reload schedule</button> : null}</div> : null}<footer>{form.id ? <button className="program-board-delete" disabled={saving || needsReload} onClick={() => void remove()} type="button"><Trash2 aria-hidden="true" /> Delete</button> : <span /> }<div><button disabled={saving} onClick={() => setForm(null)} type="button">Cancel</button><button disabled={saving || needsReload} type="submit"><Save aria-hidden="true" /> {saving ? "Saving…" : "Save session"}</button></div></footer></form></ProgramDialog> : null}
      {roomForm ? <ProgramDialog labelledBy="room-form-title" onClose={() => setRoomForm(null)} busy={roomSaving}><header><div><p>{roomForm.id ? "Edit room record" : "New room record"}</p><h2 id="room-form-title">{roomForm.id ? roomForm.name : "Add a room"}</h2></div><button aria-label="Close room form" disabled={roomSaving} onClick={() => setRoomForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={saveRoom}><label className="program-board-wide"><span>Full room name</span><input autoFocus onChange={(event) => setRoomForm({ ...roomForm, name: event.target.value })} required value={roomForm.name} /></label><label><span>Short grid label</span><input maxLength={30} onChange={(event) => setRoomForm({ ...roomForm, shortLabel: event.target.value })} required value={roomForm.shortLabel} /></label><label><span>Floor / area</span><input onChange={(event) => setRoomForm({ ...roomForm, floor: event.target.value })} value={roomForm.floor} /></label><label><span>Capacity</span><input min="0" onChange={(event) => setRoomForm({ ...roomForm, capacity: event.target.value })} type="number" value={roomForm.capacity} /></label><label><span>Grid order</span><input onChange={(event) => setRoomForm({ ...roomForm, displayOrder: event.target.value })} required type="number" value={roomForm.displayOrder} /></label><label><span>Room color</span><input className="program-board-color-input" onChange={(event) => setRoomForm({ ...roomForm, color: event.target.value })} type="color" value={roomForm.color} /></label><label><span>Map position X (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapX: event.target.value })} type="number" value={roomForm.mapX} /></label><label><span>Map position Y (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapY: event.target.value })} type="number" value={roomForm.mapY} /></label><label className="program-board-wide"><span>Public directions</span><textarea onChange={(event) => setRoomForm({ ...roomForm, directions: event.target.value })} rows={2} value={roomForm.directions} /></label><label className="program-board-wide"><span>Internal room notes</span><textarea onChange={(event) => setRoomForm({ ...roomForm, notes: event.target.value })} rows={2} value={roomForm.notes} /></label><label className="program-board-check"><input checked={roomForm.accessible} onChange={(event) => setRoomForm({ ...roomForm, accessible: event.target.checked })} type="checkbox" /><span>Accessible room</span></label>{roomMessage ? <p role="alert" className="program-board-form-error">{roomMessage}</p> : null}<footer><span /><div><button disabled={roomSaving} onClick={() => setRoomForm(null)} type="button">Cancel</button><button disabled={roomSaving} type="submit"><Save aria-hidden="true" /> {roomSaving ? "Saving…" : "Save room"}</button></div></footer></form></ProgramDialog> : null}
    </main>
  );
}
