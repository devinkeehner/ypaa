import configPromise from "@payload-config";
import { getPayload } from "payload";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PuckPageBuilderClient } from "@/components/admin/PuckPageBuilderClient";
import { pageDocumentToPuckData } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

export const dynamic = "force-dynamic";

export default async function VisualBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const config = await configPromise;
  const payload = await getPayload({ config: configPromise });
  const requestHeaders = await headers();
  const { permissions, user } = await payload.auth({
    canSetHeaders: false,
    headers: requestHeaders,
  });
  const builderPath = `${config.routes.admin}/visual-builder/${encodeURIComponent(id)}`;

  if (!user || !permissions.canAccessAdmin) {
    const loginPath = `${config.routes.admin}${config.admin.routes?.login || "/login"}`;
    redirect(`${loginPath}?redirect=${encodeURIComponent(builderPath)}`);
  }

  const page = await payload.findByID({
    collection: "pages",
    id,
    draft: true,
    depth: 1,
    disableErrors: true,
    overrideAccess: false,
    user,
  });

  if (!page) notFound();
  const pageDoc = page as unknown as PageDocument;

  return (
    <PuckPageBuilderClient
      initialData={pageDocumentToPuckData(pageDoc)}
      pageId={String(pageDoc.id ?? id)}
      pageTitle={pageDoc.title || "Untitled page"}
    />
  );
}
