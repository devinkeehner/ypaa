import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { mcpPlugin, type MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { isAdministrator, withViewerAccess, withViewerGlobalAccess } from "./lib/crm-access";

import { Users } from "./collections/Users";
import { WordlePuzzles } from "./collections/WordlePuzzles";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Merchandise } from "./collections/Merchandise";
import { MerchandiseOrders } from "./collections/MerchandiseOrders";
import { CheckoutOrders } from "./collections/CheckoutOrders";
import { Tenants } from "./collections/Tenants";
import { AccessCodes } from "./collections/AccessCodes";
import { CashTransactions } from "./collections/CashTransactions";
import { Attendees } from "./collections/Attendees";
import { BreakfastTickets } from "./collections/BreakfastTickets";
import { Contacts } from "./collections/Contacts";
import { RegistrationCorrections } from "./collections/RegistrationCorrections";
import { RegistrationEntitlements } from "./collections/RegistrationEntitlements";
import { ScholarshipContributions } from "./collections/ScholarshipContributions";
import { Rooms } from "./collections/Rooms";
import { ProgramSessions } from "./collections/ProgramSessions";
import { VenueMaps } from "./collections/VenueMaps";
import { NotificationRecipients } from "./collections/NotificationRecipients";
import { EmailTests } from "./collections/EmailTests";
import { ensureProgramSeed } from "./lib/program-seed";
import { pageBuilderCatalogResource } from "./mcp/block-catalog";
import { Header } from "./globals/Header";
import { Footer } from "./globals/Footer";

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, "");

function getMediaFileUrl(filename: string) {
  return r2PublicBaseUrl
    ? `${r2PublicBaseUrl}/${encodeURIComponent(filename)}`
    : `/api/media/file/${encodeURIComponent(filename)}`;
}

export default buildConfig({
  admin: {
    avatar: "default",
    user: Users.slug,
    importMap: { baseDir: "." },
    meta: { defaultOGImageType: "off" },
    components: {
      Nav: "@/components/admin/nav/NECYPAAAdminNav#NECYPAAAdminNav",
      graphics: {
        Icon: "@/components/admin/brand/NECYPAAAdminIcon#default",
        Logo: "@/components/admin/brand/NECYPAAAdminLogo#default",
      },
      providers: ["@/components/admin/AdminRuntimeRecovery"],
      afterDashboard: ["@/components/admin/MerchChairDashboardRedirect#MerchChairDashboardRedirect"],
      views: {
        programBoard: {
          Component: "@/components/admin/ProgramBoardAdminView",
          exact: true,
          path: "/program-board",
        },
        registrationCorrections: {
          Component: "@/components/admin/RegistrationCorrectionsAdminView",
          exact: true,
          path: "/registration-corrections",
        },
        merchandiseSales: {
          Component: "@/components/admin/MerchandiseSalesAdminView",
          exact: true,
          path: "/merchandise-sales",
        },
      },
    },
    dashboard: {
      defaultLayout: [
        { widgetSlug: "eventQuickActions", width: "full" },
        { widgetSlug: "eventCRMOverview", width: "full" },
        { widgetSlug: "scholarshipFund", width: "medium" },
        { widgetSlug: "eventOperations", width: "medium" },
      ],
      widgets: [
        {
          slug: "eventQuickActions",
          Component: "@/components/admin/dashboard/NECYPAAOperationsDashboard#EventQuickActionsWidget",
          label: "Event operations",
          minWidth: "full",
        },
        {
          slug: "eventCRMOverview",
          Component: "@/components/admin/dashboard/NECYPAAOperationsDashboard#EventCRMOverviewWidget",
          label: "CRM overview",
          minWidth: "full",
        },
        {
          slug: "scholarshipFund",
          Component: "@/components/admin/dashboard/NECYPAAOperationsDashboard#ScholarshipFundWidget",
          label: "Scholarship fund",
          minWidth: "medium",
        },
        {
          slug: "eventOperations",
          Component: "@/components/admin/dashboard/NECYPAAOperationsDashboard#EventOperationsWidget",
          label: "Operations queue",
          minWidth: "medium",
        },
      ],
    },
  },
  collections: [Users, Media, Pages, Posts, WordlePuzzles, Merchandise, MerchandiseOrders, Contacts, CheckoutOrders, ScholarshipContributions, RegistrationEntitlements, Tenants, AccessCodes, CashTransactions, Attendees, BreakfastTickets, RegistrationCorrections, Rooms, ProgramSessions, VenueMaps, NotificationRecipients, EmailTests].map(withViewerAccess),
  globals: [Header, Footer].map(withViewerGlobalAccess),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  editor: lexicalEditor(),
  plugins: [
    mcpPlugin({
      disabled: process.env.PAYLOAD_ENABLE_MCP !== "true",
      userCollection: "users",
      overrideApiKeyCollection: (collection) => ({
        ...collection,
        admin: { ...collection.admin, hidden: ({ user }) => !isAdministrator(user) },
        access: Object.fromEntries(["admin", "create", "read", "update", "delete", "unlock", "readVersions"].map((operation) =>
          [operation, ({ req }: { req: { user?: unknown } }) => isAdministrator(req.user)],
        )),
      }),
      collections: {
        pages: {
          description: "Visual-builder pages. Read the ypaa://page-builder/block-catalog resource before creating or updating layout or builderData, and preserve every Puck zone.",
          enabled: { find: true, create: true, update: true, delete: false },
        },
        posts: {
          description: "Fast Lexical-authored blog and news posts with title, slug, excerpt, hero image, rich content, draft status, and publish date.",
          enabled: { find: true, create: true, update: true, delete: false },
        },
        media: {
          description: "Payload media records referenced by visual-builder blocks and blog posts.",
          enabled: { find: true, create: false, update: true, delete: false },
        },
        tenants: {
          description: "Site-wide theme colors and branding used by both built pages and visual-builder previews.",
          enabled: { find: true, create: false, update: true, delete: false },
        },
      } as MCPPluginConfig["collections"],
      mcp: {
        resources: [pageBuilderCatalogResource],
        serverOptions: {
          instructions: "Use Posts for quick editorial publishing. For Pages, read the YPAA page-builder block catalog first, retain builderData.zones, and keep layout and builderData synchronized through Payload updates.",
          serverInfo: { name: "NECYPAA CMS", version: "1.0.0" },
        },
      },
    }),
    ...(process.env.ENABLE_R2 === "true"
      ? [
          s3Storage({
            bucket: process.env.R2_BUCKET || "",
            collections: {
              media: {
                generateFileURL: ({ filename }) => getMediaFileUrl(filename),
              },
            },
            config: {
              credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
              },
              endpoint: process.env.R2_ENDPOINT || "",
              forcePathStyle: true,
              region: "auto",
            },
          }),
        ]
      : []),
  ],
  secret: process.env.PAYLOAD_SECRET || "local-preview-secret-change-me",
  telemetry: false,
  typescript: { outputFile: "payload-types.ts" },
  onInit: async (payload) => {
    try {
      await ensureProgramSeed(payload);
    } catch (error) {
      payload.logger.error({ err: error, msg: "Unable to seed the sample program records" });
    }
  },
});
