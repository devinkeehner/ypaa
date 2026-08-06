import type { Payload } from "payload";

type SeedTrack = "Recovery" | "Service" | "Unity" | "Accessibility" | "LGBTQ+" | "BIPOC" | "Al-Anon" | "Spanish / bilingual";

type SeedSession = {
  title: string;
  slug: string;
  sessionType: "main_meeting" | "panel" | "workshop" | "dance" | "marathon" | "affinity" | "special_event";
  startAt: string;
  endAt: string;
  room: string;
  shortDescription?: string;
  tracks?: SeedTrack[];
  language?: string;
  audience?: string;
  featured?: boolean;
};

const ROOM_SEEDS = [
  { key: "main", name: "Main Ballroom", shortLabel: "Main Ballroom", floor: "Convention level", capacity: 650, displayOrder: 10, mapX: 50, mapY: 26, color: "#E85E27", directions: "Centered on the convention level, across from registration." },
  { key: "amelias", name: "Amelia's", shortLabel: "Amelia's", floor: "Convention level", capacity: 95, displayOrder: 20, mapX: 22, mapY: 54, color: "#EDB84B", directions: "Left hallway from the convention registration desk." },
  { key: "simsbury", name: "Simsbury Room", shortLabel: "Simsbury", floor: "Convention level", capacity: 125, displayOrder: 30, mapX: 47, mapY: 56, color: "#72BDA3", directions: "Middle meeting room on the convention-level hallway." },
  { key: "hathaway", name: "Hathaway Room", shortLabel: "Hathaway", floor: "Convention level", capacity: 140, displayOrder: 40, mapX: 74, mapY: 55, color: "#7AA7E8", directions: "Right hallway, adjacent to the overnight hospitality area." },
  { key: "riverfront", name: "Riverfront Room", shortLabel: "Riverfront", floor: "Second floor", capacity: 80, displayOrder: 50, mapX: 34, mapY: 79, color: "#B999E8", directions: "Second floor, near the river-facing elevators." },
  { key: "capitol", name: "Capitol Room", shortLabel: "Capitol", floor: "Second floor", capacity: 80, displayOrder: 60, mapX: 65, mapY: 79, color: "#EB8EAA", directions: "Second floor, near the Capitol Street elevators." },
] as const;

