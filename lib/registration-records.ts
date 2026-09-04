import type Stripe from "stripe";
import type { Payload } from "payload";

import {
  BREAKFASTS,
  BREAKFAST_PRICE_CENTS,
  orderSubtotalCents,
  POLICY_KEYS,
  REGISTRATION_PRICE_CENTS,
  type RegistrationOrder,
} from "@/lib/registration";
import { getStripe } from "@/lib/stripe-server";

type RecordContext = {
  sourceKey: string;
  paymentSource: "stripe" | "cash";
  paymentStatus: "paid" | "recorded";
  dataOrigin: "live_checkout" | "stripe_webhook" | "stripe_backfill" | "cash_checkout";
  purchasedAt: string;
  stripeCheckoutSessionId?: string;
  stripePaymentIntentId?: string;
  stripeChargeId?: string;
  stripeCustomerId?: string;
  checkoutLineItemSummary?: string;
  cashTransactionId?: string;
  rawMetadata?: Record<string, string>;
  breakfastUnitPriceCents?: number;
  subtotalCents?: number;
  processingFeeCents?: number;
  totalCents?: number;
};

const bool = (value: string | undefined) => value === "true" || value === "1" || value === "yes";
const count = (value: string | undefined) => Math.max(0, Math.min(20, Math.floor(Number(value) || 0)));
const cents = (value: string | undefined) => Math.max(0, Math.min(100000, Math.floor(Number(value) || 0)));
const useful = (value: string | undefined, fallback = "") => value && !["none", "not applicable", "not_applicable"].includes(value.toLowerCase()) ? value : fallback;

async function findBySourceKey(payload: Payload, collection: "attendees" | "breakfast-tickets", sourceKey: string): Promise<{ id: string } | undefined> {
  const result = await payload.find({ collection, overrideAccess: true, limit: 1, where: { sourceKey: { equals: sourceKey } } });
  return result.docs[0] as { id: string } | undefined;
}

async function recordCheckoutOrder(payload: Payload, order: RegistrationOrder, context: RecordContext) {
  const subtotalCents = Math.max(0, Math.floor(context.subtotalCents ?? orderSubtotalCents(order)));
  const processingFeeCents = Math.max(0, Math.floor(context.processingFeeCents ?? 0));
  const totalCents = Math.max(subtotalCents + processingFeeCents, Math.floor(context.totalCents ?? 0));
  const data = {
    sourceKey: context.sourceKey,
    purchaserName: order.purchaserName,
    purchaserEmail: order.purchaserEmail,
    subtotalCents,
    processingFeeCents,
    totalCents,
    paymentSource: context.paymentSource,
    paymentStatus: context.paymentStatus,
    dataOrigin: context.dataOrigin,
    purchasedAt: context.purchasedAt,
    stripeCheckoutSessionId: context.stripeCheckoutSessionId,
    stripePaymentIntentId: context.stripePaymentIntentId,
    stripeChargeId: context.stripeChargeId,
    stripeCustomerId: context.stripeCustomerId,
    checkoutLineItemSummary: context.checkoutLineItemSummary,
    order,
    rawMetadata: context.rawMetadata,
  } as const;
  const result = await payload.find({ collection: "checkout-orders", overrideAccess: true, limit: 1, where: { sourceKey: { equals: context.sourceKey } } });
  if (result.docs[0]) await payload.update({ collection: "checkout-orders", id: result.docs[0].id, overrideAccess: true, data });
  else await payload.create({ collection: "checkout-orders", overrideAccess: true, data });
}

