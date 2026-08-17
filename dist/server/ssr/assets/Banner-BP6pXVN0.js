import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./Link-D89FUaJ6.js";
//#region node_modules/@payloadcms/ui/dist/elements/Banner/index.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Banner/index.js
var baseClass = "banner";
var Banner = ({ type = "default", alignIcon = "right", children, className, icon, onClick, to }) => {
	const classes = [
		baseClass,
		`${baseClass}--type-${type}`,
		className && className,
		to && `${baseClass}--has-link`,
		(to || onClick) && `${baseClass}--has-action`,
		icon && `${baseClass}--has-icon`,
		icon && `${baseClass}--align-icon-${alignIcon}`
	].filter(Boolean).join(" ");
	let RenderedType = "div";
	if (onClick && !to) RenderedType = "button";
	if (to) RenderedType = Link;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RenderedType, {
		className: classes,
		href: to || null,
		onClick,
		children: [
			icon && alignIcon === "left" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: icon }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}__content`,
				children
			}),
			icon && alignIcon === "right" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: icon })
		]
	});
};
//#endregion
export { Banner };
