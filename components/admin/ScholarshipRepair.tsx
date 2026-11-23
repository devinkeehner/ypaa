"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./RegistrationImport.module.css";

const endpoint = "/api/admin/registration-import";
const maxBytes = 64 * 1024;
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const currency = (cents: number) => usd.format(cents / 100);
const rowStatus = { new: "Ready to add", matched: "Already recorded", review: "Needs review" } as const;

type RepairRow = {
  sourceKey: string;
  action: keyof typeof rowStatus;
  amountCents: number;
  priceCents: number;
  allocatedCents: number;
  message: string;
};
type Preview = { id: string; plan: {
  fingerprint: string;
  rows: RepairRow[];
  counts: { new: number; matched: number; review: number; principalCents: number; allocatedCents: number };
} };
type Confirmation = { id: string; counts: { contributions: number; principalCents: number; allocatedCents: number } };

async function send<T>(body: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) throw new Error(data?.error || "Scholarship repair is unavailable. Retry the same action.");
  return data as T;
}

export function ScholarshipRepair({ onCompleted }: { onCompleted: () => Promise<void> }) {
  const [preview, setPreview] = useState<(Preview & { fileText: string }) | null>(null);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  const upload = useRef<HTMLFormElement>(null);

  async function run(action: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setStatus("");
    setError("");
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Scholarship repair is unavailable.");
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void run(async () => {
      setPreview(null);
      setSelected(new Set());
      const file = data.get("file");
      const raw = data.get("fileText");
      const pasted = typeof raw === "string" ? raw.trim() : "";
      const uploaded = file instanceof File && file.size > 0;
      if (uploaded && pasted) throw new Error("Choose a file or paste the JSON. Clear the other input.");
      if (uploaded && file.size > maxBytes) throw new Error("The scholarship repair JSON must be 64 KB or smaller.");
      const fileText = uploaded ? await file.text() : pasted;
      if (!fileText) throw new Error("Choose a scholarship repair JSON file or paste its contents.");
      if (new TextEncoder().encode(fileText).byteLength > maxBytes) throw new Error("The scholarship repair JSON must be 64 KB or smaller.");
      const result = await send<Preview>({
        action: "previewScholarshipRepair", fileText, filename: uploaded ? file.name : "Scholarship fund repair JSON",
      });
      setPreview({ ...result, fileText });
      setStatus("Scholarship repair preview ready.");
    });
  }

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview || !selected.size) return;
    const data = new FormData(event.currentTarget);
    void run(async () => {
      const { counts } = await send<Confirmation>({
        action: "confirmScholarshipRepair", id: preview.id, fileText: preview.fileText,
        fingerprint: preview.plan.fingerprint, sources: [...selected],
        confirmPayment: data.get("confirmed-payment") === "on", confirmScope: data.get("confirmed-scope") === "on",
      });
      setPreview(null);
      setSelected(new Set());
      upload.current?.reset();
      setStatus(`Scholarship repair complete. Added ${counts.contributions} ${counts.contributions === 1 ? "contribution" : "contributions"} totaling ${currency(counts.principalCents)}, with ${currency(counts.allocatedCents)} allocated to seats.`);
      await onCompleted();
    });
  }

  function updateSelection(sourceKey: string, checked: boolean) {
    setSelected((prior) => {
      const next = new Set(prior);
      if (checked) next.add(sourceKey);
      else next.delete(sourceKey);
      return next;
    });
  }

  const eligible = preview?.plan.rows.filter((row) => row.action === "new") ?? [];

  return <section className={styles.panel} aria-labelledby="scholarship-repair-title" aria-busy={busy}>
    <h2 id="scholarship-repair-title">Scholarship fund repair</h2>
    <p>Review missing scholarship contributions against existing paid Stripe checkouts and recorded offline receipts.</p>
    <form ref={upload} onSubmit={review}>
      <label htmlFor="scholarship-repair-file">Scholarship repair JSON file</label>
      <input id="scholarship-repair-file" name="file" type="file" accept=".json,application/json" disabled={busy} />
      <label htmlFor="scholarship-repair-text">Or paste the scholarship repair JSON</label>
      <textarea id="scholarship-repair-text" name="fileText" maxLength={maxBytes} spellCheck={false} disabled={busy} />
      <button type="submit" disabled={busy}>Preview scholarship repair</button>
    </form>
    <p role="status" aria-live="polite">{busy ? "Processing scholarship repair…" : status}</p>
    {error ? <p role="alert" className={styles.error}>{error}</p> : null}
    {preview ? <form onSubmit={confirm} key={preview.id}>
      <h3>Review scholarship repair</h3>
      <p>{preview.plan.counts.new} ready to add · {preview.plan.counts.matched} already recorded · {preview.plan.counts.review} need review.</p>
      <p>Principal {currency(preview.plan.counts.principalCents)} · allocated to seats {currency(preview.plan.counts.allocatedCents)}.</p>
      <p>Confirm up to 60 receipts within 30 minutes of previewing the file.</p>
      <button type="button" disabled={busy || !eligible.length} onClick={() => setSelected(new Set(eligible.map((row) => row.sourceKey)))}>Select all eligible scholarship repairs</button>
      <button type="button" disabled={busy || !selected.size} onClick={() => setSelected(new Set())}>Clear scholarship repair selection</button>
      <div className={styles.scroll}>
        <table>
          <caption>Scholarship contribution repair by receipt</caption>
          <thead><tr><th scope="col">Repair</th><th scope="col">Receipt</th><th scope="col">Principal</th><th scope="col">Seat price</th><th scope="col">Allocated</th><th scope="col">Result</th></tr></thead>
          <tbody>{preview.plan.rows.map((row) => <tr key={row.sourceKey}>
            <td><input aria-label={`Repair scholarship for ${row.sourceKey}`} type="checkbox" disabled={busy || row.action !== "new"}
              checked={selected.has(row.sourceKey)} onChange={(event) => updateSelection(row.sourceKey, event.target.checked)} /></td>
            <td>{row.sourceKey}</td>
            <td>{currency(row.amountCents)}</td>
            <td>{currency(row.priceCents)}</td>
            <td>{currency(row.allocatedCents)}</td>
            <td><strong>{rowStatus[row.action]}</strong><p>{row.message}</p></td>
          </tr>)}</tbody>
        </table>
      </div>
      {eligible.length ? <>
        <fieldset disabled={busy}>
          <legend>Confirm scholarship repair</legend>
          <label><input name="confirmed-payment" type="checkbox" required /> I verified the scholarship principal against the source records. The Stripe payments are paid, captured, and clear of refunds and disputes, and the offline receipts are recorded.</label>
          <label><input name="confirmed-scope" type="checkbox" required /> I reviewed the amounts and approve adding the selected missing scholarship contributions.</label>
        </fieldset>
        <button type="submit" disabled={busy || !selected.size}>Add missing scholarship contributions ({selected.size})</button>
      </> : null}
    </form> : null}
  </section>;
}
