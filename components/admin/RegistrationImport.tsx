"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { ImportPlan } from "@/lib/registration-import";
import styles from "./RegistrationImport.module.css";

type Preview = { id: string; plan: ImportPlan };
type History = { id: string; filename: string; status: string; confirmedAt?: string };
const endpoint = "/api/admin/registration-import";
export function RegistrationImport() {
  const [preview, setPreview] = useState<Preview | null>(null), [sources, setSources] = useState<string[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  const [history, setHistory] = useState<History[]>([]), [rollback, setRollback] = useState("");
  const lock = useRef(false);
  async function loadHistory() { try { const r = await fetch(endpoint, { cache: "no-store" }); if (r.ok) setHistory((await r.json()).history); } catch { /* The next completed action refreshes history. */ } }
  useEffect(() => {
    const controller = new AbortController();
    void fetch(endpoint, { cache: "no-store", signal: controller.signal }).then(async (r) => { if (r.ok) setHistory((await r.json()).history); }).catch(() => {});
    return () => controller.abort();
  }, []);
  async function action(body: BodyInit, headers?: HeadersInit) {
    const r = await fetch(endpoint, { method: "POST", body, headers });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || "Import action failed.");
    return data;
  }
  async function execute(work: () => Promise<void>) {
    if (lock.current) return; lock.current = true; setBusy(true); setError(""); setMessage("");
    try { await work(); } catch (e) { setError(e instanceof Error ? e.message : "Import action failed. Please retry."); }
    finally { lock.current = false; setBusy(false); }
  }
  function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    setPreview(null); setSources([]);
    void execute(async () => { const data: Preview = await action(form); setPreview(data); setMessage("Preview ready. No registrations have been imported."); });
  }
  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!preview) return; const form = new FormData(event.currentTarget);
    void execute(async () => {
      const data = await action(JSON.stringify({ action: "confirm", id: preview.id, fingerprint: preview.plan.fingerprint, sources, confirmPayment: form.get("payment") === "on", confirmAttendees: form.get("attendees") === "on", confirmScope: form.get("scope") === "on" }), { "Content-Type": "application/json" });
      setPreview(null); setSources([]); setMessage(`Import complete: ${data.result.attendees.length} attendee registrations and ${data.result.seats.length} paid seats. No emails were sent.`); await loadHistory();
    });
  }
  function reverse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    void execute(async () => { await action(JSON.stringify({ action: "rollback", id: rollback, reason: form.get("reason"), confirmRollback: form.get("rollback") === "on" }), { "Content-Type": "application/json" }); setRollback(""); setMessage("Rollback complete. Imported registrations were cancelled and seats voided. Payment references and contacts were retained."); await loadHistory(); });
  }
  return <section className={styles.page} aria-labelledby="registration-import-title" aria-busy={busy}>
    <h1 id="registration-import-title">Import registrations</h1>
    <p>Upload the complete Stripe/YPAA tracker as an Excel workbook (.xlsx, up to 2 MB). In Google Sheets use File → Download → Microsoft Excel (.xlsx).</p>
    <p>Only purchased registration seats and confirmed named attendees are included. Breakfasts, merchandise, scholarship fund equivalents and unnamed manual totals are excluded. Existing CRM records remain unchanged. Imports send no emails.</p>
    <form onSubmit={upload} className={styles.panel}><label htmlFor="tracker-file">Tracker workbook</label><input id="tracker-file" name="file" type="file" accept=".xlsx" required disabled={busy} /><button type="submit" disabled={busy}>Preview workbook</button></form>
    <p role="status" aria-live="polite">{busy ? "Processing…" : message}</p>{error && <p role="alert" className={styles.error}>{error}</p>}
    {preview && <form onSubmit={confirm} className={styles.panel} key={preview.id}>
      <h2>Review preview</h2><p>{preview.plan.counts.new} new sources · {preview.plan.counts.matched} matched · {preview.plan.counts.conflicts} conflicts · {preview.plan.counts.seats} new paid seats · {preview.plan.counts.namedAttendees} named attendees.</p>
      <p>Preview expires after 30 minutes. Tracker dates are Eastern time. This historical tracker does not contain current refund/dispute status; verify selected receipts are still paid or recorded before confirming.</p>
      <button type="button" disabled={busy} onClick={() => setSources(preview.plan.rows.filter((r) => r.action === "new").map((r) => r.sourceKey))}>Select all new sources</button>{" "}<button type="button" disabled={busy} onClick={() => setSources([])}>Clear selection</button>
      <div className={styles.scroll}><table><caption>Registration sources and existing CRM matches</caption><thead><tr><th scope="col">Import</th><th scope="col">Attendee / email</th><th scope="col">Receipt</th><th scope="col">Seats</th><th scope="col">Result and review notes</th></tr></thead><tbody>{preview.plan.rows.map((r) => <tr key={r.sourceKey}><td><input aria-label={`Import ${r.reference}`} type="checkbox" disabled={busy || r.action !== "new"} checked={sources.includes(r.sourceKey)} onChange={(e) => setSources((v) => e.target.checked ? [...v, r.sourceKey] : v.filter((s) => s !== r.sourceKey))} /></td><td>{r.attendees.map((a) => <div key={`${a.name}:${a.email}`}>{a.name}<br />{a.email}</div>)}</td><td>{r.source}<br />{r.reference}<br />{r.priceCents / 100} USD per seat</td><td>{r.quantity}</td><td><strong>{r.action}</strong><p>{r.reason}</p><details><summary>Source notes</summary>{r.warnings.map((w) => <p key={w}>{w}</p>)}{r.errors.map((e) => <p key={e}>{e}</p>)}</details></td></tr>)}</tbody></table></div>
      <details><summary>Excluded records ({preview.plan.counts.excluded})</summary><ul>{preview.plan.excluded.map((r) => <li key={`${r.sheet}:${r.row}`}>{r.sheet}, row {r.row}: {r.reason}</li>)}</ul></details>
      <fieldset disabled={busy}><legend>Confirm selected records</legend><label><input name="payment" type="checkbox" required /> I verified that the selected Stripe receipts remain paid/captured and are not refunded or disputed, and cash receipts are recorded.</label><label><input name="attendees" type="checkbox" required /> I verified the named attendees and email addresses. A cardholder/purchaser may be a different person. Repeated group details create only one named attendee and leave extra seats unassigned.</label><label><input name="scope" type="checkbox" required /> I reviewed the new/matched/conflict results and approve importing only the selected new registration sources.</label></fieldset>
      <button type="submit" disabled={busy || !sources.length}>Import selected registrations ({sources.length})</button>
    </form>}
    <section className={styles.panel} aria-labelledby="import-history"><h2 id="import-history">Recent imports</h2><p><Link href="/admin/collections/registration-imports">Open full audit history</Link> · <Link href="/admin/registration-corrections">Open Event CRM</Link></p>{history.length ? <ul>{history.map((h) => <li key={h.id}>{h.filename} — {h.status}{h.status === "imported" && <button type="button" disabled={busy} onClick={() => setRollback(h.id)}>Review rollback</button>}</li>)}</ul> : <p>No completed imports.</p>}
      {rollback && <form onSubmit={reverse}><h3>Roll back import</h3><p>Cancel this batch’s imported registrations and void its seats. Payment references and contacts remain for audit. A later correction, assignment or check-in blocks rollback.</p><label htmlFor="rollback-reason">Reason</label><textarea id="rollback-reason" name="reason" required maxLength={2000} disabled={busy} /><label><input type="checkbox" name="rollback" required disabled={busy} /> I confirm cancelling this import’s registrations and voiding its paid seats.</label><button type="submit" disabled={busy}>Confirm rollback</button><button type="button" disabled={busy} onClick={() => setRollback("")}>Keep import</button></form>}
    </section>
  </section>;
}
