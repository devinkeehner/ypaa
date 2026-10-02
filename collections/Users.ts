import { isAdministrator } from "../lib/crm-access";
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
    options: [{ label: "Administrator", value: "admin" }, { label: "Read-only viewer", value: "viewer" }, { label: "Merchandise sales viewer (legacy)", value: "merch" }, { label: "Restricted staff", value: "staff" }],
    access: { create: ({ req }) => isAdministrator(req.user), update: ({ req }) => isAdministrator(req.user) },
    admin: { description: "Choose Restricted staff to limit this account to selected content areas. Administrators manage all content and user permissions. Existing accounts without a role retain administrator access." },
  }, {
    name: "contentAreas", label: "Allowed content areas", type: "select", hasMany: true,
    options: [{ label: "Merchandise — catalog, inventory and sales", value: "merch" }, { label: "Program — sessions, rooms and venue maps", value: "program" }, { label: "Registration — contacts, roster, payments and scholarships", value: "registration" }],
    access: { create: ({ req }) => isAdministrator(req.user), update: ({ req }) => isAdministrator(req.user) },
    admin: { condition: (data) => data?.role === "staff", description: "Select one or more areas. No areas selected means no content access. Shared media can be viewed; managers may upload new media." },
  }, {
    name: "accessLevel", label: "Access level", type: "select", defaultValue: "view",
    options: [{ label: "View only", value: "view" }, { label: "Manage — create, edit and delete", value: "manage" }],
    access: { create: ({ req }) => isAdministrator(req.user), update: ({ req }) => isAdministrator(req.user) },
    admin: { condition: (data) => data?.role === "staff", description: "Applies only to the selected content areas. Audit logs remain read-only." },
  }],
};
