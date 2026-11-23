import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import type { PayloadRequest, Where } from "payload";
import { z } from "zod/v3";
import { derivePurchaseDetails, type PurchaseDetails } from "../lib/checkout-order-details";
import { canAccessArea, canReadCollection, isAdministrator, isMerchChair, isRestrictedStaff } from "../lib/crm-access";

const collections = [
  "attendees", "contacts", "checkout-orders", "cash-transactions", "breakfast-tickets",
  "registration-entitlements", "scholarship-contributions", "merchandise-orders", "historical-receipts",
] as const;
const collectionSchema = z.enum(collections);
type Collection = z.infer<typeof collectionSchema>;

const matchBySchema = z.enum([
  "record-id", "source-key", "stripe-reference", "receipt-reference", "ticket-code",
  "email", "name", "checkout-order-id", "attendee-id", "contact-id",
]);
type MatchBy = z.infer<typeof matchBySchema>;

const recordId = z.string().trim().regex(/^[a-f0-9]{24}$/i, "Expected a Payload record ID.");
const findParameters = z.object({
  collection: collectionSchema,
  matchBy: matchBySchema,
  value: z.string().trim().min(1).max(254),
  limit: z.number().int().min(1).max(10).optional(),
});
const examineParameters = z.object({ collection: collectionSchema, id: recordId });

type ReadDefinition = {
  search: Partial<Record<MatchBy, string[]>>;
  summary: string[];
  details?: string[];
  privateDetails?: string[];
};
const stripeFields = ["stripeChargeId", "stripePaymentIntentId", "stripeCheckoutSessionId"];
const affiliation = ["fellowships", "fellowshipOther", "homegroup", "committee", "homegroupCommittee"];

