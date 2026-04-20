import { useEffect, useState, ReactNode } from "react";

interface Props {
  screen: string;
  children: ReactNode;
}

const css = `
@keyframes navPulse {
  0% { transform: scaleX(0); opacity: 0; }
  100% { transform: scaleX(1); opacity: 1; }
}
@keyframes streakPulse {
  0%   { box-shadow: 0 4px 20px rgba(39,174,96,0.35); }
  50%  { box-shadow: 0 4px 32px rgba(39,174,96,0.7), 0 0 0 6px rgba(39,174,96,0.15); }
  100% { box-shadow: 0 4px 20px rgba(39,174,96,0.35); }
}
@keyframes cardBounce {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.96); }
  100% { transform: scale(1); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.streak-card {
  animation: streakPulse 2.5s ease-in-out infinite;
}
.cat-card:active {
  animation: cardBounce 0.2s ease;
}
`;

export function PageTransition({ screen, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [displayScreen, setDisplayScreen] = useState(screen);
  const [content, setContent] = useState(children);

  useEffect(() => {
    // inject CSS once
    if (!document.getElementById("app-animations")) {
      const style = document.createElement("style");
      style.id = "app-animations";
      style.textContent = css;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (screen === displayScreen) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayScreen(screen);
      setContent(children);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [screen]);

  useEffect(() => {
    if (screen === displayScreen) setContent(children);
  }, [children]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0px)" : "translateY(10px)",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    }}>
      {content}
    </div>
  );
}
