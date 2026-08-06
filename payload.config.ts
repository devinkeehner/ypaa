import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: "." },
    meta: { defaultOGImageType: "off" },
    components: {
      afterNavLinks: ["@/components/admin/ProgramBoardNavLink"],
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
  db: sqliteD1Adapter({ binding: payloadD1, push: false }),
  editor: lexicalEditor(),
  plugins: [
    r2Storage({
      bucket: payloadBucket,
      collections: { media: true },
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
