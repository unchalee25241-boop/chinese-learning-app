import { useState } from "react";
import { supabase } from "../../lib/supabase";

interface Props { onClose: () => void; onUpgrade: () => void; }

const WORKER_URL = "https://ai-proxy.unchalee25241.workers.dev";
const PRICES = {
  monthly: { id: "price_1TV8tQGazoGTjdpYmSBmBfNC", mode: "subscription" },
  yearly:  { id: "price_1TV8uUGazoGTjdpYMUk00W4T", mode: "subscription" },
  lifetime:{ id: "price_1TV8xFGazoGTjdpYRUrqrc63", mode: "lifetime" },
};

export function PremiumModal({ onClose, onUpgrade }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: keyof typeof PRICES) => {
    setLoading(plan);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const price = PRICES[plan];
      const origin = window.location.origin;

      const res = await fetch(`${WORKER_URL}/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: price.id,
          mode: price.mode,
          userId: user?.id ?? "",
          userEmail: user?.email ?? "",
          successUrl: `${origin}?premium=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}?premium=cancel`,
        }),
      });

      const session = await res.json();
      if (session.url) {
        window.location.href = session.url;
      } else {
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#1E1E30", borderRadius: "24px 24px 0 0", padding: "28px 24px 40px", width: "100%", maxWidth: 480, border: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48 }}>👑</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "8px 0 4px" }}>Premium</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>ปลดล็อคทุกฟีเจอร์</p>
        </div>
        {[["📚","คำศัพท์ครบ 480+ คำ"],["🔊","เสียงออกเสียงไม่จำกัด"],["🤖","ถาม AI ครูได้ไม่จำกัด"],["🎮","เกมทุกโหมดไม่จำกัด"],["📊","ติดตาม Streak รายวัน"]].map(([icon, text], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <span style={{ fontSize: 15, color: "#fff", fontWeight: 600 }}>{text}</span>
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          <button onClick={() => handleCheckout("monthly")} disabled={!!loading}
            style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "linear-gradient(135deg,#E8433A,#F5A623)", color: "#fff", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: loading === "monthly" ? 0.7 : 1 }}>
            <div style={{ textAlign: "left" }}><div>📅 รายเดือน</div><div style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>ยกเลิกได้ทุกเมื่อ</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 22 }}>{loading === "monthly" ? "..." : "99 บาท"}</div><div style={{ fontSize: 11, opacity: 0.85 }}>/เดือน</div></div>
          </button>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: -10, right: 16, background: "#4ECDC4", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 700, zIndex: 1 }}>⭐ แนะนำ ประหยัด 34%</div>
            <button onClick={() => handleCheckout("yearly")} disabled={!!loading}
              style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "#252538", border: "3px solid #4ECDC4", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: loading === "yearly" ? 0.7 : 1 }}>
              <div style={{ textAlign: "left" }}><div>📆 รายปี</div><div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>เทียบเท่า 66 บาท/เดือน</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 22, color: "#4ECDC4" }}>{loading === "yearly" ? "..." : "790 บาท"}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>/ปี</div></div>
            </button>
          </div>
          <button onClick={() => handleCheckout("lifetime")} disabled={!!loading}
            style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "#252538", border: "2px solid #F5A623", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", opacity: loading === "lifetime" ? 0.7 : 1 }}>
            <div style={{ textAlign: "left" }}><div>♾️ ตลอดชีพ</div><div style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)" }}>จ่ายครั้งเดียว ใช้ได้เลย</div></div>
            <div style={{ textAlign: "right" }}><div style={{ fontSize: 22, color: "#F5A623" }}>{loading === "lifetime" ? "..." : "1,490 บาท"}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>ครั้งเดียว</div></div>
          </button>
        </div>
        <button onClick={onClose} style={{ width: "100%", marginTop: 12, padding: "12px", borderRadius: 16, background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 14, cursor: "pointer" }}>ใช้ฟรีก่อน</button>
      </div>
    </div>
  );
}
