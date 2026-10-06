import { APIError, createLocalReq, type Payload, type PayloadRequest, type TypedUser } from "payload";
import type { ProgramSession as StoredSession } from "../payload-types";
import { canAccessArea } from "./crm-access";

export const relationID = (value: unknown): string => typeof value === "string" || typeof value === "number" ? String(value) : value && typeof value === "object" && "id" in value ? String(value.id) : "";
type ScheduleRecord = { id: string; title?: string; room: unknown; startAt: string; endAt: string; updatedAt?: string; scheduleRevision?: number | null };
export type ScheduleChange = { id: string; expectedUpdatedAt: string; expectedRevision: number; data?: Record<string, unknown> };
const validatedRequests = new WeakSet<PayloadRequest>();
const lockedRooms = new WeakMap<PayloadRequest, Set<string>>();
function fail(message: string, status = 400): never { throw new APIError(message, status); }

export function validateSchedule(records: ScheduleRecord[], touched: Set<string>) {
  for (const record of records) {
    if (!touched.has(record.id)) continue;
    if (!Number.isFinite(Date.parse(record.startAt)) || !Number.isFinite(Date.parse(record.endAt)) || Date.parse(record.endAt) <= Date.parse(record.startAt)) fail("End time must be later than start time.");
    for (const other of records) {
      if (record.id !== other.id && relationID(record.room) === relationID(other.room) && Date.parse(record.startAt) < Date.parse(other.endAt) && Date.parse(record.endAt) > Date.parse(other.startAt)) fail(`That overlaps “${other.title || "another session"}” in the same room.`, 409);
    }
  }
}

// Every schedule writer touches the same room document in its transaction. This
// prevents write skew when two users move different sessions into an empty slot.
async function lockRooms(req: PayloadRequest, ids: string[]) {
  if (await req.transactionID == null) fail("Schedule changes require database transactions. No changes were saved.", 503);
  const locked = lockedRooms.get(req) || new Set<string>();
  lockedRooms.set(req, locked);
  for (const id of [...new Set(ids)].filter(Boolean).sort()) {
    if (locked.has(id)) continue;
    const room = await req.payload.findByID({ collection: "rooms", id, depth: 0, req, overrideAccess: false });
    await req.payload.db.updateOne({ collection: "rooms", id, req, data: { updatedAt: new Date(Math.max(Date.now(), Date.parse(room.updatedAt) + 1)).toISOString() } });
    locked.add(id);
  }
}

export async function guardProgramWrite({ data, originalDoc, req }: { data: Record<string, unknown>; originalDoc?: ScheduleRecord; req: PayloadRequest }) {
  data.scheduleRevision = (originalDoc?.scheduleRevision || 0) + 1;
  if (validatedRequests.has(req)) return data;
  const candidate = { ...originalDoc, ...data, id: originalDoc?.id || "new-session" } as ScheduleRecord;
  await lockRooms(req, [relationID(originalDoc?.room), relationID(candidate.room)]);
  const records = await req.payload.find({ collection: "program-sessions", pagination: false, depth: 0, overrideAccess: true, req, where: { room: { equals: relationID(candidate.room) } } });
  validateSchedule([...records.docs.filter(doc => doc.id !== candidate.id), candidate], new Set([candidate.id]));
  return data;
}

export async function guardProgramDelete({ id, req }: { id: string | number; req: PayloadRequest }) {
  if (validatedRequests.has(req)) return;
  const doc = await req.payload.findByID({ collection: "program-sessions", id, req, depth: 0, overrideAccess: false });
  await lockRooms(req, [relationID(doc.room)]);
}

const editable = new Set(["title", "slug", "sessionType", "startAt", "endAt", "room", "shortDescription", "language", "audience", "accessibility", "status", "featured", "internalNotes"]);
function cleanData(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("Invalid session data.");
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).filter(([key]) => editable.has(key)));
}

export async function mutateProgram(payload: Payload, user: TypedUser | null, input: Record<string, unknown>) {
  if (!canAccessArea(user, "program", true)) fail("Program management permission is required.", 403);
  const action = input.action;
  if (!["update", "create", "delete"].includes(String(action))) fail("Invalid schedule operation.");
  const changes = action === "create" ? [] : input.changes as ScheduleChange[];
  if (action !== "create" && (!Array.isArray(changes) || !changes.length || changes.length > 100 || new Set(changes.map(c => c?.id)).size !== changes.length)) fail("Choose between 1 and 100 distinct sessions.");
  if (action === "delete" && changes.length !== 1) fail("Delete one session at a time.");
  for (const change of changes) if (!change || typeof change.id !== "string" || typeof change.expectedUpdatedAt !== "string" || !Number.isSafeInteger(change.expectedRevision) || change.expectedRevision < 0) fail("Reload the schedule before saving.", 409);
  const data = action === "create" ? cleanData(input.data) : null;
  const req = await createLocalReq({ user: user! }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) fail("Schedule changes require database transactions. No changes were saved.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: false, depth: 0 } as const;
  try {
    const originals: StoredSession[] = [];
    for (const change of changes) {
      const doc = await payload.findByID({ ...options, collection: "program-sessions", id: change.id });
      if (doc.updatedAt !== change.expectedUpdatedAt || (doc.scheduleRevision || 0) !== change.expectedRevision) fail("A session changed since you loaded it. Your edits are preserved; close and reopen the session to review the latest version before saving.", 409);
      originals.push(doc);
    }
    const roomIDs = [...originals.map(doc => relationID(doc.room)), ...changes.map(c => relationID(c.data?.room)), relationID(data?.room)].filter(Boolean);
    await lockRooms(req, roomIDs);
    const existing = await payload.find({ ...options, collection: "program-sessions", pagination: false, where: { room: { in: roomIDs } } });
    const touched = new Set(changes.map(c => c.id));
    const next = existing.docs.filter(doc => !touched.has(doc.id)) as ScheduleRecord[];
    const updates = changes.map((change, i) => ({ ...originals[i], ...(action === "update" ? cleanData(change.data) : {}) }));
    if (action === "update") next.push(...updates);
    if (action === "create") { next.push({ ...data, id: "new-session" } as ScheduleRecord); touched.add("new-session"); }
    validateSchedule(next, touched);
    validatedRequests.add(req);
    const docs = [];
    if (action === "create") docs.push(await payload.create({ ...options, collection: "program-sessions", data: data as never }));
    else if (action === "delete") await payload.delete({ ...options, collection: "program-sessions", id: changes[0].id });
    else for (const change of changes) docs.push(await payload.update({ ...options, collection: "program-sessions", id: change.id, data: cleanData(change.data) }));
    await payload.db.commitTransaction(transactionID);
    return { docs };
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  } finally {
    validatedRequests.delete(req);
    lockedRooms.delete(req);
  }
}
