import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("program keeps its responsive app and accessibility contracts", async () => {
  const [component, css, preview] = await Promise.all([
    readFile(new URL("../components/site/ProgramExplorer.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/(frontend)/program-preview/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(css, /@media \(max-width: 900px\)/, "portrait tablets should use the one-room app layout");
  assert.match(css, /@media \(max-width: 360px\)/, "compact phones need dedicated sizing");
  assert.match(css, /@media \(max-width: 900px\) and \(max-height: 600px\)/, "short landscape screens need a compact sticky stack");
  assert.match(css, /touch-action: pan-y/, "room swiping must preserve vertical page scrolling");
  assert.match(component, /Math\.abs\(distanceX\) < Math\.abs\(distanceY\) \* 1\.2/, "vertical gestures must not change rooms");
  assert.match(component, /Clear filters/, "filtered empty states must offer recovery");
  assert.match(component, /aria-live="polite"/, "room changes must be announced");
  assert.match(preview, /program-preview-banner[\s\S]*Program Board/, "the private preview needs a compact board escape hatch");
});
