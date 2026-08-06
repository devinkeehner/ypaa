import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { recordStripeSession } from "@/lib/registration-records";
import { getStripe } from "@/lib/stripe-server";

export async function POST(request: Request) {
  const configuredSecret = process.env.STRIPE_BACKFILL_SECRET;
  const suppliedSecret = request.headers.get("x-backfill-secret");
  if (!configuredSecret || suppliedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Backfill access denied." }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({})) as { startingAfter?: unknown; limit?: unknown; createdGte?: unknown };
    const limit = Math.max(1, Math.min(100, Math.floor(Number(body.limit) || 50)));
    const startingAfter = String(body.startingAfter || "").trim() || undefined;
    const createdGte = Math.floor(Number(body.createdGte) || 0) || undefined;
    const stripe = getStripe();
    const sessions = await stripe.checkout.sessions.list({
      limit,
      status: "complete",
      ...(startingAfter ? { starting_after: startingAfter } : {}),
      ...(createdGte ? { created: { gte: createdGte } } : {}),
      expand: ["data.payment_intent.latest_charge"],
    });
    const payload = await getPayload({ config });
    const errors: Array<{ sessionId: string; message: string }> = [];
    let recorded = 0;
    let skipped = 0;

    for (const session of sessions.data) {
      try {
        const result = await recordStripeSession(payload, session, "stripe_backfill");
        if (result.recorded) recorded += 1;
        else skipped += 1;
      } catch (error) {
        errors.push({ sessionId: session.id, message: error instanceof Error ? error.message : "Unknown import error" });
      }
    }

    return NextResponse.json({
      scanned: sessions.data.length,
      recorded,
      skipped,
      errors,
      hasMore: sessions.has_more,
      nextStartingAfter: sessions.has_more ? sessions.data.at(-1)?.id || null : null,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Stripe backfill failed." }, { status: 500 });
  }
}
