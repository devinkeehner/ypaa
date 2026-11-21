"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Building2, CalendarDays, CircleHelp, ChevronLeft, ChevronRight, Eye, GripVertical, Pencil, Plus, RotateCw, Save, Trash2, Undo2, X } from "lucide-react";
import Link from "next/link";
import { createPortal, flushSync } from "react-dom";
import { ProgramDialog } from "./ProgramDialog";
import { useProgramBoardDrag, type DropTarget } from "./useProgramBoardDrag";
import { useProgramBoardWebMCP } from "./useProgramBoardWebMCP";
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
type ResizeEdge = "start" | "end";
type ResizePreview = { sessionID: string; edge: ResizeEdge; pointerStartY: number; scrollStartY: number; deltaSlots: number };
type ResizeRange = { startAt: string; endAt: string };
type ScheduleRange = ResizeRange & { room?: string };
type ScheduleReview = {
  kind: "move" | "resize";
  changes: Map<string, ScheduleRange>;
  originals: EditableSession[];
};
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
const startMinute = 8 * 60;
const slots = 32;
const slotHeight = 58;
const slotTimes = Array.from({ length: slots }, (_, index) => {
  const minutes = startMinute + index * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});
const dateFormatter = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" });
const timeFormatter = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const headingDateFormatter = new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, weekday: "short", month: "short", day: "numeric" });

function dateKey(value: string) {
  const parts = dateFormatter.formatToParts(new Date(value));
  const find = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${find("year")}-${find("month")}-${find("day")}`;
}

function timeValue(value: string) {
  const parts = timeFormatter.formatToParts(new Date(value));
  return `${parts.find((part) => part.type === "hour")?.value || "00"}:${parts.find((part) => part.type === "minute")?.value || "00"}`;
}

function displayTime(value: string) {
  const [hourPart, minute = "00"] = value.split(":");
  const hour = Number(hourPart);
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? "PM" : "AM"}`;
}

