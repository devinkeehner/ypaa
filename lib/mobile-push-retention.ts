import type { Payload } from "payload";
import { getApnsConfiguration } from "./apns";

// Midnight in Hartford after the final conference day, January 3, 2027.
export const MOBILE_PUSH_EXPIRES_AT = "2027-01-04T05:00:00.000Z";
export const MOBILE_PUSH_CUTOFF = Date.parse(MOBILE_PUSH_EXPIRES_AT);

export function mobilePushAvailability() {
  if (Date.now() >= MOBILE_PUSH_CUTOFF) return { status: 410 } as const;
  const configuration = process.env.MOBILE_PUSH_ENABLED === "1" ? getApnsConfiguration() : null;
  return configuration ? { status: 204, configuration } as const : { status: 503 } as const;
}

const retentionSetup = new WeakMap<object, Promise<void>>();

export async function ensureMobilePushRetention(payload: Payload) {
  const db = payload.db.connection.db;
  if (!db) throw new Error("mobile_push_database_unavailable");

  let setup = retentionSetup.get(db);
  if (!setup) {
    const name = payload.db.collections["mobile-push-subscriptions"].collection.name;
    const subscriptions = db.collection(name);
    const expiresAt = new Date(MOBILE_PUSH_CUTOFF);
    setup = (async () => {
      await subscriptions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
      // Older subscriptions lack a BSON date. Backfill without reading tokens.
      await subscriptions.updateMany({ expiresAt: { $ne: expiresAt } }, { $set: { expiresAt } });
    })();
    retentionSetup.set(db, setup);
  }
  try {
    await setup;
  } catch (error) {
    if (retentionSetup.get(db) === setup) retentionSetup.delete(db);
    throw error;
  }
}
