import assert from "node:assert/strict";
import test from "node:test";
import { planResize } from "../lib/program-board-planning";
import { validateSchedule } from "../lib/program-schedule";
import type { ProgramSession } from "../components/site/program-types";
const time = (hour: string) => `2026-12-31T${hour}:00-05:00`;
const session = (id: string, start: string, end: string): ProgramSession => ({ id, title: id, slug: id, sessionType: "panel", room: { id: "room", name: "Room", shortLabel: "Room", displayOrder: 0 }, startAt: time(start), endAt: time(end) });

test("backward resize follows the entire chain, including the original boundary", () => {
  const records = [session("C", "09:00", "09:30"), session("B", "09:30", "10:00"), session("A", "10:00", "11:00")];
  const plan = planResize(records, records[2], "start", -1);
  assert.equal(plan.error, undefined);
  assert.equal(plan.changes.size, 3);
  assert.equal(plan.changes.get("C")?.startAt, new Date(time("08:30")).toISOString());
  assert.equal(plan.changes.get("B")?.endAt, new Date(time("09:30")).toISOString());
});
test("forward push preserves short neighbors and reports all affected records", () => {
  const records = [session("A", "09:00", "10:00"), session("B", "10:00", "10:30"), session("C", "10:30", "11:00")];
  const plan = planResize(records, records[0], "end", 1);
  assert.equal(plan.error, undefined);
  assert.equal(plan.changes.size, 3);
  assert.equal(plan.changes.get("C")?.endAt, new Date(time("11:30")).toISOString());
});
test("resize refuses to push a chain beyond board bounds", () => {
  const records = [session("B", "08:00", "08:30"), session("A", "08:30", "09:30")];
  assert.match(planResize(records, records[1], "start", -1).error || "", /no more room/);
});
test("server validation accepts adjacency and rejects contained or partial overlaps", () => {
  const a = { ...session("A", "09:00", "10:00"), id: "A" };
  const b = { ...session("B", "10:00", "11:00"), id: "B" };
  assert.doesNotThrow(() => validateSchedule([a, b], new Set(["A"])));
  assert.throws(() => validateSchedule([a, { ...b, startAt: time("09:30") }], new Set(["B"])), /overlaps/);
  assert.throws(() => validateSchedule([a, { ...b, startAt: time("08:00"), endAt: time("12:00") }], new Set(["A"])), /overlaps/);
  assert.doesNotThrow(() => validateSchedule([a, { ...b, room: "other", startAt: time("09:30") }], new Set(["B"])));
});
test("invalid and reversed dates fail before persistence", () => {
  const a = { ...session("A", "10:00", "09:00"), id: "A" };
  assert.throws(() => validateSchedule([a], new Set(["A"])), /End time/);
  assert.throws(() => validateSchedule([{ ...a, endAt: "invalid" }], new Set(["A"])), /End time/);
});
