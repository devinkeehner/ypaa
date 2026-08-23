import config from "@payload-config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import { ProductDetail } from "@/components/site/ProductDetail";
import type { MerchandiseItem } from "@/components/site/merch";

type ProductPageProps = { params: Promise<{ slug: string }> };

async function findProduct(slug: string) {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "merchandise",
    draft: false,
    depth: 1,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: "published" } },
        { available: { equals: true } },
      ],
    },
  });
  return result.docs[0] as unknown as MerchandiseItem | undefined;
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
