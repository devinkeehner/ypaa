import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { normalizeOrder } from "@/lib/registration";
import { recordRegistrationOrder } from "@/lib/registration-records";

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

    const payload = await getPayload({ config });
    await recordRegistrationOrder(payload, normalizeOrder(body.order), {
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
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Registration reporting could not be completed." },
      { status: 500 },
    );
  }
}
