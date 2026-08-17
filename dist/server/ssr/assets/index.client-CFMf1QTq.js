import { C as require_react, j as __toESM } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { l as Er, mn as WP } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Account/index.client.js
var import_compiler_runtime = require_compiler_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var AccountClient = () => {
	const $ = (0, import_compiler_runtime.c)(4);
	const { setStepNav } = Er();
	const { t } = WP();
	let t0;
	let t1;
	if ($[0] !== setStepNav || $[1] !== t) {
		t0 = () => {
			const nav = [];
			nav.push({
				label: t("authentication:account"),
				url: "/account"
			});
			setStepNav(nav);
		};
		t1 = [setStepNav, t];
		$[0] = setStepNav;
		$[1] = t;
		$[2] = t0;
		$[3] = t1;
	} else {
		t0 = $[2];
		t1 = $[3];
	}
	import_react.useEffect(t0, t1);
	return null;
};
//#endregion
export { AccountClient };
