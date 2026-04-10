import { useState } from "react";
import { FREE_WORD_LIMIT } from "../../utils/constants";
import { SpeakButton } from "../shared/SpeakButton";
import { LockBadge } from "../shared/LockBadge";
import { Mode } from "../../hooks/useMode";

interface Example { zh: string; zhuyin: string; pinyin: string; th: string; }
interface Word { zh: string; zhSimplified?: string; zhCN?: string; zhuyin: string; pinyin: string; pinyinCN?: string; th: string; examples?: Example[]; }
interface Props { words: Word[]; isPremium: boolean; color: string; onUpgrade: () => void; mode: Mode; }

export function VocabList({ words, isPremium, color, onUpgrade, mode }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const visible = isPremium ? words : words.slice(0, FREE_WORD_LIMIT);
  const locked = isPremium ? [] : words.slice(FREE_WORD_LIMIT);
  return (
    <div>
      {visible.map((w, i) => (
        <div key={i} style={{ background: `linear-gradient(135deg, ${color}22, ${color}11)`, borderRadius: 18, padding: "16px 16px", border: `2px solid ${color}66`, marginBottom: 10, position: "relative", overflow: "hidden" }}>
          {/* ตัวจีนใหญ่โปร่งใสด้านหลัง */}
          <div style={{ position: "absolute", right: 60, top: "50%", transform: "translateY(-50%)", fontSize: 56, fontWeight: 900, color: `${color}20`, lineHeight: 1, pointerEvents: "none" }}>
            {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, zIndex: 1 }}>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#fff" }}>
                {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
              </div>
              <div style={{ fontSize: 12, color: `${color}cc`, marginTop: 2 }}>
                {mode === "cn" ? (w.pinyinCN ?? w.pinyin) : `${w.zhuyin} • ${w.pinyin}`}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 4 }}>{w.th}</div>
            </div>
            <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <SpeakButton text={mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh} color={color} lang={mode === "cn" ? "zh-CN" : "zh-TW"} />
              
            </div>
          </div>
                    {w.examples && w.examples.length > 0 && (
            <div style={{ marginTop: 12, borderTop: `1px solid ${color}55`, paddingTop: 10, zIndex: 1, position: "relative" }}>
              {w.examples.map((ex, j) => (
                <div key={j} style={{ marginBottom: 8, background: `${color}22`, borderRadius: 10, padding: "8px 10px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{mode === "cn" ? (ex.zhCN ?? ex.zh) : ex.zh}</div>
                  <div style={{ fontSize: 11, color: `${color}ee` }}>{mode === "cn" ? (ex.pinyinCN ?? ex.pinyin) : `${ex.zhuyin} • ${ex.pinyin}`}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>{ex.th}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      {locked.map((_, i) => <LockBadge key={i} onUpgrade={onUpgrade} />)}
    </div>
  );
}