export async function recordRegistrationOrder(payload: Payload, order: RegistrationOrder, context: RecordContext) {
  await recordCheckoutOrder(payload, order, context);
  let attendeeId: string | undefined;
  if (order.selfRegistration) {
    const sourceKey = `${context.sourceKey}:registration:1`;
    const data = {
      sourceKey,
      attendeeName: order.attendee.name,
      attendeeEmail: order.attendee.email,
      state: order.attendee.state,
      homegroupCommittee: order.attendee.homegroupCommittee,
      accommodations: order.attendee.accommodations,
      interpretationNeeded: order.attendee.interpretationNeeded,
      mobilityAccessibility: order.attendee.mobilityAccessibility,
      willingToServe: order.attendee.willingToServe,
      purchaserName: order.purchaserName,
      purchaserEmail: order.purchaserEmail,
      registrationPriceCents: REGISTRATION_PRICE_CENTS,
      attendanceStatus: "expected" as const,
      attendanceBasis: "self_registration" as const,
      paymentSource: context.paymentSource,
      paymentStatus: context.paymentStatus,
      dataOrigin: context.dataOrigin,
      purchasedAt: context.purchasedAt,
      stripeCheckoutSessionId: context.stripeCheckoutSessionId,
      stripePaymentIntentId: context.stripePaymentIntentId,
      stripeChargeId: context.stripeChargeId,
      stripeCustomerId: context.stripeCustomerId,
      cashTransaction: context.cashTransactionId,
      policyAcknowledgments: {
        ...order.policy,
        status: "signed" as const,
        signatureName: order.attendee.name,
        signedAt: context.purchasedAt,
      },
      rawMetadata: context.rawMetadata,
    } as const;
    const existing = await findBySourceKey(payload, "attendees", sourceKey);
    const attendee = existing
      ? await payload.update({ collection: "attendees", id: existing.id, overrideAccess: true, data })
      : await payload.create({ collection: "attendees", overrideAccess: true, data });
    attendeeId = attendee.id;
  }

  if (order.scholarship.enabled && order.scholarship.kind === "specific") {
    const sourceKey = `${context.sourceKey}:scholarship:1`;
    const unsignedPolicy = Object.fromEntries(POLICY_KEYS.map((key) => [key, false])) as RegistrationOrder["policy"];
    const data = {
      sourceKey,
      attendeeName: order.scholarship.recipientName,
      attendeeEmail: order.scholarship.recipientEmail,
      state: order.scholarship.recipientState || "Unknown",
      homegroupCommittee: order.scholarship.recipientHomegroupCommittee,
      accommodations: order.scholarship.recipientAccommodations,
      interpretationNeeded: order.scholarship.recipientInterpretationNeeded,
      mobilityAccessibility: order.scholarship.recipientMobilityAccessibility,
      willingToServe: order.scholarship.recipientWillingToServe,
      purchaserName: order.purchaserName,
      purchaserEmail: order.purchaserEmail,
      registrationPriceCents: REGISTRATION_PRICE_CENTS,
      attendanceStatus: "expected" as const,
      attendanceBasis: "scholarship_recipient" as const,
      paymentSource: context.paymentSource,
      paymentStatus: context.paymentStatus,
      dataOrigin: context.dataOrigin,
      purchasedAt: context.purchasedAt,
      stripeCheckoutSessionId: context.stripeCheckoutSessionId,
      stripePaymentIntentId: context.stripePaymentIntentId,
      stripeChargeId: context.stripeChargeId,
      stripeCustomerId: context.stripeCustomerId,
      cashTransaction: context.cashTransactionId,
      policyAcknowledgments: { ...unsignedPolicy, status: "pending" as const },
      rawMetadata: context.rawMetadata,
    } as const;
    const existing = await findBySourceKey(payload, "attendees", sourceKey);
    const attendee = existing
      ? await payload.update({ collection: "attendees", id: existing.id, overrideAccess: true, data })
      : await payload.create({ collection: "attendees", overrideAccess: true, data });
    attendeeId ??= attendee.id;
  }

  for (const breakfast of BREAKFASTS) {
    for (let index = 0; index < order.breakfast[breakfast.id]; index += 1) {
      const sourceKey = `${context.sourceKey}:breakfast:${breakfast.id}:${index + 1}`;
      const data = {
        sourceKey,
        ticketCode: `BF-${breakfast.id}-${context.sourceKey}-${index + 1}`.toUpperCase(),
        breakfastDay: breakfast.id,
        status: "valid" as const,
        unitPriceCents: context.breakfastUnitPriceCents || BREAKFAST_PRICE_CENTS,
        purchaserName: order.purchaserName,
        purchaserEmail: order.purchaserEmail,
        attendee: attendeeId,
        paymentSource: context.paymentSource,
        paymentStatus: context.paymentStatus,
        dataOrigin: context.dataOrigin,
        purchasedAt: context.purchasedAt,
        stripeCheckoutSessionId: context.stripeCheckoutSessionId,
        stripePaymentIntentId: context.stripePaymentIntentId,
        stripeChargeId: context.stripeChargeId,
        stripeCustomerId: context.stripeCustomerId,
        cashTransaction: context.cashTransactionId,
        rawMetadata: context.rawMetadata,
      } as const;
      const existing = await findBySourceKey(payload, "breakfast-tickets", sourceKey);
      if (existing) await payload.update({ collection: "breakfast-tickets", id: existing.id, overrideAccess: true, data });
      else await payload.create({ collection: "breakfast-tickets", overrideAccess: true, data });
    }
  }
}

function breakfastCountFromLegacyText(metadata: Record<string, string>, day: "friday" | "saturday" | "sunday") {
  const text = metadata.breakfast_tickets || "";
  const match = text.match(new RegExp(`${day}[^,]*?x(\\d+)`, "i"));
  if (match) return count(match[1]);
  return text.split(",").filter((ticket) => ticket.toLowerCase().includes(day)).length;
}

