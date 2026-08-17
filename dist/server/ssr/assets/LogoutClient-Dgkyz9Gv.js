import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { Ct as te, Dt as vn, N as Te, Qt as formatAdminURL, b as Ke, bn as se, mn as WP, yt as re } from "./client-CJQLBaQM.js";
import { r as useRouter } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/views/Logout/LogoutClient.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "logout";
/**
* This component should **just** be the inactivity route and do nothing with logging the user out.
*
* It currently handles too much, the auth provider should just log the user out and then
* we could remove the useEffect in this file. So instead of the logout button
* being an anchor link, it should be a button that calls `logOut` in the provider.
*
* This view is still useful if cookies attempt to refresh and fail, i.e. the user
* is logged out due to inactivity.
*/
var LogoutClient = (props) => {
	const $ = (0, import_compiler_runtime.c)(23);
	const { adminRoute, inactivity, redirect } = props;
	const { logOut, user } = Te();
	se();
	const { startRouteTransition } = Ke();
	user?.id;
	const isLoggedIn = Boolean(user?.id);
	const navigatingToLoginRef = import_react.useRef(false);
	let t0;
	if ($[0] !== adminRoute || $[1] !== inactivity || $[2] !== redirect) {
		t0 = () => formatAdminURL({
			adminRoute,
			path: `/login${inactivity && redirect && redirect.length > 0 ? `?redirect=${encodeURIComponent(redirect)}` : ""}`
		});
		$[0] = adminRoute;
		$[1] = inactivity;
		$[2] = redirect;
		$[3] = t0;
	} else t0 = $[3];
	const [loginRoute] = import_react.useState(t0);
	const { t } = WP();
	const router = useRouter();
	let t1;
	if ($[4] !== logOut || $[5] !== loginRoute || $[6] !== router || $[7] !== startRouteTransition || $[8] !== t) {
		t1 = async () => {
			if (!navigatingToLoginRef.current) {
				navigatingToLoginRef.current = true;
				await logOut();
				te.success(t("authentication:loggedOutSuccessfully"));
				startRouteTransition(() => router.push(loginRoute));
				return;
			}
		};
		$[4] = logOut;
		$[5] = loginRoute;
		$[6] = router;
		$[7] = startRouteTransition;
		$[8] = t;
		$[9] = t1;
	} else t1 = $[9];
	const handleLogOut = t1;
	let t2;
	let t3;
	if ($[10] !== handleLogOut || $[11] !== inactivity || $[12] !== isLoggedIn || $[13] !== loginRoute || $[14] !== router || $[15] !== startRouteTransition) {
		t2 = () => {
			if (isLoggedIn && !inactivity) handleLogOut();
			else if (!navigatingToLoginRef.current) {
				navigatingToLoginRef.current = true;
				startRouteTransition(() => router.push(loginRoute));
			}
		};
		t3 = [
			handleLogOut,
			isLoggedIn,
			loginRoute,
			router,
			startRouteTransition,
			inactivity
		];
		$[10] = handleLogOut;
		$[11] = inactivity;
		$[12] = isLoggedIn;
		$[13] = loginRoute;
		$[14] = router;
		$[15] = startRouteTransition;
		$[16] = t2;
		$[17] = t3;
	} else {
		t2 = $[16];
		t3 = $[17];
	}
	(0, import_react.useEffect)(t2, t3);
	if (!isLoggedIn && inactivity) {
		let t4;
		if ($[18] !== loginRoute || $[19] !== t) {
			t4 = (0, import_jsx_runtime.jsxs)("div", {
				className: `${baseClass}__wrap`,
				children: [(0, import_jsx_runtime.jsx)("h2", { children: t("authentication:loggedOutInactivity") }), (0, import_jsx_runtime.jsx)(re, {
					buttonStyle: "secondary",
					el: "link",
					size: "large",
					url: loginRoute,
					children: t("authentication:logBackIn")
				})]
			});
			$[18] = loginRoute;
			$[19] = t;
			$[20] = t4;
		} else t4 = $[20];
		return t4;
	}
	let t4;
	if ($[21] !== t) {
		t4 = (0, import_jsx_runtime.jsx)(vn, {
			animationDuration: "0ms",
			loadingText: t("authentication:loggingOut")
		});
		$[21] = t;
		$[22] = t4;
	} else t4 = $[22];
	return t4;
};
//#endregion
export { LogoutClient };
