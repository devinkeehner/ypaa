import config from "@payload-config";
import { getPayload } from "payload";
import { merchChannelEnabled, merchItemVisible, type MerchChannel, type MerchSettings } from "./merchandise-visibility";

/** Request-time catalog. Fulfillment bypasses sales switches, never product/stock validation. */
export async function getMerchandiseCatalog(channel: MerchChannel = "main") {
  const payload = await getPayload({ config });
  const [settings, result] = await Promise.all([
    channel === "all" ? Promise.resolve(undefined) : payload.find({ collection: "tenants", overrideAccess: true, depth: 0, limit: 1, sort: "createdAt" }),
    payload.find({ collection: "merchandise", overrideAccess: true, draft: false, depth: 1, limit: 100, sort: "-featured,name",
      where: { and: [{ _status: { equals: "published" } }, { available: { equals: true } }] } }),
  ]);
  const enabled = merchChannelEnabled(settings?.docs[0] as MerchSettings | undefined, channel);
  const items = enabled ? result.docs.filter((item) => merchItemVisible(item as typeof item & { showInMainStore?: boolean; showInQuickCheckout?: boolean }, channel)) : [];
  return { enabled: enabled && items.length > 0, items };
}
