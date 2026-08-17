import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { At as xe, Ct as te, Ft as zr, G as dd, I as Ze, J as dw, M as Ss, Qt as formatAdminURL, Xt as hasDraftsEnabled, Z as fee, bn as se, g as Ie, k as Qu, mn as WP, u as Fd, z as _o } from "./client-CJQLBaQM.js";
import { i as useSearchParams } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/views/API/LocaleSelector/index.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var LocaleSelector = (t0) => {
	const $ = (0, import_compiler_runtime.c)(6);
	const { localeOptions, onChange } = t0;
	const { t } = WP();
	let t1;
	if ($[0] !== localeOptions || $[1] !== onChange || $[2] !== t) {
		let t2;
		if ($[4] !== onChange) {
			t2 = (value) => onChange(value);
			$[4] = onChange;
			$[5] = t2;
		} else t2 = $[5];
		t1 = (0, import_jsx_runtime.jsx)(dd, {
			field: {
				name: "locale",
				label: t("general:locale"),
				options: localeOptions
			},
			onChange: t2,
			path: "locale"
		});
		$[0] = localeOptions;
		$[1] = onChange;
		$[2] = t;
		$[3] = t1;
	} else t1 = $[3];
	return t1;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/API/RenderJSON/index.js
var chars = {
	leftCurlyBracket: "{",
	leftSquareBracket: "[",
	rightCurlyBracket: "}",
	rightSquareBracket: "]"
};
var baseClass$1 = "query-inspector";
var Bracket = ({ type, comma = false, position }) => {
	const rightBracket = type === "object" ? chars.rightCurlyBracket : chars.rightSquareBracket;
	const leftBracket = type === "object" ? chars.leftCurlyBracket : chars.leftSquareBracket;
	const bracketToRender = position === "end" ? rightBracket : leftBracket;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `${baseClass$1}__bracket ${baseClass$1}__bracket--position-${position}`,
		children: [bracketToRender, position === "end" && comma ? "," : null]
	});
};
var RenderJSON = (t0) => {
	const $ = (0, import_compiler_runtime.c)(2);
	const { isEmpty: t1, object, objectKey, parentType: t2, trailingComma: t3 } = t0;
	const isEmpty = t1 === void 0 ? false : t1;
	const parentType = t2 === void 0 ? "object" : t2;
	const trailingComma = t3 === void 0 ? false : t3;
	const objectKeys = object ? Object.keys(object) : [];
	const objectLength = objectKeys.length;
	const [isOpen, setIsOpen] = import_react.useState(true);
	const isNested = parentType === "object" || parentType === "array";
	let t4;
	if ($[0] !== isOpen) {
		t4 = () => setIsOpen(!isOpen);
		$[0] = isOpen;
		$[1] = t4;
	} else t4 = $[1];
	return (0, import_jsx_runtime.jsxs)("li", {
		className: isNested ? `${baseClass$1}__row-line--nested` : "",
		children: [
			(0, import_jsx_runtime.jsxs)("button", {
				"aria-label": "toggle",
				className: `${baseClass$1}__list-toggle ${isEmpty ? `${baseClass$1}__list-toggle--empty` : ""}`,
				onClick: t4,
				type: "button",
				children: [isEmpty ? null : (0, import_jsx_runtime.jsx)(Ze, { className: `${baseClass$1}__toggle-row-icon ${baseClass$1}__toggle-row-icon--${isOpen ? "open" : "closed"}` }), (0, import_jsx_runtime.jsxs)("span", { children: [
					objectKey && `"${objectKey}": `,
					(0, import_jsx_runtime.jsx)(Bracket, {
						position: "start",
						type: parentType
					}),
					isEmpty ? (0, import_jsx_runtime.jsx)(Bracket, {
						comma: trailingComma,
						position: "end",
						type: parentType
					}) : null
				] })]
			}),
			(0, import_jsx_runtime.jsx)("ul", {
				className: `${baseClass$1}__json-children ${isNested ? `${baseClass$1}__json-children--nested` : ""}`,
				children: isOpen && objectKeys.map((key, keyIndex) => {
					let value = object[key];
					let type;
					const isLastKey = keyIndex === objectLength - 1;
					if (value === null) type = "null";
					else if (value instanceof Date) {
						type = "date";
						value = value.toISOString();
					} else if (Array.isArray(value)) type = "array";
					else if (typeof value === "object") type = "object";
					else if (typeof value === "number") type = "number";
					else if (typeof value === "boolean") type = "boolean";
					else type = "string";
					if (type === "object" || type === "array") return (0, import_jsx_runtime.jsx)(RenderJSON, {
						isEmpty: value.length === 0 || Object.keys(value).length === 0,
						object: value,
						objectKey: parentType === "object" ? key : void 0,
						parentType: type,
						trailingComma: !isLastKey
					}, `${key}-${keyIndex}`);
					if (type === "date" || type === "string" || type === "null" || type === "number" || type === "boolean") {
						const parentHasKey = Boolean(parentType === "object" && key);
						return (0, import_jsx_runtime.jsxs)("li", {
							className: [
								`${baseClass$1}__row-line`,
								`${baseClass$1}__value-type--${type}`,
								`${baseClass$1}__row-line--${objectKey ? "nested" : "top"}`
							].filter(Boolean).join(" "),
							children: [
								parentHasKey ? (0, import_jsx_runtime.jsx)("span", { children: `"${key}": ` }) : null,
								(0, import_jsx_runtime.jsx)("span", {
									className: `${baseClass$1}__value`,
									children: JSON.stringify(value)
								}),
								isLastKey ? "" : ","
							]
						}, `${key}-${keyIndex}`);
					}
				})
			}),
			!isEmpty && (0, import_jsx_runtime.jsx)("span", {
				className: isNested ? `${baseClass$1}__bracket--nested` : "",
				children: (0, import_jsx_runtime.jsx)(Bracket, {
					comma: trailingComma,
					position: "end",
					type: parentType
				})
			})
		]
	});
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/API/index.client.js
var baseClass = "query-inspector";
var APIViewClient = () => {
	const { id, collectionSlug, globalSlug, initialData, isTrashed } = Ie();
	const searchParams = useSearchParams();
	const { i18n, t } = WP();
	const { code } = xe();
	const { config: { defaultDepth, localization, routes: { api: apiRoute }, serverURL }, getEntityConfig } = se();
	const collectionConfig = getEntityConfig({ collectionSlug });
	const globalConfig = getEntityConfig({ globalSlug });
	const localeOptions = localization && localization.locales.map((locale) => ({
		label: locale.label,
		value: locale.code
	}));
	let draftsEnabled = false;
	let docEndpoint = void 0;
	if (collectionConfig) {
		draftsEnabled = hasDraftsEnabled(collectionConfig);
		docEndpoint = `/${collectionSlug}/${id}`;
	}
	if (globalConfig) {
		draftsEnabled = hasDraftsEnabled(globalConfig);
		docEndpoint = `/globals/${globalSlug}`;
	}
	const [data, setData] = import_react.useState(initialData);
	const [draft, setDraft] = import_react.useState(searchParams.get("draft") === "true");
	const [locale_0, setLocale] = import_react.useState(searchParams?.get("locale") || code);
	const [depth, setDepth] = import_react.useState(searchParams.get("depth") || defaultDepth.toString());
	const [authenticated, setAuthenticated] = import_react.useState(true);
	const [fullscreen, setFullscreen] = import_react.useState(false);
	const [origin, setOrigin] = import_react.useState(serverURL || "");
	import_react.useEffect(() => {
		if (!serverURL) setOrigin(window.location.origin);
	}, [serverURL]);
	const trashParam = typeof initialData?.deletedAt === "string";
	const params = new URLSearchParams({
		depth,
		draft: String(draft),
		locale: locale_0,
		trash: trashParam ? "true" : "false"
	}).toString();
	const fetchURL = formatAdminURL({
		apiRoute,
		path: `${docEndpoint}?${params}`,
		serverURL: origin
	});
	import_react.useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(fetchURL, {
					credentials: authenticated ? "include" : "omit",
					headers: { "Accept-Language": i18n.language },
					method: "GET"
				});
				try {
					setData(await res.json());
				} catch (error_0) {
					te.error("Error parsing response");
					console.error(error_0);
				}
			} catch (error) {
				te.error("Error making request");
				console.error(error);
			}
		};
		fetchData();
	}, [
		i18n.language,
		fetchURL,
		authenticated
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_o, {
		className: [baseClass, fullscreen && `${baseClass}--fullscreen`].filter(Boolean).join(" "),
		right: false,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(dw, {
				collectionSlug,
				globalLabel: globalConfig?.label,
				globalSlug,
				id,
				isTrashed,
				pluralLabel: collectionConfig ? collectionConfig?.labels?.plural : void 0,
				useAsTitle: collectionConfig ? collectionConfig?.admin?.useAsTitle : void 0,
				view: "API"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${baseClass}__configuration`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}__api-url`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `${baseClass}__label`,
						children: ["API URL ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fd, { value: fetchURL })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: fetchURL,
						rel: "noopener noreferrer",
						target: "_blank",
						children: fetchURL
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ss, {
					initialState: {
						authenticated: {
							initialValue: authenticated || false,
							valid: true,
							value: authenticated || false
						},
						depth: {
							initialValue: Number(depth || 0),
							valid: true,
							value: Number(depth || 0)
						},
						draft: {
							initialValue: draft || false,
							valid: true,
							value: draft || false
						},
						locale: {
							initialValue: locale_0,
							valid: true,
							value: locale_0
						}
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${baseClass}__form-fields`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `${baseClass}__filter-query-checkboxes`,
								children: [draftsEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(zr, {
									field: {
										name: "draft",
										label: t("version:draft")
									},
									onChange: () => setDraft(!draft),
									path: "draft"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(zr, {
									field: {
										name: "authenticated",
										label: t("authentication:authenticated")
									},
									onChange: () => setAuthenticated(!authenticated),
									path: "authenticated"
								})]
							}),
							localeOptions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSelector, {
								localeOptions,
								onChange: setLocale
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Qu, {
								field: {
									name: "depth",
									admin: { step: 1 },
									label: t("general:depth"),
									max: 10,
									min: 0
								},
								onChange: (value) => setDepth(value?.toString()),
								path: "depth"
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `${baseClass}__results-wrapper`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__toggle-fullscreen-button-container`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "toggle fullscreen",
						className: `${baseClass}__toggle-fullscreen-button`,
						onClick: () => setFullscreen(!fullscreen),
						type: "button",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(fee, { isMinimized: !fullscreen })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__results`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenderJSON, { object: data })
				})]
			})
		]
	});
};
//#endregion
export { APIViewClient };
