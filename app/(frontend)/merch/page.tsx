import { getMerchandiseCatalog } from "@/lib/merchandise-catalog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { MerchandiseCatalog, type MerchandiseItem } from "@/components/site/MerchandiseCatalog";

export const metadata: Metadata = {
  title: "Merchandise | NECYPAA XXXVI",
  description: "Browse and order NECYPAA XXXVI convention merchandise.",
};

export const dynamic = "force-dynamic";

export default async function MerchandisePage() {
  const { enabled, items } = await getMerchandiseCatalog();
  if (!enabled) notFound();
  return <MerchandiseCatalog items={items as unknown as MerchandiseItem[]} />;
}
