import assert from "node:assert/strict";
import test from "node:test";
import { createLocalReq, getPayload } from "payload";
import { checkoutFixture, historicalManifest, manualReceiptFixture } from "./historical-import-fixture";
import { confirmHistoricalImport, previewHistoricalImport } from "../lib/historical-import-batches";
import { historicalImportStatusTool } from "../mcp/historical-import-status";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname)) throw new Error("Use the isolated registration runner.");
const bytes = (manifest = historicalManifest()) => Buffer.from(JSON.stringify(manifest));

test("historical import creates typed purchases, resumes safely, skips duplicates, and returns aggregate status", { timeout: 120_000 }, async () => {
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  const admin = await payload.create({ collection: "users", data: { email: "historical-admin@example.invalid", password: "SyntheticHistoricalPassword123!", role: "admin" } });
  const viewer = await payload.create({ collection: "users", data: { email: "historical-viewer@example.invalid", password: "SyntheticHistoricalPassword123!", role: "viewer" } });
  try {
    const payment = checkoutFixture();
    const manifest = historicalManifest([payment, ...Array.from({ length: 20 }, (_, index) => manualReceiptFixture(index + 1))]);
    const file = bytes(manifest);
    await assert.rejects(previewHistoricalImport(payload, viewer, file, "test.json"), /Administrator/);
    const preview = await previewHistoricalImport(payload, admin, file, "synthetic.json");
    assert.equal(preview.plan.counts.new, 21);
    assert.equal(preview.plan.counts.breakfasts, 3);
    assert.equal(preview.plan.answerCounts.fellowship, 1);
    assert.equal(preview.plan.answerCounts.interpretation, 1);
    assert.doesNotMatch(JSON.stringify(preview), /historical-attendee@example|Synthetic confidential answer/);
    const confirm = {
      id: preview.id, fingerprint: preview.plan.fingerprint,
      sources: manifest.payments.map(({ sourceKey }) => sourceKey),
      confirmPayment: true, confirmAttendees: true, confirmScope: true,
    };
    await assert.rejects(confirmHistoricalImport(payload, admin, Buffer.concat([file, Buffer.from("\n")]), confirm), /does not match/);
    const first = await confirmHistoricalImport(payload, admin, file, confirm);
    assert.equal(first.done, false);
    assert.equal(first.processed, 20);
    assert.equal((await payload.count({ collection: "historical-receipts" })).totalDocs, 20);
    await assert.rejects(confirmHistoricalImport(payload, admin, file, { ...confirm, sources: [payment.sourceKey] }), /different selection/);
    const completed = await confirmHistoricalImport(payload, admin, file, confirm);
    assert.equal(completed.done, true);
    assert.equal(completed.counts.receipts, 21);
    assert.equal(completed.counts.breakfasts, 3);
    assert.deepEqual(await confirmHistoricalImport(payload, admin, file, confirm), completed);

    const { docs: [order] } = await payload.find({ collection: "checkout-orders", depth: 0 });
    assert.equal(order.totalCents, 19_000);
    assert.equal(order.stripeFeeCents, 100);
    assert.equal(order.purchaseLines?.find(({ kind }) => kind === "merchandise")?.quantity, 2);
    const { docs: [attendee] } = await payload.find({ collection: "attendees", depth: 0 });
    assert.equal(attendee.purchaserEmail, "historical-payer@example.invalid");
    assert.deepEqual(attendee.fellowships, ["aa", "al_anon"]);
    assert.equal(attendee.mobilityAccessibilityAnswer, "yes");
    assert.equal(attendee.interpretationNeededAnswer, "no");
    assert.equal(attendee.willingToServeAnswer, "unanswered");
    const { docs: breakfasts } = await payload.find({ collection: "breakfast-tickets", depth: 0 });
    assert.equal(breakfasts.filter(({ breakfastDay }) => breakfastDay === "friday").length, 2);
    assert.equal(new Set(breakfasts.map(({ ticketCode }) => ticketCode)).size, 3);
    assert.ok(breakfasts.every(({ checkoutOrder }) => checkoutOrder === order.id));
    assert.equal((await payload.count({ collection: "scholarship-contributions" })).totalDocs, 1);
    assert.equal((await payload.count({ collection: "merchandise-orders" })).totalDocs, 0);

    const alias = { ...payment, sourceKey: "stripe:csv:py_HISTORICALOTHER", stripe: { paymentId: "py_HISTORICALOTHER", paymentIntentId: payment.stripe?.paymentIntentId } };
    const next = await previewHistoricalImport(payload, admin, bytes(historicalManifest([alias])), "alias.json");
    assert.equal(next.plan.counts.matched, 1);
    assert.equal(next.plan.counts.new, 0);
    assert.equal((await payload.findByID({ collection: "checkout-orders", id: order.id })).updatedAt, order.updatedAt);
    const req = await createLocalReq({ user: admin }, payload);
    const status = await historicalImportStatusTool.handler({}, req, {});
    assert.match(status.content[0].text, /"receipts":21/);
    assert.doesNotMatch(status.content[0].text, /example\.invalid|ch_HISTORICAL|synthetic\.json|Synthetic confidential answer/);
    const viewerRequest = await createLocalReq({ user: viewer }, payload);
    await assert.rejects(async () => historicalImportStatusTool.handler({}, viewerRequest, {}), /Administrator/);
  } finally {
    await payload.db.connection.dropDatabase();
  }
});
