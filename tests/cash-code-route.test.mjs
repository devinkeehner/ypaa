import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

function load(path, dependencies) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  new Function("exports", "require", js)(exports, (name) => { assert.ok(Object.hasOwn(dependencies, name), name); return dependencies[name]; });
  return exports;
}

test("cash-code public route enforces origin, bot checks, limits and retry on failure", async () => {
  const issued = []; let released = 0, fail = false, duplicate = false;
  const route = load("../app/(payload)/api/cash-code-request/route.ts", {
    "payload": { getPayload: async () => ({}) }, "@payload-config": { default: {} },
    "@/lib/cash-code-request": { CASH_CODE_RESPONSE: "generic", issueCashCode: async (_payload, email, reference) => { if (fail) throw new Error("failure"); issued.push({ email, reference }); } },
    "@/lib/registration-check": { checkRequestIP: () => "synthetic", normalizeCheckEmail: (value) => typeof value === "string" ? value.trim().toLowerCase() : "",
      validCheckEmail: (value) => /^[^@]+@[^@]+\.[^@]+$/.test(value), claimPublicRequest: async () => duplicate ? { allowed: false, duplicate: true } : { allowed: true, reference: "id", release: async () => { released++; } } },
  });
  const request = (body, origin = "http://site.invalid") => new Request("http://site.invalid/api/cash-code-request", { method: "POST", headers: { origin, "content-type": "application/json" }, body: JSON.stringify(body) });
  const base = { email: " APPROVED@EXAMPLE.INVALID ", startedAt: Date.now() - 2000 };
  assert.equal((await route.POST(request(base, "https://attacker.invalid"))).status, 403);
  assert.equal((await route.POST(request({ ...base, startedAt: Date.now() }))).status, 400);
  assert.equal((await route.POST(request({ ...base, email: "bad" }))).status, 400);
  assert.equal((await route.POST(request({ ...base, website: "bot" }))).status, 200);
  assert.equal(issued.length, 0);
  assert.equal((await route.POST(request(base))).status, 200);
  assert.deepEqual(issued, [{ email: "approved@example.invalid", reference: "id" }]);
  duplicate = true; assert.equal((await route.POST(request(base))).status, 200); assert.equal(issued.length, 1);
  duplicate = false; fail = true;
  const old = console.error; console.error = () => {};
  try { assert.equal((await route.POST(request(base))).status, 503); assert.equal(released, 1); } finally { console.error = old; }
});
