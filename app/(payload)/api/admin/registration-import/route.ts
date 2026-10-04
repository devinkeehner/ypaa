import config from "@payload-config";
import { getPayload } from "payload";
import { isAdministrator } from "@/lib/crm-access";
import { ImportError, confirmRegistrationImport, previewRegistrationImport, rollbackRegistrationImport } from "@/lib/registration-import";

export const runtime = "nodejs";
export const maxDuration = 300;
const response = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
async function context(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!isAdministrator(user)) throw new ImportError("Administrator access is required.", 403);
  return { payload, user };
}
async function boundedBody(request: Request, max: number) {
  const reader = request.body?.getReader();
  if (!reader) throw new ImportError("An upload or action is required.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read(); if (done) break;
    size += value.byteLength;
    if (size > max) { await reader.cancel(); throw new ImportError("Upload an .xlsx tracker of at most 2 MB.", 413); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}
export async function POST(request: Request) {
  try {
    const origin = process.env.REGISTRATION_IMPORT_ORIGIN || process.env.REGISTRATION_CHECK_ORIGIN || new URL(request.url).origin;
    if (request.headers.get("origin") !== origin) throw new ImportError("Same-origin requests are required.", 403);
    const { payload, user } = await context(request), type = request.headers.get("content-type") || "";
    if (type.startsWith("multipart/form-data")) {
      const bytes = await boundedBody(request, 2 * 1024 * 1024 + 64 * 1024);
      const form = await new Response(bytes, { headers: { "content-type": type } }).formData();
      const file = form.get("file");
      if (!(file instanceof File) || form.getAll("file").length !== 1) throw new ImportError("Select one complete tracker .xlsx file.");
      return response(await previewRegistrationImport(payload, user, new Uint8Array(await file.arrayBuffer()), file.name));
    }
    if (!type.startsWith("application/json")) throw new ImportError("Unsupported request format.", 415);
    let input: Record<string, unknown>;
    try { input = JSON.parse(new TextDecoder().decode(await boundedBody(request, 1024 * 1024))); }
    catch (error) { if (error instanceof ImportError) throw error; throw new ImportError("Invalid import action."); }
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new ImportError("Invalid import action.");
    if (input.action === "confirm") return response(await confirmRegistrationImport(payload, user, input));
    if (input.action === "rollback") return response(await rollbackRegistrationImport(payload, user, input));
    throw new ImportError("Choose preview, confirm, or rollback.");
  } catch (error) {
    if (error instanceof ImportError) return response({ error: error.message }, error.status);
    // Do not log tracker rows, attendee addresses, database documents or uploaded bytes.
    return response({ error: "The import action failed. Transactional registration changes were rolled back. Refresh the preview before retrying." }, 503);
  }
}
export async function GET(request: Request) {
  try {
    const { payload } = await context(request);
    const history = await payload.find({ collection: "registration-imports", overrideAccess: true, depth: 0, sort: "-createdAt", limit: 20, where: { status: { not_equals: "preview" } } });
    return response({ history: history.docs.map((d) => ({ id: d.id, filename: d.filename, status: d.status, confirmedAt: d.confirmedAt, rolledBackAt: d.rolledBackAt })) });
  } catch (error) { return response({ error: error instanceof ImportError ? error.message : "Import history is unavailable." }, error instanceof ImportError ? error.status : 503); }
}
