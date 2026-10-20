import { getMerchandiseCatalog } from "@/lib/merchandise-catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/site/ProductDetail";
import type { MerchandiseItem } from "@/components/site/merch";

export const dynamic = "force-dynamic";

type ProductPageProps = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  const { items } = await getMerchandiseCatalog();
  return items.find((item) => item.slug === slug) as unknown as MerchandiseItem | undefined;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const item = await findProduct((await params).slug);
  return {
    title: `${item?.name || "Merchandise"} | NECYPAA XXXVI`,
    description: item?.description || "NECYPAA XXXVI convention merchandise.",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const item = await findProduct((await params).slug);
  if (!item) notFound();
  return <ProductDetail item={item} />;
}
