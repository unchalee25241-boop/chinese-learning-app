import { useEffect, useState, ReactNode } from "react";

interface Props {
  screen: string;
  children: ReactNode;
}

export function PageTransition({ screen, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [displayScreen, setDisplayScreen] = useState(screen);
  const [content, setContent] = useState(children);

  useEffect(() => {
    if (screen === displayScreen) {
      setVisible(true);
      return;
    }
    // Fade out
    setVisible(false);
    const t = setTimeout(() => {
      setDisplayScreen(screen);
      setContent(children);
      setVisible(true);
    }, 180);
    return () => clearTimeout(t);
  }, [screen]);

  // Update content when same screen re-renders
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
