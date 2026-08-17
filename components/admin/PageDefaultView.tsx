import { DefaultEditView } from "@payloadcms/ui";
import type { DocumentViewServerProps } from "payload";

import PageCreateView from "./PageCreateView";

export default function PageDefaultView(props: DocumentViewServerProps) {
  if (props.routeSegments.at(-1) === "create") return <PageCreateView />;

  const {
    BeforeDocumentControls,
    Description,
    EditMenuItems,
    LivePreview,
    PreviewButton,
    PublishButton,
    SaveButton,
    SaveDraftButton,
    Status,
    UnpublishButton,
    Upload,
    UploadControls,
    documentSubViewType,
    formState,
    viewType,
  } = props;

  return (
    <DefaultEditView
      BeforeDocumentControls={BeforeDocumentControls}
      Description={Description}
      EditMenuItems={EditMenuItems}
      LivePreview={LivePreview}
      PreviewButton={PreviewButton}
      PublishButton={PublishButton}
      SaveButton={SaveButton}
      SaveDraftButton={SaveDraftButton}
      Status={Status}
      UnpublishButton={UnpublishButton}
      Upload={Upload}
      UploadControls={UploadControls}
      documentSubViewType={documentSubViewType}
      formState={formState}
      viewType={viewType}
    />
  );
}
