import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { bn as se, cn as fieldIsArrayType, gn as getTranslation, ln as fieldIsBlockType, mn as WP } from "./client-CJQLBaQM.js";
import { n as getFieldsForRowComparison, t as DiffCollapser } from "./DiffCollapser-Dm2nXTuU.js";
import { n as useSelectedLocales } from "./SelectedLocalesContext-ZIgT5uk_.js";
import { RenderVersionFieldsToDiff } from "./RenderVersionFieldsToDiff-Dos6yiJO.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Iterable/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "iterable-diff";
var Iterable = (t0) => {
	const $ = (0, import_compiler_runtime.c)(12);
	const { baseVersionField, comparisonValue: valueFrom, field, locale, parentIsLocalized, versionValue: valueTo } = t0;
	const { i18n, t } = WP();
	const { selectedLocales } = useSelectedLocales();
	const { config } = se();
	if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) throw new Error(`Expected field to be an array or blocks type but got: ${field.type}`);
	const valueToRowCount = Array.isArray(valueTo) ? valueTo.length : 0;
	const valueFromRowCount = Array.isArray(valueFrom) ? valueFrom.length : 0;
	const maxRows = Math.max(valueToRowCount, valueFromRowCount);
	let t1;
	if ($[0] !== baseVersionField || $[1] !== config || $[2] !== field || $[3] !== i18n || $[4] !== locale || $[5] !== maxRows || $[6] !== parentIsLocalized || $[7] !== selectedLocales || $[8] !== t || $[9] !== valueFrom || $[10] !== valueTo) {
		t1 = (0, import_jsx_runtime.jsx)("div", {
			className: baseClass,
			children: (0, import_jsx_runtime.jsxs)(DiffCollapser, {
				field,
				isIterable: true,
				Label: "label" in field && field.label && typeof field.label !== "function" && (0, import_jsx_runtime.jsxs)("span", { children: [locale && (0, import_jsx_runtime.jsx)("span", {
					className: `${baseClass}__locale-label`,
					children: locale
				}), getTranslation(field.label, i18n)] }),
				locales: selectedLocales,
				parentIsLocalized,
				valueFrom,
				valueTo,
				children: [maxRows > 0 && (0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__rows`,
					children: Array.from({ length: maxRows }, (_, i) => {
						const valueToRow = valueTo?.[i] || {};
						const valueFromRow = valueFrom?.[i] || {};
						const { fields, versionFields } = getFieldsForRowComparison({
							baseVersionField,
							config,
							field,
							row: i,
							valueFromRow,
							valueToRow
						});
						if (!versionFields?.length) return null;
						const rowNumber = String(i + 1).padStart(2, "0");
						const rowLabel = fieldIsArrayType(field) ? `${t("general:item")} ${rowNumber}` : `${t("fields:block")} ${rowNumber}`;
						return (0, import_jsx_runtime.jsx)("div", {
							className: `${baseClass}__row`,
							children: (0, import_jsx_runtime.jsx)(DiffCollapser, {
								fields,
								hideGutter: true,
								Label: (0, import_jsx_runtime.jsxs)("div", {
									className: `${baseClass}-label-container`,
									children: [(0, import_jsx_runtime.jsx)("div", { className: `${baseClass}-label-prefix` }), (0, import_jsx_runtime.jsx)("span", {
										className: `${baseClass}__label`,
										children: rowLabel
									})]
								}),
								locales: selectedLocales,
								parentIsLocalized: parentIsLocalized || field.localized,
								valueFrom: valueFromRow,
								valueTo: valueToRow,
								children: (0, import_jsx_runtime.jsx)(RenderVersionFieldsToDiff, { versionFields })
							})
						}, i);
					})
				}), maxRows === 0 && (0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__no-rows`,
					children: i18n.t("version:noRowsFound", { label: "labels" in field && field.labels?.plural ? getTranslation(field.labels.plural, i18n) : i18n.t("general:rows") })
				})]
			})
		});
		$[0] = baseVersionField;
		$[1] = config;
		$[2] = field;
		$[3] = i18n;
		$[4] = locale;
		$[5] = maxRows;
		$[6] = parentIsLocalized;
		$[7] = selectedLocales;
		$[8] = t;
		$[9] = valueFrom;
		$[10] = valueTo;
		$[11] = t1;
	} else t1 = $[11];
	return t1;
};
//#endregion
export { Iterable };
