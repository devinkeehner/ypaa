import { timingSafeEqual } from "node:crypto";
import { getPayload } from "payload";
import config from "@payload-config";
import { findRegistrationSource } from "@/lib/registration-sources";

export async function GET(request: Request) {
  const expected = Buffer.from(process.env.REGISTRATION_SITE_API_KEY || "");
  const supplied = Buffer.from(request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "");
  if (!expected.length || supplied.length !== expected.length || !timingSafeEqual(expected, supplied))
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  const slug = new URL(request.url).searchParams.get("slug") || "";
  const source = await findRegistrationSource(await getPayload({ config }), slug);
  return Response.json(source ? { slug: source.slug } : { error: "Unknown tracking link." },
    { status: source ? 200 : 404, headers: { "Cache-Control": "no-store" } });
}
