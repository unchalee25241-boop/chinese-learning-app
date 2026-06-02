import { useState, useRef, useEffect } from "react";
import { FREE_MSG_LIMIT } from "../../utils/constants";

interface Props { isPremium: boolean; onUpgrade: () => void; }

export function AIChatbot({ isPremium, onUpgrade }: Props) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "สวัสดีค่ะ! 你好! 😊\nฉันคือครู AI สอนภาษาจีนค่ะ\n\nถามได้เลยนะคะ เช่น\n- คำว่า 謝謝 แปลว่าอะไร?\n- ช่วยสร้างประโยคตัวอย่าง\n- วรรณยุกต์จีนมีกี่เสียง?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgCount, setMsgCount] = useState(() => {     try { return parseInt(localStorage.getItem("ec_msg_count") ?? "0"); } catch { return 0; }   });
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const send = async () => {
    if (!input.trim() || loading) return;
    if (!isPremium && msgCount >= FREE_MSG_LIMIT) { onUpgrade(); return; }
    const text = input.trim(); setInput("");
    setMessages(p => [...p, { role: "user", content: text }]);
    setMsgCount(c => {       const next = c + 1;       localStorage.setItem("ec_msg_count", String(next));       return next;     }); setLoading(true);
    try {
      const res = await fetch("https://ai-proxy.unchalee25241.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 500, system: "คุณคือครูสอนภาษาจีนสำหรับนักเรียนไทย ตอบเป็นภาษาไทยเสมอ แสดงตัวอักษรจีน จู้อิน พินอิน และคำแปลไทยในคำตอบ ใช้ emoji ให้สนุก ตอบกระชับ 3-4 ประโยค", messages: messages.slice(1).concat([{ role: "user", content: text }]).map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.content?.[0]?.text || "Error: " + JSON.stringify(data) }]);
    } catch(err: any) { setMessages(p => [...p, { role: "assistant", content: "Error: " + err.message }]); }
    finally { setLoading(false); }
  };
  const quickQ = ["วรรณยุกต์ 4 เสียง", "ทักทายพื้นฐาน 5 ประโยค", "คำว่า 愛 ใช้ยังไง"];
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {!isPremium && (
        <div style={{ margin: "12px 16px 0", padding: "10px 14px", background: "#1E1E30", borderRadius: 12, border: "1.5px solid #F5A62344", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>ใช้ได้ฟรี {Math.max(0, FREE_MSG_LIMIT - msgCount)}/{FREE_MSG_LIMIT} ครั้ง</span>
          <button onClick={onUpgrade} style={{ background: "#F5A623", color: "#fff", border: "none", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>👑 Premium</button>
        </div>
      )}
      <div style={{ padding: "10px 16px 0", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {quickQ.map((q, i) => <button key={i} onClick={() => setInput(q)} style={{ padding: "5px 10px", borderRadius: 999, background: "#1E1E30", border: "1.5px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>{q}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 6 }}>
            {m.role === "assistant" && <span style={{ fontSize: 24 }}>🤖</span>}
            <div style={{ maxWidth: "78%", padding: "11px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: m.role === "user" ? "#E8433A" : "#1E1E30", color: "#fff", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", border: m.role === "assistant" ? "1.5px solid rgba(255,255,255,0.08)" : "none" }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
            <span style={{ fontSize: 24 }}>🤖</span>
            <div style={{ padding: "11px 16px", borderRadius: "18px 18px 18px 4px", background: "#1E1E30", border: "1.5px solid rgba(255,255,255,0.08)" }}>
              {[0,1,2].map(i => <span key={i} style={{ display: "inline-block", width: 6, height: 6, background: "rgba(255,255,255,0.3)", borderRadius: "50%", margin: "0 2px", animation: `bounce 0.9s ${i*0.2}s infinite ease-in-out` }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "10px 14px", borderTop: "1.5px solid rgba(255,255,255,0.08)", display: "flex", gap: 8, background: "#12121E" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={!isPremium && msgCount >= FREE_MSG_LIMIT ? "อัปเกรดเพื่อคุยต่อ..." : "ถามครู AI ได้เลยค่ะ..."} disabled={!isPremium && msgCount >= FREE_MSG_LIMIT}
          style={{ flex: 1, padding: "11px 14px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.1)", fontSize: 13, outline: "none", fontFamily: "inherit", background: "#1E1E30", color: "#fff" }} />
        <button onClick={send} disabled={loading || !input.trim()} style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() ? "#E8433A" : "#1E1E30", border: "none", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
    </div>
  );
}
