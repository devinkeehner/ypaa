import { createHash } from "node:crypto";
import { createLocalReq, type Payload, type TypedUser } from "payload";
import { applyBreakfastRepair, planBreakfastRepair, type BreakfastRepairJournal } from "./breakfast-repair";
import { BREAKFAST_REPAIR_FORMAT as format, BREAKFAST_REPAIR_MAX_RECEIPTS, parseBreakfastRepair } from "./breakfast-repair-input";
import { isAdministrator } from "./crm-access";
import { ImportError } from "./registration-tracker";

const digest = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const fileBytes = (input: Record<string, unknown>) => {
  if (typeof input.fileText !== "string" || !input.fileText.trim()) throw new ImportError("Provide a breakfast repair JSON file.");
  return new TextEncoder().encode(input.fileText);
};

export async function previewBreakfastRepair(payload: Payload, user: TypedUser, input: Record<string, unknown>) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  const bytes = fileBytes(input);
  const manifest = parseBreakfastRepair(bytes);
  const active = await payload.count({ collection: "registration-imports", overrideAccess: true, where: {
    createdBy: { equals: user.id }, status: { equals: "preview" }, expiresAt: { greater_than: new Date().toISOString() },
  } });
  if (active.totalDocs >= 100) throw new ImportError("Too many recent previews. Retry after an earlier preview expires.", 429);
  const plan = await planBreakfastRepair(payload, manifest);
  const batch = await payload.create({ collection: "registration-imports", overrideAccess: true, data: {
    filename: typeof input.filename === "string" ? input.filename.replace(/[\x00-\x1f\x7f]/g, "").slice(0, 200) || "Breakfast ticket repair" : "Breakfast ticket repair",
    fileDigest: digest(bytes), format, status: "preview", createdBy: user.id,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    preview: { fingerprint: plan.fingerprint, counts: plan.counts, missingByDay: plan.missingByDay },
  } });
  return { id: batch.id, plan };
}

export async function confirmBreakfastRepair(payload: Payload, user: TypedUser, input: Record<string, unknown>) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  if (input.confirmPayment !== true || input.confirmScope !== true) throw new ImportError("Verify the Stripe payments and confirm the breakfast-only quantities.");
  if (typeof input.id !== "string" || !/^[a-f0-9]{24}$/i.test(input.id) ||
    typeof input.fingerprint !== "string" || !/^[a-f0-9]{64}$/i.test(input.fingerprint) ||
    !Array.isArray(input.sources) || !input.sources.length || input.sources.length > BREAKFAST_REPAIR_MAX_RECEIPTS ||
    input.sources.some((source) => typeof source !== "string") || new Set(input.sources).size !== input.sources.length) {
    throw new ImportError("Select eligible receipts from the reviewed breakfast repair.");
  }
  const bytes = fileBytes(input);
  const manifest = parseBreakfastRepair(bytes);
  const sources = (input.sources as string[]).toSorted();
  const selectionDigest = digest(new TextEncoder().encode(JSON.stringify(sources)));
  const req = await createLocalReq({ user }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new ImportError("Breakfast repair requires a database replica set with transactions.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: true, depth: 0 } as const;
  try {
    const batch = await payload.findByID({ ...options, collection: "registration-imports", id: input.id, disableErrors: true });
    if (!batch || batch.format !== format) throw new ImportError("Breakfast repair preview was not found.", 404);
    const createdBy = typeof batch.createdBy === "string" ? batch.createdBy : batch.createdBy.id;
    if (createdBy !== user.id) throw new ImportError("Only the administrator who reviewed this preview can confirm it.", 403);
    const expected = batch.preview as { fingerprint: string };
    if (batch.fileDigest !== digest(bytes) || expected.fingerprint !== input.fingerprint) throw new ImportError("The selected file does not match this repair preview.", 409);
    if (batch.status === "imported" && batch.result) {
      const journal = batch.result as BreakfastRepairJournal & { selectionDigest: string };
      if (journal.selectionDigest !== selectionDigest) throw new ImportError("This batch has already been applied with another selection.", 409);
      await payload.db.rollbackTransaction(transactionID);
      return { id: batch.id, counts: journal.counts, createdByDay: journal.createdByDay };
    }
    if (batch.status !== "preview" || Date.parse(batch.expiresAt) <= Date.now()) throw new ImportError("The repair preview expired. Run another preview.", 409);
    const journal = await applyBreakfastRepair(payload, manifest, { sources, req, expectedFingerprint: expected.fingerprint, batchID: batch.id });
    await payload.update({ ...options, collection: "registration-imports", id: batch.id, data: {
      status: "imported", confirmedAt: new Date().toISOString(), result: { ...journal, selectionDigest },
    } });
    await payload.db.commitTransaction(transactionID);
    return { id: batch.id, counts: journal.counts, createdByDay: journal.createdByDay };
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  }
}
