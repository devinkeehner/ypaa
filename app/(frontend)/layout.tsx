import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { FrontendStyles } from "./frontend-styles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NECYPAA XXXVI | Hartford, Connecticut",
  description:
    "The 36th Northeast Convention of Young People in Alcoholics Anonymous, December 31, 2026 through January 3, 2027 in Hartford, Connecticut.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FrontendStyles />
        {children}
      </body>
    </html>
  );
}
