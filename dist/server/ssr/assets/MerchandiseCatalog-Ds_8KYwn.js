import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
import { t as Search } from "./search-Bb93QS8I.js";
import { a as merchandiseTypeLabels, o as totalInventory, t as formatMerchandisePrice } from "./merch-DKDvAe3E.js";
import { SiteFrame, i as ShoppingBag } from "./SiteFrame-5pF_eYdh.js";
//#region node_modules/lucide-react/dist/esm/icons/sliders-horizontal.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var SlidersHorizontal = createLucideIcon("SlidersHorizontal", [
	["line", {
		x1: "21",
		x2: "14",
		y1: "4",
		y2: "4",
		key: "obuewd"
	}],
	["line", {
		x1: "10",
		x2: "3",
		y1: "4",
		y2: "4",
		key: "1q6298"
	}],
	["line", {
		x1: "21",
		x2: "12",
		y1: "12",
		y2: "12",
		key: "1iu8h1"
	}],
	["line", {
		x1: "8",
		x2: "3",
		y1: "12",
		y2: "12",
		key: "ntss68"
	}],
	["line", {
		x1: "21",
		x2: "16",
		y1: "20",
		y2: "20",
		key: "14d8ph"
	}],
	["line", {
		x1: "12",
		x2: "3",
		y1: "20",
		y2: "20",
		key: "m0wm8r"
	}],
	["line", {
		x1: "14",
		x2: "14",
		y1: "2",
		y2: "6",
		key: "14e1ph"
	}],
	["line", {
		x1: "8",
		x2: "8",
		y1: "10",
		y2: "14",
		key: "1i6ji0"
	}],
	["line", {
		x1: "16",
		x2: "16",
		y1: "18",
		y2: "22",
		key: "1lctlv"
	}]
]);
//#endregion
//#region components/site/MerchandiseCatalog.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ item }) {
	const image = typeof item.image === "object" && item.image ? item.image : null;
	const stock = totalInventory(item);
	const sizes = [...new Set((item.inventory || []).map((option) => option.size).filter(Boolean))].join(", ");
	const soldOut = stock <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		className: "merch-card-link",
		href: `/merch/${item.slug}`,
		"aria-label": `View ${item.name}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: `merch-card${item.featured ? " merch-featured" : ""}${soldOut ? " merch-sold-out" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "merch-image-wrap",
				children: [
					image?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: image.url,
						alt: image.alt || `${item.name} merchandise design`
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-image-placeholder",
						role: "img",
						"aria-label": `${item.name} image coming soon`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Image coming soon" })]
					}),
					item.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "merch-featured-label",
						children: "Featured item"
					}) : null,
					item.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "merch-sample-label",
						children: "Sample listing"
					}) : null,
					soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "merch-sold-out-label",
						children: "Sold out"
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "merch-card-copy",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "merch-kicker",
						children: merchandiseTypeLabels[item.type] || item.type
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: item.name }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "merch-description",
						children: item.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-card-meta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "merch-price",
							children: formatMerchandisePrice(item.price)
						}), sizes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "merch-sizes",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sizes" }), sizes]
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "merch-view-item",
						children: [
							soldOut ? "View details" : "View item",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								children: "→"
							})
						]
					})
				]
			})]
		})
	});
}
function MerchandiseCatalog({ items }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const availableTypes = (0, import_react.useMemo)(() => {
		const values = /* @__PURE__ */ new Set();
		items.forEach((item) => item.available !== false && values.add(item.type));
		return [...values].sort((a, b) => (merchandiseTypeLabels[a] || a).localeCompare(merchandiseTypeLabels[b] || b));
	}, [items]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = query.trim().toLowerCase();
		return items.filter((item) => {
			const matchesType = type === "all" || item.type === type;
			const inventoryTerms = (item.inventory || []).flatMap((option) => [
				option.size,
				option.color,
				option.sku
			]);
			const haystack = [
				item.name,
				item.description,
				item.searchTerms,
				item.type,
				merchandiseTypeLabels[item.type],
				...inventoryTerms
			].filter(Boolean).join(" ").toLowerCase();
			return item.available !== false && matchesType && (!needle || haystack.includes(needle));
		});
	}, [
		items,
		query,
		type
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
		mainId: "merch-main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "merch-page",
			id: "merch-main",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "merch-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "merch-orbit merch-orbit-one",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "merch-orbit merch-orbit-two",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-shell merch-hero-grid",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "merch-eyebrow",
							children: "NECYPAA XXXVI merchandise"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
							"Wear the",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Mad Realm." })
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "merch-intro",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Browse convention designs and compare every available item and price. Ordering will open in a future update." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }), " Catalog only — payment is not active yet"] })]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "merch-shop merch-shell",
				"aria-labelledby": "catalog-title",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-shop-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "merch-eyebrow",
							children: "The collection"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "catalog-title",
							children: "Browse merchandise"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							filtered.length,
							" ",
							filtered.length === 1 ? "item" : "items"
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-tools",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "merch-search",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Search merchandise"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { "aria-hidden": "true" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (event) => setQuery(event.target.value),
									placeholder: "Search designs, items, or sizes",
									type: "search"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "merch-filter",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { "aria-hidden": "true" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Filter by merchandise type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: type,
									onChange: (event) => setType(event.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All merchandise types"
									}), availableTypes.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value,
										children: merchandiseTypeLabels[value] || value
									}, value))]
								})
							]
						})]
					}),
					filtered.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `merch-grid merch-grid-${Math.min(filtered.length, 4)}`,
						children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { item }, item.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "merch-empty",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: items.length ? "No items match that search." : "The merchandise portal is ready." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: items.length ? "Try another search term or choose all merchandise types." : "Published items will appear here as soon as they are added in the site admin." }),
							items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setQuery("");
									setType("all");
								},
								type: "button",
								children: "Clear filters"
							}) : null
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { MerchandiseCatalog };
