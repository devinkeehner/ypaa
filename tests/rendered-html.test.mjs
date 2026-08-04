import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(
    html,
    /<link[^>]+href=["']\/assets\/frontend-styles-[^"']+\.css["'][^>]*>/i,
  );
});

test("renders the home slug as the public homepage", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("home-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/home", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /NECYPAA XXXVI/i);
});

test("attaches the Payload admin stylesheet to its route layout", async () => {
  const manifestUrl = new URL(
    "../dist/server/__vite_rsc_assets_manifest.js",
    import.meta.url,
  );
  manifestUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: manifest } = await import(manifestUrl.href);
  const adminStyles =
    manifest.serverResources?.["app/(payload)/layout.tsx"]?.css;

  assert.ok(
    Array.isArray(adminStyles) && adminStyles.length > 0,
    "Payload's route layout must emit at least one stylesheet link",
  );

  const clientManifest = JSON.parse(
    await readFile(
      new URL("../dist/client/.vite/manifest.json", import.meta.url),
      "utf8",
    ),
  );
  const frontendStyles =
    clientManifest["app/(frontend)/frontend-styles.tsx"]?.css?.map(
      (file) => `/${file}`,
    ) ?? [];

  assert.ok(frontendStyles.length > 0, "The public site must emit its stylesheet");
  assert.deepEqual(
    adminStyles.filter((file) => frontendStyles.includes(file)),
    [],
    "Public-site CSS must not be attached to the Payload admin layout",
  );
});

test("packages the Payload layout and version-parent repair migrations", async () => {
  const migrationFiles = await readdir(
    new URL("../dist/.openai/drizzle", import.meta.url),
  );
  assert.ok(
    migrationFiles.some((file) => /^0001_.+\.sql$/.test(file)),
    "The structured page-layout migration must be included in the Sites artifact",
  );

  const repairMigration = migrationFiles.find(
    (file) => file === "0002_repair_page_version_parents.sql",
  );
  assert.ok(
    repairMigration,
    "The version-parent repair migration must be included in the Sites artifact",
  );

  const repairSQL = await readFile(
    new URL(`../dist/.openai/drizzle/${repairMigration}`, import.meta.url),
    "utf8",
  );
  assert.match(repairSQL, /UPDATE\s+`_pages_v`/i);
  assert.match(repairSQL, /WHERE\s+`parent_id`\s+IS\s+NULL/i);

  const mediaMigration = migrationFiles.find(
    (file) => file === "0003_familiar_fallen_one.sql",
  );
  assert.ok(mediaMigration, "The editable Puck media migration must be included in the Sites artifact");
  const mediaSQL = await readFile(
    new URL(`../dist/.openai/drizzle/${mediaMigration}`, import.meta.url),
    "utf8",
  );
  assert.match(mediaSQL, /CREATE TABLE `pages_blocks_image`/i);
  assert.match(mediaSQL, /ADD `upcoming_image_id`/i);
});
