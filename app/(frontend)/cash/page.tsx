import { RegistrationPortal } from "@/components/site/RegistrationPortal";
import { SiteFrame } from "@/components/site/SiteFrame";

export default function CashPage() {
  return <SiteFrame mainId="cash-main"><main id="cash-main"><RegistrationPortal cash /></main></SiteFrame>;
}
