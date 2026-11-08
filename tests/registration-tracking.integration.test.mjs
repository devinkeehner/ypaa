import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import ts from "typescript";
function load(path, deps = {}) {
  const js = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("exports", "require", js)(exports, name => { assert.ok(Object.hasOwn(deps, name), `Unexpected dependency ${name}`); return deps[name]; });
  return exports;
}
const affiliation = load("../lib/registration-affiliation.ts");
const mainReg = load("../lib/registration.ts", { "./registration-affiliation": affiliation });
const siteReg = load("../../registration/lib/registration.ts", { "./registration-affiliation": affiliation });
const sources = load("../lib/registration-sources.ts", { "./registration-affiliation": affiliation });
const crm = load("../lib/crm-access.ts");
const collection = crm.withViewerAccess(load("../collections/RegistrationSources.ts", { "@/lib/crm-access": crm, "@/lib/registration-sources": sources }).RegistrationSources);
const mainRecords = load("../lib/registration-records.ts", { "./registration-sources": sources, "./registration-affiliation": affiliation, "@/lib/registration": mainReg,
  "@/lib/stripe-server": { getStripe: () => { throw new Error("No real Stripe allowed"); } }, "@/lib/scholarship-email": { sendStripeScholarshipPaidNotification: async () => {} } });
function memoryPayload() {
  const rows = new Map([["registration-sources", [{ id: "tracking1", name: "Synthetic", slug: "custom-name", event: sources.REGISTRATION_EVENT, active: true }, { id: "foreign1", slug: "foreign", event: "different_event", active: true }]]]); let next = 0;
  const table = name => { if (!rows.has(name)) rows.set(name, []); return rows.get(name); };
  const matches = (doc, where = {}) => where.and ? where.and.every(item => matches(doc, item)) : Object.entries(where).every(([key, condition]) => condition.equals === undefined || doc[key] === condition.equals);
  return { rows, async find({ collection, where }) { return { docs: table(collection).filter(doc => matches(doc, where)) }; },
    async findByID({ collection, id }) { return table(collection).find(doc => doc.id === id); },
    async create({ collection, data }) { const doc = { id: `synthetic${++next}`, ...data }; table(collection).push(doc); return doc; },
    async update({ collection, id, data }) { const doc = table(collection).find(doc => doc.id === id); assert.ok(doc); Object.assign(doc, data); return doc; } };
}
const input = { purchaserName: "Synthetic Buyer", purchaserEmail: "buyer@example.invalid", selfRegistration: true, registrationSource: "custom-name",
  attendee: { name: "Synthetic Attendee", email: "attendee@example.invalid", state: "CT", homegroup: "Synthetic group", committee: "Synthetic committee", soberDate: "2020-02-29" },
  policy: Object.fromEntries(siteReg.POLICY_KEYS.map(key => [key, true])),
  scholarship: { enabled: true, kind: "specific", recipientName: "Synthetic Recipient", recipientEmail: "recipient@example.invalid", recipientState: "MA", recipientSoberDate: "2019-05-03" } };

