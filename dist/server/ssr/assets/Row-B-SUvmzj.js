import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { RenderVersionFieldsToDiff } from "./RenderVersionFieldsToDiff-Dos6yiJO.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Row/index.js
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "row-diff";
var Row = ({ baseVersionField }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: baseClass,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderVersionFieldsToDiff, { versionFields: baseVersionField.fields })
	});
};
//#endregion
export { Row };
