"use client";

import { useEffect, useMemo, useState, type MouseEventHandler } from "react";
import { Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import type { NavigationWarningDetail } from "./navigation-warning";
import { useTenantTheme, type HeaderNavigationItem, type FooterLink } from "./TenantThemeProvider";

type Theme = "dark" | "light";
type Scale = "default" | "large" | "largest";

const fallbackNavItems: HeaderNavigationItem[] = [
  { label: "About", url: "/#about", style: "link" },
  { label: "Meetings", url: "/#business-meeting", style: "link" },
  { label: "Events", url: "/#events", style: "link" },
  { label: "Program", url: "/program", style: "link" },
  { label: "YPAA near you", url: "/#ypaa", style: "link" },
  { label: "Merch", url: "/merch", style: "link" },
  { label: "Register", url: "/register", style: "button" },
  { label: "Book a hotel room", url: "https://www.necypaact.com/hotel", style: "button", newTab: true },
];

function NavLink({ item, onClick, className }: { item: HeaderNavigationItem; onClick?: MouseEventHandler<HTMLAnchorElement>; className?: string }) {
  const props = { className, onClick, target: item.newTab ? "_blank" : undefined, rel: item.newTab ? "noreferrer" : undefined };
  return item.newTab ? <a {...props} href={item.url}>{item.label}<span className="sr-only"> (opens in a new tab)</span></a> : <Link {...props} href={item.url}>{item.label}</Link>;
}

function FooterLinkItem({ item, onClick }: { item: FooterLink; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return item.newTab ? <a href={item.url} onClick={onClick} rel="noreferrer" target="_blank">{item.label}<span className="sr-only"> (opens in a new tab)</span></a> : <Link href={item.url} onClick={onClick}>{item.label}</Link>;
}

function isDisabledPublicSurface(url: string) {
  const pathname = url.split(/[?#]/, 1)[0];
  return pathname === "/program" || pathname === "/merch" || pathname.startsWith("/merch/") || pathname === "/cart";
}

export function SiteFrame({ children, mainId }: { children: React.ReactNode; mainId: string }) {
  const tenant = useTenantTheme();
  const navItems = (tenant.headerNavigation?.length ? tenant.headerNavigation : fallbackNavItems).filter((item) => !isDisabledPublicSurface(item.url));
  const navLinks = navItems.filter((item) => item.style !== "button");
  const actionItems = navItems.filter((item) => item.style === "button");
  const [theme, setTheme] = useState<Theme>(() => typeof window !== "undefined" && localStorage.getItem("necypaa-theme") === "light" ? "light" : "dark");
  const [scale, setScale] = useState<Scale>(() => {
    if (typeof window === "undefined") return "default";
    const saved = localStorage.getItem("necypaa-text");
    return saved === "large" || saved === "largest" ? saved : "default";
  });
  const [contrast, setContrast] = useState(() => typeof window !== "undefined" && localStorage.getItem("necypaa-contrast") === "true");
  const [settings, setSettings] = useState(false);
  const [menu, setMenu] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{ label: string; url: string; newTab?: boolean } | null>(null);

  useEffect(() => {
    const handleWarning = (event: Event) => {
      const warningEvent = event as CustomEvent<NavigationWarningDetail>;
      warningEvent.preventDefault();
      setPendingNavigation(warningEvent.detail);
    };
    window.addEventListener("ypaa:confirm-navigation", handleWarning);
    return () => window.removeEventListener("ypaa:confirm-navigation", handleWarning);
  }, []);

  function confirmNavigation(item: { label: string; url: string; newTab?: boolean; showWarning?: boolean }, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!item.showWarning) return;
    event.preventDefault();
    setPendingNavigation({ label: item.label, url: item.url, newTab: item.newTab });
  }

  function continueNavigation() {
    if (!pendingNavigation) return;
    const destination = pendingNavigation;
    setPendingNavigation(null);
    if (destination.newTab) window.open(destination.url, "_blank", "noopener,noreferrer");
    else window.location.assign(destination.url);
  }

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
        <Link className="cms-brand" href="/#hero">
          {tenant.logoUrl ? <img alt={tenant.logoAlt} src={tenant.logoUrl} /> : <><span>36</span><strong>NECYPAA</strong></>}
        </Link>
        <nav aria-label="Primary navigation">{navLinks.map((item) => <NavLink item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}</nav>
        <div className="cms-actions">{actionItems.map((item) => <NavLink className={item.style === "button" && item.label.toLowerCase().includes("hotel") ? "cms-hotel" : "cms-register"} item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}<button className="cms-menu-button" aria-expanded={menu} aria-controls="cms-mobile-menu" aria-label={menu ? "Close navigation" : "Open navigation"} onClick={() => setMenu((value) => !value)} type="button">{menu ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>
        {menu ? <nav className="cms-mobile-menu" id="cms-mobile-menu" aria-label="Mobile navigation">{navItems.map((item) => <NavLink item={item} key={`${item.url}-${item.label}`} onClick={(event) => { confirmNavigation(item, event); setMenu(false); }} />)}</nav> : null}
      </header>
      {children}
      <footer className="cms-footer"><div className="cms-footer-inner"><div><p className="cms-footer-kicker">{tenant.footer.heading}</p><p>{tenant.footer.text}</p></div>{tenant.footer.links.filter((item) => !isDisabledPublicSurface(item.url)).length ? <nav aria-label="Footer navigation">{tenant.footer.links.filter((item) => !isDisabledPublicSurface(item.url)).map((item) => <FooterLinkItem item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}</nav> : null}</div><p className="cms-footer-legal">{tenant.footer.legal}</p></footer>
      {pendingNavigation ? <div className="cms-leave-backdrop" role="presentation"><section aria-describedby="cms-leave-description" aria-labelledby="cms-leave-title" aria-modal="true" className="cms-leave-dialog" role="dialog"><h2 id="cms-leave-title">You are leaving this site</h2><p id="cms-leave-description">You are about to follow “{pendingNavigation.label}” to another page. Continue?</p><div className="cms-leave-actions"><button onClick={() => setPendingNavigation(null)} type="button">Stay here</button><button autoFocus onClick={continueNavigation} type="button">Continue to link</button></div></section></div> : null}
      <button className="display-gear" aria-expanded={settings} aria-label="Display and accessibility settings" onClick={() => setSettings((value) => !value)} type="button"><Settings aria-hidden="true" /></button>
      {settings ? <aside className="display-panel" aria-label="Display settings"><button aria-label="Close display settings" onClick={() => setSettings(false)} type="button"><X aria-hidden="true" /></button><h2>Display settings</h2><fieldset><legend>Theme</legend><button aria-pressed={theme === "light"} onClick={() => setTheme("light")} type="button">Light</button><button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} type="button">Dark</button></fieldset><fieldset><legend>Text size</legend><button aria-pressed={scale === "default"} onClick={() => setScale("default")} type="button">A</button><button aria-pressed={scale === "large"} onClick={() => setScale("large")} type="button">A+</button><button aria-pressed={scale === "largest"} onClick={() => setScale("largest")} type="button">A++</button></fieldset><label><input checked={contrast} onChange={(event) => setContrast(event.target.checked)} type="checkbox" /> Extra contrast</label><p>Motion follows your device’s reduced-motion setting.</p></aside> : null}
    </div>
  );
}
