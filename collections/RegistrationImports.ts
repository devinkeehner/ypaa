import type { CollectionConfig } from "payload";
import { isAdministrator } from "../lib/crm-access";

export const RegistrationImports: CollectionConfig = {
  slug: "registration-imports",
  labels: { singular: "Registration Import", plural: "Registration Imports" },
  admin: { useAsTitle: "filename", defaultColumns: ["filename", "status", "createdBy", "createdAt"], description: "Administrator tracker previews, confirmed imports, and rollback audit records. Use Import registrations to upload a tracker." },
  access: { read: ({ req }) => isAdministrator(req.user), create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: "filename", type: "text", required: true },
    { name: "fileDigest", type: "text", required: true, index: true },
    { name: "status", type: "select", required: true, options: ["preview", "imported", "rolled_back"] },
    { name: "createdBy", type: "relationship", relationTo: "users", required: true },
    { name: "expiresAt", type: "date", required: true },
    { name: "confirmedAt", type: "date" },
    { name: "rolledBackAt", type: "date" },
    { name: "rolledBackBy", type: "relationship", relationTo: "users" },
    { name: "rollbackReason", type: "textarea" },
    { name: "preview", type: "json", required: true },
    { name: "result", type: "json" },
  ],
};
