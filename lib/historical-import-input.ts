import { createHash } from "node:crypto";
import { z } from "zod";
import { parseAffiliationMetadata, validSoberDate, type Fellowship } from "./registration-affiliation";
import { normalizeTracker, trackerSheets } from "./registration-tracker";
import { parseCsv, type CsvRow } from "./stripe-csv-import";

export const HISTORICAL_IMPORT_MAX_BYTES = 2 * 1024 * 1024;
const EVENT = "necypaa_xxxvi";
const EVENT_START = Date.parse("2026-01-10T22:54:26Z");
const EVENT_END = Date.parse("2027-01-05T05:00:00Z");
const DAYS = ["friday", "saturday", "sunday"] as const;
const sourceSheet = z.enum(["Payments", "Stripe CSV", "Cash Transactions", "Manual Ledger", "Registrations", "Breakfast Tickets", "Scholarship Fund", "Merchandise"]);
const rowNumber = z.int().min(2).max(5001);
const provenance = z.strictObject({ sheet: sourceSheet, row: rowNumber });
const cents = z.int().min(0).max(10_000_000);
const amount = cents.min(1);
const quantity = z.int().min(1).max(100);
const reference = z.string().regex(/^[A-Za-z0-9_:-]{1,160}$/);
const sha256 = z.string().regex(/^[a-f0-9]{64}$/);
const singleLine = (max: number) => z.string().trim().min(1).max(max).regex(/^[^\x00-\x1f\x7f]+$/);
const name = singleLine(200);
const email = z.email().max(254);
const purchaseDate = z.iso.datetime().refine((value) => Date.parse(value) >= Date.parse("2026-01-10T05:00:00Z") && Date.parse(value) < EVENT_END);
const reviewReason = z.enum([
  "Stripe payment is missing from the export.",
  "Stripe payment is outside the event, unpaid, uncaptured, refunded, or disputed.",
  "Stripe payment lacks checkout or event evidence.",
  "Stripe payment is not present in the reconciled tracker.",
  "Payment details disagree between the tracker and Stripe.",
  "Purchase detail rows do not reconcile to the payment.",
  "The gross total includes an unexplained allocation difference.",
  "Some attendee answers could not be matched or interpreted.",
  "Registration roster details need review.",
  "Cash row is represented in the manual ledger.",
  "Offline receipt cannot be validated.",
  "Manual ledger entry is marked excluded.",
  "Purchase detail has no matching payment.",
]);

