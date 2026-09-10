export type LetterState = 'correct' | 'present' | 'absent';
export const MAX_GUESSES = 6;

export function puzzleDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

export function scoreGuess(answer: string, guess: string): LetterState[] {
  const result: LetterState[] = Array(guess.length).fill('absent');
  const remaining = answer.split('');
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) { result[i] = 'correct'; remaining[i] = ''; }
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue;
    const index = remaining.indexOf(guess[i]);
    if (index !== -1) { result[i] = 'present'; remaining[index] = ''; }
  }
  return result;
}

export function validPlayDate(value: unknown) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
