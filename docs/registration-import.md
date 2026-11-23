# Registration tracker import

Administrators open **Payload admin → dashboard → Import registrations** (`/admin/registration-import`). Download the complete Google Sheet with **File → Download → Microsoft Excel (.xlsx)** and upload that workbook. The import supports the verified October 2 Stripe/YPAA tracker layout: Registrations, Payments, and Cash Transactions are required. Files are limited to 2 MB compressed, 24 MB expanded, 500 archive entries, 5,001 sheet rows, and 64 columns. XML entities and formula-based source values are rejected. The original workbook is never saved to media or executed.

The preview shows new sources, existing matches, conflicts, purchased seats, named attendees, source notes, and excluded records. Select only verified new sources. Confirm current paid/captured Stripe receipts with no refund/dispute, recorded cash receipts, actual attendee names/email addresses, and registration-only scope. The tracker is a historical snapshot and does not establish current Stripe status. Its names can fall back to cardholder names; review them before confirming. Preview expires after 30 minutes and can be confirmed only by its reviewing administrator. Database changes after preview require another upload.

Only purchased registration rows reconciling to the payment/cash sheet are eligible. Breakfast, merchandise, scholarship fund equivalents, and unnamed Manual Ledger totals are excluded. Mixed checkouts retain their original gross payment as an immutable reference; no records, stock adjustments, notifications, admissions, or funding allocations for other products are created. Purchaser identity is explicitly unknown for new tracker-only orders, rather than inferred from an attendee/cardholder fallback. Existing checkout purchaser details are retained. Policy acknowledgments are pending, never invented.

Stripe charge/payment IDs and cash customer plus redemption/correlation IDs produce stable source keys. Older cash rows with no correlation ID use the unique customer ID and display a review warning. Multiple existing matches for that customer are blocked. Repeated identical attendee details on a group receipt create one named attendee and leave additional paid seats unassigned. Distinct receipts sharing an email are legitimate separate registrations, including when that email already appears under another source. Source/payment identity determines matching and idempotence; email reuse alone never blocks, overwrites or merges registrations. Conflicting source rows, duplicate payment rows, partial allocations and multiple canonical contact matches still require CRM/source review.

Existing registrations, entitlements, corrected names, payment states, consent/policy and attendance records are not overwritten. Refunded, disputed, voided, unpaid and cancelled records cannot be reactivated by an import. Partial existing seat allocations are held for CRM review. A matched source can be left unchanged and is not selectable for import. The public RegistrationCheck block reads the same `attendees`, `checkout-orders`, and `registration-entitlements` collections, so confirmed imported registrations become checkable without a separate public roster.

All registration changes and the completion audit commit in one database transaction. A MongoDB replica set is required. Concurrent/repeated confirmation cannot create duplicate source-keyed registrations/seats. Failed transactions retain no partial registrations. This workflow never sends confirmation or help emails. Access is administrator-only in the page, API and audit collection; it does not use the Stripe backfill secret or grant new roles.

Completed batches appear in Recent imports and **Roster → Registration Imports**. **Review rollback** requires a reason and confirmation. Rollback cancels only newly imported registrations and voids their newly imported seats in one transaction; it retains original payment references and contacts for audit. Corrections, later assignments, new linked seats, redemption or check-in block batch rollback. Re-uploading a rolled-back source shows a conflict instead of reactivating it. The audit retains the reviewing administrator, source digest, preview/matches, created IDs, timestamps and rollback reason.

## Configuration and release

Set `REGISTRATION_IMPORT_ORIGIN` to the exact public origin (for example `https://necypaact.com`) if the deployment's internal request origin differs. It may share the server's `REGISTRATION_CHECK_ORIGIN`. Do not enable the synthetic mail-capture mode in production. No Stripe credential is needed for historical tracker upload, and no integration credential is exposed to the browser. Payment verification is the importing administrator's responsibility.

After deployment, log in as an administrator, open Import registrations, upload the complete workbook, review the **live CRM** matches/conflicts and selected attendees, then confirm the intended rows. No real tracker import was performed during development. The development dry run compared source registrations to synthetic existing records, not the live CRM, so production new/matched counts may differ.

## Local verification

`node scripts/local-registration.mjs mongo`, then `seed`, `test`, `dev`, `browser`, and `build` use only a guarded loopback synthetic MongoDB replica set on port 27029 and captured `.invalid` email destinations. `MONGOD_PATH` can identify an already-installed mongod. The runner deliberately avoids `.env.local`, clears real payment/integration credentials and disables remote storage/MCP. Browser fixtures use only synthetic attendees. Synthetic administrator: `browser-admin@example.invalid`, password `LocalSyntheticBrowserOnly123!`; these credentials are created only by the loopback-guarded seed script.

