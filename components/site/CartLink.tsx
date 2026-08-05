"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { CART_UPDATED_EVENT, cartCount, readCart } from "./cart-store";

export function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount(readCart()));
    update();
    window.addEventListener(CART_UPDATED_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <Link className="cms-cart" href="/cart" aria-label={`Cart with ${count} ${count === 1 ? "item" : "items"}`}><ShoppingBag aria-hidden="true" /><span>Cart</span>{count ? <b>{count}</b> : null}</Link>;
}
