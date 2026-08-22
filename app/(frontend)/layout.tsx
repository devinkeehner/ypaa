import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";

import { FrontendStyles } from "./frontend-styles";
import { defaultTenantTheme, TenantThemeProvider, type TenantTheme, defaultHeaderNavigation, defaultFooter } from "@/components/site/TenantThemeProvider";

export const metadata: Metadata = {
  title: "NECYPAA XXXVI | Hartford, Connecticut",
  description:
    "The 36th Northeast Convention of Young People in Alcoholics Anonymous, December 31, 2026 through January 3, 2027 in Hartford, Connecticut.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

function mediaUrl(value: unknown) {
  if (!value || typeof value !== "object") return undefined;
  const url = (value as { url?: unknown }).url;
  return typeof url === "string" ? url : undefined;
}

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let tenant: TenantTheme = defaultTenantTheme;
  try {
    const payload = await getPayload({ config });
    const [result, headerGlobal, footerGlobal] = await Promise.all([
      payload.find({ collection: "tenants", depth: 1, limit: 1, sort: "createdAt" }),
      payload.findGlobal({ slug: "header", depth: 1 }),
      payload.findGlobal({ slug: "footer", depth: 1 }),
    ]);
    const settings = result.docs[0] as unknown as Record<string, unknown> | undefined;
    const header = headerGlobal as unknown as Record<string, unknown>;
    const footer = footerGlobal as unknown as Record<string, unknown>;
    const headerItems = Array.isArray(header.navigation) ? header.navigation : [];
    const theme = settings?.theme as Record<string, unknown> | undefined;
    tenant = {
        logoUrl: mediaUrl(header.logo),
        logoAlt: typeof header.logoAlt === "string" ? header.logoAlt : defaultTenantTheme.logoAlt,
        primary: typeof theme?.primary === "string" ? theme.primary : defaultTenantTheme.primary,
        secondary: typeof theme?.secondary === "string" ? theme.secondary : defaultTenantTheme.secondary,
        accent: typeof theme?.accent === "string" ? theme.accent : defaultTenantTheme.accent,
        background: typeof theme?.background === "string" ? theme.background : defaultTenantTheme.background,
        surface: typeof theme?.surface === "string" ? theme.surface : defaultTenantTheme.surface,
        lightBackground: typeof theme?.lightBackground === "string" ? theme.lightBackground : defaultTenantTheme.lightBackground,
        darkText: typeof theme?.darkText === "string" ? theme.darkText : defaultTenantTheme.darkText,
        lightText: typeof theme?.lightText === "string" ? theme.lightText : defaultTenantTheme.lightText,
        headerNavigation: Array.isArray(headerItems) && headerItems.length ? headerItems.map((item) => ({
          label: typeof item?.label === "string" ? item.label : "Link",
          url: typeof item?.url === "string" ? item.url : "/",
          style: item?.style === "button" ? "button" : "link",
          newTab: item?.newTab === true,
        })) : defaultHeaderNavigation,
        footer: {
          heading: typeof footer.heading === "string" ? footer.heading : defaultFooter.heading,
          text: typeof footer.text === "string" ? footer.text : defaultFooter.text,
          links: Array.isArray(footer.links) ? footer.links.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object")).map((item) => ({ label: typeof item.label === "string" ? item.label : "Link", url: typeof item.url === "string" ? item.url : "/", newTab: item.newTab === true })) : defaultFooter.links,
          legal: typeof footer.legal === "string" ? footer.legal : defaultFooter.legal,
        },
    };
  } catch {
    // Defaults keep the public site usable before the settings migration is applied.
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <FrontendStyles />
        <TenantThemeProvider settings={tenant}>{children}</TenantThemeProvider>
      </body>
    </html>
  );
}
