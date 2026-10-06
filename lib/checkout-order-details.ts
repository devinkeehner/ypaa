/** Purchase display only: never normalize prices, allocate seats, or change source records. */
type ObjectValue = Record<string, unknown>;
export type PurchaseCategory = "registration" | "scholarship" | "merchandise" | "breakfast";
export type PurchaseItem = {
  name: string | null; slug: string | null; variantId: string | null;
  size: string | null; color: string | null; sku: string | null;
  quantity: number | null; unitPriceCents: number | null;
};
export type PurchaseDetails = {
  version: 1;
  categories: PurchaseCategory[];
  summary: string;
  paymentMethod: string;
  registrationQuantity: number | null;
  scholarship: { kind: "specific" | "general" | "unknown"; quantity: number | null; amountCents: number | null; recipientName: string | null; recipientEmail: string | null; attribution: string | null } | null;
  breakfast: { days: Array<{ day: string; quantity: number }>; totalQuantity: number | null; unassignedQuantity: number | null };
  merchandise: { items: PurchaseItem[]; quantity: number | null; fulfillment: "shipping" | "receive_now" | "event_pickup" | "unknown"; shippingStatus: string | null; records: Array<{ id: string; status: string | null }>; reportedLineItems: string | null };
  notes: string[];
};

export const objectValue = (value: unknown): ObjectValue => value !== null && typeof value === "object" && !Array.isArray(value) ? value as ObjectValue : {};
const text = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const result = value.trim().slice(0, 4000);
  return result && !/^(none|not applicable|not_applicable|null)$/i.test(result) ? result : null;
};
const integer = (value: unknown): number | null => {
  if (typeof value !== "number" && (typeof value !== "string" || !/^\d+$/.test(value.trim()))) return null;
  const result = Number(value);
  return Number.isSafeInteger(result) && result >= 0 ? result : null;
};
const positive = (value: unknown) => (integer(value) ?? 0) > 0;
const enabled = (value: unknown) => value === true || value === "true" || value === "1" || value === "yes";
const total = (values: Array<number | null>): number | null => values.length && values.every((value) => value !== null) ? values.reduce<number>((sum, value) => sum + value!, 0) : null;
const quantity = (value: unknown) => integer(value);
const fulfillment = (value: unknown): PurchaseDetails["merchandise"]["fulfillment"] => value === "shipping" || value === "receive_now" || value === "event_pickup" ? value : "unknown";

export const fulfillmentLabel = (value: PurchaseDetails["merchandise"]["fulfillment"]) => ({
  shipping: "Mail / shipping", receive_now: "Receive now / in-person pickup", event_pickup: "Hold for convention pickup", unknown: "Unknown",
})[value];

function items(value: unknown): PurchaseItem[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).flatMap((raw) => {
    const item = objectValue(raw);
    if (!text(item.name) && !text(item.slug) && !text(item.variantId) && !text(item.sku)) return [];
    return [{ name: text(item.name), slug: text(item.slug), variantId: text(item.variantId), size: text(item.size), color: text(item.color), sku: text(item.sku), quantity: quantity(item.quantity), unitPriceCents: integer(item.unitPriceCents) }];
  });
}

function legacyBreakfast(value: unknown, day: string): number | null {
  const label = text(value);
  if (!label) return null;
  const segments = label.split(/[,;\n]/).filter((segment) => new RegExp(`\\b${day}\\b`, "i").test(segment));
  if (!segments.length) return null;
  const counts = segments.map((segment) => {
    const explicit = segment.match(/(?:x|×)\s*(\d+)\s*$/i);
    if (explicit) return quantity(explicit[1]);
    // Older exports list one named ticket without a multiplier. Reject broken multipliers.
    return /(?:x|×)\s*[^\s]*\s*$/i.test(segment) ? null : 1;
  });
  return total(counts);
}

