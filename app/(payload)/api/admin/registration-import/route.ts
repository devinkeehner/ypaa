import config from "@payload-config";
import { getPayload } from "payload";
import { isAdministrator } from "@/lib/crm-access";
import { ImportError, confirmRegistrationImport, previewRegistrationImport, rollbackRegistrationImport } from "@/lib/registration-import";
import { confirmHistoricalImport, previewHistoricalImport } from "@/lib/historical-import-batches";
import { confirmBreakfastRepair, previewBreakfastRepair } from "@/lib/breakfast-repair-batches";
import { confirmScholarshipRepair, previewScholarshipRepair } from "@/lib/scholarship-repair-batches";
import { HistoricalInputError } from "@/lib/historical-import-input";

export const runtime = "nodejs";
export const maxDuration = 300;
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const uploadLimit = 2 * 1024 * 1024;
const actionLimit = 512 * 1024;
async function context(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user || !isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  return { payload, user };
}
async function boundedBody(request: Request, max: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new ImportError("An upload or action is required.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); throw new ImportError("The import request is too large. Upload a file of at most 2 MB.", 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}
function parseAction(value: string) {
  let input: unknown;
  try { input = JSON.parse(value); } catch { throw new ImportError("Invalid import action."); }
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new ImportError("Invalid import action.");
  return input as Record<string, unknown>;
}
export async function POST(request: Request) {
  try {
    const origin = process.env.REGISTRATION_IMPORT_ORIGIN || process.env.REGISTRATION_CHECK_ORIGIN || new URL(request.url).origin;
    if (request.headers.get("origin") !== origin) throw new ImportError("Same-origin requests are required.", 403);
    const { payload, user } = await context(request), type = request.headers.get("content-type") || "";
    if (type.startsWith("multipart/form-data")) {
      const bytes = await boundedBody(request, uploadLimit + actionLimit + 64 * 1024);
      const form = await new Response(bytes, { headers: { "content-type": type } }).formData().catch(() => { throw new ImportError("Invalid file upload."); });
      const file = form.get("file");
      if (!(file instanceof File) || form.getAll("file").length !== 1) throw new ImportError("Select one tracker .xlsx or historical import .json file.");
      if (file.size > uploadLimit) throw new ImportError("Upload a file of at most 2 MB.", 413);
      const fileBytes = new Uint8Array(await file.arrayBuffer());
      if (/\.json$/i.test(file.name)) {
        const selection = form.get("confirmation");
        if (selection === null) return response(await previewHistoricalImport(payload, user, fileBytes, file.name));
        if (typeof selection !== "string" || selection.length > actionLimit || form.getAll("confirmation").length !== 1) throw new ImportError("Invalid historical import confirmation.");
        return response(await confirmHistoricalImport(payload, user, fileBytes, parseAction(selection)));
      }
      if (form.has("confirmation")) throw new ImportError("Confirm a historical import with its original JSON file.");
      return response({ ...await previewRegistrationImport(payload, user, fileBytes, file.name), format: "tracker_xlsx" });
    }
    if (!type.startsWith("application/json")) throw new ImportError("Unsupported request format.", 415);
    const input = parseAction(new TextDecoder().decode(await boundedBody(request, 1024 * 1024)));
    if (input.action === "confirm") return response(await confirmRegistrationImport(payload, user, input));
    if (input.action === "rollback") return response(await rollbackRegistrationImport(payload, user, input));
    if (input.action === "previewBreakfastRepair") return response(await previewBreakfastRepair(payload, user, input));
    if (input.action === "confirmBreakfastRepair") return response(await confirmBreakfastRepair(payload, user, input));
    if (input.action === "previewScholarshipRepair") return response(await previewScholarshipRepair(payload, user, input));
    if (input.action === "confirmScholarshipRepair") return response(await confirmScholarshipRepair(payload, user, input));
    throw new ImportError("Choose preview, confirm, or rollback.");
  } catch (error) {
    if (error instanceof ImportError || error instanceof HistoricalInputError) return response({ error: error.message }, error.status);
    // Do not log tracker rows, attendee addresses, database documents or uploaded bytes.
    return response({ error: "The current import transaction failed. Check Recent imports for progress and retry the same selection." }, 503);
  }
}
export async function GET(request: Request) {
  try {
    const { payload } = await context(request);
    const history = await payload.find({ collection: "registration-imports", overrideAccess: true, depth: 0, sort: "-createdAt", limit: 20, where: { status: { not_equals: "preview" } } });
    return response({ history: history.docs.map((d) => {
      const result = d.result && typeof d.result === "object" ? d.result as Record<string, unknown> : null;
      let progress;
      if (d.format === "historical_json" && result && Array.isArray(result.sources) && typeof result.selected === "number") {
        progress = `${result.sources.length} of ${result.selected} payments`;
      } else if (d.format === "breakfast_repair" && result?.counts && typeof result.counts === "object" &&
        "breakfasts" in result.counts && typeof result.counts.breakfasts === "number") {
        progress = `${result.counts.breakfasts} breakfast tickets added`;
      } else if (d.format === "scholarship_repair" && result?.counts && typeof result.counts === "object" &&
        "contributions" in result.counts && typeof result.counts.contributions === "number") {
        progress = `${result.counts.contributions} scholarship contributions added`;
      }
      return { id: d.id, filename: d.filename, format: d.format || "tracker_xlsx", status: d.status, progress, confirmedAt: d.confirmedAt, rolledBackAt: d.rolledBackAt };
    }) });
  } catch (error) { return response({ error: error instanceof ImportError ? error.message : "Import history is unavailable." }, error instanceof ImportError ? error.status : 503); }
}
