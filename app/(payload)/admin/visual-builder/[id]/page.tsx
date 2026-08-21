import configPromise from "@payload-config";
import { getPayload } from "payload";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PuckPageBuilderClient } from "@/components/admin/PuckPageBuilderClient";
import { defaultTenantTheme, type TenantTheme } from "@/components/site/TenantThemeProvider";
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

  const [page, tenants] = await Promise.all([
    payload.findByID({
      collection: "pages",
      id,
      draft: true,
      depth: 1,
      disableErrors: true,
      overrideAccess: false,
      user,
    }),
    payload.find({ collection: "tenants", depth: 0, limit: 1, sort: "createdAt", overrideAccess: false, user }),
  ]);

  if (!page) notFound();
  const pageDoc = page as unknown as PageDocument;
  let tenantId: string | undefined;
  let tenantTheme: TenantTheme = defaultTenantTheme;

  const tenant = tenants.docs[0] as unknown as Record<string, unknown> | undefined;
  const theme = tenant?.theme as Record<string, unknown> | undefined;
  if (tenant) {
    tenantId = String(tenant.id);
    tenantTheme = {
      ...defaultTenantTheme,
      primary: typeof theme?.primary === "string" ? theme.primary : defaultTenantTheme.primary,
      secondary: typeof theme?.secondary === "string" ? theme.secondary : defaultTenantTheme.secondary,
      accent: typeof theme?.accent === "string" ? theme.accent : defaultTenantTheme.accent,
      background: typeof theme?.background === "string" ? theme.background : defaultTenantTheme.background,
      surface: typeof theme?.surface === "string" ? theme.surface : defaultTenantTheme.surface,
      lightBackground: typeof theme?.lightBackground === "string" ? theme.lightBackground : defaultTenantTheme.lightBackground,
      darkText: typeof theme?.darkText === "string" ? theme.darkText : defaultTenantTheme.darkText,
      lightText: typeof theme?.lightText === "string" ? theme.lightText : defaultTenantTheme.lightText,
    };
  }

  return (
    <PuckPageBuilderClient
      initialData={pageDocumentToPuckData(pageDoc)}
      pageId={String(pageDoc.id ?? id)}
      pageSlug={pageDoc.slug || ""}
      pageTitle={pageDoc.title || "Untitled page"}
      tenantId={tenantId}
      tenantTheme={tenantTheme}
    />
  );
}
