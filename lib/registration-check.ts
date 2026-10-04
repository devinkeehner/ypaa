import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import type { Payload } from "payload";
import { sendRegistrationCheckResult, sendRegistrationHelpAlert } from "./scholarship-email";

export const CHECK_RESPONSE = "Your request was received. Please check your inbox and spam folder for registration information.";
export const HELP_RESPONSE = "Your help request was received. The registration team will contact you at the email you provided.";
export const normalizeCheckEmail = (value: unknown): string => typeof value === "string" ? value.trim().toLowerCase() : "";
export function validCheckEmail(value: string) {
  return value.length <= 254 && /^[^\s@<>\x00-\x1f]+@[^\s@<>\x00-\x1f]+\.[^\s@<>\x00-\x1f]+$/.test(value);
}
const idOf = (value: unknown): string => typeof value === "string" ? value : value && typeof value === "object" && "id" in value ? String(value.id) : "";
const object = (value: unknown): Record<string, unknown> | null => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
const funded = (value: unknown) => value === "paid" || value === "recorded";

// Search the roster, never a payer, contact-only record, merchandise order or unassigned seat.
// `like` is case-insensitive in the Mongo adapter; the exact normalized comparison prevents partial matches.
export async function hasConfirmedRegistration(payload: Payload, email: string): Promise<boolean> {
  const result = await payload.find({ collection: "attendees", overrideAccess: true, depth: 2, limit: 100,
    where: { and: [{ attendeeEmail: { like: email } }, { paymentStatus: { in: ["paid", "recorded"] } }, { attendanceStatus: { not_equals: "cancelled" } }] } });
  if (result.hasNextPage) throw new Error("registration_check_match_limit");
  for (const registration of result.docs) {
    if (normalizeCheckEmail(registration.attendeeEmail) !== email || !funded(registration.paymentStatus) || registration.attendanceStatus === "cancelled") continue;
    if (registration.checkoutOrder) {
      const order = object(registration.checkoutOrder);
      if (!order || !funded(order.paymentStatus)) continue;
    }
    if (registration.entitlement) {
      const seat = object(registration.entitlement);
      if (!seat || !["assigned", "redeemed"].includes(String(seat.status)) || idOf(seat.registration) !== registration.id) continue;
      if (seat.checkoutOrder) {
        const order = object(seat.checkoutOrder);
        if (!order || !funded(order.paymentStatus)) continue;
      }
      if (seat.fundingSource === "pooled_contributions") {
        // Verify each linked contribution and its payment before confirming a pooled seat.
        const contributions = Array.isArray(seat.fundingContributions) ? seat.fundingContributions : [];
        let allocated = 0;
        for (const contribution of contributions) {
          const id = idOf(contribution);
          if (!id) continue;
          const record = await payload.findByID({ collection: "scholarship-contributions", id, overrideAccess: true, depth: 1 });
          const order = object(record.checkoutOrder);
          if (record.status !== "active" || !order || !funded(order.paymentStatus)) { allocated = -1; break; }
          if (!Array.isArray(record.fundedEntitlements) || !record.fundedEntitlements.some((value) => idOf(value) === idOf(seat))) continue;
          allocated += Math.min(record.allocatedCents, record.amountCents);
        }
        if (allocated < registration.registrationPriceCents || allocated <= 0) continue;
      }
    }
    return true; // Multiple valid rows are safe: disclose no names, counts or payment details.
  }
  return false;
}

const digest = (value: string) => {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("registration_check_missing_payload_secret");
  return createHmac("sha256", secret).update(value).digest("hex");
};

export function checkRequestIP(request: Request) {
  // Only trust a header overwritten by the deployment ingress. Unconfigured hosts share a safe limit.
  const header = process.env.VERCEL === "1" ? "x-vercel-forwarded-for" : process.env.REGISTRATION_CHECK_TRUST_PROXY === "true" ? "x-forwarded-for" : null;
  const value = header ? request.headers.get(header)?.split(",")[0]?.trim() : "";
  return value && isIP(value) ? value : "shared-untrusted-ingress";
}

const limitIndexes = new WeakMap<object, Promise<string>>();
type LimitRow = { _id: string; count?: number; nextAllowedAt?: Date; expiresAt: Date; token?: string };
export async function claimPublicRequest(payload: Payload, mode: "check" | "help", email: string, ip: string, now = Date.now()) {
  const db = payload.db.connection.db;
  if (!db) throw new Error("registration_check_database_unavailable");
  const limits = db.collection<LimitRow>("_registration_check_limits");
  let index = limitIndexes.get(db);
  if (!index) { index = limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); limitIndexes.set(db, index); }
  await index.catch((error) => { limitIndexes.delete(db); throw error; });
  const hour = Math.floor(now / 3600000);
  for (const [scope, value, max] of [["global", "all", 200], ["ip", ip, 10]] as const) {
    const row = await limits.findOneAndUpdate({ _id: digest(`${scope}:${value}:${hour}`) }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((hour + 2) * 3600000) } }, { upsert: true, returnDocument: "after" });
    if (!row || (row.count || 0) > max) return { allowed: false, duplicate: false };
  }
  const key = digest(`email:${mode}:${email}`);
  const token = randomUUID();
  try {
    await limits.findOneAndUpdate({ _id: key, nextAllowedAt: { $lte: new Date(now) } }, { $set: { nextAllowedAt: new Date(now + 600000), expiresAt: new Date(now + 86400000), token } }, { upsert: true });
  } catch (error) {
    if (object(error)?.code === 11000) return { allowed: false, duplicate: true };
    throw error;
  }
  return { allowed: true, duplicate: false, reference: digest(`${mode}:${email}:${Math.floor(now / 600000)}`), release: () => limits.deleteOne({ _id: key, token }) };
}

export async function processRegistrationCheck(payload: Payload, email: string, reference: string) {
  const confirmed = await hasConfirmedRegistration(payload, email);
  const status = await sendRegistrationCheckResult({ recipientEmail: email, confirmed, reference });
  if (status !== "sent") throw new Error("registration_check_email_not_configured");
}

export type RegistrationHelpInput = { name: string; email: string; details: string };
export async function processRegistrationHelp(payload: Payload, input: RegistrationHelpInput, reference: string) {
  if (!process.env.RESEND_API_KEY || !process.env.SCHOLARSHIP_FROM_EMAIL) throw new Error("registration_help_email_not_configured");
  const recipients = await payload.find({ collection: "notification-recipients", overrideAccess: true, pagination: false, depth: 0,
    where: { and: [{ active: { equals: true } }, { triggers: { contains: "registration_help" } }] } });
  const addresses = [...new Set(recipients.docs.map((row) => normalizeCheckEmail(row.email)).filter(validCheckEmail))];
  if (!addresses.length) throw new Error("registration_help_no_destination");
  const record = await payload.create({ collection: "registration-help-requests", overrideAccess: true, data: { ...input, requestKey: reference, status: "new", notificationStatus: "pending" } });
  try {
    for (const recipientEmail of addresses) {
      const status = await sendRegistrationHelpAlert({ ...input, recipientEmail, reference });
      if (status !== "sent") throw new Error("registration_help_email_not_configured");
    }
    await payload.update({ collection: "registration-help-requests", id: record.id, overrideAccess: true, data: { notificationStatus: "sent" } });
  } catch {
    // The private staff queue retains the request even when organizer email delivery fails.
    console.error("registration_help_notification_failed");
  }
}
