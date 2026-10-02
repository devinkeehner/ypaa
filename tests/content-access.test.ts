import assert from "node:assert/strict";
import test from "node:test";
import type { Access, FieldAccess } from "payload";
import { Users } from "../collections/Users";
import { RegistrationCorrections } from "../collections/RegistrationCorrections";
import { canAccessArea, canEditCRM, isAdministrator, withViewerAccess, withViewerGlobalAccess, type ContentArea } from "../lib/crm-access";

const areas: Record<ContentArea, string[]> = {
  merch: ["merchandise", "merchandise-orders"],
  program: ["program-sessions", "rooms", "venue-maps"],
  registration: ["contacts", "attendees", "registration-entitlements", "breakfast-tickets", "access-codes", "cash-transactions", "checkout-orders", "scholarship-contributions", "registration-corrections"],
};
const staff = (contentAreas: ContentArea[], accessLevel = "manage") => ({ id: "staff-1", role: "staff", contentAreas, accessLevel });
const args = (user: unknown) => ({ req: { user }, id: "target" }) as Parameters<Access>[0];
const collection = (slug: string) => withViewerAccess({ slug, fields: [], access: { read: () => true } });

for (const area of Object.keys(areas) as ContentArea[]) {
  test(`${area} managers can manage only their assigned collections, including version history`, async () => {
    for (const [target, slugs] of Object.entries(areas)) {
      for (const slug of slugs) {
        const policy = collection(slug).access!;
        for (const operation of ["read", "readVersions", "create", "update", "delete", "unlock"] as const) {
          assert.equal(await policy[operation]!(args(staff([area]))), target === area, `${area}: ${operation} ${slug}`);
        }
      }
    }
    for (const slug of ["pages", "posts", "tenants", "wordle-puzzles", "notification-recipients", "email-tests", "unassigned-future-collection"]) {
      const policy = collection(slug).access!;
      for (const operation of ["read", "readVersions", "create", "update", "delete"] as const) {
        assert.equal(await policy[operation]!(args(staff([area]))), false, `${operation} ${slug}`);
      }
    }
  });
  test(`${area} view-only staff cannot mutate assigned content`, async () => {
    for (const slug of areas[area]) {
      const policy = collection(slug).access!;
      assert.equal(await policy.read!(args(staff([area], "view"))), true);
      for (const operation of ["create", "update", "delete", "unlock"] as const) {
        assert.equal(await policy[operation]!(args(staff([area], "view"))), false);
      }
    }
  });
}

test("permissions are additive, default to no access, and unknown roles fail closed", () => {
  assert.equal(canAccessArea(staff(["merch", "program"]), "merch", true), true);
  assert.equal(canAccessArea(staff(["merch", "program"]), "program", true), true);
  assert.equal(canAccessArea(staff(["merch", "program"]), "registration"), false);
  for (const user of [null, staff([]), { role: "staff" }, { role: "unknown" }, []]) {
    for (const area of Object.keys(areas) as ContentArea[]) assert.equal(canAccessArea(user, area), false);
  }
  assert.equal(canAccessArea({ role: "staff", contentAreas: ["program"] }, "program", true), false);
  assert.equal(isAdministrator({ id: "key", collection: "payload-mcp-api-keys" }), false);
  assert.equal(canEditCRM(staff(["merch"])), false);
  assert.equal(canEditCRM(staff(["registration"], "view")), false);
  assert.equal(canEditCRM(staff(["registration"])), true);
});

test("existing admin, global viewer and merchandise sales viewer behavior is retained", async () => {
  assert.equal(isAdministrator({ id: "legacy-admin" }), true);
  assert.equal(isAdministrator({ id: "admin", role: "admin" }), true);
  for (const slug of Object.values(areas).flat()) {
    const policy = collection(slug).access!;
    assert.equal(await policy.read!(args({ role: "viewer" })), true);
    assert.equal(await policy.update!(args({ role: "viewer" })), false);
    assert.equal(await policy.read!(args({ role: "merch" })), slug === "merchandise-orders");
    assert.equal(await policy.update!(args({ role: "merch" })), false);
  }
});

test("restricted users can maintain only their own account and cannot change permission fields", async () => {
  const users = withViewerAccess(Users);
  for (const user of [staff(["registration"]), staff(["program"]), staff(["merch"]), { id: "viewer", role: "viewer" }]) {
    assert.equal(await users.access!.admin!({ req: args(user).req }), true);
    for (const operation of ["create", "delete", "unlock", "readVersions"] as const) assert.equal(await users.access![operation]!(args(user)), false);
    for (const operation of ["read", "update"] as const) assert.deepEqual(await users.access![operation]!(args(user)), { id: { equals: user.id } });
    for (const field of Users.fields) {
      if (!("name" in field) || !("access" in field) || !["role", "contentAreas", "accessLevel"].includes(field.name)) continue;
      for (const operation of ["create", "update"] as const) {
        const check = field.access![operation] as FieldAccess;
        assert.equal(await check(args(user) as Parameters<FieldAccess>[0]), false);
        assert.equal(await check(args({ id: "admin", role: "admin" }) as Parameters<FieldAccess>[0]), true);
      }
    }
  }
});

test("shared media allows uploads but prevents cross-team replacement and deletion", async () => {
  const media = collection("media").access!;
  const user = staff(["merch"]);
  assert.equal(await media.read!(args(user)), true);
  assert.equal(await media.create!(args(user)), true);
  for (const operation of ["update", "delete", "unlock"] as const) assert.equal(await media[operation]!(args(user)), false);
  assert.equal(await media.create!(args(staff(["program"], "view"))), false);
});

test("public reads and stricter collection rules survive the area restriction", async () => {
  const published = { _status: { equals: "published" } };
  const policy = withViewerAccess({ slug: "merchandise", fields: [], access: { read: () => published, delete: () => false } }).access!;
  assert.deepEqual(await policy.read!(args(null)), published);
  assert.deepEqual(await policy.read!(args(staff(["merch"]))), published);
  assert.equal(await policy.read!(args(staff(["program"]))), false);
  assert.equal(await policy.delete!(args(staff(["merch"]))), false);
  const audit = withViewerAccess(RegistrationCorrections).access!;
  for (const operation of ["create", "update", "delete"] as const) assert.equal(await audit[operation]!(args(staff(["registration"]))), false);
});

test("restricted staff cannot access website globals or their versions", async () => {
  const global = withViewerGlobalAccess({ slug: "header", fields: [], access: { read: () => true } });
  for (const user of [staff(["merch"]), staff(["program"]), staff(["registration"]), { role: "merch" }]) {
    for (const operation of ["read", "readVersions", "update"] as const) assert.equal(await global.access![operation]!(args(user)), false);
  }
  assert.equal(await global.access!.read!(args(null)), true);
  assert.equal(await global.access!.update!(args(null)), false);
});
