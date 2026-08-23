"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEventHandler } from "react";
import { Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import type { NavigationWarningDetail } from "./navigation-warning";
import { useTenantTheme, type HeaderNavigationItem, type FooterLink } from "./TenantThemeProvider";

type Theme = "dark" | "light";
type Scale = "default" | "large" | "largest";

const FOCUSABLE_SELECTOR = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

function focusableElements(container: HTMLElement | null) {
  return container ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => !element.hidden) : [];
}

const fallbackNavItems: HeaderNavigationItem[] = [
  { label: "About", url: "/#about", style: "link" },
  { label: "Meetings", url: "/#business-meeting", style: "link" },
  { label: "Events", url: "/#events", style: "link" },
  { label: "Program", url: "/program", style: "link" },
  { label: "YPAA near you", url: "/#ypaa", style: "link" },
  { label: "Merch", url: "/merch", style: "link" },
  { label: "Register", url: "/register", style: "button", appearance: "solid" },
  { label: "Book a hotel room", url: "https://www.necypaact.com/hotel", style: "button", appearance: "outline", newTab: true },
];

function headerActionClassName(item: HeaderNavigationItem) {
  const appearance = item.appearance === "outline" ? "outline" : "solid";
  const hotelClass = item.label.toLowerCase().includes("hotel") ? " cms-hotel" : "";
  return `cms-header-action cms-header-action-${appearance}${hotelClass}`;
}

function NavLink({ item, onClick, className }: { item: HeaderNavigationItem; onClick?: MouseEventHandler<HTMLAnchorElement>; className?: string }) {
  const props = { className, onClick, target: item.newTab ? "_blank" : undefined, rel: item.newTab ? "noreferrer" : undefined };
  return item.newTab ? <a {...props} href={item.url}>{item.label}<span className="sr-only"> (opens in a new tab)</span></a> : <Link {...props} href={item.url}>{item.label}</Link>;
}