const SESSION_SEEDS: SeedSession[] = [
  { title: "Kickoff Meeting", slug: "kickoff-meeting", sessionType: "main_meeting", startAt: "2026-12-31T16:00:00-05:00", endAt: "2026-12-31T17:00:00-05:00", room: "simsbury", shortDescription: "Welcome to NECYPAA XXXVI and an orientation to the weekend.", featured: true },
  { title: "Buckle up! It’s my first YPAA—what should I expect?", slug: "first-ypaa-what-to-expect", sessionType: "panel", startAt: "2026-12-31T17:00:00-05:00", endAt: "2026-12-31T18:00:00-05:00", room: "simsbury", tracks: ["Unity"] },
  { title: "Higher Power: It ain’t me — Step 2", slug: "higher-power-step-two", sessionType: "panel", startAt: "2026-12-31T17:00:00-05:00", endAt: "2026-12-31T18:00:00-05:00", room: "hathaway", tracks: ["Recovery"] },
  { title: "Opening Main Speakers + State Rollcall", slug: "opening-main-speakers-rollcall", sessionType: "main_meeting", startAt: "2026-12-31T18:00:00-05:00", endAt: "2026-12-31T20:00:00-05:00", room: "main", shortDescription: "Opening speakers from AA and Al-Anon followed by the traditional state rollcall.", tracks: ["Recovery", "Al-Anon"], featured: true },
  { title: "Space Exploration Dance", slug: "space-exploration-dance", sessionType: "dance", startAt: "2026-12-31T21:00:00-05:00", endAt: "2026-12-31T23:00:00-05:00", room: "main", shortDescription: "A high-energy opening-night dance and sober social.", featured: true },
  { title: "Here and Queer — LGBTQ+ Meeting and Meet & Greet", slug: "here-and-queer-meet-and-greet", sessionType: "affinity", startAt: "2026-12-31T21:30:00-05:00", endAt: "2026-12-31T22:30:00-05:00", room: "hathaway", tracks: ["LGBTQ+", "Unity"], audience: "LGBTQ+ attendees and allies" },
  { title: "Friday Marathon Meetings", slug: "friday-marathon-meetings", sessionType: "marathon", startAt: "2026-12-31T23:00:00-05:00", endAt: "2027-01-01T08:00:00-05:00", room: "hathaway", shortDescription: "Continuous peer-led recovery meetings through the night.", tracks: ["Recovery"] },
  { title: "Baby Steps: Parenting in AA", slug: "baby-steps-parenting-in-aa", sessionType: "panel", startAt: "2027-01-01T08:30:00-05:00", endAt: "2027-01-01T09:30:00-05:00", room: "simsbury", tracks: ["Recovery"] },
  { title: "OMG (Ohmmm My God): 10th and 11th Step Practices", slug: "ohmmm-my-god-step-practices", sessionType: "workshop", startAt: "2027-01-01T09:30:00-05:00", endAt: "2027-01-01T10:30:00-05:00", room: "amelias", tracks: ["Recovery"] },
  { title: "Doing the Research: Going Out and Coming Back", slug: "going-out-and-coming-back", sessionType: "panel", startAt: "2027-01-01T09:30:00-05:00", endAt: "2027-01-01T10:30:00-05:00", room: "simsbury", tracks: ["Recovery"] },
  { title: "The ABCs of PI and CPC", slug: "abcs-of-pi-and-cpc", sessionType: "workshop", startAt: "2027-01-01T09:30:00-05:00", endAt: "2027-01-01T10:30:00-05:00", room: "hathaway", tracks: ["Service"] },
  { title: "Step 3: Letting Go and Letting God; Step 4", slug: "steps-three-and-four", sessionType: "workshop", startAt: "2027-01-01T11:00:00-05:00", endAt: "2027-01-01T12:00:00-05:00", room: "amelias", tracks: ["Recovery"] },
  { title: "Anemone… Amenities… Astronomy… Anonymity (and Social Media)", slug: "anonymity-and-social-media", sessionType: "panel", startAt: "2027-01-01T11:00:00-05:00", endAt: "2027-01-01T12:00:00-05:00", room: "simsbury", tracks: ["Service"] },
  { title: "Al-Anon Meeting", slug: "friday-al-anon-11", sessionType: "affinity", startAt: "2027-01-01T11:00:00-05:00", endAt: "2027-01-01T12:00:00-05:00", room: "hathaway", tracks: ["Al-Anon"], audience: "Al-Anon members and newcomers" },
  { title: "Whoopie Party! Bill W’s Birthday", slug: "bill-w-birthday-party", sessionType: "special_event", startAt: "2027-01-01T12:00:00-05:00", endAt: "2027-01-01T13:30:00-05:00", room: "amelias", shortDescription: "A celebration of 127 years and still young—with cake." },
  { title: "To Affinity and Beyond: BIPOC Meeting", slug: "bipoc-affinity-meeting", sessionType: "affinity", startAt: "2027-01-01T12:00:00-05:00", endAt: "2027-01-01T13:30:00-05:00", room: "simsbury", tracks: ["BIPOC", "Unity"], audience: "BIPOC attendees" },
  { title: "Being a Pigeon, a New Kind of Flight: Effective Sponsorship", slug: "effective-sponsorship", sessionType: "panel", startAt: "2027-01-01T13:00:00-05:00", endAt: "2027-01-01T14:00:00-05:00", room: "hathaway", tracks: ["Recovery"] },
  { title: "Why Does AA Have Pamphlets?", slug: "why-aa-has-pamphlets", sessionType: "panel", startAt: "2027-01-01T14:00:00-05:00", endAt: "2027-01-01T15:30:00-05:00", room: "amelias", tracks: ["Service"] },
  { title: "Character Building Over Comfort Seeking: Steps 6 and 7", slug: "steps-six-and-seven", sessionType: "workshop", startAt: "2027-01-01T14:00:00-05:00", endAt: "2027-01-01T15:00:00-05:00", room: "simsbury", tracks: ["Recovery"] },
  { title: "Situations Which Used to Baffle Us: Coping with Grief and Loss", slug: "coping-with-grief-and-loss", sessionType: "panel", startAt: "2027-01-01T15:30:00-05:00", endAt: "2027-01-01T16:30:00-05:00", room: "simsbury", tracks: ["Recovery", "Accessibility"] },
  { title: "To Affinity and Beyond: Men’s Meeting", slug: "mens-affinity-meeting", sessionType: "affinity", startAt: "2027-01-01T16:30:00-05:00", endAt: "2027-01-01T17:30:00-05:00", room: "amelias", tracks: ["Unity"] },
  { title: "To Affinity and Beyond: Women’s Meeting", slug: "womens-affinity-meeting", sessionType: "affinity", startAt: "2027-01-01T16:30:00-05:00", endAt: "2027-01-01T17:30:00-05:00", room: "simsbury", tracks: ["Unity"] },
  { title: "Stół z połamanymi nogami / A Table with No Legs", slug: "a-table-with-no-legs", sessionType: "panel", startAt: "2027-01-01T17:30:00-05:00", endAt: "2027-01-01T18:30:00-05:00", room: "amelias", language: "Polish / English", tracks: ["Unity"] },
  { title: "New Way of Living / Una Nueva Forma de Vida", slug: "new-way-of-living", sessionType: "panel", startAt: "2027-01-01T17:30:00-05:00", endAt: "2027-01-01T18:30:00-05:00", room: "simsbury", language: "English / Spanish", tracks: ["Spanish / bilingual", "Recovery"] },
  { title: "Saturday Main Speaker + Sobriety Countdown", slug: "saturday-main-speaker-countdown", sessionType: "main_meeting", startAt: "2027-01-02T18:00:00-05:00", endAt: "2027-01-02T20:00:00-05:00", room: "main", shortDescription: "Main speaker meeting followed by the convention sobriety countdown.", featured: true },
  { title: "Glow Rave Birthday Bash", slug: "glow-rave-birthday-bash", sessionType: "dance", startAt: "2027-01-02T21:00:00-05:00", endAt: "2027-01-02T23:30:00-05:00", room: "main", featured: true },
  { title: "Saturday Marathon Meetings", slug: "saturday-marathon-meetings", sessionType: "marathon", startAt: "2027-01-02T22:00:00-05:00", endAt: "2027-01-03T08:00:00-05:00", room: "hathaway", tracks: ["Recovery"] },
  { title: "Meditation Meeting", slug: "sunday-meditation-meeting", sessionType: "affinity", startAt: "2027-01-03T08:00:00-05:00", endAt: "2027-01-03T09:00:00-05:00", room: "hathaway", tracks: ["Recovery"] },
  { title: "Page 69: Sex and Relationships", slug: "page-69-sex-and-relationships", sessionType: "panel", startAt: "2027-01-03T09:00:00-05:00", endAt: "2027-01-03T10:00:00-05:00", room: "hathaway", tracks: ["Recovery"] },
  { title: "Closing Main Speakers", slug: "closing-main-speakers", sessionType: "main_meeting", startAt: "2027-01-03T10:00:00-05:00", endAt: "2027-01-03T12:00:00-05:00", room: "main", shortDescription: "Closing speakers from AA and Al-Anon.", tracks: ["Recovery", "Al-Anon"], featured: true },
  { title: "Wrap Up Meeting", slug: "wrap-up-meeting", sessionType: "main_meeting", startAt: "2027-01-03T13:00:00-05:00", endAt: "2027-01-03T14:00:00-05:00", room: "hathaway", featured: true },
];

