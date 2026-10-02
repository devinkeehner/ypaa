import type { Payload } from "payload";

import { REGISTRATION_PRICE_CENTS } from "@/lib/registration";
import { readAndNormalizeCsv, type NormalizedStripePayment } from "@/lib/stripe-csv-import";

type ID = string | number;
type Write = "created" | "updated";
type ContributionType = "general_donation" | "general_scholarship" | "specific_person_scholarship";
type ContributionInput = {
  payment: NormalizedStripePayment;
  type: ContributionType;
  amountCents: number;
  directEntitlementKeys: string[];
};

const idOf = (value: unknown): ID | undefined => value && typeof value === "object" && "id" in value
  ? (value as { id: ID }).id
  : typeof value === "string" || typeof value === "number" ? value : undefined;
const argument = (name: string) => {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
};
const donationPrincipal = (payment: NormalizedStripePayment) => Math.max(0, Math.round(Number(payment.metadata.donation_amount_cents) || payment.context.subtotalCents || 0));

async function findBySourceKey(payload: Payload, collection: "checkout-orders" | "registration-entitlements" | "scholarship-contributions", sourceKey: string) {
  const result = await payload.find({ collection, overrideAccess: true, depth: 0, limit: 1, where: { sourceKey: { equals: sourceKey } } });
  return result.docs[0];
}

async function upsertContribution(payload: Payload, sourceKey: string, data: Record<string, unknown>) {
  const existing = await findBySourceKey(payload, "scholarship-contributions", sourceKey);
  if (existing) return { doc: await payload.update({ collection: "scholarship-contributions", id: existing.id, overrideAccess: true, data }), write: "updated" as Write };
  return { doc: await payload.create({ collection: "scholarship-contributions", overrideAccess: true, data: { ...data, sourceKey } }), write: "created" as Write };
}

async function upsertPooledEntitlement(payload: Payload, sourceKey: string, fundingContributions: ID[], sourceMetadata: Record<string, unknown>, legacyID?: ID) {
  const existing = await findBySourceKey(payload, "registration-entitlements", sourceKey);
  const funding = { fundingSource: "pooled_contributions" as const, fundingContributions, sourceMetadata };
  if (existing) return { doc: await payload.update({ collection: "registration-entitlements", id: existing.id, overrideAccess: true, data: funding }), write: "updated" as Write };
  if (legacyID) return { doc: await payload.update({ collection: "registration-entitlements", id: legacyID, overrideAccess: true, data: { sourceKey, ...funding } }), write: "updated" as Write };
  return {
    doc: await payload.create({
      collection: "registration-entitlements",
      overrideAccess: true,
      data: { sourceKey, entitlementType: "general_scholarship", status: "unassigned", ...funding },
    }),
    write: "created" as Write,
  };
}

function contributionInputs(payments: NormalizedStripePayment[]): ContributionInput[] {
  const inputs: ContributionInput[] = [];
  for (const payment of payments) {
    if (payment.category === "donation_only") {
      inputs.push({ payment, type: "general_donation", amountCents: donationPrincipal(payment), directEntitlementKeys: [] });
      continue;
    }
    if (!payment.order.scholarship.enabled) continue;
    const quantity = Math.max(1, payment.context.scholarshipQuantity || 1);
    if (payment.order.scholarship.kind === "specific") {
      inputs.push({
        payment,
        type: "specific_person_scholarship",
        amountCents: REGISTRATION_PRICE_CENTS,
        directEntitlementKeys: [`${payment.context.sourceKey}:entitlement:specific-scholarship:1`],
      });
    } else {
      inputs.push({
        payment,
        type: "general_scholarship",
        amountCents: REGISTRATION_PRICE_CENTS * quantity,
        directEntitlementKeys: Array.from({ length: quantity }, (_, index) => `${payment.context.sourceKey}:entitlement:general-scholarship:${index + 1}`),
      });
    }
  }
  return inputs;
}

const input = argument("--input");
const dryRun = process.argv.includes("--dry-run");
const apply = process.argv.includes("--apply");
if (!input || dryRun === apply) {
  console.error("Usage: npm run scholarships:backfill -- --input <csv> --dry-run|--apply");
  process.exit(1);
}

const normalized = await readAndNormalizeCsv(input);
const inputs = contributionInputs(normalized.normalized);
const donations = inputs.filter((item) => item.type === "general_donation").sort((a, b) => {
  const remainderDifference = (b.amountCents % REGISTRATION_PRICE_CENTS) - (a.amountCents % REGISTRATION_PRICE_CENTS);
  return remainderDifference || a.payment.context.purchasedAt.localeCompare(b.payment.context.purchasedAt);
});
const direct = inputs.filter((item) => item.type !== "general_donation");
const donationTotalCents = donations.reduce((sum, item) => sum + item.amountCents, 0);
const summary = {
  contributionCount: inputs.length,
  donationContributionCount: donations.length,
  donationTotalCents,
  pooledSeats: Math.floor(donationTotalCents / REGISTRATION_PRICE_CENTS),
  poolRemainderCents: donationTotalCents % REGISTRATION_PRICE_CENTS,
  generalScholarshipSeats: direct.filter((item) => item.type === "general_scholarship").reduce((sum, item) => sum + item.directEntitlementKeys.length, 0),
  specificScholarshipSeats: direct.filter((item) => item.type === "specific_person_scholarship").length,
  contributions: { created: 0, updated: 0 },
  pooledEntitlements: { created: 0, updated: 0 },
  warnings: [] as string[],
};

