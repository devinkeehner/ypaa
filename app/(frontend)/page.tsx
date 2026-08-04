import config from "@payload-config";
import { getPayload } from "payload";

import { PublicPage } from "@/components/site/PublicPage";
import { defaultPageData } from "@/puck/default-data";
import { pageDocumentToPuckData } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

export default async function Home() {
  let data = defaultPageData;
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "pages", depth: 1, limit: 1, where: { slug: { equals: "home" } } });
    const page = result.docs[0];
    if (page) data = pageDocumentToPuckData(page as unknown as PageDocument);
  } catch {
    // The initial public view remains available before the first D1 migration/page seed.
  }
  return <PublicPage data={data} />;
}
