'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_GUESSES, type LetterState } from '@/lib/wordle';
import { checkGuesses } from './actions';
import styles from './wordle.module.css';

const keys = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const symbols = { correct: '🟣', present: '🟠', absent: '⚪' };
const labels = { correct: 'correct position', present: 'in the word, different position', absent: 'not in the word' };

type Game = { guesses: string[]; scores: LetterState[][]; won: boolean; answer?: string };
const emptyGame: Game = { guesses: [], scores: [], won: false };

export function WordleGame({ date, length, puzzleKey }: { date: string; length: number; puzzleKey: string }) {
  const [game, setGame] = useState<Game>(emptyGame);
  const [input, setInput] = useState('');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [shareFallback, setShareFallback] = useState('');
  const locked = useRef(false);
  const storageKey = `ypaa-wordle:v1:${date}:${puzzleKey}`;
  const finished = game.won || game.guesses.length === MAX_GUESSES;

  useEffect(() => {
    let cancelled = false;
    async function restore() {
      try {
        const raw = localStorage.getItem(storageKey);
        const guesses: unknown = raw ? JSON.parse(raw) : [];
        if (Array.isArray(guesses) && guesses.length && guesses.length <= MAX_GUESSES && guesses.every(g => typeof g === 'string' && new RegExp(`^[A-Z]{${length}}$`).test(g))) {
          const result = await checkGuesses(date, guesses);
          if (!cancelled && result.scores) setGame({ guesses, scores: result.scores, won: result.won, answer: result.answer });
          if (!cancelled && result.error) setMessage(result.error);
        }
      } catch { if (!cancelled) setMessage('Saved progress could not be loaded. You can still play.'); }
      finally { if (!cancelled) setReady(true); }
    }
    void restore();
    return () => { cancelled = true; };
  }, [storageKey, date, length]);

  async function submit() {
    if (!ready || locked.current || finished) return;
    if (input.length !== length) { setMessage(`Enter ${length} letters first.`); return; }
    if (game.guesses.includes(input)) { setMessage('You already tried that one. Try another guess.'); return; }
    locked.current = true;
    setBusy(true);
    setMessage('');
    try {
      const guesses = [...game.guesses, input];
      const result = await checkGuesses(date, guesses);
      if (result.error || !result.scores) { setMessage(result.error || 'Could not check your guess. Try again.'); return; }
      setGame({ guesses, scores: result.scores, won: result.won, answer: result.answer });
      setInput('');
      setMessage(result.won ? 'You found it! Share a little fellowship.' : guesses.length === MAX_GUESSES ? `The word was ${result.answer}. A fresh start tomorrow!` : `Guess ${guesses.length}: ${result.scores[result.scores.length - 1].map((state, i) => `${input[i]}, ${labels[state]}`).join('; ')}.`);
      try { localStorage.setItem(storageKey, JSON.stringify(guesses)); }
      catch { setMessage('Your guess was checked, but this browser cannot save progress.'); }
    } catch { setMessage('Could not reach the puzzle. Your guess is still here—try again.'); }
    finally { locked.current = false; setBusy(false); }
  }

  function press(key: string) {
    if (!ready || busy || finished) return;
    if (key === 'ENTER') { void submit(); return; }
    if (key === 'BACKSPACE') { setInput(value => value.slice(0, -1)); return; }
    if (/^[A-Z]$/.test(key)) setInput(value => (value + key).slice(0, length));
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, a, [contenteditable="true"]')) return;
      if (target.closest('button') && event.key === 'Enter') return;
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) || key === 'ENTER' || key === 'BACKSPACE') { event.preventDefault(); press(key); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  async function share(results: boolean, native = false) {
    const url = `${window.location.origin}/one-word-at-a-time`;
    const text = results ? `One Word at a Time · ${date}\n${game.won ? game.guesses.length : 'X'}/${MAX_GUESSES}\n\n${game.scores.map(row => row.map(state => symbols[state]).join('')).join('\n')}\n\nPlay with me: ${url}` : `A little wordplay. A little fellowship. Play One Word at a Time with me: ${url}`;
    try {
      if (native && navigator.share) await navigator.share({ title: 'One Word at a Time', text });
      else { await navigator.clipboard.writeText(text); setMessage(results ? 'Results copied! Paste them to a friend.' : 'Invite copied! Paste it to a friend.'); }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setShareFallback(text);
      setMessage('Select and copy the text below to share.');
    }
  }

  const keyboardStates: Record<string, LetterState> = {};
  const ranks = { absent: 0, present: 1, correct: 2 };
  game.guesses.forEach((guess, row) => guess.split('').forEach((letter, col) => {
    const state = game.scores[row][col];
    if (!keyboardStates[letter] || ranks[state] > ranks[keyboardStates[letter]]) keyboardStates[letter] = state;
  }));

  return <section className={styles.game} aria-label="Daily word puzzle" aria-busy={busy}>
    <p className={styles.instructions}>Find the <strong>{length}-letter word</strong> in six guesses.</p>
    <div className={styles.board} role="group" aria-label="Guesses">
      {Array.from({ length: MAX_GUESSES }, (_, row) => <div key={row} className={styles.row} style={{ gridTemplateColumns: `repeat(${length}, 1fr)` }} aria-label={`Guess ${row + 1}`}>
        {Array.from({ length }, (_, col) => {
          const letter = (game.guesses[row] || (row === game.guesses.length ? input : ''))[col] || '';
          const state = game.scores[row]?.[col];
          return <span key={col} className={`${styles.tile} ${state ? styles[state] : letter ? styles.filled : ''}`} aria-label={letter ? `${letter}${state ? `: ${labels[state]}` : ''}` : 'empty'}>{letter}{state ? <small aria-hidden="true">{state === 'correct' ? '●' : state === 'present' ? '◆' : '–'}</small> : null}</span>;
        })}
      </div>)}
    </div>
    <p className={styles.status} role="status" aria-live="polite">{!ready ? 'Loading your puzzle…' : busy ? 'Checking…' : message || (finished ? game.won ? 'You found it! Come back tomorrow.' : `The word was ${game.answer}. A fresh start tomorrow!` : 'Use your keyboard or tap the letters below.')}</p>
    <div className={styles.keyboard} aria-label="On-screen keyboard">
      {keys.map((row, index) => <div className={styles.keyRow} key={row}>
        {index === 2 ? <button type="button" className={styles.wideKey} disabled={!ready || busy || finished} onClick={() => press('ENTER')}>Enter</button> : null}
        {row.split('').map(letter => <button type="button" key={letter} aria-label={`${letter}${keyboardStates[letter] ? `: ${labels[keyboardStates[letter]]}` : ''}`} className={keyboardStates[letter] ? styles[keyboardStates[letter]] : ''} disabled={!ready || busy || finished} onClick={() => press(letter)}>{letter}</button>)}
        {index === 2 ? <button type="button" className={styles.wideKey} aria-label="Delete last letter" disabled={!ready || busy || finished} onClick={() => press('BACKSPACE')}>⌫</button> : null}
      </div>)}
    </div>
    <div className={styles.actions}>{finished ? <><button type="button" onClick={() => void share(true, true)}>Share results ↗</button><button type="button" onClick={() => void share(true)}>Copy results</button></> : null}<button type="button" onClick={() => void share(false, true)}>Invite a friend ↗</button></div>
    {shareFallback ? <textarea className={styles.shareText} aria-label="Text to copy and share" readOnly value={shareFallback} onFocus={event => event.target.select()} /> : null}
    <details className={styles.rules}><summary>How to play</summary><p>Guess the daily YPAA or recovery-themed word in six tries. Each guess must use {length} letters. Acronyms and letter combinations are welcome.</p><ul><li><strong>Purple ●</strong> — right letter, right spot.</li><li><strong>Orange ◆</strong> — right letter, different spot.</li><li><strong>Pale gray –</strong> — no remaining match for this letter.</li></ul><p>Repeated letters only get credit for the number of times they appear in the answer. Progress saves in this browser. Shared results never include your guesses or the answer.</p></details>
  </section>;
}
