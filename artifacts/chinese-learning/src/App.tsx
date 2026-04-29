import { useState } from "react"; import { useAuth } from "./hooks/useAuth"; import { AuthModal } from "./components/auth/AuthModal";
import { categories } from "./data/vocabulary";
import { useStreak } from "./hooks/useStreak";
import { FREE_WORD_LIMIT, FREE_MSG_LIMIT } from "./utils/constants";
import { VocabList } from "./components/home/VocabList";
import { FlashcardGame } from "./components/games/FlashcardGame";
import { MatchingGame } from "./components/games/MatchingGame";
import { QuizGame } from "./components/games/QuizGame";
import { AIChatbot } from "./components/chat/AIChatbot";
import { PremiumModal } from "./components/modals/PremiumModal";
import { useMode } from "./hooks/useMode";
import { ModeToggle } from "./components/shared/ModeToggle";
import { BottomNav } from "./components/shared/BottomNav";
import { PageTransition } from "./components/shared/PageTransition";
import { useProgress } from "./hooks/useProgress"; import { StatsScreen } from "./components/home/StatsScreen";

const dark = {
  bg: "#12121E", card: "#1E1E30", surface: "#252538",
  text: "#FFFFFF", subtext: "rgba(255,255,255,0.55)", border: "rgba(255,255,255,0.08)",
};

