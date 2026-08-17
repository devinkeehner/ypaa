import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { lt as it, mn as WP, nt as hee } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/Nav/SettingsMenuButton/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "settings-menu-button";
var SettingsMenuButton = (t0) => {
	const $ = (0, import_compiler_runtime.c)(3);
	const { settingsMenu } = t0;
	const { t } = WP();
	if (!settingsMenu || settingsMenu.length === 0) return null;
	let t1;
	if ($[0] !== settingsMenu || $[1] !== t) {
		t1 = (0, import_jsx_runtime.jsx)(it, {
			button: (0, import_jsx_runtime.jsx)(hee, { ariaLabel: t("general:menu") }),
			className: baseClass,
			horizontalAlign: "left",
			id: "settings-menu",
			size: "small",
			verticalAlign: "bottom",
			children: settingsMenu.map(_temp)
		});
		$[0] = settingsMenu;
		$[1] = t;
		$[2] = t1;
	} else t1 = $[2];
	return t1;
};
function _temp(item, i) {
	return (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: item }, `settings-menu-item-${i}`);
}
//#endregion
export { SettingsMenuButton };
