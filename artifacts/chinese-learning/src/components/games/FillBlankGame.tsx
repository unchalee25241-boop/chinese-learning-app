import { useState, useEffect } from "react";
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

export function FillBlankGame({ words, color, mode }: Props) {
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    const shuffled = shuffle(words.map((_, i) => i));
    setOrder(shuffled);
    setIndex(0);
    setScore(0);
    setDone(false);
    setSelected(null);
  }, [words]);

  useEffect(() => {
    if (order.length === 0) return;
    const current = words[order[index]];
    if (!current) return;
    const correct = current.th;
    const others = shuffle(words.filter(w => w.th !== correct)).slice(0, 3).map(w => w.th);
    setChoices(shuffle([correct, ...others]));
    setSelected(null);
  }, [index, order]);

  if (order.length === 0) return null;

  const current = words[order[index]];
  if (!current) return null;

  const correct = current.th;
  const total = Math.min(words.length, 10);
  const zh = mode === "cn" ? (current.zhCN ?? current.zhSimplified ?? current.zh) : current.zh;
  const reading = mode === "cn" ? (current.pinyin) : current.zhuyin;

  const handleSelect = (choice: string) => {
    if (selected) return;
    setSelected(choice);
    if (choice === correct) setScore(s => s + 1);
    setTimeout(() => {
      if (index + 1 >= total) {
        setDone(true);
      } else {
        setIndex(i => i + 1);
      }
    }, 900);
  };

  const restart = () => {
    const shuffled = shuffle(words.map((_, i) => i));
    setOrder(shuffled);
    setIndex(0);
    setScore(0);
    setDone(false);
    setSelected(null);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div style={{ textAlign: "center", padding: "32px 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
          {score}/{total} คะแนน
        </div>
        <div style={{ fontSize: 15, color: dark.subtext, marginBottom: 28 }}>
          {pct === 100 ? "เพอร์เฟกต์! เก่งมากเลย 🌟" : pct >= 70 ? "เยี่ยมมาก! ทำต่อไปนะ" : pct >= 40 ? "ทำได้ดี ฝึกอีกนิดนะ" : "ลองใหม่อีกครั้งนะ"}
        </div>
        <button onClick={restart} style={{
          background: color, color: "#fff", border: "none",
          borderRadius: 16, padding: "14px 40px",
          fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        }}>
          เล่นอีกครั้ง 🔄
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ color: dark.subtext, fontSize: 13, fontWeight: 700 }}>
          {index + 1} / {total}
        </span>
        <span style={{ color: color, fontSize: 13, fontWeight: 800 }}>
          ✨ {score} คะแนน
        </span>
      </div>
      <div style={{ height: 6, background: dark.surface, borderRadius: 999, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((index + 1) / total) * 100}%`, background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Question Card */}
      <div style={{
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `2px solid ${color}55`,
        borderRadius: 24, padding: "28px 20px",
        textAlign: "center", marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, color: dark.subtext, marginBottom: 8, fontWeight: 700 }}>
          ✍️ คำนี้แปลว่าอะไร?
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", marginBottom: 8, lineHeight: 1.2 }}>
          {zh}
        </div>
        <div style={{ fontSize: 16, color: color, fontWeight: 600 }}>
          {reading}
        </div>
        {current.pinyin && mode === "tw" && (
          <div style={{ fontSize: 13, color: dark.subtext, marginTop: 4 }}>
            {current.pinyin}
          </div>
        )}
      </div>

      {/* Choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {choices.map((choice, i) => {
          const isCorrect = choice === correct;
          const isSelected = choice === selected;
          let bg = dark.card;
          let border = dark.border;
          let textColor = dark.text;
          if (selected) {
            if (isCorrect) { bg = "#27AE6033"; border = "#27AE60"; textColor = "#2ECC71"; }
            else if (isSelected) { bg = "#E8433A33"; border = "#E8433A"; textColor = "#FF6B6B"; }
          }
          return (
            <button key={i} onClick={() => handleSelect(choice)}
              style={{
                width: "100%", padding: "16px 20px",
                background: bg, border: `2px solid ${border}`,
                borderRadius: 16, color: textColor,
                fontSize: 15, fontWeight: 700, cursor: selected ? "default" : "pointer",
                fontFamily: "inherit", textAlign: "left",
                display: "flex", alignItems: "center", gap: 12,
                transition: "all 0.2s",
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: selected && isCorrect ? "#27AE60" : selected && isSelected ? "#E8433A" : color + "33",
                color: selected ? "#fff" : color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, flexShrink: 0,
              }}>
                {selected ? (isCorrect ? "✓" : isSelected ? "✗" : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
              </span>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
