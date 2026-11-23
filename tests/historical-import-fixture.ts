import type { HistoricalImport, HistoricalPayment } from "../lib/historical-import-input";

const provenance = { sheet: "Payments", row: 2, paymentRow: 2, stripeRow: 2 } as const;
const common = {
  currency: "USD",
  checkoutFeeCents: 0,
  shippingCents: 0,
  discountCents: 0,
  purchaseLines: [],
} as const;

export function checkoutFixture(id = "HISTORICALIMPORT"): HistoricalPayment {
  return {
    currency: common.currency,
    checkoutFeeCents: common.checkoutFeeCents,
    shippingCents: common.shippingCents,
    discountCents: common.discountCents,
    sourceKey: `stripe:csv:ch_${id}`,
    source: "stripe",
    status: "paid",
    stripe: { chargeId: `ch_${id}`, paymentIntentId: `pi_${id}`, checkoutSessionId: `cs_live_${id}` },
    purchasedAt: "2026-10-06T18:00:00Z",
    grossCents: 19_000,
    stripeFeeCents: 100,
    netCents: 18_900,
    purchaser: { name: "Synthetic Payer", email: "historical-payer@example.invalid", basis: "stripe_billing" },
    registrations: [{
      name: "Synthetic Attendee",
      email: "historical-attendee@example.invalid",
      unitPriceCents: 4_500,
      answers: { mobilityAccessibility: true, interpretationNeeded: false, fellowships: ["aa", "al_anon"], accommodations: "Synthetic confidential answer" },
    }],
    breakfasts: [
      { day: "friday", quantity: 2, unitPriceCents: 2_500 },
      { day: "sunday", quantity: 1, unitPriceCents: 2_500 },
    ],
    scholarships: [{ amountCents: 4_000, priceCents: 4_000, kind: "fund" }],
    merchandise: [{ quantity: 2, valueCents: 3_000, description: "Synthetic shirt", fulfillment: "event pickup" }],
    provenance,
  };
}

export function historicalManifest(payments = [checkoutFixture()]): HistoricalImport {
  return {
    version: 1,
    event: "necypaa_xxxvi",
    sources: { trackerSha256: "a".repeat(64), stripeSha256: "b".repeat(64) },
    payments,
    review: [{ kind: "excluded", row: 2, sheet: "Stripe CSV", reason: "Stripe payment is not present in the reconciled tracker." }],
  };
}

export function manualReceiptFixture(index: number): HistoricalPayment {
  const cashReference = index.toString(16).padStart(64, "0");
  return {
    sourceKey: `historical:manual:${cashReference}`, cashReference,
    source: "manual", status: "recorded", purchasedAt: null,
    currency: "USD", grossCents: 100, netCents: 100, stripeFeeCents: 0,
    checkoutFeeCents: 0, shippingCents: 0, discountCents: 0,
    registrations: [], breakfasts: [], scholarships: [],
    merchandise: [{ quantity: 1, valueCents: 100, description: "Synthetic offline purchase" }],
    provenance: { sheet: "Manual Ledger", row: index + 2 },
  };
}
