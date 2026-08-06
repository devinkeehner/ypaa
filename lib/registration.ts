export const REGISTRATION_PRICE_CENTS = 4000;
export const BREAKFAST_PRICE_CENTS = 2500;

export const BREAKFASTS = [
  { id: "friday", name: "New Year's Day Breakfast - Friday" },
  { id: "saturday", name: "Breakfast - Saturday" },
  { id: "sunday", name: "Breakfast - Sunday" },
] as const;

export const POLICY_KEYS = [
  "readPolicy",
  "understandQuestions",
  "acknowledgeBehavior",
  "understandAdmission",
  "understandReporting",
  "understandInvestigation",
  "signatureAgreement",
] as const;

export type PolicyKey = (typeof POLICY_KEYS)[number];
export type RegistrationOrder = {
  purchaserName: string;
  purchaserEmail: string;
  selfRegistration: boolean;
  attendee: {
    name: string;
    state: string;
    email: string;
    accommodations: string;
    interpretationNeeded: boolean;
    mobilityAccessibility: boolean;
    willingToServe: boolean;
    homegroupCommittee: string;
  };
  policy: Record<PolicyKey, boolean>;
  breakfast: Record<(typeof BREAKFASTS)[number]["id"], number>;
  scholarship: {
    enabled: boolean;
    kind: "specific" | "general";
    amountCents: number;
    recipientName: string;
    recipientEmail: string;
    attribution: string;
  };
};

const clean = (value: unknown, max = 500) => String(value || "").trim().slice(0, max);
const quantity = (value: unknown) => Math.min(20, Math.max(0, Math.floor(Number(value) || 0)));

export function normalizeOrder(value: unknown): RegistrationOrder {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const attendee = input.attendee && typeof input.attendee === "object" ? input.attendee as Record<string, unknown> : {};
  const policy = input.policy && typeof input.policy === "object" ? input.policy as Record<string, unknown> : {};
  const breakfast = input.breakfast && typeof input.breakfast === "object" ? input.breakfast as Record<string, unknown> : {};
  const scholarship = input.scholarship && typeof input.scholarship === "object" ? input.scholarship as Record<string, unknown> : {};
  const kind = scholarship.kind === "specific" ? "specific" : "general";
  const requestedAmount = Math.round(Number(scholarship.amountCents) || REGISTRATION_PRICE_CENTS);

  return {
    purchaserName: clean(input.purchaserName, 120),
    purchaserEmail: clean(input.purchaserEmail, 180).toLowerCase(),
    selfRegistration: input.selfRegistration === true,
    attendee: {
      name: clean(attendee.name, 120),
      state: clean(attendee.state, 80),
      email: clean(attendee.email, 180).toLowerCase(),
      accommodations: clean(attendee.accommodations),
      interpretationNeeded: attendee.interpretationNeeded === true,
      mobilityAccessibility: attendee.mobilityAccessibility === true,
      willingToServe: attendee.willingToServe === true,
      homegroupCommittee: clean(attendee.homegroupCommittee, 180),
    },
    policy: Object.fromEntries(POLICY_KEYS.map((key) => [key, policy[key] === true])) as Record<PolicyKey, boolean>,
    breakfast: {
      friday: quantity(breakfast.friday),
      saturday: quantity(breakfast.saturday),
      sunday: quantity(breakfast.sunday),
    },
    scholarship: {
      enabled: scholarship.enabled === true,
      kind,
      amountCents: kind === "specific" ? REGISTRATION_PRICE_CENTS : Math.min(500000, Math.max(REGISTRATION_PRICE_CENTS, requestedAmount)),
      recipientName: clean(scholarship.recipientName, 120),
      recipientEmail: clean(scholarship.recipientEmail, 180).toLowerCase(),
      attribution: clean(scholarship.attribution, 180),
    },
  };
}

export function validateOrder(order: RegistrationOrder) {
  if (!order.purchaserName || !/^\S+@\S+\.\S+$/.test(order.purchaserEmail)) return "Enter the purchaser's name and email.";
  if (order.selfRegistration) {
    if (!order.attendee.name || !order.attendee.state || !/^\S+@\S+\.\S+$/.test(order.attendee.email) || !order.attendee.homegroupCommittee) {
      return "Complete all required attendee fields.";
    }
    if (!POLICY_KEYS.every((key) => order.policy[key])) return "Every policy acknowledgment is required for self-registration.";
  }
  if (order.scholarship.enabled && order.scholarship.kind === "specific") {
    if (!order.scholarship.recipientName || !/^\S+@\S+\.\S+$/.test(order.scholarship.recipientEmail)) {
      return "Enter the scholarship recipient's name and email.";
    }
  }
  if (orderSubtotalCents(order) <= 0) return "Choose a registration, breakfast ticket, or scholarship.";
  return null;
}

export function breakfastCount(order: RegistrationOrder) {
  return BREAKFASTS.reduce((total, item) => total + order.breakfast[item.id], 0);
}

