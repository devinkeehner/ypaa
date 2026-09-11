import assert from 'node:assert/strict';
import test from 'node:test';
import { encodePuzzleResult, parsePuzzleResult, puzzleResultPath } from '../lib/wordle-sharing';

test('shared win contains only date and tile states', () => {
  const scores = [['present','absent','correct','absent','absent'], ['correct','correct','correct','correct','correct']] as const;
  const token=encodePuzzleResult('2026-09-10',scores.map(row=>[...row]));
  assert.equal(token,'2026-09-10.10200-22222');
  assert.deepEqual(parsePuzzleResult(token), { date:'2026-09-10', scores:scores.map(row=>[...row]), won:true });
  assert.equal(puzzleResultPath('2026-09-10',scores.map(row=>[...row])), '/one-word-at-a-time/share/2026-09-10.10200-22222');
});
test('six-row losses and eight-letter results are accepted', () => {
  assert.equal(parsePuzzleResult('2026-09-10.'+Array(6).fill('01200120').join('-'))?.won,false);
  assert.equal(parsePuzzleResult('2026-09-10.22222222')?.won,true);
});
test('malformed, unfinished and oversized shares are rejected', () => {
  for (const token of ['2026-02-30.22222','2026-09-10.00000','2026-09-10.SOBER','2026-09-10.22222-00000','2026-09-10.0000-22222','2026-09-10.'+Array(7).fill('00000').join('-'),'x'.repeat(10000)]) assert.equal(parsePuzzleResult(token),null);
});
