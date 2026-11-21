import { canAccessArea } from "@/lib/crm-access";
import { notFound } from "next/navigation";
import type { AdminViewServerProps } from "payload";

export default function ProgramBoardAdminView(props: AdminViewServerProps) {
  if (!canAccessArea(props.initPageResult.req.user, "program")) notFound();
  return (
    <div style={{ height: "calc(100dvh - var(--app-header-height, 64px))", overflow: "hidden", width: "100%" }}>
      <iframe
        src="/program-editor"
        style={{ border: 0, display: "block", height: "100%", width: "100%" }}
        title="NECYPAA Program Board"
      />
    </div>
  );
}
