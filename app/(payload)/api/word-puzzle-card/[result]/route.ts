import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createElement } from 'react';
import { parsePuzzleResult } from '@/lib/wordle-sharing';
import { PuzzleShareCard } from '@/lib/wordle-share-card';

export const runtime = 'nodejs';

export async function GET(_request: Request, { params }: { params: Promise<{ result: string }> }) {
  const result = parsePuzzleResult((await params).result);
  if (!result) return new Response('Invalid result', { status: 400 });
  const baseImage = `data:image/png;base64,${(await readFile(path.join(process.cwd(), 'public/images/word-puzzle-share-base.png'))).toString('base64')}`;
  return new ImageResponse(createElement(PuzzleShareCard, { result, baseImage }), { width: 1200, height: 630, headers: { 'Cache-Control': 'public, max-age=86400' } });
}
