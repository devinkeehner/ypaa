import { permanentRedirect } from 'next/navigation';

export default function LegacyPuzzlePage() {
  permanentRedirect('/one-word-at-a-time');
}
