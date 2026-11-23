import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { getPayload, handleEndpoints } from "payload";
import { hasConfirmedRegistration } from "../lib/registration-check";
import { recordRegistrationOrder, orderFromStripeMetadata } from "../lib/registration-records";
import type { PayloadMcpApiKey } from "../payload-types";

const uri = new URL(process.env.DATABASE_URI || "");
if (uri.hostname !== "127.0.0.1" || !/^\/ypaa_registration_test_[a-z0-9]+$/.test(uri.pathname)) throw new Error("Use the isolated registration runner.");
process.env.PAYLOAD_ENABLE_MCP = "true";

test("CRM MCP uses key permissions, role checks, typed edits and the existing corrections ledger", { timeout: 120_000 }, async () => {
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });
  try {
    await Promise.all(Object.values(payload.db.collections).map((model) => model.init()));
    const admin = await payload.create({ collection: "users", data: { email: "mcp-admin@example.invalid", password: "SyntheticMcpPassword123!", role: "admin" } });
    const viewer = await payload.create({ collection: "users", data: { email: "mcp-viewer@example.invalid", password: "SyntheticMcpPassword123!", role: "viewer" } });
    const key = async (owner: string, tools?: PayloadMcpApiKey["payload-mcp-tool"], editorial = false) => {
      const apiKey = randomUUID();
      await payload.create({ collection: "payload-mcp-api-keys", data: { apiKey, enableAPIKey: true, user: owner, "payload-mcp-tool": tools, pages: editorial ? { find: true } : undefined } });
      return apiKey;
    };
    const readScopes = { findCrmEntries: true, examineCrmEntry: true };
    const writeScopes = {
      ...readScopes, createRegistrationContact: true, updateRegistrationContact: true, createPendingRegistration: true,
      updateRegistrationProfile: true, correctPaidRegistration: true, assignBreakfastTicketHolder: true,
    };
    const [editorial, reader, readonlyAccount, writer] = await Promise.all([
      key(admin.id, undefined, true), key(admin.id, readScopes), key(viewer.id, writeScopes), key(admin.id, writeScopes),
    ]);
    let requestID = 0;
    async function rpc(token: string | undefined, method: string, params?: object) {
      const id = ++requestID;
      const response = await handleEndpoints({ config, request: new Request("http://localhost/api/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
      }) });
      const body = await response.text();
      const events = body.split("\n").filter((line) => line.startsWith("data: ")).map((line) => JSON.parse(line.slice(6)));
      const message = events.length ? events.find((event) => event.id === id) ?? events.at(-1) : JSON.parse(body);
      return { status: response.status, message };
    }
    const tools = async (token: string) => {
      const reply = await rpc(token, "tools/list", {});
      assert.equal(reply.status, 200, JSON.stringify(reply.message));
      assert.ok(reply.message.result?.tools, JSON.stringify(reply.message));
      return reply.message.result.tools.map(({ name }: { name: string }) => name) as string[];
    };
    const call = async (token: string, name: string, args: object) => (await rpc(token, "tools/call", { name, arguments: args })).message;
    const successful = async (token: string, name: string, args: object) => {
      const message = await call(token, name, args);
      assert.ok(message.result && !message.result.isError, JSON.stringify(message));
      return JSON.parse(message.result.content[0].text);
    };
    assert.equal((await rpc(undefined, "tools/list")).status, 401);
    assert.ok(!(await tools(editorial)).includes("examine-crm-entry"));
    assert.ok((await tools(reader)).includes("examine-crm-entry"));
    assert.ok(!(await tools(reader)).includes("create-pending-registration"));
    assert.ok((await tools(writer)).includes("create-pending-registration"));

    const person = { displayName: "Synthetic MCP Attendee", email: "mcp-attendee@example.invalid" };
    const forbidden = await call(readonlyAccount, "create-registration-contact", person);
    assert.match(JSON.stringify(forbidden), /management/i);
    assert.equal((await payload.count({ collection: "contacts" })).totalDocs, 0);
    const contact = await successful(writer, "create-registration-contact", person);
    assert.equal((await successful(writer, "create-registration-contact", person)).id, contact.id);
    const amendedContact = await successful(writer, "update-registration-contact", { id: contact.id, expectedUpdatedAt: contact.updatedAt, patch: { state: "CT" } });
    assert.equal(amendedContact.outcome, "updated");
    assert.equal((await successful(reader, "find-crm-entries", { collection: "contacts", matchBy: "email", value: person.email })).matches[0].id, contact.id);

    const pending = await successful(writer, "create-pending-registration", {
      contactId: contact.id, profile: { fellowships: ["aa", "al_anon"], mobilityAccessibilityAnswer: "yes", accommodations: "Synthetic private accommodation" },
    });
    assert.equal(pending.paymentStatus, "pending");
    assert.equal((await successful(writer, "create-pending-registration", { contactId: contact.id })).created, false);
    assert.equal(await hasConfirmedRegistration(payload, person.email), false);
    const examine = { collection: "attendees", id: pending.id };
    const detail = (await successful(reader, "examine-crm-entry", examine)).entry;
    assert.deepEqual(detail.fellowships, ["aa", "al_anon"]);
    assert.equal(detail.mobilityAccessibilityAnswer, "yes");
    assert.equal(detail.accommodations, "Synthetic private accommodation");
    assert.equal((await successful(readonlyAccount, "examine-crm-entry", examine)).entry.accommodations, undefined);
    const summaries = await successful(reader, "find-crm-entries", { collection: "attendees", matchBy: "contact-id", value: contact.id });
    assert.equal(summaries.matches[0].accommodations, undefined);
    const change = { id: pending.id, expectedUpdatedAt: pending.updatedAt, reason: "Synthetic test correction", profile: { mobilityAccessibilityAnswer: "unanswered", interpretationNeededAnswer: "no" } };
    await successful(writer, "update-registration-profile", change);
    const stale = await call(writer, "update-registration-profile", change);
    assert.match(JSON.stringify(stale), /changed/);
    const updated = (await successful(reader, "examine-crm-entry", examine)).entry;
    assert.equal(updated.mobilityAccessibilityAnswer, "unanswered");
    assert.equal(updated.mobilityAccessibility, false);
    assert.equal(updated.interpretationNeededAnswer, "no");
    const invalid = await call(writer, "update-registration-profile", { ...change, expectedUpdatedAt: updated.updatedAt, profile: { paymentStatus: "paid" } });
    assert.equal(invalid.result?.isError ?? Boolean(invalid.error), true);
    assert.equal(await hasConfirmedRegistration(payload, person.email), false);

    const paid = orderFromStripeMetadata({ attendee_name: "Synthetic Paid Attendee", attendee_email: "mcp-paid@example.invalid", self_registration_quantity: "1", breakfast_friday: "1" }, { name: "Synthetic Payer", email: "mcp-payer@example.invalid" });
    await recordRegistrationOrder(payload, { ...paid, breakfast: { friday: 1, saturday: 0, sunday: 0 } }, { sourceKey: "stripe:cs_live_MCPPAID", stripeCheckoutSessionId: "cs_live_MCPPAID", paymentSource: "stripe", paymentStatus: "paid", dataOrigin: "stripe_backfill", purchasedAt: "2026-10-01T12:00:00Z" });
    const { docs: [paidRegistration] } = await payload.find({ collection: "attendees", depth: 0, where: { attendeeEmail: { equals: "mcp-paid@example.invalid" } } });
    const orderLookup = await successful(reader, "examine-crm-entry", { collection: "checkout-orders", id: paidRegistration.checkoutOrder });
    assert.equal(orderLookup.entry.purchaseDetails.breakfast.totalQuantity, 1);
    assert.equal(orderLookup.entry.rawMetadata, undefined);
    assert.equal(orderLookup.entry.order, undefined);
    assert.equal(typeof paidRegistration.entitlement, "string");
    const seat = await payload.findByID({ collection: "registration-entitlements", id: paidRegistration.entitlement as string, depth: 0 });
    await successful(writer, "correct-paid-registration", {
      registrationId: paidRegistration.id, entitlementId: seat.id, expectedUpdatedAt: paidRegistration.updatedAt,
      expectedEntitlementUpdatedAt: seat.updatedAt, reason: "Synthetic name correction",
      correction: { kind: "correct_name_or_email", displayName: "Synthetic Corrected Attendee", email: paidRegistration.attendeeEmail },
    });
    const { docs: [breakfast] } = await payload.find({ collection: "breakfast-tickets", depth: 0 });
    await successful(writer, "assign-breakfast-ticket-holder", { ticketID: breakfast.id, registrationID: pending.id, expectedUpdatedAt: breakfast.updatedAt, reason: "Synthetic transfer" });
    const ticket = await payload.findByID({ collection: "breakfast-tickets", id: breakfast.id, depth: 0 });
    assert.equal(ticket.holderContact, contact.id);
    assert.equal(ticket.purchaserEmail, "mcp-payer@example.invalid");
    assert.equal((await payload.count({ collection: "registration-corrections" })).totalDocs, 3);
  } finally {
    await payload.db.connection.dropDatabase();
    await payload.destroy();
  }
});
