"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { CartLink } from "./CartLink";

type Theme = "dark" | "light";
type Scale = "default" | "large" | "largest";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Meetings", href: "/#business-meeting" },
  { label: "Events", href: "/#events" },
  { label: "YPAA near you", href: "/#ypaa" },
  { label: "Merch", href: "/merch" },
];

export function SiteFrame({ children, mainId }: { children: React.ReactNode; mainId: string }) {
  const [theme, setTheme] = useState<Theme>(() => typeof window !== "undefined" && localStorage.getItem("necypaa-theme") === "light" ? "light" : "dark");
  const [scale, setScale] = useState<Scale>(() => {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem("necypaa-text");
    return saved === "large" || saved === "largest" ? saved : "default";
  });
  const [contrast, setContrast] = useState(() => typeof window !== "undefined" && localStorage.getItem("necypaa-contrast") === "true");
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("necypaa-theme", theme);
    localStorage.setItem("necypaa-text", scale);
    localStorage.setItem("necypaa-contrast", String(contrast));
  }, [theme, scale, contrast]);

  const className = useMemo(() => `cms-site theme-${theme} text-${scale}${contrast ? " high-contrast" : ""}`, [theme, scale, contrast]);

  return (
    <div className={className}>
      <a className="skip-link" href={`#${mainId}`}>Skip to main content</a>
      <header className="cms-header">
        <Link className="cms-brand" href="/#hero"><span>36</span><strong>NECYPAA</strong></Link>
        <nav aria-label="Primary navigation">{navItems.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}</nav>
        <div className="cms-actions"><CartLink /><a className="cms-register" href="https://register.necypaact.com/en/register">Register</a><a className="cms-hotel" href="https://www.necypaact.com/hotel">Book a hotel room</a><button className="cms-menu-button" aria-expanded={menu} aria-controls="cms-mobile-menu" aria-label={menu ? "Close navigation" : "Open navigation"} onClick={() => setMenu((value) => !value)} type="button">{menu ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>
        {menu ? <nav className="cms-mobile-menu" id="cms-mobile-menu" aria-label="Mobile navigation">{navItems.map((item) => <Link href={item.href} key={item.href} onClick={() => setMenu(false)}>{item.label}</Link>)}</nav> : null}
      </header>
      {children}
      <button className="display-gear" aria-expanded={settings} aria-label="Display and accessibility settings" onClick={() => setSettings((value) => !value)} type="button"><Settings aria-hidden="true" /></button>
      {settings ? <aside className="display-panel" aria-label="Display settings"><button aria-label="Close display settings" onClick={() => setSettings(false)} type="button"><X aria-hidden="true" /></button><h2>Display settings</h2><fieldset><legend>Theme</legend><button aria-pressed={theme === "light"} onClick={() => setTheme("light")} type="button">Light</button><button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} type="button">Dark</button></fieldset><fieldset><legend>Text size</legend><button aria-pressed={scale === "default"} onClick={() => setScale("default")} type="button">A</button><button aria-pressed={scale === "large"} onClick={() => setScale("large")} type="button">A+</button><button aria-pressed={scale === "largest"} onClick={() => setScale("largest")} type="button">A++</button></fieldset><label><input checked={contrast} onChange={(event) => setContrast(event.target.checked)} type="checkbox" /> Extra contrast</label><p>Motion follows your device’s reduced-motion setting.</p></aside> : null}
    </div>
  );
}
