import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { Ct as te, Qt as formatAdminURL, Rt as stringify, St as st, bn as se$1, bt as se, mn as WP, yt as re } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/Account/ResetPreferences/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var confirmResetModalSlug = "confirm-reset-modal";
var ResetPreferences = (t0) => {
	const $ = (0, import_compiler_runtime.c)(9);
	const { user } = t0;
	const { openModal } = se();
	const { t } = WP();
	const { config: t1 } = se$1();
	const { routes: t2 } = t1;
	const { api: apiRoute } = t2;
	let t3;
	if ($[0] !== apiRoute || $[1] !== user) {
		t3 = async () => {
			if (!user) return;
			const stringifiedQuery = stringify({
				depth: 0,
				where: { "user.value": { equals: user.id } }
			}, { addQueryPrefix: true });
			try {
				const res = await fetch(formatAdminURL({
					apiRoute,
					path: `/payload-preferences${stringifiedQuery}`
				}), {
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					method: "DELETE"
				});
				const message = (await res.json()).message;
				if (res.ok) te.success(message);
				else te.error(message);
			} catch (t4) {}
		};
		$[0] = apiRoute;
		$[1] = user;
		$[2] = t3;
	} else t3 = $[2];
	const handleResetPreferences = t3;
	let t4;
	if ($[3] !== openModal) {
		t4 = () => openModal(confirmResetModalSlug);
		$[3] = openModal;
		$[4] = t4;
	} else t4 = $[4];
	let t5;
	if ($[5] !== handleResetPreferences || $[6] !== t || $[7] !== t4) {
		t5 = (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)("div", { children: (0, import_jsx_runtime.jsx)(re, {
			buttonStyle: "secondary",
			onClick: t4,
			children: t("general:resetPreferences")
		}) }), (0, import_jsx_runtime.jsx)(st, {
			body: t("general:resetPreferencesDescription"),
			confirmingLabel: t("general:resettingPreferences"),
			heading: t("general:resetPreferences"),
			modalSlug: confirmResetModalSlug,
			onConfirm: handleResetPreferences
		})] });
		$[5] = handleResetPreferences;
		$[6] = t;
		$[7] = t4;
		$[8] = t5;
	} else t5 = $[8];
	return t5;
};
//#endregion
export { ResetPreferences };