const answersSchema = z.strictObject({
  fellowships: z.array(z.enum(["aa", "al_anon", "other"])).min(1).max(3).optional(),
  fellowshipOther: singleLine(80).optional(),
  homegroup: singleLine(120).optional(),
  committee: singleLine(120).optional(),
  homegroupCommittee: singleLine(250).optional(),
  accommodations: z.string().trim().min(1).max(1000).regex(/^[^\x00-\x08\x0b\x0c\x0e-\x1f\x7f]+$/).optional(),
  interpretationNeeded: z.boolean().optional(),
  mobilityAccessibility: z.boolean().optional(),
  willingToServe: z.boolean().optional(),
  soberDate: z.string().refine(validSoberDate).optional(),
  state: singleLine(120).optional(),
});
const registrationSchema = z.strictObject({
  name: name.optional(),
  email: email.optional(),
  unitPriceCents: amount,
  kind: z.enum(["registration", "specific-scholarship"]).optional(),
  identityBasis: z.enum(["stripe_form", "tracker_roster", "cash_roster"]).optional(),
  answers: answersSchema,
  provenance: provenance.optional(),
}).refine((value) => Boolean(value.name) === Boolean(value.email) && (value.name || !Object.keys(value.answers).length));
const scholarship = z.strictObject({
  kind: z.enum(["fund", "specific"]), amountCents: amount, priceCents: amount.optional(),
  recipient: registrationSchema.optional(), provenance: provenance.optional(),
}).refine((value) => value.kind === "specific" ? Boolean(value.recipient?.name) : value.recipient == null);
const breakfast = z.strictObject({ day: z.enum(DAYS), quantity, unitPriceCents: amount, provenance: provenance.optional() });
const merchandise = z.strictObject({ description: singleLine(250), quantity, valueCents: amount, fulfillment: singleLine(120).optional(), provenance: provenance.optional() });
const stripeIdentifiers = z.strictObject({
  chargeId: z.string().regex(/^ch_[A-Za-z0-9]{1,100}$/).optional(),
  paymentIntentId: z.string().regex(/^pi_[A-Za-z0-9]{1,100}$/).optional(),
  checkoutSessionId: z.string().regex(/^cs_live_[A-Za-z0-9]{1,100}$/).optional(),
  paymentId: z.string().regex(/^py_[A-Za-z0-9]{1,100}$/).optional(),
  customerId: z.string().regex(/^cus_[A-Za-z0-9]{1,100}$/).optional(),
});
const paymentSchema = z.strictObject({
  sourceKey: reference,
  source: z.enum(["stripe", "cash", "manual"]),
  status: z.enum(["paid", "recorded", "refunded", "disputed", "voided", "unknown"]),
  stripe: stripeIdentifiers.optional(),
  cashReference: reference.optional(),
  method: z.enum(["cash", "venmo", "unspecified", "offline"]).optional(),
  purchasedAt: purchaseDate.nullable(),
  currency: z.literal("USD"),
  grossCents: amount,
  stripeFeeCents: cents,
  netCents: cents,
  checkoutFeeCents: cents,
  shippingCents: cents,
  discountCents: cents,
  unallocatedCents: z.int().min(-10_000_000).max(10_000_000).optional(),
  purchaser: z.strictObject({ name, email, basis: z.enum(["stripe_billing", "cash_ledger"]).optional() }).optional(),
  registrations: z.array(registrationSchema).max(100),
  breakfasts: z.array(breakfast).max(100),
  scholarships: z.array(scholarship).max(100),
  merchandise: z.array(merchandise).max(100),
  provenance: z.strictObject({ paymentRow: rowNumber.optional(), stripeRow: rowNumber.optional(), sheet: sourceSheet.optional(), row: rowNumber.optional() }),
  reviewReasons: z.array(reviewReason).max(15).optional(),
}).superRefine((payment, context) => {
  const reject = (message: string) => context.addIssue({ code: "custom", message });
  if (payment.grossCents - payment.stripeFeeCents !== payment.netCents) reject("Payment gross, net, and Stripe fee do not reconcile.");
  const allocated = payment.registrations.reduce((total, line) => total + line.unitPriceCents, 0)
    + payment.breakfasts.reduce((total, line) => total + line.quantity * line.unitPriceCents, 0)
    + payment.scholarships.reduce((total, line) => total + line.amountCents, 0)
    + payment.merchandise.reduce((total, line) => total + line.valueCents, 0)
    + payment.shippingCents + payment.checkoutFeeCents - payment.discountCents;
  if (allocated <= 0 || allocated + (payment.unallocatedCents ?? 0) !== payment.grossCents) reject("Payment allocations do not reconcile.");
  if (payment.source === "stripe") {
    const aliases = stripePaymentAliases(payment);
    if (!aliases.some((alias) => payment.sourceKey === `stripe:csv:${alias}`)) reject("Stripe payment requires its canonical source key.");
    if (!payment.purchasedAt || !payment.provenance.stripeRow || !payment.provenance.paymentRow || payment.cashReference || payment.method || payment.status === "recorded") reject("Invalid Stripe payment provenance.");
  } else {
    if (!payment.cashReference || !payment.provenance.sheet || !payment.provenance.row || payment.stripeFeeCents !== 0 || payment.status === "paid" || stripePaymentAliases(payment).length) reject("Invalid offline payment provenance.");
    if (payment.source === "cash" && (!payment.purchasedAt || !payment.stripe?.customerId || payment.sourceKey !== `registration-import:cash:${payment.stripe.customerId}:${payment.cashReference}`)) reject("Invalid cash payment identity.");
    if (payment.source === "manual" && (payment.sourceKey !== `historical:manual:${payment.cashReference}` || payment.stripe || !sha256.safeParse(payment.cashReference).success)) reject("Invalid manual receipt identity.");
  }
  if ((payment.purchaser?.basis === "stripe_billing" && payment.source !== "stripe") || (payment.purchaser?.basis === "cash_ledger" && payment.source !== "cash")) reject("Invalid purchaser provenance.");
});

const reviewSchema = z.strictObject({ sheet: sourceSheet, row: rowNumber, reason: reviewReason, kind: z.enum(["excluded", "review"]), amountCents: cents.optional() });
const manifestSchema = z.strictObject({
  version: z.literal(1),
  event: z.literal(EVENT),
  sources: z.strictObject({ trackerSha256: sha256, stripeSha256: sha256 }),
  payments: z.array(paymentSchema).min(1).max(2000),
  review: z.array(reviewSchema).max(5000),
}).superRefine(({ payments }, context) => {
  const seen = new Set<string>();
  for (const payment of payments) {
    const keys = new Set([payment.sourceKey, ...stripePaymentAliases(payment)]);
    if ([...keys].some((key) => seen.has(key))) context.addIssue({ code: "custom", path: ["payments"], message: "Duplicate payment identity." });
    keys.forEach((key) => seen.add(key));
  }
});

export type HistoricalAnswers = z.infer<typeof answersSchema>;
export type HistoricalRegistration = z.infer<typeof registrationSchema>;
export type HistoricalPayment = z.infer<typeof paymentSchema>;
export type HistoricalReview = z.infer<typeof reviewSchema>;
export type HistoricalImport = z.infer<typeof manifestSchema>;

export class HistoricalInputError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function stripePaymentAliases(payment: Pick<HistoricalPayment, "stripe">): string[] {
  const { chargeId, paymentId, paymentIntentId, checkoutSessionId } = payment.stripe ?? {};
  return [chargeId, paymentId, paymentIntentId, checkoutSessionId].filter((value): value is string => Boolean(value));
}

