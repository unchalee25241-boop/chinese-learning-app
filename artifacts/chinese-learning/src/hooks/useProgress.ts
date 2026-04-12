import { useState, useCallback } from "react";

const STORAGE_KEY = "ec_progress";

function loadProgress(): Record<string, Set<string>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    return Object.fromEntries(Object.entries(parsed).map(([k, v]) => [k, new Set(v)]));
  } catch {
    return {};
  }
}

function saveProgress(data: Record<string, Set<string>>) {
  const serialized = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, [...v]]));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, Set<string>>>(loadProgress);

  const markWord = useCallback((catId: string, word: string) => {
    setProgress(prev => {
      const next = { ...prev, [catId]: new Set(prev[catId] ?? []) };
      if (next[catId].has(word)) return prev;
      next[catId].add(word);
      saveProgress(next);
      return next;
    });
  }, []);

  const getCount = useCallback((catId: string) => {
    return progress[catId]?.size ?? 0;
  }, [progress]);

  return { markWord, getCount };
}
