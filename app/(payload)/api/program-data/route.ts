import { getPublishedProgramData } from "@/lib/program-data";

export async function GET() {
  try {
    return Response.json(await getPublishedProgramData(), {
      headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
    });
  } catch {
    return Response.json({ rooms: [], sessions: [], maps: [] }, { status: 503 });
  }
}
