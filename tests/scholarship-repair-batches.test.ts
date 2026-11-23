import assert from "node:assert/strict";
import test from "node:test";
import { createLocalReq, getPayload } from "payload";
import { confirmScholarshipRepair, previewScholarshipRepair } from "../lib/scholarship-repair-batches";
import type { ScholarshipRepairReceipt } from "../lib/scholarship-repair-input";
import { historicalImportStatusTool } from "../mcp/historical-import-status";

const uri = new URL(process.env.DATABASE_URI || "mongodb://localhost");
if (uri.protocol !== "mongodb:" || uri.host !== "127.0.0.1:27029" ||
    !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname) || uri.searchParams.get("replicaSet") !== "ypaaTest") {
  throw new Error("Use the isolated registration runner.");
}

const purchasedAt = "2026-10-06T18:00:00.000Z";
const dateSource = { sheet: "Manual Ledger", row: 8 };
const approvedStripe: ScholarshipRepairReceipt = {
  sourceKey: "stripe:csv:ch_SCHOLARSHIPFIXTURE", source: "stripe", kind: "general",
  grossCents: 9200, amountCents: 9000, priceCents: 4500,
  stripe: { checkoutSessionId: "cs_live_SCHOLARSHIPFIXTURE", paymentIntentId: "pi_SCHOLARSHIPFIXTURE", chargeId: "ch_SCHOLARSHIPFIXTURE" },
};
const approvedManual: ScholarshipRepairReceipt = {
  sourceKey: `historical:manual:${"f".repeat(64)}`, source: "manual", kind: "donation",
  grossCents: 4700, amountCents: 4700, priceCents: 4000,
};
const mismatched: ScholarshipRepairReceipt = {
  sourceKey: "stripe:csv:ch_SCHOLARSHIPMISMATCH", source: "stripe", kind: "donation",
  grossCents: 4100, amountCents: 4000, priceCents: 4000, stripe: { chargeId: "ch_SCHOLARSHIPMISMATCH" },
};

