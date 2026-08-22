# Builder theme and accessibility audit

This document records the follow-up work that should be done for night mode and accessibility. It is intentionally an audit and implementation plan: this pass does not redesign the existing theme or accessibility controls.

## Night-mode findings

The current display setting changes a small set of high-level Puck canvas variables, but many campaign blocks still use literal light and dark colors. Rich text can also carry an explicit author-selected color. Together, those two systems mean that changing the display preference does not yet produce a dependable night theme across every block, nested slot, button, and rich-text fragment.

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

No existing night-mode or accessibility behavior was changed as part of this audit. The implementation work in the accompanying builder pass preserves the current controls and adds accessible semantics only where new UI was introduced.
