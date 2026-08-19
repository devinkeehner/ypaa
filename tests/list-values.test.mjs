import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeImportantDates,
  normalizeMeetings,
  normalizePastEvents,
} from "../puck/list-values.js";

test("normalizes legacy newline lists and structured Payload rows", () => {
  assert.deepEqual(
    normalizeImportantDates("Dec 31 — Convention opens\nJan 3 — Convention closes"),
    [
      { date: "Dec 31", label: "Convention opens" },
      { date: "Jan 3", label: "Convention closes" },
    ],
  );
  assert.deepEqual(
    normalizeImportantDates([{ date: "Aug 16", label: "Business meeting", id: "row-1" }]),
    [{ date: "Aug 16", label: "Business meeting" }],
  );
});

test("normalizes past events and meeting directory entries", () => {
  assert.deepEqual(normalizePastEvents(["Zombie Prom — February 13, 2026"]), [
    { title: "Zombie Prom", date: "February 13, 2026" },
  ]);
  assert.deepEqual(
    normalizePastEvents([{ title: "Bonfire", date: "December 31", image: { id: 7, url: "/api/media/file/bonfire.jpg", alt: "A bonfire" } }]),
    [{ title: "Bonfire", date: "December 31", image: { id: 7, url: "/api/media/file/bonfire.jpg", alt: "A bonfire" } }],
  );
  assert.deepEqual(
    normalizeMeetings([{ title: "Connecticut YPAA", state: "Connecticut" }]),
    [{ name: "Connecticut YPAA", location: "Connecticut" }],
  );
});

test("invalid editor-transformed and empty values are safe", () => {
  assert.deepEqual(normalizeImportantDates({ type: "InlineTextField", props: {} }), []);
  assert.deepEqual(normalizePastEvents(null), []);
  assert.deepEqual(normalizeMeetings(undefined), []);
});

test("preserves only the hidden rich-text map on structured rows", () => {
  const puckRichText = {
    date: { enabled: true, value: { root: { children: [] } } },
  };

  assert.deepEqual(
    normalizeImportantDates([{ date: "Aug 16", label: "Business meeting", id: "row-1", puckRichText }]),
    [{ date: "Aug 16", label: "Business meeting", puckRichText }],
  );
});
