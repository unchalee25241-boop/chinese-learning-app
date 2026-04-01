import { useState, useEffect } from "react";

interface Word { zh: string; zhuyin: string; th: string; }
interface Props { words: Word[]; color: string; }

export function MatchingGame({ words, color }: Props) {
  const pool = words.slice(0, 5);
  const [lefts] = useState(() => [...pool].sort(() => Math.random() - 0.5));
  const [rights] = useState(() => [...pool].sort(() => Math.random() - 0.5));
  const [selL, setSelL] = useState<string|null>(null);
  const [selR, setSelR] = useState<string|null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [tries, setTries] = useState(0);
  useEffect(() => {
    if (selL && selR) {
      setTries(t => t + 1);
      if (selL === selR) { setMatched(m => [...m, selL]); setSelL(null); setSelR(null); }
      else { setWrong([selL, selR]); setTimeout(() => { setWrong([]); setSelL(null); setSelR(null); }, 600); }
    }
  }, [selL, selR]);
  const done = matched.length === pool.length;
  const [key, setKey] = useState(0);
  const restart = () => { setMatched([]); setWrong([]); setSelL(null); setSelR(null); setTries(0); setKey(k => k + 1); };
  return (
    <div key={key}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>จับคู่ให้ครบ!</span>
        <span style={{ color: color, fontWeight: 700, fontSize: 13 }}>🎯 {tries} ครั้ง</span>
      </div>
      {done ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "10px 0 4px" }}>สำเร็จ!</div>
          <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>ใช้ {tries} ครั้ง</div>
          <button onClick={restart} style={{ padding: "12px 28px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>เล่นอีกครั้ง</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lefts.map(w => {
              const isM = matched.includes(w.zh), isSel = selL === w.zh, isW = wrong.includes(w.zh);
              return <button key={w.zh} disabled={isM} onClick={() => !isM && setSelL(w.zh)} style={{ padding: "12px 8px", borderRadius: 14, border: `2.5px solid ${isM ? "#80D980" : isW ? "#E84040" : isSel ? color : "rgba(255,255,255,0.15)"}`, background: isM ? "#152D15" : isW ? "#2D1515" : isSel ? `${color}22` : "#1E1E30", fontWeight: 800, fontSize: 20, color: "#fff", cursor: isM ? "default" : "pointer", opacity: isM ? 0.5 : 1, transition: "all 0.2s" }}>
                {w.zh}<div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 400 }}>{w.zhuyin}</div>
              </button>;
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rights.map(w => {
              const isM = matched.includes(w.zh), isSel = selR === w.zh, isW = wrong.includes(w.zh);
              return <button key={w.zh} disabled={isM} onClick={() => !isM && selL && setSelR(w.zh)} style={{ padding: "12px 8px", borderRadius: 14, border: `2.5px solid ${isM ? "#80D980" : isW ? "#E84040" : isSel ? color : "rgba(255,255,255,0.15)"}`, background: isM ? "#152D15" : isW ? "#2D1515" : isSel ? `${color}22` : "#1E1E30", fontWeight: 600, fontSize: 13, color: "#fff", cursor: isM ? "default" : !selL ? "not-allowed" : "pointer", opacity: isM ? 0.5 : !selL ? 0.6 : 1, transition: "all 0.2s" }}>
                {w.th}
              </button>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
