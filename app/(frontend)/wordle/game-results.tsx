'use client';

import { useTenantTheme, defaultHeaderNavigation } from '@/components/site/TenantThemeProvider';
import { requestNavigationWarning } from '@/components/site/navigation-warning';
import { encodePuzzleResult } from '@/lib/wordle-sharing';
import type { LetterState } from '@/lib/wordle';
import styles from './wordle.module.css';

export function GameResults({ won }: { won: boolean }) {
  const tenant = useTenantTheme();
  const buttons = ['register', 'hotel'].map(kind => tenant.headerNavigation.find(item => item.style === 'button' && new RegExp(kind, 'i').test(`${item.label} ${item.url}`)) || defaultHeaderNavigation.find(item => item.style === 'button' && new RegExp(kind, 'i').test(`${item.label} ${item.url}`))!);
  return <aside className={styles.outcome} aria-label="Join us at NECYPAA">
    <h2>{won ? 'Keep the good stuff going.' : 'Your next adventure is waiting.'}</h2>
    <p>Join the fellowship in Hartford.</p>
    <div className={styles.eventActions}>{buttons.map(item => <a key={item.url} href={item.url} target={item.newTab ? '_blank' : undefined} rel={item.newTab ? 'noreferrer' : undefined} onClick={event => requestNavigationWarning(event, item)} className={`cms-header-action cms-header-action-${item.appearance === 'outline' ? 'outline' : 'solid'}`}>{item.label}{item.newTab ? <span className={styles.srOnly}> (opens in a new tab)</span> : null}</a>)}</div>
  </aside>;
}

export async function downloadResultCard(date: string, _won: boolean, scores: LetterState[][]) {
  const response = await fetch(`/api/word-puzzle-card/${encodePuzzleResult(date, scores)}`);
  if (!response.ok) throw new Error('Image export unavailable');
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement('a'); link.download = `one-word-at-a-time-${date}.png`; link.href = url; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
