import type { SharedPuzzleResult } from './wordle-sharing';

export function PuzzleShareCard({ result }: { result: SharedPuzzleResult }) {
  const colors = { correct: '#c4a2ff', present: '#ffaf78', absent: '#b6adbf' };
  const tile = result.scores[0].length > 6 ? 42 : 48;
  return <div style={{ display: 'flex', width: '100%', height: '100%', background: '#17121f', color: '#f6eefb', padding: '48px', fontFamily: 'sans-serif' }}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '51%', borderRight: '2px solid #554065', paddingRight: '34px' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', fontSize: 48, fontWeight: 900, letterSpacing: '-2px' }}>NECYPAA XXXVI</div>
        <div style={{ display: 'flex', color: '#ffaf78', fontSize: 23, letterSpacing: '5px', marginTop: 36 }}>ESCAPING THE</div>
        <div style={{ display: 'flex', color: '#c4a2ff', fontSize: 86, fontWeight: 900, lineHeight: 1.03, marginTop: 10 }}>MAD</div>
        <div style={{ display: 'flex', color: '#c4a2ff', fontSize: 86, fontWeight: 900, lineHeight: 1.03 }}>REALM</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', color: '#c1b5cf', fontSize: 22, lineHeight: 1.4 }}><span>Hartford, Connecticut</span><span>Dec 31, 2026 – Jan 3, 2027</span></div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingLeft: '34px' }}>
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 800 }}>One Word at a Time</div>
      <div style={{ display: 'flex', color: '#c1b5cf', fontSize: 22, marginTop: 8 }}>{result.date}</div>
      <div style={{ display: 'flex', fontSize: 46, fontWeight: 900, color: '#ffaf78', marginTop: 12 }}>{`${result.won ? result.scores.length : 'X'} / 6`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>{result.scores.map((row, y) => <div key={y} style={{ display: 'flex', gap: 8 }}>{row.map((state, x) => <div key={x} style={{ display: 'flex', width: tile, height: tile, borderRadius: 9, background: colors[state] }} />)}</div>)}</div>
      <div style={{ display: 'flex', color: '#c1b5cf', fontSize: 20, marginTop: 20 }}>Play with me · necypaact.com</div>
    </div>
  </div>;
}
