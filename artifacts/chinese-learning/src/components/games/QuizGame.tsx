import { useState, useMemo } from "react";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; pinyinCN?: string; th: string; }
interface Props { words: Word[]; color: string; mode: Mode; }

const QUIZ_SIZE = 5;

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

export function QuizGame({ words, color, mode }: Props) {
  const [questions, setQuestions] = useState(() => buildQuestions(words, mode));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];
  const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else { setIdx(i => i + 1); setSelected(null); }
    }, 900);
  };

  const restart = () => {
    setQuestions(buildQuestions(words, mode));
    setIdx(0); setSelected(null); setScore(0); setDone(false);
  };

  if (done) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 60 }}>{score === QUIZ_SIZE ? "🏆" : score >= 3 ? "🎉" : "💪"}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "12px 0 4px" }}>
        {score === QUIZ_SIZE ? "เพอร์เฟกต์!" : score >= 3 ? "เก่งมาก!" : "สู้ต่อไป!"}
      </div>
      <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, marginBottom: 28 }}>
        ตอบถูก <span style={{ color, fontWeight: 900, fontSize: 22 }}>{score}</span>/{QUIZ_SIZE} ข้อ
      </div>
      <button onClick={restart} style={{ padding: "12px 32px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        เล่นอีกครั้ง
      </button>
    </div>
  );

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>ข้อ {idx + 1}/{QUIZ_SIZE}</span>
        <span style={{ color, fontWeight: 700, fontSize: 13 }}>⭐ {score}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 5, marginBottom: 20 }}>
        <div style={{ background: color, width: `${(idx / QUIZ_SIZE) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Question */}
      <div style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)`, borderRadius: 20, padding: "28px 20px", textAlign: "center", marginBottom: 16, border: `2px solid ${color}44` }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
          {q.isZhToTh ? "ความหมายของคำนี้คืออะไร?" : "คำจีนของคำนี้คืออะไร?"}
        </div>
        {q.isZhToTh ? (
          <>
            <div style={{ fontSize: 56, fontWeight: 900, color: "#fff" }}>{displayZh(q.word)}</div>
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
              style={{ padding: "14px 18px", borderRadius: 14, border, background: bg, color: textColor, fontWeight: 700, fontSize: 15, cursor: selected ? "default" : "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : ["A","B","C","D"][i]}
              </span>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
