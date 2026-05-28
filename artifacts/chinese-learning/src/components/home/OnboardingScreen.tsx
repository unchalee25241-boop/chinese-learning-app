import { useState } from "react";

interface OnboardingScreenProps {
  onComplete: (level: "beginner" | "intermediate") => void;
}

const slides = [
  {
    emoji: "🀄",
    title: "ยินดีต้อนรับสู่\nEasy Chinese!",
    subtitle: "เรียนภาษาจีนแบบง่ายๆ\nเข้าใจได้ตั้งแต่วันแรก",
    bg: "linear-gradient(135deg,#E8433A,#F5A623)",
  },
  {
    emoji: "🎮",
    title: "เรียนผ่านเกม\nไม่น่าเบื่อ",
    subtitle: "Flashcard · Quiz · จับคู่\nเติมคำ · เรียงคำ",
    bg: "linear-gradient(135deg,#6C3AE8,#E8433A)",
  },
  {
    emoji: "🔥",
    title: "สะสม Streak\nทุกวัน",
    subtitle: "เรียนต่อเนื่องสร้างนิสัย\nติดตามความก้าวหน้าของคุณ",
    bg: "linear-gradient(135deg,#FF6B35,#F7C59F)",
  },
  {
    emoji: "🤖",
    title: "มีครู AI\nพร้อมตอบทุกคำถาม",
    subtitle: "ถามได้ตลอด 24 ชั่วโมง\nอธิบายทั้งภาษาไทย",
    bg: "linear-gradient(135deg,#11998e,#38ef7d)",
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(0); // 0-3 = slides, 4 = level picker

  const isLastSlide = step === slides.length - 1;
  const isLevelPicker = step === slides.length;

  const handleNext = () => {
    if (isLastSlide) setStep(slides.length);
    else setStep(s => s + 1);
  };

  if (isLevelPicker) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#12121E 0%,#1E1E30 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "32px 24px",
        fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif",
      }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>🎯</div>
        <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 900, textAlign: "center", margin: "0 0 8px", lineHeight: 1.3 }}>
          คุณเริ่มต้นจากไหน?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, textAlign: "center", margin: "0 0 36px" }}>
          เลือกระดับที่เหมาะกับคุณ<br/>สามารถเปลี่ยนได้ภายหลัง
        </p>

        <button
          onClick={() => onComplete("beginner")}
          style={{
            width: "100%", maxWidth: 360,
            background: "linear-gradient(135deg,#11998e,#38ef7d)",
            border: "none", borderRadius: 20, padding: "22px 24px",
            cursor: "pointer", marginBottom: 16, textAlign: "left",
            fontFamily: "inherit",
            boxShadow: "0 6px 24px rgba(17,153,142,0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 40 }}>🌱</span>
            <div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>ผู้เริ่มต้น</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 3 }}>
                เรียนคำพื้นฐาน · สัตว์ · ครอบครัว · สี · ตัวเลข
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onComplete("intermediate")}
          style={{
            width: "100%", maxWidth: 360,
            background: "linear-gradient(135deg,#E8433A,#F5A623)",
            border: "none", borderRadius: 20, padding: "22px 24px",
            cursor: "pointer", textAlign: "left",
            fontFamily: "inherit",
            boxShadow: "0 6px 24px rgba(232,67,58,0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 40 }}>🚀</span>
            <div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>มีพื้นฐานบ้างแล้ว</div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 3 }}>
                ชีวิตประจำวัน · ความรัก · การเดินทาง · อาหาร
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => onComplete("intermediate")}
          style={{
            marginTop: 20, background: "none", border: "none",
            color: "rgba(255,255,255,0.4)", fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          ข้ามและเริ่มเลย →
        </button>
      </div>
    );
  }

  const slide = slides[step];

  return (
    <div style={{
      minHeight: "100vh",
      background: slide.bg,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "80px 32px 60px",
      fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif",
      transition: "background 0.4s ease",
    }}>
      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 88, marginBottom: 32, filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.2))" }}>
          {slide.emoji}
        </div>
        <h1 style={{
          color: "#fff", fontSize: 30, fontWeight: 900,
          textAlign: "center", margin: "0 0 16px", lineHeight: 1.3,
          whiteSpace: "pre-line",
        }}>
          {slide.title}
        </h1>
        <p style={{
          color: "rgba(255,255,255,0.85)", fontSize: 16,
          textAlign: "center", lineHeight: 1.7, margin: 0,
          whiteSpace: "pre-line",
        }}>
          {slide.subtitle}
        </p>
      </div>

      {/* Bottom */}
      <div style={{ width: "100%", maxWidth: 360 }}>
        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8,
              borderRadius: 999,
              background: i === step ? "#fff" : "rgba(255,255,255,0.35)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          style={{
            width: "100%", padding: "18px",
            background: "rgba(255,255,255,0.25)",
            backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(255,255,255,0.4)",
            borderRadius: 18, color: "#fff",
            fontSize: 17, fontWeight: 800,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {isLastSlide ? "เริ่มเลย! 🚀" : "ถัดไป →"}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              width: "100%", marginTop: 12,
              background: "none", border: "none",
              color: "rgba(255,255,255,0.5)", fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            ← ย้อนกลับ
          </button>
        )}
      </div>
    </div>
  );
}
