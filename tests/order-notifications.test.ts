import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { Payload } from 'payload';
import { sendStripeScholarshipPaidNotification, sendMerchandiseShippingUpdate } from '../lib/scholarship-email';
import { MerchandiseOrders } from '../collections/MerchandiseOrders';

test('notification delivery and retry behavior', async () => {
  const previousFetch = globalThis.fetch;
  const previousKey = process.env.RESEND_API_KEY;
  const previousFrom = process.env.SCHOLARSHIP_FROM_EMAIL;
  process.env.RESEND_API_KEY = 'test';
  process.env.SCHOLARSHIP_FROM_EMAIL = 'test@example.com';
  const messages: Record<string, string>[] = [];
  let fail = false;
  globalThis.fetch = async (_url, init) => {
    if (fail) return new Response('temporary failure', { status: 503 });
    messages.push(JSON.parse(String(init?.body)));
    return new Response('{}');
  };
  try {
    let saved: unknown[] = [];
    const payload = {
      find: async () => ({ docs: [{ email: 'committee@example.com' }] }),
      findByID: async () => ({ stripeScholarshipNotifiedEmails: saved }),
      update: async ({ data }: { data: { stripeScholarshipNotifiedEmails: unknown[] } }) => { saved = [...data.stripeScholarshipNotifiedEmails]; },
    } as unknown as Payload;
    const input = { checkoutOrderId: '1', scholarshipAmountCents: 12500, purchaserName: '<Friend>', reference: 'stripe:cs_test' };
    fail = true;
    await assert.rejects(sendStripeScholarshipPaidNotification(payload, input));
    assert.deepEqual(saved, []);
    fail = false;
    await sendStripeScholarshipPaidNotification(payload, input);
    await sendStripeScholarshipPaidNotification(payload, input);
    assert.equal(messages.length, 1);
    assert.match(messages[0].text, /\$125\.00/);
    assert.match(messages[0].html, /&lt;Friend&gt;/);

    const hook = MerchandiseOrders.hooks!.beforeChange![0];
    const order = { fulfillmentMethod: 'shipping', status: 'fulfilled', purchaserEmail: 'buyer@example.com', purchaserName: 'Buyer', sourceKey: 'order-1' };
    const invoke = (data: object, originalDoc = order) => hook({ data, originalDoc } as Parameters<typeof hook>[0]);
    await invoke({ status: 'fulfilled' });
    assert.equal(messages.length, 1, 'inventory fulfillment must not email a shipment');
    fail = true;
    const failed = await invoke({ shippingStatus: 'shipped' });
    assert.equal(failed.shippingEmailStatus, 'failed');
    fail = false;
    const sent = await invoke({ shippingStatus: 'shipped', trackingNumber: 'TRACK123' });
    assert.equal(sent.shippingEmailStatus, 'sent');
    assert.match(messages[1].text, /TRACK123/);
    await invoke({ shippingStatus: 'shipped' }, { ...order, ...sent });
    assert.equal(messages.length, 2, 'saving a sent shipment must not duplicate email');
    delete process.env.RESEND_API_KEY;
    assert.equal(await sendMerchandiseShippingUpdate({ recipientEmail: 'buyer@example.com', purchaserName: 'Buyer', reference: '2' }), 'pending_configuration');
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = previousKey;
    if (previousFrom === undefined) delete process.env.SCHOLARSHIP_FROM_EMAIL; else process.env.SCHOLARSHIP_FROM_EMAIL = previousFrom;
  }
});
