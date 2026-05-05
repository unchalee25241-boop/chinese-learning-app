import { useState, useEffect, useRef } from "react";
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
  const [order, setOrder] = useState<number[]>([]);
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [hint, setHint] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrder(shuffle(words.map((_, i) => i)));
    setIndex(0); setScore(0); setDone(false);
    setInput(""); setStatus("idle"); setHint(false);
  }, [words]);

  useEffect(() => {
    setInput(""); setStatus("idle"); setHint(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [index]);

  if (order.length === 0) return null;
  const total = Math.min(words.length, 10);
  const current = words[order[index]];
  if (!current) return null;

  const zh = mode === "cn" ? (current.zhCN ?? current.zhSimplified ?? current.zh) : current.zh;
  const reading = mode === "cn" ? current.pinyin : current.zhuyin;
  const answer = current.th.trim().toLowerCase();

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (status !== "idle") return;
    const isCorrect = normalize(input) === normalize(answer);
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  const handleSkip = () => {
    setStatus("wrong");
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  const restart = () => {
    setOrder(shuffle(words.map((_, i) => i)));
    setIndex(0); setScore(0); setDone(false);
    setInput(""); setStatus("idle"); setHint(false);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{score}/{total} คะแนน</div>
        <div style={{ fontSize: 15, color: dark.subtext, marginBottom: 28 }}>
          {pct === 100 ? "เพอร์เฟกต์! จำได้หมดเลย 🌟" : pct >= 70 ? "เก่งมาก! เกือบครบแล้ว" : pct >= 40 ? "ทำได้ดี ฝึกอีกนะ" : "ลองใหม่อีกครั้งนะ"}
        </div>
        <button onClick={restart} style={{
          background: color, color: "#fff", border: "none",
          borderRadius: 16, padding: "14px 40px",
          fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        }}>เล่นอีกครั้ง 🔄</button>
      </div>
    );
  }

  const hintText = answer.slice(0, Math.ceil(answer.length / 3));

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Progress */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: dark.subtext, fontSize: 13, fontWeight: 700 }}>{index + 1} / {total}</span>
        <span style={{ color: color, fontSize: 13, fontWeight: 800 }}>✨ {score} คะแนน</span>
      </div>
      <div style={{ height: 6, background: dark.surface, borderRadius: 999, marginBottom: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((index + 1) / total) * 100}%`, background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Question */}
      <div style={{
        background: `linear-gradient(135deg, ${color}33, ${color}11)`,
        border: `2px solid ${color}55`, borderRadius: 24,
        padding: "28px 20px", textAlign: "center", marginBottom: 20,
      }}>
        <div style={{ fontSize: 13, color: dark.subtext, marginBottom: 8, fontWeight: 700 }}>
          ✍️ พิมพ์คำแปลภาษาไทย
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.2, marginBottom: 8 }}>{zh}</div>
        <div style={{ fontSize: 16, color: color, fontWeight: 600 }}>{reading}</div>
        {mode === "tw" && (
          <div style={{ fontSize: 13, color: dark.subtext, marginTop: 4 }}>{current.pinyin}</div>
        )}
        {hint && (
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 14px", display: "inline-block" }}>
            <span style={{ color: "#F5A623", fontSize: 13, fontWeight: 700 }}>💡 ขึ้นต้นด้วย: "{hintText}..."</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ position: "relative", marginBottom: 14 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => { if (status === "idle") setInput(e.target.value); }}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); }}
          placeholder="พิมพ์คำตอบที่นี่..."
          style={{
            width: "100%", boxSizing: "border-box",
            background: status === "correct" ? "#27AE6033" : status === "wrong" ? "#E8433A33" : dark.card,
            border: `2px solid ${status === "correct" ? "#27AE60" : status === "wrong" ? "#E8433A" : dark.border}`,
            borderRadius: 16, padding: "16px 50px 16px 18px",
            color: "#fff", fontSize: 16, fontFamily: "inherit", outline: "none",
            transition: "all 0.2s",
          }}
        />
        <span style={{
          position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
          fontSize: 20,
        }}>
          {status === "correct" ? "✅" : status === "wrong" ? "❌" : ""}
        </span>
      </div>

      {/* Show answer if wrong */}
      {status === "wrong" && (
        <div style={{
          background: "#E8433A22", border: "1.5px solid #E8433A55",
          borderRadius: 12, padding: "10px 16px", marginBottom: 14, textAlign: "center",
        }}>
          <span style={{ color: dark.subtext, fontSize: 13 }}>คำตอบที่ถูก: </span>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>{current.th}</span>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        {!hint && status === "idle" && (
          <button onClick={() => setHint(true)} style={{
            flex: 1, padding: "14px", background: dark.surface,
            border: `1.5px solid ${dark.border}`, borderRadius: 14,
            color: "#F5A623", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>💡 ขอใบ้</button>
        )}
        {status === "idle" && (
          <>
            <button onClick={handleSkip} style={{
              flex: 1, padding: "14px", background: dark.surface,
              border: `1.5px solid ${dark.border}`, borderRadius: 14,
              color: dark.subtext, fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>ข้าม ⏭</button>
            <button onClick={handleSubmit} disabled={!input.trim()} style={{
              flex: 2, padding: "14px", background: input.trim() ? color : dark.surface,
              border: "none", borderRadius: 14,
              color: input.trim() ? "#fff" : dark.subtext,
              fontSize: 15, fontWeight: 800,
              cursor: input.trim() ? "pointer" : "default", fontFamily: "inherit",
              transition: "all 0.2s",
            }}>ตอบ ✓</button>
          </>
        )}
      </div>
    </div>
  );
}
