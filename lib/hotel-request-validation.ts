export const HOTEL_REQUEST_HEADING = "Need help with a hotel room?";
export const HOTEL_REQUEST_INTRO = "Tell us when you’d like to stay and how to reach you. The host committee will review your request and contact you about available options.";
export const HOTEL_REQUEST_RESPONSE = "Your hotel request has been saved. The committee will contact you about available options. This is a request, not a confirmed booking.";
export type HotelRequestInput = { name: string; email: string; phone: string; arrivalDate: string; departureDate: string; numberOfRooms: number; notes: string };

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
const controls = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/;
export function easternToday(now = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(now));
  const part = (type: string) => parts.find((value) => value.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function dateMillis(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const millis = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(millis) && new Date(millis).toISOString().slice(0, 10) === value ? millis : NaN;
}
export function hotelRequestedNights(arrivalDate: string, departureDate: string): string[] {
  const arrival = dateMillis(arrivalDate), departure = dateMillis(departureDate);
  const count = (departure - arrival) / 86400000;
  if (!Number.isInteger(count) || count < 1 || count > 14) throw new Error("Choose valid arrival and departure dates, with a stay of 1 to 14 nights.");
  return Array.from({ length: count }, (_, index) => new Date(arrival + index * 86400000).toISOString().slice(0, 10));
}
export function validateHotelRequest(body: Record<string, unknown>, now = Date.now()): HotelRequestInput {
  const name = clean(body.name), email = clean(body.email).toLowerCase(), phone = clean(body.phone);
  const arrivalDate = clean(body.arrivalDate), departureDate = clean(body.departureDate), notes = clean(body.notes);
  const numberOfRooms = typeof body.numberOfRooms === "number" ? body.numberOfRooms : typeof body.numberOfRooms === "string" && /^\d+$/.test(body.numberOfRooms) ? Number(body.numberOfRooms) : NaN;
  if (!name || name.length > 100 || /[\r\n]/.test(name) || controls.test(name)) throw new Error("Enter your name (up to 100 characters).");
  if (email.length > 254 || !/^[^\s@<>\x00-\x1f]+@[^\s@<>\x00-\x1f]+\.[^\s@<>\x00-\x1f]+$/.test(email)) throw new Error("Enter a valid email address.");
  if (phone.length > 32 || /[^\d+(). x-]/i.test(phone) || (phone.match(/\d/g) || []).length < 7 || (phone.match(/\d/g) || []).length > 20) throw new Error("Enter a phone number where we can reach you.");
  hotelRequestedNights(arrivalDate, departureDate);
  if (arrivalDate < easternToday(now)) throw new Error("Choose an arrival date that is today or later.");
  if (!Number.isInteger(numberOfRooms) || numberOfRooms < 1 || numberOfRooms > 10) throw new Error("Request between 1 and 10 rooms.");
  if (notes.length > 1000 || controls.test(notes)) throw new Error("Keep your notes under 1,000 characters and omit sensitive information.");
  return { name, email, phone, arrivalDate, departureDate, numberOfRooms, notes };
}
