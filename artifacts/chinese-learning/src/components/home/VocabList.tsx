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
        <div key={i} style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)`, borderRadius: 18, padding: "16px 16px", display: "flex", alignItems: "center", gap: 14, border: `2px solid ${color}66`, marginBottom: 10, position: "relative", overflow: "hidden" }}>
          {/* ตัวจีนใหญ่โปร่งใสด้านหลัง */}
          <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", fontSize: 56, fontWeight: 900, color: `${color}20`, lineHeight: 1, pointerEvents: "none" }}>
            {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
          </div>
          <div style={{ flex: 1, zIndex: 1 }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>
              {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
            </div>
            <div style={{ fontSize: 12, color: `${color}cc`, marginTop: 2 }}>
              {mode === "cn" ? (w.pinyinCN ?? w.pinyin) : `${w.zhuyin} • ${w.pinyin}`}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>{w.th}</div>
          </div>
          <div style={{ zIndex: 1 }}>
            <SpeakButton text={mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh} color={color} lang={mode === "cn" ? "zh-CN" : "zh-TW"} />
          </div>
        </div>
      ))}
      {locked.map((_, i) => <LockBadge key={i} onUpgrade={onUpgrade} />)}
    </div>
  );
}
