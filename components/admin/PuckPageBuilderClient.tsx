"use client";

import dynamic from "next/dynamic";

import type { NECYPAAData } from "@/puck/types";
import type { TenantTheme } from "@/components/site/TenantThemeProvider";

import styles from "./puck-builder.module.css";

const Editor = dynamic(() => import("./PuckPageBuilderEditor").then((module) => module.PuckPageBuilderEditor), {
  loading: () => <div className={styles.loading}>Loading visual builder…</div>,
  ssr: false,
});

export function PuckPageBuilderClient(props: { initialData: NECYPAAData; pageId: string; pageSlug: string; pageTitle: string; tenantId?: string; tenantTheme: TenantTheme }) {
  return <Editor {...props} />;
}
