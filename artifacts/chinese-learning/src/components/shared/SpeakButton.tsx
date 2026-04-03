import { useState } from "react";

interface Props { text: string; color: string; lang?: string; }

export function SpeakButton({ text, color, lang = "zh-TW" }: Props) {
  const [active, setActive] = useState(false);
  const speak = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };
  return (
    <button onClick={() => { setActive(true); speak(); setTimeout(() => setActive(false), 1200); }}
      style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${color}`, background: active ? color : `${color}18`, fontSize: 20, cursor: "pointer", transition: "all 0.2s", transform: active ? "scale(1.15)" : "scale(1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {active ? "🔊" : "🔈"}
    </button>
  );
}
