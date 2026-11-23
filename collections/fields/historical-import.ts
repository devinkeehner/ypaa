import type { Field } from "payload";

export function historicalSourceField(includePaymentRows = false): Field {
  return {
    name: "historicalSource",
    label: "Import source",
    type: "group",
    admin: { readOnly: true },
    fields: [
      { name: "sheet", type: "text" },
      { name: "row", type: "number", min: 1 },
      ...(includePaymentRows ? [
        { name: "paymentRow", label: "Tracker payment row", type: "number" as const, min: 1 },
        { name: "stripeRow", label: "Stripe CSV row", type: "number" as const, min: 1 },
      ] : []),
    ],
  };
}

export function purchaseLinesField(): Field {
  return {
    name: "purchaseLines",
    label: "Imported purchase lines",
    type: "array",
    admin: { readOnly: true, initCollapsed: true },
    fields: [
      { name: "sourceLineId", type: "text", required: true },
      { name: "kind", type: "select", required: true, options: ["registration", "breakfast", "scholarship", "merchandise", "shipping", "fee", "other"] },
      { name: "label", type: "text" },
      { name: "quantity", type: "number", min: 0, required: true },
      { name: "unitPriceCents", type: "number", min: 0 },
      { name: "amountCents", type: "number", min: 0, required: true },
      { name: "breakfastDay", type: "select", options: ["friday", "saturday", "sunday"] },
      { name: "fulfillment", type: "text" },
      { name: "ticketEquivalents", type: "number", min: 0 },
      historicalSourceField(),
    ],
  };
}
