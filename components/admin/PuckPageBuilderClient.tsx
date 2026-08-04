"use client";

import dynamic from "next/dynamic";

import type { NECYPAAData } from "@/puck/types";

import styles from "./puck-builder.module.css";

const Editor = dynamic(() => import("./PuckPageBuilderEditor").then((module) => module.PuckPageBuilderEditor), {
  loading: () => <div className={styles.loading}>Loading visual builder…</div>,
  ssr: false,
});

export function PuckPageBuilderClient(props: { initialData: NECYPAAData; pageId: string; pageTitle: string }) {
  return <Editor {...props} />;
}
