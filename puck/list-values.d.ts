export type ImportantDate = { date: string; label: string };
export type PastEvent = { title: string; date: string };
export type MeetingListing = { name: string; location: string };

export function normalizeImportantDates(value: unknown): ImportantDate[];
export function normalizePastEvents(value: unknown): PastEvent[];
export function normalizeMeetings(value: unknown): MeetingListing[];
