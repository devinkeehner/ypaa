import { canEditCRM } from "../lib/crm-access";
import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { useAsTitle: "email" },
  hooks: { beforeValidate: [async ({ data, operation, req }) => {
    if (operation === "create" && data) {
      const existing = await req.payload.count({ collection: "users", overrideAccess: true, req, where: { id: { exists: true } } });
      data.role = existing.totalDocs === 0 ? "admin" : data.role || "viewer";
    }
    return data;
  }] },
  fields: [{
    name: "role", type: "select",
    options: [{ label: "Administrator", value: "admin" }, { label: "Read-only viewer", value: "viewer" }, { label: "Merchandise chair", value: "merch" }],
    access: { create: ({ req }) => canEditCRM(req.user), update: ({ req }) => canEditCRM(req.user) },
    admin: { description: "Merchandise chairs can view merchandise sales only. Read-only viewers can explore records but cannot change them. Existing accounts without a role retain administrator access." },
  }],
};
