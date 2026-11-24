"use client";

import { useRef, useState } from "react";
import { useAuth, useDocumentInfo } from "@payloadcms/ui";
import { canAccessArea } from "@/lib/crm-access";

export function SendMobileAnnouncement() {
  const { id } = useDocumentInfo();
  const { user } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);

  if (!id || !canAccessArea(user, "program", true)) return null;

  async function send() {
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setStatus("");
    setConfirming(false);
    try {
      const response = await fetch("/api/admin/mobile-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcementId: String(id) }),
      });
      const result = await response.json();
      setStatus(response.ok
        ? `Apple accepted ${result.accepted}, rejected ${result.rejected}, and left ${result.unconfirmed} unconfirmed. Accepted means Apple received the request.`
        : result.error || "The alert could not be sent.");
    } catch {
      setStatus("The send result is unavailable. Check its status before attempting another broadcast.");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  return (
    <div style={{ marginBlock: "1rem" }}>
      {confirming ? (
        <>
          <p>Send a push alert for the saved, published version of this announcement to all opted-in devices?</p>
          <button type="button" className="btn btn--style-secondary" onClick={() => void send()}>Send alert</button>
          <button type="button" className="btn btn--style-secondary" onClick={() => setConfirming(false)}>Cancel</button>
        </>
      ) : (
        <button type="button" className="btn btn--style-secondary" disabled={busy} onClick={() => setConfirming(true)}>
          {busy ? "Sending…" : "Send push alert"}
        </button>
      )}
      <p role="status">{status}</p>
    </div>
  );
}
