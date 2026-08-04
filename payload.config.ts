import { sqliteD1Adapter } from "@payloadcms/db-d1-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { r2Storage } from "@payloadcms/storage-r2";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { payloadBucket, payloadD1 } from "./server/cloudflare-bindings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
  },
  collections: [Users, Media, Pages],
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
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
