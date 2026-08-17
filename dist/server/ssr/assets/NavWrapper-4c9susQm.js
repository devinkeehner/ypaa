import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { E as Pa } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/Nav/NavWrapper/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
/**
* @internal
*/
var NavWrapper = (props) => {
	const $ = (0, import_compiler_runtime.c)(11);
	const { baseClass, children } = props;
	const { hydrated, navOpen, navRef, shouldAnimate } = Pa();
	const t0 = navOpen && `${baseClass}--nav-open`;
	const t1 = shouldAnimate && `${baseClass}--nav-animate`;
	const t2 = hydrated && `${baseClass}--nav-hydrated`;
	let t3;
	if ($[0] !== baseClass || $[1] !== t0 || $[2] !== t1 || $[3] !== t2) {
		t3 = [
			baseClass,
			t0,
			t1,
			t2
		].filter(Boolean);
		$[0] = baseClass;
		$[1] = t0;
		$[2] = t1;
		$[3] = t2;
		$[4] = t3;
	} else t3 = $[4];
	const t4 = t3.join(" ");
	const t5 = !navOpen ? true : void 0;
	const t6 = `${baseClass}__scroll`;
	let t7;
	if ($[5] !== children || $[6] !== navRef || $[7] !== t4 || $[8] !== t5 || $[9] !== t6) {
		t7 = (0, import_jsx_runtime.jsx)("aside", {
			className: t4,
			inert: t5,
			children: (0, import_jsx_runtime.jsx)("div", {
				className: t6,
				ref: navRef,
				children
			})
		});
		$[5] = children;
		$[6] = navRef;
		$[7] = t4;
		$[8] = t5;
		$[9] = t6;
		$[10] = t7;
	} else t7 = $[10];
	return t7;
};
//#endregion
export { NavWrapper };
