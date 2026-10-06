"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { CalendarDays, Hotel, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { HOTEL_REQUEST_HEADING, HOTEL_REQUEST_INTRO, easternToday, validateHotelRequest } from "@/lib/hotel-request-validation";
import styles from "./HotelRequest.module.css";

export function HotelRequest({ heading = HOTEL_REQUEST_HEADING, intro = HOTEL_REQUEST_INTRO, isEditing = false }: { heading?: string; intro?: string; isEditing?: boolean }) {
  const id = useId(), startedAt = useRef(0), busy = useRef(false);
  const [pending, setPending] = useState(false), [sent, setSent] = useState(false);
  const [arrival, setArrival] = useState("");
  const today = easternToday();
  const [message, setMessage] = useState<{ text: string; error: boolean }>({ text: "", error: false });
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const disabled = isEditing || pending || sent;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabled || busy.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    try { validateHotelRequest(data); }
    catch (error) { setMessage({ text: error instanceof Error ? error.message : "Please check your form.", error: true }); return; }
    busy.current = true; setPending(true); setMessage({ text: "Saving your request…", error: false });
    try {
      const response = await fetch("/api/hotel-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, startedAt: startedAt.current }) });
      const result = await response.json();
      if (typeof result.message !== "string") throw new Error();
      setMessage({ text: result.message, error: !response.ok });
      if (response.ok) setSent(true);
    } catch { setMessage({ text: "We could not save your request. Please try again.", error: true }); }
    finally { busy.current = false; setPending(false); }
  }
  return <section className={styles.container} aria-labelledby={`${id}-heading`}>
    <div className={styles.introduction}>
      <span className={styles.eyebrow}><Hotel size={18} aria-hidden="true" /> NECYPAA XXXVI · Hotel requests</span>
      <h2 id={`${id}-heading`}>{heading}</h2>
      {intro ? <p className={styles.intro}>{intro}</p> : null}
      <div className={styles.steps} aria-label="What happens next">
        <p><CalendarDays size={20} aria-hidden="true" /><span><strong>Share your plans</strong>Choose your dates and the number of rooms you need.</span></p>
        <p><Mail size={20} aria-hidden="true" /><span><strong>We’ll follow up</strong>The committee will review your request and contact you.</span></p>
      </div>
      <p className={styles.notice}>Submitting this form does not reserve a room or guarantee availability or a rate. Please wait for the committee’s follow-up before making booking arrangements.</p>
    </div>
    <div className={styles.panel}>
      <div className={styles.panelHeading}><span className={styles.dot} /><strong>Your stay, your details</strong><span>All fields required except notes</span></div>
      {isEditing ? <p className={styles.preview}>Editor preview · submissions disabled.</p> : null}
      <form onSubmit={(event) => void submit(event)} aria-busy={pending}>
        <fieldset disabled={disabled} className={styles.fields}>
          <div className={styles.full}><label htmlFor={`${id}-name`}>Your name</label><input id={`${id}-name`} name="name" autoComplete="name" maxLength={100} required /></div>
          <div><label htmlFor={`${id}-email`}>Email address</label><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required /></div>
          <div><label htmlFor={`${id}-phone`}>Phone number</label><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" maxLength={32} required /></div>
          <div><label htmlFor={`${id}-arrival`}>Arrival date</label><input id={`${id}-arrival`} name="arrivalDate" type="date" min={today || undefined} required onChange={(event) => setArrival(event.target.value)} /></div>
          <div><label htmlFor={`${id}-departure`}>Departure date</label><input id={`${id}-departure`} name="departureDate" type="date" min={arrival || today || undefined} required /></div>
          <div className={styles.full}><label htmlFor={`${id}-rooms`}>Number of rooms</label><input id={`${id}-rooms`} name="numberOfRooms" type="number" min={1} max={10} step={1} defaultValue={1} required className={styles.roomCount} /></div>
          <div className={styles.full}><label htmlFor={`${id}-notes`}>Anything else we should know? <span>Optional</span></label><textarea id={`${id}-notes`} name="notes" rows={3} maxLength={1000} aria-describedby={`${id}-hint`} /><small id={`${id}-hint`}>Please omit payment information and sensitive personal details.</small></div>
          <label className={styles.trap} aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </fieldset>
        <button type="submit" disabled={disabled}>{sent ? <CheckCircle2 size={20} aria-hidden="true" /> : null}{pending ? "Saving…" : sent ? "Request saved" : "Send hotel request"}{!sent ? <ArrowRight size={18} aria-hidden="true" /> : null}</button>
        <p className={styles.status} role={message.error ? "alert" : "status"}>{message.text}</p>
      </form>
    </div>
  </section>;
}
