"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEventHandler } from "react";
import { headerNavigationKey, type HeaderChildLink, type HeaderNavigationItem } from "../../lib/header-navigation";
import styles from "./HeaderNavigation.module.css";

export function HeaderNavLink({ item, onClick, className }: { item: HeaderChildLink; onClick?: MouseEventHandler<HTMLAnchorElement>; className?: string }) {
  const props = { className, onClick, target: item.newTab ? "_blank" : undefined, rel: item.newTab ? "noreferrer" : undefined };
  const label = <>{item.label}{item.newTab ? <span className="sr-only"> (opens in a new tab)</span> : null}</>;
  return item.newTab ? <a {...props} href={item.url}>{label}</a> : <Link {...props} href={item.url}>{label}</Link>;
}

/** A disclosure navigation, with ordinary links and Tab order (not an ARIA menu). */
export function HeaderNavigationItems({ items, mobile = false, onNavigate }: {
  items: HeaderNavigationItem[];
  mobile?: boolean;
  onNavigate: (item: HeaderChildLink, event: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const id = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const groups = useRef(new Map<number, HTMLDivElement>());
  const toggles = useRef(new Map<number, HTMLButtonElement>());
  const warningPending = useRef(false);

  useEffect(() => {
    if (openIndex === null) return;
    const dismiss = (event: PointerEvent) => {
      if (warningPending.current && event.target instanceof Element && event.target.closest('[role="dialog"]')) return;
      if (event.target instanceof Node && !groups.current.get(openIndex)?.contains(event.target)) setOpenIndex(null);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [openIndex]);

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 980px)");
    const reset = () => setOpenIndex(null);
    breakpoint.addEventListener("change", reset);
    return () => breakpoint.removeEventListener("change", reset);
  }, []);

  function navigate(item: HeaderChildLink, event: React.MouseEvent<HTMLAnchorElement>) {
    onNavigate(item, event);
    // Keep warning links mounted so cancelling the dialog can return focus to them.
    warningPending.current = event.defaultPrevented && item.showWarning === true;
    if (!event.defaultPrevented) setOpenIndex(null);
  }

  return items.map((item, index) => {
    const children = item.children;
    const key = headerNavigationKey(item, index);
    if (!children?.length) return <HeaderNavLink item={item} key={key} onClick={(event) => navigate(item, event)} />;
    const expanded = openIndex === index;
    const controls = `${id}-children-${index}`;
    return <div className={`${styles.group}${mobile ? ` ${styles.mobileGroup}` : ""}`} key={key}
      ref={(node) => { if (node) groups.current.set(index, node); else groups.current.delete(index); }}
      onFocus={() => { warningPending.current = false; }}
      onBlur={(event) => {
        if (warningPending.current && event.relatedTarget instanceof Element && event.relatedTarget.closest('[role="dialog"]')) return;
        if (!event.currentTarget.contains(event.relatedTarget)) setOpenIndex((current) => current === index ? null : current);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && expanded) {
          event.preventDefault(); event.stopPropagation(); setOpenIndex(null); toggles.current.get(index)?.focus();
        }
      }}>
      <div className={styles.row}>
        <HeaderNavLink item={item} onClick={(event) => navigate(item, event)} />
        <button aria-controls={controls} aria-expanded={expanded} aria-label={`Child links for ${item.label}`} className={styles.toggle}
          ref={(node) => { if (node) toggles.current.set(index, node); else toggles.current.delete(index); }}
          onClick={() => setOpenIndex((current) => current === index ? null : index)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            event.preventDefault(); setOpenIndex(index);
            window.requestAnimationFrame(() => {
              const links = groups.current.get(index)?.querySelectorAll<HTMLAnchorElement>("ul a[href]");
              const target = event.key === "ArrowUp" ? links?.[links.length - 1] : links?.[0];
              target?.focus();
            });
          }} type="button"><svg aria-hidden="true" viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" /></svg></button>
      </div>
      <ul className={styles.children} hidden={!expanded} id={controls} aria-label={`${item.label} child links`}>
        {children.map((child, childIndex) => <li key={headerNavigationKey(child, childIndex)}><HeaderNavLink item={child} onClick={(event) => navigate(child, event)} /></li>)}
      </ul>
    </div>;
  });
}
