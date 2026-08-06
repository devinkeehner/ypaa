import { ProgramExplorer } from "@/components/site/ProgramExplorer";
import { SiteFrame } from "@/components/site/SiteFrame";
import type { ProgramData } from "@/components/site/program-types";
import { getPublishedProgramData } from "@/lib/program-data";

export default async function ProgramPage() {
  let data: ProgramData = { rooms: [], sessions: [], maps: [] };
  try {
    data = await getPublishedProgramData();
  } catch {
    // The page will remain usable while the new database migration is applying.
  }
  return <SiteFrame mainId="program-main"><main id="program-main"><ProgramExplorer initialData={data} /></main></SiteFrame>;
}
