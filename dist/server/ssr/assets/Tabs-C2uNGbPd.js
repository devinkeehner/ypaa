import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { gn as getTranslation, mn as WP } from "./client-CJQLBaQM.js";
import { t as DiffCollapser } from "./DiffCollapser-Dm2nXTuU.js";
import { n as useSelectedLocales } from "./SelectedLocalesContext-ZIgT5uk_.js";
import { RenderVersionFieldsToDiff } from "./RenderVersionFieldsToDiff-Dos6yiJO.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Tabs/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "tabs-diff";
var Tabs = (props) => {
	const $ = (0, import_compiler_runtime.c)(13);
	const { baseVersionField, comparisonValue: valueFrom, field, versionValue: valueTo } = props;
	const { selectedLocales } = useSelectedLocales();
	let t0;
	if ($[0] !== baseVersionField.tabs || $[1] !== field || $[2] !== props || $[3] !== selectedLocales || $[4] !== valueFrom || $[5] !== valueTo) {
		let t1;
		if ($[7] !== field || $[8] !== props || $[9] !== selectedLocales || $[10] !== valueFrom || $[11] !== valueTo) {
			t1 = (tab, i) => {
				if (!tab?.fields?.length) return null;
				const fieldTab = field.tabs?.[i];
				if (!fieldTab) return null;
				return (0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__tab`,
					children: (() => {
						if ("name" in fieldTab && selectedLocales && fieldTab.localized) return selectedLocales.map((locale, index) => {
							const localizedTabProps = {
								...props,
								comparisonValue: valueFrom?.[tab.name]?.[locale],
								fieldTab,
								locale,
								tab,
								versionValue: valueTo?.[tab.name]?.[locale]
							};
							return (0, import_jsx_runtime.jsx)("div", {
								className: `${baseClass}__tab-locale`,
								children: (0, import_jsx_runtime.jsx)("div", {
									className: `${baseClass}__tab-locale-value`,
									children: (0, import_jsx_runtime.jsx)(Tab, { ...localizedTabProps }, locale)
								})
							}, [locale, index].join("-"));
						});
						else if ("name" in tab && tab.name) return (0, import_jsx_runtime.jsx)(Tab, {
							...props,
							comparisonValue: valueFrom?.[tab.name],
							fieldTab,
							tab,
							versionValue: valueTo?.[tab.name]
						}, i);
						else return (0, import_jsx_runtime.jsx)(Tab, {
							fieldTab,
							...props,
							tab
						}, i);
					})()
				}, i);
			};
			$[7] = field;
			$[8] = props;
			$[9] = selectedLocales;
			$[10] = valueFrom;
			$[11] = valueTo;
			$[12] = t1;
		} else t1 = $[12];
		t0 = (0, import_jsx_runtime.jsx)("div", {
			className: baseClass,
			children: baseVersionField.tabs.map(t1)
		});
		$[0] = baseVersionField.tabs;
		$[1] = field;
		$[2] = props;
		$[3] = selectedLocales;
		$[4] = valueFrom;
		$[5] = valueTo;
		$[6] = t0;
	} else t0 = $[6];
	return t0;
};
var Tab = (t0) => {
	const $ = (0, import_compiler_runtime.c)(10);
	const { comparisonValue: valueFrom, fieldTab, locale, parentIsLocalized, tab, versionValue: valueTo } = t0;
	const { i18n } = WP();
	const { selectedLocales } = useSelectedLocales();
	if (!tab.fields?.length) return null;
	let t1;
	if ($[0] !== fieldTab.fields || $[1] !== fieldTab.localized || $[2] !== i18n || $[3] !== locale || $[4] !== parentIsLocalized || $[5] !== selectedLocales || $[6] !== tab || $[7] !== valueFrom || $[8] !== valueTo) {
		t1 = (0, import_jsx_runtime.jsx)(DiffCollapser, {
			fields: fieldTab.fields,
			Label: "label" in tab && tab.label && typeof tab.label !== "function" && (0, import_jsx_runtime.jsxs)("span", { children: [locale && (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}__locale-label`,
				children: locale
			}), getTranslation(tab.label, i18n)] }),
			locales: selectedLocales,
			parentIsLocalized: parentIsLocalized || fieldTab.localized,
			valueFrom,
			valueTo,
			children: (0, import_jsx_runtime.jsx)(RenderVersionFieldsToDiff, { versionFields: tab.fields })
		});
		$[0] = fieldTab.fields;
		$[1] = fieldTab.localized;
		$[2] = i18n;
		$[3] = locale;
		$[4] = parentIsLocalized;
		$[5] = selectedLocales;
		$[6] = tab;
		$[7] = valueFrom;
		$[8] = valueTo;
		$[9] = t1;
	} else t1 = $[9];
	return t1;
};
//#endregion
export { Tabs };
