import { zipSync, strToU8 } from "fflate";
export function syntheticTracker(options: { reference?: string; email?: string; quantity?: number; cash?: boolean; badTotal?: boolean } = {}) {
  const { reference = "ch_SYNTHETICIMPORT", email = "imported@example.invalid", quantity = 1, cash = false, badTotal = false } = options;
  const date = "46296.5", id = cash ? "cus_SYNTHETICIMPORT" : reference;
  const sheets: Record<string, Array<Array<string | number>>> = {
    Registrations: [["Date", "First Name", "Last Name", "Full Name", "Email", "Ticket Type", "Ticket Value", "Payment Amount", "Payment Method", "Charge / Customer ID", "Reporting Category"]],
    Payments: [["Created", "Net Deposited", "Gross Charged", "Stripe Fees", "Registration Ticket Value", "Breakfast Ticket Value", "Currency", "Charge ID", "Attendee Name", "Attendee Email", "Reporting Category", "Has Registration", "Has Breakfast", "Has Scholarship", "$35 Registrations", "$40 Registrations", "Scholarship Qty", "Breakfast Count", "Friday Breakfast Qty", "Saturday Breakfast Qty", "Sunday Breakfast Qty", "$45 Registrations", "Merchandise Qty", "Allocated Merch Value", "Checkout Fee Line"]],
    "Cash Transactions": [["Recorded Date (ET)", "Customer", "Email", "Type", "Cash Amount", "Price", "Registrations", "Fund Amount", "Ticket Equivalents", "Customer ID", "Amount Basis", "Redemption / Correlation ID"]],
    "Breakfast Tickets": [["Date", "Name"], [date, "Excluded Synthetic Breakfast"]],
    "Scholarship Fund": [["Date", "Name"], [date, "Excluded Synthetic Fund"]],
    Merchandise: [["Date", "Name"], [date, "Excluded Synthetic Hat"]],
    "Manual Ledger": [["Manual Ledger"], [], [], [], ["Entry ID", "Date", "Description"], ["synthetic-ledger", date, "Unnamed registrations"]],
  };
  const total = cash ? 40 * quantity : 45 * quantity + 26;
  for (let i = 0; i < quantity; i++) sheets.Registrations.push([date, "Synthetic", "Attendee", "Synthetic Attendee", email, cash ? "$40 Registration" : "$45 Registration", cash ? 40 : 45, total, cash ? "Cash" : "USD", id, "registration_plus_breakfast_plus_merch"]);
  if (cash) sheets["Cash Transactions"].push([date, "Synthetic Cash Purchaser", "payer@example.invalid", "Registration", total, 40, quantity, 0, 0, id, "Recorded cash metadata", "synthetic-redemption-01"]);
  else sheets.Payments.push([date, total - 2, badTotal ? 1 : total, 2, 45 * quantity, 15, "USD", id, "Synthetic Attendee", email, "registration_plus_breakfast_plus_merch", "true", "true", "false", 0, 0, 0, 1, 1, 0, 0, quantity, 1, 10, 1]);
  sheets.Payments.push([date, 10, 11, 1, 0, 10, "USD", "ch_SYNTHETICBREAKFAST", "Breakfast", "breakfast@example.invalid", "breakfast_only", "false", "true", "false", 0, 0, 0, 1, 1, 0, 0, 0]);
  return workbookFixture(sheets);
}

// Minimal synthetic OOXML test data; never writes or alters a user workbook.
export function workbookFixture(sheets: Record<string, Array<Array<string | number>>>) {
  const escape = (v: unknown) => String(v).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const files: Record<string, Uint8Array> = {};
  const names = Object.keys(sheets);
  const ns = 'xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"';
  files["xl/workbook.xml"] = strToU8(`<x:workbook ${ns} xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><x:sheets>${names.map((name, i) => `<x:sheet name="${escape(name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("")}</x:sheets></x:workbook>`);
  files["xl/_rels/workbook.xml.rels"] = strToU8(`<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${names.map((_, i) => `<Relationship Id="rId${i + 1}" Target="worksheets/sheet${i + 1}.xml"/>`).join("")}</Relationships>`);
  for (const [i, name] of names.entries()) files[`xl/worksheets/sheet${i + 1}.xml`] = strToU8(`<x:worksheet ${ns}><x:sheetData>${sheets[name].map((row, r) => `<x:row r="${r + 1}">${row.map((v, c) => { let col = "", n = c + 1; while (n) { col = String.fromCharCode(65 + (n - 1) % 26) + col; n = Math.floor((n - 1) / 26); } return `<x:c r="${col}${r + 1}" t="inlineStr"><x:is><x:t>${escape(v)}</x:t></x:is></x:c>`; }).join("")}</x:row>`).join("")}</x:sheetData></x:worksheet>`);
  return zipSync(files);
}
