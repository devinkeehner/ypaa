# Checkout order purchase details

Checkout Orders now includes a **Purchased** category column and a readable **Purchase details** section on each document. Authenticated Payload reads also return the virtual `purchaseSummary` and structured `purchaseDetails` fields.

The display covers registration quantities, scholarship type/recipient/attribution, payment method, breakfast day/count, merchandise names/variants/quantities/recorded unit prices, and merchandise delivery choice. Delivery labels are Mail / shipping, Receive now / in-person pickup, and Hold for convention pickup. A recorded delivery choice does not confirm physical pickup. Linked merchandise inventory status and shipping status remain distinct.

## Historical orders

Details are derived on read from existing `order`, `rawMetadata`, and `checkoutLineItemSummary`. No migration, production write, backfill, financial recalculation, inventory change, entitlement allocation, or notification is performed by these reads. Normal saves of old orders do not create a snapshot.

When available to the caller, `merchandise-orders` records provide purchase-time names, variants, quantities, and delivery choices. Joins use exact source keys and existing Stripe identifiers only. Names/email are never used to associate records. Collection and field permissions remain in force. Multiple matching merchandise records produce an ambiguity note and links for review; their item lists and delivery methods are not combined. Lookup failures produce a note instead of breaking the checkout read.

Explicit metadata counts take priority over legacy text or normalized defaults. Legacy breakfast text supports repeated named tickets and `x`/`×` quantities. A total-only breakfast count remains assigned to an unknown day. Conflicting recorded quantities are shown with a note; no source value is rewritten. Missing item names, variant details, quantities, and fulfillment choices stay unknown. Reported checkout line items are displayed as original text, without parsing them into invented structured details. Current catalog prices are never used to describe an old purchase.

Historical `order.scholarship.amountCents` and `scholarship.kind` can contain normalization defaults. Without reliable recipient metadata or a future original-input snapshot, the display leaves those details unknown. `necy_has_registration` is a broad flag that can include a scholarship and does not establish a self registration. Stripe identifies the payment processor; if the actual payment method was not recorded, the display says method unknown.

The category column is virtual and is intended for readability, not historical database filtering/export grouping or reliable sorting by purchase category. Virtual-only projections load their source dependencies with the same caller permissions and transaction, using an isolated request context for each concurrent read. Payload then returns only the requested fields.

## Future orders

New Checkout Orders receive a structured `purchaseSnapshot`, captured on creation and preserved on updates. The server-to-server reporting route passes the original reported purchase shape through Payload request context before `normalizeOrder` discards merchandise and normalizes scholarship fields. The snapshot retains only the display model, not an additional complete customer/order document. External clients cannot supply or replace this snapshot through a collection write.

The snapshot can therefore retain an originally reported scholarship amount, merchandise slug/variant IDs/count, and delivery choice. The normalized `order`, original metadata, status, totals and source records retain their existing behavior. The display still obtains complete item names/options and current shipping status from permitted related merchandise records once fulfillment has created them. Ordinary record creation without an original server report only snapshots details supported by existing fields; it does not invent missing facts.

## Local verification

The runner uses the existing loopback MongoDB on port 27029 and verifies the `ypaaTest` replica set. Every integration test creates its own fresh `ypaa_orders_test_<UUID>` database. A normal successful or failed test drops only that database. `seed` retains a successful synthetic database and writes ignored `.orders-qa.json` for admin QA. It does not replace the registration/hotel workers' databases or stop their processes. Live Stripe/Resend/integration credentials are disabled.

```sh
node scripts/local-checkout-orders.mjs test
node scripts/local-checkout-orders.mjs seed
node scripts/local-checkout-orders.mjs dev       # http://127.0.0.1:3039
node scripts/local-checkout-orders.mjs browser   # synthetic admin and viewer; screenshots in /tmp/ypaa-orders-qa
```

Use Node 22.13+ and existing installed dependencies. Shapes in the tests follow the inspected main-site/Registration Site metadata builders and existing legacy CSV fixtures. No real customer values are present in the fixtures. Live Checkout Order document coverage remains unverified because this worker does not expose the existing Checkout Orders Payload connector.

The release was prepared from deployed main `7fab8628215bdbc543cb4dc751de588832e89950`. Types and the admin import map were regenerated from that combined configuration, retaining the existing hotel, header, and program fields/components. Only Checkout Order additions changed the generated files.

Final release checks passed: 13 purchase-shape cases, 13 real Payload/Mongo checks (including concurrent virtual-only projections and the authenticated reporting boundary), 6 existing CSV/notification regressions, focused lint, the standard Next.js Turbopack production build with TypeScript, and 32 existing post-build contract checks. Browser QA against the built production artifact passed at 1280×900 and 390×844 with the category list, mixed historical shipping order, unknown state, related-order navigation, and read-only viewer. Both admin and viewer consoles were monitored with no errors. The purchase section fits and wraps on mobile; Payload's surrounding header/account controls and document metadata have existing horizontal overflow at 390px. Screenshots use `caret: 'initial'` to avoid injecting form-input caret styles during hydration. Browser plugin was unavailable; the installed Playwright/Chromium workflow was used. The isolated preview was stopped after the exclusive test slot; shared MongoDB was left available.

This release does not perform a production backfill or historical category indexing. This change requires no new form plugin.
