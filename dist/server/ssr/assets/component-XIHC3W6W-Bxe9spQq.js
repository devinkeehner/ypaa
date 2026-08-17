import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { Qt as formatAdminURL, Tt as tu, V as at, bn as se, gn as getTranslation, j as Rr, mn as WP, tn as isImage, tt as hX, yt as re } from "./client-CJQLBaQM.js";
import { F as G, G as a$1, Gt as o, I as de$1, J as F, L as he, ft as Mo, q as I } from "./client-Dd-hh4YI.js";
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/component-XIHC3W6W.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var E = { depth: 0 }, Se = (L) => {
	let { className: e, data: { fields: U, relationTo: f, value: d }, format: P, nodeKey: l } = L;
	if (typeof d == "object") throw new Error("Upload value should be a string or number. The Lexical Upload component should not receive the populated value object.");
	let { config: { routes: { api: T }, serverURL: F$1 }, getEntityConfig: j } = se(), I$1 = (0, import_react.useRef)(null), { uuid: z } = I(), A = at(), [i] = o(), { editorConfig: B, fieldProps: { schemaPath: k } } = I(), c = a$1(), { i18n: g, t: s } = WP(), [_, K] = (0, import_react.useReducer)((r) => r + 1, 0), [o$1] = (0, import_react.useState)(() => j({ collectionSlug: f })), M = (0, import_react.useId)(), b = tu({
		slug: "lexical-upload-drawer-" + z + M,
		depth: A
	}), { toggleDrawer: O } = F(b, !0), { closeDocumentDrawer: w, DocumentDrawer: W, DocumentDrawerToggler: H } = G({
		id: d,
		collectionSlug: o$1.slug
	}), [{ data: t }, { setParams: D }] = hX(formatAdminURL({
		apiRoute: T,
		path: `/${o$1.slug}/${d}`,
		serverURL: F$1
	}), { initialParams: E }), v = t?.thumbnailURL || t?.url, q = (0, import_react.useCallback)(() => {
		i.update(() => {
			Mo(l)?.remove();
		});
	}, [i, l]), G$1 = (0, import_react.useCallback)((r) => {
		D({
			...E,
			cacheBust: _
		}), K(), w();
	}, [
		D,
		_,
		w
	]), x = B?.resolvedFeatureMap?.get("upload")?.sanitizedClientFeatureProps.collections?.[o$1.slug]?.hasExtraFields, J = (0, import_react.useCallback)((r, V) => {
		i.update(() => {
			let u = Mo(l);
			if (u) {
				let X = {
					...u.getData(),
					fields: V
				};
				u.setData(X);
			}
		});
	}, [i, l]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: `${e}__contents ${e}__contents--${v && t?.width && t?.height ? t.width > t.height ? "landscape" : "portrait" : "landscape"}`,
		"data-align": P || void 0,
		"data-filename": t?.filename,
		ref: I$1,
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: `${e}__card`,
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: `${e}__media`,
					children: [(0, import_jsx_runtime.jsx)(Rr, {
						collectionSlug: f,
						fileSrc: isImage(t?.mimeType) ? v : null,
						height: t?.height,
						size: "none",
						width: t?.width
					}), c && (0, import_jsx_runtime.jsx)("div", {
						className: `${e}__overlay ${e}__floater`,
						children: (0, import_jsx_runtime.jsxs)("div", {
							className: `${e}__actions`,
							role: "toolbar",
							children: [
								x ? (0, import_jsx_runtime.jsx)(re, {
									buttonStyle: "icon-label",
									className: `${e}__upload-drawer-toggler`,
									disabled: !c,
									el: "button",
									icon: "edit",
									onClick: O,
									round: !0,
									size: "medium",
									tooltip: s("fields:editRelationship")
								}) : null,
								(0, import_jsx_runtime.jsx)(re, {
									buttonStyle: "icon-label",
									className: `${e}__swap-drawer-toggler`,
									disabled: !c,
									el: "button",
									icon: "swap",
									onClick: () => {
										i.dispatchCommand(he, { replace: { nodeKey: l } });
									},
									round: !0,
									size: "medium",
									tooltip: s("fields:swapUpload")
								}),
								(0, import_jsx_runtime.jsx)(re, {
									buttonStyle: "icon-label",
									className: `${e}__removeButton`,
									disabled: !c,
									icon: "x",
									onClick: (r) => {
										r.preventDefault(), q();
									},
									round: !0,
									size: "medium",
									tooltip: s("fields:removeUpload")
								})
							]
						})
					})]
				}), (0, import_jsx_runtime.jsxs)("div", {
					className: `${e}__metaOverlay ${e}__floater`,
					children: [(0, import_jsx_runtime.jsx)(H, {
						className: `${e}__doc-drawer-toggler`,
						children: (0, import_jsx_runtime.jsx)("strong", {
							className: `${e}__filename`,
							children: t?.filename || s("general:untitled")
						})
					}), (0, import_jsx_runtime.jsx)("div", {
						className: `${e}__collectionLabel`,
						children: getTranslation(o$1.labels.singular, g)
					})]
				})]
			}),
			d ? (0, import_jsx_runtime.jsx)(W, { onSave: G$1 }) : null,
			x ? (0, import_jsx_runtime.jsx)(de$1, {
				data: U,
				drawerSlug: b,
				drawerTitle: s("general:editLabel", { label: getTranslation(o$1.labels.singular, g) }),
				featureKey: "upload",
				handleDrawerSubmit: J,
				schemaPath: k,
				schemaPathSuffix: o$1.slug
			}) : null
		]
	});
};
//#endregion
export { Se as UploadComponent };
