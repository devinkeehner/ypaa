import type { SharedPuzzleResult } from './wordle-sharing';

export function PuzzleShareCard({ result, baseImage }: { result: SharedPuzzleResult; baseImage: string }) {
  const colors = { correct: '#c4a2ff', present: '#ffaf78', absent: '#b6adbf' };
  const tile = 42;
  return <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', background: '#17121f', color: '#f6eefb', fontFamily: 'sans-serif' }}>
    <img src={baseImage} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0 }} />
    <div style={{ display: 'flex', position: 'absolute', left: 640, top: 130, width: 520, height: 440, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', color: '#c1b5cf', fontSize: 22, marginTop: 8 }}>{result.date}</div>
      <div style={{ display: 'flex', fontSize: 46, fontWeight: 900, color: '#ffaf78', marginTop: 12 }}>{`${result.won ? result.scores.length : 'X'} / 6`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>{result.scores.map((row, y) => <div key={y} style={{ display: 'flex', gap: 8 }}>{row.map((state, x) => <div key={x} style={{ display: 'flex', width: tile, height: tile, borderRadius: 9, background: colors[state] }} />)}</div>)}</div>
    </div>
  </div>;
}
