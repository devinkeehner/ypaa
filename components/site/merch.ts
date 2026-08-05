export type MerchandiseItem = {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  searchTerms?: string | null;
  featured?: boolean | null;
  sample?: boolean | null;
  image?: { url?: string | null; alt?: string | null } | number | string | null;
  type: string;
  price: number;
  inventory?: InventoryOption[] | null;
  available?: boolean | null;
};

export type InventoryOption = {
  id?: string | null;
  size?: string | null;
  color?: string | null;
  sku?: string | null;
  quantity: number;
};

export const merchandiseTypeLabels: Record<string, string> = {
  "t-shirt": "T-shirt",
  "long-sleeve": "Long-sleeve shirt",
  hoodie: "Hoodie",
  crewneck: "Crewneck sweatshirt",
  hat: "Hat",
  sticker: "Sticker",
  pin: "Pin",
  tote: "Tote bag",
  mug: "Mug",
  other: "Other",
};

export function formatMerchandisePrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}

export function inventoryKey(option: InventoryOption, index = 0) {
  return option.id || [option.size || "", option.color || "", option.sku || "", index].join("::");
}

export function inventoryLabel(option: InventoryOption) {
  return [option.color, option.size].filter(Boolean).join(" / ") || "Standard item";
}

export function inStockInventory(item: MerchandiseItem) {
  return (item.inventory || []).filter((option) => option.quantity > 0);
}

export function totalInventory(item: MerchandiseItem) {
  return (item.inventory || []).reduce((total, option) => total + Math.max(0, option.quantity || 0), 0);
}
