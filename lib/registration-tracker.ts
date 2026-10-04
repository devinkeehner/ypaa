import { createHash } from "node:crypto";
import { posix } from "node:path";
import { unzipSync, strFromU8 } from "fflate";
import { XMLParser } from "fast-xml-parser";

export class ImportError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export type TrackerRow = {
  sourceKey: string; reference: string; source: "stripe" | "cash";
  purchasedAt: string; priceCents: number; totalCents: number; feeCents: number;
  quantity: number; attendees: Array<{ name: string; email: string }>;
  warnings: string[]; errors: string[]; sourceRows: number[];
};
export type TrackerData = { rows: TrackerRow[]; excluded: Array<{ sheet: string; row: number; reason: string }>; digest: string };
type RecordValue = Record<string, unknown>;
const obj = (v: unknown): RecordValue => v && typeof v === "object" && !Array.isArray(v) ? v as RecordValue : {};
const list = (v: unknown): unknown[] => v == null ? [] : Array.isArray(v) ? v : [v];
const text = (v: unknown): string => typeof v === "string" || typeof v === "number" ? String(v).trim() : "";
export const importDigest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const xml = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@", removeNSPrefix: true, parseTagValue: false, parseAttributeValue: false, trimValues: false, processEntities: true });
const headers = {
  Registrations: ["Date", "First Name", "Last Name", "Full Name", "Email", "Ticket Type", "Ticket Value", "Payment Amount", "Payment Method", "Charge / Customer ID", "Reporting Category"],
  Payments: ["Created", "Net Deposited", "Gross Charged", "Stripe Fees", "Registration Ticket Value", "Breakfast Ticket Value", "Currency", "Charge ID", "Attendee Name", "Attendee Email", "Reporting Category", "Has Registration", "Has Breakfast", "Has Scholarship", "$35 Registrations", "$40 Registrations", "Scholarship Qty", "Breakfast Count", "Friday Breakfast Qty", "Saturday Breakfast Qty", "Sunday Breakfast Qty", "$45 Registrations"],
  "Cash Transactions": ["Recorded Date (ET)", "Customer", "Email", "Type", "Cash Amount", "Price", "Registrations", "Fund Amount", "Ticket Equivalents", "Customer ID", "Amount Basis", "Redemption / Correlation ID"],
};

// Only OOXML values are read. Formulas, macros, hyperlinks and external links are never executed.
export function trackerSheets(bytes: Uint8Array): Record<string, string[][]> {
  if (!bytes.length || bytes.length > 2 * 1024 * 1024) throw new ImportError("Upload an .xlsx tracker of at most 2 MB.", 413);
  let expanded = 0, entries = 0;
  const wanted = /^(xl\/workbook\.xml|xl\/_rels\/workbook\.xml\.rels|xl\/sharedStrings\.xml|xl\/worksheets\/sheet\d+\.xml)$/;
  let files: ReturnType<typeof unzipSync>;
  try {
    files = unzipSync(bytes, { filter: (file) => {
      if (++entries > 500 || file.originalSize > 8 * 1024 * 1024 || (expanded += file.originalSize) > 24 * 1024 * 1024) throw new ImportError("The workbook is too large when expanded.", 413);
      return wanted.test(file.name);
    } });
  } catch (error) { if (error instanceof ImportError) throw error; throw new ImportError("This is not a readable .xlsx workbook."); }
  const readXML = (path: string) => {
    if (!files[path]) throw new ImportError("The workbook is missing a required sheet or its contents.");
    const raw = strFromU8(files[path]);
    if (/<!DOCTYPE|<!ENTITY/i.test(raw)) throw new ImportError("Workbook XML entities are not supported.");
    return obj(xml.parse(raw));
  };
  const richText = (v: unknown): string => {
    const value = obj(v);
    const contents = (t: unknown): string => typeof t === "string" ? t : typeof t === "number" ? String(t) : typeof obj(t)["#text"] === "string" ? obj(t)["#text"] as string : "";
    // Spaces inside rich-text runs separate names and must survive concatenation.
    return (typeof v === "string" ? v : contents(value.t) || list(value.r).map((run) => contents(obj(run).t)).join("")).trim();
  };
  const strings = files["xl/sharedStrings.xml"] ? list(obj(readXML("xl/sharedStrings.xml").sst).si).map(richText) : [];
  const relationships = new Map(list(obj(readXML("xl/_rels/workbook.xml.rels").Relationships).Relationship).map((r) => [text(obj(r)["@Id"]), text(obj(r)["@Target"])]));
  const result: Record<string, string[][]> = {};
  for (const s of list(obj(obj(readXML("xl/workbook.xml").workbook).sheets).sheet)) {
    const sheet = obj(s), name = text(sheet["@name"]);
    if (!(name in headers) && !["Breakfast Tickets", "Scholarship Fund", "Merchandise", "Manual Ledger"].includes(name)) continue;
    const target = relationships.get(text(sheet["@id"]));
    if (!target || result[name]) throw new ImportError("Duplicate or missing workbook sheets.");
    const path = posix.normalize(target.startsWith("/") ? target.slice(1) : `xl/${target}`);
    if (!wanted.test(path)) throw new ImportError("Unsupported workbook sheet path.");
    const matrix: string[][] = [];
    for (const rawRow of list(obj(obj(readXML(path).worksheet).sheetData).row)) {
      const row = obj(rawRow), rowIndex = Number(row["@r"]);
      if (!Number.isInteger(rowIndex) || rowIndex < 1 || rowIndex > 5001 || matrix[rowIndex - 1]) throw new ImportError("Invalid or excessive workbook rows.");
      const cells: string[] = [];
      for (const rawCell of list(row.c)) {
        const cell = obj(rawCell), ref = text(cell["@r"]).match(/^([A-Z]{1,2})(\d+)$/);
        if (!ref || Number(ref[2]) !== rowIndex) throw new ImportError("Invalid cell reference.");
        let column = 0; for (const c of ref[1]) column = column * 26 + c.charCodeAt(0) - 64;
        if (column > 64 || cells[column - 1] !== undefined) throw new ImportError("Invalid or excessive workbook columns.");
        let value = text(cell.v);
        if (cell["@t"] === "s") value = strings[Number(value)] ?? "";
        if (cell["@t"] === "inlineStr") value = richText(cell.is);
        if (cell["@t"] === "e") value = "#ERROR";
        // Required source records must contain explicit values, not stale formula caches.
        if (cell.f !== undefined && name in headers) value = "#FORMULA";
        if (value.length > 4000) throw new ImportError("A workbook cell is too long.");
        cells[column - 1] = value;
      }
      matrix[rowIndex - 1] = cells;
    }
    result[name] = matrix;
  }
  for (const [name, expected] of Object.entries(headers)) {
    if (!result[name] || expected.some((h, i) => result[name][0]?.[i] !== h)) throw new ImportError(`Use the complete tracker workbook. The ${name} headers do not match.`);
  }
  return result;
}

