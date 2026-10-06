# Global header child links

The Payload **Global header → Navigation items** array keeps its existing label, required URL, style, appearance, new-tab and leaving-site warning fields. Navigation-link rows now have optional **Child links** with label, URL, new-tab and warning settings. Nothing seeds, rewrites or publishes navigation content.

There are two levels total, with up to 12 child links per parent and no grandchildren. Button / action rows stay direct links and cannot contain children. Empty child arrays render exactly as flat links. Parent labels always follow their required URL; the adjacent “Child links for …” button opens the children independently. Editors can reorder children using the standard Payload array controls.

Labels must contain text and no control characters. URLs can be root-relative paths, non-empty fragments, or http, https, mailto and tel destinations; whitespace, backslashes, protocol-relative links and executable schemes are rejected. The public mapper drops malformed rows without inventing replacement destinations, ignores deeper child data and caps imported child arrays. Duplicate destinations are allowed; duplicate supplied IDs within a sibling array are rejected by schema validation, and indexed rendering keys also protect older imported records. The existing disabled public-route filter applies to parents and children.

Desktop uses a disclosure dropdown; mobile uses an expandable group inside the current navigation panel. Links retain ordinary Tab navigation. Enter/Space operate the toggle, Down/Up open and focus the first/last child, Escape closes a group and restores focus to its toggle. Another Escape closes the mobile panel and restores focus to its menu button. Moving focus outside a group or pressing elsewhere closes it. Resize resets disclosures. Leaving-site warnings keep their originating links mounted so “Stay here” can restore focus. Child new-tab flags retain their screen-reader description and noreferrer relationship.

## Local verification

No database, actual CMS global writes, forms, emails or external navigation are required:

```sh
node --import tsx tests/header-navigation.test.ts
node --import tsx --import ./tests/header-navigation-hooks.mjs tests/header-navigation-render.test.tsx
npx tsc --noEmit --incremental false
node scripts/header-navigation-fixture.mjs
# In a second terminal, after the disposable fixture is ready:
node tests/header-navigation.browser.mjs
```

The fixture runs the actual SiteFrame, navigation components and global styles in a disposable Next app under `/tmp` using synthetic navigation only. Browser evidence defaults to `/tmp/ypaa-header-navigation-evidence`. Set HEADER_NAVIGATION_TEST_PORT and HEADER_NAVIGATION_TEST_URL together to change the local port. Browser tests stay on localhost and check outbound-link attributes and warning cancellation without following an external destination. SSR tests use a CSS-module stub; the browser checks use real CSS.

The generated `payload-types.ts` is intentionally excluded from this isolated patch. Regenerate it once after this patch and the pending program/orders/app schema changes are combined. This branch's schema and frontend use their own structural navigation type in the meantime.
