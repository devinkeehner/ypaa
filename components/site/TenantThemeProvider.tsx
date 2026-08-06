"use client";

import { createContext, useContext, type CSSProperties } from "react";

export type TenantTheme = {
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
};

export const defaultTenantTheme: TenantTheme = {
  logoAlt: "NECYPAA XXXVI",
  primary: "#E85E27",
  secondary: "#31275A",
  accent: "#FFD76A",
  background: "#0C0D0E",
  surface: "#15181A",
  lightBackground: "#F5EEE1",
  darkText: "#171614",
  lightText: "#F4E8D3",
};

const TenantContext = createContext<TenantTheme>(defaultTenantTheme);

export function TenantThemeProvider({ children, settings }: { children: React.ReactNode; settings: TenantTheme }) {
  const style = {
    "--tenant-primary": settings.primary,
    "--tenant-secondary": settings.secondary,
    "--tenant-accent": settings.accent,
    "--tenant-background": settings.background,
    "--tenant-surface": settings.surface,
    "--tenant-light-background": settings.lightBackground,
    "--tenant-dark-text": settings.darkText,
    "--tenant-light-text": settings.lightText,
  } as CSSProperties;

  return <TenantContext.Provider value={settings}><div className="tenant-theme" style={style}>{children}</div></TenantContext.Provider>;
}

export function useTenantTheme() {
  return useContext(TenantContext);
}
