# NECYPAA XXXVI

## Cash registration code settings

These are the only settings needed for the cash-code integration. Keep them together in the hosting environment so they are easy to find:

```text
ISSUER_SERVICE_BASE_URL       External cash-code service URL
ISSUER_SERVICE_API_KEY        Secret key for the external service
ISSUER_EVENT_SLUG             Event identifier, normally necypaa-xxxvi
CASH_ACCESS_CODE              Optional local fallback code
CASH_ACCESS_CODE_MAX_REDEMPTIONS  Uses allowed for the fallback code
```

Generated issuer codes are redeemed through the external service. The fallback environment code continues through this site's local cash ledger. External codes cover one registration and do not cover breakfast tickets or additional scholarships.

## Site administration

- Use **Media** to upload homepage artwork and video.
- Use the home page editor to replace the hero background, hero poster, hero foreground, about artwork, upcoming event flyer, every past-event image, and closing artwork.
- Use **Tenant / site settings** to upload the header logo and set the site palette with six-digit hex codes.
- Use **Access Codes** to create the codes accepted by `/cash`, including activation and redemption limits.
- Cash orders appear under **Cash Transactions**.
- Use **Notification Recipients** to add internal addresses and choose the alerts each address should receive. Add an address with the **Cash scholarship requested** trigger to receive the scholarship amount for cash scholarship requests.
- Use **Email Tests** to send a one-time sample scholarship email to an address you enter. Each record shows whether Resend sent it, still needs configuration, or failed.
- **Attendees** is the working roster. It includes self-registrants and identified scholarship recipients from both card and cash orders, plus attendees added manually in Payload. General-fund contributions do not create an attendee until a person is identified.
- Attendee records include attendance/payment source, accessibility information, all policy acknowledgments and signature status, Stripe or cash references, and editable internal notes.
- Every breakfast admission gets its own **Breakfast Tickets** record, so individual tickets can later be marked used, refunded, or voided.

## Registration and Stripe

`/register` provides one checkout for a $40 self-registration, $25 breakfast tickets for Friday, Saturday, or Sunday, a named $40 registration scholarship, or a general scholarship contribution starting at $40. The policy and its seven acknowledgments appear only when the purchaser registers themself. A named scholarship collects recipient contact, state, homegroup, and accessibility details and creates an expected attendee whose policy status remains pending until personally completed.

`/cash` provides the same order builder after an authorized access code is entered. A cash order does not create a fake $0 card charge. It creates or updates a Stripe Customer with the registration metadata and saves the cash value and order as a Cash Transaction in Payload.

Configure these hosted secrets before enabling live submissions:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_BACKFILL_SECRET
RESEND_API_KEY
SCHOLARSHIP_FROM_EMAIL
PAYLOAD_SECRET
```

Configure the Stripe webhook endpoint as `/api/stripe/webhook` and subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Successful Stripe and cash orders are materialized into the Attendees and Breakfast Tickets collections. Named scholarship notices are sent only after Stripe confirms payment. After an authorized cash scholarship record is created, each active **Notification Recipient** assigned to the **Cash scholarship requested** trigger receives a short email containing only the scholarship amount (no fees). The separate Registration Site sends this alert through the authenticated `/api/registration-site/notifications/cash-scholarship` endpoint. If the Resend variables or a matching recipient are absent, the transaction still records and the cash alert remains marked as awaiting configuration.

Historical Stripe data can be imported into Payload in batches through `POST /api/admin/stripe-backfill`, authenticated with the `x-backfill-secret` header. The request accepts `limit`, optional `createdGte` (a Unix timestamp), and the previous response's `nextStartingAfter` cursor. Stripe remains the source of the historical data. Stable source keys make the import idempotent, so rerunning a batch updates matching records instead of duplicating them.

## Runtime and deployment

This is a standard Next.js and Payload application deployed on Vercel. Payload
uses MongoDB for persistent application data and can store media in Cloudflare
R2 through its S3-compatible API.

## Prerequisites

- Node.js `>=22.13.0`
- A MongoDB connection string

Configure these values in Vercel for Production, Preview, and Development as
appropriate:

```text
DATABASE_URI
PAYLOAD_SECRET
ENABLE_R2
R2_ENDPOINT
R2_BUCKET
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_PUBLIC_BASE_URL
```

Set `ENABLE_R2=true` to enable remote media storage. `R2_ENDPOINT` should be the
S3 API endpoint for the account, while `R2_PUBLIC_BASE_URL` should be the public
bucket or custom-domain URL used to serve uploaded files.

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Diagnostic Commands

- `npm run dev`: start the Next.js development server
- `npm run build`: generate the Payload import map and build the Vercel artifact
- `npm run start`: start the production Next.js server
- `npm test`: build and run the focused project tests
- `npm run generate:types`: regenerate Payload TypeScript definitions

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Payload Documentation](https://payloadcms.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
