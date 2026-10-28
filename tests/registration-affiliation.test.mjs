import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
function load(path, deps = {}) {
  const js = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("exports", "require", js)(exports, name => { assert.ok(Object.hasOwn(deps, name), name); return deps[name]; });
  return exports;
}
const affiliation = load("../lib/registration-affiliation.ts");
const reg = load("../lib/registration.ts", { "./registration-affiliation": affiliation });
const records = load("../lib/registration-records.ts", { "./registration-affiliation": affiliation, "@/lib/registration": reg,
  "@/lib/stripe-server": { getStripe: () => { throw new Error("Unexpected Stripe request"); } }, "@/lib/scholarship-email": { sendStripeScholarshipPaidNotification: async () => {} } });
function memoryPayload() {
  const rows = new Map(); let next = 0;
  const table = (name) => { if (!rows.has(name)) rows.set(name, []); return rows.get(name); };
  function matches(doc, where = {}) { if (where.and) return where.and.every(item => matches(doc, item)); return Object.entries(where).every(([key, condition]) => condition.equals === undefined || doc[key] === condition.equals); }
  return { rows, async find({ collection, where }) { return { docs: table(collection).filter(doc => matches(doc, where)) }; },
    async findByID({ collection, id }) { return table(collection).find(doc => doc.id === id); },
    async create({ collection, data }) { const doc = { id: String(++next), ...data }; table(collection).push(doc); return doc; },
    async update({ collection, id, data }) { const doc = table(collection).find(doc => doc.id === id); assert.ok(doc); Object.assign(doc, data); return doc; } };
}

test("the Payload reporting path saves affiliations on attendee and contact collections for card and cash", async () => {
  const payload = memoryPayload();
  const profile = { homegroup: "Monday Group", committee: "Bay State Bid", fellowships: ["aa", "al_anon", "other"], fellowshipOther: "NA" };
  const order = reg.normalizeOrder({ purchaserName: "Purchaser", purchaserEmail: "purchaser@example.invalid", selfRegistration: true,
    attendee: { name: "Attendee", email: "attendee@example.invalid", state: "CT", ...profile }, policy: Object.fromEntries(reg.POLICY_KEYS.map(key => [key, true])),
    scholarship: { enabled: true, kind: "specific", recipientName: "Recipient", recipientEmail: "recipient@example.invalid", recipientState: "MA", recipientHomegroup: "Sunday Group", recipientCommittee: "CSCYPAA", recipientFellowships: ["al_anon"] } });
  assert.equal(reg.validateOrder(order), null);
  for (const paymentSource of ["stripe", "cash"]) await records.recordRegistrationOrder(payload, order, { sourceKey: `${paymentSource}:test`, paymentSource, paymentStatus: paymentSource === "cash" ? "recorded" : "paid", dataOrigin: paymentSource === "cash" ? "cash_checkout" : "stripe_webhook", purchasedAt: "2026-10-27T12:00:00Z" });
  const attendees = payload.rows.get("attendees"); assert.equal(attendees.length, 4);
  for (const row of attendees.filter(row => row.attendeeName === "Attendee")) { assert.equal(row.homegroup, profile.homegroup); assert.equal(row.committee, profile.committee); assert.deepEqual(row.fellowships, profile.fellowships); assert.equal(row.fellowshipOther, "NA"); }
  const contacts = payload.rows.get("contacts");
  assert.equal(contacts.find(row => row.displayName === "Attendee").committee, "Bay State Bid");
  assert.deepEqual(contacts.find(row => row.displayName === "Recipient").fellowships, ["al_anon"]);
  assert.equal(payload.rows.get("checkout-orders")[0].order.scholarship.recipientCommittee, "CSCYPAA");
  const metadata = reg.buildMetadata(order, { dataOrigin: "live_checkout", processingFeeCents: 0, totalChargeCents: 9000 });
  assert.ok(Object.keys(metadata).length <= 50);
  const restored = records.orderFromStripeMetadata(metadata, { name: "Purchaser", email: "purchaser@example.invalid" });
  assert.equal(restored.attendee.committee, "Bay State Bid"); assert.deepEqual(restored.attendee.fellowships, profile.fellowships); assert.equal(restored.scholarship.recipientCommittee, "CSCYPAA");
  const legacy = records.orderFromStripeMetadata({ homegroup_committee: "Old group / old committee" }, { name: "Legacy", email: "legacy@example.invalid" });
  assert.equal(legacy.attendee.homegroupCommittee, "Old group / old committee"); assert.equal(legacy.attendee.homegroup, "");
});
