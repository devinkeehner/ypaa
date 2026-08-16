import "server-only";

import { createHash } from "node:crypto";

export type ExternalGrantType = "cash_registration" | "cash_scholarship";
export type ExternalRedemptionResult =
  | { success: true; grantId: string; grantType: ExternalGrantType; redemptionId: string; registrationId: string; message?: string }
  | { success: false; error?: string; code?: string };

export function normalizeCashCode(value: unknown): string {
  return String(value || "").trim().toUpperCase();
}

export function maskCashCode(code: string): string {
  return code.length <= 4 ? "****" : `****${code.slice(-4)}`;
}

export function buildCashRegistrationId(input: { code: string; email: string; name: string }): string {
  const digest = createHash("sha256")
    .update([input.code, input.email.trim().toLowerCase(), input.name.trim()].join("\n"))
    .digest("hex")
    .slice(0, 24);
  return `cash-${digest}`;
}

export async function redeemExternalCashCode(input: {
  code: string;
  email: string;
  fullName: string;
  registrationId: string;
}): Promise<ExternalRedemptionResult> {
  const baseUrl = process.env.ISSUER_SERVICE_BASE_URL?.replace(/\/$/, "");
  const apiKey = process.env.ISSUER_SERVICE_API_KEY;
  if (!baseUrl || !apiKey) return { success: false, code: "SERVICE_ERROR", error: "External cash-code service is not configured." };

  const response = await fetch(`${baseUrl}/api/internal/redeem-registration-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      code: input.code,
      eventSlug: process.env.ISSUER_EVENT_SLUG || "necypaa-xxxvi",
      email: input.email,
      fullName: input.fullName,
      source: "necypaa-xxxvi-site",
      idempotencyKey: createHash("sha256").update(`cash-registration-v1:${input.registrationId}`).digest("hex"),
      registrationId: input.registrationId,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  const body = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!response.ok) return { success: false, code: String(body?.code || "SERVICE_ERROR"), error: typeof body?.error === "string" ? body.error : "That access code could not be verified." };
  if (body?.success !== true || typeof body.grantId !== "string" || typeof body.grantType !== "string" || typeof body.redemptionId !== "string" || typeof body.registrationId !== "string") {
    return { success: false, code: "SERVICE_ERROR", error: "The access-code service returned an unexpected response." };
  }
  if (body.grantType !== "cash_registration" && body.grantType !== "cash_scholarship") {
    return { success: false, code: "SERVICE_ERROR", error: "This code is not a cash registration code." };
  }
  return { success: true, grantId: body.grantId, grantType: body.grantType, redemptionId: body.redemptionId, registrationId: body.registrationId, message: typeof body.message === "string" ? body.message : undefined };
}
