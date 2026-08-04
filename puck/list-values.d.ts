export type ImportantDate = { date: string; label: string };
export type MediaValue = {
  id?: number | string;
  url: string;
  alt?: string;
  filename?: string;
  width?: number;
  height?: number;
};
export type PastEvent = { title: string; date: string; image?: MediaValue | null };
export type MeetingListing = { name: string; location: string };

export function normalizeImportantDates(value: unknown): ImportantDate[];
export function normalizePastEvents(value: unknown): PastEvent[];
export function normalizeMeetings(value: unknown): MeetingListing[];
