import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
import { t as X } from "./x-Dc2IBGkZ.js";
import { n as useTenantTheme } from "./TenantThemeProvider-Dh5LQG_O.js";
//#region node_modules/lucide-react/dist/esm/icons/shopping-bag.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ShoppingBag = createLucideIcon("ShoppingBag", [
	["path", {
		d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",
		key: "hou9p0"
	}],
	["path", {
		d: "M3 6h18",
		key: "d0wm0j"
	}],
	["path", {
		d: "M16 10a4 4 0 0 1-8 0",
		key: "1ltviw"
	}]
]);
//#endregion
//#region components/site/cart-store.ts
var CART_STORAGE_KEY = "necypaa-merch-cart";
var CART_UPDATED_EVENT = "necypaa-cart-updated";
function readCart() {
	if (typeof window === "undefined") return [];
	try {
		const value = JSON.parse(window.localStorage.getItem("necypaa-merch-cart") || "[]");
		return Array.isArray(value) ? value : [];
	} catch {
		return [];
	}
}
function writeCart(items) {
	window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
	window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}
function cartCount(items = readCart()) {
	return items.reduce((total, item) => total + item.quantity, 0);
}
function addCartItem(item) {
	const key = [
		item.slug,
		item.variantId || "",
		item.size || "",
		item.color || ""
	].join("::");
	const cart = readCart();
	const existing = cart.find((entry) => entry.key === key);
	if (existing) existing.quantity = Math.min(item.maxStock || 10, existing.quantity + item.quantity);
	else cart.push({
		...item,
		key
	});
	writeCart(cart);
	return cart;
}
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/menu.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Menu = createLucideIcon("Menu", [
	["line", {
		x1: "4",
		x2: "20",
		y1: "12",
		y2: "12",
		key: "1e0a9i"
	}],
	["line", {
		x1: "4",
		x2: "20",
		y1: "6",
		y2: "6",
		key: "1owob3"
	}],
	["line", {
		x1: "4",
		x2: "20",
		y1: "18",
		y2: "18",
		key: "yk5zj1"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/settings.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Settings = createLucideIcon("Settings", [["path", {
	d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
	key: "1qme2f"
}], ["circle", {
	cx: "12",
	cy: "12",
	r: "3",
	key: "1v7zrd"
}]]);
//#endregion
//#region components/site/CartLink.tsx
var import_jsx_runtime = require_jsx_runtime();
function CartLink() {
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const update = () => setCount(cartCount(readCart()));
		update();
		window.addEventListener(CART_UPDATED_EVENT, update);
		window.addEventListener("storage", update);
		return () => {
			window.removeEventListener(CART_UPDATED_EVENT, update);
			window.removeEventListener("storage", update);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		className: "cms-cart",
		href: "/cart",
		"aria-label": `Cart with ${count} ${count === 1 ? "item" : "items"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cart" }),
			count ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: count }) : null
		]
	});
}
//#endregion
//#region components/site/SiteFrame.tsx
var navItems = [
	{
		label: "About",
		href: "/#about"
	},
	{
		label: "Meetings",
		href: "/#business-meeting"
	},
	{
		label: "Events",
		href: "/#events"
	},
	{
		label: "Program",
		href: "/program"
	},
	{
		label: "YPAA near you",
		href: "/#ypaa"
	},
	{
		label: "Merch",
		href: "/merch"
	},
	{
		label: "Register",
		href: "/register"
	}
];
function SiteFrame({ children, mainId }) {
	const tenant = useTenantTheme();
	const [theme, setTheme] = (0, import_react.useState)(() => typeof window !== "undefined" && localStorage.getItem("necypaa-theme") === "light" ? "light" : "dark");
	const [scale, setScale] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "default";
		const saved = localStorage.getItem("necypaa-text");
		return saved === "large" || saved === "largest" ? saved : "default";
	});
	const [contrast, setContrast] = (0, import_react.useState)(() => typeof window !== "undefined" && localStorage.getItem("necypaa-contrast") === "true");
	const [settings, setSettings] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("necypaa-theme", theme);
		localStorage.setItem("necypaa-text", scale);
		localStorage.setItem("necypaa-contrast", String(contrast));
	}, [
		theme,
		scale,
		contrast
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: (0, import_react.useMemo)(() => `cms-site theme-${theme} text-${scale}${contrast ? " high-contrast" : ""}`, [
			theme,
			scale,
			contrast
		]),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "skip-link",
				href: `#${mainId}`,
				children: "Skip to main content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "cms-header",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "cms-brand",
						href: "/#hero",
						children: tenant.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							alt: tenant.logoAlt,
							src: tenant.logoUrl
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "36" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NECYPAA" })] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Primary navigation",
						children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: item.href,
							children: item.label
						}, item.href))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cms-actions",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartLink, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								className: "cms-register",
								href: "/register",
								children: "Register"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								className: "cms-hotel",
								href: "https://www.necypaact.com/hotel",
								children: "Book a hotel room"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "cms-menu-button",
								"aria-expanded": menu,
								"aria-controls": "cms-mobile-menu",
								"aria-label": menu ? "Close navigation" : "Open navigation",
								onClick: () => setMenu((value) => !value),
								type: "button",
								children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { "aria-hidden": "true" })
							})
						]
					}),
					menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "cms-mobile-menu",
						id: "cms-mobile-menu",
						"aria-label": "Mobile navigation",
						children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							href: item.href,
							onClick: () => setMenu(false),
							children: item.label
						}, item.href))
					}) : null
				]
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "display-gear",
				"aria-expanded": settings,
				"aria-label": "Display and accessibility settings",
				onClick: () => setSettings((value) => !value),
				type: "button",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { "aria-hidden": "true" })
			}),
			settings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "display-panel",
				"aria-label": "Display settings",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Close display settings",
						onClick: () => setSettings(false),
						type: "button",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Display settings" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Theme" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-pressed": theme === "light",
							onClick: () => setTheme("light"),
							type: "button",
							children: "Light"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-pressed": theme === "dark",
							onClick: () => setTheme("dark"),
							type: "button",
							children: "Dark"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", { children: "Text size" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-pressed": scale === "default",
							onClick: () => setScale("default"),
							type: "button",
							children: "A"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-pressed": scale === "large",
							onClick: () => setScale("large"),
							type: "button",
							children: "A+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-pressed": scale === "largest",
							onClick: () => setScale("largest"),
							type: "button",
							children: "A++"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						checked: contrast,
						onChange: (event) => setContrast(event.target.checked),
						type: "checkbox"
					}), " Extra contrast"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Motion follows your device’s reduced-motion setting." })
				]
			}) : null
		]
	});
}
//#endregion
export { SiteFrame, ShoppingBag as i, readCart as n, writeCart as r, addCartItem as t };
