import config from "@payload-config";
import { notFound } from "next/navigation";
import { getPayload } from "payload";

import { PublicPage } from "@/components/site/PublicPage";
import { defaultPageData } from "@/puck/default-data";
import { pageDocumentToPuckData } from "@/puck/page-data";
import type { PageDocument } from "@/puck/types";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  let data = null;

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "pages",
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    });
    const page = result.docs[0];

    if (page) {
      data = pageDocumentToPuckData(page as unknown as PageDocument);
    }
  } catch {
    // Keep the prototype homepage available while the database is unavailable.
  }

  if (data) return <PublicPage data={data} />;
  if (slug === "home") return <PublicPage data={defaultPageData} />;
  notFound();
}
