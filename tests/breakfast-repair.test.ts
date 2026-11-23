import assert from "node:assert/strict";
import test from "node:test";
import type { Payload, PayloadRequest } from "payload";
import type { BreakfastTicket, CheckoutOrder } from "@/payload-types";
import { applyBreakfastRepair, BreakfastRepairError, planBreakfastRepair, type BreakfastRepairManifest } from "../lib/breakfast-repair";

const manifest: BreakfastRepairManifest = {
  format: "breakfast_repair",
  version: 1,
  event: "necypaa_xxxvi",
  receipts: [{
    sourceKey: "stripe:csv:py_Synthetic",
    grossCents: 6500,
    stripe: { checkoutSessionId: "cs_live_Synthetic", paymentIntentId: "pi_Synthetic", paymentId: "py_Synthetic" },
    days: [{ day: "friday", quantity: 2, unitPriceCents: 2000 }, { day: "saturday", quantity: 1, unitPriceCents: 2500 }],
  }],
};
const [receipt] = manifest.receipts;
const timestamp = "2026-11-02T02:00:00.000Z";
const order: CheckoutOrder = {
  id: "order-1", sourceKey: "stripe:synthetic-legacy-order", paymentSource: "stripe", paymentStatus: "paid",
  subtotalCents: receipt.grossCents, processingFeeCents: 0, totalCents: receipt.grossCents, order: {},
  purchaserName: "Synthetic Purchaser", purchaserEmail: "synthetic@example.invalid",
  rawMetadata: { csv_id: receipt.stripe.paymentId }, dataOrigin: "stripe_backfill",
  purchasedAt: timestamp, updatedAt: timestamp, createdAt: timestamp,
};
const used: BreakfastTicket = {
  id: "ticket-used", sourceKey: `${order.sourceKey}:breakfast:friday:1`, ticketCode: `BF-friday-${order.sourceKey}-1`.toUpperCase(),
  checkoutOrder: order.id, breakfastDay: "friday", status: "used", unitPriceCents: 2000, paymentSource: "stripe", paymentStatus: "paid",
  purchaserName: order.purchaserName, purchaserEmail: order.purchaserEmail, dataOrigin: "stripe_backfill", holderContact: "existing-holder",
  purchasedAt: timestamp, updatedAt: timestamp, createdAt: timestamp,
};
const req = { user: { id: "admin-1", collection: "users", role: "admin" }, transactionID: "transaction-1" } as PayloadRequest;

function testPayload(orders: CheckoutOrder[], tickets: BreakfastTicket[]) {
  const created: BreakfastTicket[] = [];
  const payload = {
    async find({ collection, where, req: readReq }: { collection: string; where: unknown; req?: PayloadRequest }) {
      if (readReq) assert.equal(readReq, req);
      if (collection === "checkout-orders") {
        assert.deepEqual((where as { or: unknown[] }).or.find((query) =>
          typeof query === "object" && query && "rawMetadata.csv_id" in query),
        { "rawMetadata.csv_id": { in: Object.values(receipt.stripe) } });
        return { docs: orders };
      }
      assert.equal(collection, "breakfast-tickets");
      return { docs: tickets };
    },
    async create({ collection, data, req: writeReq }: { collection: string; data: BreakfastTicket; req: PayloadRequest }) {
      assert.equal(collection, "breakfast-tickets");
      assert.equal(writeReq, req);
      const ticket = { ...data, id: `created-${created.length + 1}`, createdAt: timestamp, updatedAt: timestamp };
      tickets.push(ticket);
      created.push(ticket);
      return ticket;
    },
  } as unknown as Payload;
  return { payload, created };
}

