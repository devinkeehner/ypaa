import config from "@payload-config";
import { getPayload, APIError } from "payload";
import { mutateProgram } from "@/lib/program-schedule";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  if (request.headers.get("origin") !== `${protocol}://${host}`) return Response.json({ error: "Same-origin requests are required." }, { status: 403 });
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  try {
    const input = await request.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) return Response.json({ error: "Invalid schedule operation." }, { status: 400 });
    return Response.json(await mutateProgram(payload, user, input));
  } catch (error) {
    if (error instanceof APIError) return Response.json({ error: error.message }, { status: error.status });
    payload.logger.error({ err: error, msg: "Program schedule operation failed" });
    return Response.json({ error: "The schedule could not be saved. Reload to check its current state before trying again." }, { status: 409 });
  }
}
