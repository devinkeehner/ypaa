import { PAGE_LAYOUT_BLOCKS } from "@/blocks/page-blocks";
import { campaignAltDefinitions } from "@/puck/campaign-alt-definitions";
import { AFTER_CONTENT_BLOCK_TYPES, ELEMENT_DROP_TYPES, REUSABLE_ROW_TYPES, REUSABLE_SECTION_TYPES } from "@/puck/drop-zones";

type LooseField = {
  blocks?: Array<{ slug?: string }>;
  fields?: LooseField[];
  name?: string;
  options?: Array<string | { label?: string; value?: unknown }>;
  type?: string;
};

function summarizeField(field: LooseField): Record<string, unknown> {
  return {
    name: field.name || "unnamed",
    type: field.type || "unknown",
    ...(Array.isArray(field.options) ? { options: field.options.map((option) => typeof option === "string" ? option : option.value) } : {}),
    ...(Array.isArray(field.blocks) ? { allowedBlocks: field.blocks.map((block) => block.slug).filter(Boolean) } : {}),
    ...(Array.isArray(field.fields) ? { fields: field.fields.map(summarizeField) } : {}),
  };
}

export function pageBuilderBlockCatalog() {
  return {
    schemaVersion: 1,
    authoringModel: {
      layout: "Payload's structured block array and the compatibility source used by non-Puck clients.",
      builderData: "Puck's visual-builder document. Keep content and every builderData.zones entry intact when editing it directly.",
      synchronization: "Saving through Payload layout rebuilds builderData; saving through the visual builder rebuilds layout.",
      zoneIDs: ["{blockId}:afterContent", "{blockId}:bottomContent", "{blockId}:cards.{index}.blocks", "{blockId}:columns.{index}.blocks", "{blockId}:tabs.{index}.blocks"],
    },
    palettes: {
      reusableSections: REUSABLE_SECTION_TYPES,
      reusableRows: REUSABLE_ROW_TYPES,
      nestedElements: ELEMENT_DROP_TYPES,
      bridgeSections: Array.from(AFTER_CONTENT_BLOCK_TYPES),
    },
    campaignFamilies: campaignAltDefinitions.map((definition) => ({
      type: definition.type,
      label: definition.label,
      palette: definition.palette,
      kind: definition.kind,
      variants: definition.variants,
      presentations: definition.presentations || [],
      nestedCollection: definition.nestedCollection || null,
    })),
    payloadBlocks: PAGE_LAYOUT_BLOCKS.map((block) => ({
      slug: block.slug,
      label: typeof block.labels === "object" ? block.labels?.singular : block.slug,
      fields: (block.fields as LooseField[]).map(summarizeField),
    })),
    compatibility: {
      PayPal: "Legacy PayPal blocks load as ordinary Button elements and save back as Button blocks.",
      rowAliases: "Row presets save to Payload as ContentRow with their selected layout.",
      textAlias: "The Puck Text element saves to Payload as FreeText.",
    },
  };
}

export const pageBuilderCatalogResource = {
  name: "page-builder-block-catalog",
  title: "YPAA page-builder block catalog",
  description: "Complete block, variant, width, nested-slot, and compatibility rules for safely editing visual-builder Pages over MCP.",
  mimeType: "application/json",
  uri: "ypaa://page-builder/block-catalog",
  handler: () => ({
    contents: [{ uri: "ypaa://page-builder/block-catalog", text: JSON.stringify(pageBuilderBlockCatalog(), null, 2) }],
  }),
};
