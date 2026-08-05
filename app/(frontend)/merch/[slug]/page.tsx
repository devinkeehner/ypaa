import type { Metadata } from "next";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import { ProductDetail } from "@/components/site/ProductDetail";
import type { MerchandiseItem } from "@/components/site/merch";
import { sampleMerchandise } from "../sample-data";

type ProductPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sample = sampleMerchandise.find((item) => item.slug === slug);
  return { title: `${sample?.name || "Merchandise"} | NECYPAA XXXVI` };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  let item: MerchandiseItem | undefined;
  let useSamples = true;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "merchandise", depth: 1, limit: 1, where: { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] } });
    item = result.docs[0] as unknown as MerchandiseItem | undefined;
    if (!item) {
      const published = await payload.find({ collection: "merchandise", depth: 0, limit: 1, where: { _status: { equals: "published" } } });
      useSamples = published.totalDocs === 0;
    }
  } catch {
    // Sample merchandise remains available before real products are published.
  }

  if (!item && useSamples) item = sampleMerchandise.find((sample) => sample.slug === slug);
  if (!item || item.available === false) notFound();
  return <ProductDetail item={item} />;
}
