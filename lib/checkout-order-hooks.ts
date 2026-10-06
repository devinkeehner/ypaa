import type { CollectionBeforeReadHook, CollectionBeforeChangeHook } from "payload";
import { canReadCollection } from "./crm-access";
import { derivePurchaseDetails, objectValue } from "./checkout-order-details";

export const snapshotCheckoutPurchase: CollectionBeforeChangeHook = ({ data, originalDoc, operation, context }) => {
  // Derived fields cannot be supplied by an API client. Historical saves never backfill a snapshot.
  delete data.purchaseSummary;
  delete data.purchaseDetails;
  if (operation === "create") {
    const originalInput = objectValue(context.checkoutPurchaseDisplayOrder);
    data.purchaseSnapshot = Object.keys(originalInput).length ? derivePurchaseDetails({ ...data, order: originalInput }, [], true) : derivePurchaseDetails(data);
  }
  else if (originalDoc?.purchaseSnapshot) data.purchaseSnapshot = originalDoc.purchaseSnapshot;
  else delete data.purchaseSnapshot;
  return data;
};

export const readCheckoutPurchase: CollectionBeforeReadHook = async ({ doc, req, overrideAccess }) => {
  if (req.context.skipCheckoutPurchaseDisplay) return doc;
  let source = doc;
  // Virtual-only projections do not include their dependencies in Mongo's result.
  // Load them with the same caller/transaction, then let Payload's field pipeline apply select.
  if (doc.id && !("order" in doc) && !("rawMetadata" in doc)) {
    // List reads run in parallel. Never put a recursion flag in their shared request context.
    const sourceReq = { ...req, headers: req.headers, query: { ...req.query }, context: { ...req.context, skipCheckoutPurchaseDisplay: true } };
    source = await req.payload.findByID({ collection: "checkout-orders", id: doc.id, req: sourceReq, overrideAccess: Boolean(overrideAccess), depth: 0,
      select: { order: true, rawMetadata: true, purchaseSnapshot: true, sourceKey: true, paymentSource: true, paymentSourceType: true, dataOrigin: true, checkoutLineItemSummary: true, stripeCheckoutSessionId: true, stripePaymentIntentId: true, stripeChargeId: true } });
  }
  let merchandise: unknown[] = [];
  let unavailable = false;
  // Use exact source identifiers only; never associate orders using purchaser email or name.
  const keys = [...new Set([source.sourceKey, source.stripeCheckoutSessionId ? `stripe:${source.stripeCheckoutSessionId}` : null, source.stripePaymentIntentId ? `stripe:${source.stripePaymentIntentId}` : null, source.stripeChargeId ? `stripe:${source.stripeChargeId}` : null].filter((key): key is string => typeof key === "string" && Boolean(key)))];
  if (keys.length && (overrideAccess || (req.user && canReadCollection(req.user, "merchandise-orders")))) {
    try {
      const result = await req.payload.find({ collection: "merchandise-orders", req, overrideAccess: Boolean(overrideAccess), depth: 0, limit: 2,
        where: { sourceKey: { in: keys } }, select: { items: true, fulfillmentMethod: true, shippingStatus: true, status: true } });
      merchandise = result.docs;
    } catch { unavailable = true; }
  }
  const details = derivePurchaseDetails(source, merchandise);
  if (unavailable) details.notes.push("Linked merchandise details could not be loaded. Retry this read; source metadata remains available.");
  // Payload's field read pipeline subsequently applies field access and select to these virtual values.
  return { ...doc, purchaseSummary: details.summary, purchaseDetails: details };
};
