import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { BREAKFASTS, BREAKFAST_PRICE_CENTS, REGISTRATION_PRICE_CENTS, normalizeOrder } from "@/lib/registration";
import { recordRegistrationOrder } from "@/lib/registration-records";
import { sendPurchaserConfirmation } from "@/lib/scholarship-email";

type Body = {
  order?: unknown;
  context?: Record<string, unknown>;
};

function authorized(request: Request) {
  const expected = process.env.REGISTRATION_SITE_API_KEY || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(expected) && expected.length === supplied.length && timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

function text(value: unknown, max = 240) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function metadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, item]) => key.length <= 40 && typeof item === "string")
      .map(([key, item]) => [key, String(item).slice(0, 500)]),
  );
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Body;
    const context = body.context || {};
    const sourceKey = text(context.sourceKey, 200);
    const paymentSource = context.paymentSource === "cash" ? "cash" : context.paymentSource === "stripe" ? "stripe" : null;
    const paymentStatus = context.paymentStatus === "recorded" ? "recorded" : context.paymentStatus === "paid" ? "paid" : null;
    const dataOrigin = context.dataOrigin === "cash_checkout" ? "cash_checkout" : context.dataOrigin === "stripe_webhook" ? "stripe_webhook" : null;
    const purchasedAt = text(context.purchasedAt, 80);
    if (!sourceKey || !paymentSource || !paymentStatus || !dataOrigin || !purchasedAt) {
      return NextResponse.json({ error: "A paid order context is required." }, { status: 400 });
    }

    const order = normalizeOrder(body.order);
    const payload = await getPayload({ config });
    await recordRegistrationOrder(payload, order, {
      sourceKey,
      paymentSource,
      paymentStatus,
      dataOrigin,
      purchasedAt,
      stripeCheckoutSessionId: text(context.stripeCheckoutSessionId),
      stripePaymentIntentId: text(context.stripePaymentIntentId),
      stripeChargeId: text(context.stripeChargeId),
      stripeCustomerId: text(context.stripeCustomerId),
      rawMetadata: metadata(context.rawMetadata),
      breakfastUnitPriceCents: Math.max(0, Math.min(100000, Math.floor(Number(context.breakfastUnitPriceCents) || 0))),
      subtotalCents: Math.max(0, Math.min(10000000, Math.floor(Number(context.subtotalCents) || 0))),
      processingFeeCents: Math.max(0, Math.min(10000000, Math.floor(Number(context.processingFeeCents) || 0))),
      totalCents: Math.max(0, Math.min(10000000, Math.floor(Number(context.totalCents) || 0))),
    });
    try {
      const items: string[] = [];
      if (order.selfRegistration) items.push(`NECYPAA XXXVI Registration — ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(REGISTRATION_PRICE_CENTS / 100)}`);
      for (const breakfast of BREAKFASTS) {
        const quantity = order.breakfast[breakfast.id];
        if (quantity) items.push(`${breakfast.name} × ${quantity} — ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((quantity * BREAKFAST_PRICE_CENTS) / 100)}`);
      }
      if (order.scholarship.enabled) items.push(`${order.scholarship.kind === "specific" ? `Registration scholarship for ${order.scholarship.recipientName}` : "General registration scholarship fund"} — ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.scholarship.amountCents / 100)}`);
      const processingFeeCents = Math.max(0, Math.min(10000000, Math.floor(Number(context.processingFeeCents) || 0)));
      if (processingFeeCents) items.push(`Card processing fee — ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(processingFeeCents / 100)}`);
      const rawMerchandise = body.order && typeof body.order === "object" && !Array.isArray(body.order)
        ? (body.order as { merchandise?: unknown }).merchandise
        : null;
      if (Array.isArray(rawMerchandise)) {
        for (const rawItem of rawMerchandise.slice(0, 30)) {
          const item = rawItem && typeof rawItem === "object" ? rawItem as { slug?: unknown; quantity?: unknown } : {};
          const name = typeof item.slug === "string" ? item.slug.replace(/[-_]+/g, " ").trim() : "Merchandise";
          const quantity = Math.max(1, Math.min(20, Math.floor(Number(item.quantity) || 1)));
          items.push(`${name} × ${quantity}`);
        }
      }
      await sendPurchaserConfirmation({
        recipientEmail: order.purchaserEmail,
        purchaserName: order.purchaserName,
        paymentMethod: paymentSource === "cash" ? "cash" : "card",
        reference: sourceKey,
        totalCents: Math.max(0, Math.min(10000000, Math.floor(Number(context.totalCents) || 0))),
        items,
      });
    } catch {
      // Recording the paid order must succeed even if email delivery is unavailable.
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration reporting could not be completed." },
      { status: 500 },
    );
  }
}
