import assert from "node:assert/strict";
import test from "node:test";
import type { Payload, PayloadRequest } from "payload";
import type { ScholarshipRepairInput, ScholarshipRepairReceipt } from "../lib/scholarship-repair-input";
import { applyScholarshipRepair, planScholarshipRepair } from "../lib/scholarship-repair";

const purchasedAt = "2026-11-10T20:00:00.000Z";
const stripe: ScholarshipRepairReceipt = {
  sourceKey: "stripe:csv:py_SyntheticScholarship", source: "stripe",
  stripe: { paymentId: "py_SyntheticScholarship", paymentIntentId: "pi_SyntheticScholarship" },
  kind: "donation", grossCents: 2100, amountCents: 2000, priceCents: 4000,
};
const manual: ScholarshipRepairReceipt = {
  sourceKey: `historical:manual:${"f".repeat(64)}`, source: "manual", kind: "donation",
  grossCents: 5700, amountCents: 5700, priceCents: 4000,
};
const fixture = (...receipts: ScholarshipRepairReceipt[]): ScholarshipRepairInput => ({
  format: "scholarship_repair", version: 1, event: "necypaa_xxxvi", receipts,
});
const stripeOrder = {
  id: "synthetic-checkout", sourceKey: "stripe:legacy-source-key", paymentStatus: "paid", paymentSource: "stripe",
  totalCents: stripe.grossCents, purchasedAt, purchaserContact: "synthetic-contributor",
  rawMetadata: { csv_id: stripe.stripe?.paymentId }, updatedAt: purchasedAt,
};
const manualHistory = {
  id: "synthetic-historical-receipt", sourceKey: manual.sourceKey, paymentAliases: [manual.sourceKey],
  paymentSource: "manual", paymentStatus: "recorded", grossCents: manual.grossCents, purchasedAt: null,
  purchaseLines: [{ kind: "scholarship", quantity: 1, amountCents: manual.amountCents,
    ticketEquivalents: manual.amountCents / manual.priceCents, label: "Scholarship fund",
    historicalSource: { sheet: "Manual Ledger", row: 4 } }],
  updatedAt: purchasedAt,
};
const stripeSeat = {
  id: "synthetic-scholarship-seat", sourceKey: `${stripeOrder.sourceKey}:entitlement:general-scholarship:1`,
  checkoutOrder: stripeOrder.id, entitlementType: "general_scholarship", status: "unassigned", fundingSource: "direct_checkout", updatedAt: purchasedAt,
};
const req = { user: { id: "synthetic-administrator", role: "admin" }, transactionID: "synthetic-transaction" } as PayloadRequest;

type Document = { id: string } & Record<string, unknown>;
type Records = Partial<Record<string, Document[]>>;
function mockPayload(records: Records) {
  const contributions = records["scholarship-contributions"] ?? [];
  const updates: Array<{ id: string; data: Record<string, unknown> }> = [];
  const payload = {
    async find({ collection, req: request }: { collection: string; req?: PayloadRequest }) {
      if (request) assert.equal(request, req);
      return { docs: collection === "scholarship-contributions" ? contributions : records[collection] ?? [] };
    },
    async create({ collection, data, req: request }: { collection: string; data: Document; req: PayloadRequest }) {
      assert.equal(collection, "scholarship-contributions");
      assert.equal(request, req);
      const contribution = { ...data, id: `contribution-${contributions.length + 1}` };
      contributions.push(contribution);
      return contribution;
    },
    async update({ collection, id, data, req: request }: { collection: string; id: string; data: Record<string, unknown>; req: PayloadRequest }) {
      assert.equal(collection, "registration-entitlements");
      assert.equal(request, req);
      updates.push({ id, data });
      const seat = records[collection]?.find((doc) => doc.id === id);
      assert.ok(seat);
      Object.assign(seat, data);
    },
  } as unknown as Payload;
  return { payload, contributions, updates };
}

test("links only the verified principal to an existing underfunded seat and retains an undated receipt", async () => {
  const { payload, contributions, updates } = mockPayload({
    "checkout-orders": [stripeOrder],
    "historical-receipts": [manualHistory],
    "registration-entitlements": [structuredClone(stripeSeat)],
  });
  const manifest = fixture(stripe, manual);
  const preview = await planScholarshipRepair(payload, manifest);
  assert.deepEqual(preview.counts, { new: 2, matched: 0, review: 0, principalCents: 7700, allocatedCents: 2000 });
  const options = { sources: [stripe.sourceKey, manual.sourceKey], req, expectedFingerprint: preview.fingerprint, batchID: "batch-1" };
  const result = await applyScholarshipRepair(payload, manifest, options);
  assert.deepEqual(result.counts, { contributions: 2, principalCents: 7700, allocatedCents: 2000 });
  assert.deepEqual(updates, [{ id: stripeSeat.id, data: { fundingContributions: [contributions[0].id] } }]);
  assert.deepEqual(contributions.map(({ checkoutOrder, historicalReceipt, purchasedAt, amountCents, allocatedCents, availableCents }) =>
    [checkoutOrder, historicalReceipt, purchasedAt, amountCents, allocatedCents, availableCents]), [
    [stripeOrder.id, undefined, purchasedAt, 2000, 2000, 0],
    [undefined, manualHistory.id, null, 5700, 0, 5700],
  ]);
  assert.match(String(contributions[0].notes), /only its recorded principal/);
  assert.deepEqual(contributions[1].historicalSource, manualHistory.purchaseLines[0].historicalSource);
  assert.deepEqual((await planScholarshipRepair(payload, manifest)).counts, {
    new: 0, matched: 2, review: 0, principalCents: 0, allocatedCents: 0,
  });
  await assert.rejects(applyScholarshipRepair(payload, manifest, options), /preview changed/);
});

