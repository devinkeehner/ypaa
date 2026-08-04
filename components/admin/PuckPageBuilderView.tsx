import type { DocumentViewServerProps } from "payload";

import { defaultPageData } from "@/puck/default-data";
import type { NECYPAAData, PageDocument } from "@/puck/types";

import { PuckPageBuilderClient } from "./PuckPageBuilderClient";

export default function PuckPageBuilderView(props: DocumentViewServerProps) {
  const doc = (props.doc || {}) as PageDocument;
  const id = props.id ?? doc.id;
  if (!id) return <div style={{ padding: "2rem" }}><h1>Save this page first</h1><p>The visual builder opens after the page document exists.</p></div>;
  return <PuckPageBuilderClient initialData={(doc.builderData as NECYPAAData | null) || defaultPageData} pageId={String(id)} pageTitle={doc.title || "Untitled page"} />;
}