export function orderSubtotalCents(order: RegistrationOrder) {
  return (order.selfRegistration ? REGISTRATION_PRICE_CENTS : 0)
    + breakfastCount(order) * BREAKFAST_PRICE_CENTS
    + (order.scholarship.enabled ? order.scholarship.amountCents : 0);
}

export function calculateProcessingFee(amountInCents: number) {
  return Math.round((amountInCents + 30) / (1 - 0.029) - amountInCents);
}

function reportingCategory(order: RegistrationOrder) {
  const self = order.selfRegistration;
  const scholarship = order.scholarship.enabled;
  const breakfast = breakfastCount(order) > 0;
  if (self && scholarship && breakfast) return "registration_plus_scholarship_plus_breakfast";
  if (self && scholarship) return "registration_plus_scholarship";
  if (self && breakfast) return "registration_plus_breakfast";
  if (self) return "registration_only";
  if (scholarship && breakfast) return "registration_plus_scholarship_plus_breakfast";
  if (scholarship) return "scholarship_only";
  return "breakfast_only";
}

export function buildMetadata(order: RegistrationOrder, totals: { dataOrigin: "live_checkout" | "cash_checkout"; processingFeeCents: number; totalChargeCents: number }) {
  const breakfasts = BREAKFASTS.filter((item) => order.breakfast[item.id] > 0)
    .map((item) => `${item.name} x${order.breakfast[item.id]}`).join(", ") || "None";
  const policyMetadata: Record<string, string> = order.selfRegistration ? {
    policy_read_and_understood: String(order.policy.readPolicy),
    policy_questions_understood: String(order.policy.understandQuestions),
    policy_behavior_acknowledged: String(order.policy.acknowledgeBehavior),
    policy_admission_understood: String(order.policy.understandAdmission),
    policy_reporting_understood: String(order.policy.understandReporting),
    policy_investigation_understood: String(order.policy.understandInvestigation),
    policy_signature_agreement: String(order.policy.signatureAgreement),
  } : {};

  const metadata: Record<string, string> = {
    purchase_type: reportingCategory(order),
    self_registration_quantity: order.selfRegistration ? "1" : "0",
    scholarship_quantity: order.scholarship.enabled ? "1" : "0",
    attendee_name: order.selfRegistration ? order.attendee.name : "Not applicable",
    attendee_state: order.selfRegistration ? order.attendee.state : "Not applicable",
    attendee_email: order.selfRegistration ? order.attendee.email : order.purchaserEmail,
    breakfast_price_version: "2026-25-dollar",
    breakfast_ticket_price_cents: String(BREAKFAST_PRICE_CENTS),
    breakfast_tickets: breakfasts,
    breakfast_count: String(breakfastCount(order)),
    scholarship_recipient_name: order.scholarship.kind === "specific" ? order.scholarship.recipientName : "General scholarship fund",
    scholarship_recipient_email: order.scholarship.kind === "specific" ? order.scholarship.recipientEmail : "None",
    attribution_aa_entity: order.scholarship.attribution || "None",
    attribution_reserved_for_person: order.scholarship.kind === "specific" ? order.scholarship.recipientName : "None",
    accommodations: order.selfRegistration ? order.attendee.accommodations || "None" : "Not applicable",
    interpretation_needed: order.selfRegistration ? String(order.attendee.interpretationNeeded) : "not_applicable",
    mobility_accessibility: order.selfRegistration ? String(order.attendee.mobilityAccessibility) : "not_applicable",
    willing_to_serve: order.selfRegistration ? String(order.attendee.willingToServe) : "not_applicable",
    homegroup_committee: order.selfRegistration ? order.attendee.homegroupCommittee : "Not applicable",
    ...policyMetadata,
    necy_project_source: "necypaa_ct_site",
    necy_schema_version: "2026-03-slim",
    necy_event_slug: "necypaa_xxxvi",
    necy_data_origin: totals.dataOrigin,
    necy_reporting_category: reportingCategory(order),
    necy_has_registration: String(order.selfRegistration || order.scholarship.enabled),
    necy_has_breakfast: String(breakfastCount(order) > 0),
    necy_has_scholarship: String(order.scholarship.enabled),
    necy_has_merch: "false",
    necy_registration_qty_35: "0",
    necy_registration_qty_40: order.selfRegistration ? "1" : "0",
    necy_scholarship_qty: order.scholarship.enabled ? "1" : "0",
    necy_breakfast_friday_qty: String(order.breakfast.friday),
    necy_breakfast_saturday_qty: String(order.breakfast.saturday),
    necy_breakfast_sunday_qty: String(order.breakfast.sunday),
    necy_breakfast_count: String(breakfastCount(order)),
    necy_breakfast_unit_price_cents: String(BREAKFAST_PRICE_CENTS),
    necy_processing_fee_line_cents: String(totals.processingFeeCents),
    necy_total_charge_cents: String(totals.totalChargeCents),
  };

  if (Object.keys(metadata).length > 50) throw new Error("Stripe metadata exceeds the 50-field limit.");
  return metadata;
}
