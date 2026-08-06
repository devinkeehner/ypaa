import Stripe from "stripe";

export function getStripe() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured yet.");
  return new Stripe(secret, {
    apiVersion: "2026-02-25.clover" as Stripe.LatestApiVersion,
    appInfo: { name: "NECYPAA XXXVI Sites portal" },
  });
}
