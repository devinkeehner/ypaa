export type ProgramRoom = {
  id: number | string;
  name: string;
  shortLabel: string;
  floor?: string | null;
  capacity?: number | null;
  accessible?: boolean | null;
  directions?: string | null;
  displayOrder: number;
  mapX?: number | null;
  mapY?: number | null;
  color?: string | null;
};

export type ProgramSession = {
  id: number | string;
  title: string;
  slug: string;
  sessionType: string;
  startAt: string;
  endAt: string;
  room: ProgramRoom;
  shortDescription?: string | null;
  presenters?: Array<{ name?: string | null; role?: string | null }> | null;
  tracks?: string[] | null;
  language?: string | null;
  audience?: string | null;
  accessibility?: string | null;
  featured?: boolean | null;
  status?: string | null;
};

export type VenueMap = {
  id: number | string;
  title: string;
  floor: string;
  altText: string;
  description?: string | null;
  image?: { url?: string | null; alt?: string | null } | null;
};

export type ProgramData = {
  rooms: ProgramRoom[];
  sessions: ProgramSession[];
  maps: VenueMap[];
};

export const SESSION_TYPE_LABELS: Record<string, string> = {
  main_meeting: "Main meeting",
  panel: "Panel",
  workshop: "Workshop",
  dance: "Dance / social",
  marathon: "Marathon meeting",
  affinity: "Affinity meeting",
  special_event: "Meal / special event",
};
