/**
 * Blocks that can be placed inside a section, row, card, or tab slot.
 * Sections and rows are deliberately excluded so nested areas stay element-only.
 */
export const ELEMENT_DROP_TYPES = [
  "Headline",
  "Text",
  "ImageCaption",
  "ButtonRow",
  "Divider",
  "Video",
  "Embed",
  "Countdown",
  "FollowLinks",
  "InlineForm",
  "PayPal",
] as string[];

/**
 * Campaign's strongest reusable families, without compatibility-only or
 * single-use home blocks. The component registry remains broader so existing
 * pages continue to render; this list controls what authors are offered.
 */
export const REUSABLE_SECTION_TYPES = [
  "HeroAlt",
  "AboutAlt",
  "CardsGridAlt",
  "PalmCardPointsAlt",
  "PalmCardBioAlt",
  "TestimonialAlt",
  "PalmCardAlt",
  "PalmCardContactAlt",
  "PalmCardMastheadAlt",
  "PalmCardGalleryAlt",
  "FeatureFamilyAlt",
  "ComposableCardsAlt",
  "StatsAlt",
  "LogoCloudAlt",
  "CTAFamilyAlt",
  "TabbedContentAlt",
  "MediaGalleryAlt",
  "FormBlockAlt",
  "MeetingScheduleAlt",
  "FacebookFeedAlt",
  "BannerAlt",
] as string[];

export const REUSABLE_ROW_TYPES = [
  "Section",
  "RowOneColumn",
  "RowTwoColumns",
  "RowLeftWide",
  "RowRightWide",
  "RowThreeColumns",
  "RowFourColumns",
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
  "PalmCardGalleryAlt",
  "FeatureFamilyAlt",
  "ComposableCardsAlt",
  "StatsAlt",
  "LogoCloudAlt",
  "CTAFamilyAlt",
  "TabbedContentAlt",
  "MediaGalleryAlt",
  "FormBlockAlt",
  "MeetingScheduleAlt",
  "FacebookFeedAlt",
  "BannerAlt",
]);

export function afterContentZoneID(blockID: string) {
  return `${blockID}:afterContent`;
}

export function bottomContentZoneID(blockID: string) {
  return `${blockID}:bottomContent`;
}
