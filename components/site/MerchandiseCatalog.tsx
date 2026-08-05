"use client";

import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { SiteFrame } from "./SiteFrame";
import { formatMerchandisePrice, merchandiseTypeLabels, totalInventory, type MerchandiseItem } from "./merch";

export type { MerchandiseItem } from "./merch";

function ProductCard({ item }: { item: MerchandiseItem }) {
  const image = typeof item.image === "object" && item.image ? item.image : null;
  const stock = totalInventory(item);
  const sizes = [...new Set((item.inventory || []).map((option) => option.size).filter(Boolean))].join(", ");
  const soldOut = stock <= 0;

  return (
    <Link className="merch-card-link" href={`/merch/${item.slug}`} aria-label={`View ${item.name}`}>
    <article className={`merch-card${item.featured ? " merch-featured" : ""}${soldOut ? " merch-sold-out" : ""}`}>
      <div className="merch-image-wrap">
        {image?.url ? <img src={image.url} alt={image.alt || `${item.name} merchandise design`} /> : <div className="merch-image-placeholder" role="img" aria-label={`${item.name} image coming soon`}><ShoppingBag aria-hidden="true" /><span>Image coming soon</span></div>}
        {item.featured ? <span className="merch-featured-label">Featured item</span> : null}
        {item.sample ? <span className="merch-sample-label">Sample listing</span> : null}
        {soldOut ? <span className="merch-sold-out-label">Sold out</span> : null}
      </div>
      <div className="merch-card-copy">
        <p className="merch-kicker">{merchandiseTypeLabels[item.type] || item.type}</p>
        <h2>{item.name}</h2>
        <p className="merch-description">{item.description}</p>
        <div className="merch-card-meta">
          <p className="merch-price">{formatMerchandisePrice(item.price)}</p>
          {sizes ? <p className="merch-sizes"><span>Sizes</span>{sizes}</p> : null}
        </div>
        <span className="merch-view-item">{soldOut ? "View details" : "View item"} <span aria-hidden="true">→</span></span>
      </div>
    </article>
    </Link>
  );
}

export function MerchandiseCatalog({ items }: { items: MerchandiseItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const availableTypes = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => item.available !== false && values.add(item.type));
    return [...values].sort((a, b) => (merchandiseTypeLabels[a] || a).localeCompare(merchandiseTypeLabels[b] || b));
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesType = type === "all" || item.type === type;
      const inventoryTerms = (item.inventory || []).flatMap((option) => [option.size, option.color, option.sku]);
      const haystack = [item.name, item.description, item.searchTerms, item.type, merchandiseTypeLabels[item.type], ...inventoryTerms].filter(Boolean).join(" ").toLowerCase();
      return item.available !== false && matchesType && (!needle || haystack.includes(needle));
    });
  }, [items, query, type]);

  return (
    <SiteFrame mainId="merch-main">
      <main className="merch-page" id="merch-main">
        <section className="merch-hero">
          <div className="merch-orbit merch-orbit-one" aria-hidden="true" />
          <div className="merch-orbit merch-orbit-two" aria-hidden="true" />
          <div className="merch-shell merch-hero-grid">
            <div>
              <p className="merch-eyebrow">NECYPAA XXXVI merchandise</p>
              <h1>Wear the<br /><em>Mad Realm.</em></h1>
            </div>
            <div className="merch-intro">
              <p>Browse convention designs and compare every available item and price. Ordering will open in a future update.</p>
              <span><ShoppingBag aria-hidden="true" /> Catalog only — payment is not active yet</span>
            </div>
          </div>
        </section>

        <section className="merch-shop merch-shell" aria-labelledby="catalog-title">
          <div className="merch-shop-heading">
            <div><p className="merch-eyebrow">The collection</p><h2 id="catalog-title">Browse merchandise</h2></div>
            <p>{filtered.length} {filtered.length === 1 ? "item" : "items"}</p>
          </div>

          <div className="merch-tools">
            <label className="merch-search"><span className="sr-only">Search merchandise</span><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search designs, items, or sizes" type="search" /></label>
            <label className="merch-filter"><SlidersHorizontal aria-hidden="true" /><span className="sr-only">Filter by merchandise type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All merchandise types</option>{availableTypes.map((value) => <option key={value} value={value}>{merchandiseTypeLabels[value] || value}</option>)}</select></label>
          </div>

          {filtered.length ? <div className={`merch-grid merch-grid-${Math.min(filtered.length, 4)}`}>{filtered.map((item) => <ProductCard item={item} key={item.id} />)}</div> : (
            <div className="merch-empty"><ShoppingBag aria-hidden="true" /><h2>{items.length ? "No items match that search." : "The merchandise portal is ready."}</h2><p>{items.length ? "Try another search term or choose all merchandise types." : "Published items will appear here as soon as they are added in the site admin."}</p>{items.length ? <button onClick={() => { setQuery(""); setType("all"); }} type="button">Clear filters</button> : null}</div>
          )}
        </section>
      </main>
    </SiteFrame>
  );
}
