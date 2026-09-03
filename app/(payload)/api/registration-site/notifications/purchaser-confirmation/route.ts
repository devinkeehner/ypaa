import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { sendPurchaserConfirmation } from "@/lib/scholarship-email";

function authorized(request: Request) {
  const expected = process.env.REGISTRATION_SITE_API_KEY || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(expected) && expected.length === supplied.length && timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const recipientEmail = text(body.recipientEmail, 180).toLowerCase();
    const purchaserName = text(body.purchaserName, 120);
    const reference = text(body.reference, 200);
    const paymentMethod = body.paymentMethod === "cash" ? "cash" : body.paymentMethod === "card" ? "card" : null;
    const totalCents = Math.floor(Number(body.totalCents));
    const items = Array.isArray(body.items) ? body.items.map((item) => text(item, 240)).filter(Boolean).slice(0, 30) : [];
    if (!/^\S+@\S+\.\S+$/.test(recipientEmail) || !purchaserName || !reference || !paymentMethod || !Number.isSafeInteger(totalCents) || totalCents < 0 || totalCents > 10000000) {
      return NextResponse.json({ error: "A complete purchaser confirmation is required." }, { status: 400 });
    }
    const status = await sendPurchaserConfirmation({ recipientEmail, purchaserName, reference, paymentMethod, totalCents, items });
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Purchaser confirmation could not be sent." }, { status: 500 });
  }
}
