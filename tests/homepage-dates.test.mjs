import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { isHomepageEntryExpired, parseHideAfter, visibleHomepageRows } from "../puck/homepage-dates.js";
import { normalizeImportantDates, normalizeUpcomingEvents, normalizePastEvents } from "../puck/list-values.js";

const expired = (date, now, hideAfter = "") => isHomepageEntryExpired(date, hideAfter, Date.parse(now));

test("date-only meetings survive their morning, evening and last millisecond in Eastern time", () => {
  for (const now of ["2026-08-16T10:00:00Z", "2026-08-17T00:00:00Z", "2026-08-17T03:59:59.999Z"]) {
    assert.equal(expired("Sunday, August 16, 2026", now), false);
  }
  assert.equal(expired("Sunday, August 16, 2026", "2026-08-17T04:00:00Z"), true);
  assert.equal(expired("2026-08-16", "2026-08-17T04:00:00Z"), true);
});

test("Eastern date cutoffs handle the 23-hour and 25-hour DST days and year rollover", () => {
  for (const [date, last, next] of [
    ["March 8, 2026", "2026-03-09T03:59:59.999Z", "2026-03-09T04:00:00Z"],
    ["November 1, 2026", "2026-11-02T04:59:59.999Z", "2026-11-02T05:00:00Z"],
    ["December 31, 2026", "2027-01-01T04:59:59.999Z", "2027-01-01T05:00:00Z"],
  ]) {
    assert.equal(expired(date, last), false);
    assert.equal(expired(date, next), true);
  }
});

test("explicit end instants expire at the cutoff and date overrides use Eastern days", () => {
  const cutoff = "2026-08-16T16:00:00-04:00";
  assert.equal(expired("Aug 16", "2026-08-16T19:59:59.999Z", cutoff), false);
  assert.equal(expired("Aug 16", "2026-08-16T20:00:00Z", cutoff), true);
  assert.equal(expired("TBA", "2026-08-17T03:59:59Z", "2026-08-16"), false);
  assert.equal(expired("TBA", "2026-08-17T04:00:00Z", "2026-08-16"), true);
  for (const cutoff of ["2026-11-01T01:30:00-04:00", "2026-11-01T01:30:00-05:00", "2026-03-08T07:00:00Z"]) {
    const instant = Date.parse(cutoff);
    assert.equal(isHomepageEntryExpired("TBA", cutoff, instant - 1), false);
    assert.equal(isHomepageEntryExpired("TBA", cutoff, instant), true);
  }
});

test("unambiguous full-year legacy dates work and unclear dates stay visible", () => {
  for (const date of ["Aug 16 2026", "August 16th, 2026", "Sunday August 16, 2026", "Sept. 1, 2026"]) {
    assert.equal(expired(date, "2026-10-03T12:00:00Z"), true);
  }
  for (const date of [undefined, null, "", "01/02/2026", "11/7", "Every Sunday", "TBA", "November 7-8", "August 16–17, 2026", "August 16, 2026 at 2 PM", "2026-08-16T14:00:00-04:00", {}, "2026-02-30", "February 29", "February 29, 2026", "April 31", "April 31, 2026"]) {
    assert.equal(expired(date, "2027-01-01T12:00:00Z"), false, String(date));
  }
});

test("published upcoming month/day formats default to 2026 through their Eastern day", () => {
  for (const date of ["November 7th", "November7th", "Nov 7", "Nov. 7th", "Saturday, November 7th", "november 7TH"]) {
    assert.equal(expired(date, "2026-11-07T12:00:00Z"), false, date);
    assert.equal(expired(date, "2026-11-08T04:59:59.999Z"), false, date);
    assert.equal(expired(date, "2026-11-08T05:00:00Z"), true, date);
  }
  for (const date of ["November 22nd", "November22nd", "Sunday, November 22nd"]) {
    assert.equal(expired(date, "2026-11-23T04:59:59.999Z"), false, date);
    assert.equal(expired(date, "2026-11-23T05:00:00Z"), true, date);
  }
});

test("the default is fixed to 2026 while explicit other years and cutoffs take precedence", () => {
  assert.equal(expired("November 7th", "2027-01-01T12:00:00Z"), true);
  assert.equal(expired("November 7th, 2027", "2027-01-01T12:00:00Z"), false);
  assert.equal(expired("November 7th, 2025", "2026-01-01T12:00:00Z"), true);
  assert.equal(expired("January 3, 2027", "2027-01-04T04:59:59.999Z"), false);
  assert.equal(expired("January 3, 2027", "2027-01-04T05:00:00Z"), true);
  assert.equal(expired("February 29, 2028", "2028-03-01T04:59:59.999Z"), false);
  assert.equal(expired("February 29, 2028", "2028-03-01T05:00:00Z"), true);
  assert.equal(expired("November 7th", "2026-11-08T05:00:00Z", "2027-11-07"), false);
  assert.equal(expired("November 7th", "2026-11-07T20:59:59.999Z", "2026-11-07T16:00:00-05:00"), false);
  assert.equal(expired("November 7th", "2026-11-07T21:00:00Z", "2026-11-07T16:00:00-05:00"), true);
});

