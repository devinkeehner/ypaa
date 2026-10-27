"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./CashCodeRequest.module.css";

export function CashCodeRequest({ heading = "Request a cash access code", intro = "Enter your approved email address. We will email you a code for one cash order.", isEditing = false }: { heading?: string; intro?: string; isEditing?: boolean }) {
  const id = useId();
  const startedAt = useRef(0);
  const busy = useRef(false);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState({ text: "", error: false });
  useEffect(() => { startedAt.current = Date.now(); }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEditing || busy.current || sent || !event.currentTarget.reportValidity()) return;
    const data = Object.fromEntries(new FormData(event.currentTarget));
    busy.current = true; setPending(true); setStatus({ text: "Sending…", error: false });
    try {
      const response = await fetch("/api/cash-code-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, startedAt: startedAt.current }) });
      const result = await response.json();
      if (typeof result.message !== "string") throw new Error();
      setStatus({ text: result.message, error: !response.ok });
      if (response.ok) setSent(true);
    } catch { setStatus({ text: "We could not submit your request. Please try again.", error: true }); }
    finally { busy.current = false; setPending(false); }
  }
  return <section className={styles.container} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>{heading}</h2><p>{intro}</p>
    {isEditing ? <p>Form preview. Submissions are disabled in the visual editor.</p> : null}
    <form onSubmit={(event) => void submit(event)} aria-busy={pending}>
      <label htmlFor={`${id}-email`}>Email address</label>
      <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required disabled={isEditing} aria-describedby={`${id}-status`} onChange={() => { setSent(false); setStatus({ text: "", error: false }); }} />
      <label className={styles.trap} aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <button type="submit" disabled={isEditing || pending || sent}>{pending ? "Sending…" : sent ? "Request received" : "Email my access code"}</button>
      <p id={`${id}-status`} role={status.error ? "alert" : "status"} className={styles.status}>{status.text}</p>
    </form>
  </section>;
}
