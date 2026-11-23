import { createHash } from "node:crypto";
import { createLocalReq, type Payload, type TypedUser } from "payload";
import { isAdministrator } from "./crm-access";
import { ImportError } from "./registration-tracker";
import { applyScholarshipRepair, planScholarshipRepair } from "./scholarship-repair";
import { parseScholarshipRepair, SCHOLARSHIP_REPAIR_FORMAT as format, SCHOLARSHIP_REPAIR_MAX_RECEIPTS } from "./scholarship-repair-input";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");

function repairFile(input: Record<string, unknown>) {
  if (typeof input.fileText !== "string" || !input.fileText.trim()) throw new ImportError("Provide a scholarship repair JSON file.");
  return {
    manifest: parseScholarshipRepair(new TextEncoder().encode(input.fileText)),
    fileDigest: digest(input.fileText),
  };
}

export async function previewScholarshipRepair(payload: Payload, user: TypedUser, input: Record<string, unknown>) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  const { manifest, fileDigest } = repairFile(input);
  const { totalDocs } = await payload.count({ collection: "registration-imports", overrideAccess: true, where: {
    createdBy: { equals: user.id }, status: { equals: "preview" }, expiresAt: { greater_than: new Date().toISOString() },
  } });
  if (totalDocs >= 100) throw new ImportError("Too many recent previews. Retry after an earlier preview expires.", 429);
  const plan = await planScholarshipRepair(payload, manifest);
  const filename = typeof input.filename === "string" ? input.filename.replace(/[\x00-\x1f\x7f]/g, "").slice(0, 200).trim() : "";
  const batch = await payload.create({ collection: "registration-imports", overrideAccess: true, data: {
    filename: filename || "Scholarship contribution repair", fileDigest, format, status: "preview", createdBy: user.id,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    preview: { fingerprint: plan.fingerprint, counts: plan.counts },
  } });
  return { id: batch.id, plan };
}

export async function confirmScholarshipRepair(payload: Payload, user: TypedUser, input: Record<string, unknown>) {
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  if (input.confirmPayment !== true || input.confirmScope !== true) throw new ImportError("Verify the payments and confirm the scholarship contributions.");
  if (typeof input.id !== "string" || !/^[a-f0-9]{24}$/i.test(input.id) ||
    typeof input.fingerprint !== "string" || !/^[a-f0-9]{64}$/i.test(input.fingerprint) ||
    !Array.isArray(input.sources) || !input.sources.length || input.sources.length > SCHOLARSHIP_REPAIR_MAX_RECEIPTS ||
    input.sources.some((source) => typeof source !== "string") || new Set(input.sources).size !== input.sources.length) {
    throw new ImportError("Select eligible receipts from the reviewed scholarship repair.");
  }
  const { manifest, fileDigest } = repairFile(input);
  const sources = (input.sources as string[]).toSorted();
  const selectionDigest = digest(JSON.stringify(sources));
  const req = await createLocalReq({ user }, payload);
  const transactionID = await payload.db.beginTransaction();
  if (transactionID == null) throw new ImportError("Scholarship repair requires a database replica set with transactions.", 503);
  req.transactionID = transactionID;
  const options = { req, overrideAccess: true, depth: 0 } as const;
  try {
    const batch = await payload.findByID({ ...options, collection: "registration-imports", id: input.id, disableErrors: true });
    if (!batch || batch.format !== format) throw new ImportError("Scholarship repair preview was not found.", 404);
    const createdBy = typeof batch.createdBy === "string" ? batch.createdBy : batch.createdBy.id;
    if (createdBy !== user.id) throw new ImportError("Only the administrator who reviewed this preview can confirm it.", 403);
    const expected = batch.preview as { fingerprint: string };
    if (batch.fileDigest !== fileDigest || expected.fingerprint !== input.fingerprint) throw new ImportError("The selected file does not match this repair preview.", 409);
    if (batch.status === "imported" && batch.result) {
      const journal = batch.result as Awaited<ReturnType<typeof applyScholarshipRepair>> & { selectionDigest: string };
      if (journal.selectionDigest !== selectionDigest) throw new ImportError("This batch has already been applied with another selection.", 409);
      await payload.db.rollbackTransaction(transactionID);
      return { id: batch.id, counts: journal.counts };
    }
    if (batch.status !== "preview" || Date.parse(batch.expiresAt) <= Date.now()) throw new ImportError("The repair preview expired. Run another preview.", 409);
    const journal = await applyScholarshipRepair(payload, manifest, { sources, req, expectedFingerprint: expected.fingerprint, batchID: batch.id });
    await payload.update({ ...options, collection: "registration-imports", id: batch.id, data: {
      status: "imported", confirmedAt: new Date().toISOString(), result: { ...journal, selectionDigest },
    } });
    await payload.db.commitTransaction(transactionID);
    return { id: batch.id, counts: journal.counts };
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  }
}
