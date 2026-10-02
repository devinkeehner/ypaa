"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, Search, Shirt } from "lucide-react";
import styles from "./merchandise-sales.module.css";

type Item = { name: string; size: string | null; color: string | null; sku: string | null; quantity: number; unitPriceCents: number };
type Order = {
  id: string;
  isDemo: boolean;
  purchaserName: string;
  paymentSource: "stripe" | "cash";
  fulfillmentMethod: "receive_now" | "event_pickup" | "shipping";
  status: "processing" | "fulfilled" | "failed";
  items: Item[];
  merchandiseSubtotalCents: number;
  shippingCents: number;
  createdAt: string;
};

const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const statusLabel: Record<Order["status"], string> = { fulfilled: "Sold", processing: "Processing", failed: "Issue" };
const fulfillmentLabel: Record<Order["fulfillmentMethod"], string> = { receive_now: "Received in person", event_pickup: "Event pickup", shipping: "Shipping" };

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

export function MerchandiseSales({ orders }: { orders: Order[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | Order["status"]>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const summary = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status === "fulfilled");
    return {
      gross: paidOrders.reduce((sum, order) => sum + order.merchandiseSubtotalCents + order.shippingCents, 0),
      units: paidOrders.reduce((sum, order) => sum + order.items.reduce((lineSum, item) => lineSum + item.quantity, 0), 0),
      orders: paidOrders.length,
      processing: orders.filter((order) => order.status === "processing").length,
    };
  }, [orders]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return orders.filter((order) => {
      if (status !== "all" && order.status !== status) return false;
      if (!term) return true;
      return [order.purchaserName, ...order.items.flatMap((item) => [item.name, item.sku, item.size, item.color])]
        .some((value) => value?.toLowerCase().includes(term));
    }).sort((a, b) => (sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
  }, [orders, query, sort, status]);

  const productTotals = useMemo(() => {
    const totals = new Map<string, { name: string; options: string; units: number; revenue: number }>();
    for (const order of orders.filter((entry) => entry.status === "fulfilled")) {
      for (const item of order.items) {
        const options = [item.color, item.size].filter(Boolean).join(" · ") || "Standard";
        const key = `${item.name}\u0000${options}`;
        const current = totals.get(key) || { name: item.name, options, units: 0, revenue: 0 };
        current.units += item.quantity;
        current.revenue += item.quantity * item.unitPriceCents;
        totals.set(key, current);
      }
    }
    return Array.from(totals.values()).sort((a, b) => b.units - a.units || a.name.localeCompare(b.name));
  }, [orders]);

  return (
    <main className={styles.page}>
      <header className={styles.heading}>
        <div>
          <div className={styles.titleRow}><span className={styles.titleIcon}><Shirt aria-hidden size={22} /></span><h1>Merchandise sales</h1></div>
          <p>See what has sold, recent orders, and how each order will be handed off.</p>
        </div>
        <div className={styles.sourceNote}><span aria-hidden className={styles.sourceDot} /> Live order records</div>
      </header>

      <section aria-label="Sales summary" className={styles.summary}>
        <article><span>Sales recorded</span><strong>{currency.format(summary.gross / 100)}</strong></article>
        <article><span>Items sold</span><strong>{summary.units.toLocaleString()}</strong></article>
        <article><span>Orders</span><strong>{summary.orders.toLocaleString()}</strong></article>
        <article><span>Processing</span><strong>{summary.processing.toLocaleString()}</strong></article>
      </section>

      <div className={styles.content}>
        <section className={styles.ordersSection}>
          <div className={styles.sectionHeading}>
            <div><h2>Orders</h2><p>{filtered.length} {filtered.length === 1 ? "order" : "orders"}</p></div>
            <button className={styles.sortButton} onClick={() => setSort((current) => current === "newest" ? "oldest" : "newest")} type="button"><ArrowDownUp aria-hidden size={15} /> {sort === "newest" ? "Newest first" : "Oldest first"}</button>
          </div>
          <div className={styles.toolbar}>
            <label className={styles.search}><Search aria-hidden size={17} /><span className={styles.srOnly}>Search orders</span><input onChange={(event) => setQuery(event.target.value)} placeholder="Search person or item" value={query} /></label>
            <label className={styles.statusSelect}><span className={styles.srOnly}>Filter order status</span><select onChange={(event) => setStatus(event.target.value as typeof status)} value={status}><option value="all">All statuses</option><option value="fulfilled">Sold</option><option value="processing">Processing</option><option value="failed">Issue</option></select></label>
          </div>

          <div className={styles.orderList}>
            {filtered.map((order) => (
              <article className={styles.order} key={order.id}>
                <div className={styles.orderTop}>
                  <div className={styles.orderIdentity}><strong>{order.purchaserName || "In-person sale"}{order.isDemo && <em className={styles.demoMark}>Sample</em>}</strong><span>Order {order.id.slice(-7).toUpperCase()} · {formatDate(order.createdAt)}</span></div>
                  <span className={`${styles.status} ${styles[order.status]}`}>{statusLabel[order.status]}</span>
                </div>
                <ul className={styles.items}>
                  {order.items.map((item, index) => <li key={`${item.name}-${item.sku || "item"}-${index}`}><span className={styles.itemCount}>{item.quantity}×</span><span className={styles.itemText}><strong>{item.name}</strong><small>{[item.color, item.size, item.sku].filter(Boolean).join(" · ") || "Standard"}</small></span><span className={styles.itemPrice}>{currency.format(item.quantity * item.unitPriceCents / 100)}</span></li>)}
                </ul>
                <footer className={styles.orderBottom}><span>{fulfillmentLabel[order.fulfillmentMethod]} <i>·</i> {order.paymentSource === "cash" ? "Cash" : "Stripe"}</span><strong>{currency.format((order.merchandiseSubtotalCents + order.shippingCents) / 100)}</strong></footer>
              </article>
            ))}
            {filtered.length === 0 && <div className={styles.empty}><Shirt aria-hidden size={25} /><strong>No orders found</strong><span>{orders.length ? "Try changing the search or status filter." : "Merchandise sales will appear here after the first order."}</span></div>}
          </div>
        </section>

        <aside className={styles.soldSection}>
          <div className={styles.sectionHeading}><div><h2>Best sellers</h2><p>Units by product and option</p></div></div>
          {productTotals.length ? <ol className={styles.products}>{productTotals.map((item) => <li key={`${item.name}-${item.options}`}><span className={styles.productMark}><Shirt aria-hidden size={17} /></span><span className={styles.productCopy}><strong>{item.name}</strong><small>{item.options} · {currency.format(item.revenue / 100)}</small></span><b>{item.units}</b></li>)}</ol> : <p className={styles.noProducts}>Product totals will appear after the first completed sale.</p>}
          <p className={styles.note}>Only fulfilled orders count toward sales and item totals. Sample orders are marked. Customer email addresses and shipping addresses are not shown here.</p>
        </aside>
      </div>
    </main>
  );
}
