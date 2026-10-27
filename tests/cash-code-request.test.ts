import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import type { Payload } from "payload";
import { codeForRequest, issueCashCode } from "../lib/cash-code-request";
import { pageLayoutToPuckData, puckDataToLayout } from "../puck/page-data";

const keys = ["PAYLOAD_SECRET", "REGISTRATION_SITE_API_KEY", "REGISTRATION_SITE_URL", "RESEND_API_KEY", "SCHOLARSHIP_FROM_EMAIL", "REGISTRATION_TEST_MAIL_CAPTURE"] as const;

test("approved addresses receive a private one-order code issued to the registration site", async () => {
  const old = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const originalFetch = globalThis.fetch;
  Object.assign(process.env, { PAYLOAD_SECRET: "synthetic-secret", REGISTRATION_SITE_API_KEY: "synthetic-key", REGISTRATION_SITE_URL: "https://registration.example.invalid", RESEND_API_KEY: "synthetic-mail-key", SCHOLARSHIP_FROM_EMAIL: "NECYPAA <sender@example.invalid>", REGISTRATION_TEST_MAIL_CAPTURE: "false" });
  const calls: Array<{ url: string; headers: Headers; body: Record<string, unknown> }> = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ url: String(input), headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  };
  const payload = (approved: boolean) => ({ find: async () => ({ docs: approved ? [{ email: "approved@example.invalid", active: true }] : [] }) }) as unknown as Payload;
  try {
    await issueCashCode(payload(false), "missing@example.invalid", "reference");
    assert.equal(calls.length, 0, "unapproved addresses cannot create codes or receive email");
    await issueCashCode(payload(true), "approved@example.invalid", "reference");
    assert.equal(calls.length, 2);
    const code = codeForRequest("reference");
    assert.match(code, /^CASH-[A-F0-9]{24}$/);
    assert.equal(calls[0].url, "https://registration.example.invalid/api/internal/cash-codes");
    assert.equal(calls[0].headers.get("authorization"), "Bearer synthetic-key");
    assert.equal(calls[0].body.codeHash, createHash("sha256").update(code).digest("hex"));
    assert.ok(!JSON.stringify(calls[0].body).includes(code), "only the code hash crosses the issuance boundary");
    assert.equal(calls[1].url, "https://api.resend.com/emails");
    assert.deepEqual(calls[1].body.to, ["approved@example.invalid"]);
    assert.match(String(calls[1].body.text), new RegExp(code));
    assert.match(String(calls[1].body.text), /one cash order/i);
    assert.equal(calls[1].headers.get("idempotency-key"), "cash-code:reference");
    assert.equal(codeForRequest("reference"), code);
    assert.notEqual(codeForRequest("another-reference"), code);
    globalThis.fetch = async () => new Response("unavailable", { status: 503 });
    await assert.rejects(issueCashCode(payload(true), "approved@example.invalid", "reference"), /cash_code_issuance_failed/);
  } finally {
    globalThis.fetch = originalFetch;
    for (const key of keys) { if (old[key] === undefined) delete process.env[key]; else process.env[key] = old[key]; }
  }
});

test("cash-code request block survives Payload and visual-builder conversion", () => {
  const layout = [{ blockType: "CashCodeRequest", heading: "Cash", intro: "Enter an email" }];
  const puck = pageLayoutToPuckData({ title: "Synthetic", layout });
  assert.equal(puck.content[0].type, "CashCodeRequest");
  assert.equal(puckDataToLayout(puck)[0].blockType, "CashCodeRequest");
});
