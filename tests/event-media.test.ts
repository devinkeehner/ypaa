import assert from "node:assert/strict";
import test from "node:test";
import { pageDocumentToPuckData, puckDataToPagePatch } from "../puck/page-data";
import type { PageDocument } from "../puck/types";
import type { PastEvent } from "../puck/list-values";

const flyer = { id: "media-flyer", url: "https://cdn.example/flyer.jpg", alt: "Event flyer" };
const event = { title: "Bonfire", date: "December 31", image: flyer };
const builder = (events = [event]) => ({ root: { props: {} }, content: [{ type: "Events", props: { id: "events", pastEvents: events } }] });
const eventsOf = (page: PageDocument) => pageDocumentToPuckData(page).content[0].props.pastEvents as PastEvent[];

test("flyer IDs survive depth-0 reads, form saves, reloads and publishing", () => {
  const initial = builder();
  const patch = puckDataToPagePatch(initial);
  const depthZero: PageDocument = { ...patch, builderData: null };
  const formData = pageDocumentToPuckData(depthZero);
  assert.equal((formData.content[0].props.pastEvents as PastEvent[])[0].image, flyer.id);

  // Payload's form hook rebuilds the compatibility mirror from depth-0 layout.
  const saved: PageDocument = { ...patch, builderData: formData };
  const published = puckDataToPagePatch(pageDocumentToPuckData(saved));
  assert.equal((published.layout[0].pastEvents as typeof event[])[0].image, flyer.id);
  const populated = { ...published, layout: [{ ...published.layout[0], pastEvents: [event] }] };
  assert.deepEqual(eventsOf(populated)[0].image, flyer);
});

test("recovers persisted flyers from layout when the old mirror has null images", () => {
  const patch = puckDataToPagePatch(builder());
  const brokenMirror = builder([{ ...event, image: null } as unknown as typeof event]);
  const page: PageDocument = { ...patch, builderData: brokenMirror };
  const restored = pageDocumentToPuckData(page);
  assert.equal((restored.content[0].props.pastEvents as PastEvent[])[0].image, flyer.id);
  assert.equal((puckDataToPagePatch(restored).layout[0].pastEvents as typeof event[])[0].image, flyer.id);
});

test("recovery matches events after reordering and does not borrow unrelated flyers", () => {
  const page: PageDocument = {
    builderData: builder([{ title: "Other event", date: "January 1", image: null } as unknown as typeof event, { ...event, image: null } as unknown as typeof event]),
    layout: [{ blockType: "Events", id: "events", pastEvents: [event] }],
  };
  const events = eventsOf(page);
  assert.equal(events[0].image, null);
  assert.deepEqual(events[1].image, flyer);
});

test("deliberately removing a flyer clears both copies and stays removed on reload", () => {
  const cleared = puckDataToPagePatch(builder([{ ...event, image: null } as unknown as typeof event]));
  assert.equal((cleared.layout[0].pastEvents as typeof event[])[0].image, null);
  assert.equal(eventsOf(cleared)[0].image, null);
});
