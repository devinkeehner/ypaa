import type { Field } from "payload";

export const registrationAffiliationFields: Field[] = [
  { name: "homegroup", label: "Home group", type: "text", maxLength: 120 },
  { name: "committee", label: "Committee", type: "text", maxLength: 120, admin: { description: "Optional. Examples: Bay State Bid, EACYPAA Host, ICYPAA Bid, CSCYPAA." } },
  { name: "fellowships", label: "Fellowship", type: "select", hasMany: true, options: [{ label: "AA", value: "aa" }, { label: "Al-Anon", value: "al_anon" }, { label: "Other", value: "other" }] },
  { name: "fellowshipOther", label: "Other fellowship", type: "text", maxLength: 80, admin: { condition: (_data, siblingData) => Array.isArray(siblingData.fellowships) && siblingData.fellowships.includes("other") } },
  { name: "homegroupCommittee", label: "Legacy home group / committee", type: "text", admin: { readOnly: true, description: "Original combined value from older registrations. Kept without guessing how to split it." } },
];
