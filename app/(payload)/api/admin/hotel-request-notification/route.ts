import { getPayload } from "payload";
import config from "@payload-config";
import { canEditCRM } from "@/lib/crm-access";
import { notifyHotelRequest } from "@/lib/hotel-requests";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const expectedOrigin = process.env.HOTEL_REQUEST_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expectedOrigin) return Response.json({ error: "Submit from this website." }, { status: 403 });
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!canEditCRM(user)) return Response.json({ error: "Forbidden" }, { status: 403 });
  let id: unknown;
  try {
    if (Number(request.headers.get("content-length")) > 1024) throw new Error();
    const text = await request.text(); if (text.length > 1024) throw new Error();
    id = JSON.parse(text).id;
    if (typeof id !== "string" || !/^[a-f\d]{24}$/i.test(id)) throw new Error();
  } catch { return Response.json({ error: "Select a valid saved request." }, { status: 400 }); }
  try {
    const status = await notifyHotelRequest(payload, id as string);
    return Response.json({ status }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Notification could not be retried. The request remains saved." }, { status: 503 }); }
}