export default function App() {
  const [screen, setScreen] = useState("home");
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [catTab, setCatTab] = useState("vocab");
  const [isPremium, setIsPremium] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading } = useAuth();   const [showAuth, setShowAuth] = useState(false);   const { streak, markStudied } = useStreak();
  const { mode, toggleMode } = useMode();
  const { markWord, getCount, getTotalStudied, getMasteryStats, setMasteryLevel } = useProgress();

  const cat = categories.find(c => c.id === activeCat);

  const navigate = (s: string) => {
    if (s === "category") {
      if (!activeCat) setActiveCat(categories[0].id);
    }
    setScreen(s);
  };

  const searchResults = searchQuery.trim().length > 0
    ? categories.flatMap(c =>
        c.words
          .filter(w =>
            w.th.toLowerCase().includes(searchQuery.toLowerCase()) ||
            w.zh.includes(searchQuery) ||
            (w.zhCN ?? "").includes(searchQuery)
          )
          .map(w => ({ word: w, cat: c }))
      )
    : [];

  // Shared top header
  const TopHeader = ({ title, gradient }: { title: React.ReactNode; gradient: string }) => (
    <div style={{
      background: gradient,
      padding: "44px 16px 20px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 10,
      }}>
        <div style={{ flex: 1 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            background: "rgba(255,255,255,0.2)", borderRadius: 999,
            padding: "5px 14px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <span>🔥</span>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
              {streak.currentStreak}
            </span>
          </div>
        </div>
      </div>
      <ModeToggle mode={mode} onToggle={toggleMode} />
    </div>
  );

    if (loading) return (
    <div style={{ minHeight: "100vh", background: dark.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#fff", fontSize: 24 }}>🀄</div>
    </div>
  );

  if (!user) return <AuthModal onClose={() => {}} />;

  return (
    <div style={{
      minHeight: "100vh", background: dark.bg,
      fontFamily: "'Noto Sans TC','Noto Sans Thai',sans-serif",
      paddingBottom: 70,
    }}>


     <PageTransition screen={screen}>
       {/* HOME */}
      {screen === "home" && (
        <div>
          <TopHeader
            gradient="linear-gradient(135deg,#E8433A,#F5A623)"
            title={
              <div>
                <div style={{ fontSize: 40, marginBottom: 4 }}>🀄</div>
                <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 900, margin: "0 0 2px" }}>
                  เรียนภาษาจีน
                </h1>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, margin: 0 }}>
                  有声音 • มีเสียง • มี AI ครู
                </p>
              </div>
            }
          />

          <div style={{ padding: "16px 16px 32px" }}>
            {/* Streak Card */}
            <div className="streak-card" style={{
              background: "linear-gradient(135deg,#27AE60,#2ECC71)",
              borderRadius: 20, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 14,
              marginBottom: 18, boxShadow: "0 4px 20px rgba(39,174,96,0.35)",
            }}>
              <span style={{ fontSize: 34 }}>🔥</span>
              <div>
                <div style={{ color: "#fff", fontSize: 26, fontWeight: 900, lineHeight: 1 }}>
                  {streak.currentStreak}{" "}
                  <span style={{ fontSize: 15, fontWeight: 600 }}>วันติดต่อกัน</span>
                </div>
                {!streak.studiedToday
                  ? <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, marginTop: 3 }}>เรียนวันนี้เพื่อรักษา streak!</div>
                  : <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 3 }}>✅ เรียนแล้ววันนี้</div>
                }
              </div>
            </div>

            {/* Search Bar */}
            <div style={{ position: "relative", marginBottom: 18 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 18, pointerEvents: "none" }}>🔍</span>
              <input
                type="text"
                placeholder="ค้นหาคำศัพท์ภาษาไทยหรือจีน..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: dark.card, border: `1.5px solid ${searchQuery ? "#E8433A" : dark.border}`,
                  borderRadius: 16, padding: "13px 16px 13px 44px",
                  color: dark.text, fontSize: 15, fontFamily: "inherit", outline: "none",
                }}
              />
              {searchQuery.length > 0 && (
                <button onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%",
                    width: 26, height: 26, color: "#fff", cursor: "pointer", fontSize: 14,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>✕</button>
              )}
            </div>

            {/* Search Results OR Category List */}
            {searchQuery.trim().length > 0 ? (
              <div>
                <div style={{ color: dark.subtext, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                  ผลลัพธ์ {searchResults.length} คำ
                </div>
                {searchResults.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 20px", color: dark.subtext }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: dark.text }}>ไม่พบคำศัพท์</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>ลองค้นหาด้วยคำอื่น</div>
                  </div>
                ) : (
                  searchResults.map(({ word: w, cat: c }, i) => (
                    <div key={i}
                      style={{
                        background: `linear-gradient(135deg, ${c.color}22, ${c.color}11)`,
                        borderRadius: 16, padding: "14px 16px",
                        border: `1.5px solid ${c.color}55`, marginBottom: 10, cursor: "pointer",
                      }}
                      onClick={() => { setActiveCat(c.id); setCatTab("vocab"); setScreen("category"); setSearchQuery(""); }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{c.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 26, fontWeight: 900, color: "#fff" }}>
                            {mode === "cn" ? (w.zhCN ?? w.zhSimplified ?? w.zh) : w.zh}
                          </div>
                          <div style={{ fontSize: 11, color: c.color + "cc" }}>
                            {mode === "cn" ? (w.pinyinCN ?? w.pinyin) : `${w.zhuyin} • ${w.pinyin}`}
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>{w.th}</div>
                        </div>
                        <span style={{ background: c.color + "44", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>{c.label}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div>
                <div style={{ color: dark.subtext, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>หมวดคำศัพท์</div>
                {categories.map(c => (
                  <button key={c.id}
                    className="cat-card" onClick={() => { setActiveCat(c.id); setCatTab("vocab"); setScreen("category"); }}
                    style={{
                      width: "100%", background: c.color, borderRadius: 20,
                      padding: "18px 18px", display: "flex", alignItems: "center",
                      gap: 14, cursor: "pointer", textAlign: "left", marginBottom: 12,
                      border: "none", position: "relative", overflow: "hidden",
                      boxShadow: `0 4px 16px ${c.color}55`,
                    }}>
                    <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", fontSize: 64, fontWeight: 900, color: "rgba(255,255,255,0.15)", lineHeight: 1, pointerEvents: "none" }}>
                      {c.words[0]?.zh ?? "字"}
                    </div>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>{c.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{c.label}</div>
                      <div style={{ marginTop: 4 }}>
                        <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>ฟรี {Math.min(FREE_WORD_LIMIT, c.words.length)} คำ</span>
                        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginLeft: 6 }}>/ ทั้งหมด {c.words.length} คำ</span>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>เรียนแล้ว</span>
                          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>{getCount(c.id)}/{c.words.length}</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: 999, height: 5, overflow: "hidden" }}>
                          <div style={{ height: "100%", borderRadius: 999, background: "rgba(255,255,255,0.9)", width: `${Math.min(100, (getCount(c.id) / c.words.length) * 100)}%`, transition: "width 0.4s ease" }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0 }}>›</div>
                  </button>
                ))}
              </div>
            )}

            {/* AI Chat Button */}
            <button onClick={() => setScreen("chat")}
              style={{
                width: "100%", background: "linear-gradient(135deg,#6C3AE8,#E8433A)",
                borderRadius: 20, padding: "18px 18px", display: "flex",
                alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left",
                border: "none", position: "relative", overflow: "hidden",
                boxShadow: "0 4px 20px rgba(108,58,232,0.4)",
              }}>
              <div style={{ position: "absolute", right: 48, top: "50%", transform: "translateY(-50%)", fontSize: 64, color: "rgba(255,255,255,0.12)", lineHeight: 1 }}>✦</div>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>ถาม AI ครู</div>
                  <span style={{ background: "#FF6B8A", color: "#fff", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>NEW</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 3 }}>
                  {isPremium ? "ถามได้ไม่จำกัด" : `ฟรี ${FREE_MSG_LIMIT} ครั้ง · ตอบทันที`}
                </div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, flexShrink: 0 }}>›</div>
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY */}
      {screen === "category" && cat && (
        <div>
          <div style={{
            background: `linear-gradient(135deg,${cat.color},${cat.color}cc)`,
            padding: "44px 16px 16px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 900, margin: 0 }}>
                {cat.emoji} {cat.label}
              </h2>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔥</span><span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{streak.currentStreak}</span>
              </div>
            </div>
            <ModeToggle mode={mode} onToggle={toggleMode} />
          </div>

          <div style={{ display: "flex", margin: "8px 16px 0", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}>
            {[
              { id: "vocab", label: "📖", title: "คำศัพท์" },
              { id: "flashcard", label: "🃏", title: "Flashcard" },
              { id: "match", label: "🎯", title: "จับคู่" },
              { id: "quiz", label: "❓", title: "Quiz" },
            ].map(t => (
              <button key={t.id} onClick={() => setCatTab(t.id)}
                style={{
                  flex: 1, padding: "12px 4px", border: "none",
                  background: catTab === t.id ? cat.color : dark.card,
                  color: catTab === t.id ? "#fff" : dark.subtext,
                  fontWeight: 700, fontSize: 11, cursor: "pointer",
                  fontFamily: "inherit", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 2,
                }}>
                <span style={{ fontSize: 16 }}>{t.label}</span>
                <span>{t.title}</span>
              </button>
            ))}
          </div>

          <div style={{ padding: "16px" }}>
            {catTab === "vocab" && <VocabList words={cat.words} isPremium={isPremium} color={cat.color} onUpgrade={() => setShowPremium(true)} mode={mode} onView={(word) => markWord(cat.id, word)} />}
            {catTab === "flashcard" && <FlashcardGame key={cat.id} words={isPremium ? cat.words : cat.words.slice(0, FREE_WORD_LIMIT)} color={cat.color} onStudied={markStudied} mode={mode} onMastery={(word, level) => setMasteryLevel(word, level)} />}
            {catTab === "match" && <MatchingGame key={cat.id} words={isPremium ? cat.words : cat.words.slice(0, FREE_WORD_LIMIT)} color={cat.color} mode={mode} />}
            {catTab === "quiz" && <QuizGame key={cat.id} words={isPremium ? cat.words : cat.words.slice(0, FREE_WORD_LIMIT)} color={cat.color} mode={mode} onMastery={(word, level) => setMasteryLevel(word, level)} />}
            {!isPremium && catTab !== "vocab" && cat.words.length > FREE_WORD_LIMIT && (
              <div onClick={() => setShowPremium(true)}
                style={{ marginTop: 16, padding: "14px", background: dark.surface, borderRadius: 16, border: "1.5px dashed #F5A623", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>👑 อัปเกรดเพื่อเล่นกับคำศัพท์ครบทุกคำ</div>
              </div>
            )}
          </div>
        </div>
      )}

            {/* STATS */}
      {screen === "stats" && (
        <StatsScreen onClose={() => setScreen("home")} />
      )}

      {/* CHAT */}
      {screen === "chat" && (

        <div style={{ height: "calc(100vh - 70px)", display: "flex", flexDirection: "column" }}>
          <div style={{ background: "linear-gradient(135deg,#6C3AE8,#E8433A)", padding: "44px 16px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 30 }}>🤖</span>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 17 }}>ครู AI ภาษาจีน</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>ถามได้ทุกเรื่องภาษาจีน</div>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "5px 14px", display: "flex", alignItems: "center", gap: 6 }}>
                <span>🔥</span><span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{streak.currentStreak}</span>
              </div>
            </div>
            <ModeToggle mode={mode} onToggle={toggleMode} />
          </div>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <AIChatbot isPremium={isPremium} onUpgrade={() => setShowPremium(true)} />
          </div>
        </div>
      )}
      </PageTransition>
      {/* Bottom Nav */}
       <BottomNav
        screen={screen}
        onNavigate={navigate}
        isPremium={isPremium}
        onUpgrade={() => setShowPremium(true)}
      />

      {showAuth && (         <AuthModal onClose={() => setShowAuth(false)} />       )}        {showPremium && (
        <PremiumModal
          onClose={() => setShowPremium(false)}
          onUpgrade={() => { setIsPremium(true); setShowPremium(false); }}
        />
      )}
    </div>
  );
}
