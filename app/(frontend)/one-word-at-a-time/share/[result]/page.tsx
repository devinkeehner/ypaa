import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteFrame } from '@/components/site/SiteFrame';
import { parsePuzzleResult } from '@/lib/wordle-sharing';
import { GameResults } from '../../../wordle/game-results';
import styles from './share.module.css';

type Props = { params: Promise<{ result: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = (await params).result;
  const result = parsePuzzleResult(token);
  if (!result) notFound();
  const requestHeaders = await headers();
  const rawHost = requestHeaders.get('host') || 'www.necypaact.com';
  const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(rawHost) ? rawHost : 'www.necypaact.com';
  const origin = `${host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https'}://${host}`;
  const title = `One Word at a Time · ${result.won ? result.scores.length : 'X'}/6 · NECYPAA XXXVI`;
  const description = `Escaping the Mad Realm. See my ${result.date} score and play today's fellowship word puzzle.`;
  const url = `${origin}/one-word-at-a-time/share/${token}`;
  const image = { url: `${origin}/api/word-puzzle-card/${token}`, width: 1200, height: 630, alt: 'NECYPAA XXXVI: Escaping the Mad Realm, with a spoiler-free puzzle score grid.' };
  return { title, description, alternates: { canonical: url }, robots: { index: false, follow: true }, openGraph: { title, description, type: 'website', url, siteName: 'NECYPAA XXXVI', images: [image] }, twitter: { card: 'summary_large_image', title, description, images: [image.url] } };
}

export default async function SharedResultPage({ params }: Props) {
  const token = (await params).result;
  const result = parsePuzzleResult(token);
  if (!result) notFound();
  return <SiteFrame mainId="shared-result"><main id="shared-result" className={styles.page}><div className={styles.shell}>
    <h1>One Word at a Time</h1><p>A friend shared their {result.date} result: <strong>{result.won ? result.scores.length : 'X'}/6</strong>.</p>
    <img src={`/api/word-puzzle-card/${token}`} width={1200} height={630} alt="NECYPAA XXXVI — Escaping the Mad Realm, alongside the shared score grid." className={styles.image} />
    <Link href="/one-word-at-a-time" className={styles.play}>Play today's puzzle →</Link><GameResults won={result.won} />
  </div></main></SiteFrame>;
}
