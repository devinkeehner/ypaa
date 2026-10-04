import assert from "node:assert/strict";
import test from "node:test";
import { readFile, writeFile } from "node:fs/promises";
import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate";
import type { TypedUser } from "payload";
import { syntheticTracker, workbookFixture } from "./registration-tracker-fixture";
import { parseTracker, trackerSheets, normalizeTracker } from "../lib/registration-tracker";
import { previewRegistrationImport, confirmRegistrationImport, rollbackRegistrationImport, planRegistrationImport } from "../lib/registration-import";
import { hasConfirmedRegistration } from "../lib/registration-check";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname)) throw new Error("Use the isolated registration runner.");

test("registration importer parsing, authorization, transactions, idempotence, and public lookup", { timeout: 180000 }, async (t) => {
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config; resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  const admin = await payload.create({ collection: "users", data: { email: "import-admin@example.invalid", password: "SyntheticImportPassword123!", role: "admin" } });
  const preview = (bytes = syntheticTracker()) => previewRegistrationImport(payload, admin, bytes, "Synthetic tracker.xlsx");
  const confirm = (p: Awaited<ReturnType<typeof preview>>, sources = p.plan.rows.filter((r) => r.action === "new").map((r) => r.sourceKey)) => confirmRegistrationImport(payload, admin, { id: p.id, fingerprint: p.plan.fingerprint, sources, confirmPayment: true, confirmAttendees: true, confirmScope: true });
  const count = (collection: "attendees" | "checkout-orders" | "registration-entitlements" | "breakfast-tickets" | "scholarship-contributions" | "merchandise-orders") => payload.count({ collection }).then((r) => r.totalDocs);
  await writeFile(".local-registration/mail.ndjson", "");
  try {
    await t.test("reject malformed, oversized, expanded, wrong-format, and invalid attendee/value inputs", async () => {
      assert.throws(() => parseTracker(strToU8("not an xlsx")), /readable/);
      assert.throws(() => parseTracker(new Uint8Array(2 * 1024 * 1024 + 1)), /2 MB/);
      assert.throws(() => parseTracker(zipSync({ "xl/workbook.xml": new Uint8Array(9 * 1024 * 1024) })), /expanded/);
      assert.throws(() => parseTracker(workbookFixture({ Unknown: [["no tracker"]] })), /headers/);
      assert.equal(parseTracker(syntheticTracker({ email: "bad" })).rows[0].errors.length, 1);
      assert.equal(parseTracker(syntheticTracker({ badTotal: true })).rows[0].errors.length, 1);
      const bad = trackerSheets(syntheticTracker()); bad.Registrations[1][5] = "Scholarship";
      assert.match(normalizeTracker(bad).rows[0].errors[0], /purchased registration/);
      const duplicate = trackerSheets(syntheticTracker()); duplicate.Payments.push(duplicate.Payments[1]);
      assert.match(normalizeTracker(duplicate).rows[0].errors[0], /duplicate payment/);
      const mixed = parseTracker(syntheticTracker()); assert.equal(mixed.rows[0].priceCents, 4500); assert.equal(mixed.rows[0].totalCents, 7100);
      const rich = unzipSync(syntheticTracker());
      rich["xl/worksheets/sheet1.xml"] = strToU8(strFromU8(rich["xl/worksheets/sheet1.xml"]).replace("<x:t>Synthetic Attendee</x:t>", "<x:r><x:t>Synthetic </x:t></x:r><x:r><x:t>Attendee</x:t></x:r>"));
      assert.equal(parseTracker(zipSync(rich)).rows[0].attendees[0].name, "Synthetic Attendee");
      assert.equal(mixed.rows[0].purchasedAt, "2026-10-01T16:00:00.000Z");
      assert.ok(mixed.excluded.some((r) => r.sheet === "Breakfast Tickets")); assert.ok(mixed.excluded.some((r) => r.sheet === "Manual Ledger"));
    });
    await t.test("administrators only; no public/staff audit writes; explicit confirmations required", async () => {
      await assert.rejects(previewRegistrationImport(payload, null, syntheticTracker(), "x.xlsx"), /Administrator/);
      await assert.rejects(previewRegistrationImport(payload, { ...admin, role: "viewer" } as TypedUser, syntheticTracker(), "x.xlsx"), /Administrator/);
      await assert.rejects(previewRegistrationImport(payload, { ...admin, role: "staff", contentAreas: ["registration"], accessLevel: "manage" } as TypedUser, syntheticTracker(), "x.xlsx"), /Administrator/);
      await assert.rejects(payload.create({ collection: "registration-imports", overrideAccess: false, user: admin, data: { filename: "x", fileDigest: "fake", status: "preview", createdBy: admin.id, expiresAt: new Date().toISOString(), preview: {} } }));
      const p = await preview(); assert.equal(await count("attendees"), 0);
      await assert.rejects(confirmRegistrationImport(payload, admin, { id: p.id, sources: [p.plan.rows[0].sourceKey] }), /Confirm current/);
      await assert.rejects(confirmRegistrationImport(payload, admin, { id: p.id, sources: ["fake"], fingerprint: p.plan.fingerprint, confirmPayment: true, confirmAttendees: true, confirmScope: true }), /validated/);
    });
    await t.test("real atomic import confirms public lookup; original gross retained; other products/payer/email excluded", async () => {
      const p = await preview(); assert.equal(p.plan.counts.new, 1);
      const result = await confirm(p); assert.equal(result.result!.attendees.length, 1); assert.equal(result.result!.seats.length, 1);
      assert.equal(await hasConfirmedRegistration(payload, "imported@example.invalid"), true); assert.equal(await hasConfirmedRegistration(payload, "payer@example.invalid"), false);
      assert.equal(await count("breakfast-tickets"), 0); assert.equal(await count("scholarship-contributions"), 0); assert.equal(await count("merchandise-orders"), 0);
      const order = (await payload.find({ collection: "checkout-orders" })).docs[0]; assert.equal(order.totalCents, 7100); assert.equal(order.purchaserEmail, "unknown@registration-import.invalid");
      assert.equal(await readFile(".local-registration/mail.ndjson", "utf8"), "");
      const repeated = await confirm(p); assert.equal(repeated.alreadyImported, true); assert.equal(await count("attendees"), 1);
      const next = await preview(); assert.equal(next.plan.counts.matched, 1); assert.equal(next.plan.counts.new, 0);
      await rollbackRegistrationImport(payload, admin, { id: p.id, reason: "Synthetic rollback", confirmRollback: true });
      assert.equal(await hasConfirmedRegistration(payload, "imported@example.invalid"), false);
      assert.equal((await preview()).plan.counts.conflicts, 1);
    });
    await t.test("group receipts create one named attendee and extra unassigned paid seats; cash recorded separately", async () => {
      const group = await preview(syntheticTracker({ reference: "ch_SYNTHETICGROUP", email: "group@example.invalid", quantity: 3 }));
      const result = await confirm(group); assert.equal(result.result!.attendees.length, 1); assert.equal(result.result!.seats.length, 3);
      const seats = (await payload.find({ collection: "registration-entitlements", where: { sourceKey: { like: "ch_SYNTHETICGROUP" } } })).docs;
      assert.equal(seats.filter((s) => s.status === "unassigned").length, 2); assert.equal(await hasConfirmedRegistration(payload, "group@example.invalid"), true);
      const cash = await preview(syntheticTracker({ cash: true, email: "import-cash@example.invalid" })); await confirm(cash); assert.equal(await hasConfirmedRegistration(payload, "import-cash@example.invalid"), true);
      const cashOrder = (await payload.find({ collection: "checkout-orders", where: { paymentSource: { equals: "cash" } } })).docs[0]; assert.equal(cashOrder.paymentStatus, "recorded");
    });
    await t.test("refunded existing receipts and different-source email duplicates blocked; existing corrected data preserved", async () => {
      const bytes = syntheticTracker({ reference: "ch_SYNTHETICPRESERVE", email: "preserve@example.invalid" }); const p = await preview(bytes); const result = await confirm(p);
      await payload.update({ collection: "attendees", id: result.result!.attendees[0].id, data: { attendeeName: "Corrected Synthetic", policyAcknowledgments: { status: "waived" } } });
      const matching = await preview(bytes); assert.equal(matching.plan.counts.matched, 1);
      const retained = await payload.findByID({ collection: "attendees", id: result.result!.attendees[0].id }); assert.equal(retained.attendeeName, "Corrected Synthetic"); assert.equal(retained.policyAcknowledgments!.status, "waived");
      await assert.rejects(rollbackRegistrationImport(payload, admin, { id: p.id, reason: "Changed", confirmRollback: true }), /changed/);
      assert.equal((await preview(syntheticTracker({ reference: "ch_OTHERPAYMENT", email: "preserve@example.invalid" }))).plan.counts.conflicts, 1);
      await payload.update({ collection: "checkout-orders", id: result.result!.orders[0], data: { paymentStatus: "refunded" } }); assert.equal((await preview(bytes)).plan.counts.conflicts, 1); assert.equal(await hasConfirmedRegistration(payload, "preserve@example.invalid"), false);
    });
    await t.test("CRM drift, expiry, actor mismatch and repeated source conflicts cannot bypass preview", async () => {
      const p = await preview(syntheticTracker({ reference: "ch_STALEPREVIEW", email: "stale@example.invalid" }));
      await payload.update({ collection: "registration-imports", id: p.id, data: { expiresAt: "2020-01-01T00:00:00Z" } }); await assert.rejects(confirm(p), /expired/);
      const p2 = await preview(syntheticTracker({ reference: "ch_STALEPREVIEW", email: "stale@example.invalid" }));
      const other = await payload.create({ collection: "users", data: { email: "other-admin@example.invalid", password: "OtherSyntheticPassword123!", role: "admin" } });
      await assert.rejects(confirmRegistrationImport(payload, other, { id: p2.id, fingerprint: p2.plan.fingerprint, sources: [p2.plan.rows[0].sourceKey], confirmPayment: true, confirmAttendees: true, confirmScope: true }), /administrator who reviewed/);
      await confirm(p2); await assert.rejects(confirm(p), /expired/);
      const rows = trackerSheets(syntheticTracker({ reference: "ch_DUPLICATEFILE", email: "duplicate-file@example.invalid" })); const second = trackerSheets(syntheticTracker({ reference: "ch_DUPLICATEFILEOTHER", email: "duplicate-file@example.invalid" })); rows.Registrations.push(second.Registrations[1]); rows.Payments.push(second.Payments[1]);
      const duplicate = await planRegistrationImport(payload, normalizeTracker(rows)); assert.equal(duplicate.counts.conflicts, 2);
    });
    await t.test("database failure rolls back all registration/payment/seat writes; no mail transport invoked", async () => {
      const p = await preview(syntheticTracker({ reference: "ch_INJECTEDFAILURE", email: "failure-import@example.invalid" }));
      const before = await Promise.all([count("attendees"), count("checkout-orders"), count("registration-entitlements")]);
      const original = payload.create.bind(payload); let failure = true;
      payload.create = (async (args: Parameters<typeof original>[0]) => { if (failure && args.collection === "registration-entitlements") { failure = false; throw new Error("Synthetic failure"); } return original(args); }) as typeof payload.create;
      try { await assert.rejects(confirm(p), /Synthetic failure/); } finally { payload.create = original; }
      assert.deepEqual(await Promise.all([count("attendees"), count("checkout-orders"), count("registration-entitlements")]), before);
      assert.equal(await hasConfirmedRegistration(payload, "failure-import@example.invalid"), false); await confirm(p); assert.equal(await hasConfirmedRegistration(payload, "failure-import@example.invalid"), true);
      assert.equal(await readFile(".local-registration/mail.ndjson", "utf8"), "");
    });
    await t.test("concurrent confirm clicks create only one batch and no duplicate roster; stale independent preview rejected", async () => {
      const bytes = syntheticTracker({ reference: "ch_CONCURRENTIMPORT", email: "concurrent-import@example.invalid" }); const a = await preview(bytes), b = await preview(bytes);
      const results = await Promise.allSettled([confirm(a), confirm(a)]); assert.ok(results.some((r) => r.status === "fulfilled"));
      assert.equal((await payload.count({ collection: "attendees", where: { attendeeEmail: { equals: "concurrent-import@example.invalid" } } })).totalDocs, 1);
      await assert.rejects(confirm(b), /changed since/);
    });
    await t.test("authenticated API denies cross-site/public requests and accepts safe upload/history", async () => {
      const { token } = await payload.login({ collection: "users", data: { email: admin.email, password: "SyntheticImportPassword123!" } });
      const { POST, GET } = await import("../app/(payload)/api/admin/registration-import/route");
      const headers = { origin: "http://127.0.0.1:3029", authorization: `JWT ${token}` };
      const file = syntheticTracker({ reference: "ch_ROUTEUPLOAD", email: "route-import@example.invalid" }), form = new FormData(); form.set("file", new File([file], "Synthetic.xlsx"));
      assert.equal((await POST(new Request("http://127.0.0.1:3029/api/admin/registration-import", { method: "POST", headers: { ...headers, origin: "https://evil.invalid" }, body: form }))).status, 403);
      assert.equal((await GET(new Request("http://127.0.0.1:3029/api/admin/registration-import"))).status, 403);
      assert.equal((await POST(new Request("http://127.0.0.1:3029/api/admin/registration-import", { method: "POST", headers, body: form }))).status, 200);
      assert.equal((await GET(new Request("http://127.0.0.1:3029/api/admin/registration-import", { headers }))).status, 200);
    });
  } finally { await payload.db.connection.db!.dropDatabase(); await payload.destroy(); }
});
