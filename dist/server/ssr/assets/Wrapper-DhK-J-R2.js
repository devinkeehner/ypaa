import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { E as Pa } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/templates/Default/Wrapper/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var Wrapper = (props) => {
	const $ = (0, import_compiler_runtime.c)(9);
	const { baseClass, children, className } = props;
	const { hydrated, navOpen, shouldAnimate } = Pa();
	const t0 = navOpen && `${baseClass}--nav-open`;
	const t1 = shouldAnimate && `${baseClass}--nav-animate`;
	const t2 = hydrated && `${baseClass}--nav-hydrated`;
	let t3;
	if ($[0] !== baseClass || $[1] !== className || $[2] !== t0 || $[3] !== t1 || $[4] !== t2) {
		t3 = [
			baseClass,
			className,
			t0,
			t1,
			t2
		].filter(Boolean);
		$[0] = baseClass;
		$[1] = className;
		$[2] = t0;
		$[3] = t1;
		$[4] = t2;
		$[5] = t3;
	} else t3 = $[5];
	const t4 = t3.join(" ");
	let t5;
	if ($[6] !== children || $[7] !== t4) {
		t5 = (0, import_jsx_runtime.jsx)("div", {
			className: t4,
			children
		});
		$[6] = children;
		$[7] = t4;
		$[8] = t5;
	} else t5 = $[8];
	return t5;
};
//#endregion
export { Wrapper };
