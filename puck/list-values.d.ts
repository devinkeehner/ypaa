export type ImportantDate = { date: string; label: string; hideAfter?: string };
export type MediaValue = {
  id?: number | string;
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  width?: number;
  height?: number;
};
export type PastEvent = { id?: number | string; title: string; date: string; image?: MediaValue | string | number | null };
export type UpcomingEvent = { title: string; date: string; hideAfter?: string };
export type MeetingListing = { name: string; location: string; date?: string; url?: string; accessibleContext?: string };
export type ScheduleMeeting = { day: string; time: string; name: string; url: string; accessibleContext?: string; location: string; city: string; attendance: string; address: string; types: string };

export function normalizeImportantDates(value: unknown): ImportantDate[];
export function normalizePastEvents(value: unknown): PastEvent[];
export function normalizeUpcomingEvents(value: unknown): UpcomingEvent[];
export function normalizeMeetings(value: unknown): MeetingListing[];
export function normalizeScheduleMeetings(value: unknown): ScheduleMeeting[];
