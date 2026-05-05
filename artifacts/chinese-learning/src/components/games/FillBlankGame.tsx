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
  const [timeLeft, setTimeLeft] = useState(15);
  const [totalTime, setTotalTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrder(shuffle(words.map((_, i) => i)));
    setIndex(0); setScore(0); setDone(false);
    setInput(""); setStatus("idle"); setHint(false);
    setTimeLeft(15); setTotalTime(0);
  }, [words]);

  useEffect(() => {
    setInput(""); setStatus("idle"); setHint(false);
    setTimeLeft(15);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [index]);

  useEffect(() => {
    if (done || status !== "idle") return;
    if (timeLeft <= 0) {
      setStatus("wrong");
      setTimeout(() => {
        if (index + 1 >= Math.min(words.length, 10)) setDone(true);
        else setIndex(i => i + 1);
      }, 1200);
      return;
    }
    const t = setTimeout(() => {
      setTimeLeft(s => s - 1);
      setTotalTime(s => s + 1);
    }, 1000);
    return () => clearTimeout(t);
  }, [timeLeft, status, done, index]);

  if (order.length === 0) return null;
  const total = Math.min(words.length, 10);
  const current = words[order[index]];
  if (!current) return null;

  const zh = mode === "cn" ? (current.zhCN ?? current.zhSimplified ?? current.zh) : current.zh;
  const reading = mode === "cn" ? current.pinyin : current.zhuyin;

  const normalize = (s: string) =>
    s.trim().toLowerCase().replace(/\s+/g, "").replace(/[/\-,.!?()ๆ]/g, "");

  const similarity = (a: string, b: string) => {
    const na = normalize(a);
    const nb = normalize(b);
    if (na === nb) return 1;
    if (nb.includes(na) || na.includes(nb)) return 0.9;
    let matches = 0;
    for (const ch of na) { if (nb.includes(ch)) matches++; }
    return matches / Math.max(na.length, nb.length);
  };

  const handleSubmit = () => {
    if (status !== "idle") return;
    const sim = similarity(input, current.th);
    const isCorrect = sim >= 0.75;
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  const handleSkip = () => {
    if (status !== "idle") return;
    setStatus("wrong");
    setTimeout(() => {
      if (index + 1 >= total) setDone(true);
      else setIndex(i => i + 1);
    }, 1200);
  };

  const restartShuffle = () => {
    setOrder(shuffle(words.map((_, i) => i)));
    setIndex(0); setScore(0); setDone(false);
    setInput(""); setStatus("idle"); setHint(false);
    setTimeLeft(15); setTotalTime(0);
  };

  const restartSame = () => {
    setOrder(words.map((_, i) => i));
    setIndex(0); setScore(0); setDone(false);
    setInput(""); setStatus("idle"); setHint(false);
    setTimeLeft(15); setTotalTime(0);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
    const mins = Math.floor(totalTime / 60);
    const secs = totalTime % 60;
    const timeStr = mins > 0 ? `${mins}:${secs.toString().padStart(2, "0")} นาที` : `${secs} วินาที`;
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>
          {score}/{total} คะแนน
        </div>
        <div style={{ fontSize: 15, color: dark.subtext, marginBottom: 6 }}>
          {pct === 100 ? "เพอร์เฟกต์! จำได้หมดเลย 🌟" : pct >= 70 ? "เก่งมาก! เกือบครบแล้ว" : pct >= 40 ? "ทำได้ดี ฝึกอีกนะ" : "ลองใหม่อีกครั้งนะ"}
        </div>
        <div style={{ fontSize: 13, color: dark.subtext, marginBottom: 28 }}>
          ⏱ ใช้เวลา {timeStr}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={restartShuffle} style={{
            background: color, color: "#fff", border: "none",
            borderRadius: 16, padding: "14px 40px",
            fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          }}>🔀 เล่นชุดใหม่ (สุ่ม)</button>
          <button onClick={restartSame} style={{
            background: dark.surface, color: "#fff",
            border: `1.5px solid ${dark.border}`,
            borderRadius: 16, padding: "14px 40px",
            fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          }}>📋 เล่นชุดเดิมตามลำดับ</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Progress + Timer */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: dark.subtext, fontSize: 13, fontWeight: 700 }}>{index + 1} / {total}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            color: timeLeft <= 5 ? "#E8433A" : timeLeft <= 10 ? "#F5A623" : "#27AE60",
            fontSize: 14, fontWeight: 800,
          }}>⏱ {timeLeft}s</span>
          <span style={{ color: color, fontSize: 13, fontWeight: 800 }}>✨ {score} คะแนน</span>
        </div>
      </div>
      {/* Timer bar */}
      <div style={{ height: 4, background: dark.surface, borderRadius: 999, marginBottom: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${(timeLeft / 15) * 100}%`,
          background: timeLeft <= 5 ? "#E8433A" : timeLeft <= 10 ? "#F5A623" : "#27AE60",
          borderRadius: 999, transition: "width 1s linear, background 0.3s",
        }} />
      </div>
      {/* Progress bar */}
      <div style={{ height: 4, background: dark.surface, borderRadius: 999, marginBottom: 20, overflow: "hidden" }}>
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
            <span style={{ color: "#F5A623", fontSize: 13, fontWeight: 700 }}>
              💡 ขึ้นต้นด้วย: "{current.th.slice(0, Math.ceil(current.th.length / 3))}..."
            </span>
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
        <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", fontSize: 20 }}>
          {status === "correct" ? "✅" : status === "wrong" ? "❌" : ""}
        </span>
      </div>
        {/* Show result */}
      {status !== "idle" && (
        <div style={{
          background: status === "correct" ? "#27AE6022" : "#E8433A22",
          border: `1.5px solid ${status === "correct" ? "#27AE6055" : "#E8433A55"}`,
          borderRadius: 16, padding: "14px 16px", marginBottom: 14,
        }}>
          {status === "wrong" && (
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <span style={{ color: dark.subtext, fontSize: 13 }}>คำตอบที่ถูก: </span>
              <span style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>{current.th}</span>
            </div>
          )}
          {status === "correct" && (
            <div style={{ textAlign: "center", marginBottom: 10 }}>
              <span style={{ color: "#2ECC71", fontSize: 14, fontWeight: 800 }}>✅ ถูกต้อง!</span>
            </div>
          )}
          {/* Example sentence */}
          {current.examples && current.examples.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.05)", borderRadius: 12,
              padding: "10px 14px",
            }}>
              <div style={{ fontSize: 11, color: dark.subtext, fontWeight: 700, marginBottom: 6 }}>
                📖 ตัวอย่างประโยค
              </div>
              <div style={{ fontSize: 17, color: "#fff", fontWeight: 700, marginBottom: 4 }}>
                {mode === "cn"
                  ? (current.examples[0].zhCN ?? current.examples[0].zh)
                  : current.examples[0].zh}
              </div>
              <div style={{ fontSize: 11, color: color, marginBottom: 4 }}>
                {mode === "cn"
                  ? current.examples[0].pinyin
                  : `${current.examples[0].zhuyin} • ${current.examples[0].pinyin}`}
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                {current.examples[0].th}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Buttons */}
      {status === "idle" && (
        <div style={{ display: "flex", gap: 10 }}>
          {!hint && (
            <button onClick={() => setHint(true)} style={{
              flex: 1, padding: "14px", background: dark.surface,
              border: `1.5px solid ${dark.border}`, borderRadius: 14,
              color: "#F5A623", fontSize: 14, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}>💡 ขอใบ้</button>
          )}
          <button onClick={handleSkip} style={{
            flex: 1, padding: "14px", background: dark.surface,
            border: `1.5px solid ${dark.border}`, borderRadius: 14,
            color: dark.subtext, fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>ข้าม ⏭</button>
          <button onClick={handleSubmit} disabled={!input.trim()} style={{
            flex: 2, padding: "14px",
            background: input.trim() ? color : dark.surface,
            border: "none", borderRadius: 14,
            color: input.trim() ? "#fff" : dark.subtext,
            fontSize: 15, fontWeight: 800,
            cursor: input.trim() ? "pointer" : "default",
            fontFamily: "inherit", transition: "all 0.2s",
          }}>ตอบ ✓</button>
        </div>
      )}
    </div>
  );
}
