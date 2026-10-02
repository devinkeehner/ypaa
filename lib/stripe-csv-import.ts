import { readFile } from "node:fs/promises";

import { BREAKFASTS, BREAKFAST_PRICE_CENTS } from "@/lib/registration";
import { orderFromStripeMetadata, recordRegistrationOrder, type RecordContext } from "@/lib/registration-records";
import type { Payload } from "payload";

export type CsvRow = Record<string, string>;

export type NormalizedStripePayment = {
  rowNumber: number;
  source: CsvRow;
  metadata: Record<string, string>;
  order: ReturnType<typeof orderFromStripeMetadata>;
  context: RecordContext;
  category: string;
  breakfastCounts: Record<(typeof BREAKFASTS)[number]["id"], number>;
};

export type ImportSummary = {
  sourceRows: number;
  normalizedRows: number;
  excludedRows: Array<{ rowNumber: number; id: string; reason: string }>;
  attendeeCandidates: number;
  uniqueAttendeeEmails: number;
  breakfastTickets: Record<string, number>;
  checkoutOrders: number;
  warnings: string[];
  created: { attendees: number; breakfastTickets: number; checkoutOrders: number; entitlements: number };
  updated: { attendees: number; breakfastTickets: number; checkoutOrders: number; entitlements: number };
};

const COMMITTEE_START_UTC = Date.parse("2026-01-10T22:54:26Z");
const TICKET_LABELS: Record<string, "friday" | "saturday" | "sunday"> = {
  "New Year's Day Breakfast - Friday": "friday",
  "Breakfast - Saturday": "saturday",
  "Breakfast - Sunday": "sunday",
};
const NECYPAA_PROJECT_SOURCES = new Set(["necypaa_ct_site", "necypaa_registration_site"]);

const text = (row: CsvRow, key: string) => String(row[key] || "").trim();
const int = (value: unknown) => Math.max(0, Math.min(20, Math.floor(Number(value) || 0)));
const moneyCents = (value: unknown) => Math.max(0, Math.round((Number(value) || 0) * 100));
const bool = (value: string) => ["true", "1", "yes"].includes(value.trim().toLowerCase());
const useful = (value: string, fallback = "") => value && !["none", "not applicable", "not_applicable"].includes(value.toLowerCase()) ? value : fallback;

export function parseCsv(input: string): CsvRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    const next = input[index + 1];
    if (quoted) {
      if (character === '"' && next === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
    } else if (character === '"' && field.length === 0) quoted = true;
    else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += character;
  }
  if (quoted) throw new Error("CSV contains an unterminated quoted field.");
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  if (!rows.length) return [];

  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim());
  return rows.slice(1).filter((values) => values.some(Boolean)).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function normalizeMissingMetadata(row: CsvRow) {
  const purchaseType = text(row, "purchase_type (metadata)");
  const effectiveType = purchaseType || text(row, "intent (metadata)");
  const selfQuantity = int(text(row, "self_registration_quantity (metadata)"));
  const giftQuantity = int(text(row, "gift_quantity (metadata)"));
  const scholarshipQuantity = int(text(row, "scholarship_quantity (metadata)")) || giftQuantity;
  const breakfastCount = int(text(row, "breakfast_count (metadata)"));
  const breakfastCounts = { friday: 0, saturday: 0, sunday: 0 };
  const tickets = text(row, "breakfast_tickets (metadata)");
  for (const [label, day] of Object.entries(TICKET_LABELS)) if (tickets && tickets.toLowerCase() !== "none" && tickets.includes(label)) breakfastCounts[day] = 1;

  const hasRegistration = selfQuantity > 0 || ["self", "self_plus_scholarship"].includes(effectiveType);
  const hasScholarship = scholarshipQuantity > 0 || ["scholarship", "self_plus_scholarship"].includes(effectiveType);
  const hasBreakfast = breakfastCount > 0 || Object.values(breakfastCounts).some(Boolean) || effectiveType === "breakfast_only";
  const hasDonation = effectiveType === "donation";
  const registrationQuantity = hasRegistration ? Math.max(1, selfQuantity) : 0;
  let category = "manual_review";
  if (hasDonation) category = "donation_only";
  else if (hasRegistration && hasScholarship && hasBreakfast) category = "registration_plus_scholarship_plus_breakfast";
  else if (hasRegistration && hasScholarship) category = "registration_plus_scholarship";
  else if (hasRegistration && hasBreakfast) category = "registration_plus_breakfast";
  else if (hasScholarship && hasBreakfast) category = "scholarship_plus_breakfast";
  else if (hasRegistration) category = "registration_only";
  else if (hasScholarship) category = "scholarship_only";
  else if (hasBreakfast) category = "breakfast_only";

  return {
    "necy_project_source (metadata)": "necypaa_ct_site",
    "necy_reporting_category (metadata)": category,
    "necy_has_registration (metadata)": String(hasRegistration),
    "necy_has_breakfast (metadata)": String(hasBreakfast),
    "necy_has_scholarship (metadata)": String(hasScholarship),
    "necy_registration_qty_35 (metadata)": "0",
    "necy_registration_qty_40 (metadata)": String(registrationQuantity),
    "necy_scholarship_qty (metadata)": String(scholarshipQuantity),
    "necy_breakfast_count (metadata)": String(breakfastCount || Object.values(breakfastCounts).reduce((sum, value) => sum + value, 0)),
    "necy_breakfast_friday_qty (metadata)": String(breakfastCounts.friday),
    "necy_breakfast_saturday_qty (metadata)": String(breakfastCounts.saturday),
    "necy_breakfast_sunday_qty (metadata)": String(breakfastCounts.sunday),
    "necy_breakfast_unit_price_cents (metadata)": String(hasBreakfast ? BREAKFAST_PRICE_CENTS : 0),
    "necy_event_slug (metadata)": "necypaa_xxxvi",
    "necy_schema_version (metadata)": "2026-03-slim",
    "necy_data_origin (metadata)": "live_checkout",
    "necy_has_merch (metadata)": "false",
  } satisfies CsvRow;
}

