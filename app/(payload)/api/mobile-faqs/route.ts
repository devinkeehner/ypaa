import config from "@payload-config";
import { getPayload } from "payload";

const headers = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  try {
    const payload = await getPayload({ config });
    const { docs } = await payload.find({
      collection: "mobile-faqs",
      where: { published: { equals: true } },
      select: { question: true, answer: true, replaces: true },
      sort: ["displayOrder", "-updatedAt", "id"],
      pagination: false,
      depth: 0,
      overrideAccess: true,
    });
    const faqs = docs.map(({ id, question, answer, replaces }) => ({ id, question, answer, replaces }));
    return Response.json({ faqs }, { headers: { ...headers, "Cache-Control": "public, max-age=30, s-maxage=60" } });
  } catch {
    return Response.json(
      { error: "FAQs are temporarily unavailable." },
      { status: 503, headers: { ...headers, "Cache-Control": "no-store" } },
    );
  }
}
