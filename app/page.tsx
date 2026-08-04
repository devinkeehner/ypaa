import config from "@payload-config";
import { getPayload } from "payload";

import { PublicPage } from "@/components/site/PublicPage";
import { defaultPageData } from "@/puck/default-data";
import type { NECYPAAData } from "@/puck/types";

export default async function Home() {
  let data = defaultPageData;
  try {
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: "pages", depth: 0, limit: 1, where: { slug: { equals: "home" } } });
    const stored = result.docs[0]?.builderData;
    if (stored && typeof stored === "object") data = stored as NECYPAAData;
  } catch {
    // The initial public view remains available before the first D1 migration/page seed.
  }
  return <PublicPage data={data} />;
}
