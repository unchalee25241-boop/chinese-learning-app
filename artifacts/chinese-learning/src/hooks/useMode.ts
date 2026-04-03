import { useState } from "react";

export type Mode = "tw" | "cn";

export function useMode() {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem("ec_mode") as Mode) || "tw";
  });
  const toggleMode = (m: Mode) => {
    setMode(m);
    localStorage.setItem("ec_mode", m);
  };
  return { mode, toggleMode };
}
