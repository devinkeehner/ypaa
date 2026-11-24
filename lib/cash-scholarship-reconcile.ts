import { createLocalReq, type PayloadRequest } from "payload";
import { derivePurchaseDetails, objectValue } from "./checkout-order-details";
import { isAdministrator } from "./crm-access";

type CashScholarshipInput = {
  checkoutOrderId: string;
  expectedUpdatedAt: string;
  expectedPrincipalCents: number;
  expectedSeatPriceCents: number;
  expectedAllocatedCents?: number;
  verifiedLegacyReceipt?: { receiptReference: string };
};

type Entry = {
  checkoutOrderId: string;
  contributionId?: string;
  status: "ready" | "created" | "matched";
  amountCents: number;
  allocatedCents: number;
};

class CashScholarshipError extends Error {}

const recordId = /^[a-f0-9]{24}$/i;
const positiveCents = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const recordedInteger = (value: unknown) => typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
const idOf = (value: unknown) => typeof value === "string" ? value
  : value && typeof value === "object" && "id" in value && typeof value.id === "string" ? value.id : undefined;

async function inspectCheckout(req: PayloadRequest, input: CashScholarshipInput) {
  const payload = req.payload;
  const options = { req, depth: 0, overrideAccess: false } as const;
  const order = await payload.findByID({
    ...options, collection: "checkout-orders", id: input.checkoutOrderId, disableErrors: true,
    select: { sourceKey: true, paymentSource: true, paymentStatus: true, dataOrigin: true, purchasedAt: true,
      subtotalCents: true, totalCents: true, processingFeeCents: true, purchaserContact: true, order: true,
      rawMetadata: true, purchaseLines: true, purchaseSnapshot: true, updatedAt: true },
  });
  if (!order || order.paymentSource !== "cash" || order.paymentStatus !== "recorded" ||
      order.dataOrigin !== "cash_checkout" || !/^cash:[a-z0-9_-]+$/i.test(order.sourceKey)) {
    throw new CashScholarshipError("A selected checkout is not a recorded cash checkout.");
  }
  if (order.updatedAt !== input.expectedUpdatedAt) {
    throw new CashScholarshipError("A selected cash checkout changed. Review its current record before reconciling.");
  }
  const contributorContact = idOf(order.purchaserContact);
  if (!Number.isFinite(Date.parse(order.purchasedAt))) {
    throw new CashScholarshipError("A selected checkout is missing its original purchase date.");
  }

  const scholarship = objectValue(objectValue(order.order).scholarship);
  const metadata = objectValue(order.rawMetadata);
  const snapshot = objectValue(objectValue(order.purchaseSnapshot).scholarship);
  const cashReference = order.sourceKey.slice("cash:".length);
  if ((input.verifiedLegacyReceipt && input.verifiedLegacyReceipt.receiptReference !== cashReference) ||
      (metadata.access_redemption_id != null && metadata.access_redemption_id !== cashReference)) {
    throw new CashScholarshipError("A selected checkout has a conflicting cash receipt reference.");
  }
  const scholarshipLines = (order.purchaseLines ?? []).filter(({ kind }) => kind === "scholarship");
  const principal = input.expectedPrincipalCents;
  if (!positiveCents(order.subtotalCents) || order.totalCents !== order.subtotalCents ||
      order.processingFeeCents !== 0 || principal > order.totalCents ||
      (metadata.cash_recorded_value_cents != null && recordedInteger(metadata.cash_recorded_value_cents) !== order.totalCents) ||
      (scholarship.amountCents != null && scholarship.amountCents !== principal) ||
      (snapshot.amountCents != null && snapshot.amountCents !== principal) ||
      (scholarshipLines.length > 0 && scholarshipLines.reduce((sum, line) => sum + line.amountCents, 0) !== principal)) {
    throw new CashScholarshipError("A selected checkout does not verify the expected scholarship principal.");
  }

  const evidence = [metadata.necy_registration_price_cents, scholarship.seatPriceCents, ...scholarshipLines.map((line) => line.unitPriceCents)]
    .filter((value) => value != null).map(recordedInteger);
  const seatPriceCents = input.expectedSeatPriceCents;
  if (evidence.some((price) => price !== seatPriceCents) || (scholarship.kind === "specific" && principal !== seatPriceCents)) {
    throw new CashScholarshipError("A selected checkout does not verify the expected original scholarship seat price.");
  }

  const nativeEvidence = Boolean(contributorContact && scholarship.enabled === true &&
    (scholarship.kind === "general" || scholarship.kind === "specific") && scholarship.amountCents === principal && evidence.length);
  const legacyReceipt = nativeEvidence ? undefined : input.verifiedLegacyReceipt;
  if (!nativeEvidence) {
    const details = derivePurchaseDetails(order);
    if (!legacyReceipt || order.totalCents !== principal || principal !== seatPriceCents ||
        details.categories.length !== 1 || details.categories[0] !== "scholarship" ||
        details.scholarship?.kind !== "general" || details.scholarship.quantity !== 1 ||
        (scholarship.enabled != null && scholarship.enabled !== true) ||
        (scholarship.kind != null && scholarship.kind !== "general") ||
        (metadata.necy_has_scholarship != null && ![true, "true", "yes", "1"].includes(metadata.necy_has_scholarship as string | boolean))) {
      throw new CashScholarshipError("A selected checkout is missing the original payer, amount, or price evidence required for this reconciliation.");
    }
  }

  const specific = scholarship.kind === "specific";
  const entitlementType = specific ? "specific_scholarship" : "general_scholarship";
  const contributionType = specific ? "specific_person_scholarship" : "general_scholarship";
  const sourceKey = `${order.sourceKey}:contribution:1`;
  const legacyKey = `${order.sourceKey}:scholarship-contribution:1`;
  const { docs: seats } = await payload.find({
    ...options, collection: "registration-entitlements", limit: 21,
    where: { and: [{ checkoutOrder: { equals: order.id } }, { entitlementType: { in: ["specific_scholarship", "general_scholarship"] } }] },
    select: { entitlementType: true, status: true, fundingSource: true, fundingContributions: true, attendeeContact: true, sourceMetadata: true },
  });
  const seatQuantity = recordedInteger(metadata.necy_scholarship_qty ?? metadata.scholarship_quantity ?? scholarship.quantity);
  const allocatedCents = seats.length * seatPriceCents;
  if (seats.length > 20 || (legacyReceipt && seats.length > 0) ||
      (specific && (seats.length !== 1 || seats[0].status === "unassigned")) || allocatedCents > principal ||
      (seatQuantity != null && (!positiveCents(seatQuantity) || seats.length > seatQuantity)) ||
      seats.some((seat) => {
        const seatMetadata = objectValue(seat.sourceMetadata);
        const storedPrices = [seatMetadata.seatPriceCents, seatMetadata.necy_registration_price_cents]
          .filter((value) => value != null).map(recordedInteger);
        return seat.entitlementType !== entitlementType || seat.fundingSource !== "direct_checkout" ||
          !["unassigned", "assigned", "redeemed"].includes(seat.status) || storedPrices.some((price) => price !== seatPriceCents) ||
          (seat.status === "unassigned" ? Boolean(seat.attendeeContact) : !idOf(seat.attendeeContact));
      })) {
    throw new CashScholarshipError("A selected checkout has conflicting scholarship seat status, type, price, or quantity.");
  }

  const fundedEntitlements = seats.map(({ id }) => id);
  const specificRecipientContact = specific ? idOf(seats[0]?.attendeeContact) : undefined;
  const { docs: existing } = await payload.find({
    ...options, collection: "scholarship-contributions", limit: 2,
    where: { or: [{ checkoutOrder: { equals: order.id } }, { sourceKey: { in: [sourceKey, legacyKey] } }] },
    select: { sourceKey: true, checkoutOrder: true, contributorContact: true, contributionType: true, amountCents: true,
      allocatedCents: true, availableCents: true, seatPriceCents: true, fundedEntitlements: true, specificRecipientContact: true, status: true },
  });
  const contribution = existing[0];
  const existingSeats = new Set(contribution?.fundedEntitlements?.map(idOf) ?? []);
  const availableCents = principal - allocatedCents;
  if (existing.length > 1 || (contribution && (
    idOf(contribution.checkoutOrder) !== order.id || ![sourceKey, legacyKey].includes(contribution.sourceKey) ||
    idOf(contribution.contributorContact) !== contributorContact || contribution.status !== "active" ||
    contribution.contributionType !== contributionType || contribution.amountCents !== principal ||
    contribution.seatPriceCents !== seatPriceCents || contribution.allocatedCents !== allocatedCents ||
    contribution.availableCents !== availableCents || idOf(contribution.specificRecipientContact) !== specificRecipientContact ||
    existingSeats.size !== seats.length || fundedEntitlements.some((id) => !existingSeats.has(id))
  )) || seats.some((seat) => {
    const links = seat.fundingContributions ?? [];
    return contribution ? links.length !== 1 || idOf(links[0]) !== contribution.id : links.length > 0;
  })) {
    throw new CashScholarshipError("A selected checkout has an existing contribution or seat funding conflict.");
  }

  return {
    checkoutOrderId: order.id, existingContributionId: contribution?.id, amountCents: principal, allocatedCents,
    legacyReceipt,
    contribution: { sourceKey, checkoutOrder: order.id, contributorContact, contributionType, amountCents: principal,
      allocatedCents, availableCents, seatPriceCents, fundedEntitlements, specificRecipientContact, purchasedAt: order.purchasedAt,
      dataOrigin: legacyReceipt && !contributorContact ? "historical_import" : undefined,
      notes: legacyReceipt ? "Reconciled from the verified original cash receipt." : undefined } as const,
  };
}

