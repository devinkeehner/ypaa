import { createHash } from "node:crypto";
import type { Payload, PayloadRequest, Where } from "payload";
import type { CheckoutOrder, HistoricalReceipt, RegistrationEntitlement, ScholarshipContribution } from "@/payload-types";
import { isAdministrator } from "./crm-access";
import { ImportError } from "./registration-tracker";
import type { ScholarshipRepairInput, ScholarshipRepairReceipt } from "./scholarship-repair-input";

const stripeFields = ["stripeCheckoutSessionId", "stripePaymentIntentId", "stripeChargeId", "stripePaymentId"] as const;
const contributionType = {
  donation: "general_donation",
  general: "general_scholarship",
  specific: "specific_person_scholarship",
} as const;
const formatDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const unique = <T>(values: T[]) => [...new Set(values)];
const stringValues = (values: unknown[]) => values.filter((value): value is string => typeof value === "string" && Boolean(value));
const idOf = (value: unknown) => typeof value === "string" ? value
  : value && typeof value === "object" && "id" in value && typeof value.id === "string" ? value.id : undefined;
const object = (value: unknown) => value && typeof value === "object" && !Array.isArray(value)
  ? value as Record<string, unknown> : undefined;
const inValues = (field: string, values: string[]): Where[] => values.length ? [{ [field]: { in: values } }] : [];

type PlanRow = {
  sourceKey: string;
  action: "new" | "matched" | "review";
  amountCents: number;
  priceCents: number;
  message: string;
  allocatedCents: number;
};

export type ScholarshipRepairPlan = {
  fingerprint: string;
  rows: PlanRow[];
  counts: { new: number; matched: number; review: number; principalCents: number; allocatedCents: number };
};

export type ScholarshipRepairJournal = {
  sources: string[];
  created: { collection: "scholarship-contributions"; id: string; sourceKey: string }[];
  counts: { contributions: number; principalCents: number; allocatedCents: number };
};

type RepairOrder = Pick<CheckoutOrder, typeof stripeFields[number] | "id" | "sourceKey" | "rawMetadata" | "purchasedAt" |
  "paymentSource" | "paymentStatus" | "totalCents" | "subtotalCents" | "processingFeeCents" | "dataOrigin" | "purchaserContact" | "updatedAt">;
type RepairHistory = Pick<HistoricalReceipt, "id" | "sourceKey" | "paymentAliases" | "checkoutOrder" | "paymentSource" |
  "paymentStatus" | "grossCents" | "purchasedAt" | "purchaseLines" | "historicalSource" | "updatedAt">;
type RepairSeat = Pick<RegistrationEntitlement, "id" | "sourceKey" | "checkoutOrder" | "entitlementType" | "status" |
  "fundingSource" | "fundingContributions" | "attendeeContact" | "sourceMetadata" | "updatedAt">;
type RepairContribution = Pick<ScholarshipContribution, "id" | "sourceKey" | "checkoutOrder" | "historicalReceipt" |
  "contributionType" | "amountCents" | "allocatedCents" | "availableCents" | "seatPriceCents" | "fundedEntitlements" |
  "status" | "updatedAt">;
type Candidate = { receipt: ScholarshipRepairReceipt; ids: Set<string>; keys: Set<string>; histories: RepairHistory[]; orders: RepairOrder[] };
type PendingWrite = {
  receipt: ScholarshipRepairReceipt;
  order?: RepairOrder;
  history?: RepairHistory;
  seats: RepairSeat[];
  sourceKey: string;
  allocatedCents: number;
  notes?: string;
  historicalSource?: HistoricalReceipt["historicalSource"];
};

export class ScholarshipRepairError extends ImportError {}

function candidateFor(receipt: ScholarshipRepairReceipt): Candidate {
  const ids = new Set(stringValues(Object.values(receipt.stripe ?? {})));
  const keys = new Set([receipt.sourceKey, ...[...ids].flatMap((id) => [
    `stripe:${id}`, `stripe:csv:${id}`, `registration-import:stripe:${id}`,
  ])]);
  return { receipt, ids, keys, histories: [], orders: [] };
}

