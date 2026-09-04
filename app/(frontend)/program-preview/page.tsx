import type { Metadata } from "next";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProgramExplorer } from "@/components/site/ProgramExplorer";
import { getProgramPreviewData } from "@/lib/program-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Program preview | NECYPAA XXXVI",
  robots: { index: false, follow: false },
};

export default async function ProgramPreviewPage() {
  const config = await configPromise;
  const payload = await getPayload({ config: configPromise });
  const requestHeaders = await headers();
  const { permissions, user } = await payload.auth({
    canSetHeaders: false,
    headers: requestHeaders,
  });

  if (!user || !permissions.canAccessAdmin) {
    const loginPath = `${config.routes.admin}${config.admin.routes?.login || "/login"}`;
    redirect(`${loginPath}?redirect=${encodeURIComponent("/program-preview")}`);
  }

  const data = await getProgramPreviewData();

  return (
    <main>
      <div className="program-preview-banner">
        <p><strong>Private preview</strong> Draft and published sessions are shown here. The public Program page remains hidden.</p>
        <Link href="/program-editor">Back to Program Board</Link>
      </div>
      <ProgramExplorer initialData={data} />
    </main>
  );
}
