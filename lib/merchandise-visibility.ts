/** Missing settings preserve existing sales; an explicit false shuts a channel down. */
export type MerchChannel = "main" | "quick" | "all";
export type MerchSettings = { onlineMerchEnabled?: boolean | null; quickMerchEnabled?: boolean | null };
export function merchChannelEnabled(settings: MerchSettings | undefined, channel: MerchChannel) {
  return channel === "all" || (channel === "quick" ? settings?.quickMerchEnabled !== false : settings?.onlineMerchEnabled !== false);
}
export function merchItemVisible(item: { showInMainStore?: boolean | null; showInQuickCheckout?: boolean | null }, channel: MerchChannel) {
  return channel === "all" || (channel === "quick" ? item.showInQuickCheckout === true : item.showInMainStore !== false);
}
/** Match only our own storefront/cart and registration merchandise entry links. */
export function isMerchLink(href: string) {
  try {
    const url = new URL(href, "https://necypaact.com");
    if (!["necypaact.com", "www.necypaact.com", "reg.necypaact.com"].includes(url.hostname)) return false;
    const path = decodeURIComponent(url.pathname).replace(/\/+$/, "");
    return /^\/(merch|cart)(\/|$)/.test(path) || url.searchParams.get("mode") === "merch" || url.searchParams.has("merch");
  } catch { return false; }
}
