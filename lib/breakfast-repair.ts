import { createHash } from "node:crypto";
import type { Payload, PayloadRequest, Where } from "payload";
import type { BreakfastTicket, CheckoutOrder } from "@/payload-types";
import {
  BREAKFAST_REPAIR_MAX_CONFIRM_TICKETS,
  BREAKFAST_REPAIR_MAX_RECEIPTS,
  type BreakfastRepairDay,
  type BreakfastRepairInput,
  type BreakfastRepairReceipt,
} from "./breakfast-repair-input";
import { isAdministrator } from "./crm-access";
import { ImportError } from "./registration-tracker";

export { parseBreakfastRepair } from "./breakfast-repair-input";
export type { BreakfastRepairDay, BreakfastRepairInput, BreakfastRepairReceipt } from "./breakfast-repair-input";
export type BreakfastRepairManifest = BreakfastRepairInput;

const days = ["friday", "saturday", "sunday"] as const;
const stripeFields = ["stripeCheckoutSessionId", "stripePaymentIntentId", "stripeChargeId"] as const;
const maxPreviewTickets = 500;
const zero = () => ({ friday: 0, saturday: 0, sunday: 0 });
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const sum = (quantities: DayCounts) => days.reduce((total, day) => total + quantities[day], 0);
type DayCounts = Record<BreakfastRepairDay, number>;

type PlanRow = {
  sourceKey: string;
  action: "new" | "matched" | "review";
  fingerprint: string;
  message: string;
  expected: DayCounts;
  missing: DayCounts;
};

export type BreakfastRepairPlan = {
  fingerprint: string;
  rows: PlanRow[];
  counts: { new: number; matched: number; review: number; expectedTickets: number; missingTickets: number };
  missingByDay: DayCounts;
};

export type BreakfastRepairJournal = {
  sources: string[];
  created: { collection: "breakfast-tickets"; id: string; sourceKey: string }[];
  counts: { receipts: number; breakfasts: number };
  createdByDay: DayCounts;
};

type Identified = Pick<BreakfastTicket, "sourceKey" | "rawMetadata" | typeof stripeFields[number]> & { stripePaymentId?: string | null };
type RepairCheckout = Pick<CheckoutOrder, keyof Identified | "id" | "stripeCustomerId" | "paymentSource" | "paymentStatus" | "totalCents" |
  "purchasedAt" | "purchaserName" | "purchaserEmail" | "updatedAt">;
type Candidate = { receipt: BreakfastRepairReceipt; ids: Set<string>; keys: Set<string>; expected: DayCounts; orders: RepairCheckout[] };
type Write = { receipt: BreakfastRepairReceipt; order: RepairCheckout; day: BreakfastRepairDay; ordinal: number; unitPriceCents: number };

export class BreakfastRepairError extends ImportError {}

function candidateFor(receipt: BreakfastRepairReceipt): Candidate {
  const ids = new Set(Object.values(receipt.stripe).filter((value): value is string => typeof value === "string"));
  const keys = new Set([receipt.sourceKey, ...[...ids].flatMap((id) => [
    `stripe:${id}`, `stripe:csv:${id}`, `registration-import:stripe:${id}`,
  ])]);
  const expected = zero();
  for (const item of receipt.days) expected[item.day] = item.quantity;
  return { receipt, ids, keys, expected, orders: [] };
}

function sourceTicketKey(orderKey: string, day: BreakfastRepairDay, ordinal: number) {
  return `${orderKey}:breakfast:${day}:${ordinal}`;
}

function ticketParts(sourceKey?: string | null) {
  const result = sourceKey?.match(/^(.+):breakfast:(friday|saturday|sunday):([1-9]\d*)$/);
  return result ? { orderKey: result[1], day: result[2], ordinal: Number(result[3]) } : undefined;
}

function legacyCSVId(record: Identified) {
  const metadata = record.rawMetadata;
  const value = metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata.csv_id : undefined;
  return typeof value === "string" ? value : undefined;
}

function matchesReceipt(record: Identified, { keys, ids }: Pick<Candidate, "keys" | "ids">, ticket = false) {
  const sourceKey = ticket ? ticketParts(record.sourceKey)?.orderKey : record.sourceKey;
  return Boolean((sourceKey && keys.has(sourceKey)) ||
    [record.stripeCheckoutSessionId, record.stripePaymentIntentId, record.stripeChargeId, record.stripePaymentId, legacyCSVId(record)]
      .some((id) => id && ids.has(id)));
}

function conflictingStripeReference(record: Identified, receipt: BreakfastRepairReceipt) {
  const { checkoutSessionId, paymentIntentId, chargeId, paymentId } = receipt.stripe;
  if (record.stripeCheckoutSessionId && record.stripeCheckoutSessionId !== checkoutSessionId) return true;
  if (record.stripePaymentIntentId && record.stripePaymentIntentId !== paymentIntentId) return true;
  // A legacy export's py_ alias and the charge's ch_ ID can coexist. When both
  // sides have an identifier of the same kind, it must match exactly.
  return [record.stripeChargeId, record.stripePaymentId, legacyCSVId(record)].some((id) =>
    typeof id === "string" && Boolean((id.startsWith("ch_") && chargeId && id !== chargeId) ||
      (id.startsWith("py_") && paymentId && id !== paymentId)));
}

