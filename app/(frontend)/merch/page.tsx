import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";

import { MerchandiseCatalog, type MerchandiseItem } from "@/components/site/MerchandiseCatalog";

export const metadata: Metadata = {
  title: "Merchandise | NECYPAA XXXVI",
  description: "Browse NECYPAA XXXVI convention merchandise designs, item types, and prices.",
};

export default async function MerchandisePage() {
  let items: MerchandiseItem[] = [];

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "merchandise",
      depth: 1,
      limit: 100,
      sort: "-featured,name",
      where: { _status: { equals: "published" } },
    });
    items = result.docs as unknown as MerchandiseItem[];
  } catch {
    // The empty catalog remains useful before the collection migration runs.
  }

  return <MerchandiseCatalog items={items} />;
}
