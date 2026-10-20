"use client";
import type { ComponentProps } from "react";
import { isMerchLink } from "@/lib/merchandise-visibility";
import { useTenantTheme } from "./TenantThemeProvider";

/** Shared by CMS buttons, cards and navigation; does not alter saved content. */
export function MerchAwareLink(props: ComponentProps<"a">) {
  const { merchEnabled } = useTenantTheme();
  if (!merchEnabled && props.href && isMerchLink(props.href)) return null;
  return <a {...props} />;
}
