import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { At as xe, Ct as te, D as Po, Dt as vn, I as Ze, It as zu, Nt as yt, P as Tt, Qt as formatAdminURL, St as st, T as Nt, V as at, b as Ke, bn as se, bt as se$1, et as go, g as Ie, gn as getTranslation, gt as pt, l as Er, mn as WP, o as Ce, r as B1, v as Ir, x as Le, yt as re, z as _o } from "./client-CJQLBaQM.js";
import { i as useSearchParams, n as usePathname, r as useRouter } from "./navigation-CdlVNq_2.js";
import { r as ce } from "./shared-jREwlcRe.js";
import { t as SelectedLocalesContext } from "./SelectedLocalesContext-ZIgT5uk_.js";
//#region node_modules/@payloadcms/next/dist/views/Version/Restore/index.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass$4 = "restore-version";
var modalSlug = "restore-version";
var Restore = ({ className, collectionConfig, globalConfig, label, originalDocID, status, versionDateFormatted, versionID }) => {
	const { config: { routes: { admin: adminRoute, api: apiRoute } } } = se();
	const { toggleModal } = se$1();
	const router = useRouter();
	const { i18n, t } = WP();
	const [draft, setDraft] = (0, import_react.useState)(false);
	const { startRouteTransition } = Ke();
	const restoreMessage = t(globalConfig ? "version:aboutToRestoreGlobal" : "version:aboutToRestore", {
		label: getTranslation(label, i18n),
		versionDate: versionDateFormatted
	});
	const canRestoreAsDraft = status !== "draft" && collectionConfig?.versions?.drafts;
	const handleRestore = (0, import_react.useCallback)(async () => {
		let fetchURL = formatAdminURL({
			apiRoute,
			path: ""
		});
		let redirectURL;
		if (collectionConfig) {
			fetchURL = `${fetchURL}/${collectionConfig.slug}/versions/${versionID}?draft=${draft}`;
			redirectURL = formatAdminURL({
				adminRoute,
				path: `/collections/${collectionConfig.slug}/${originalDocID}`
			});
		}
		if (globalConfig) {
			fetchURL = `${fetchURL}/globals/${globalConfig.slug}/versions/${versionID}?draft=${draft}`;
			redirectURL = formatAdminURL({
				adminRoute,
				path: `/globals/${globalConfig.slug}`
			});
		}
		const res = await ce.post(fetchURL, { headers: { "Accept-Language": i18n.language } });
		if (res.status === 200) {
			const json = await res.json();
			te.success(json.message);
			return startRouteTransition(() => router.push(redirectURL));
		} else te.error(t("version:problemRestoringVersion"));
	}, [
		apiRoute,
		collectionConfig,
		globalConfig,
		i18n.language,
		versionID,
		draft,
		adminRoute,
		originalDocID,
		startRouteTransition,
		router,
		t
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: [baseClass$4, className].filter(Boolean).join(" "),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(re, {
			buttonStyle: "primary",
			className: [canRestoreAsDraft && `${baseClass$4}__restore-as-draft-button`].filter(Boolean).join(" "),
			onClick: () => toggleModal(modalSlug),
			size: "xsmall",
			SubMenuPopupContent: canRestoreAsDraft ? () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ce.ButtonGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ce.Button, {
				onClick: () => [setDraft(true), toggleModal(modalSlug)],
				children: t("version:restoreAsDraft")
			}) }) : null,
			children: t("version:restoreThisVersion")
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(st, {
		body: restoreMessage,
		confirmingLabel: t("version:restoring"),
		heading: t("version:confirmVersionRestoration"),
		modalSlug,
		onConfirm: handleRestore
	})] });
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/SelectComparison/VersionDrawer/index.js
var import_compiler_runtime = require_compiler_runtime();
var baseClass$3 = "version-drawer";
var formatVersionDrawerSlug = ({ depth, uuid }) => `version-drawer_${depth}_${uuid}`;
var VersionDrawerContent = (props) => {
	const { collectionSlug, docID, drawerSlug, globalSlug } = props;
	const { isTrashed } = Ie();
	const { closeModal } = se$1();
	const searchParams = useSearchParams();
	const prevSearchParams = (0, import_react.useRef)(searchParams);
	const { renderDocument } = Nt();
	const [DocumentView, setDocumentView] = (0, import_react.useState)(void 0);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const hasRenderedDocument = (0, import_react.useRef)(false);
	const { t } = WP();
	const getDocumentView = (0, import_react.useCallback)((docID_0) => {
		const fetchDocumentView = async () => {
			setIsLoading(true);
			try {
				const isGlobal = Boolean(globalSlug);
				const entitySlug = collectionSlug ?? globalSlug;
				const result = await renderDocument({
					collectionSlug: entitySlug,
					docID: docID_0,
					drawerSlug,
					paramsOverride: { segments: [
						isGlobal ? "globals" : "collections",
						entitySlug,
						...isTrashed ? ["trash"] : [],
						isGlobal ? void 0 : String(docID_0),
						"versions"
					].filter(Boolean) },
					redirectAfterDelete: false,
					redirectAfterDuplicate: false,
					searchParams: Object.fromEntries(searchParams.entries()),
					versions: {
						disableGutter: true,
						useVersionDrawerCreatedAtCell: true
					}
				});
				if (result?.Document) {
					setDocumentView(result.Document);
					setIsLoading(false);
				}
			} catch (error) {
				te.error(error?.message || t("error:unspecific"));
				closeModal(drawerSlug);
			}
		};
		fetchDocumentView();
	}, [
		closeModal,
		collectionSlug,
		drawerSlug,
		globalSlug,
		isTrashed,
		renderDocument,
		searchParams,
		t
	]);
	(0, import_react.useEffect)(() => {
		if (!hasRenderedDocument.current || prevSearchParams.current !== searchParams) {
			prevSearchParams.current = searchParams;
			getDocumentView(docID);
			hasRenderedDocument.current = true;
		}
	}, [
		docID,
		getDocumentView,
		searchParams
	]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(vn, {});
	return DocumentView;
};
var VersionDrawer = (props) => {
	const $ = (0, import_compiler_runtime.c)(6);
	const { collectionSlug, docID, drawerSlug, globalSlug } = props;
	const { t } = WP();
	let t0;
	if ($[0] !== collectionSlug || $[1] !== docID || $[2] !== drawerSlug || $[3] !== globalSlug || $[4] !== t) {
		t0 = (0, import_jsx_runtime.jsx)(Tt, {
			className: baseClass$3,
			gutter: true,
			slug: drawerSlug,
			title: t("version:selectVersionToCompare"),
			children: (0, import_jsx_runtime.jsx)(VersionDrawerContent, {
				collectionSlug,
				docID,
				drawerSlug,
				globalSlug
			})
		});
		$[0] = collectionSlug;
		$[1] = docID;
		$[2] = drawerSlug;
		$[3] = globalSlug;
		$[4] = t;
		$[5] = t0;
	} else t0 = $[5];
	return t0;
};
var useVersionDrawer = (t0) => {
	const $ = (0, import_compiler_runtime.c)(29);
	const { collectionSlug, docID, globalSlug } = t0;
	const drawerDepth = at();
	const uuid = (0, import_react.useId)();
	const { closeModal, modalState, openModal, toggleModal } = se$1();
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	let t1;
	if ($[0] !== drawerDepth || $[1] !== uuid) {
		t1 = formatVersionDrawerSlug({
			depth: drawerDepth,
			uuid
		});
		$[0] = drawerDepth;
		$[1] = uuid;
		$[2] = t1;
	} else t1 = $[2];
	const drawerSlug = t1;
	let t2;
	let t3;
	if ($[3] !== drawerSlug || $[4] !== modalState) {
		t2 = () => {
			setIsOpen(Boolean(modalState[drawerSlug]?.isOpen));
		};
		t3 = [modalState, drawerSlug];
		$[3] = drawerSlug;
		$[4] = modalState;
		$[5] = t2;
		$[6] = t3;
	} else {
		t2 = $[5];
		t3 = $[6];
	}
	(0, import_react.useEffect)(t2, t3);
	let t4;
	if ($[7] !== drawerSlug || $[8] !== toggleModal) {
		t4 = () => {
			toggleModal(drawerSlug);
		};
		$[7] = drawerSlug;
		$[8] = toggleModal;
		$[9] = t4;
	} else t4 = $[9];
	const toggleDrawer = t4;
	let t5;
	if ($[10] !== closeModal || $[11] !== drawerSlug) {
		t5 = () => {
			closeModal(drawerSlug);
		};
		$[10] = closeModal;
		$[11] = drawerSlug;
		$[12] = t5;
	} else t5 = $[12];
	const closeDrawer = t5;
	let t6;
	if ($[13] !== drawerSlug || $[14] !== openModal) {
		t6 = () => {
			openModal(drawerSlug);
		};
		$[13] = drawerSlug;
		$[14] = openModal;
		$[15] = t6;
	} else t6 = $[15];
	const openDrawer = t6;
	let t7;
	if ($[16] !== collectionSlug || $[17] !== docID || $[18] !== drawerSlug || $[19] !== globalSlug) {
		t7 = () => (0, import_jsx_runtime.jsx)(VersionDrawer, {
			collectionSlug,
			docID,
			drawerSlug,
			globalSlug
		});
		$[16] = collectionSlug;
		$[17] = docID;
		$[18] = drawerSlug;
		$[19] = globalSlug;
		$[20] = t7;
	} else t7 = $[20];
	const MemoizedDrawer = t7;
	let t8;
	if ($[21] !== MemoizedDrawer || $[22] !== closeDrawer || $[23] !== drawerDepth || $[24] !== drawerSlug || $[25] !== isOpen || $[26] !== openDrawer || $[27] !== toggleDrawer) {
		t8 = {
			closeDrawer,
			Drawer: MemoizedDrawer,
			drawerDepth,
			drawerSlug,
			isDrawerOpen: isOpen,
			openDrawer,
			toggleDrawer
		};
		$[21] = MemoizedDrawer;
		$[22] = closeDrawer;
		$[23] = drawerDepth;
		$[24] = drawerSlug;
		$[25] = isOpen;
		$[26] = openDrawer;
		$[27] = toggleDrawer;
		$[28] = t8;
	} else t8 = $[28];
	return t8;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/SelectComparison/index.js
var baseClass$2 = "compare-version";
var SelectComparison = /* @__PURE__ */ (0, import_react.memo)((props) => {
	const { collectionSlug, docID, globalSlug, onChange: onChangeFromProps, versionFromID, versionFromOptions } = props;
	const { t } = WP();
	const { Drawer, openDrawer } = useVersionDrawer({
		collectionSlug,
		docID,
		globalSlug
	});
	const options = (0, import_react.useMemo)(() => {
		return [...versionFromOptions, {
			label: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass$2}-moreVersions`,
				children: t("version:moreVersions")
			}),
			value: "more"
		}];
	}, [t, versionFromOptions]);
	const currentOption = (0, import_react.useMemo)(() => versionFromOptions.find((option) => option.value === versionFromID), [versionFromOptions, versionFromID]);
	const onChange = (0, import_react.useCallback)((val) => {
		if (val.value === "more") {
			openDrawer();
			return;
		}
		onChangeFromProps(val);
	}, [onChangeFromProps, openDrawer]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: [Le, baseClass$2].filter(Boolean).join(" "),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(pt, {
			isClearable: false,
			isSearchable: false,
			onChange,
			options,
			placeholder: t("version:selectVersionToCompare"),
			value: currentOption
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer, {})]
	});
});
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/SelectLocales/index.js
var baseClass$1 = "select-version-locales";
var SelectLocales = ({ locales, localeSelectorOpen, onChange }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ir, {
		className: baseClass$1,
		height: localeSelectorOpen ? "auto" : 0,
		id: `${baseClass$1}-locales`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(zu, {
			onClick: ({ pill }) => {
				onChange({ locales: locales.map((locale) => {
					if (locale.name === pill.name) return {
						...locale,
						selected: !pill.selected
					};
					else return locale;
				}) });
			},
			pills: locales
		})
	});
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/Default/SetStepNav.js
var SetStepNav = (t0) => {
	const $ = (0, import_compiler_runtime.c)(24);
	const { id, collectionConfig, globalConfig, isTrashed, versionToCreatedAtFormatted, versionToID } = t0;
	const { config } = se();
	const { setStepNav } = Er();
	const { i18n, t } = WP();
	const locale = xe();
	const { title } = Po();
	let t1;
	if ($[0] !== collectionConfig || $[1] !== config || $[2] !== globalConfig || $[3] !== i18n || $[4] !== id || $[5] !== isTrashed || $[6] !== setStepNav || $[7] !== t || $[8] !== title || $[9] !== versionToCreatedAtFormatted) {
		t1 = () => {
			const { routes: t2 } = config;
			const { admin: adminRoute } = t2;
			if (collectionConfig) {
				const collectionSlug = collectionConfig.slug;
				const pluralLabel = collectionConfig.labels?.plural;
				const docBasePath = isTrashed ? `/collections/${collectionSlug}/trash/${id}` : `/collections/${collectionSlug}/${id}`;
				const nav = [{
					label: getTranslation(pluralLabel, i18n),
					url: formatAdminURL({
						adminRoute,
						path: `/collections/${collectionSlug}`
					})
				}];
				if (isTrashed) nav.push({
					label: t("general:trash"),
					url: formatAdminURL({
						adminRoute,
						path: `/collections/${collectionSlug}/trash`
					})
				});
				nav.push({
					label: title,
					url: formatAdminURL({
						adminRoute,
						path: docBasePath
					})
				}, {
					label: t("version:versions"),
					url: formatAdminURL({
						adminRoute,
						path: `${docBasePath}/versions`
					})
				}, {
					label: versionToCreatedAtFormatted,
					url: void 0
				});
				setStepNav(nav);
				return;
			}
			if (globalConfig) {
				const globalSlug = globalConfig.slug;
				setStepNav([
					{
						label: globalConfig.label,
						url: formatAdminURL({
							adminRoute,
							path: `/globals/${globalSlug}`
						})
					},
					{
						label: t("version:versions"),
						url: formatAdminURL({
							adminRoute,
							path: `/globals/${globalSlug}/versions`
						})
					},
					{ label: versionToCreatedAtFormatted }
				]);
			}
		};
		$[0] = collectionConfig;
		$[1] = config;
		$[2] = globalConfig;
		$[3] = i18n;
		$[4] = id;
		$[5] = isTrashed;
		$[6] = setStepNav;
		$[7] = t;
		$[8] = title;
		$[9] = versionToCreatedAtFormatted;
		$[10] = t1;
	} else t1 = $[10];
	let t2;
	if ($[11] !== collectionConfig || $[12] !== config || $[13] !== globalConfig || $[14] !== i18n || $[15] !== id || $[16] !== isTrashed || $[17] !== locale || $[18] !== setStepNav || $[19] !== t || $[20] !== title || $[21] !== versionToCreatedAtFormatted || $[22] !== versionToID) {
		t2 = [
			config,
			setStepNav,
			id,
			isTrashed,
			locale,
			t,
			i18n,
			collectionConfig,
			globalConfig,
			title,
			versionToCreatedAtFormatted,
			versionToID
		];
		$[11] = collectionConfig;
		$[12] = config;
		$[13] = globalConfig;
		$[14] = i18n;
		$[15] = id;
		$[16] = isTrashed;
		$[17] = locale;
		$[18] = setStepNav;
		$[19] = t;
		$[20] = title;
		$[21] = versionToCreatedAtFormatted;
		$[22] = versionToID;
		$[23] = t2;
	} else t2 = $[23];
	(0, import_react.useEffect)(t1, t2);
	return null;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/Default/index.js
var baseClass = "view-version";
var DefaultVersionView = ({ canUpdate, modifiedOnly: modifiedOnlyProp, RenderedDiff, selectedLocales: selectedLocalesFromProps, versionFromCreatedAt, versionFromID, versionFromOptions, versionToCreatedAt, versionToCreatedAtFormatted, VersionToCreatedAtLabel, versionToID, versionToStatus }) => {
	const { config, getEntityConfig } = se();
	const { code } = xe();
	const { i18n, t } = WP();
	const [locales, setLocales] = (0, import_react.useState)([]);
	const [localeSelectorOpen, setLocaleSelectorOpen] = import_react.useState(false);
	(0, import_react.useEffect)(() => {
		if (config.localization) setLocales(config.localization.locales.map((locale) => {
			let label = locale.label;
			if (typeof locale.label !== "string" && locale.label[code]) label = locale.label[code];
			return {
				name: locale.code,
				Label: label,
				selected: selectedLocalesFromProps.includes(locale.code)
			};
		}));
	}, [
		code,
		config.localization,
		selectedLocalesFromProps
	]);
	const { id: originalDocID, collectionSlug, globalSlug, isTrashed } = Ie();
	const { startRouteTransition } = Ke();
	const { collectionConfig, globalConfig } = (0, import_react.useMemo)(() => {
		return {
			collectionConfig: getEntityConfig({ collectionSlug }),
			globalConfig: getEntityConfig({ globalSlug })
		};
	}, [
		collectionSlug,
		globalSlug,
		getEntityConfig
	]);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [modifiedOnly, setModifiedOnly] = (0, import_react.useState)(modifiedOnlyProp);
	const updateSearchParams = (0, import_react.useCallback)((args) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()));
		if (args?.versionFromID) current.set("versionFrom", args?.versionFromID);
		if (args?.selectedLocales) if (!args.selectedLocales.length) current.delete("localeCodes");
		else {
			const selectedLocaleCodes = [];
			for (const locale_0 of args.selectedLocales) if (locale_0.selected) selectedLocaleCodes.push(locale_0.name);
			current.set("localeCodes", JSON.stringify(selectedLocaleCodes));
		}
		if (args?.modifiedOnly === false) current.set("modifiedOnly", "false");
		else if (args?.modifiedOnly === true) current.delete("modifiedOnly");
		const search = current.toString();
		const query = search ? `?${search}` : "";
		startRouteTransition(() => router.push(`${pathname}${query}`));
	}, [
		pathname,
		router,
		searchParams,
		startRouteTransition
	]);
	const onToggleModifiedOnly = (0, import_react.useCallback)((event) => {
		const newModified = event.target.checked;
		setModifiedOnly(newModified);
		updateSearchParams({ modifiedOnly: newModified });
	}, [updateSearchParams]);
	const onChangeSelectedLocales = (0, import_react.useCallback)(({ locales: locales_0 }) => {
		setLocales(locales_0);
		updateSearchParams({ selectedLocales: locales_0 });
	}, [updateSearchParams]);
	const onChangeVersionFrom = (0, import_react.useCallback)((val) => {
		updateSearchParams({ versionFromID: val.value });
	}, [updateSearchParams]);
	const { localization } = config;
	const versionToTimeAgo = (0, import_react.useMemo)(() => t("version:versionAgo", { distance: B1({
		date: versionToCreatedAt,
		i18n
	}) }), [
		versionToCreatedAt,
		i18n,
		t
	]);
	const versionFromTimeAgo = (0, import_react.useMemo)(() => versionFromCreatedAt ? t("version:versionAgo", { distance: B1({
		date: versionFromCreatedAt,
		i18n
	}) }) : void 0, [
		versionFromCreatedAt,
		i18n,
		t
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: baseClass,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(_o, {
				className: `${baseClass}-controls-top`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}-controls-top__wrapper`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: i18n.t("version:compareVersions") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${baseClass}-controls-top__wrapper-actions`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `${baseClass}__modifiedCheckBox`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(go, {
								checked: modifiedOnly,
								id: "modifiedOnly",
								label: i18n.t("version:modifiedOnly"),
								onToggle: onToggleModifiedOnly
							})
						}), localization && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(yt, {
							"aria-controls": `${baseClass}-locales`,
							"aria-expanded": localeSelectorOpen,
							className: `${baseClass}__toggle-locales`,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ze, { direction: localeSelectorOpen ? "up" : "down" }),
							onClick: () => setLocaleSelectorOpen((localeSelectorOpen_0) => !localeSelectorOpen_0),
							pillStyle: "light",
							size: "small",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `${baseClass}__toggle-locales-label`,
								children: [
									t("general:locales"),
									":",
									" "
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `${baseClass}__toggle-locales-list`,
								children: locales.filter((locale_1) => locale_1.selected).map((locale_2) => locale_2.name).join(", ")
							})]
						})]
					})]
				}), localization && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLocales, {
					locales,
					localeSelectorOpen,
					onChange: onChangeSelectedLocales
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_o, {
				className: `${baseClass}-controls-bottom`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}-controls-bottom__wrapper`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${baseClass}__version-from`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `${baseClass}__version-from-labels`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("version:comparingAgainst") }), versionFromTimeAgo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `${baseClass}__time-elapsed`,
								children: versionFromTimeAgo
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectComparison, {
							collectionSlug,
							docID: originalDocID,
							globalSlug,
							onChange: onChangeVersionFrom,
							versionFromID,
							versionFromOptions
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `${baseClass}__version-to`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `${baseClass}__version-to-labels`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("version:currentlyViewing") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `${baseClass}__time-elapsed`,
								children: versionToTimeAgo
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `${baseClass}__version-to-version`,
							children: [VersionToCreatedAtLabel, canUpdate && !isTrashed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Restore, {
								className: `${baseClass}__restore`,
								collectionConfig,
								globalConfig,
								label: collectionConfig?.labels.singular || globalConfig?.label,
								originalDocID,
								status: versionToStatus,
								versionDateFormatted: versionToCreatedAtFormatted,
								versionID: versionToID
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetStepNav, {
				collectionConfig,
				globalConfig,
				id: originalDocID,
				isTrashed,
				versionToCreatedAtFormatted,
				versionToID
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(_o, {
				className: `${baseClass}__diff-wrap`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectedLocalesContext, {
					value: { selectedLocales: locales.map((locale_3) => locale_3.name) },
					children: versionToCreatedAt && RenderedDiff
				})
			})
		]
	});
};
//#endregion
export { DefaultVersionView };
