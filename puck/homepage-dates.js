export const HOMEPAGE_TIME_ZONE = "America/New_York";
export const HIDE_AFTER_DESCRIPTION = "Homepage only. Optional YYYY-MM-DD (visible through that Eastern day), or ISO end time with timezone, e.g. 2026-08-16T16:00:00-04:00. Blank uses the displayed date. Month/day dates without a year use 2026. Explicit years are preserved; ranges and unclear dates stay visible.";

// This convention's calendar year is fixed; do not roll yearless entries into a later year.
const DEFAULT_HOMEPAGE_YEAR = 2026;

const easternDate = new Intl.DateTimeFormat("en-US", {
  timeZone: HOMEPAGE_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
});
const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function calendarDate(year, month, day) {
  if (year < 1000 || year > 9999) return null;
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Strict configuration parsing; never rely on host timezone or Date.parse's rollover. */
export function parseHideAfter(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2}))?$/.exec(text);
  if (!match) return null;
  const day = calendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
  if (!day) return null;
  if (!match[4]) return { day };
  if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6] || 0) > 59) return null;
  const offset = match[8];
  if (offset !== "Z" && (Number(offset.slice(1, 3)) > 14 || Number(offset.slice(4)) > 59 || (Number(offset.slice(1, 3)) === 14 && Number(offset.slice(4)) !== 0))) return null;
  const instant = Date.parse(text);
  return Number.isFinite(instant) ? { instant } : null;
}

function parseDisplayDate(value) {
  if (typeof value !== "string") return null;
  // A displayed time might be a start time. Only explicit hideAfter ends an entry early.
  const text = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return parseHideAfter(text);
  const match = /^(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+)?(January|Jan\.?|February|Feb\.?|March|Mar\.?|April|Apr\.?|May|June|Jun\.?|July|Jul\.?|August|Aug\.?|September|Sept?\.?|October|Oct\.?|November|Nov\.?|December|Dec\.?)\s*(\d{1,2})(?:st|nd|rd|th)?(?:[,]?\s+(\d{4}))?$/i.exec(text);
  if (!match) return null;
  const day = calendarDate(match[3] ? Number(match[3]) : DEFAULT_HOMEPAGE_YEAR, months.indexOf(match[1].slice(0, 3).toLowerCase()) + 1, Number(match[2]));
  return day ? { day } : null;
}

/** null now disables filtering (other pages and editor). Unknown dates fail open. */
export function isHomepageEntryExpired(displayDate, hideAfter, now) {
  if (typeof now !== "number" || !Number.isFinite(now) || !Number.isFinite(new Date(now).getTime())) return false;
  const configured = typeof hideAfter === "string" && hideAfter.trim() !== "";
  const cutoff = configured ? parseHideAfter(hideAfter) : parseDisplayDate(displayDate);
  if (!cutoff) return false;
  if ("instant" in cutoff) return now >= cutoff.instant;
  const parts = Object.fromEntries(easternDate.formatToParts(now).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}` > cutoff.day;
}

/** Preserve source indexes for Puck rich-text paths; never mutate persisted content. */
export function visibleHomepageRows(rows, now, dateText = (value) => value) {
  return rows.map((item, index) => ({ item, index }))
    .filter(({ item }) => !isHomepageEntryExpired(dateText(item.date), item.hideAfter, now));
}
