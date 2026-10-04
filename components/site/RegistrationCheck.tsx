"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./RegistrationCheck.module.css";

export function RegistrationCheck({ heading = "Check your registration", intro = "Enter the email address used for your registration. We will email your registration information.", isEditing = false }: { heading?: string; intro?: string; isEditing?: boolean }) {
  const id = useId();
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const busy = useRef(false);
  const [pending, setPending] = useState<"check" | "help" | null>(null);
  const [messages, setMessages] = useState<Record<string, { text: string; error: boolean }>>({});
  const [sent, setSent] = useState<Record<string, boolean>>({});
  async function submit(event: FormEvent<HTMLFormElement>, mode: "check" | "help") {
    event.preventDefault();
    if (isEditing || busy.current || sent[mode]) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    busy.current = true;
    setPending(mode);
    setMessages((value) => ({ ...value, [mode]: { text: "Submitting…", error: false } }));
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/registration-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, mode, startedAt: startedAt.current }) });
      const result = await response.json();
      if (typeof result.message !== "string") throw new Error();
      setMessages((value) => ({ ...value, [mode]: { text: result.message, error: !response.ok } }));
      if (response.ok) setSent((value) => ({ ...value, [mode]: true }));
    } catch {
      setMessages((value) => ({ ...value, [mode]: { text: "We could not submit your request. Please try again.", error: true } }));
    } finally { busy.current = false; setPending(null); }
  }
  const honeypot = <label className={styles.trap} aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>;
  const status = (mode: "check" | "help") => <p id={`${id}-${mode}-status`} role={messages[mode]?.error ? "alert" : "status"} className={styles.status}>{messages[mode]?.text || ""}</p>;
  return <section className={styles.container} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>{heading}</h2><p>{intro}</p>
    {isEditing ? <p>Form preview. Submissions are disabled in the visual editor.</p> : null}
    <form onSubmit={(event) => void submit(event, "check")} aria-busy={pending === "check"}>
      <label htmlFor={`${id}-email`}>Registration email address</label>
      <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required disabled={isEditing} aria-describedby={`${id}-check-status`} onChange={() => { setSent((value) => ({ ...value, check: false })); setMessages((value) => ({ ...value, check: { text: "", error: false } })); }} />
      {honeypot}<button type="submit" disabled={isEditing || pending !== null || sent.check}>{pending === "check" ? "Sending…" : sent.check ? "Request received" : "Email my registration information"}</button>{status("check")}
    </form>
    <details className={styles.help}><summary>Can’t remember your email, or registered by someone else?</summary>
      <p>Tell the registration team how to reach you and what might help locate your registration. Please do not include payment card details or sensitive personal information.</p>
      <form onSubmit={(event) => void submit(event, "help")} aria-busy={pending === "help"}>
        <label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} required disabled={isEditing || sent.help} />
        <label htmlFor={`${id}-contact`}>Email where we can contact you</label><input id={`${id}-contact`} name="email" type="email" autoComplete="email" maxLength={254} required disabled={isEditing || sent.help} />
        <label htmlFor={`${id}-details`}>How can we help?</label><textarea id={`${id}-details`} name="details" rows={4} maxLength={1000} required disabled={isEditing || sent.help} aria-describedby={`${id}-details-hint ${id}-help-status`} />
        <p id={`${id}-details-hint`}>For example: the name used to register, or the person who registered you. Only the registration team receives this request.</p>
        {honeypot}<button type="submit" disabled={isEditing || pending !== null || sent.help}>{pending === "help" ? "Submitting…" : sent.help ? "Help request received" : "Request registration help"}</button>{status("help")}
      </form>
    </details>
  </section>;
}
