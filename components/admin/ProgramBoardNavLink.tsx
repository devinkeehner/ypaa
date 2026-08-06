"use client";

import { CalendarRange } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProgramBoardNavLink() {
  const pathname = usePathname();
  const active = pathname === "/admin/program-board";

  return (
    <div style={{ margin: "8px 12px" }}>
      <Link
        aria-current={active ? "page" : undefined}
        href="/admin/program-board"
        style={{
          alignItems: "center",
          background: active ? "var(--theme-elevation-100)" : "transparent",
          borderRadius: 4,
          color: "var(--theme-text)",
          display: "flex",
          fontSize: 13,
          fontWeight: 600,
          gap: 10,
          padding: "10px 12px",
          textDecoration: "none",
        }}
      >
        <CalendarRange aria-hidden="true" size={17} />
        Program Board
      </Link>
    </div>
  );
}
