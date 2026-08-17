import { C as require_react, j as __toESM, n as require_jsx_runtime, t as require_react_dom } from "../index.js";
import { A as H$1, Ct as Yi, Dt as ec, G as a$3, Gt as o$3, Kt as r$3, M as ne, Mt as qe, N as oe, Nt as ql, Ot as eo, P as pt, Q as Ce, Rt as wr, St as Ye, Vt as yr, X as $r, Y as $e, Z as Bn, at as Io, bt as Vi, gt as Pi, j as gt, lt as Ki, qt as t$1, tt as Gl, ut as Li, v as Jt, w as s$3, wt as Yl, xt as Wn, yt as Ve, zt as xe } from "./client-Dd-hh4YI.js";
//#region node_modules/@lexical/react/LexicalComposer.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var m$3 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement, u$1 = m$3 ? import_react.useLayoutEffect : import_react.useEffect, p$2 = { tag: Wn };
function f$4({ initialConfig: a, children: c }) {
	const l = (0, import_react.useMemo)(() => {
		const { theme: t, namespace: c, nodes: l, onError: d, editorState: s, html: u } = a, f = t$1(null, t), E = eo({
			editable: a.editable,
			html: u,
			namespace: c,
			nodes: l,
			onError: (e) => d(e, E),
			theme: t
		});
		return function(e, t) {
			if (null === t) return;
			if (void 0 === t) e.update(() => {
				const t = Io();
				if (t.isEmpty()) {
					const o = Vi();
					t.append(o);
					const n = m$3 ? document.activeElement : null;
					(null !== $r() || null !== n && n === e.getRootElement()) && o.select();
				}
			}, p$2);
			else if (null !== t) switch (typeof t) {
				case "string": {
					const o = e.parseEditorState(t);
					e.setEditorState(o, p$2);
					break;
				}
				case "object":
					e.setEditorState(t, p$2);
					break;
				case "function": e.update(() => {
					Io().isEmpty() && t(e);
				}, p$2);
			}
		}(E, s), [E, f];
	}, []);
	return u$1(() => {
		const e = a.editable, [t] = l;
		t.setEditable(void 0 === e || e);
	}, []), (0, import_jsx_runtime.jsx)(r$3.Provider, {
		value: l,
		children: c
	});
}
//#endregion
//#region node_modules/@lexical/text/LexicalText.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function s$1() {
	return Io().getTextContent();
}
function f$3(t, e = !0) {
	if (t) return !1;
	let n = s$1();
	return e && (n = n.trim()), "" === n;
}
function c$3(o) {
	if (!f$3(o, !1)) return !1;
	const l = Io().getChildren(), s = l.length;
	if (s > 1) return !1;
	for (let t = 0; t < s; t++) {
		const o = l[t];
		if (Li(o)) return !1;
		if (Pi(o)) {
			if (!Yi(o)) return !1;
			if (0 !== o.__indent) return !1;
			const e = o.getChildren(), n = e.length;
			for (let r = 0; r < n; r++) {
				const n = e[t];
				if (!yr(n)) return !1;
			}
		}
	}
	return !0;
}
function g$1(t) {
	return () => c$3(t);
}
//#endregion
//#region node_modules/@lexical/react/LexicalContentEditable.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var m$2 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? import_react.useLayoutEffect : import_react.useEffect;
function f$2({ editor: e, ariaActiveDescendant: t, ariaAutoComplete: i, ariaControls: a, ariaDescribedBy: d, ariaErrorMessage: c, ariaExpanded: s, ariaInvalid: u, ariaLabel: f, ariaLabelledBy: b, ariaMultiline: p, ariaOwns: x, ariaRequired: E, autoCapitalize: v, className: w, id: y, role: C = "textbox", spellCheck: g = !0, style: L, tabIndex: h, "data-testid": D, ...I }, R) {
	const [k, q] = (0, import_react.useState)(e.isEditable()), z = (0, import_react.useCallback)((t) => {
		t && t.ownerDocument && t.ownerDocument.defaultView ? e.setRootElement(t) : e.setRootElement(null);
	}, [e]), A = (0, import_react.useMemo)(() => function(...e) {
		return (t) => {
			for (const i of e) "function" == typeof i ? i(t) : null != i && (i.current = t);
		};
	}(R, z), [z, R]);
	return m$2(() => (q(e.isEditable()), e.registerEditableListener((e) => {
		q(e);
	})), [e]), (0, import_jsx_runtime.jsx)("div", {
		"aria-activedescendant": k ? t : void 0,
		"aria-autocomplete": k ? i : "none",
		"aria-controls": k ? a : void 0,
		"aria-describedby": d,
		...null != c ? { "aria-errormessage": c } : {},
		"aria-expanded": k && "combobox" === C ? !!s : void 0,
		...null != u ? { "aria-invalid": u } : {},
		"aria-label": f,
		"aria-labelledby": b,
		"aria-multiline": p,
		"aria-owns": k ? x : void 0,
		"aria-readonly": !k || void 0,
		"aria-required": E,
		autoCapitalize: v,
		className: w,
		contentEditable: k,
		"data-testid": D,
		id: y,
		ref: A,
		role: C,
		spellCheck: g,
		style: L,
		tabIndex: h,
		...I
	});
}
var b$2 = (0, import_react.forwardRef)(f$2);
function p$1(e) {
	return e.getEditorState().read(g$1(e.isComposing()));
}
var x = (0, import_react.forwardRef)(E$2);
function E$2(t, i) {
	const { placeholder: a, ...r } = t, [n] = o$3();
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(b$2, {
		editor: n,
		...r,
		ref: i
	}), null != a && (0, import_jsx_runtime.jsx)(v$2, {
		editor: n,
		content: a
	})] });
}
function v$2({ content: e, editor: i }) {
	const a = function(e) {
		const [t, i] = (0, import_react.useState)(() => p$1(e));
		return m$2(() => {
			function t() {
				i(p$1(e));
			}
			return t(), ec(e.registerUpdateListener(() => {
				t();
			}), e.registerEditableListener(() => {
				t();
			}));
		}, [e]), t;
	}(i), [n, o] = (0, import_react.useState)(i.isEditable());
	if ((0, import_react.useLayoutEffect)(() => (o(i.isEditable()), i.registerEditableListener((e) => {
		o(e);
	})), [i]), !a) return null;
	let d = null;
	return "function" == typeof e ? d = e(n) : null !== e && (d = e), null === d ? null : (0, import_jsx_runtime.jsx)("div", {
		"aria-hidden": !0,
		children: d
	});
}
//#endregion
//#region node_modules/@lexical/react/node_modules/react-error-boundary/dist/react-error-boundary.js
var h = (0, import_react.createContext)(null), c$1 = {
	didCatch: !1,
	error: null
};
var m$1 = class extends import_react.Component {
	constructor(e) {
		super(e), this.resetErrorBoundary = this.resetErrorBoundary.bind(this), this.state = c$1;
	}
	static getDerivedStateFromError(e) {
		return {
			didCatch: !0,
			error: e
		};
	}
	resetErrorBoundary(...e) {
		const { error: t } = this.state;
		t !== null && (this.props.onReset?.({
			args: e,
			reason: "imperative-api"
		}), this.setState(c$1));
	}
	componentDidCatch(e, t) {
		this.props.onError?.(e, t);
	}
	componentDidUpdate(e, t) {
		const { didCatch: o } = this.state, { resetKeys: s } = this.props;
		o && t.error !== null && C(e.resetKeys, s) && (this.props.onReset?.({
			next: s,
			prev: e.resetKeys,
			reason: "keys"
		}), this.setState(c$1));
	}
	render() {
		const { children: e, fallbackRender: t, FallbackComponent: o, fallback: s } = this.props, { didCatch: n, error: a } = this.state;
		let i = e;
		if (n) {
			const u = {
				error: a,
				resetErrorBoundary: this.resetErrorBoundary
			};
			if (typeof t == "function") i = t(u);
			else if (o) i = (0, import_react.createElement)(o, u);
			else if (s !== void 0) i = s;
			else throw a;
		}
		return (0, import_react.createElement)(h.Provider, { value: {
			didCatch: n,
			error: a,
			resetErrorBoundary: this.resetErrorBoundary
		} }, i);
	}
};
function C(r = [], e = []) {
	return r.length !== e.length || r.some((t, o) => !Object.is(t, e[o]));
}
//#endregion
//#region node_modules/@lexical/react/LexicalErrorBoundary.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function n$2({ children: n, onError: e }) {
	return (0, import_jsx_runtime.jsx)(m$1, {
		fallback: (0, import_jsx_runtime.jsx)("div", {
			style: {
				border: "1px solid #f00",
				color: "#f00",
				padding: "8px"
			},
			children: "An error was thrown."
		}),
		onError: e,
		children: n
	});
}
//#endregion
//#region node_modules/@lexical/history/LexicalHistory.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function v$1(t, e, n, r, o) {
	if (null === t || 0 === n.size && 0 === r.size && !o) return 0;
	const i = e._selection, a = t._selection;
	if (o) return 1;
	if (!(wr(i) && wr(a) && a.isCollapsed() && i.isCollapsed())) return 0;
	const s = function(t, e, n) {
		const r = t._nodeMap, o = [];
		for (const t of e) {
			const e = r.get(t);
			void 0 !== e && o.push(e);
		}
		for (const [t, e] of n) {
			if (!e) continue;
			const n = r.get(t);
			void 0 === n || Ki(n) || o.push(n);
		}
		return o;
	}(e, n, r);
	if (0 === s.length) return 0;
	if (s.length > 1) {
		const n = e._nodeMap, r = n.get(i.anchor.key), o = n.get(a.anchor.key);
		return r && o && !t._nodeMap.has(r.__key) && yr(r) && 1 === r.__text.length && 1 === i.anchor.offset ? 2 : 0;
	}
	const c = s[0], u = t._nodeMap.get(c.__key);
	if (!yr(u) || !yr(c) || u.__mode !== c.__mode) return 0;
	const d = u.__text, l = c.__text;
	if (d === l) return 0;
	const f = i.anchor, p = a.anchor;
	if (f.key !== p.key || "text" !== f.type) return 0;
	const h = f.offset, m = p.offset, y = l.length - d.length;
	return 1 === y && m === h - 1 ? 2 : -1 === y && m === h + 1 ? 3 : -1 === y && m === h ? 4 : 0;
}
function b$1(t, e) {
	let n = Date.now(), r = 0, o = Date.now(), i = 0, a = null;
	return (s, c, u, d, l, f) => {
		const p = Date.now();
		if (f.has("composition-start") && (o = n, i = r, a = s), f.has("historic")) return r = 0, n = p, 2;
		f.has("composition-end") && a && (n = o, r = i, s = a);
		const h = v$1(s, c, d, l, t.isComposing()), C = (() => {
			const o = null === u || u.editor === t, i = f.has(Bn);
			if (!i && o && f.has("history-merge")) return 0;
			if (1 === h) return 2;
			if (null === s) return 1;
			const a = c._selection;
			if (!(d.size > 0 || l.size > 0)) return null !== a ? 0 : 2;
			const m = "number" == typeof e ? e : e.peek();
			if (!1 === i && 0 !== h && h === r && p < n + m && o) return 0;
			if (1 === d.size) {
				if (function(t, e, n) {
					const r = e._nodeMap.get(t), o = n._nodeMap.get(t), i = e._selection, a = n._selection;
					return !(wr(i) && wr(a) && "element" === i.anchor.type && "element" === i.focus.type && "text" === a.anchor.type && "text" === a.focus.type || !yr(r) || !yr(o) || r.__parent !== o.__parent) && JSON.stringify(e.read(() => r.exportJSON())) === JSON.stringify(n.read(() => o.exportJSON()));
				}(Array.from(d)[0], s, c)) return 0;
			}
			return 1;
		})();
		return n = p, r = h, C;
	};
}
function w$1(t) {
	t.undoStack = [], t.redoStack = [], t.current = null;
}
function E(t, e, n) {
	const r = b$1(t, n);
	return ec(t.registerCommand(xe, () => (function(t, e) {
		const n = e.redoStack, r = e.undoStack;
		if (0 !== r.length) {
			const o = e.current, i = r.pop();
			null !== o && (n.push(o), t.dispatchCommand(Ye, !0)), 0 === r.length && t.dispatchCommand(qe, !1), e.current = i || null, i && i.editor.setEditorState(i.editorState, { tag: "historic" });
		}
	}(t, e), !0), 0), t.registerCommand(Ce, () => (function(t, e) {
		const n = e.redoStack, r = e.undoStack;
		if (0 !== n.length) {
			const o = e.current;
			null !== o && (r.push(o), t.dispatchCommand(qe, !0));
			const i = n.pop();
			0 === n.length && t.dispatchCommand(Ye, !1), e.current = i || null, i && i.editor.setEditorState(i.editorState, { tag: "historic" });
		}
	}(t, e), !0), 0), t.registerCommand($e, () => (w$1(e), !1), 0), t.registerCommand(Ve, () => (w$1(e), t.dispatchCommand(Ye, !1), t.dispatchCommand(qe, !1), !0), 0), t.registerUpdateListener(({ editorState: n, prevEditorState: o, dirtyLeaves: i, dirtyElements: a, tags: s }) => {
		const c = e.current, u = e.redoStack, d = e.undoStack, l = null === c ? null : c.editorState;
		if (null !== c && n === l) return;
		const f = r(o, n, c, i, a, s);
		if (1 === f) 0 !== u.length && (e.redoStack = [], t.dispatchCommand(Ye, !1)), null !== c && (d.push({ ...c }), t.dispatchCommand(qe, !0));
		else if (2 === f) return;
		e.current = {
			editor: t,
			editorState: n
		};
	}));
}
function H() {
	return {
		current: null,
		redoStack: [],
		undoStack: []
	};
}
var M = Yl({
	build: (e, { delay: n, createInitialHistoryState: r, disabled: o }) => pt({
		delay: n,
		disabled: o,
		historyState: r(e)
	}),
	config: Gl({
		createInitialHistoryState: H,
		delay: 300,
		disabled: "undefined" == typeof window
	}),
	name: "@lexical/history/History",
	register: (t, n, r) => {
		const o = r.getOutput();
		return gt(() => o.disabled.value ? void 0 : E(t, o.historyState.value, o.delay));
	}
});
Yl({
	dependencies: [ql(M, {
		createInitialHistoryState: () => {
			throw new Error("SharedHistory did not inherit parent history");
		},
		disabled: !0
	})],
	name: "@lexical/history/SharedHistory",
	register(t, o, i) {
		const { output: a } = i.getDependency(M), s = function(t) {
			return t ? oe(t, M.name) : null;
		}(t._parentEditor);
		if (!s) return () => {};
		const c = s.output;
		return gt(() => H$1(() => {
			a.delay.value = c.delay.value, a.historyState.value = c.historyState.value, a.disabled.value = c.disabled.value;
		}));
	}
});
//#endregion
//#region node_modules/@lexical/react/LexicalHistoryPlugin.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function a$1({ delay: a, externalHistoryState: c }) {
	const [l] = o$3();
	return function(t, a, c = 1e3) {
		const l = (0, import_react.useMemo)(() => a || H(), [a]);
		(0, import_react.useEffect)(() => E(t, l, c), [
			c,
			t,
			l
		]);
	}(l, c, a), null;
}
//#endregion
//#region node_modules/@lexical/react/LexicalOnChangePlugin.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var r$1 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? import_react.useLayoutEffect : import_react.useEffect;
function n$1({ ignoreHistoryMergeTagChange: o = !0, ignoreSelectionChange: i = !1, onChange: n }) {
	const [a] = o$3();
	return r$1(() => {
		if (n) return a.registerUpdateListener(({ editorState: e, dirtyElements: r, dirtyLeaves: d, prevEditorState: s, tags: c }) => {
			i && 0 === r.size && 0 === d.size || o && c.has("history-merge") || s.isEmpty() || n(e, a, c);
		});
	}, [
		a,
		o,
		i,
		n
	]), null;
}
//#endregion
//#region node_modules/@lexical/react/LexicalReactProviderExtension.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var r = Yl({ name: "@lexical/react/ReactProvider" });
//#endregion
//#region node_modules/@lexical/react/LexicalRichTextPlugin.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
function g(r, ...e) {
	const t = new URL("https://lexical.dev/docs/error"), o = new URLSearchParams();
	o.append("code", r);
	for (const r of e) o.append("v", r);
	throw t.search = o.toString(), Error(`Minified Lexical error #${r}; visit ${t.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
var y = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? import_react.useLayoutEffect : import_react.useEffect;
function w({ editor: r, ErrorBoundary: e }) {
	return function(r, e) {
		const [t, o] = (0, import_react.useState)(() => r.getDecorators());
		return y(() => r.registerDecoratorListener((r) => {
			(0, import_react_dom.flushSync)(() => {
				o(r);
			});
		}), [r]), (0, import_react.useEffect)(() => {
			o(r.getDecorators());
		}, [r]), (0, import_react.useMemo)(() => {
			const o = [], n = Object.keys(t);
			for (let i = 0; i < n.length; i++) {
				const c = n[i], a = (0, import_jsx_runtime.jsx)(e, {
					onError: (e) => r._onError(e),
					children: (0, import_jsx_runtime.jsx)(import_react.Suspense, {
						fallback: null,
						children: t[c]
					})
				}), s = r.getElementByKey(c);
				null !== s && o.push((0, import_react_dom.createPortal)(a, s, c));
			}
			return o;
		}, [
			e,
			t,
			r
		]);
	}(r, e);
}
function v({ editor: r$5, ErrorBoundary: e }) {
	return function(r$4) {
		const e = ne.maybeFromEditor(r$4);
		if (e && e.hasExtensionByName(r.name)) {
			for (const r of ["@lexical/plain-text", "@lexical/rich-text"]) e.hasExtensionByName(r) && g(320, r);
			return !0;
		}
		return !1;
	}(r$5) ? null : (0, import_jsx_runtime.jsx)(w, {
		editor: r$5,
		ErrorBoundary: e
	});
}
function B(r) {
	return r.getEditorState().read(g$1(r.isComposing()));
}
function L({ contentEditable: e, placeholder: t = null, ErrorBoundary: o }) {
	const [n] = o$3();
	return function(r) {
		y(() => ec(Jt(r), s$3(r)), [r]);
	}(n), (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		e,
		(0, import_jsx_runtime.jsx)(b, { content: t }),
		(0, import_jsx_runtime.jsx)(v, {
			editor: n,
			ErrorBoundary: o
		})
	] });
}
function b({ content: t }) {
	const [o] = o$3(), n = function(r) {
		const [e, t] = (0, import_react.useState)(() => B(r));
		return y(() => {
			function e() {
				t(B(r));
			}
			return e(), ec(r.registerUpdateListener(() => {
				e();
			}), r.registerEditableListener(() => {
				e();
			}));
		}, [r]), e;
	}(o), i = a$3();
	return n ? "function" == typeof t ? t(i) : t : null;
}
//#endregion
export { x as a, n$2 as i, n$1 as n, f$4 as o, a$1 as r, L as t };
