import { campaignAltTypesByPalette } from "./campaign-alt-definitions";

/**
 * Blocks that can be placed inside a section, row, card, or tab slot.
 * Sections and rows are deliberately excluded so nested areas stay element-only.
 */
export const ELEMENT_DROP_TYPES = [
  "Image",
  "RichText",
  "FreeText",
  "Text",
  "Button",
  "Countdown",
  "ButtonRow",
  "Headline",
  "Divider",
  "BulletedList",
  "ImageCaption",
  "Video",
  "Embed",
  "FollowLinks",
  "InlineForm",
  "PayPal",
  "Navigation",
  ...campaignAltTypesByPalette.elements,
] as string[];

/**
 * Reusable section blocks that receive a Campaign-style element bridge.
 * HeroAlt and the automatically-created home-page sections are intentionally absent.
 */
export const AFTER_CONTENT_BLOCK_TYPES = new Set([
  "AboutAlt",
  "CardsGridAlt",
  "PalmCardPointsAlt",
  "PalmCardBioAlt",
  "TestimonialAlt",
  "PalmCardAlt",
  "PalmCardContactAlt",
]);

export function afterContentZoneID(blockID: string) {
  return `${blockID}:afterContent`;
}
