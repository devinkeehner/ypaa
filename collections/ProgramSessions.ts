import type { Access, CollectionConfig, FieldAccess } from "payload";

const authenticated: Access = ({ req }) => Boolean(req.user);
const fieldAuthenticated: FieldAccess = ({ req }) => Boolean(req.user);

function formatSlug(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const ProgramSessions: CollectionConfig = {
  slug: "program-sessions",
  labels: { singular: "Program session", plural: "Program sessions" },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: "published" } }),
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "sessionType", "startAt", "endAt", "room", "status"],
    description: "Schedule records shown on the public Program page and editable on the visual Program Board at /program-editor.",
  },
  defaultSort: "startAt",
  fields: [
    { name: "title", type: "text", required: true, index: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value, data }) => formatSlug(value || data?.title)] },
    },
    {
      name: "sessionType",
      type: "select",
      required: true,
      defaultValue: "panel",
      index: true,
      options: [
        { label: "Main meeting", value: "main_meeting" },
        { label: "Panel", value: "panel" },
        { label: "Workshop", value: "workshop" },
        { label: "Dance / social", value: "dance" },
        { label: "Marathon meeting", value: "marathon" },
        { label: "Affinity meeting", value: "affinity" },
        { label: "Meal / special event", value: "special_event" },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "startAt", type: "date", required: true, index: true, admin: { date: { pickerAppearance: "dayAndTime", timeIntervals: 30 } } },
        { name: "endAt", type: "date", required: true, index: true, admin: { date: { pickerAppearance: "dayAndTime", timeIntervals: 30 } } },
      ],
    },
    { name: "room", type: "relationship", relationTo: "rooms", required: true, index: true },
    { name: "shortDescription", type: "textarea" },
    {
      name: "presenters",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text" },
      ],
    },
    {
      name: "tracks",
      type: "select",
      hasMany: true,
      options: ["Recovery", "Service", "Unity", "Accessibility", "LGBTQ+", "BIPOC", "Al-Anon", "Spanish / bilingual"],
    },
    { name: "language", type: "text", required: true, defaultValue: "English" },
    { name: "audience", type: "text" },
    { name: "accessibility", type: "textarea", admin: { description: "Public accessibility details, such as ASL, captions, or step-free access." } },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "status", type: "select", required: true, defaultValue: "published", index: true, options: ["draft", "published", "cancelled"] },
    { name: "internalNotes", type: "textarea", access: { read: fieldAuthenticated, create: fieldAuthenticated, update: fieldAuthenticated }, admin: { description: "Committee-only notes; never displayed publicly." } },
  ],
  hooks: {
    beforeValidate: [({ data }) => {
      if (data?.startAt && data?.endAt && new Date(data.endAt).getTime() <= new Date(data.startAt).getTime()) {
        throw new Error("End time must be later than start time.");
      }
      return data;
    }],
  },
};
