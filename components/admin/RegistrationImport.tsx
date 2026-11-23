"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { ImportPlan } from "@/lib/registration-import";
import type { HistoricalImportPlan } from "@/lib/historical-import";
import { BreakfastRepair } from "./BreakfastRepair";
import { ScholarshipRepair } from "./ScholarshipRepair";
import styles from "./RegistrationImport.module.css";

type Preview = { id: string; format: "tracker_xlsx"; plan: ImportPlan } | { id: string; format: "historical_json"; plan: HistoricalImportPlan };
type History = { id: string; filename: string; format: Preview["format"] | "breakfast_repair" | "scholarship_repair"; status: string; progress?: string };
const endpoint = "/api/admin/registration-import";
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
export function RegistrationImport() {
  const [preview, setPreview] = useState<Preview | null>(null), [sources, setSources] = useState<string[]>([]);
  const [busy, setBusy] = useState(false), [error, setError] = useState(""), [message, setMessage] = useState("");
  const [history, setHistory] = useState<History[]>([]), [rollback, setRollback] = useState("");
  const [progress, setProgress] = useState("");
  const [selectionLocked, setSelectionLocked] = useState(false);
  const lock = useRef(false);
  const uploadedJson = useRef<File | null>(null);
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
    void execute(async () => {
      setPreview(null); setSources([]); setProgress(""); setSelectionLocked(false); uploadedJson.current = null;
      const data: Preview = await action(form);
      const file = form.get("file");
      if (data.format === "historical_json" && file instanceof File) uploadedJson.current = file;
      setPreview(data);
      setMessage("Preview ready for review.");
    });
  }
  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!preview) return; const form = new FormData(event.currentTarget);
    void execute(async () => {
      const confirmation = JSON.stringify({ action: "confirm", id: preview.id, fingerprint: preview.plan.fingerprint, sources, confirmPayment: form.get("payment") === "on", confirmAttendees: form.get("attendees") === "on", confirmScope: form.get("scope") === "on" });
      if (preview.format === "historical_json") {
        if (!uploadedJson.current) throw new Error("Upload the historical JSON again to confirm.");
        const body = new FormData();
        body.set("file", uploadedJson.current);
        body.set("confirmation", confirmation);
        setSelectionLocked(true);
        try {
          let processed = 0;
          while (true) {
            const result = await action(body);
            if (result.done) {
              const { counts } = result;
              setMessage(`Import complete. ${counts.registrations} paid seats, ${counts.breakfasts} breakfast tickets, ${counts.scholarships} scholarship contributions, and ${counts.merchandise} merchandise units.`);
              break;
            }
            if (result.processed <= processed || result.processed >= result.selected) throw new Error("Import progress could not be verified. Retry the same selection.");
            processed = result.processed;
            setProgress(`Imported ${processed} of ${result.selected} selected payments.`);
          }
        } finally { await loadHistory(); }
      } else {
        const data = await action(confirmation, { "Content-Type": "application/json" });
        setMessage(`Import complete: ${data.result.attendees.length} attendee registrations and ${data.result.seats.length} paid seats. No emails were sent.`);
        await loadHistory();
      }
      setPreview(null); setSources([]); setProgress(""); setSelectionLocked(false); uploadedJson.current = null;
    });
  }
  function reverse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    void execute(async () => { await action(JSON.stringify({ action: "rollback", id: rollback, reason: form.get("reason"), confirmRollback: form.get("rollback") === "on" }), { "Content-Type": "application/json" }); setRollback(""); setMessage("Rollback complete. Imported registrations were cancelled and seats voided. Payment references and contacts were retained."); await loadHistory(); });
  }
  return <section className={styles.page} aria-labelledby="registration-import-title" aria-busy={busy}>
    <h1 id="registration-import-title">Import registrations</h1>
    <form onSubmit={upload} className={styles.panel}>
      <h2>Historical purchases</h2>
      <p>Upload the reconciled JSON file for registrations, breakfast, merchandise, scholarships, and offline receipts. The preview checks every payment against the CRM.</p>
      <label htmlFor="historical-file">Historical import JSON</label><input id="historical-file" name="file" type="file" accept=".json,application/json" required disabled={busy} /><button type="submit" disabled={busy}>Preview JSON</button>
    </form>
    <form onSubmit={upload} className={styles.panel}>
      <h2>Registration-only workbook</h2>
      <p>Upload the complete Stripe/YPAA tracker. In Google Sheets, use File → Download → Microsoft Excel (.xlsx). Each upload is limited to 2 MB.</p>
      <label htmlFor="tracker-file">Tracker workbook</label><input id="tracker-file" name="file" type="file" accept=".xlsx" required disabled={busy} /><button type="submit" disabled={busy}>Preview workbook</button>
    </form>
    <p role="status" aria-live="polite">{progress || (busy ? "Processing…" : message)}</p>{error && <p role="alert" className={styles.error}>{error}</p>}
    {preview?.format === "historical_json" && <form onSubmit={confirm} className={styles.panel} key={preview.id}>
      <h2>Review historical purchases</h2>
      <p>{preview.plan.counts.new} new payments · {preview.plan.counts.matched} already recorded · {preview.plan.counts.conflicts} conflicts · {preview.plan.counts.review} source review entries.</p>
      <p>{preview.plan.counts.registrations} paid seats · {preview.plan.counts.breakfasts} breakfast tickets · {preview.plan.counts.scholarships} scholarship contributions · {preview.plan.counts.merchandise} merchandise units eligible to import.</p>
      <p>Verify that selected payments still qualify. The preview expires after 30 minutes.</p>
      <p>{preview.plan.answerCounts.fellowship} fellowship, {preview.plan.answerCounts.accommodations} accommodation, {preview.plan.answerCounts.interpretation} interpretation, and {preview.plan.answerCounts.mobility} mobility responses present for new records.</p>
      <button type="button" disabled={busy || selectionLocked} onClick={() => setSources(preview.plan.rows.filter((row) => row.action === "new").map((row) => row.sourceKey))}>Select all new payments</button>
      <button type="button" disabled={busy || selectionLocked} onClick={() => setSources([])}>Clear selection</button>
      <div className={styles.scroll}><table>
        <caption>Historical payments and CRM matches</caption>
        <thead><tr><th scope="col">Import</th><th scope="col">Receipt</th><th scope="col">Purchases</th><th scope="col">Result and review notes</th></tr></thead>
        <tbody>{preview.plan.rows.map((row) => <tr key={row.sourceKey}>
          <td><input aria-label={`Import ${row.sourceKey}`} type="checkbox" disabled={busy || selectionLocked || row.action !== "new"} checked={sources.includes(row.sourceKey)} onChange={(event) => setSources((values) => event.target.checked ? [...values, row.sourceKey] : values.filter((source) => source !== row.sourceKey))} /></td>
          <td>{row.source}<br />{row.sourceKey}<br />{usd.format(row.grossCents / 100)}</td>
          <td>{row.registrations} seats ({row.namedAttendees} named)<br />{row.breakfasts} breakfast · {row.scholarships} scholarship · {row.merchandise} merchandise</td>
          <td><strong>{row.action === "matched" ? "Already recorded" : row.action === "new" ? "New" : "Needs review"}</strong><p>{row.message}</p></td>
        </tr>)}</tbody>
      </table></div>
      {!!preview.plan.review.length && <details><summary>Source review ({preview.plan.review.length})</summary><ul>
        {preview.plan.review.map((row, index) => <li key={`${row.sheet}:${row.row}:${index}`}>{row.sheet}, row {row.row} · {row.kind === "excluded" ? "Excluded" : "Needs review"} · {row.reason}</li>)}
      </ul></details>}
      <fieldset disabled={busy}>
        <legend>Confirm selected payments</legend>
        <label><input name="payment" type="checkbox" required /> I verified the selected Stripe payments are paid and clear of refunds or disputes, and the offline receipts are recorded.</label>
        <label><input name="attendees" type="checkbox" required /> I verified the identities and form answers for the selected named attendees.</label>
        <label><input name="scope" type="checkbox" required /> I reviewed the purchase quantities and approve importing the selected new payments.</label>
      </fieldset>
      <button type="submit" disabled={busy || !sources.length}>{selectionLocked ? "Resume selected payments" : "Import selected payments"} ({sources.length})</button>
    </form>}
    {preview?.format === "tracker_xlsx" && <form onSubmit={confirm} className={styles.panel} key={preview.id}>
      <h2>Review preview</h2><p>{preview.plan.counts.new} new sources · {preview.plan.counts.matched} matched · {preview.plan.counts.conflicts} conflicts · {preview.plan.counts.seats} new paid seats · {preview.plan.counts.namedAttendees} named attendees.</p>
      <p>Preview expires after 30 minutes. Tracker dates are Eastern time. This historical tracker does not contain current refund/dispute status; verify selected receipts are still paid or recorded before confirming.</p>
      <button type="button" disabled={busy} onClick={() => setSources(preview.plan.rows.filter((r) => r.action === "new").map((r) => r.sourceKey))}>Select all new sources</button>{" "}<button type="button" disabled={busy} onClick={() => setSources([])}>Clear selection</button>
      <div className={styles.scroll}><table><caption>Registration sources and existing CRM matches</caption><thead><tr><th scope="col">Import</th><th scope="col">Attendee / email</th><th scope="col">Receipt</th><th scope="col">Seats</th><th scope="col">Result and review notes</th></tr></thead><tbody>{preview.plan.rows.map((r) => <tr key={r.sourceKey}><td><input aria-label={`Import ${r.reference}`} type="checkbox" disabled={busy || r.action !== "new"} checked={sources.includes(r.sourceKey)} onChange={(e) => setSources((v) => e.target.checked ? [...v, r.sourceKey] : v.filter((s) => s !== r.sourceKey))} /></td><td>{r.attendees.map((a) => <div key={`${a.name}:${a.email}`}>{a.name}<br />{a.email}</div>)}</td><td>{r.source}<br />{r.reference}<br />{r.priceCents / 100} USD per seat</td><td>{r.quantity}</td><td><strong>{r.action}</strong><p>{r.reason}</p><details><summary>Source notes</summary>{r.warnings.map((w) => <p key={w}>{w}</p>)}{r.errors.map((e) => <p key={e}>{e}</p>)}</details></td></tr>)}</tbody></table></div>
      <details><summary>Excluded records ({preview.plan.counts.excluded})</summary><ul>{preview.plan.excluded.map((r) => <li key={`${r.sheet}:${r.row}`}>{r.sheet}, row {r.row}: {r.reason}</li>)}</ul></details>
      <fieldset disabled={busy}><legend>Confirm selected records</legend><label><input name="payment" type="checkbox" required /> I verified that the selected Stripe receipts remain paid/captured and are not refunded or disputed, and cash receipts are recorded.</label><label><input name="attendees" type="checkbox" required /> I verified the named attendees and email addresses. A cardholder/purchaser may be a different person. Repeated group details create only one named attendee and leave extra seats unassigned.</label><label><input name="scope" type="checkbox" required /> I reviewed the new/matched/conflict results and approve importing only the selected new registration sources.</label></fieldset>
      <button type="submit" disabled={busy || !sources.length}>Import selected registrations ({sources.length})</button>
    </form>}
    <BreakfastRepair onCompleted={loadHistory} />
    <ScholarshipRepair onCompleted={loadHistory} />
    <section className={styles.panel} aria-labelledby="import-history"><h2 id="import-history">Recent imports</h2><p><Link href="/admin/collections/registration-imports">Open full audit history</Link> · <Link href="/admin/registration-corrections">Open Event CRM</Link></p>{history.length ? <ul>{history.map((h) => <li key={h.id}>{h.filename} · {h.status === "in_progress" ? "In progress" : h.status}{h.progress && ` · ${h.progress}`}{h.status === "imported" && h.format === "tracker_xlsx" && <button type="button" disabled={busy} onClick={() => setRollback(h.id)}>Review rollback</button>}</li>)}</ul> : <p>No imports have started.</p>}
      {rollback && <form onSubmit={reverse}><h3>Roll back import</h3><p>Cancel this batch’s imported registrations and void its seats. Payment references and contacts remain for audit. A later correction, assignment or check-in blocks rollback.</p><label htmlFor="rollback-reason">Reason</label><textarea id="rollback-reason" name="reason" required maxLength={2000} disabled={busy} /><label><input type="checkbox" name="rollback" required disabled={busy} /> I confirm cancelling this import’s registrations and voiding its paid seats.</label><button type="submit" disabled={busy}>Confirm rollback</button><button type="button" disabled={busy} onClick={() => setRollback("")}>Keep import</button></form>}
    </section>
  </section>;
}
