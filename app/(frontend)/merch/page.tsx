import config from "@payload-config";
import type { Metadata } from "next";
import { getPayload } from "payload";

import { MerchandiseCatalog, type MerchandiseItem } from "@/components/site/MerchandiseCatalog";

export const metadata: Metadata = {
  title: "Merchandise | NECYPAA XXXVI",
  description: "Browse and order NECYPAA XXXVI convention merchandise.",
};

export const dynamic = "force-dynamic";

export default async function MerchandisePage() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "merchandise",
    draft: false,
    depth: 1,
    limit: 100,
    sort: "-featured,name",
    where: {
      and: [{ _status: { equals: "published" } }, { available: { equals: true } }],
    },
  });
  const items = result.docs.filter(
    (doc) => (doc as typeof doc & { showInMainStore?: boolean | null }).showInMainStore !== false,
  );
  return <MerchandiseCatalog items={items as unknown as MerchandiseItem[]} />;
}
