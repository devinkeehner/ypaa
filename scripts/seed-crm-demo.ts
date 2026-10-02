import { orderFromStripeMetadata, recordRegistrationOrder } from "../lib/registration-records";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
process.loadEnvFile(".env.local");
// Fixed local destination; this script cannot seed production or the original local database.
process.env.DATABASE_URI = "mongodb://127.0.0.1:27018/ypaa_crm_demo?replicaSet=crmDemo";
process.env.PAYLOAD_ENABLE_MCP = "false";
process.env.ENABLE_R2 = "false";
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
const payload = await getPayload({ config });
try {
  const metadata = { attendee_name: "DEMO Riley Sample", attendee_email: "riley@example.invalid", self_registration_quantity: "1", breakfast_tickets: "Breakfast - Saturday x1", demo: "Synthetic practice record. No payment was collected." };
  const order = orderFromStripeMetadata(metadata, { name: "DEMO Practice Purchaser", email: "purchaser@example.invalid" });
  await recordRegistrationOrder(payload, order, { sourceKey: "demo:practice", paymentSource: "cash", paymentStatus: "recorded", dataOrigin: "cash_checkout", purchasedAt: "2026-08-23T12:00:00Z", stripeCheckoutSessionId: "demo_practice_not_a_stripe_session", rawMetadata: metadata });
  const email = "viewer@crm-demo.invalid";
  const viewer = await payload.find({ collection: "users", overrideAccess: true, limit: 1, where: { email: { equals: email } } });
  if (!viewer.docs.length) {
    const password = randomBytes(24).toString("base64url");
    await payload.create({ collection: "users", overrideAccess: true, data: { email, password, role: "viewer" } });
    await mkdir(".local-crm", { recursive: true });
    await writeFile(".local-crm/viewer-access.txt", `Local demo only\nURL: http://127.0.0.1:3000/admin\nEmail: ${email}\nPassword: ${password}\nRole: Read-only viewer\n`);
  }
  console.log('Practice record ready: search for "DEMO". No Stripe payment or email was sent.');
} finally { await payload.destroy(); }

process.exit(0);
