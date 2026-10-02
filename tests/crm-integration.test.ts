import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";
import { saveCRMCorrection } from "../lib/crm-correction";
import { orderFromStripeMetadata, recordRegistrationOrder, type RecordContext } from "../lib/registration-records";

// Always use a fresh, explicitly named local database. Never load DATABASE_URI from an env file.
const database = `crm_test_${randomUUID().replaceAll("-", "")}`;
const uri = `mongodb://127.0.0.1:27018/${database}?replicaSet=crmDemo`;
process.env.DATABASE_URI = uri;
process.env.PAYLOAD_SECRET = randomUUID();
process.env.ENABLE_R2 = "false";
process.env.PAYLOAD_ENABLE_MCP = "false";

test("CRM data integrity against a real MongoDB transaction", { timeout: 180000 }, async (t) => {
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config;
  resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  const mongoose = (await import("mongoose")).default;
  const connection = mongoose.connections.find((connection) => connection.name === database)!;
  await Promise.all(Object.values(connection.models).map((model) => model.init()));
  try {
    const admin = await payload.create({ collection: "users", data: { email: "admin@example.invalid", password: randomUUID(), role: "admin" } });
    const user = { ...admin, collection: "users" as const };
    const metadata = { attendee_name: "Original Attendee", attendee_email: "shared@example.invalid", self_registration_quantity: "1", breakfast_tickets: "Breakfast - Saturday x1" };
    const order = orderFromStripeMetadata(metadata, { name: "Original Payer", email: "payer@example.invalid" });
    const context: RecordContext = { sourceKey: "stripe:test-original", paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "stripe_backfill", purchasedAt: "2026-08-23T12:00:00Z", stripeCheckoutSessionId: "cs_crm_test", stripePaymentIntentId: "pi_crm_test", rawMetadata: metadata };
    await recordRegistrationOrder(payload, order, context);
    const roster = () => payload.find({ collection: "attendees", depth: 0, pagination: false });
    const seats = () => payload.find({ collection: "registration-entitlements", depth: 0, pagination: false });
    const tickets = () => payload.find({ collection: "breakfast-tickets", depth: 0, pagination: false });
    let registration = (await roster()).docs[0];
    let entitlement = (await seats()).docs[0];
    const input = () => ({ registrationID: registration.id, entitlementID: entitlement.id, expectedUpdatedAt: registration.updatedAt, expectedEntitlementUpdatedAt: entitlement.updatedAt, resolution: "same_person_name_variation", reason: "Test canonical name", contact: { displayName: "Corrected Attendee", email: "corrected@example.invalid", state: "CT" } });
    await t.test("correction commits its audit record and does not rewrite payment", async () => {
      await saveCRMCorrection(payload, user, input());
      registration = (await roster()).docs[0]; entitlement = (await seats()).docs[0];
      assert.equal(registration.attendeeName, "Corrected Attendee");
      assert.equal((await payload.find({ collection: "registration-corrections" })).totalDocs, 1);
      assert.equal((await payload.find({ collection: "checkout-orders" })).docs[0].purchaserName, "Original Payer");
    });
    await t.test("audit failure rolls back contact, registration, ticket, and entitlement writes", async () => {
      const before = { roster: (await roster()).docs, seats: (await seats()).docs, tickets: (await tickets()).docs, contacts: (await payload.find({ collection: "contacts", depth: 0, pagination: false })).docs };
      const create = payload.create.bind(payload);
      payload.create = (async (args: Parameters<typeof payload.create>[0]) => { if (args.collection === "registration-corrections") throw new Error("Injected audit failure"); return create(args); }) as typeof payload.create;
      try { await assert.rejects(saveCRMCorrection(payload, user, { ...input(), contact: { displayName: "Must Roll Back", email: "rollback@example.invalid" } }), /Injected audit failure/); }
      finally { payload.create = create; }
      assert.deepEqual({ roster: (await roster()).docs, seats: (await seats()).docs, tickets: (await tickets()).docs, contacts: (await payload.find({ collection: "contacts", depth: 0, pagination: false })).docs }, before);
    });
    await t.test("stale forms and viewers cannot save corrections", async () => {
      await assert.rejects(saveCRMCorrection(payload, user, { ...input(), expectedUpdatedAt: "stale" }), /changed since/);
      await assert.rejects(saveCRMCorrection(payload, { ...user, role: "viewer" }, input()), /Administrator access/);
      await assert.rejects(payload.update({ collection: "contacts", id: String(registration.contact), data: { displayName: "Viewer edit" }, user: { ...user, role: "viewer" }, overrideAccess: false }));
      await assert.rejects(payload.update({ collection: "users", id: admin.id, data: { role: "admin" }, user: { ...user, role: "viewer" }, overrideAccess: false }));
    });
    await t.test("repeat imports preserve corrections, check-in, and used breakfast tickets", async () => {
      await payload.update({ collection: "attendees", id: registration.id, data: { attendanceStatus: "checked_in", notes: "Keep this note" } });
      await payload.update({ collection: "breakfast-tickets", id: (await tickets()).docs[0].id, data: { status: "used" } });
      const result = await recordRegistrationOrder(payload, order, { ...context, sourceKey: "stripe:webhook-alias" });
      assert.equal(result.attendees.created + result.entitlements.created + result.breakfastTickets.created + result.checkoutOrders.created, 0);
      registration = (await roster()).docs[0]; entitlement = (await seats()).docs[0];
      assert.equal(registration.attendeeName, "Corrected Attendee");
      assert.equal(registration.attendanceStatus, "checked_in");
      assert.equal(registration.notes, "Keep this note");
      assert.equal((await tickets()).docs[0].status, "used");
      assert.equal(entitlement.assignmentNote, "Test canonical name");
    });
    await t.test("new attendees sharing email get separate roster records", async () => {
      const second = structuredClone(order); second.attendee.name = "Different Person";
      await recordRegistrationOrder(payload, second, { ...context, sourceKey: "stripe:second", stripeCheckoutSessionId: "cs_second", stripePaymentIntentId: "pi_second", dedupeAttendeesByEmail: true });
      assert.equal((await roster()).totalDocs, 2);
    });
    await t.test("split seat keeps the original person and survives another import", async () => {
      const secondSeat = (await seats()).docs.find((seat) => seat.id !== entitlement.id)!;
      await payload.update({ collection: "registration-entitlements", id: secondSeat.id, data: { registration: registration.id } });
      registration = await payload.findByID({ collection: "attendees", id: registration.id, depth: 0 });
      entitlement = await payload.findByID({ collection: "registration-entitlements", id: secondSeat.id, depth: 0 });
      const result = await saveCRMCorrection(payload, user, { ...input(), resolution: "attendee_reassigned", mode: "new", contact: { displayName: "Split Attendee", email: "split@example.invalid", state: "CT" } });
      assert.equal(result.split, true);
      const second = structuredClone(order); second.attendee.name = "Different Person";
      await recordRegistrationOrder(payload, second, { ...context, sourceKey: "stripe:second", stripeCheckoutSessionId: "cs_second", stripePaymentIntentId: "pi_second" });
      const assigned = await payload.findByID({ collection: "attendees", id: result.registrationID });
      assert.equal(assigned.attendeeName, "Split Attendee");
      assert.equal(assigned.policyAcknowledgments?.status, "pending");
      assert.equal((await payload.findByID({ collection: "attendees", id: registration.id })).attendeeName, "Corrected Attendee");
    });
  } finally {
    await payload.destroy();
    const cleanup = new MongoClient(uri);
    try { await cleanup.connect(); assert.match(database, /^crm_test_[a-f0-9]{32}$/); await cleanup.db(database).dropDatabase(); }
    finally { await cleanup.close(); }
  }
});
