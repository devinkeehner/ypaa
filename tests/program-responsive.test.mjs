import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("program keeps its responsive app and accessibility contracts", async () => {
  const [component, css, preview] = await Promise.all([
    readFile(new URL("../components/site/ProgramExplorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/(frontend)/program-preview/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /@media \(max-width: 900px\)/, "portrait tablets should use the mobile agenda layout");
  assert.match(css, /@media \(max-width: 360px\)/, "compact phones need dedicated sizing");
  assert.match(css, /@media \(max-width: 900px\) and \(max-height: 600px\)/, "short landscape screens need a compact sticky stack");
  assert.match(css, /touch-action: pan-y/, "day swiping must preserve vertical page scrolling");
  assert.match(component, /Math\.abs\(dx\) < Math\.abs\(dy\) \* 1\.25/, "vertical gestures must not change days");
  assert.match(component, /onPointerUp=\{finishDaySwipe\}/, "the mobile agenda must respond to day swipes");
  assert.match(component, /All rooms/, "the mobile agenda must allow all rooms");
  assert.match(component, /Clear filters/, "filtered empty states must offer recovery");
  assert.match(component, /aria-live="polite"/, "day changes must be announced");
  assert.match(component, /aria-expanded=\{expanded\}/, "mobile session details must use an accessible inline disclosure");
  assert.match(component, /program-mobile-session-details/, "mobile session details must remain in the schedule instead of opening a modal");
  assert.match(css, /--program-time-column: 86px/, "phone time labels need protected space before the room rail");
  assert.match(preview, /program-preview-banner[\s\S]*Program Board/, "the private preview needs a compact board escape hatch");
});
