"use client";

import { useRef, useState, type FormEvent } from "react";
import type { BreakfastRepairJournal, BreakfastRepairPlan } from "@/lib/breakfast-repair";
import styles from "./RegistrationImport.module.css";

const endpoint = "/api/admin/registration-import";
const days = ["friday", "saturday", "sunday"] as const;
const perDay = (quantities: Partial<Record<typeof days[number], number>>) =>
  days.map((day) => `${quantities[day] ?? 0} ${day[0].toUpperCase()}${day.slice(1)}`).join(" · ");

async function send<T>(data: Record<string, unknown>) {
  const response = await fetch(endpoint, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
  });
  const output = await response.json();
  if (!response.ok) throw new Error(output.error || "Breakfast repair is unavailable.");
  return output as T;
}

type Preview = { id: string; plan: BreakfastRepairPlan; fileText: string };

export function BreakfastRepair({ onCompleted }: { onCompleted: () => Promise<void> }) {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const lock = useRef(false);
  const upload = useRef<HTMLFormElement>(null);

  async function run(work: () => Promise<void>) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setStatus("");
    setError("");
    try { await work(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Breakfast repair is unavailable."); }
    finally { lock.current = false; setBusy(false); }
  }

  function review(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    void run(async () => {
      setPreview(null);
      setSelected([]);
      const file = data.get("file");
      const raw = data.get("fileText");
      const pasted = typeof raw === "string" ? raw.trim() : "";
      const uploaded = file instanceof File && file.size > 0;
      if (uploaded && pasted) throw new Error("Provide a single repair file or clear the pasted JSON.");
      if (uploaded && file.size > 64 * 1024) throw new Error("Breakfast repair files are limited to 64 KB.");
      const fileText = uploaded ? await file.text() : pasted;
      if (!fileText) throw new Error("Choose a breakfast repair JSON file or paste its contents.");
      const draft = await send<Omit<Preview, "fileText">>({
        action: "previewBreakfastRepair", fileText, filename: uploaded ? file.name : "Breakfast ticket repair JSON",
      });
      setPreview({ ...draft, fileText });
      setStatus("Breakfast repair preview ready.");
    });
  }

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!preview) return;
    const data = new FormData(event.currentTarget);
    void run(async () => {
      const result = await send<Pick<BreakfastRepairJournal, "counts" | "createdByDay">>({
        action: "confirmBreakfastRepair", fileText: preview.fileText, id: preview.id,
        fingerprint: preview.plan.fingerprint, sources: selected,
        confirmPayment: data.get("confirmed-payment") === "on", confirmScope: data.get("confirmed-scope") === "on",
      });
      setPreview(null);
      setSelected([]);
      upload.current?.reset();
      setStatus(`Breakfast repair complete. Added ${result.counts.breakfasts} tickets across ${result.counts.receipts} receipts. ${perDay(result.createdByDay)}.`);
      await onCompleted();
    });
  }

  const eligible = preview?.plan.rows.filter((row) => row.action === "new") ?? [];
  const selectedCount = eligible.filter((row) => selected.includes(row.sourceKey))
    .reduce((total, row) => total + days.reduce((count, day) => count + (row.missing[day] ?? 0), 0), 0);

  return <section className={styles.panel} aria-labelledby="breakfast-repair-title" aria-busy={busy}>
    <h2 id="breakfast-repair-title">Breakfast ticket repair</h2>
    <p>Preview missing tickets on existing paid Stripe receipts using a breakfast repair JSON file.</p>
    <form ref={upload} onSubmit={review}>
      <label htmlFor="breakfast-repair-file">Breakfast repair JSON file</label>
      <input id="breakfast-repair-file" name="file" type="file" accept=".json,application/json" disabled={busy} />
      <label htmlFor="breakfast-repair-text">Or paste the breakfast repair JSON</label>
      <textarea id="breakfast-repair-text" name="fileText" maxLength={64 * 1024} disabled={busy} />
      <button type="submit" disabled={busy}>Preview breakfast repair</button>
    </form>
    <p role="status" aria-live="polite">{busy ? "Processing breakfast repair…" : status}</p>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    {preview && <form onSubmit={confirm} key={preview.id}>
      <h3>Review breakfast repair</h3>
      <p>{preview.plan.counts.new} receipts ready · {preview.plan.counts.matched} complete · {preview.plan.counts.review} need review.</p>
      <p>{preview.plan.counts.missingTickets} tickets eligible to add. {perDay(preview.plan.missingByDay)}.</p>
      <p>Confirm up to 100 tickets at a time. This preview expires after 30 minutes.</p>
      <button type="button" disabled={busy || !eligible.length} onClick={() => setSelected(eligible.map((row) => row.sourceKey))}>Select all eligible repairs</button>
      <button type="button" disabled={busy || !selected.length} onClick={() => setSelected([])}>Clear repair selection</button>
      <div className={styles.scroll}><table>
        <caption>Breakfast ticket repair by receipt</caption>
        <thead><tr><th scope="col">Repair</th><th scope="col">Receipt</th><th scope="col">Purchased</th><th scope="col">Missing</th><th scope="col">Result</th></tr></thead>
        <tbody>{preview.plan.rows.map((row) => <tr key={row.sourceKey}>
          <td><input aria-label={`Repair ${row.sourceKey}`} type="checkbox" disabled={busy || row.action !== "new"}
            checked={selected.includes(row.sourceKey)} onChange={(event) => setSelected((values) => event.target.checked
              ? [...values, row.sourceKey] : values.filter((value) => value !== row.sourceKey))} /></td>
          <td>{row.sourceKey}</td><td>{perDay(row.expected)}</td><td>{perDay(row.missing)}</td><td>{row.message}</td>
        </tr>)}</tbody>
      </table></div>
      <fieldset disabled={busy}>
        <legend>Confirm breakfast repair</legend>
        <label><input name="confirmed-payment" type="checkbox" required /> I verified these Stripe receipts are paid, captured, and clear of refunds and disputes.</label>
        <label><input name="confirmed-scope" type="checkbox" required /> I reviewed the day and quantity and approve adding only the missing breakfast tickets for the selected receipts.</label>
      </fieldset>
      <button type="submit" disabled={busy || !selected.length || selectedCount > 100}>Add missing breakfast tickets ({selectedCount})</button>
    </form>}
  </section>;
}
