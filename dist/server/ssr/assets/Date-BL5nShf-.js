import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { bn as se, ct as iq, i as C4, jt as y4, mn as WP, s as Cre } from "./client-CJQLBaQM.js";
import { t as M } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Date/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "date-diff";
var DateDiffComponent = (t0) => {
	const $ = (0, import_compiler_runtime.c)(7);
	const { comparisonValue: valueFrom, field, locale, nestingLevel, versionValue: valueTo } = t0;
	const { i18n } = WP();
	const { config: t1 } = se();
	const { admin: t2 } = t1;
	const { dateFormat } = t2;
	const formattedFromDate = valueFrom ? M({
		date: typeof valueFrom === "string" ? new Date(valueFrom) : valueFrom,
		i18n,
		pattern: dateFormat
	}) : "";
	const formattedToDate = valueTo ? M({
		date: typeof valueTo === "string" ? new Date(valueTo) : valueTo,
		i18n,
		pattern: dateFormat
	}) : "";
	const escapedFromDate = y4(formattedFromDate);
	const escapedToDate = y4(formattedToDate);
	const t3 = `<div class="${baseClass}" data-enable-match="true" data-date="${escapedFromDate}"><p>` + escapedFromDate + "</p></div>";
	const t4 = `<div class="${baseClass}" data-enable-match="true" data-date="${escapedToDate}"><p>` + escapedToDate + "</p></div>";
	let t5;
	if ($[0] !== field.label || $[1] !== i18n || $[2] !== locale || $[3] !== nestingLevel || $[4] !== t3 || $[5] !== t4) {
		const { From, To } = iq({
			fromHTML: t3,
			postProcess: C4,
			toHTML: t4,
			tokenizeByCharacter: false
		});
		t5 = (0, import_jsx_runtime.jsx)(Cre, {
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
		$[4] = t3;
		$[5] = t4;
		$[6] = t5;
	} else t5 = $[6];
	return t5;
};
//#endregion
export { DateDiffComponent };
