import type { Payload } from "payload";

type EmailConfiguration = { apiKey: string; from: string };

function emailConfiguration(): EmailConfiguration | null {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SCHOLARSHIP_FROM_EMAIL;
  return apiKey && from ? { apiKey, from } : null;
}

async function sendEmail(configuration: EmailConfiguration, message: { to: string; subject: string; text: string }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${configuration.apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: configuration.from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
  });
  if (!response.ok) throw new Error("Scholarship notification could not be sent.");
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

export async function sendCashScholarshipRequestedNotification(payload: Payload, input: { scholarshipAmountCents: number }) {
  const configuration = emailConfiguration();
  if (!configuration) return "pending_configuration" as const;

  const result = await payload.find({
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

  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(input.scholarshipAmountCents / 100);
  await Promise.all(recipients.map((to) => sendEmail(configuration, {
    to,
    subject: "Cash scholarship requested",
    text: `Cash scholarship amount: ${amount}`,
  })));
  return "sent" as const;
}