function FooterLinkItem({ item, onClick }: { item: FooterLink; onClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return item.newTab ? <a href={item.url} onClick={onClick} rel="noreferrer" target="_blank">{item.label}<span className="sr-only"> (opens in a new tab)</span></a> : <Link href={item.url} onClick={onClick}>{item.label}</Link>;
}

function isDisabledPublicSurface(url: string) {
  const pathname = url.split(/[?#]/, 1)[0];
  return pathname === "/program";
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
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const settingsPanelRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const leaveDialogRef = useRef<HTMLElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleWarning = (event: Event) => {
      const warningEvent = event as CustomEvent<NavigationWarningDetail>;
      warningEvent.preventDefault();
      restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPendingNavigation(warningEvent.detail);
    };
    window.addEventListener("ypaa:confirm-navigation", handleWarning);
    return () => window.removeEventListener("ypaa:confirm-navigation", handleWarning);
  }, []);

  function confirmNavigation(item: { label: string; url: string; newTab?: boolean; showWarning?: boolean }, event: React.MouseEvent<HTMLAnchorElement>) {
    if (!item.showWarning) return;
    event.preventDefault();
    restoreFocusRef.current = event.currentTarget;
    setPendingNavigation({ label: item.label, url: item.url, newTab: item.newTab });
  }

  const closeLeaveDialog = useCallback(() => {
    setPendingNavigation(null);
    window.requestAnimationFrame(() => restoreFocusRef.current?.focus());
  }, []);

  const closeSettings = useCallback(() => {
    setSettings(false);
    window.requestAnimationFrame(() => settingsButtonRef.current?.focus());
  }, []);

  const closeMenu = useCallback(() => {
    setMenu(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

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

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("necypaa-text-large", "necypaa-text-largest");
    if (scale !== "default") root.classList.add(`necypaa-text-${scale}`);
    return () => root.classList.remove("necypaa-text-large", "necypaa-text-largest");
  }, [scale]);

  useEffect(() => {
    const container = settings ? settingsPanelRef.current : pendingNavigation ? leaveDialogRef.current : null;
    if (!container) return;
    const focusable = focusableElements(container);
    focusable[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (settings) closeSettings();
        else closeLeaveDialog();
        return;
      }
      if (event.key !== "Tab" || !focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeLeaveDialog, closeSettings, pendingNavigation, settings]);

  useEffect(() => {
    if (!menu || !menuRef.current) return;
    focusableElements(menuRef.current)[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); closeMenu(); }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu, menu]);

  const className = useMemo(() => `cms-site theme-${theme} text-${scale}${contrast ? " high-contrast" : ""}`, [theme, scale, contrast]);

  return (
    <div className={className}>
      <a className="skip-link" href={`#${mainId}`}>Skip to main content</a>
      <header className="cms-header">
        <Link className="cms-brand" href="/#hero">
          {tenant.logoUrl ? <img alt={tenant.logoAlt} src={tenant.logoUrl} /> : <><span>36</span><strong>NECYPAA</strong></>}
        </Link>
        <nav aria-label="Primary navigation">{navLinks.map((item) => <NavLink item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}</nav>
        <div className="cms-actions">{actionItems.map((item) => <NavLink className={headerActionClassName(item)} item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}<button className="cms-menu-button" aria-expanded={menu} aria-controls="cms-mobile-menu" aria-label={menu ? "Close navigation" : "Open navigation"} onClick={() => { if (menu) closeMenu(); else { setSettings(false); setMenu(true); } }} ref={menuButtonRef} type="button">{menu ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button></div>
        {menu ? <nav className="cms-mobile-menu" id="cms-mobile-menu" aria-label="Mobile navigation" ref={menuRef}>{navItems.map((item) => <NavLink item={item} key={`${item.url}-${item.label}`} onClick={(event) => { confirmNavigation(item, event); setMenu(false); }} />)}</nav> : null}
      </header>
      {children}
      <footer className="cms-footer"><div className="cms-footer-inner"><div><p className="cms-footer-kicker">{tenant.footer.heading}</p><p>{tenant.footer.text}</p></div>{tenant.footer.links.filter((item) => !isDisabledPublicSurface(item.url)).length ? <nav aria-label="Footer navigation">{tenant.footer.links.filter((item) => !isDisabledPublicSurface(item.url)).map((item) => <FooterLinkItem item={item} key={`${item.url}-${item.label}`} onClick={(event) => confirmNavigation(item, event)} />)}</nav> : null}</div><p className="cms-footer-legal">{tenant.footer.legal}</p></footer>
      {pendingNavigation ? <div className="cms-leave-backdrop" role="presentation"><section aria-describedby="cms-leave-description" aria-labelledby="cms-leave-title" aria-modal="true" className="cms-leave-dialog" ref={leaveDialogRef} role="dialog"><h2 id="cms-leave-title">You are leaving this site</h2><p id="cms-leave-description">You are about to follow “{pendingNavigation.label}” to another page. Continue?</p><div className="cms-leave-actions"><button onClick={closeLeaveDialog} type="button">Stay here</button><button onClick={continueNavigation} type="button">Continue to link</button></div></section></div> : null}
      <button className="display-gear" aria-expanded={settings} aria-haspopup="dialog" aria-label="Display and accessibility settings" onClick={() => { if (settings) closeSettings(); else { setMenu(false); setSettings(true); } }} ref={settingsButtonRef} type="button"><Settings aria-hidden="true" /></button>
      {settings ? <aside aria-label="Display settings" aria-modal="true" className="display-panel" ref={settingsPanelRef} role="dialog"><button aria-label="Close display settings" onClick={closeSettings} type="button"><X aria-hidden="true" /></button><h2>Display settings</h2><fieldset><legend>Theme</legend><button aria-pressed={theme === "light"} onClick={() => setTheme("light")} type="button">Light</button><button aria-pressed={theme === "dark"} onClick={() => setTheme("dark")} type="button">Dark</button></fieldset><fieldset><legend>Text size</legend><button aria-pressed={scale === "default"} onClick={() => setScale("default")} type="button">A</button><button aria-pressed={scale === "large"} onClick={() => setScale("large")} type="button">A+</button><button aria-pressed={scale === "largest"} onClick={() => setScale("largest")} type="button">A++</button></fieldset><label><input checked={contrast} onChange={(event) => setContrast(event.target.checked)} type="checkbox" /> Extra contrast</label><p>Motion follows your device’s reduced-motion setting.</p></aside> : null}
    </div>
  );
}
