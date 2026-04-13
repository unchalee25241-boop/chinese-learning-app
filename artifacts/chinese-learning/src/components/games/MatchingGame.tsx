import { useState, useEffect } from "react";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; th: string; }
interface Props { words: Word[]; color: string; mode: Mode; }

function getPool(words: Word[], used: string[]): Word[] {
  const remaining = words.filter(w => !used.includes(w.zh));
  const source = remaining.length >= 5 ? remaining : words;
  return [...source].sort(() => Math.random() - 0.5).slice(0, 5);
}

export function MatchingGame({ words, color, mode }: Props) {
  const [usedZh, setUsedZh] = useState<string[]>([]);
  const [pool, setPool] = useState(() => getPool(words, []));
  const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;
  const [lefts, setLefts] = useState(() => [...pool].sort(() => Math.random() - 0.5));
  const [rights, setRights] = useState(() => [...pool].sort(() => Math.random() - 0.5));
  const [selL, setSelL] = useState<string | null>(null);
  const [selR, setSelR] = useState<string | null>(null);
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

  const nextRound = () => {
    const newUsed = [...usedZh, ...pool.map(w => w.zh)];
    setUsedZh(newUsed);
    const newPool = getPool(words, newUsed);
    setPool(newPool);
    setLefts([...newPool].sort(() => Math.random() - 0.5));
    setRights([...newPool].sort(() => Math.random() - 0.5));
    setMatched([]); setWrong([]); setSelL(null); setSelR(null); setTries(0);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>จับคู่ให้ครบ!</span>
        <span style={{ color: color, fontWeight: 700, fontSize: 13 }}>🎯 {tries} ครั้ง</span>
      </div>
      {done ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "10px 0 4px" }}>สำเร็จ!</div>
          <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>ใช้ {tries} ครั้ง</div>
          <button onClick={nextRound} style={{ padding: "12px 28px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>
            {usedZh.length + pool.length >= words.length ? "🔄 เริ่มใหม่ทั้งหมด" : "▶ คำถัดไป"}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {lefts.map(w => {
              const isM = matched.includes(w.zh), isSel = selL === w.zh, isW = wrong.includes(w.zh);
              return (
                <button key={w.zh} disabled={isM} onClick={() => !isM && setSelL(w.zh)}
                  style={{ padding: "14px 8px", borderRadius: 16, fontWeight: 800, fontSize: 22, color: "#fff", cursor: isM ? "default" : "pointer", transition: "all 0.2s",
                    background: isM ? `linear-gradient(135deg, ${color}88, ${color}44)` : isW ? "#2D1515" : isSel ? `linear-gradient(135deg, ${color}, ${color}aa)` : `linear-gradient(135deg, ${color}33, ${color}11)`,
                    boxShadow: isSel ? `0 4px 20px ${color}44` : "none",
                    opacity: isM ? 0.6 : 1,
                    border: isW ? "2px solid #E84040" : isM ? `2px solid ${color}66` : isSel ? `2px solid ${color}` : `2px solid ${color}33`,
                  } as React.CSSProperties}>
                  {displayZh(w)}
                  {mode === "tw" && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 400, marginTop: 2 }}>{w.zhuyin}</div>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rights.map(w => {
              const isM = matched.includes(w.zh), isSel = selR === w.zh, isW = wrong.includes(w.zh);
              return (
                <button key={w.zh} disabled={isM} onClick={() => !isM && selL && setSelR(w.zh)}
                  style={{ padding: "14px 8px", borderRadius: 16, fontWeight: 600, fontSize: 13, color: "#fff", cursor: isM ? "default" : !selL ? "not-allowed" : "pointer", transition: "all 0.2s",
                    background: isM ? `linear-gradient(135deg, ${color}88, ${color}44)` : isW ? "#2D1515" : isSel ? `linear-gradient(135deg, ${color}, ${color}aa)` : `linear-gradient(135deg, ${color}33, ${color}11)`,
                    boxShadow: isSel ? `0 4px 20px ${color}44` : "none",
                    opacity: isM ? 0.6 : !selL ? 0.5 : 1,
                    border: isW ? "2px solid #E84040" : isM ? `2px solid ${color}66` : isSel ? `2px solid ${color}` : `2px solid ${color}33`,
                  } as React.CSSProperties}>
                  {w.th}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
