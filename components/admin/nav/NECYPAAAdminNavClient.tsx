"use client";

import type { NavGroupType } from "@payloadcms/ui/shared";
import {
  BadgeDollarSign,
  CalendarRange,
  ContactRound,
  CreditCard,
  FileText,
  Globe2,
  Home,
  LogOut,
  MoreHorizontal,
  ReceiptText,
  Shirt,
  TicketCheck,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, useConfig, useTranslation } from "@payloadcms/ui";
import { EntityType } from "@payloadcms/ui/shared";
import { usePathname } from "next/navigation";
import { formatAdminURL } from "payload/shared";
import React from "react";

import {
  type EventWorkspaceNavAreaKey,
} from "@/components/admin/eventWorkspace";

import styles from "./NECYPAAAdminNav.module.css";

type EventNavArea = {
  description: string;
  entities: NavGroupType["entities"];
  key: EventWorkspaceNavAreaKey;
  label: string;
  primaryAction?: {
    description: string;
    href: string;
    label: string;
  };
};

type Props = {
  areas?: EventNavArea[];
  isMerchChair?: boolean;
};

const baseClass = "nav";

const areaIcons: Record<EventWorkspaceNavAreaKey, LucideIcon> = {
  crm: ContactRound,
  more: MoreHorizontal,
  payments: CreditCard,
  merch: Shirt,
  program: CalendarRange,
  registrations: TicketCheck,
  website: Globe2,
};

const entityIcons: Record<string, LucideIcon> = {
  "access-codes": TicketCheck,
  attendees: UsersRound,
  "breakfast-tickets": TicketCheck,
  "cash-transactions": ReceiptText,
  "checkout-orders": CreditCard,
  contacts: ContactRound,
  footer: Globe2,
  header: Globe2,
  media: FileText,
  merchandise: ReceiptText,
  "merchandise-orders": ReceiptText,
  pages: FileText,
  posts: FileText,
  "program-sessions": CalendarRange,
  "registration-corrections": FileText,
  "registration-entitlements": TicketCheck,
  rooms: CalendarRange,
  "scholarship-contributions": BadgeDollarSign,
  tenants: Globe2,
  users: UsersRound,
  "venue-maps": Globe2,
};

function getEntityLabel(label: unknown, locale?: string): string {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") {
    const labels = label as Record<string, unknown>;
    const localized = locale ? labels[locale] : undefined;
    if (typeof localized === "string") return localized;
    const fallback = Object.values(labels).find(
      (value) => typeof value === "string",
    );
    if (typeof fallback === "string") return fallback;
  }
  return "";
}

function getEntityIcon(slug: string, type: EntityType): LucideIcon {
  return type === EntityType.global
    ? Globe2
    : entityIcons[slug] || MoreHorizontal;
}

function isPathActive(pathname: string, href: string) {
  const path = href.split("?")[0] || href;
  return pathname === path || pathname.startsWith(path + "/");
}

