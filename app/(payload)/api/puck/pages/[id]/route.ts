import configPromise from "@payload-config";
import { createPayloadRequest } from "payload";

async function authenticated(request: Request) {
  const req = await createPayloadRequest({ canSetHeaders: false, config: configPromise, request });
  return { payload: req.payload, req, user: req.user };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { payload, req, user } = await authenticated(request);
  if (!user) return new Response("Unauthorized", { status: 403 });
  const body = (await request.json()) as { data?: Record<string, unknown> };
  if (!body.data) return new Response("Missing Puck data", { status: 400 });
  const page = await payload.update({
    collection: "pages",
    id,
    data: { builderData: body.data },
    depth: 0,
    draft: true,
    overrideAccess: false,
    overrideLock: false,
    req,
  });
  return Response.json({ page });
}
