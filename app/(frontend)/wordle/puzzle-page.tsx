import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFrame } from '@/components/site/SiteFrame';
import { getTodayPuzzle } from '@/lib/wordle-server';
import { ReadingGate, type PuzzleReading } from './reading-gate';
import styles from './wordle.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { alternates: { canonical: '/one-word-at-a-time' }, title: 'One Word at a Time | NECYPAA', description: 'A little wordplay, a little fellowship. Play the daily YPAA word puzzle and share your results with friends.' };

export default async function WordlePage() {
  const { date, puzzle } = await getTodayPuzzle();
  return <PuzzleView date={date} puzzle={puzzle} />;
}

export function PuzzleView({ date, puzzle }: { date: string; puzzle: ({ id: string; updatedAt: string; word: string } & PuzzleReading) | null }) {
  return <SiteFrame mainId="wordle-main"><main id="wordle-main" className={styles.page}><div className={styles.shell}><nav className={styles.mobileNav} aria-label="Game navigation"><Link href="/">← NECYPAA</Link></nav>
    <header className={styles.header}><span className={styles.eyebrow}>The daily fellowship word game</span><h1 className={styles.title} aria-label="One Word at a Time"><span aria-hidden="true"><span className={styles.titleLine}>One <span className={styles.replacement}><span className={styles.oldWord}>day</span><span className={styles.newWord}>word</span></span></span><span className={styles.titleEnding}>at a time.</span></span></h1><p>A little wordplay. A little fellowship.</p><time dateTime={date}>{new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'America/New_York' })}</time></header>
    {puzzle ? <ReadingGate key={`${puzzle.id}-${puzzle.updatedAt}`} date={date} length={puzzle.word.length} puzzleKey={`${puzzle.id}-${puzzle.updatedAt}`} reading={{ readingTitle: puzzle.readingTitle, readingPassage: puzzle.readingPassage, readingAttribution: puzzle.readingAttribution }} /> : <div className={styles.empty}><h2>A word is on its way.</h2><p>No puzzle is scheduled for today. Come back soon for your daily dose of wordplay.</p></div>}
    <p className={styles.footnote}>A new puzzle at midnight Eastern. Made for the fellowship.</p>
  </div></main></SiteFrame>;
}
