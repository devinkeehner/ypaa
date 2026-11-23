import assert from "node:assert/strict";
import test from "node:test";
import type { Access, CollectionBeforeValidateHook } from "payload";

import { Attendees } from "../collections/Attendees";
import { HistoricalReceipts } from "../collections/HistoricalReceipts";
import { withViewerAccess } from "../lib/crm-access";

const beforeValidate = Attendees.hooks!.beforeValidate![0];

function validateAttendee(data: Record<string, unknown>, originalDoc?: Record<string, unknown>) {
  return beforeValidate({ data, originalDoc } as Parameters<CollectionBeforeValidateHook>[0]);
}

test("historical yes, no, and unanswered stay distinct while legacy checkboxes synchronize", async () => {
  const attendee = await validateAttendee({
    dataOrigin: "historical_import",
    interpretationNeededAnswer: "yes",
    mobilityAccessibilityAnswer: "no",
    willingToServeAnswer: "unanswered",
  });
  assert.deepEqual(attendee, {
    dataOrigin: "historical_import",
    interpretationNeededAnswer: "yes",
    interpretationNeeded: true,
    mobilityAccessibilityAnswer: "no",
    mobilityAccessibility: false,
    willingToServeAnswer: "unanswered",
    willingToServe: false,
  });
  assert.deepEqual(await validateAttendee({ interpretationNeededAnswer: "unanswered" }, attendee), {
    interpretationNeededAnswer: "unanswered",
    interpretationNeeded: false,
  });
  assert.deepEqual(await validateAttendee({ interpretationNeeded: true }, { dataOrigin: "live_checkout" }), {
    interpretationNeeded: true,
  });
});

test("historical receipt audit is visible only to administrators and writes require the server importer", async () => {
  const access = withViewerAccess(HistoricalReceipts).access!;
  const request = (user?: Record<string, unknown>) => ({ req: { user } }) as unknown as Parameters<Access>[0];
  const admin = request({ collection: "users", role: "admin" });
  assert.equal(await access.admin!(admin), true);
  assert.equal(await access.read!(admin), true);
  for (const role of ["viewer", "merch", "staff"]) {
    const req = request({ collection: "users", role, contentAreas: ["registration"], accessLevel: "manage" });
    assert.equal(await access.admin!(req), false);
    assert.equal(await access.read!(req), false);
  }
  assert.equal(await access.read!(request()), false);
  for (const action of ["create", "update", "delete"] as const) {
    assert.equal(await access[action]!(admin), false);
  }
});
