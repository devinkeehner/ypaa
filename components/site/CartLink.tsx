"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTenantTheme } from "./TenantThemeProvider";
import { CART_UPDATED_EVENT, cartCount, readCart, writeCart } from "./cart-store";

export function CartLink() {
  const [count, setCount] = useState(0);
  const { merchEnabled } = useTenantTheme();

  useEffect(() => {
    if (!merchEnabled) {
      try { writeCart([]); } catch { /* Storage may be disabled. */ }
      return;
    }
    const update = () => setCount(cartCount(readCart()));
    update();
    window.addEventListener(CART_UPDATED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, [merchEnabled]);

  if (!merchEnabled || !count) return null;

  return <Link className="cms-cart" href="/cart" aria-label={`Cart with ${count} ${count === 1 ? "item" : "items"}`}><ShoppingBag aria-hidden="true" /><span>Cart</span>{count ? <b>{count}</b> : null}</Link>;
}
