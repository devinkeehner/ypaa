import { type LetterState, validPlayDate } from './wordle';

export type SharedPuzzleResult = { date: string; scores: LetterState[][]; won: boolean };
const states: LetterState[] = ['absent', 'present', 'correct'];

export function encodePuzzleResult(date: string, scores: LetterState[][]) {
  return `${date}.${scores.map(row => row.map(state => states.indexOf(state)).join('')).join('-')}`;
}

export function parsePuzzleResult(value: string): SharedPuzzleResult | null {
  if (value.length > 65 || !/^\d{4}-\d{2}-\d{2}\.[012]{4,8}(?:-[012]{4,8}){0,5}$/.test(value)) return null;
  const [date, pattern] = value.split('.');
  if (!validPlayDate(date)) return null;
  const rows = pattern.split('-');
  if (rows.some(row => row.length !== rows[0].length) || rows.slice(0, -1).some(row => /^2+$/.test(row))) return null;
  const won = /^2+$/.test(rows[rows.length - 1]);
  if (!won && rows.length !== 6) return null;
  return { date, scores: rows.map(row => row.split('').map(digit => states[Number(digit)])), won };
}

export function puzzleResultPath(date: string, scores: LetterState[][]) {
  return `/one-word-at-a-time/share/${encodePuzzleResult(date, scores)}`;
}
