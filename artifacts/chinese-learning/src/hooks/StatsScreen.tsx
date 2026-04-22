import { categories } from "../../data/vocabulary";
import { useProgress, MasteryLevel } from "../../hooks/useProgress";

interface Props {
  onClose: () => void;
}

const MASTERY_LABEL: Record<MasteryLevel, string> = { 0: "ยังไม่รู้", 1: "กำลังเรียน", 2: "เชี่ยวชาญ" };
const MASTERY_COLOR: Record<MasteryLevel, string> = { 0: "rgba(255,255,255,0.2)", 1: "#FFD700", 2: "#80D980" };
const MASTERY_EMOJI: Record<MasteryLevel, string> = { 0: "⚪", 1: "🟡", 2: "🟢" };

export function StatsScreen({ onClose }: Props) {
  const { getCount, getTotalStudied, getMasteryStats } = useProgress();

  const totalWords = categories.reduce((s, c) => s + c.words.length, 0);
  const totalStudied = getTotalStudied();
  const overallPct = Math.round((totalStudied / totalWords) * 100);

  const allWords = categories.flatMap(c => c.words.map(w => w.zh));
  const globalMastery = getMasteryStats(allWords);

  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg,#6C3AE8,#E8433A)",
        padding: "44px 16px 20px",
      }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 4 }}>
          📊 สถิติการเรียน
        </div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
          ดูความก้าวหน้าของคุณ
        </div>
      </div>

      <div style={{ padding: "16px" }}>

        {/* Overall Progress */}
        <div style={{
          background: "linear-gradient(135deg,#1E1E30,#252538)",
          borderRadius: 20, padding: "20px",
          border: "1.5px solid rgba(255,255,255,0.08)",
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
            ภาพรวมทั้งหมด
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{totalStudied}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>จาก {totalWords} คำ</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#6C3AE8" }}>{overallPct}%</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>เรียนแล้ว</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 10, overflow: "hidden" }}>
            <div style={{
              background: "linear-gradient(90deg,#6C3AE8,#E8433A)",
              width: `${overallPct}%`, height: "100%",
              borderRadius: 999, transition: "width 0.5s ease",
            }} />
          </div>
        </div>

        {/* Mastery Overview */}
        <div style={{
          background: "#1E1E30", borderRadius: 20, padding: "20px",
          border: "1.5px solid rgba(255,255,255,0.08)", marginBottom: 16,
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
            ระดับความเชี่ยวชาญ
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {([0, 1, 2] as MasteryLevel[]).map(level => {
              const count = level === 0 ? globalMastery.unknown : level === 1 ? globalMastery.learning : globalMastery.expert;
              return (
                <div key={level} style={{
                  background: `${MASTERY_COLOR[level]}22`,
                  border: `2px solid ${MASTERY_COLOR[level]}`,
                  borderRadius: 16, padding: "14px 10px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 24 }}>{MASTERY_EMOJI[level]}</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: MASTERY_COLOR[level], margin: "4px 0 2px" }}>{count}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{MASTERY_LABEL[level]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Per Category */}
        <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
          ความก้าวหน้าแต่ละหมวด
        </div>
        {categories.map(c => {
          const count = getCount(c.id);
          const pct = Math.round((count / c.words.length) * 100);
          const catWords = c.words.map(w => w.zh);
          const { unknown, learning, expert } = getMasteryStats(catWords);
          return (
            <div key={c.id} style={{
              background: "#1E1E30", borderRadius: 18, padding: "16px",
              border: "1.5px solid rgba(255,255,255,0.06)", marginBottom: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: c.color + "33", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 20,
                }}>{c.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>{c.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{count}/{c.words.length} คำ</div>
                </div>
                <div style={{
                  background: c.color + "33", color: c.color,
                  borderRadius: 999, padding: "4px 12px",
                  fontSize: 13, fontWeight: 800,
                }}>{pct}%</div>
              </div>

              {/* Progress bar */}
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 7, overflow: "hidden", marginBottom: 10 }}>
                <div style={{ background: c.color, width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.4s" }} />
              </div>

              {/* Mastery mini bars */}
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { label: "⚪ ยังไม่รู้", count: unknown, color: "rgba(255,255,255,0.3)" },
                  { label: "🟡 เรียน", count: learning, color: "#FFD700" },
                  { label: "🟢 เชี่ยว", count: expert, color: "#80D980" },
                ].map(m => (
                  <div key={m.label} style={{
                    flex: 1, background: m.color + "22",
                    border: `1.5px solid ${m.color}`,
                    borderRadius: 10, padding: "6px 8px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.count}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
