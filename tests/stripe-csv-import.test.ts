import assert from "node:assert/strict";
import test from "node:test";

import { normalizeRows, parseCsv } from "../lib/stripe-csv-import";

test("parses quoted commas and escaped quotes", () => {
  const rows = parseCsv('id,Description\nch_1,"NECYPAA, ""Registration"""\n');
  assert.equal(rows[0].Description, 'NECYPAA, "Registration"');
});

test("normalizes missing metadata and filters non-NECYPAA project rows", () => {
  const { normalized, excludedRows } = normalizeRows([
    {
      id: "ch_good", "Created date (UTC)": "2026-08-23 12:00:00", Status: "Paid", Captured: "true", "Decline Reason": "", "Refunded date (UTC)": "", "Amount Refunded": "0", "Converted Amount Refunded": "0", Amount: "67.25", Fee: "2.25", "Taxes On Fee": "0", "Customer Email": "person@example.com", "Customer ID": "cus_1", Description: "Registration", "purchase_type (metadata)": "self", "self_registration_quantity (metadata)": "1", "breakfast_tickets (metadata)": "Breakfast - Saturday x1",
    },
    {
      id: "ch_other", "Created date (UTC)": "2026-08-23 12:00:00", Status: "Paid", Captured: "true", "Decline Reason": "", "Refunded date (UTC)": "", "Amount Refunded": "0", "Converted Amount Refunded": "0", Amount: "20", Fee: "1", "Taxes On Fee": "0", "necy_project_source (metadata)": "other_project",
    },
  ]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].order.selfRegistration, true);
  assert.equal(normalized[0].order.breakfast.saturday, 1);
  assert.equal(normalized[0].context.totalCents, 6725);
  assert.equal(normalized[0].context.processingFeeCents, 225);
  assert.equal(normalized[0].context.subtotalCents, 6500);
  assert.equal(excludedRows[0].reason, "project source is other_project");
});

test("keeps donation-only payments but creates no roster candidate", () => {
  const { normalized } = normalizeRows([{
    id: "py_donation", "Created date (UTC)": "2026-08-23 12:00:00", Status: "Paid", Captured: "true", "Decline Reason": "", "Refunded date (UTC)": "", "Amount Refunded": "0", "Converted Amount Refunded": "0", Amount: "41.50", Fee: "1.50", "Taxes On Fee": "0", "Customer Email": "donor@example.com", "intent (metadata)": "donation", "donation_amount_cents (metadata)": "4000",
  }]);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].category, "donation_only");
  assert.equal(normalized[0].order.selfRegistration, false);
  assert.equal(normalized[0].order.scholarship.enabled, false);
});

test("accepts the registration-site source alias and imports expanded Stripe identifiers", () => {
  const { normalized, excludedRows } = normalizeRows([{
    id: "ch_expanded", "Created date (UTC)": "2026-08-23 12:00:00", Status: "Paid", Captured: "true", "Decline Reason": "", "Refunded date (UTC)": "", "Amount Refunded": "0", "Converted Amount Refunded": "0", Amount: "41.50", Fee: "1.50", "Taxes On Fee": "0", "Customer Email": "payer@example.com", "necy_project_source (metadata)": "necypaa_registration_site", "necy_has_registration (metadata)": "true", "necy_registration_qty_40 (metadata)": "1", "attendee_name (metadata)": "Actual Attendee", "attendee_email (metadata)": "attendee@example.com", "Card Name": "Card Holder", "Card Brand": "Visa", "Card Last4": "4242", "Card Fingerprint": "fingerprint", "Card ID": "card_1", "PaymentIntent ID": "pi_1", "Checkout Session ID": "cs_1", "Payment Source Type": "card", "Checkout Line Item Summary": "Registration (1)",
  }]);
  assert.equal(excludedRows.length, 0);
  assert.equal(normalized.length, 1);
  assert.equal(normalized[0].order.purchaserName, "Card Holder");
  assert.equal(normalized[0].order.attendee.name, "Actual Attendee");
  assert.equal(normalized[0].context.stripePaymentIntentId, "pi_1");
  assert.equal(normalized[0].context.stripeCheckoutSessionId, "cs_1");
  assert.equal(normalized[0].context.cardholderName, "Card Holder");
  assert.equal(normalized[0].context.cardLast4, "4242");
});
