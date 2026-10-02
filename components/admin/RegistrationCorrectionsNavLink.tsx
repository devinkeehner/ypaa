"use client";

import { ContactRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RegistrationCorrectionsNavLink() {
  const active = usePathname() === "/admin/registration-corrections";
  return (
    <div style={{ margin: "8px 12px" }}>
      <Link aria-current={active ? "page" : undefined} href="/admin/registration-corrections" style={{ alignItems: "center", background: active ? "var(--theme-elevation-100)" : "transparent", borderRadius: 4, color: "var(--theme-text)", display: "flex", fontSize: 13, fontWeight: 600, gap: 10, padding: "10px 12px", textDecoration: "none" }}>
        <ContactRound aria-hidden="true" size={17} /> Event CRM
      </Link>
    </div>
  );
}
