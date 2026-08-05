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
  sizes?: string | null;
  colors?: string | null;
  available?: boolean | null;
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

export function parseProductOptions(value?: string | null) {
  return (value || "")
    .split(/[,\n]/)
    .map((option) => option.trim())
    .filter(Boolean);
}
