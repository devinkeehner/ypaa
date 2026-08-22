import { RegistrationPortal } from "@/components/site/RegistrationPortal";
import { SiteFrame } from "@/components/site/SiteFrame";

export default function RegisterPage() {
  return <SiteFrame mainId="register-main"><main id="register-main"><RegistrationPortal /></main></SiteFrame>;
}
