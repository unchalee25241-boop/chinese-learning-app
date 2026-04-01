import { useState } from "react";
import { speakChinese } from "../../utils/speech";

interface Props { text: string; color: string; }

export function SpeakButton({ text, color }: Props) {
  const [active, setActive] = useState(false);
  return (
    <button onClick={() => { setActive(true); speakChinese(text); setTimeout(() => setActive(false), 1200); }}
      style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${color}`, background: active ? color : `${color}18`, fontSize: 20, cursor: "pointer", transition: "all 0.2s", transform: active ? "scale(1.15)" : "scale(1)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {active ? "🔊" : "🔈"}
    </button>
  );
}
