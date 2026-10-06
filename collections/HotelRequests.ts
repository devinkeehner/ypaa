import type { CollectionConfig } from "payload";
import { ValidationError } from "payload";
import { canAccessArea, crmWrite } from "@/lib/crm-access";
import { hotelRequestedNights } from "@/lib/hotel-request-validation";

export const HotelRequests: CollectionConfig = {
  slug: "hotel-requests",
  labels: { singular: "Hotel Request", plural: "Hotel Requests" },
  access: { create: crmWrite, read: ({ req }) => canAccessArea(req.user, "registration"), update: crmWrite, delete: crmWrite },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "arrivalDate", "departureDate", "numberOfRooms", "status", "notificationStatus", "createdAt"],
    description: "Private hotel inquiry queue. Requests are not confirmed bookings. Review pending email notifications here; batch references record committee handoffs, not reservations. Apply the committee’s retention policy to resolved requests.",
  },
  hooks: { beforeChange: [({ data, originalDoc }) => {
    const record = { ...originalDoc, ...data };
    try {
      const nights = hotelRequestedNights(record.arrivalDate, record.departureDate);
      return { ...data, requestedNights: nights.map((date) => ({ date })) };
    } catch {
      throw new ValidationError({ errors: [{ path: "departureDate", message: "Choose valid dates and a stay of 1 to 14 nights." }] });
    }
  }] },
  fields: [
    { name: "retryNotification", type: "ui", admin: { components: { Field: "@/components/admin/HotelNotificationRetry#HotelNotificationRetry" } } },
    { name: "requestKey", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
    { name: "name", type: "text", required: true, maxLength: 100 },
    { name: "email", type: "email", required: true, index: true },
    { name: "phone", type: "text", required: true, maxLength: 32 },
    { name: "arrivalDate", label: "Arrival date (YYYY-MM-DD)", type: "text", required: true, index: true },
    { name: "departureDate", label: "Departure date (YYYY-MM-DD)", type: "text", required: true },
    { name: "numberOfRooms", type: "number", required: true, min: 1, max: 10, validate: (value: unknown) => typeof value === "number" && Number.isInteger(value) ? true : "Enter a whole number of rooms." },
    { name: "notes", type: "textarea", maxLength: 1000 },
    { name: "requestedNights", type: "array", admin: { readOnly: true, description: "Derived from arrival/departure dates. Each date represents one requested night." }, fields: [{ name: "date", type: "text", required: true, index: true }] },
    { name: "status", type: "select", required: true, defaultValue: "new", index: true, options: ["new", "in_progress", "submitted_to_hotel", "resolved", "cancelled"] },
    { name: "batchReference", type: "text", index: true, admin: { description: "Optional committee batch/reference for a hotel handoff. This field does not send a batch or reserve rooms." } },
    { name: "batchedAt", type: "date", admin: { description: "When this request was included in a committee hotel handoff." } },
    { name: "staffNotes", type: "textarea", admin: { description: "Internal review notes." } },
    { name: "notificationStatus", type: "select", required: true, defaultValue: "pending", index: true, options: ["pending", "sent", "partial", "failed", "pending_configuration"], admin: { readOnly: true } },
    { name: "notifiedEmails", type: "json", admin: { readOnly: true, description: "Organizer addresses for which Resend accepted the notification. This is not proof of inbox delivery." } },
    { name: "lastNotificationAttemptAt", type: "date", admin: { readOnly: true } },
    { name: "notificationErrorCode", type: "text", admin: { readOnly: true } },
  ],
};
