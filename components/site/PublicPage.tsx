"use client";

import { useEffect, useMemo, useState } from "react";

import { PublicPuckRender } from "@/puck/config";
import type { NECYPAAData } from "@/puck/types";

type Theme = "dark" | "light";
type Scale = "default" | "large" | "largest";

export function PublicPage({ data }: { data: NECYPAAData }) {
  const [theme, setTheme] = useState<Theme>(() => typeof window !== "undefined" && localStorage.getItem("necypaa-theme") === "light" ? "light" : "dark");
  const [scale, setScale] = useState<Scale>(() => {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem("necypaa-text");
    return saved === "large" || saved === "largest" ? saved : "default";
  });
  const [contrast, setContrast] = useState(() => typeof window !== "undefined" && localStorage.getItem("necypaa-contrast") === "true");
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem("necypaa-theme", theme);
    localStorage.setItem("necypaa-text", scale);
    localStorage.setItem("necypaa-contrast", String(contrast));
  }, [theme, scale, contrast]);

  const className = useMemo(() => `cms-site theme-${theme} text-${scale}${contrast ? " high-contrast" : ""}`, [theme, scale, contrast]);
  return (
    <div className={className}>
      <a className="skip-link" href="#cms-main">Skip to main content</a>
      <header className="cms-header">
        <a className="cms-brand" href="#hero"><span>36</span><strong>NECYPAA</strong></a>
        <nav aria-label="Primary navigation"><a href="#about">About</a><a href="#business-meeting">Meetings</a><a href="#events">Events</a><a href="#ypaa">YPAA near you</a></nav>
        <div><a className="cms-hotel" href="https://www.necypaact.com/hotel">Book a hotel room</a><a className="cms-register" href="https://register.necypaact.com/en/register">Register</a></div>
      </header>
      <div id="cms-main"><PublicPuckRender data={data} /></div>
      <button className="display-gear" aria-expanded={settings} aria-label="Display and accessibility settings" onClick={() => setSettings((value) => !value)} type="button">⚙</button>
      {settings ? <aside className="display-panel" aria-label="Display settings"><button aria-label="Close display settings" onClick={() => setSettings(false)} type="button">×</button><h2>Display settings</h2><fieldset><legend>Theme</legend><button aria-pressed={theme === "light"} onClick={() => setTheme("light")} type="button">Light</button><button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} type="button">Dark</button></fieldset><fieldset><legend>Text size</legend><button aria-pressed={scale === "default"} onClick={() => setScale("default")} type="button">A</button><button aria-pressed={scale === "large"} onClick={() => setScale("large")} type="button">A+</button><button aria-pressed={scale === "largest"} onClick={() => setScale("largest")} type="button">A++</button></fieldset><label><input checked={contrast} onChange={(event) => setContrast(event.target.checked)} type="checkbox" /> Extra contrast</label><p>Motion follows your device’s reduced-motion setting.</p></aside> : null}
    </div>
  );
}
