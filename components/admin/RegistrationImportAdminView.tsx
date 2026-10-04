import { notFound } from "next/navigation";
import { DefaultTemplate } from "@payloadcms/next/templates";
import type { AdminViewServerProps } from "payload";
import { isAdministrator } from "@/lib/crm-access";
import { RegistrationImport } from "./RegistrationImport";
import { CRMDemoNotice } from "./CRMDemoNotice";

export default function RegistrationImportAdminView(props: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = props.initPageResult;
  if (!isAdministrator(req.user)) notFound();
  return <DefaultTemplate {...props} req={req} payload={req.payload} i18n={req.i18n} user={req.user ?? undefined} permissions={permissions} visibleEntities={visibleEntities} locale={locale}><CRMDemoNotice /><RegistrationImport /></DefaultTemplate>;
}
