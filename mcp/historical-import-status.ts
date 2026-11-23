import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { isAdministrator } from "../lib/crm-access";

const countFields = ["new", "matched", "skipped", "conflicts", "registrations", "namedAttendees", "breakfasts", "scholarships", "merchandise", "review", "payments", "receipts", "checkoutOrders", "cashTransactions", "expectedTickets", "missingTickets", "contributions", "principalCents", "allocatedCents"];

function summary(value: unknown) {
  if (!value || typeof value !== "object" || !("counts" in value) || !value.counts || typeof value.counts !== "object") return {};
  const counts = value.counts as Record<string, unknown>;
  return Object.fromEntries(countFields.filter((key) => typeof counts[key] === "number").map((key) => [key, counts[key]]));
}

export const historicalImportStatusTool: NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>[number] = {
  name: "historical-import-status",
  description: "Read the ten latest NECYPAA historical import and repair batches, with batch IDs, status, dates and aggregate counts.",
  parameters: {},
  async handler(_args, req) {
    if (!isAdministrator(req.user)) throw new Error("Administrator access is required.");
    const { docs } = await req.payload.find({
      collection: "registration-imports",
      req,
      overrideAccess: false,
      depth: 0,
      sort: "-createdAt",
      limit: 10,
      where: { format: { in: ["historical_json", "breakfast_repair", "scholarship_repair"] } },
      select: { format: true, status: true, createdAt: true, expiresAt: true, confirmedAt: true, preview: true, result: true },
    });
    return { content: [{ type: "text", text: JSON.stringify(docs.map((batch) => ({
      id: batch.id,
      format: batch.format,
      status: batch.status === "preview" && Date.parse(batch.expiresAt) <= Date.now() ? "expired" : batch.status,
      createdAt: batch.createdAt,
      confirmedAt: batch.confirmedAt,
      selectedPayments: batch.result && typeof batch.result === "object" && "selected" in batch.result && typeof batch.result.selected === "number" ? batch.result.selected : undefined,
      previewCounts: summary(batch.preview),
      importedCounts: summary(batch.result),
    }))) }] };
  },
};