export function orderFromStripeMetadata(metadata: Record<string, string>, purchaser: { name: string; email: string }): RegistrationOrder {
  const explicitRegistration = count(metadata.necy_registration_qty_40) > 0
    || count(metadata.self_registration_quantity) > 0
    || metadata.registration_type === "self"
    || metadata.purchase_type === "self"
    || metadata.purchase_type === "self_plus_scholarship";
  const attendeeName = useful(metadata.attendee_name);
  const selfRegistration = explicitRegistration || (Boolean(attendeeName) && !bool(metadata.necy_has_scholarship));

  return {
    purchaserName: purchaser.name || attendeeName || "Stripe customer",
    purchaserEmail: purchaser.email || useful(metadata.attendee_email, "unknown@stripe-import.invalid"),
    selfRegistration,
    attendee: {
      name: attendeeName || purchaser.name || "Stripe attendee",
      email: useful(metadata.attendee_email, purchaser.email || "unknown@stripe-import.invalid"),
      state: useful(metadata.attendee_state, "Unknown"),
      accommodations: useful(metadata.accommodations),
      interpretationNeeded: bool(metadata.interpretation_needed),
      mobilityAccessibility: bool(metadata.mobility_accessibility) || bool(metadata.handicap_accessibility),
      willingToServe: bool(metadata.willing_to_serve),
      homegroupCommittee: useful(metadata.homegroup_committee),
    },
    policy: Object.fromEntries(POLICY_KEYS.map((key) => {
      const metadataKey = {
        readPolicy: "policy_read_and_understood",
        understandQuestions: "policy_questions_understood",
        acknowledgeBehavior: "policy_behavior_acknowledged",
        understandAdmission: "policy_admission_understood",
        understandReporting: "policy_reporting_understood",
        understandInvestigation: "policy_investigation_understood",
        signatureAgreement: "policy_signature_agreement",
      }[key];
      return [key, bool(metadata[metadataKey])];
    })) as RegistrationOrder["policy"],
    breakfast: {
      friday: count(metadata.necy_breakfast_friday_qty) || breakfastCountFromLegacyText(metadata, "friday"),
      saturday: count(metadata.necy_breakfast_saturday_qty) || breakfastCountFromLegacyText(metadata, "saturday"),
      sunday: count(metadata.necy_breakfast_sunday_qty) || breakfastCountFromLegacyText(metadata, "sunday"),
    },
    scholarship: {
      enabled: bool(metadata.necy_has_scholarship) || count(metadata.scholarship_quantity) > 0,
      kind: useful(metadata.scholarship_recipient_email) ? "specific" : "general",
      amountCents: REGISTRATION_PRICE_CENTS,
      recipientName: useful(metadata.scholarship_recipient_name),
      recipientEmail: useful(metadata.scholarship_recipient_email),
      recipientState: useful(metadata.scholarship_recipient_state, "Unknown"),
      recipientHomegroupCommittee: useful(metadata.scholarship_recipient_homegroup),
      recipientAccommodations: useful(metadata.scholarship_recipient_accommodations),
      recipientInterpretationNeeded: bool(metadata.scholarship_recipient_interpretation),
      recipientMobilityAccessibility: bool(metadata.scholarship_recipient_mobility),
      recipientWillingToServe: bool(metadata.scholarship_recipient_willing_to_serve),
      attribution: useful(metadata.attribution_aa_entity),
    },
  };
}

export async function recordStripeSession(payload: Payload, session: Stripe.Checkout.Session, dataOrigin: "stripe_webhook" | "stripe_backfill") {
  if (session.payment_status !== "paid") return { recorded: false as const, reason: "not_paid" };
  const stripe = getStripe();
  const paymentIntent = typeof session.payment_intent === "string"
    ? await stripe.paymentIntents.retrieve(session.payment_intent, { expand: ["latest_charge"] })
    : session.payment_intent;
  const paymentIntentMetadata = paymentIntent ? paymentIntent.metadata : {};
  const metadata = { ...paymentIntentMetadata, ...(session.metadata || {}) };
  const purchaser = {
    name: session.customer_details?.name
      || useful(metadata.attendee_name)
      || [metadata.attendee_first_name, metadata.attendee_last_name].filter(Boolean).join(" ")
      || "Stripe customer",
    email: session.customer_details?.email || session.customer_email || useful(metadata.attendee_email, "unknown@stripe-import.invalid"),
  };
  const order = orderFromStripeMetadata(metadata, purchaser);
  const charge = paymentIntent ? paymentIntent.latest_charge : undefined;
  const chargeId = typeof charge === "string" ? charge : charge?.id;
  const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;

  await recordRegistrationOrder(payload, order, {
    sourceKey: `stripe:${session.id}`,
    paymentSource: "stripe",
    paymentStatus: "paid",
    dataOrigin,
    purchasedAt: new Date(session.created * 1000).toISOString(),
    stripeCheckoutSessionId: session.id,
    stripePaymentIntentId: paymentIntent?.id,
    stripeChargeId: chargeId,
    stripeCustomerId: customerId,
    rawMetadata: metadata,
    breakfastUnitPriceCents: cents(metadata.necy_breakfast_unit_price_cents)
      || cents(metadata.breakfast_ticket_price_cents)
      || (metadata.necy_schema_version ? BREAKFAST_PRICE_CENTS : 2000),
  });
  return { recorded: true as const };
}
