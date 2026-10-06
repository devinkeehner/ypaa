import assert from "node:assert/strict";
import test from "node:test";
import { derivePurchaseDetails, fulfillmentLabel } from "../lib/checkout-order-details";

// Shapes follow the current main-site/Registration Site builders and legacy CSV fixtures.
// All values are synthetic; live document coverage remains a separate verification step.
test("mixed metadata exposes all categories without assuming current prices", () => {
  const result = derivePurchaseDetails({ paymentSource: "cash", rawMetadata: {
    self_registration_quantity: "2", necy_scholarship_qty: "1", scholarship_recipient_name: "General scholarship fund",
    necy_breakfast_friday_qty: "2", necy_breakfast_sunday_qty: "1", necy_breakfast_count: "3",
    necy_has_merch: "true", necy_merch_count: "4", necy_merch_fulfillment: "event_pickup",
  } });
  assert.deepEqual(result.categories, ["registration", "scholarship", "breakfast", "merchandise"]);
  assert.equal(result.registrationQuantity, 2); assert.equal(result.paymentMethod, "Cash");
  assert.equal(result.scholarship?.kind, "general"); assert.equal(result.scholarship?.amountCents, null);
  assert.deepEqual(result.breakfast.days, [{ day: "friday", quantity: 2 }, { day: "sunday", quantity: 1 }]);
  assert.equal(result.merchandise.quantity, 4); assert.equal(result.merchandise.fulfillment, "event_pickup");
});
test("registration price-band quantities are counts, never price estimates", () => {
  const result = derivePurchaseDetails({ rawMetadata: { necy_registration_qty_35: "2", necy_registration_qty_40: "1", necy_registration_qty_45: "3" } });
  assert.equal(result.registrationQuantity, 6); assert.deepEqual(result.categories, ["registration"]);
  assert.doesNotMatch(JSON.stringify(result), /3500|4000|4500/);
});
test("legacy breakfast text supports repeated days, x and multiplication signs", () => {
  const result = derivePurchaseDetails({ order: { breakfast: { friday: 0, saturday: 0 } }, rawMetadata: { breakfast_tickets: "New Year's Day Breakfast - Friday x2, Breakfast - Saturday × 3, Breakfast - Saturday" } });
  assert.deepEqual(result.breakfast.days, [{ day: "friday", quantity: 2 }, { day: "saturday", quantity: 4 }]);
  assert.equal(result.breakfast.totalQuantity, 6);
});
test("legacy total-only breakfast remains unassigned to a day", () => {
  const result = derivePurchaseDetails({ rawMetadata: { breakfast_count: "3", purchase_type: "breakfast_only" } });
  assert.deepEqual(result.breakfast.days, []); assert.equal(result.breakfast.unassignedQuantity, 3);
  assert.match(result.notes.join(), /No day is inferred/);
});
test("malformed, absent and primitive metadata remain safe and unknown", () => {
  for (const rawMetadata of [null, undefined, "not-json", ["friday"], { self_registration_quantity: "NaN", necy_merch_count: "Infinity", necy_breakfast_friday_qty: "-1", breakfast_tickets: "Breakfast - Saturday xbad" }]) {
    const result = derivePurchaseDetails({ rawMetadata });
    assert.equal(result.summary, "Purchase details unknown"); assert.equal(result.registrationQuantity, null);
    assert.equal(result.paymentMethod, "Unknown"); assert.deepEqual(result.breakfast.days, []);
    assert.equal(result.merchandise.fulfillment, "unknown");
  }
});
test("known historical fulfillment choices are shown, missing choices are unknown", () => {
  for (const method of ["shipping", "receive_now", "event_pickup"] as const) {
    const result = derivePurchaseDetails({ rawMetadata: { necy_has_merch: "true", necy_merch_fulfillment: method } });
    assert.equal(result.merchandise.fulfillment, method); assert.notEqual(fulfillmentLabel(method), "Unknown");
  }
  assert.equal(derivePurchaseDetails({ dataOrigin: "stripe_backfill", order: { fulfillmentMethod: "receive_now" }, rawMetadata: { necy_has_merch: "true" } }).merchandise.fulfillment, "unknown");
});
test("linked merchandise records provide purchased names, variants, counts and historical unit prices", () => {
  const result = derivePurchaseDetails({ paymentSource: "stripe", paymentSourceType: "card", rawMetadata: { necy_has_merch: "true" } }, [{ id: "synthetic-merch", fulfillmentMethod: "shipping", shippingStatus: "not_shipped", status: "fulfilled", items: [{ name: "Synthetic shirt", slug: "shirt", variantId: "variant-l", size: "L", color: "Purple", sku: "SYN-L", quantity: 2, unitPriceCents: 1800 }] }]);
  assert.equal(result.paymentMethod, "Stripe · card"); assert.equal(result.merchandise.quantity, 2);
  assert.equal(result.merchandise.items[0].size, "L"); assert.equal(result.merchandise.items[0].unitPriceCents, 1800);
  assert.deepEqual(result.merchandise.records, [{ id: "synthetic-merch", status: "fulfilled" }]);
});
test("partially known merchandise never invents variants, quantities or current catalog prices", () => {
  const result = derivePurchaseDetails({ order: { merchandise: [{ slug: "old-shirt", variantId: "old-id", quantity: "bad" }] }, checkoutLineItemSummary: "Historical shirt (Purple / L) × 2 — $36.00" });
  assert.equal(result.merchandise.items[0].name, null); assert.equal(result.merchandise.items[0].quantity, null);
  assert.equal(result.merchandise.items[0].size, null); assert.equal(result.merchandise.items[0].unitPriceCents, null);
  assert.match(result.merchandise.reportedLineItems!, /Historical shirt/);
});
test("ambiguous related merchandise orders are not combined or assigned a delivery method", () => {
  const result = derivePurchaseDetails({ rawMetadata: { necy_merch_fulfillment: "shipping" } }, [{ id: "first", fulfillmentMethod: "shipping", items: [{ name: "Shirt", quantity: 1 }] }, { id: "second", fulfillmentMethod: "event_pickup", items: [{ name: "Shirt", quantity: 3 }] }]);
  assert.equal(result.merchandise.fulfillment, "unknown"); assert.deepEqual(result.merchandise.items, []);
  assert.equal(result.merchandise.records.length, 2); assert.match(result.notes.join(), /Multiple merchandise orders/);
});
test("specific scholarship details show recorded recipient and attribution", () => {
  const result = derivePurchaseDetails({ dataOrigin: "cash_checkout", order: { scholarship: { enabled: true, kind: "specific", amountCents: 4500, recipientName: "Synthetic Recipient", recipientEmail: "recipient@example.invalid", attribution: "Synthetic Group" } } }, [], true);
  assert.equal(result.scholarship?.kind, "specific"); assert.equal(result.scholarship?.amountCents, 4500);
  assert.equal(result.scholarship?.recipientName, "Synthetic Recipient"); assert.equal(result.scholarship?.attribution, "Synthetic Group");
});
test("sparse subsequent reports retain original scholarship attribution with current values taking precedence", () => {
  const purchaseSnapshot = derivePurchaseDetails({ order: { scholarship: { enabled: true, kind: "specific", amountCents: 4500, recipientName: "Synthetic Recipient", attribution: "Original Synthetic Group" } } }, [], true);
  const sparse = { order: { scholarship: { enabled: true } }, rawMetadata: { necy_has_scholarship: "true" }, purchaseSnapshot };
  const before = structuredClone(sparse);
  assert.equal(derivePurchaseDetails(sparse).scholarship?.attribution, "Original Synthetic Group");
  assert.equal(derivePurchaseDetails({ ...sparse, order: { scholarship: { enabled: true, attribution: "Current Order Group" } } }).scholarship?.attribution, "Current Order Group");
  assert.equal(derivePurchaseDetails({ ...sparse, rawMetadata: { attribution_aa_entity: "Current Metadata Group" } }).scholarship?.attribution, "Current Metadata Group");
  assert.equal(derivePurchaseDetails({ ...sparse, purchaseSnapshot: { version: 1, scholarship: { attribution: [] } } }).scholarship?.attribution, null);
  assert.equal(derivePurchaseDetails({ ...sparse, purchaseSnapshot: { version: 2, scholarship: { attribution: "Unsupported" } } }).scholarship?.attribution, null);
  assert.deepEqual(sparse, before);
});
test("historical cash normalization also cannot establish a contribution amount", () => {
  const result = derivePurchaseDetails({ dataOrigin: "cash_checkout", order: { scholarship: { enabled: true, kind: "general", amountCents: 4000 } } });
  assert.equal(result.scholarship?.amountCents, null); assert.equal(result.scholarship?.kind, "unknown");
});
test("conflicting counts and delivery choices report provenance without rewriting sources", () => {
  const input = { subtotalCents: 9999, totalCents: 10222, paymentStatus: "refunded", sourceKey: "synthetic:immutable", rawMetadata: { self_registration_quantity: "1", necy_registration_qty_40: "2", necy_breakfast_friday_qty: "2", breakfast_tickets: "Breakfast - Friday x1", necy_breakfast_count: "1", necy_merch_fulfillment: "shipping" } };
  const before = structuredClone(input);
  const result = derivePurchaseDetails(input, [{ id: "synthetic-merch", fulfillmentMethod: "event_pickup" }]);
  assert.equal(result.registrationQuantity, 1); assert.equal(result.breakfast.totalQuantity, 1);
  assert.equal(result.breakfast.days[0].quantity, 2); assert.equal(result.merchandise.fulfillment, "event_pickup");
  assert.match(result.notes.join(), /disagree/); assert.deepEqual(input, before);
});
test("a scholarship's broad has_registration flag does not invent a self registration", () => {
  const result = derivePurchaseDetails({ rawMetadata: { necy_has_registration: "true", necy_has_scholarship: "true", self_registration_quantity: "0", necy_scholarship_qty: "1", scholarship_recipient_name: "General scholarship" } });
  assert.deepEqual(result.categories, ["scholarship"]); assert.equal(result.registrationQuantity, 0);
});
