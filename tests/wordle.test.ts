import assert from 'node:assert/strict';
import test from 'node:test';
import { puzzleDate, scoreGuess, validPlayDate } from '../lib/wordle';
import { WordlePuzzles } from '../collections/WordlePuzzles';


test('repeated letters consume exact matches before misplaced matches', () => {
  assert.deepEqual(scoreGuess('ABBEY', 'BABBB'), ['present', 'present', 'correct', 'absent', 'absent']);
  assert.deepEqual(scoreGuess('SOBER', 'SOBER'), Array(5).fill('correct'));
  assert.deepEqual(scoreGuess('PRAYER', 'RRRRRR'), ['absent', 'correct', 'absent', 'absent', 'absent', 'correct']);
});
test('Eastern midnight selects the calendar date in summer and winter', () => {
  assert.equal(puzzleDate(new Date('2026-09-10T03:59:59Z')), '2026-09-09');
  assert.equal(puzzleDate(new Date('2026-09-10T04:00:00Z')), '2026-09-10');
  assert.equal(puzzleDate(new Date('2026-01-10T04:59:59Z')), '2026-01-09');
  assert.equal(puzzleDate(new Date('2026-01-10T05:00:00Z')), '2026-01-10');
});
test('play dates reject invalid calendar dates and timestamps', () => {
  assert.equal(validPlayDate('2028-02-29'), true);
  for (const value of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-9-10', '2026-09-10T00:00:00Z', null]) assert.equal(validPlayDate(value), false);
});
test('anonymous users cannot read answers or write puzzles; viewers cannot write', async () => {
  const collection = WordlePuzzles;
  for (const operation of ['read', 'create', 'update', 'delete'] as const) {
    assert.equal(await collection.access![operation]!({ req: { user: null } } as never), false);
  }
  assert.equal(await collection.access!.update!({ req: { user: { role: 'viewer' } } } as never), false);
  assert.equal(await collection.access!.create!({ req: { user: { role: 'admin' } } } as never), true);
});
