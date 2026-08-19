import assert from "node:assert/strict";
import test from "node:test";

import { extractLexicalTextColor } from "../puck/rich-text-style.mjs";

test("extracts safe hexadecimal text colors from Lexical styles", () => {
  assert.equal(extractLexicalTextColor("font-size: 18px; color: #A1b2C3;"), "#A1b2C3");
  assert.equal(extractLexicalTextColor("color:#abc"), "#abc");
  assert.equal(extractLexicalTextColor("COLOR: #11223344"), "#11223344");
});

test("rejects malformed or unsafe text colors", () => {
  assert.equal(extractLexicalTextColor("color: red"), undefined);
  assert.equal(extractLexicalTextColor("color: url(https://example.com/value)"), undefined);
  assert.equal(extractLexicalTextColor("background: #123456"), undefined);
  assert.equal(extractLexicalTextColor(null), undefined);
});