function relationshipID(value: BreakfastTicket["checkoutOrder"]) {
  return typeof value === "string" ? value : value?.id;
}

async function buildPlan(payload: Payload, manifest: BreakfastRepairManifest, req?: PayloadRequest) {
  const candidates = manifest.receipts.map(candidateFor);
  const expectedTickets = candidates.reduce((total, candidate) => total + sum(candidate.expected), 0);
  if (expectedTickets > maxPreviewTickets) throw new BreakfastRepairError(`Split the repair file into previews with at most ${maxPreviewTickets} tickets.`);

  const ids = [...new Set(candidates.flatMap((candidate) => [...candidate.ids]))];
  const keys = [...new Set(candidates.flatMap((candidate) => [...candidate.keys]))];
  const options = { overrideAccess: true, depth: 0, pagination: false, req, context: { skipCheckoutPurchaseDisplay: true } } as const;
  const stripeWhere: Where[] = [...stripeFields.map((field) => ({ [field]: { in: ids } })), { "rawMetadata.csv_id": { in: ids } }];
  const { docs: orders } = await payload.find({
    ...options,
    collection: "checkout-orders",
    where: { or: [{ sourceKey: { in: keys } }, { stripePaymentId: { in: ids } }, ...stripeWhere] },
    select: {
      sourceKey: true, stripeCheckoutSessionId: true, stripePaymentIntentId: true, stripeChargeId: true, stripePaymentId: true, rawMetadata: true,
      stripeCustomerId: true, paymentSource: true, paymentStatus: true, totalCents: true, purchasedAt: true, purchaserName: true, purchaserEmail: true, updatedAt: true,
    },
  });
  const orderReceipts = new Map<string, number>();
  for (const candidate of candidates) {
    candidate.orders = orders.filter((order) => matchesReceipt(order, candidate));
    for (const order of candidate.orders) orderReceipts.set(order.id, (orderReceipts.get(order.id) ?? 0) + 1);
  }
  const possibleTicketKeys = candidates.flatMap(({ keys: sourceKeys, expected, orders: matches }) =>
    [...new Set([...sourceKeys, ...matches.map(({ sourceKey }) => sourceKey)])].flatMap((key) =>
      days.flatMap((day) => Array.from({ length: expected[day] }, (_, i) => sourceTicketKey(key, day, i + 1)))));
  const { docs: tickets } = await payload.find({
    ...options,
    collection: "breakfast-tickets",
    where: { or: [
      { sourceKey: { in: possibleTicketKeys } }, { checkoutOrder: { in: orders.map(({ id }) => id) } }, ...stripeWhere,
    ] },
    select: {
      sourceKey: true, stripeCheckoutSessionId: true, stripePaymentIntentId: true, stripeChargeId: true, rawMetadata: true,
      checkoutOrder: true, status: true, paymentSource: true, paymentStatus: true, breakfastDay: true, updatedAt: true,
    },
  });
  const writes = new Map<string, Write[]>();
  const rows = candidates.map((candidate): PlanRow => {
    const { receipt, orders: matches, expected } = candidate;
    const checkoutIDs = new Set(matches.map(({ id }) => id));
    // Include children that only retain the matched checkout's original source key.
    const reference = { ids: candidate.ids, keys: new Set([...candidate.keys, ...matches.map(({ sourceKey }) => sourceKey)]) };
    const related = tickets.filter((ticket) => {
      const parent = relationshipID(ticket.checkoutOrder);
      return (parent && checkoutIDs.has(parent)) || matchesReceipt(ticket, reference, true);
    });
    const fingerprint = digest([
      receipt,
      matches.map((item) => [item.id, item.updatedAt, item.sourceKey, item.paymentStatus, item.totalCents]).sort(),
      related.map((item) => [item.id, item.updatedAt, item.sourceKey, item.status, item.paymentStatus, item.breakfastDay, relationshipID(item.checkoutOrder)]).sort(),
    ]);
    const row = { sourceKey: receipt.sourceKey, fingerprint, expected, missing: zero() };
    const held = (message: string): PlanRow => ({ ...row, action: "review", message });
    const order = matches[0];
    if (!order) return held("No existing checkout matches this receipt.");
    if (matches.length !== 1 || (orderReceipts.get(order.id) ?? 0) !== 1 || conflictingStripeReference(order, receipt)) {
      return held("Checkout references are ambiguous or disagree with the receipt.");
    }
    if (order.paymentSource !== "stripe" || order.paymentStatus !== "paid" || order.totalCents !== receipt.grossCents) {
      return held("The checkout is no longer paid by Stripe at the reviewed amount.");
    }
    if (!order.sourceKey || !order.purchaserName || !order.purchaserEmail || !Number.isFinite(Date.parse(order.purchasedAt))) {
      return held("The existing checkout is missing information required to create linked tickets.");
    }
    if (related.some((ticket) => {
      const parent = relationshipID(ticket.checkoutOrder);
      return (parent && parent !== order.id) || conflictingStripeReference(ticket, receipt) ||
        ticket.paymentSource !== "stripe" || ticket.paymentStatus !== "paid" ||
        (ticket.status !== "valid" && ticket.status !== "used");
    })) return held("An existing ticket has an inactive status or conflicting payment reference.");

    const slots = new Map<BreakfastRepairDay, Set<number>>(days.map((day) => [day, new Set()]));
    for (const ticket of related) {
      const parsed = ticketParts(ticket.sourceKey);
      const ordinalSet = slots.get(ticket.breakfastDay);
      if (!parsed || parsed.orderKey !== order.sourceKey || parsed.day !== ticket.breakfastDay ||
        !ordinalSet || parsed.ordinal > expected[ticket.breakfastDay] || ordinalSet.has(parsed.ordinal)) {
        return held("Existing ticket days or references prevent a safe duplicate check.");
      }
      ordinalSet.add(parsed.ordinal);
    }

    const additions: Write[] = [];
    for (const { day, quantity, unitPriceCents } of receipt.days) {
      for (let ordinal = 1; ordinal <= quantity; ordinal++) {
        if (slots.get(day)?.has(ordinal)) continue;
        row.missing[day]++;
        additions.push({ receipt, order, day, ordinal, unitPriceCents });
      }
    }
    if (!additions.length) return { ...row, action: "matched", message: "All expected tickets are already recorded." };
    writes.set(receipt.sourceKey, additions);
    return { ...row, action: "new", message: "Only the missing tickets will be created." };
  });
  const missingByDay = zero();
  const counts = { new: 0, matched: 0, review: 0, expectedTickets, missingTickets: 0 };
  for (const row of rows) {
    counts[row.action]++;
    for (const day of days) missingByDay[day] += row.missing[day];
  }
  counts.missingTickets = sum(missingByDay);
  return { plan: { fingerprint: digest(rows), rows, counts, missingByDay }, writes };
}

