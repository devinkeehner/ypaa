import assert from "node:assert/strict";
import test from "node:test";
import { buildConfig, getPayload, type TypedUser } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { ProgramSessions } from "../collections/ProgramSessions";
import { Rooms } from "../collections/Rooms";
import { mutateProgram } from "../lib/program-schedule";

// Explicit fresh local database only. Never loads the application's .env/config.
const uri = process.env.PROGRAM_TEST_DATABASE_URI;
test("schedule operations are atomic, revision guarded, and serialized per room", { skip: !uri }, async t => {
  const url = new URL(uri!);
  assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(url.hostname));
  assert.match(url.pathname, /^\/program_editor_test_\d+$/);
  const payload = await getPayload({ config: buildConfig({
    secret: "program-editor-synthetic-test-secret-only",
    db: mongooseAdapter({ url: uri! }),
    typescript: { autoGenerate: false },
    admin: { user: "users" },
    collections: [
      { slug: "users", auth: true, fields: [{ name: "role", type: "select", options: ["admin", "viewer"], defaultValue: "admin" }] },
      Rooms, ProgramSessions,
      { slug: "media", upload: { disableLocalStorage: true }, fields: [] },
    ],
  }) });
  try {
    // Fresh-database index creation must finish before starting transactional seeds.
    await Promise.all(Object.values(payload.db.collections).map(model => model.init()));
    assert.equal((await payload.find({ collection: "program-sessions", limit: 1 })).totalDocs, 0, "Use a fresh synthetic database");
    const account = await payload.create({ collection: "users", data: { email: "program-test@example.invalid", password: "synthetic-password-only", role: "admin" } });
    const user = { ...account, collection: "users" } as TypedUser;
    const room = await payload.create({ collection: "rooms", data: { name: "Synthetic Room", shortLabel: "Test", displayOrder: 0 } });
    const time = (hour: string) => `2026-12-31T${hour}:00-05:00`;
    const create = async (title: string, start: string, end: string) => (await mutateProgram(payload, user, { action: "create", data: { title, slug: title, room: room.id, sessionType: "panel", startAt: time(start), endAt: time(end), language: "English", status: "draft", internalNotes: "Keep me" } })).docs[0];
    const a = await create("a", "09:00", "10:00"), b = await create("b", "10:00", "11:30");
    const change = (doc: typeof a, data: Record<string, unknown>) => ({ id: doc.id, expectedUpdatedAt: doc.updatedAt, expectedRevision: doc.scheduleRevision || 0, data });
    await t.test("second write failure rolls back target and neighbor", async () => {
      const update = payload.update.bind(payload);
      payload.update = (async (args: Parameters<typeof payload.update>[0]) => {
        if (args.collection === "program-sessions" && "id" in args && args.id === b.id) throw new Error("Injected second-write failure");
        return update(args);
      }) as typeof payload.update;
      try { await assert.rejects(mutateProgram(payload, user, { action: "update", changes: [change(a, { endAt: time("10:30") }), change(b, { startAt: time("10:30") })] }), /Injected/); }
      finally { payload.update = update; }
      assert.equal((await payload.findByID({ collection: "program-sessions", id: a.id })).endAt, a.endAt);
      assert.equal((await payload.findByID({ collection: "program-sessions", id: b.id })).startAt, b.startAt);
    });
    await t.test("batch succeeds and stale edit/undo cannot overwrite it", async () => {
      const result = await mutateProgram(payload, user, { action: "update", changes: [change(a, { endAt: time("10:30") }), change(b, { startAt: time("10:30") })] });
      assert.equal(result.docs.length, 2);
      assert.equal(result.docs[0].internalNotes, "Keep me");
      await assert.rejects(mutateProgram(payload, user, { action: "update", changes: [change(a, { title: "stale" })] }), /changed since/);
    });
    await t.test("two different cards cannot concurrently occupy one empty slot", async () => {
      const c = await create("c", "12:00", "13:00"), d = await create("d", "13:00", "14:00");
      const results = await Promise.allSettled([c, d].map(doc => mutateProgram(payload, user, { action: "update", changes: [change(doc, { startAt: time("15:00"), endAt: time("16:00") })] })));
      assert.equal(results.filter(result => result.status === "fulfilled").length, 1);
      const occupied = await payload.find({ collection: "program-sessions", where: { startAt: { equals: time("15:00") } } });
      assert.equal(occupied.totalDocs, 1);
    });
    await t.test("direct collection edits enforce overlaps and increment revision", async () => {
      const fresh = await payload.findByID({ collection: "program-sessions", id: a.id });
      const edited = await payload.update({ collection: "program-sessions", id: a.id, data: { title: "New title" }, user, overrideAccess: false });
      assert.equal(edited.scheduleRevision, (fresh.scheduleRevision || 0) + 1);
      await assert.rejects(payload.update({ collection: "program-sessions", id: a.id, data: { endAt: time("11:00") }, user, overrideAccess: false }), /overlaps/);
      await assert.rejects(mutateProgram(payload, { ...user, role: "viewer" } as TypedUser, { action: "delete", changes: [change(edited, {})] }), /permission/);
    });
    await t.test("unavailable transactions fail closed before writing", async () => {
      const begin = payload.db.beginTransaction;
      payload.db.beginTransaction = async () => null;
      try { await assert.rejects(create("blocked", "17:00", "18:00"), /transactions/); }
      finally { payload.db.beginTransaction = begin; }
    });
  } finally { await payload.destroy(); }
});
