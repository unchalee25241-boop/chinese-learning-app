// src/components/games/FillBlankGame.tsx
// FULL FILE REPLACEMENT

import { useState, useEffect, useMemo } from "react";
import { Word } from "../../data/vocabulary";

interface Props {
  words: Word[];
  color: string;
  mode: "tw" | "cn";
}

const dark = {
  bg: "#12121E", card: "#1E1E30", surface: "#252538",
  text: "#FFFFFF", subtext: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.08)",
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Question {
  sentenceZh: string;
  sentenceTh: string;
  answer: string;
  answerTh: string;
  reading: string;
  options: string[];
}

export function FillBlankGame({ words, color, mode }: Props) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const wordsWithEx = useMemo(
    () => words.filter(w => w.examples && w.examples.length > 0),
    [words]
  );

  const getZh = (w: Word) =>
    mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;

  const buildQuestions = (): Question[] => {
    const pool = shuffle(wordsWithEx).slice(0, 10);
    if (pool.length === 0) return [];

    return pool.map((word): Question => {
      const ex = word.examples![Math.floor(Math.random() * word.examples!.length)];
      const answer = getZh(word);
      const reading = mode === "cn" ? word.pinyin : word.zhuyin;
      const sentenceZh = mode === "cn" ? (ex.zhCN ?? ex.zh) : ex.zh;
      const sentenceTh = ex.th;

      const others = shuffle(wordsWithEx.filter(w => w.zh !== word.zh)).slice(0, 3);
      const wrongOptions = others.map(w => getZh(w));

      return {
        sentenceZh,
        sentenceTh,
        answer,
        answerTh: word.th,
        reading,
        options: shuffle([answer, ...wrongOptions]),
      };
    });
  };

  useEffect(() => {
    const qs = buildQuestions();
    setQuestions(qs);
    setIndex(0); setScore(0); setDone(false);
    setSelected(null); setTotalTime(0);
  }, [words, mode]);

  useEffect(() => {
    if (done || selected !== null) return;
    const t = setTimeout(() => setTotalTime(s => s + 1), 1000);
    return () => clearTimeout(t);
  }, [totalTime, selected, done]);

  if (wordsWithEx.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px", color: dark.subtext }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>หมวดนี้ยังไม่มีประโยคตัวอย่าง</div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const total = questions.length;
  const current = questions[index];
  if (!current) return null;

  const handleSelect = (opt: string) => {
    if (selected !== null) return;
    setSelected(opt);
    if (opt === current.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else { setIndex(i => i + 1); setSelected(null); }
    }, 1800);
  };

  const restart = () => {
    const qs = buildQuestions();
    setQuestions(qs);
    setIndex(0); setScore(0); setDone(false);
    setSelected(null); setTotalTime(0);
  };

  const timeStr = () => {
    const m = Math.floor(totalTime / 60), s = totalTime % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")} นาที` : `${totalTime} วินาที`;
  };

  // Render sentence with blank (hide the answer word)
  const renderSentence = (sentence: string, answer: string, revealed: boolean, isZh: boolean) => {
    if (!sentence.includes(answer)) {
      // fallback: show full sentence
      return <span style={{ color: dark.subtext }}>{sentence}</span>;
    }
    const idx = sentence.indexOf(answer);
    const before = sentence.slice(0, idx);
    const after = sentence.slice(idx + answer.length);
    const blankWidth = isZh ? Math.max(answer.length * 28, 56) : Math.max(answer.length * 10, 60);

    return (
      <>
        {before}
        <span style={{
          display: "inline-block",
          minWidth: blankWidth,
          borderBottom: `3px solid ${color}`,
          marginBottom: -2,
          paddingBottom: 1,
          textAlign: "center",
          color: revealed
            ? (selected === current.answer ? "#2ECC71" : "#FF6B6B")
            : "transparent",
          fontWeight: 900,
          transition: "color 0.3s",
          background: revealed ? "transparent" : `${color}22`,
          borderRadius: 4,
        }}>
          {revealed ? answer : (isZh ? "　".repeat(Math.max(answer.length, 2)) : "　　　")}
        </span>
        {after}
      </>
    );
  };

  // Done screen
  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
          {score}/{total} คะแนน
        </div>
        <div style={{ fontSize: 15, color: dark.subtext, marginBottom: 6 }}>
          {pct === 100 ? "เพอร์เฟกต์! เลือกถูกหมดเลย 🌟"
            : pct >= 70 ? "เก่งมาก! เกือบครบแล้ว"
            : pct >= 40 ? "ทำได้ดี ลองฝึกอีกนะ"
            : "ลองใหม่อีกครั้งนะ 💪"}
        </div>
        <div style={{ fontSize: 13, color: dark.subtext, marginBottom: 28 }}>
          ⏱ ใช้เวลา {timeStr()}
        </div>
        <button onClick={restart} style={{
          background: color, color: "#fff", border: "none",
          borderRadius: 16, padding: "14px 40px",
          fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        }}>🔀 เล่นใหม่</button>
      </div>
    );
  }

  const revealed = selected !== null;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: dark.subtext, fontSize: 13, fontWeight: 700 }}>{index + 1} / {total}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "#27AE60", fontSize: 14, fontWeight: 800 }}>
            ⏱ {Math.floor(totalTime / 60) > 0
              ? `${Math.floor(totalTime / 60)}:${(totalTime % 60).toString().padStart(2, "0")}`
              : `${totalTime}s`}
          </span>
          <span style={{ color, fontSize: 13, fontWeight: 800 }}>✨ {score} คะแนน</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 5, background: dark.surface, borderRadius: 999, marginBottom: 20, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${((index + 1) / total) * 100}%`,
          background: color, borderRadius: 999, transition: "width 0.3s",
        }} />
      </div>

      {/* Sentence card */}
      <div style={{
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `2px solid ${color}55`, borderRadius: 24,
        padding: "24px 20px", marginBottom: 10,
      }}>
        <div style={{ fontSize: 11, color: dark.subtext, marginBottom: 12, fontWeight: 700, letterSpacing: 1, textAlign: "center" }}>
          ✍️ เลือกคำที่หายไปในประโยค
        </div>

        {/* Chinese sentence with blank */}
        <div style={{
          fontSize: 22, fontWeight: 900, color: "#fff",
          lineHeight: 1.8, marginBottom: 12, textAlign: "center", wordBreak: "break-all",
        }}>
          {renderSentence(current.sentenceZh, current.answer, revealed, true)}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: dark.border, marginBottom: 12 }} />

        {/* Thai sentence with blank */}
        <div style={{
          fontSize: 15, color: `${color}dd`, lineHeight: 1.8,
          textAlign: "center", fontStyle: "italic",
        }}>
          {renderSentence(current.sentenceTh, current.answerTh, revealed, false)}
        </div>
      </div>

      {/* Answer feedback */}
      {revealed && (
        <div style={{
          background: selected === current.answer ? "#27AE6022" : "#E8433A22",
          border: `1.5px solid ${selected === current.answer ? "#27AE6055" : "#E8433A55"}`,
          borderRadius: 16, padding: "12px 16px", marginBottom: 12, textAlign: "center",
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: selected === current.answer ? "#2ECC71" : "#FF6B6B", marginBottom: 4 }}>
            {selected === current.answer ? "✅ ถูกต้อง!" : `❌ คำที่ถูกคือ "${current.answer}"`}
          </div>
          <div style={{ fontSize: 13, color: dark.subtext }}>
            {current.answer} = {current.answerTh} • {current.reading}
          </div>
        </div>
      )}

      {/* Options grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {current.options.map((opt, i) => {
          const isCorrect = opt === current.answer;
          const isSelected = opt === selected;
          let bg = dark.card;
          let border = `1.5px solid ${dark.border}`;
          let textColor: string = "#fff";

          if (revealed) {
            if (isCorrect) { bg = "#27AE6033"; border = "1.5px solid #27AE60"; textColor = "#2ECC71"; }
            else if (isSelected) { bg = "#E8433A33"; border = "1.5px solid #E8433A"; textColor = "#FF6B6B"; }
            else { textColor = dark.subtext; }
          } else {
            // highlight on hover feel — just keep default
          }

          return (
            <button key={i} onClick={() => handleSelect(opt)} style={{
              background: bg, border, borderRadius: 16,
              padding: "18px 12px", color: textColor,
              fontSize: 20, fontWeight: 900,
              cursor: revealed ? "default" : "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
              transform: isSelected ? "scale(0.97)" : "scale(1)",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
