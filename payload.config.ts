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
import { payloadBucket, payloadD1 } from "./server/cloudflare-bindings";

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: "." },
    meta: { defaultOGImageType: "off" },
  },
  collections: [Users, Media, Pages, Merchandise, Tenants, AccessCodes, CashTransactions],
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
});
