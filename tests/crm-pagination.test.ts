import assert from "node:assert/strict";
import test from "node:test";
import { fetchAllCRMRecords } from "../lib/crm-pagination";
import { canEditCRM, withViewerAccess } from "../lib/crm-access";

test("search loads records beyond 500, respecting the server's page size", async () => {
  const records = Array.from({ length: 1201 }, (_, id) => ({ id }));
  const fetcher = async (path: string | URL | Request) => {
    const page = Number(new URL(String(path), "http://localhost").searchParams.get("page"));
    const docs = records.slice((page - 1) * 200, page * 200);
    return Response.json({ docs, hasNextPage: page < 7, nextPage: page < 7 ? page + 1 : null });
  };
  assert.deepEqual(await fetchAllCRMRecords("/api/contacts?sort=id", fetcher as typeof fetch), records);
});
test("a failed later page never returns a misleading partial search", async () => {
  let calls = 0;
  await assert.rejects(fetchAllCRMRecords("/api/contacts", (async () => ++calls === 1 ? Response.json({ docs: [{ id: 1 }], hasNextPage: true, nextPage: 2 }) : new Response(null, { status: 500 })) as typeof fetch));
});
test("viewer write ceiling preserves existing administrator access rules", async () => {
  assert.equal(canEditCRM(null), false);
  assert.equal(canEditCRM({ role: "viewer" }), false);
  assert.equal(canEditCRM({ id: "existing-account" }), true);
  const collection = withViewerAccess({ slug: "contacts", fields: [], access: { delete: () => false, update: () => true } });
  assert.equal(await collection.access!.update!({ req: { user: { role: "viewer" } } } as never), false);
  assert.equal(await collection.access!.update!({ req: { user: { role: "admin" } } } as never), true);
  assert.equal(await collection.access!.delete!({ req: { user: { role: "admin" } } } as never), false);
});
