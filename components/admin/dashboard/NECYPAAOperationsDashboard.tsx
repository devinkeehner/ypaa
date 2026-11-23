import { canAccessArea, isAdministrator } from "@/lib/crm-access";
import { CRMDemoNotice } from "../CRMDemoNotice";
import type { PayloadRequest, WidgetServerProps } from "payload";
import { formatAdminURL } from "payload/shared";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  ContactRound,
  TicketCheck,
  UsersRound,
} from "lucide-react";

import styles from "./NECYPAAOperationsDashboard.module.css";

const numberFormatter = new Intl.NumberFormat("en-US");
const equivalentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});
const LEGACY_SCHOLARSHIP_SEAT_PRICE_CENTS = 4000;

const adminURL = (req: PayloadRequest, path: string) =>
  formatAdminURL({
    adminRoute: req.payload.config.routes.admin,
    path: path as never,
  });

const safely = async <Value,>(promise: Promise<Value>): Promise<Value | null> => {
  try {
    return await promise;
  } catch {
    return null;
  }
};

const formatCount = (value: number | null) =>
  value === null ? "—" : numberFormatter.format(value);

const formatCurrency = (value: number | null) =>
  value === null ? "—" : currencyFormatter.format(value / 100);

const formatDate = (value: unknown) => {
  if (typeof value !== "string") return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const numberFromRecord = (value: unknown, field: string) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return 0;
  const candidate = (value as Record<string, unknown>)[field];
  return typeof candidate === "number" ? candidate : 0;
};

export function EventQuickActionsWidget({ req }: WidgetServerProps) {
  const actions = [
    {
      area: "registration",
      description: "Search people, payments, and linked records.",
      href: adminURL(req, "/registration-corrections"),
      icon: ContactRound,
      label: "Open Event CRM",
    },
    {
      area: "registration",
      description: "Review the roster, admissions, and access codes.",
      href: adminURL(req, "/collections/attendees"),
      icon: TicketCheck,
      label: "Review registrations",
    },
    {
      area: "registration",
      description: "Track donations, scholarship seats, and allocation.",
      href: adminURL(req, "/collections/scholarship-contributions"),
      icon: BadgeDollarSign,
      label: "Manage scholarship fund",
    },
    {
      area: "program",
      description: "Arrange sessions, rooms, and schedule details.",
      href: adminURL(req, "/program-board"),
      icon: CalendarRange,
      label: "Open program board",
    },
    {
      area: "merch",
      description: "Review merchandise sales and fulfillment.",
      href: adminURL(req, "/merchandise-sales"),
      icon: BadgeDollarSign,
      label: "Open merchandise sales",
    },
  ] as const;

  return (
    <section
      aria-labelledby="event-operations-heading"
      className={styles.quickActions + " " + styles.widget}
    >
      <div className={styles.heading}>
        <CRMDemoNotice />
        <h1 id="event-operations-heading">Event operations</h1>
        <p>Manage NECYPAA XXXVI people, registrations, funding, and program work from one place.</p>
      </div>
      <div className={styles.actionGrid}>
        {isAdministrator(req.user) && <a className={styles.actionCard} href={adminURL(req, "/registration-import")}><span className={styles.actionIcon}><TicketCheck aria-hidden size={20} /></span><span className={styles.actionCopy}><strong>Import registrations</strong><small>Upload a tracker, review matches, and confirm registration-only records.</small></span><ArrowRight aria-hidden className={styles.actionArrow} size={18} /></a>}
        {actions.filter((action) => canAccessArea(req.user, action.area)).map((action, index) => {
          const Icon = action.icon;

          return (
            <a
              className={styles.actionCard}
              data-primary={index === 0 ? "true" : "false"}
              href={action.href}
              key={action.label}
            >
              <span className={styles.actionIcon}>
                <Icon aria-hidden size={20} strokeWidth={1.9} />
              </span>
              <span className={styles.actionCopy}>
                <strong>{action.label}</strong>
                <small>{action.description}</small>
              </span>
              <ArrowRight aria-hidden className={styles.actionArrow} size={18} />
            </a>
          );
        })}
      </div>
    </section>
  );
}

