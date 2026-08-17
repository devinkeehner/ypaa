import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as ArrowLeft } from "./arrow-left-Y8Wot3rg.js";
import { t as Plus } from "./plus-wFo5VM3v.js";
import { t as Trash2 } from "./trash-2-D8muVtgh.js";
import { t as Minus } from "./minus-oEkXEeYh.js";
import { t as formatMerchandisePrice } from "./merch-DKDvAe3E.js";
import { SiteFrame, i as ShoppingBag, n as readCart, r as writeCart } from "./SiteFrame-5pF_eYdh.js";
//#region components/site/CartPage.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const [items, setItems] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const timeout = window.setTimeout(() => {
			setItems(readCart());
			setLoaded(true);
		}, 0);
		return () => window.clearTimeout(timeout);
	}, []);
	const updateQuantity = (key, quantity) => {
		const next = items.map((item) => item.key === key ? {
			...item,
			quantity: Math.max(1, Math.min(item.maxStock || 10, quantity))
		} : item);
		setItems(next);
		writeCart(next);
	};
	const remove = (key) => {
		const next = items.filter((item) => item.key !== key);
		setItems(next);
		writeCart(next);
	};
	const subtotal = (0, import_react.useMemo)(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
		mainId: "cart-main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "cart-page",
			id: "cart-main",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "cart-shell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						className: "product-back",
						href: "/merch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": "true" }), " Continue shopping"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "cart-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "merch-eyebrow",
							children: "Your selections"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Merchandise cart" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" })]
					}),
					loaded && items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cart-layout",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "cart-list",
							children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "cart-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "cart-item-image",
										children: item.imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: item.imageUrl,
											alt: item.imageAlt || ""
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cart-item-copy",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: item.type }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: item.name }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												item.size ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Size: ", item.size] }) : null,
												item.color ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Color: ", item.color] }) : null,
												item.maxStock ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [item.maxStock, " currently available"] }) : null
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatMerchandisePrice(item.price) })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "cart-quantity",
										"aria-label": `Quantity for ${item.name}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => updateQuantity(item.key, item.quantity - 1),
												"aria-label": "Decrease quantity",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { "aria-hidden": "true" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.quantity }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => updateQuantity(item.key, item.quantity + 1),
												"aria-label": "Increase quantity",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { "aria-hidden": "true" })
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "cart-remove",
										type: "button",
										onClick: () => remove(item.key),
										"aria-label": `Remove ${item.name}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { "aria-hidden": "true" })
									})
								]
							}, item.key))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "cart-summary",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Order summary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatMerchandisePrice(subtotal) })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: true,
									type: "button",
									children: "Checkout coming soon"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "No payment will be collected yet. Your cart stays saved on this device." })
							]
						})]
					}) : loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "cart-empty",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Your cart is empty." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose an item from the merchandise collection to get started." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								href: "/merch",
								children: "Browse merchandise"
							})
						]
					}) : null
				]
			})
		})
	});
}
//#endregion
export { CartPage };
