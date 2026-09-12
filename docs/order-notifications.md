# Order notifications

The main Payload application owns these emails and uses the existing RESEND_API_KEY and SCHOLARSHIP_FROM_EMAIL settings.

## Stripe general scholarship fund

In Notification Recipients, select **Stripe general scholarship fund donation paid** for each internal recipient who should receive the alert. Existing cash subscriptions remain unchanged.

The alert runs after paid general scholarship orders are recorded, including Registration Site reporting and the main Stripe webhook. Specific-recipient scholarships, cash orders, and historical Stripe backfills do not trigger it. Delivery is recorded per recipient on the checkout order; failed sends propagate to the caller for retry. Resend idempotency keys cover retries between delivery and recording success.

## Merchandise shipping

In Merchandise Orders, enter the carrier and tracking number, set Shipping Status to **shipped**, and save. This sends the purchaser a shipping update. Inventory status **fulfilled** alone does not send one. The delivery status and sent timestamp appear on the order. If delivery fails or email settings are missing, fix the issue and save the order again to retry. This workflow supports one shipment notification per order.

Both templates are available in **Email Tests**. Creating a test sends a real email to the entered test address.

Automated verification: `npx tsx --test tests/order-notifications.test.ts` (uses mocked delivery; sends no real email).
