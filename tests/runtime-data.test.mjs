import assert from "node:assert/strict";
import test from "node:test";

import { hydrateExpandedMedia, isRenderableMediaString } from "../puck/runtime-data.mjs";

test("hydrates matching Payload media IDs without replacing builder content", () => {
  const builder = {
    content: [{ type: "HeroAlt", props: { id: "hero", heading: "Builder heading", headingLogo: "media-1" } }],
  };
  const layout = {
    content: [{ type: "HeroAlt", props: { id: "hero", heading: "Layout heading", headingLogo: { id: "media-1", url: "https://cdn.example/logo.svg", alt: "Logo" } } }],
  };

  assert.deepEqual(hydrateExpandedMedia(builder, layout), {
    content: [{ type: "HeroAlt", props: { id: "hero", heading: "Builder heading", headingLogo: { id: "media-1", url: "https://cdn.example/logo.svg", alt: "Logo" } } }],
  });
});

test("does not mistake Payload IDs for image URLs", () => {
  assert.equal(isRenderableMediaString("6a83c7a09f43a8310abc3409"), false);
  assert.equal(isRenderableMediaString("https://cdn.example/logo.svg"), true);
  assert.equal(isRenderableMediaString("/images/logo.svg"), true);
});
