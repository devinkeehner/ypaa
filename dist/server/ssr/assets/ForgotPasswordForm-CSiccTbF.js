import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { M as Ss, Qt as formatAdminURL, a as Ca, bn as se, mn as WP, n as Ar, nn as email, rn as text, ut as la } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/FormHeader/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "form-header";
function FormHeader({ description, heading }) {
	if (!heading) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: baseClass,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: heading }), Boolean(description) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: description })]
	});
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/ForgotPassword/ForgotPasswordForm/index.js
var ForgotPasswordForm = () => {
	const $ = (0, import_compiler_runtime.c)(17);
	const { config, getEntityConfig } = se();
	const { admin: t0, routes: t1 } = config;
	const { user: userSlug } = t0;
	const { api: apiRoute } = t1;
	const { t } = WP();
	const [hasSubmitted, setHasSubmitted] = (0, import_react.useState)(false);
	let t2;
	if ($[0] !== getEntityConfig || $[1] !== userSlug) {
		t2 = getEntityConfig({ collectionSlug: userSlug });
		$[0] = getEntityConfig;
		$[1] = userSlug;
		$[2] = t2;
	} else t2 = $[2];
	const loginWithUsername = t2?.auth?.loginWithUsername;
	let t3;
	if ($[3] !== loginWithUsername || $[4] !== t) {
		t3 = (res, successToast, errorToast) => {
			res.json().then(() => {
				setHasSubmitted(true);
				successToast(t("general:submissionSuccessful"));
			}).catch(() => {
				errorToast(loginWithUsername ? t("authentication:usernameNotValid") : t("authentication:emailNotValid"));
			});
		};
		$[3] = loginWithUsername;
		$[4] = t;
		$[5] = t3;
	} else t3 = $[5];
	const handleResponse = t3;
	let t4;
	let t5;
	if ($[6] !== apiRoute || $[7] !== config || $[8] !== handleResponse || $[9] !== hasSubmitted || $[10] !== loginWithUsername || $[11] !== t || $[12] !== userSlug) {
		t5 = Symbol.for("react.early_return_sentinel");
		bb0: {
			const initialState = loginWithUsername ? { username: {
				initialValue: "",
				valid: true,
				value: void 0
			} } : { email: {
				initialValue: "",
				valid: true,
				value: void 0
			} };
			if (hasSubmitted) {
				let t6;
				if ($[15] !== t) {
					t6 = (0, import_jsx_runtime.jsx)(FormHeader, {
						description: t("authentication:checkYourEmailForPasswordReset"),
						heading: t("authentication:emailSent")
					});
					$[15] = t;
					$[16] = t6;
				} else t6 = $[16];
				t5 = t6;
				break bb0;
			}
			t4 = (0, import_jsx_runtime.jsxs)(Ss, {
				action: formatAdminURL({
					apiRoute,
					path: `/${userSlug}/forgot-password`
				}),
				handleResponse,
				initialState,
				method: "POST",
				children: [
					(0, import_jsx_runtime.jsx)(FormHeader, {
						description: loginWithUsername ? t("authentication:forgotPasswordUsernameInstructions") : t("authentication:forgotPasswordEmailInstructions"),
						heading: t("authentication:forgotPassword")
					}),
					loginWithUsername ? (0, import_jsx_runtime.jsx)(Ca, {
						field: {
							name: "username",
							label: t("authentication:username"),
							required: true
						},
						path: "username",
						validate: (value) => text(value, {
							name: "username",
							type: "text",
							blockData: {},
							data: {},
							event: "onChange",
							path: ["username"],
							preferences: { fields: {} },
							req: {
								payload: { config },
								t
							},
							required: true,
							siblingData: {}
						})
					}) : (0, import_jsx_runtime.jsx)(la, {
						field: {
							name: "email",
							admin: { autoComplete: "email" },
							label: t("general:email"),
							required: true
						},
						path: "email",
						validate: (value_0) => email(value_0, {
							name: "email",
							type: "email",
							blockData: {},
							data: {},
							event: "onChange",
							path: ["email"],
							preferences: { fields: {} },
							req: {
								payload: { config },
								t
							},
							required: true,
							siblingData: {}
						})
					}),
					(0, import_jsx_runtime.jsx)(Ar, {
						size: "large",
						children: t("general:submit")
					})
				]
			});
		}
		$[6] = apiRoute;
		$[7] = config;
		$[8] = handleResponse;
		$[9] = hasSubmitted;
		$[10] = loginWithUsername;
		$[11] = t;
		$[12] = userSlug;
		$[13] = t4;
		$[14] = t5;
	} else {
		t4 = $[13];
		t5 = $[14];
	}
	if (t5 !== Symbol.for("react.early_return_sentinel")) return t5;
	return t4;
};
//#endregion
export { ForgotPasswordForm };
