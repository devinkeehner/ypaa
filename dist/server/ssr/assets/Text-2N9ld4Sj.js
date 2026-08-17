import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { ct as iq, i as C4, jt as y4, mn as WP, s as Cre } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/fields/Text/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "text-diff";
function formatValue(value) {
	if (typeof value === "string") return {
		tokenizeByCharacter: true,
		value: y4(value)
	};
	if (typeof value === "number") return {
		tokenizeByCharacter: true,
		value: String(value)
	};
	if (typeof value === "boolean") return {
		tokenizeByCharacter: false,
		value: String(value)
	};
	if (value && typeof value === "object") return {
		tokenizeByCharacter: false,
		value: `<pre>${y4(JSON.stringify(value, null, 2))}</pre>`
	};
	return {
		tokenizeByCharacter: true,
		value: void 0
	};
}
var Text = (t0) => {
	const $ = (0, import_compiler_runtime.c)(8);
	const { comparisonValue: valueFrom, field, locale, nestingLevel, versionValue: valueTo } = t0;
	const { i18n } = WP();
	let placeholder = "";
	if (valueTo == valueFrom) placeholder = "<span class=\"html-diff-no-value\"><span>";
	let t1;
	if ($[0] !== field.label || $[1] !== i18n || $[2] !== locale || $[3] !== nestingLevel || $[4] !== placeholder || $[5] !== valueFrom || $[6] !== valueTo) {
		const formattedValueFrom = formatValue(valueFrom);
		const formattedValueTo = formatValue(valueTo);
		let tokenizeByCharacter = true;
		if (formattedValueFrom.value?.length) tokenizeByCharacter = formattedValueFrom.tokenizeByCharacter;
		else if (formattedValueTo.value?.length) tokenizeByCharacter = formattedValueTo.tokenizeByCharacter;
		const renderedValueFrom = formattedValueFrom.value ?? placeholder;
		const renderedValueTo = formattedValueTo.value ?? placeholder;
		const { From, To } = iq({
			fromHTML: "<p>" + renderedValueFrom + "</p>",
			postProcess: C4,
			toHTML: "<p>" + renderedValueTo + "</p>",
			tokenizeByCharacter
		});
		t1 = (0, import_jsx_runtime.jsx)(Cre, {
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
		$[4] = placeholder;
		$[5] = valueFrom;
		$[6] = valueTo;
		$[7] = t1;
	} else t1 = $[7];
	return t1;
};
//#endregion
export { Text };