export function NECYPAAAdminNavClient({ areas = [], isMerchChair: merchChair = false }: Props) {
  const pathname = usePathname();
  const { config } = useConfig();
  const { i18n } = useTranslation();
  const [openAreaKey, setOpenAreaKey] =
    React.useState<EventWorkspaceNavAreaKey | null>(null);
  const railButtonRefs = React.useRef<
    Partial<Record<EventWorkspaceNavAreaKey, HTMLButtonElement | null>>
  >({});
  const panelRef = React.useRef<HTMLElement>(null);
  const navAreas = React.useMemo(
    () =>
      Array.from(areas.filter((area) => !merchChair || area.key === "merch"), (area) => ({
        ...area,
        entities: Array.from(area.entities || []),
      })),
    [areas, merchChair],
  );
  const adminRoute = config.routes.admin;
  const homeHref = formatAdminURL({ adminRoute, path: "/" });
  const getAdminHref = (path: string) =>
    formatAdminURL({ adminRoute, path: path as never });
  const pagesHref = getAdminHref("/collections/pages");
  const activeAreaKey = React.useMemo(
    () =>
      navAreas.find((area) => {
        // Pages has its own always-visible shortcut, so don't also mark the
        // Website drawer as the current destination on the Pages list.
        if (area.key === "website" && isPathActive(pathname, pagesHref)) {
          return false;
        }
        const primaryHref = area.primaryAction
          ? getAdminHref(area.primaryAction.href)
          : null;

        return Boolean(
          (primaryHref && isPathActive(pathname, primaryHref)) ||
            area.entities.some(({ slug, type }) => {
              const href =
                type === EntityType.collection
                  ? getAdminHref("/collections/" + slug)
                  : getAdminHref("/globals/" + slug);
              return isPathActive(pathname, href);
            }),
        );
      })?.key || null,
    [adminRoute, navAreas, pagesHref, pathname],
  );
  const openArea = navAreas.find((area) => area.key === openAreaKey) || null;
  const openAreaPrimaryHref = openArea?.primaryAction
    ? getAdminHref(openArea.primaryAction.href)
    : null;

  React.useEffect(() => {
    setOpenAreaKey(null);
  }, [pathname]);

  const closePanel = React.useCallback(
    (returnFocus = false) => {
      const areaToFocus = openAreaKey;
      setOpenAreaKey(null);
      if (returnFocus && areaToFocus) {
        window.requestAnimationFrame(() =>
          railButtonRefs.current[areaToFocus]?.focus(),
        );
      }
    },
    [openAreaKey],
  );

  React.useEffect(() => {
    if (!openAreaKey) return;

    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closePanel, openAreaKey]);

  const navClasses = [
    baseClass,
    "necypaa-admin-nav",
    baseClass + "--nav-open",
    baseClass + "--nav-hydrated",
  ].join(" ");

  return (
    <>
      <button
        aria-hidden={!openArea}
        aria-label="Close navigation panel"
        className={styles.panelScrim}
        data-open={openArea ? "true" : "false"}
        onClick={() => closePanel(true)}
        tabIndex={openArea ? 0 : -1}
        type="button"
      />

      <aside className={navClasses}>
        <div className={styles.shell}>
          <nav aria-label="Event workspace" className={styles.rail}>
            <div className={styles.railMain}>
              {!merchChair && <Link
                className={styles.railItem}
                data-active={pathname === homeHref ? "true" : "false"}
                href={homeHref}
                onClick={() => closePanel()}
                prefetch={false}
              >
                <Home aria-hidden size={24} strokeWidth={1.9} />
                <span>Home</span>
              </Link>}

              {navAreas.some((area) => area.entities.some((entity) => entity.slug === "pages")) && <Link
                aria-current={isPathActive(pathname, pagesHref) ? "page" : undefined}
                className={styles.railItem}
                data-active={isPathActive(pathname, pagesHref) ? "true" : "false"}
                href={pagesHref}
                onClick={() => closePanel()}
                prefetch={false}
              >
                <FileText aria-hidden size={24} strokeWidth={1.9} />
                <span>Pages</span>
              </Link>}

              {navAreas.map((area) => {
                const Icon = areaIcons[area.key];
                const isOpen = area.key === openAreaKey;
                const isActive = area.key === activeAreaKey;

                if (merchChair && area.primaryAction) {
                  const merchHref = getAdminHref(area.primaryAction.href);
                  return (
                    <Link
                      aria-current={isPathActive(pathname, merchHref) ? "page" : undefined}
                      className={styles.railItem}
                      data-active={isPathActive(pathname, merchHref) ? "true" : "false"}
                      href={merchHref}
                      key={area.key}
                      prefetch={false}
                    >
                      <Icon aria-hidden size={24} strokeWidth={1.9} />
                      <span>Merch</span>
                    </Link>
                  );
                }

                return (
                  <button
                    aria-label={area.label}
                    aria-controls={"necypaa-admin-nav-panel-" + area.key}
                    aria-expanded={isOpen}
                    className={styles.railItem}
                    data-active={isActive || isOpen ? "true" : "false"}
                    key={area.key}
                    onClick={() =>
                      setOpenAreaKey((current) =>
                        current === area.key ? null : area.key,
                      )
                    }
                    ref={(element) => {
                      railButtonRefs.current[area.key] = element;
                    }}
                    type="button"
                  >
                    <Icon aria-hidden size={24} strokeWidth={1.9} />
                    <span>{area.key === "registrations" ? "Roster" : area.label}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.railFooter}>
              <Link
                className={styles.railItem}
                href={getAdminHref("/logout")}
                prefetch={false}
              >
                <LogOut aria-hidden size={22} strokeWidth={1.9} />
                <span>Log out</span>
              </Link>
            </div>
          </nav>

          {openArea ? (
            <section
              aria-label={openArea.label + " navigation"}
              className={styles.panel}
              id={"necypaa-admin-nav-panel-" + openArea.key}
              ref={panelRef}
              tabIndex={-1}
            >
              <div className={styles.panelHeader}>
                <div>
                  <h2>{openArea.label}</h2>
                  <p>{openArea.description}</p>
                </div>
                <button
                  aria-label={"Close " + openArea.label + " panel"}
                  className={styles.closeButton}
                  onClick={() => closePanel(true)}
                  type="button"
                >
                  <X aria-hidden size={18} strokeWidth={2} />
                </button>
              </div>

              {openArea.primaryAction ? (
                <Link
                  className={styles.primaryAction}
                  href={getAdminHref(openArea.primaryAction.href)}
                  onClick={() => closePanel()}
                  prefetch={false}
                >
                  <span className={styles.primaryActionIcon}>
                    {React.createElement(areaIcons[openArea.key], {
                      "aria-hidden": true,
                      size: 18,
                      strokeWidth: 1.9,
                    })}
                  </span>
                  <span>
                    <strong>{openArea.primaryAction.label}</strong>
                    <small>{openArea.primaryAction.description}</small>
                  </span>
                </Link>
              ) : null}

              <div className={styles.panelLinks}>
                {openArea.entities.filter(({ slug, type }) => {
                  const href =
                    type === EntityType.collection
                      ? getAdminHref("/collections/" + slug)
                      : getAdminHref("/globals/" + slug);
                  return href !== openAreaPrimaryHref;
                }).map(({ label: entityLabel, slug, type }) => {
                  const entitySlug = String(slug);
                  const href =
                    type === EntityType.collection
                      ? getAdminHref("/collections/" + slug)
                      : getAdminHref("/globals/" + slug);
                  const Icon = getEntityIcon(entitySlug, type);
                  const rawLabel = getEntityLabel(
                    entityLabel,
                    i18n?.language,
                  );
                  const label = rawLabel || entitySlug;

                  return (
                    <Link
                      className={styles.panelLink}
                      data-active={isPathActive(pathname, href) ? "true" : "false"}
                      href={href}
                      id={"nav-" + slug}
                      key={String(type) + "-" + slug}
                      onClick={() => closePanel()}
                      prefetch={false}
                    >
                      <span className={styles.panelLinkIcon}>
                        <Icon aria-hidden size={19} strokeWidth={1.85} />
                      </span>
                      <span>
                        <strong>{label}</strong>
                        <small>
                          {"Open " + label + "."}
                        </small>
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          ) : null}
        </div>
      </aside>
    </>
  );
}