test("optional calendar dates validate and remain absent from bounded Stripe metadata", () => {
  for (const reg of [siteReg, mainReg]) {
    for (const date of ["", undefined, "2020-02-29"]) assert.equal(reg.validateOrder(reg.normalizeOrder({ ...input, attendee: { ...input.attendee, soberDate: date } })), null);
    for (const date of ["2021-02-29", "2020-04-31", "2999-01-01", "01/02/2020", {}, "0000-01-01"]) assert.match(reg.validateOrder(reg.normalizeOrder({ ...input, attendee: { ...input.attendee, soberDate: date } })), /sober date/);
    const metadata = reg.buildMetadata(reg.normalizeOrder(input), { dataOrigin: "live_checkout", processingFeeCents: 0, totalChargeCents: 9000, registrationPriceCents: 4500 });
    assert.equal(metadata.necy_registration_source, "custom-name"); assert.ok(Object.keys(metadata).length + 1 <= 50);
    assert.ok(Object.values(metadata).every(value => value.length <= 500));
    for (const date of [input.attendee.soberDate, input.scholarship.recipientSoberDate]) assert.ok(!JSON.stringify(metadata).includes(date));
  }
});
test("admin-only immutable unique links reject reserved routes and other events, and can be disabled", async () => {
  const payload = memoryPayload();
  for (const role of [undefined, "viewer", "staff", "merch"]) for (const operation of ["read", "create", "update", "delete"])
    assert.equal(await collection.access[operation]({ req: { user: role ? { role, collection: "users", contentAreas: ["registration"], accessLevel: "manage" } : null } }), false);
  assert.equal(await collection.access.create({ req: { user: { role: "admin", collection: "users" } } }), true);
  assert.equal(collection.fields.find(field => field.name === "slug").unique, true);
  assert.throws(() => collection.hooks.beforeChange[0]({ data: { slug: "renamed" }, originalDoc: { slug: "custom-name" } }));
  assert.equal(collection.hooks.beforeChange[0]({ data: { event: "foreign" } }).event, sources.REGISTRATION_EVENT);
  for (const path of ["checkout", "register", "api", "merch", "records", "registration", "admin", "_next", "../x", "Custom", "a--b", "a/b", "x".repeat(81), "favicon.svg"]) assert.equal(sources.validTrackingSlug(path), false);
  for (const dir of readdirSync(new URL("../../registration/app/", import.meta.url), { withFileTypes: true })) {
    if (dir.isDirectory() && !dir.name.startsWith("[")) assert.ok(sources.RESERVED_REGISTRATION_PATHS.has(dir.name), `Reserve application route ${dir.name}`);
  }
  assert.equal(await sources.findRegistrationSource(payload, "foreign"), null);
  assert.equal(await sources.findRegistrationSource(payload, "missing"), null);
  payload.rows.get("registration-sources")[0].active = false;
  assert.equal(await sources.findRegistrationSource(payload, "custom-name"), null);
  assert.ok(await sources.findRegistrationSource(payload, "custom-name", false));
});
test("checkout → D1 draft → paid webhook → authenticated Payload reporting preserves private dates and source through retries and webhook races", async () => {
  const payload = memoryPayload();
  const baseDeps = { "node:crypto": await import("node:crypto"), "payload": { getPayload: async () => payload }, "@payload-config": {}, "@/lib/registration-sources": sources };
  const sourceRoute = load("../app/(payload)/api/registration-site/sources/route.ts", baseDeps);
  const reportRoute = load("../app/(payload)/api/registration-site/orders/route.ts", { ...baseDeps, "next/server": { NextResponse: Response }, "@/lib/registration-affiliation": affiliation, "@/lib/registration": mainReg,
    "@/lib/registration-receipt": { registrationReceiptPriceCents: () => 4500 }, "@/lib/registration-records": mainRecords, "@/lib/scholarship-email": { sendPurchaserConfirmation: async () => {} } });
  const sqlite = new DatabaseSync(":memory:"); const dir = new URL("../../registration/drizzle/", import.meta.url);
  for (const file of readdirSync(dir).filter(file => file.endsWith(".sql")).sort()) sqlite.exec(readFileSync(new URL(file, dir), "utf8"));
  const DB = { prepare(sql) { return { values: [], bind(...args) { this.values = args; return this; }, async run() { return { meta: { changes: Number(sqlite.prepare(sql).run(...this.values).changes) } }; }, async first() { return sqlite.prepare(sql).get(...this.values) || null; } }; }, async batch(statements) { for (const statement of statements) await statement.run(); } };
  const oldFetch = globalThis.fetch, oldEnv = { ...process.env };
  Object.assign(process.env, { PAYLOAD_API_URL: "http://payload.synthetic.invalid", PAYLOAD_MERCH_API_KEY: "synthetic-integration-key", REGISTRATION_SITE_API_KEY: "synthetic-integration-key", STRIPE_PUBLISHABLE_KEY: "pk_test_synthetic" });
  globalThis.fetch = async (url, options) => { assert.equal(new URL(url).origin, "http://payload.synthetic.invalid"); const request = new Request(url, options); return new URL(url).pathname.endsWith("/sources") ? sourceRoute.GET(request) : reportRoute.POST(request); };
  const report = load("../../registration/lib/payload-reporting.ts", { "@/lib/registration": siteReg });
  const resolver = load("../../registration/lib/registration-sources.ts", { "./registration-affiliation": affiliation });
  const entry = load("../../registration/lib/checkout-entry.ts");
  let sessionInput;
  const stripe = { checkout: { sessions: { create: async data => { sessionInput = data; return { id: "cs_synthetic_tracking", client_secret: "synthetic" }; } } }, paymentIntents: { retrieve: async () => ({ id: "pi_synthetic", metadata: sessionInput.metadata, latest_charge: null }) } };
  const deps = { "@/lib/registration-sources": resolver, "@/lib/registration": siteReg, "@/lib/stripe": { getStripe: () => stripe }, "cloudflare:workers": { env: { DB } }, "@/lib/merchandise": { quoteMerchandise: async () => ({ lines: [], subtotalCents: 0 }), shippingFeeCents: () => 0, fulfillMerchandise: async () => {} } };
  const checkout = load("../../registration/app/api/stripe/checkout/route.ts", deps);
  const records = load("../../registration/lib/registration-records.ts", { ...deps, "./registration-affiliation": affiliation, "@/lib/payload-reporting": report, "@/lib/payload-notifications": { notifyPurchaserConfirmation: async () => {} } });
  try {
    assert.equal((await sourceRoute.GET(new Request("http://payload.synthetic.invalid/api/registration-site/sources?slug=custom-name"))).status, 401);
    assert.equal((await reportRoute.POST(new Request("http://payload.synthetic.invalid/api/registration-site/orders", { method: "POST" }))).status, 401);
    const url = entry.canonicalCheckoutUrl("https://reg.necypaact.com/custom-name?mode=scholarship#section");
    assert.equal(url.pathname, "/checkout"); assert.equal(url.searchParams.get("source"), "custom-name"); assert.equal(url.hash, "#section");
    const send = order => checkout.POST(new Request("http://registration.synthetic.invalid/api/stripe/checkout", { method: "POST", body: JSON.stringify(order) }));
    for (const source of ["missing", "foreign", "checkout"]) assert.equal((await send({ ...input, registrationSource: source })).status, 400);
    assert.equal((await send(input)).status, 200);
    assert.equal(sessionInput.metadata.necy_registration_source, "custom-name"); assert.equal(sessionInput.payment_intent_data.metadata.necy_registration_source, "custom-name");
    assert.ok(!JSON.stringify(sessionInput).includes(input.attendee.soberDate));
    const metadataOrder = mainRecords.orderFromStripeMetadata(sessionInput.metadata, { name: input.purchaserName, email: input.purchaserEmail });
    const context = { sourceKey: "stripe:cs_synthetic_tracking", paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "stripe_webhook", purchasedAt: "2026-11-06T12:00:00Z", stripeCheckoutSessionId: "cs_synthetic_tracking", rawMetadata: sessionInput.metadata };
    await mainRecords.recordRegistrationOrder(payload, metadataOrder, context);
    assert.ok(payload.rows.get("attendees").every(row => !row.soberDate));
    payload.rows.get("registration-sources")[0].active = false;
    const session = { id: "cs_synthetic_tracking", payment_status: "paid", created: 1793966400, payment_intent: "pi_synthetic", metadata: sessionInput.metadata };
    await records.recordStripeSession(session); await records.recordStripeSession(session);
    await mainRecords.recordRegistrationOrder(payload, metadataOrder, context);
    assert.equal(payload.rows.get("attendees").length, 2); assert.equal(payload.rows.get("checkout-orders").length, 1);
    assert.equal(payload.rows.get("attendees")[0].soberDate, input.attendee.soberDate); assert.equal(payload.rows.get("attendees")[1].soberDate, input.scholarship.recipientSoberDate);
    assert.ok(payload.rows.get("attendees").every(row => row.registrationSource === "custom-name"));
    assert.equal(payload.rows.get("checkout-orders")[0].order.attendee.soberDate, input.attendee.soberDate);
    assert.ok(payload.rows.get("contacts").every(row => !("soberDate" in row)));
    assert.equal(sqlite.prepare("SELECT count(*) AS count FROM attendees").get().count, 2);
    assert.equal(sqlite.prepare("SELECT payload_sync_status FROM orders").get().payload_sync_status, "synced");
    assert.equal(sqlite.prepare("SELECT sober_date FROM attendees ORDER BY id LIMIT 1").get().sober_date, input.attendee.soberDate);
    const direct = siteReg.normalizeOrder({ ...input, registrationSource: "" });
    await records.recordRegistrationOrder(direct, { ...context, sourceKey: "cash:synthetic", paymentSource: "cash", paymentStatus: "recorded", dataOrigin: "cash_checkout", stripeCheckoutSessionId: undefined });
    assert.equal(payload.rows.get("checkout-orders")[1].registrationSource, undefined); assert.equal(payload.rows.get("attendees")[2].soberDate, input.attendee.soberDate);
    payload.rows.get("registration-sources")[0].active = true;
    process.env.CASH_ACCESS_CODE = "SYNTHETIC-ONLY";
    stripe.customers = { list: async () => ({ data: [] }), create: async data => {
      assert.ok(Object.keys(data.metadata).length <= 50, "Tracked cash customer metadata must fit Stripe's limit");
      assert.equal(data.metadata.necy_registration_source, "custom-name");
      assert.ok(!JSON.stringify(data).includes(input.attendee.soberDate));
      return { id: "cus_synthetic_cash" };
    } };
    const cash = load("../../registration/app/api/cash/route.ts", {
      ...deps, "@/lib/cash-access": load("../../registration/lib/cash-access.ts"),
      "@/lib/issued-cash-checkout": { recordIssuedCashOrder: async () => { throw new Error("Unexpected issued cash call"); } },
      "@/lib/registration-records": records, "@/lib/payload-notifications": { notifyCashScholarshipRequested: async () => "synthetic" },
      "@/lib/scholarship-email": { sendScholarshipNotification: async () => {} },
    });
    const cashResponse = await cash.POST(new Request("http://registration.synthetic.invalid/api/cash", { method: "POST", body: JSON.stringify({ code: "SYNTHETIC-ONLY", order: input }) }));
    assert.equal(cashResponse.status, 200, JSON.stringify(await cashResponse.clone().json()));
    assert.equal(payload.rows.get("checkout-orders")[2].registrationSource, "custom-name");
    assert.equal(payload.rows.get("attendees")[4].soberDate, input.attendee.soberDate);

  } finally { globalThis.fetch = oldFetch; process.env = oldEnv; sqlite.close(); }
});
