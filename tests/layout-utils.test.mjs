import assert from "node:assert/strict";
import test from "node:test";

import { layoutColumnCount, normalizeLayoutColumns } from "../puck/layout-utils.mjs";

test("maps campaign row layouts to their visible column counts", () => {
  assert.equal(layoutColumnCount("one"), 1);
  assert.equal(layoutColumnCount("two"), 2);
  assert.equal(layoutColumnCount("leftWide"), 2);
  assert.equal(layoutColumnCount("rightWide"), 2);
  assert.equal(layoutColumnCount("three"), 3);
  assert.equal(layoutColumnCount("four"), 4);
});

test("adds empty columns without discarding existing nested content", () => {
  const existing = [{ label: "Main", blocks: [{ type: "Text" }] }];
  const normalized = normalizeLayoutColumns("three", existing);
  assert.equal(normalized.length, 3);
  assert.deepEqual(normalized[0], existing[0]);
  assert.deepEqual(normalized.slice(1), [{ label: "Column 2" }, { label: "Column 3" }]);
  assert.equal(normalizeLayoutColumns("two", normalized).length, 3);
});
