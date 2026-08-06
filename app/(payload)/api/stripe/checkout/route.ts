import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { BREAKFASTS, BREAKFAST_PRICE_CENTS, REGISTRATION_PRICE_CENTS, buildMetadata, calculateProcessingFee, normalizeOrder, orderSubtotalCents, validateOrder } from "@/lib/registration";
import { getStripe } from "@/lib/stripe-server";

export async function POST(request: Request) {
  try {
    const order = normalizeOrder(await request.json());
    const validation = validateOrder(order);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });
    const subtotal = orderSubtotalCents(order);
    const processingFee = calculateProcessingFee(subtotal);
    const total = subtotal + processingFee;
    const metadata = buildMetadata(order, { dataOrigin: "live_checkout", processingFeeCents: processingFee, totalChargeCents: total });
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    if (order.selfRegistration) lineItems.push({ price_data: { currency: "usd", unit_amount: REGISTRATION_PRICE_CENTS, product_data: { name: "NECYPAA XXXVI Registration", description: "Full convention registration" } }, quantity: 1 });
    for (const breakfast of BREAKFASTS) {
      const count = order.breakfast[breakfast.id];
      if (count) lineItems.push({ price_data: { currency: "usd", unit_amount: BREAKFAST_PRICE_CENTS, product_data: { name: breakfast.name } }, quantity: count });
    }
    if (order.scholarship.enabled) lineItems.push({ price_data: { currency: "usd", unit_amount: order.scholarship.amountCents, product_data: { name: order.scholarship.kind === "specific" ? "Registration scholarship for a specific attendee" : "General registration scholarship fund" } }, quantity: 1 });
    lineItems.push({ price_data: { currency: "usd", unit_amount: processingFee, product_data: { name: "Processing fee", description: "Card processing fee (2.9% + $0.30)" } }, quantity: 1 });
    const origin = new URL(request.url).origin;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: order.purchaserEmail,
      line_items: lineItems,
      metadata,
      payment_intent_data: { metadata },
      success_url: `${origin}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/register?cancelled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout could not be created.";
    return NextResponse.json({ error: message }, { status: message.includes("configured") ? 503 : 500 });
  }
}
