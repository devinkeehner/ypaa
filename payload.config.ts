import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { mcpPlugin, type MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Posts } from "./collections/Posts";
import { Merchandise } from "./collections/Merchandise";
import { Tenants } from "./collections/Tenants";
import { AccessCodes } from "./collections/AccessCodes";
import { CashTransactions } from "./collections/CashTransactions";
import { Attendees } from "./collections/Attendees";
import { BreakfastTickets } from "./collections/BreakfastTickets";
import { Rooms } from "./collections/Rooms";
import { ProgramSessions } from "./collections/ProgramSessions";
import { VenueMaps } from "./collections/VenueMaps";
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
    user: Users.slug,
    importMap: { baseDir: "." },
    meta: { defaultOGImageType: "off" },
    components: {
      afterNavLinks: ["@/components/admin/ProgramBoardNavLink"],
      providers: ["@/components/admin/AdminRuntimeRecovery"],
      views: {
        programBoard: {
          Component: "@/components/admin/ProgramBoardAdminView",
          exact: true,
          path: "/program-board",
        },
      },
    },
  },
  collections: [Users, Media, Pages, Posts, Merchandise, Tenants, AccessCodes, CashTransactions, Attendees, BreakfastTickets, Rooms, ProgramSessions, VenueMaps],
  globals: [Header, Footer],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  editor: lexicalEditor(),
  plugins: [
    mcpPlugin({
      disabled: process.env.PAYLOAD_ENABLE_MCP !== "true",
      userCollection: "users",
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
