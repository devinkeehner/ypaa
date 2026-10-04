import { breakfastCount, type RegistrationOrder } from "./registration";

const cents = (value: unknown, allowZero = false): number | null => {
  if ((typeof value !== "number" && typeof value !== "string") || value === "") return null;
  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount >= (allowZero ? 0 : 1) && amount <= 10000000 ? amount : null;
};

// The authenticated paid-order report supplies prices; the legacy checkout
// default and metadata ticket counters can disagree with the amount paid.
export function registrationReceiptPriceCents(order: RegistrationOrder, context: Record<string, unknown>, rawOrder: unknown): number | null {
  if (!order.selfRegistration) return null;
  const explicitPrice = cents(context.registrationUnitPriceCents);
  if (explicitPrice !== null) return explicitPrice;
  const total = cents(context.totalCents);
  const fee = cents(context.processingFeeCents, true);
  const subtotal = total !== null && fee !== null ? cents(total - fee) : cents(context.subtotalCents);
  if (subtotal === null) return null;
  const raw = rawOrder && typeof rawOrder === "object" && !Array.isArray(rawOrder) ? rawOrder as Record<string, unknown> : {};
  // Merchandise/shipping amounts are not itemized in this reporting contract.
  if (raw.merchandise != null && (!Array.isArray(raw.merchandise) || raw.merchandise.length)) return null;
  let otherItems = 0;
  const breakfasts = breakfastCount(order);
  if (breakfasts) {
    const unitPrice = cents(context.breakfastUnitPriceCents);
    if (unitPrice === null) return null;
    otherItems += breakfasts * unitPrice;
  }
  if (order.scholarship.enabled) {
    const scholarship = raw.scholarship && typeof raw.scholarship === "object" ? raw.scholarship as Record<string, unknown> : {};
    const amount = cents(scholarship.amountCents);
    if (amount === null) return null;
    otherItems += amount;
  }
  return cents(subtotal - otherItems);
}
