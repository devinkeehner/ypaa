"use client";

import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { addCartItem } from "./cart-store";
import { formatMerchandisePrice, inStockInventory, inventoryKey, inventoryLabel, merchandiseTypeLabels, type MerchandiseItem } from "./merch";
import { SiteFrame } from "./SiteFrame";

export function ProductDetail({ item }: { item: MerchandiseItem }) {
  const inventory = useMemo(() => inStockInventory(item), [item]);
  const [variantKey, setVariantKey] = useState(() => inventory[0] ? inventoryKey(inventory[0], 0) : "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const image = typeof item.image === "object" && item.image ? item.image : null;
  const selectedVariant = inventory.find((option, index) => inventoryKey(option, index) === variantKey) || inventory[0];
  const maxQuantity = Math.min(10, selectedVariant?.quantity || 1);
  const soldOut = !selectedVariant;

  const addToCart = () => {
    if (!selectedVariant) return;
    addCartItem({
      slug: item.slug,
      name: item.name,
      type: merchandiseTypeLabels[item.type] || item.type,
      price: item.price,
      quantity,
      variantId: inventoryKey(selectedVariant),
      maxStock: selectedVariant.quantity,
      size: selectedVariant.size || undefined,
      color: selectedVariant.color || undefined,
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
                {inventory.length > 1 ? <label><span>Choose an option</span><select value={variantKey} onChange={(event) => { setVariantKey(event.target.value); setQuantity(1); setAdded(false); }}>{inventory.map((option, index) => <option key={inventoryKey(option, index)} value={inventoryKey(option, index)}>{inventoryLabel(option)} — {option.quantity} available</option>)}</select></label> : inventory.length === 1 ? <div className="product-fixed-option"><span>Option</span><strong>{inventoryLabel(inventory[0])}</strong></div> : null}
                {selectedVariant ? <p className={`product-stock${selectedVariant.quantity <= 3 ? " low-stock" : ""}`}>{selectedVariant.quantity <= 3 ? `Only ${selectedVariant.quantity} left` : `${selectedVariant.quantity} available`}</p> : <p className="product-stock sold-out">Sold out</p>}
                {!soldOut ? <label><span>Quantity</span><input min="1" max={maxQuantity} type="number" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(event.target.value) || 1)))} /></label> : null}
                <button className="product-add" disabled={soldOut} type="button" onClick={addToCart}><ShoppingBag aria-hidden="true" /> {soldOut ? "Sold out" : "Add to cart"}</button>
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
