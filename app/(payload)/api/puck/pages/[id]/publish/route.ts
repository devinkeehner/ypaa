import configPromise from "@payload-config";
import { createPayloadRequest } from "payload";

import { invalidPuckComponentTypes, isPuckData, puckDataToPagePatch } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await createPayloadRequest({ canSetHeaders: false, config: configPromise, request });
  if (!req.user) return new Response("Unauthorized", { status: 403 });
  const body = (await request.json()) as { data?: unknown };
  if (!isPuckData(body.data)) return new Response("Missing or invalid Puck data", { status: 400 });
  const invalidTypes = invalidPuckComponentTypes(body.data);
  if (invalidTypes.length) return new Response(`Unknown blocks: ${invalidTypes.join(", ")}`, { status: 400 });

  try {
    const currentPage = await req.payload.findByID({
      collection: "pages",
      id,
      draft: true,
      depth: 0,
      overrideAccess: false,
      req,
    });
    const page = await req.payload.update({
      collection: "pages",
      id,
      data: puckDataToPagePatch(body.data, currentPage as unknown as PageDocument),
      depth: 0,
      draft: false,
      overrideAccess: false,
      overrideLock: false,
      req,
    });
    return Response.json({ page });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : "Unable to publish page", { status: 500 });
  }
}
