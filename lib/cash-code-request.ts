import { createHash, createHmac } from "node:crypto";
import type { Payload } from "payload";
import { sendCashAccessCode } from "./scholarship-email";

export const CASH_CODE_RESPONSE = "If your email is approved, a cash access code will be sent. Please check your inbox and spam folder.";

// The same request produces the same secret and provider idempotency key after a
// retry, even if the email provider accepted a request whose response was lost.
export function codeForRequest(reference: string) {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("cash_code_configuration_missing");
  return `CASH-${createHmac("sha256", secret).update(`cash-code-v1:${reference}`).digest("hex").slice(0, 24).toUpperCase()}`;
}

export async function issueCashCode(payload: Payload, email: string, reference: string) {
  // A narrow structural type allows type generation to run independently of this
  // implementation while the new collection is added to Payload's config.
  const find = payload.find.bind(payload) as (options: unknown) => Promise<{ docs: Array<{ email?: string | null; active?: boolean | null }> }>;
  const approved = await find({ collection: "cash-code-recipients", overrideAccess: true, depth: 0, limit: 1,
    where: { and: [{ email: { equals: email } }, { active: { equals: true } }] } });
  if (!approved.docs.some((entry) => entry.active && entry.email?.trim().toLowerCase() === email)) return;
  if (!process.env.RESEND_API_KEY || !process.env.SCHOLARSHIP_FROM_EMAIL || !process.env.REGISTRATION_SITE_API_KEY) throw new Error("cash_code_configuration_missing");
  const code = codeForRequest(reference);
  const codeHash = createHash("sha256").update(code).digest("hex");
  const site = (process.env.REGISTRATION_SITE_URL || "https://reg.necypaact.com").replace(/\/$/, "");
  const response = await fetch(`${site}/api/internal/cash-codes`, {
    method: "POST", headers: { Authorization: `Bearer ${process.env.REGISTRATION_SITE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ codeHash }), signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("cash_code_issuance_failed");
  if (await sendCashAccessCode({ recipientEmail: email, code, reference }) !== "sent") throw new Error("cash_code_mail_unavailable");
}
