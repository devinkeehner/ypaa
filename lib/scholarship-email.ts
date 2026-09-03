import type { Payload } from "payload";

type EmailConfiguration = { apiKey: string; from: string };

function emailConfiguration(): EmailConfiguration | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SCHOLARSHIP_FROM_EMAIL;
  return apiKey && from ? { apiKey, from } : null;
}

async function sendEmail(configuration: EmailConfiguration, message: { to: string; subject: string; text: string; html?: string; idempotencyKey?: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${configuration.apiKey}`,
      "Content-Type": "application/json",
      ...(message.idempotencyKey ? { "Idempotency-Key": message.idempotencyKey } : {}),
    },
    body: JSON.stringify({
      from: configuration.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      ...(message.html ? { html: message.html } : {}),
    }),
  });
  if (!response.ok) throw new Error("Scholarship notification could not be sent.");
}

type PurchaserConfirmation = {
  recipientEmail: string;
  purchaserName: string;
  paymentMethod: "card" | "cash";
  reference: string;
  totalCents: number;
  items: string[];
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] || character);
const currency = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export async function sendPurchaserConfirmation(input: PurchaserConfirmation) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;
  const paymentLabel = input.paymentMethod === "cash" ? "Cash registration recorded" : "Card payment received";
  const itemLines = input.items.length ? input.items.map((item) => `• ${item}`).join("\n") : "• NECYPAA XXXVI order";
  const htmlItems = input.items.length
    ? input.items.map((item) => `<li style="margin:0 0 8px">${escapeHtml(item)}</li>`).join("")
    : "<li>NECYPAA XXXVI order</li>";
  const total = currency(input.totalCents);
  await sendEmail(configuration, {
    to: input.recipientEmail,
    subject: "Your NECYPAA XXXVI order is confirmed",
    text: `Hi ${input.purchaserName},\n\nThank you for your NECYPAA XXXVI order. ${paymentLabel}.\n\nOrder details\n${itemLines}\n\nTotal: ${total}\nConfirmation reference: ${input.reference}\n\nPlease keep this email for your records. The NECYPAA Host Committee will share additional event information as it becomes available.\n\nNECYPAA XXXVI`,
    html: `<div style="background:#f6f7f9;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2937"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px"><h1 style="margin:0 0 16px;font-size:26px">Your order is confirmed</h1><p>Hi ${escapeHtml(input.purchaserName)},</p><p>Thank you for your NECYPAA XXXVI order. <strong>${escapeHtml(paymentLabel)}.</strong></p><h2 style="font-size:18px;margin:28px 0 12px">Order details</h2><ul style="padding-left:20px">${htmlItems}</ul><p style="font-size:18px"><strong>Total: ${escapeHtml(total)}</strong></p><p>Confirmation reference: ${escapeHtml(input.reference)}</p><p>Please keep this email for your records. The NECYPAA Host Committee will share additional event information as it becomes available.</p><p style="margin:28px 0 0">NECYPAA XXXVI</p></div></div>`,
    idempotencyKey: `purchaser-confirmation:${input.reference}`,
  });
  return "sent" as const;
}

export async function sendScholarshipNotification(input: { recipientEmail: string; recipientName: string; purchaserName: string }) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;
  await sendEmail(configuration, {
    to: input.recipientEmail,
    subject: "A NECYPAA XXXVI registration scholarship has been reserved for you",
    text: `Hi ${input.recipientName},\n\n${input.purchaserName} reserved a registration scholarship for you for NECYPAA XXXVI in Hartford, Connecticut, December 31, 2026 through January 3, 2027.\n\nThe NECYPAA Host Committee will follow up with registration details.`,
  });
  return "sent" as const;
}

export async function sendCashScholarshipAlert(input: { recipientEmail: string; scholarshipAmountCents: number }) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(input.scholarshipAmountCents / 100);
  await sendEmail(configuration, {
    to: input.recipientEmail,
    subject: "Cash scholarship requested",
    text: `Cash scholarship amount: ${amount}`,
  });
  return "sent" as const;
}

export async function sendCashScholarshipRequestedNotification(payload: Payload, input: { scholarshipAmountCents: number }) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;

  // This collection is registered in Payload config. Keep this narrow local type
  // so deployment does not depend on unrelated pending generated-type updates.
  const notificationRecipients = payload as unknown as {
    find: (options: {
      collection: "notification-recipients";
      overrideAccess: true;
      pagination: false;
      where: unknown;
    }) => Promise<{ docs: Array<{ email?: string | null }> }>;
  };
  const result = await notificationRecipients.find({
    collection: "notification-recipients",
    overrideAccess: true,
    pagination: false,
    where: {
      and: [
        { active: { equals: true } },
        { triggers: { contains: "cash_scholarship_requested" } },
      ],
    },
  });
  const recipients = result.docs.map((recipient) => recipient.email).filter((email): email is string => Boolean(email));
  if (recipients.length === 0) return "pending_configuration" as const;

  await Promise.all(recipients.map((recipientEmail) => sendCashScholarshipAlert({ recipientEmail, scholarshipAmountCents: input.scholarshipAmountCents })));
  return "sent" as const;
}