export function derivePurchaseDetails(document: unknown, merchandiseRecords: unknown[] = [], originalPurchaseInput = false): PurchaseDetails {
  const doc = objectValue(document), order = objectValue(doc.order), metadata = objectValue(doc.rawMetadata);
  const breakfast = objectValue(order.breakfast), scholarship = objectValue(order.scholarship);
  const snapshot = objectValue(doc.purchaseSnapshot);
  const snapshotScholarship = snapshot.version === 1 ? objectValue(snapshot.scholarship) : {};
  const snapshotMerchandise = snapshot.version === 1 ? objectValue(snapshot.merchandise) : {};
  const notes: string[] = [];
  const categories: PurchaseCategory[] = [];
  const rawRegistration = quantity(metadata.self_registration_quantity);
  const registrationBands = Object.entries(metadata).filter(([key]) => /^necy_registration_qty_\d+$/.test(key));
  const bandQuantity = total(registrationBands.map(([, value]) => quantity(value)));
  let registrationQuantity = rawRegistration ?? bandQuantity;
  if (registrationQuantity === null && order.selfRegistration === true) registrationQuantity = 1;
  const category = text(metadata.necy_reporting_category) || text(metadata.purchase_type) || "";
  const categoryParts = category.replace(/_only$/, "").split("_plus_");
  const hasRegistration = positive(registrationQuantity) || (registrationQuantity === null && (categoryParts.includes("registration") || categoryParts.includes("self")));
  if (hasRegistration) categories.push("registration");
  if (rawRegistration !== null && bandQuantity !== null && rawRegistration !== bandQuantity) notes.push("Registration quantities disagree in source metadata; the explicit self-registration quantity is shown.");
  if (!hasRegistration && registrationQuantity === null) registrationQuantity = null;

  const scholarshipQuantity = quantity(metadata.necy_scholarship_qty) ?? quantity(metadata.scholarship_quantity);
  const hasScholarship = positive(scholarshipQuantity) || enabled(metadata.necy_has_scholarship) || scholarship.enabled === true || categoryParts.includes("scholarship");
  let scholarshipDetails: PurchaseDetails["scholarship"] = null;
  if (hasScholarship) {
    categories.push("scholarship");
    const recipientName = text(metadata.scholarship_recipient_name) || text(snapshotScholarship.recipientName) || text(scholarship.recipientName);
    const recipientEmail = text(metadata.scholarship_recipient_email) || text(snapshotScholarship.recipientEmail) || text(scholarship.recipientEmail);
    const generalName = Boolean(recipientName && /^general (?:registration )?scholarship(?: fund)?$/i.test(recipientName));
    const reliableStoredKind = snapshotScholarship.kind === "specific" || snapshotScholarship.kind === "general" ? snapshotScholarship.kind : originalPurchaseInput && (scholarship.kind === "specific" || scholarship.kind === "general") ? scholarship.kind : "unknown";
    const kind = recipientEmail || (recipientName && !generalName) ? "specific" : generalName ? "general" : reliableStoredKind;
    // Backfill/webhook normalization historically defaults this amount to $40. Do not present that as an actual donation.
    const amountCents = integer(snapshotScholarship.amountCents) ?? (originalPurchaseInput ? integer(scholarship.amountCents) : null);
    // Explicit current values retain precedence; sparse later reports fall back to
    // the immutable original-input snapshot instead of erasing known attribution.
    scholarshipDetails = { kind, quantity: scholarshipQuantity, amountCents, recipientName: generalName ? null : recipientName, recipientEmail, attribution: text(metadata.attribution_aa_entity) || text(scholarship.attribution) || text(snapshotScholarship.attribution) };
    if (amountCents === null) notes.push("Scholarship amount is not independently recorded here; the normalized historical default is not used.");
  }

  const days: PurchaseDetails["breakfast"]["days"] = [];
  for (const day of ["friday", "saturday", "sunday"]) {
    const explicit = quantity(metadata[`necy_breakfast_${day}_qty`]);
    const legacy = legacyBreakfast(metadata.breakfast_tickets, day);
    const stored = quantity(breakfast[day]);
    const count = explicit ?? legacy ?? stored;
    if (count !== null && count > 0) days.push({ day, quantity: count });
    if (explicit !== null && legacy !== null && explicit !== legacy) notes.push(`${day[0].toUpperCase()}${day.slice(1)} breakfast quantities disagree; the explicit day quantity is shown.`);
  }
  const knownBreakfast = days.reduce((sum, day) => sum + day.quantity, 0);
  const reportedBreakfast = quantity(metadata.necy_breakfast_count) ?? quantity(metadata.breakfast_count);
  const hasBreakfast = knownBreakfast > 0 || positive(reportedBreakfast) || enabled(metadata.necy_has_breakfast) || categoryParts.includes("breakfast");
  const breakfastQuantity = reportedBreakfast ?? (knownBreakfast > 0 ? knownBreakfast : hasBreakfast ? null : 0);
  const unassignedQuantity = breakfastQuantity === null ? null : Math.max(0, breakfastQuantity - knownBreakfast);
  if (hasBreakfast) categories.push("breakfast");
  if (reportedBreakfast !== null && reportedBreakfast < knownBreakfast) notes.push("Breakfast total disagrees with the day counts; both source values are displayed.");
  if (hasBreakfast && (!days.length || unassignedQuantity)) notes.push("Some breakfast tickets have no recorded day. No day is inferred.");

  const related = merchandiseRecords.map(objectValue);
  const linked = related.length === 1 ? related[0] : {};
  if (related.length > 1) notes.push("Multiple merchandise orders match this payment. Item and fulfillment details require review; no records were combined.");
  const purchaseItems = related.length > 1 ? [] : items(linked.items).length ? items(linked.items) : items(snapshotMerchandise.items).length ? items(snapshotMerchandise.items) : items(order.merchandise);
  const merchandiseQuantity = quantity(metadata.necy_merch_count) ?? total(purchaseItems.map((item) => item.quantity));
  const itemQuantity = total(purchaseItems.map((item) => item.quantity));
  if (merchandiseQuantity !== null && itemQuantity !== null && merchandiseQuantity !== itemQuantity) notes.push("Merchandise total disagrees with the item quantities; both source values are displayed.");
  const reportedLineItems = text(doc.checkoutLineItemSummary);
  const hasMerch = related.length > 0 || purchaseItems.length > 0 || positive(merchandiseQuantity) || enabled(metadata.necy_has_merch) || categoryParts.includes("merch") || categoryParts.includes("merchandise");
  if (hasMerch) categories.push("merchandise");
  const metadataFulfillment = fulfillment(metadata.necy_merch_fulfillment);
  const linkedFulfillment = fulfillment(linked.fulfillmentMethod);
  // The registration Site's historical metadata parser defaults missing delivery to receive_now. Avoid that default.
  const storedFulfillment = fulfillment(snapshotMerchandise.fulfillment) !== "unknown" ? fulfillment(snapshotMerchandise.fulfillment) : originalPurchaseInput ? fulfillment(order.fulfillmentMethod) : "unknown";
  const delivery = related.length > 1 ? "unknown" : linkedFulfillment !== "unknown" ? linkedFulfillment : metadataFulfillment !== "unknown" ? metadataFulfillment : storedFulfillment;
  if (linkedFulfillment !== "unknown" && metadataFulfillment !== "unknown" && linkedFulfillment !== metadataFulfillment) notes.push("Merchandise fulfillment disagrees with checkout metadata; the linked merchandise order is shown.");
  if (hasMerch && !purchaseItems.length) notes.push("Structured merchandise items / variants are unavailable. Any reported line-item text is shown as recorded.");
  if (hasMerch && delivery === "unknown") notes.push("Merchandise delivery method is unknown.");
  if (hasMerch && delivery === "receive_now") notes.push("Receive now is a delivery choice, not confirmation that physical pickup occurred.");
  const paymentMethod = doc.paymentSource === "cash" ? "Cash" : doc.paymentSource === "stripe" ? text(doc.paymentSourceType) ? `Stripe · ${text(doc.paymentSourceType)}` : "Stripe · method unknown" : "Unknown";
  const labels = { registration: "Registration", scholarship: "Scholarship", breakfast: "Breakfast", merchandise: "Merchandise" };
  const summary = categories.length ? categories.map((value) => labels[value]).join(" + ") : "Purchase details unknown";
  return {
    version: 1, categories, summary, paymentMethod, registrationQuantity,
    scholarship: scholarshipDetails,
    breakfast: { days, totalQuantity: breakfastQuantity, unassignedQuantity },
    merchandise: { items: purchaseItems, quantity: merchandiseQuantity, fulfillment: delivery, shippingStatus: text(linked.shippingStatus), records: related.flatMap((record) => text(record.id) ? [{ id: text(record.id)!, status: text(record.status) }] : []), reportedLineItems },
    notes,
  };
}