if (dryRun) {
  console.log(JSON.stringify(summary, null, 2));
  console.log("Dry run complete. No Payload records were changed.");
  process.exit(0);
}

process.loadEnvFile?.(".env.local");
const [{ getPayload }, { default: config }] = await Promise.all([import("payload"), import("@payload-config")]);
const payload = await getPayload({ config });
const legacyPooledResult = await payload.find({
  collection: "registration-entitlements",
  overrideAccess: true,
  depth: 0,
  limit: 1000,
  sort: "sourceKey",
  where: { fundingSource: { equals: "pooled_contributions" } },
});
const legacyPooledEntitlements = legacyPooledResult.docs;

const contributionDocs = new Map<string, { id: ID; input: ContributionInput }>();
for (const item of inputs) {
  const order = await findBySourceKey(payload, "checkout-orders", item.payment.context.sourceKey);
  const contributorContact = order ? idOf(order.purchaserContact) : undefined;
  if (!order || !contributorContact) {
    summary.warnings.push(`${item.payment.context.sourceKey}: checkout order or contributor contact is missing`);
    continue;
  }
  const directEntitlements = (await Promise.all(item.directEntitlementKeys.map((sourceKey) => findBySourceKey(payload, "registration-entitlements", sourceKey)))).filter(Boolean);
  const specificRecipientContact = item.type === "specific_person_scholarship" ? idOf(directEntitlements[0]?.attendeeContact) : undefined;
  const sourceKey = `${item.payment.context.sourceKey}:scholarship-contribution:1`;
  const result = await upsertContribution(payload, sourceKey, {
    checkoutOrder: order.id,
    contributorContact,
    contributionType: item.type,
    amountCents: item.amountCents,
    allocatedCents: item.type === "general_donation" ? 0 : item.amountCents,
    availableCents: item.type === "general_donation" ? item.amountCents : 0,
    seatPriceCents: REGISTRATION_PRICE_CENTS,
    specificRecipientContact,
    fundedEntitlements: directEntitlements.map((entitlement) => entitlement!.id),
    purchasedAt: item.payment.context.purchasedAt,
    status: "active",
    sourceMetadata: { ...item.payment.context.rawMetadata, normalizedCategory: item.payment.category },
  });
  summary.contributions[result.write] += 1;
  contributionDocs.set(item.payment.context.sourceKey, { id: result.doc.id, input: item });
  for (const entitlement of directEntitlements) {
    await payload.update({
      collection: "registration-entitlements",
      id: entitlement!.id,
      overrideAccess: true,
      data: { fundingSource: "direct_checkout", fundingContributions: [result.doc.id] },
    });
  }
}

type PoolPart = { contributionID: ID; sourceKey: string; amountCents: number };
const completedSeats = new Map<string, ID[]>();
const allocatedByContribution = new Map<string, number>();
let bucket: PoolPart[] = [];
let bucketCents = 0;
let pooledSeatNumber = 0;

for (const item of donations) {
  const contribution = contributionDocs.get(item.payment.context.sourceKey);
  if (!contribution) continue;
  let available = item.amountCents;
  while (available > 0) {
    const amountCents = Math.min(available, REGISTRATION_PRICE_CENTS - bucketCents);
    bucket.push({ contributionID: contribution.id, sourceKey: item.payment.context.sourceKey, amountCents });
    bucketCents += amountCents;
    available -= amountCents;
    if (bucketCents !== REGISTRATION_PRICE_CENTS) continue;

    pooledSeatNumber += 1;
    const entitlementSourceKey = `scholarship-pool:stripe-backfill:seat:${String(pooledSeatNumber).padStart(3, "0")}`;
    const contributionIDs = [...new Set(bucket.map((part) => part.contributionID))];
    const entitlement = await upsertPooledEntitlement(payload, entitlementSourceKey, contributionIDs, {
      seatPriceCents: REGISTRATION_PRICE_CENTS,
      contributionSources: bucket.map(({ sourceKey, amountCents: cents }) => ({ sourceKey, amountCents: cents })),
    }, legacyPooledEntitlements[pooledSeatNumber - 1]?.id);
    summary.pooledEntitlements[entitlement.write] += 1;
    for (const part of bucket) {
      allocatedByContribution.set(part.sourceKey, (allocatedByContribution.get(part.sourceKey) || 0) + part.amountCents);
      completedSeats.set(part.sourceKey, [...(completedSeats.get(part.sourceKey) || []), entitlement.doc.id]);
    }
    bucket = [];
    bucketCents = 0;
  }
}

for (const item of donations) {
  const contribution = contributionDocs.get(item.payment.context.sourceKey);
  if (!contribution) continue;
  const allocatedCents = allocatedByContribution.get(item.payment.context.sourceKey) || 0;
  await payload.update({
    collection: "scholarship-contributions",
    id: contribution.id,
    overrideAccess: true,
    data: {
      allocatedCents,
      availableCents: item.amountCents - allocatedCents,
      fundedEntitlements: [...new Set(completedSeats.get(item.payment.context.sourceKey) || [])],
    },
  });
}

console.log(JSON.stringify(summary, null, 2));
console.log("Scholarship fund backfill complete.");
await payload.db.destroy();
