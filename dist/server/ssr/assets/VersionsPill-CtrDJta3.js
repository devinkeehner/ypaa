import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { g as Ie } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/DocumentHeader/Tabs/tabs/VersionsPill/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "pill-version-count";
var VersionsPill = () => {
	const $ = (0, import_compiler_runtime.c)(2);
	const { versionCount } = Ie();
	if (!versionCount) return null;
	let t0;
	if ($[0] !== versionCount) {
		t0 = (0, import_jsx_runtime.jsx)("span", {
			className: baseClass,
			children: versionCount
		});
		$[0] = versionCount;
		$[1] = t0;
	} else t0 = $[1];
	return t0;
};
//#endregion
export { VersionsPill };
