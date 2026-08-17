import { C as require_react, j as __toESM, n as require_jsx_runtime, t as require_react_dom } from "../index.js";
import { t as Link } from "./Link-D89FUaJ6.js";
import { t as Tooltip } from "./Tooltip-D6Q6qfyv.js";
//#region node_modules/@payloadcms/ui/dist/icons/Chevron/index.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Chevron/index.js
var ChevronIcon = ({ ariaLabel, className, direction, size }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	"aria-label": ariaLabel,
	className: [
		"icon icon--chevron",
		className,
		size && `icon--size-${size}`
	].filter(Boolean).join(" "),
	height: "100%",
	style: { transform: direction === "left" ? "rotate(90deg)" : direction === "right" ? "rotate(-90deg)" : direction === "up" ? "rotate(180deg)" : void 0 },
	viewBox: "0 0 20 20",
	width: "100%",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M14 8L10 12L6 8",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Edit/index.js
var EditIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	className: [className, "icon icon--edit"].filter(Boolean).join(" "),
	viewBox: "0 0 20 20",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M9.68531 4.62938H5.2634C4.92833 4.62938 4.60698 4.76248 4.37004 4.99942C4.13311 5.23635 4 5.5577 4 5.89278V14.7366C4 15.0717 4.13311 15.393 4.37004 15.63C4.60698 15.8669 4.92833 16 5.2634 16H14.1072C14.4423 16 14.7636 15.8669 15.0006 15.63C15.2375 15.393 15.3706 15.0717 15.3706 14.7366V10.3147M13.7124 4.39249C13.9637 4.14118 14.3046 4 14.66 4C15.0154 4 15.3562 4.14118 15.6075 4.39249C15.8588 4.6438 16 4.98464 16 5.34004C16 5.69544 15.8588 6.03629 15.6075 6.28759L9.91399 11.9817C9.76399 12.1316 9.57868 12.2413 9.37515 12.3008L7.56027 12.8314C7.50591 12.8472 7.44829 12.8482 7.39344 12.8341C7.33859 12.8201 7.28853 12.7915 7.24849 12.7515C7.20845 12.7115 7.17991 12.6614 7.16586 12.6066C7.15181 12.5517 7.15276 12.4941 7.16861 12.4397L7.69924 10.6249C7.75896 10.4215 7.86888 10.2364 8.01888 10.0866L13.7124 4.39249Z",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Link/index.js
var LinkIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "graphic link icon icon--link",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M7.99999 13.3333H6.66666C5.78261 13.3333 4.93476 12.9821 4.30964 12.357C3.68452 11.7319 3.33333 10.884 3.33333 9.99999C3.33333 9.11593 3.68452 8.26809 4.30964 7.64297C4.93476 7.01785 5.78261 6.66666 6.66666 6.66666H7.99999M12 6.66666H13.3333C14.2174 6.66666 15.0652 7.01785 15.6904 7.64297C16.3155 8.26809 16.6667 9.11593 16.6667 9.99999C16.6667 10.884 16.3155 11.7319 15.6904 12.357C15.0652 12.9821 14.2174 13.3333 13.3333 13.3333H12M7.33333 9.99999H12.6667",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Plus/index.js
var PlusIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	className: "icon icon--plus",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M5.33333 9.99998H14.6667M9.99999 5.33331V14.6666",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Swap/index.js
var SwapIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	className: "icon icon--swap",
	viewBox: "0 0 20 20",
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M7.33334 4L4.66667 6.66667M4.66667 6.66667L7.33334 9.33333M4.66667 6.66667H15.3333M12.6667 16L15.3333 13.3333M15.3333 13.3333L12.6667 10.6667M15.3333 13.3333H4.66667",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/X/index.js
var XIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	className: [className, "icon icon--x"].filter(Boolean).join(" "),
	height: 20,
	viewBox: "0 0 20 20",
	width: 20,
	xmlns: "http://www.w3.org/2000/svg",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M14 6L6 14M6 6L14 14",
		strokeLinecap: "square"
	})
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/hooks/useEffectEvent.js
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
/**

Polyfill taken and modified from https://github.com/bluesky-social/social-app/blob/ce0bf867ff3b50a495d8db242a7f55371bffeadc/src/lib/hooks/useNonReactiveCallback.ts

Copyright 2023–2025 Bluesky PBC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var useEffectEvent = "useEffectEvent" in import_react.default && typeof import_react.useEffectEvent === "function" ? import_react.useEffectEvent : (fn) => {
	const ref = (0, import_react.useRef)(fn);
	(0, import_react.useInsertionEffect)(() => {
		ref.current = fn;
	}, [fn]);
	return (0, import_react.useCallback)((...args) => {
		const latestFn = ref.current;
		return latestFn(...args);
	}, []);
};
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Popup/PopupTrigger/index.js
var baseClass$2 = "popup-button";
var PopupTrigger = (props) => {
	const { active, button, buttonType, className, disabled, noBackground, setActive, size } = props;
	const classes = [
		baseClass$2,
		className,
		`${baseClass$2}--${buttonType}`,
		!noBackground && `${baseClass$2}--background`,
		size && `${baseClass$2}--size-${size}`,
		disabled && `${baseClass$2}--disabled`
	].filter(Boolean).join(" ");
	const handleClick = () => {
		setActive(!active, false);
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setActive(!active, true);
		}
	};
	if (buttonType === "none") return null;
	if (buttonType === "custom") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: classes,
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		role: "button",
		tabIndex: 0,
		children: button
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: classes,
		disabled,
		onClick: handleClick,
		onKeyDown: handleKeyDown,
		tabIndex: 0,
		type: "button",
		children: button
	});
};
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Popup/index.js
var baseClass$1 = "popup";
/**
* Selector for all elements the browser considers tabbable.
*/
var TABBABLE_SELECTOR = [
	"a[href]",
	"button:not(:disabled)",
	"input:not(:disabled):not([type=\"hidden\"])",
	"select:not(:disabled)",
	"textarea:not(:disabled)",
	"[tabindex]",
	"[contenteditable]:not([contenteditable=\"false\"])",
	"audio[controls]",
	"video[controls]",
	"summary"
].map((s) => `${s}:not([tabindex="-1"])`).join(", ");
/**
* Component that renders a popup, as well as a button that triggers the popup.
*
* The popup is rendered in a portal, and is automatically positioned above / below the trigger,
* depending on the verticalAlign prop and the space available.
*/
var Popup = (props) => {
	const { id, button, buttonClassName, buttonSize, buttonType = "default", caret = true, children, className, disabled, forceOpen, horizontalAlign = "left", initActive = false, noBackground, onToggleClose, onToggleOpen, portalClassName, render, showOnHover = false, showScrollbar = false, size = "medium", verticalAlign = "bottom" } = props;
	const popupRef = (0, import_react.useRef)(null);
	const triggerRef = (0, import_react.useRef)(null);
	/**
	* Keeps track of whether the popup was opened via keyboard.
	* This is used to determine whether to autofocus the first element in the popup.
	* If the popup was opened via mouse, we do not want to autofocus the first element.
	*/
	const openedViaKeyboardRef = (0, import_react.useRef)(false);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [active, setActiveInternal] = (0, import_react.useState)(initActive);
	const [isOnTop, setIsOnTop] = (0, import_react.useState)(verticalAlign === "top");
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	const setActive = (0, import_react.useCallback)((isActive, viaKeyboard = false) => {
		if (isActive) {
			openedViaKeyboardRef.current = viaKeyboard;
			onToggleOpen?.(true);
		} else onToggleClose?.();
		setActiveInternal(isActive);
	}, [onToggleClose, onToggleOpen]);
	const updatePosition = useEffectEvent(() => {
		const trigger = triggerRef.current;
		const popup = popupRef.current;
		if (!trigger || !popup) return;
		const triggerRect = trigger.getBoundingClientRect();
		const popupRect = popup.getBoundingClientRect();
		const offset = 10;
		let top;
		let onTop = verticalAlign === "top";
		if (verticalAlign === "bottom") {
			top = triggerRect.bottom + window.scrollY + offset;
			if (triggerRect.bottom + popupRect.height + offset > window.innerHeight) {
				top = triggerRect.top + window.scrollY - popupRect.height - offset;
				onTop = true;
			}
		} else {
			top = triggerRect.top + window.scrollY - popupRect.height - offset;
			if (triggerRect.top - popupRect.height - offset < 0) {
				top = triggerRect.bottom + window.scrollY + offset;
				onTop = false;
			}
		}
		setIsOnTop(onTop);
		let left = horizontalAlign === "right" ? triggerRect.right - popupRect.width : horizontalAlign === "center" ? triggerRect.left + triggerRect.width / 2 - popupRect.width / 2 : triggerRect.left;
		left = Math.max(offset, Math.min(left, window.innerWidth - popupRect.width - offset));
		const triggerCenter = triggerRect.left + triggerRect.width / 2;
		const caretLeft = Math.max(12, Math.min(triggerCenter - left, popupRect.width - 12));
		const newTop = `${Math.round(top)}px`;
		const newLeft = `${Math.round(left + window.scrollX)}px`;
		const newCaretLeft = `${Math.round(caretLeft)}px`;
		if (popup.style.top !== newTop) popup.style.top = newTop;
		if (popup.style.left !== newLeft) popup.style.left = newLeft;
		if (popup.style.getPropertyValue("--caret-left") !== newCaretLeft) popup.style.setProperty("--caret-left", newCaretLeft);
	});
	const handleClickOutside = useEffectEvent((e) => {
		const isOutsidePopup = !popupRef.current?.contains(e.target);
		const isOutsideTrigger = !triggerRef.current?.contains(e.target);
		if (isOutsidePopup && isOutsideTrigger) setActive(false);
	});
	const handleKeyDown = useEffectEvent((e_0) => {
		const popup_0 = popupRef.current;
		if (!popup_0 || !active) return;
		if (e_0.key === "Escape") {
			e_0.preventDefault();
			setActive(false);
			triggerRef.current?.querySelector("button, [tabindex=\"0\"]")?.focus();
			return;
		}
		if (e_0.key === "Tab" || e_0.key === "ArrowDown" || e_0.key === "ArrowUp") {
			const focusable = Array.from(popup_0.querySelectorAll(TABBABLE_SELECTOR));
			if (focusable.length === 0) return;
			e_0.preventDefault();
			const currentIndex = focusable.findIndex((el) => el === document.activeElement);
			const goBackward = e_0.key === "ArrowUp" || e_0.key === "Tab" && e_0.shiftKey;
			let nextIndex;
			if (currentIndex === -1) nextIndex = goBackward ? focusable.length - 1 : 0;
			else if (goBackward) nextIndex = currentIndex === 0 ? focusable.length - 1 : currentIndex - 1;
			else nextIndex = currentIndex === focusable.length - 1 ? 0 : currentIndex + 1;
			focusable[nextIndex].focus();
		}
	});
	const handleActionableClick = useEffectEvent((e_1) => {
		const target = e_1.target;
		if (target.closest("[data-popup-prevent-close]")) return;
		const actionable = target.closest("button, a[href], [role=\"button\"], [role=\"menuitem\"]");
		if (actionable && popupRef.current?.contains(actionable)) setActive(false);
	});
	(0, import_react.useEffect)(() => {
		if (!active) return;
		const popup_1 = popupRef.current;
		if (!popup_1) return;
		updatePosition();
		if (openedViaKeyboardRef.current) requestAnimationFrame(() => {
			popup_1.querySelector(TABBABLE_SELECTOR)?.focus();
		});
		window.addEventListener("resize", updatePosition);
		window.addEventListener("scroll", updatePosition, {
			capture: true,
			passive: true
		});
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleKeyDown);
		popup_1.addEventListener("click", handleActionableClick);
		return () => {
			window.removeEventListener("resize", updatePosition);
			window.removeEventListener("scroll", updatePosition, { capture: true });
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleKeyDown);
			popup_1.removeEventListener("click", handleActionableClick);
		};
	}, [active]);
	(0, import_react.useEffect)(() => {
		if (forceOpen !== void 0) setActive(forceOpen);
	}, [forceOpen, setActive]);
	const Trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopupTrigger, {
		active,
		button,
		buttonType,
		className: buttonClassName,
		disabled,
		noBackground,
		setActive,
		size: buttonSize
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: [baseClass$1, className].filter(Boolean).join(" "),
		id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `${baseClass$1}__trigger-wrap`,
			ref: triggerRef,
			children: showOnHover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${baseClass$1}__on-hover-watch`,
				onMouseEnter: () => setActive(true),
				onMouseLeave: () => setActive(false),
				role: "button",
				tabIndex: 0,
				children: Trigger
			}) : Trigger
		}), mounted ? /* @__PURE__ */ (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: active ? [
				`${baseClass$1}__content`,
				`${baseClass$1}--size-${size}`,
				isOnTop ? `${baseClass$1}--v-top` : `${baseClass$1}--v-bottom`,
				portalClassName
			].filter(Boolean).join(" ") : `${baseClass$1}__hidden-content`,
			"data-popup-id": id || void 0,
			ref: popupRef,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${baseClass$1}__scroll-container${showScrollbar ? ` ${baseClass$1}__scroll-container--show-scrollbar` : ""}`,
				children: [render?.({ close: () => setActive(false) }), children]
			}), caret && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `${baseClass$1}__caret` })]
		}), document.body) : null]
	});
};
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Button/index.js
var icons = {
	chevron: ChevronIcon,
	edit: EditIcon,
	link: LinkIcon,
	plus: PlusIcon,
	swap: SwapIcon,
	x: XIcon
};
var baseClass = "btn";
var ButtonContents = ({ children, icon, showTooltip, tooltip }) => {
	const BuiltInIcon = icons[icon];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
		className: `${baseClass}__tooltip`,
		show: showTooltip,
		children: tooltip
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `${baseClass}__content`,
		children: [children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `${baseClass}__label`,
			children
		}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: `${baseClass}__icon`,
			children: [/* @__PURE__ */ (0, import_react.isValidElement)(icon) && icon, BuiltInIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BuiltInIcon, {})]
		})]
	})] });
};
var Button = (props) => {
	const { id, type = "button", "aria-label": ariaLabel, buttonStyle = "primary", children, className, disabled, el = "button", enableSubMenu, extraButtonProps = {}, icon, iconPosition = "right", iconStyle = "without-border", margin = true, newTab, onClick, onMouseDown, ref, round, size = "medium", SubMenuPopupContent, to, tooltip, url } = props;
	const [showTooltip, setShowTooltip] = import_react.useState(false);
	const classes = [
		baseClass,
		className && className,
		icon && `${baseClass}--icon`,
		iconStyle && `${baseClass}--icon-style-${iconStyle}`,
		icon && !children && `${baseClass}--icon-only`,
		size && `${baseClass}--size-${size}`,
		icon && iconPosition && `${baseClass}--icon-position-${iconPosition}`,
		tooltip && `${baseClass}--has-tooltip`,
		!SubMenuPopupContent && `${baseClass}--withoutPopup`,
		!margin && `${baseClass}--no-margin`
	].filter(Boolean).join(" ");
	function handleClick(event) {
		setShowTooltip(false);
		if (type !== "submit" && onClick) event.preventDefault();
		if (onClick) onClick(event);
	}
	const styleClasses = [
		buttonStyle && `${baseClass}--style-${buttonStyle}`,
		disabled && `${baseClass}--disabled`,
		round && `${baseClass}--round`,
		SubMenuPopupContent ? `${baseClass}--withPopup` : `${baseClass}--withoutPopup`
	].filter(Boolean).join(" ");
	const buttonProps = {
		id,
		type,
		"aria-disabled": disabled,
		"aria-label": ariaLabel,
		className: !SubMenuPopupContent ? [classes, styleClasses].join(" ") : classes,
		disabled,
		onClick: !disabled ? handleClick : void 0,
		onMouseDown: !disabled ? onMouseDown : void 0,
		onPointerEnter: tooltip ? () => setShowTooltip(true) : void 0,
		onPointerLeave: tooltip ? () => setShowTooltip(false) : void 0,
		rel: newTab ? "noopener noreferrer" : void 0,
		target: newTab ? "_blank" : void 0,
		title: ariaLabel,
		...extraButtonProps
	};
	let buttonElement;
	switch (el) {
		case "anchor":
			buttonElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				...buttonProps,
				href: !disabled ? url : void 0,
				ref,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContents, {
					icon,
					showTooltip,
					tooltip,
					children
				})
			});
			break;
		case "link":
			if (disabled) buttonElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				...buttonProps,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContents, {
					icon,
					showTooltip,
					tooltip,
					children
				})
			});
			buttonElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				...buttonProps,
				href: to || url,
				prefetch: false,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContents, {
					icon,
					showTooltip,
					tooltip,
					children
				})
			});
			break;
		default:
			buttonElement = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(el, {
				ref,
				...buttonProps,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ButtonContents, {
					icon,
					showTooltip,
					tooltip,
					children
				})
			});
			break;
	}
	if (SubMenuPopupContent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: styleClasses,
		children: [buttonElement, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Popup, {
			button: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronIcon, {}),
			buttonSize: size,
			className: disabled && !enableSubMenu ? `${baseClass}--popup-disabled` : "",
			disabled: disabled && !enableSubMenu,
			horizontalAlign: "right",
			id: `${id}-popup`,
			noBackground: true,
			render: ({ close }) => SubMenuPopupContent({ close: () => close() }),
			size: "large",
			verticalAlign: "bottom"
		})]
	});
	return buttonElement;
};
//#endregion
export { Button };
