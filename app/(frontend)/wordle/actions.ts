'use server';

import { getTodayPuzzle } from '@/lib/wordle-server';
import { MAX_GUESSES, scoreGuess } from '@/lib/wordle';

export async function checkGuesses(date: string, guesses: string[]) {
  if (!Array.isArray(guesses) || guesses.length > MAX_GUESSES || guesses.some(g => typeof g !== 'string' || !/^[A-Z]{4,8}$/.test(g))) return { error: 'Enter letters only.' };
  const { date: today, puzzle } = await getTodayPuzzle();
  if (date !== today) return { error: 'A new day has started. Refresh to play today’s puzzle.' };
  if (!puzzle) return { error: 'No puzzle is scheduled today.' };
  if (guesses.some(g => g.length !== puzzle.word.length)) return { error: `Enter ${puzzle.word.length} letters.` };
  const winIndex = guesses.indexOf(puzzle.word);
  if (winIndex >= 0 && winIndex !== guesses.length - 1) return { error: 'This puzzle is already complete.' };
  const won = winIndex >= 0;
  return { scores: guesses.map(g => scoreGuess(puzzle.word, g)), won, answer: won || guesses.length === MAX_GUESSES ? puzzle.word : undefined };
}