function dayLabel(key: string) {
  return headingDateFormatter.format(new Date(`${key}T12:00:00-05:00`));
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
  const [pendingMove, setPendingMove] = useState<(DropTarget & { sessionID: string }) | null>(null);
  const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null);
  const [movingSessionIDs, setMovingSessionIDs] = useState<Set<string>>(() => new Set());
  const [roomForm, setRoomForm] = useState<RoomFormState | null>(null);
  const [roomSaving, setRoomSaving] = useState(false);
  const [roomMessage, setRoomMessage] = useState("");
  const [roomOrdering, setRoomOrdering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [needsReload, setNeedsReload] = useState(false);
  const mutationRef = useRef(false);
  const [scheduleReview, setScheduleReview] = useState<ScheduleReview | null>(null);
  const [undoChanges, setUndoChanges] = useState<Array<{ id: string; expectedUpdatedAt: string; expectedRevision: number; data: ResizeRange & { room: string } }> | null>(null);
  const drag = useProgramBoardDrag(scrollRef, slotTimes, slotHeight);

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

  const sessionsByRoom = useMemo(() => {
    const grouped = new Map<string, EditableSession[]>();
    for (const session of daySessions) {
      const roomID = String(session.room.id);
      const entries = grouped.get(roomID);
      if (entries) entries.push(session);
      else grouped.set(roomID, [session]);
    }
    return grouped;
  }, [daySessions]);

  function startCreate(roomID?: string, startTime = "09:00") {
    if (!canManage || mutationRef.current || scheduleReview || needsReload) return;
    const [hour, minute] = startTime.split(":").map(Number);
    const endMinutes = hour * 60 + minute + 60;
    setMessage("");
    setForm({ ...EMPTY_FORM, date: day, endDate: endMinutes >= 1440 ? dateKey(new Date(new Date(iso(day, "12:00")).getTime() + 86_400_000).toISOString()) : day, startTime, endTime: `${String(Math.floor(endMinutes / 60) % 24).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`, room: roomID || String(rooms[0]?.id || "") });
  }

  function startEdit(session: EditableSession) {
    if (!canManage || mutationRef.current || needsReload || scheduleReview) return;
    setMessage("");
    setForm({ id: session.id, expectedUpdatedAt: session.updatedAt, expectedRevision: session.scheduleRevision, endDate: dateKey(session.endAt), title: session.title, sessionType: session.sessionType, date: dateKey(session.startAt), startTime: timeValue(session.startAt), endTime: timeValue(session.endAt), room: String(session.room.id), shortDescription: session.shortDescription || "", language: session.language || "English", audience: session.audience || "", accessibility: session.accessibility || "", status: session.status || "published", featured: Boolean(session.featured), internalNotes: session.internalNotes });
  }

  function startCreateRoom() {
    if (!canManage || scheduleReview) return;
    const nextOrder = rooms.length ? Math.max(...rooms.map((room) => room.displayOrder)) + 10 : 0;
    setRoomMessage("");
    setRoomForm({ ...EMPTY_ROOM_FORM, displayOrder: String(nextOrder) });
  }

  function startEditRoom(room: EditableRoom) {
    if (!canManage || scheduleReview) return;
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
    if (!canManage || scheduleReview) return;
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

  async function commitRanges(changes: ScheduleReview["changes"], originals = sessions.filter(session => changes.has(String(session.id)))) {
    if (!canManage || mutationRef.current || needsReload) return;
    if (originals.length !== changes.size) { setMessage("The schedule changed. Reload before applying this operation."); return; }
    mutationRef.current = true;
    setMovingSessionIDs(new Set(changes.keys()));
    setMessage("Saving schedule…");
    try {
      const docs = await sendSchedule({ action: "update", changes: originals.map(session => ({ id: String(session.id), expectedUpdatedAt: session.updatedAt, expectedRevision: session.scheduleRevision, data: changes.get(String(session.id)) })) });
      if (docs.length !== originals.length) throw new Error("The server response was incomplete. Reload to check the saved schedule.");
      setSessions(current => current.map(session => docs.find(doc => String(doc.id) === String(session.id)) || session));
      setUndoChanges(originals.map(session => {
        const saved = docs.find(doc => String(doc.id) === String(session.id))!;
        return { id: String(session.id), expectedUpdatedAt: saved.updatedAt, expectedRevision: saved.scheduleRevision, data: { startAt: session.startAt, endAt: session.endAt, room: String(session.room.id) } };
      }));
      setMessage("Schedule saved. You can undo this change.");
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

  function planMove(session: EditableSession, roomID: string, date: string, startTime: string) {
    const startAt = iso(date, startTime);
    const endAt = new Date(Date.parse(startAt) + Date.parse(session.endAt) - Date.parse(session.startAt)).toISOString();
    if (startAt === new Date(session.startAt).toISOString() && roomID === String(session.room.id)) return {};
    const boardEnd = Date.parse(`${date}T00:00:00-05:00`) + 86_400_000;
    if (Date.parse(endAt) > boardEnd) return { error: "Move blocked: the session would end after midnight. Use Edit to set an overnight session." };
    const conflict = overlapping({ id: session.id, room: roomID, startAt, endAt });
    if (conflict) return { error: `Move blocked: “${conflict.title}” already uses that room and time.` };
    return { range: { startAt, endAt, room: roomID } };
  }

  async function moveSession(sessionID: string, roomID: string, startTime: string) {
    if (!canManage || mutationRef.current || needsReload || scheduleReview) return;
    const session = sessions.find(candidate => String(candidate.id) === sessionID);
    if (!session) return;
    const { error, range } = planMove(session, roomID, day, startTime);
    if (error) setMessage(error);
    if (!range) return;
    setPendingMove({ sessionID, roomID, time: startTime });
    try {
      await commitRanges(new Map([[sessionID, range]]));
    } finally {
      setPendingMove(null);
    }
  }

  function buildResizePlan(session: ProgramSession, edge: ResizeEdge, delta: number) {
    return planResize(sessions, session, edge, delta);
  }

  function prepareReview(kind: ScheduleReview["kind"], changes: ScheduleReview["changes"]) {
    setScheduleReview({ kind, changes, originals: sessions.filter(session => changes.has(String(session.id))) });
    setMessage(kind === "move" ? "Review the proposed move before applying it." : "Review the affected sessions before applying this resize.");
  }

  async function resizeSession(session: ProgramSession, edge: ResizeEdge, deltaSlots: number) {
    if (!canManage || !deltaSlots || mutationRef.current || needsReload || scheduleReview) return;
    const plan = buildResizePlan(session, edge, deltaSlots);
    if (plan.error) { setMessage(plan.error); return; }
    if (plan.changes.size > 1) { prepareReview("resize", plan.changes); return; }
    await commitRanges(plan.changes);
  }

  function webMCPReviewBlocker() {
    if (state !== "ready" || !canManage) return "Program management access is required.";
    if (needsReload) return "Reload the schedule before staging a change.";
    if (scheduleReview) return "Apply or cancel the current review before staging another change.";
    if (mutationRef.current || roomSaving || roomOrdering || form || roomForm || drag.sessionID || resizePreview) {
      return "Finish the current board action before staging a change.";
    }
  }

  useProgramBoardWebMCP({
    ready: state === "ready" && !needsReload,
    canManage,
    dates: CONVENTION_DAYS,
    times: slotTimes,
    list({ date = day, roomId }) {
      if (state !== "ready" || needsReload) return { error: "The schedule needs to be loaded." };
      if (typeof date !== "string" || !CONVENTION_DAYS.includes(date)) return { error: "Choose a convention date." };
      if (roomId !== undefined && !rooms.some(room => String(room.id) === roomId)) return { error: "Room ID was not found on the board." };
      return {
        selectedDate: day,
        date,
        dates: CONVENTION_DAYS,
        timeZone: TIME_ZONE,
        canManage,
        rooms: rooms.map(room => ({ id: String(room.id), name: room.name })),
        sessions: sessions
          .filter(session => dateKey(session.startAt) === date && (roomId === undefined || String(session.room.id) === roomId))
          .sort((a, b) => Date.parse(a.startAt) - Date.parse(b.startAt))
          .map(session => ({
            id: String(session.id), title: session.title, roomId: String(session.room.id),
            sessionType: session.sessionType, status: session.status, startAt: session.startAt, endAt: session.endAt,
          })),
      };
    },
    stageMove({ sessionId, roomId, date, startTime }) {
      const blocked = webMCPReviewBlocker();
      if (blocked) return { error: blocked };
      const session = sessions.find(candidate => String(candidate.id) === sessionId);
      if (!session) return { error: "Session ID was not found on the board." };
      if (typeof roomId !== "string" || !rooms.some(room => String(room.id) === roomId)) return { error: "Room ID was not found on the board." };
      if (typeof date !== "string" || !CONVENTION_DAYS.includes(date)) return { error: "Choose a convention date." };
      if (typeof startTime !== "string" || !slotTimes.includes(startTime)) return { error: "Choose a half-hour start time from 08:00 through 23:30 Eastern." };

      const { error, range } = planMove(session, roomId, date, startTime);
      if (!range) return { error: error ?? "The session already starts at that time in that room." };
      // Commit the review before another browser tool call can try to replace it.
      flushSync(() => {
        setDay(date);
        prepareReview("move", new Map([[String(session.id), range]]));
      });
      return { status: "awaiting_review", sessionId, roomId, ...range };
    },
    stageResize({ sessionId, edge, deltaSlots }) {
      const blocked = webMCPReviewBlocker();
      if (blocked) return { error: blocked };
      const session = sessions.find(candidate => String(candidate.id) === sessionId);
      if (!session) return { error: "Session ID was not found on the board." };
      if (edge !== "start" && edge !== "end") return { error: "Choose the start or end edge." };
      if (typeof deltaSlots !== "number" || !Number.isInteger(deltaSlots) || !deltaSlots || Math.abs(deltaSlots) > slots) {
        return { error: "Choose a nonzero number of half-hour steps within the size of the board." };
      }
      if (clampResizeDelta(session, edge, deltaSlots) !== deltaSlots) return { error: "That resize is outside board hours or leaves less than 30 minutes." };

      const plan = buildResizePlan(session, edge, deltaSlots);
      if (plan.error) return { error: plan.error };
      flushSync(() => {
        setDay(dateKey(session.startAt));
        prepareReview("resize", plan.changes);
      });
      return {
        status: "awaiting_review",
        changes: [...plan.changes].map(([id, range]) => ({ sessionId: id, ...range })),
      };
    },
  });

  function resizeHandleProps(session: ProgramSession, edge: ResizeEdge, top: number, height: number) {
    return {
      "aria-label": `Resize ${edge === "start" ? "start" : "end"} of ${session.title}`,
      className: `program-board-resize-handle program-board-resize-${edge}`,
      disabled: !canManage || needsReload || saving || movingSessionIDs.size > 0 || Boolean(scheduleReview),
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
        if (deltaSlots !== resizePreview.deltaSlots) setResizePreview({ ...resizePreview, deltaSlots });
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

  const draggedSessionID = drag.sessionID;
  const reviewedMove = scheduleReview?.kind === "move" ? scheduleReview.originals[0] : null;
  const reviewedRange = reviewedMove ? scheduleReview?.changes.get(String(reviewedMove.id)) : null;
  const reviewedTarget = reviewedRange?.room ? { roomID: reviewedRange.room, time: timeValue(reviewedRange.startAt) } : null;
  const dropTarget = drag.target ?? pendingMove ?? reviewedTarget;
  const draggedSession = reviewedMove ?? sessions.find(session => String(session.id) === (draggedSessionID ?? pendingMove?.sessionID));
  const dropStartIndex = dropTarget
    ? (Number(dropTarget.time.slice(0, 2)) * 60 + Number(dropTarget.time.slice(3, 5)) - startMinute) / 30
    : -1;
  const dropDurationSlots = draggedSession
    ? Math.max(0.01, (new Date(draggedSession.endAt).getTime() - new Date(draggedSession.startAt).getTime()) / 1_800_000)
    : 1;
  const dropStartAt = dropTarget ? iso(day, dropTarget.time) : null;
  const dropEndAt = dropStartAt && draggedSession ? new Date(Date.parse(dropStartAt) + Date.parse(draggedSession.endAt) - Date.parse(draggedSession.startAt)).toISOString() : null;
  const dropConflict = dropTarget && dropStartAt && dropEndAt && draggedSession ? overlapping({ id: draggedSession.id, room: dropTarget.roomID, startAt: dropStartAt, endAt: dropEndAt }) : null;
  const dropError = pendingMove ? null : dropConflict ? `Overlaps ${dropConflict.title}` : dropEndAt && Date.parse(dropEndAt) > Date.parse(`${day}T00:00:00-05:00`) + 86_400_000 ? "Ends after midnight" : null;
  const dropRoom = rooms.find(room => String(room.id) === dropTarget?.roomID);
  const dropStatus = dropTarget && dropRoom
    ? `${dropRoom.shortLabel} · ${displayTime(dropTarget.time)}${dropError ? ` · ${dropError}` : ""}`
    : "Move over a room and time";
  const busy = saving || movingSessionIDs.size > 0 || Boolean(scheduleReview) || Boolean(draggedSessionID);
  const resizePreviewSession = resizePreview ? sessions.find((session) => String(session.id) === resizePreview.sessionID) : null;
  const resizePreviewPlan = resizePreviewSession && resizePreview
    ? buildResizePlan(resizePreviewSession, resizePreview.edge, resizePreview.deltaSlots)
    : null;
  return (
    <main className="program-board-page">
      <header className="program-board-header">
        <div className="program-board-title">
          <Link href="/admin" aria-label="Back to Payload admin" title="Payload admin"><ArrowLeft aria-hidden="true" /></Link>
          <h1>Program Board</h1>
          {canManage ? (
            <details className="program-board-help">
              <summary aria-label="Board controls" title="Board controls"><CircleHelp aria-hidden="true" /></summary>
              <p>Drag a session to move it. On touch screens, drag the left grip. With a session focused, use Shift and the arrow keys to move it. Use the top or bottom grip to resize. Press Escape to cancel a drag.</p>
            </details>
          ) : <span className="program-board-readonly">View only</span>}
        </div>
        <div className="program-board-header-actions">
          <Link className="program-board-preview-action" href="/program-preview"><Eye aria-hidden="true" /> Preview program</Link>
          <button className="program-board-secondary-action" disabled={!canManage || Boolean(scheduleReview)} onClick={startCreateRoom} type="button"><Building2 aria-hidden="true" /> Add room</button>
          <button disabled={!canManage || Boolean(scheduleReview)} onClick={() => startCreate()} type="button"><Plus aria-hidden="true" /> Add session</button>
        </div>
      </header>
      <div className="program-board-toolbar">
        <div className="program-board-days" role="tablist" aria-label="Convention day">
          {CONVENTION_DAYS.map((value) => <button aria-selected={day === value} key={value} disabled={busy}
            onClick={() => { setDay(value); setResizePreview(null); }} role="tab" type="button">{dayLabel(value)}</button>)}
        </div>
        <div className="program-board-tools">
          <select aria-label="Jump to time" className="program-board-jump" disabled={busy} value=""
            onChange={(event) => { scrollRef.current?.scrollTo({ top: Number(event.target.value) * slotHeight }); }}>
            <option value="">Jump to time</option>{slotTimes.map((time, index) => <option key={time} value={index}>{displayTime(time)}</option>)}
          </select>
          <button type="button" aria-label="Reload schedule" title="Reload schedule" disabled={busy} onClick={() => void load()}><RotateCw aria-hidden="true" /></button>
          <button type="button" aria-label="Undo last change" title="Undo last change" disabled={!undoChanges || busy} onClick={() => void undoSchedule()}><Undo2 aria-hidden="true" /></button>
        </div>
        <p aria-live="polite">{draggedSessionID ? dropStatus : resizePreviewPlan?.error || message || `${daySessions.length} sessions · All times Eastern`}</p>
      </div>
      {scheduleReview ? (
        <section className="program-board-schedule-review" aria-label={`Review ${scheduleReview.kind}`}>
          <h2>{scheduleReview.kind === "move" ? "Review proposed move" : "Review affected sessions"}</h2>
          <ul>{scheduleReview.originals.map(original => {
            const range = scheduleReview.changes.get(String(original.id))!;
            const destination = rooms.find(room => String(room.id) === range.room);
            return (
              <li key={original.id}>
                <strong>{original.title}</strong>{" · "}
                {destination ? `${dayLabel(dateKey(original.startAt))}, ${original.room.name} · ` : ""}
                {displayTime(timeValue(original.startAt))}–{displayTime(timeValue(original.endAt))}
                {" → "}
                {destination ? `${dayLabel(dateKey(range.startAt))}, ${destination.name} · ` : ""}
                {displayTime(timeValue(range.startAt))}–{displayTime(timeValue(range.endAt))}
              </li>
            );
          })}</ul>
          <button type="button" disabled={!canManage || needsReload} onClick={() => {
            setScheduleReview(null);
            void commitRanges(scheduleReview.changes, scheduleReview.originals);
          }}>Apply {scheduleReview.kind}</button>
          <button type="button" onClick={() => {
            setScheduleReview(null);
            setMessage(scheduleReview.kind === "move" ? "Move cancelled." : "Resize cancelled.");
          }}>Cancel {scheduleReview.kind}</button>
        </section>
      ) : null}
      {state === "loading" ? <div className="program-board-loading">Loading program records…</div> : (
        <div ref={scrollRef} className="program-board-scroll" data-dragging={Boolean(draggedSessionID) || undefined} onScroll={drag.queueFrame}>
          <div className="program-board-grid" style={{ "--room-count": rooms.length, "--slot-height": `${slotHeight}px` } as React.CSSProperties}>
            <div className="program-board-corner">Time</div>
            {rooms.map((room, index) => <div className="program-board-room" data-drop-room={String(room.id) === dropTarget?.roomID || undefined} key={room.id}><span style={{ background: room.color || undefined }} /><strong>{room.shortLabel}</strong><small>{room.floor}</small><div className="program-board-room-actions"><button aria-label={`Move ${room.name} left`} disabled={!canManage || index === 0 || roomOrdering || Boolean(scheduleReview)} onClick={() => void moveRoom(String(room.id), -1)} title="Move room left" type="button"><ChevronLeft aria-hidden="true" /></button><button disabled={!canManage || Boolean(scheduleReview)} aria-label={`Edit ${room.name}`} onClick={() => startEditRoom(room)} title={`Edit ${room.name}`} type="button"><Pencil aria-hidden="true" /></button><button aria-label={`Move ${room.name} right`} disabled={!canManage || index === rooms.length - 1 || roomOrdering || Boolean(scheduleReview)} onClick={() => void moveRoom(String(room.id), 1)} title="Move room right" type="button"><ChevronRight aria-hidden="true" /></button></div></div>)}
            <div className="program-board-axis" style={{ height: slots * slotHeight }}>
              {slotTimes.map((time, index) => <span key={time} data-drop-time={dropStartIndex === index || undefined} style={{ top: index * slotHeight }}>{displayTime(time)}</span>)}
            </div>
            {rooms.map((room) => (
              <div className="program-board-track" data-program-room-id={String(room.id)}
                key={room.id} style={{ height: slots * slotHeight }}>
                {slotTimes.map((time, index) => {
                  return (
                    <button
                      aria-label={`Add session in ${room.name} at ${time}`}
                      tabIndex={index === 0 ? 0 : -1}
                      onKeyDown={event => { if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return; event.preventDefault(); const cells = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(".program-board-cell"); cells?.[Math.max(0, Math.min(slots - 1, index + (event.key === "ArrowDown" ? 1 : -1)))]?.focus(); }}
                      disabled={!canManage || Boolean(scheduleReview)}
                      className="program-board-cell"
                      key={time}
                      onClick={() => startCreate(String(room.id), time)}
                      style={{ height: slotHeight, top: index * slotHeight }}
                      type="button"
                    />
                  );
                })}
                {(sessionsByRoom.get(String(room.id)) ?? []).map((session) => {
                  const sessionID = String(session.id);
                  const visualPlan = scheduleReview?.kind === "resize" ? scheduleReview : resizePreviewPlan?.error ? null : resizePreviewPlan;
                  const previewRange = visualPlan?.changes.get(sessionID);
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
                      aria-keyshortcuts={canManage ? "Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight" : undefined}
                      title={canManage ? "Drag to move. Use Shift and arrow keys to move the focused session." : undefined}
                      className="program-board-event"
                      data-dragging={draggedSessionID === sessionID || pendingMove?.sessionID === sessionID || undefined}
                      data-session-id={sessionID}
                      data-moving={moving || undefined}
                      data-manageable={canManage && !needsReload || undefined}
                      disabled={saving || movingSessionIDs.size > 0 || Boolean(scheduleReview)}
                      onClick={(event) => {
                        if (event.detail && drag.suppressClick.current) {
                          drag.suppressClick.current = false;
                          return;
                        }
                        startEdit(session);
                      }}
                      onPointerDown={(event) => drag.start(event, sessionID, canManage && !needsReload && !mutationRef.current && !resizePreview && !scheduleReview)}
                      onPointerMove={drag.move}
                      onPointerUp={(event) => {
                        const destination = drag.finish(event);
                        if (destination) void moveSession(destination.sessionID, destination.roomID, destination.time);
                      }}
                      onPointerCancel={drag.cancel}
                      onLostPointerCapture={drag.cancel}
                      onKeyDown={(event) => {
                        if (!canManage || !event.shiftKey || !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
                        event.preventDefault();
                        const currentTime = timeValue(session.startAt);
                        const column = rooms.findIndex(candidate => String(candidate.id) === String(room.id));
                        const nextColumn = column + (event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0);
                        const nextRoom = rooms[nextColumn];
                        const timeIndex = slotTimes.indexOf(currentTime);
                        const step = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
                        const nextTime = step ? (timeIndex < 0 ? undefined : slotTimes[timeIndex + step]) : currentTime;
                        if (!nextRoom || !nextTime) return;
                        const source = event.currentTarget;
                        void moveSession(sessionID, String(nextRoom.id), nextTime).then(() => {
                          requestAnimationFrame(() => {
                            if (document.activeElement !== document.body && document.activeElement !== source) return;
                            scrollRef.current?.querySelector<HTMLButtonElement>(`[data-session-id="${CSS.escape(sessionID)}"]`)?.focus();
                          });
                        });
                      }}
                      style={{ background: room.color || undefined, height, top }}
                      type="button"
                    >
                      <span className="program-board-move-grip" data-move-grip aria-hidden="true"><GripVertical /></span>
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
                    data-pending={Boolean(pendingMove)}
                    style={{
                      height: Math.max(slotHeight - 6, dropDurationSlots * slotHeight - 6),
                      top: dropStartIndex * slotHeight + 3,
                    }}
                  >
                    <span>{pendingMove ? "Saving move…" : reviewedMove ? `Proposed: ${reviewedMove.title}` : dropError || room.shortLabel}</span>
                    <span>{displayTime(dropTarget.time)}–{dropEndAt ? displayTime(timeValue(dropEndAt)) : ""} · {dropDurationSlots * 30} min</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      )}
      {draggedSessionID && draggedSession ? createPortal(
        <div className="program-board-drag-image" data-invalid={Boolean(dropError)} aria-hidden="true" ref={drag.ghostRef}>
          <strong>{draggedSession.title}</strong>
          <span>{dropStatus}</span>
        </div>,
        document.body
      ) : null}
      {form ? <ProgramDialog labelledBy="program-form-title" onClose={() => setForm(null)} busy={saving}><header><div><p>{form.id ? "Edit program record" : "New program record"}</p><h2 id="program-form-title">{form.id ? form.title : "Add a session"}</h2></div><button aria-label="Close form" disabled={saving} onClick={() => setForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={save}><label className="program-board-wide"><span>Title</span><input autoFocus onChange={(event) => setForm({ ...form, title: event.target.value })} required value={form.title} /></label><label><span>Type</span><select onChange={(event) => setForm({ ...form, sessionType: event.target.value })} value={form.sessionType}>{Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label><span>Room</span><select onChange={(event) => setForm({ ...form, room: event.target.value })} required value={form.room}>{rooms.map((value) => <option key={value.id} value={String(value.id)}>{value.name}</option>)}</select></label><label><span>Date</span><input onChange={(event) => setForm({ ...form, date: event.target.value, endDate: form.date === form.endDate ? event.target.value : form.endDate })} required type="date" value={form.date} /></label><label><span>Starts</span><input onChange={(event) => setForm({ ...form, startTime: event.target.value })} required step="1800" type="time" value={form.startTime} /></label><label><span>End date</span><input type="date" required value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} /></label><label><span>Ends</span><input onChange={(event) => setForm({ ...form, endTime: event.target.value })} required step="1800" type="time" value={form.endTime} /></label><label><span>Status</span><select onChange={(event) => setForm({ ...form, status: event.target.value })} value={form.status}><option value="published">Published</option><option value="draft">Draft</option><option value="cancelled">Cancelled</option></select></label><label className="program-board-wide"><span>Public description</span><textarea onChange={(event) => setForm({ ...form, shortDescription: event.target.value })} rows={3} value={form.shortDescription} /></label><label><span>Language</span><input onChange={(event) => setForm({ ...form, language: event.target.value })} value={form.language} /></label><label><span>Audience / affinity</span><input onChange={(event) => setForm({ ...form, audience: event.target.value })} value={form.audience} /></label><label className="program-board-wide"><span>Accessibility information</span><textarea onChange={(event) => setForm({ ...form, accessibility: event.target.value })} rows={2} value={form.accessibility} /></label><label className="program-board-wide"><span>Internal committee notes</span><textarea onChange={(event) => setForm({ ...form, internalNotes: event.target.value })} rows={2} value={form.internalNotes} /></label><label className="program-board-check"><input checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} type="checkbox" /><span>Mark as featured <small>Saved for future homepage or program spotlight sections; it does not currently change the schedule display.</small></span></label>{message ? <div role="alert" className="program-board-form-error">{message}{needsReload ? <button type="button" onClick={() => void load()}>Reload schedule</button> : null}</div> : null}<footer>{form.id ? <button className="program-board-delete" disabled={saving || needsReload} onClick={() => void remove()} type="button"><Trash2 aria-hidden="true" /> Delete</button> : <span /> }<div><button disabled={saving} onClick={() => setForm(null)} type="button">Cancel</button><button disabled={saving || needsReload} type="submit"><Save aria-hidden="true" /> {saving ? "Saving…" : "Save session"}</button></div></footer></form></ProgramDialog> : null}
      {roomForm ? <ProgramDialog labelledBy="room-form-title" onClose={() => setRoomForm(null)} busy={roomSaving}><header><div><p>{roomForm.id ? "Edit room record" : "New room record"}</p><h2 id="room-form-title">{roomForm.id ? roomForm.name : "Add a room"}</h2></div><button aria-label="Close room form" disabled={roomSaving} onClick={() => setRoomForm(null)} type="button"><X aria-hidden="true" /></button></header><form onSubmit={saveRoom}><label className="program-board-wide"><span>Full room name</span><input autoFocus onChange={(event) => setRoomForm({ ...roomForm, name: event.target.value })} required value={roomForm.name} /></label><label><span>Short grid label</span><input maxLength={30} onChange={(event) => setRoomForm({ ...roomForm, shortLabel: event.target.value })} required value={roomForm.shortLabel} /></label><label><span>Floor / area</span><input onChange={(event) => setRoomForm({ ...roomForm, floor: event.target.value })} value={roomForm.floor} /></label><label><span>Capacity</span><input min="0" onChange={(event) => setRoomForm({ ...roomForm, capacity: event.target.value })} type="number" value={roomForm.capacity} /></label><label><span>Grid order</span><input onChange={(event) => setRoomForm({ ...roomForm, displayOrder: event.target.value })} required type="number" value={roomForm.displayOrder} /></label><label><span>Room color</span><input className="program-board-color-input" onChange={(event) => setRoomForm({ ...roomForm, color: event.target.value })} type="color" value={roomForm.color} /></label><label><span>Map position X (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapX: event.target.value })} type="number" value={roomForm.mapX} /></label><label><span>Map position Y (%)</span><input max="100" min="0" onChange={(event) => setRoomForm({ ...roomForm, mapY: event.target.value })} type="number" value={roomForm.mapY} /></label><label className="program-board-wide"><span>Public directions</span><textarea onChange={(event) => setRoomForm({ ...roomForm, directions: event.target.value })} rows={2} value={roomForm.directions} /></label><label className="program-board-wide"><span>Internal room notes</span><textarea onChange={(event) => setRoomForm({ ...roomForm, notes: event.target.value })} rows={2} value={roomForm.notes} /></label><label className="program-board-check"><input checked={roomForm.accessible} onChange={(event) => setRoomForm({ ...roomForm, accessible: event.target.checked })} type="checkbox" /><span>Accessible room</span></label>{roomMessage ? <p role="alert" className="program-board-form-error">{roomMessage}</p> : null}<footer><span /><div><button disabled={roomSaving} onClick={() => setRoomForm(null)} type="button">Cancel</button><button disabled={roomSaving} type="submit"><Save aria-hidden="true" /> {roomSaving ? "Saving…" : "Save room"}</button></div></footer></form></ProgramDialog> : null}
    </main>
  );
}