function historicalLine(history: RepairHistory, receipt: ScholarshipRepairReceipt) {
  const lines = (history.purchaseLines ?? []).filter(({ kind }) => kind === "scholarship");
  if (lines.length !== 1) return undefined;
  const [line] = lines;
  if (line.quantity !== 1 || line.amountCents !== receipt.amountCents ||
    (line.label === "Specific scholarship") !== (receipt.kind === "specific")) return undefined;
  // Version 1 retained the historical price as a fractional seat equivalent.
  return (line.unitPriceCents === receipt.priceCents ||
    (line.unitPriceCents == null && line.ticketEquivalents === receipt.amountCents / receipt.priceCents)) ? line : undefined;
}

function checkoutReferences(order: RepairOrder) {
  const raw = object(order.rawMetadata);
  return stringValues([...stripeFields.map((field) => order[field]), raw?.csv_id,
    order.sourceKey.match(/^(?:stripe:csv:|registration-import:stripe:|stripe:)(.+)$/)?.[1]]);
}

function conflictingStripeReference(order: RepairOrder, receipt: ScholarshipRepairReceipt) {
  const stripe = receipt.stripe;
  if (!stripe) return true;
  const expected = { cs: stripe.checkoutSessionId, pi: stripe.paymentIntentId, ch: stripe.chargeId, py: stripe.paymentId };
  return checkoutReferences(order).some((id) => {
    const kind = id.split("_", 1)[0] as keyof typeof expected;
    return expected[kind] && expected[kind] !== id;
  });
}

function verifiedLegacyTotal(receipt: ScholarshipRepairReceipt, order: RepairOrder, history?: RepairHistory) {
  const stripe = receipt.stripe;
  return !history && receipt.source === "stripe" && order.dataOrigin === "stripe_webhook" &&
    order.processingFeeCents === 0 && order.subtotalCents === order.totalCents &&
    order.totalCents === receipt.legacyCheckoutTotalCents && order.totalCents === receipt.amountCents && order.totalCents < receipt.grossCents &&
    Boolean(stripe?.checkoutSessionId && stripe.paymentIntentId && stripe.chargeId &&
      order.stripeCheckoutSessionId === stripe.checkoutSessionId && order.stripePaymentIntentId === stripe.paymentIntentId &&
      order.stripeChargeId === stripe.chargeId);
}

function contributionKeys(orderKeys: string[]) {
  return orderKeys.flatMap((key) => [`${key}:contribution:1`, `${key}:scholarship-contribution:1`]);
}

function stableDocs<T extends { id: string }>(docs: T[]) {
  return [...docs].sort((a, b) => a.id.localeCompare(b.id));
}

function matchingLedger(row: RepairContribution, receipt: ScholarshipRepairReceipt, order?: RepairOrder, history?: RepairHistory) {
  const orderID = idOf(row.checkoutOrder);
  const historyID = idOf(row.historicalReceipt);
  const linkedHistory = Boolean(history && historyID === history.id);
  return (order ? orderID === order.id || (!orderID && linkedHistory) : !orderID && linkedHistory) &&
    (!historyID || historyID === history?.id) && row.status === "active" &&
    (row.contributionType === "specific_person_scholarship") === (receipt.kind === "specific") &&
    row.amountCents === receipt.amountCents && row.seatPriceCents === receipt.priceCents &&
    Number.isSafeInteger(row.allocatedCents) && Number.isSafeInteger(row.availableCents) &&
    row.allocatedCents >= 0 && row.availableCents >= 0 && row.allocatedCents + row.availableCents === row.amountCents;
}

