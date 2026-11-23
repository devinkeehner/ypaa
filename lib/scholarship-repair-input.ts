import { z } from "zod";
import { HistoricalInputError, stripePaymentAliases } from "./historical-import-input";

export const SCHOLARSHIP_REPAIR_FORMAT = "scholarship_repair";
export const SCHOLARSHIP_REPAIR_MAX_BYTES = 64 * 1024;
export const SCHOLARSHIP_REPAIR_MAX_RECEIPTS = 60;

const amount = z.int().min(1).max(10_000_000);
const stripeAliases = z.strictObject({
  checkoutSessionId: z.string().regex(/^cs_live_[A-Za-z0-9]{1,100}$/).optional(),
  paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]{1,100}$/).optional(),
  chargeId: z.string().regex(/^ch_[A-Za-z0-9]{1,100}$/).optional(),
  paymentId: z.string().regex(/^py_[A-Za-z0-9]{1,100}$/).optional(),
});
const receipt = z.strictObject({
  sourceKey: z.string().max(128),
  source: z.enum(["stripe", "manual"]),
  grossCents: amount,
  amountCents: amount,
  priceCents: amount,
  kind: z.enum(["donation", "general", "specific"]),
  stripe: stripeAliases.optional(),
  legacyCheckoutTotalCents: amount.optional(),
}).superRefine((value, ctx) => {
  if (value.amountCents > value.grossCents ||
    (value.kind === "specific" && value.amountCents !== value.priceCents)) {
    ctx.addIssue({ code: "custom", path: ["amountCents"], message: "The reviewed scholarship principal is invalid." });
  }
  if (value.source === "stripe") {
    const match = /^stripe:csv:((?:ch|py)_[A-Za-z0-9]{1,100})$/.exec(value.sourceKey);
    if (!match || !value.stripe || ![value.stripe.chargeId, value.stripe.paymentId].includes(match[1])) {
      ctx.addIssue({ code: "custom", path: ["sourceKey"], message: "Provide the exact Stripe export alias." });
    }
  } else if (value.stripe || !/^historical:manual:[a-f0-9]{64}$/.test(value.sourceKey) || value.kind !== "donation") {
    ctx.addIssue({ code: "custom", path: ["sourceKey"], message: "Provide the original manual ledger receipt key." });
  }
  if (value.legacyCheckoutTotalCents !== undefined && (value.source !== "stripe" ||
    !value.stripe?.checkoutSessionId || !value.stripe.paymentIntentId || !value.stripe.chargeId ||
    value.legacyCheckoutTotalCents !== value.amountCents || value.legacyCheckoutTotalCents >= value.grossCents)) {
    ctx.addIssue({ code: "custom", path: ["legacyCheckoutTotalCents"], message: "The legacy total requires all three Stripe references and matching scholarship principal." });
  }
});
const schema = z.strictObject({
  format: z.literal(SCHOLARSHIP_REPAIR_FORMAT),
  version: z.literal(1),
  event: z.literal("necypaa_xxxvi"),
  receipts: z.array(receipt).min(1).max(SCHOLARSHIP_REPAIR_MAX_RECEIPTS),
}).superRefine(({ receipts }, ctx) => {
  const seen = new Set<string>();
  for (const [index, entry] of receipts.entries()) {
    const keys = new Set([entry.sourceKey, ...stripePaymentAliases(entry)]);
    if ([...keys].some((key) => seen.has(key))) {
      ctx.addIssue({ code: "custom", path: ["receipts", index], message: "A payment cannot appear twice in the file." });
    }
    for (const key of keys) seen.add(key);
  }
});
export type ScholarshipRepairInput = z.infer<typeof schema>;
export type ScholarshipRepairReceipt = z.infer<typeof receipt>;

export function parseScholarshipRepair(bytes: Uint8Array): ScholarshipRepairInput {
  if (bytes.length > SCHOLARSHIP_REPAIR_MAX_BYTES) throw new HistoricalInputError("Upload a scholarship repair JSON file of at most 64 KB.", 413);
  let data: unknown;
  try { data = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new HistoricalInputError("The scholarship repair upload must be valid UTF-8 JSON."); }
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const [section, index] = parsed.error.issues[0]?.path ?? [];
    const row = section === "receipts" && typeof index === "number" ? ` Entry ${index + 1} is invalid.` : "";
    throw new HistoricalInputError(`The upload does not match the scholarship repair version 1 format.${row}`);
  }
  return parsed.data;
}
