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
  const confirmationId = `NEC-${input.reference.replace(/[^a-z0-9]/gi, "").slice(-12).toUpperCase()}`;
  const itemLines = input.items.length ? input.items.map((item) => `• ${item}`).join("\n") : "• NECYPAA XXXVI order";
  const htmlItems = input.items.length
    ? input.items.map((item) => `<li style="margin:0 0 8px">${escapeHtml(item)}</li>`).join("")
    : "<li>NECYPAA XXXVI order</li>";
  const total = currency(input.totalCents);
  await sendEmail(configuration, {
    to: input.recipientEmail,
    subject: "Your NECYPAA XXXVI order is confirmed",
    text: `Hi ${input.purchaserName},\n\nThank you for your NECYPAA XXXVI order. ${paymentLabel}.\n\nOrder details\n${itemLines}\n\nTotal: ${total}\nConfirmation ID: ${confirmationId}\n\nEvent details\nNECYPAA XXXVI\nDecember 31, 2026 – January 3, 2027\nHartford Marriott Downtown · Hartford, Connecticut\nhttps://necypaact.com/\n\nPlease keep this email for your records. The NECYPAA Host Committee will share additional event information as it becomes available.`,
    html: `<div style="background:#f6f7f9;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2937"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px"><h1 style="margin:0 0 16px;font-size:26px">Your order is confirmed</h1><p>Hi ${escapeHtml(input.purchaserName)},</p><p>Thank you for your NECYPAA XXXVI order. <strong>${escapeHtml(paymentLabel)}.</strong></p><h2 style="font-size:18px;margin:28px 0 12px">Order details</h2><ul style="padding-left:20px">${htmlItems}</ul><p style="font-size:18px"><strong>Total: ${escapeHtml(total)}</strong></p><p>Confirmation ID: <strong>${escapeHtml(confirmationId)}</strong></p><div style="background:#f3f4f6;padding:18px;border-radius:8px"><strong>NECYPAA XXXVI</strong><br>December 31, 2026 – January 3, 2027<br>Hartford Marriott Downtown · Hartford, Connecticut<br><a href="https://necypaact.com/">necypaact.com</a></div><p>Please keep this email for your records. The NECYPAA Host Committee will share additional event information as it becomes available.</p></div></div>`,
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
    text: `Hi ${input.recipientName},\n\n${input.purchaserName} reserved a registration scholarship for you for NECYPAA XXXVI.\n\nNECYPAA XXXVI\nDecember 31, 2026 – January 3, 2027\nHartford Marriott Downtown · Hartford, Connecticut\nhttps://necypaact.com/\n\nThe NECYPAA Host Committee will follow up with registration details.`,
    html: `<div style="background:#f6f7f9;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2937"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px"><h1 style="margin:0 0 16px;font-size:26px">A registration scholarship has been reserved for you</h1><p>Hi ${escapeHtml(input.recipientName)},</p><p>${escapeHtml(input.purchaserName)} reserved a registration scholarship for you for NECYPAA XXXVI.</p><div style="background:#f3f4f6;padding:18px;border-radius:8px"><strong>NECYPAA XXXVI</strong><br>December 31, 2026 – January 3, 2027<br>Hartford Marriott Downtown · Hartford, Connecticut</div><p>The NECYPAA Host Committee will follow up with registration details.</p><p><a href="https://necypaact.com/">Visit NECYPAA XXXVI</a></p></div></div>`,
  });
  return "sent" as const;
}

export async function sendCashScholarshipAlert(input: { recipientEmail: string; scholarshipAmountCents: number }) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(input.scholarshipAmountCents / 100);
  await sendEmail(configuration, {
    to: input.recipientEmail,
    subject: `Cash scholarship request — ${amount}`,
    text: `A cash scholarship request was submitted.\n\nScholarship amount: ${amount}\n\nNECYPAA XXXVI · December 31, 2026 – January 3, 2027 · Hartford Marriott Downtown\nhttps://necypaact.com/`,
    html: `<div style="background:#f6f7f9;padding:32px 16px;font-family:Arial,sans-serif;color:#1f2937"><div style="max-width:600px;margin:0 auto;background:#ffffff;padding:32px;border-radius:12px"><h1 style="margin:0 0 8px;font-size:26px">Cash scholarship request</h1><p style="margin:0 0 24px">A new request was submitted.</p><div style="background:#eff6ff;padding:24px;border-radius:10px;text-align:center"><div style="font-size:14px;text-transform:uppercase;letter-spacing:.08em">Scholarship amount</div><div style="font-size:38px;font-weight:700;margin-top:8px">${escapeHtml(amount)}</div></div><p style="margin:24px 0 0"><strong>NECYPAA XXXVI</strong><br>December 31, 2026 – January 3, 2027<br>Hartford Marriott Downtown · Hartford, Connecticut</p><p><a href="https://necypaact.com/">Visit NECYPAA XXXVI</a></p></div></div>`,
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
