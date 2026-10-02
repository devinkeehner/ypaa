import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { readAndNormalizeCsv, type NormalizedStripePayment } from "@/lib/stripe-csv-import";

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const input = argument("--input");
const output = argument("--output");
if (!input || !output) {
  console.error("Usage: npm run stripe:report -- --input <csv> --output <markdown>");
  process.exit(1);
}

const clean = (value: unknown) => String(value || "").trim();
const comparable = (value: unknown) => clean(value).toLowerCase().replace(/[^a-z0-9]/g, "");
const cell = (value: unknown) => clean(value).replaceAll("|", "\\|").replaceAll("\n", " ") || "—";
const source = (payment: NormalizedStripePayment, field: string) => clean(payment.source[field]);
const attendees = (payment: NormalizedStripePayment) => [
  ...(payment.order.selfRegistration ? [{ name: payment.order.attendee.name, email: payment.order.attendee.email, basis: "registration" }] : []),
  ...(payment.order.scholarship.enabled && payment.order.scholarship.kind === "specific" ? [{ name: payment.order.scholarship.recipientName, email: payment.order.scholarship.recipientEmail, basis: "scholarship" }] : []),
];
const cardLabel = (payment: NormalizedStripePayment) => [source(payment, "Card Brand"), source(payment, "Card Last4") && `•••• ${source(payment, "Card Last4")}`].filter(Boolean).join(" ") || source(payment, "Payment Source Type") || "Unknown";
const fingerprintLabel = (fingerprint: string) => `CARD-${fingerprint.slice(-8).toUpperCase()}`;

const result = await readAndNormalizeCsv(input);
const payments = result.normalized;
const attendeeCandidates = payments.flatMap((payment) => attendees(payment).map((attendee) => ({ payment, ...attendee })));
const cardholderMismatches = attendeeCandidates.filter(({ payment, name }) => source(payment, "Card Name") && comparable(source(payment, "Card Name")) !== comparable(name));
const missingCardholder = attendeeCandidates.filter(({ payment }) => !source(payment, "Card Name"));

const fingerprintGroups = new Map<string, NormalizedStripePayment[]>();
for (const payment of payments) {
  const fingerprint = source(payment, "Card Fingerprint");
  if (!fingerprint) continue;
  fingerprintGroups.set(fingerprint, [...(fingerprintGroups.get(fingerprint) || []), payment]);
}
const repeatedCards = [...fingerprintGroups.entries()].filter(([, group]) => group.length > 1).sort((left, right) => right[1].length - left[1].length);

const emailGroups = new Map<string, typeof attendeeCandidates>();
for (const candidate of attendeeCandidates) {
  const email = clean(candidate.payment.order.purchaserEmail).toLowerCase();
  if (!email || email.endsWith("@stripe-import.invalid")) continue;
  emailGroups.set(email, [...(emailGroups.get(email) || []), candidate]);
}
const repeatedPurchaserEmails = [...emailGroups.entries()]
  .filter(([, group]) => new Set(group.map(({ name }) => comparable(name))).size > 1)
  .sort((left, right) => right[1].length - left[1].length);

const attendeeEmailGroups = new Map<string, typeof attendeeCandidates>();
for (const candidate of attendeeCandidates) {
  const email = clean(candidate.email).toLowerCase();
  if (!email || email.endsWith("@stripe-import.invalid")) continue;
  attendeeEmailGroups.set(email, [...(attendeeEmailGroups.get(email) || []), candidate]);
}
const conflictingAttendeeEmails = [...attendeeEmailGroups.entries()]
  .filter(([, group]) => new Set(group.map(({ name }) => comparable(name))).size > 1);

const duplicatePaymentIds = [...new Set(payments.map((payment) => source(payment, "PaymentIntent ID")).filter((id, index, ids) => id && ids.indexOf(id) !== index))];
const exclusionCounts = new Map<string, number>();
for (const excluded of result.excludedRows) exclusionCounts.set(excluded.reason, (exclusionCounts.get(excluded.reason) || 0) + 1);

