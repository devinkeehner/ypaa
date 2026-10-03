import assert from "node:assert/strict";
import test from "node:test";
import { pageDocumentToPuckData, puckDataToPagePatch } from "../puck/page-data";
import type { NECYPAAData } from "../puck/types";

test("cutoffs survive Payload layout saves, builder reloads and publishing with archive flyers intact", () => {
  const data: NECYPAAData = {
    root: { props: {} },
    content: [
      { type: "MeetingInfo", props: { id: "meeting", date: "Aug 16", hideAfter: "2026-08-16", importantDates: [{ date: "Nov 1", hideAfter: "2026-11-01T16:00:00-05:00" }] } },
      { type: "Events", props: { id: "events", upcomingDate: "Aug 22", upcomingHideAfter: "2026-08-22", upcomingEvents: [{ title: "Future", date: "Dec 31", hideAfter: "2026-12-31" }], pastEvents: [{ id: "archive", title: "History", date: "February 13, 2026", image: "flyer-id" }] } },
    ],
    zones: { "section:blocks": [{ type: "Events", props: { id: "nested-events", upcomingDate: "Aug 22", upcomingHideAfter: "2026-08-22" } }] },
  };
  const before = structuredClone(data);
  const patch = puckDataToPagePatch(data);
  const reloaded = pageDocumentToPuckData({ ...patch, builderData: null });
  const republished = puckDataToPagePatch(reloaded);
  assert.equal(republished.layout[0].hideAfter, "2026-08-16");
  assert.equal((republished.layout[0].importantDates as Array<{ hideAfter: string }>)[0].hideAfter, "2026-11-01T16:00:00-05:00");
  assert.equal(republished.layout[1].upcomingHideAfter, "2026-08-22");
  assert.equal((republished.layout[1].upcomingEvents as Array<{ hideAfter: string }>)[0].hideAfter, "2026-12-31");
  assert.deepEqual(republished.layout[1].pastEvents, before.content[1].props.pastEvents);
  assert.equal(pageDocumentToPuckData({ builderData: data }).zones?.["section:blocks"][0].props.upcomingHideAfter, "2026-08-22");
  assert.deepEqual(data, before);
});
