export const CART_STORAGE_KEY = "necypaa-merch-cart";
export const CART_UPDATED_EVENT = "necypaa-cart-updated";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
  imageAlt?: string;
};

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function cartCount(items = readCart()) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function addCartItem(item: Omit<CartItem, "key">) {
  const key = [item.slug, item.size || "", item.color || ""].join("::");
  const cart = readCart();
  const existing = cart.find((entry) => entry.key === key);
  if (existing) existing.quantity += item.quantity;
  else cart.push({ ...item, key });
  writeCart(cart);
  return cart;
}
