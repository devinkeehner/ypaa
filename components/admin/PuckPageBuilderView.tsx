import type { DocumentViewServerProps } from "payload";
import { redirect } from "next/navigation";

import type { PageDocument } from "@/puck/types";

export default function PuckPageBuilderView(props: DocumentViewServerProps) {
  const doc = (props.doc || {}) as PageDocument;
  const id = props.id ?? doc.id;
  if (!id) return <div style={{ padding: "2rem" }}><h1>Save this page first</h1><p>The visual builder opens after the page document exists.</p></div>;
  redirect(`/admin/visual-builder/${encodeURIComponent(String(id))}`);
}
