import { RegistrationCorrections } from "@/components/admin/RegistrationCorrections";
import { CRMDemoNotice } from "./CRMDemoNotice";
import { DefaultTemplate } from "@payloadcms/next/templates";
import type { AdminViewServerProps } from "payload";

export default function RegistrationCorrectionsAdminView(props: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = props.initPageResult;
  return (
    <DefaultTemplate
      {...props}
      req={req}
      payload={req.payload}
      i18n={req.i18n}
      user={req.user ?? undefined}
      permissions={permissions}
      visibleEntities={visibleEntities}
      locale={locale}
    >
      <CRMDemoNotice />
      <RegistrationCorrections demo={process.env.CRM_DEMO_ISOLATED === "true"} />
    </DefaultTemplate>
  );
}
