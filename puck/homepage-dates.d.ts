export const HOMEPAGE_TIME_ZONE: "America/New_York";
export const HIDE_AFTER_DESCRIPTION: string;
export function parseHideAfter(value: unknown): { day: string } | { instant: number } | null;
export function isHomepageEntryExpired(displayDate: unknown, hideAfter: unknown, now: number | null): boolean;
export function visibleHomepageRows<T extends { date: unknown; hideAfter?: unknown }>(rows: T[], now: number | null, dateText?: (value: unknown) => unknown): Array<{ item: T; index: number }>;