async function buildPlan(payload: Payload, manifest: ScholarshipRepairInput, req?: PayloadRequest) {
  const candidates = manifest.receipts.map(candidateFor);
  const keys = unique(candidates.flatMap(({ keys }) => [...keys]));
  const stripeIDs = unique(candidates.flatMap(({ ids }) => [...ids]));
  const aliases = stripeIDs.map((id) => `stripe:${id}`);
  const options = { overrideAccess: true, depth: 0, pagination: false, req, context: { skipCheckoutPurchaseDisplay: true } } as const;
  const historyResult = await payload.find({
    ...options, collection: "historical-receipts",
    where: { or: [...inValues("sourceKey", keys), ...inValues("paymentAliases", aliases)] },
    select: { sourceKey: true, paymentAliases: true, checkoutOrder: true, paymentSource: true, paymentStatus: true,
      grossCents: true, purchasedAt: true, purchaseLines: true, historicalSource: true, updatedAt: true },
  });
  const historyOrderIDs = stringValues(historyResult.docs.map(({ checkoutOrder }) => idOf(checkoutOrder)));
  const orderWhere: Where[] = [
    ...inValues("sourceKey", keys), ...inValues("id", historyOrderIDs),
    ...stripeFields.flatMap((field) => inValues(field, stripeIDs)),
    ...inValues("rawMetadata.csv_id", stripeIDs),
  ];
  const ordersResult = await payload.find({
    ...options, collection: "checkout-orders", where: { or: orderWhere },
    select: { sourceKey: true, stripeCheckoutSessionId: true, stripePaymentIntentId: true, stripeChargeId: true, stripePaymentId: true,
      rawMetadata: true, purchasedAt: true, paymentSource: true, paymentStatus: true, totalCents: true,
      subtotalCents: true, processingFeeCents: true, dataOrigin: true, purchaserContact: true, updatedAt: true },
  });
  const orderIDs = ordersResult.docs.map(({ id }) => id);
  const historyIDs = historyResult.docs.map(({ id }) => id);
  const ledgerKeys = contributionKeys(unique([...keys, ...ordersResult.docs.map(({ sourceKey }) => sourceKey)]));
  const ledgerResult = await payload.find({
    ...options, collection: "scholarship-contributions", where: { or: [
      ...inValues("sourceKey", ledgerKeys), ...inValues("checkoutOrder", orderIDs), ...inValues("historicalReceipt", historyIDs),
    ] },
    select: { sourceKey: true, checkoutOrder: true, historicalReceipt: true, contributionType: true, amountCents: true,
      allocatedCents: true, availableCents: true, seatPriceCents: true, fundedEntitlements: true, status: true, updatedAt: true },
  });
  const seatsResult = orderIDs.length ? await payload.find({
    ...options, collection: "registration-entitlements",
    where: { and: [{ checkoutOrder: { in: orderIDs } }, { entitlementType: { in: ["general_scholarship", "specific_scholarship"] } }] },
    select: { sourceKey: true, checkoutOrder: true, entitlementType: true, status: true, fundingSource: true, fundingContributions: true,
      attendeeContact: true, sourceMetadata: true, updatedAt: true },
  }) : { docs: [] };
  const orderMatches = new Map<string, number>();
  for (const candidate of candidates) {
    const { receipt, ids, keys: candidateKeys } = candidate;
    candidate.histories = historyResult.docs.filter((history) => receipt.source === "manual" ? history.sourceKey === receipt.sourceKey
      : candidateKeys.has(history.sourceKey) || history.paymentAliases.some((alias) => alias.startsWith("stripe:") && ids.has(alias.slice(7))));
    const relatedOrderIDs = new Set(candidate.histories.map(({ checkoutOrder }) => idOf(checkoutOrder)));
    candidate.orders = ordersResult.docs.filter((order) => relatedOrderIDs.has(order.id) ||
      candidateKeys.has(order.sourceKey) || (receipt.source === "stripe" && checkoutReferences(order).some((id) => ids.has(id))));
    for (const { id } of candidate.orders) orderMatches.set(id, (orderMatches.get(id) ?? 0) + 1);
  }

  const writes = new Map<string, PendingWrite>();
  const fingerprints: string[] = [];
  const rows = candidates.map((candidate): PlanRow => {
    const { receipt, histories, orders } = candidate;
    const history = histories[0];
    const order = orders[0];
    const scopedLedgerKeys = new Set(contributionKeys([...candidate.keys, ...orders.map(({ sourceKey }) => sourceKey)]));
    const candidateOrderIDs = new Set(orders.map(({ id }) => id));
    const candidateHistoryIDs = new Set(histories.map(({ id }) => id));
    const ledger = ledgerResult.docs.filter((entry) =>
      candidateOrderIDs.has(idOf(entry.checkoutOrder) ?? "") || candidateHistoryIDs.has(idOf(entry.historicalReceipt) ?? "") ||
      scopedLedgerKeys.has(entry.sourceKey));
    const seats = seatsResult.docs.filter((seat) => candidateOrderIDs.has(idOf(seat.checkoutOrder) ?? ""));
    fingerprints.push(digest([receipt, stableDocs(histories), stableDocs(orders), stableDocs(ledger), stableDocs(seats)]));
    const row = { sourceKey: receipt.sourceKey, amountCents: receipt.amountCents, priceCents: receipt.priceCents, allocatedCents: 0 };
    const held = (message: string): PlanRow => ({ ...row, action: "review", message });
    if (histories.length > 1 || orders.length > 1 || (order && orderMatches.get(order.id) !== 1)) {
      return held("Multiple payment references match this receipt.");
    }
    const expectedStatus = receipt.source === "stripe" ? "paid" : "recorded";
    if (history && (history.paymentSource !== receipt.source || history.paymentStatus !== expectedStatus || history.grossCents !== receipt.grossCents ||
      (history.checkoutOrder && idOf(history.checkoutOrder) !== order?.id))) return held("The recorded receipt has conflicting payment details.");
    const line = history && historicalLine(history, receipt);
    if (receipt.source === "manual" && (!history || !line)) return held("No recorded historical receipt matches the scholarship amount and price.");
    if (!line && history?.purchaseLines?.some(({ kind }) => kind === "scholarship")) {
      return held("The recorded scholarship line does not match the reviewed amount and price.");
    }
    const legacyTotal = order && verifiedLegacyTotal(receipt, order, history);
    if (order && (order.paymentSource !== receipt.source || order.paymentStatus !== expectedStatus || (order.totalCents !== receipt.grossCents && !legacyTotal) ||
      !Number.isFinite(Date.parse(order.purchasedAt)) || (receipt.source === "stripe" && conflictingStripeReference(order, receipt)))) {
      return held("The checkout status, amount, date or payment references do not agree with the source.");
    }
    if (!order && (receipt.source === "stripe" || history?.purchasedAt)) return held("No matching checkout supports this receipt.");
    if (ledger.length) {
      if (ledger.length !== 1 || !matchingLedger(ledger[0], receipt, order, history)) {
        return held("The existing scholarship ledger differs from this receipt, or more than one entry matches.");
      }
      return { ...row, action: "matched", allocatedCents: ledger[0].allocatedCents, message: "The matching contribution is already recorded." };
    }

    const seatType = receipt.kind === "specific" ? "specific_scholarship" : "general_scholarship";
    if (seats.some((seat) => {
      const price = object(seat.sourceMetadata)?.seatPriceCents;
      return seat.entitlementType !== seatType || !["assigned", "unassigned"].includes(seat.status) ||
        seat.fundingSource !== "direct_checkout" || Boolean(seat.fundingContributions?.length) ||
        (typeof price === "number" && price !== receipt.priceCents);
    })) {
      return held("Existing scholarship seats have conflicting types, status, pricing or funding links.");
    }
    if (receipt.kind === "specific" && (seats.length !== 1 || receipt.amountCents < receipt.priceCents)) {
      return held("A specific scholarship requires one matching existing seat and adequate principal.");
    }
    const seatValue = seats.length * receipt.priceCents;
    const allocatedCents = Math.min(receipt.amountCents, seatValue);
    const legacyNote = legacyTotal
      ? `The verified Stripe export gross was ${formatDollars.format(receipt.grossCents / 100)}. The legacy checkout stores ${formatDollars.format(receipt.amountCents / 100)}. This entry records only the verified scholarship principal and retains the original checkout.`
      : "";
    const fundingNote = seatValue > receipt.amountCents
      ? "The prior scholarship seats exist at a higher total face value than the principal recorded on this receipt. This contribution allocates only its recorded principal."
      : "";
    const notes = [legacyNote, fundingNote].filter(Boolean).join(" ") || undefined;
    const sourceKey = `${order?.sourceKey ?? history?.sourceKey}:contribution:1`;
    writes.set(receipt.sourceKey, { receipt, order, history, seats, sourceKey, allocatedCents, notes,
      historicalSource: line?.historicalSource ?? history?.historicalSource });
    return { ...row, action: "new", allocatedCents,
      message: notes ?? (seats.length ? "Create and link the contribution to existing scholarship seats." : "Create the unallocated contribution.") };
  });
  const counts = { new: 0, matched: 0, review: 0, principalCents: 0, allocatedCents: 0 };
  for (const row of rows) {
    counts[row.action]++;
    if (row.action !== "new") continue;
    counts.principalCents += row.amountCents;
    counts.allocatedCents += row.allocatedCents;
  }
  return { plan: { fingerprint: digest([rows, fingerprints]), rows, counts }, writes };
}

