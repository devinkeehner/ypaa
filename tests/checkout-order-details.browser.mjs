import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
const qa = JSON.parse(await readFile('.orders-qa.json', 'utf8'));
const base = 'http://127.0.0.1:3039';
const evidence = '/tmp/ypaa-orders-qa';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
const errors = [];
const observeConsole = (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
};
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const login = await context.request.post(`${base}/api/users/login`, { timeout: 180000, data: { email: qa.adminEmail, password: qa.password } });
  assert.equal(login.status(), 200);
  const page = await context.newPage(); page.setDefaultTimeout(120000); page.setDefaultNavigationTimeout(180000);
  observeConsole(page);
  await page.goto(`${base}/admin/collections/checkout-orders`);
  assert.equal(new URL(page.url()).pathname, '/admin/collections/checkout-orders'); assert.ok(await page.title());
  await page.getByRole('columnheader', { name: 'Purchased', exact: true }).waitFor();
  await page.getByText('Registration + Scholarship + Breakfast + Merchandise', { exact: true }).first().waitFor();
  const api = await context.request.get(`${base}/api/checkout-orders/${qa.mixedOrderId}?depth=0`); assert.equal(api.status(), 200);
  const data = await api.json(); assert.equal(data.purchaseDetails.merchandise.items[0].size, 'L');
  await page.goto(`${base}/admin/collections/checkout-orders/${qa.mixedOrderId}`);
  const details = page.getByRole('region', { name: 'Purchase details', exact: true });
  await details.getByRole('heading', { name: 'Purchase details', exact: true }).waitFor();
  const text = await details.innerText();
  for (const expected of ['Stripe · method unknown', 'General scholarship fund', 'Saturday × 2', 'Mail / shipping', 'Synthetic shirt', 'Size: L', 'Color: Purple', 'SKU: SYN-L', 'Recorded unit price: $18.00']) assert.ok(text.includes(expected), expected);
  assert.equal(await page.locator('nextjs-portal [data-nextjs-dialog]').count(), 0);
  // Do not inject caret styles into a form whose remaining fields may still be hydrating.
  await details.screenshot({ path: `${evidence}/order-detail-desktop.png`, caret: 'initial' });
  await page.setViewportSize({ width: 390, height: 844 });
  // Payload's surrounding header/document controls can overflow on mobile.
  // Verify the purchase section itself fits and its content wraps.
  assert.ok(await details.evaluate((section) => {
    const bounds = section.getBoundingClientRect();
    return bounds.left >= 0 && bounds.right <= window.innerWidth + 1 && section.scrollWidth <= section.clientWidth + 1;
  }));
  await details.screenshot({ path: `${evidence}/order-detail-mobile.png`, caret: 'initial' });
  await details.getByRole('link', { name: 'Related merchandise order' }).click();
  assert.match(new URL(page.url()).pathname, /\/admin\/collections\/merchandise-orders\//);
  await page.goto(`${base}/admin/collections/checkout-orders/${qa.unknownOrderId}`);
  await page.getByRole('region', { name: 'Purchase details' }).getByText('Purchase details unknown', { exact: true }).waitFor();
  const viewerContext = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const viewerLogin = await viewerContext.request.post(`${base}/api/users/login`, { data: { email: qa.viewerEmail, password: qa.password } }); assert.equal(viewerLogin.status(), 200);
  const viewerPage = await viewerContext.newPage(); viewerPage.setDefaultTimeout(120000);
  observeConsole(viewerPage);
  await viewerPage.goto(`${base}/admin/collections/checkout-orders/${qa.mixedOrderId}`);
  await viewerPage.getByRole('region', { name: 'Purchase details' }).getByText('Delivery choice: Mail / shipping').waitFor();
  const edit = await viewerContext.request.patch(`${base}/api/checkout-orders/${qa.mixedOrderId}`, { data: { totalCents: 1 } }); assert.equal(edit.status(), 403);
  await viewerPage.getByRole('region', { name: 'Purchase details' }).screenshot({ path: `${evidence}/order-detail-viewer.png`, caret: 'initial' });
  assert.deepEqual(errors, []);
  console.log('PASS admin list category column, authenticated REST details, mixed order, historical shipping, desktop/mobile wrapping, related-order navigation, unknown state and read-only viewer. No browser runtime errors.');
} finally { await browser.close(); }
