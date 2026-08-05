import type { MerchandiseItem } from "@/components/site/MerchandiseCatalog";

const placeholderImage = {
  url: "/images/merch-placeholder.jpg",
  alt: "Placeholder image for a sample NECYPAA merchandise design",
};

export const sampleMerchandise: MerchandiseItem[] = [
  {
    id: "sample-escape-artist",
    name: "Escape Artist",
    slug: "escape-artist",
    description:
      "A bold convention design inspired by finding a way out of the Mad Realm together.",
    searchTerms: "portal recovery fellowship orange black convention",
    featured: true,
    sample: true,
    image: placeholderImage,
    options: [
      { id: "escape-tee", type: "t-shirt", label: "Classic T-shirt", price: 25, sizes: "S–3XL", available: true },
      { id: "escape-hoodie", type: "hoodie", label: "Pullover hoodie", price: 50, sizes: "S–3XL", available: true },
      { id: "escape-sticker", type: "sticker", label: "Die-cut sticker", price: 5, sizes: "3 inches", available: true },
    ],
  },
  {
    id: "sample-hartford-after-dark",
    name: "Hartford After Dark",
    slug: "hartford-after-dark",
    description:
      "A late-night Hartford design for the meetings, dances, and fellowship that keep the convention moving.",
    searchTerms: "hartford connecticut city skyline night dance",
    featured: false,
    sample: true,
    image: placeholderImage,
    options: [
      { id: "hartford-crewneck", type: "crewneck", label: "Midweight crewneck", price: 45, sizes: "S–2XL", available: true },
      { id: "hartford-tote", type: "tote", label: "Canvas tote bag", price: 20, sizes: "One size", available: true },
    ],
  },
  {
    id: "sample-thirty-six-and-free",
    name: "Thirty-Six & Free",
    slug: "thirty-six-and-free",
    description:
      "A clean NECYPAA XXXVI mark built around the convention number and the freedom of recovery.",
    searchTerms: "36 xxxvi number logo simple recovery",
    featured: false,
    sample: true,
    image: placeholderImage,
    options: [
      { id: "thirty-six-hat", type: "hat", label: "Embroidered cap", price: 25, sizes: "Adjustable", available: true },
      { id: "thirty-six-pin", type: "pin", label: "Enamel pin", price: 8, sizes: "1.25 inches", available: true },
      { id: "thirty-six-mug", type: "mug", label: "Ceramic mug", price: 15, sizes: "12 oz.", available: true },
    ],
  },
  {
    id: "sample-mad-realm-portal",
    name: "Mad Realm Portal",
    slug: "mad-realm-portal",
    description:
      "A surreal portal graphic that carries the Escaping the Mad Realm convention theme across several items.",
    searchTerms: "mad realm portal surreal long sleeve sweatshirt",
    featured: false,
    sample: true,
    image: placeholderImage,
    options: [
      { id: "portal-long-sleeve", type: "long-sleeve", label: "Long-sleeve shirt", price: 35, sizes: "S–3XL", available: true },
      { id: "portal-hoodie", type: "hoodie", label: "Heavyweight hoodie", price: 55, sizes: "S–3XL", available: true },
      { id: "portal-stickers", type: "sticker", label: "Sticker two-pack", price: 6, sizes: "Two 3-inch stickers", available: true },
    ],
  },
];
