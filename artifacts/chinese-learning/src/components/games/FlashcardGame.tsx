import { useState } from "react";
import { SpeakButton } from "../shared/SpeakButton";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; pinyinCN?: string; th: string; }
interface Props { words: Word[]; color: string; onStudied: () => void; mode: Mode; onMastery?: (word: string, level: 1 | 2) => void; }

export function FlashcardGame({ words, color, onStudied, mode, onMastery }: Props) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const card = words[idx];
  const displayZh = (w: Word) => mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh;

    const handleKnown = () => {
    onStudied();
    onMastery?.(card.zh, 2);
    setKnown(k => k + 1);

    setFlipped(false);
    setTimeout(() => {
      if (idx + 1 >= words.length) setShowResult(true);
      else setIdx(i => i + 1);
    }, 150);
  };

   const handleUnknown = () => {
    onMastery?.(card.zh, 1);
    setUnknown(u => u + 1);

    setFlipped(false);
    setTimeout(() => {
      if (idx + 1 >= words.length) setShowResult(true);
      else setIdx(i => i + 1);
    }, 150);
  };

  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIdx(i => Math.max(i - 1, 0)), 150);
  };

  const restart = () => {
    setIdx(0); setFlipped(false); setKnown(0); setUnknown(0); setShowResult(false);
  };

  if (showResult) {
    const pct = Math.round((known / words.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: "32px 20px" }}>
        <div style={{ fontSize: 60 }}>{pct === 100 ? "🏆" : pct >= 70 ? "🎉" : "💪"}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "12px 0 4px" }}>
          {pct === 100 ? "เพอร์เฟกต์!" : pct >= 70 ? "เก่งมากเลย!" : "ฝึกต่อไปนะ!"}
        </div>
        <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>ดูครบ {words.length} คำแล้ว</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 24 }}>
          <div style={{ background: "rgba(80,200,80,0.15)", border: "2px solid #80D980", borderRadius: 16, padding: "16px 24px", minWidth: 90 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#80D980" }}>{known}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>รู้แล้ว ✓</div>
          </div>
          <div style={{ background: "rgba(200,80,80,0.15)", border: "2px solid #E84040", borderRadius: 16, padding: "16px 24px", minWidth: 90 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#E84040" }}>{unknown}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>ยังไม่รู้ ✗</div>
          </div>
          <div style={{ background: `rgba(255,255,255,0.08)`, border: `2px solid ${color}`, borderRadius: 16, padding: "16px 24px", minWidth: 90 }}>
            <div style={{ fontSize: 32, fontWeight: 900, color }}>{pct}%</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>แม่นยำ</div>
          </div>
        </div>
        <button onClick={restart} style={{ padding: "12px 32px", borderRadius: 999, background: color, color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          เล่นอีกครั้ง
        </button>
      </div>
    );
  }

  if (idx >= words.length) return null;

  return (
    <div style={{ padding: "8px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{idx + 1}/{words.length}</span>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "#80D980", fontSize: 13, fontWeight: 700 }}>✓ {known}</span>
          <span style={{ color: "#E84040", fontSize: 13, fontWeight: 700 }}>✗ {unknown}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 999, height: 5, marginBottom: 20 }}>
        <div style={{ background: color, width: `${(idx / words.length) * 100}%`, height: "100%", borderRadius: 999, transition: "width 0.3s" }} />
      </div>

      {/* Card */}
      <div onClick={() => setFlipped(f => !f)}
        style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)`, borderRadius: 24, padding: "32px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s", boxShadow: `0 8px 28px ${color}44`, minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, position: "relative", overflow: "hidden" }}>
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

      {/* Buttons */}
      {!flipped ? (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={prev} disabled={idx === 0}
            style={{ flex: 1, padding: 14, borderRadius: 14, background: idx === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", color: idx === 0 ? "rgba(255,255,255,0.3)" : "#fff", fontWeight: 700, fontSize: 14, cursor: idx === 0 ? "not-allowed" : "pointer" }}>
            ← ย้อนกลับ
          </button>
          <button onClick={() => setFlipped(true)}
            style={{ flex: 2, padding: 14, borderRadius: 14, background: color, border: "none", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ดูคำตอบ 👆
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button onClick={handleUnknown}
            style={{ flex: 1, padding: 14, borderRadius: 14, background: "rgba(232,64,64,0.15)", border: "2px solid #E84040", color: "#E84040", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ✗ ยังไม่รู้
          </button>
          <button onClick={handleKnown}
            style={{ flex: 1, padding: 14, borderRadius: 14, background: "rgba(80,200,80,0.15)", border: "2px solid #80D980", color: "#80D980", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ✓ รู้แล้ว
          </button>
        </div>
      )}
    </div>
  );
}
