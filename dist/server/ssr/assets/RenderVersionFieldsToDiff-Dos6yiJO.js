import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { yn as le } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/RenderVersionFieldsToDiff.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "render-field-diffs";
var RenderVersionFieldsToDiff = (t0) => {
	const $ = (0, import_compiler_runtime.c)(6);
	const { parent: t1, versionFields } = t0;
	const parent = t1 === void 0 ? false : t1;
	const [hasMounted, setHasMounted] = import_react.useState(false);
	let t2;
	let t3;
	if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
		t2 = () => {
			setHasMounted(true);
		};
		t3 = [];
		$[0] = t2;
		$[1] = t3;
	} else {
		t2 = $[0];
		t3 = $[1];
	}
	(0, import_react.useEffect)(t2, t3);
	const t4 = `${baseClass}${parent ? ` ${baseClass}--parent` : ""}`;
	let t5;
	if ($[2] !== hasMounted || $[3] !== t4 || $[4] !== versionFields) {
		t5 = (0, import_jsx_runtime.jsx)("div", {
			className: t4,
			children: !hasMounted ? (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: (0, import_jsx_runtime.jsx)(le, {
				height: "8rem",
				width: "100%"
			}) }) : versionFields?.map(_temp)
		});
		$[2] = hasMounted;
		$[3] = t4;
		$[4] = versionFields;
		$[5] = t5;
	} else t5 = $[5];
	return t5;
};
function _temp(field, fieldIndex) {
	if (field.fieldByLocale) {
		const LocaleComponents = [];
		for (const [locale, baseField] of Object.entries(field.fieldByLocale)) LocaleComponents.push((0, import_jsx_runtime.jsx)("div", {
			className: `${baseClass}__locale`,
			"data-field-path": baseField.path,
			"data-locale": locale,
			children: (0, import_jsx_runtime.jsx)("div", {
				className: `${baseClass}__locale-value`,
				children: baseField.CustomComponent
			})
		}, [locale, fieldIndex].join("-")));
		return (0, import_jsx_runtime.jsx)("div", {
			className: `${baseClass}__field`,
			children: LocaleComponents
		}, fieldIndex);
	} else if (field.field) return (0, import_jsx_runtime.jsx)("div", {
		className: `${baseClass}__field field__${field.field.type}`,
		"data-field-path": field.field.path,
		children: field.field.CustomComponent
	}, fieldIndex);
	return null;
}
//#endregion
export { RenderVersionFieldsToDiff };
