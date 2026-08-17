import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { E as Pa, U as cC } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/templates/Default/NavHamburger/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var NavHamburger = () => {
	const $ = (0, import_compiler_runtime.c)(2);
	const { navOpen } = Pa();
	let t0;
	if ($[0] !== navOpen) {
		t0 = (0, import_jsx_runtime.jsx)(cC, {
			closeIcon: "collapse",
			isActive: navOpen
		});
		$[0] = navOpen;
		$[1] = t0;
	} else t0 = $[1];
	return t0;
};
//#endregion
export { NavHamburger };
