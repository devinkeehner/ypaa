import type { Payload } from "payload";

export async function seedHotelRequestTest(payload: Payload) {
  const recipient = await payload.find({ collection: "notification-recipients", where: { email: { equals: "hotel-chair@example.invalid" } }, limit: 1 });
  if (!recipient.docs.length) await payload.create({ collection: "notification-recipients", data: { email: "hotel-chair@example.invalid", name: "Synthetic hotel chair", triggers: ["hotel_request"], active: true } });
  for (const slug of ["hotel-request-test"]) {
    if (!(await payload.find({ collection: "pages", where: { slug: { equals: slug } }, limit: 1 })).docs.length) await payload.create({ collection: "pages", data: { title: "Synthetic hotel request test", slug, _status: "published", layout: [{ blockType: "HotelRequest", heading: "Need help with a hotel room?", intro: "Synthetic local preview. Share your plans and we’ll follow up with available options." }] } });
  }
}
if (process.argv[1]?.endsWith("hotel-request-test-seed.ts")) {
  const uri = new URL(process.env.DATABASE_URI || "");
  if (uri.hostname !== "127.0.0.1" || uri.pathname !== "/ypaa_registration_test" || process.env.REGISTRATION_TEST_MAIL_CAPTURE !== "true") throw new Error("Use the isolated local-registration hotel-seed command.");
  const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("../payload.config")]);
  const resolved = await config; resolved.onInit = async () => {};
  const payload = await getPayload({ config: resolved });
  try {
    if ((await payload.db.connection.db!.collection("_synthetic_test_marker").findOne({ _id: "registration" }))?.synthetic !== true) throw new Error("Seed the existing synthetic registration test database first.");
    await seedHotelRequestTest(payload);
    console.log("Synthetic hotel pages ready. Only example.invalid recipients; no production data or public page changed.");
  } finally { await payload.destroy(); }
  process.exit(0);
}
