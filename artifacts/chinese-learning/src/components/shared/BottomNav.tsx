interface Props {
  screen: string;
  onNavigate: (s: string) => void;
  isPremium: boolean;
  onUpgrade: () => void;
}

const tabs = [
  { id: "home", label: "หน้าหลัก", icon: "🏠" },
  { id: "category", label: "หมวด", icon: "📚" },
  { id: "chat", label: "AI ครู", icon: "🤖" },
  { id: "premium", label: "Premium", icon: "👑" },
];

export function BottomNav({ screen, onNavigate, isPremium, onUpgrade }: Props) {
  const active = (id: string) =>
    id === "category"
      ? screen === "category"
      : screen === id;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "#1E1E30",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      display: "flex",
      paddingBottom: "env(safe-area-inset-bottom)",
      zIndex: 100,
    }}>
      {tabs.map(t => {
        const isActive = active(t.id);
        const isPremiumTab = t.id === "premium";
        return (
          <button
            key={t.id}
            onClick={() => isPremiumTab ? onUpgrade() : onNavigate(t.id)}
            style={{
              flex: 1, border: "none", background: "transparent",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: "10px 0 8px", cursor: "pointer",
              gap: 3,
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{t.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: isActive ? "#E8433A" : "rgba(255,255,255,0.4)",
              fontFamily: "'Noto Sans Thai', sans-serif",
              transition: "color 0.2s",
            }}>
              {isPremiumTab && isPremium ? "Member" : t.label}
            </span>
            {isActive && (
              <div style={{
                position: "absolute", bottom: "env(safe-area-inset-bottom)",
                width: 32, height: 3, borderRadius: 999,
                background: "#E8433A",
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