function metadataFromRow(row: CsvRow): Record<string, string> {
  const metadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) if (key.endsWith(" (metadata)")) metadata[key.replace(/ \(metadata\)$/, "")] = value;
  return metadata;
}

function attendeeName(row: CsvRow) {
  return text(row, "attendee_name (metadata)")
    || [text(row, "attendee_first_name (metadata)"), text(row, "attendee_last_name (metadata)" )].filter(Boolean).join(" ")
    || text(row, "donor_name (metadata)") || text(row, "cardholder_name (metadata)");
}

function attendeeEmail(row: CsvRow) {
  return text(row, "attendee_email (metadata)") || text(row, "customer_email (metadata)") || text(row, "Customer Email") || text(row, "donor_email (metadata)");
}

export function normalizeRows(rows: CsvRow[]) {
  const normalized: NormalizedStripePayment[] = [];
  const excludedRows: ImportSummary["excludedRows"] = [];
  for (const [index, original] of rows.entries()) {
    const rowNumber = index + 2;
    const id = text(original, "id");
    const createdText = text(original, "Created date (UTC)");
    const created = Date.parse(createdText && !/[zZ]|[+-]\d\d:?\d\d$/.test(createdText) ? `${createdText}Z` : createdText);
    if (!created || created <= COMMITTEE_START_UTC) { excludedRows.push({ rowNumber, id, reason: "before committee start or invalid date" }); continue; }
    if (text(original, "Status").toLowerCase() !== "paid") { excludedRows.push({ rowNumber, id, reason: "not paid" }); continue; }
    if (!bool(text(original, "Captured"))) { excludedRows.push({ rowNumber, id, reason: "not captured" }); continue; }
    if (text(original, "Decline Reason") || text(original, "Refunded date (UTC)") || moneyCents(text(original, "Amount Refunded")) > 0 || moneyCents(text(original, "Converted Amount Refunded")) > 0) { excludedRows.push({ rowNumber, id, reason: "declined or refunded" }); continue; }

    const row = { ...original };
    if (!text(row, "necy_project_source (metadata)")) Object.assign(row, normalizeMissingMetadata(row));
    if (!NECYPAA_PROJECT_SOURCES.has(text(row, "necy_project_source (metadata)").toLowerCase())) { excludedRows.push({ rowNumber, id, reason: `project source is ${text(row, "necy_project_source (metadata)") || "missing"}` }); continue; }
    const metadata = metadataFromRow(row);
    for (const key of ["necy_has_registration", "necy_has_breakfast", "necy_has_scholarship"]) if (metadata[key]) metadata[key] = metadata[key].toLowerCase();
    const purchaser = { name: text(row, "Card Name") || attendeeName(row) || "Stripe customer", email: text(row, "Customer Email") || attendeeEmail(row) || "unknown@stripe-import.invalid" };
    const order = orderFromStripeMetadata(metadata, purchaser);
    const totalCents = moneyCents(text(row, "Amount"));
    const processingFeeCents = moneyCents(text(row, "Fee")) + moneyCents(text(row, "Taxes On Fee"));
    const stripeId = id;
    const context: RecordContext = {
      sourceKey: `stripe:csv:${stripeId}`,
      paymentSource: "stripe",
      paymentStatus: "paid",
      dataOrigin: "stripe_backfill",
      purchasedAt: new Date(created).toISOString(),
      stripeChargeId: stripeId.startsWith("ch_") ? stripeId : undefined,
      stripeCheckoutSessionId: text(row, "Checkout Session ID") || undefined,
      stripePaymentIntentId: text(row, "PaymentIntent ID") || (stripeId.startsWith("pi_") || stripeId.startsWith("py_") ? stripeId : undefined),
      stripeCustomerId: text(row, "Customer ID") || undefined,
      stripeCardId: text(row, "Card ID") || undefined,
      cardholderName: text(row, "Card Name") || undefined,
      cardBrand: text(row, "Card Brand") || undefined,
      cardLast4: text(row, "Card Last4") || undefined,
      cardFingerprint: text(row, "Card Fingerprint") || undefined,
      paymentSourceType: text(row, "Payment Source Type") || undefined,
      checkoutLineItemSummary: text(row, "Checkout Line Item Summary") || undefined,
      scholarshipQuantity: int(metadata.necy_scholarship_qty) || int(metadata.scholarship_quantity) || (order.scholarship.enabled ? 1 : 0),
      rawMetadata: {
        ...metadata,
        csv_id: stripeId,
        csv_description: text(row, "Description"),
        csv_payment_intent_id: text(row, "PaymentIntent ID"),
        csv_checkout_session_id: text(row, "Checkout Session ID"),
        csv_payment_source_type: text(row, "Payment Source Type"),
        csv_card_id: text(row, "Card ID"),
        csv_card_name: text(row, "Card Name"),
        csv_card_brand: text(row, "Card Brand"),
        csv_card_last4: text(row, "Card Last4"),
        csv_card_fingerprint: text(row, "Card Fingerprint"),
        csv_checkout_line_item_summary: text(row, "Checkout Line Item Summary"),
      },
      breakfastUnitPriceCents: Math.max(0, Math.min(100000, Math.floor(Number(metadata.necy_breakfast_unit_price_cents) || 0))) || BREAKFAST_PRICE_CENTS,
      subtotalCents: Math.max(0, totalCents - processingFeeCents),
      processingFeeCents,
      totalCents,
      dedupeAttendeesByEmail: false,
    };
    normalized.push({ rowNumber, source: row, metadata, order, context, category: text(row, "necy_reporting_category (metadata)"), breakfastCounts: { friday: int(metadata.necy_breakfast_friday_qty), saturday: int(metadata.necy_breakfast_saturday_qty), sunday: int(metadata.necy_breakfast_sunday_qty) } });
  }
  return { normalized, excludedRows };
}

