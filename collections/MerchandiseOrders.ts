import type { CollectionConfig } from "payload";
import { sendMerchandiseShippingUpdate } from "@/lib/scholarship-email";

export const MerchandiseOrders: CollectionConfig = {
  slug: "merchandise-orders",
  hooks: {
    beforeChange: [async ({ data, originalDoc }) => {
      const order = { ...originalDoc, ...data };
      // Inventory fulfillment is not physical shipment. Retry unsent email on save.
      if (order.fulfillmentMethod !== "shipping" || order.shippingStatus !== "shipped" || originalDoc?.shippingEmailSentAt) return data;
      try {
        const status = await sendMerchandiseShippingUpdate({
          recipientEmail: order.purchaserEmail, purchaserName: order.purchaserName,
          reference: order.sourceKey, carrier: order.shippingCarrier, trackingNumber: order.trackingNumber,
        });
        return { ...data, shippingEmailStatus: status, shippingEmailError: null,
          ...(status === "sent" ? { shippingEmailSentAt: new Date().toISOString() } : {}) };
      } catch {
        return { ...data, shippingEmailStatus: "failed", shippingEmailError: "Shipping email could not be sent. Save this order again to retry." };
      }
    }],
  },
  admin: {
    useAsTitle: "sourceKey",
    defaultColumns: ["sourceKey", "purchaserName", "paymentSource", "fulfillmentMethod", "status", "createdAt"],
    description: "Merchandise orders fulfilled by the separate NECYPAA Registration Site.",
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "sourceKey", type: "text", required: true, unique: true, index: true },
    { name: "purchaserName", type: "text", required: true },
    { name: "purchaserEmail", type: "email", required: true },
    {
      name: "paymentSource",
      type: "select",
      required: true,
      options: ["stripe", "cash"],
    },
    {
      name: "fulfillmentMethod",
      type: "select",
      required: true,
      options: [
        { label: "Receive now", value: "receive_now" },
        { label: "Pick up at NECYPAA", value: "event_pickup" },
        { label: "Ship to customer", value: "shipping" },
      ],
    },
    { name: "shippingAddress", type: "json" },
    { name: "shippingStatus", type: "select", defaultValue: "not_shipped", options: ["not_shipped", "shipped"], admin: { condition: (data) => data?.fulfillmentMethod === "shipping", description: "Set to shipped and save to email the purchaser. Inventory fulfillment alone does not send a shipping update." } },
    { name: "shippingCarrier", type: "text", admin: { condition: (data) => data?.fulfillmentMethod === "shipping" } },
    { name: "trackingNumber", type: "text", admin: { condition: (data) => data?.fulfillmentMethod === "shipping" } },
    { name: "shippingEmailStatus", type: "select", options: ["sent", "pending_configuration", "failed"], admin: { readOnly: true } },
    { name: "shippingEmailSentAt", type: "date", admin: { readOnly: true } },
    { name: "shippingEmailError", type: "textarea", admin: { readOnly: true } },
    { name: "items", type: "json", required: true },
    { name: "merchandiseSubtotalCents", type: "number", required: true, min: 0 },
    { name: "shippingCents", type: "number", required: true, min: 0, defaultValue: 0 },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "processing",
      options: ["processing", "fulfilled", "failed"],
    },
    { name: "failureMessage", type: "textarea" },
  ],
};
