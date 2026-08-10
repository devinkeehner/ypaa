import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { mcpPlugin, type MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { r2Storage } from "@payloadcms/storage-r2";
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
import { payloadBucket, payloadD1 } from "./server/cloudflare-bindings";

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
  db: sqliteD1Adapter({ binding: payloadD1, push: false }),
  editor: lexicalEditor(),
  plugins: [
    r2Storage({
      bucket: payloadBucket,
      collections: { media: true },
    }),
    mcpPlugin({ collections: mcpCollections }),
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
