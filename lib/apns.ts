import { createPrivateKey, sign, type KeyObject } from "node:crypto";
import { connect, constants, sensitiveHeaders, type ClientHttp2Session } from "node:http2";

type ApnsConfiguration = {
  origin: string;
  bundleId: string;
  keyId: string;
  teamId: string;
  privateKey: KeyObject;
};

type ApnsRecipient = { id: string; token: string; updatedAt: string };

type DeliveryResult =
  | { status: "accepted" | "unconfirmed" | "authorizationFailed" }
  | { status: "rejected"; inactiveAt?: number };

type ConfigurationIssue = "push_disabled" | "invalid_key_id" | "invalid_team_id" | "invalid_bundle_id" |
  "invalid_environment" | "missing_private_key" | "invalid_private_key_pem" | "unsupported_private_key_type";

let lastConfigurationIssue: ConfigurationIssue | undefined;

export function reportApnsConfigurationIssue(issue: ConfigurationIssue) {
  if (process.env.NODE_ENV === "production" && lastConfigurationIssue !== issue) {
    console.warn(`[mobile-push] ${issue}`);
    lastConfigurationIssue = issue;
  }
  return null;
}

export function getApnsConfiguration(): ApnsConfiguration | null {
  const keyId = process.env.APNS_KEY_ID?.trim();
  const teamId = process.env.APNS_TEAM_ID?.trim();
  const bundleId = process.env.APNS_BUNDLE_ID?.trim();
  const pem = process.env.APNS_PRIVATE_KEY?.trim().replace(/\\r\\n|\\n|[\u2028\u2029]/g, "\n");
  const environment = process.env.APNS_ENVIRONMENT?.trim() || "production";
  if (!keyId || !/^[A-Z\d]{10}$/.test(keyId)) return reportApnsConfigurationIssue("invalid_key_id");
  if (!teamId || !/^[A-Z\d]{10}$/.test(teamId)) return reportApnsConfigurationIssue("invalid_team_id");
  if (!bundleId || !/^[\w-]+(?:\.[\w-]+)+$/.test(bundleId)) return reportApnsConfigurationIssue("invalid_bundle_id");
  if (environment !== "production" && environment !== "sandbox") return reportApnsConfigurationIssue("invalid_environment");
  if (!pem) return reportApnsConfigurationIssue("missing_private_key");

  try {
    const privateKey = createPrivateKey(pem);
    if (privateKey.asymmetricKeyType !== "ec" || privateKey.asymmetricKeyDetails?.namedCurve !== "prime256v1") {
      return reportApnsConfigurationIssue("unsupported_private_key_type");
    }
    return {
      origin: environment === "production" ? "https://api.push.apple.com" : "https://api.sandbox.push.apple.com",
      bundleId, keyId, teamId, privateKey,
    };
  } catch {
    return reportApnsConfigurationIssue("invalid_private_key_pem");
  }
}

export function normalizeApnsToken(value: unknown) {
  return typeof value === "string" && /^(?:[a-f\d]{2}){16,256}$/i.test(value) ? value.toLowerCase() : null;
}

function providerToken({ keyId, teamId, privateKey }: ApnsConfiguration) {
  const header = Buffer.from(JSON.stringify({ alg: "ES256", kid: keyId })).toString("base64url");
  const claims = Buffer.from(JSON.stringify({ iss: teamId, iat: Math.floor(Date.now() / 1000) })).toString("base64url");
  const message = `${header}.${claims}`;
  const signature = sign("sha256", Buffer.from(message), { key: privateKey, dsaEncoding: "ieee-p1363" });
  return `${message}.${signature.toString("base64url")}`;
}

function readResult(status: number, body: string): DeliveryResult {
  if (status === 200) return { status: "accepted" };
  if (status === 403) return { status: "authorizationFailed" };
  if (!status) return { status: "unconfirmed" };

  if (status === 410) {
    try {
      const { reason, timestamp } = JSON.parse(body);
      if ((reason === "Unregistered" || reason === "ExpiredToken") && Number.isSafeInteger(timestamp) && timestamp > 0) {
        return { status: "rejected", inactiveAt: timestamp };
      }
    } catch {
      // A malformed 410 response must not remove a subscription.
    }
  }
  return { status: "rejected" };
}

