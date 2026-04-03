import { useState } from "react";
import { SpeakButton } from "../shared/SpeakButton";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; pinyinCN?: string; th: string; }
interface Props { words: Word[]; color: string; onStudied: () => void; mode: Mode; }

export function FlashcardGame({ words, color, onStudied, mode }: Props) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const card = words[idx];
  const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;
  const next = (knew: boolean) => {
    if (knew) { setScore(s => s + 1); onStudied(); }
    setFlipped(false);
    setTimeout(() => setIdx(i => i + 1), 150);
  };
  if (idx >= words.length) return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: 60 }}>🎉</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "12px 0 4px" }}>จบแล้วค่ะ!</div>
      <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>จำได้ {score}/{words.length} คำ</div>
      <button onClick={() => { setIdx(0); setScore(0); setFlipped(false); }} style={{ padding: "12px 32px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>เล่นอีกครั้ง</button>
    </div>
  );
  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{idx + 1}/{words.length}</span>
        <span style={{ color: color, fontWeight: 700, fontSize: 13 }}>⭐ {score}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 5, marginBottom: 20 }}>
        <div style={{ background: color, width: `${(idx / words.length) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
      </div>
      <div onClick={() => setFlipped(f => !f)} style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)`, borderRadius: 24, padding: "32px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", boxShadow: `0 8px 28px ${color}44`, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", fontSize: 120, fontWeight: 900, color: "rgba(255,255,255,0.12)", lineHeight: 1, pointerEvents: "none" }}>
          {displayZh(card)}
        </div>
        {!flipped ? (
          <>
            <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", position: "relative", zIndex: 1 }}>{displayZh(card)}</div>
            {mode === "tw" && <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", position: "relative", zIndex: 1 }}>{card.zhuyin}</div>}
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", fontStyle: "italic", position: "relative", zIndex: 1 }}>{mode === "cn" ? (card.pinyinCN ?? card.pinyin) : card.pinyin}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, position: "relative", zIndex: 1 }}>แตะเพื่อดูคำตอบ 👆</div>
            <div style={{ marginTop: 8, position: "relative", zIndex: 1 }}>
              <SpeakButton text={displayZh(card)} color="#fff" lang={mode === "cn" ? "zh-CN" : "zh-TW"} />
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", position: "relative", zIndex: 1 }}>{displayZh(card)}</div>
            {mode === "tw" && <div style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", position: "relative", zIndex: 1 }}>{card.zhuyin}</div>}
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", fontStyle: "italic", position: "relative", zIndex: 1 }}>{mode === "cn" ? (card.pinyinCN ?? card.pinyin) : card.pinyin}</div>
            <div style={{ fontSize: 28, color: "#fff", fontWeight: 700, marginTop: 4, position: "relative", zIndex: 1 }}>{card.th}</div>
          </>
        )}
      </div>

      {flipped && (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={() => next(false)} style={{ flex: 1, padding: 14, borderRadius: 14, background: "#2D1515", border: "2px solid #E84040", color: "#E84040", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>😅 ยังไม่รู้</button>
          <button onClick={() => next(true)} style={{ flex: 1, padding: 14, borderRadius: 14, background: "#152D15", border: "2px solid #80D980", color: "#80D980", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>✅ รู้แล้ว!</button>
        </div>
      )}
    </div>
  );
}
