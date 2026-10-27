import type { Metadata } from "next";
import { CashCodeRequest } from "@/components/site/CashCodeRequest";
import { SiteFrame } from "@/components/site/SiteFrame";

export const metadata: Metadata = { title: "Cash access code | NECYPAA XXXVI", description: "Request a code to record a cash registration order." };

export default function CashCodeRequestPage() {
  return <SiteFrame mainId="cash-code-main"><main id="cash-code-main" style={{ padding: "7rem 1rem 4rem", minHeight: "60vh" }}><CashCodeRequest /></main></SiteFrame>;
}