export async function readAndNormalizeCsv(path: string) {
  const rows = parseCsv(await readFile(path, "utf8"));
  return { sourceRows: rows.length, ...normalizeRows(rows) };
}

export async function importNormalizedPayments(payload: Payload, payments: NormalizedStripePayment[], excludedRows: ImportSummary["excludedRows"], sourceRows: number, dryRun: boolean): Promise<ImportSummary> {
  const summary: ImportSummary = {
    sourceRows, normalizedRows: payments.length, excludedRows, attendeeCandidates: payments.reduce((total, { order }) => total + (order.selfRegistration ? 1 : 0) + (order.scholarship.enabled && order.scholarship.kind === "specific" ? 1 : 0), 0),
    uniqueAttendeeEmails: new Set(payments.flatMap(({ order }) => [order.selfRegistration ? order.attendee.email.toLowerCase() : "", order.scholarship.enabled && order.scholarship.kind === "specific" ? order.scholarship.recipientEmail.toLowerCase() : ""]).filter(Boolean)).size,
    breakfastTickets: { friday: 0, saturday: 0, sunday: 0 }, checkoutOrders: payments.length, warnings: [],
    created: { attendees: 0, breakfastTickets: 0, checkoutOrders: 0, entitlements: 0 }, updated: { attendees: 0, breakfastTickets: 0, checkoutOrders: 0, entitlements: 0 },
  };
  for (const payment of payments) for (const breakfast of BREAKFASTS) summary.breakfastTickets[breakfast.id] += payment.breakfastCounts[breakfast.id];
  for (const payment of payments) {
    if (!payment.order.selfRegistration && !payment.order.scholarship.enabled && payment.order.breakfast && Object.values(payment.order.breakfast).some(Boolean) && !attendeeEmail(payment.source)) summary.warnings.push(`Row ${payment.rowNumber} has breakfast tickets without an attendee identity.`);
    if (dryRun) {
      summary.created.checkoutOrders += 1;
      summary.created.attendees += (payment.order.selfRegistration ? 1 : 0) + (payment.order.scholarship.enabled && payment.order.scholarship.kind === "specific" ? 1 : 0);
      summary.created.breakfastTickets += Object.values(payment.breakfastCounts).reduce((sum, value) => sum + value, 0);
      summary.created.entitlements += (payment.order.selfRegistration ? 1 : 0) + (payment.order.scholarship.enabled ? Math.max(1, payment.context.scholarshipQuantity || 1) : 0);
    } else {
      const result = await recordRegistrationOrder(payload, payment.order, payment.context);
      summary.created.attendees += result.attendees.created;
      summary.updated.attendees += result.attendees.updated;
      summary.created.breakfastTickets += result.breakfastTickets.created;
      summary.updated.breakfastTickets += result.breakfastTickets.updated;
      summary.created.checkoutOrders += result.checkoutOrders.created;
      summary.updated.checkoutOrders += result.checkoutOrders.updated;
      summary.created.entitlements += result.entitlements.created;
      summary.updated.entitlements += result.entitlements.updated;
    }
  }
  return summary;
}