export function parseHistoricalImport(bytes: Uint8Array): HistoricalImport {
  if (!bytes.length || bytes.length > HISTORICAL_IMPORT_MAX_BYTES) throw new HistoricalInputError("Upload a historical JSON file of at most 2 MB.", 413);
  let input: unknown;
  try { input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
  catch { throw new HistoricalInputError("The historical upload must be valid UTF-8 JSON."); }
  const parsed = manifestSchema.safeParse(input);
  if (!parsed.success) {
    // Neither input keys nor values belong in errors or logs. A numeric row is safe to return.
    const index = parsed.error.issues[0]?.path[1];
    const section = parsed.error.issues[0]?.path[0];
    const where = typeof index === "number" && (section === "payments" || section === "review") ? ` Invalid ${section === "payments" ? "payment" : "review"} entry ${index + 1}.` : "";
    throw new HistoricalInputError(`The upload does not match the historical import version 1 format.${where}`);
  }
  return parsed.data;
}

export function summarizeHistoricalImport(manifest: HistoricalImport) {
  const { payments } = manifest;
  const registrations = payments.flatMap((payment) => payment.registrations);
  const breakfasts = payments.flatMap((payment) => payment.breakfasts);
  const scholarships = payments.flatMap((payment) => payment.scholarships);
  return {
    payments: Object.fromEntries((["stripe", "cash", "manual"] as const).map((source) => [source, payments.filter((payment) => payment.source === source).length])),
    registrations: registrations.length,
    namedRegistrations: registrations.filter((registration) => registration.name).length,
    breakfastTickets: Object.fromEntries(DAYS.map((day) => [day, breakfasts.filter((line) => line.day === day).reduce((total, line) => total + line.quantity, 0)])),
    scholarshipContributions: scholarships.length,
    scholarshipCents: scholarships.reduce((total, line) => total + line.amountCents, 0),
    merchandiseItems: payments.flatMap((payment) => payment.merchandise).reduce((total, line) => total + line.quantity, 0),
    answers: {
      fellowship: registrations.filter((registration) => registration.answers.fellowships?.length).length,
      accommodations: registrations.filter((registration) => registration.answers.accommodations !== undefined).length,
      interpretation: registrations.filter((registration) => registration.answers.interpretationNeeded !== undefined).length,
      mobility: registrations.filter((registration) => registration.answers.mobilityAccessibility !== undefined).length,
    },
    review: manifest.review.reduce<Record<string, number>>((counts, item) => {
      counts[item.reason] = (counts[item.reason] ?? 0) + 1;
      return counts;
    }, {}),
  };
}

type Sheet = z.infer<typeof sourceSheet>;
type SourceRow = { row: number; cells: string[] };
type RosterEntry = ReturnType<typeof normalizeTracker>["rows"][number];
const digest = (data: Uint8Array | string) => createHash("sha256").update(data).digest("hex");
const text = (value: string | undefined) => (value ?? "").trim();
const folded = (value: string | undefined) => text(value).toLowerCase();
const placeholders = /^(?:none|not(?: |_)?applicable|n\/a|unknown|not specified|prefer not to answer|#formula|#error)$/i;
const detail = (value: string | undefined) => text(value) && !placeholders.test(text(value)) ? text(value) : undefined;
const metadata = (row: CsvRow, key: string) => text(row[`${key} (metadata)`]);
const validName = (value: string | undefined) => name.safeParse(detail(value)).success ? detail(value) : undefined;
const validEmail = (value: string | undefined) => email.safeParse(folded(value)).success ? folded(value) : undefined;

function dollars(value: string | undefined, blankIsZero = false) {
  const raw = text(value);
  if (!raw && blankIsZero) return 0;
  if (!/^\d+(?:\.\d+)?$/.test(raw)) throw new HistoricalInputError("A source amount is missing or invalid.");
  const scaled = Number(raw) * 100;
  const rounded = Math.round(scaled);
  if (!cents.safeParse(rounded).success || Math.abs(scaled - rounded) > 0.00001) throw new HistoricalInputError("A source amount has invalid precision or range.");
  return rounded;
}

function units(value: string | undefined) {
  const parsed = text(value) ? Number(value) : 0;
  if (!z.int().min(0).max(100).safeParse(parsed).success) throw new HistoricalInputError("A source quantity is invalid.");
  return parsed;
}

const excelEpoch = Date.UTC(1899, 11, 30);
const east = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
function wallClock(utc: number) {
  const parts = Object.fromEntries(east.formatToParts(new Date(utc)).map(({ type, value }) => [type, Number(value)]));
  return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
}
function excelWallTime(value: string | undefined) {
  if (!/^\d+(?:\.\d+)?$/.test(text(value))) throw new HistoricalInputError("A source date is invalid.");
  return Math.round((excelEpoch + Number(value) * 86400000) / 1000) * 1000;
}
function offlineDate(value: string | undefined) {
  if (!text(value)) return null;
  const wall = excelWallTime(value);
  let utc = wall;
  for (let attempt = 0; attempt < 3; attempt++) utc += wall - wallClock(utc);
  const date = new Date(utc).toISOString();
  if (!purchaseDate.safeParse(date).success || wallClock(utc) !== wall) throw new HistoricalInputError("An offline receipt date is outside the event or invalid.");
  return date;
}

function checkedRows(sheets: Record<string, string[][]>, sheet: Sheet, requiredHeaders: Record<number, string>, headerIndex = 0): SourceRow[] {
  const rows = sheets[sheet];
  if (!rows?.[headerIndex] || Object.entries(requiredHeaders).some(([index, header]) => rows[headerIndex][Number(index)] !== header)) throw new HistoricalInputError(`The tracker needs the supported ${sheet} layout.`);
  return rows.slice(headerIndex + 1).flatMap((cells, index) => cells?.some(Boolean) ? [{ row: index + headerIndex + 2, cells }] : []);
}

function detailIndex(rows: SourceRow[], column: number) {
  const index = new Map<string, SourceRow[]>();
  for (const row of rows) {
    const value = text(row.cells[column]);
    if (value) index.set(value, [...(index.get(value) ?? []), row]);
  }
  return index;
}

function stripeDate(row: CsvRow) {
  const date = text(row["Created date (UTC)"]);
  const match = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.\d{1,3})?Z?$/.exec(date);
  if (!match) return NaN;
  const utc = Date.parse(`${match[1]}T${match[2]}Z`);
  return Number.isFinite(utc) && new Date(utc).toISOString().slice(0, 19) === `${match[1]}T${match[2]}` ? utc : NaN;
}

function hasCheckoutEvidence(row: CsvRow) {
  return folded(row["necy_event_slug (metadata)"]) === EVENT
    || /^cs_live_[A-Za-z0-9]{1,100}$/.test(text(row["Checkout Session ID"]));
}

function eligibleStripe(row: CsvRow) {
  const project = folded(row["necy_project_source (metadata)"]);
  const event = folded(row["necy_event_slug (metadata)"]);
  const utc = stripeDate(row);
  return utc >= EVENT_START && utc < EVENT_END
    && ["", "necypaa_ct_site", "necypaa_registration_site"].includes(project)
    && ["", EVENT].includes(event)
    && !text(row["Checkout Session ID"]).startsWith("cs_test_")
    && hasCheckoutEvidence(row)
    && folded(row.Status) === "paid" && folded(row.Captured) === "true"
    && !["Decline Reason", "Refunded date (UTC)", "Dispute Date (UTC)", "Dispute Status", "Dispute Reason"].some((key) => text(row[key]))
    && ["Amount Refunded", "Converted Amount Refunded", "Disputed Amount"].every((key) => !text(row[key]) || /^0+(?:\.0+)?$/.test(text(row[key])));
}

function answerBoolean(value: string | undefined) {
  const parsed = folded(value);
  if (["true", "yes", "1"].includes(parsed)) return true;
  if (["false", "no", "0"].includes(parsed)) return false;
  return undefined;
}

function attendeeAnswers(row: CsvRow, scholarshipRecipient = false) {
  const field = (key: string, recipientKey: string) => metadata(row, scholarshipRecipient ? recipientKey : key);
  const structuredAffiliation = parseAffiliationMetadata(field("attendee_affiliation", "scholarship_affiliation"));
  const legacyFellowship = scholarshipRecipient ? undefined : detail(metadata(row, "fellowship"));
  let legacy: Fellowship[] | undefined;
  switch (folded(legacyFellowship).replace(/[^a-z]/g, "")) {
    case "aa": case "alcoholicsanonymous": legacy = ["aa"]; break;
    case "alanon": case "alanonfamilygroups": legacy = ["al_anon"]; break;
    case "aaalanon": case "alanonaa": case "both": legacy = ["aa", "al_anon"]; break;
  }
  const interpretations = field("interpretation_needed", "scholarship_recipient_interpretation");
  const mobility = field("mobility_accessibility", "scholarship_recipient_mobility");
  const oldMobility = scholarshipRecipient ? undefined : metadata(row, "handicap_accessibility");
  const service = field("willing_to_serve", "scholarship_recipient_willing_to_serve");
  const mobilityAnswer = answerBoolean(mobility);
  const legacyMobilityAnswer = answerBoolean(oldMobility);
  const conflictingMobility = mobilityAnswer !== undefined && legacyMobilityAnswer !== undefined && mobilityAnswer !== legacyMobilityAnswer;
  const proposed: HistoricalAnswers = {
    fellowships: structuredAffiliation.fellowships.length ? structuredAffiliation.fellowships : legacy,
    fellowshipOther: detail(structuredAffiliation.fellowshipOther),
    homegroup: detail(structuredAffiliation.homegroup),
    committee: detail(structuredAffiliation.committee),
    homegroupCommittee: detail(field("homegroup_committee", "scholarship_recipient_homegroup")),
    accommodations: detail(field("accommodations", "scholarship_recipient_accommodations")),
    interpretationNeeded: answerBoolean(interpretations),
    mobilityAccessibility: conflictingMobility ? undefined : mobilityAnswer ?? legacyMobilityAnswer,
    willingToServe: answerBoolean(service),
    state: detail(field("attendee_state", "scholarship_recipient_state")),
  };
  const answers: HistoricalAnswers = {};
  let hadIssue = conflictingMobility || Boolean(legacyFellowship && !legacy && !structuredAffiliation.fellowships.length)
    || [interpretations, mobility, oldMobility, service].some((value) => detail(value) && answerBoolean(value) === undefined);
  for (const [key, value] of Object.entries(proposed)) {
    if (value === undefined) continue;
    if (answersSchema.shape[key as keyof HistoricalAnswers].safeParse(value).success) Object.assign(answers, { [key]: value });
    else hadIssue = true;
  }
  return { answers, hadIssue };
}

function rosterRegistrations(rows: SourceRow[], roster: RosterEntry | undefined, stripe?: CsvRow) {
  if (!roster) return { registrations: [] as HistoricalRegistration[], hadIssue: false, fallback: false };
  if (roster.errors.length || rows.length !== roster.quantity) throw new HistoricalInputError("Registration roster does not reconcile.");
  const seen = new Set<string>();
  let hadIssue = false;
  let fallback = false;
  const explicitName = stripe && (metadata(stripe, "attendee_name") || [metadata(stripe, "attendee_first_name"), metadata(stripe, "attendee_last_name")].filter(Boolean).join(" "));
  const explicitEmail = stripe && validEmail(metadata(stripe, "attendee_email"));
  const registrations = rows.map(({ row, cells }) => {
    const source = { unitPriceCents: dollars(cells[6]), provenance: { sheet: "Registrations" as const, row } };
    const attendeeName = validName(cells[3]);
    const attendeeEmail = validEmail(cells[4]);
    if (!attendeeName || !attendeeEmail) throw new HistoricalInputError("A registration roster identity is invalid.");
    const key = [folded(attendeeName), attendeeEmail].join(":");
    if (seen.has(key)) return { ...source, answers: {} };
    seen.add(key);
    const exact = stripe && explicitEmail === attendeeEmail && folded(explicitName) === folded(attendeeName);
    if (exact) {
      const normalized = attendeeAnswers(stripe);
      hadIssue ||= normalized.hadIssue;
      return { ...source, name: attendeeName, email: attendeeEmail, identityBasis: "stripe_form" as const, answers: normalized.answers };
    }
    fallback ||= Boolean(stripe);
    return { ...source, name: attendeeName, email: attendeeEmail, identityBasis: stripe ? "tracker_roster" as const : "cash_roster" as const, answers: {} };
  });
  return { registrations, hadIssue, fallback };
}

type PurchaseLines = Pick<HistoricalPayment, "registrations" | "breakfasts" | "scholarships" | "merchandise">;
const emptyLines = (): PurchaseLines => ({ registrations: [], breakfasts: [], scholarships: [], merchandise: [] });
const lineValue = (items: PurchaseLines) => items.registrations.reduce((total, item) => total + item.unitPriceCents, 0)
  + items.breakfasts.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0)
  + items.scholarships.reduce((total, item) => total + item.amountCents, 0)
  + items.merchandise.reduce((total, item) => total + item.valueCents, 0);

