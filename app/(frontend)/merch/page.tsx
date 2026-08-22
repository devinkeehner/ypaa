import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Merchandise | NECYPAA XXXVI",
  description: "Browse NECYPAA XXXVI convention merchandise designs, item types, and prices.",
};

export default async function MerchandisePage() {
  notFound();
}
