export type EventWorkspaceNavAreaKey =
  | "crm"
  | "registrations"
  | "program"
  | "merch"
  | "payments"
  | "website"
  | "more";

export type EventWorkspacePrimaryAction = {
  description: string;
  href: string;
  label: string;
};

export type EventWorkspaceNavArea = {
  description: string;
  key: EventWorkspaceNavAreaKey;
  label: string;
  primaryAction?: EventWorkspacePrimaryAction;
  slugs: readonly string[];
};

/**
 * The event-facing information architecture for the Payload admin.
 *
 * Payload collection groups still describe the data model. This registry describes
 * how people find the tools they use day-to-day, so the compact sidebar and the
 * operations dashboard stay in agreement as the event workspace grows.
 */
export const EVENT_WORKSPACE_NAV_AREAS = [
  {
    description: "Search people, trace purchases, and resolve attendee relationships.",
    key: "crm",
    label: "Event CRM",
    primaryAction: {
      description: "Search across people, registrations, payments, tickets, and corrections.",
      href: "/registration-corrections",
      label: "Open Event CRM",
    },
    slugs: ["contacts", "registration-corrections"],
  },
  {
    description: "Manage the roster, paid seats, breakfast admissions, and access codes.",
    key: "registrations",
    label: "Registrations",
    primaryAction: {
      description: "Open the event roster and attendance records.",
      href: "/collections/attendees",
      label: "Open registrations",
    },
    slugs: [
      "attendees",
      "registration-entitlements",
      "breakfast-tickets",
      "access-codes",
      "registration-imports",
      "registration-help-requests",
      "hotel-requests",
    ],
  },
  {
    description: "Build the event schedule, assign rooms, and maintain venue maps.",
    key: "program",
    label: "Program",
    primaryAction: {
      description: "Use the visual program board to manage the schedule.",
      href: "/program-board",
      label: "Open program board",
    },
    slugs: ["program-sessions", "rooms", "venue-maps"],
  },
  {
    description: "Manage merchandise listings, stock, orders and fulfillment.",
    key: "merch",
    label: "Merch",
    primaryAction: {
      description: "Review sales, units sold, and order fulfillment.",
      href: "/merchandise-sales",
      label: "View merchandise sales",
    },
    slugs: ["merchandise", "merchandise-orders"],
  },
  {
    description: "Review original payments, scholarship funding, cash, and merchandise orders.",
    key: "payments",
    label: "Payments",
    primaryAction: {
      description: "Review the immutable Stripe and cash checkout history.",
      href: "/collections/checkout-orders",
      label: "Review checkout orders",
    },
    slugs: [
      "checkout-orders",
      "scholarship-contributions",
      "cash-transactions",
    ],
  },
  {
    description: "Update public-site content, shared media, and merchandise listings.",
    key: "website",
    label: "Website",
    primaryAction: {
      description: "Edit the public pages shown on the NECYPAA site.",
      href: "/collections/pages",
      label: "Open pages",
    },
    slugs: ["pages", "posts", "wordle-puzzles", "media"],
  },
  {
    description: "Administrative settings and supporting records that are used less often.",
    key: "more",
    label: "More",
    slugs: ["tenants", "users", "header", "footer"],
  },
] as const satisfies readonly EventWorkspaceNavArea[];
