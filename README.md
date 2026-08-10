# NECYPAA XXXVI

## Site administration

- Use **Media** to upload homepage artwork and video.
- Use the home page editor to replace the hero background, hero poster, hero foreground, about artwork, upcoming event flyer, every past-event image, and closing artwork.
- Use **Tenant / site settings** to upload the header logo and set the site palette with six-digit hex codes.
- Use **Access Codes** to create the codes accepted by `/cash`, including activation and redemption limits.
- Cash orders appear under **Cash Transactions**.
- **Attendees** is the working roster. It includes self-registrants and identified scholarship recipients from both card and cash orders, plus attendees added manually in Payload. General-fund contributions do not create an attendee until a person is identified.
- Attendee records include attendance/payment source, accessibility information, all policy acknowledgments and signature status, Stripe or cash references, and editable internal notes.
- Every breakfast admission gets its own **Breakfast Tickets** record, so individual tickets can later be marked used, refunded, or voided.

## MCP content management

The official Payload MCP plugin is enabled at `/api/mcp` for every collection in this project:

- Users
- Media
- Pages
- Merchandise
- Tenant / site settings
- Access Codes
- Cash Transactions
- Attendees
- Breakfast Tickets
- Rooms
- Program Sessions
- Venue Maps

After deployment, create an MCP API key from **Admin → MCP → API Keys**. The key’s capability checklist controls which collection operations an MCP client may use, even though all collection capabilities are available in the project configuration. Start with `find` and `update`; enable `create` or `delete` only when the connected client needs them. Existing Payload access rules and hooks still apply, and user authentication secrets are redacted from MCP responses.

The MCP endpoint requires an API key as a bearer token and uses the standard streamable HTTP transport:

```text
POST /api/mcp
Authorization: Bearer <MCP API key>
Content-Type: application/json
Accept: application/json, text/event-stream
```

Keep the API key outside Git, prompts, and site content. MCP is disabled by default; set `PAYLOAD_ENABLE_MCP=true` only after the MongoDB-backed deployment is healthy.

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

Configure the Stripe webhook endpoint as `/api/stripe/webhook` and subscribe it to `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Successful Stripe and cash orders are materialized into the Attendees and Breakfast Tickets collections. Named scholarship notices are sent only after Stripe confirms payment; cash scholarship notices are sent after the authorized cash record is created. If the email variables are absent, the transaction still records and the notification remains marked as awaiting configuration.

Historical Stripe data can be imported into Payload in batches through `POST /api/admin/stripe-backfill`, authenticated with the `x-backfill-secret` header. The request accepts `limit`, optional `createdGte` (a Unix timestamp), and the previous response's `nextStartingAfter` cursor. Stripe remains the source of the historical data. Stable source keys make the import idempotent, so rerunning a batch updates matching records instead of duplicating them.

## Deployment and storage

This project runs as a standard Next.js Node application and is intended for
Vercel. Payload uses MongoDB through `DATABASE_URI` (or `MONGODB_URI`). Media
uploads use Cloudflare R2 through the S3-compatible adapter when `ENABLE_R2`
is set to `true`.

## Prerequisites

- Node.js `>=22.13.0`
- Vercel or another Node.js host
- MongoDB connection string beginning with `mongodb://` or `mongodb+srv://`
- Optional Cloudflare R2 S3 credentials

## Included Shape

- edit site code under `app/`
- `app/chatgpt-auth.ts` provides optional dispatch-owned ChatGPT sign-in helpers
- `payload.config.ts` configures MongoDB and optional R2 storage
- `.env.example` lists the required Vercel environment variables

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
- `npm run build`: create the Vercel production build
- `npm run start`: serve the production build locally
- `npm run generate:importmap`: refresh Payload's admin import map
- `npm run generate:types`: regenerate Payload TypeScript types

## Learn More

- [Payload MongoDB adapter](https://payloadcms.com/docs/database/mongodb)
- [Payload S3 storage](https://payloadcms.com/docs/upload/storage-adapters)
