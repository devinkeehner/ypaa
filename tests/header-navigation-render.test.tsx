import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { HeaderNavigationItems } from "../components/site/HeaderNavigation";
import { SiteFrame } from "../components/site/SiteFrame";
import { TenantThemeProvider, defaultTenantTheme } from "../components/site/TenantThemeProvider";
import { normalizeHeaderNavigation } from "../lib/header-navigation";

test("nested SSR exposes independent parent link and named collapsed disclosure", () => {
  const html = renderToStaticMarkup(<nav><HeaderNavigationItems items={normalizeHeaderNavigation([{ id: "duplicate", label: "Parent", url: "/parent", children: [{ label: "Child", url: "https://example.invalid/child", newTab: true, showWarning: true }] }])} onNavigate={() => {}} /></nav>);
  assert.match(html, /href="\/parent"[^>]*>Parent<\/a>/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-label="Child links for Parent"/);
  assert.match(html, /<ul[^>]*hidden=""/);
  const control = html.match(/aria-controls="([^"]+)"/)?.[1];
  assert.ok(control && html.includes(`id="${control}"`));
  assert.match(html, /href="https:\/\/example.invalid\/child"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noreferrer"/);
  assert.match(html, /opens in a new tab/);
  assert.doesNotMatch(html, /role="menu/);
});

test("flat and empty-child rows render ordinary links without disclosure controls", () => {
  const html = renderToStaticMarkup(<HeaderNavigationItems items={normalizeHeaderNavigation([{ label: "Flat", url: "/flat" }, { label: "Empty", url: "/empty", children: [] }])} onNavigate={() => {}} />);
  assert.match(html, /href="\/flat"/);
  assert.match(html, /href="\/empty"/);
  assert.doesNotMatch(html, /button|<ul|aria-expanded/);
});

test("SiteFrame renders filtered nested primary links and preserves action styles and flat fallback", () => {
  const render = (navigation: unknown) => renderToStaticMarkup(<TenantThemeProvider settings={{ ...defaultTenantTheme, headerNavigation: normalizeHeaderNavigation(navigation) }}><SiteFrame mainId="test-main"><main id="test-main">Synthetic content</main></SiteFrame></TenantThemeProvider>);
  const html = render([{ label: "Parent", url: "/parent", children: [{ label: "Disabled", url: "/program" }, { label: "Child", url: "/child" }] }, { label: "Action", url: "/action", style: "button", appearance: "outline" }]);
  assert.match(html, /Child links for Parent/);
  assert.match(html, /href="\/child"/);
  assert.doesNotMatch(html, /href="\/program"/);
  assert.match(html, /class="cms-header-action cms-header-action-outline"/);
  const fallback = render([]);
  assert.match(fallback, /href="\/#about"/);
  assert.match(fallback, /href="\/register"/);
  assert.doesNotMatch(fallback, /Child links for/);
});
