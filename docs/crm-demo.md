# Local CRM walkthrough

Run `npm run crm:demo` in this project, then open http://127.0.0.1:3000/admin.
The first run copies the existing local MongoDB database into an isolated replica set
on port 27018. It preserves the existing local database on port 27017 and reuses the
demo copy on later starts. Existing administrator credentials work in the copy.

The demo banner shows the newest payment date in the copied data (not a claim that
Stripe has been synchronized since that date). A synthetic DEMO Riley Sample record
is included for corrections. Its order is labeled practice; no payment or email is sent.
Practice records add one registration, payment, and breakfast ticket to demo totals.

To repeat the walkthrough, run `npm run crm:demo:reset`, then refresh the CRM page.
This replaces only the isolated demo CRM records with the original local import and
recreates the practice record. Demo corrections are reset; accounts and site content
are preserved. A backup is saved under `.local-crm/backups` before each reset.
Avoid making edits while the reset runs.

Suggested five-minute walkthrough:

1. Start at Event operations for the event totals.
2. Open Event CRM and search a name, or choose Try a practice record.
3. Open one person. Choose Fix name or contact details, or Someone else is attending.
4. Enter the changes, choose Review change, add a reason, then Save change.
5. Expand Change history to see the audit entry. Back to results preserves the search.

Payment and breakfast details stay collapsed until opened. Browse all registrations
shows six people per page. Search payments and other records opens one record type
at a time. The scholarship fund and record definitions are available below the search.

A read-only demo account is created automatically. Its local credentials are saved in
`.local-crm/viewer-access.txt` (ignored by Git). For additional accounts, create a user
in the demo admin and choose Read-only viewer.
Viewers can read records but cannot change collections, global settings, or corrections.
Existing users without a role retain administrator access. Newly created users default
to viewer. Do not share your administrator password.

The server binds to this computer only. Use screen sharing for a remote walkthrough;
an independently accessible preview with its own login is a separate deployment step.

## Before production

- Use a MongoDB replica set with transactions enabled. The correction endpoint refuses
  to write when transactions are unavailable.
- Run `npm run test:crm`; the integration test uses a fresh local test database on port
  27018 and removes only that test database when it finishes.
- Reconcile a fresh Stripe export and review identity conflicts. Reimports retain existing
  roster identities, assignments, policy state, ticket status, and attendance status.
  Original payment amounts and metadata can be refreshed; committee edits are authoritative.
- CSV normalization is a preview, not a database comparison. `--dry-run` does not prove
  idempotency. The integration tests exercise an actual second import.
- Keep `CRM_DEMO_MODE` and `CRM_DEMO_ISOLATED` unset for production. Use them only with
  the isolated local demo. `CRM_IMPORT_THROUGH` is a display label, not a sync setting.
- This change does not add automatic refund/dispute synchronization or import new data
  into production. Those still require reconciliation with Stripe.

## Reviewing this change locally

The sidebar groups tools by task. Each panel names its individual destinations
(for example, Registrations, Registration Entitlements, Breakfast Tickets, and
Access Codes). Click outside a panel or press Escape to close it. Escape returns
keyboard focus to the section button. The rail remains available on small screens.

Before committing, run `npm test` for the production build and site checks and
`npm run test:crm` for CRM integrity checks while the local replica set is running.
The CRM test database is separate from the demo database.

Local payment audit reports under `reports/`, demo databases and credentials under
`.local-crm/`, and TypeScript incremental caches are ignored. Keep the new CRM
source files, generated Payload types/import map, and package lockfile together
in the commit.
