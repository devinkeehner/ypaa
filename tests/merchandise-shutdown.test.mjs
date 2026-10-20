import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(path, dependencies = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function("exports", "require", compiled)(exports, name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name));
  return exports;
}
const policy = load("../lib/merchandise-visibility.ts");
const product = { id: "synthetic-shirt", name: "Synthetic Shirt", slug: "shirt", price: 20, _status: "published", available: true, inventory: [{ id: "blue-m", quantity: 5 }], showInQuickCheckout: true };
let settings, products, orders, updates;
const payload = {
  async find(query) {
    if (query.collection === "tenants") return { docs: settings ? [settings] : [] };
    if (query.collection === "merchandise-orders") return { docs: [] };
    assert.equal(query.draft, false);
    assert.deepEqual(query.where, { and: [{ _status: { equals: "published" } }, { available: { equals: true } }] });
    return { docs: products.filter(p => p.available && p._status === "published") };
  },
  async create({ data }) { orders.push(data); return { ...data, id: "synthetic-order" }; },
  async findByID() { return product; },
  async update(input) { updates.push(input); },
};
const catalog = load("../lib/merchandise-catalog.ts", { "@payload-config": {}, payload: { getPayload: async () => payload }, "./merchandise-visibility": policy });
const route = load("../app/(payload)/api/registration-site/merchandise/route.ts", { "@payload-config": {}, payload: { getPayload: async () => payload }, "@/lib/merchandise-catalog": catalog, "next/server": { NextResponse: Response } });
const request = (body, channel = "main") => new Request(`http://synthetic.invalid/api/registration-site/merchandise?channel=${channel}`, { method: body ? "POST" : "GET", headers: { authorization: "Bearer synthetic-key", "content-type": "application/json" }, ...(body ? { body: JSON.stringify(body) } : {}) });
const selection = [{ slug: "shirt", variantId: "blue-m", quantity: 1 }];

test("sales switch matrix: online/QR independent, empty/unpublished/unavailable hidden, missing settings compatible", async () => {
  products = [product]; settings = undefined;
  assert.equal((await catalog.getMerchandiseCatalog()).enabled, true);
  settings = { onlineMerchEnabled: false, quickMerchEnabled: true };
  assert.deepEqual(await catalog.getMerchandiseCatalog(), { enabled: false, items: [] });
  assert.equal((await catalog.getMerchandiseCatalog("quick")).enabled, true);
  settings = { onlineMerchEnabled: true, quickMerchEnabled: false };
  assert.equal((await catalog.getMerchandiseCatalog()).enabled, true);
  assert.equal((await catalog.getMerchandiseCatalog("quick")).enabled, false);
  for (const hidden of [[], [{ ...product, available: false }], [{ ...product, _status: "draft" }], [{ ...product, showInMainStore: false }]]) {
    products = hidden;
    assert.equal((await catalog.getMerchandiseCatalog()).enabled, false);
  }
  products = [product];
  assert.equal((await catalog.getMerchandiseCatalog()).enabled, true);
});

test("API rejects stale/new sales after shutdown, re-enables immediately, still fulfills an existing payment", async () => {
  const previous = process.env.REGISTRATION_SITE_API_KEY;
  process.env.REGISTRATION_SITE_API_KEY = "synthetic-key";
  try {
    products = [product]; orders = []; updates = []; settings = { onlineMerchEnabled: false, quickMerchEnabled: false };
    const get = await route.GET(request());
    assert.equal(get.headers.get("cache-control"), "no-store");
    assert.deepEqual(await get.json(), { enabled: false, items: [] });
    for (const channel of ["main", "quick"]) {
      const response = await route.POST(request({ action: "quote", channel, items: selection }));
      assert.equal(response.status, 400);
      assert.match((await response.json()).error, /no longer available/);
    }
    assert.equal(orders.length, 0);
    const fulfilled = await route.POST(request({ action: "fulfill", sourceKey: "stripe:already-created", items: selection, purchaserName: "Synthetic", purchaserEmail: "buyer@example.invalid" }));
    assert.equal(fulfilled.status, 200);
    assert.equal(orders.length, 1);
    assert.equal(updates[0].data.inventory[0].quantity, 4);
    settings.onlineMerchEnabled = true;
    const quote = await route.POST(request({ action: "quote", items: selection }));
    assert.equal(quote.status, 200);
    assert.equal((await quote.json()).subtotalCents, 2000);
    const overflow = await route.POST(request({ action: "quote", items: [{ ...selection[0], quantity: 6 }] }));
    assert.equal(overflow.status, 400);
  } finally { if (previous === undefined) delete process.env.REGISTRATION_SITE_API_KEY; else process.env.REGISTRATION_SITE_API_KEY = previous; }
});

test("main storefront/detail/cart direct routes close and reopen with the catalog", async () => {
  const deps = { "@/lib/merchandise-catalog": catalog, "next/navigation": { notFound() { throw new Error("NOT_FOUND"); } }, "@/components/site/MerchandiseCatalog": { MerchandiseCatalog() {} }, "@/components/site/ProductDetail": { ProductDetail() {} }, "@/components/site/CartPage": { CartPage() {} } };
  const pages = [load("../app/(frontend)/merch/page.tsx", deps).default, load("../app/(frontend)/cart/page.tsx", deps).default, () => load("../app/(frontend)/merch/[slug]/page.tsx", deps).default({ params: Promise.resolve({ slug: "shirt" }) })];
  products = [product]; settings = { onlineMerchEnabled: false };
  for (const page of pages) await assert.rejects(page, /NOT_FOUND/);
  settings.onlineMerchEnabled = true;
  for (const page of pages) assert.ok(await page());
});

test("recognizes nested, absolute and cart handoff links without hiding unrelated registration or external sites", () => {
  for (const link of ["/merch", "/merch/shirt", "/cart", "https://www.necypaact.com/merch", "https://reg.necypaact.com/checkout?mode=merch", "https://reg.necypaact.com/?merch=[]"]) assert.equal(policy.isMerchLink(link), true, link);
  for (const link of ["/register", "/checkout?mode=breakfast", "https://unrelated.invalid/merch"]) assert.equal(policy.isMerchLink(link), false, link);
});

test("CMS merchandise CTA disappears when off and returns when on", () => {
  const React = require("react"), { renderToStaticMarkup } = require("react-dom/server");
  const theme = load("../components/site/TenantThemeProvider.tsx");
  const { MerchAwareLink } = load("../components/site/MerchAwareLink.tsx", { "./TenantThemeProvider": theme, "@/lib/merchandise-visibility": policy });
  const render = enabled => renderToStaticMarkup(React.createElement(theme.TenantThemeProvider, { settings: { ...theme.defaultTenantTheme, merchEnabled: enabled } }, React.createElement(MerchAwareLink, { href: "/merch" }, "Shop merch"), React.createElement(MerchAwareLink, { href: "/register" }, "Register")));
  assert.doesNotMatch(render(false), /Shop merch/);
  assert.match(render(false), /Register/);
  assert.match(render(true), /Shop merch/);
});
