import { getPublishedProgramData } from "@/lib/program-data";

const publicFeedHeaders = { "Access-Control-Allow-Origin": "*" };

export async function GET() {
  try {
    const { sessions } = await getPublishedProgramData();
    return Response.json(
      {
        sessions: sessions.map(({ id, title, sessionType, startAt, room, status }) => ({
          id,
          title,
          sessionType,
          startAt,
          room: { name: room.name },
          status,
        })),
      },
      { headers: { ...publicFeedHeaders, "Cache-Control": "public, max-age=30, s-maxage=60" } },
    );
  } catch {
    return Response.json(
      { error: "The public program is temporarily unavailable." },
      { status: 503, headers: { ...publicFeedHeaders, "Cache-Control": "no-store" } },
    );
  }
}
