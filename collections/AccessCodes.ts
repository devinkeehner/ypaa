import type { CollectionConfig } from "payload";

export const AccessCodes: CollectionConfig = {
  slug: "access-codes",
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: "code",
    defaultColumns: ["code", "active", "redemptionCount", "maxRedemptions", "updatedAt"],
    description: "Codes that authorize recording an in-person cash order at /cash.",
  },
  fields: [
    {
      name: "code",
      type: "text",
      required: true,
      unique: true,
      index: true,
      hooks: { beforeValidate: [({ value }) => String(value || "").trim().toUpperCase()] },
    },
    { name: "active", type: "checkbox", required: true, defaultValue: true },
    { name: "maxRedemptions", type: "number", required: true, min: 1, defaultValue: 1 },
    { name: "redemptionCount", type: "number", required: true, min: 0, defaultValue: 0, admin: { readOnly: true } },
    {
      name: "grantType",
      type: "select",
      required: true,
      defaultValue: "cash_order",
      options: [
        { label: "Cash order", value: "cash_order" },
        { label: "Complimentary registration", value: "complimentary_registration" },
        { label: "Door scholarship", value: "door_scholarship" },
      ],
    },
    { name: "issuerSource", type: "text", defaultValue: "necypaa_host_committee" },
    { name: "notes", type: "textarea" },
  ],
};
