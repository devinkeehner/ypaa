import type { CollectionConfig } from "payload";

const deny = () => false;

// Only the dedicated mobile endpoint and server-side notification code use these records.
export const MobilePushSubscriptions: CollectionConfig = {
  slug: "mobile-push-subscriptions",
  admin: { hidden: true },
  access: { create: deny, read: deny, update: deny, delete: deny },
  fields: [
    { name: "token", type: "text", required: true, unique: true },
    { name: "expiresAt", type: "date", required: true },
  ],
};

// A unique claim prevents repeated or concurrent requests from broadcasting twice.
export const MobilePushBroadcasts: CollectionConfig = {
  slug: "mobile-push-broadcasts",
  admin: { hidden: true },
  access: { create: deny, read: deny, update: deny, delete: deny },
  fields: [
    { name: "announcementId", type: "text", required: true, unique: true },
  ],
};