`node scripts/local-registration.mjs dry-run /path/to/tracker.xlsx` reads the actual workbook and emits aggregate counts only. It does not create preview audits, import real people, or send messages. The Mongo test marker is required.

The verified October 2 tracker’s registration IDs, emails and ticket types correlate with the local October 2 authored workbook. Read-only validation found 296 named rows (289 Stripe, 7 cash): 296 new sources and no conflicts against the synthetic CRM after removing the email-only conflict rule (previously 262 new and 34 held for repeated emails). All 34 formerly held sources are distinct receipts. Other-product/fund/manual records are excluded. No attendee data, private spreadsheet URL, or source workbook is committed to this repository.

## Prepare a historical JSON upload

Use the complete reconciled tracker and a full, current Stripe unified payments export for the same event. With the November 23 workbook layout, run the builder from this repository:

```bash
npm run historical:build -- --tracker /private/tracker.xlsx --stripe /private/unified_payments.csv
```

The command emits aggregate counts for payments, seats, breakfast by day, merchandise, scholarship contributions, captured form responses, and items to review. Add `--output /private/historical-import.json` to create a version 1 upload file with mode `0600`. Choose a private directory outside the repository because the JSON includes attendee and purchaser details. The builder refuses to overwrite an existing file. The same versioned validator checks the generated JSON and server uploads.

The builder reconciles Stripe IDs, receipt timestamps, gross, processor fees, and net amounts against the workbook. Stripe supplies payment identifiers, billing identity when present, and form answers when the named attendee can be corroborated. Tracker detail supplies registrations, meal tickets, quantities, merchandise and scholarship allocations. Named cash registrations remain associated with recorded cash receipts. Included Manual Ledger receipts and offline merchandise deposits have independent stable references. Unassigned registrations remain unassigned, and scholarship fund dollars retain the historical price basis for fractional equivalents.

Review entries identify a source sheet and row. Check payment and purchase mismatches, unallocated receipt balances, unrecognized form answers, and eligible Stripe rows absent from the reconciled workbook. Ledger entries marked excluded, cash rows already represented through the manual ledger, and failed, refunded, disputed or out-of-event payments appear in the source review for traceability. App and Terminal payments require event or checkout evidence. Historical blanks remain unanswered. When another form contains the only copy of an attendee's answers, reconcile it against a verified attendee before preparing a further import or correction.

## Preview and import historical purchases

Open **Import registrations → Historical purchases** and upload the version 1 JSON. Compare the new, already recorded, and needs review results. The administrator who previewed the file has 30 minutes to start confirming the selected payments. Verify current Stripe status, offline receipt evidence, attendee identity and purchase quantities. The preview reports the presence of attendee answers. Review the actual answers in the private source files.

Existing payments are skipped by receipt or Stripe aliases. The preview flags missing related records where it can check them. Each payment and its related records commit together, in chunks of up to 20 payments. Resume an interrupted selection in the open page. After reloading, upload the same file for a fresh preview of the remaining payments. The workbook rollback applies to registration-only workbook batches. Review historical purchase corrections separately in Event CRM.

Use **Payments → Historical Receipts** to examine typed purchase lines, cash receipts, and source references. Dated payments can link to checkout orders, registrations, breakfast tickets and scholarship records. Undated receipts keep their purchased items on the receipt. Historical merchandise lines record purchases and documented fulfillment choices without creating a fulfillment task.

## CRM over MCP

With `PAYLOAD_ENABLE_MCP=true`, Payload serves Streamable HTTP at `/api/mcp`. An administrator creates a dedicated key in **MCP → API Keys**, links it to the appropriate account, and explicitly enables individual **Tools**. Store the bearer credential in the MCP client's credential store. The key and its linked account jointly control access.

| Tool | Operation |
| --- | --- |
| `find-crm-entries` | Find up to ten records by an exact value, such as email, Stripe reference or linked order ID. |
| `examine-crm-entry` | Read a single record by ID. Authorized registration staff can view the recorded fellowship and accessibility fields. |
| `create-registration-contact`, `update-registration-contact` | Maintain contact profiles. Existing exact identities are reused and edits require the current record timestamp. |
| `create-pending-registration`, `update-registration-profile` | Add an unpaid roster entry or edit attendee profile fields. Explicit accessibility answers include yes, no, and unanswered. |
| `correct-paid-registration`, `assign-breakfast-ticket-holder` | Correct an existing registration identity or assignment through the CRM audit log. |
| `historical-import-status` | Show recent historical batch status and aggregate counts for an administrator. |

Use a registration staff account with **View only** for lookups or **Manage** for edits. Enable the tools needed for that key. Purchase, cash, scholarship and ticket lookups honor the account's collection access. Creating paid receipts, seats or breakfast tickets from a historical file is an administrator action in the import screen.
