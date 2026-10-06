"use client";

import { useState } from "react";
import { useAuth, useDocumentInfo } from "@payloadcms/ui";

import { canEditCRM } from "@/lib/crm-access";

export function HotelNotificationRetry() {
  const { id } = useDocumentInfo();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  if (!id || !canEditCRM(user)) return null;
  async function retry() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/admin/hotel-request-notification", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: String(id) }) });
      const result = await response.json();
      setMessage(response.ok ? `Notification status: ${result.status}. Refresh this record to see updated tracking.` : result.error || "Notification could not be retried.");
    } catch { setMessage("Notification could not be retried. The request remains saved."); }
    finally { setBusy(false); }
  }
  return <div style={{ marginBlock: "1rem" }}><button type="button" disabled={busy} onClick={() => void retry()} className="btn btn--style-secondary">{busy ? "Retrying…" : "Retry organizer notification"}</button><p role="status">{message}</p></div>;
}
