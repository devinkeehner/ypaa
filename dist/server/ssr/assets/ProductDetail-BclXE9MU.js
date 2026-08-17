import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as ArrowLeft } from "./arrow-left-Y8Wot3rg.js";
import { t as Check } from "./check-BxL9AktT.js";
import { a as merchandiseTypeLabels, i as inventoryLabel, n as inStockInventory, r as inventoryKey, t as formatMerchandisePrice } from "./merch-DKDvAe3E.js";
import { SiteFrame, i as ShoppingBag, t as addCartItem } from "./SiteFrame-5pF_eYdh.js";
//#region components/site/ProductDetail.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
function ProductDetail({ item }) {
	const inventory = (0, import_react.useMemo)(() => inStockInventory(item), [item]);
	const [variantKey, setVariantKey] = (0, import_react.useState)(() => inventory[0] ? inventoryKey(inventory[0], 0) : "");
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [added, setAdded] = (0, import_react.useState)(false);
	const image = typeof item.image === "object" && item.image ? item.image : null;
	const selectedVariant = inventory.find((option, index) => inventoryKey(option, index) === variantKey) || inventory[0];
	const maxQuantity = Math.min(10, selectedVariant?.quantity || 1);
	const soldOut = !selectedVariant;
	const addToCart = () => {
		if (!selectedVariant) return;
		addCartItem({
			slug: item.slug,
			name: item.name,
			type: merchandiseTypeLabels[item.type] || item.type,
			price: item.price,
			quantity,
			variantId: inventoryKey(selectedVariant),
			maxStock: selectedVariant.quantity,
			size: selectedVariant.size || void 0,
			color: selectedVariant.color || void 0,
			imageUrl: image?.url || void 0,
			imageAlt: image?.alt || `${item.name} merchandise`
		});
		setAdded(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
		mainId: "product-main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "product-page",
			id: "product-main",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "product-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "product-back",
					href: "/merch",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": "true" }), " Back to merchandise"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "product-grid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "product-media",
						children: [image?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image.url,
							alt: image.alt || `${item.name} merchandise`
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "merch-image-placeholder",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Image coming soon" })]
						}), item.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "merch-sample-label",
							children: "Sample listing"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "product-info",
						"aria-labelledby": "product-title",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "merch-eyebrow",
								children: merchandiseTypeLabels[item.type] || item.type
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								id: "product-title",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "product-price",
								children: formatMerchandisePrice(item.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "product-description",
								children: item.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "product-form",
								children: [
									inventory.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Choose an option" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: variantKey,
										onChange: (event) => {
											setVariantKey(event.target.value);
											setQuantity(1);
											setAdded(false);
										},
										children: inventory.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: inventoryKey(option, index),
											children: [
												inventoryLabel(option),
												" — ",
												option.quantity,
												" available"
											]
										}, inventoryKey(option, index)))
									})] }) : inventory.length === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "product-fixed-option",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Option" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: inventoryLabel(inventory[0]) })]
									}) : null,
									selectedVariant ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `product-stock${selectedVariant.quantity <= 3 ? " low-stock" : ""}`,
										children: selectedVariant.quantity <= 3 ? `Only ${selectedVariant.quantity} left` : `${selectedVariant.quantity} available`
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "product-stock sold-out",
										children: "Sold out"
									}),
									!soldOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quantity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										min: "1",
										max: maxQuantity,
										type: "number",
										value: quantity,
										onChange: (event) => setQuantity(Math.max(1, Math.min(maxQuantity, Number(event.target.value) || 1)))
									})] }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "product-add",
										disabled: soldOut,
										type: "button",
										onClick: addToCart,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { "aria-hidden": "true" }),
											" ",
											soldOut ? "Sold out" : "Add to cart"
										]
									})
								]
							}),
							added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "product-added",
								role: "status",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { "aria-hidden": "true" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Added to your cart." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										href: "/cart",
										children: "View cart"
									})
								]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "product-payment-note",
								children: "Your selections will be saved in the cart. Payment is not active yet."
							})
						]
					})]
				})]
			})
		})
	});
}
//#endregion
export { ProductDetail };
