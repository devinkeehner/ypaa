# Hotel request form

In Puck’s **Sections** palette, drag **Hotel request** into a page. It can also be placed in section/row/card/tab element slots. Set **Heading** and **Introduction / description**; line breaks in the introduction are preserved. The form collects name, email, phone, arrival/departure dates, room count and optional notes. The editor shows a disabled preview. No existing public page is changed by installing this feature.

## Placement and publishing

The form works whenever the **Hotel request** block is placed on a published page. There is no date cutoff, enable switch, or inactive block setting. You can test it now on a page you choose; control when visitors discover it by publishing/sharing that page when ready. Installing the feature does not place the block or publish a page automatically. The Puck editor itself never submits requests.

Public `/api/hotel-request` accepts valid same-origin submissions now. Its GET reports availability for read-only checks. The separate `/api/hotel-requests` API remains Payload’s private queue. `HOTEL_REQUEST_ORIGIN` can override the exact trusted origin behind a reverse proxy; otherwise the request URL origin is used. The removed `HOTEL_REQUESTS_ENABLED` and `HOTEL_REQUESTS_OPEN_AT` values have no effect, even if left in an environment. No production environment values, pages or recipients are changed by this implementation.

## Recipient and email configuration

An administrator adds the confirmed organizer address in **Notification Recipients**, enables **Active**, and selects **Hotel request received**. Confirm Sara Reynolds’s intended address before configuring it; no address is guessed or seeded outside synthetic tests. Existing `RESEND_API_KEY` and verified `SCHOLARSHIP_FROM_EMAIL` provide delivery. **Email Tests → Hotel request received** sends an explicit sample email to the test address entered there; it does not create a hotel inquiry or notify the organizer directory.

Every valid inquiry is saved in **Hotel Requests** before notification lookup/sending. Missing email credentials or recipients leave it saved with `pending_configuration`; failed sends leave `failed` or `partial`. A successful acknowledgement means the request was saved, not that email arrived or a room was booked. `sent` means Resend accepted the message, not confirmed inbox delivery.

The queue records request fields, each requested night, review status, timestamps, accepted organizer addresses and notification attempt/status. Open a saved request and choose **Retry organizer notification** after fixing configuration. Retries skip recorded accepted addresses and use recipient-specific Resend idempotency keys. Unsaved field edits are not included until saved. Read-only users cannot retry. No requester email is sent automatically.

## Review and batching

Queue access follows the existing registration permissions: administrators and registration managers can manage; registration staff and global read-only viewers can read; the public and other restricted areas cannot access it. There is no new hotel permission area. Review statuses: `new`, `in_progress`, `submitted_to_hotel`, `resolved`, `cancelled`. `batchReference` and `batchedAt` record a committee handoff; they do not reserve rooms or automatically send grouped mail. Requested nights exclude the departure date and remain calendar dates across timezone/DST boundaries. Editing arrival/departure recomputes them.

Organizers can filter by arrival, requested night, status or batch reference and follow up from the saved contact information. Apply the committee’s retention policy to resolved inquiries. A batching schedule, hotel-only staff access and automatic grouped email are separate scope decisions.

## Validation and abuse controls

Server validation requires a name up to 100 characters, normalized email, reachable phone format, real calendar dates, arrival today or later (Eastern), departure after arrival, 1–14 nights, a whole room count of 1–10, and optional notes up to 1,000 characters. Requests never guarantee a booking, rate or availability. No payment details should be submitted.

Same-origin JSON, an 8 KiB streamed body cap, honeypot and minimum 1.5-second form age precede writes. Mongo-backed atomic limits in `_hotel_request_limits` enforce ten attempts per IP/hour, 200 globally/hour and a ten-minute email cooldown. Exact already-saved duplicates acknowledge without another record/email; changed/in-flight requests during cooldown receive a limit response. Only HMAC digests, counters and expiry metadata are retained in the private limit collection. TTL expiry and limits do not affect registration lookup/importer limits. `REGISTRATION_CHECK_TRUST_PROXY` follows the already-established trusted-ingress rule; Vercel’s ingress header is used automatically. Untrusted hosts share a conservative IP limit.

## Isolated local verification

Use the existing loopback-only MongoDB `ypaaTest` replica set at `127.0.0.1:27029`. The runner explicitly overrides database, mail, storage and payment/integration settings with synthetic values. Next may still report loading `.env.local`; those explicit synthetic environment values take precedence. Seed existing synthetic registration fixtures first, then:

- `node scripts/local-registration.mjs hotel-seed` creates only synthetic hotel pages/recipient.
- `node scripts/local-registration.mjs hotel-test` runs real Mongo/Payload/route tests in a fresh disposable test database and deletes that database afterward.
- `node scripts/local-registration.mjs hotel-dev` starts the existing test app on `127.0.0.1:3029` and captures mail to `.local-registration/mail.ndjson`.
- `node scripts/local-registration.mjs hotel-browser` runs desktop/mobile submission, queue, notification retry and Puck editor checks. Screenshots are written outside the repo to `/tmp/necypaa-hotel-qa`.

Run browser tests sequentially with other registration tests because they share synthetic mail capture and the dedicated test app. Never reset an unrecognized database or interrupt another app’s server.
