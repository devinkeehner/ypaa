export type CampaignAltPalette = "sections" | "rows" | "elements";
export type CampaignAltKind = "archive" | "banner" | "cards" | "columns" | "content" | "cta" | "feed" | "form" | "hero" | "media" | "menu" | "profile" | "proof" | "schedule" | "tabs";

export type CampaignAltDefinition = {
  type: string;
  sourceSlug: string;
  label: string;
  kind: CampaignAltKind;
  palette: CampaignAltPalette;
  variants: readonly string[];
  presentations?: readonly string[];
  nestedCollection?: "cards" | "columns" | "tabs";
};

const standardPresentations = ["contained", "wide", "fullBleed"] as const;

const campaignAltDefinitionData = [
  { type: "HeroAlt", sourceSlug: "heroFamily", label: "Hero Alt", kind: "hero", palette: "sections", variants: ["splitSpotlight", "centeredStatement", "ribbonOverlay", "mediaFocus", "campaignPoster", "photoOverlay", "splitCandidate", "officialMasthead", "grassrootsAction", "civicOutdoors", "civicOutdoorsPanel"], presentations: standardPresentations },
  { type: "AboutAlt", sourceSlug: "aboutFamily", label: "Bio Section", kind: "profile", palette: "sections", variants: ["splitProfile", "storyStack", "checklist"] },
  { type: "PalmCardMastheadAlt", sourceSlug: "palmCardMasthead", label: "Palm Card Masthead", kind: "hero", palette: "sections", variants: ["poster", "namePlate", "photoSplit"], presentations: standardPresentations },
  { type: "PalmCardPointsAlt", sourceSlug: "palmCardPoints", label: "Palm Card Points", kind: "cards", palette: "sections", variants: ["checklist", "iconCards", "twoColumn"], presentations: standardPresentations },
  { type: "PalmCardBioAlt", sourceSlug: "palmCardBio", label: "Palm Card Bio", kind: "profile", palette: "sections", variants: ["shortBio", "profileSplit", "quoteBio"], presentations: standardPresentations },
  { type: "PalmCardGalleryAlt", sourceSlug: "palmCardGallery", label: "Palm Card Gallery", kind: "media", palette: "sections", variants: ["photoStrip", "featureCollage", "storyPanel"], presentations: standardPresentations },
  { type: "PalmCardContactAlt", sourceSlug: "palmCardContact", label: "Palm Card Contact", kind: "cta", palette: "sections", variants: ["contactPanel", "footerBand", "splitAction"], presentations: standardPresentations },
  { type: "PalmCardAlt", sourceSlug: "palmCardBlock", label: "Palm Card Content", kind: "cards", palette: "sections", variants: ["compactList", "splitProfile", "issueBriefs"], presentations: standardPresentations },
  { type: "FeatureFamilyAlt", sourceSlug: "featureFamily", label: "Feature Family Alt", kind: "cards", palette: "sections", variants: ["cards", "editorial", "tabs", "stacked", "alternatingBand"], presentations: standardPresentations },
  { type: "CardsGridAlt", sourceSlug: "cardsGrid", label: "Issues Cards", kind: "cards", palette: "sections", variants: ["imageOverlay", "infoCards", "iconCards", "editorialGrid"], presentations: standardPresentations },
  { type: "ComposableCardsAlt", sourceSlug: "composableCards", label: "Composable Cards Alt", kind: "cards", palette: "sections", variants: ["imageOverlay", "infoCards", "iconCards", "editorialGrid"], presentations: standardPresentations, nestedCollection: "cards" },
  { type: "TestimonialAlt", sourceSlug: "testimonialBlock", label: "Quote / Testimonial", kind: "proof", palette: "sections", variants: ["contained", "editorial", "spotlight"], presentations: standardPresentations },
  { type: "StatsAlt", sourceSlug: "statsBlock", label: "Stats Alt", kind: "proof", palette: "sections", variants: ["compact", "panel", "ranked"], presentations: standardPresentations },
  { type: "LogoCloudAlt", sourceSlug: "logoCloudBlock", label: "Logo Cloud Alt", kind: "proof", palette: "sections", variants: ["grid", "officialEndorsement", "band"], presentations: standardPresentations },
  { type: "ProofFamilyAlt", sourceSlug: "proofFamily", label: "Proof Family Alt", kind: "proof", palette: "sections", variants: ["testimonialCards", "statsStrip", "logoCloud"] },
  { type: "CTAFamilyAlt", sourceSlug: "ctaFamily", label: "CTA Family Alt", kind: "cta", palette: "sections", variants: ["boxed", "banner", "split"], presentations: standardPresentations },
  { type: "ColumnsAlt", sourceSlug: "columnsBlock", label: "Columns Alt", kind: "columns", palette: "rows", variants: ["oneColumn", "twoEqual", "oneThirdTwoThirds", "twoThirdsOneThird", "threeEqual", "fourEqual"], presentations: standardPresentations, nestedCollection: "columns" },
  { type: "TabbedContentAlt", sourceSlug: "tabbedContent", label: "Tabbed Content Alt", kind: "tabs", palette: "sections", variants: ["horizontal", "sideTabs", "accordion"], presentations: standardPresentations, nestedCollection: "tabs" },
  { type: "MediaBlockAlt", sourceSlug: "mediaBlock", label: "Media Block Alt", kind: "media", palette: "elements", variants: ["default"] },
  { type: "MediaGalleryAlt", sourceSlug: "mediaGallery", label: "Media Gallery Alt", kind: "media", palette: "sections", variants: ["auto", "small", "medium", "large"] },
  { type: "FormBlockAlt", sourceSlug: "formBlock", label: "Form Block Alt", kind: "form", palette: "sections", variants: ["standard", "campaign", "split"] },
  { type: "MenuBlockAlt", sourceSlug: "menuBlock", label: "Menu Block Alt", kind: "menu", palette: "sections", variants: ["default"] },
  { type: "MeetingScheduleAlt", sourceSlug: "meetingSchedule", label: "Meeting Schedule Alt", kind: "schedule", palette: "sections", variants: ["default"] },
  { type: "ArchiveAlt", sourceSlug: "archive", label: "Archive Alt", kind: "archive", palette: "sections", variants: ["default"] },
  { type: "FacebookFeedAlt", sourceSlug: "facebookFeed", label: "Facebook Feed Alt", kind: "feed", palette: "sections", variants: ["cards", "mosaic", "staggered", "carousel", "flyerLightbox"] },
  { type: "BannerAlt", sourceSlug: "banner", label: "Banner Alt", kind: "banner", palette: "sections", variants: ["info", "warning", "error", "success"] },
  { type: "ButtonRowAlt", sourceSlug: "buttonRow", label: "Button Row Alt", kind: "cta", palette: "elements", variants: ["default"] },
  { type: "InlineRichTextAlt", sourceSlug: "inlineRichText", label: "Inline Rich Text Alt", kind: "content", palette: "elements", variants: ["default"], presentations: standardPresentations },
  { type: "SimpleFormAlt", sourceSlug: "simpleFormBlock", label: "Simple Form Alt", kind: "form", palette: "sections", variants: ["default"] },
  { type: "TextElementAlt", sourceSlug: "textElement", label: "Text Element Alt", kind: "content", palette: "elements", variants: ["default"] },
] as const satisfies readonly CampaignAltDefinition[];

export type CampaignAltType = (typeof campaignAltDefinitionData)[number]["type"];

export const campaignAltDefinitions: readonly CampaignAltDefinition[] = campaignAltDefinitionData;

export const campaignAltTypes = campaignAltDefinitions.map((definition) => definition.type) as CampaignAltType[];
export const campaignAltTypesByPalette = {
  sections: campaignAltDefinitions.filter((definition) => definition.palette === "sections").map((definition) => definition.type) as CampaignAltType[],
  rows: campaignAltDefinitions.filter((definition) => definition.palette === "rows").map((definition) => definition.type) as CampaignAltType[],
  elements: campaignAltDefinitions.filter((definition) => definition.palette === "elements").map((definition) => definition.type) as CampaignAltType[],
} satisfies Record<CampaignAltPalette, CampaignAltType[]>;