const lines = [
  "# Stripe payment repeats and abnormalities",
  "",
  `Generated: ${new Date().toISOString()}`,
  `Source: ${resolve(input)}`,
  "",
  "This is a review queue, not a list of confirmed errors. A different cardholder and attendee is often legitimate when one person pays for another.",
  "",
  "## Summary",
  "",
  `- Source rows: ${result.sourceRows}`,
  `- Included NECYPAA payments: ${payments.length}`,
  `- Excluded rows: ${result.excludedRows.length}`,
  `- Registration or identified scholarship candidates: ${attendeeCandidates.length}`,
  `- Cardholder name differs from attendee: ${cardholderMismatches.length}`,
  `- Registration candidates without a cardholder name: ${missingCardholder.length}`,
  `- Repeated card fingerprints: ${repeatedCards.length}`,
  `- Purchaser emails associated with multiple attendee names: ${repeatedPurchaserEmails.length}`,
  `- Attendee emails associated with conflicting attendee names: ${conflictingAttendeeEmails.length}`,
  `- Duplicate PaymentIntent IDs: ${duplicatePaymentIds.length}`,
  "",
  "## Repeated cards",
  "",
  "| Card reference | Card | Payment count | Cardholder names | Attendee names |",
  "|---|---|---:|---|---|",
  ...repeatedCards.map(([fingerprint, group]) => {
    const cardholders = [...new Set(group.map((payment) => source(payment, "Card Name")).filter(Boolean))];
    const attendeeNames = [...new Set(group.flatMap((payment) => attendees(payment).map(({ name }) => name)).filter(Boolean))];
    return `| ${fingerprintLabel(fingerprint)} | ${cell(cardLabel(group[0]))} | ${group.length} | ${cell(cardholders.join(", "))} | ${cell(attendeeNames.join(", "))} |`;
  }),
  ...(repeatedCards.length ? [] : ["| — | — | 0 | — | — |"]),
  "",
  "## Cardholder and attendee name differences",
  "",
  "| CSV row | Payment ID | Purchased | Cardholder | Attendee | Attendee email | Purchaser email | Card | Category |",
  "|---:|---|---|---|---|---|---|---|---|",
  ...cardholderMismatches.map(({ payment, name, email }) => `| ${payment.rowNumber} | ${cell(source(payment, "PaymentIntent ID") || source(payment, "id"))} | ${cell(source(payment, "Created date (UTC)"))} | ${cell(source(payment, "Card Name"))} | ${cell(name)} | ${cell(email)} | ${cell(payment.order.purchaserEmail)} | ${cell(cardLabel(payment))} | ${cell(payment.category)} |`),
  ...(cardholderMismatches.length ? [] : ["| — | — | — | — | — | — | — | — | — |"]),
  "",
  "## Purchaser emails used for multiple attendee names",
  "",
  "| Purchaser email | Payment count | Cardholder names | Attendee names |",
  "|---|---:|---|---|",
  ...repeatedPurchaserEmails.map(([email, group]) => `| ${cell(email)} | ${new Set(group.map(({ payment }) => payment.rowNumber)).size} | ${cell([...new Set(group.map(({ payment }) => source(payment, "Card Name")).filter(Boolean))].join(", "))} | ${cell([...new Set(group.map(({ name }) => name))].join(", "))} |`),
  ...(repeatedPurchaserEmails.length ? [] : ["| — | 0 | — | — |"]),
  "",
  "## Conflicting attendee emails",
  "",
  "| Attendee email | Names using this email | CSV rows |",
  "|---|---|---|",
  ...conflictingAttendeeEmails.map(([email, group]) => `| ${cell(email)} | ${cell([...new Set(group.map(({ name }) => name))].join(", "))} | ${cell([...new Set(group.map(({ payment }) => payment.rowNumber))].join(", "))} |`),
  ...(conflictingAttendeeEmails.length ? [] : ["| — | — | — |"]),
  "",
  "## Excluded rows",
  "",
  "| Reason | Count |",
  "|---|---:|",
  ...[...exclusionCounts.entries()].map(([reason, count]) => `| ${cell(reason)} | ${count} |`),
  "",
  "## Interpretation notes",
  "",
  "- Card fingerprints are shortened labels in this report; full fingerprints remain restricted to Payload.",
  "- Cardholder differences are review candidates, not automatic attendee corrections.",
  "- Full card numbers and billing addresses are neither imported nor included here.",
  "- `necypaa_ct_site` and `necypaa_registration_site` are both accepted NECYPAA sources.",
  "",
];

const outputPath = resolve(output);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, lines.join("\n"), "utf8");
console.log(JSON.stringify({ output: outputPath, includedPayments: payments.length, cardholderMismatches: cardholderMismatches.length, repeatedCards: repeatedCards.length }, null, 2));
