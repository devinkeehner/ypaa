import type { Payload } from "payload";
import { normalizeSourceSlug } from "./registration-affiliation";

// The API credential and registration domain serve this event only. Sources
// cannot be selected by a caller-supplied tenant or event identifier.
export const REGISTRATION_EVENT = "necypaa_xxxvi";
export const RESERVED_REGISTRATION_PATHS = new Set([
  "api", "checkout", "register", "registration", "records", "merch", "admin",
  "_next", "_vinext", "assets", "public", "favicon", "robots", "sitemap",
]);
export function validTrackingSlug(value: unknown): value is string {
  return Boolean(normalizeSourceSlug(value)) && !RESERVED_REGISTRATION_PATHS.has(value as string);
}
export async function findRegistrationSource(payload: Payload, slug: string, activeOnly = true) {
  if (!validTrackingSlug(slug)) return null;
  const found = await payload.find({
    collection: "registration-sources", overrideAccess: true, depth: 0, limit: 1,
    where: { and: [{ slug: { equals: slug } }, { event: { equals: REGISTRATION_EVENT } },
      ...(activeOnly ? [{ active: { equals: true } }] : [])] },
  });
  return found.docs[0] || null;
}
