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
    sizes: "S, M, L, XL, 2XL, 3XL",
    colors: "Black, Cream",
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
    sizes: "S, M, L, XL, 2XL",
    colors: "Charcoal, Rust",
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
    sizes: "Adjustable",
    colors: "Black",
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
    sizes: "S, M, L, XL, 2XL, 3XL",
    colors: "Black, Deep purple",
    available: true,
  },
];
