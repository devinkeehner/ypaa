"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ProgramDialog({ children, labelledBy, onClose, busy }: { children: ReactNode; labelledBy: string; onClose: () => void; busy: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const opener = useRef<HTMLElement | null>(typeof document === "undefined" ? null : document.activeElement as HTMLElement);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = opener.current;
    const section = ref.current;
    const parent = section?.parentElement?.parentElement;
    const siblings = parent ? [...parent.children].filter(element => element !== section?.parentElement) as HTMLElement[] : [];
    const inertStates = siblings.map(element => element.inert);
    siblings.forEach(element => { element.inert = true; });
    section?.querySelector<HTMLElement>('input, button, select, textarea')?.focus();
    return () => { siblings.forEach((element, index) => { element.inert = inertStates[index]; }); previous?.focus(); };
  }, []);
  return <div className="program-board-modal-backdrop"><section ref={ref} aria-labelledby={labelledBy} aria-modal="true" className="program-board-modal" role="dialog" onKeyDown={event => {
    if (event.key === "Escape") { event.preventDefault(); if (!busy) closeRef.current(); }
    if (event.key !== "Tab") return;
    const controls = [...(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]') || [])].filter(element => element.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }}>{children}</section></div>;
}
