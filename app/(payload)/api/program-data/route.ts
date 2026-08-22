export async function GET() {
  return Response.json({ error: "The public program is temporarily unavailable." }, { status: 404 });
}
