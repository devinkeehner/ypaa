import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { MongoClient } from "mongodb";
import { derivePurchaseDetails } from "../lib/checkout-order-details";

// Never load a developer env file, reuse a populated database, or call a mail provider.
const database = `ypaa_orders_test_${randomUUID().replaceAll("-", "")}`;
const uri = `mongodb://127.0.0.1:27029/${database}?replicaSet=ypaaTest`;
Object.assign(process.env, { DATABASE_URI: uri, PAYLOAD_SECRET: "synthetic-orders-only-secret", ENABLE_R2: "false", PAYLOAD_ENABLE_MCP: "false", RESEND_API_KEY: "", STRIPE_SECRET_KEY: "", STRIPE_WEBHOOK_SECRET: "", REGISTRATION_SITE_API_KEY: "", ISSUER_SERVICE_API_KEY: "", CASH_ACCESS_CODE: "" });
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
await client.connect();
assert.equal((await client.db("admin").command({ hello: 1 })).setName, "ypaaTest");
assert.equal((await client.db().listCollections().toArray()).length, 0);
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
const resolved = await config; resolved.onInit = async () => {};
const payload = await getPayload({ config: resolved });
let checks = 0;
let success = false;
const check = (label: string) => { checks++; console.log(`PASS ${label}`); };
try {
  await Promise.all(Object.values(payload.db.connection.models).map((model) => model.init()));
  const password = "SyntheticOrdersLocalOnly123!";
  const admin = await payload.create({ collection: "users", data: { email: "orders-admin@example.invalid", password, role: "admin" } });
  const viewer = await payload.create({ collection: "users", data: { email: "orders-viewer@example.invalid", password, role: "viewer" } });
  const staff = await payload.create({ collection: "users", data: { email: "orders-staff@example.invalid", password, role: "staff", contentAreas: ["registration"], accessLevel: "view" } });
  const user = { ...admin, collection: "users" as const };
  const data = { sourceKey: "synthetic:order-mixed", purchaserName: "Synthetic Buyer", purchaserEmail: "buyer@example.invalid", subtotalCents: 13600, processingFeeCents: 400, totalCents: 14000, paymentSource: "stripe" as const, paymentStatus: "paid" as const, dataOrigin: "stripe_backfill" as const, purchasedAt: "2026-08-23T12:00:00Z", order: { selfRegistration: true, breakfast: { friday: 0, saturday: 0, sunday: 0 }, scholarship: { enabled: true, kind: "general", amountCents: 4000 } }, rawMetadata: { self_registration_quantity: "1", scholarship_quantity: "1", scholarship_recipient_name: "General scholarship fund", breakfast_tickets: "Breakfast - Saturday x2", necy_has_merch: "true", necy_merch_count: "2", necy_merch_fulfillment: "shipping" }, checkoutLineItemSummary: "Synthetic shirt (Purple / L) × 2 — $36.00" };
  const created = await payload.create({ collection: "checkout-orders", data });
  const stored = await client.db().collection("checkout-orders").findOne({ sourceKey: data.sourceKey });
  assert.ok(stored?.purchaseSnapshot); assert.equal(stored?.purchaseDetails, undefined); assert.equal(stored?.purchaseSummary, undefined);
  check("future order gets a persisted structured snapshot; display fields remain virtual");
  await payload.create({ collection: "merchandise-orders", data: { sourceKey: data.sourceKey, purchaserName: data.purchaserName, purchaserEmail: data.purchaserEmail, paymentSource: "stripe", fulfillmentMethod: "shipping", shippingStatus: "not_shipped", items: [{ name: "Synthetic shirt", slug: "synthetic-shirt", variantId: "synthetic-L", size: "L", color: "Purple", sku: "SYN-L", quantity: 2, unitPriceCents: 1800 }], merchandiseSubtotalCents: 3600, shippingCents: 0, status: "processing", isSynthetic: true } });
  const read = await payload.findByID({ collection: "checkout-orders", id: created.id, user, overrideAccess: false, depth: 0 });
  const details = read.purchaseDetails as ReturnType<typeof derivePurchaseDetails>;
  assert.match(read.purchaseSummary!, /Registration.*Scholarship.*Breakfast.*Merchandise/);
  assert.equal(details.merchandise.items[0].size, "L"); assert.equal(details.merchandise.fulfillment, "shipping"); assert.equal(details.breakfast.days[0].quantity, 2); assert.equal(details.scholarship?.amountCents, null);
  check("authorized Payload reads contain linked historical variants and delivery with legacy breakfast counts");
  const beforeRead = await client.db().collection("checkout-orders").findOne({ sourceKey: data.sourceKey });
  await payload.find({ collection: "checkout-orders", user, overrideAccess: false, depth: 0 });
  assert.deepEqual(await client.db().collection("checkout-orders").findOne({ sourceKey: data.sourceKey }), beforeRead);
  check("reading historical order details writes nothing to MongoDB");
  const viewerRead = await payload.findByID({ collection: "checkout-orders", id: created.id, user: { ...viewer, collection: "users" }, overrideAccess: false });
  assert.equal((viewerRead.purchaseDetails as typeof details).merchandise.items[0].sku, "SYN-L");
  await assert.rejects(payload.update({ collection: "checkout-orders", id: created.id, user: { ...viewer, collection: "users" }, overrideAccess: false, data: { totalCents: 1 } }));
  await assert.rejects(payload.findByID({ collection: "checkout-orders", id: created.id, overrideAccess: false }));
  check("viewer can read purchase details, cannot edit; anonymous access remains denied");
  const restricted = await payload.findByID({ collection: "checkout-orders", id: created.id, user: { ...staff, collection: "users" }, overrideAccess: false });
  assert.equal((restricted.purchaseDetails as typeof details).merchandise.records.length, 0);
  assert.equal((restricted.purchaseDetails as typeof details).merchandise.items.length, 0);
  check("registration-only staff receive no restricted merchandise record or item details");
  const selected = await payload.findByID({ collection: "checkout-orders", id: created.id, user, overrideAccess: false, select: { totalCents: true } });
  assert.equal(selected.totalCents, 14000); assert.equal("purchaseDetails" in selected, false); assert.equal("rawMetadata" in selected, false);
  check("field selection does not accidentally expose metadata or purchase details");
  const selectedSummary = await payload.findByID({ collection: "checkout-orders", id: created.id, user, overrideAccess: false, select: { purchaseSummary: true } });
  assert.match(selectedSummary.purchaseSummary!, /Registration.*Scholarship.*Breakfast.*Merchandise/); assert.equal("rawMetadata" in selectedSummary, false); assert.equal("purchaseDetails" in selectedSummary, false);
  check("virtual-only projections recover source dependencies while returning only requested fields");
  await payload.update({ collection: "checkout-orders", id: created.id, data: { paymentStatus: "refunded", purchaseSnapshot: { forged: true }, purchaseDetails: { forged: true }, purchaseSummary: "forged" } });
  const updated = await client.db().collection("checkout-orders").findOne({ sourceKey: data.sourceKey });
  assert.deepEqual(updated?.purchaseSnapshot, stored?.purchaseSnapshot); assert.equal(updated?.paymentStatus, "refunded");
  for (const field of ["rawMetadata", "order", "sourceKey", "subtotalCents", "processingFeeCents", "totalCents", "dataOrigin", "purchasedAt"]) assert.deepEqual(updated?.[field], stored?.[field], field);
  check("ordinary status update preserves source fields, financial amounts and immutable snapshot");
  // API-generated fixtures with the new snapshot unset simulate pre-feature documents.
  await client.db().collection("checkout-orders").updateOne({ sourceKey: data.sourceKey }, { $unset: { purchaseSnapshot: "" } });
  await payload.update({ collection: "checkout-orders", id: created.id, data: { paymentStatus: "paid" } });
  assert.equal((await client.db().collection("checkout-orders").findOne({ sourceKey: data.sourceKey }))?.purchaseSnapshot, undefined);
  check("saving an old order does not backfill a snapshot");
  const originalInput = { selfRegistration: false, scholarship: { enabled: true, kind: "general", amountCents: 7000 }, merchandise: [{ slug: "synthetic-hoodie", variantId: "SYN-XL", quantity: 2 }], fulfillmentMethod: "event_pickup" };
  const future = await payload.create({ collection: "checkout-orders", data: { ...data, sourceKey: "synthetic:original-input", rawMetadata: { necy_has_scholarship: "true", necy_has_merch: "true", necy_merch_count: "2" }, order: { selfRegistration: false, scholarship: { enabled: true, kind: "general", amountCents: 4000 } } }, context: { checkoutPurchaseDisplayOrder: originalInput } });
  const futureRead = await payload.findByID({ collection: "checkout-orders", id: future.id });
  const futureDetails = futureRead.purchaseDetails as typeof details;
  assert.equal(futureDetails.scholarship?.amountCents, 7000); assert.equal(futureDetails.merchandise.items[0].variantId, "SYN-XL"); assert.equal(futureDetails.merchandise.fulfillment, "event_pickup");
  assert.equal((futureRead.order as { scholarship: { amountCents: number } }).scholarship.amountCents, 4000);
  check("future server-report snapshot preserves original purchase details before normalization without changing normalized order or totals");
  process.env.REGISTRATION_SITE_API_KEY = "synthetic-orders-boundary";
  const { POST } = await import("../app/(payload)/api/registration-site/orders/route");
  const originalFetch = globalThis.fetch;
  let externalCalls = 0;
  globalThis.fetch = async () => { externalCalls++; throw new Error("No outbound requests allowed in Orders tests"); };
  try {
    const reportedOrder = { purchaserName: "Synthetic Boundary Buyer", purchaserEmail: "boundary@example.invalid", selfRegistration: false, scholarship: { enabled: true, kind: "specific", amountCents: 4500, recipientName: "Synthetic Recipient", recipientEmail: "recipient@example.invalid", recipientState: "CT" }, merchandise: [{ slug: "synthetic-hoodie", variantId: "SYN-XL", quantity: 2 }], fulfillmentMethod: "event_pickup" };
    const reportContext = { sourceKey: "cash:synthetic-boundary", paymentSource: "cash", paymentStatus: "recorded", dataOrigin: "cash_checkout", purchasedAt: data.purchasedAt, subtotalCents: 8100, processingFeeCents: 0, totalCents: 8100, rawMetadata: { necy_has_scholarship: "true", necy_has_merch: "true", necy_merch_count: "2", scholarship_quantity: "1", scholarship_recipient_name: "Synthetic Recipient", scholarship_recipient_email: "recipient@example.invalid" } };
    const response = await POST(new Request("http://127.0.0.1/api/registration-site/orders", { method: "POST", headers: { authorization: "Bearer synthetic-orders-boundary", "content-type": "application/json" }, body: JSON.stringify({ order: reportedOrder, context: reportContext }) }));
    assert.equal(response.status, 200); assert.equal(externalCalls, 0);
    const recorded = (await payload.find({ collection: "checkout-orders", where: { sourceKey: { equals: reportContext.sourceKey } }, depth: 0 })).docs[0];
    const recordedDetails = recorded.purchaseDetails as typeof details;
    assert.equal(recordedDetails.scholarship?.amountCents, 4500); assert.equal(recordedDetails.scholarship?.kind, "specific"); assert.equal(recordedDetails.merchandise.items[0].variantId, "SYN-XL"); assert.equal(recordedDetails.merchandise.fulfillment, "event_pickup");
    assert.equal(recorded.totalCents, 8100); assert.equal((recorded.order as { scholarship: { amountCents: number } }).scholarship.amountCents, 4000); assert.deepEqual(recorded.rawMetadata, reportContext.rawMetadata);
    check("authenticated reporting route passes original purchase shape into snapshot while retaining existing normalized order, source metadata and recorded totals; no outbound mail");
  } finally { globalThis.fetch = originalFetch; process.env.REGISTRATION_SITE_API_KEY = ""; }
  const methods = ["receive_now", "event_pickup"] as const;
  for (const method of methods) {
    await payload.create({ collection: "checkout-orders", data: { ...data, sourceKey: `synthetic:${method}`, paymentSource: "cash", paymentStatus: "recorded", dataOrigin: "cash_checkout", order: {}, rawMetadata: { necy_has_merch: "true", necy_merch_fulfillment: method } } });
  }
  const unknown = await payload.create({ collection: "checkout-orders", data: { ...data, sourceKey: "synthetic:unknown", order: {}, rawMetadata: {}, checkoutLineItemSummary: "" } });
  assert.equal((await payload.findByID({ collection: "checkout-orders", id: unknown.id })).purchaseSummary, "Purchase details unknown");
  const projectedList = await payload.find({ collection: "checkout-orders", user, overrideAccess: false, pagination: false, select: { sourceKey: true, purchaseSummary: true } });
  assert.ok(projectedList.docs.length >= 5);
  assert.ok(projectedList.docs.every((record) => typeof record.purchaseSummary === "string"));
  assert.match(projectedList.docs.find((record) => record.sourceKey === data.sourceKey)!.purchaseSummary!, /Merchandise/);
  check("concurrent projected list reads all derive summaries without leaking shared request flags");
  check("new synthetic cash and unknown fixtures cover the remaining admin display states");
  console.log(`All ${checks} local integration checks passed. No live APIs or mail providers were called.`);
  success = true;
  if (process.env.KEEP_ORDERS_QA === "true") {
    await writeFile(".orders-qa.json", JSON.stringify({ database, uri, mixedOrderId: created.id, unknownOrderId: unknown.id, adminEmail: admin.email, viewerEmail: viewer.email, password }));
    console.log("Retained isolated synthetic QA database; connection info is in ignored .orders-qa.json.");
  }
} finally {
  await payload.destroy();
  if (!success || process.env.KEEP_ORDERS_QA !== "true") { assert.match(database, /^ypaa_orders_test_[a-f0-9]{32}$/); await client.db().dropDatabase(); }
  await client.close();
}
