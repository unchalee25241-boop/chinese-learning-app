import { FREE_WORD_LIMIT } from "../../utils/constants";
import { SpeakButton } from "../shared/SpeakButton";
import { LockBadge } from "../shared/LockBadge";
import { Mode } from "../../hooks/useMode";

interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; th: string; }

interface Props { words: Word[]; isPremium: boolean; color: string; onUpgrade: () => void; mode: Mode; }

export function VocabList({ words, isPremium, color, onUpgrade, mode }: Props) {
  const visible = isPremium ? words : words.slice(0, FREE_WORD_LIMIT);
  const locked = isPremium ? [] : words.slice(FREE_WORD_LIMIT);
  return (
    <div>
      {visible.map((w, i) => (
        <div key={i} style={{ background: "#1E1E30", borderRadius: 18, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, border: `1.5px solid ${color}33`, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>
              {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
 </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
              {mode === "cn" ? w.pinyin : `${w.zhuyin} • ${w.pinyin}`}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>{w.th}</div>
          </div>
          <SpeakButton text={mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}

        </div>
      ))}
      {locked.map((_, i) => <LockBadge key={i} onUpgrade={onUpgrade} />)}
    </div>
  );
}
