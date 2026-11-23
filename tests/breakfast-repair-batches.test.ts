import assert from "node:assert/strict";
import test from "node:test";
import { createLocalReq, getPayload } from "payload";
import { confirmBreakfastRepair, previewBreakfastRepair } from "../lib/breakfast-repair-batches";
import { historicalImportStatusTool } from "../mcp/historical-import-status";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname)) {
  throw new Error("Use the isolated registration runner.");
}

test("breakfast repair adds only missing linked tickets and audits a safe retry", { timeout: 120_000 }, async () => {
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  try {
    const admin = await payload.create({ collection: "users", data: {
      email: "breakfast-admin@example.invalid", password: "SyntheticBreakfastPassword123!", role: "admin",
    } });
    const viewer = await payload.create({ collection: "users", data: {
      email: "breakfast-viewer@example.invalid", password: "SyntheticBreakfastPassword123!", role: "viewer",
    } });
    const checkout = await payload.create({ collection: "checkout-orders", data: {
      sourceKey: "stripe:cs_live_BATCHFIXTURE", purchaserName: "Synthetic Payer", purchaserEmail: "breakfast-payer@example.invalid",
      stripeCheckoutSessionId: "cs_live_BATCHFIXTURE", stripePaymentIntentId: "pi_BATCHFIXTURE", stripeChargeId: "ch_BATCHFIXTURE",
      subtotalCents: 7500, processingFeeCents: 0, totalCents: 7500, paymentSource: "stripe", paymentStatus: "paid",
      purchasedAt: "2026-10-06T18:00:00Z", dataOrigin: "stripe_backfill", order: {},
    } });
    const firstTicket = await payload.create({ collection: "breakfast-tickets", data: {
      sourceKey: `${checkout.sourceKey}:breakfast:friday:1`, ticketCode: "BF-SYNTHETIC-FRIDAY-1",
      checkoutOrder: checkout.id, breakfastDay: "friday", status: "used", unitPriceCents: 2500,
      purchaserName: checkout.purchaserName, purchaserEmail: checkout.purchaserEmail, purchasedAt: checkout.purchasedAt,
      paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "stripe_backfill",
    } });
    const sourceKey = "stripe:csv:ch_BATCHFIXTURE";
    const fileText = JSON.stringify({
      format: "breakfast_repair", version: 1, event: "necypaa_xxxvi", receipts: [{
        sourceKey, stripe: {
          checkoutSessionId: checkout.stripeCheckoutSessionId, paymentIntentId: checkout.stripePaymentIntentId, chargeId: checkout.stripeChargeId,
        },
        grossCents: 7500, days: [{ day: "friday", quantity: 2, unitPriceCents: 2500 }, { day: "sunday", quantity: 1, unitPriceCents: 2500 }],
      }],
    });
    await assert.rejects(previewBreakfastRepair(payload, viewer, { fileText }), /Administrator/);
    const preview = await previewBreakfastRepair(payload, admin, { fileText, filename: "breakfast.json" });
    assert.deepEqual(preview.plan.missingByDay, { friday: 1, saturday: 0, sunday: 1 });
    assert.doesNotMatch(JSON.stringify(preview), /example\.invalid/);
    const confirm = { fileText, id: preview.id, fingerprint: preview.plan.fingerprint, sources: [sourceKey], confirmPayment: true, confirmScope: true };
    await assert.rejects(confirmBreakfastRepair(payload, admin, { ...confirm, fileText: `${fileText}\n` }), /does not match/);
    const stale = await previewBreakfastRepair(payload, admin, { fileText });
    const completed = await confirmBreakfastRepair(payload, admin, confirm);
    assert.deepEqual(completed.counts, { receipts: 1, breakfasts: 2 });
    assert.deepEqual(await confirmBreakfastRepair(payload, admin, confirm), completed);
    await assert.rejects(confirmBreakfastRepair(payload, admin, { ...confirm, id: stale.id }), /preview changed/);

    const { docs: tickets } = await payload.find({ collection: "breakfast-tickets", depth: 0, limit: 10 });
    assert.equal(tickets.length, 3);
    assert.ok(tickets.every((ticket) => ticket.checkoutOrder === checkout.id));
    assert.equal(tickets.find((ticket) => ticket.id === firstTicket.id)?.status, "used");
    assert.ok(tickets.some((ticket) => ticket.sourceKey === `${checkout.sourceKey}:breakfast:friday:2`));
    assert.equal((await payload.findByID({ collection: "checkout-orders", id: checkout.id })).updatedAt, checkout.updatedAt);
    for (const collection of ["attendees", "registration-entitlements", "scholarship-contributions", "merchandise-orders"] as const) {
      assert.equal((await payload.count({ collection })).totalDocs, 0);
    }
    const rerun = await previewBreakfastRepair(payload, admin, { fileText });
    assert.equal(rerun.plan.counts.matched, 1);
    assert.equal(rerun.plan.counts.missingTickets, 0);
    const req = await createLocalReq({ user: admin }, payload);
    const status = await historicalImportStatusTool.handler({}, req, {});
    assert.match(status.content[0].text, /"breakfasts":2/);
    assert.doesNotMatch(status.content[0].text, /example\.invalid|BATCHFIXTURE|breakfast\.json/);
  } finally {
    await payload.db.connection.dropDatabase();
  }
});
