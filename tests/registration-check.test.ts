import assert from "node:assert/strict";
import test from "node:test";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { MongoClient } from "mongodb";
import { seedRegistrationTest } from "../scripts/registration-test-seed";
import { findConfirmedRegistrations, hasConfirmedRegistration, claimPublicRequest, checkRequestIP, normalizeCheckEmail, validCheckEmail } from "../lib/registration-check";
import { pageLayoutToPuckData, puckDataToLayout } from "../puck/page-data";

const database = new URL(process.env.DATABASE_URI || "").pathname.slice(1);
if (!/^ypaa_registration_test_[a-z0-9]+$/.test(database) || new URL(process.env.DATABASE_URI!).hostname !== "127.0.0.1") throw new Error("Use npm run test:registration to select a fresh synthetic database.");

test("registration check with real MongoDB, Payload records, route and captured Resend mail", { timeout: 180000 }, async (t) => {
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config; resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  const db = payload.db.connection.db!;
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  await mkdir(".local-registration", { recursive: true });
  await writeFile(".local-registration/mail.ndjson", "");
  const mail = async () => (await readFile(".local-registration/mail.ndjson", "utf8")).split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const clearLimits = () => db.collection("_registration_check_limits").deleteMany({});
  const { POST } = await import("../app/(payload)/api/registration-check/route");
  const request = (email: string, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) => new Request("http://127.0.0.1:3029/api/registration-check", { method: "POST", headers: { origin: "http://127.0.0.1:3029", "content-type": "application/json", ...headers }, body: JSON.stringify({ mode: "check", email, startedAt: Date.now() - 2000, ...extra }) });
  try {
    await seedRegistrationTest(payload);
    await t.test("paid, cash and case/whitespace normalization; pending/refunded/cancelled/payer/missing rejected", async () => {
      assert.equal(normalizeCheckEmail(" PAID@EXAMPLE.INVALID "), "paid@example.invalid");
      assert.equal(validCheckEmail("a\nb@example.invalid"), false);
      for (const [email, expected] of [["paid@example.invalid", true], ["cash@example.invalid", true], ["missing@example.invalid", false], ["pending@example.invalid", false], ["refunded@example.invalid", false], ["cancelled@example.invalid", false], ["payer@example.invalid", false]] as const) assert.equal(await hasConfirmedRegistration(payload, email), expected, email);
      const paid = (await payload.find({ collection: "attendees", where: { attendeeEmail: { equals: "paid@example.invalid" } } })).docs[0];
      await payload.update({ collection: "attendees", id: paid.id, data: { attendeeEmail: "PAID@EXAMPLE.INVALID" } });
      assert.equal(await hasConfirmedRegistration(payload, "paid@example.invalid"), true);
    });
    await t.test("positive and negative return identical public JSON; result differs only in captured email", async () => {
      await clearLimits();
      const positive = await POST(request(" PAID@EXAMPLE.INVALID ")); const negative = await POST(request("missing@example.invalid"));
      assert.equal(positive.status, 200); assert.equal(negative.status, 200);
      assert.deepEqual(await positive.json(), await negative.json());
      const messages = await mail(); assert.equal(messages.length, 2);
      assert.equal(messages[0].to, "paid@example.invalid"); assert.match(messages[0].text, /registration is confirmed/);
      assert.match(messages[1].text, /No confirmed registration found/);
      assert.match(messages[1].text, /does not mean you need to pay again/);
      assert.equal(messages[0].from, "NECYPAA Test <sender@example.invalid>");
    });
    await t.test("all matching registrations appear in one private email; public response stays generic and HTML is escaped", async () => {
      const paid = (await payload.find({ collection: "attendees", where: { attendeeEmail: { like: "paid@example.invalid" } }, depth: 0 })).docs[0];
      const second = await payload.create({ collection: "attendees", data: { sourceKey: "synthetic:duplicate", attendanceStatus: "expected", attendanceBasis: "manual_expected", policyAcknowledgments: { status: "pending" }, registrationPriceCents: 4000, paymentSource: "manual", dataOrigin: "manual", attendeeName: "Second <Private> & Name", attendeeEmail: "paid@example.invalid", state: "CT", purchaserName: "Private Payer", purchaserEmail: "payer@example.invalid", purchasedAt: "2026-10-01T12:00:00Z", paymentStatus: "paid", notes: "Private staff notes" } });
      const matches = await findConfirmedRegistrations(payload, "paid@example.invalid");
      assert.deepEqual(matches.map((r) => r.attendeeName).sort(), ["Paid Synthetic", "Second <Private> & Name"].sort());
      assert.ok(matches.every((r) => Object.keys(r).join() === "attendeeName"));
      await clearLimits(); const before = (await mail()).length;
      const positive = await POST(request("paid@example.invalid")), negative = await POST(request("missing@example.invalid"));
      const publicResult = await positive.json(); assert.deepEqual(publicResult, await negative.json());
      assert.doesNotMatch(JSON.stringify(publicResult), /Paid Synthetic|Private|registrations are|2 confirmed/);
      const messages = (await mail()).slice(before); assert.equal(messages.filter((m) => m.to === "paid@example.invalid").length, 1);
      const sent = messages[0]; assert.match(sent.text, /2 confirmed NECYPAA XXXVI registrations/); assert.match(sent.text, /Paid Synthetic — Confirmed/); assert.match(sent.text, /Second <Private> & Name — Confirmed/);
      assert.equal((sent.html.match(/<li>/g) || []).length, 2); assert.match(sent.html, /Second &lt;Private&gt; &amp; Name/); assert.doesNotMatch(sent.html, /<Private>/);
      for (const privateValue of [paid.id, second.id, "Private Payer", "payer@example.invalid", "Private staff notes", "synthetic:duplicate"]) assert.ok(!sent.text.includes(privateValue) && !sent.html.includes(privateValue));
      assert.equal((await POST(request("paid@example.invalid"))).status, 200); assert.equal((await mail()).length, before + 2);
    });
    await t.test("shared-email invalid records do not appear in the private confirmed list", async () => {
      const original = (await payload.find({ collection: "attendees", where: { attendeeEmail: { like: "paid@example.invalid" } }, depth: 0 })).docs[0];
      for (const paymentStatus of ["pending", "refunded", "disputed", "voided"] as const) await payload.create({ collection: "attendees", data: { ...original, id: undefined, sourceKey: `synthetic:invalid:${paymentStatus}`, checkoutOrder: undefined, entitlement: undefined, attendeeName: `Invalid ${paymentStatus}`, attendeeEmail: "paid@example.invalid", paymentStatus } });
      await payload.create({ collection: "attendees", data: { ...original, id: undefined, sourceKey: "synthetic:invalid:cancelled", checkoutOrder: undefined, entitlement: undefined, attendeeName: "Invalid cancelled", attendeeEmail: "paid@example.invalid", attendanceStatus: "cancelled", paymentStatus: "paid" } });
      const refunded = (await payload.find({ collection: "attendees", where: { attendeeEmail: { equals: "refunded@example.invalid" } }, depth: 0 })).docs[0];
      await payload.update({ collection: "attendees", id: refunded.id, data: { attendeeEmail: "paid@example.invalid" } });
      assert.equal((await findConfirmedRegistrations(payload, "paid@example.invalid")).length, 2);
      await clearLimits(); const before = (await mail()).length;
      assert.equal((await POST(request("paid@example.invalid"))).status, 200);
      assert.doesNotMatch((await mail())[before].text, /Invalid|Refunded Synthetic/);
    });
    await t.test("invalid linked seats and payments are omitted even when another registration shares the email", async () => {
      const original = (await payload.find({ collection: "attendees", where: { attendeeEmail: { equals: "cash@example.invalid" } }, depth: 0 })).docs[0];
      const orderId = typeof original.checkoutOrder === "string" ? original.checkoutOrder : original.checkoutOrder!.id;
      const seatId = typeof original.entitlement === "string" ? original.entitlement : original.entitlement!.id;
      await payload.update({ collection: "attendees", id: original.id, data: { attendeeEmail: "paid@example.invalid" } });
      for (const status of ["unassigned", "refunded", "voided"] as const) {
        await payload.update({ collection: "registration-entitlements", id: seatId, data: { status } });
        assert.equal((await findConfirmedRegistrations(payload, "paid@example.invalid")).length, 2, status);
      }
      await payload.update({ collection: "registration-entitlements", id: seatId, data: { status: "assigned", registration: (await payload.find({ collection: "attendees", where: { attendeeName: { equals: "Paid Synthetic" } } })).docs[0].id } });
      assert.equal((await findConfirmedRegistrations(payload, "paid@example.invalid")).length, 2);
      await payload.update({ collection: "registration-entitlements", id: seatId, data: { status: "redeemed", registration: original.id } });
      assert.equal((await findConfirmedRegistrations(payload, "paid@example.invalid")).length, 3);
      for (const paymentStatus of ["refunded", "disputed", "voided"] as const) {
        await payload.update({ collection: "checkout-orders", id: orderId, data: { paymentStatus } });
        assert.equal((await findConfirmedRegistrations(payload, "paid@example.invalid")).length, 2, paymentStatus);
      }
      await payload.update({ collection: "checkout-orders", id: orderId, data: { paymentStatus: "recorded" } });
      await payload.update({ collection: "attendees", id: original.id, data: { attendeeEmail: "cash@example.invalid" } });
    });
    await t.test("candidate overflow fails closed without a partial confirmation email", async () => {
      const original = payload.find.bind(payload); const before = (await mail()).length;
      payload.find = (async (args: Parameters<typeof original>[0]) => args.collection === "attendees" ? { docs: [], hasNextPage: true } : original(args)) as typeof payload.find;
      try { await clearLimits(); assert.equal((await POST(request("overflow@example.invalid"))).status, 503); assert.equal((await mail()).length, before); }
      finally { payload.find = original; }
    });
    await t.test("unpaid statuses and voided entitlements cannot confirm", async () => {
      const cash = (await payload.find({ collection: "attendees", where: { attendeeEmail: { equals: "cash@example.invalid" } }, depth: 0 })).docs[0];
      const id = typeof cash.entitlement === "string" ? cash.entitlement : cash.entitlement!.id;
      await payload.update({ collection: "registration-entitlements", id, data: { status: "voided" } });
      assert.equal(await hasConfirmedRegistration(payload, "cash@example.invalid"), false);
    });
    await t.test("concurrent duplicate requests send only once; limits survive calls and fail closed", async () => {
      await clearLimits(); const before = (await mail()).length;
      const results = await Promise.all(Array.from({ length: 4 }, () => POST(request("duplicate@example.invalid"))));
      assert.ok(results.every((result) => result.status === 200)); assert.equal((await mail()).length - before, 1);
      await clearLimits();
      const claims = await Promise.all(Array.from({ length: 12 }, (_, index) => claimPublicRequest(payload, "check", `limit${index}@example.invalid`, "127.0.0.1")));
      assert.equal(claims.filter((claim) => claim.allowed).length, 10);
      await clearLimits();
      const globalClaims = await Promise.all(Array.from({ length: 201 }, (_, index) => claimPublicRequest(payload, "check", `global${index}@example.invalid`, `ip-${index}`)));
      assert.equal(globalClaims.filter((claim) => claim.allowed).length, 200);
      assert.equal(checkRequestIP(request("paid@example.invalid", {}, { "x-forwarded-for": "1.2.3.4" })), "shared-untrusted-ingress");
      await clearLimits();
    });
    await t.test("validation, cross-site, honeypot, payload bounds and rate-limit responses", async () => {
      for (const email of ["bad", "x\ny@example.invalid", "a".repeat(255) + "@example.invalid"]) assert.equal((await POST(request(email))).status, 400);
      assert.equal((await POST(request("paid@example.invalid", {}, { origin: "https://evil.invalid" }))).status, 403);
      assert.equal((await POST(request("paid@example.invalid", { startedAt: Date.now() }))).status, 400);
      assert.equal((await POST(request("paid@example.invalid", { details: "x".repeat(5000) }))).status, 413);
      const before = (await mail()).length;
      assert.equal((await POST(request("paid@example.invalid", { website: "spam" }))).status, 200); assert.equal((await mail()).length, before);
      for (let index = 0; index < 10; index++) await POST(request(`rate${index}@example.invalid`));
      const limited = await POST(request("limited@example.invalid")); assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "3600");
      await clearLimits();
    });
    await t.test("help stores minimal private details and alerts only configured organizer; duplicate suppressed", async () => {
      const before = (await mail()).length;
      const input = { mode: "help", name: "Synthetic Help", details: "Someone else registered me. <script>unsafe</script>" };
      assert.equal((await POST(request("help@example.invalid", input))).status, 200);
      assert.equal((await POST(request("help@example.invalid", input))).status, 200);
      const records = await payload.find({ collection: "registration-help-requests", pagination: false });
      assert.equal(records.totalDocs, 1); assert.equal(records.docs[0].notificationStatus, "sent");
      const sent = (await mail())[before]; assert.equal(sent.to, "organizer@example.invalid"); assert.match(sent.html, /&lt;script&gt;/); assert.doesNotMatch(sent.html, /<script>/);
      await assert.rejects(payload.find({ collection: "registration-help-requests", overrideAccess: false }));
      assert.equal((await POST(request("invalidhelp@example.invalid", { mode: "help", name: "", details: "" }))).status, 400);
    });
    await t.test("missing help destination and Resend configuration report safe failures without false success", async () => {
      const recipient = (await payload.find({ collection: "notification-recipients" })).docs[0];
      await payload.update({ collection: "notification-recipients", id: recipient.id, data: { active: false } });
      const count = (await payload.find({ collection: "registration-help-requests" })).totalDocs;
      const result = await POST(request("noorganizer@example.invalid", { mode: "help", name: "Synthetic", details: "Help" }));
      assert.equal(result.status, 503); assert.equal((await payload.find({ collection: "registration-help-requests" })).totalDocs, count);
      await payload.update({ collection: "notification-recipients", id: recipient.id, data: { active: true } });
      const previous = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY;
      try {
        const positive = await POST(request("paid@example.invalid")); const negative = await POST(request("emailfailure@example.invalid"));
        assert.equal(positive.status, 503); assert.deepEqual(await positive.json(), await negative.json());
      } finally { process.env.RESEND_API_KEY = previous; }
    });
    await t.test("Resend rejection releases lookup claim, retains help queue for follow-up; safe capture cannot send live", async () => {
      await clearLimits();
      const capture = process.env.REGISTRATION_TEST_MAIL_CAPTURE; const original = globalThis.fetch;
      let calls = 0; process.env.REGISTRATION_TEST_MAIL_CAPTURE = "false";
      globalThis.fetch = (async () => { calls++; return new Response("Injected test failure", { status: 503 }); }) as typeof fetch;
      try {
        assert.equal((await POST(request("failure@example.invalid"))).status, 503);
        assert.equal((await POST(request("failure@example.invalid"))).status, 503); assert.equal(calls, 2);
        assert.equal((await POST(request("helpfail@example.invalid", { mode: "help", name: "Synthetic", details: "Help failure" }))).status, 200);
        const queue = await payload.find({ collection: "registration-help-requests", where: { email: { equals: "helpfail@example.invalid" } } });
        assert.equal(queue.docs[0].notificationStatus, "pending");
      } finally { globalThis.fetch = original; process.env.REGISTRATION_TEST_MAIL_CAPTURE = capture; }
      assert.equal((await POST(request("do-not-send@real-attendee.invalid"))).status, 503);
    });
    await t.test("Puck/Payload round-trip persists top-level and nested registration check", () => {
      const layout = [{ blockType: "RegistrationCheck", heading: "Check", intro: "Intro" }];
      const data = pageLayoutToPuckData({ title: "Synthetic", layout });
      assert.equal(data.content[0].type, "RegistrationCheck"); assert.equal(puckDataToLayout(data)[0].blockType, "RegistrationCheck");
      const nested = pageLayoutToPuckData({ title: "Nested", layout: [{ blockType: "Section", blocks: layout }] });
      assert.equal((nested.content[0].props.blocks as Array<{ type: string }>)[0].type, "RegistrationCheck");
      const roundtrip = puckDataToLayout(nested)[0];
      assert.equal((roundtrip.blocks as Array<Record<string, unknown>>)[0].blockType, "RegistrationCheck");
    });
  } finally {
    await payload.destroy();
    const cleanup = new MongoClient(process.env.DATABASE_URI!); await cleanup.connect(); await cleanup.db().dropDatabase(); await cleanup.close();
  }
});