function merchandiseLine({ row, cells }: SourceRow) {
  return merchandise.parse({ description: cells[3], quantity: units(cells[4]), valueCents: dollars(cells[6]), fulfillment: detail(cells[5]), provenance: { sheet: "Merchandise", row } });
}

function scholarshipLine({ row, cells }: SourceRow, stripe: CsvRow) {
  const amountCents = dollars(cells[3]);
  const priceCents = dollars(cells[4], true) || undefined;
  const base = { amountCents, priceCents, provenance: { sheet: "Scholarship Fund" as const, row } };
  const recipientName = validName(metadata(stripe, "scholarship_recipient_name"));
  const recipientEmail = validEmail(metadata(stripe, "scholarship_recipient_email"));
  if (recipientName && recipientEmail && cells[8] === "Scholarship") {
    const answers = attendeeAnswers(stripe, true);
    return { line: scholarship.parse({ ...base, kind: "specific", recipient: { name: recipientName, email: recipientEmail,
      unitPriceCents: priceCents || amountCents, kind: "specific-scholarship", identityBasis: "stripe_form", answers: answers.answers } }), hadIssue: answers.hadIssue };
  }
  return { line: scholarship.parse({ ...base, kind: "fund" }), hadIssue: Boolean(recipientEmail || (recipientName && !/^(?:general |scholarship )?fund$/i.test(recipientName))) };
}

