import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useStreak } from "../../hooks/useStreak";
import { useProgress } from "../../hooks/useProgress";
import { categories } from "../../data/vocabulary";

interface Props { onUpgrade: () => void; isPremium: boolean; onLogout: () => void; }

export function ProfileScreen({ onUpgrade, isPremium, onLogout }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { streak } = useStreak();
  const { getTotalStudied, getMasteryStats } = useProgress();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      setName(user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "ผู้เรียน");
    });
  }, []);

  const totalWords = categories.reduce((s, c) => s + c.words.length, 0);
  const totalStudied = getTotalStudied();
  const allWords = categories.flatMap(c => c.words.map(w => w.zh));
  const { unknown, learning, expert } = getMasteryStats(allWords);
  const pct = Math.round((totalStudied / totalWords) * 100);

  const dark = {
    bg: "#12121E", card: "#1E1E30", surface: "#252538",
    subtext: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.08)",
  };

  const initial = name.charAt(0).toUpperCase();

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#E8433A,#F5A623)", padding: "44px 16px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 900, color: "#fff",
            border: "3px solid rgba(255,255,255,0.5)",
            flexShrink: 0,
          }}>{initial}</div>
          <div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 900 }}>{name}</div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, marginTop: 2 }}>{email}</div>
            {isPremium && (
              <div style={{ marginTop: 6, background: "rgba(255,255,255,0.25)", borderRadius: 999, padding: "3px 12px", display: "inline-block", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                👑 Premium Member
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Streak + Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "linear-gradient(135deg,#27AE60,#2ECC71)", borderRadius: 20, padding: "18px 16px", textAlign: "center", boxShadow: "0 4px 16px rgba(39,174,96,0.3)" }}>
            <div style={{ fontSize: 32 }}>🔥</div>
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>{streak.currentStreak}</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>วันติดต่อกัน</div>
          </div>
          <div style={{ background: dark.card, borderRadius: 20, padding: "18px 16px", textAlign: "center", border: `1.5px solid ${dark.border}` }}>
            <div style={{ fontSize: 32 }}>📖</div>
            <div style={{ color: "#fff", fontSize: 28, fontWeight: 900, lineHeight: 1, marginTop: 4 }}>{totalStudied}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 2 }}>จาก {totalWords} คำ</div>
          </div>
        </div>

        {/* Mastery */}
        <div style={{ background: dark.card, borderRadius: 20, padding: "18px", marginBottom: 16, border: `1.5px solid ${dark.border}` }}>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 700, marginBottom: 14 }}>ระดับความเชี่ยวชาญ</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "ยังไม่รู้", count: unknown, color: "rgba(255,255,255,0.3)", emoji: "⚪" },
              { label: "กำลังเรียน", count: learning, color: "#FFD700", emoji: "🟡" },
              { label: "เชี่ยวชาญ", count: expert, color: "#80D980", emoji: "🟢" },
            ].map(m => (
              <div key={m.label} style={{ background: m.color + "22", border: `2px solid ${m.color}`, borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 20 }}>{m.emoji}</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: m.color, margin: "2px 0" }}>{m.count}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* Overall progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>ความก้าวหน้าทั้งหมด</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{pct}%</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 8, overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(90deg,#6C3AE8,#E8433A)", width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>

        {/* Upgrade button if not premium */}
                {!isPremium && (
          <button onClick={onUpgrade} style={{
            width: "100%", background: "linear-gradient(135deg,#F5A623,#E8433A)",
            borderRadius: 20, padding: "16px", border: "none", cursor: "pointer",
            color: "#fff", fontSize: 16, fontWeight: 800, fontFamily: "inherit",
            boxShadow: "0 4px 16px rgba(245,166,35,0.4)", marginBottom: 12,
          }}>
            👑 อัปเกรดเป็น Premium
          </button>
        )}
                {isPremium && (
          <button onClick={async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const res = await fetch("https://ai-proxy.unchalee25241.workers.dev/create-portal-session", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                customerId: localStorage.getItem("ec_stripe_customer_id") ?? "",
                returnUrl: window.location.origin,
              }),

            });
            const portal = await res.json();
            if (portal.url) window.location.href = portal.url;
            else alert("ไม่พบข้อมูล Subscription กรุณาติดต่อ support");
          }} style={{
            width: "100%", background: "linear-gradient(135deg,#6C3AE8,#9B59B6)",
            borderRadius: 20, padding: "14px", border: "none",
            cursor: "pointer", color: "#fff",
            fontSize: 15, fontWeight: 700, fontFamily: "inherit",
            marginBottom: 12,
          }}>
            ⚙️ จัดการ Subscription
          </button>
        )}
        <button onClick={onLogout} style={{
          width: "100%", background: "transparent",
          borderRadius: 20, padding: "14px", border: "1.5px solid rgba(255,255,255,0.15)",
          cursor: "pointer", color: "rgba(255,255,255,0.5)",
          fontSize: 15, fontWeight: 700, fontFamily: "inherit",
        }}>
          ออกจากระบบ
        </button>


      </div>
    </div>
  );
}
