import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./payload-generated-schema.ts",
  dialect: "sqlite",
});
