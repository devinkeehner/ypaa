import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { parsePuzzleResult } from '@/lib/wordle-sharing';
import { PuzzleShareCard } from '@/lib/wordle-share-card';

export async function GET(_request: Request, { params }: { params: Promise<{ result: string }> }) {
  const result = parsePuzzleResult((await params).result);
  if (!result) return new Response('Invalid result', { status: 400 });
  return new ImageResponse(createElement(PuzzleShareCard, { result }), { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400' } });
}
