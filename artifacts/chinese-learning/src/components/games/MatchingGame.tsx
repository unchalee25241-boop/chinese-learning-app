import { useState, useEffect, useRef } from "react";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; th: string; }
interface Props { words: Word[]; color: string; mode: Mode; }

function playSound(correct: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (correct) {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(200, ctx.currentTime + 0.1);
    }
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch {}
}

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
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  useEffect(() => {
    if (selL && selR) {
      setTries(t => t + 1);
      if (selL === selR) {
        playSound(true);
        setMatched(m => [...m, selL]);
        setScore(s => s + 10);
        setSelL(null); setSelR(null);
      } else {
        playSound(false);
        setWrong([selL, selR]);
        setScore(s => Math.max(0, s - 2));
        setTimeout(() => { setWrong([]); setSelL(null); setSelR(null); }, 600);
      }
    }
  }, [selL, selR]);

  const done = matched.length === pool.length;

  useEffect(() => {
    if (done) {
      setRunning(false);
      if (bestTime === null || time < bestTime) setBestTime(time);
    }
  }, [done]);

  const nextRound = () => {
    const newUsed = [...usedZh, ...pool.map(w => w.zh)];
    const isRestart = newUsed.length >= words.length;
    const finalUsed = isRestart ? [] : newUsed;
    setUsedZh(finalUsed);
    const newPool = getPool(words, finalUsed);
    setPool(newPool);
    setLefts([...newPool].sort(() => Math.random() - 0.5));
    setRights([...newPool].sort(() => Math.random() - 0.5));
    setMatched([]); setWrong([]); setSelL(null); setSelR(null);
    setTries(0); setTime(0); setRunning(true);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div>
      {/* Header stats */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: color, fontWeight: 700, fontSize: 13 }}>⭐ {score}</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>🎯 {tries} ครั้ง</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {bestTime !== null && <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>🏅 {formatTime(bestTime)}</span>}
          <span style={{ color: done ? "#80D980" : "#fff", fontWeight: 700, fontSize: 14, background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: 999 }}>
            ⏱ {formatTime(time)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 5, marginBottom: 16 }}>
        <div style={{ background: color, width: `${(matched.length / pool.length) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {done ? (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{ fontSize: 56 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "10px 0 4px" }}>สำเร็จ!</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", margin: "16px 0 24px" }}>
            <div style={{ background: `rgba(255,255,255,0.08)`, border: `2px solid ${color}`, borderRadius: 16, padding: "14px 20px" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color }}>{score}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>คะแนน</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 20px" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{formatTime(time)}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>เวลา</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 20px" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>{tries}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>ครั้ง</div>
            </div>
          </div>
          {bestTime !== null && (
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 16 }}>
              🏅 เวลาดีที่สุด: {formatTime(bestTime)}
            </div>
          )}
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
                    boxShadow: isSel ? `0 4px 20px ${color}44` : isM ? `0 2px 12px ${color}33` : "none",
                    opacity: isM ? 0.6 : 1,
                    border: isW ? "2px solid #E84040" : isM ? `2px solid ${color}66` : isSel ? `2px solid ${color}` : `2px solid ${color}33`,
                    transform: isSel ? "scale(1.04)" : "scale(1)",
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
                    boxShadow: isSel ? `0 4px 20px ${color}44` : isM ? `0 2px 12px ${color}33` : "none",
                    opacity: isM ? 0.6 : !selL ? 0.5 : 1,
                    border: isW ? "2px solid #E84040" : isM ? `2px solid ${color}66` : isSel ? `2px solid ${color}` : `2px solid ${color}33`,
                    transform: isSel ? "scale(1.04)" : "scale(1)",
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
