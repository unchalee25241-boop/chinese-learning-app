import { Mode } from "../../hooks/useMode";

interface Props { mode: Mode; onToggle: (m: Mode) => void; }

export function ModeToggle({ mode, onToggle }: Props) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: 3, gap: 2 }}>
      <button onClick={() => onToggle("tw")} style={{ padding: "5px 12px", borderRadius: 999, border: "none", background: mode === "tw" ? "#fff" : "transparent", color: mode === "tw" ? "#E8433A" : "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
        🇹🇼 ไต้หวัน
      </button>
      <button onClick={() => onToggle("cn")} style={{ padding: "5px 12px", borderRadius: 999, border: "none", background: mode === "cn" ? "#fff" : "transparent", color: mode === "cn" ? "#E8433A" : "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
        🇨🇳 จีน
      </button>
    </div>
  );
}
