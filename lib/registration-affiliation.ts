export const FELLOWSHIPS = [
  { value: "aa", label: "AA" },
  { value: "al_anon", label: "Al-Anon" },
  { value: "other", label: "Other" },
] as const;
export type Fellowship = (typeof FELLOWSHIPS)[number]["value"];
export type Affiliation = { homegroup: string; committee: string; fellowships: Fellowship[]; fellowshipOther: string };
const clean = (value: unknown, max: number) => typeof value === "string" ? value.replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, max) : "";

export function normalizeAffiliation(value: unknown): Affiliation {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const selected = Array.isArray(input.fellowships) ? input.fellowships : [];
  const fellowships = FELLOWSHIPS.filter(({ value }) => selected.includes(value)).map(({ value }) => value);
  return { homegroup: clean(input.homegroup, 120), committee: clean(input.committee, 120), fellowships,
    fellowshipOther: fellowships.includes("other") ? clean(input.fellowshipOther, 80) : "" };
}

// Two compact, versioned values replace the two former combined-field metadata
// entries. This preserves Stripe's 50-key and 500-character value limits.
export function affiliationMetadata(value: Affiliation): string {
  return JSON.stringify([1, value.homegroup, value.committee, value.fellowships, value.fellowshipOther]);
}
export function parseAffiliationMetadata(value: unknown): Affiliation {
  try {
    const data = JSON.parse(typeof value === "string" ? value : "");
    if (!Array.isArray(data) || data[0] !== 1) return normalizeAffiliation({});
    return normalizeAffiliation({ homegroup: data[1], committee: data[2], fellowships: data[3], fellowshipOther: data[4] });
  } catch { return normalizeAffiliation({}); }
}
export function hasAffiliation(value: Affiliation) { return Boolean(value.homegroup || value.committee || value.fellowships.length || value.fellowshipOther); }
export function validateAffiliation(value: Affiliation): string | null {
  if (value.fellowships.includes("other") && !value.fellowshipOther) return "Enter the fellowship name when selecting Other.";
  if (affiliationMetadata(value).length > 500) return "Please shorten the home group, committee, or Other fellowship details.";
  return null;
}
export function fellowshipLabel(value: Affiliation) {
  return FELLOWSHIPS.filter(({ value: option }) => value.fellowships.includes(option)).map(({ value: option, label }) => option === "other" && value.fellowshipOther ? `Other: ${value.fellowshipOther}` : label).join(", ");
}
