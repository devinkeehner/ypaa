import config from "@payload-config";
import { getPayload } from "payload";

const headers = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "mobile-announcements",
      where: { published: { equals: true } },
      select: { title: true, message: true, createdAt: true },
      sort: "-createdAt",
      limit: 50,
      depth: 0,
      overrideAccess: true,
    });
    return Response.json({ updates: docs.map(({ id, title, message, createdAt }) => ({ id, title, message, createdAt })) }, { headers });
  } catch {
    return Response.json({ error: "Announcements are unavailable." }, { status: 503, headers });
  }
}
