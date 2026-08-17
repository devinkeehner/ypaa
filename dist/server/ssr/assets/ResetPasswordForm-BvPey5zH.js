import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { C as Mu, M as Ss, N as Te, Pt as zd, Qt as formatAdminURL, bn as se, d as Gd, mn as WP, n as Ar } from "./client-CJQLBaQM.js";
import { r as useRouter } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/views/ResetPassword/ResetPasswordForm/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var ResetPasswordForm = (t0) => {
	const $ = (0, import_compiler_runtime.c)(11);
	const { token } = t0;
	const i18n = WP();
	const { config: t1 } = se();
	const { admin: t2, routes: t3 } = t1;
	const { routes: t4, user: userSlug } = t2;
	const { login: loginRoute } = t4;
	const { admin: adminRoute, api: apiRoute } = t3;
	const history = useRouter();
	const { fetchFullUser } = Te();
	let t5;
	if ($[0] !== adminRoute || $[1] !== fetchFullUser || $[2] !== history || $[3] !== loginRoute) {
		t5 = async () => {
			if (await fetchFullUser()) history.push(adminRoute);
			else history.push(formatAdminURL({
				adminRoute,
				path: loginRoute
			}));
		};
		$[0] = adminRoute;
		$[1] = fetchFullUser;
		$[2] = history;
		$[3] = loginRoute;
		$[4] = t5;
	} else t5 = $[4];
	const onSuccess = t5;
	let t6;
	if ($[5] !== apiRoute || $[6] !== i18n || $[7] !== onSuccess || $[8] !== token || $[9] !== userSlug) {
		const initialState = {
			"confirm-password": {
				initialValue: "",
				valid: false,
				value: ""
			},
			password: {
				initialValue: "",
				valid: false,
				value: ""
			},
			token: {
				initialValue: token,
				valid: true,
				value: token
			}
		};
		t6 = (0, import_jsx_runtime.jsxs)(Ss, {
			action: formatAdminURL({
				apiRoute,
				path: `/${userSlug}/reset-password`
			}),
			initialState,
			method: "POST",
			onSuccess,
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "inputWrap",
				children: [
					(0, import_jsx_runtime.jsx)(zd, {
						field: {
							name: "password",
							label: i18n.t("authentication:newPassword"),
							required: true
						},
						path: "password",
						schemaPath: `${userSlug}.password`
					}),
					(0, import_jsx_runtime.jsx)(Gd, {}),
					(0, import_jsx_runtime.jsx)(Mu, {
						path: "token",
						schemaPath: `${userSlug}.token`,
						value: token
					})
				]
			}), (0, import_jsx_runtime.jsx)(Ar, {
				size: "large",
				children: i18n.t("authentication:resetPassword")
			})]
		});
		$[5] = apiRoute;
		$[6] = i18n;
		$[7] = onSuccess;
		$[8] = token;
		$[9] = userSlug;
		$[10] = t6;
	} else t6 = $[10];
	return t6;
};
//#endregion
export { ResetPasswordForm };
