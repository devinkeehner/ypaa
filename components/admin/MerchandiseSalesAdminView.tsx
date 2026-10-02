import { MerchandiseSales } from "@/components/admin/MerchandiseSales";
import { DefaultTemplate } from "@payloadcms/next/templates";
import type { AdminViewServerProps } from "payload";

export default async function MerchandiseSalesAdminView(props: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = props.initPageResult;
  const result = await req.payload.find({
    collection: "merchandise-orders",
    depth: 0,
    limit: 5000,
    pagination: false,
    overrideAccess: false,
    req,
    sort: "-createdAt",
  });

  const orders = result.docs.map((order) => ({
    id: String(order.id),
    isDemo: Boolean(order.isSynthetic),
    purchaserName: order.purchaserName,
    paymentSource: order.paymentSource,
    fulfillmentMethod: order.fulfillmentMethod,
    status: order.status,
    items: Array.isArray(order.items) ? order.items.map((line) => {
      if (!line || typeof line !== "object") return null;
      const item = line as Record<string, unknown>;
      return {
        name: typeof item.name === "string" ? item.name : "Merchandise",
        size: typeof item.size === "string" ? item.size : null,
        color: typeof item.color === "string" ? item.color : null,
        sku: typeof item.sku === "string" ? item.sku : null,
        quantity: Number(item.quantity) || 0,
        unitPriceCents: Number(item.unitPriceCents) || 0,
      };
    }).filter((line): line is NonNullable<typeof line> => Boolean(line)) : [],
    merchandiseSubtotalCents: order.merchandiseSubtotalCents,
    shippingCents: order.shippingCents,
    createdAt: order.createdAt,
  }));

  return (
    <DefaultTemplate
      {...props}
      req={req}
      payload={req.payload}
      i18n={req.i18n}
      user={req.user ?? undefined}
      permissions={permissions}
      visibleEntities={visibleEntities}
      locale={locale}
    >
      <MerchandiseSales orders={orders} />
    </DefaultTemplate>
  );
}