export async function planScholarshipRepair(payload: Payload, manifest: ScholarshipRepairInput, req?: PayloadRequest): Promise<ScholarshipRepairPlan> {
  return (await buildPlan(payload, manifest, req)).plan;
}

export async function applyScholarshipRepair(payload: Payload, manifest: ScholarshipRepairInput, { sources, expectedFingerprint, req, batchID }: {
  sources: string[];
  expectedFingerprint: string;
  req: PayloadRequest;
  batchID: string;
}): Promise<ScholarshipRepairJournal> {
  if (!isAdministrator(req.user)) throw new ScholarshipRepairError("Administrator access is required.", 403);
  if (req.transactionID == null) throw new ScholarshipRepairError("Scholarship repairs require a database transaction.", 503);
  if (!sources.length || sources.length > manifest.receipts.length || new Set(sources).size !== sources.length) {
    throw new ScholarshipRepairError("Select distinct receipts from the repair preview.");
  }
  const { plan, writes } = await buildPlan(payload, manifest, req);
  if (plan.fingerprint !== expectedFingerprint) throw new ScholarshipRepairError("The repair preview changed. Preview the file again before confirming.", 409);
  const approved = new Set(sources);
  const selected = [...writes].filter(([source]) => approved.has(source)).map(([, write]) => write);
  if (selected.length !== approved.size) throw new ScholarshipRepairError("Select only receipts with missing contributions in this preview.", 409);

  const options = { overrideAccess: true, depth: 0, req } as const;
  const journal: ScholarshipRepairJournal = { sources, created: [], counts: { contributions: 0, principalCents: 0, allocatedCents: 0 } };
  for (const write of selected) {
    const { receipt, order, history, seats, sourceKey, allocatedCents, notes, historicalSource } = write;
    const contribution = await payload.create({
      ...options, collection: "scholarship-contributions", data: {
        sourceKey, checkoutOrder: order?.id, historicalReceipt: history?.id,
        contributorContact: idOf(order?.purchaserContact), contributionType: contributionType[receipt.kind],
        amountCents: receipt.amountCents, allocatedCents, availableCents: receipt.amountCents - allocatedCents, seatPriceCents: receipt.priceCents,
        specificRecipientContact: receipt.kind === "specific" ? idOf(seats[0]?.attendeeContact) : undefined,
        fundedEntitlements: seats.map(({ id }) => id), purchasedAt: order?.purchasedAt ?? history?.purchasedAt, status: "active",
        dataOrigin: "historical_import", notes, historicalSource, sourceMetadata: { scholarshipRepairBatch: batchID },
      },
    });
    for (const seat of seats) {
      await payload.update({ ...options, collection: "registration-entitlements", id: seat.id, data: { fundingContributions: [contribution.id] } });
    }
    journal.created.push({ collection: "scholarship-contributions", id: contribution.id, sourceKey });
    journal.counts.contributions++;
    journal.counts.principalCents += receipt.amountCents;
    journal.counts.allocatedCents += allocatedCents;
  }
  return journal;
}
