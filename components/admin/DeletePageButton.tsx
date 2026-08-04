"use client";

import { useDocumentInfo } from "@payloadcms/ui";
import { useState } from "react";

import styles from "./delete-page-button.module.css";

type DeletePageButtonProps = {
  id?: number | string;
};

export default function DeletePageButton({ id }: DeletePageButtonProps) {
  const { hasDeletePermission, id: documentID } = useDocumentInfo();
  const [status, setStatus] = useState("");
  const resolvedID = id ?? documentID;
  const pageID = resolvedID === undefined || resolvedID === null ? "" : String(resolvedID);

  if (!pageID || hasDeletePermission === false) return null;

  async function deletePage() {
    if (!window.confirm("Delete this page permanently? This cannot be undone.")) return;

    setStatus("Deleting…");

    try {
      const response = await fetch(`/api/pages/${encodeURIComponent(pageID)}?depth=0`, {
        credentials: "same-origin",
        method: "DELETE",
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Payload could not delete this page.");
      }

      window.location.assign("/admin/collections/pages");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete this page.");
    }
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={() => void deletePage()} type="button">
        Delete page
      </button>
      <span aria-live="polite" className={styles.status} role="status">
        {status}
      </span>
    </div>
  );
}
