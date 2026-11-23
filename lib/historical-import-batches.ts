import { createHash } from "node:crypto";
import { createLocalReq, type Payload, type TypedUser } from "payload";
import { isAdministrator } from "./crm-access";
import { applyHistoricalImport, parseHistoricalImport, planHistoricalImport, type HistoricalImportJournal, type HistoricalImportPlan } from "./historical-import";
import { ImportError } from "./registration-tracker";

export const historicalImportFormat = "historical_json";

const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const ownerId = (value: string | { id: string }) => typeof value === "string" ? value : value.id;
const transactionReceiptLimit = 20;
type BatchPreview = Pick<HistoricalImportPlan, "fingerprint" | "counts"> & {
  rows: { sourceKey: string; fingerprint: string }[];
};
type BatchJournal = HistoricalImportJournal & { selectionDigest: string; selected: number };

function addCounts(previous: HistoricalImportJournal["counts"] | undefined, next: HistoricalImportJournal["counts"]) {
  if (!previous) return next;
  return {
    ...next,
    receipts: previous.receipts + next.receipts,
    checkoutOrders: previous.checkoutOrders + next.checkoutOrders,
    cashTransactions: previous.cashTransactions + next.cashTransactions,
    registrations: previous.registrations + next.registrations,
    namedAttendees: previous.namedAttendees + next.namedAttendees,
    breakfasts: previous.breakfasts + next.breakfasts,
    scholarships: previous.scholarships + next.scholarships,
    merchandise: previous.merchandise + next.merchandise,
  };
}

export async function previewHistoricalImport(payload: Payload, user: TypedUser, bytes: Uint8Array, filename: string) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  const manifest = parseHistoricalImport(bytes);
  const active = await payload.count({
    collection: "registration-imports",
    overrideAccess: true,
    where: {
      createdBy: { equals: user.id },
      status: { equals: "preview" },
      expiresAt: { greater_than: new Date().toISOString() },
    },
  });
  if (active.totalDocs >= 100) throw new ImportError("Too many recent previews. Retry after an earlier preview expires.", 429);

  const plan = await planHistoricalImport(payload, manifest);
  const batch = await payload.create({
    collection: "registration-imports",
    overrideAccess: true,
    data: {
      filename: filename.replace(/[\r\n]/g, "").slice(0, 200),
      fileDigest: digest(bytes),
      format: historicalImportFormat,
      status: "preview",
      createdBy: user.id,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      preview: {
        fingerprint: plan.fingerprint,
        counts: plan.counts,
        rows: plan.rows.filter((row) => row.action === "new").map(({ sourceKey, fingerprint }) => ({ sourceKey, fingerprint })),
      },
    },
  });
  return { id: batch.id, format: historicalImportFormat, plan };
}

export async function confirmHistoricalImport(payload: Payload, user: TypedUser, bytes: Uint8Array, input: Record<string, unknown>) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  if (input.confirmPayment !== true || input.confirmAttendees !== true || input.confirmScope !== true) {
    throw new ImportError("Confirm current receipt status, attendee identities, and the selected historical purchases.");
  }
  if (typeof input.id !== "string" || !/^[a-f0-9]{24}$/i.test(input.id) ||
    !Array.isArray(input.sources) || !input.sources.length || input.sources.length > 5_000 ||
    input.sources.some((value) => typeof value !== "string" || !value || value.length > 250) ||
    new Set(input.sources).size !== input.sources.length) {
    throw new ImportError("Select valid payment sources from the preview.");
  }

  const manifest = parseHistoricalImport(bytes);
  const sources = (input.sources as string[]).toSorted();
  const selectionDigest = digest(Buffer.from(JSON.stringify(sources)));
  const req = await createLocalReq({ user }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new ImportError("Historical imports require a database replica set with transactions.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: true, depth: 0 } as const;
  try {
    const batch = await payload.findByID({ ...options, collection: "registration-imports", id: input.id, disableErrors: true });
    if (!batch || batch.format !== historicalImportFormat) throw new ImportError("Historical preview was not found.", 404);
    if (ownerId(batch.createdBy) !== user.id) throw new ImportError("Only the administrator who reviewed this preview can confirm it.", 403);
    const original = batch.preview as BatchPreview;
    if (digest(bytes) !== batch.fileDigest || input.fingerprint !== original.fingerprint) {
      throw new ImportError("The JSON file does not match the reviewed preview. Upload it again.", 409);
    }
    const previous = batch.result as unknown as BatchJournal | null;
    if (previous && previous.selectionDigest !== selectionDigest) {
      throw new ImportError("This batch already began with a different selection. Resume it with the original selection.", 409);
    }
    if (batch.status === "imported" && previous) {
      await payload.db.rollbackTransaction(transactionID);
      return { id: batch.id, counts: previous.counts, processed: previous.sources.length, selected: previous.selected, done: true };
    }
    if (!["preview", "in_progress"].includes(batch.status) || (batch.status === "preview" && Date.parse(batch.expiresAt) <= Date.now())) {
      throw new ImportError("The preview expired. Upload the JSON file again.", 409);
    }

    const reviewed = new Map(original.rows.map((row) => [row.sourceKey, row]));
    if (sources.some((source) => !reviewed.has(source))) throw new ImportError("Select only new payments from the reviewed preview.", 409);
    const processed = new Set(previous?.sources);
    const chunk = sources.filter((source) => !processed.has(source)).slice(0, transactionReceiptLimit);
    const part = await applyHistoricalImport(payload, manifest, {
      sources: chunk,
      req,
      expectedRows: chunk.map((source) => reviewed.get(source)!),
      batchID: batch.id,
    });
    const journal: BatchJournal = {
      selectionDigest,
      selected: sources.length,
      sources: [...(previous?.sources ?? []), ...part.sources],
      created: [...(previous?.created ?? []), ...part.created],
      counts: addCounts(previous?.counts, part.counts),
    };
    const done = journal.sources.length === sources.length;
    await payload.update({ ...options, collection: "registration-imports", id: batch.id, data: {
      status: done ? "imported" : "in_progress",
      confirmedAt: done ? new Date().toISOString() : undefined,
      result: { ...journal },
    } });
    await payload.db.commitTransaction(transactionID);
    return { id: batch.id, counts: journal.counts, processed: journal.sources.length, selected: sources.length, done };
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  }
}
