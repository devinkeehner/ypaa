import config from "@payload-config";
import { getPayload } from "payload";

import { PublicPage } from "@/components/site/PublicPage";
import { defaultPageData } from "@/puck/default-data";
import { pageDocumentToPuckData } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let data = defaultPageData;
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "pages", depth: 1, limit: 1, where: { slug: { equals: "home" } } });
    const page = result.docs[0];
    if (page) data = pageDocumentToPuckData(page as unknown as PageDocument, { materializeRichText: true });
  } catch {
    // Keep the initial public view available before the database is seeded.
  }
  return <PublicPage data={data} />;
}
