# Project agent guidance

## Related registration Site

This project is the content and event site for NECYPAA XXXVI. The separate registration Site is the existing production application at:

- https://reg.necypaact.com

Keep the registration Site as a distinct application. Changes in this repository should integrate with it through an explicit server-to-server API boundary rather than copying registration code or storing registration credentials in this app.

Do not confuse the two registration destinations:

- `https://reg.necypaact.com` is the NECYPAA Registration Site for registration, breakfast, merchandise, scholarships, and either card or authorized cash checkout.
- `https://register.necypaact.com/en/register` is a separate third-party cash-registration form. It is linked only from the Registration Site's explanatory cash CTA.

The legacy local `/cash` form must not be restored. The main site's `/register` route hands off to `https://reg.necypaact.com`.

## Payload as the merchandise source of truth

Payload CMS is the source of truth for merchandise that the registration Site may display or sell. The relevant collection is `merchandise` (`collections/Merchandise.ts`). Its important fields include:

- `name`, `slug`, `description`, `type`, and `image`
- `price`
- `inventory[]` with `size`, `color`, `sku`, and `quantity`
- `available`, `featured`, and draft/published status

When merchandise is entered or edited in Payload, the registration Site should read the current published records from an API. Do not maintain a second manually edited merchandise catalog in the registration Site.

## API and secret handling

Use a dedicated, least-privilege integration credential for the registration Site. Do not reuse `PAYLOAD_MCP_API_KEY`, Stripe keys, or any browser-exposed key. The credential must be stored only in the registration Site's server-side environment variables and must never be committed, placed in `NEXT_PUBLIC_*` variables, rendered into HTML, or sent to the browser.

The implemented shape is:

1. The registration Site server requests published merchandise from this project's Payload API.
2. The registration Site server validates and normalizes the response before rendering it or using it in checkout.
3. The browser talks only to the registration Site; it does not call Payload directly with a secret.
4. Inventory and price must be re-read server-side when an order is created. Never trust price or stock values submitted by the browser.

This project exposes the narrow authenticated endpoint `/api/registration-site/merchandise`, protected by `REGISTRATION_SITE_API_KEY`. The Registration Site uses `PAYLOAD_API_URL` and `PAYLOAD_MERCH_API_KEY`; both keys must contain the same secret. Keep variable names documented in `.env.example` without real values.

## Integration boundaries

- Public merchandise reads should return published and available items only unless an admin workflow explicitly needs drafts.
- Images should use the Payload media URL returned by the API, with a trusted public media origin configured for deployment.
- Cart and checkout logic belongs to the registration Site, while merchandise content, price, and inventory remain owned by Payload. Main-site carts hand off only merchandise slugs, variant IDs, and quantities; prices are never trusted from the URL.
- The endpoint supports server-side catalog reads, quotes, and fulfillment. Fulfillment creates an idempotent `merchandise-orders` record and decrements stock after a successful Stripe or cash order.
- Merchandise delivery choices are receive now, event pickup, or shipping. The Registration Site controls the configurable flat shipping fee and requires an address for shipping.
- Do not add secrets to git, logs, client bundles, screenshots, or issue descriptions.
