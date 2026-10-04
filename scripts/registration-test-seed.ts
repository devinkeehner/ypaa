import type { Payload } from "payload";
import { writeFile } from "node:fs/promises";
import { syntheticTracker, workbookFixture } from "../tests/registration-tracker-fixture";
import { trackerSheets } from "../lib/registration-tracker";
import { orderFromStripeMetadata, recordRegistrationOrder } from "../lib/registration-records";

export async function seedRegistrationTest(payload: Payload) {
  for (const [label, email, status] of [["Paid", "paid@example.invalid", "paid"], ["Cash", "cash@example.invalid", "recorded"], ["Refunded", "refunded@example.invalid", "paid"], ["Cancelled", "cancelled@example.invalid", "paid"]] as const) {
    const order = orderFromStripeMetadata({ attendee_name: `${label} Synthetic`, attendee_email: email, self_registration_quantity: "1" }, { name: "Synthetic Payer", email: "payer@example.invalid" });
    await recordRegistrationOrder(payload, order, { sourceKey: `synthetic:${label}`, paymentSource: status === "recorded" ? "cash" : "stripe", paymentStatus: status, dataOrigin: "stripe_backfill", purchasedAt: "2026-10-01T12:00:00Z" });
    const registration = (await payload.find({ collection: "attendees", limit: 1, where: { attendeeEmail: { equals: email } } })).docs[0];
    if (label === "Cancelled") await payload.update({ collection: "attendees", id: registration.id, data: { attendanceStatus: "cancelled" } });
    if (label === "Refunded") {
      const orderId = typeof registration.checkoutOrder === "string" ? registration.checkoutOrder : registration.checkoutOrder!.id;
      await payload.update({ collection: "checkout-orders", id: orderId, data: { paymentStatus: "refunded" } });
    }
  }
  if (!(await payload.find({ collection: "attendees", limit: 1, where: { attendeeEmail: { equals: "pending@example.invalid" } } })).docs.length) await payload.create({ collection: "attendees", data: { sourceKey: "synthetic:pending", attendanceStatus: "expected", attendanceBasis: "manual_expected", policyAcknowledgments: { status: "pending" }, registrationPriceCents: 4000, paymentSource: "manual", dataOrigin: "manual", attendeeName: "Pending Synthetic", attendeeEmail: "pending@example.invalid", state: "CT", purchaserName: "Synthetic", purchaserEmail: "payer@example.invalid", purchasedAt: "2026-10-01T12:00:00Z", paymentStatus: "pending" } });
  const recipient = await payload.find({ collection: "notification-recipients", where: { email: { equals: "organizer@example.invalid" } }, limit: 1 });
  if (!recipient.docs.length) await payload.create({ collection: "notification-recipients", data: { email: "organizer@example.invalid", active: true, triggers: ["registration_help"] } });
  const page = await payload.find({ collection: "pages", limit: 1, where: { slug: { equals: "registration-check-test" } } });
  if (!page.docs.length) await payload.create({ collection: "pages", data: { title: "Registration check test", slug: "registration-check-test", _status: "published", layout: [{ blockType: "RegistrationCheck", heading: "Check your registration", intro: "Synthetic local test. Enter paid@example.invalid or missing@example.invalid." }] } });
}

if (process.argv[1]?.endsWith("registration-test-seed.ts")) {
  const uri = new URL(process.env.DATABASE_URI || "");
  if (uri.hostname !== "127.0.0.1" || uri.pathname !== "/ypaa_registration_test" || process.env.REGISTRATION_TEST_MAIL_CAPTURE !== "true") throw new Error("Run the isolated local-registration runner.");
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config; resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
  try {
    await seedRegistrationTest(payload);
    if (!(await payload.find({ collection: "users", where: { email: { equals: "browser-admin@example.invalid" } }, limit: 1 })).docs.length) await payload.create({ collection: "users", data: { email: "browser-admin@example.invalid", password: "LocalSyntheticBrowserOnly123!", role: "admin" } });
    const secondOrder = orderFromStripeMetadata({ attendee_name: "Second Paid Synthetic", attendee_email: "paid@example.invalid", self_registration_quantity: "1" }, { name: "Synthetic Payer", email: "payer@example.invalid" });
    await recordRegistrationOrder(payload, secondOrder, { sourceKey: "synthetic:second-paid", paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "stripe_backfill", purchasedAt: "2026-10-01T12:00:00Z" });
    const sheets = trackerSheets(syntheticTracker({ reference: "ch_BROWSERIMPORT", email: "browser-import@example.invalid", quantity: 3 }));
    const second = trackerSheets(syntheticTracker({ reference: "ch_BROWSERIMPORTSECOND", email: "browser-import@example.invalid" }));
    sheets.Registrations.push(second.Registrations[1]); sheets.Payments.push(second.Payments[1]);
    await writeFile(".local-registration/import-fixture.xlsx", workbookFixture(sheets));
    console.log("Synthetic test seed ready: /registration-check-test and /admin/registration-import. Emails are captured locally.");
  }
  finally { await payload.destroy(); }
  process.exit(0);
}