const definitions: Record<Collection, ReadDefinition> = {
  attendees: {
    search: {
      email: ["attendeeEmail"], name: ["attendeeName"], "source-key": ["sourceKey"],
      "stripe-reference": stripeFields, "checkout-order-id": ["checkoutOrder"], "contact-id": ["contact"],
    },
    summary: ["attendeeName", "attendeeEmail", "attendanceStatus", "paymentStatus", "sourceKey", "checkoutOrder", "contact"],
    details: [
      "state", "attendanceBasis", "paymentSource", "purchasedAt", "registrationPriceCents",
      "registrationSource", "entitlement", "cashTransaction", "dataOrigin", "historicalSource",
    ],
    privateDetails: [
      ...affiliation, "accommodations", "interpretationNeeded", "mobilityAccessibility", "willingToServe",
      "interpretationNeededAnswer", "mobilityAccessibilityAnswer", "willingToServeAnswer",
    ],
  },
  contacts: {
    search: { email: ["email"], name: ["displayName"], "source-key": ["contactKey"] },
    summary: ["displayName", "email", "state", "tags"],
    details: ["contactKey", "communicationConsent"],
    privateDetails: [...affiliation, "phone"],
  },
  "checkout-orders": {
    search: {
      email: ["purchaserEmail"], name: ["purchaserName"], "source-key": ["sourceKey"],
      "stripe-reference": [...stripeFields, "stripePaymentId", "sourceKey"], "contact-id": ["purchaserContact"],
    },
    summary: ["sourceKey", "purchaserName", "purchasedAt", "paymentSource", "paymentStatus", "totalCents", "currency"],
    details: [
      "purchaserEmail", "purchaserContact", ...stripeFields, "stripePaymentId", "subtotalCents", "processingFeeCents",
      "stripeFeeCents", "netDepositedCents", "shippingCents", "registrationDiscountCents", "unallocatedCents",
      "reportingCategory", "purchaseLines", "historicalSource", "dataOrigin",
    ],
  },
  "cash-transactions": {
    search: {
      email: ["purchaserEmail"], name: ["purchaserName"], "source-key": ["sourceKey"],
      "receipt-reference": ["cashReference"], "checkout-order-id": ["checkoutOrder"],
    },
    summary: ["sourceKey", "cashReference", "purchaserName", "recordedValueCents", "status", "purchasedAt", "checkoutOrder"],
    details: ["purchaserEmail", "historicalSource"],
  },
  "breakfast-tickets": {
    search: {
      email: ["purchaserEmail"], name: ["purchaserName"], "source-key": ["sourceKey"], "ticket-code": ["ticketCode"],
      "stripe-reference": stripeFields, "checkout-order-id": ["checkoutOrder"], "attendee-id": ["attendee"],
      "contact-id": ["holderContact"],
    },
    summary: ["sourceKey", "breakfastDay", "status", "paymentStatus", "checkoutOrder", "attendee", "holderContact"],
    details: [
      "ticketCode", "unitPriceCents", "purchaserName", "purchaserEmail", "paymentSource", "purchasedAt",
      "cashTransaction", "historicalSource", ...stripeFields,
    ],
  },
  "registration-entitlements": {
    search: {
      "source-key": ["sourceKey"], "checkout-order-id": ["checkoutOrder"],
      "attendee-id": ["registration"], "contact-id": ["attendeeContact", "purchaserContact"],
    },
    summary: ["sourceKey", "entitlementType", "status", "checkoutOrder", "registration", "attendeeContact"],
    details: ["purchaserContact", "assignedAt", "fundingSource", "fundingContributions"],
  },
  "scholarship-contributions": {
    search: {
      "source-key": ["sourceKey"], "checkout-order-id": ["checkoutOrder"],
      "contact-id": ["contributorContact", "specificRecipientContact"],
    },
    summary: ["sourceKey", "checkoutOrder", "contributionType", "amountCents", "availableCents", "status", "purchasedAt"],
    details: ["allocatedCents", "seatPriceCents", "specificRecipientContact", "fundedEntitlements", "historicalReceipt", "historicalSource"],
  },
  "merchandise-orders": {
    search: { name: ["purchaserName"], "source-key": ["sourceKey"], "stripe-reference": ["sourceKey"] },
    summary: ["purchaserName", "paymentSource", "fulfillmentMethod", "merchandiseSubtotalCents", "shippingCents", "status"],
    details: ["sourceKey", "shippingStatus"],
  },
  "historical-receipts": {
    search: {
      email: ["purchaserEmail"], name: ["purchaserName"], "source-key": ["sourceKey"],
      "stripe-reference": ["paymentAliases"], "receipt-reference": ["receiptReference"], "checkout-order-id": ["checkoutOrder"],
    },
    summary: ["sourceKey", "receiptReference", "checkoutOrder", "paymentSource", "paymentStatus", "purchasedAt", "currency", "grossCents"],
    details: [
      "purchaserName", "purchaserEmail", "paymentMethod", "stripeFeeCents", "netDepositedCents", "shippingCents",
      "registrationDiscountCents", "unallocatedCents", "checkoutFeeCents", "cashTransaction", "historicalSource", "purchaseLines",
    ],
  },
};

function requireAccess(req: PayloadRequest, collection: Collection) {
  if (!req.user?.id || !canReadCollection(req.user, collection)) throw new Error("This account cannot read that CRM collection.");
}

function findWhere({ collection, matchBy, value }: z.infer<typeof findParameters>, req: PayloadRequest): Where {
  if (matchBy === "record-id") return { id: { equals: readId(value) } };
  const fields = definitions[collection].search[matchBy];
  if (!fields || (collection === "merchandise-orders" && isMerchChair(req.user) && matchBy !== "name")) {
    throw new Error("This exact lookup is unavailable for that collection. Use a Payload record ID or another supported match field.");
  }
  if (matchBy === "email") {
    const result = z.string().email().safeParse(value);
    if (!result.success) throw new Error("Provide a complete email address.");
    value = result.data.toLowerCase();
  }
  if (matchBy === "checkout-order-id" || matchBy === "attendee-id" || matchBy === "contact-id") value = readId(value);
  if (matchBy === "stripe-reference") {
    if (!/^(?:ch|py|pi|cs)_[A-Za-z0-9_]+$/.test(value)) throw new Error("Provide a complete Stripe charge, payment, PaymentIntent, or Checkout Session reference.");
    return { or: fields.map((field): Where => {
      if (field === "sourceKey") return { sourceKey: { in: [`stripe:${value}`, `stripe:csv:${value}`] } };
      if (field === "paymentAliases") return { paymentAliases: { equals: `stripe:${value}` } };
      return { [field]: { equals: value } };
    }) };
  }
  return { or: fields.map((field) => ({ [field]: { equals: value } })) };
}

