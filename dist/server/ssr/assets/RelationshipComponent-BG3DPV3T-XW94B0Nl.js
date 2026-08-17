import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { Qt as formatAdminURL, bn as se, gn as getTranslation, mn as WP, tt as hX, yt as re } from "./client-CJQLBaQM.js";
import { F as G, G as a, Gt as o$1, R as _$1, ft as Mo } from "./client-Dd-hh4YI.js";
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/RelationshipComponent-BG3DPV3T.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var _ = { depth: 0 }, Z = (R) => {
	let { className: e, data: { relationTo: g, value: a$1 }, nodeKey: s } = R;
	if (typeof a$1 == "object") throw new Error("Relationship value should be a string or number. The Lexical Relationship component should not receive the populated value object.");
	let v = (0, import_react.useRef)(null), [l] = o$1(), i = a(), { config: { routes: { api: C }, serverURL: N }, getEntityConfig: w } = se(), [t] = (0, import_react.useState)(() => w({ collectionSlug: g })), { i18n: x, t: n } = WP(), [u, D] = (0, import_react.useReducer)((r) => r + 1, 0), [{ data: m }, { setParams: d }] = hX(formatAdminURL({
		apiRoute: C,
		path: `/${t.slug}/${a$1}`,
		serverURL: N
	}), { initialParams: _ }), { closeDocumentDrawer: p, DocumentDrawer: $, DocumentDrawerToggler: E } = G({
		id: a$1,
		collectionSlug: t.slug
	}), T = (0, import_react.useCallback)(() => {
		l.update(() => {
			Mo(s)?.remove();
		});
	}, [l, s]), y = import_react.useCallback(() => {
		d({
			..._,
			cacheBust: u
		}), p(), D();
	}, [
		u,
		d,
		p
	]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: `${e}__contents`,
		contentEditable: !1,
		ref: v,
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: `${e}__wrap`,
				children: [(0, import_jsx_runtime.jsx)("p", {
					className: `${e}__label`,
					children: n("fields:labelRelationship", { label: t.labels?.singular ? getTranslation(t.labels?.singular, x) : t.slug })
				}), (0, import_jsx_runtime.jsx)(E, {
					className: `${e}__doc-drawer-toggler`,
					children: (0, import_jsx_runtime.jsx)("p", {
						className: `${e}__title`,
						children: m ? m[t?.admin?.useAsTitle || "id"] : a$1
					})
				})]
			}),
			i && (0, import_jsx_runtime.jsxs)("div", {
				className: `${e}__actions`,
				children: [(0, import_jsx_runtime.jsx)(re, {
					buttonStyle: "icon-label",
					className: `${e}__swapButton`,
					disabled: !i,
					el: "button",
					icon: "swap",
					onClick: () => {
						s && l.dispatchCommand(_$1, { replace: { nodeKey: s } });
					},
					round: !0,
					tooltip: n("fields:swapRelationship")
				}), (0, import_jsx_runtime.jsx)(re, {
					buttonStyle: "icon-label",
					className: `${e}__removeButton`,
					disabled: !i,
					icon: "x",
					onClick: (r) => {
						r.preventDefault(), T();
					},
					round: !0,
					tooltip: n("fields:removeRelationship")
				})]
			}),
			!!a$1 && (0, import_jsx_runtime.jsx)($, { onSave: y })
		]
	});
};
//#endregion
export { Z as RelationshipComponent };
