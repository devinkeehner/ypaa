import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sampleMerchandise } from "../sample-data";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sample = sampleMerchandise.find((item) => item.slug === slug);
  return { title: `${sample?.name || "Merchandise"} | NECYPAA XXXVI` };
}

export default function ProductPage() {
  notFound();
}
