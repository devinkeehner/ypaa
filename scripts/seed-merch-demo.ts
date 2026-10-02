process.loadEnvFile?.(".env.local");
if (process.env.NODE_ENV === "production") throw new Error("Refusing to seed merchandise samples in production.");

const uri = process.env.DATABASE_URI || process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGO_URL;
if (!uri) throw new Error("No project Mongo URI found in environment or .env.local.");
const databaseUrl = new URL(uri);
if (!["127.0.0.1", "localhost", "::1"].includes(databaseUrl.hostname)) {
  throw new Error("Synthetic merch records may only be added to a loopback Mongo database.");
}

process.env.PAYLOAD_ENABLE_MCP = "false";
process.env.ENABLE_R2 = "false";
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
const payload = await getPayload({ config });

const examples = [
  {
    sourceKey: "DEMO-MERCH-CASH-001",
    purchaserName: "DEMO · Alex Rivera",
    paymentSource: "cash" as const,
    fulfillmentMethod: "receive_now" as const,
    merchandiseSubtotalCents: 4200,
    shippingCents: 0,
    status: "fulfilled" as const,
    items: [
      { merchandiseId: "demo-tee", name: "NECYPAA XXXVI T-shirt", variantId: "demo-tee-m", size: "M", color: "Navy", sku: "DEMO-TEE-NV-M", quantity: 2, unitPriceCents: 1800 },
      { merchandiseId: "demo-sticker", name: "Convention sticker", variantId: "demo-sticker-standard", size: null, color: "Multicolor", sku: "DEMO-STICKER", quantity: 1, unitPriceCents: 600 },
    ],
  },
  {
    sourceKey: "DEMO-MERCH-STRIPE-002",
    purchaserName: "DEMO · Riley Chen",
    paymentSource: "stripe" as const,
    fulfillmentMethod: "event_pickup" as const,
    merchandiseSubtotalCents: 4800,
    shippingCents: 0,
    status: "fulfilled" as const,
    items: [{ merchandiseId: "demo-hoodie", name: "NECYPAA XXXVI Hoodie", variantId: "demo-hoodie-l", size: "L", color: "Charcoal", sku: "DEMO-HOODIE-CH-L", quantity: 1, unitPriceCents: 4800 }],
  },
  {
    sourceKey: "DEMO-MERCH-STRIPE-003",
    purchaserName: "DEMO · Morgan Taylor",
    paymentSource: "stripe" as const,
    fulfillmentMethod: "shipping" as const,
    merchandiseSubtotalCents: 3600,
    shippingCents: 650,
    status: "processing" as const,
    items: [{ merchandiseId: "demo-tee", name: "NECYPAA XXXVI T-shirt", variantId: "demo-tee-xl", size: "XL", color: "Navy", sku: "DEMO-TEE-NV-XL", quantity: 2, unitPriceCents: 1800 }],
  },
  {
    sourceKey: "DEMO-MERCH-ISSUE-004",
    purchaserName: "DEMO · Jamie Morgan",
    paymentSource: "cash" as const,
    fulfillmentMethod: "event_pickup" as const,
    merchandiseSubtotalCents: 4800,
    shippingCents: 0,
    status: "failed" as const,
    items: [{ merchandiseId: "demo-hoodie", name: "NECYPAA XXXVI Hoodie", variantId: "demo-hoodie-s", size: "S", color: "Charcoal", sku: "DEMO-HOODIE-CH-S", quantity: 1, unitPriceCents: 4800 }],
  },
];

try {
  let created = 0;
  for (const example of examples) {
    const existing = await payload.find({ collection: "merchandise-orders", overrideAccess: true, limit: 1, where: { sourceKey: { equals: example.sourceKey } } });
    if (existing.docs.length) {
      if (!existing.docs[0].isSynthetic) {
        await payload.update({ collection: "merchandise-orders", id: existing.docs[0].id, overrideAccess: true, data: { isSynthetic: true } });
      }
      continue;
    }
    await payload.create({
      collection: "merchandise-orders",
      overrideAccess: true,
      data: {
        ...example,
        isSynthetic: true,
        purchaserEmail: "sample@example.invalid",
        ...(example.status === "failed" ? { failureMessage: "Synthetic example issue. No real payment was collected." } : {}),
      },
    });
    created += 1;
  }
  console.log(`Created ${created} synthetic merchandise orders in the local Payload database. No inventory was changed and no customer emails were sent.`);
} finally {
  await payload.destroy();
}
