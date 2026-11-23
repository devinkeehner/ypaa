import { open, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";
import { buildHistoricalImport, HistoricalInputError, HISTORICAL_IMPORT_MAX_BYTES, summarizeHistoricalImport } from "../lib/historical-import-input";
import { ImportError } from "../lib/registration-tracker";

async function sourceBytes(path: string) {
  const file = await open(path, "r");
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.size <= 0 || stat.size > HISTORICAL_IMPORT_MAX_BYTES) throw new HistoricalInputError("Each source file must be a regular file of at most 2 MB.");
    const bytes = Buffer.alloc(stat.size + 1);
    let offset = 0;
    while (offset < bytes.length) {
      const { bytesRead } = await file.read(bytes, offset, bytes.length - offset, offset);
      if (!bytesRead) break;
      offset += bytesRead;
    }
    if (offset !== stat.size) throw new HistoricalInputError("A source file changed while it was being read.");
    return bytes.subarray(0, offset);
  } finally {
    await file.close();
  }
}

async function main() {
  const { values } = parseArgs({ options: { tracker: { type: "string" }, stripe: { type: "string" }, output: { type: "string" } } });
  if (!values.tracker || !values.stripe) throw new HistoricalInputError("Usage: npm run historical:build -- --tracker tracker.xlsx --stripe unified_payments.csv [--output historical-import.json]");
  const [tracker, stripe] = await Promise.all([sourceBytes(values.tracker), sourceBytes(values.stripe)]);
  const manifest = buildHistoricalImport(tracker, stripe);
  if (values.output) await writeFile(values.output, JSON.stringify(manifest), { flag: "wx", mode: 0o600 });
  console.log(JSON.stringify({ ...summarizeHistoricalImport(manifest), wroteJson: Boolean(values.output) }, null, 2));
}

main().catch((error: unknown) => {
  console.error(error instanceof HistoricalInputError || error instanceof ImportError ? error.message : "The historical import builder could not read its inputs or write the requested output.");
  process.exitCode = 1;
});