function stripeIdentifiersFor(id: string, row: CsvRow) {
  return stripeIdentifiers.parse({
    chargeId: id.startsWith("ch_") ? id : undefined,
    paymentId: id.startsWith("py_") ? id : undefined,
    paymentIntentId: text(row["PaymentIntent ID"]) || (id.startsWith("pi_") ? id : undefined),
    checkoutSessionId: text(row["Checkout Session ID"]) || (id.startsWith("cs_") ? id : undefined),
    customerId: text(row["Customer ID"]) || undefined,
  });
}

function receiptsMatch(tracker: string[], csv: CsvRow) {
  return tracker[6] === "USD" && folded(csv.Currency) === "usd" && wallClock(stripeDate(csv)) === excelWallTime(tracker[0])
    && dollars(tracker[2]) === dollars(csv.Amount) && dollars(tracker[3]) === dollars(csv.Fee, true) + dollars(csv["Taxes On Fee"], true)
    && dollars(tracker[1]) === dollars(tracker[2]) - dollars(tracker[3]);
}

function validateDetailAmounts({ cells }: SourceRow, lines: PurchaseLines) {
  const { registrations, breakfasts, merchandise: goods, scholarships } = lines;
  if (registrations.length !== units(cells[14]) + units(cells[15]) + units(cells[21])) throw new HistoricalInputError("Registration counts do not reconcile.");
  if (DAYS.some((day, index) => units(cells[18 + index]) !== breakfasts.filter((line) => line.day === day).length)) throw new HistoricalInputError("Breakfast counts do not reconcile.");
  if (units(cells[17]) !== breakfasts.length || units(cells[22]) !== goods.reduce((total, line) => total + line.quantity, 0)) throw new HistoricalInputError("Purchase counts do not reconcile.");
  if (registrations.reduce((total, line) => total + line.unitPriceCents, 0) !== dollars(cells[4], true)
    || breakfasts.reduce((total, line) => total + line.unitPriceCents, 0) !== dollars(cells[5], true)
    || goods.reduce((total, line) => total + line.valueCents, 0) !== dollars(cells[23], true)
    || scholarships.reduce((total, line) => total + line.amountCents, 0) !== dollars(cells[27], true)) throw new HistoricalInputError("Purchase subtotals do not reconcile.");
}

