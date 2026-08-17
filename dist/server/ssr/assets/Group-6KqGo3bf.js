import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { gn as getTranslation, mn as WP } from "./client-CJQLBaQM.js";
import { t as DiffCollapser } from "./DiffCollapser-Dm2nXTuU.js";
import { n as useSelectedLocales } from "./SelectedLocalesContext-ZIgT5uk_.js";
import { RenderVersionFieldsToDiff } from "./RenderVersionFieldsToDiff-Dos6yiJO.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Group/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "group-diff";
var Group = (t0) => {
	const $ = (0, import_compiler_runtime.c)(9);
	const { baseVersionField, comparisonValue: valueFrom, field, locale, parentIsLocalized, versionValue: valueTo } = t0;
	const { i18n } = WP();
	const { selectedLocales } = useSelectedLocales();
	let t1;
	if ($[0] !== baseVersionField.fields || $[1] !== field || $[2] !== i18n || $[3] !== locale || $[4] !== parentIsLocalized || $[5] !== selectedLocales || $[6] !== valueFrom || $[7] !== valueTo) {
		t1 = (0, import_jsx_runtime.jsx)("div", {
			className: baseClass,
			children: (0, import_jsx_runtime.jsx)(DiffCollapser, {
				fields: field.fields,
				Label: "label" in field && field.label && typeof field.label !== "function" ? (0, import_jsx_runtime.jsxs)("span", { children: [locale && (0, import_jsx_runtime.jsx)("span", {
					className: `${baseClass}__locale-label`,
					children: locale
				}), getTranslation(field.label, i18n)] }) : (0, import_jsx_runtime.jsxs)("span", {
					className: `${baseClass}__locale-label ${baseClass}__locale-label--no-label`,
					children: [
						"<",
						i18n.t("version:noLabelGroup"),
						">"
					]
				}),
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
		$[3] = locale;
		$[4] = parentIsLocalized;
		$[5] = selectedLocales;
		$[6] = valueFrom;
		$[7] = valueTo;
		$[8] = t1;
	} else t1 = $[8];
	return t1;
};
//#endregion
export { Group };
