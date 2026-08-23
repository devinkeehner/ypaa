# Builder theme and accessibility audit

This document records the night-mode and accessibility audit and its implementation status.

## Implementation status — August 22, 2026

Completed in the first implementation pass:

- Added shared semantic canvas, surface, elevated-surface, text, muted-text, border, link, action, on-action, and focus tokens to both builder and published-page wrappers.
- Made dark mode the default adaptive presentation while retaining explicit always-light, always-dark, and branded section choices.
- Connected public text sizing to the document root so `rem` and `clamp()` typography scales consistently.
- Expanded extra-contrast behavior across the public shell and Puck blocks, including forced-colors support.
- Added dark, light, and extra-contrast preview controls to the visual builder.
- Added theme-pair contrast warnings and made new rich text and button colors inherit safely by default.
- Added focus entry, Escape handling, focus containment, and trigger restoration for display settings and leaving-site dialogs; added Escape handling for mobile navigation.
- Added Arrow, Home, and End keyboard behavior and complete tab/panel relationships to both tab families.

Completed in the all-block typography and theme pass:

- Added one shared relative typography ladder for H1, H2, H3, H4, explanatory subheadings, paragraphs, quotes, statistics/display values, captions/small text, eyebrow labels, and actions.
- Replaced the visual builder's free-form size inputs with a semantic size picker. Existing custom CSS sizes continue to render as a labeled legacy value until an author chooses a shared role.
- Made introductory and explanatory copy consistently use the subheading role while ordinary copy uses the paragraph role.
- Converted campaign, Palm, card, quote, statistic, form, tab, accordion, media-placeholder, and nested-panel surfaces to adaptive canvas tokens.
- Expanded high-contrast remapping across every registered block family and its common nested surfaces.
- Added contract tests for the complete type-role set, H4 authoring, adaptive special surfaces, and legacy-size compatibility.

Still requires ongoing content and release QA:

- Review intentional author overrides and older saved custom button/rich-text colors; they remain preserved for compatibility and can still fail contrast.
- Add heading-order analysis that understands every legacy string and Lexical document without silently rewriting author content.
- Add persistent form errors and live submission status when placeholder forms are connected to real submission handlers.
- Complete screen-reader, 200%/400% zoom, browser forced-colors, and full visual-regression matrices for every block variant before launch.

## Night-mode findings and resolution

The original audit found that the display setting changed only a small set of high-level variables while many campaign blocks used literal light and dark colors. Registered block-family surfaces now resolve through the shared adaptive canvas tokens, and high-contrast mode explicitly remaps their nested cards, forms, tabs, accordions, and panels. Rich text can still carry an explicit author-selected color; that remains an intentional override and is surfaced for review rather than silently discarded.

The safest implementation is a semantic token layer rather than a global color inversion:

- Define paired tokens for canvas, surface, elevated surface, text, muted text, border, accent, action, and each corresponding `on-*` foreground.
- Give every neutral section presentation light and dark values. Preserve deliberately branded `primary`, `secondary`, and dark presentations unless the author explicitly opts into an adaptive presentation.
- Let rich text inherit its section color by default. Treat a manually selected rich-text color as an author override and validate its contrast against the resolved section background.
- Keep button color on `Auto` by default so it derives a safe background, border, foreground, hover, and focus treatment from the containing section. Validate custom button pairs before publishing.
- Add a light/dark preview control to the visual builder so authors can inspect both modes without changing the saved page.
- Migrate older content with fallbacks at render time first. Only write new token values when the author changes a field, avoiding a destructive bulk rewrite.

Before launch, capture a visual regression matrix for every variant at contained, wide, and full-bleed widths, including nested rows, cards, slots, explicit rich-text colors, custom buttons, high contrast, and reduced motion.

## Accessibility findings

### Existing strengths

- Public pages include a skip link and semantic header, navigation, main, section, article, heading, and list structures in the major templates.
- Media is tied to Payload Media metadata, where alternative text is required.
- Tabs and accordions expose labels, selected/expanded state, and panel relationships.
- The display menu already offers text scaling, contrast, and reduced-motion preferences.
- The new Icon element requires a meaningful accessible label for an icon that conveys information; decorative icons are hidden from assistive technology.

### Gaps to address

1. The display-settings panel and mobile navigation need a complete focus lifecycle: move focus on open, constrain it while open, support Escape, and restore focus to the trigger on close.
2. Tab lists need Left/Right Arrow, Home, and End keyboard behavior in addition to normal Tab activation.
3. Tenant colors, rich-text colors, and custom button pairs need automated contrast validation for normal text, large text, borders, focus indicators, and hover states.
4. Rich text currently permits authors to create a second page-level heading or skip heading levels. The editor should warn without silently rewriting content.
5. Author-written labels such as “Learn more” can become ambiguous when repeated. Add an optional accessible name or contextual suffix to links and buttons.
6. High-contrast mode remaps only part of the palette; literal colors inside campaign variants can escape it until the semantic token work is complete.
7. Fixed minimum sizes and multi-column presentations need manual reflow testing at 200% and 400% zoom, including the visual builder itself.
8. Form variants need persistent, programmatic field errors and submission-status announcements when they are connected to a real handler.
9. Media authors still need guidance for useful alternative text versus decorative empty text, even though the field is required.

## Recommended order

1. Semantic theme and contrast tokens.
2. Dialog, navigation, and tab keyboard/focus behavior.
3. Authoring guardrails for contrast, heading order, labels, and alternative text.
4. Automated axe checks plus manual keyboard, screen-reader, 200%/400% zoom, forced-colors, reduced-motion, desktop, and mobile testing.

The implementation preserves saved page data and applies compatibility fallbacks at render time. Explicit author-selected colors remain authoritative and are surfaced for review rather than silently rewritten.
