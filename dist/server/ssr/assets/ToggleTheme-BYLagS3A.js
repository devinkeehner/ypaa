import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { mn as WP, mt as od, vn as Ve } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Account/ToggleTheme/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var ToggleTheme = () => {
	const $ = (0, import_compiler_runtime.c)(7);
	const { autoMode, setTheme, theme } = Ve();
	const { t } = WP();
	let t0;
	if ($[0] !== setTheme) {
		t0 = (newTheme) => {
			setTheme(newTheme);
		};
		$[0] = setTheme;
		$[1] = t0;
	} else t0 = $[1];
	const onChange = t0;
	let t1;
	if ($[2] !== autoMode || $[3] !== onChange || $[4] !== t || $[5] !== theme) {
		t1 = (0, import_jsx_runtime.jsx)(od, {
			disableModifyingForm: true,
			field: {
				name: "theme",
				label: t("general:adminTheme"),
				options: [
					{
						label: t("general:automatic"),
						value: "auto"
					},
					{
						label: t("general:light"),
						value: "light"
					},
					{
						label: t("general:dark"),
						value: "dark"
					}
				]
			},
			onChange,
			path: "theme",
			value: autoMode ? "auto" : theme
		});
		$[2] = autoMode;
		$[3] = onChange;
		$[4] = t;
		$[5] = theme;
		$[6] = t1;
	} else t1 = $[6];
	return t1;
};
//#endregion
export { ToggleTheme };