export async function planBreakfastRepair(payload: Payload, manifest: BreakfastRepairManifest, req?: PayloadRequest): Promise<BreakfastRepairPlan> {
  return (await buildPlan(payload, manifest, req)).plan;
}

export async function applyBreakfastRepair(payload: Payload, manifest: BreakfastRepairManifest, { sources, expectedFingerprint, req, batchID }: {
  sources: string[];
  expectedFingerprint: string;
  req: PayloadRequest;
  batchID: string;
}): Promise<BreakfastRepairJournal> {
  if (!isAdministrator(req.user)) throw new BreakfastRepairError("Administrator access is required.", 403);
  if (req.transactionID == null) throw new BreakfastRepairError("Breakfast repairs require a database transaction.", 503);
  if (!sources.length || sources.length > BREAKFAST_REPAIR_MAX_RECEIPTS || new Set(sources).size !== sources.length) {
    throw new BreakfastRepairError(`Select between 1 and ${BREAKFAST_REPAIR_MAX_RECEIPTS} distinct receipts.`);
  }
  const { plan, writes } = await buildPlan(payload, manifest, req);
  if (plan.fingerprint !== expectedFingerprint) throw new BreakfastRepairError("The repair preview changed. Preview the file again before confirming.", 409);
  if (sources.some((source) => !writes.has(source))) throw new BreakfastRepairError("Select only receipts with safe missing tickets in this preview.", 409);
  const selected = sources.flatMap((source) => writes.get(source) ?? []);
  if (selected.length > BREAKFAST_REPAIR_MAX_CONFIRM_TICKETS) {
    throw new BreakfastRepairError(`Confirm at most ${BREAKFAST_REPAIR_MAX_CONFIRM_TICKETS} tickets at a time.`);
  }

  const journal: BreakfastRepairJournal = { sources, created: [], counts: { receipts: sources.length, breakfasts: 0 }, createdByDay: zero() };
  for (const { receipt, order, day, ordinal, unitPriceCents } of selected) {
    const sourceKey = sourceTicketKey(order.sourceKey, day, ordinal);
    const ticket = await payload.create({
      collection: "breakfast-tickets", depth: 0, overrideAccess: true, req,
      data: {
        sourceKey, ticketCode: `BF-${day}-${order.sourceKey}-${ordinal}`.toUpperCase(),
        checkoutOrder: order.id, breakfastDay: day, status: "valid", unitPriceCents,
        purchaserName: order.purchaserName, purchaserEmail: order.purchaserEmail, purchasedAt: order.purchasedAt,
        paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "historical_import",
        stripeCheckoutSessionId: receipt.stripe.checkoutSessionId, stripePaymentIntentId: receipt.stripe.paymentIntentId,
        stripeChargeId: receipt.stripe.chargeId ?? order.stripeChargeId, stripeCustomerId: order.stripeCustomerId,
        rawMetadata: { breakfastRepairBatch: batchID, ...(receipt.stripe.paymentId ? { csv_id: receipt.stripe.paymentId } : {}) },
      },
    });
    journal.created.push({ collection: "breakfast-tickets", id: ticket.id, sourceKey });
    journal.counts.breakfasts++;
    journal.createdByDay[day]++;
  }
  return journal;
}
