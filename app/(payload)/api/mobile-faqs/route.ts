import config from "@payload-config";
import { REST_DELETE, REST_PATCH, REST_POST } from "@payloadcms/next/routes";
import { getPayload } from "payload";

const headers = { "Access-Control-Allow-Origin": "*" };

// The public feed shares the collection URL with Payload's admin write actions.
const collectionRoute = { params: Promise.resolve({ slug: ["mobile-faqs"] }) };
const createFAQ = REST_POST(config);
const updateFAQs = REST_PATCH(config);
const deleteFAQs = REST_DELETE(config);

export const POST = (request: Request) => createFAQ(request, collectionRoute);
export const PATCH = (request: Request) => updateFAQs(request, collectionRoute);
export const DELETE = (request: Request) => deleteFAQs(request, collectionRoute);

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
