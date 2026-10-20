# Merchandise shutdown (local implementation)

In Admin → Tenant / site settings, edit the first site settings record (the existing createdAt ordering):

- **Enable online merchandise**: off hides the main store, merchandise product pages, cart, header/footer/CMS merchandise links, and the entire Merchandise accordion in registration checkout. New online card/cash merch checkouts are rejected.
- **Enable in-person merchandise checkout**: independently controls new QR merchandise sales at reg.necypaact.com/merch. When off, that URL redirects to /checkout.

Both settings default on, including older records without the fields. Turn both off to stop all new merchandise sales. Save the settings; do not delete products or zero inventory. Existing per-product channel visibility still applies. An empty published/available channel catalog hides its storefront/checkout surface automatically. Sold-out products still appear in the online catalog as before.

Existing Stripe sessions can finish paying; fulfillment deliberately bypasses these sales switches and per-channel visibility, but still validates published/available products and stock. Historical orders and products are untouched. Do not unpublish/delete products or clear inventory while payments are pending.

Catalog reads and API responses use no-store, and main public pages render dynamically. Reload already-open pages to pick up a setting change. The main cart badge is hidden and saved cart cleared when a disabled main page loads. Registration reconciles saved/handoff selections against the fresh catalog and clears merchandise on catalog failure; no registration is silently added to a merch-only order. A failed integration hides merch while leaving registration and breakfast available.

Deployment: deploy both applications together, retaining existing API credentials. No setting has been changed by this implementation. Main-site CMS content linked through URL controls is filtered by known merch/cart destinations and merch-mode URLs; freeform editorial prose is not rewritten. Verify production integration connectivity, disable both switches, reload both sites, check direct URLs/new checkout rejection, then reenable and check products/variants return. No production toggles, deployments or database migrations were performed during development.