test("preserves an exact existing ledger and holds conflicting checkouts, funding and manual prices", async () => {
  const ledger = {
    id: "existing-contribution", sourceKey: `${stripeOrder.sourceKey}:scholarship-contribution:1`,
    checkoutOrder: stripeOrder.id, contributionType: "general_scholarship",
    amountCents: stripe.amountCents, seatPriceCents: stripe.priceCents, allocatedCents: 1200, availableCents: 800,
    status: "active", fundedEntitlements: [stripeSeat.id],
  };
  const preserved = mockPayload({ "checkout-orders": [stripeOrder], "scholarship-contributions": [ledger] });
  assert.equal((await planScholarshipRepair(preserved.payload, fixture(stripe))).rows[0].action, "matched");
  assert.deepEqual(preserved.contributions, [ledger]);
  const conflicts: Array<{ records: Records; message: RegExp }> = [
    { records: { "checkout-orders": [{ ...stripeOrder, paymentStatus: "refunded" }] }, message: /checkout status/ },
    { records: { "checkout-orders": [stripeOrder, { ...stripeOrder, id: "another-checkout" }] }, message: /Multiple payment/ },
    { records: { "checkout-orders": [{ ...stripeOrder, stripePaymentIntentId: "pi_Different" }] }, message: /payment references/ },
    { records: { "checkout-orders": [stripeOrder], "scholarship-contributions": [{ ...ledger, checkoutOrder: undefined }] }, message: /existing scholarship ledger/ },
    { records: { "checkout-orders": [stripeOrder], "registration-entitlements": [{ ...stripeSeat, fundingContributions: ["previous"] }] }, message: /funding links/ },
  ];
  for (const { records, message } of conflicts) {
    const { payload } = mockPayload(records);
    const { rows } = await planScholarshipRepair(payload, fixture(stripe));
    assert.equal(rows[0].action, "review");
    assert.match(rows[0].message, message);
  }
  const manualConflict = mockPayload({ "historical-receipts": [manualHistory] });
  const { rows } = await planScholarshipRepair(manualConflict.payload, fixture({ ...manual, priceCents: 4500 }));
  assert.equal(rows[0].action, "review");
  assert.match(rows[0].message, /recorded historical receipt matches the scholarship amount and price/);
});

test("only an explicit three-identifier legacy webhook match permits a different export gross", async () => {
  const receipt: ScholarshipRepairReceipt = {
    ...stripe, stripe: { ...stripe.stripe, chargeId: "ch_SyntheticLegacy", checkoutSessionId: "cs_live_SyntheticLegacy" },
    grossCents: 8270, amountCents: 4000, legacyCheckoutTotalCents: 4000,
  };
  const legacyOrder = {
    ...stripeOrder, dataOrigin: "stripe_webhook", totalCents: 4000, subtotalCents: 4000, processingFeeCents: 0,
    stripeCheckoutSessionId: receipt.stripe?.checkoutSessionId, stripePaymentIntentId: receipt.stripe?.paymentIntentId,
    stripeChargeId: receipt.stripe?.chargeId,
  };
  const { payload, contributions, updates } = mockPayload({ "checkout-orders": [legacyOrder] });
  const manifest = fixture(receipt);
  const preview = await planScholarshipRepair(payload, manifest);
  assert.deepEqual(preview.counts, { new: 1, matched: 0, review: 0, principalCents: 4000, allocatedCents: 0 });
  assert.match(preview.rows[0].message, /verified Stripe export gross was \$82\.70.+checkout stores \$40\.00/);
  assert.deepEqual((await applyScholarshipRepair(payload, manifest, {
    req, expectedFingerprint: preview.fingerprint, batchID: "legacy-batch", sources: [receipt.sourceKey],
  })).counts, { contributions: 1, principalCents: 4000, allocatedCents: 0 });
  assert.equal(contributions[0].notes, preview.rows[0].message);
  assert.equal(contributions[0].amountCents, 4000);
  assert.deepEqual(updates, []);
  const alternatives = [
    { receipt: { ...receipt, legacyCheckoutTotalCents: undefined }, order: legacyOrder },
    { receipt, order: { ...legacyOrder, dataOrigin: "stripe_backfill" } },
    { receipt, order: { ...legacyOrder, stripeChargeId: undefined } },
    { receipt, order: { ...legacyOrder, stripePaymentIntentId: "pi_Unrelated" } },
    { receipt, order: { ...legacyOrder, processingFeeCents: 1 } },
    { receipt, order: { ...legacyOrder, subtotalCents: 3900 } },
    { receipt, order: { ...legacyOrder, paymentStatus: "refunded" } },
  ];
  for (const { receipt, order } of alternatives) {
    const { payload } = mockPayload({ "checkout-orders": [order] });
    assert.equal((await planScholarshipRepair(payload, fixture(receipt))).rows[0].action, "review");
  }
});
