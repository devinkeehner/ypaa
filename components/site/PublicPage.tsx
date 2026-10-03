import { PublicPuckRender } from "@/puck/config";
import type { NECYPAAData } from "@/puck/types";
import styles from "@/puck/puck.module.css";
import { SiteFrame } from "./SiteFrame";

export function PublicPage({ data, homepageNow }: { data: NECYPAAData; homepageNow?: number }) {
  return (
    <SiteFrame mainId="cms-main">
      <div className={styles.publicCanvas} id="cms-main"><PublicPuckRender data={data} homepageNow={homepageNow} /></div>
    </SiteFrame>
  );
}
