import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { easternToday, hotelRequestedNights, HOTEL_REQUEST_RESPONSE, validateHotelRequest } from "../lib/hotel-request-validation";
import { claimHotelRequest, notifyHotelRequest } from "../lib/hotel-requests";
import { pageLayoutToPuckData, puckDataToLayout } from "../puck/page-data";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname) || process.env.REGISTRATION_TEST_MAIL_CAPTURE !== "true") throw new Error("Run the isolated local-registration hotel-test command.");
const input = (email = "guest@example.invalid") => ({ name: "Synthetic <Guest>", email, phone: "+1 (860) 555-0100", arrivalDate: "2099-12-31", departureDate: "2100-01-03", numberOfRooms: 2, notes: "Near an elevator, please. <script>never run</script>" });

test("hotel requests: actual private Payload persistence, route, access, notifications and failure behavior", { timeout: 180000 }, async (t) => {
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config; resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  const db = payload.db.connection.db!;
  await mkdir(".local-registration", { recursive: true }); await writeFile(".local-registration/mail.ndjson", "");
  const mail = async () => (await readFile(".local-registration/mail.ndjson", "utf8")).split("\n").filter(Boolean).map((line) => JSON.parse(line));
  const clearLimits = () => db.collection("_hotel_request_limits").deleteMany({});
  const { GET, POST } = await import("../app/(payload)/api/hotel-request/route");
  const request = (extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) => new Request("http://127.0.0.1:3029/api/hotel-request", { method: "POST", headers: { origin: "http://127.0.0.1:3029", "content-type": "application/json", ...headers }, body: JSON.stringify({ ...input(), startedAt: Date.now() - 2000, ...extra }) });
  const requestCount = async () => (await payload.count({ collection: "hotel-requests", overrideAccess: true })).totalDocs;
  const stored = async (email: string) => (await payload.find({ collection: "hotel-requests", overrideAccess: true, where: { email: { equals: email } } })).docs[0];
  const originalEnabled = process.env.HOTEL_REQUESTS_ENABLED, originalOpening = process.env.HOTEL_REQUESTS_OPEN_AT;
  try {
    await t.test("available immediately without activation settings, legacy disabled/future values do not gate requests", async () => {
      delete process.env.HOTEL_REQUESTS_ENABLED; delete process.env.HOTEL_REQUESTS_OPEN_AT;
      assert.deepEqual(await (await GET()).json(), { acceptingRequests: true });
      process.env.HOTEL_REQUESTS_ENABLED = "false"; process.env.HOTEL_REQUESTS_OPEN_AT = "2100-12-11T00:00:00-05:00";
      assert.deepEqual(await (await GET()).json(), { acceptingRequests: true });
      assert.equal(await requestCount(), 0);
    });
    await t.test("calendar, nights, phone, whole rooms, length and email validation", async () => {
      assert.deepEqual(hotelRequestedNights("2026-12-31", "2027-01-03"), ["2026-12-31", "2027-01-01", "2027-01-02"]);
      assert.deepEqual(hotelRequestedNights("2028-02-28", "2028-03-01"), ["2028-02-28", "2028-02-29"]);
      assert.equal(hotelRequestedNights("2027-03-13", "2027-03-15").length, 2, "DST does not shift calendar nights");
      assert.equal(easternToday(Date.parse("2026-12-11T04:00:00Z")), "2026-12-10");
      assert.equal(validateHotelRequest({ ...input(), email: " GUEST@EXAMPLE.INVALID ", numberOfRooms: "2" }).email, "guest@example.invalid");
      for (const extra of [{ name: "" }, { name: "x".repeat(101) }, { name: "a\nb" }, { email: "not-email" }, { phone: "123" }, { phone: "555<script>" }, { numberOfRooms: 0 }, { numberOfRooms: 1.5 }, { numberOfRooms: 11 }, { numberOfRooms: true }, { notes: "x".repeat(1001) }, { arrivalDate: "2099-02-30" }, { arrivalDate: "2000-01-01" }, { departureDate: "2099-12-31" }, { departureDate: "2100-01-15" }, { arrivalDate: "2099-12-31T00:00:00Z" }]) {
        assert.equal((await POST(request(extra))).status, 400, JSON.stringify(extra));
      }
      assert.equal(await requestCount(), 0);
    });
    await t.test("same-origin, bounded streams, bot traps and startup timing reject before storage", async () => {
      assert.equal((await POST(request({}, { origin: "https://evil.invalid" }))).status, 403);
      assert.equal((await POST(request({}, { "sec-fetch-site": "cross-site" }))).status, 403);
      assert.equal((await POST(request({}, { "content-type": "text/plain" }))).status, 400);
      assert.equal((await POST(request({ startedAt: Date.now() }))).status, 400);
      assert.equal((await POST(request({ notes: "x".repeat(9000) }))).status, 413);
      assert.equal((await POST(request({ website: "spam" }))).status, 200);
      assert.equal(await requestCount(), 0); assert.equal((await mail()).length, 0);
    });
    await t.test("missing recipients and missing Resend configuration still save a reviewable inquiry", async () => {
      assert.equal((await POST(request())).status, 200);
      let record = await stored("guest@example.invalid");
      assert.equal(record.notificationStatus, "pending_configuration"); assert.equal(record.status, "new");
      assert.deepEqual(record.requestedNights?.map((night) => night.date), ["2099-12-31", "2100-01-01", "2100-01-02"]);
      assert.ok(record.createdAt && record.updatedAt && record.requestKey);
      await payload.create({ collection: "notification-recipients", data: { email: "hotel-chair@example.invalid", triggers: ["hotel_request"], active: true } });
      const key = process.env.RESEND_API_KEY; delete process.env.RESEND_API_KEY;
      try { assert.equal((await POST(request({ email: "noconfig@example.invalid" }))).status, 200); record = await stored("noconfig@example.invalid"); assert.equal(record.notificationStatus, "pending_configuration"); }
      finally { process.env.RESEND_API_KEY = key; }
      assert.equal((await mail()).length, 0);
    });
    await t.test("only active hotel recipients receive escaped organizer mail, saved data stays intact", async () => {
      await payload.create({ collection: "notification-recipients", data: { email: "registration-only@example.invalid", triggers: ["registration_help"], active: true } });
      await payload.create({ collection: "notification-recipients", data: { email: "inactive@example.invalid", triggers: ["hotel_request"], active: false } });
      const before = (await mail()).length;
      const result = await POST(request({ email: "notified@example.invalid" }));
      assert.equal(result.status, 200); assert.deepEqual(await result.json(), { message: HOTEL_REQUEST_RESPONSE });
      const record = await stored("notified@example.invalid"), sent = (await mail()).slice(before);
      assert.equal(sent.length, 1); assert.equal(sent[0].to, "hotel-chair@example.invalid");
      assert.match(sent[0].text, /Rooms requested: 2/); assert.match(sent[0].text, /does not confirm a booking/);
      assert.match(sent[0].html, /&lt;script&gt;/); assert.doesNotMatch(sent[0].html, /<script>/);
      assert.equal(record.notes, input().notes); assert.equal(record.notificationStatus, "sent"); assert.deepEqual(record.notifiedEmails, ["hotel-chair@example.invalid"]);
    });
    await t.test("exact duplicates create one record/email; changed requests during cooldown are not falsely acknowledged", async () => {
      await clearLimits(); const count = await requestCount(), before = (await mail()).length;
      assert.equal((await POST(request({ email: "duplicate@example.invalid" }))).status, 200);
      assert.equal((await POST(request({ email: "duplicate@example.invalid" }))).status, 200);
      assert.equal(await requestCount(), count + 1); assert.equal((await mail()).length, before + 1);
      assert.equal((await POST(request({ email: "duplicate@example.invalid", numberOfRooms: 3 }))).status, 429);
      await clearLimits();
      const concurrent = await Promise.all(Array.from({ length: 4 }, () => POST(request({ email: "concurrent@example.invalid" }))));
      assert.ok(concurrent.every((result) => [200, 429].includes(result.status)));
      assert.equal((await payload.count({ collection: "hotel-requests", where: { email: { equals: "concurrent@example.invalid" } } })).totalDocs, 1);
    });
    await t.test("provider failures preserve requests; retry skips accepted recipients and tracks partial success", async () => {
      await clearLimits();
      await payload.create({ collection: "notification-recipients", data: { email: "second-chair@example.invalid", triggers: ["hotel_request"], active: true } });
      const capture = process.env.REGISTRATION_TEST_MAIL_CAPTURE, fetch = globalThis.fetch; process.env.REGISTRATION_TEST_MAIL_CAPTURE = "false";
      const destinations: string[] = [];
      globalThis.fetch = (async (_url: unknown, options?: RequestInit) => {
        const address = JSON.parse(String(options?.body)).to[0]; assert.ok(address.endsWith("@example.invalid")); destinations.push(address);
        return new Response("Injected test response", { status: address === "second-chair@example.invalid" ? 503 : 200 });
      }) as typeof globalThis.fetch;
      try {
        assert.equal((await POST(request({ email: "partial@example.invalid" }))).status, 200);
        const record = await stored("partial@example.invalid"); assert.equal(record.notificationStatus, "partial"); assert.deepEqual(record.notifiedEmails, ["hotel-chair@example.invalid"]);
        assert.equal(record.notificationErrorCode, "hotel_notification_failed");
        globalThis.fetch = (async (_url: unknown, options?: RequestInit) => { destinations.push(JSON.parse(String(options?.body)).to[0]); return new Response("Accepted", { status: 200 }); }) as typeof globalThis.fetch;
        assert.equal(await notifyHotelRequest(payload, record.id), "sent"); assert.deepEqual(destinations, ["hotel-chair@example.invalid", "second-chair@example.invalid", "second-chair@example.invalid"]);
        globalThis.fetch = (async () => new Response("Rejected", { status: 503 })) as typeof globalThis.fetch;
        assert.equal((await POST(request({ email: "failure@example.invalid" }))).status, 200); assert.equal((await stored("failure@example.invalid")).notificationStatus, "failed");
      } finally { globalThis.fetch = fetch; process.env.REGISTRATION_TEST_MAIL_CAPTURE = capture; }
    });
    await t.test("database creation failure reports no saved success and releases the claim for retry", async () => {
      await clearLimits(); const create = payload.create.bind(payload), count = await requestCount();
      payload.create = (async (args: Parameters<typeof create>[0]) => { if (args.collection === "hotel-requests") throw new Error("Injected storage failure"); return create(args); }) as typeof payload.create;
      try { assert.equal((await POST(request({ email: "storagefailure@example.invalid" }))).status, 503); assert.equal(await requestCount(), count); }
      finally { payload.create = create; }
      assert.equal((await POST(request({ email: "storagefailure@example.invalid" }))).status, 200);
    });
    await t.test("IP/global limits are persistent and isolated from registration lookup limits", async () => {
      await clearLimits();
      const ip = await Promise.all(Array.from({ length: 12 }, (_, index) => claimHotelRequest(payload, input(`ip${index}@example.invalid`), "test-ip")));
      assert.equal(ip.filter((claim) => claim.allowed).length, 10);
      await clearLimits();
      const global = await Promise.all(Array.from({ length: 201 }, (_, index) => claimHotelRequest(payload, input(`global${index}@example.invalid`), `test-ip-${index}`)));
      assert.equal(global.filter((claim) => claim.allowed).length, 200);
      const rows = await db.collection("_hotel_request_limits").find({}).toArray(); assert.ok(rows.every((row) => !JSON.stringify(row).includes("@example.invalid")));
      assert.ok((await db.collection("_hotel_request_limits").indexes()).some((index) => index.expireAfterSeconds === 0));
    });
    await t.test("private queue, registration manager review, read-only viewer and restricted staff permissions", async () => {
      const record = await stored("guest@example.invalid");
      const admin = await payload.create({ collection: "users", data: { email: "admin@example.invalid", password: "SyntheticOnly123!", role: "admin" } });
      const manager = await payload.create({ collection: "users", data: { email: "manager@example.invalid", password: "SyntheticOnly123!", role: "staff", contentAreas: ["registration"], accessLevel: "manage" } });
      const viewer = await payload.create({ collection: "users", data: { email: "viewer@example.invalid", password: "SyntheticOnly123!", role: "viewer" } });
      const program = await payload.create({ collection: "users", data: { email: "program@example.invalid", password: "SyntheticOnly123!", role: "staff", contentAreas: ["program"], accessLevel: "manage" } });
      await assert.rejects(payload.find({ collection: "hotel-requests", overrideAccess: false }));
      for (const user of [admin, manager, viewer]) assert.ok((await payload.find({ collection: "hotel-requests", overrideAccess: false, user })).totalDocs > 0);
      await assert.rejects(payload.find({ collection: "hotel-requests", overrideAccess: false, user: program }));
      await assert.rejects(payload.update({ collection: "hotel-requests", id: record.id, overrideAccess: false, user: viewer, data: { status: "resolved" } }));
      await payload.update({ collection: "hotel-requests", id: record.id, overrideAccess: false, user: manager, data: { status: "submitted_to_hotel", batchReference: "SYNTHETIC-BATCH-01", batchedAt: new Date().toISOString(), staffNotes: "Synthetic review", departureDate: "2100-01-02" } });
      assert.equal((await stored("guest@example.invalid")).requestedNights?.length, 2);
      const { POST: retry } = await import("../app/(payload)/api/admin/hotel-request-notification/route");
      assert.equal((await retry(new Request("http://127.0.0.1:3029/api/admin/hotel-request-notification", { method: "POST", headers: { origin: "http://127.0.0.1:3029" }, body: JSON.stringify({ id: record.id }) }))).status, 403);
    });
    await t.test("Puck/Payload roundtrip preserves heading, intro and working default nested placement", async () => {
      const block = { blockType: "HotelRequest" as const, heading: "Custom hotel heading", intro: "Custom intro\nSecond line" };
      const page = await payload.create({ collection: "pages", data: { title: "Synthetic hotel page", slug: "synthetic-hotel", _status: "draft", layout: [block, { blockType: "Section", heading: "Nested", blocks: [{ ...block }] }] } });
      const roundtrip = puckDataToLayout(pageLayoutToPuckData(page as never));
      assert.equal(roundtrip[0].blockType, "HotelRequest"); assert.equal(roundtrip[0].intro, block.intro); assert.equal("acceptingRequests" in roundtrip[0], false);
      assert.equal((roundtrip[1].blocks as Array<Record<string, unknown>>)[0].intro, block.intro);
      assert.equal((await payload.count({ collection: "registration-help-requests" })).totalDocs, 0);
      assert.equal((await payload.count({ collection: "attendees" })).totalDocs, 0);
      assert.equal((await payload.count({ collection: "contacts" })).totalDocs, 0);
    });
  } finally {
    if (originalEnabled === undefined) delete process.env.HOTEL_REQUESTS_ENABLED; else process.env.HOTEL_REQUESTS_ENABLED = originalEnabled;
    if (originalOpening === undefined) delete process.env.HOTEL_REQUESTS_OPEN_AT; else process.env.HOTEL_REQUESTS_OPEN_AT = originalOpening;
    await db.dropDatabase(); await payload.destroy();
  }
});
