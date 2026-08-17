import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { E as Pa, U as cC } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/Nav/NavHamburger/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
/**
* @internal
*/
var NavHamburger = (t0) => {
	const $ = (0, import_compiler_runtime.c)(6);
	const { baseClass } = t0;
	const { navOpen, setNavOpen } = Pa();
	const t1 = `${baseClass}__mobile-close`;
	let t2;
	if ($[0] !== setNavOpen) {
		t2 = () => {
			setNavOpen(false);
		};
		$[0] = setNavOpen;
		$[1] = t2;
	} else t2 = $[1];
	const t3 = !navOpen ? -1 : void 0;
	let t4;
	if ($[2] !== t1 || $[3] !== t2 || $[4] !== t3) {
		t4 = (0, import_jsx_runtime.jsx)("button", {
			className: t1,
			onClick: t2,
			tabIndex: t3,
			type: "button",
			children: (0, import_jsx_runtime.jsx)(cC, { isActive: true })
		});
		$[2] = t1;
		$[3] = t2;
		$[4] = t3;
		$[5] = t4;
	} else t4 = $[5];
	return t4;
};
//#endregion
export { NavHamburger };
