import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import config from "@payload-config";
import { sendCashScholarshipRequestedNotification } from "@/lib/scholarship-email";

function authorized(request: Request) {
  const expected = process.env.REGISTRATION_SITE_API_KEY || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(expected) && expected.length === supplied.length && timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as { scholarshipAmountCents?: unknown };
    const scholarshipAmountCents = Math.floor(Number(body.scholarshipAmountCents));
    if (!Number.isSafeInteger(scholarshipAmountCents) || scholarshipAmountCents < 1 || scholarshipAmountCents > 500000) {
      return NextResponse.json({ error: "A valid scholarship amount is required." }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const status = await sendCashScholarshipRequestedNotification(payload, { scholarshipAmountCents });
    return NextResponse.json({ success: true, status });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Cash scholarship notification could not be sent." },
      { status: 500 },
    );
  }
}
