"use client";

import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { addCartItem } from "./cart-store";
import { formatMerchandisePrice, merchandiseTypeLabels, parseProductOptions, type MerchandiseItem } from "./merch";
import { SiteFrame } from "./SiteFrame";

export function ProductDetail({ item }: { item: MerchandiseItem }) {
  const sizes = useMemo(() => parseProductOptions(item.sizes), [item.sizes]);
  const colors = useMemo(() => parseProductOptions(item.colors), [item.colors]);
  const [size, setSize] = useState(sizes[0] || "");
  const [color, setColor] = useState(colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const image = typeof item.image === "object" && item.image ? item.image : null;

  const addToCart = () => {
    addCartItem({
      slug: item.slug,
      name: item.name,
      type: merchandiseTypeLabels[item.type] || item.type,
      price: item.price,
      quantity,
      size: size || undefined,
      color: color || undefined,
      imageUrl: image?.url || undefined,
      imageAlt: image?.alt || `${item.name} merchandise`,
    });
    setAdded(true);
  };

  return (
    <SiteFrame mainId="product-main">
      <main className="product-page" id="product-main">
        <div className="product-shell">
          <Link className="product-back" href="/merch"><ArrowLeft aria-hidden="true" /> Back to merchandise</Link>
          <div className="product-grid">
            <div className="product-media">
              {image?.url ? <img src={image.url} alt={image.alt || `${item.name} merchandise`} /> : <div className="merch-image-placeholder"><ShoppingBag aria-hidden="true" /><span>Image coming soon</span></div>}
              {item.sample ? <span className="merch-sample-label">Sample listing</span> : null}
            </div>
            <section className="product-info" aria-labelledby="product-title">
              <p className="merch-eyebrow">{merchandiseTypeLabels[item.type] || item.type}</p>
              <h1 id="product-title">{item.name}</h1>
              <p className="product-price">{formatMerchandisePrice(item.price)}</p>
              <p className="product-description">{item.description}</p>

              <div className="product-form">
                {sizes.length > 1 ? <label><span>Size</span><select value={size} onChange={(event) => setSize(event.target.value)}>{sizes.map((option) => <option key={option}>{option}</option>)}</select></label> : sizes.length === 1 ? <div className="product-fixed-option"><span>Size</span><strong>{sizes[0]}</strong></div> : null}
                {colors.length > 1 ? <label><span>Color</span><select value={color} onChange={(event) => setColor(event.target.value)}>{colors.map((option) => <option key={option}>{option}</option>)}</select></label> : colors.length === 1 ? <div className="product-fixed-option"><span>Color</span><strong>{colors[0]}</strong></div> : null}
                <label><span>Quantity</span><input min="1" max="10" type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} /></label>
                <button className="product-add" type="button" onClick={addToCart}><ShoppingBag aria-hidden="true" /> Add to cart</button>
              </div>

              {added ? <div className="product-added" role="status"><Check aria-hidden="true" /><span>Added to your cart.</span><Link href="/cart">View cart</Link></div> : null}
              <p className="product-payment-note">Your selections will be saved in the cart. Payment is not active yet.</p>
            </section>
          </div>
        </div>
      </main>
    </SiteFrame>
  );
}
