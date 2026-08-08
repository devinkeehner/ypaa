import vinext from "vinext";
import { defineConfig } from "vite";
import hostingConfig from "./.openai/hosting.json";
import { sites } from "./build/sites-vite-plugin";

function payloadServerCssCompatibility() {
  const htmlDiffModule = "/node_modules/@payloadcms/ui/dist/elements/HTMLDiff/index.js";

  return {
    name: "payload-server-css-compatibility",
    enforce: "pre" as const,
    async load(id: string) {
      if (!id.replaceAll("\\\\", "/").endsWith(htmlDiffModule)) return null;
      const source = await import("node:fs/promises").then(({ readFile }) => readFile(id, "utf8"));
      return source.replace("import './index.scss';", "");
    },
  };
}

function payloadWorkerModuleUrlCompatibility() {
  const payloadModule = /\/node_modules\/(?:@payloadcms\/|payload\/)/;

  return {
    name: "payload-worker-module-url-compatibility",
    enforce: "pre" as const,
    transform(source: string, id: string) {
      let transformed = source;

      if (
        id.replaceAll("\\\\", "/").endsWith(
          "/node_modules/@payloadcms/next/dist/routes/rest/og/index.js",
        )
      ) {
        transformed = transformed.replace(
          "from 'next/og.js'",
          `from '${process.cwd().replaceAll("\\", "/")}/server/next-og-stub.ts'`,
        );
      }

      if (
        payloadModule.test(id) &&
        (transformed.includes("fileURLToPath(import.meta.url)") ||
          transformed.includes("createRequire(import.meta.url)"))
      ) {
        transformed = transformed.replaceAll(
          "fileURLToPath(import.meta.url)",
          '"/worker/payload-module.js"',
        );
        transformed = transformed.replaceAll(
          "createRequire(import.meta.url)",
          'createRequire("/worker/payload-module.js")',
        );
      }

      return transformed === source ? null : transformed;
    },
  };
}

const SITE_CREATOR_PLACEHOLDER_DATABASE_ID =
  "00000000-0000-4000-8000-000000000000";

const { d1, r2 } = hostingConfig;

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: d1
    ? [
        {
          binding: d1,
          database_name: "site-creator-d1",
          database_id: SITE_CREATOR_PLACEHOLDER_DATABASE_ID,
        },
      ]
    : [],
  r2_buckets: r2
    ? [
        {
          binding: r2,
          bucket_name: "site-creator-r2",
        },
      ]
    : [],
};

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      watch: {
        ignored: ["**/.sites-runtime/**", "**/dist/**"],
        ...(isCodexSeatbeltSandbox ? { useFsEvents: false, usePolling: true } : {}),
      },
    },
    plugins: [
      payloadServerCssCompatibility(),
      payloadWorkerModuleUrlCompatibility(),
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        inspectorPort: false,
        config: localBindingConfig,
      }),
    ],
  };
});
