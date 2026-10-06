import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { build } = require('esbuild');
const { chromium } = require('playwright');
const repo = path.resolve(new URL('..', import.meta.url).pathname);
const output = await fs.mkdtemp(path.join(os.tmpdir(), 'program-board-qa-'));
await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {ProgramBoard} from './components/admin/ProgramBoard'; createRoot(document.getElementById('root')).render(<ProgramBoard/>);`, resolveDir: repo, loader: 'tsx' }, bundle: true, outfile: path.join(output, 'bundle.js'), define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'link', setup(builder) { builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'link', namespace: 'stub' })); builder.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: `import React from 'react'; export default p=>React.createElement('a',p,p.children);`, resolveDir: repo })); } }] });
const css = ':root {--font-geist-sans:Arial;--font-geist-mono:monospace;}\n' + (await fs.readFile(path.join(repo, 'app/globals.css'), 'utf8')).replace('@import "tailwindcss";', await fs.readFile(require.resolve('tailwindcss/preflight.css'), 'utf8'));
const browser = await chromium.launch({ headless: true, ...(process.env.PROGRAM_BROWSER_EXECUTABLE ? { executablePath: process.env.PROGRAM_BROWSER_EXECUTABLE } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'UTC' });
const origin = 'http://program-board-fixture.test';
const rooms = Array.from({ length: 8 }, (_, index) => ({ id: `r${index}`, name: `Room ${index}`, shortLabel: `Room ${index}`, displayOrder: index, color: '#E85E27' }));
const time = value => new Date(`2026-12-31T${value}:00-05:00`).toISOString();
const fixture = () => [{ id: 'A', title: 'Synthetic A', slug: 'a', startAt: time('09:00'), endAt: time('10:00'), room: 'r0', internalNotes: 'Preserve notes', updatedAt: '2026-10-06T00:00:00.000Z', scheduleRevision: 0 }, { id: 'B', title: 'Synthetic B', slug: 'b', startAt: time('10:00'), endAt: time('11:30'), room: 'r0', updatedAt: '2026-10-06T00:00:00.000Z', scheduleRevision: 0 }];
let data = fixture(), fail = false, writes = [], errors = [];
await context.route('**/*', async route => {
  const request = route.request(), url = new URL(request.url());
  if (url.origin !== origin) return route.abort();
  if (url.pathname === '/bundle.js') return route.fulfill({ contentType: 'text/javascript', body: await fs.readFile(path.join(output, 'bundle.js')) });
  if (url.pathname === '/style.css') return route.fulfill({ contentType: 'text/css', body: css });
  if (!url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Synthetic Program Board QA</title><link rel="stylesheet" href="/style.css"><div id="root"></div><script src="/bundle.js"></script>' });
  if (request.method() === 'GET') return route.fulfill({ json: url.pathname === '/api/users/me' ? { user: { id: 'user', role: 'admin' } } : { docs: url.pathname === '/api/rooms' ? rooms : data, hasNextPage: false } });
  const input = request.postDataJSON(); writes.push(input);
  if (fail) return route.abort('failed');
  assert.equal(url.pathname, '/api/admin/program-schedule');
  const docs = [];
  for (const change of input.changes || []) {
    const doc = data.find(doc => doc.id === change.id);
    if (doc.scheduleRevision !== change.expectedRevision || doc.updatedAt !== change.expectedUpdatedAt) return route.fulfill({ status: 409, json: { error: 'A session changed since you loaded it. Reload and reopen the session.' } });
    const updated = { ...doc, ...change.data, scheduleRevision: doc.scheduleRevision + 1, updatedAt: new Date(Date.parse(doc.updatedAt) + 1).toISOString() };
    data = data.map(item => item.id === doc.id ? updated : item); docs.push(updated);
  }
  return route.fulfill({ json: { docs } });
});
const page = await context.newPage(); page.on('pageerror', error => errors.push(error.message));
const load = async () => { await page.goto(origin); await page.locator('.program-board-event').first().waitFor(); };
const card = title => page.locator('.program-board-event').filter({ hasText: title });
try {
  await load(); assert.equal(await page.title(), 'Synthetic Program Board QA'); assert.equal(await page.locator('.program-board-axis span').first().textContent(), '8:00 AM'); assert.deepEqual(errors, []);
  await card('Synthetic A').click(); assert.equal(await page.getByLabel('Internal committee notes').inputValue(), 'Preserve notes');
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true }), save = page.getByRole('button', { name: 'Save session', exact: true });
  assert.equal(await cancel.evaluate(e => getComputedStyle(e).color), 'rgb(27, 29, 31)');
  assert.equal(await save.evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(185, 64, 19)');
  await save.focus(); await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => !!document.activeElement.closest('[role=dialog]')), true);
  await page.locator('.program-board-modal footer').scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(output, 'modal-desktop.png') });
  await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0); assert.equal(await card('Synthetic A').evaluate(e => e === document.activeElement), true);
  await card('Synthetic A').click(); await save.click(); await page.getByRole('dialog').waitFor({ state: 'hidden' }); assert.equal(writes.at(-1).changes[0].data.internalNotes, 'Preserve notes');
  await page.getByRole('button', { name: 'Resize end of Synthetic A', exact: true }).press('ArrowDown');
  await page.getByRole('region', { name: 'Review resize' }).waitFor(); const before = writes.length;
  await page.getByRole('button', { name: 'Cancel resize', exact: true }).click(); assert.equal(writes.length, before);
  await page.getByRole('button', { name: 'Resize end of Synthetic A', exact: true }).press('ArrowDown'); await page.getByRole('button', { name: 'Apply resize', exact: true }).click();
  await page.getByText('Schedule saved. You can undo this change.', { exact: true }).waitFor(); assert.equal(writes.at(-1).changes.length, 2);
  await page.getByRole('button', { name: 'Undo last change', exact: true }).click(); await page.getByText('Schedule change undone.', { exact: true }).waitFor(); assert.equal(data[0].endAt, time('10:00')); assert.equal(data[1].startAt, time('10:00'));
  const destination = page.getByRole('button', { name: 'Add session in Room 1 at 09:00', exact: true });
  await card('Synthetic A').dragTo(destination); await page.getByText('Schedule saved. You can undo this change.', { exact: true }).waitFor(); assert.equal(data[0].room, 'r1'); assert.equal(data[0].endAt, time('10:00'));
  await page.getByRole('button', { name: 'Undo last change', exact: true }).click(); await page.getByText('Schedule change undone.', { exact: true }).waitFor(); assert.equal(data[0].room, 'r0');
  fail = true; await card('Synthetic A').dragTo(destination); await page.getByText(/Connection lost/).waitFor(); assert.equal(await card('Synthetic A').getAttribute('aria-busy'), 'false'); assert.equal(data[0].room, 'r0'); fail = false;
  fail = true; await card('Synthetic A').click(); await save.click(); await page.getByRole('alert').waitFor(); assert.equal(await save.isDisabled(), true); // reload is required after an uncertain response
  assert.equal(await page.getByRole('button', { name: 'Saving…', exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Internal committee notes').inputValue(), 'Preserve notes');
  fail = false; await page.getByRole('alert').getByRole('button', { name: 'Reload schedule' }).click(); await page.waitForFunction(() => !document.querySelector('.program-board-modal button[type=submit]').disabled); await cancel.click();
  // Exercise actual pointer resize, then cancel its affected-neighbor review.
  const handle = page.getByRole('button', { name: 'Resize end of Synthetic A', exact: true }); await handle.scrollIntoViewIfNeeded(); const bounds = await handle.boundingBox(); await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2); await page.mouse.down(); await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 + 58, { steps: 8 }); await page.mouse.up(); await page.getByRole('button', { name: 'Cancel resize', exact: true }).click();
  await page.locator('.program-board-scroll').evaluate(e => e.scrollTop = 600); const header = await page.locator('.program-board-room').first().boundingBox(), scroll = await page.locator('.program-board-scroll').boundingBox(); assert.ok(Math.abs(header.y - scroll.y) < 2);
  await page.locator('.program-board-scroll').evaluate(e => e.scrollTop = 0); await page.setViewportSize({ width: 390, height: 844 }); await card('Synthetic A').click(); await page.locator('.program-board-modal footer').scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(output, 'modal-mobile.png') });
  console.log(JSON.stringify({ passed: true, output, expectedInjectedErrors: errors }, null, 2));
} finally { await browser.close(); }
