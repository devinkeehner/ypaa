import config from "@payload-config";
import { getPayload } from "payload";
import { CorrectionError, saveCRMCorrection } from "@/lib/crm-correction";

export async function POST(request: Request) {
  const requestURL = new URL(request.url);
  // Next's internal URL can use localhost while the browser is on 127.0.0.1.
  const host = request.headers.get("host") || requestURL.host;
  const protocol = request.headers.get("x-forwarded-proto") || requestURL.protocol.replace(":", "");
  if (request.headers.get("origin") !== `${protocol}://${host}`) return Response.json({ error: "Same-origin requests are required." }, { status: 403 });
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  try {
    const input = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) return Response.json({ error: "Invalid correction." }, { status: 400 });
    return Response.json(await saveCRMCorrection(payload, user, input));
  } catch (error) {
    if (error instanceof CorrectionError) return Response.json({ error: error.message }, { status: error.status });
    payload.logger.error({ err: error, msg: "CRM correction rolled back" });
    return Response.json({ error: "The correction could not be saved. Reload and try again; no partial correction was retained." }, { status: 500 });
  }
}
