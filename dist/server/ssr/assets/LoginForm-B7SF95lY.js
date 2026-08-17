import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { M as Ss, N as Te, O as Qt, Pt as zd, Qt as formatAdminURL, a as Ca, bn as se, in as username, mn as WP, n as Ar, nn as email, ut as la } from "./client-CJQLBaQM.js";
//#region node_modules/payload/dist/auth/getLoginOptions.js
var getLoginOptions = (loginWithUsername) => {
	return {
		canLoginWithEmail: !loginWithUsername || loginWithUsername.allowEmailLogin,
		canLoginWithUsername: Boolean(loginWithUsername)
	};
};
//#endregion
//#region node_modules/payload/dist/utilities/getSafeRedirect.js
var getSafeRedirect = ({ allowAbsoluteUrls = false, fallbackTo = "/", redirectTo }) => {
	if (typeof redirectTo !== "string") return fallbackTo;
	let redirectPath;
	try {
		redirectPath = decodeURIComponent(redirectTo.trim());
	} catch {
		return fallbackTo;
	}
	const isSafeRedirect = redirectPath.startsWith("/") && !redirectPath.startsWith("//") && !redirectPath.startsWith("/%2F") && !redirectPath.startsWith("/\\/") && !redirectPath.startsWith("/\\\\") && !redirectPath.startsWith("/\\") && !redirectPath.toLowerCase().startsWith("/javascript:") && !redirectPath.toLowerCase().startsWith("/http");
	const isAbsoluteSafeRedirect = allowAbsoluteUrls && /^https?:\/\/\S+$/i.test(redirectPath);
	return isSafeRedirect || isAbsoluteSafeRedirect ? redirectPath : fallbackTo;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Login/LoginField/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var LoginField = (t0) => {
	const $ = (0, import_compiler_runtime.c)(11);
	const { type, required: t1 } = t0;
	const required = t1 === void 0 ? true : t1;
	const { t } = WP();
	if (type === "email") {
		let t2;
		if ($[0] !== required || $[1] !== t) {
			t2 = (0, import_jsx_runtime.jsx)(la, {
				field: {
					name: "email",
					admin: { autoComplete: "email" },
					label: t("general:email"),
					required
				},
				path: "email",
				validate: email
			});
			$[0] = required;
			$[1] = t;
			$[2] = t2;
		} else t2 = $[2];
		return t2;
	}
	if (type === "username") {
		let t2;
		if ($[3] !== required || $[4] !== t) {
			t2 = (0, import_jsx_runtime.jsx)(Ca, {
				field: {
					name: "username",
					label: t("authentication:username"),
					required
				},
				path: "username",
				validate: username
			});
			$[3] = required;
			$[4] = t;
			$[5] = t2;
		} else t2 = $[5];
		return t2;
	}
	if (type === "emailOrUsername") {
		let t2;
		if ($[6] !== required || $[7] !== t) {
			let t3;
			if ($[9] !== t) {
				t3 = (value, options) => {
					const passesUsername = username(value, options);
					const passesEmail = email(value, options);
					if (!passesEmail && !passesUsername) return `${t("general:email")}: ${passesEmail} ${t("general:username")}: ${passesUsername}`;
					return true;
				};
				$[9] = t;
				$[10] = t3;
			} else t3 = $[10];
			t2 = (0, import_jsx_runtime.jsx)(Ca, {
				field: {
					name: "username",
					label: t("authentication:emailOrUsername"),
					required
				},
				path: "username",
				validate: t3
			});
			$[6] = required;
			$[7] = t;
			$[8] = t2;
		} else t2 = $[8];
		return t2;
	}
	return null;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Login/LoginForm/index.js
var baseClass = "login__form";
var LoginForm = (t0) => {
	const $ = (0, import_compiler_runtime.c)(23);
	const { prefillEmail, prefillPassword, prefillUsername, searchParams } = t0;
	const { config, getEntityConfig } = se();
	const { admin: t1, routes: t2 } = config;
	const { routes: t3, user: userSlug } = t1;
	const { forgot: forgotRoute } = t3;
	const { admin: adminRoute, api: apiRoute } = t2;
	let loginWithUsername;
	let t4;
	if ($[0] !== getEntityConfig || $[1] !== userSlug) {
		const { auth: authOptions } = getEntityConfig({ collectionSlug: userSlug });
		loginWithUsername = authOptions.loginWithUsername;
		t4 = getLoginOptions(loginWithUsername);
		$[0] = getEntityConfig;
		$[1] = userSlug;
		$[2] = loginWithUsername;
		$[3] = t4;
	} else {
		loginWithUsername = $[2];
		t4 = $[3];
	}
	const { canLoginWithEmail, canLoginWithUsername } = t4;
	let t5;
	if ($[4] !== canLoginWithEmail || $[5] !== canLoginWithUsername) {
		t5 = () => {
			if (canLoginWithEmail && canLoginWithUsername) return "emailOrUsername";
			if (canLoginWithUsername) return "username";
			return "email";
		};
		$[4] = canLoginWithEmail;
		$[5] = canLoginWithUsername;
		$[6] = t5;
	} else t5 = $[6];
	const [loginType] = import_react.useState(t5);
	const { t } = WP();
	const { setUser } = Te();
	const t6 = prefillPassword ?? void 0;
	const t7 = prefillPassword ?? void 0;
	let t8;
	if ($[7] !== adminRoute || $[8] !== apiRoute || $[9] !== forgotRoute || $[10] !== loginType || $[11] !== loginWithUsername || $[12] !== prefillEmail || $[13] !== prefillUsername || $[14] !== searchParams?.redirect || $[15] !== setUser || $[16] !== t || $[17] !== t6 || $[18] !== t7 || $[19] !== userSlug) {
		const initialState = { password: {
			initialValue: t6,
			valid: true,
			value: t7
		} };
		if (loginWithUsername) initialState.username = {
			initialValue: prefillUsername ?? void 0,
			valid: true,
			value: prefillUsername ?? void 0
		};
		else initialState.email = {
			initialValue: prefillEmail ?? void 0,
			valid: true,
			value: prefillEmail ?? void 0
		};
		let t9;
		if ($[21] !== setUser) {
			t9 = (data) => {
				setUser(data);
			};
			$[21] = setUser;
			$[22] = t9;
		} else t9 = $[22];
		const handleLogin = t9;
		t8 = (0, import_jsx_runtime.jsxs)(Ss, {
			action: formatAdminURL({
				apiRoute,
				path: `/${userSlug}/login`
			}),
			className: baseClass,
			disableSuccessStatus: true,
			initialState,
			method: "POST",
			onSuccess: handleLogin,
			redirect: getSafeRedirect({
				fallbackTo: adminRoute,
				redirectTo: searchParams?.redirect
			}),
			waitForAutocomplete: true,
			children: [
				(0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}__inputWrap`,
					children: [(0, import_jsx_runtime.jsx)(LoginField, { type: loginType }), (0, import_jsx_runtime.jsx)(zd, {
						field: {
							name: "password",
							label: t("general:password"),
							required: true
						},
						path: "password"
					})]
				}),
				(0, import_jsx_runtime.jsx)(Qt, {
					href: formatAdminURL({
						adminRoute,
						path: forgotRoute
					}),
					prefetch: false,
					children: t("authentication:forgotPasswordQuestion")
				}),
				(0, import_jsx_runtime.jsx)(Ar, {
					size: "large",
					children: t("authentication:login")
				})
			]
		});
		$[7] = adminRoute;
		$[8] = apiRoute;
		$[9] = forgotRoute;
		$[10] = loginType;
		$[11] = loginWithUsername;
		$[12] = prefillEmail;
		$[13] = prefillUsername;
		$[14] = searchParams?.redirect;
		$[15] = setUser;
		$[16] = t;
		$[17] = t6;
		$[18] = t7;
		$[19] = userSlug;
		$[20] = t8;
	} else t8 = $[20];
	return t8;
};
//#endregion
export { LoginForm };