test("yearless dates honor both DST transition days in the fixed calendar year", () => {
  for (const [date, last, next] of [
    ["March 8th", "2026-03-09T03:59:59.999Z", "2026-03-09T04:00:00Z"],
    ["November 1st", "2026-11-02T04:59:59.999Z", "2026-11-02T05:00:00Z"],
  ]) {
    assert.equal(expired(date, last), false);
    assert.equal(expired(date, next), true);
  }
});

test("invalid configuration fails open instead of rolling over or guessing a timezone", () => {
  for (const cutoff of ["bad", "2026-02-30", "2026-13-01", "2026-08-16T16:00:00", "2026-08-16T24:00:00Z", "2026-08-16T16:60:00Z", "2026-08-16T16:00:60Z", "2026-08-16T16:00:00+14:30", "2026-08-16T16:00:00+01:99", "2026-02-30T16:00:00Z"]) {
    assert.equal(parseHideAfter(cutoff), null, cutoff);
    assert.equal(expired("August 16, 2026", "2027-01-01T12:00:00Z", cutoff), false);
  }
  assert.deepEqual(parseHideAfter("2028-02-29"), { day: "2028-02-29" });
  assert.equal(isHomepageEntryExpired("August 16, 2026", "", NaN), false);
  assert.equal(isHomepageEntryExpired("August 16, 2026", "", 1e100), false);
});

test("filtering retains unknown dates, source indexes and archive flyers without mutating content", () => {
  const now = Date.parse("2026-10-03T12:00:00Z");
  const upcoming = normalizeUpcomingEvents([
    { title: "Expired", date: "August 16, 2026" },
    { title: "Future", date: "November 1, 2026", hideAfter: "2026-11-01" },
    { title: "Yearless expired", date: "Aug 16" },
    { title: "Undated", date: "" },
    { title: "Unclear", date: "TBA" },
  ]);
  const past = normalizePastEvents([
    { title: "Archived", date: "August 16, 2026", image: { id: "flyer", url: "/flyer.png" } },
    { title: "Yearless archive", date: "Aug 16", image: { id: "yearless-flyer", url: "/yearless-flyer.png" } },
  ]);
  const before = structuredClone({ upcoming, past });
  assert.deepEqual(visibleHomepageRows(upcoming, now).map(({ index }) => index), [1, 3, 4]);
  assert.deepEqual({ upcoming, past }, before);
  assert.equal(past[0].image.url, "/flyer.png");
  assert.equal(past[1].date, "Aug 16");
  assert.equal(past[1].image.url, "/yearless-flyer.png");
  const meetings = normalizeImportantDates([{ date: "Aug 16", hideAfter: "2026-08-16" }, { date: "Nov 1", hideAfter: "2026-11-01" }]);
  assert.equal(visibleHomepageRows(meetings, now)[0].item.date, "Nov 1");
  assert.equal(visibleHomepageRows(upcoming, null).length, upcoming.length);
  assert.equal(isHomepageEntryExpired("August 16, 2026", "2026-08-16", null), false);
});

test("cutoffs are independent of the server's or browser's host timezone", () => {
  const original = process.env.TZ;
  try {
    for (const TZ of ["UTC", "Asia/Tokyo", "America/Los_Angeles"]) {
      process.env.TZ = TZ;
      assert.equal(expired("November 1, 2026", "2026-11-02T04:59:59Z"), false);
      assert.equal(expired("November 1, 2026", "2026-11-02T05:00:00Z"), true);
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});

test("only the homepage route enables the public clock; archive cards remain outside filtering", async () => {
  const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
  const [home, otherPage, config] = await Promise.all([read("app/(frontend)/page.tsx"), read("app/(frontend)/[slug]/page.tsx"), read("puck/config.tsx")]);
  assert.match(home, /homepageNow=\{Date\.now\(\)\}/);
  assert.doesNotMatch(otherPage, /homepageNow/);
  assert.match(config, /const pastEvents = listForRender\(props, props\.pastEvents, normalizePastEvents\);/);
  assert.match(config, /pastEvents\.map\(\(item, index\)/);
});
