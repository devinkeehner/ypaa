import { getPayload } from "payload";
import config from "@payload-config";
import { CHECK_RESPONSE, HELP_RESPONSE, checkRequestIP, claimPublicRequest, normalizeCheckEmail, processRegistrationCheck, processRegistrationHelp, validCheckEmail } from "@/lib/registration-check";

export const runtime = "nodejs";
const json = (message: string, status = 200) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "3600" } : {}) } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expectedOrigin = process.env.REGISTRATION_CHECK_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") return json("Please submit this form from this website.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json("Please submit a valid form.", 400);
  let body: Record<string, unknown>;
  try {
    // Bound the stream even if Content-Length is absent or forged.
    const reader = request.body?.getReader();
    if (!reader) return json("Please submit a valid form.", 400);
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 4096) { await reader.cancel(); return json("Please shorten your form.", 413); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch { return json("Please submit a valid form.", 400); }
  const mode = body.mode;
  if (mode !== "check" && mode !== "help") return json("Please submit a valid form.", 400);
  const message = mode === "check" ? CHECK_RESPONSE : HELP_RESPONSE;
  if (body.website) return json(message); // Honeypot: no lookup, storage or email.
  const email = normalizeCheckEmail(body.email);
  if (!validCheckEmail(email)) return json("Enter a valid email address.", 400);
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const details = typeof body.details === "string" ? body.details.trim() : "";
  if (mode === "help" && (!name || name.length > 100 || !details || details.length > 1000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(name + details))) return json("Enter your name and a short explanation (up to 1,000 characters).", 400);
  // A lightweight bot trap; the persistent limits are the actual abuse boundary.
  if (typeof body.startedAt !== "number" || !Number.isFinite(body.startedAt) || Date.now() - body.startedAt < 1500) return json("Please wait a moment and submit again.", 400);
  let claim: Awaited<ReturnType<typeof claimPublicRequest>> | undefined;
  try {
    const payload = await getPayload({ config });
    claim = await claimPublicRequest(payload, mode, email, checkRequestIP(request));
    if (!claim.allowed) return claim.duplicate ? json(message) : json("Too many requests. Please try again later.", 429);
    if (mode === "check") await processRegistrationCheck(payload, email, claim.reference!);
    else await processRegistrationHelp(payload, { name, email, details }, claim.reference!);
    return json(message);
  } catch (error) {
    await claim?.release?.().catch(() => {});
    // Never log attendee email, form details, or provider response bodies.
    const code = error instanceof Error && /^registration_(check|help)_/.test(error.message) ? error.message : "registration_request_failed";
    console.error(code);
    return json(mode === "help" ? "Registration help is temporarily unavailable. Please try again later." : "We could not send registration information right now. Please try again later.", 503);
  }
}
