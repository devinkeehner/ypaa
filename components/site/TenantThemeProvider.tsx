"use client";

import { createContext, useContext, type CSSProperties } from "react";
import type { HeaderNavigationItem } from "../../lib/header-navigation";
export type { HeaderNavigationItem } from "../../lib/header-navigation";

export type TenantTheme = {
  merchEnabled: boolean;
  logoUrl?: string;
  logoAlt: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  lightBackground: string;
  darkText: string;
  lightText: string;
  headerNavigation: HeaderNavigationItem[];
  footer: FooterSettings;
};

export type FooterLink = { label: string; url: string; newTab?: boolean; showWarning?: boolean };
export type FooterSettings = { heading: string; text: string; links: FooterLink[]; legal: string };

export const defaultHeaderNavigation: HeaderNavigationItem[] = [
  { label: "About", url: "/#about", style: "link" },
  { label: "Meetings", url: "/#business-meeting", style: "link" },
  { label: "Events", url: "/#events", style: "link" },
  { label: "Program", url: "/program", style: "link" },
  { label: "YPAA near you", url: "/#ypaa", style: "link" },
  { label: "Merch", url: "/merch", style: "link" },
  { label: "Register", url: "/register", style: "button", appearance: "solid" },
  { label: "Book a hotel room", url: "https://www.necypaact.com/hotel", style: "button", appearance: "outline", newTab: true },
];

export const defaultFooter: FooterSettings = {
  heading: "See you in Hartford",
  text: "The 36th Northeast Convention of Young People in Alcoholics Anonymous.",
  links: [
    { label: "Register", url: "/register" },
    { label: "Program", url: "/program" },
    { label: "News & updates", url: "/blog" },
  ],
  legal: "NECYPAA XXXVI · Northeast Convention of Young People in Alcoholics Anonymous",
};

export const defaultTenantTheme: TenantTheme = {
  merchEnabled: true,
  logoAlt: "NECYPAA XXXVI",
  primary: "#E85E27",
  secondary: "#31275A",
  accent: "#FFD76A",
  background: "#0C0D0E",
  surface: "#15181A",
  lightBackground: "#F5EEE1",
  darkText: "#171614",
  lightText: "#F4E8D3",
  headerNavigation: defaultHeaderNavigation,
  footer: defaultFooter,
};

const TenantContext = createContext<TenantTheme>(defaultTenantTheme);

export function TenantThemeProvider({ children, settings }: { children: React.ReactNode; settings: TenantTheme }) {
  const resolved = { ...defaultTenantTheme, ...settings, footer: settings.footer || defaultFooter, headerNavigation: settings.headerNavigation || defaultHeaderNavigation };
  const style = {
    "--tenant-primary": resolved.primary,
    "--tenant-secondary": resolved.secondary,
    "--tenant-accent": resolved.accent,
    "--tenant-background": resolved.background,
    "--tenant-surface": resolved.surface,
    "--tenant-light-background": resolved.lightBackground,
    "--tenant-dark-text": resolved.darkText,
    "--tenant-light-text": resolved.lightText,
  } as CSSProperties;

  return <TenantContext.Provider value={resolved}><div className="tenant-theme" style={style}>{children}</div></TenantContext.Provider>;
}

export function useTenantTheme() {
  return useContext(TenantContext);
}
