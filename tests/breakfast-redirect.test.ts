import assert from "node:assert/strict";
import test from "node:test";
import BreakfastPage from "../app/(frontend)/breakfast/page";

test("breakfast uses the existing register route's 307 redirect convention", () => {
  assert.throws(() => BreakfastPage(), (error: unknown) => {
    assert.equal((error as { digest?: string }).digest, "NEXT_REDIRECT;replace;https://reg.necypaact.com/checkout?mode=breakfast;307;");
    return true;
  });
});

test("incoming query parameters cannot replace the fixed breakfast mode or destination", () => {
  const invoke = BreakfastPage as (props?: unknown) => never;
  assert.throws(() => invoke({ searchParams: Promise.resolve({ mode: "registration", redirect: "https://example.invalid", url: "https://example.invalid" }) }), (error: unknown) => {
    assert.equal((error as { digest?: string }).digest, "NEXT_REDIRECT;replace;https://reg.necypaact.com/checkout?mode=breakfast;307;");
    return true;
  });
});
