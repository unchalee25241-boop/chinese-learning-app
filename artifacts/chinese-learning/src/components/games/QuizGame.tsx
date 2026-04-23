import { useState, useEffect, useRef } from "react";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; pinyinCN?: string; th: string; }
interface Props { words: Word[]; color: string; mode: Mode; onMastery?: (word: string, level: 1 | 2) => void; }

const QUIZ_SIZE = 10;
const TIME_PER_Q = 15;

function playSound(correct: boolean) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (correct) {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.1);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    }
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35);
  } catch {}
}

function buildQuestions(words: Word[], mode: Mode) {
  const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE);
  return shuffled.map((word, i) => {
    const isZhToTh = i % 2 === 0;
    const others = words.filter(w => w.zh !== word.zh);
    const wrongChoices = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;
    const choices = isZhToTh
      ? [...wrongChoices.map(w => w.th), word.th].sort(() => Math.random() - 0.5)
      : [...wrongChoices.map(w => displayZh(w)), displayZh(word)].sort(() => Math.random() - 0.5);
    return { word, isZhToTh, choices, answer: isZhToTh ? word.th : displayZh(word) };
  });
}

export function QuizGame({ words, color, mode, onMastery }: Props) {
  const [questions, setQuestions] = useState(() => buildQuestions(words, mode));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_Q);
  const [results, setResults] = useState<boolean[]>([]);
  const timerRef = useRef<any>(null);

  const q = questions[idx];
  const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;

  useEffect(() => {
    if (selected || done) return;
    setTimeLeft(TIME_PER_Q);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSelect("__timeout__");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [idx, done]);

  const handleSelect = (choice: string) => {
    if (selected) return;
    clearInterval(timerRef.current);
    setSelected(choice);
    const isCorrect = choice === q.answer;
    if (isCorrect) {
      playSound(true);
      const bonus = timeLeft > 10 ? 15 : timeLeft > 5 ? 10 : 5;
      setScore(s => s + bonus);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(m => Math.max(m, newStreak));
    } else {
      playSound(false);
      setStreak(0);
    }
    setResults(r => [...r, isCorrect]);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else { setIdx(i => i + 1); setSelected(null); }
    }, 1000);
  };

  const restart = () => {
    setQuestions(buildQuestions(words, mode));
    setIdx(0); setSelected(null); setScore(0); setStreak(0);
    setMaxStreak(0); setDone(false); setResults([]); setTimeLeft(TIME_PER_Q);
  };

  const correctCount = results.filter(Boolean).length;

  if (done) {
    const pct = Math.round((correctCount / QUIZ_SIZE) * 100);
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ fontSize: 60 }}>{pct === 100 ? "🏆" : pct >= 70 ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "12px 0 4px" }}>
          {pct === 100 ? "เพอร์เฟกต์!" : pct >= 70 ? "เก่งมากเลย!" : "ฝึกต่อไปนะ!"}
        </div>

        {/* Score cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "20px 0" }}>
          <div style={{ background: `rgba(255,255,255,0.08)`, border: `2px solid ${color}`, borderRadius: 16, padding: "16px 12px" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color }}>{score}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>คะแนนรวม</div>
          </div>
          <div style={{ background: "rgba(80,200,80,0.12)", border: "2px solid #80D980", borderRadius: 16, padding: "16px 12px" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#80D980" }}>{correctCount}/{QUIZ_SIZE}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ตอบถูก</div>
          </div>
          <div style={{ background: "rgba(255,200,0,0.12)", border: "2px solid #FFD700", borderRadius: 16, padding: "16px 12px" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#FFD700" }}>{maxStreak}🔥</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Streak สูงสุด</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.2)", borderRadius: 16, padding: "16px 12px" }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff" }}>{pct}%</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>แม่นยำ</div>
          </div>
        </div>

        {/* Result dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 24 }}>
          {results.map((r, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: r ? "#80D980" : "#E84040" }} />
          ))}
        </div>

        <button onClick={restart} style={{ padding: "12px 32px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          เล่นอีกครั้ง
        </button>
      </div>
    );
  }

  const timerPct = (timeLeft / TIME_PER_Q) * 100;
  const timerColor = timeLeft > 8 ? "#80D980" : timeLeft > 4 ? "#FFD700" : "#E84040";

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>ข้อ {idx + 1}/{QUIZ_SIZE}</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {streak >= 2 && (
            <span style={{ color: "#FFD700", fontWeight: 700, fontSize: 13, animation: "pulse 0.5s ease" }}>
              🔥 {streak}
            </span>
          )}
          <span style={{ color, fontWeight: 700, fontSize: 13 }}>⭐ {score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 5, marginBottom: 10 }}>
        <div style={{ background: color, width: `${(idx / QUIZ_SIZE) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Timer bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 8, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ background: timerColor, width: `${timerPct}%`, height: "100%", borderRadius: 999, transition: "width 1s linear, background 0.3s" }} />
      </div>
      <div style={{ textAlign: "right", fontSize: 12, color: timerColor, fontWeight: 700, marginTop: -12, marginBottom: 12 }}>
        ⏱ {timeLeft}s
      </div>

      {/* Question */}
      <div style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, borderRadius: 20, padding: "24px 20px", textAlign: "center", marginBottom: 16, border: `2px solid ${color}44` }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {q.isZhToTh ? "ความหมายของคำนี้คืออะไร?" : "คำจีนของคำนี้คืออะไร?"}
        </div>
        {q.isZhToTh ? (
          <>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#fff" }}>{displayZh(q.word)}</div>
            <div style={{ fontSize: 13, color: color + "cc", marginTop: 4 }}>
              {mode === "cn" ? (q.word.pinyinCN ?? q.word.pinyin) : `${q.word.zhuyin} • ${q.word.pinyin}`}
            </div>
          </>
        ) : (
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff" }}>{q.word.th}</div>
        )}
      </div>

      {/* Choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.choices.map((choice, i) => {
          const isCorrect = choice === q.answer;
          const isSelected = selected === choice;
          const showResult = selected !== null;
          let bg = `linear-gradient(135deg, ${color}22, ${color}11)`;
          let border = `2px solid ${color}33`;
          let textColor = "#fff";
          if (showResult && isCorrect) { bg = "linear-gradient(135deg, #1a3d1a, #152d15)"; border = "2px solid #80D980"; textColor = "#80D980"; }
          else if (showResult && isSelected && !isCorrect) { bg = "#2D1515"; border = "2px solid #E84040"; textColor = "#E84040"; }
          return (
            <button key={i} onClick={() => handleSelect(choice)}
              style={{ padding: "14px 18px", borderRadius: 14, border, background: bg, color: textColor, fontWeight: 700, fontSize: 15, cursor: selected ? "default" : "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10,
                transform: isSelected ? "scale(1.02)" : "scale(1)",
              }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: showResult && isCorrect ? "rgba(128,217,128,0.2)" : showResult && isSelected ? "rgba(232,64,64,0.2)" : "rgba(255,255,255,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, fontWeight: 800 }}>
                {showResult && isCorrect ? "✓" : showResult && isSelected && !isCorrect ? "✗" : ["A","B","C","D"][i]}
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {/* Result dots */}
      {results.length > 0 && (
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 16 }}>
          {results.map((r, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: r ? "#80D980" : "#E84040" }} />
          ))}
          {Array(QUIZ_SIZE - results.length).fill(0).map((_, i) => (
            <div key={`e${i}`} style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          ))}
        </div>
      )}
    </div>
  );
}
