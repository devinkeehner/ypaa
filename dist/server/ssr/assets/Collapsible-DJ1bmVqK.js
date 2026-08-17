import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { gn as getTranslation, mn as WP } from "./client-CJQLBaQM.js";
import { t as DiffCollapser } from "./DiffCollapser-Dm2nXTuU.js";
import { n as useSelectedLocales } from "./SelectedLocalesContext-ZIgT5uk_.js";
import { RenderVersionFieldsToDiff } from "./RenderVersionFieldsToDiff-Dos6yiJO.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Collapsible/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "collapsible-diff";
var Collapsible = (t0) => {
	const $ = (0, import_compiler_runtime.c)(8);
	const { baseVersionField, comparisonValue: valueFrom, field, parentIsLocalized, versionValue: valueTo } = t0;
	const { i18n } = WP();
	const { selectedLocales } = useSelectedLocales();
	if (!baseVersionField.fields?.length) return null;
	let t1;
	if ($[0] !== baseVersionField.fields || $[1] !== field || $[2] !== i18n || $[3] !== parentIsLocalized || $[4] !== selectedLocales || $[5] !== valueFrom || $[6] !== valueTo) {
		t1 = (0, import_jsx_runtime.jsx)("div", {
			className: baseClass,
			children: (0, import_jsx_runtime.jsx)(DiffCollapser, {
				fields: field.fields,
				Label: "label" in field && field.label && typeof field.label !== "function" && (0, import_jsx_runtime.jsx)("span", { children: getTranslation(field.label, i18n) }),
				locales: selectedLocales,
				parentIsLocalized: parentIsLocalized || field.localized,
				valueFrom,
				valueTo,
				children: (0, import_jsx_runtime.jsx)(RenderVersionFieldsToDiff, { versionFields: baseVersionField.fields })
			})
		});
		$[0] = baseVersionField.fields;
		$[1] = field;
		$[2] = i18n;
		$[3] = parentIsLocalized;
		$[4] = selectedLocales;
		$[5] = valueFrom;
		$[6] = valueTo;
		$[7] = t1;
	} else t1 = $[7];
	return t1;
};
//#endregion
export { Collapsible };
