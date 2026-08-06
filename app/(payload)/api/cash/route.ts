import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { buildMetadata, normalizeOrder, orderSubtotalCents, validateOrder } from "@/lib/registration";
import { sendScholarshipNotification } from "@/lib/scholarship-email";
import { getStripe } from "@/lib/stripe-server";
import { recordRegistrationOrder } from "@/lib/registration-records";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { code?: unknown; order?: unknown };
    const code = String(body.code || "").trim().toUpperCase();
    if (!code) return NextResponse.json({ error: "Enter an access code." }, { status: 400 });
    const order = normalizeOrder(body.order);
    const validation = validateOrder(order);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });

    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "access-codes",
      limit: 1,
      overrideAccess: true,
      where: { and: [{ code: { equals: code } }, { active: { equals: true } }] },
    });
    const accessCode = result.docs[0];
    if (!accessCode || Number(accessCode.redemptionCount || 0) >= Number(accessCode.maxRedemptions || 1)) {
      return NextResponse.json({ error: "That access code is invalid or has reached its redemption limit." }, { status: 403 });
    }

    const recordedValue = orderSubtotalCents(order);
    const metadata = buildMetadata(order, { dataOrigin: "cash_checkout", processingFeeCents: 0, totalChargeCents: 0 });
    delete metadata.necy_processing_fee_line_cents;
    delete metadata.necy_total_charge_cents;
    delete metadata.breakfast_price_version;
    Object.assign(metadata, {
      registration_type: "cash",
      transaction_method: "cash",
      cash_recorded_value_cents: String(recordedValue),
      access_grant_id: String(accessCode.id),
      access_grant_type: String(accessCode.grantType || "cash_order"),
      access_issuer_source: String(accessCode.issuerSource || "necypaa_host_committee"),
      access_code_masked: `****${code.slice(-4)}`,
    });

    const stripe = getStripe();
    const existing = await stripe.customers.list({ email: order.purchaserEmail, limit: 1 });
    const customer = existing.data[0]
      ? await stripe.customers.update(existing.data[0].id, { name: order.purchaserName, metadata })
      : await stripe.customers.create({ name: order.purchaserName, email: order.purchaserEmail, metadata });

    const transaction = await payload.create({
      collection: "cash-transactions",
      overrideAccess: true,
      data: {
        purchaserName: order.purchaserName,
        purchaserEmail: order.purchaserEmail,
        recordedValueCents: recordedValue,
        status: "recorded",
        stripeCustomerId: customer.id,
        accessCode: accessCode.id,
        order,
        metadata,
        notificationStatus: order.scholarship.enabled && order.scholarship.kind === "specific" ? "pending_configuration" : "not_required",
      },
    });
    metadata.access_redemption_id = String(transaction.id);
    if (Object.keys(metadata).length > 50) throw new Error("Cash metadata exceeds the 50-field limit.");
    await stripe.customers.update(customer.id, { metadata });
    await payload.update({
      collection: "access-codes",
      id: accessCode.id,
      overrideAccess: true,
      data: { redemptionCount: Number(accessCode.redemptionCount || 0) + 1 },
    });
    await recordRegistrationOrder(payload, order, {
      sourceKey: `cash:${transaction.id}`,
      paymentSource: "cash",
      paymentStatus: "recorded",
      dataOrigin: "cash_checkout",
      purchasedAt: transaction.createdAt,
      stripeCustomerId: customer.id,
      cashTransactionId: transaction.id,
      rawMetadata: metadata,
    });

    if (order.scholarship.enabled && order.scholarship.kind === "specific") {
      try {
        const status = await sendScholarshipNotification({ recipientEmail: order.scholarship.recipientEmail, recipientName: order.scholarship.recipientName, purchaserName: order.purchaserName });
        await payload.update({ collection: "cash-transactions", id: transaction.id, overrideAccess: true, data: { notificationStatus: status } });
      } catch {
        await payload.update({ collection: "cash-transactions", id: transaction.id, overrideAccess: true, data: { notificationStatus: "failed" } });
      }
    }
    return NextResponse.json({ success: true, reference: String(transaction.id) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cash order could not be recorded.";
    return NextResponse.json({ error: message }, { status: message.includes("configured") ? 503 : 500 });
  }
}
