export function LockBadge({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div onClick={onUpgrade} style={{ background: "#1E1E30", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, border: "2px dashed rgba(255,255,255,0.15)", cursor: "pointer", marginBottom: 10 }}>
      <div style={{ fontSize: 28 }}>🔒</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>คำศัพท์ Premium</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>อัปเกรดเพื่อดูทั้งหมด</div>
      </div>
      <div style={{ background: "#F5A623", color: "#fff", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700 }}>👑 อัปเกรด</div>
    </div>
  );
}
