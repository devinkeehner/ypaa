import 'server-only';
import config from '@payload-config';
import { getPayload } from 'payload';
import { puzzleDate } from './wordle';

export async function getTodayPuzzle() {
  const date = puzzleDate();
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'wordle-puzzles', overrideAccess: true, depth: 0, limit: 1, where: { playDate: { equals: date } } });
  return { date, puzzle: result.docs[0] ?? null };
}
