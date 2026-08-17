import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { ct as iq, gn as getTranslation, i as C4, jt as y4, mn as WP, s as Cre } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Select/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "select-diff";
var getOptionsToRender = (value, options, hasMany) => {
	if (hasMany && Array.isArray(value)) return value.map((val) => options.find((option) => (typeof option === "string" ? option : option.value) === val) || String(val));
	return options.find((option) => (typeof option === "string" ? option : option.value) === value) || String(value);
};
/**
* Translates option labels while ensuring they are strings.
* If `options.label` is a JSX element, it falls back to `options.value` because `DiffViewer`
* expects all values to be strings.
*/
var getTranslatedOptions = (options, i18n) => {
	if (Array.isArray(options)) return options.map((option) => {
		if (typeof option === "string") return option;
		const translatedLabel = getTranslation(option.label, i18n);
		return typeof translatedLabel === "string" ? translatedLabel : option.value;
	}).join(", ");
	if (typeof options === "string") return options;
	const translatedLabel = getTranslation(options.label, i18n);
	return typeof translatedLabel === "string" ? translatedLabel : options.value;
};
var Select = (t0) => {
	const $ = (0, import_compiler_runtime.c)(7);
	const { comparisonValue: valueFrom, field, locale, nestingLevel, versionValue: valueTo } = t0;
	const { i18n } = WP();
	const options = "options" in field && field.options;
	const renderedValueFrom = typeof valueFrom !== "undefined" ? getTranslatedOptions(getOptionsToRender(typeof valueFrom === "string" ? valueFrom : JSON.stringify(valueFrom), options, field.hasMany), i18n) : "";
	const renderedValueTo = typeof valueTo !== "undefined" ? getTranslatedOptions(getOptionsToRender(typeof valueTo === "string" ? valueTo : JSON.stringify(valueTo), options, field.hasMany), i18n) : "";
	const t1 = "<p>" + y4(renderedValueFrom) + "</p>";
	const t2 = "<p>" + y4(renderedValueTo) + "</p>";
	let t3;
	if ($[0] !== field.label || $[1] !== i18n || $[2] !== locale || $[3] !== nestingLevel || $[4] !== t1 || $[5] !== t2) {
		const { From, To } = iq({
			fromHTML: t1,
			postProcess: C4,
			toHTML: t2,
			tokenizeByCharacter: true
		});
		t3 = (0, import_jsx_runtime.jsx)(Cre, {
			className: baseClass,
			From,
			i18n,
			label: {
				label: field.label,
				locale
			},
			nestingLevel,
			To
		});
		$[0] = field.label;
		$[1] = i18n;
		$[2] = locale;
		$[3] = nestingLevel;
		$[4] = t1;
		$[5] = t2;
		$[6] = t3;
	} else t3 = $[6];
	return t3;
};
//#endregion
export { Select };
