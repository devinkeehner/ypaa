import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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
  collections: [Users, Media, Pages, Merchandise, Tenants, AccessCodes, CashTransactions, Attendees, BreakfastTickets, Rooms, ProgramSessions, VenueMaps],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || "",
  }),
  editor: lexicalEditor(),
  plugins: [
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
