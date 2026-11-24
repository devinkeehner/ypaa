import config from "@payload-config";
import { getPayload } from "payload";
import { normalizeApnsToken } from "@/lib/apns";
import { ensureMobilePushRetention, MOBILE_PUSH_EXPIRES_AT, mobilePushAvailability } from "@/lib/mobile-push-retention";

export const runtime = "nodejs";

async function readToken(request: Request): Promise<unknown> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) {
        void reader.cancel().catch(() => undefined);
        return null;
      }
      body += decoder.decode(value, { stream: true });
    }
    const input: unknown = JSON.parse(body + decoder.decode());
    return input && typeof input === "object" && "token" in input ? input.token : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
}

function registrationUnavailable(status: 410 | 503) {
  const error = status === 410 ? "Push alerts for this convention have ended." : "Push registration is unavailable.";
  return Response.json({ error }, { status });
}

async function subscription(request: Request, subscribe: boolean) {
  if (subscribe) {
    const { status } = mobilePushAvailability();
    if (status !== 204) return registrationUnavailable(status);
  }

  const input = await readToken(request);
  const token = normalizeApnsToken(input) ?? (
    !subscribe && typeof input === "string" && /^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]{10,160}\]$/.test(input) ? input : null
  );
  if (!token) {
    return Response.json({ error: "A valid installation push token is required." }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    const where = { token: { equals: token } };
    if (!subscribe) {
      const { errors } = await payload.delete({ collection: "mobile-push-subscriptions", where, overrideAccess: true });
      if (errors.length) throw new Error("mobile_push_delete_failed");
    } else {
      await ensureMobilePushRetention(payload);
      const { status } = mobilePushAvailability();
      if (status !== 204) return registrationUnavailable(status);
      try {
        await payload.create({
          collection: "mobile-push-subscriptions",
          data: { token, expiresAt: MOBILE_PUSH_EXPIRES_AT },
          overrideAccess: true,
        });
      } catch (error) {
        // Refresh the registration timestamp so an older APNs invalidation cannot delete a restored subscription.
        const { docs, errors } = await payload.update({
          collection: "mobile-push-subscriptions", where,
          data: { expiresAt: MOBILE_PUSH_EXPIRES_AT }, overrideAccess: true,
        });
        if (!docs.length || errors.length) throw error;
      }
    }
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Push preferences could not be saved." }, { status: 503 });
  }
}

export function HEAD() {
  return new Response(null, {
    status: mobilePushAvailability().status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function POST(request: Request) {
  return subscription(request, true);
}

export function DELETE(request: Request) {
  return subscription(request, false);
}