function readId(value: string) {
  const result = recordId.safeParse(value);
  if (!result.success) throw new Error("Provide a valid Payload record ID.");
  return result.data;
}

const selectFields = (fields: string[]) => Object.fromEntries(fields.map((field) => [field, true as const]));
const project = (entry: object, fields: string[]) => Object.fromEntries(
  fields.filter((field) => Object.hasOwn(entry, field)).map((field) => [field, (entry as Record<string, unknown>)[field]]),
);
const output = (data: object) => ({ content: [{ type: "text" as const, text: JSON.stringify(data) }] });

type MCPTool = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>[number];

export const crmReadTools: MCPTool[] = [
  {
    name: "find-crm-entries",
    description: "Find up to ten NECYPAA CRM records by one exact value. Return record IDs and summary fields. Use a record ID, source key, Stripe or receipt reference, ticket code, email, name, or a related checkout, attendee or contact ID when supported by the selected collection.",
    // The plugin installs its own copy of Zod 3.
    parameters: findParameters.shape as unknown as MCPTool["parameters"],
    async handler(args, req) {
      const input = findParameters.safeParse(args);
      if (!input.success) throw new Error("Choose a CRM collection, exact match field and value, with an optional limit from 1 to 10.");
      const { collection, limit = 10 } = input.data;
      requireAccess(req, collection);
      const fields = ["id", "updatedAt", ...definitions[collection].summary];
      const where = findWhere(input.data, req);
      const { docs } = await req.payload.find({
        collection, req, overrideAccess: false, depth: 0,
        where, limit: limit + 1, pagination: false, select: selectFields(fields),
      });
      return output({ collection, matches: docs.slice(0, limit).map((entry) => project(entry, fields)), hasMore: docs.length > limit });
    },
  },
  {
    name: "examine-crm-entry",
    description: "Examine one NECYPAA CRM entry by exact Payload record ID. For authorized registration staff and administrators, an attendee record includes the recorded accessibility and fellowship fields.",
    parameters: examineParameters.shape as unknown as MCPTool["parameters"],
    async handler(args, req) {
      const input = examineParameters.safeParse(args);
      if (!input.success) throw new Error("Choose a CRM collection and provide an exact Payload record ID.");
      const { collection, id } = input.data;
      requireAccess(req, collection);
      const definition = definitions[collection];
      const privateAccess = isAdministrator(req.user) || (isRestrictedStaff(req.user) && canAccessArea(req.user, "registration"));
      const fields = [
        "id", "updatedAt", ...definition.summary, ...(definition.details ?? []),
        ...(privateAccess ? definition.privateDetails ?? [] : []),
      ];
      const selected = collection === "checkout-orders" ? [...fields, "purchaseDetails"]
        : collection === "merchandise-orders" ? [...fields, "items"] : fields;
      const entry = await req.payload.findByID({
        collection, id, req, overrideAccess: false, depth: 0, disableErrors: true,
        select: selectFields(selected),
      });
      if (!entry) return output({ collection, entry: null });
      const record = project(entry, fields);
      if (collection === "merchandise-orders") record.items = derivePurchaseDetails({}, [entry]).merchandise.items;
      if (collection === "checkout-orders" && "purchaseDetails" in entry && entry.purchaseDetails) {
        const details = entry.purchaseDetails as unknown as PurchaseDetails;
        record.purchaseDetails = {
          categories: details.categories,
          registrationQuantity: details.registrationQuantity,
          breakfast: details.breakfast,
          scholarship: details.scholarship && {
            kind: details.scholarship.kind, amountCents: details.scholarship.amountCents, quantity: details.scholarship.quantity,
          },
          merchandise: {
            items: details.merchandise.items, quantity: details.merchandise.quantity,
            fulfillment: details.merchandise.fulfillment, shippingStatus: details.merchandise.shippingStatus,
          },
        };
      }
      return output({ collection, entry: record });
    },
  },
];
