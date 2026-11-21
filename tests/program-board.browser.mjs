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
await build({ stdin: { contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {ProgramBoard} from './components/admin/ProgramBoard'; import {ProgramExplorer} from './components/site/ProgramExplorer'; const root=createRoot(document.getElementById('root')); if(location.pathname==='/program-preview'){ const room={id:'test-room',name:'Test Room',shortLabel:'Test Room',displayOrder:0}; root.render(<ProgramExplorer initialData={{rooms:[room],maps:[],sessions:[{id:'test-session',title:'Preview Session',slug:'preview-session',sessionType:'panel',startAt:'2026-12-31T14:00:00.000Z',endAt:'2026-12-31T15:00:00.000Z',room}]}}/>); } else root.render(<ProgramBoard/>);`, resolveDir: repo, loader: 'tsx' }, bundle: true, outfile: path.join(output, 'bundle.js'), define: { 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'link', setup(builder) { builder.onResolve({ filter: /^next\/link$/ }, () => ({ path: 'link', namespace: 'stub' })); builder.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: `import React from 'react'; export default p=>React.createElement('a',p,p.children);`, resolveDir: repo })); } }] });
const css = ':root {--font-geist-sans:Arial;--font-geist-mono:monospace;}\n' + (await fs.readFile(path.join(repo, 'app/globals.css'), 'utf8')).replace('@import "tailwindcss";', await fs.readFile(require.resolve('tailwindcss/preflight.css'), 'utf8'));
const testWebMCP = process.env.PROGRAM_BROWSER_WEBMCP === '1';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.PROGRAM_BROWSER_EXECUTABLE ? { executablePath: process.env.PROGRAM_BROWSER_EXECUTABLE } : {}),
  ...(testWebMCP ? { args: ['--enable-features=WebMCPTesting'] } : {}),
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, timezoneId: 'UTC' });
const origin = 'https://program-board-fixture.test';
const rooms = Array.from({ length: 8 }, (_, index) => ({ id: `r${index}`, name: `Room ${index}`, shortLabel: `Room ${index}`, displayOrder: index, color: '#E85E27' }));
const time = value => new Date(`2026-12-31T${value}:00-05:00`).toISOString();
const fixture = () => [{ id: 'A', title: 'Synthetic A', slug: 'a', startAt: time('09:00'), endAt: time('10:00'), room: 'r0', internalNotes: 'Preserve notes', updatedAt: '2026-10-06T00:00:00.000Z', scheduleRevision: 0 }, { id: 'B', title: 'Synthetic B', slug: 'b', startAt: time('10:00'), endAt: time('11:30'), room: 'r0', updatedAt: '2026-10-06T00:00:00.000Z', scheduleRevision: 0 }];
let data = fixture(), fail = false, writes = [], errors = [];
let user = { id: 'user', role: 'admin' };
await context.route('**/*', async route => {
  const request = route.request(), url = new URL(request.url());
  if (url.origin !== origin) return route.abort();
  if (url.pathname === '/bundle.js') return route.fulfill({ contentType: 'text/javascript', body: await fs.readFile(path.join(output, 'bundle.js')) });
  if (url.pathname === '/style.css') return route.fulfill({ contentType: 'text/css', body: css });
  if (url.pathname === '/admin/program-board') {
    return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Synthetic Payload Admin</title><iframe title="NECYPAA Program Board" src="/program-editor" style="width:100%; height:900px; border:0"></iframe>' });
  }
  if (!url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Synthetic Program Board QA</title><link rel="stylesheet" href="/style.css"><div id="root"></div><script src="/bundle.js"></script>' });
  if (request.method() === 'GET') return route.fulfill({ json: url.pathname === '/api/users/me' ? { user } : { docs: url.pathname === '/api/rooms' ? rooms : data, hasNextPage: false } });
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
  const source = card('Synthetic A');
  const sourceBox = await source.boundingBox();
  const occupiedBox = await card('Synthetic B').boundingBox();
  const beginDrag = async () => {
    await page.mouse.move(sourceBox.x + sourceBox.width / 3, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
  };
  const writesBeforeInvalid = writes.length;
  await beginDrag();
  await page.mouse.move(occupiedBox.x + occupiedBox.width / 3, occupiedBox.y + 30, { steps: 8 });
  const invalid = page.locator('.program-board-drop-preview[data-invalid="true"]');
  await invalid.waitFor();
  assert.match(await invalid.textContent(), /Overlaps Synthetic B/);
  await page.mouse.up();
  await page.getByText(/Move blocked/).waitFor();
  assert.equal(writes.length, writesBeforeInvalid);

  await beginDrag();
  const targetBox = await destination.boundingBox();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 8 });
  await page.locator('.program-board-drop-preview[data-invalid="false"]').waitFor();
  await page.screenshot({ path: path.join(output, 'move-preview.png') });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await page.locator('.program-board-drop-preview').waitFor({ state: 'hidden' });
  assert.equal(writes.length, writesBeforeInvalid);
  assert.equal(await page.getByRole('dialog').count(), 0);

  await beginDrag();
  const scroller = page.locator('.program-board-scroll');
  const scrollBounds = await scroller.boundingBox();
  await page.mouse.move(scrollBounds.x + scrollBounds.width - 24, scrollBounds.y + scrollBounds.height - 28, { steps: 10 });
  await page.waitForFunction(() => {
    const element = document.querySelector('.program-board-scroll');
    return element.scrollLeft > 35 && element.scrollTop > 35;
  });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await scroller.evaluate(element => { element.scrollTo(0, 0); });
  assert.equal(writes.length, writesBeforeInvalid);

  await source.press('Shift+ArrowRight');
  await page.getByText('Schedule saved. You can undo this change.', { exact: true }).waitFor();
  assert.equal(data[0].room, 'r1');
  await page.getByRole('button', { name: 'Undo last change', exact: true }).click();
  await page.getByText('Schedule change undone.', { exact: true }).waitFor();
  fail = true; await card('Synthetic A').dragTo(destination); await page.getByText(/Connection lost/).waitFor(); assert.equal(await card('Synthetic A').getAttribute('aria-busy'), 'false'); assert.equal(data[0].room, 'r0'); fail = false;
  fail = true; await card('Synthetic A').click(); await save.click(); await page.getByRole('alert').waitFor(); assert.equal(await save.isDisabled(), true); // reload is required after an uncertain response
  assert.equal(await page.getByRole('button', { name: 'Saving…', exact: true }).count(), 0);
  assert.equal(await page.getByLabel('Internal committee notes').inputValue(), 'Preserve notes');
  fail = false; await page.getByRole('alert').getByRole('button', { name: 'Reload schedule' }).click(); await page.waitForFunction(() => !document.querySelector('.program-board-modal button[type=submit]').disabled); await cancel.click();
  // Exercise actual pointer resize, then cancel its affected-neighbor review.
  const handle = page.getByRole('button', { name: 'Resize end of Synthetic A', exact: true }); await handle.scrollIntoViewIfNeeded(); const bounds = await handle.boundingBox(); await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2); await page.mouse.down(); await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2 + 58, { steps: 8 }); await page.mouse.up(); await page.getByRole('button', { name: 'Cancel resize', exact: true }).click();
  await page.locator('.program-board-scroll').evaluate(e => e.scrollTop = 600); const header = await page.locator('.program-board-room').first().boundingBox(), scroll = await page.locator('.program-board-scroll').boundingBox(); assert.ok(Math.abs(header.y - scroll.y) < 2);
  await page.locator('.program-board-scroll').evaluate(e => e.scrollTop = 0); await page.setViewportSize({ width: 390, height: 844 }); await card('Synthetic A').click(); await page.locator('.program-board-modal footer').scrollIntoViewIfNeeded(); await page.screenshot({ path: path.join(output, 'modal-mobile.png') });
  await page.keyboard.press('Escape');
  const narrowBoardHeader = await page.locator('.program-board-header').boundingBox();
  const narrowBoardToolbar = await page.locator('.program-board-toolbar').boundingBox();
  const narrowChromeHeight = narrowBoardHeader.height + narrowBoardToolbar.height;
  assert.ok(narrowChromeHeight < 205, `small-screen controls take ${narrowChromeHeight}px`);
  await page.setViewportSize({ width: 1440, height: 900 });
  await load();
  const compactHeader = page.locator('.program-board-header');
  assert.ok((await compactHeader.boundingBox()).height <= 64);
  const boardGrid = await page.locator('.program-board-grid').boundingBox();
  assert.ok(boardGrid.y < 125, 'the desktop board grid is visible near the top');
  const help = page.getByLabel('Board controls');
  await help.click();
  await page.getByText(/On touch screens, drag the left grip/).waitFor();
  assert.equal((await page.locator('.program-board-grid').boundingBox()).y, boardGrid.y);
  await help.click();
  await page.screenshot({ path: path.join(output, 'compact-board.png') });

  await page.goto(origin + '/program-preview');
  const programTitle = page.getByRole('heading', { name: 'Convention program', exact: true });
  await programTitle.waitFor();
  await page.getByRole('button', { name: /Preview Session/ }).waitFor();
  const schedule = await page.locator('.program-grid-scroll').boundingBox();
  assert.ok(schedule.y < 190, 'the desktop program schedule is visible near the top');
  const roomHeading = await page.locator('.program-grid-room').first().boundingBox();
  assert.ok(roomHeading.y - schedule.y < 4, 'the room headings sit at the top of their scroll container');
  await page.screenshot({ path: path.join(output, 'compact-desktop-program.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('region', { name: 'Swipe between program days' }).waitFor();
  assert.equal(await programTitle.isVisible(), false);

  if (testWebMCP) {
    data = fixture();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(origin + '/admin/program-board');
    assert.equal(await page.title(), 'Synthetic Payload Admin');
    const board = page.frameLocator('iframe[title="NECYPAA Program Board"]');
    const boardHeading = board.getByRole('heading', { name: 'Program Board', exact: true });
    const loadTools = async (count) => {
      await boardHeading.waitFor();
      await page.waitForFunction(async (expected) => (await document.modelContext.getTools()).length === expected, count);
      return page.evaluate(async () => (await document.modelContext.getTools()).map(tool => tool.name));
    };
    const execute = (name, args) => page.evaluate(async ({ name, args }) => {
      const tools = await document.modelContext.getTools();
      const result = await document.modelContext.executeTool(tools.find(tool => tool.name === name), args);
      return typeof result === 'string' ? JSON.parse(result) : result;
    }, { name, args });
    assert.deepEqual((await loadTools(3)).sort(), ['program_board_list', 'program_board_stage_move', 'program_board_stage_resize']);
    const listing = await execute('program_board_list', { roomId: 'r0' });
    assert.equal(listing.timeZone, 'America/New_York');
    assert.deepEqual(listing.sessions.map(session => session.id), ['A', 'B']);
    assert.equal(JSON.stringify(listing).includes('Preserve notes'), false);
    const writeCount = writes.length;
    const move = { sessionId: 'A', date: '2026-12-31', roomId: 'r0', startTime: '10:00' };
    assert.match((await execute('program_board_stage_move', move)).error, /already uses that room and time/);
    const destination = { ...move, date: '2027-01-01', roomId: 'r1' };
    const pending = await execute('program_board_stage_move', destination);
    assert.equal(pending.status, 'awaiting_review');
    assert.equal(pending.endAt, '2027-01-01T16:00:00.000Z');
    const review = board.getByRole('region', { name: 'Review move' });
    await review.waitFor();
    assert.match(await review.textContent(), /Thu, Dec 31, Room 0.*Fri, Jan 1, Room 1/);
    const movePreview = board.locator('[data-program-room-id="r1"] .program-board-drop-preview');
    assert.match(await movePreview.textContent(), /Proposed: Synthetic A.*10:00 AM–11:00 AM/);
    assert.equal((await execute('program_board_list', {})).selectedDate, '2027-01-01');
    assert.match((await execute('program_board_stage_move', destination)).error, /current review/);
    await page.screenshot({ path: path.join(output, 'webmcp-move-review.png') });
    assert.equal(writes.length, writeCount);
    await review.getByRole('button', { name: 'Apply move' }).click();
    await board.getByText('Schedule saved. You can undo this change.', { exact: true }).waitFor();
    assert.equal(writes.length, writeCount + 1);
    assert.equal(data[0].room, 'r1');
    await board.getByRole('button', { name: 'Undo last change' }).click();
    await board.getByText('Schedule change undone.', { exact: true }).waitFor();
    assert.equal(data[0].room, 'r0');
    const pendingResize = await execute('program_board_stage_resize', { sessionId: 'A', edge: 'end', deltaSlots: 1 });
    assert.deepEqual(pendingResize.changes.map(change => change.sessionId), ['A', 'B']);
    await board.getByRole('button', { name: 'Cancel resize', exact: true }).click();
    assert.equal(writes.length, writeCount + 2);

    user = { id: 'viewer', role: 'viewer' };
    await page.reload();
    assert.deepEqual(await loadTools(1), ['program_board_list']);
    assert.equal((await execute('program_board_list', {})).canManage, false);
    await page.locator('iframe').evaluate(frame => frame.remove());
    assert.deepEqual(await page.evaluate(async () => await document.modelContext.getTools()), []);
    user = null;
    await page.reload();
    await board.getByRole('link', { name: 'Sign in to Payload' }).waitFor();
    assert.deepEqual(await loadTools(0), []);
  }
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ passed: true, webMCPVerified: testWebMCP, output, boardGridTop: boardGrid.y, narrowBoardChromeHeight: narrowChromeHeight, desktopScheduleTop: schedule.y, expectedInjectedErrors: errors }, null, 2));
} finally { await browser.close(); }
