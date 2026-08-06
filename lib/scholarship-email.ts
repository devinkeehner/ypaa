export async function sendScholarshipNotification(input: { recipientEmail: string; recipientName: string; purchaserName: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SCHOLARSHIP_FROM_EMAIL;
  if (!apiKey || !from) return "pending_configuration" as const;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.recipientEmail],
      subject: "A NECYPAA XXXVI registration scholarship has been reserved for you",
      text: `Hi ${input.recipientName},\n\n${input.purchaserName} reserved a registration scholarship for you for NECYPAA XXXVI in Hartford, Connecticut, December 31, 2026 through January 3, 2027.\n\nThe NECYPAA Host Committee will follow up with registration details.`,
    }),
  });
  if (!response.ok) throw new Error("Scholarship notification could not be sent.");
  return "sent" as const;
}
