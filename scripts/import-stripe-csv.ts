import { importNormalizedPayments, readAndNormalizeCsv } from "@/lib/stripe-csv-import";

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const input = argument("--input");
const dryRun = process.argv.includes("--dry-run");
const apply = process.argv.includes("--apply");

if (!input || dryRun === apply) {
  console.error("Usage: npm run stripe:import -- --input <csv> --dry-run|--apply");
  process.exit(1);
}

const normalized = await readAndNormalizeCsv(input);
let payload;
if (apply) {
  process.loadEnvFile?.(".env.local");
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
  payload = await getPayload({ config });
}
const summary = await importNormalizedPayments(payload!, normalized.normalized, normalized.excludedRows, normalized.sourceRows, dryRun);

console.log(JSON.stringify(summary, null, 2));
if (dryRun) console.log("Dry run complete. No Payload records were changed.");
else console.log("Import complete. Dry-run only previews CSV normalization; use the CRM integrity tests and database reconciliation to verify reimports.");

if (payload) await payload.db.destroy();
