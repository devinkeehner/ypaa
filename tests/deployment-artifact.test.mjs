import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds the Next.js route manifest expected by Vercel", async () => {
  const manifest = JSON.parse(
    await readFile(new URL("../.next/routes-manifest.json", import.meta.url), "utf8"),
  );

  assert.equal(manifest.version, 3);
  assert.ok(Array.isArray(manifest.dynamicRoutes));
  assert.ok(Array.isArray(manifest.staticRoutes));
});
