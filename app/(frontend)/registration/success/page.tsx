import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { SiteFrame } from "@/components/site/SiteFrame";

export default function RegistrationSuccessPage() {
  return <SiteFrame mainId="registration-success"><main className="registration-page" id="registration-success"><div className="registration-shell registration-complete"><CheckCircle2 /><h1>Thank you</h1><p>Your Stripe payment was completed. A receipt will be sent by Stripe, and any named scholarship recipient will receive a separate notice once email delivery is configured.</p><Link href="/">Return home</Link></div></main></SiteFrame>;
}
