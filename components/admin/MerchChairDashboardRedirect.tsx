"use client";

import { useEffect } from "react";

export function MerchChairDashboardRedirect() {
  useEffect(() => {
    let active = true;
    void fetch("/api/users/me", { credentials: "same-origin" })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => {
        if (active && result?.user?.role === "merch") window.location.replace("/admin/merchandise-sales");
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return null;
}
