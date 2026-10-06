import { getPayload } from "payload";
import config from "@payload-config";
import { checkRequestIP } from "@/lib/registration-check";
import { claimHotelRequest, saveHotelRequest } from "@/lib/hotel-requests";
import { HOTEL_REQUEST_RESPONSE, validateHotelRequest } from "@/lib/hotel-request-validation";

export const runtime = "nodejs";
const json = (message: string, status = 200) => Response.json({ message }, { status, headers: { "Cache-Control": "no-store", ...(status === 429 ? { "Retry-After": "3600" } : {}) } });
export async function GET() { return Response.json({ acceptingRequests: true }, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  const origin = request.headers.get("origin"), expectedOrigin = process.env.HOTEL_REQUEST_ORIGIN || new URL(request.url).origin;
  if (!origin || origin !== expectedOrigin || request.headers.get("sec-fetch-site") === "cross-site") return json("Please submit this form from this website.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) return json("Please submit a valid form.", 400);
  let body: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json("Please submit a valid form.", 400);
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 8192) { await reader.cancel(); return json("Please shorten your form.", 413); }
      chunks.push(value);
    }
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch { return json("Please submit a valid form.", 400); }
  if (body.website) return json(HOTEL_REQUEST_RESPONSE);
  let input;
  try { input = validateHotelRequest(body); }
  catch (error) { return json(error instanceof Error ? error.message : "Please check your form.", 400); }
  if (typeof body.startedAt !== "number" || !Number.isFinite(body.startedAt) || Date.now() - body.startedAt < 1500) return json("Please wait a moment and submit again.", 400);
  let claim: Awaited<ReturnType<typeof claimHotelRequest>> | undefined;
  try {
    const payload = await getPayload({ config });
    claim = await claimHotelRequest(payload, input, checkRequestIP(request));
    if (!claim.allowed) return claim.duplicate ? json(HOTEL_REQUEST_RESPONSE) : json("Too many requests. Please try again later.", 429);
    await saveHotelRequest(payload, input, claim.reference!);
    return json(HOTEL_REQUEST_RESPONSE);
  } catch {
    await claim?.release?.().catch(() => {});
    console.error("hotel_request_save_failed"); // No submitted contact details or provider response bodies.
    return json("We could not save your request right now. Please try again later.", 503);
  }
}
