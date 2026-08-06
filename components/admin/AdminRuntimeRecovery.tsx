"use client";

import { useEffect, type ReactNode } from "react";

const RELOAD_KEY = "necypaa-admin-runtime-reload";
const RELOAD_GUARD_MS = 30_000;

function messageFrom(value: unknown) {
  if (value instanceof Error) return value.message;
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "message" in value) return String(value.message || "");
  return "";
}

function isStaleAssetError(value: unknown) {
  return /chunkloaderror|failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|loading chunk .+ failed/i.test(messageFrom(value));
}

export default function AdminRuntimeRecovery({ children }: { children?: ReactNode }) {
  useEffect(() => {
    const invalidDocumentRoute = window.location.pathname.match(/^(\/admin\/collections\/[^/]+)\/null\/?$/);
    if (invalidDocumentRoute) {
      window.location.replace(invalidDocumentRoute[1]);
      return;
    }

    const recover = () => {
      const previous = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);
      if (Date.now() - previous < RELOAD_GUARD_MS) return;
      window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
      window.location.reload();
    };

    const onError = (event: ErrorEvent | Event) => {
      const target = event.target;
      const missingAdminAsset = target instanceof HTMLScriptElement && target.src.includes("/assets/");
      if (missingAdminAsset || (event instanceof ErrorEvent && isStaleAssetError(event.error || event.message))) recover();
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isStaleAssetError(event.reason)) recover();
    };

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return children;
}
