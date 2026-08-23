import type { CollectionConfig } from "payload";

export const MerchandiseOrders: CollectionConfig = {
  slug: "merchandise-orders",
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
