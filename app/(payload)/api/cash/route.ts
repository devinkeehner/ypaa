import config from "@payload-config";
import { NextResponse } from "next/server";
import { getPayload } from "payload";

import { buildMetadata, normalizeOrder, orderSubtotalCents, validateOrder } from "@/lib/registration";
import { sendCashScholarshipRequestedNotification, sendScholarshipNotification } from "@/lib/scholarship-email";
import { getStripe } from "@/lib/stripe-server";
import { recordRegistrationOrder } from "@/lib/registration-records";
import { buildCashRegistrationId, maskCashCode, normalizeCashCode, redeemExternalCashCode, type ExternalRedemptionResult } from "@/lib/cash-access";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { code?: unknown; order?: unknown };
    const code = normalizeCashCode(body.code);
    if (!code) return NextResponse.json({ error: "Enter an access code." }, { status: 400 });
    const order = normalizeOrder(body.order);
    const validation = validateOrder(order);
    if (validation) return NextResponse.json({ error: validation }, { status: 400 });

    const payload = await getPayload({ config });
    let externalRedemption: Extract<ExternalRedemptionResult, { success: true }> | null = null;
    const result = await payload.find({
      collection: "access-codes",
      limit: 1,
      overrideAccess: true,
      where: { and: [{ code: { equals: code } }, { active: { equals: true } }] },
    });
    let accessCode = result.docs[0] as any;
    const environmentCode = normalizeCashCode(process.env.CASH_ACCESS_CODE);
    const externalEligible = order.selfRegistration && !order.scholarship.enabled && Object.values(order.breakfast).every((count) => count === 0);

    if (!accessCode && environmentCode && code === environmentCode) {
      accessCode = await payload.create({
        collection: "access-codes",
        overrideAccess: true,
        data: {
          code,
          active: true,
          maxRedemptions: Math.max(1, Number(process.env.CASH_ACCESS_CODE_MAX_REDEMPTIONS || 1)),
          redemptionCount: 0,
          grantType: "cash_order",
          issuerSource: "environment",
        },
      });
    }

    if (!accessCode && process.env.ISSUER_SERVICE_BASE_URL && process.env.ISSUER_SERVICE_API_KEY) {
      if (!externalEligible) {
        return NextResponse.json({ error: "An externally issued registration code covers one registration only. Remove breakfast tickets and scholarships, then try again." }, { status: 400 });
      }
      const registrationId = buildCashRegistrationId({ code, email: order.attendee.email, name: order.attendee.name });
      const existingExternal = await payload.find({
        collection: "cash-transactions",
        overrideAccess: true,
        limit: 1,
        where: { sourceKey: { equals: `external:${registrationId}` } },
      });
      if (existingExternal.docs[0]) return NextResponse.json({ success: true, reference: String(existingExternal.docs[0].id) });
      const redemption = await redeemExternalCashCode({ code, email: order.attendee.email, fullName: order.attendee.name, registrationId });
      if (!redemption.success) return NextResponse.json({ error: redemption.error || "That access code could not be redeemed." }, { status: 403 });
      if (redemption.registrationId !== registrationId) return NextResponse.json({ error: "The access-code service returned a mismatched registration." }, { status: 409 });
      externalRedemption = redemption;
      accessCode = await payload.create({
        collection: "access-codes",
        overrideAccess: true,
        data: {
          code: `EXTERNAL-${redemption.redemptionId}`.toUpperCase(),
          active: false,
          maxRedemptions: 1,
          redemptionCount: 1,
          grantType: redemption.grantType === "cash_scholarship" ? "door_scholarship" : "complimentary_registration",
          issuerSource: "external-issuer",
          notes: `External grant ${redemption.grantId}; redemption ${redemption.redemptionId}`,
        },
      });
    }

    if (!accessCode || Number(accessCode.redemptionCount || 0) >= Number(accessCode.maxRedemptions || 1)) {
      return NextResponse.json({ error: "That access code is invalid or has reached its redemption limit." }, { status: 403 });
    }

    const recordedValue = orderSubtotalCents(order);
    const metadata = buildMetadata(order, { dataOrigin: "cash_checkout", processingFeeCents: 0, totalChargeCents: 0 });
    delete metadata.necy_processing_fee_line_cents;
    delete metadata.necy_total_charge_cents;
    delete metadata.purchase_type;
    delete metadata.self_registration_quantity;
    delete metadata.scholarship_quantity;
    delete metadata.breakfast_tickets;
    delete metadata.necy_registration_qty_35;
    Object.assign(metadata, {
      registration_type: "cash",
      transaction_method: "cash",
      cash_recorded_value_cents: String(recordedValue),
      access_grant_id: String(accessCode.id),
      access_grant_type: String(accessCode.grantType || "cash_order"),
      access_issuer_source: String(accessCode.issuerSource || "necypaa_host_committee"),
      access_code_masked: maskCashCode(code),
    });
    if (externalRedemption) Object.assign(metadata, {
      access_redemption_id: externalRedemption.redemptionId,
      access_grant_id: externalRedemption.grantId,
      access_grant_type: externalRedemption.grantType,
      access_issuer_source: "external-issuer",
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
        notificationStatus: order.scholarship.enabled ? "pending_configuration" : "not_required",
        sourceKey: externalRedemption ? `external:${buildCashRegistrationId({ code, email: order.attendee.email, name: order.attendee.name })}` : undefined,
      },
    });
    metadata.access_redemption_id = String(transaction.id);
    if (Object.keys(metadata).length > 50) throw new Error("Cash metadata exceeds the 50-field limit.");
    await stripe.customers.update(customer.id, { metadata });
    if (!externalRedemption) await payload.update({
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

    if (order.scholarship.enabled) {
      try {
        if (order.scholarship.kind === "specific") {
          await sendScholarshipNotification({ recipientEmail: order.scholarship.recipientEmail, recipientName: order.scholarship.recipientName, purchaserName: order.purchaserName });
        }
        const status = await sendCashScholarshipRequestedNotification(payload, { scholarshipAmountCents: order.scholarship.amountCents });
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
