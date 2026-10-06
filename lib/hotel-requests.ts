import { createHmac, randomUUID } from "node:crypto";
import type { Payload } from "payload";
import { sendHotelRequestAlert } from "./scholarship-email";
import { hotelRequestedNights, type HotelRequestInput } from "./hotel-request-validation";

const digest = (value: string) => {
  if (!process.env.PAYLOAD_SECRET) throw new Error("hotel_request_missing_secret");
  return createHmac("sha256", process.env.PAYLOAD_SECRET).update(value).digest("hex");
};
const indexes = new WeakMap<object, Promise<string>>();
type LimitRow = { _id: string; count?: number; nextAllowedAt?: Date; expiresAt: Date; token?: string; fingerprint?: string };
export async function claimHotelRequest(payload: Payload, input: HotelRequestInput, ip: string, now = Date.now()) {
  const db = payload.db.connection.db;
  if (!db) throw new Error("hotel_request_database_unavailable");
  const limits = db.collection<LimitRow>("_hotel_request_limits");
  let index = indexes.get(db);
  if (!index) { index = limits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }); indexes.set(db, index); }
  await index.catch((error) => { indexes.delete(db); throw error; });
  const hour = Math.floor(now / 3600000);
  for (const [scope, value, max] of [["global", "all", 200], ["ip", ip, 10]] as const) {
    const row = await limits.findOneAndUpdate({ _id: digest(`${scope}:${value}:${hour}`) }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((hour + 2) * 3600000) } }, { upsert: true, returnDocument: "after" });
    if (!row || (row.count || 0) > max) return { allowed: false, duplicate: false };
  }
  const key = digest(`email:${input.email}`), fingerprint = digest(JSON.stringify(input)), token = randomUUID();
  try {
    await limits.findOneAndUpdate({ _id: key, nextAllowedAt: { $lte: new Date(now) } }, { $set: { nextAllowedAt: new Date(now + 600000), expiresAt: new Date(now + 86400000), token, fingerprint } }, { upsert: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) {
      const row = await limits.findOne({ _id: key });
      // Only acknowledge duplicates that actually reached durable storage.
      const saved = row?.token && row.fingerprint === fingerprint ? await payload.count({ collection: "hotel-requests", overrideAccess: true, where: { requestKey: { equals: digest(`request:${row.token}`) } } }) : null;
      return { allowed: false, duplicate: Boolean(saved?.totalDocs) };
    }
    throw error;
  }
  return { allowed: true, duplicate: false, reference: digest(`request:${token}`), release: () => limits.deleteOne({ _id: key, token }) };
}

export async function notifyHotelRequest(payload: Payload, id: string) {
  const record = await payload.findByID({ collection: "hotel-requests", id, overrideAccess: true, depth: 0 });
  const sent: string[] = Array.isArray(record.notifiedEmails) ? record.notifiedEmails.filter((value): value is string => typeof value === "string") : [];
  let status: "sent" | "partial" | "failed" | "pending_configuration" = "pending_configuration";
  let errorCode: string | undefined;
  try {
    const recipients = await payload.find({ collection: "notification-recipients", overrideAccess: true, pagination: false, depth: 0, sort: "email",
      where: { and: [{ active: { equals: true } }, { triggers: { contains: "hotel_request" } }] } });
    const addresses = [...new Set(recipients.docs.map((row) => row.email.trim().toLowerCase()))];
    if (process.env.RESEND_API_KEY && process.env.SCHOLARSHIP_FROM_EMAIL && addresses.length) {
      status = "sent";
      for (const recipientEmail of addresses) {
        if (sent.includes(recipientEmail)) continue;
        const result = await sendHotelRequestAlert({ recipientEmail, name: record.name, email: record.email, phone: record.phone,
          arrivalDate: record.arrivalDate, departureDate: record.departureDate, numberOfRooms: record.numberOfRooms, notes: record.notes || "", reference: record.requestKey });
        if (result !== "sent") { status = sent.length ? "partial" : "pending_configuration"; break; }
        sent.push(recipientEmail);
        // Record each accepted recipient separately, so retry can skip it.
        await payload.update({ collection: "hotel-requests", id, overrideAccess: true, data: { notifiedEmails: sent, notificationStatus: "partial" } });
      }
    }
  } catch { status = sent.length ? "partial" : "failed"; errorCode = "hotel_notification_failed"; }
  await payload.update({ collection: "hotel-requests", id, overrideAccess: true, data: {
    notifiedEmails: sent, notificationStatus: status, lastNotificationAttemptAt: new Date().toISOString(), notificationErrorCode: errorCode || null,
  } });
  return status;
}

export async function saveHotelRequest(payload: Payload, input: HotelRequestInput, reference: string) {
  const record = await payload.create({ collection: "hotel-requests", overrideAccess: true, data: {
    ...input, requestKey: reference, status: "new", notificationStatus: "pending", requestedNights: hotelRequestedNights(input.arrivalDate, input.departureDate).map((date) => ({ date })),
  } });
  try { await notifyHotelRequest(payload, record.id); }
  catch { console.error("hotel_request_notification_pending"); } // Saved inquiry remains reviewable even if tracking or delivery fails.
  return record;
}
