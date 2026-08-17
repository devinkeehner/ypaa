import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { M as Ss, N as Te, Pt as zd, Qt as formatAdminURL, S as Lo, T as Nt, bn as se, d as Gd, mn as WP, n as Ar, y as Jx } from "./client-CJQLBaQM.js";
import { i as le, n as ae } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/views/CreateFirstUser/index.client.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var CreateFirstUserClient = ({ docPermissions, docPreferences, initialState, loginWithUsername, userSlug }) => {
	const { config: { routes: { admin, api: apiRoute } }, getEntityConfig } = se();
	const { getFormState } = Nt();
	const { t } = WP();
	const { setUser } = Te();
	const abortOnChangeRef = import_react.useRef(null);
	const collectionConfig = getEntityConfig({ collectionSlug: userSlug });
	const onChange = import_react.useCallback(async ({ formState: prevFormState, submitted }) => {
		const response = await getFormState({
			collectionSlug: userSlug,
			docPermissions,
			docPreferences,
			formState: prevFormState,
			operation: "create",
			schemaPath: userSlug,
			signal: ae(abortOnChangeRef).signal,
			skipValidation: !submitted
		});
		abortOnChangeRef.current = null;
		if (response && response.state) return response.state;
	}, [
		userSlug,
		getFormState,
		docPermissions,
		docPreferences
	]);
	const handleFirstRegister = (data) => {
		setUser(data);
	};
	(0, import_react.useEffect)(() => {
		const abortOnChange = abortOnChangeRef.current;
		return () => {
			le(abortOnChange);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ss, {
		action: formatAdminURL({
			apiRoute,
			path: `/${userSlug}/first-register`
		}),
		initialState: {
			...initialState,
			"confirm-password": {
				...initialState["confirm-password"],
				valid: initialState["confirm-password"]["valid"] || false,
				value: initialState["confirm-password"]["value"] || ""
			}
		},
		method: "POST",
		onChange: [onChange],
		onSuccess: handleFirstRegister,
		redirect: admin,
		validationOperation: "create",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Jx, {
				className: "emailAndUsername",
				loginWithUsername,
				operation: "create",
				readOnly: false,
				t
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(zd, {
				autoComplete: "off",
				field: {
					name: "password",
					label: t("authentication:newPassword"),
					required: true
				},
				path: "password"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gd, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lo, {
				fields: collectionConfig.fields,
				forceRender: true,
				parentIndexPath: "",
				parentPath: "",
				parentSchemaPath: userSlug,
				permissions: true,
				readOnly: false
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ar, {
				size: "large",
				children: t("general:create")
			})
		]
	});
};
//#endregion
export { CreateFirstUserClient };
