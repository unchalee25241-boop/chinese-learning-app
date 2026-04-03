import { Mode } from "../../hooks/useMode";

interface Props { mode: Mode; onToggle: (m: Mode) => void; }

export function ModeToggle({ mode, onToggle }: Props) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: 4, gap: 4 }}>
      <button onClick={() => onToggle("tw")} style={{ padding: "8px 20px", borderRadius: 999, border: "none", background: mode === "tw" ? "#fff" : "transparent", color: mode === "tw" ? "#E8433A" : "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
        🇹🇼 ไต้หวัน
      </button>
      <button onClick={() => onToggle("cn")} style={{ padding: "8px 20px", borderRadius: 999, border: "none", background: mode === "cn" ? "#fff" : "transparent", color: mode === "cn" ? "#E8433A" : "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.2s" }}>
        🇨🇳 จีน
      </button>
    </div>
  );
}
