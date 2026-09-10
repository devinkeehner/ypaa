import type { Metadata } from 'next';
import { SiteFrame } from '@/components/site/SiteFrame';
import { getTodayPuzzle } from '@/lib/wordle-server';
import { WordleGame } from './wordle-game';
import styles from './wordle.module.css';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'YPAA Wordle | NECYPAA', description: 'A little wordplay, a little fellowship. Play the daily YPAA word puzzle and share your results with friends.' };

export default async function WordlePage() {
  const { date, puzzle } = await getTodayPuzzle();
  return <SiteFrame mainId="wordle-main"><main id="wordle-main" className={styles.page}><div className={styles.shell}>
    <header className={styles.header}><span className={styles.eyebrow}>One day at a time. One word at a time.</span><h1>YPAA Wordle<span>.</span></h1><p>A little wordplay. A little fellowship.</p><time dateTime={date}>{new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { dateStyle: 'long', timeZone: 'America/New_York' })}</time></header>
    {puzzle ? <WordleGame key={`${puzzle.id}-${puzzle.updatedAt}`} date={date} length={puzzle.word.length} puzzleKey={`${puzzle.id}-${puzzle.updatedAt}`} /> : <div className={styles.empty}><h2>A word is on its way.</h2><p>No puzzle is scheduled for today. Come back soon for your daily dose of wordplay.</p></div>}
    <p className={styles.footnote}>A new puzzle at midnight Eastern. Made for the fellowship.</p>
  </div></main></SiteFrame>;
}
