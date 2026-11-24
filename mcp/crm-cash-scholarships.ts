import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { z } from "zod/v3";
import { reconcileCashScholarships } from "../lib/cash-scholarship-reconcile";

type Tools = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>;
const cents = z.number().int().min(1).max(10_000_000);
const input = z.strictObject({
  checkouts: z.array(z.strictObject({
    checkoutOrderId: z.string().regex(/^[a-f0-9]{24}$/i),
    expectedUpdatedAt: z.string().datetime({ offset: true }),
    expectedPrincipalCents: cents,
    expectedSeatPriceCents: cents,
    expectedAllocatedCents: z.number().int().min(0).max(10_000_000).optional(),
    verifiedLegacyReceipt: z.strictObject({ receiptReference: z.string().regex(/^[a-z0-9_-]{1,120}$/i) }).optional(),
  })).min(1).max(10),
  confirm: z.boolean().optional(),
});

export const recordCashScholarshipContributionsTool: Tools[number] = {
  name: "record-cash-scholarship-contributions",
  description: "Preview or add missing fund entries for up to ten existing recorded cash scholarship checkouts. Confirm with the previewed allocation amount for each checkout. Requires an administrator and this key’s dedicated scope.",
  parameters: input.shape as unknown as Tools[number]["parameters"],
  async handler(args, req) {
    const { checkouts, confirm } = input.parse(args);
    const result = await reconcileCashScholarships(req, checkouts, confirm === true);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  },
};