test("creates only missing canonical ticket slots and preserves used admissions", async () => {
  const tickets = [structuredClone(used)];
  const { payload, created } = testPayload([order], tickets);
  const preview = await planBreakfastRepair(payload, manifest);
  assert.deepEqual(preview.counts, { new: 1, matched: 0, review: 0, expectedTickets: 3, missingTickets: 2 });
  assert.deepEqual(preview.rows[0].expected, { friday: 2, saturday: 1, sunday: 0 });
  assert.deepEqual(preview.missingByDay, { friday: 1, saturday: 1, sunday: 0 });

  const journal = await applyBreakfastRepair(payload, manifest, {
    sources: [receipt.sourceKey], expectedFingerprint: preview.fingerprint, req, batchID: "batch-1",
  });
  assert.deepEqual(journal.counts, { receipts: 1, breakfasts: 2 });
  assert.deepEqual(journal.createdByDay, preview.missingByDay);
  assert.deepEqual(journal.created.map(({ sourceKey }) => sourceKey), [
    `${order.sourceKey}:breakfast:friday:2`, `${order.sourceKey}:breakfast:saturday:1`,
  ]);
  assert.deepEqual(created.map((ticket) => [ticket.checkoutOrder, ticket.status, ticket.unitPriceCents, ticket.holderContact]), [
    [order.id, "valid", 2000, undefined], [order.id, "valid", 2500, undefined],
  ]);
  assert.deepEqual(tickets[0], used);

  const repeated = await planBreakfastRepair(payload, manifest);
  assert.deepEqual(repeated.counts, { new: 0, matched: 1, review: 0, expectedTickets: 3, missingTickets: 0 });
  await assert.rejects(applyBreakfastRepair(payload, manifest, {
    sources: [receipt.sourceKey], expectedFingerprint: preview.fingerprint, req, batchID: "batch-2",
  }), /preview changed/);
  assert.equal(created.length, 2);
});

test("holds ambiguous, inactive, amount-mismatched and noncanonical records", async () => {
  const cases = [
    { orders: [], tickets: [], message: /No existing checkout/ },
    { orders: [order, { ...order, id: "duplicate-order", sourceKey: "stripe:cs_live_Synthetic" }], tickets: [], message: /ambiguous/ },
    { orders: [{ ...order, stripePaymentIntentId: "pi_Different" }], tickets: [], message: /disagree/ },
    { orders: [{ ...order, rawMetadata: { csv_id: "py_Different" }, stripeCheckoutSessionId: receipt.stripe.checkoutSessionId }], tickets: [], message: /disagree/ },
    { orders: [{ ...order, paymentStatus: "refunded" } as CheckoutOrder], tickets: [], message: /no longer paid/ },
    { orders: [{ ...order, paymentStatus: "disputed" } as CheckoutOrder], tickets: [], message: /no longer paid/ },
    { orders: [{ ...order, totalCents: 6400 }], tickets: [], message: /reviewed amount/ },
    { orders: [order], tickets: [{ ...used, status: "voided" } as BreakfastTicket], message: /inactive status/ },
    { orders: [order], tickets: [{ ...used, paymentStatus: "disputed" } as BreakfastTicket], message: /inactive status/ },
    { orders: [order], tickets: [{ ...used, sourceKey: "historical-breakfast:other-key" }], message: /duplicate check/ },
  ];
  for (const { orders, tickets, message } of cases) {
    const { payload, created } = testPayload(orders, tickets);
    const preview = await planBreakfastRepair(payload, manifest);
    assert.deepEqual(preview.counts, { new: 0, matched: 0, review: 1, expectedTickets: 3, missingTickets: 0 });
    assert.match(preview.rows[0].message, message);
    await assert.rejects(applyBreakfastRepair(payload, manifest, {
      sources: [receipt.sourceKey], expectedFingerprint: preview.fingerprint, req, batchID: "batch-1",
    }), /safe missing tickets/);
    assert.deepEqual(created, []);
  }
});

test("requires administrator access, a transaction, and a fresh selection", async () => {
  const { payload, created } = testPayload([order], []);
  const preview = await planBreakfastRepair(payload, manifest);
  const confirmation = { sources: [receipt.sourceKey], expectedFingerprint: preview.fingerprint, req, batchID: "batch-1" };
  await assert.rejects(applyBreakfastRepair(payload, manifest, { ...confirmation, req: { ...req, user: null } }), BreakfastRepairError);
  await assert.rejects(applyBreakfastRepair(payload, manifest, { ...confirmation, req: { ...req, transactionID: undefined } }), /database transaction/);
  await assert.rejects(applyBreakfastRepair(payload, manifest, { ...confirmation, sources: [receipt.sourceKey, receipt.sourceKey] }), /distinct receipts/);
  await assert.rejects(applyBreakfastRepair(payload, manifest, { ...confirmation, expectedFingerprint: "stale" }), /preview changed/);
  assert.deepEqual(created, []);
});
