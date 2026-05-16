// src/components/games/WordOrderGame.tsx
// NEW FILE

import { useState, useEffect, useMemo } from "react";
import { Word } from "../../data/vocabulary";

interface Props {
  words: Word[];
  color: string;
  mode: "tw" | "cn";
}

const dark = {
  card: "#1E1E30", surface: "#252538",
  text: "#FFFFFF", subtext: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.08)",
};

type Level = "easy" | "medium" | "hard";

const LEVEL_CONFIG: Record<Level, { label: string; emoji: string; maxPieces: number; chunkSize: number }> = {
  easy:   { label: "ง่าย",   emoji: "🟢", maxPieces: 3, chunkSize: 3 },
  medium: { label: "กลาง",   emoji: "🟡", maxPieces: 5, chunkSize: 2 },
  hard:   { label: "ยาก",    emoji: "🔴", maxPieces: 7, chunkSize: 1 },
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function segmentSentence(sentence: string, answerZh: string, chunkSize: number, maxPieces: number): string[] | null {
  const clean = sentence.replace(/[，。！？、：；]/g, "").trim();
  if (clean.length < 2) return null;

  let segments: string[] = [];

  if (answerZh.length >= 2 && clean.includes(answerZh)) {
    const idx = clean.indexOf(answerZh);
    const before = clean.slice(0, idx);
    const after = clean.slice(idx + answerZh.length);

    const chunk = (s: string, size: number): string[] => {
      const res: string[] = [];
      let i = 0;
      while (i < s.length) { res.push(s.slice(i, i + size)); i += size; }
      return res.filter(Boolean);
    };

    segments = [...chunk(before, chunkSize), answerZh, ...chunk(after, chunkSize)];
  } else {
    let i = 0;
    while (i < clean.length) { segments.push(clean.slice(i, i + chunkSize)); i += chunkSize; }
  }

  segments = segments.filter(Boolean);
  if (segments.length < 2) return null;

  // Trim or merge to fit maxPieces
  if (segments.length > maxPieces) {
    // merge tail pieces
    const head = segments.slice(0, maxPieces - 1);
    const tail = segments.slice(maxPieces - 1).join("");
    segments = [...head, tail];
  }

  return segments;
}

// Segment Thai sentence into word-level pieces by spaces
function segmentThai(sentence: string, answerTh: string, maxPieces: number): string[] {
  const words = sentence.split(/\s+/).filter(Boolean);
  if (words.length <= maxPieces) return words;
  // merge tail
  const head = words.slice(0, maxPieces - 1);
  const tail = words.slice(maxPieces - 1).join(" ");
  return [...head, tail];
}

interface Question {
  sentenceZh: string;
  sentenceTh: string;
  zhPieces: string[];
  thPieces: string[];
  zhCorrect: string[];
  thCorrect: string[];
}

export function WordOrderGame({ words, color, mode }: Props) {
  const [level, setLevel] = useState<Level | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);

  // Two rows of selection
  const [zhSelected, setZhSelected] = useState<string[]>([]);
  const [thSelected, setThSelected] = useState<string[]>([]);
  const [zhRemaining, setZhRemaining] = useState<string[]>([]);
  const [thRemaining, setThRemaining] = useState<string[]>([]);

  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const wordsWithEx = useMemo(
    () => words.filter(w => w.examples && w.examples.length > 0),
    [words]
  );

  const getZh = (w: Word) =>
    mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;

  const buildQuestions = (lv: Level): Question[] => {
    const cfg = LEVEL_CONFIG[lv];
    const pool = shuffle(wordsWithEx);
    const qs: Question[] = [];

    for (const word of pool) {
      if (qs.length >= 8) break;
      const ex = word.examples![Math.floor(Math.random() * word.examples!.length)];
      const rawZh = mode === "cn" ? (ex.zhCN ?? ex.zh) : ex.zh;
      const rawTh = ex.th;
      const answerZh = getZh(word);
      const answerTh = word.th;

      const zhSegs = segmentSentence(rawZh, answerZh, cfg.chunkSize, cfg.maxPieces);
      if (!zhSegs) continue;

      const thSegs = segmentThai(rawTh, answerTh, cfg.maxPieces);
      if (thSegs.length < 2) continue;

      qs.push({
        sentenceZh: rawZh,
        sentenceTh: rawTh,
        zhPieces: shuffle(zhSegs),
        thPieces: shuffle(thSegs),
        zhCorrect: zhSegs,
        thCorrect: thSegs,
      });
    }
    return qs;
  };

  useEffect(() => {
    if (!level) return;
    const qs = buildQuestions(level);
    setQuestions(qs);
    setIndex(0); setScore(0); setDone(false); setTotalTime(0); setStatus("idle");
    if (qs.length > 0) {
      setZhRemaining(qs[0].zhPieces); setZhSelected([]);
      setThRemaining(qs[0].thPieces); setThSelected([]);
    }
  }, [level, words, mode]);

  useEffect(() => {
    if (done || status !== "idle") return;
    const t = setTimeout(() => setTotalTime(s => s + 1), 1000);
    return () => clearTimeout(t);
  }, [totalTime, status, done]);

  // Level picker
  if (!level) {
    return (
      <div style={{ padding: "20px 0" }}>
        <div style={{ textAlign: "center", fontSize: 13, color: dark.subtext, fontWeight: 700, marginBottom: 20, letterSpacing: 1 }}>
          🔀 เรียงคำ — เลือกระดับความยาก
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {(["easy", "medium", "hard"] as Level[]).map(lv => {
            const cfg = LEVEL_CONFIG[lv];
            return (
              <button key={lv} onClick={() => setLevel(lv)} style={{
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                border: `2px solid ${color}55`, borderRadius: 20,
                padding: "20px 24px", cursor: "pointer", fontFamily: "inherit",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>
                    {cfg.emoji} {cfg.label}
                  </div>
                  <div style={{ fontSize: 13, color: dark.subtext, marginTop: 4 }}>
                    {lv === "easy" ? "ประโยค 3 ชิ้น" : lv === "medium" ? "ประโยค 5 ชิ้น" : "ประโยค 7 ชิ้น"}
                  </div>
                </div>
                <span style={{ fontSize: 22, color: color }}>›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (wordsWithEx.length < 2) {
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

  const checkAnswer = (newZhSel: string[], newThSel: string[]) => {
    const zhDone = newZhSel.length === current.zhCorrect.length;
    const thDone = newThSel.length === current.thCorrect.length;
    if (!zhDone || !thDone) return;

    const zhOk = newZhSel.join("") === current.zhCorrect.join("");
    const thOk = newThSel.join(" ") === current.thCorrect.join(" ");
    const isCorrect = zhOk && thOk;

    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      const nextIdx = index + 1;
      if (nextIdx >= total) { setDone(true); return; }
      setIndex(nextIdx);
      setZhSelected([]); setZhRemaining(questions[nextIdx].zhPieces);
      setThSelected([]); setThRemaining(questions[nextIdx].thPieces);
      setStatus("idle");
    }, 1800);
  };

  const tapZh = (piece: string, i: number) => {
    if (status !== "idle") return;
    const newSel = [...zhSelected, piece];
    const newRem = zhRemaining.filter((_, idx) => idx !== i);
    setZhSelected(newSel); setZhRemaining(newRem);
    checkAnswer(newSel, thSelected);
  };

  const removeZh = (piece: string, i: number) => {
    if (status !== "idle") return;
    setZhSelected(zhSelected.filter((_, idx) => idx !== i));
    setZhRemaining([...zhRemaining, piece]);
  };

  const tapTh = (piece: string, i: number) => {
    if (status !== "idle") return;
    const newSel = [...thSelected, piece];
    const newRem = thRemaining.filter((_, idx) => idx !== i);
    setThSelected(newSel); setThRemaining(newRem);
    checkAnswer(zhSelected, newSel);
  };

  const removeTh = (piece: string, i: number) => {
    if (status !== "idle") return;
    setThSelected(thSelected.filter((_, idx) => idx !== i));
    setThRemaining([...thRemaining, piece]);
  };

  const restart = () => setLevel(null);

  const timeStr = () => {
    const m = Math.floor(totalTime / 60), s = totalTime % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, "0")} นาที` : `${totalTime} วินาที`;
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎉" : pct >= 40 ? "💪" : "📚";
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{score}/{total} คะแนน</div>
        <div style={{ fontSize: 15, color: dark.subtext, marginBottom: 6 }}>
          {pct === 100 ? "เพอร์เฟกต์! 🌟" : pct >= 70 ? "เก่งมาก!" : pct >= 40 ? "ทำได้ดี ลองอีกนะ" : "ลองใหม่อีกครั้ง 💪"}
        </div>
        <div style={{ fontSize: 13, color: dark.subtext, marginBottom: 28 }}>⏱ ใช้เวลา {timeStr()}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={restart} style={{
            background: color, color: "#fff", border: "none",
            borderRadius: 16, padding: "14px 40px",
            fontSize: 16, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
          }}>🔀 เล่นใหม่ (เลือกระดับ)</button>
        </div>
      </div>
    );
  }

  const slotStyle = (st: typeof status): React.CSSProperties => ({
    minHeight: 56,
    background: dark.card,
    border: `2px dashed ${st === "correct" ? "#27AE60" : st === "wrong" ? "#E8433A" : dark.border}`,
    borderRadius: 16, padding: "10px 12px",
    display: "flex", flexWrap: "wrap" as const, gap: 8, alignItems: "center",
    transition: "border-color 0.3s", marginBottom: 8,
  });

  const pieceStyle = (active: boolean, st: typeof status, isZh: boolean): React.CSSProperties => ({
    background: st === "correct" ? "#27AE6033" : st === "wrong" ? "#E8433A33" : `${color}33`,
    border: `1.5px solid ${st === "correct" ? "#27AE60" : st === "wrong" ? "#E8433A" : color}`,
    borderRadius: 12, padding: isZh ? "8px 14px" : "6px 12px",
    color: st === "correct" ? "#2ECC71" : st === "wrong" ? "#FF6B6B" : "#fff",
    fontSize: isZh ? 20 : 14, fontWeight: 800,
    cursor: active ? "pointer" : "default",
    fontFamily: "inherit", transition: "all 0.2s",
  });

  const bankPieceStyle = (isZh: boolean): React.CSSProperties => ({
    background: dark.surface,
    border: `1.5px solid ${dark.border}`,
    borderRadius: 12, padding: isZh ? "10px 16px" : "8px 14px",
    color: "#fff", fontSize: isZh ? 20 : 14, fontWeight: 800,
    cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
  });

  const cfg = LEVEL_CONFIG[level];

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: dark.subtext, fontSize: 13, fontWeight: 700 }}>
          {cfg.emoji} {cfg.label} · {index + 1} / {total}
        </span>
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
      <div style={{ height: 5, background: dark.surface, borderRadius: 999, marginBottom: 16, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((index + 1) / total) * 100}%`, background: color, borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Instruction */}
      <div style={{ textAlign: "center", fontSize: 12, color: dark.subtext, fontWeight: 700, marginBottom: 12, letterSpacing: 0.5 }}>
        🔀 เรียงทั้งคำจีน และ คำแปลไทยให้ถูกต้อง
      </div>

      {/* ZH answer slot */}
      <div style={{ fontSize: 11, color: dark.subtext, fontWeight: 700, marginBottom: 4 }}>ภาษาจีน</div>
      <div style={slotStyle(status)}>
        {zhSelected.length === 0 && <span style={{ color: dark.subtext, fontSize: 13 }}>แตะคำจีนด้านล่าง...</span>}
        {zhSelected.map((p, i) => (
          <button key={i} onClick={() => removeZh(p, i)} style={pieceStyle(status === "idle", status, true)}>{p}</button>
        ))}
      </div>

      {/* TH answer slot */}
      <div style={{ fontSize: 11, color: dark.subtext, fontWeight: 700, marginBottom: 4 }}>ภาษาไทย</div>
      <div style={slotStyle(status)}>
        {thSelected.length === 0 && <span style={{ color: dark.subtext, fontSize: 13 }}>แตะคำไทยด้านล่าง...</span>}
        {thSelected.map((p, i) => (
          <button key={i} onClick={() => removeTh(p, i)} style={pieceStyle(status === "idle", status, false)}>{p}</button>
        ))}
      </div>

      {/* Feedback */}
      {status !== "idle" && (
        <div style={{
          background: status === "correct" ? "#27AE6022" : "#E8433A22",
          border: `1.5px solid ${status === "correct" ? "#27AE6055" : "#E8433A55"}`,
          borderRadius: 14, padding: "10px 16px", marginBottom: 10, textAlign: "center",
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: status === "correct" ? "#2ECC71" : "#FF6B6B", marginBottom: 4 }}>
            {status === "correct" ? "✅ ถูกต้อง!" : "❌ ลำดับไม่ถูก"}
          </div>
          {status === "wrong" && (
            <div style={{ fontSize: 12, color: dark.subtext, lineHeight: 1.6 }}>
              <div>จีน: {current.zhCorrect.join(" ")}</div>
              <div>ไทย: {current.thCorrect.join(" ")}</div>
            </div>
          )}
        </div>
      )}

      {/* Piece banks */}
      <div style={{ marginBottom: 6, fontSize: 11, color: dark.subtext, fontWeight: 700 }}>คำจีน</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        {zhRemaining.map((p, i) => (
          <button key={i} onClick={() => tapZh(p, i)} style={bankPieceStyle(true)}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.93)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.93)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
          >{p}</button>
        ))}
      </div>

      <div style={{ marginBottom: 6, fontSize: 11, color: dark.subtext, fontWeight: 700 }}>คำไทย</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {thRemaining.map((p, i) => (
          <button key={i} onClick={() => tapTh(p, i)} style={bankPieceStyle(false)}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.93)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={e => (e.currentTarget.style.transform = "scale(0.93)")}
            onTouchEnd={e => (e.currentTarget.style.transform = "scale(1)")}
          >{p}</button>
        ))}
      </div>
    </div>
  );
}