export async function EventCRMOverviewWidget({ req }: WidgetServerProps) {
  if (!canAccessArea(req.user, "registration")) return null;
  const [contacts, registrations, breakfastTickets] = await Promise.all([
    safely(
      req.payload.count({
        collection: "contacts",
        overrideAccess: false,
        req,
      }),
    ),
    safely(
      req.payload.count({
        collection: "attendees",
        overrideAccess: false,
        req,
      }),
    ),
    safely(
      req.payload.count({
        collection: "breakfast-tickets",
        overrideAccess: false,
        req,
      }),
    ),
  ]);

  const metrics = [
    {
      icon: UsersRound,
      label: "Contacts",
      value: formatCount(contacts?.totalDocs ?? null),
    },
    {
      icon: ClipboardList,
      label: "Registrations",
      value: formatCount(registrations?.totalDocs ?? null),
    },
    {
      icon: TicketCheck,
      label: "Breakfast tickets",
      value: formatCount(breakfastTickets?.totalDocs ?? null),
    },
  ] as const;

  return (
    <section className={styles.widget}>
      <div className={styles.panelHeader}>
        <div>
          <h2>CRM overview</h2>
          <p>Live counts from the canonical contacts, roster, and breakfast ticket records.</p>
        </div>
        <a className={styles.inlineLink} href={adminURL(req, "/collections/contacts")}>
          Browse contacts <ArrowRight aria-hidden size={15} />
        </a>
      </div>
      <div className={styles.metricGrid}>
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div className={styles.metric} key={metric.label}>
              <span className={styles.metricIcon}>
                <Icon aria-hidden size={22} strokeWidth={1.85} />
              </span>
              <span>
                <strong>{metric.value}</strong>
                <small>{metric.label}</small>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export async function ScholarshipFundWidget({ req }: WidgetServerProps) {
  if (!canAccessArea(req.user, "registration")) return null;
  const [unassignedSeats, contributions] = await Promise.all([safely(
    req.payload.find({
      collection: "registration-entitlements",
      depth: 0,
      pagination: false,
      select: { sourceMetadata: true, fundingContributions: true },
      overrideAccess: false,
      req,
      where: {
        and: [
          { entitlementType: { equals: "general_scholarship" } },
          { status: { equals: "unassigned" } },
        ],
      },
    }),
  ), safely(
    req.payload.find({
      collection: "scholarship-contributions",
      depth: 0,
      pagination: false,
      select: { amountCents: true, availableCents: true, seatPriceCents: true },
      overrideAccess: false,
      req,
      where: { status: { equals: "active" } },
    }),
  )]);
  const ledgerByID = new Map(contributions?.docs.map((row) => [row.id, row]));
  const prices = new Map<number, number>();
  for (const { amountCents, seatPriceCents } of contributions?.docs ?? []) {
    if (seatPriceCents > 0) prices.set(seatPriceCents, (prices.get(seatPriceCents) ?? 0) + amountCents / seatPriceCents);
  }
  const unassignedSeatValueCents =
    unassignedSeats?.docs.reduce(
      (sum, entitlement) => {
        const reference = entitlement.fundingContributions?.length === 1 ? entitlement.fundingContributions[0] : null;
        const linked = reference ? ledgerByID.get(typeof reference === "string" ? reference : reference.id) : undefined;
        return sum + (numberFromRecord(entitlement.sourceMetadata, "seatPriceCents") ||
          linked?.seatPriceCents || LEGACY_SCHOLARSHIP_SEAT_PRICE_CENTS);
      },
      0,
    ) ?? null;
  const unassignedSeatCount = unassignedSeats?.docs.length ?? null;
  const contributionTotal = contributions?.docs.reduce((total, row) => total + row.amountCents, 0) ?? null;
  const availableBalance = contributions?.docs.reduce((total, row) => total + row.availableCents, 0) ?? null;
  const ticketEquivalents = contributions ? [...prices.values()].reduce((total, units) => total + units, 0) : null;
  const metrics = [
    { label: "Fund amount", value: formatCurrency(contributionTotal), Icon: BadgeDollarSign },
    { label: "Ticket equivalents", value: ticketEquivalents === null ? "—" : equivalentFormatter.format(ticketEquivalents), Icon: TicketCheck },
    ...[...prices.entries()].sort(([a], [b]) => a - b).map(([price, units]) => ({
      label: `At ${formatCurrency(price)}`, value: equivalentFormatter.format(units), Icon: TicketCheck,
    })),
    { label: "Unallocated balance", value: formatCurrency(availableBalance), Icon: BadgeDollarSign },
    { label: "Unassigned seats", value: formatCount(unassignedSeatCount), Icon: TicketCheck },
    { label: "Unassigned seat face value", value: formatCurrency(unassignedSeatValueCents), Icon: TicketCheck },
  ];

  return (
    <section className={styles.widget}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Scholarship fund</h2>
          <p>Scholarship contributions, available funds, and seats already issued.</p>
        </div>
        <a
          className={styles.inlineLink}
          href={adminURL(req, "/collections/scholarship-contributions")}
        >
          Manage fund <ArrowRight aria-hidden size={15} />
        </a>
      </div>
      <div className={styles.fundGrid}>
        {metrics.map(({ label, value, Icon }) => (
          <div className={styles.fundMetric} key={label}>
            <span className={styles.metricIcon}><Icon aria-hidden size={22} strokeWidth={1.85} /></span>
            <span><strong>{value}</strong><small>{label}</small></span>
          </div>
        ))}
      </div>
      <p className={styles.widgetNote}>
        {unassignedSeatCount === null || contributionTotal === null
          ? "Some fund totals could not be loaded. Open the fund to review contributions and allocations."
          : "Ticket equivalents use each contribution’s original seat price. The unassigned count shows seats already issued and available to assign."}
      </p>
    </section>
  );
}

export async function EventOperationsWidget({ req }: WidgetServerProps) {
  if (!canAccessArea(req.user, "registration") || !canAccessArea(req.user, "program")) return null;
  const [sessions, publishedSessions, draftSessions, rooms, corrections] =
    await Promise.all([
      safely(
        req.payload.count({
          collection: "program-sessions",
          overrideAccess: false,
          req,
        }),
      ),
      safely(
        req.payload.count({
          collection: "program-sessions",
          overrideAccess: false,
          req,
          where: { status: { equals: "published" } },
        }),
      ),
      safely(
        req.payload.count({
          collection: "program-sessions",
          overrideAccess: false,
          req,
          where: { status: { equals: "draft" } },
        }),
      ),
      safely(
        req.payload.count({
          collection: "rooms",
          overrideAccess: false,
          req,
        }),
      ),
      safely(
        req.payload.find({
          collection: "registration-corrections",
          depth: 0,
          limit: 3,
          overrideAccess: false,
          pagination: false,
          req,
          sort: "-changedAt",
        }),
      ),
    ]);

  const programRows = [
    { label: "Sessions", value: formatCount(sessions?.totalDocs ?? null) },
    {
      label: "Published",
      value: formatCount(publishedSessions?.totalDocs ?? null),
    },
    { label: "Drafts", value: formatCount(draftSessions?.totalDocs ?? null) },
    { label: "Rooms", value: formatCount(rooms?.totalDocs ?? null) },
  ];

  return (
    <section className={styles.widget}>
      <div className={styles.panelHeader}>
        <div>
          <h2>Operations queue</h2>
          <p>Recent data corrections and a quick program readiness check.</p>
        </div>
        <a className={styles.inlineLink} href={adminURL(req, "/program-board")}>
          Program board <ArrowRight aria-hidden size={15} />
        </a>
      </div>

      <div className={styles.programStatus}>
        {programRows.map((row) => (
          <div className={styles.statusRow} key={row.label}>
            <span>
              <CheckCircle2 aria-hidden size={16} strokeWidth={1.9} />
              {row.label}
            </span>
            <strong>{row.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.queueHeading}>
        <strong>Recent corrections</strong>
        <a href={adminURL(req, "/collections/registration-corrections")}>
          View log
        </a>
      </div>
      {corrections?.docs.length ? (
        <ul className={styles.correctionList}>
          {corrections.docs.map((correction) => (
            <li key={correction.id}>
              <a
                href={adminURL(
                  req,
                  "/collections/registration-corrections/" + correction.id,
                )}
              >
                <span>
                  <strong>{correction.reason || "Correction recorded"}</strong>
                  <small>
                    {String(correction.correctionType || "correction").replaceAll(
                      "_",
                      " ",
                    )}
                  </small>
                </span>
                <time dateTime={correction.changedAt || undefined}>
                  {formatDate(correction.changedAt)}
                </time>
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.emptyState}>No correction history has been recorded yet.</p>
      )}
    </section>
  );
}
