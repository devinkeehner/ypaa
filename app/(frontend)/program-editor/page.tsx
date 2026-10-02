import config from "@payload-config";
import { getPayload } from "payload";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { canAccessArea } from "@/lib/crm-access";
import { ProgramBoard } from "@/components/admin/ProgramBoard";

export const dynamic = "force-dynamic";
export default async function ProgramEditorPage() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });
  if (!user) redirect("/admin/login?redirect=%2Fprogram-editor");
  if (!canAccessArea(user, "program")) notFound();
  return <ProgramBoard />;
}
