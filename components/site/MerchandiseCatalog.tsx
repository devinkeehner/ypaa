"use client";

import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { SiteFrame } from "./SiteFrame";

export type MerchandiseOption = {
  id?: string | null;
  type: string;
  label?: string | null;
  price: number;
  sizes?: string | null;
  available?: boolean | null;
};

export type MerchandiseItem = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  searchTerms?: string | null;
  featured?: boolean | null;
  image?: { url?: string | null; alt?: string | null } | number | string | null;
  options?: MerchandiseOption[] | null;
};

const typeLabels: Record<string, string> = {
  "t-shirt": "T-shirts",
  "long-sleeve": "Long sleeves",
  hoodie: "Hoodies",
  crewneck: "Crewnecks",
  hat: "Hats",
  sticker: "Stickers",
  pin: "Pins",
  tote: "Tote bags",
  mug: "Mugs",
  other: "Other",
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

function ProductCard({ item }: { item: MerchandiseItem }) {
  const options = (item.options || []).filter((option) => option.available !== false);
  const prices = options.map((option) => option.price);
  const image = typeof item.image === "object" && item.image ? item.image : null;

  return (
    <article className={`merch-card${item.featured ? " merch-featured" : ""}`}>
      <div className="merch-image-wrap">
        {image?.url ? <img src={image.url} alt={image.alt || `${item.name} merchandise design`} /> : <div className="merch-image-placeholder" role="img" aria-label={`${item.name} image coming soon`}><ShoppingBag aria-hidden="true" /><span>Image coming soon</span></div>}
        {item.featured ? <span className="merch-featured-label">Featured design</span> : null}
      </div>
      <div className="merch-card-copy">
        <div className="merch-card-heading">
          <div><p className="merch-kicker">Design</p><h2>{item.name}</h2></div>
          {prices.length ? <p className="merch-price">{prices.length > 1 ? "From " : ""}{money(Math.min(...prices))}</p> : null}
        </div>
        <p className="merch-description">{item.description}</p>
        <div className="merch-options" aria-label={`Available ${item.name} merchandise`}>
          {options.map((option) => (
            <div className="merch-option" key={option.id || `${option.type}-${option.label}-${option.price}`}>
              <div><strong>{option.label || typeLabels[option.type] || option.type}</strong>{option.sizes ? <span>{option.sizes}</span> : null}</div>
              <b>{money(option.price)}</b>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export function MerchandiseCatalog({ items }: { items: MerchandiseItem[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  const availableTypes = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => item.options?.forEach((option) => option.available !== false && values.add(option.type)));
    return [...values].sort((a, b) => (typeLabels[a] || a).localeCompare(typeLabels[b] || b));
  }, [items]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return items.filter((item) => {
      const visibleOptions = (item.options || []).filter((option) => option.available !== false);
      const matchesType = type === "all" || visibleOptions.some((option) => option.type === type);
      const haystack = [item.name, item.description, item.searchTerms, ...visibleOptions.flatMap((option) => [option.label, option.type, option.sizes])].filter(Boolean).join(" ").toLowerCase();
      return matchesType && (!needle || haystack.includes(needle));
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
            <div><p className="merch-eyebrow">The collection</p><h2 id="catalog-title">Find your design</h2></div>
            <p>{filtered.length} {filtered.length === 1 ? "design" : "designs"}</p>
          </div>

          <div className="merch-tools">
            <label className="merch-search"><span className="sr-only">Search merchandise</span><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search designs, items, or sizes" type="search" /></label>
            <label className="merch-filter"><SlidersHorizontal aria-hidden="true" /><span className="sr-only">Filter by merchandise type</span><select value={type} onChange={(event) => setType(event.target.value)}><option value="all">All merchandise types</option>{availableTypes.map((value) => <option key={value} value={value}>{typeLabels[value] || value}</option>)}</select></label>
          </div>

          {filtered.length ? <div className="merch-grid">{filtered.map((item) => <ProductCard item={item} key={item.id} />)}</div> : (
            <div className="merch-empty"><ShoppingBag aria-hidden="true" /><h2>{items.length ? "No designs match that search." : "The merchandise portal is ready."}</h2><p>{items.length ? "Try another search term or choose all merchandise types." : "Published designs will appear here as soon as they are added in the site admin."}</p>{items.length ? <button onClick={() => { setQuery(""); setType("all"); }} type="button">Clear filters</button> : null}</div>
          )}
        </section>
      </main>
    </SiteFrame>
  );
}