function parseStripeRows(bytes: Uint8Array) {
  if (!bytes.length || bytes.length > HISTORICAL_IMPORT_MAX_BYTES) throw new HistoricalInputError("Provide a Stripe payment CSV of at most 2 MB.", 413);
  let source: string;
  try { source = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
  catch { throw new HistoricalInputError("The Stripe export must use UTF-8."); }
  let rows: CsvRow[];
  try { rows = parseCsv(source); }
  catch { throw new HistoricalInputError("The Stripe export is not valid CSV."); }
  const required = ["id", "Created date (UTC)", "Status", "Captured", "Amount", "Currency", "Fee", "Taxes On Fee", "Refunded date (UTC)", "Amount Refunded", "Converted Amount Refunded", "Decline Reason", "Disputed Amount", "Dispute Date (UTC)", "Dispute Status", "Dispute Reason", "Customer ID", "PaymentIntent ID", "Checkout Session ID"];
  if (!rows.length || rows.length > 5000 || !required.every((key) => Object.hasOwn(rows[0], key))) throw new HistoricalInputError("Use the complete Stripe unified payments CSV export.");
  const ids = new Set<string>();
  return rows.map((cells, index) => {
    const id = text(cells.id);
    if (!id || ids.has(id)) throw new HistoricalInputError("The Stripe export has a missing or duplicate payment ID.");
    ids.add(id);
    return { id, row: index + 2, cells };
  });
}

function manualReceipt(key: string, fields: Pick<HistoricalPayment, "purchasedAt" | "grossCents" | "method" | "provenance"> & Partial<PurchaseLines & Pick<HistoricalPayment, "shippingCents">>): HistoricalPayment {
  const cashReference = digest(key);
  return paymentSchema.parse({ ...emptyLines(), checkoutFeeCents: 0, stripeFeeCents: 0, discountCents: 0, shippingCents: 0,
    netCents: fields.grossCents, sourceKey: `historical:manual:${cashReference}`, cashReference, source: "manual", status: "recorded", currency: "USD", ...fields });
}

export function buildHistoricalImport(trackerBytes: Uint8Array, stripeBytes: Uint8Array): HistoricalImport {
  const sheets = trackerSheets(trackerBytes, true);
  const trackerRows = checkedRows(sheets, "Payments", { 22: "Merchandise Qty", 23: "Allocated Merch Value", 24: "Checkout Fee Line", 25: "Shipping Collected", 27: "Scholarship Value", 28: "Registration Discount" });
  const registrationRows = checkedRows(sheets, "Registrations", { 9: "Charge / Customer ID" });
  const cashRows = checkedRows(sheets, "Cash Transactions", { 9: "Customer ID", 11: "Redemption / Correlation ID" });
  const breakfastRows = checkedRows(sheets, "Breakfast Tickets", { 5: "Breakfast Day", 6: "Ticket Value", 9: "Charge ID" });
  const fundRows = checkedRows(sheets, "Scholarship Fund", { 3: "Fund Amount", 4: "Price at Payment", 7: "Charge / Customer ID", 9: "Payment Method" }).filter(({ cells }) => cells.slice(0, 10).some(Boolean));
  const merchRows = checkedRows(sheets, "Merchandise", { 3: "Item", 4: "Qty", 6: "Allocated Merch Value", 7: "Shipping Collected", 10: "Charge / Ledger Reference", 11: "Payment Method" });
  const manualRows = checkedRows(sheets, "Manual Ledger", { 0: "Entry ID", 1: "Date", 3: "Method", 4: "Type", 5: "Include", 6: "Amount", 7: "Price", 8: "Registration Qty" }, 4).filter(({ cells }) => cells.slice(0, 10).some(Boolean));
  const stripeRows = parseStripeRows(stripeBytes);
  const trackerIndex = detailIndex(trackerRows, 7);
  if (trackerIndex.size !== trackerRows.length) throw new HistoricalInputError("The tracker has a missing or duplicate payment ID.");
  const stripeIndex = new Map(stripeRows.map((source) => [source.id, source]));
  const rosterIndex = new Map(normalizeTracker(sheets).rows.map((record) => [record.reference, record]));
  const registrationIndex = detailIndex(registrationRows, 9);
  const breakfastIndex = detailIndex(breakfastRows, 9);
  const fundIndex = detailIndex(fundRows, 7);
  const merchIndex = detailIndex(merchRows, 10);
  const payments: HistoricalPayment[] = [];
  const review: HistoricalReview[] = [];
  const report = (sheet: Sheet, row: number, reason: HistoricalReview["reason"], kind: HistoricalReview["kind"] = "review", amountCents?: number) => {
    review.push({ sheet, row, reason, kind, amountCents });
  };

  for (const tracker of trackerRows) {
    const { cells, row } = tracker;
    const id = cells[7];
    const stripe = stripeIndex.get(id);
    if (!stripe) { report("Payments", row, "Stripe payment is missing from the export."); continue; }
    if (!eligibleStripe(stripe.cells)) {
      report("Payments", row, hasCheckoutEvidence(stripe.cells)
        ? "Stripe payment is outside the event, unpaid, uncaptured, refunded, or disputed."
        : "Stripe payment lacks checkout or event evidence.", "excluded");
      continue;
    }
    let matches: boolean;
    try { matches = receiptsMatch(cells, stripe.cells); } catch { matches = false; }
    if (!matches) { report("Payments", row, "Payment details disagree between the tracker and Stripe."); continue; }

    try {
      const roster = rosterRegistrations(registrationIndex.get(id) ?? [], rosterIndex.get(id), stripe.cells);
      const breakfasts = (breakfastIndex.get(id) ?? []).map(({ row, cells }) => breakfast.parse({ day: folded(cells[5]), quantity: 1, unitPriceCents: dollars(cells[6]), provenance: { sheet: "Breakfast Tickets", row } }));
      const fund = (fundIndex.get(id) ?? []).map((line) => scholarshipLine(line, stripe.cells));
      const merchandise = (merchIndex.get(id) ?? []).map(merchandiseLine);
      const lines = { registrations: roster.registrations, breakfasts, scholarships: fund.map(({ line }) => line), merchandise };
      validateDetailAmounts(tracker, lines);
      const grossCents = dollars(cells[2]);
      const shippingCents = dollars(cells[25], true);
      const checkoutFeeCents = dollars(cells[24], true);
      const discountCents = dollars(cells[28], true);
      const unallocatedCents = grossCents - lineValue(lines) - shippingCents - checkoutFeeCents + discountCents;
      const purchaserName = validName(stripe.cells["Card Name"]);
      const purchaserEmail = validEmail(stripe.cells["Customer Email"]);
      const payment = paymentSchema.parse({
        sourceKey: `stripe:csv:${id}`, source: "stripe", status: "paid", stripe: stripeIdentifiersFor(id, stripe.cells),
        purchasedAt: new Date(stripeDate(stripe.cells)).toISOString(), currency: "USD", grossCents, netCents: dollars(cells[1]), stripeFeeCents: dollars(cells[3]), checkoutFeeCents, shippingCents, discountCents,
        unallocatedCents: unallocatedCents || undefined, purchaser: purchaserName && purchaserEmail ? { name: purchaserName, email: purchaserEmail, basis: "stripe_billing" } : undefined,
        ...lines, provenance: { paymentRow: row, stripeRow: stripe.row },
      });
      payments.push(payment);
      if (unallocatedCents) report("Payments", row, "The gross total includes an unexplained allocation difference.", "review", Math.abs(unallocatedCents));
      if (roster.fallback) report("Payments", row, "Registration roster details need review.");
      if (roster.hadIssue || fund.some((item) => item.hadIssue)) report("Stripe CSV", stripe.row, "Some attendee answers could not be matched or interpreted.");
    } catch {
      report("Payments", row, "Purchase detail rows do not reconcile to the payment.");
    }
  }

  for (const stripe of stripeRows) if (!trackerIndex.has(stripe.id)) {
    const eligible = eligibleStripe(stripe.cells);
    const reason = eligible ? "Stripe payment is not present in the reconciled tracker."
      : hasCheckoutEvidence(stripe.cells) ? "Stripe payment is outside the event, unpaid, uncaptured, refunded, or disputed."
      : "Stripe payment lacks checkout or event evidence.";
    report("Stripe CSV", stripe.row, reason, eligible ? "review" : "excluded");
  }

  for (const { row, cells } of cashRows) {
    if (cells[3] === "Scholarship Fund" && text(cells[10]).startsWith("Edit Manual Ledger;") && cells[7] === "#FORMULA") {
      report("Cash Transactions", row, "Cash row is represented in the manual ledger.", "excluded");
      continue;
    }
    try {
      const customerId = text(cells[9]);
      const cashReference = text(cells[11]) || "legacy-customer";
      const grossCents = dollars(cells[4]);
      const purchaserName = validName(cells[1]);
      const purchaserEmail = validEmail(cells[2]);
      const lines = emptyLines();
      if (cells[3] === "Registration") {
        const roster = rosterIndex.get(customerId);
        if (!roster || roster.source !== "cash") throw new HistoricalInputError("Cash receipt has no matching registration.");
        lines.registrations = rosterRegistrations(registrationIndex.get(customerId) ?? [], roster).registrations;
      } else if (cells[3] === "Scholarship Fund" && cashReference !== "legacy-customer") {
        lines.scholarships.push({ kind: "fund", amountCents: dollars(cells[7]), priceCents: dollars(cells[5]), provenance: { sheet: "Cash Transactions", row } });
      } else throw new HistoricalInputError("Cash receipt type is not supported.");
      payments.push(paymentSchema.parse({
        sourceKey: `registration-import:cash:${customerId}:${cashReference}`, source: "cash", status: "recorded", stripe: { customerId }, cashReference, method: "cash",
        purchasedAt: offlineDate(cells[0]), currency: "USD", grossCents, stripeFeeCents: 0, netCents: grossCents, checkoutFeeCents: 0, shippingCents: 0, discountCents: 0,
        purchaser: purchaserName && purchaserEmail ? { name: purchaserName, email: purchaserEmail, basis: "cash_ledger" } : undefined,
        ...lines, provenance: { sheet: "Cash Transactions", row },
      }));
    } catch { report("Cash Transactions", row, "Offline receipt cannot be validated."); }
  }

  for (const { row, cells } of manualRows) {
    const included = folded(cells[5]);
    if (included === "no") { report("Manual Ledger", row, "Manual ledger entry is marked excluded.", "excluded"); continue; }
    try {
      const reference = text(cells[0]);
      const method = folded(cells[3]);
      if (included !== "yes" || !reference || reference.startsWith("#") || !["cash", "venmo", "unspecified"].includes(method)) throw new HistoricalInputError("Manual receipt is incomplete.");
      const grossCents = dollars(cells[6]);
      const unitPriceCents = dollars(cells[7]);
      const lines = emptyLines();
      const evidence = { sheet: "Manual Ledger" as const, row };
      if (cells[4] === "Registration") lines.registrations = Array.from({ length: units(cells[8]) }, () => ({ unitPriceCents, answers: {}, provenance: evidence }));
      else if (cells[4] === "Scholarship") lines.scholarships.push({ kind: "fund", amountCents: grossCents, priceCents: unitPriceCents, provenance: evidence });
      else throw new HistoricalInputError("Manual receipt type is not supported.");
      payments.push(manualReceipt(`manual-ledger:${reference.toUpperCase()}`, { ...lines, provenance: evidence, purchasedAt: offlineDate(cells[1]), grossCents, method: method as "cash" | "venmo" | "unspecified" }));
    } catch { report("Manual Ledger", row, "Offline receipt cannot be validated."); }
  }

  for (const source of merchRows) {
    const { row, cells } = source;
    if (cells[11] === "Stripe") {
      if (!trackerIndex.has(cells[10])) report("Merchandise", row, "Purchase detail has no matching payment.");
      continue;
    }
    try {
      const reference = text(cells[10]);
      if (cells[11] !== "Offline" || !reference || reference.startsWith("#") || trackerIndex.has(reference)) throw new HistoricalInputError("Merchandise receipt lacks a stable offline reference.");
      payments.push(manualReceipt(`merch-deposit:${reference.toUpperCase()}`, {
        grossCents: dollars(cells[9]), shippingCents: dollars(cells[7], true), merchandise: [merchandiseLine(source)],
        purchasedAt: offlineDate(cells[0]), method: "offline", provenance: { sheet: "Merchandise", row },
      }));
    } catch { report("Merchandise", row, "Offline receipt cannot be validated."); }
  }

  const cashIndex = detailIndex(cashRows, 9);
  for (const [sheet, rows, idColumn] of [["Registrations", registrationRows, 9], ["Breakfast Tickets", breakfastRows, 9], ["Scholarship Fund", fundRows, 7]] as const) {
    for (const { row, cells } of rows) if (!trackerIndex.has(cells[idColumn]) && !(sheet === "Registrations" && cashIndex.has(cells[idColumn]))) report(sheet, row, "Purchase detail has no matching payment.");
  }

  const manifest = { version: 1, event: EVENT, sources: { trackerSha256: digest(trackerBytes), stripeSha256: digest(stripeBytes) }, payments, review };
  // Validate with the exact server parser, including the final encoded upload size.
  return parseHistoricalImport(Buffer.from(JSON.stringify(manifest)));
}
