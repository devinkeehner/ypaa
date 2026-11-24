import config from "@payload-config";
import { getPayload } from "payload";
import { normalizeApnsToken, sendApnsBroadcast } from "@/lib/apns";
import { canAccessArea } from "@/lib/crm-access";
import { ensureMobilePushRetention, MOBILE_PUSH_CUTOFF, mobilePushAvailability } from "@/lib/mobile-push-retention";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const deadline = Date.now() + 50000;
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const protocol = request.headers.get("x-forwarded-proto") || url.protocol.slice(0, -1);
  if (request.headers.get("origin") !== `${protocol}://${host}`) {
    return Response.json({ error: "Same-origin requests are required." }, { status: 403 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!canAccessArea(user, "program", true)) {
    return Response.json({ error: "Program management access is required." }, { status: 403 });
  }
  const availability = mobilePushAvailability();
  if (availability.status === 410) {
    return Response.json({ error: "Push alerts for this convention have ended." }, { status: 410 });
  }
  if (availability.status !== 204) {
    return Response.json({ error: "Push delivery is unavailable." }, { status: 503 });
  }

  const input: unknown = await request.json().catch(() => null);
  const announcementId = input && typeof input === "object" && "announcementId" in input ? input.announcementId : null;
  if (typeof announcementId !== "string" || !/^[\da-f]{24}$/i.test(announcementId)) {
    return Response.json({ error: "An announcement ID is required." }, { status: 400 });
  }

  const { docs: announcements } = await payload.find({
    collection: "mobile-announcements",
    where: { id: { equals: announcementId }, published: { equals: true } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const announcement = announcements[0];
  if (!announcement) return Response.json({ error: "Published announcement not found." }, { status: 404 });

  try {
    await ensureMobilePushRetention(payload);
  } catch {
    return Response.json({ error: "Push subscription cleanup is unavailable." }, { status: 503 });
  }

  const recipients = await payload.find({
    collection: "mobile-push-subscriptions",
    where: { token: { not_like: "PushToken[" } },
    select: { token: true, updatedAt: true },
    limit: 2000,
    depth: 0,
    overrideAccess: true,
  });
  const devices = recipients.docs.flatMap(({ id, token, updatedAt }) => {
    const normalized = normalizeApnsToken(token);
    return normalized ? [{ id, token: normalized, updatedAt }] : [];
  });
  if (!devices.length) return Response.json({ error: "No iOS installations have opted in." }, { status: 409 });
  if (recipients.hasNextPage) return Response.json({ error: "Recipient count exceeds the broadcast limit." }, { status: 422 });

  let claimId: string;
  try {
    const claim = await payload.create({
      collection: "mobile-push-broadcasts",
      data: { announcementId: String(announcement.id) },
      overrideAccess: true,
    });
    claimId = claim.id;
  } catch {
    return Response.json({ error: "A broadcast could not be reserved. Check whether it has already been attempted." }, { status: 409 });
  }

  let delivery;
  try {
    delivery = await sendApnsBroadcast(availability.configuration, devices, {
      announcementId: String(announcement.id), cutoff: MOBILE_PUSH_CUTOFF, deadline,
    });
  } catch {
    return Response.json({ error: "The Apple push result is unavailable. Confirm its status before attempting another broadcast." }, { status: 502 });
  }
  const { accepted, rejected, unconfirmed, authorizationFailed, inactive } = delivery;

  if (inactive.length) {
    // Match the exact registration we sent to so a subsequent opt-in survives a stale APNs response.
    await payload.delete({
      collection: "mobile-push-subscriptions",
      where: { or: inactive.map(({ id, updatedAt }) => ({ id: { equals: id }, updatedAt: { equals: updatedAt } })) },
      overrideAccess: true,
    }).catch(() => undefined);
  }

  if (accepted === 0 && unconfirmed === 0) {
    // Every send was rejected or skipped, so the same announcement can be retried safely.
    await payload.delete({ collection: "mobile-push-broadcasts", id: claimId, overrideAccess: true }).catch(() => undefined);
  }
  if (authorizationFailed && accepted === 0 && unconfirmed === 0) {
    return Response.json({ error: "Apple rejected the push authorization. Verify the APNs credentials and environment." }, { status: 502 });
  }

  return Response.json({ accepted, rejected, unconfirmed });
}
