import { getPayload } from "payload";
import config from "@payload-config";
import { CASH_CODE_RESPONSE, issueCashCode } from "@/lib/cash-code-request";
import { checkRequestIP, claimPublicRequest, normalizeCheckEmail, validCheckEmail } from "@/lib/registration-check";

export const runtime = "nodejs";
const json = (message: string, status = 200) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "3600" } : {}) } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.REGISTRATION_CHECK_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") return json("Please submit this form from this website.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json("Please submit a valid form.", 400);
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error();
    let length = 0; const chunks: Uint8Array[] = [];
    while (true) { const { value, done } = await reader.read(); if (done) break; length += value.byteLength; if (length > 4096) { await reader.cancel(); return json("Please shorten your form.", 413); } chunks.push(value); }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch { return json("Please submit a valid form.", 400); }
  if (body.website) return json(CASH_CODE_RESPONSE);
  const email = normalizeCheckEmail(body.email);
  if (!validCheckEmail(email)) return json("Enter a valid email address.", 400);
  if (typeof body.startedAt !== "number" || !Number.isFinite(body.startedAt) || Date.now() - body.startedAt < 1500) return json("Please wait a moment and submit again.", 400);
  let claim: Awaited<ReturnType<typeof claimPublicRequest>> | undefined;
  try {
    const payload = await getPayload({ config });
    claim = await claimPublicRequest(payload, "cash", email, checkRequestIP(request));
    if (!claim.allowed) return claim.duplicate ? json(CASH_CODE_RESPONSE) : json("Too many requests. Please try again later.", 429);
    await issueCashCode(payload, email, claim.reference!);
    return json(CASH_CODE_RESPONSE);
  } catch {
    await claim?.release?.().catch(() => {});
    console.error("cash_code_request_failed");
    return json("We could not process your request right now. Please try again later.", 503);
  }
}
