import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  access: { read: () => true },
  upload: {
    mimeTypes: ["image/*", "video/mp4", "video/webm"],
  },
  fields: [
    { name: "alt", type: "text", required: true },
  ],
};
