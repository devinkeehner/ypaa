import assert from 'node:assert/strict';
import test from 'node:test';
import { nextPuzzleDate } from '../lib/puzzle-schedule';

test('new puzzle dates advance through month, year, leap day and DST boundaries', () => {
  for (const [from, to] of [['2026-09-10', '2026-09-11'], ['2026-12-31', '2027-01-01'], ['2028-02-28', '2028-02-29'], ['2028-02-29', '2028-03-01'], ['2026-03-08', '2026-03-09'], ['2026-11-01', '2026-11-02']]) assert.equal(nextPuzzleDate(from), to);
});
test('empty schedules default to the current Eastern date', () => {
  assert.equal(nextPuzzleDate(undefined, new Date('2026-09-11T02:00:00Z')), '2026-09-10');
});
