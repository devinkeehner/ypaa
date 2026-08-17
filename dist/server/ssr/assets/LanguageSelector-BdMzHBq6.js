import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { gt as pt, mn as WP } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Account/Settings/LanguageSelector.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var LanguageSelector = (props) => {
	const $ = (0, import_compiler_runtime.c)(8);
	const { languageOptions } = props;
	const { i18n, switchLanguage } = WP();
	let t0;
	if ($[0] !== switchLanguage) {
		t0 = async (option) => {
			await switchLanguage(option.value);
		};
		$[0] = switchLanguage;
		$[1] = t0;
	} else t0 = $[1];
	let t1;
	if ($[2] !== i18n || $[3] !== languageOptions || $[4] !== t0) {
		let t2;
		if ($[6] !== i18n) {
			t2 = (language) => language.value === i18n.language;
			$[6] = i18n;
			$[7] = t2;
		} else t2 = $[7];
		t1 = (0, import_jsx_runtime.jsx)(pt, {
			inputId: "language-select",
			isClearable: false,
			onChange: t0,
			options: languageOptions,
			value: languageOptions.find(t2)
		});
		$[2] = i18n;
		$[3] = languageOptions;
		$[4] = t0;
		$[5] = t1;
	} else t1 = $[5];
	return t1;
};
//#endregion
export { LanguageSelector };
