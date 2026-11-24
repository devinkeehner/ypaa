import assert from "node:assert/strict";
import * as crypto from "node:crypto";
import { EventEmitter } from "node:events";
import { readFileSync } from "node:fs";
import * as http2 from "node:http2";
import test from "node:test";
import ts from "typescript";

function load(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("exports", "require", outputText)(exports, name => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected dependency ${name}`);
    return dependencies[name];
  });
  return exports;
}

const apns = load("../lib/apns.ts", { "node:crypto": crypto, "node:http2": http2 });
const retention = load("../lib/mobile-push-retention.ts", { "./apns": apns });
const token = "1a".repeat(32);
const legacyToken = "ExpoPushToken[synthetic-test-token]";
const slug = "mobile-push-subscriptions";
const { privateKey, publicKey } = crypto.generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const environment = {
  APNS_KEY_ID: "TESTKEY123", APNS_TEAM_ID: "TESTTEAM12", APNS_BUNDLE_ID: "org.example.app",
  APNS_PRIVATE_KEY: privateKey.export({ type: "pkcs8", format: "pem" }).replace(/\n/g, "\\n"),
  APNS_ENVIRONMENT: "production",
};

test("the mobile endpoint probes without a database and lets opt-out through when closed", async t => {
  const now = t.mock.method(Date, "now", () => retention.MOBILE_PUSH_CUTOFF - 1000);
  const previous = process.env;
  process.env = { ...previous, ...environment, MOBILE_PUSH_ENABLED: "0", APNS_PRIVATE_KEY: "" };
  t.after(() => { process.env = previous; });
  const deleteWhere = t.mock.fn(async () => ({ errors: [] }));
  const create = t.mock.fn(async () => undefined);
  const update = t.mock.fn(async () => ({ docs: [{}], errors: [] }));
  const getPayload = t.mock.fn(async () => ({ delete: deleteWhere, create, update }));
  const prepare = t.mock.fn(async () => undefined);
  const route = load("../app/(payload)/api/mobile-push/route.ts", {
    "@payload-config": {}, payload: { getPayload }, "@/lib/apns": apns,
    "@/lib/mobile-push-retention": { ...retention, ensureMobilePushRetention: prepare },
  });
  const request = (method, body = { token }) => new Request("https://example.invalid/api/mobile-push", {
    method, body: JSON.stringify(body), headers: { "User-Agent": "synthetic", "X-Forwarded-For": "192.0.2.1" },
  });
  function assertReadiness(status, state) {
    const probe = route.HEAD();
    assert.equal(probe.status, status, state);
    assert.equal(probe.headers.get("cache-control"), "no-store");
    assert.equal(probe.body, null);
  }

  assertReadiness(503, "disabled");
  assert.equal((await route.POST(request("POST"))).status, 503);
  process.env.MOBILE_PUSH_ENABLED = "1";
  assertReadiness(503, "missing APNs key");
  process.env.APNS_PRIVATE_KEY = "invalid";
  assertReadiness(503, "invalid APNs key");
  process.env.APNS_PRIVATE_KEY = environment.APNS_PRIVATE_KEY;
  assertReadiness(204, "ready");
  assert.equal(getPayload.mock.callCount(), 0);
  assert.equal((await route.POST(request("POST", { token: legacyToken }))).status, 400);
  assert.equal((await route.POST(request("POST", { token, unused: "a".repeat(1024) }))).status, 400);
  assert.equal((await route.POST(request("POST", { token: token.toUpperCase(), attendee: "ignored" }))).status, 204);
  assert.equal(prepare.mock.callCount(), 1);
  assert.deepEqual(create.mock.calls[0].arguments[0].data, { token, expiresAt: retention.MOBILE_PUSH_EXPIRES_AT });
  create.mock.mockImplementation(async () => { throw new Error("duplicate"); });
  assert.equal((await route.POST(request("POST"))).status, 204);
  assert.deepEqual(update.mock.calls[0].arguments[0].where, { token: { equals: token } });

  now.mock.mockImplementation(() => retention.MOBILE_PUSH_CUTOFF);
  assertReadiness(410, "after the convention");
  assert.equal((await route.POST(request("POST"))).status, 410);
  process.env.MOBILE_PUSH_ENABLED = "0";
  assert.equal((await route.DELETE(request("DELETE"))).status, 204);
  assert.deepEqual(deleteWhere.mock.calls[0].arguments[0], {
    collection: slug, where: { token: { equals: token } }, overrideAccess: true,
  });
  assert.equal((await route.DELETE(request("DELETE", { token: legacyToken }))).status, 204);
  deleteWhere.mock.mockImplementation(async () => ({ errors: [{ message: "failed" }] }));
  assert.equal((await route.DELETE(request("DELETE"))).status, 503);
});

test("retention indexes and backfills legacy rows without reading tokens and retries failure", async t => {
  const createIndex = t.mock.fn(async () => { throw new Error("temporary database error"); });
  const updateMany = t.mock.fn(async () => undefined);
  const db = { collection: name => {
    assert.equal(name, slug);
    return { createIndex, updateMany };
  } };
  const payload = { db: { connection: { db }, collections: { [slug]: { collection: { name: slug } } } } };
  await assert.rejects(retention.ensureMobilePushRetention(payload), /temporary database error/);
  assert.equal(updateMany.mock.callCount(), 0);
  createIndex.mock.mockImplementation(async () => "expiresAt_1");
  await Promise.all([retention.ensureMobilePushRetention(payload), retention.ensureMobilePushRetention(payload)]);
  const expiresAt = new Date("2027-01-04T05:00:00.000Z");
  assert.deepEqual(createIndex.mock.calls[1].arguments, [{ expiresAt: 1 }, { expireAfterSeconds: 0 }]);
  assert.equal(createIndex.mock.callCount(), 2);
  assert.deepEqual(updateMany.mock.calls[0].arguments, [{ expiresAt: { $ne: expiresAt } }, { $set: { expiresAt } }]);
  assert.equal(updateMany.mock.callCount(), 1);
});

test("the broadcast route sends a signed APNs alert, expires it at the cutoff, and skips Expo tokens", async t => {
  const now = t.mock.method(Date, "now", () => retention.MOBILE_PUSH_CUTOFF - 1000);
  const previous = process.env;
  process.env = { ...previous, ...environment, MOBILE_PUSH_ENABLED: "1" };
  t.after(() => { process.env = previous; });
  const id = "0123456789abcdef01234567";
  const inactiveToken = "2b".repeat(32);
  const refreshedToken = "3c".repeat(32);
  const updatedAt = new Date(Date.now() - 1000).toISOString();
  const refreshedAt = new Date(Date.now()).toISOString();
  const sends = [];
  const sentSessions = [];
  let authorize = true;
  const session = new EventEmitter();
  session.remoteSettings = { maxConcurrentStreams: 2 };
  session.destroy = t.mock.fn();
  session.request = headers => {
    const stream = new EventEmitter();
    stream.close = () => stream.emit("close");
    stream.setEncoding = () => undefined;
    stream.end = body => {
      sends.push({ headers, body });
      queueMicrotask(() => {
        if (!authorize) stream.emit("response", { ":status": 403 });
        else if (headers[":path"] === `/3/device/${token}`) stream.emit("response", { ":status": 200 });
        else {
          stream.emit("response", { ":status": 410 });
          stream.emit("data", JSON.stringify({ reason: "Unregistered", timestamp: Date.now() - 500 }));
        }
        stream.emit("end");
        stream.emit("close");
      });
    };
    return stream;
  };
  const sender = load("../lib/apns.ts", {
    "node:crypto": crypto,
    "node:http2": { ...http2, connect: (origin, options) => { sentSessions.push({ origin, options }); return session; } },
  });
  const remove = t.mock.fn(async () => ({ errors: [] }));
  const payload = {
    auth: async () => ({ user: {} }),
    find: async ({ collection }) => ({ docs: collection === slug ? [
      { id: "accepted", token, updatedAt }, { id: "legacy", token: legacyToken, updatedAt },
      { id: "inactive", token: inactiveToken, updatedAt }, { id: "refreshed", token: refreshedToken, updatedAt: refreshedAt },
    ] : [{ id }] }),
    create: async () => ({ id: "claim" }), delete: remove,
  };
  const route = load("../app/(payload)/api/admin/mobile-push/route.ts", {
    "@payload-config": {}, payload: { getPayload: async () => payload }, "@/lib/crm-access": { canAccessArea: () => true },
    "@/lib/apns": sender,
    "@/lib/mobile-push-retention": { ...retention, ensureMobilePushRetention: async () => undefined },
  });
  const request = () => new Request("https://example.invalid/api/admin/mobile-push", {
    method: "POST", headers: { origin: "https://example.invalid" }, body: JSON.stringify({ announcementId: id }),
  });

  const response = await route.POST(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { accepted: 1, rejected: 2, unconfirmed: 0 });
  assert.deepEqual(sentSessions, [{ origin: "https://api.push.apple.com", options: { minVersion: "TLSv1.2" } }]);
  const { headers, body } = sends[0];
  assert.equal(headers[":path"], `/3/device/${token}`);
  assert.equal(headers[":method"], "POST");
  assert.equal(headers["apns-topic"], environment.APNS_BUNDLE_ID);
  assert.equal(headers["apns-push-type"], "alert");
  assert.equal(headers["apns-expiration"], String(retention.MOBILE_PUSH_CUTOFF / 1000));
  assert.deepEqual(JSON.parse(body), {
    aps: { alert: { title: "Convention update", body: "Open the app for details." } },
    body: { kind: "conference-update", announcementId: id },
  });
  const [header, claims, signature] = headers.authorization.slice("bearer ".length).split(".");
  assert.deepEqual(JSON.parse(Buffer.from(header, "base64url")), { alg: "ES256", kid: environment.APNS_KEY_ID });
  assert.deepEqual(JSON.parse(Buffer.from(claims, "base64url")), { iss: environment.APNS_TEAM_ID, iat: Math.floor(Date.now() / 1000) });
  assert.ok(crypto.verify("sha256", Buffer.from(`${header}.${claims}`), { key: publicKey, dsaEncoding: "ieee-p1363" }, Buffer.from(signature, "base64url")));
  assert.equal(sends.length, 3);
  assert.ok(sends.every(sent => sent.headers.authorization === headers.authorization));
  assert.equal(session.destroy.mock.callCount(), 1);
  assert.deepEqual(remove.mock.calls[0].arguments[0].where, { or: [{ id: { equals: "inactive" }, updatedAt: { equals: updatedAt } }] });

  authorize = false;
  const unauthorized = await route.POST(request());
  assert.equal(unauthorized.status, 502);
  assert.match((await unauthorized.json()).error, /authorization/);
  assert.equal(sends.length, 4);
  assert.deepEqual(remove.mock.calls[1].arguments[0], {
    collection: "mobile-push-broadcasts", id: "claim", overrideAccess: true,
  });

  now.mock.mockImplementation(() => retention.MOBILE_PUSH_CUTOFF);
  assert.equal((await route.POST(request())).status, 410);
  assert.equal(sends.length, 4);
});
