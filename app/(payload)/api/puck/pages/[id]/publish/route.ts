import configPromise from "@payload-config";
import { createPayloadRequest } from "payload";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await createPayloadRequest({ canSetHeaders: false, config: configPromise, request });
  if (!req.user) return new Response("Unauthorized", { status: 403 });
  const body = (await request.json()) as { data?: Record<string, unknown> };
  if (!body.data) return new Response("Missing Puck data", { status: 400 });
  const page = await req.payload.update({
    collection: "pages",
    id,
    data: { builderData: body.data },
    depth: 0,
    draft: false,
    overrideAccess: false,
    overrideLock: false,
    req,
  });
  return Response.json({ page });
}
