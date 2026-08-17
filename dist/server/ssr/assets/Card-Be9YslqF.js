import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { Button } from "./Button-B7S5V5aU.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Card/index.js
var baseClass = "card";
var Card = (props) => {
	const { id, actions, buttonAriaLabel, href, onClick, title, titleAs } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: [
			baseClass,
			id,
			(onClick || href) && `${baseClass}--has-onclick`
		].filter(Boolean).join(" "),
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(titleAs ?? "div", {
				className: `${baseClass}__title`,
				children: title
			}),
			actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `${baseClass}__actions`,
				children: actions
			}),
			(onClick || href) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				"aria-label": buttonAriaLabel,
				buttonStyle: "none",
				className: `${baseClass}__click`,
				el: "link",
				onClick,
				to: href
			})
		]
	});
};
//#endregion
export { Card };
