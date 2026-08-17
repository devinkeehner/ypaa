import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { Nt as yt, mn as WP } from "./client-CJQLBaQM.js";
import { VersionPillLabel } from "./VersionPillLabel-CXc7Ozph.js";
//#region node_modules/@payloadcms/next/dist/views/Versions/cells/AutosaveCell/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var baseClass = "autosave-cell";
var AutosaveCell = (t0) => {
	const $ = (0, import_compiler_runtime.c)(5);
	const { currentlyPublishedVersion, latestDraftVersion, rowData } = t0;
	const { t } = WP();
	let t1;
	if ($[0] !== currentlyPublishedVersion || $[1] !== latestDraftVersion || $[2] !== rowData || $[3] !== t) {
		t1 = (0, import_jsx_runtime.jsxs)("div", {
			className: `${baseClass}__items`,
			children: [rowData?.autosave && (0, import_jsx_runtime.jsx)(yt, {
				size: "small",
				children: t("version:autosave")
			}), (0, import_jsx_runtime.jsx)(VersionPillLabel, {
				currentlyPublishedVersion,
				disableDate: true,
				doc: rowData,
				labelFirst: false,
				labelStyle: "pill",
				latestDraftVersion
			})]
		});
		$[0] = currentlyPublishedVersion;
		$[1] = latestDraftVersion;
		$[2] = rowData;
		$[3] = t;
		$[4] = t1;
	} else t1 = $[4];
	return t1;
};
//#endregion
export { AutosaveCell };
