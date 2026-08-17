import { C as require_react, j as __toESM } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { Ct as te, b as Ke } from "./client-CJQLBaQM.js";
import { r as useRouter } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/views/Verify/index.client.js
var import_compiler_runtime = require_compiler_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function ToastAndRedirect(t0) {
	const $ = (0, import_compiler_runtime.c)(6);
	const { message, redirectTo } = t0;
	const router = useRouter();
	const { startRouteTransition } = Ke();
	const hasToastedRef = import_react.useRef(false);
	let t1;
	let t2;
	if ($[0] !== message || $[1] !== redirectTo || $[2] !== router || $[3] !== startRouteTransition) {
		t1 = () => {
			let timeoutID;
			if (te) timeoutID = setTimeout(() => {
				te.success(message);
				hasToastedRef.current = true;
				startRouteTransition(() => router.push(redirectTo));
			}, 100);
			return () => {
				if (timeoutID) clearTimeout(timeoutID);
			};
		};
		t2 = [
			router,
			redirectTo,
			message,
			startRouteTransition
		];
		$[0] = message;
		$[1] = redirectTo;
		$[2] = router;
		$[3] = startRouteTransition;
		$[4] = t1;
		$[5] = t2;
	} else {
		t1 = $[4];
		t2 = $[5];
	}
	(0, import_react.useEffect)(t1, t2);
	return null;
}
//#endregion
export { ToastAndRedirect };
