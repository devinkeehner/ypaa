import assert from "node:assert/strict";
import test from "node:test";
import { Header } from "../globals/Header";
import { HEADER_CHILD_LIMIT, filterHeaderNavigation, headerNavigationKey, normalizeHeaderNavigation, validateHeaderChildren, validateNavigationLabel, validateNavigationRows, validateNavigationUrl } from "../lib/header-navigation";

const link = { label: "Existing link", url: "/#existing", newTab: true, showWarning: true };

test("legacy flat rows preserve destinations, styles and warning flags", () => {
  const rows = normalizeHeaderNavigation([link, { label: "Action", url: "https://example.invalid", style: "button", appearance: "outline" }]);
  assert.equal(rows[0].url, link.url);
  assert.equal(rows[0].style, "link");
  assert.equal(rows[0].newTab, true);
  assert.equal(rows[0].showWarning, true);
  assert.equal(rows[0].children, undefined);
  assert.equal(rows[1].style, "button");
  assert.equal(rows[1].appearance, "outline");
});

test("optional children retain their own flags; only one child level is normalized", () => {
  const rows = normalizeHeaderNavigation([{ ...link, children: [{ id: "child", label: " Child ", url: " /child ", children: [link] }, link] }]);
  assert.equal(rows[0].children?.length, 2);
  assert.deepEqual(rows[0].children?.[0], { id: "child", label: "Child", url: "/child", newTab: false, showWarning: false });
  assert.equal(rows[0].children?.[1].showWarning, true);
  assert.equal(rows[0].children?.[1].newTab, true);
  assert.equal(normalizeHeaderNavigation([{ ...link, style: "button", children: [link] }])[0].children, undefined);
});

test("empty labels, malformed rows and unsafe URLs are rejected without invented links", () => {
  for (const value of [undefined, null, 1, "", "  ", "bad\nlabel"]) assert.notEqual(validateNavigationLabel(value), true);
  for (const value of ["", " ", "javascript:alert(1)", "data:text/html,test", "//evil.invalid", "/\\evil.invalid", "/%2fevil.invalid", "https://", "https:relative", "http://bad host", "mailto:", "tel:", "#", "relative/path"]) assert.notEqual(validateNavigationUrl(value), true, value);
  for (const value of ["/", "/child?x=1#section", "#section", "https://example.invalid/child", "http://example.invalid", "mailto:guest@example.invalid", "tel:+18605550100"]) assert.equal(validateNavigationUrl(value), true, value);
  assert.deepEqual(normalizeHeaderNavigation([null, {}, { label: "", url: "/" }, { ...link, url: "javascript:alert(1)" }]), []);
  assert.deepEqual(normalizeHeaderNavigation(undefined), []);
  assert.equal(normalizeHeaderNavigation([{ ...link, children: [null, {}, link] }])[0].children?.length, 1);
});

test("depth, child count, button groups and duplicate row IDs are validated", () => {
  assert.equal(validateHeaderChildren(undefined), true);
  assert.equal(validateHeaderChildren([]), true);
  assert.equal(validateHeaderChildren([link], { style: "link" }), true);
  assert.notEqual(validateHeaderChildren([link], { style: "button" }), true);
  assert.notEqual(validateHeaderChildren([{ ...link, children: [link] }]), true);
  assert.notEqual(validateHeaderChildren(Array.from({ length: HEADER_CHILD_LIMIT + 1 }, () => link)), true);
  assert.equal(normalizeHeaderNavigation([{ ...link, children: Array.from({ length: HEADER_CHILD_LIMIT + 1 }, () => link) }])[0].children?.length, HEADER_CHILD_LIMIT);
  assert.notEqual(validateNavigationRows([{ ...link, id: "same" }, { ...link, id: "same" }]), true);
  assert.equal(validateNavigationRows([link, link]), true, "Duplicate destinations are legal; they do not become duplicate render keys");
  assert.notEqual(headerNavigationKey({ ...link, id: "same" }, 0), headerNavigationKey({ ...link, id: "same" }, 1));
  assert.notEqual(headerNavigationKey(link, 0), headerNavigationKey(link, 1));
});

test("the existing public-route filter also applies to children and empty groups become flat", () => {
  const rows = filterHeaderNavigation(normalizeHeaderNavigation([{ ...link, children: [{ ...link, url: "/program" }, { ...link, url: "/program#day" }] }, { ...link, url: "/program", children: [link] }]), (url) => url.split(/[?#]/)[0] !== "/program");
  assert.equal(rows.length, 1);
  assert.deepEqual(rows[0].children, []);
});

test("Payload global exposes editable children with the existing fields and access intact", () => {
  const navigation = Header.fields.find((field) => "name" in field && field.name === "navigation");
  assert.ok(navigation?.type === "array");
  assert.equal(navigation.validate, validateNavigationRows);
  assert.ok(navigation.fields.find((field) => "name" in field && field.name === "url" && "required" in field && field.required));
  const children = navigation.fields.find((field) => "name" in field && field.name === "children");
  assert.ok(children?.type === "array");
  assert.equal(children.maxRows, HEADER_CHILD_LIMIT);
  assert.deepEqual(children.fields.map((field) => "name" in field ? field.name : ""), ["label", "url", "newTab", "showWarning"]);
  assert.equal(children.admin?.condition?.({}, { style: "button" }, {} as never), false);
  assert.equal(children.admin?.condition?.({}, { style: "button", children: [link] }, {} as never), true, "Existing children remain editable so they can be removed before saving an action");
  assert.equal(children.admin?.condition?.({}, { style: "link" }, {} as never), true);
  assert.equal(Header.access?.read?.({} as never), true);
  assert.equal(Header.access?.update?.({ req: {} } as never), false);
  assert.equal(Header.access?.update?.({ req: { user: { id: "synthetic" } } } as never), true);
});
