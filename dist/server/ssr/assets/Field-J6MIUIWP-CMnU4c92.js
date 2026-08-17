import { C as require_react, j as __toESM, n as require_jsx_runtime, t as require_react_dom } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { A as Re, At as xe$1, I as Ze, K as de$1, L as Zi, Lt as dequal, Ot as we$1, V as at$1, Y as et$1, _t as qe$1, an as require_objectid, bn as se$1, c as Cy, ht as ot$1, lt as it$1, mn as WP, o as Ce } from "./client-CJQLBaQM.js";
import { $ as Do$1, Bt as xs, C as bt$1, Dt as ec, Et as be, Ft as qs, G as a, Gt as o, Ht as z$1, It as re$1, K as H$1, Lt as we$2, Rt as wr, T as F$1, Tt as Zn$1, V as At$1, Vt as yr, Wt as zo$1, X as $r, _ as pr$1, at as Io$1, bt as Vi, c as Br, ct as Jr, d as Vr, dt as Me, et as Ge$1, f as Wo$1, ft as Mo$1, g as nn, gt as Pi, h as bt, ht as Pe$1, it as Ii, jt as oe, kt as lr, l as G, m as be$1, mt as Or, nt as He$1, ot as Is, p as Xr, pt as Ms, q as I, s as $r$1, st as Je$1, u as Ur, ut as Li, vt as Ue$1 } from "./client-Dd-hh4YI.js";
import { a as q$1 } from "./shared-jREwlcRe.js";
import { a as x, i as n, n as n$1, o as f, r as a$1, t as L$1 } from "./LexicalRichTextPlugin.prod-DGz_S57W.js";
//#region node_modules/react-error-boundary/dist/react-error-boundary.esm.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react());
var ErrorBoundaryContext = (0, import_react.createContext)(null);
var initialState = {
	didCatch: false,
	error: null
};
var ErrorBoundary = class extends import_react.Component {
	constructor(props) {
		super(props);
		this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
		this.state = initialState;
	}
	static getDerivedStateFromError(error) {
		return {
			didCatch: true,
			error
		};
	}
	resetErrorBoundary() {
		const { error } = this.state;
		if (error !== null) {
			var _this$props$onReset, _this$props;
			for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
			(_this$props$onReset = (_this$props = this.props).onReset) === null || _this$props$onReset === void 0 || _this$props$onReset.call(_this$props, {
				args,
				reason: "imperative-api"
			});
			this.setState(initialState);
		}
	}
	componentDidCatch(error, info) {
		var _this$props$onError, _this$props2;
		(_this$props$onError = (_this$props2 = this.props).onError) === null || _this$props$onError === void 0 || _this$props$onError.call(_this$props2, error, info);
	}
	componentDidUpdate(prevProps, prevState) {
		const { didCatch } = this.state;
		const { resetKeys } = this.props;
		if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
			var _this$props$onReset2, _this$props3;
			(_this$props$onReset2 = (_this$props3 = this.props).onReset) === null || _this$props$onReset2 === void 0 || _this$props$onReset2.call(_this$props3, {
				next: resetKeys,
				prev: prevProps.resetKeys,
				reason: "keys"
			});
			this.setState(initialState);
		}
	}
	render() {
		const { children, fallbackRender, FallbackComponent, fallback } = this.props;
		const { didCatch, error } = this.state;
		let childToRender = children;
		if (didCatch) {
			const props = {
				error,
				resetErrorBoundary: this.resetErrorBoundary
			};
			if (typeof fallbackRender === "function") childToRender = fallbackRender(props);
			else if (FallbackComponent) childToRender = (0, import_react.createElement)(FallbackComponent, props);
			else if (fallback !== void 0) childToRender = fallback;
			else throw error;
		}
		return (0, import_react.createElement)(ErrorBoundaryContext.Provider, { value: {
			didCatch,
			error,
			resetErrorBoundary: this.resetErrorBoundary
		} }, childToRender);
	}
};
function hasArrayChanged() {
	let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
	let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
	return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/Field-J6MIUIWP.js
var import_compiler_runtime = require_compiler_runtime();
var import_objectid = /* @__PURE__ */ __toESM(require_objectid(), 1);
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var K = ({ anchorElem: e, clientProps: t, plugin: o }) => o.position === "floatingAnchorElem" && e ? o.Component && (0, import_jsx_runtime.jsx)(o.Component, {
	anchorElem: e,
	clientProps: t
}) : o.Component && (0, import_jsx_runtime.jsx)(o.Component, { clientProps: t });
var we = (e) => {
	if ("fields" in e && typeof e.fields == "object" && e.fields !== null && "id" in e.fields ? e.fields.id = new import_objectid.default.default().toHexString() : "id" in e && (e.id = new import_objectid.default.default().toHexString()), e.children) for (let t of e.children) we(t);
};
function Ve() {
	let e = (0, import_compiler_runtime.c)(3), [t] = o(), o$2, n;
	return e[0] !== t ? (o$2 = () => t.registerCommand(Je$1, (r) => {
		let c = $r();
		if (Or(c)) {
			let s = c.getNodes()[0]?.exportJSON(), a = JSON.parse(JSON.stringify(s));
			we(a);
			let f = {
				namespace: t._config.namespace,
				nodes: [a]
			};
			return F$1(t, null, {
				"application/x-lexical-editor": JSON.stringify(f),
				"text/plain": ""
			}).catch(qt), !0;
		}
		return F$1(t, At$1(r, ClipboardEvent) ? r : null).then(() => {
			if (!(r instanceof ClipboardEvent) || !r.clipboardData) throw new Error("No clipboard event");
			let l = r.clipboardData.getData("application/x-lexical-editor");
			if (!l) return !0;
			let s = JSON.parse(l);
			for (let f of s.nodes) we(f);
			let a = JSON.stringify(s);
			r.clipboardData.setData("application/x-lexical-editor", a);
		}).catch((l) => {
			throw r instanceof ClipboardEvent && r.clipboardData?.setData("application/x-lexical-editor", ""), l;
		}), !0;
	}, 1), n = [t], e[0] = t, e[1] = o$2, e[2] = n) : (o$2 = e[1], n = e[2]), (0, import_react.useEffect)(o$2, n), null;
}
function qt(e) {
	throw e;
}
function Ge() {
	let e = (0, import_compiler_runtime.c)(3), [t] = o(), o$3 = Co, n, r;
	return e[0] !== t ? (n = () => ec(t.registerCommand(oe, xo, 1), t.registerCommand(Pe$1, o$3, 1), t.registerCommand(Me, o$3, 1), t.registerCommand(re$1, yo, 1), t.registerCommand(be, go, 1), t.registerCommand(we$2, mo, 1)), r = [t], e[0] = t, e[1] = n, e[2] = r) : (n = e[1], r = e[2]), (0, import_react.useEffect)(n, r), null;
}
function mo(e) {
	let t = $r();
	if (Or(t)) {
		e.preventDefault();
		let l = t.getNodes()[0]?.getNextSibling();
		if (Li(l)) {
			let f = Is().getElementByKey(l.getKey());
			return f && ne({
				element: f,
				node: l
			}), !0;
		}
		if (!Pi(l)) return !0;
		let s = l.getFirstDescendant() ?? l;
		return s && (qs(s, de)?.selectEnd(), e.preventDefault()), !0;
	}
	if (!wr(t)) return !1;
	let r = qs((t.isBackward() ? t.anchor : t.focus).getNode(), po), c = r?.getNextSibling();
	if (!r || c !== Ue(r)) return !1;
	if (Li(c)) {
		let l = Is().getElementByKey(c.getKey());
		if (l) return ne({
			element: l,
			node: c
		}), e.preventDefault(), !0;
	}
	return !1;
}
function po(e) {
	return Ue(e) !== null;
}
function go(e) {
	let t = $r();
	if (Or(t)) {
		let l = t.getNodes()[0]?.getPreviousSibling();
		if (Li(l)) {
			let f = Is().getElementByKey(l.getKey());
			return f ? (ne({
				element: f,
				node: l
			}), e.preventDefault(), !0) : !1;
		}
		if (!Pi(l)) return !1;
		let s = l.getLastDescendant() ?? l;
		return s ? (qs(s, de)?.selectStart(), e.preventDefault(), !0) : !1;
	}
	if (!wr(t)) return !1;
	let r = qs((t.isBackward() ? t.anchor : t.focus).getNode(), ho), c = r?.getPreviousSibling();
	if (!r || c !== Je(r)) return !1;
	if (Li(c)) {
		let l = Is().getElementByKey(c.getKey());
		if (l) return ne({
			element: l,
			node: c
		}), e.preventDefault(), !0;
	}
	return !1;
}
function ho(e) {
	return Je(e) !== null;
}
function yo() {
	let e = No();
	return document.querySelector(".decorator-selected")?.classList.remove("decorator-selected"), e ? (e.element?.classList.add("decorator-selected"), !0) : !1;
}
function xo(e) {
	document.querySelector(".decorator-selected")?.classList.remove("decorator-selected");
	let t = Eo(e);
	if (!t) return !0;
	let { target: o } = e;
	return !(o instanceof HTMLElement) || o.isContentEditable || o.closest("button, textarea, input, .react-select, .code-editor, .no-select-decorator, [role=\"button\"]") ? zo$1(null) : ne(t), !0;
}
function Co(e) {
	let t = $r();
	return Or(t) ? (e.preventDefault(), t.getNodes().forEach(bo), !0) : !1;
}
function bo(e) {
	e.remove();
}
function Eo(e) {
	if (!(e.target instanceof HTMLElement)) return;
	let t = e.target.closest("[data-lexical-decorator=\"true\"]");
	if (!(t instanceof HTMLElement)) return;
	let o = Do$1(t);
	return Li(o) ? {
		element: t,
		node: o
	} : void 0;
}
function No() {
	let e = $r();
	if (!Or(e)) return;
	let t = e.getNodes();
	if (t.length !== 1) return;
	let o = t[0];
	return Li(o) ? {
		decorator: o,
		element: Is().getElementByKey(o.getKey())
	} : void 0;
}
function ne({ element: e, node: t }) {
	document.querySelector(".decorator-selected")?.classList.remove("decorator-selected");
	let o = Jr();
	o.add(t.getKey()), zo$1(o), e.scrollIntoView({
		behavior: "smooth",
		block: "nearest"
	}), e.classList.add("decorator-selected");
}
function de(e) {
	if (Li(e) && !e.isInline()) return !0;
	if (!Pi(e) || xs(e)) return !1;
	let t = e.getFirstChild(), o = t === null || Zn$1(t) || yr(t) || t.isInline();
	return !e.isInline() && e.canBeEmpty() !== !1 && o;
}
function Ue(e) {
	let t = e.getNextSibling();
	for (; t !== null;) {
		if (de(t)) return t;
		t = t.getNextSibling();
	}
	return null;
}
function Je(e) {
	let t = e.getPreviousSibling();
	for (; t !== null;) {
		if (de(t)) return t;
		t = t.getPreviousSibling();
	}
	return null;
}
var U = (e, t, o, n, r = 50, c = 25) => {
	let l = 0;
	if (e && !e.contains(n)) {
		let { bottom: s, left: a, right: f, top: p } = e.getBoundingClientRect(), u = p + window.scrollY, i = s + window.scrollY;
		if (o < u - c || o > i + c || t < a - r || t > f + r) return -1;
		(t < a || t > f) && (l = t < a ? t - a : t - f);
	}
	return l;
};
function J(e) {
	let t = e.getBoundingClientRect(), o = getComputedStyle(e).getPropertyValue("transform");
	if (!o || o === "none") return t;
	let n = o.split(",").pop();
	return t.y = t.y - Number(n?.replace(")", "")), t;
}
function fe(e) {
	let t = (a, f) => a ? parseFloat(window.getComputedStyle(a)[f]) : 0, { marginBottom: o, marginTop: n } = window.getComputedStyle(e), r = t(e.previousElementSibling, "marginBottom"), c = t(e.nextElementSibling, "marginTop");
	return {
		marginBottom: Math.max(parseFloat(o), c),
		marginTop: Math.max(parseFloat(n), r)
	};
}
function z(e) {
	return e.getEditorState().read(() => Io$1().getChildrenKeys());
}
var So = 1, Po = -1, qe = 0, A = {
	props: null,
	result: null
};
function Ro(e, t, o = 20) {
	let n = e.x - t.x, r = e.y - t.y;
	return n * n + r * r <= o * o;
}
function q(e) {
	let { anchorElem: t, cache_threshold: o = 20, editor: n, fuzzy: r = !1, horizontalOffset: c = 0, point: { x: l, y: s }, startIndex: a = 0, useEdgeAsDefault: f = !1 } = e;
	if (o > 0 && A.props && A.result && A.props.fuzzy === e.fuzzy && A.props.horizontalOffset === e.horizontalOffset && A.props.useEdgeAsDefault === e.useEdgeAsDefault && Ro(A.props.point, e.point, o)) return A.result;
	let p = t.getBoundingClientRect(), u = z(n), i = {
		blockElem: null,
		blockNode: null,
		distance: Infinity,
		foundAtIndex: -1,
		isFoundNodeEmptyParagraph: !1
	};
	return n.getEditorState().read(() => {
		if (f) {
			let h = n.getElementByKey(u[0]), m = n.getElementByKey(u[u.length - 1]);
			if (h && m) {
				let [d, g] = [J(h), J(m)];
				if (s < d.top ? (i.blockElem = h, i.distance = d.top - s, i.blockNode = Mo$1(u[0]), i.foundAtIndex = 0) : s > g.bottom && (i.distance = s - g.bottom, i.blockNode = Mo$1(u[u.length - 1]), i.blockElem = m, i.foundAtIndex = u.length - 1), i?.blockElem) return {
					blockElem: null,
					isFoundNodeEmptyParagraph: !1
				};
			}
		}
		let y = a, x = qe;
		for (; y >= 0 && y < u.length;) {
			let h = u[y], m = n.getElementByKey(h);
			if (m === null) break;
			let d = new G(l + c, s), g = bt.fromDOMRect(J(m)), { marginBottom: C, marginTop: P } = fe(m), { distance: S, isOnBottomSide: _, isOnTopSide: N } = g.generateNewRect({
				bottom: g.bottom + C,
				left: p.left,
				right: p.right,
				top: g.top - P
			}).distanceFromPoint(d);
			if (S === 0) {
				i.blockElem = m, i.blockNode = Mo$1(h), i.foundAtIndex = y, i.distance = S, i.blockNode && i.blockNode.getType() === "paragraph" && i.blockNode.getTextContent() === "" && (!r && !e.returnEmptyParagraphs && (i.blockElem = null, i.blockNode = null), i.isFoundNodeEmptyParagraph = !0);
				break;
			} else r && S < i.distance && (i.blockElem = m, i.blockNode = Mo$1(h), i.distance = S, i.foundAtIndex = y);
			x === qe && (N ? x = Po : _ ? x = So : x = Infinity), y += x;
		}
	}), A.props = e, A.result = {
		blockElem: i.blockElem,
		blockNode: i.blockNode,
		foundAtIndex: i.foundAtIndex,
		isFoundNodeEmptyParagraph: i.isFoundNodeEmptyParagraph
	}, {
		blockElem: i.blockElem,
		blockNode: i.blockNode,
		foundAtIndex: i.foundAtIndex,
		isFoundNodeEmptyParagraph: i.isFoundNodeEmptyParagraph
	};
}
function pe(e, t) {
	return !!e.closest(`.${t}`);
}
var To = [
	"IMG",
	"INPUT",
	"TEXTAREA",
	"SELECT",
	"BUTTON",
	"VIDEO",
	"OBJECT",
	"EMBED",
	"IFRAME",
	"HR"
];
function Qe(e) {
	if (!e || To.includes(e.tagName) || e.offsetHeight === 0 || e.offsetWidth === 0) return !1;
	let t = window.getComputedStyle(e);
	return !(t.display === "table-cell" || t.position === "absolute" || t.visibility === "hidden" || t.opacity === "0");
}
function ge(e, t, o, n = 0) {
	if (!e) {
		t.style.opacity = "0", t.style.transform = "translate(-10000px, -10000px)";
		return;
	}
	let r = e.getBoundingClientRect(), c = window.getComputedStyle(e), l = t.getBoundingClientRect(), s = o.getBoundingClientRect(), a;
	if ([
		"LexicalEditorTheme__block",
		"LexicalEditorTheme__upload",
		"LexicalEditorTheme__relationship"
	].some((u) => e.classList.contains(u) || e.firstElementChild?.classList.contains(u))) a = r.top + 8 - s.top;
	else {
		let u = Qe(e) ? parseInt(c.lineHeight, 10) : 0;
		a = r.top + (u - l.height) / 2 - s.top;
	}
	let p = n;
	t.style.opacity = "1", t.style.transform = `translate(${p}px, ${a}px)`;
}
var Bo = "add-block-menu", he = Infinity;
function Oo(e) {
	return e === 0 ? Infinity : he >= 0 && he < e ? he : Math.floor(e / 2);
}
function Io(e, t, o) {
	let n = t.parentElement, { editorConfig: r } = I(), c = r?.admin?.hideGutter ? -24 : 12, l = (0, import_react.useRef)(null), [s, a] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		function p(u) {
			let i = u.target;
			if (!Ms(i)) return;
			let y = U(n, u.pageX, u.pageY, i);
			if (y === -1) {
				a(null);
				return;
			}
			if (pe(i, Bo)) return;
			let x = z(e), { blockElem: h, blockNode: m, foundAtIndex: d } = q({
				anchorElem: t,
				cache_threshold: 0,
				editor: e,
				horizontalOffset: -y,
				point: new G(u.x, u.y),
				returnEmptyParagraphs: !0,
				startIndex: Oo(x.length),
				useEdgeAsDefault: !1
			});
			he = d, h && m && (s?.node !== m || s?.elem !== h) && a({
				elem: h,
				node: m
			});
		}
		return document?.addEventListener("mousemove", p), () => {
			document?.removeEventListener("mousemove", p);
		};
	}, [
		n,
		t,
		e,
		s
	]), (0, import_react.useEffect)(() => {
		l.current && s?.node && ge(s?.elem, l.current, t, c);
	}, [
		t,
		s,
		c
	]);
	let f = (0, import_react.useCallback)((p) => {
		let u = s;
		u?.node && (e.update(() => {
			let i = !0;
			if ((u?.node.getType() !== "paragraph" || u.node.getTextContent() !== "") && (i = !1), !i) {
				let y = Vi();
				u?.node.insertAfter(y), setTimeout(() => {
					u = {
						elem: e.getElementByKey(y.getKey()),
						node: y
					}, a(u);
				}, 0);
			}
		}), setTimeout(() => {
			e.update(() => {
				e.focus(), u?.node && "select" in u.node && typeof u.node.select == "function" && u.node.select();
			});
		}, 1), setTimeout(() => {
			e.dispatchCommand(nn, { node: u?.node });
		}, 2), p.stopPropagation(), p.preventDefault());
	}, [e, s]);
	return (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsx)(import_react.Fragment, { children: (0, import_jsx_runtime.jsx)("button", {
		"aria-label": "Add block",
		className: "icon add-block-menu",
		onClick: (p) => {
			f(p);
		},
		ref: l,
		type: "button",
		children: (0, import_jsx_runtime.jsx)("div", { className: o ? "icon" : "" })
	}) }), t);
}
function et(e) {
	let { anchorElem: t } = e, o$4 = t === void 0 ? document.body : t, [n] = o();
	return Io(n, o$4, n._editable);
}
var tt = 0, Fo = -24;
var H = 0;
function ot(e, t, o, n, r, c, l, s, a, f = !1) {
	let { height: p, top: u } = n.getBoundingClientRect(), { top: i, width: y } = l.getBoundingClientRect(), { marginBottom: x, marginTop: h } = fe(n), m = u, d = c >= u + p / 2 + window.scrollY, g = !1;
	if (r?.elem) if (n !== r?.elem) (d && r?.elem && r?.elem === n.nextElementSibling || !d && r?.elem && r?.elem === n.previousElementSibling) && (H++, H < 200 && (g = !0));
	else {
		H++;
		let S = r?.boundingBox?.y, _ = n.getBoundingClientRect().y;
		(d === r?.isBelow && S === _ || H < 200) && (g = !1);
	}
	if (g) return {
		isBelow: d,
		willStayInSamePosition: g
	};
	f ? m += p / 2 : d ? m += p + x / 2 : m -= h / 2;
	let C = 0;
	f || (d ? C = -tt : C = tt);
	let P = m - i + C, R = Fo - t;
	return o.style.width = `calc(${y}px - ${e})`, o.style.opacity = ".8", o.style.transform = `translate(${R}px, calc(${P}px - 2px))`, r?.elem && (r.elem.style.opacity = "", r?.elem === n ? d ? r.elem.style.marginTop = "" : r.elem.style.marginBottom = "" : (r.elem.style.marginBottom = "", r.elem.style.marginTop = "")), H = 0, {
		isBelow: d,
		willStayInSamePosition: g
	};
}
var Ho = "draggable-block-menu", st = "application/x-lexical-drag-block", re = Infinity;
function lt(e) {
	return e === 0 ? Infinity : re >= 0 && re < e ? re : Math.floor(e / 2);
}
function Vo(e, t) {
	let { transform: o } = t.style;
	e.setDragImage(t, 0, 0), setTimeout(() => {
		t.style.transform = o;
	});
}
function at(e, t) {
	e && (e.style.opacity = "0"), t && (t.style.opacity = "", t.style.marginBottom = "", t.style.marginTop = "");
}
function Wo(e, t, o) {
	let n = t.parentElement, r = (0, import_react.useRef)(null), c = (0, import_react.useRef)(null), l = (0, import_react.useRef)(null), s = (0, import_react.useRef)(!1), [a, f] = (0, import_react.useState)(null), [p, u] = (0, import_react.useState)(null), { editorConfig: i } = I(), y = i?.admin?.hideGutter ? -44 : -8;
	(0, import_react.useEffect)(() => {
		function m(d) {
			let g = d.target;
			if (!Ms(g)) return;
			let C = U(n, d.pageX, d.pageY, g);
			if (C === -1) {
				f(null);
				return;
			}
			if (pe(g, Ho)) return;
			let P = z(e), { blockElem: R, foundAtIndex: S, isFoundNodeEmptyParagraph: _ } = q({
				anchorElem: t,
				cache_threshold: 0,
				editor: e,
				horizontalOffset: -C,
				point: new G(d.x, d.y),
				startIndex: lt(P.length),
				useEdgeAsDefault: !1,
				verbose: !1
			});
			re = S, !(!R && !_) && a !== R && f(R);
		}
		return document?.addEventListener("mousemove", m), () => {
			document?.removeEventListener("mousemove", m);
		};
	}, [
		n,
		t,
		e,
		a
	]), (0, import_react.useEffect)(() => {
		r.current && ge(a, r.current, t, y);
	}, [
		t,
		a,
		y
	]), (0, import_react.useEffect)(() => {
		function m(g) {
			if (!s.current) return !1;
			let [C] = bt$1(g);
			if (C) return !1;
			let { pageY: P, target: R } = g;
			if (!Ms(R)) return !1;
			let S = U(n, g.pageX, g.pageY, R, 100, 50), _ = z(e), { blockElem: N, foundAtIndex: ee, isFoundNodeEmptyParagraph: v } = q({
				anchorElem: t,
				editor: e,
				fuzzy: !0,
				horizontalOffset: -S,
				point: new G(g.x, g.y),
				startIndex: lt(_.length),
				useEdgeAsDefault: !0,
				verbose: !0
			});
			re = ee;
			let T = c.current;
			if (N === null || T === null) return !1;
			if (a !== N) {
				let { isBelow: k, willStayInSamePosition: V } = ot(i?.admin?.hideGutter ? "0px" : "3rem", y + (i?.admin?.hideGutter ? r?.current?.getBoundingClientRect()?.width ?? 0 : -(r?.current?.getBoundingClientRect()?.width ?? 0)), T, N, p, P, t, g, l, v);
				g.preventDefault(), V || u({
					boundingBox: N.getBoundingClientRect(),
					elem: N,
					isBelow: k
				});
			} else p?.elem && (at(T, p.elem), u({
				boundingBox: N.getBoundingClientRect(),
				elem: N,
				isBelow: !1
			}));
			return !0;
		}
		function d(g) {
			if (!s.current) return !1;
			let [C] = bt$1(g);
			if (C) return !1;
			let { dataTransfer: P, pageY: R, target: S } = g, _ = P?.getData(st) || "";
			return e.update(() => {
				let N = Mo$1(_);
				if (!N || !Ms(S)) return !1;
				let { blockElem: v, isFoundNodeEmptyParagraph: T } = q({
					anchorElem: t,
					editor: e,
					fuzzy: !0,
					horizontalOffset: -U(n, g.pageX, g.pageY, S, 100, 50),
					point: new G(g.x, g.y),
					useEdgeAsDefault: !0
				});
				if (!v) return !1;
				let k = Do$1(v);
				if (!k) return !1;
				if (k === N) return !0;
				let { height: V, top: $ } = J(v), W = R >= $ + V / 2 + window.scrollY;
				T ? (k.insertBefore(N), k.remove()) : W ? k.insertAfter(N) : k.insertBefore(N), a !== null && f(null), document.querySelectorAll(".lexical-block-highlighter").forEach((D) => {
					D.remove();
				});
				let be = e.getElementByKey(N.getKey());
				setTimeout(() => {
					let D = be?.getBoundingClientRect();
					if (!D) return;
					let E = document.createElement("div");
					E.className = "lexical-block-highlighter", E.style.backgroundColor = "var(--theme-elevation-1000", E.style.transition = "opacity 0.5s ease-in-out", E.style.zIndex = "1", E.style.pointerEvents = "none", E.style.boxSizing = "border-box", E.style.borderRadius = "4px", E.style.position = "absolute", document.body.appendChild(E), E.style.opacity = "0.1", E.style.height = `${D.height + 8}px`, E.style.width = `${D.width + 8}px`, E.style.top = `${D.top + window.scrollY - 4}px`, E.style.left = `${D.left - 4}px`, setTimeout(() => {
						E.style.opacity = "0", setTimeout(() => {
							E.remove();
						}, 500);
					}, 1e3);
				}, 120);
			}), !0;
		}
		return document.addEventListener("dragover", m), document.addEventListener("drop", d), () => {
			document.removeEventListener("dragover", m), document.removeEventListener("drop", d);
		};
	}, [
		n,
		y,
		t,
		e,
		p,
		a,
		i?.admin?.hideGutter
	]);
	function x(m) {
		let d = m.dataTransfer;
		if (!d || !a) return;
		Vo(d, a);
		let g = "";
		e.update(() => {
			let C = Do$1(a);
			C && (g = C.getKey());
		}), s.current = !0, d.setData(st, g);
	}
	function h() {
		s.current = !1, p?.elem && at(c.current, p?.elem);
	}
	return (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
		(0, import_jsx_runtime.jsx)("button", {
			"aria-label": "Drag to move",
			className: "icon draggable-block-menu",
			draggable: !0,
			onDragEnd: h,
			onDragStart: x,
			ref: r,
			type: "button",
			children: (0, import_jsx_runtime.jsx)("div", { className: o ? "icon" : "" })
		}),
		(0, import_jsx_runtime.jsx)("div", {
			className: "draggable-block-target-line",
			ref: c
		}),
		(0, import_jsx_runtime.jsx)("div", {
			className: "debug-highlight",
			ref: l
		})
	] }), t);
}
function ut(e) {
	let { anchorElem: t } = e, o$5 = t === void 0 ? document.body : t, [n] = o();
	return Wo(n, o$5, n._editable);
}
var dt = "insert-paragraph-at-end", ft = () => {
	let e = (0, import_compiler_runtime.c)(2), [t] = o(), { editorConfig: o$6 } = I();
	if (o$6?.admin?.hideInsertParagraphAtEnd) return null;
	let n;
	return e[0] !== t ? (n = (0, import_jsx_runtime.jsx)("div", {
		"aria-label": "Insert Paragraph",
		className: dt,
		onClick: () => {
			t.update(qo);
		},
		role: "button",
		tabIndex: 0,
		children: (0, import_jsx_runtime.jsx)("div", {
			className: `${dt}-inside`,
			children: (0, import_jsx_runtime.jsx)("span", { children: "+" })
		})
	}), e[0] = t, e[1] = n) : n = e[1], n;
};
function qo() {
	let e = Vi();
	Io$1().append(e), e.select();
}
var pt = () => {
	let e = (0, import_compiler_runtime.c)(4), { editorConfig: t } = I(), [o$7] = o(), n, r;
	return e[0] !== o$7 || e[1] !== t.features.markdownTransformers ? (n = () => Wo$1(o$7, t.features.markdownTransformers ?? []), r = [o$7, t.features.markdownTransformers], e[0] = o$7, e[1] = t.features.markdownTransformers, e[2] = n, e[3] = r) : (n = e[2], r = e[3]), import_react.useEffect(n, r), null;
};
function gt() {
	let e = (0, import_compiler_runtime.c)(5), [t] = o(), { currentView: o$8, views: n } = be$1(), r, c;
	return e[0] !== o$8 || e[1] !== t || e[2] !== n ? (r = () => {
		n && (o$8 === "default" ? n.default ? Ur(t, n.default?.nodes) : Vr(t) : n[o$8] && (Vr(t), Ur(t, n[o$8]?.nodes)));
	}, c = [
		t,
		n,
		o$8
	], e[0] = o$8, e[1] = t, e[2] = n, e[3] = r, e[4] = c) : (r = e[3], c = e[4]), (0, import_react.useEffect)(r, c), null;
}
function ht() {
	let [e] = o();
	return (0, import_react.useEffect)(() => e.registerNodeTransform(Ii, (t) => {
		let o = $r();
		if (wr(o)) {
			let n = o.anchor.getNode(), r = o.focus.getNode();
			(!n.isAttached() || !r.isAttached()) && (t.selectEnd(), console.warn("updateEditor: selection has been moved to the end of the editor because the previously selected nodes have been removed and selection wasn't moved to another node. Ensure selection changes after removing/replacing a selected node."));
		}
		return !1;
	}), [e]), null;
}
function yt() {
	let [e] = o();
	return (0, import_react.useEffect)(() => e.registerCommand(Ue$1, () => {
		if ($r()) return !1;
		let o = document.activeElement;
		return o instanceof HTMLInputElement && o.select(), !0;
	}, 1), [e]), null;
}
function xt(e, t) {
	let o = (0, import_compiler_runtime.c)(4), { maxLength: n, minLength: r } = t, c = n === void 0 ? 75 : n, l = r === void 0 ? 1 : r, s;
	return o[0] !== c || o[1] !== l || o[2] !== e ? (s = (a) => {
		let { query: f } = a, p = "[^" + e + $r$1 + "\\s]", i = new RegExp("(^|\\s|\\()([" + e + "]((?:" + p + "){0," + c + "}))$").exec(f);
		if (i !== null) {
			let y = i[1], x = i[3];
			if (x.length >= l) return {
				leadOffset: i.index + y.length,
				matchingString: x,
				replaceableString: i[2]
			};
		}
		return null;
	}, o[0] = c, o[1] = l, o[2] = e, o[3] = s) : s = o[3], s;
}
var B = "slash-menu-popup";
function xn({ isSelected: e, item: t, onClick: o, onMouseEnter: n, ref: r }) {
	let { fieldProps: { featureClientSchemaMap: c, schemaPath: l } } = I(), { i18n: s } = WP(), a = `${B}__item ${B}__item-${t.key}`;
	e && (a += ` ${B}__item--selected`);
	let f = t.key;
	return t.label && (f = typeof t.label == "function" ? t.label({
		featureClientSchemaMap: c,
		i18n: s,
		schemaPath: l
	}) : t.label), f.length > 25 && (f = f.substring(0, 25) + "..."), (0, import_jsx_runtime.jsxs)("button", {
		"aria-selected": e,
		className: a,
		id: B + "__item-" + t.key,
		onClick: o,
		onMouseEnter: n,
		ref: r,
		role: "option",
		tabIndex: -1,
		type: "button",
		children: [t?.Icon && (0, import_jsx_runtime.jsx)(t.Icon, {}), (0, import_jsx_runtime.jsx)("span", {
			className: `${B}__item-text`,
			children: f
		})]
	}, t.key);
}
function Nt({ anchorElem: e = document.body }) {
	let [t] = o(), [o$9, n] = (0, import_react.useState)(null), { editorConfig: r } = I(), { i18n: c } = WP(), { fieldProps: { featureClientSchemaMap: l, schemaPath: s } } = I(), a = xt("/", { minLength: 0 }), f = (0, import_react.useCallback)(() => {
		let u = [];
		for (let i of r.features.slashMenu.dynamicGroups) if (o$9) {
			let y = i({
				editor: t,
				queryString: o$9
			});
			u = u.concat(y);
		}
		return u;
	}, [
		t,
		o$9,
		r?.features
	]), p = (0, import_react.useMemo)(() => {
		let u = [];
		for (let i of r?.features.slashMenu.groups ?? []) u.push(i);
		if (o$9) {
			let i = o$9.toLowerCase().replace(/[\s\-_]/g, "");
			u = u.map((x) => {
				let h = x.items.filter((m) => {
					let d = m.key;
					return m.label && (d = typeof m.label == "function" ? m.label({
						featureClientSchemaMap: l,
						i18n: c,
						schemaPath: s
					}) : m.label), new RegExp(o$9, "gi").exec(d) || d.toLowerCase().replace(/[\s\-_]/g, "").includes(i) ? !0 : m.keywords != null ? m.keywords.some((C) => new RegExp(o$9, "gi").exec(C) ? !0 : C.toLowerCase().replace(/[\s\-_]/g, "").includes(i)) : !1;
				});
				return h.length ? {
					...x,
					items: h
				} : null;
			}), u = u.filter((x) => x != null);
			let y = f();
			for (let x of y) {
				let h = u.find((m) => m.key === x.key);
				h ? u = u.filter((m) => m.key !== x.key) : h = {
					...x,
					items: []
				}, h?.items?.length && (h.items = h.items.concat(h.items)), u.push(h);
			}
		}
		return u;
	}, [
		o$9,
		r?.features.slashMenu.groups,
		f,
		l,
		c,
		s
	]);
	return (0, import_jsx_runtime.jsx)(Br, {
		anchorElem: e,
		groups: p,
		menuRenderFn: (u, { selectedItemKey: i, selectItemAndCleanUp: y, setSelectedItemKey: x }) => u.current && p.length ? import_react_dom.createPortal((0, import_jsx_runtime.jsx)("div", {
			className: B,
			children: p.map((h) => {
				let m = h.key;
				return h.label && l && (m = typeof h.label == "function" ? h.label({
					featureClientSchemaMap: l,
					i18n: c,
					schemaPath: s
				}) : h.label), (0, import_jsx_runtime.jsxs)("div", {
					className: `${B}__group ${B}__group-${h.key}`,
					children: [(0, import_jsx_runtime.jsx)("div", {
						className: `${B}__group-title`,
						children: m
					}), h.items.map((d, g) => (0, import_jsx_runtime.jsx)(xn, {
						index: g,
						isSelected: i === d.key,
						item: d,
						onClick: () => {
							x(d.key), y(d);
						},
						onMouseEnter: () => {
							x(d.key);
						},
						ref: (C) => {
							d.ref = { current: C };
						}
					}, d.key))]
				}, h.key);
			})
		}), u.current) : null,
		onQueryChange: n,
		triggerFn: a
	});
}
function wt(e) {
	let t = (0, import_compiler_runtime.c)(6), { features: o$10 } = e, [n] = o(), r;
	t[0] !== n || t[1] !== o$10.enabledFormats ? (r = () => {
		let l = Sn(o$10.enabledFormats);
		if (l.length !== 0) return n.registerNodeTransform(lr, (s) => {
			l.forEach((a) => {
				s.hasFormat(a) && s.toggleFormat(a);
			});
		});
	}, t[0] = n, t[1] = o$10.enabledFormats, t[2] = r) : r = t[2];
	let c;
	return t[3] !== n || t[4] !== o$10 ? (c = [n, o$10], t[3] = n, t[4] = o$10, t[5] = c) : c = t[5], (0, import_react.useEffect)(r, c), null;
}
function Sn(e) {
	let t = Object.keys(z$1), o = new Set(e);
	return t.filter((n) => !o.has(n));
}
function Pt(e) {
	let t = (0, import_compiler_runtime.c)(5), { className: o$11, editorConfig: n } = e, { t: r } = WP(), [, c] = o(), { getTheme: l } = c, s;
	if (t[0] !== o$11 || t[1] !== n?.admin?.placeholder || t[2] !== l || t[3] !== r) {
		let a = l();
		s = (0, import_jsx_runtime.jsx)(x, {
			"aria-placeholder": r("lexical:general:placeholder"),
			className: o$11 ?? "ContentEditable__root",
			placeholder: (0, import_jsx_runtime.jsx)("p", {
				className: a?.placeholder,
				children: n?.admin?.placeholder ?? r("lexical:general:placeholder")
			})
		}), t[0] = o$11, t[1] = n?.admin?.placeholder, t[2] = l, t[3] = r, t[4] = s;
	} else s = t[4];
	return s;
}
var Tt = (e) => {
	let t = (0, import_compiler_runtime.c)(13), { editorConfig: o$1, editorContainerRef: n$2, isSmallWidthViewport: r, onChange: c, rtl: l } = e, s = I(), [a$2] = o(), f = a(), [p, u] = (0, import_react.useState)(null), i;
	t[0] === Symbol.for("react.memo_cache_sentinel") ? (i = (d) => {
		d !== null && u(d);
	}, t[0] = i) : i = t[0];
	let y = i, x, h;
	t[1] !== a$2 || t[2] !== s ? (x = () => {
		if (!s?.uuid) {
			console.error("Lexical Editor must be used within an EditorConfigProvider");
			return;
		}
		s?.parentEditor?.uuid && s.parentEditor?.registerChild(s.uuid, s);
		let d = () => {
			s.focusEditor(s);
		}, g = () => {
			s.blurEditor(s);
		}, C = a$2.registerCommand(He$1, () => (d(), !0), 1), P = a$2.registerCommand(Ge$1, () => (g(), !0), 1);
		return () => {
			C(), P(), s.parentEditor?.unregisterChild?.(s.uuid);
		};
	}, h = [a$2, s], t[1] = a$2, t[2] = s, t[3] = x, t[4] = h) : (x = t[3], h = t[4]), (0, import_react.useEffect)(x, h);
	let m;
	return t[5] !== o$1 || t[6] !== n$2 || t[7] !== p || t[8] !== f || t[9] !== r || t[10] !== c || t[11] !== l ? (m = (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
		o$1.features.plugins?.map(Kn),
		(0, import_jsx_runtime.jsxs)("div", {
			className: "editor-container",
			dir: l ? "rtl" : void 0,
			ref: n$2,
			children: [
				o$1.features.plugins?.map(jn),
				(0, import_jsx_runtime.jsx)(L$1, {
					contentEditable: (0, import_jsx_runtime.jsx)("div", {
						className: "editor-scroller",
						children: (0, import_jsx_runtime.jsx)("div", {
							className: "editor",
							ref: y,
							children: (0, import_jsx_runtime.jsx)(Pt, { editorConfig: o$1 })
						})
					}),
					ErrorBoundary: n
				}),
				(0, import_jsx_runtime.jsx)(ht, {}),
				f && (0, import_jsx_runtime.jsx)(ft, {}),
				(0, import_jsx_runtime.jsx)(Ge, {}),
				(0, import_jsx_runtime.jsx)(Ve, {}),
				(0, import_jsx_runtime.jsx)(wt, { features: o$1.features }),
				(0, import_jsx_runtime.jsx)(yt, {}),
				(0, import_jsx_runtime.jsx)(gt, {}),
				f && (0, import_jsx_runtime.jsx)(n$1, {
					ignoreSelectionChange: !0,
					onChange: (d, g, C) => {
						(!C.has("focus") || C.size > 1) && c?.(d, g, C);
					}
				}),
				p && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
					!r && f && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [o$1.admin?.hideDraggableBlockElement ? null : (0, import_jsx_runtime.jsx)(ut, { anchorElem: p }), o$1.admin?.hideAddBlockButton ? null : (0, import_jsx_runtime.jsx)(et, { anchorElem: p })] }),
					o$1.features.plugins?.map((d) => {
						if (d.position === "floatingAnchorElem" && !(d.desktopOnly === !0 && r)) return (0, import_jsx_runtime.jsx)(K, {
							anchorElem: p,
							clientProps: d.clientProps,
							plugin: d
						}, d.key);
					}),
					f && (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: (0, import_jsx_runtime.jsx)(Nt, { anchorElem: p }) })
				] }),
				f && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)(a$1, {}), o$1?.features?.markdownTransformers?.length > 0 && (0, import_jsx_runtime.jsx)(pt, {})] }),
				o$1.features.plugins?.map(zn),
				o$1.features.plugins?.map(Hn)
			]
		}),
		o$1.features.plugins?.map(Vn)
	] }), t[5] = o$1, t[6] = n$2, t[7] = p, t[8] = f, t[9] = r, t[10] = c, t[11] = l, t[12] = m) : m = t[12], m;
};
function Kn(e) {
	if (e.position === "aboveContainer") return (0, import_jsx_runtime.jsx)(K, {
		clientProps: e.clientProps,
		plugin: e
	}, e.key);
}
function jn(e) {
	if (e.position === "top") return (0, import_jsx_runtime.jsx)(K, {
		clientProps: e.clientProps,
		plugin: e
	}, e.key);
}
function zn(e) {
	if (e.position === "normal") return (0, import_jsx_runtime.jsx)(K, {
		clientProps: e.clientProps,
		plugin: e
	}, e.key);
}
function Hn(e) {
	if (e.position === "bottom") return (0, import_jsx_runtime.jsx)(K, {
		clientProps: e.clientProps,
		plugin: e
	}, e.key);
}
function Vn(e) {
	if (e.position === "belowContainer") return (0, import_jsx_runtime.jsx)(K, {
		clientProps: e.clientProps,
		plugin: e
	}, e.key);
}
var kt = ({ children: e, providers: t }) => {
	if (!t?.length) return e;
	let o = t[0];
	return t.length > 1 ? (0, import_jsx_runtime.jsx)(o, { children: (0, import_jsx_runtime.jsx)(kt, {
		providers: t.slice(1),
		children: e
	}) }) : (0, import_jsx_runtime.jsx)(o, { children: e });
}, vt = (e) => {
	let { composerKey: t, editorConfig: o, fieldProps: n, isSmallWidthViewport: r, onChange: c, readOnly: l, rtl: s, value: a } = e, { currentView: f$1, views: p } = be$1(), u = I(), i = at$1(), y = import_react.useRef(null), x = (0, import_react.useMemo)(() => {
		if (a && typeof a != "object") throw new Error("The value passed to the Lexical editor is not an object. This is not supported. Please remove the data from the field and start again. This is the value that was passed in: " + JSON.stringify(a));
		if (a && Array.isArray(a) && !("root" in a)) throw new Error("You have tried to pass in data from the old Slate editor to the new Lexical editor. The data structure is different, thus you will have to migrate your data. We offer a one-line migration script which migrates all your rich text fields: https://payloadcms.com/docs/lexical/migration#migration-via-migration-script-recommended");
		if (a && "jsonContent" in a) throw new Error("You have tried to pass in data from payload-plugin-lexical. The data structure is different, thus you will have to migrate your data. Migration guide: https://payloadcms.com/docs/lexical/migration#migrating-from-payload-plugin-lexical");
		let h = p?.[f$1]?.nodes;
		return {
			editable: l !== !0,
			editorState: a != null ? JSON.stringify(a) : void 0,
			namespace: o.lexical.namespace,
			nodes: Xr({
				editorConfig: o,
				nodeViews: h
			}),
			onError: (m) => {
				throw m;
			},
			theme: o.lexical.theme
		};
	}, [
		o,
		p,
		f$1
	]);
	return x ? (0, import_jsx_runtime.jsx)(f, {
		initialConfig: x,
		children: (0, import_jsx_runtime.jsx)(H$1, {
			editorConfig: o,
			editorContainerRef: y,
			fieldProps: n,
			parentContext: u?.editDepth === i ? u : void 0,
			children: (0, import_jsx_runtime.jsx)(kt, {
				providers: o.features.providers,
				children: (0, import_jsx_runtime.jsx)(Tt, {
					editorConfig: o,
					editorContainerRef: y,
					isSmallWidthViewport: r,
					onChange: c,
					rtl: s
				})
			})
		})
	}, t + x.editable + f$1) : (0, import_jsx_runtime.jsx)("p", { children: "Loading..." });
};
function Dt() {
	let e = (0, import_compiler_runtime.c)(5), { currentView: t, setCurrentView: o, views: n } = be$1();
	if (!n || Object.keys(n).length === 0) return null;
	let r, c;
	if (e[0] !== t || e[1] !== o || e[2] !== n) {
		c = Symbol.for("react.early_return_sentinel");
		e: {
			let l = Object.keys(n);
			if (!l.some(Zn)) {
				c = null;
				break e;
			}
			let a = ["default", ...l.filter(Xn)];
			r = (0, import_jsx_runtime.jsx)("div", {
				className: "lexical-view-selector",
				children: (0, import_jsx_runtime.jsx)(it$1, {
					button: (0, import_jsx_runtime.jsxs)("button", {
						className: "lexical-view-selector__button",
						type: "button",
						children: [(0, import_jsx_runtime.jsx)("span", {
							className: "lexical-view-selector__label",
							children: t.charAt(0).toUpperCase() + t.slice(1)
						}), (0, import_jsx_runtime.jsx)(Ze, { className: "lexical-view-selector__icon" })]
					}),
					buttonType: "custom",
					horizontalAlign: "left",
					render: (p) => {
						let { close: u } = p;
						return (0, import_jsx_runtime.jsx)(Ce.ButtonGroup, { children: a.map((i) => {
							let y = i.charAt(0).toUpperCase() + i.slice(1);
							return (0, import_jsx_runtime.jsx)(Ce.Button, {
								active: i === t,
								disabled: i === t,
								onClick: () => {
									o?.(i), u();
								},
								children: y
							}, i);
						}) });
					},
					size: "large"
				})
			});
		}
		e[0] = t, e[1] = o, e[2] = n, e[3] = r, e[4] = c;
	} else r = e[3], c = e[4];
	return c !== Symbol.for("react.early_return_sentinel") ? c : r;
}
function Xn(e) {
	return e !== "default";
}
function Zn(e) {
	return e !== "default";
}
var se = "rich-text-lexical", pr = (e) => {
	let { editorConfig: t, field: o, field: { admin: { className: n, description: r, readOnly: c } = {}, label: l, localized: s, required: a }, path: f, readOnly: p, schemaPath: u, validate: i } = e, y = p || c, x = xe$1(), { config: { localization: h } } = se$1(), m = Zi({
		fieldLocalized: s,
		locale: x,
		localizationConfig: h || void 0
	}), d = at$1(), { isControlledByParent: g } = be$1(), { customComponents: { AfterInput: P, BeforeInput: R, Description: S, Error: _, Label: N } = {}, disabled: ee, initialValue: v, path: T, setValue: k, showError: V, value: $ } = Re({
		potentiallyStalePath: f,
		validate: (0, import_react.useCallback)((M, te) => typeof i == "function" ? i(M, {
			...te,
			required: a
		}) : !0, [i, a])
	}), Ce = y || ee, [W, ke] = (0, import_react.useState)(!1), [be, D] = (0, import_react.useState)(), E = import_react.useRef(v), Y = import_react.useRef($);
	(0, import_react.useEffect)(() => {
		let M = () => {
			let te = window.matchMedia("(max-width: 768px)").matches;
			te !== W && ke(te);
		};
		return M(), window.addEventListener("resize", M), () => {
			window.removeEventListener("resize", M);
		};
	}, [W]);
	let Ft = [
		"field-type",
		se,
		n,
		V && "error",
		Ce && `${se}--read-only`,
		t?.admin?.hideGutter !== !0 && !W ? `${se}--show-gutter` : null
	].filter(Boolean).join(" "), ve = `${T}.${d}`, Le = pr$1(), $t = (0, import_react.useCallback)((M) => {
		Le(() => {
			let De = M.toJSON();
			Y.current = De, k(De);
		});
	}, [k, Le]), Kt = (0, import_react.useMemo)(() => q$1(o), [o]), jt = ot$1((M) => {
		Y.current !== $ && !dequal(Y.current != null ? JSON.parse(JSON.stringify(Y.current)) : Y.current, $) && (E.current = M, Y.current = $, D(/* @__PURE__ */ new Date()));
	});
	return (0, import_react.useEffect)(() => {
		Object.is(v, E.current) || jt(v);
	}, [v]), (0, import_jsx_runtime.jsxs)("div", {
		className: Ft,
		"data-field-path": T,
		"data-field-schemapath": u,
		"data-lexical-view": t?.view,
		style: Kt,
		children: [
			(0, import_jsx_runtime.jsx)(de$1, {
				CustomComponent: _,
				Fallback: (0, import_jsx_runtime.jsx)(et$1, {
					path: T,
					showError: V
				})
			}),
			(0, import_jsx_runtime.jsxs)("div", {
				className: `${se}__label-row`,
				children: [N || (0, import_jsx_runtime.jsx)(we$1, {
					label: l,
					localized: s,
					path: T,
					required: a
				}), !g && (0, import_jsx_runtime.jsx)(Dt, {})]
			}),
			(0, import_jsx_runtime.jsxs)("div", {
				className: `${se}__wrap`,
				children: [(0, import_jsx_runtime.jsxs)(ErrorBoundary, {
					fallbackRender: gr,
					onReset: () => {},
					children: [
						R,
						(0, import_jsx_runtime.jsx)(Cy, {
							drawerSlugPrefix: `lexical-${T}`,
							children: (0, import_jsx_runtime.jsx)(vt, {
								composerKey: ve,
								editorConfig: t,
								fieldProps: e,
								isSmallWidthViewport: W,
								onChange: $t,
								readOnly: Ce,
								rtl: m,
								value: $
							}, JSON.stringify({
								path: T,
								rerenderProviderKey: be
							}))
						}),
						P
					]
				}), (0, import_jsx_runtime.jsx)(de$1, {
					CustomComponent: S,
					Fallback: (0, import_jsx_runtime.jsx)(qe$1, {
						description: r,
						path: T
					})
				})]
			})
		]
	}, ve);
};
function gr({ error: e }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "errorBoundary",
		role: "alert",
		children: [(0, import_jsx_runtime.jsx)("p", { children: "Something went wrong:" }), (0, import_jsx_runtime.jsx)("pre", {
			style: { color: "red" },
			children: e.message
		})]
	});
}
var Pl = pr;
//#endregion
export { Pl as RichText };
