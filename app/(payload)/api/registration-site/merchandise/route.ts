import config from "@payload-config";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

type RequestedItem = { slug?: unknown; variantId?: unknown; quantity?: unknown };
type FulfillmentBody = {
  action?: unknown;
  items?: unknown;
  sourceKey?: unknown;
  purchaserName?: unknown;
  purchaserEmail?: unknown;
  paymentSource?: unknown;
  fulfillmentMethod?: unknown;
  shippingAddress?: unknown;
  shippingCents?: unknown;
};

function authorized(request: Request) {
  const expected = process.env.REGISTRATION_SITE_API_KEY || "";
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  if (!expected || expected.length !== supplied.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(supplied));
}

function absoluteMediaUrl(request: Request, value: unknown) {
  if (!value || typeof value !== "object") return null;
  const media = value as { url?: unknown; alt?: unknown };
  const rawUrl = typeof media.url === "string" ? media.url : "";
  return {
    url: rawUrl ? new URL(rawUrl, new URL(request.url).origin).toString() : null,
    alt: typeof media.alt === "string" ? media.alt : null,
  };
}

function normalizedShippingAddress(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const address = value as Record<string, unknown>;
  return {
    line1: String(address.line1 || "").trim().slice(0, 160),
    line2: String(address.line2 || "").trim().slice(0, 160),
    city: String(address.city || "").trim().slice(0, 100),
    state: String(address.state || "").trim().slice(0, 80),
    postalCode: String(address.postalCode || "").trim().slice(0, 24),
  };
}

async function catalog(request: Request) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "merchandise",
    overrideAccess: true,
    draft: false,
    depth: 1,
    limit: 100,
    sort: "-featured,name",
    where: {
      and: [{ _status: { equals: "published" } }, { available: { equals: true } }],
    },
  });
  return result.docs.map((doc) => ({
    id: String(doc.id),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    type: doc.type,
    priceCents: Math.round(Number(doc.price || 0) * 100),
    featured: Boolean(doc.featured),
    image: absoluteMediaUrl(request, doc.image),
    inventory: (doc.inventory || []).map((variant) => ({
      id: String(variant.id || ""),
      size: variant.size || null,
      color: variant.color || null,
      sku: variant.sku || null,
      quantity: Math.max(0, Number(variant.quantity || 0)),
    })),
  }));
}

async function quoteItems(request: Request, rawItems: unknown) {
  const requested = Array.isArray(rawItems) ? (rawItems as RequestedItem[]) : [];
  const sanitized = requested
    .map((value) => {
      const item = value && typeof value === "object" ? value : {};
      return {
      slug: String(item.slug || "").trim(),
      variantId: String(item.variantId || "").trim(),
      quantity: Math.max(0, Math.min(20, Math.floor(Number(item.quantity) || 0))),
      };
    })
    .filter((item) => item.slug && item.variantId && item.quantity > 0);
  const grouped = new Map<string, (typeof sanitized)[number]>();
  for (const item of sanitized) {
    const key = `${item.slug}:${item.variantId}`;
    const quantity = (grouped.get(key)?.quantity || 0) + item.quantity;
    if (quantity > 20) throw new Error("A maximum of 20 units may be ordered for one merchandise option.");
    grouped.set(key, { ...item, quantity });
  }
  const normalized = [...grouped.values()];
  if (!normalized.length) return { lines: [], subtotalCents: 0 };

  const items = await catalog(request);
  const lines = normalized.map((requestedItem) => {
    const item = items.find((candidate) => candidate.slug === requestedItem.slug);
    if (!item) throw new Error("A selected merchandise item is no longer available.");
    const variant = item.inventory.find((candidate) => candidate.id === requestedItem.variantId);
    if (!variant) throw new Error(`${item.name} no longer has that option.`);
    if (requestedItem.quantity > variant.quantity) {
      throw new Error(`Only ${variant.quantity} of ${item.name} is currently available.`);
    }
    return {
      merchandiseId: item.id,
      slug: item.slug,
      name: item.name,
      variantId: variant.id,
      size: variant.size,
      color: variant.color,
      sku: variant.sku,
      quantity: requestedItem.quantity,
      unitPriceCents: item.priceCents,
      image: item.image,
    };
  });
  return {
    lines,
    subtotalCents: lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0),
  };
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ items: await catalog(request) });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Merchandise could not be loaded." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = (await request.json()) as FulfillmentBody;
    const quote = await quoteItems(request, body.items);
    if (body.action !== "fulfill") return NextResponse.json(quote);

    const sourceKey = String(body.sourceKey || "").trim().slice(0, 200);
    if (!sourceKey || !quote.lines.length) {
      return NextResponse.json({ error: "A source key and merchandise items are required." }, { status: 400 });
    }
    const payload = await getPayload({ config });
    const existing = await payload.find({
      collection: "merchandise-orders",
      overrideAccess: true,
      limit: 1,
      where: { sourceKey: { equals: sourceKey } },
    });
    if (existing.docs[0]) {
      return NextResponse.json({ success: true, duplicate: true, orderId: String(existing.docs[0].id) });
    }

    const order = await payload.create({
      collection: "merchandise-orders",
      overrideAccess: true,
      data: {
        sourceKey,
        purchaserName: String(body.purchaserName || "").trim().slice(0, 120),
        purchaserEmail: String(body.purchaserEmail || "").trim().toLowerCase().slice(0, 180),
        paymentSource: body.paymentSource === "cash" ? "cash" : "stripe",
        fulfillmentMethod:
          body.fulfillmentMethod === "shipping"
            ? "shipping"
            : body.fulfillmentMethod === "event_pickup"
              ? "event_pickup"
              : "receive_now",
        shippingAddress: normalizedShippingAddress(body.shippingAddress),
        items: quote.lines,
        merchandiseSubtotalCents: quote.subtotalCents,
        shippingCents: Math.max(0, Math.floor(Number(body.shippingCents) || 0)),
        status: "processing",
      },
    });

    try {
      for (const line of quote.lines) {
        const document = await payload.findByID({
          collection: "merchandise",
          id: line.merchandiseId,
          overrideAccess: true,
          depth: 0,
        });
        const inventory = (document.inventory || []).map((variant) =>
          String(variant.id || "") === line.variantId
            ? { ...variant, quantity: Math.max(0, Number(variant.quantity || 0) - line.quantity) }
            : variant,
        );
        await payload.update({
          collection: "merchandise",
          id: document.id,
          overrideAccess: true,
          data: { inventory },
        });
      }
      await payload.update({
        collection: "merchandise-orders",
        id: order.id,
        overrideAccess: true,
        data: { status: "fulfilled" },
      });
      return NextResponse.json({ success: true, orderId: String(order.id), ...quote });
    } catch (error) {
      await payload.update({
        collection: "merchandise-orders",
        id: order.id,
        overrideAccess: true,
        data: {
          status: "failed",
          failureMessage: error instanceof Error ? error.message : "Inventory update failed.",
        },
      });
      throw error;
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Merchandise could not be processed." },
      { status: 400 },
    );
  }
}