export async function ensureProgramSeed(payload: Payload) {
  const existingRooms = await payload.find({ collection: "rooms", limit: 100, overrideAccess: true });
  const roomIDs = new Map<string, number>();

  for (const seed of ROOM_SEEDS) {
    const existing = existingRooms.docs.find((room) => room.name === seed.name);
    if (existing) {
      roomIDs.set(seed.key, existing.id);
      continue;
    }
    const { key, ...data } = seed;
    const room = await payload.create({ collection: "rooms", data, overrideAccess: true });
    roomIDs.set(key, room.id);
  }

  const mapCount = await payload.count({ collection: "venue-maps", overrideAccess: true });
  if (mapCount.totalDocs === 0) {
    await payload.create({
      collection: "venue-maps",
      overrideAccess: true,
      data: {
        title: "Convention level overview",
        floor: "Convention and second floors",
        altText: "A schematic hotel map showing the Main Ballroom and meeting rooms around a central registration and elevator core.",
        description: "Sample layout for planning. Replace this with the hotel floor plan in Payload Media when it is available.",
        status: "published",
        displayOrder: 10,
      },
    });
  }

  const sessionCount = await payload.count({ collection: "program-sessions", overrideAccess: true });
  if (sessionCount.totalDocs > 0) return;

  for (const seed of SESSION_SEEDS) {
    const room = roomIDs.get(seed.room);
    if (!room) continue;
    const { room: roomKey, ...data } = seed;
    void roomKey;
    await payload.create({
      collection: "program-sessions",
      overrideAccess: true,
      data: { ...data, room, language: data.language || "English", status: "published" },
    });
  }
}
