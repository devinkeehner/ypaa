import type { MerchandiseItem } from "@/components/site/merch";

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
    type: "t-shirt",
    price: 25,
    inventory: [
      { id: "escape-black-s", size: "S", color: "Black", quantity: 6 },
      { id: "escape-black-m", size: "M", color: "Black", quantity: 10 },
      { id: "escape-black-l", size: "L", color: "Black", quantity: 8 },
      { id: "escape-black-xl", size: "XL", color: "Black", quantity: 5 },
      { id: "escape-cream-m", size: "M", color: "Cream", quantity: 4 },
      { id: "escape-cream-l", size: "L", color: "Cream", quantity: 3 },
    ],
    available: true,
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
    type: "crewneck",
    price: 45,
    inventory: [
      { id: "hartford-charcoal-s", size: "S", color: "Charcoal", quantity: 3 },
      { id: "hartford-charcoal-m", size: "M", color: "Charcoal", quantity: 7 },
      { id: "hartford-charcoal-l", size: "L", color: "Charcoal", quantity: 7 },
      { id: "hartford-rust-xl", size: "XL", color: "Rust", quantity: 2 },
    ],
    available: true,
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
    type: "hat",
    price: 25,
    inventory: [{ id: "thirty-six-black", size: "Adjustable", color: "Black", quantity: 12 }],
    available: true,
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
    type: "hoodie",
    price: 55,
    inventory: [
      { id: "portal-black-m", size: "M", color: "Black", quantity: 5 },
      { id: "portal-black-l", size: "L", color: "Black", quantity: 5 },
      { id: "portal-purple-l", size: "L", color: "Deep purple", quantity: 2 },
      { id: "portal-purple-xl", size: "XL", color: "Deep purple", quantity: 0 },
    ],
    available: true,
  },
];
