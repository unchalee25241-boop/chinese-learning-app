import { useState, useCallback, useEffect } from "react";
import { supabase } from "../lib/supabase";

function getTodayISO() { return new Date().toISOString().split("T")[0]; }
function getYesterdayISO() { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split("T")[0]; }

function loadStreak() {
  try { const r = localStorage.getItem("ec_streak"); return r ? JSON.parse(r) : {currentStreak:0,longestStreak:0,lastStudyDate:null,studiedToday:false}; }
  catch { return {currentStreak:0,longestStreak:0,lastStudyDate:null,studiedToday:false}; }
}

export function useStreak() {
  const [streak, setStreak] = useState(() => {
    const d = loadStreak(); const today = getTodayISO(); const yesterday = getYesterdayISO();
    if (!d.lastStudyDate) return d;
    if (d.lastStudyDate === today) return {...d, studiedToday: true};
    if (d.lastStudyDate === yesterday) return {...d, studiedToday: false};
    return {...d, currentStreak: 0, studiedToday: false};
  });

  // Sync from Supabase on mount
  useEffect(() => {
    const syncFromSupabase = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("user_streak")
        .select("current_streak, last_studied")
        .eq("user_id", user.id)
        .single();

      if (!data) return;

      const today = getTodayISO();
      const yesterday = getYesterdayISO();
      const lastStudied = data.last_studied;

      let currentStreak = data.current_streak;
      let studiedToday = false;

      if (lastStudied === today) studiedToday = true;
      else if (lastStudied !== yesterday) currentStreak = 0;

      const updated = { currentStreak, longestStreak: currentStreak, lastStudyDate: lastStudied, studiedToday };
      setStreak(updated);
      localStorage.setItem("ec_streak", JSON.stringify(updated));
    };

    syncFromSupabase();
  }, []);

  const markStudied = useCallback(() => {
    setStreak(prev => {
      if (prev.studiedToday) return prev;
      const today = getTodayISO(); const yesterday = getYesterdayISO();
      const cont = prev.lastStudyDate === yesterday || prev.lastStudyDate === today;
      const n = cont ? prev.currentStreak + 1 : 1;
      const updated = {...prev, currentStreak: n, longestStreak: Math.max(n, prev.longestStreak), lastStudyDate: today, studiedToday: true};
      localStorage.setItem("ec_streak", JSON.stringify(updated));

      // Sync to Supabase
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) return;
        supabase.from("user_streak").upsert({
          user_id: user.id,
          current_streak: n,
          last_studied: today,
        }, { onConflict: "user_id" });
      });

      return updated;
    });
  }, []);

  return { streak, markStudied };
}
