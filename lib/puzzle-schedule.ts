import { puzzleDate, validPlayDate } from './wordle';

export function nextPuzzleDate(latest?: string | null, now = new Date()) {
  if (!validPlayDate(latest)) return puzzleDate(now);
  const day = new Date(`${latest}T12:00:00Z`);
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}
