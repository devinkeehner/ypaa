import type { Payload } from "payload";

type ID = string | number;
type Person = { name: string; email: string; state?: string; homegroupCommittee?: string; tags: string[] };

const normalized = (value: unknown) => String(value || "").trim().toLowerCase();

async function findOrCreateContact(payload: Payload, person: Person) {
  const existing = await payload.find({
    collection: "contacts",
    overrideAccess: true,
    limit: 1,
    where: { and: [{ email: { equals: normalized(person.email) } }, { displayName: { equals: person.name.trim() } }] },
  });
  if (existing.docs[0]) return { id: existing.docs[0].id as ID, created: false };
  const contact = await payload.create({
    collection: "contacts",
    overrideAccess: true,
    data: { contactKey: `contact:${crypto.randomUUID()}`, displayName: person.name.trim(), email: normalized(person.email), state: person.state || "", homegroupCommittee: person.homegroupCommittee || "", communicationConsent: "unknown", tags: person.tags },
  });
  return { id: contact.id as ID, created: true };
}

process.loadEnvFile?.(".env.local");
if (!/^mongodb:\/\/(localhost|127\.0\.0\.1)(:|\/)/i.test(process.env.DATABASE_URI || "")) throw new Error("Contact migration is restricted to the local MongoDB database.");
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
const payload = await getPayload({ config });
const stats = { contactsCreated: 0, registrationsLinked: 0, ordersLinked: 0, breakfastTicketsLinked: 0 };
const attendeeContact = new Map<string, ID>();

const registrations = await payload.find({ collection: "attendees", overrideAccess: true, limit: 1000, depth: 0 });
for (const registration of registrations.docs) {
  const contact = await findOrCreateContact(payload, { name: String(registration.attendeeName), email: String(registration.attendeeEmail), state: String(registration.state || ""), homegroupCommittee: String(registration.homegroupCommittee || ""), tags: ["attendee", ...(registration.attendanceBasis === "scholarship_recipient" ? ["scholarship_recipient"] : []), ...(registration.willingToServe ? ["volunteer"] : [])] });
  if (contact.created) stats.contactsCreated += 1;
  attendeeContact.set(String(registration.id), contact.id);
  if (String(registration.contact || "") !== String(contact.id)) {
    await payload.update({ collection: "attendees", id: registration.id, overrideAccess: true, data: { contact: contact.id } });
    stats.registrationsLinked += 1;
  }
}

const orders = await payload.find({ collection: "checkout-orders", overrideAccess: true, limit: 1000, depth: 0 });
for (const order of orders.docs) {
  const contact = await findOrCreateContact(payload, { name: String(order.purchaserName), email: String(order.purchaserEmail), tags: ["purchaser"] });
  if (contact.created) stats.contactsCreated += 1;
  if (String(order.purchaserContact || "") !== String(contact.id)) {
    await payload.update({ collection: "checkout-orders", id: order.id, overrideAccess: true, data: { purchaserContact: contact.id } });
    stats.ordersLinked += 1;
  }
}

const tickets = await payload.find({ collection: "breakfast-tickets", overrideAccess: true, limit: 1000, depth: 0 });
for (const ticket of tickets.docs) {
  const registrationID = typeof ticket.attendee === "object" && ticket.attendee ? ticket.attendee.id : ticket.attendee;
  const contactID = registrationID == null ? undefined : attendeeContact.get(String(registrationID));
  if (contactID && String(ticket.holderContact || "") !== String(contactID)) {
    await payload.update({ collection: "breakfast-tickets", id: ticket.id, overrideAccess: true, data: { holderContact: contactID } });
    stats.breakfastTicketsLinked += 1;
  }
}

console.log(JSON.stringify({ ...stats, contacts: await payload.count({ collection: "contacts", overrideAccess: true }) }, null, 2));
await payload.db.destroy();