function sendAlert(session: ClientHttp2Session, token: string, bundleId: string, authorization: string,
  expiration: number, payload: string, timeout: number): Promise<DeliveryResult> {
  return new Promise(resolve => {
    let stream;
    try {
      stream = session.request({
        ":method": "POST",
        ":path": `/3/device/${token}`,
        [constants.HTTP2_HEADER_CONTENT_TYPE]: "application/json",
        [constants.HTTP2_HEADER_AUTHORIZATION]: authorization,
        "apns-topic": bundleId,
        "apns-push-type": "alert",
        "apns-priority": "10",
        "apns-expiration": String(expiration),
        [sensitiveHeaders]: [":path", "authorization"],
      });
    } catch {
      resolve({ status: "unconfirmed" });
      return;
    }

    let status = 0;
    let body = "";
    const timer = setTimeout(() => {
      finish({ status: "unconfirmed" });
      stream.close(constants.NGHTTP2_CANCEL);
    }, timeout);
    function finish(result: DeliveryResult) {
      clearTimeout(timer);
      resolve(result);
    }
    stream.setEncoding("utf8");
    stream.once("response", headers => { status = Number(headers[":status"]) || 0; });
    stream.on("data", (chunk: string) => {
      if (body.length < 4096) body += chunk.slice(0, 4096 - body.length);
    });
    stream.once("end", () => finish(readResult(status, body)));
    stream.once("error", () => finish({ status: "unconfirmed" }));
    stream.once("close", () => finish({ status: "unconfirmed" }));
    stream.end(payload);
  });
}

export async function sendApnsBroadcast(configuration: ApnsConfiguration, recipients: ApnsRecipient[],
  { announcementId, cutoff, deadline }: { announcementId: string; cutoff: number; deadline: number }) {
  const result = { accepted: 0, rejected: 0, unconfirmed: 0, authorizationFailed: false, inactive: [] as ApnsRecipient[] };
  if (!recipients.length) return result;

  const start = Date.now();
  const expiration = Math.floor(Math.min(start + 3600000, cutoff) / 1000);
  // Each broadcast opens a new connection and uses one freshly signed token for all its streams.
  const authorization = `bearer ${providerToken(configuration)}`;
  const payload = JSON.stringify({
    aps: { alert: { title: "Convention update", body: "Open the app for details." } },
    // expo-notifications exposes this dictionary as the iOS notification's data.
    body: { kind: "conference-update", announcementId },
  });

  const session = connect(configuration.origin, { minVersion: "TLSv1.2" });
  session.on("error", () => { /* In-flight streams classify interrupted delivery. */ });
  let offset = 0;
  try {
    while (offset < recipients.length && !session.closed && !session.destroyed && !result.authorizationFailed) {
      const now = Date.now();
      if (now >= cutoff || now >= deadline) break;
      // APNs accepts one stream until the initial provider token is authenticated.
      const limit = offset === 0 ? 1 : Math.min(32, session.remoteSettings.maxConcurrentStreams ?? 1);
      const batch = recipients.slice(offset, offset + Math.max(1, limit));
      const deliveries = await Promise.all(batch.map(({ token }) => sendAlert(session, token, configuration.bundleId,
        authorization, expiration, payload, Math.min(7000, deadline - now))));
      for (const [index, delivery] of deliveries.entries()) {
        if (delivery.status === "accepted") result.accepted++;
        else if (delivery.status === "unconfirmed") result.unconfirmed++;
        else {
          result.rejected++;
          if (delivery.status === "authorizationFailed") result.authorizationFailed = true;
          if (delivery.status !== "rejected" || delivery.inactiveAt === undefined) continue;
          const recipient = batch[index];
          if (Date.parse(recipient.updatedAt) < delivery.inactiveAt) result.inactive.push(recipient);
        }
      }
      offset += batch.length;
    }
  } finally {
    session.destroy();
  }
  if (Date.now() >= cutoff || result.authorizationFailed) result.rejected += recipients.length - offset;
  else result.unconfirmed += recipients.length - offset;
  return result;
}
