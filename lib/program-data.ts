import config from "@payload-config";
import { getPayload } from "payload";

import type { ProgramData, ProgramRoom, ProgramSession, VenueMap } from "@/components/site/program-types";

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function roomFromDoc(doc: Record<string, unknown>): ProgramRoom {
  return {
    id: doc.id as string | number,
    name: String(doc.name || "Room"),
    shortLabel: String(doc.shortLabel || doc.name || "Room"),
    floor: typeof doc.floor === "string" ? doc.floor : null,
    capacity: typeof doc.capacity === "number" ? doc.capacity : null,
    accessible: typeof doc.accessible === "boolean" ? doc.accessible : null,
    directions: typeof doc.directions === "string" ? doc.directions : null,
    displayOrder: typeof doc.displayOrder === "number" ? doc.displayOrder : 0,
    mapX: typeof doc.mapX === "number" ? doc.mapX : null,
    mapY: typeof doc.mapY === "number" ? doc.mapY : null,
    color: typeof doc.color === "string" ? doc.color : null,
  };
}

export async function getPublishedProgramData(): Promise<ProgramData> {
  const payload = await getPayload({ config });
  const [roomResult, sessionResult, mapResult] = await Promise.all([
    payload.find({ collection: "rooms", depth: 0, limit: 100, sort: "displayOrder", overrideAccess: true }),
    payload.find({ collection: "program-sessions", depth: 1, limit: 500, sort: "startAt", where: { status: { equals: "published" } }, overrideAccess: true }),
    payload.find({ collection: "venue-maps", depth: 1, limit: 20, sort: "displayOrder", where: { status: { equals: "published" } }, overrideAccess: true }),
  ]);

  const rooms = roomResult.docs.map((doc) => roomFromDoc(doc as unknown as Record<string, unknown>));
  const roomByID = new Map(rooms.map((room) => [String(room.id), room]));

  const sessions = sessionResult.docs.flatMap((doc): ProgramSession[] => {
    const value = doc as unknown as Record<string, unknown>;
    const relatedRoom = record(value.room);
    const room = relatedRoom ? roomFromDoc(relatedRoom) : roomByID.get(String(value.room));
    if (!room) return [];
    return [{
      id: value.id as string | number,
      title: String(value.title || "Untitled session"),
      slug: String(value.slug || value.id),
      sessionType: String(value.sessionType || "panel"),
      startAt: String(value.startAt),
      endAt: String(value.endAt),
      room,
      shortDescription: typeof value.shortDescription === "string" ? value.shortDescription : null,
      presenters: Array.isArray(value.presenters) ? value.presenters as ProgramSession["presenters"] : null,
      tracks: Array.isArray(value.tracks) ? value.tracks.map(String) : null,
      language: typeof value.language === "string" ? value.language : null,
      audience: typeof value.audience === "string" ? value.audience : null,
      accessibility: typeof value.accessibility === "string" ? value.accessibility : null,
      featured: Boolean(value.featured),
      status: typeof value.status === "string" ? value.status : null,
    }];
  });

  const maps = mapResult.docs.map((doc): VenueMap => {
    const value = doc as unknown as Record<string, unknown>;
    const image = record(value.image);
    return {
      id: value.id as string | number,
      title: String(value.title || "Hotel map"),
      floor: String(value.floor || "Convention level"),
      altText: String(value.altText || "Hotel floor plan"),
      description: typeof value.description === "string" ? value.description : null,
      image: image ? { url: typeof image.url === "string" ? image.url : null, alt: typeof image.alt === "string" ? image.alt : null } : null,
    };
  });

  return { rooms, sessions, maps };
}
