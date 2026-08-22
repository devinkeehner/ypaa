import assert from "node:assert/strict";
import test from "node:test";

import { contextualActionName } from "../puck/action-accessibility.js";

test("adds optional context to repeated action labels", () => {
  assert.equal(contextualActionName("Learn more", "about Al-Anon"), "Learn more — about Al-Anon");
  assert.equal(contextualActionName("Learn more", "Learn more about Al-Anon"), "Learn more about Al-Anon");
  assert.equal(contextualActionName("Learn more", "learn more about Alateen"), "learn more about Alateen");
  assert.equal(contextualActionName("Learn more", ""), undefined);
});