export async function reconcileCashScholarships(request: PayloadRequest, inputs: CashScholarshipInput[], confirm: boolean) {
  const user = request.user;
  if (!user?.id || !isAdministrator(user)) throw new CashScholarshipError("Administrator access is required.");
  if (typeof confirm !== "boolean") throw new CashScholarshipError("Choose whether to preview or confirm the reconciliation.");
  if (inputs.length < 1 || inputs.length > 10 ||
      new Set(inputs.map(({ checkoutOrderId }) => checkoutOrderId.toLowerCase())).size !== inputs.length ||
      inputs.some((input) => !recordId.test(input.checkoutOrderId) || !Number.isFinite(Date.parse(input.expectedUpdatedAt)) ||
        !positiveCents(input.expectedPrincipalCents) || !positiveCents(input.expectedSeatPriceCents) ||
        ((confirm || input.expectedAllocatedCents !== undefined) && input.expectedAllocatedCents !== 0 && !positiveCents(input.expectedAllocatedCents)) ||
        (input.verifiedLegacyReceipt && !/^[a-z0-9_-]+$/i.test(input.verifiedLegacyReceipt.receiptReference)))) {
    throw new CashScholarshipError("Provide one to ten distinct checkout IDs with their reviewed timestamps, principal, and seat price.");
  }

  const payload = request.payload;
  const req = await createLocalReq({ user }, payload);
  const transactionID = confirm ? await payload.db.beginTransaction() : null;
  if (confirm && transactionID == null) throw new CashScholarshipError("Cash scholarship reconciliation requires database transactions.");
  if (transactionID != null) req.transactionID = transactionID;
  const entries: Entry[] = [];
  let contributionsAdded = 0;
  let principalCentsAdded = 0;

  try {
    const plan: Awaited<ReturnType<typeof inspectCheckout>>[] = [];
    for (const input of inputs) {
      const row = await inspectCheckout(req, input);
      if (confirm && row.allocatedCents !== input.expectedAllocatedCents) {
        throw new CashScholarshipError("A selected checkout's scholarship seat funding changed. Preview the reconciliation again.");
      }
      plan.push(row);
    }

    for (const { checkoutOrderId, existingContributionId, amountCents, allocatedCents, contribution, legacyReceipt } of plan) {
      const entry = { checkoutOrderId, amountCents, allocatedCents };
      if (existingContributionId) {
        entries.push({ ...entry, contributionId: existingContributionId, status: "matched" });
      } else if (!confirm) {
        entries.push({ ...entry, status: "ready" });
      } else {
        const options = { req, depth: 0, overrideAccess: false } as const;
        // Only the administrator-authenticated native workflow can set historical provenance on a legacy entry.
        const saved = await payload.create({ ...options, overrideAccess: contribution.dataOrigin === "historical_import", collection: "scholarship-contributions", data: {
          ...contribution, status: "active",
          sourceMetadata: { recordedBy: user.id, reconciliationSource: "cash_checkout_mcp",
            ...(legacyReceipt ? { verifiedLegacyReceipt: legacyReceipt.receiptReference } : {}) },
        } });
        for (const id of contribution.fundedEntitlements) {
          await payload.update({ ...options, collection: "registration-entitlements", id, data: { fundingContributions: [saved.id] } });
        }
        contributionsAdded++;
        principalCentsAdded += amountCents;
        entries.push({ ...entry, contributionId: saved.id, status: "created" });
      }
    }

    if (transactionID != null) await payload.db.commitTransaction(transactionID);
    return { entries, contributionsAdded, principalCentsAdded };
  } catch (error) {
    if (transactionID != null) await payload.db.rollbackTransaction(transactionID);
    if (error instanceof CashScholarshipError) throw error;
    throw new CashScholarshipError("The selected cash scholarships could not be reconciled. Review the current entries before retrying.");
  }
}
