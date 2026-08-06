import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripe } from "@/lib/stripe-server";
import { sendScholarshipNotification } from "@/lib/scholarship-email";
import config from "@payload-config";
import { getPayload } from "payload";
import { recordStripeSession } from "@/lib/registration-records";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!webhookSecret || !signature) return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  try {
    const stripe = getStripe();
    const event = await stripe.webhooks.constructEventAsync(await request.text(), signature, webhookSecret, undefined, Stripe.createSubtleCryptoProvider());
    if ((event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") && event.data.object.payment_status === "paid") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const payload = await getPayload({ config });
      await recordStripeSession(payload, session, "stripe_webhook");
      const recipientEmail = metadata.scholarship_recipient_email;
      if (metadata.necy_has_scholarship === "true" && recipientEmail && recipientEmail !== "None") {
        await sendScholarshipNotification({
          recipientEmail,
          recipientName: metadata.scholarship_recipient_name || "Friend",
          purchaserName: session.customer_details?.name || "Someone in the NECYPAA fellowship",
        });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }
}
