import { useState, useCallback } from "react";

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
  const markStudied = useCallback(() => {
    setStreak(prev => {
      if (prev.studiedToday) return prev;
      const today = getTodayISO(); const yesterday = getYesterdayISO();
      const cont = prev.lastStudyDate === yesterday || prev.lastStudyDate === today;
      const n = cont ? prev.currentStreak + 1 : 1;
      const updated = {...prev, currentStreak: n, longestStreak: Math.max(n, prev.longestStreak), lastStudyDate: today, studiedToday: true};
      localStorage.setItem("ec_streak", JSON.stringify(updated));
      return updated;
    });
  }, []);
  return { streak, markStudied };
}
