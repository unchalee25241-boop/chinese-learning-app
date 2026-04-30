import { useState, useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase";

const STORAGE_KEY = "ec_progress";
const MASTERY_KEY = "ec_mastery";

export type MasteryLevel = 0 | 1 | 2;

function loadProgress(): Record<string, Set<string>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, new Set(v)]));
  } catch { return {}; }
}

function saveProgress(data: Record<string, Set<string>>) {
  const serialized = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, [...v]]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

function loadMastery(): Record<string, MasteryLevel> {
  try {
    const raw = localStorage.getItem(MASTERY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveMastery(data: Record<string, MasteryLevel>) {
  localStorage.setItem(MASTERY_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, Set<string>>>(loadProgress);
  const [mastery, setMastery] = useState<Record<string, MasteryLevel>>(loadMastery);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem("ec_favorites");
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch { return new Set(); }
  });

  useEffect(() => {
    const syncFromSupabase = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_progress")
        .select("category_id, word_id, mastery_level")
        .eq("user_id", user.id);

      if (!data || data.length === 0) return;

      const newProgress: Record<string, Set<string>> = {};
      const newMastery: Record<string, MasteryLevel> = {};

      data.forEach(row => {
        if (!newProgress[row.category_id]) newProgress[row.category_id] = new Set();
        newProgress[row.category_id].add(row.word_id);
        newMastery[row.word_id] = row.mastery_level as MasteryLevel;
      });

      setProgress(newProgress);
      setMastery(newMastery);
      saveProgress(newProgress);
      saveMastery(newMastery);
    };

    syncFromSupabase();
  }, []);

  const markWord = useCallback((catId: string, word: string) => {
    setProgress(prev => {
      const next = { ...prev, [catId]: new Set(prev[catId] ?? []) };
      if (next[catId].has(word)) return prev;
      next[catId].add(word);
      saveProgress(next);

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          alert("❌ No user found!");
          return;
        }
        supabase.from("user_progress").upsert({
          user_id: user.id,
          category_id: catId,
          word_id: word,
          mastery_level: 0,
        }, { onConflict: "user_id,category_id,word_id" }).then(({ error }) => {
          if (error) alert("❌ Error: " + error.message);
          else alert("✅ Saved! user: " + user.id);
        });
      });

      return next;
    });
  }, []);

  const getCount = useCallback((catId: string) => {
    return progress[catId]?.size ?? 0;
  }, [progress]);

  const getTotalStudied = useCallback(() => {
    return Object.values(progress).reduce((sum, s) => sum + s.size, 0);
  }, [progress]);

  const setMasteryLevel = useCallback((word: string, level: MasteryLevel) => {
    setMastery(prev => {
      const next = { ...prev, [word]: level };
      saveMastery(next);

      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;
        supabase.from("user_progress")
          .update({ mastery_level: level })
          .eq("user_id", user.id)
          .eq("word_id", word);
      });

      return next;
    });
  }, []);

  const getMasteryLevel = useCallback((word: string): MasteryLevel => {
    return mastery[word] ?? 0;
  }, [mastery]);

  const getMasteryStats = useCallback((words: string[]) => {
    const unknown = words.filter(w => (mastery[w] ?? 0) === 0).length;
    const learning = words.filter(w => (mastery[w] ?? 0) === 1).length;
    const expert = words.filter(w => (mastery[w] ?? 0) === 2).length;
    return { unknown, learning, expert };
  }, [mastery]);

  const getDailyStats = useCallback(() => {
    try {
      const raw = localStorage.getItem("ec_daily_stats");
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }, []);

  const markDailyStudy = useCallback((count: number) => {
    const today = new Date().toISOString().split("T")[0];
    const stats = (() => { try { return JSON.parse(localStorage.getItem("ec_daily_stats") ?? "{}"); } catch { return {}; } })();
    stats[today] = (stats[today] ?? 0) + count;
    localStorage.setItem("ec_daily_stats", JSON.stringify(stats));
  }, []);

  const toggleFavorite = useCallback((word: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      localStorage.setItem("ec_favorites", JSON.stringify([...next]));
      return next;
    });
  }, []);

  const isFavorite = useCallback((word: string) => {
    return favorites.has(word);
  }, [favorites]);

  return {
    markWord, getCount, getTotalStudied,
    setMasteryLevel, getMasteryLevel, getMasteryStats,
    getDailyStats, markDailyStudy,
    toggleFavorite, isFavorite, favorites,
    progress, mastery,
  };
}
