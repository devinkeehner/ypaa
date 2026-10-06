# Program editor reliability changes

Local implementation prepared in an isolated clone. No deployment or production data writes are part of this change.

## Behavior

- Session forms preserve internal notes and carry the loaded schedule revision and timestamp.
- Moves, resizes, edits, creates and deletes use `/api/admin/program-schedule`; managers only, same-origin requests only.
- Each operation validates its final room intervals and commits in one database transaction. No client compensation writes.
- ProgramSessions hooks serialize every collection write against its room document inside the transaction and increment `scheduleRevision`. This includes direct Payload collection edits, so concurrent different-card moves cannot both claim an empty slot.
- Existing records without a revision are treated as revision zero. The first normal write initializes the field. No backfill needed.
- A room serialization write changes only its `updatedAt` timestamp through the database adapter; room content is unchanged. It deliberately participates in the same transaction as the session writes.
- Database transactions are mandatory. A deployment without them fails closed with a useful error; do not weaken this behavior or automatically change database topology.
- Neighbor resizes show all proposed time changes and require Apply. Cancel makes no request. Successful schedule moves/resizes offer a whole-operation Undo with the returned revisions. A stale Undo is rejected.
- Save failure clears pending indicators. Form content remains. After an uncertain result, reload is required. A stale form must be closed/reopened to rebase; there is no automatic overwrite or automatic retry.
- The board loads all session/room pages, formats every label in Eastern time, fixes backward push chains and keeps room/time headers visible in its scroll container.
- A move ending after midnight is blocked with an explanation. The edit form has an explicit end date for existing or intentional overnight records.
- Dialogs trap focus, make background controls inert, close on Escape when idle and restore focus. Modal footer styles are scoped; secondary and primary buttons have explicit readable colors and focus states.

## Test commands

```sh
node --import tsx tests/program-schedule.test.ts
node node_modules/typescript/bin/tsc --noEmit --incremental false
PROGRAM_BROWSER_EXECUTABLE=/path/to/installed/chromium node tests/program-board.browser.mjs
PROGRAM_TEST_DATABASE_URI='mongodb://127.0.0.1:VERIFIED_PORT/program_editor_test_TIMESTAMP?replicaSet=VERIFIED_NAME' node --import tsx tests/program-schedule.integration.test.ts
```

The integration test does not load the app config or `.env`. It only accepts a loopback host and a database named `program_editor_test_` followed by digits, and asserts that no program sessions already exist. Use a fresh database and a verified existing local replica set. It leaves its synthetic database available for inspection and closes its own Payload connection. It never starts/stops a Mongo process or changes topology.

The browser fixture serves every page/asset/API response through Playwright interception. It uses no web server or actual program records, blocks off-origin requests, launches a fresh browser process and closes it in finally. Screenshots go to a unique OS temporary directory. It tests real React handlers and pointer resize but does not replace persistence/concurrency integration checks.

## Integration notes

Owned files: `ProgramBoard.tsx`, `ProgramDialog.tsx`, board rules in `app/globals.css`, `lib/program-board-planning.ts`, `lib/program-schedule.ts`, the new route, additive ProgramSessions hooks/revision, two additive generated type entries, and focused tests. No `payload.config.ts` changes. Preserve the app worker's additive collection fields when combining patches; regenerate types only after all collection changes are assembled.

Remaining scope: native touchscreen move gestures still use the edit form alternative; drag edge scroll is based on drag events, not an animation-loop controller. Room metadata/reorder use their existing REST handlers (now bounded by request timeouts); atomic room ordering is separate follow-up work. Program UI remains tied to the currently configured winter convention dates. Production theme overrides, server transaction readiness and physical mobile behavior require their own release checks.

## Validation completed, 6 October 2026

- Full TypeScript check: passed (`tsc --noEmit --incremental false`).
- Focused unit tests: 5 passed (backward and forward cascades, bounds, adjacency/overlap, invalid dates).
- Existing public program responsive contract test: passed.
- Isolated browser fixture: passed at 1440×1000 and 390×844 in UTC. Verified notes, Eastern axis, readable controls, focus containment/return and Escape, guarded neighbor review/cancel, whole-operation Undo, actual native drag/drop and pointer resizing, failed-move and failed-form recovery, and sticky room headers. No unexpected page errors.
- Fresh local Mongo replica-set integration: 5 nested cases passed (6 tests including the parent). Verified rollback after second-write failure, guarded batch save, stale revision rejection, concurrent different-card collision rejection, direct collection hooks, permission refusal and transaction-unavailable refusal.
- Integration database: `program_editor_test_1791289999002` on local port 27029, replica set `ypaaTest`. Only synthetic data. Its shared server was neither stopped nor reconfigured.
- Initial integration attempt in database ending `9001` hit a fixture index-creation race. The test now waits for model indexes before transactional seeding; the fresh `9002` run passed. Both synthetic namespaces were left intact.
- Static syntax and `git diff --check`: passed.

### Release checks against main `a021805f7bcd06582f0a827cca9a7bdd3f670fc4`

- Rebased in the isolated clone, preserving the deployed hotel and header/breakfast changes. Regenerated Payload types and import map; the generator only reordered the revision field and required no import-map changes.
- Full standard Next.js 16.2.6 Turbopack production build, including TypeScript and page generation: passed. The initial attempt rejected the external `node_modules` symlink; copying the existing installed dependencies into this isolated clone resolved it without installing packages or altering shared dependencies.
- Ran the production build on local port 3045 with the actual app config and dedicated synthetic database `program_editor_release_1791299999001`. Email capture was enabled, cloud storage/MCP disabled, and payment/service keys blank. The initial sample seed encountered an index-creation race; startup after model index initialization passed.
- Real authenticated HTTP checks: manager create and multi-session resize passed; overlaps, stale revisions, anonymous/viewer writes and wrong-origin writes were rejected. Persisted notes and incremented revisions were confirmed by subsequent reads.
- Real browser checks: authenticated editor rendered, Eastern labels were correct from a UTC browser, a form edit saved with notes intact, viewer controls were disabled, anonymous access redirected to login, and the Payload admin iframe rendered. No browser page errors. No request interception was used for this release check.
- Test browser and owned local server were stopped. Shared Mongo was left running and unchanged; synthetic databases remain available for inspection.

Screenshots are stored outside the repository in task-5/program-fix-evidence and task-5/program-release/authenticated-editor.png. Build, seed and HTTP evidence is in task-5/program-release. The earlier component fixture stubs Next Link and APIs; the release checks above exercise the built Next app and actual Payload HTTP routes.

**Release readiness assessment:** the owner confirmed the live database is hosted on Atlas and described the usual shared-cluster setup. Standard Atlas clusters use SRV connection strings; the installed MongoDB driver reads the DNS TXT `replicaSet` option into the client options checked by Payload 3.87.0. Atlas Free/shared deployments use replica sets. Together with the actual adapter/configuration tests above, this supports proceeding with the authorized release without a production write test or credentials. This is an inference from owner confirmation and standard Atlas behavior, not a live topology or transaction probe. An unusual custom URI or sharded deployment remains a residual risk of saves failing closed; mandatory atomicity is retained. The connected Vercel account still returns 403 for the production workspace, so no credential or access workaround was used. Physical touchscreen behavior remains unverified.

References: [MongoDB transaction support](https://www.mongodb.com/docs/manual/core/transactions/), [Atlas Free cluster configuration](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/), and [SRV connection format and DNS options](https://www.mongodb.com/docs/manual/reference/connection-string-formats/).