function cents(value: string | undefined): number {
  if (!value || !/^\d+(\.\d+)?$/.test(value) || !Number.isFinite(Number(value)) || Number(value) > 100000) throw new ImportError("Invalid amount.");
  const n = Number(value) * 100;
  if (Math.abs(n - Math.round(n)) > 0.0001) throw new ImportError("An amount has fractions of a cent.");
  return Math.round(n);
}
function quantity(value: string | undefined): number {
  const n = Number(value || 0); if (!Number.isInteger(n) || n < 0 || n > 100) throw new ImportError("Invalid registration quantity."); return n;
}
// The tracker records wall-clock dates in Eastern time, not UTC Excel serials.
function date(value: string): string {
  const wall = (Number(value) - 25569) * 86400000;
  if (!Number.isFinite(wall)) throw new ImportError("Invalid registration date.");
  let utc = Math.round(wall);
  const format = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  for (let i = 0; i < 3; i++) {
    const p = Object.fromEntries(format.formatToParts(new Date(utc)).map((part) => [part.type, part.value]));
    utc += Math.round(wall) - Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  }
  if (utc < Date.parse("2026-01-10T22:54:26Z") || utc >= Date.parse("2027-01-01T00:00:00Z")) throw new ImportError("Registration date is outside this event's tracker period.");
  return new Date(utc).toISOString();
}
export function normalizeTracker(sheets: Record<string, string[][]>): TrackerData {
  const rows: TrackerRow[] = [], excluded: TrackerData["excluded"] = [];
  const paymentMap = new Map<string, string[][]>(), cashMap = new Map<string, string[][]>(), roster = new Map<string, Array<{ row: number; values: string[] }>>();
  for (const [index, p] of sheets.Payments.entries()) if (index && p?.some(Boolean)) {
    const id = p[7] || ""; paymentMap.set(id, [...(paymentMap.get(id) || []), p]);
    if (p[11]?.toLowerCase() !== "true") excluded.push({ sheet: "Payments", row: index + 1, reason: "No purchased registration. Other products and fund equivalents excluded." });
  }
  for (const [index, p] of sheets["Cash Transactions"].entries()) if (index && p?.some(Boolean)) {
    if (p[3] === "Registration") cashMap.set(p[9], [...(cashMap.get(p[9]) || []), p]);
    else excluded.push({ sheet: "Cash Transactions", row: index + 1, reason: "Not a recorded registration." });
  }
  for (const [index, r] of sheets.Registrations.entries()) if (index && r?.some(Boolean)) {
    const id = r[9] || ""; roster.set(id, [...(roster.get(id) || []), { row: index + 1, values: r }]);
  }
  for (const [id, records] of roster) {
    const r = records[0].values;
    const row: TrackerRow = { sourceKey: `stripe:csv:${id}`, reference: id, source: r[8] === "Cash" ? "cash" : "stripe", purchasedAt: "", priceCents: 0, totalCents: 0, feeCents: 0, quantity: records.length, attendees: [], warnings: ["Verify attendee details: tracker names can fall back to cardholder names. Purchaser details are not established by this file."], errors: [], sourceRows: records.map((record) => record.row) };
    try {
      if (!/^(ch|py|pi|cus)_[A-Za-z0-9]+$/.test(id)) throw new ImportError("Missing or unsupported stable payment/customer ID.");
      row.priceCents = cents(r[6]); row.totalCents = cents(r[7]); row.purchasedAt = date(r[0]);
      if (![3500, 4000, 4500].includes(row.priceCents) || r[5] !== `$${row.priceCents / 100} Registration`) throw new ImportError("Not a supported purchased registration ticket.");
      const unique = new Map<string, { name: string; email: string }>();
      for (const record of records) {
        const v = record.values, name = v[3]?.trim(), email = v[4]?.trim().toLowerCase();
        if (!name || name.length > 200 || /^(none|not applicable|unknown)$/i.test(name) || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ImportError("Missing or invalid attendee name/email. Resolve in the source before importing.");
        if (v[8] !== r[8] || v[5] !== r[5] || cents(v[6]) !== row.priceCents || cents(v[7]) !== row.totalCents || date(v[0]) !== row.purchasedAt) throw new ImportError("Conflicting duplicate registration source rows.");
        unique.set(`${email}:${name.toLowerCase()}`, { name, email });
      }
      row.attendees = [...unique.values()];
      if (row.attendees.length < row.quantity) row.warnings.push("Repeated attendee details in a group purchase: only distinct confirmed attendees are assigned. Extra paid seats remain unassigned.");
      if (row.source === "stripe") {
        if (r[8] !== "USD" || id.startsWith("cus_")) throw new ImportError("Unsupported Stripe payment method or ID.");
        const matches = paymentMap.get(id) || [];
        if (matches.length !== 1) throw new ImportError("Missing or duplicate payment row.");
        const p = matches[0], qty = quantity(p[14]) + quantity(p[15]) + quantity(p[21]);
        if (p[6] !== "USD" || p[11]?.toLowerCase() !== "true" || qty !== row.quantity || cents(p[4]) !== row.priceCents * row.quantity || cents(p[2]) !== row.totalCents || date(p[0]) !== row.purchasedAt) throw new ImportError("Registration does not reconcile to the payment's purchased ticket quantity/value.");
        row.feeCents = cents(p[24] || "0");
        if (row.feeCents > row.totalCents || row.totalCents < row.priceCents * row.quantity) throw new ImportError("Payment total cannot cover the registration.");
        if (p[12]?.toLowerCase() === "true" || p[13]?.toLowerCase() === "true" || quantity(p[22])) row.warnings.push("Mixed checkout: original gross payment is retained as reference, but only registration records/seats are imported.");
      } else {
        const matches = cashMap.get(id) || [];
        if (!id.startsWith("cus_") || matches.length !== 1) throw new ImportError("Cash registration needs one matching cash transaction.");
        const c = matches[0];
        if (c[11] && !/^[A-Za-z0-9_-]{8,160}$/.test(c[11])) throw new ImportError("Unsupported cash redemption/correlation ID.");
        if (quantity(c[6]) !== row.quantity || cents(c[5]) !== row.priceCents || cents(c[4]) !== row.totalCents || row.totalCents !== row.priceCents * row.quantity) throw new ImportError("Cash registration quantity/value does not reconcile.");
        row.sourceKey = `registration-import:cash:${id}:${c[11] || "legacy-customer"}`;
        if (!c[11]) row.warnings.push("Legacy cash receipt has only a customer ID. Confirm there is exactly one registration for this customer; ambiguous existing customer matches will be blocked.");
        row.warnings.push(`Cash amount basis: ${c[10] || "not recorded"}. Confirm this cash receipt.`);
      }
    } catch (error) { row.errors.push(error instanceof ImportError ? error.message : "Invalid source row."); }
    rows.push(row);
  }
  for (const [id, payments] of paymentMap) if (payments.some((p) => p[11]?.toLowerCase() === "true") && !roster.has(id)) excluded.push({ sheet: "Payments", row: sheets.Payments.findIndex((r) => r?.[7] === id) + 1, reason: "Payment has registrations but no named roster rows. Resolve before importing." });
  for (const name of ["Breakfast Tickets", "Scholarship Fund", "Merchandise", "Manual Ledger"]) for (const [index, r] of (sheets[name] || []).entries()) if (index && r?.some(Boolean) && (name !== "Manual Ledger" || (index > 4 && r[2]))) excluded.push({ sheet: name, row: index + 1, reason: "Excluded sheet. Fund equivalents and unnamed manual totals are not attendee registrations." });
  if (!rows.length) throw new ImportError("No registration records found in this tracker.");
  return { rows, excluded, digest: importDigest({ rows, excluded }) };
}
export const parseTracker = (bytes: Uint8Array) => normalizeTracker(trackerSheets(bytes));
