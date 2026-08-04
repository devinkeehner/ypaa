import assert from "node:assert/strict";
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
  assert.match(await response.text(), developmentPreviewMeta);
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
});
