process.loadEnvFile?.(".env.local");

const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
const payload = await getPayload({ config });
const [contributionResult, entitlementResult] = await Promise.all([
  payload.find({ collection: "scholarship-contributions", overrideAccess: true, depth: 1, limit: 1000 }),
  payload.find({ collection: "registration-entitlements", overrideAccess: true, depth: 0, limit: 1000 }),
]);

const contributions = contributionResult.docs;
const entitlements = entitlementResult.docs;
const sum = (field: "amountCents" | "allocatedCents" | "availableCents") => contributions.reduce((total, contribution) => total + contribution[field], 0);
const halves = contributions
  .filter((contribution) => contribution.contributionType === "general_donation" && contribution.amountCents === 2000)
  .map((contribution) => ({
    contributor: typeof contribution.contributorContact === "object" ? contribution.contributorContact.displayName : String(contribution.contributorContact),
    amountCents: contribution.amountCents,
    allocatedCents: contribution.allocatedCents,
    availableCents: contribution.availableCents,
    fundedEntitlements: (contribution.fundedEntitlements || []).map((value) => String(typeof value === "object" ? value.id : value)),
  }));

console.log(JSON.stringify({
  contributions: contributions.length,
  contributedCents: sum("amountCents"),
  allocatedCents: sum("allocatedCents"),
  availableCents: sum("availableCents"),
  contributionTypes: {
    generalDonation: contributions.filter((item) => item.contributionType === "general_donation").length,
    generalScholarship: contributions.filter((item) => item.contributionType === "general_scholarship").length,
    specificPerson: contributions.filter((item) => item.contributionType === "specific_person_scholarship").length,
  },
  generalEntitlements: entitlements.filter((item) => item.entitlementType === "general_scholarship").length,
  unassignedGeneralEntitlements: entitlements.filter((item) => item.entitlementType === "general_scholarship" && item.status === "unassigned").length,
  specificEntitlements: entitlements.filter((item) => item.entitlementType === "specific_scholarship").length,
  assignedSpecificEntitlements: entitlements.filter((item) => item.entitlementType === "specific_scholarship" && item.status === "assigned").length,
  twentyDollarContributions: halves,
  halvesShareOneSeat: halves.length === 2 && halves[0].fundedEntitlements.length === 1 && halves[0].fundedEntitlements[0] === halves[1].fundedEntitlements[0],
}, null, 2));

await payload.db.destroy();
