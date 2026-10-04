import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { parseTracker } from "../lib/registration-tracker";
import { planRegistrationImport } from "../lib/registration-import";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || uri.pathname !== "/ypaa_registration_test" || process.env.REGISTRATION_TEST_MAIL_CAPTURE !== "true") throw new Error("Use the isolated local-registration dry-run runner.");
const path = process.argv[2]; if (!path) throw new Error("Provide a read-only tracker file path.");
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
const resolved = await config; resolved.onInit = async () => {};
const payload = await getPayload({ config: resolved });
try {
  if ((await payload.db.connection.db!.collection("_synthetic_test_marker").findOne({ _id: "registration" as never }))?.synthetic !== true) throw new Error("Missing synthetic test database marker.");
  const plan = await planRegistrationImport(payload, parseTracker(await readFile(path)));
  console.log(JSON.stringify({ file: basename(path), mode: "read-only; no preview audit or CRM records created; synthetic existing records only", sourceRows: plan.rows.reduce((n, r) => n + r.sourceRows.length, 0), sources: plan.rows.length, sourceTypes: plan.rows.reduce<Record<string, number>>((a, r) => { a[r.source] = (a[r.source] || 0) + 1; return a; }, {}), ...plan.counts, conflictsByReason: plan.rows.filter((r) => r.action === "conflict").reduce<Record<string, number>>((a, r) => { a[r.reason] = (a[r.reason] || 0) + 1; return a; }, {}), excludedBySheet: plan.excluded.reduce<Record<string, number>>((a, r) => { a[r.sheet] = (a[r.sheet] || 0) + 1; return a; }, {}) }, null, 2));
} finally { await payload.destroy(); }
process.exit(0);
