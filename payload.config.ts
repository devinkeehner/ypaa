import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mcpPlugin, type MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
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

const payloadCollections = [
  Users,
  Media,
  Pages,
  Merchandise,
  Tenants,
  AccessCodes,
  CashTransactions,
  Attendees,
  BreakfastTickets,
  Rooms,
  ProgramSessions,
  VenueMaps,
];

type McpResponse = { content: Array<{ text: string; type: string }> };

const mcpSensitiveKeys = new Set([
  "apiKey",
  "apiKeyIndex",
  "hash",
  "password",
  "resetPasswordExpiration",
  "resetPasswordToken",
  "salt",
]);

function redactMcpValue(value: unknown, key?: string): unknown {
  if (key && mcpSensitiveKeys.has(key)) return "[redacted]";
  if (Array.isArray(value)) return value.map((entry) => redactMcpValue(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [entryKey, redactMcpValue(entryValue, entryKey)]),
    );
  }
  return value;
}

function redactMcpResponse(response: McpResponse): McpResponse {
  return {
    ...response,
    content: response.content.map((item) => {
      try {
        return { ...item, text: JSON.stringify(redactMcpValue(JSON.parse(item.text)), null, 2) };
      } catch {
        return item;
      }
    }),
  };
}

const mcpCollections = Object.fromEntries(
  payloadCollections.map((collection) => [
    collection.slug,
    {
      enabled: { find: true, create: true, update: true, delete: true },
      description:
        typeof collection.admin?.description === "string"
          ? collection.admin.description
          : `Manage ${collection.slug} records for NECYPAA XXXVI.`,
      ...(collection.slug === Users.slug ? { overrideResponse: redactMcpResponse } : {}),
    },
  ]),
) as NonNullable<MCPPluginConfig["collections"]>;

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
  collections: payloadCollections,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || process.env.MONGODB_URI || "",
  }),
  editor: lexicalEditor(),
  plugins: [
    s3Storage({
      enabled: process.env.ENABLE_R2 === "true",
      collections: {
        media: {
          generateFileURL: ({ filename }) => {
            const baseURL = (process.env.R2_PUBLIC_BASE_URL || "").replace(/\/$/, "");
            return baseURL ? `${baseURL}/${encodeURIComponent(filename)}` : filename;
          },
        },
      },
      config: {
        endpoint: process.env.R2_ENDPOINT || "",
        region: "auto",
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
      },
      bucket: process.env.R2_BUCKET || "",
      acl: "public-read",
    }),
    mcpPlugin({
      disabled: process.env.PAYLOAD_ENABLE_MCP !== "true",
      collections: mcpCollections,
    }),
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
