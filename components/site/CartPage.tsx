"use client";

import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { readCart, type CartItem, writeCart } from "./cart-store";
import { formatMerchandisePrice } from "./merch";
import { SiteFrame } from "./SiteFrame";

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setItems(readCart());
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const updateQuantity = (key: string, quantity: number) => {
    const next = items.map((item) => item.key === key ? { ...item, quantity: Math.max(1, Math.min(10, quantity)) } : item);
    setItems(next);
    writeCart(next);
  };

  const remove = (key: string) => {
    const next = items.filter((item) => item.key !== key);
    setItems(next);
    writeCart(next);
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <SiteFrame mainId="cart-main">
      <main className="cart-page" id="cart-main">
        <div className="cart-shell">
          <Link className="product-back" href="/merch"><ArrowLeft aria-hidden="true" /> Continue shopping</Link>
          <header className="cart-heading"><div><p className="merch-eyebrow">Your selections</p><h1>Merchandise cart</h1></div><ShoppingBag aria-hidden="true" /></header>
          {loaded && items.length ? <div className="cart-layout">
            <div className="cart-list">
              {items.map((item) => <article className="cart-item" key={item.key}>
                <div className="cart-item-image">{item.imageUrl ? <img src={item.imageUrl} alt={item.imageAlt || ""} /> : <ShoppingBag aria-hidden="true" />}</div>
                <div className="cart-item-copy"><p>{item.type}</p><h2>{item.name}</h2><div>{item.size ? <span>Size: {item.size}</span> : null}{item.color ? <span>Color: {item.color}</span> : null}</div><strong>{formatMerchandisePrice(item.price)}</strong></div>
                <div className="cart-quantity" aria-label={`Quantity for ${item.name}`}><button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} aria-label="Decrease quantity"><Minus aria-hidden="true" /></button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} aria-label="Increase quantity"><Plus aria-hidden="true" /></button></div>
                <button className="cart-remove" type="button" onClick={() => remove(item.key)} aria-label={`Remove ${item.name}`}><Trash2 aria-hidden="true" /></button>
              </article>)}
            </div>
            <aside className="cart-summary"><p>Order summary</p><div><span>Subtotal</span><strong>{formatMerchandisePrice(subtotal)}</strong></div><button disabled type="button">Checkout coming soon</button><small>No payment will be collected yet. Your cart stays saved on this device.</small></aside>
          </div> : loaded ? <div className="cart-empty"><ShoppingBag aria-hidden="true" /><h2>Your cart is empty.</h2><p>Choose an item from the merchandise collection to get started.</p><Link href="/merch">Browse merchandise</Link></div> : null}
        </div>
      </main>
    </SiteFrame>
  );
}