test("scholarship repair adds only supported contributions and links an existing seat without changing its assignment", { timeout: 120_000 }, async () => {
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  try {
    const admin = await payload.create({ collection: "users", data: {
      email: "scholarship-admin@example.invalid", password: "SyntheticScholarshipPassword123!", role: "admin",
    } });
    const [viewer, payer, recipient] = await Promise.all([
      payload.create({ collection: "users", data: {
        email: "scholarship-viewer@example.invalid", password: "SyntheticScholarshipPassword123!", role: "viewer",
      } }),
      payload.create({ collection: "contacts", data: {
        contactKey: "contact:scholarship-test-purchaser", displayName: "Synthetic Treasurer", email: "purchaser@example.invalid", communicationConsent: "unknown",
      } }),
      payload.create({ collection: "contacts", data: {
        contactKey: "contact:scholarship-test-recipient", displayName: "Synthetic Recipient", email: "recipient@example.invalid", communicationConsent: "unknown",
      } }),
    ]);
    const checkoutData = {
      purchaserName: payer.displayName, purchaserEmail: payer.email, purchaserContact: payer.id,
      purchasedAt, paymentSource: "stripe" as const, paymentStatus: "paid" as const, dataOrigin: "stripe_backfill" as const,
      processingFeeCents: 200, order: {},
    };
    const [checkout, heldCheckout, manualReceipt] = await Promise.all([
      payload.create({ collection: "checkout-orders", depth: 0, data: {
        ...checkoutData, sourceKey: "stripe:cs_live_SCHOLARSHIPFIXTURE",
        stripeCheckoutSessionId: approvedStripe.stripe?.checkoutSessionId, stripePaymentIntentId: approvedStripe.stripe?.paymentIntentId,
        stripeChargeId: approvedStripe.stripe?.chargeId, subtotalCents: 9000, totalCents: 9200,
      } }),
      payload.create({ collection: "checkout-orders", depth: 0, data: {
        ...checkoutData, sourceKey: mismatched.sourceKey, stripeChargeId: mismatched.stripe?.chargeId,
        subtotalCents: 4800, totalCents: 5000,
      } }),
      payload.create({ collection: "historical-receipts", depth: 0, overrideAccess: true, data: {
        sourceKey: approvedManual.sourceKey, paymentAliases: [approvedManual.sourceKey], receiptReference: approvedManual.sourceKey,
        paymentSource: "manual", paymentStatus: "recorded", paymentMethod: "cash", currency: "USD", grossCents: approvedManual.grossCents,
        historicalSource: dateSource, purchaseLines: [{ sourceLineId: "scholarship-1", kind: "scholarship", label: "Scholarship fund",
          quantity: 1, amountCents: approvedManual.amountCents, ticketEquivalents: approvedManual.amountCents / approvedManual.priceCents,
          historicalSource: dateSource }],
      } }),
    ]);
    const seat = await payload.create({ collection: "registration-entitlements", depth: 0, data: {
      sourceKey: `${checkout.sourceKey}:entitlement:general-scholarship:1`, checkoutOrder: checkout.id, purchaserContact: payer.id,
      entitlementType: "general_scholarship", status: "assigned", attendeeContact: recipient.id, assignedAt: purchasedAt,
      assignmentNote: "Existing synthetic assignment", fundingSource: "direct_checkout", sourceMetadata: { seatPriceCents: 4500 },
    } });
    const fileText = JSON.stringify({ format: "scholarship_repair", version: 1, event: "necypaa_xxxvi",
      receipts: [approvedStripe, approvedManual, mismatched] });
    const previewFile = { fileText, filename: "scholarship-repair-synthetic.json" };
    await assert.rejects(previewScholarshipRepair(payload, viewer, previewFile), /Administrator/);
    const preview = await previewScholarshipRepair(payload, admin, previewFile);
    assert.deepEqual(preview.plan.counts, { new: 2, matched: 0, review: 1, principalCents: 13700, allocatedCents: 4500 });
    assert.deepEqual(preview.plan.rows.map(({ action }) => action), ["new", "new", "review"]);
    assert.match(preview.plan.rows[2].message, /checkout status, amount/);
    assert.doesNotMatch(JSON.stringify(preview), /example\.invalid|Synthetic Recipient/);

    const confirm = { ...previewFile, id: preview.id, fingerprint: preview.plan.fingerprint,
      sources: [approvedStripe.sourceKey, approvedManual.sourceKey], confirmPayment: true, confirmScope: true };
    await assert.rejects(confirmScholarshipRepair(payload, admin, { ...confirm, confirmPayment: false }), /Verify the payments/);
    await assert.rejects(confirmScholarshipRepair(payload, admin, { ...confirm, fileText: `${fileText}\n` }), /does not match/);
    await assert.rejects(confirmScholarshipRepair(payload, admin, { ...confirm, sources: [...confirm.sources, mismatched.sourceKey] }), /Select only receipts/);
    assert.equal((await payload.count({ collection: "scholarship-contributions" })).totalDocs, 0);
    const stale = await previewScholarshipRepair(payload, admin, previewFile);
    const completed = await confirmScholarshipRepair(payload, admin, confirm);
    assert.deepEqual(completed.counts, { contributions: 2, principalCents: 13700, allocatedCents: 4500 });
    assert.deepEqual(await confirmScholarshipRepair(payload, admin, { ...confirm, sources: confirm.sources.toReversed() }), completed);
    await assert.rejects(confirmScholarshipRepair(payload, admin, { ...confirm, sources: [approvedManual.sourceKey] }), /another selection/);
    await assert.rejects(confirmScholarshipRepair(payload, admin, { ...confirm, id: stale.id, fingerprint: stale.plan.fingerprint }), /preview changed/);

    const { docs: contributions } = await payload.find({ collection: "scholarship-contributions", depth: 0, limit: 10 });
    assert.equal(contributions.length, 2);
    const stripe = contributions.find(({ checkoutOrder }) => checkoutOrder === checkout.id);
    const manual = contributions.find(({ historicalReceipt }) => historicalReceipt === manualReceipt.id);
    assert.ok(stripe);
    assert.ok(manual);
    assert.deepEqual([stripe.contributionType, stripe.amountCents, stripe.allocatedCents, stripe.availableCents, stripe.seatPriceCents],
      ["general_scholarship", 9000, 4500, 4500, 4500]);
    assert.equal(stripe.contributorContact, payer.id);
    assert.deepEqual(stripe.fundedEntitlements, [seat.id]);
    assert.deepEqual([manual.contributionType, manual.amountCents, manual.allocatedCents, manual.availableCents],
      ["general_donation", 4700, 0, 4700]);
    assert.equal(manual.checkoutOrder ?? null, null);
    assert.equal(manual.purchasedAt ?? null, null);
    assert.equal(manual.historicalSource?.sheet, dateSource.sheet);
    assert.equal(manual.historicalSource?.row, dateSource.row);

    const updatedSeat = await payload.findByID({ collection: "registration-entitlements", id: seat.id, depth: 0 });
    assert.deepEqual(updatedSeat.fundingContributions, [stripe.id]);
    assert.deepEqual({ ...updatedSeat, updatedAt: seat.updatedAt, fundingContributions: [] }, { ...seat, fundingContributions: [] });
    for (const original of [checkout, heldCheckout]) {
      const reread = await payload.findByID({ collection: "checkout-orders", id: original.id, depth: 0 });
      assert.deepEqual([reread.updatedAt, reread.totalCents, reread.paymentStatus], [original.updatedAt, original.totalCents, original.paymentStatus]);
    }
    assert.equal((await payload.findByID({ collection: "historical-receipts", id: manualReceipt.id })).updatedAt, manualReceipt.updatedAt);
    assert.equal((await payload.count({ collection: "checkout-orders" })).totalDocs, 2);
    assert.equal((await payload.count({ collection: "historical-receipts" })).totalDocs, 1);
    assert.equal((await payload.count({ collection: "registration-entitlements" })).totalDocs, 1);
    assert.equal((await payload.count({ collection: "attendees" })).totalDocs, 0);

    const replay = await previewScholarshipRepair(payload, admin, previewFile);
    assert.deepEqual(replay.plan.counts, { new: 0, matched: 2, review: 1, principalCents: 0, allocatedCents: 0 });
    const req = await createLocalReq({ user: admin }, payload);
    const status = await historicalImportStatusTool.handler({}, req, {});
    const response = status.content[0].text;
    assert.doesNotMatch(response, /SCHOLARSHIPFIXTURE|example\.invalid|scholarship-repair-synthetic\.json/);
    const batches: { id: string; format: string; status: string; importedCounts: unknown }[] = JSON.parse(response);
    const audited = batches.find(({ id }) => id === completed.id);
    assert.equal(audited?.status, "imported");
    assert.equal(audited?.format, "scholarship_repair");
    assert.deepEqual(audited?.importedCounts, completed.counts);
  } finally {
    await payload.db.connection.dropDatabase();
  }
});
