import type { MCPPluginConfig } from "@payloadcms/plugin-mcp";
import { createLocalReq, type Where } from "payload";
import { z } from "zod/v3";
import { canEditCRM } from "../lib/crm-access";

type Tool = NonNullable<NonNullable<MCPPluginConfig["mcp"]>["tools"]>[number];
const recordID = z.string().regex(/^[a-f0-9]{24}$/i);
const assignment = z.object({
  ticketID: recordID,
  registrationID: recordID,
  expectedUpdatedAt: z.string().datetime(),
  reason: z.string().trim().min(1).max(4_000),
}).strict();
const relationID = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;
const funded = (status: string) => status === "paid" || status === "recorded";

class AssignmentError extends Error {}

export const crmBreakfastTools: Tool[] = [{
  name: "assign-breakfast-ticket-holder",
  description: "Assign a valid, funded breakfast ticket to an existing attendee registration with a canonical contact. Use the ticket's current updatedAt and provide the reason for the correction.",
  parameters: assignment.shape as unknown as Tool["parameters"],
  async handler(args, request) {
    const user = request.user;
    if (!user || !canEditCRM(user)) throw new Error("Registration management permission is required.");

    const parsed = assignment.safeParse(args);
    if (!parsed.success) throw new Error("Provide a ticket ID, registration ID, the ticket's current updatedAt, and a reason.");
    const input = parsed.data;
    const payload = request.payload;
    const req = await createLocalReq({ user }, payload);
    const transactionID = await payload.db.beginTransaction();
    if (transactionID == null) throw new Error("Ticket corrections require database transactions.");
    req.transactionID = transactionID;
    const options = { req, overrideAccess: false, depth: 0 } as const;

    try {
      const ticket = await payload.findByID({ ...options, collection: "breakfast-tickets", id: input.ticketID, disableErrors: true });
      if (!ticket) throw new AssignmentError("Breakfast ticket was not found.");
      if (ticket.updatedAt !== input.expectedUpdatedAt) throw new AssignmentError("The ticket changed. Look it up again before saving.");
      if (ticket.status !== "valid" || !funded(ticket.paymentStatus)) {
        throw new AssignmentError("Only an unused, funded breakfast ticket can be reassigned.");
      }

      let checkoutOrder = relationID(ticket.checkoutOrder);
      const cashTransaction = relationID(ticket.cashTransaction);
      if (cashTransaction) {
        const cash = await payload.findByID({ ...options, collection: "cash-transactions", id: cashTransaction, disableErrors: true,
          select: { status: true, checkoutOrder: true } });
        if (cash?.status !== "recorded") throw new AssignmentError("The linked cash payment is unavailable or voided.");
        const cashOrder = relationID(cash.checkoutOrder);
        if (checkoutOrder && cashOrder && checkoutOrder !== cashOrder) {
          throw new AssignmentError("The ticket and cash payment reference different checkout orders.");
        }
        checkoutOrder ??= cashOrder;
      }
      if (checkoutOrder) {
        const order = await payload.findByID({ ...options, collection: "checkout-orders", id: checkoutOrder, disableErrors: true,
          select: { paymentStatus: true } });
        if (!order || !funded(order.paymentStatus)) throw new AssignmentError("The linked checkout is unavailable or has an inactive payment.");
      } else {
        const identifiers: Where[] = [];
        for (const field of ["stripeChargeId", "stripePaymentIntentId", "stripeCheckoutSessionId"] as const) {
          if (ticket[field]) identifiers.push({ [field]: { equals: ticket[field] } });
        }
        if (identifiers.length) {
          const orders = await payload.find({ ...options, collection: "checkout-orders", where: { or: identifiers }, limit: 2,
            select: { paymentStatus: true } });
          if (orders.docs.length > 1) throw new AssignmentError("Multiple checkout orders match this ticket. Review the payment in Event CRM.");
          const order = orders.docs[0];
          if (order && !funded(order.paymentStatus)) throw new AssignmentError("The matching checkout has an inactive payment.");
          checkoutOrder = order?.id;
        }
      }

      const registration = await payload.findByID({ ...options, collection: "attendees", id: input.registrationID, disableErrors: true,
        select: { attendanceStatus: true, contact: true } });
      const contactID = relationID(registration?.contact);
      if (!registration || registration.attendanceStatus === "cancelled" || !contactID) {
        throw new AssignmentError("Choose an active attendee registration with a canonical contact.");
      }
      const contact = await payload.findByID({ ...options, collection: "contacts", id: contactID, disableErrors: true, select: {} });
      if (!contact) throw new AssignmentError("The registration's canonical contact was not found.");

      const fromContact = relationID(ticket.holderContact);
      const fromRegistration = relationID(ticket.attendee);
      if (fromContact === contactID && fromRegistration === registration.id) {
        await payload.db.rollbackTransaction(transactionID);
        return { content: [{ type: "text", text: JSON.stringify({ ticketID: ticket.id, registrationID: registration.id, updatedAt: ticket.updatedAt, changed: false }) }] };
      }
      const saved = await payload.update({
        ...options, collection: "breakfast-tickets", id: ticket.id,
        data: { attendee: registration.id, holderContact: contactID },
      });
      const correction = await payload.create({ ...options, overrideAccess: true, collection: "registration-corrections", data: {
        registration: registration.id,
        checkoutOrder,
        correctionType: "breakfast_holder_reassigned",
        fromContact,
        toContact: contactID,
        changedBy: user.id,
        changedAt: new Date().toISOString(),
        reason: input.reason,
        before: { ticketID: ticket.id, attendee: fromRegistration || null, holderContact: fromContact || null },
        after: { ticketID: ticket.id, attendee: registration.id, holderContact: contactID },
      } });
      await payload.db.commitTransaction(transactionID);
      return { content: [{ type: "text", text: JSON.stringify({
        ticketID: saved.id, registrationID: registration.id, correctionID: correction.id, updatedAt: saved.updatedAt, changed: true,
      }) }] };
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID);
      if (error instanceof AssignmentError) throw error;
      throw new Error("The ticket correction could not be saved. Look up the ticket again before retrying.");
    }
  },
}];
