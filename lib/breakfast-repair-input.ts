import { z } from "zod";
import { HistoricalInputError, stripePaymentAliases } from "./historical-import-input";

export const BREAKFAST_REPAIR_FORMAT = "breakfast_repair";
export const BREAKFAST_REPAIR_MAX_BYTES = 64 * 1024;
export const BREAKFAST_REPAIR_MAX_RECEIPTS = 50;
export const BREAKFAST_REPAIR_MAX_CONFIRM_TICKETS = 100;
const daySchema = z.enum(["friday", "saturday", "sunday"]);
const cents = z.int().min(1).max(10_000_000);
const dayQuantity = z.strictObject({
  day: daySchema,
  quantity: z.int().min(1).max(100),
  unitPriceCents: cents,
});

const receiptSchema = z.strictObject({
  sourceKey: z.string().regex(/^stripe:csv:(?:ch|py)_[A-Za-z0-9]{1,100}$/),
  stripe: z.strictObject({
    checkoutSessionId: z.string().regex(/^cs_live_[A-Za-z0-9]{1,100}$/),
    paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]{1,100}$/),
    chargeId: z.string().regex(/^ch_[A-Za-z0-9]{1,100}$/).optional(),
    paymentId: z.string().regex(/^py_[A-Za-z0-9]{1,100}$/).optional(),
  }),
  grossCents: cents,
  days: z.array(dayQuantity).min(1).max(3),
}).superRefine((receipt, ctx) => {
  if (![receipt.stripe.chargeId, receipt.stripe.paymentId].some((id) => id && receipt.sourceKey === `stripe:csv:${id}`)) {
    ctx.addIssue({ code: "custom", path: ["sourceKey"], message: "The source key must identify its Stripe payment." });
  }
  if (new Set(receipt.days.map(({ day }) => day)).size !== receipt.days.length) {
    ctx.addIssue({ code: "custom", path: ["days"], message: "Each breakfast day must appear once per receipt." });
  }
  const breakfastTotal = receipt.days.reduce((sum, day) => sum + day.quantity * day.unitPriceCents, 0);
  if (breakfastTotal > receipt.grossCents) {
    ctx.addIssue({ code: "custom", path: ["days"], message: "The breakfast total exceeds the paid receipt amount." });
  }
});

const fileSchema = z.strictObject({
  format: z.literal(BREAKFAST_REPAIR_FORMAT),
  version: z.literal(1),
  event: z.literal("necypaa_xxxvi"),
  receipts: z.array(receiptSchema).min(1).max(BREAKFAST_REPAIR_MAX_RECEIPTS),
}).superRefine(({ receipts }, ctx) => {
  const seen = new Set<string>();
  for (const [index, receipt] of receipts.entries()) {
    const aliases = stripePaymentAliases(receipt);
    if (aliases.some((alias) => seen.has(alias))) {
      ctx.addIssue({ code: "custom", path: ["receipts", index], message: "Stripe aliases must be unique across receipts." });
    }
    for (const alias of aliases) seen.add(alias);
  }
});

export type BreakfastRepairInput = z.infer<typeof fileSchema>;
export type BreakfastRepairReceipt = z.infer<typeof receiptSchema>;
export type BreakfastRepairDay = z.infer<typeof daySchema>;

export function parseBreakfastRepair(bytes: Uint8Array): BreakfastRepairInput {
  if (bytes.length > BREAKFAST_REPAIR_MAX_BYTES) {
    throw new HistoricalInputError("Upload a breakfast repair JSON file of at most 64 KB.", 413);
  }
  let input: unknown;
  try {
    input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new HistoricalInputError("The breakfast repair upload must be valid UTF-8 JSON.");
  }

  const parsed = fileSchema.safeParse(input);
  if (!parsed.success) {
    // Report only a row position. The upload can contain unexpected private values.
    const [section, index] = parsed.error.issues[0]?.path ?? [];
    const receipt = section === "receipts" && typeof index === "number" ? ` Invalid receipt entry ${index + 1}.` : "";
    throw new HistoricalInputError(`The upload does not match the breakfast repair version 1 format.${receipt}`);
  }
  return parsed.data;
}
