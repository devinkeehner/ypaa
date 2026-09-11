'use client';

import { useState } from 'react';
import { WordleGame } from './wordle-game';
import styles from './reading-gate.module.css';

export type PuzzleReading = { readingTitle?: string | null; readingPassage?: string | null; readingAttribution?: string | null };

export function ReadingGate({ date, length, puzzleKey, reading }: { date: string; length: number; puzzleKey: string; reading: PuzzleReading }) {
  const [playing, setPlaying] = useState(false);
  if (playing) return <WordleGame date={date} length={length} puzzleKey={puzzleKey} />;
  return <section className={styles.reading} aria-labelledby="reading-title">
    <div className={styles.scroll}>
      <p className={styles.eyebrow}>A moment before the wordplay</p>
      <h2 id="reading-title">{reading.readingTitle || 'Daily Reflections'}</h2>
      {reading.readingPassage?.trim() ? <><div className={styles.passage}>{reading.readingPassage}</div>{reading.readingAttribution ? <p className={styles.attribution}>{reading.readingAttribution}</p> : null}</> : <p>Take a moment with today’s Daily Reflection, then come back for a little fellowship and wordplay.</p>}
      <a className={styles.source} href="https://www.aa.org/daily-reflections" target="_blank" rel="noreferrer">Read Daily Reflections on AA.org ↗</a>
    </div>
    <button className={styles.play} type="button" onClick={() => setPlaying(true)}>Let’s play →</button>
  </section>;
}
