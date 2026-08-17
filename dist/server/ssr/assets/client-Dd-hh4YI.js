import { C as require_react, O as __commonJSMin, j as __toESM, k as __exportAll, n as require_jsx_runtime, t as require_react_dom } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { $t as deepCopyObjectSimpleWithoutReactComponents, At as xe$2, H as av, M as Ss$2, Mt as yr$2, Nt as yt$6, P as Tt$7, Q as fo$2, Qt as formatAdminURL, S as Lo$1, T as Nt$4, Tt as tu$1, V as at$6, X as fa$1, Zt as reduceFieldsToValues, _ as Io$2, _n as $e$3, an as require_objectid, bn as se$4, bt as se$3, f as Gt$5, g as Ie$3, gn as getTranslation, mn as WP, n as Ar$2, ot as iC$1, p as Hi$2, q as dm, t as Am, vt as qi$1, wt as tl$2, xt as ss$1, yn as le$5, yt as re$3 } from "./client-CJQLBaQM.js";
import { t as v4 } from "./v4-DiJ-vc2V.js";
import { i as le$6, r as ce$5 } from "./shared-jREwlcRe.js";
//#endregion
//#region node_modules/payload/dist/utilities/deepMerge.js
var import_cjs = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value) && !isSpecial(value);
	};
	function isNonNullObject(value) {
		return !!value && typeof value === "object";
	}
	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);
		return stringValue === "[object RegExp]" || stringValue === "[object Date]" || isReactElement(value);
	}
	var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for ? Symbol.for("react.element") : 60103;
	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE;
	}
	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {};
	}
	function cloneUnlessOtherwiseSpecified(value, options) {
		return options.clone !== false && options.isMergeableObject(value) ? deepmerge(emptyTarget(value), value, options) : value;
	}
	function defaultArrayMerge(target, source, options) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, options);
		});
	}
	function getMergeFunction(key, options) {
		if (!options.customMerge) return deepmerge;
		var customMerge = options.customMerge(key);
		return typeof customMerge === "function" ? customMerge : deepmerge;
	}
	function getEnumerableOwnPropertySymbols(target) {
		return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(target).filter(function(symbol) {
			return Object.propertyIsEnumerable.call(target, symbol);
		}) : [];
	}
	function getKeys(target) {
		return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target));
	}
	function propertyIsOnObject(object, property) {
		try {
			return property in object;
		} catch (_) {
			return false;
		}
	}
	function propertyIsUnsafe(target, key) {
		return propertyIsOnObject(target, key) && !(Object.hasOwnProperty.call(target, key) && Object.propertyIsEnumerable.call(target, key));
	}
	function mergeObject(target, source, options) {
		var destination = {};
		if (options.isMergeableObject(target)) getKeys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
		});
		getKeys(source).forEach(function(key) {
			if (propertyIsUnsafe(target, key)) return;
			if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
			else destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
		});
		return destination;
	}
	function deepmerge(target, source, options) {
		options = options || {};
		options.arrayMerge = options.arrayMerge || defaultArrayMerge;
		options.isMergeableObject = options.isMergeableObject || isMergeableObject;
		options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;
		var sourceIsArray = Array.isArray(source);
		if (!(sourceIsArray === Array.isArray(target))) return cloneUnlessOtherwiseSpecified(source, options);
		else if (sourceIsArray) return options.arrayMerge(target, source, options);
		else return mergeObject(target, source, options);
	}
	deepmerge.all = function deepmergeAll(array, options) {
		if (!Array.isArray(array)) throw new Error("first argument should be an array");
		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, options);
		}, {});
	};
	module.exports = deepmerge;
})))(), 1);
//#endregion
//#region node_modules/@lexical/react/LexicalComposerContext.prod.mjs
var import_compiler_runtime = require_compiler_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var r$3 = (0, import_react.createContext)(null);
function t$4(n, e) {
	let r = null;
	return null != n && (r = n[1]), { getTheme: function() {
		return null != e ? e : null != r ? r.getTheme() : null;
	} };
}
function o$4() {
	const n = (0, import_react.useContext)(r$3);
	return n ?? function(n, ...e) {
		const r = new URL("https://lexical.dev/docs/error"), t = new URLSearchParams();
		t.append("code", n);
		for (const n of e) t.append("v", n);
		throw r.search = t.toString(), Error(`Minified Lexical error #${n}; visit ${r.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
	}(8), n;
}
//#endregion
//#region node_modules/lexical/Lexical.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function t$3(t, ...e) {
	const n = new URL("https://lexical.dev/docs/error"), r = new URLSearchParams();
	r.append("code", t);
	for (const t of e) r.append("v", t);
	throw n.search = r.toString(), Error(`Minified Lexical error #${t}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
function e$1(t, ...e) {
	const n = new URL("https://lexical.dev/docs/error"), r = new URLSearchParams();
	r.append("code", t);
	for (const t of e) r.append("v", t);
	n.search = r.toString(), console.warn(`Minified Lexical warning #${t}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
var n$3 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement, r$2 = n$3 && "documentMode" in document ? document.documentMode : null, i$4 = n$3 && /Mac|iPod|iPhone|iPad/.test(navigator.platform), o$3 = n$3 && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent), s$5 = !(!n$3 || !("InputEvent" in window) || r$2) && "getTargetRanges" in new window.InputEvent("input"), l$2 = n$3 && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), c$2 = n$3 && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, a$2 = n$3 && /Android/.test(navigator.userAgent), u$2 = n$3 && /^(?=.*Chrome).*/i.test(navigator.userAgent), f$1 = n$3 && a$2 && u$2, d$4 = n$3 && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && i$4 && !u$2, h$3 = 0, g$3 = 1, _$5 = 2, N$1 = 1, b$4 = 2, w$4 = 3, E$5 = 4, O$5 = 5, M$5 = 6, A$5 = l$2 || c$2 || d$4 ? "\xA0" : "​", P$4 = "\n\n", D$4 = o$3 ? "\xA0" : A$5;
new RegExp("^[^֑-߿יִ-﷽ﹰ-ﻼ]*[A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿]");
var z$5 = {
	bold: 1,
	capitalize: 1024,
	code: 16,
	highlight: 128,
	italic: 2,
	lowercase: 256,
	strikethrough: 4,
	subscript: 32,
	superscript: 64,
	underline: 8,
	uppercase: 512
}, R$3 = {
	directionless: 1,
	unmergeable: 2
}, B$8 = {
	center: 2,
	end: 6,
	justify: 4,
	left: 1,
	right: 3,
	start: 5
}, W$3 = {
	[b$4]: "center",
	[M$5]: "end",
	[E$5]: "justify",
	[N$1]: "left",
	[w$4]: "right",
	[O$5]: "start"
}, J$6 = {
	normal: 0,
	segmented: 2,
	token: 1
}, j$8 = {
	[h$3]: "normal",
	[_$5]: "segmented",
	[g$3]: "token"
}, $$6 = "$config";
function V$4(t, e, n, r, i, o) {
	let s = t.getFirstChild();
	for (; null !== s;) {
		const t = s.__key;
		s.__parent === e && (Pi$1(s) && V$4(s, t, n, r, i, o), n.has(t) || o.delete(t), i.push(t)), s = s.getNextSibling();
	}
}
var Y$5 = !1, q$5 = 0;
function H$9(t) {
	q$5 = t.timeStamp;
}
function G$5(t, e, n) {
	const r = "BR" === t.nodeName, i = e.__lexicalLineBreak;
	return i && (t === i || r && t.previousSibling === i) || r && void 0 !== Po(t, n);
}
function X$5(t, e, n) {
	const r = bs$1(ps$1(n));
	let i = null, o = null;
	null !== r && r.anchorNode === t && (i = r.anchorOffset, o = r.focusOffset);
	const s = t.nodeValue;
	null !== s && $o$1(e, s, i, o, !1);
}
function Q$6(t, e, n) {
	if (wr(t)) {
		const e = t.anchor.getNode();
		if (e.is(n) && t.format !== e.getFormat()) return !1;
	}
	return Co$1(e) && n.isAttached();
}
function Z$5(t, e, n, r) {
	for (let i = t; i && !Us(i); i = as$1(i)) {
		const t = Po(i, e);
		if (void 0 !== t) {
			const e = Mo$1(t, n);
			if (e) return Li$1(e) || !Ms$1(i) ? void 0 : [i, e];
		} else if (i === r) return [r, Ko$1(n)];
	}
}
function tt$4(t, e, n) {
	Y$5 = !0;
	const r = performance.now() - q$5 > 100;
	try {
		Ei$1(t, () => {
			const i = $r$2() || function(t) {
				return t.getEditorState().read(() => {
					const t = $r$2();
					return null !== t ? t.clone() : null;
				});
			}(t), s = /* @__PURE__ */ new Map(), l = t.getRootElement(), c = t._editorState, a = t._blockCursorElement;
			let u = !1, f = "";
			for (let n = 0; n < e.length; n++) {
				const d = e[n], h = d.type, g = d.target, _ = Z$5(g, t, c, l);
				if (!_) continue;
				const [p, y] = _;
				if ("characterData" === h) r && yr$1(y) && Co$1(g) && Q$6(i, g, y) && X$5(g, y, t);
				else if ("childList" === h) {
					u = !0;
					const e = d.addedNodes;
					for (let n = 0; n < e.length; n++) {
						const r = e[n], i = Ao(r), s = r.parentNode;
						if (null != s && r !== a && null === i && !G$5(r, s, t)) {
							if (o$3) {
								const t = (Ms$1(r) ? r.innerText : null) || r.nodeValue;
								t && (f += t);
							}
							s.removeChild(r);
						}
					}
					const n = d.removedNodes, r = n.length;
					if (r > 0) {
						let e = 0;
						for (let i = 0; i < r; i++) {
							const r = n[i];
							(G$5(r, g, t) || a === r) && (g.appendChild(r), e++);
						}
						r !== e && s.set(p, y);
					}
				}
			}
			if (s.size > 0) for (const [e, n] of s) n.reconcileObservedMutation(e, t);
			const d = n.takeRecords();
			if (d.length > 0) {
				for (let e = 0; e < d.length; e++) {
					const n = d[e], r = n.addedNodes, i = n.target;
					for (let e = 0; e < r.length; e++) {
						const n = r[e], o = n.parentNode;
						null == o || "BR" !== n.nodeName || G$5(n, i, t) || o.removeChild(n);
					}
				}
				n.takeRecords();
			}
			null !== i && (u && zo$1(i), o$3 && ss(t) && i.insertRawText(f));
		});
	} finally {
		Y$5 = !1;
	}
}
function et$6(t) {
	const e = t._observer;
	if (null !== e) tt$4(t, e.takeRecords(), e);
}
function nt$6(t) {
	(function(t) {
		0 === q$5 && ps$1(t).addEventListener("textInput", H$9, !0);
	})(t), t._observer = new MutationObserver((e, n) => {
		tt$4(t, e, n);
	});
}
var rt$6 = class {
	key;
	parse;
	unparse;
	isEqual;
	defaultValue;
	constructor(t, e) {
		this.key = t, this.parse = e.parse.bind(e), this.unparse = (e.unparse || ht$4).bind(e), this.isEqual = (e.isEqual || Object.is).bind(e), this.defaultValue = this.parse(void 0);
	}
};
function it$3(t, e) {
	return new rt$6(t, e);
}
function ot$4(t, e, n = "latest") {
	const r = ("latest" === n ? t.getLatest() : t).__state;
	return r ? r.getValue(e) : e.defaultValue;
}
function lt$3(t, e, n) {
	let r;
	if (di(), "function" == typeof n) {
		const i = t.getLatest(), o = ot$4(i, e);
		if (r = n(o), e.isEqual(o, r)) return i;
	} else r = n;
	const i = t.getWritable();
	return ut$5(i).updateFromKnown(e, r), i;
}
function ct$4(t) {
	const e = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
	for (let r = "function" == typeof t ? t : t.replace; r.prototype && void 0 !== r.prototype.getType; r = Object.getPrototypeOf(r)) {
		const { ownNodeConfig: t } = Vs$1(r);
		if (t && t.stateConfigs) for (const r of t.stateConfigs) {
			let t;
			"stateConfig" in r ? (t = r.stateConfig, r.flat && n.add(t.key)) : t = r, e.set(t.key, t);
		}
	}
	return {
		flatKeys: n,
		sharedConfigMap: e
	};
}
var at$5 = class at$5 {
	node;
	knownState;
	unknownState;
	sharedNodeState;
	size;
	constructor(t, e, n = void 0, r = /* @__PURE__ */ new Map(), i = void 0) {
		this.node = t, this.sharedNodeState = e, this.unknownState = n, this.knownState = r;
		const { sharedConfigMap: o } = this.sharedNodeState, s = void 0 !== i ? i : function(t, e, n) {
			let r = n.size;
			if (e) for (const i in e) {
				const e = t.get(i);
				e && n.has(e) || r++;
			}
			return r;
		}(o, n, r);
		this.size = s;
	}
	getValue(t) {
		const e = this.knownState.get(t);
		if (void 0 !== e) return e;
		this.sharedNodeState.sharedConfigMap.set(t.key, t);
		let n = t.defaultValue;
		if (this.unknownState && t.key in this.unknownState) {
			const e = this.unknownState[t.key];
			void 0 !== e && (n = t.parse(e)), this.updateFromKnown(t, n);
		}
		return n;
	}
	getInternalState() {
		return [this.unknownState, this.knownState];
	}
	toJSON() {
		const t = { ...this.unknownState }, e = {};
		for (const [e, n] of this.knownState) e.isEqual(n, e.defaultValue) ? delete t[e.key] : t[e.key] = e.unparse(n);
		for (const n of this.sharedNodeState.flatKeys) n in t && (e[n] = t[n], delete t[n]);
		return dt$5(t) && (e.$ = t), e;
	}
	getWritable(t) {
		if (this.node === t) return this;
		const { sharedNodeState: e, unknownState: n } = this, r = new Map(this.knownState);
		return new at$5(t, e, function(t, e, n) {
			let r;
			if (n) for (const [i, o] of Object.entries(n)) {
				const n = t.get(i);
				n ? e.has(n) || e.set(n, n.parse(o)) : (r = r || {}, r[i] = o);
			}
			return r;
		}(e.sharedConfigMap, r, n), r, this.size);
	}
	updateFromKnown(t, e) {
		const n = t.key;
		this.sharedNodeState.sharedConfigMap.set(n, t);
		const { knownState: r, unknownState: i } = this;
		r.has(t) || i && n in i || (i && (delete i[n], this.unknownState = dt$5(i)), this.size++), r.set(t, e);
	}
	updateFromUnknown(t, e) {
		const n = this.sharedNodeState.sharedConfigMap.get(t);
		n ? this.updateFromKnown(n, n.parse(e)) : (this.unknownState = this.unknownState || {}, t in this.unknownState || this.size++, this.unknownState[t] = e);
	}
	updateFromJSON(t) {
		const { knownState: e } = this;
		for (const t of e.keys()) e.set(t, t.defaultValue);
		if (this.size = e.size, this.unknownState = void 0, t) for (const [e, n] of Object.entries(t)) this.updateFromUnknown(e, n);
	}
};
function ut$5(t) {
	const e = t.getWritable(), n = e.__state ? e.__state.getWritable(e) : new at$5(e, ft$5(e));
	return e.__state = n, n;
}
function ft$5(t) {
	return t.__state ? t.__state.sharedNodeState : lo$1(Is$1(), t.getType()).sharedNodeState;
}
function dt$5(t) {
	if (t) for (const e in t) return t;
}
function ht$4(t) {
	return t;
}
function gt$4(t, e, n) {
	for (const [r, i] of e.knownState) {
		if (t.has(r.key)) continue;
		t.add(r.key);
		const e = n ? n.getValue(r) : r.defaultValue;
		if (e !== i && !r.isEqual(e, i)) return !0;
	}
	return !1;
}
function _t$6(t, e, n) {
	const { unknownState: r } = e, i = n ? n.unknownState : void 0;
	if (r) for (const [e, n] of Object.entries(r)) {
		if (t.has(e)) continue;
		t.add(e);
		if (n !== (i ? i[e] : void 0)) return !0;
	}
	return !1;
}
function pt$6(t, e) {
	const n = t.__state;
	return n && n.node === t ? n.getWritable(e) : n;
}
function yt$5(t, e) {
	const n = t.__mode, r = t.__format, i = t.__style, o = e.__mode, s = e.__format, l = e.__style, c = t.__state, a = e.__state;
	return (null === n || n === o) && (null === r || r === s) && (null === i || i === l) && (null === t.__state || c === a || function(t, e) {
		if (t === e) return !0;
		if (t && e && t.size !== e.size) return !1;
		const n = /* @__PURE__ */ new Set();
		return !(t && gt$4(n, t, e) || e && gt$4(n, e, t) || t && _t$6(n, t, e) || e && _t$6(n, e, t));
	}(c, a));
}
function mt$4(t, e) {
	const n = t.mergeWithSibling(e), r = _i()._normalizedNodes;
	return r.add(t.__key), r.add(e.__key), n;
}
function xt$5(t) {
	let e, n, r = t;
	if ("" !== r.__text || !r.isSimpleText() || r.isUnmergeable()) {
		for (; null !== (e = r.getPreviousSibling()) && yr$1(e) && e.isSimpleText() && !e.isUnmergeable();) {
			if ("" !== e.__text) {
				if (yt$5(e, r)) {
					r = mt$4(e, r);
					break;
				}
				break;
			}
			e.remove();
		}
		for (; null !== (n = r.getNextSibling()) && yr$1(n) && n.isSimpleText() && !n.isUnmergeable();) {
			if ("" !== n.__text) {
				if (yt$5(r, n)) {
					r = mt$4(r, n);
					break;
				}
				break;
			}
			n.remove();
		}
	} else r.remove();
}
function Ct$4(t) {
	return St$5(t.anchor), St$5(t.focus), t;
}
function St$5(t) {
	for (; "element" === t.type;) {
		const e = t.getNode(), n = t.offset;
		let r, i;
		if (n === e.getChildrenSize() ? (r = e.getChildAtIndex(n - 1), i = !0) : (r = e.getChildAtIndex(n), i = !1), yr$1(r)) {
			t.set(r.__key, i ? r.getTextContentSize() : 0, "text", !0);
			break;
		}
		if (!Pi$1(r)) break;
		t.set(r.__key, i ? r.getChildrenSize() : 0, "element", !0);
	}
}
var vt$6, Tt$6, kt$5, Nt$3, bt$5, wt$5, Et$4, Ot$4, Mt$6, At$6, Pt$6 = "", Dt$6 = null, Ft$5 = null, Lt$5 = !1, It$5 = !1;
function Kt$4(t, e) {
	const n = Et$4.get(t);
	if (null !== e) {
		const n = ee$5(t);
		n.parentNode === e && e.removeChild(n);
	}
	if (Ot$4.has(t) || Tt$6._keyToDOMMap.delete(t), Pi$1(n)) {
		const t = Ht$4(n, Et$4);
		zt$3(t, 0, t.length - 1, null);
	}
	void 0 !== n && ns(At$6, kt$5, Nt$3, n, "destroyed");
}
function zt$3(t, e, n, r) {
	for (let i = e; i <= n; ++i) {
		const e = t[i];
		void 0 !== e && Kt$4(e, r);
	}
}
function Rt$2(t, e) {
	t.setProperty("text-align", e);
}
var Bt$5 = "40px";
function Wt$5(t, e) {
	const n = vt$6.theme.indent;
	if ("string" == typeof n) {
		const r = t.classList.contains(n);
		e > 0 && !r ? t.classList.add(n) : e < 1 && r && t.classList.remove(n);
	}
	if (0 === e) return void t.style.setProperty("padding-inline-start", "");
	const r = getComputedStyle(Tt$6._rootElement || t).getPropertyValue("--lexical-indent-base-value") || Bt$5;
	t.style.setProperty("padding-inline-start", `calc(${e} * ${r})`);
}
function Jt$4(t, e) {
	const n = t.style;
	0 === e ? Rt$2(n, "") : 1 === e ? Rt$2(n, "left") : 2 === e ? Rt$2(n, "center") : 3 === e ? Rt$2(n, "right") : 4 === e ? Rt$2(n, "justify") : 5 === e ? Rt$2(n, "start") : 6 === e && Rt$2(n, "end");
}
function jt$4(t, e) {
	const n = function(t) {
		const e = t.__dir;
		if (null !== e) return e;
		if (Ki$1(t)) return null;
		const n = t.getParentOrThrow();
		return Ki$1(n) && null === n.__dir ? "auto" : null;
	}(e);
	null !== n ? t.dir = n : t.removeAttribute("dir");
}
function Ut$3(e, n) {
	const r = Ot$4.get(e);
	void 0 === r && t$3(60);
	const i = r.createDOM(vt$6, Tt$6);
	if (function(t, e, n) {
		const r = n._keyToDOMMap;
		(function(t, e, n) {
			const r = `__lexicalKey_${e._key}`;
			t[r] = n;
		})(e, n, t), r.set(t, e);
	}(e, i, Tt$6), yr$1(r) ? i.setAttribute("data-lexical-text", "true") : Li$1(r) && i.setAttribute("data-lexical-decorator", "true"), Pi$1(r)) {
		const t = r.__indent, e = r.__size;
		if (jt$4(i, r), 0 !== t && Wt$5(i, t), 0 !== e) {
			const t = e - 1;
			$t$5(Ht$4(r, Ot$4), r, 0, t, r.getDOMSlot(i));
		}
		const n = r.__format;
		0 !== n && Jt$4(i, n), r.isInline() || Yt$4(null, r, i);
	} else {
		const t = r.getTextContent();
		if (Li$1(r)) {
			const t = r.decorate(Tt$6, vt$6);
			null !== t && Xt$3(e, t), i.contentEditable = "false";
		}
		Pt$6 += t;
	}
	return null !== n && n.insertChild(i), ns(At$6, kt$5, Nt$3, r, "created"), i;
}
function $t$5(t, e, n, r, i) {
	const o = Pt$6;
	Pt$6 = "";
	let s = n;
	for (; s <= r; ++s) {
		Ut$3(t[s], i);
		const e = Ot$4.get(t[s]);
		null !== e && yr$1(e) ? null === Dt$6 && (Dt$6 = e.getFormat(), Ft$5 = e.getStyle()) : Pi$1(e) && s < r && !e.isInline() && (Pt$6 += P$4);
	}
	i.element.__lexicalTextContent = Pt$6, Pt$6 = o + Pt$6;
}
function Vt$3(t, e) {
	if (t) {
		const n = t.__last;
		if (n) {
			const t = e.get(n);
			if (t) return Zn$1(t) ? "line-break" : Li$1(t) && t.isInline() ? "decorator" : null;
		}
		return "empty";
	}
	return null;
}
function Yt$4(t, e, n) {
	const r = Vt$3(t, Et$4), i = Vt$3(e, Ot$4);
	r !== i && e.getDOMSlot(n).setManagedLineBreak(i);
}
function qt$4(e, n, r) {
	var i;
	Dt$6 = null, Ft$5 = null, function(e, n, r) {
		const i = Pt$6, o = e.__size, s = n.__size;
		Pt$6 = "";
		const l = r.element;
		if (1 === o && 1 === s) {
			const t = e.__first, r = n.__first;
			if (t === r) Gt$4(t, l);
			else {
				const e = ee$5(t), n = Ut$3(r, null);
				try {
					l.replaceChild(n, e);
				} catch (i) {
					if ("object" == typeof i && null != i) {
						const o = `${i.toString()} Parent: ${l.tagName}, new child: {tag: ${n.tagName} key: ${r}}, old child: {tag: ${e.tagName}, key: ${t}}.`;
						throw new Error(o);
					}
					throw i;
				}
				Kt$4(t, null);
			}
			const i = Ot$4.get(r);
			yr$1(i) && null === Dt$6 && (Dt$6 = i.getFormat(), Ft$5 = i.getStyle());
		} else {
			const i = Ht$4(e, Et$4), c = Ht$4(n, Ot$4);
			if (i.length !== o && t$3(227), c.length !== s && t$3(228), 0 === o) 0 !== s && $t$5(c, 0, 0, s - 1, r);
			else if (0 === s) {
				if (0 !== o) {
					const t = null == r.after && null == r.before && null == r.element.__lexicalLineBreak;
					zt$3(i, 0, o - 1, t ? null : l), t && (l.textContent = "");
				}
			} else (function(t, e, n, r, i, o) {
				const s = r - 1, l = i - 1;
				let c, a, u = o.getFirstChild(), f = 0, d = 0;
				for (; f <= s && d <= l;) {
					const t = e[f], r = n[d];
					if (t === r) u = Qt$3(Gt$4(r, o.element)), f++, d++;
					else {
						if (void 0 === a && (a = Zt$3(n, d)), void 0 === c) c = Zt$3(e, f);
						else if (!c.has(t)) {
							f++;
							continue;
						}
						if (!a.has(t)) {
							u = Qt$3(ee$5(t)), Kt$4(t, o.element), f++, c.delete(t);
							continue;
						}
						if (c.has(r)) {
							const t = cs(Tt$6, r);
							t !== u && o.withBefore(u).insertChild(t), u = Qt$3(Gt$4(r, o.element)), f++, d++;
						} else Ut$3(r, o.withBefore(u)), d++;
					}
					const i = Ot$4.get(r);
					null !== i && yr$1(i) ? null === Dt$6 && (Dt$6 = i.getFormat(), Ft$5 = i.getStyle()) : Pi$1(i) && d <= l && !i.isInline() && (Pt$6 += P$4);
				}
				const h = f > s, g = d > l;
				if (h && !g) {
					const t = n[l + 1], e = void 0 === t ? null : Tt$6.getElementByKey(t);
					$t$5(n, 0, d, l, o.withBefore(e));
				} else g && !h && zt$3(e, f, s, o.element);
			})(0, i, c, o, s, r);
		}
		l.__lexicalTextContent = Pt$6, Pt$6 = i + Pt$6;
	}(e, n, n.getDOMSlot(r)), i = n, null == Dt$6 || Dt$6 === i.__textFormat || It$5 || i.setTextFormat(Dt$6), function(t) {
		null == Ft$5 || Ft$5 === t.__textStyle || It$5 || t.setTextStyle(Ft$5);
	}(n);
}
function Ht$4(e, n) {
	const r = [];
	let i = e.__first;
	for (; null !== i;) {
		const e = n.get(i);
		void 0 === e && t$3(101), r.push(i), i = e.__next;
	}
	return r;
}
function Gt$4(e, n) {
	const r = Et$4.get(e);
	let i = Ot$4.get(e);
	void 0 !== r && void 0 !== i || t$3(61);
	const o = Lt$5 || wt$5.has(e) || bt$5.has(e), s = cs(Tt$6, e);
	if (r === i && !o) {
		let t;
		if (Pi$1(r)) {
			const e = s.__lexicalTextContent;
			"string" == typeof e ? t = e : (t = r.getTextContent(), s.__lexicalTextContent = t);
		} else t = r.getTextContent();
		return Pt$6 += t, s;
	}
	if (r !== i && o && ns(At$6, kt$5, Nt$3, i, "updated"), i.updateDOM(r, s, vt$6)) {
		const r = Ut$3(e, null);
		return null === n && t$3(62), n.replaceChild(r, s), Kt$4(e, null), r;
	}
	if (Pi$1(r)) {
		Pi$1(i) || t$3(334, e);
		const n = i.__indent;
		(Lt$5 || n !== r.__indent) && Wt$5(s, n);
		const l = i.__format;
		if ((Lt$5 || l !== r.__format) && Jt$4(s, l), o) qt$4(r, i, s), Ki$1(i) || i.isInline() || Yt$4(r, i, s);
		else {
			const t = s.__lexicalTextContent;
			let e;
			"string" == typeof t ? e = t : (e = r.getTextContent(), s.__lexicalTextContent = e), Pt$6 += e;
		}
		if ((Lt$5 || i.__dir !== r.__dir) && (jt$4(s, i), Ki$1(i) && !Lt$5)) {
			for (const t of i.getChildren()) if (Pi$1(t)) jt$4(cs(Tt$6, t.getKey()), t);
		}
	} else {
		const t = i.getTextContent();
		if (Li$1(i)) {
			const t = i.decorate(Tt$6, vt$6);
			null !== t && Xt$3(e, t);
		}
		Pt$6 += t;
	}
	if (!It$5 && Ki$1(i) && i.__cachedText !== Pt$6) {
		const t = i.getWritable();
		t.__cachedText = Pt$6, i = t;
	}
	return s;
}
function Xt$3(t, e) {
	let n = Tt$6._pendingDecorators;
	const r = Tt$6._decorators;
	if (null === n) {
		if (r[t] === e) return;
		n = Fo(Tt$6);
	}
	n[t] = e;
}
function Qt$3(t) {
	let e = t.nextSibling;
	return null !== e && e === Tt$6._blockCursorElement && (e = e.nextSibling), e;
}
function Zt$3(t, e) {
	const n = /* @__PURE__ */ new Set();
	for (let r = e; r < t.length; r++) n.add(t[r]);
	return n;
}
function te$4(t, e, n, r, i, o) {
	Pt$6 = "", Lt$5 = 2 === r, Tt$6 = n, vt$6 = n._config, kt$5 = n._nodes, Nt$3 = Tt$6._listeners.mutation, bt$5 = i, wt$5 = o, Et$4 = t._nodeMap, Ot$4 = e._nodeMap, It$5 = e._readOnly, Mt$6 = new Map(n._keyToDOMMap);
	const s = /* @__PURE__ */ new Map();
	return At$6 = s, Gt$4("root", null), Tt$6 = void 0, kt$5 = void 0, bt$5 = void 0, wt$5 = void 0, Et$4 = void 0, Ot$4 = void 0, vt$6 = void 0, Mt$6 = void 0, At$6 = void 0, s;
}
function ee$5(e) {
	const n = Mt$6.get(e);
	return void 0 === n && t$3(75, e), n;
}
function ne$4(t) {
	return { type: t };
}
var re$2 = ne$4("SELECTION_CHANGE_COMMAND"), ie$3 = ne$4("SELECTION_INSERT_CLIPBOARD_NODES_COMMAND"), oe$5 = ne$4("CLICK_COMMAND"), se$2 = ne$4("BEFORE_INPUT_COMMAND"), le$4 = ne$4("INPUT_COMMAND"), ce$4 = ne$4("COMPOSITION_START_COMMAND"), ae$3 = ne$4("COMPOSITION_END_COMMAND"), ue$3 = ne$4("DELETE_CHARACTER_COMMAND"), fe$4 = ne$4("INSERT_LINE_BREAK_COMMAND"), de$4 = ne$4("INSERT_PARAGRAPH_COMMAND"), he$3 = ne$4("CONTROLLED_TEXT_INSERTION_COMMAND"), ge$2 = ne$4("PASTE_COMMAND"), _e$3 = ne$4("REMOVE_TEXT_COMMAND"), pe$4 = ne$4("DELETE_WORD_COMMAND"), ye$3 = ne$4("DELETE_LINE_COMMAND"), me$3 = ne$4("FORMAT_TEXT_COMMAND"), xe$1 = ne$4("UNDO_COMMAND"), Ce$2 = ne$4("REDO_COMMAND"), Se$2 = ne$4("KEYDOWN_COMMAND"), ve$3 = ne$4("KEY_ARROW_RIGHT_COMMAND"), Te$4 = ne$4("MOVE_TO_END"), ke$5 = ne$4("KEY_ARROW_LEFT_COMMAND"), Ne$2 = ne$4("MOVE_TO_START"), be$3 = ne$4("KEY_ARROW_UP_COMMAND"), we$3 = ne$4("KEY_ARROW_DOWN_COMMAND"), Ee$3 = ne$4("KEY_ENTER_COMMAND"), Oe$4 = ne$4("KEY_SPACE_COMMAND"), Me$2 = ne$4("KEY_BACKSPACE_COMMAND"), Ae$3 = ne$4("KEY_ESCAPE_COMMAND"), Pe$4 = ne$4("KEY_DELETE_COMMAND"), De$1 = ne$4("KEY_TAB_COMMAND"), Fe$2 = ne$4("INSERT_TAB_COMMAND"), Le$4 = ne$4("INDENT_CONTENT_COMMAND"), Ie$2 = ne$4("OUTDENT_CONTENT_COMMAND"), Ke$2 = ne$4("DROP_COMMAND"), ze$2 = ne$4("FORMAT_ELEMENT_COMMAND"), Re$2 = ne$4("DRAGSTART_COMMAND"), Be$3 = ne$4("DRAGOVER_COMMAND"), We$2 = ne$4("DRAGEND_COMMAND"), Je$1 = ne$4("COPY_COMMAND"), je$1 = ne$4("CUT_COMMAND"), Ue$3 = ne$4("SELECT_ALL_COMMAND"), $e$2 = ne$4("CLEAR_EDITOR_COMMAND"), Ve$2 = ne$4("CLEAR_HISTORY_COMMAND"), Ye$2 = ne$4("CAN_REDO_COMMAND"), qe$2 = ne$4("CAN_UNDO_COMMAND"), He$3 = ne$4("FOCUS_COMMAND"), Ge$1 = ne$4("BLUR_COMMAND"), Xe$2 = ne$4("KEY_MODIFIER_COMMAND"), Qe$1 = Object.freeze({}), Ze$3 = [
	["keydown", function(t, e) {
		if (tn$3 = t.timeStamp, en$3 = t.key, e.isComposing()) return;
		ls(e, Se$2, t);
	}],
	["pointerdown", function(t, e) {
		const n = t.target, r = t.pointerType;
		As$1(n) && "touch" !== r && "pen" !== r && 0 === t.button && Ei$1(e, () => {
			uo$1(n) || (cn$1 = !0);
		});
	}],
	["compositionstart", function(t, e) {
		ls(e, ce$4, t);
	}],
	["compositionend", function(t, e) {
		o$3 ? un$1 = !0 : c$2 || !l$2 && !d$4 ? ls(e, ae$3, t) : (fn$1 = !0, dn$1 = t.data);
	}],
	["input", function(t, e) {
		t.stopPropagation(), Ei$1(e, () => {
			e.dispatchCommand(le$4, t);
		}, { event: t }), rn$3 = null;
	}],
	["click", function(t, e) {
		Ei$1(e, () => {
			const n = $r$2(), r = bs$1(ps$1(e)), i = Vr$1();
			if (r) {
				if (wr(n)) {
					const e = n.anchor, o = e.getNode();
					if ("element" === e.type && 0 === e.offset && n.isCollapsed() && !Ki$1(o) && 1 === Io$1().getChildrenSize() && o.getTopLevelElementOrThrow().isEmpty() && null !== i && n.is(i)) r.removeAllRanges(), n.dirty = !0;
					else if (3 === t.detail && !n.isCollapsed()) {
						if (o !== n.focus.getNode()) {
							const t = qs(o, (t) => Pi$1(t) && !t.isInline());
							Pi$1(t) && t.select(0);
						}
					}
				} else if ("touch" === t.pointerType || "pen" === t.pointerType) {
					const n = r.anchorNode;
					if (Ms$1(n) || Co$1(n)) zo$1(Ur$2(i, r, e, t));
				}
			}
			ls(e, oe$5, t);
		});
	}],
	["cut", Qe$1],
	["copy", Qe$1],
	["dragstart", Qe$1],
	["dragover", Qe$1],
	["dragend", Qe$1],
	["paste", Qe$1],
	["focus", Qe$1],
	["blur", Qe$1],
	["drop", Qe$1]
];
s$5 && Ze$3.push(["beforeinput", (t, e) => function(t, e) {
	const n = t.inputType;
	if ("deleteCompositionText" === n || o$3 && ss(e)) return;
	if ("insertCompositionText" === n) return;
	ls(e, se$2, t);
}(t, e)]);
var tn$3 = 0, en$3 = null, nn$2 = 0, rn$3 = null;
var on$2 = /* @__PURE__ */ new WeakMap(), sn$2 = /* @__PURE__ */ new WeakMap();
var ln$2 = !1, cn$1 = !1, an$1 = !1, un$1 = !1, fn$1 = !1, dn$1 = "", hn$1 = null, gn$1 = [
	0,
	"",
	0,
	"root",
	0
];
function _n$3(t, e, n, r, i) {
	const o = t.anchor, l = t.focus, c = o.getNode(), a = _i(), u = bs$1(ps$1(a)), f = null !== u ? u.anchorNode : null, d = o.key, h = a.getElementByKey(d), g = n.length;
	return d !== l.key || !yr$1(c) || (!i && (!s$5 || nn$2 < r + 50) || c.isDirty() && g < 2 || Bo(n)) && o.offset !== l.offset && !c.isComposing() || xo$1(c) || c.isDirty() && g > 1 || (i || !s$5) && null !== h && !c.isComposing() && f !== vo$1(h) || null !== u && null !== e && (!e.collapsed || e.startContainer !== u.anchorNode || e.startOffset !== u.anchorOffset) || !c.isComposing() && (c.getFormat() !== t.format || c.getStyle() !== t.style) || function(t, e) {
		if (e.isSegmented()) return !0;
		if (!t.isCollapsed()) return !1;
		const n = t.anchor.offset, r = e.getParentOrThrow(), i = mo$1(e);
		return 0 === n ? !e.canInsertTextBefore() || !r.canInsertTextBefore() && !e.isComposing() || i || function(t) {
			const e = t.getPreviousSibling();
			return (yr$1(e) || Pi$1(e) && e.isInline()) && !e.canInsertTextAfter();
		}(e) : n === e.getTextContentSize() && (!e.canInsertTextAfter() || !r.canInsertTextAfter() && !e.isComposing() || i);
	}(t, c);
}
function pn$1(t, e) {
	return Co$1(t) && null !== t.nodeValue && 0 !== e && e !== t.nodeValue.length;
}
function yn$2(e, n, r) {
	const { anchorNode: i, anchorOffset: o, focusNode: s, focusOffset: l } = e;
	ln$2 && (ln$2 = !1, pn$1(i, o) && pn$1(s, l) && !hn$1) || Ei$1(n, () => {
		if (!r) return void zo$1(null);
		if (!ho$1(n, i, s)) return;
		let c = $r$2();
		if (hn$1 && wr(c) && c.isCollapsed()) {
			const t = c.anchor, e = hn$1.anchor;
			(t.key === e.key && t.offset === e.offset + 1 || 1 === t.offset && e.getNode().is(t.getNode().getPreviousSibling())) && (c = hn$1.clone(), zo$1(c));
		}
		if (hn$1 = null, wr(c)) {
			const r = c.anchor, i = r.getNode();
			if (c.isCollapsed()) {
				"Range" === e.type && e.anchorNode === e.focusNode && (c.dirty = !0);
				const o = ps$1(n).event, s = o ? o.timeStamp : performance.now(), [l, a, u, f, d] = gn$1, h = Io$1(), g = !1 === n.isComposing() && "" === h.getTextContent();
				if (s < d + 200 && r.offset === u && r.key === f) mn$1(c, l, a);
				else if ("text" === r.type) yr$1(i) || t$3(141), xn$2(c, i);
				else if ("element" === r.type && !g) {
					Pi$1(i) || t$3(259);
					const e = r.getNode();
					e.isEmpty() ? function(t, e) {
						mn$1(t, e.getTextFormat(), e.getTextStyle());
					}(c, e) : mn$1(c, 0, "");
				}
			} else {
				const t = r.key, e = c.focus.key, n = c.getNodes(), i = n.length, s = c.isBackward(), a = s ? l : o, u = s ? o : l, f = s ? e : t, d = s ? t : e;
				let h = 2047, g = !1;
				for (let t = 0; t < i; t++) {
					const e = n[t], r = e.getTextContentSize();
					if (yr$1(e) && 0 !== r && !(0 === t && e.__key === f && a === r || t === i - 1 && e.__key === d && 0 === u) && (g = !0, h &= e.getFormat(), 0 === h)) break;
				}
				c.format = g ? h : 0;
			}
		}
		ls(n, re$2, void 0);
	});
}
function mn$1(t, e, n) {
	t.format === e && t.style === n || (t.format = e, t.style = n, t.dirty = !0);
}
function xn$2(t, e) {
	mn$1(t, e.getFormat(), e.getStyle());
}
function Cn$3(t) {
	if (!t.getTargetRanges) return null;
	const e = t.getTargetRanges();
	return 0 === e.length ? null : e[0];
}
function Sn$2(e) {
	const n = e.inputType, r = Cn$3(e), i = _i(), o = $r$2();
	if ("deleteContentBackward" === n) {
		if (null === o) {
			const t = Vr$1();
			if (!wr(t)) return !0;
			zo$1(t.clone());
		}
		if (wr(o)) {
			const n = o.anchor.key === o.focus.key;
			if (s = e.timeStamp, "MediaLast" === en$3 && s < tn$3 + 30 && i.isComposing() && n) {
				if (Eo$1(null), tn$3 = 0, setTimeout(() => {
					Ei$1(i, () => {
						Eo$1(null);
					});
				}, 30), wr(o)) {
					const e = o.anchor.getNode();
					e.markDirty(), yr$1(e) || t$3(142), xn$2(o, e);
				}
			} else {
				Eo$1(null), e.preventDefault();
				const t = o.anchor.getNode(), r = t.getTextContent(), s = t.canInsertTextAfter(), l = 0 === o.anchor.offset && o.focus.offset === r.length;
				let c = f$1 && n && !l && s;
				if (c && o.isCollapsed() && (c = !Li$1(os$1(o.anchor, !0))), !c) {
					ls(i, ue$3, !0);
					const t = $r$2();
					f$1 && wr(t) && t.isCollapsed() && (hn$1 = t, setTimeout(() => hn$1 = null));
				}
			}
			return !0;
		}
	}
	var s;
	if (!wr(o)) return !0;
	const l = e.data;
	null !== rn$3 && Uo(!1, i, rn$3), o.dirty && null === rn$3 || !o.isCollapsed() || Ki$1(o.anchor.getNode()) || null === r || o.applyDOMRange(r), rn$3 = null;
	const a = o.anchor, u = o.focus, d = a.getNode(), h = u.getNode();
	if ("insertText" === n || "insertTranspose" === n) {
		if ("\n" === l) e.preventDefault(), ls(i, fe$4, !1);
		else if (l === P$4) e.preventDefault(), ls(i, de$4, void 0);
		else if (null == l && e.dataTransfer) {
			const t = e.dataTransfer.getData("text/plain");
			e.preventDefault(), o.insertRawText(t);
		} else null != l && _n$3(o, r, l, e.timeStamp, !0) ? (e.preventDefault(), ls(i, he$3, l)) : rn$3 = l;
		return nn$2 = e.timeStamp, !0;
	}
	switch (e.preventDefault(), n) {
		case "insertFromYank":
		case "insertFromDrop":
		case "insertReplacementText":
			ls(i, he$3, e);
			break;
		case "insertFromComposition":
			Eo$1(null), ls(i, he$3, e);
			break;
		case "insertLineBreak":
			Eo$1(null), ls(i, fe$4, !1);
			break;
		case "insertParagraph":
			Eo$1(null), an$1 && !c$2 ? (an$1 = !1, ls(i, fe$4, !1)) : ls(i, de$4, void 0);
			break;
		case "insertFromPaste":
		case "insertFromPasteAsQuotation":
			ls(i, ge$2, e);
			break;
		case "deleteByComposition":
			(function(t, e) {
				return t !== e || Pi$1(t) || Pi$1(e) || !mo$1(t) || !mo$1(e);
			})(d, h) && ls(i, _e$3, e);
			break;
		case "deleteByDrag":
		case "deleteByCut":
			ls(i, _e$3, e);
			break;
		case "deleteContent":
			ls(i, ue$3, !1);
			break;
		case "deleteWordBackward":
			ls(i, pe$4, !0);
			break;
		case "deleteWordForward":
			ls(i, pe$4, !1);
			break;
		case "deleteHardLineBackward":
		case "deleteSoftLineBackward":
			ls(i, ye$3, !0);
			break;
		case "deleteContentForward":
		case "deleteHardLineForward":
		case "deleteSoftLineForward":
			ls(i, ye$3, !1);
			break;
		case "formatStrikeThrough":
			ls(i, me$3, "strikethrough");
			break;
		case "formatBold":
			ls(i, me$3, "bold");
			break;
		case "formatItalic":
			ls(i, me$3, "italic");
			break;
		case "formatUnderline":
			ls(i, me$3, "underline");
			break;
		case "historyUndo":
			ls(i, xe$1, void 0);
			break;
		case "historyRedo": ls(i, Ce$2, void 0);
	}
	return !0;
}
function vn$2(t) {
	if (Ms$1(t.target) && uo$1(t.target)) return !0;
	const e = _i(), n = $r$2(), r = t.data, i = Cn$3(t);
	if (null != r && wr(n) && _n$3(n, i, r, t.timeStamp, !1)) {
		un$1 && (Nn$1(e, r), un$1 = !1);
		const i = n.anchor.getNode(), l = bs$1(ps$1(e));
		if (null === l) return !0;
		const c = n.isBackward(), a = c ? n.anchor.offset : n.focus.offset, u = c ? n.focus.offset : n.anchor.offset;
		s$5 && !n.isCollapsed() && yr$1(i) && null !== l.anchorNode && i.getTextContent().slice(0, a) + r + i.getTextContent().slice(a + u) === jo(l.anchorNode) || ls(e, he$3, r);
		const d = r.length;
		o$3 && d > 1 && "insertCompositionText" === t.inputType && !e.isComposing() && (n.anchor.offset -= d), f$1 && e.isComposing() && (tn$3 = 0, Eo$1(null));
	} else Uo(!1, e, null !== r ? r : void 0), un$1 && (Nn$1(e, r || void 0), un$1 = !1);
	return function() {
		di();
		et$6(_i());
	}(), !0;
}
function Tn$3(t) {
	const e = _i(), n = $r$2();
	if (wr(n) && !e.isComposing()) {
		const r = n.anchor, i = n.anchor.getNode();
		Eo$1(r.key), ds(qn$1), (t.timeStamp < tn$3 + 30 || "element" === r.type || !n.isCollapsed() || i.getFormat() !== n.format || yr$1(i) && i.getStyle() !== n.style) && ls(e, he$3, D$4);
	}
	return !0;
}
function kn$3(t) {
	return Nn$1(_i(), t.data), ds(Hn$2), !0;
}
function Nn$1(t, e) {
	const n = t._compositionKey;
	if (Eo$1(null), null !== n && null != e) {
		if ("" === e) {
			const e = Mo$1(n), r = vo$1(t.getElementByKey(n));
			if (null !== r && null !== r.nodeValue && yr$1(e)) {
				const n = bs$1(ps$1(t));
				let i = null, o = null;
				null !== n && n.anchorNode === r && (i = n.anchorOffset, o = n.focusOffset), $o$1(e, r.nodeValue, i, o, !0);
			}
			return;
		}
		if ("\n" === e[e.length - 1]) {
			const e = $r$2();
			if (wr(e) || Or$1(e)) {
				if (wr(e)) {
					const t = e.focus;
					e.anchor.set(t.key, t.offset, t.type);
				}
				ls(t, Ee$3, null);
				return;
			}
		}
	}
	Uo(!0, t, e);
}
function bn$2(t) {
	const e = _i();
	if (null == t.key) return !0;
	if (fn$1) {
		if (Qo$1(t)) return Ei$1(e, () => {
			Nn$1(e, dn$1);
		}), fn$1 = !1, dn$1 = "", !0;
		fn$1 = !1, dn$1 = "";
	}
	if (function(t) {
		return Ho(t, "ArrowRight", { shiftKey: "any" });
	}(t)) ls(e, ve$3, t);
	else if (function(t) {
		return Ho(t, "ArrowRight", Go$1);
	}(t)) ls(e, Te$4, t);
	else if (function(t) {
		return Ho(t, "ArrowLeft", { shiftKey: "any" });
	}(t)) ls(e, ke$5, t);
	else if (function(t) {
		return Ho(t, "ArrowLeft", Go$1);
	}(t)) ls(e, Ne$2, t);
	else if (function(t) {
		return Ho(t, "ArrowUp", {
			altKey: "any",
			shiftKey: "any"
		});
	}(t)) ls(e, be$3, t);
	else if (function(t) {
		return Ho(t, "ArrowDown", {
			altKey: "any",
			shiftKey: "any"
		});
	}(t)) ls(e, we$3, t);
	else if (function(t) {
		return Ho(t, "Enter", {
			altKey: "any",
			ctrlKey: "any",
			metaKey: "any",
			shiftKey: !0
		});
	}(t)) an$1 = !0, ls(e, Ee$3, t);
	else if (function(t) {
		return " " === t.key;
	}(t)) ls(e, Oe$4, t);
	else if (function(t) {
		return i$4 && Ho(t, "o", { ctrlKey: !0 });
	}(t)) t.preventDefault(), an$1 = !0, ls(e, fe$4, !0);
	else if (function(t) {
		return Ho(t, "Enter", {
			altKey: "any",
			ctrlKey: "any",
			metaKey: "any"
		});
	}(t)) an$1 = !1, ls(e, Ee$3, t);
	else if (function(t) {
		return Ho(t, "Backspace", { shiftKey: "any" }) || i$4 && Ho(t, "h", { ctrlKey: !0 });
	}(t)) Qo$1(t) ? ls(e, Me$2, t) : (t.preventDefault(), ls(e, ue$3, !0));
	else if (function(t) {
		return "Escape" === t.key;
	}(t)) ls(e, Ae$3, t);
	else if (function(t) {
		return Ho(t, "Delete", {}) || i$4 && Ho(t, "d", { ctrlKey: !0 });
	}(t)) !function(t) {
		return "Delete" === t.key;
	}(t) ? (t.preventDefault(), ls(e, ue$3, !1)) : ls(e, Pe$4, t);
	else if (function(t) {
		return Ho(t, "Backspace", Xo$1);
	}(t)) t.preventDefault(), ls(e, pe$4, !0);
	else if (function(t) {
		return Ho(t, "Delete", Xo$1);
	}(t)) t.preventDefault(), ls(e, pe$4, !1);
	else if (function(t) {
		return i$4 && Ho(t, "Backspace", { metaKey: !0 });
	}(t)) t.preventDefault(), ls(e, ye$3, !0);
	else if (function(t) {
		return i$4 && (Ho(t, "Delete", { metaKey: !0 }) || Ho(t, "k", { ctrlKey: !0 }));
	}(t)) t.preventDefault(), ls(e, ye$3, !1);
	else if (function(t) {
		return Ho(t, "b", Go$1);
	}(t)) t.preventDefault(), ls(e, me$3, "bold");
	else if (function(t) {
		return Ho(t, "u", Go$1);
	}(t)) t.preventDefault(), ls(e, me$3, "underline");
	else if (function(t) {
		return Ho(t, "i", Go$1);
	}(t)) t.preventDefault(), ls(e, me$3, "italic");
	else if (function(t) {
		return Ho(t, "Tab", { shiftKey: "any" });
	}(t)) ls(e, De$1, t);
	else if (function(t) {
		return Ho(t, "z", Go$1);
	}(t)) t.preventDefault(), ls(e, xe$1, void 0);
	else if (function(t) {
		if (i$4) return Ho(t, "z", {
			metaKey: !0,
			shiftKey: !0
		});
		return Ho(t, "y", { ctrlKey: !0 }) || Ho(t, "z", {
			ctrlKey: !0,
			shiftKey: !0
		});
	}(t)) t.preventDefault(), ls(e, Ce$2, void 0);
	else {
		const n = e._editorState._selection;
		null === n || wr(n) ? Zo$1(t) && (t.preventDefault(), ls(e, Ue$3, t)) : !function(t) {
			return Ho(t, "c", Go$1);
		}(t) ? !function(t) {
			return Ho(t, "x", Go$1);
		}(t) ? Zo$1(t) && (t.preventDefault(), ls(e, Ue$3, t)) : (t.preventDefault(), ls(e, je$1, t)) : (t.preventDefault(), ls(e, Je$1, t));
	}
	return function(t) {
		return t.ctrlKey || t.shiftKey || t.altKey || t.metaKey;
	}(t) && e.dispatchCommand(Xe$2, t), !0;
}
function wn$3(t) {
	let e = t.__lexicalEventHandles;
	return void 0 === e && (e = [], t.__lexicalEventHandles = e), e;
}
var En$2 = /* @__PURE__ */ new Map();
function On$2(t) {
	const e = ws$1(t.target);
	if (null === e) return;
	const n = _o$1(e.anchorNode);
	if (null === n) return;
	cn$1 && (cn$1 = !1, Ei$1(n, () => {
		const r = Vr$1(), i = e.anchorNode;
		if (Ms$1(i) || Co$1(i)) zo$1(Ur$2(r, e, n, t));
	}));
	const r = Wo$1(n), i = r[r.length - 1], o = i._key, s = En$2.get(o), l = s || i;
	l !== n && yn$2(e, l, !1), yn$2(e, n, !0), n !== i ? En$2.set(o, n) : s && En$2.delete(o);
}
function Mn$1(t) {
	t._lexicalHandled = !0;
}
function An$2(t) {
	return !0 === t._lexicalHandled;
}
function Dn$2(e) {
	const n = on$2.get(e);
	if (void 0 === n) return void 0;
	const r = sn$2.get(n);
	if (void 0 === r) return void 0;
	const i = r - 1;
	i >= 0 || t$3(164), on$2.delete(e), sn$2.set(n, i), 0 === i && n.removeEventListener("selectionchange", On$2);
	const o = po$1(e);
	go$1(o) ? (function(t) {
		if (null !== t._parentEditor) {
			const e = Wo$1(t), n = e[e.length - 1]._key;
			En$2.get(n) === t && En$2.delete(n);
		} else En$2.delete(t._key);
	}(o), e.__lexicalEditor = null) : o && t$3(198);
	const s = wn$3(e);
	for (let t = 0; t < s.length; t++) s[t]();
	e.__lexicalEventHandles = [];
}
function Fn$2(t, e, n) {
	di();
	const r = t.__key, i = t.getParent();
	if (null === i) return;
	const o = function(t) {
		const e = $r$2();
		if (!wr(e) || !Pi$1(t)) return e;
		const { anchor: n, focus: r } = e, i = n.getNode(), o = r.getNode();
		gs$1(i, t) && n.set(t.__key, 0, "element");
		gs$1(o, t) && r.set(t.__key, 0, "element");
		return e;
	}(t);
	let s = !1;
	if (wr(o) && e) {
		const e = o.anchor, n = o.focus;
		e.key === r && (Hr(e, t, i, t.getPreviousSibling(), t.getNextSibling()), s = !0), n.key === r && (Hr(n, t, i, t.getPreviousSibling(), t.getNextSibling()), s = !0);
	} else Or$1(o) && e && t.isSelected() && t.selectPrevious();
	if (wr(o) && e && !s) {
		const e = t.getIndexWithinParent();
		bo$1(t), Yr$1(o, i, e, -1);
	} else bo$1(t);
	n || xs$1(i) || i.canBeEmpty() || !i.isEmpty() || Fn$2(i, e), e && o && Ki$1(i) && i.isEmpty() && i.selectEnd();
}
function Ln$1(t) {
	return t;
}
var In = Symbol.for("ephemeral");
function Kn$3(t) {
	return t[In] || !1;
}
var zn$1 = class {
	__type;
	__key;
	__parent;
	__prev;
	__next;
	__state;
	static getType() {
		const { ownNodeType: e } = Vs$1(this);
		return void 0 === e && t$3(64, this.name), e;
	}
	static clone(e) {
		t$3(65, this.name);
	}
	$config() {
		return {};
	}
	config(t, e) {
		const n = e.extends || Object.getPrototypeOf(this.constructor);
		return Object.assign(e, {
			extends: n,
			type: t
		}), { [t]: e };
	}
	afterCloneFrom(t) {
		this.__key === t.__key ? (this.__parent = t.__parent, this.__next = t.__next, this.__prev = t.__prev, this.__state = t.__state) : t.__state && (this.__state = t.__state.getWritable(this));
	}
	static importDOM;
	constructor(t) {
		this.__type = this.constructor.getType(), this.__parent = null, this.__prev = null, this.__next = null, Object.defineProperty(this, "__state", {
			configurable: !0,
			enumerable: !1,
			value: void 0,
			writable: !0
		}), No$1(this, t);
	}
	getType() {
		return this.__type;
	}
	isInline() {
		t$3(137, this.constructor.name);
	}
	isAttached() {
		let t = this.__key;
		for (; null !== t;) {
			if ("root" === t) return !0;
			const e = Mo$1(t);
			if (null === e) break;
			t = e.__parent;
		}
		return !1;
	}
	isSelected(t) {
		const e = t || $r$2();
		if (null == e) return !1;
		const n = e.getNodes().some((t) => t.__key === this.__key);
		if (yr$1(this)) return n;
		if (wr(e) && "element" === e.anchor.type && "element" === e.focus.type) {
			if (e.isCollapsed()) return !1;
			const t = this.getParent();
			if (Li$1(this) && this.isInline() && t) {
				const n = e.isBackward() ? e.focus : e.anchor;
				if (t.is(n.getNode()) && n.offset === t.getChildrenSize() && this.is(t.getLastChild())) return !1;
			}
		}
		return n;
	}
	getKey() {
		return this.__key;
	}
	getIndexWithinParent() {
		const t = this.getParent();
		if (null === t) return -1;
		let e = t.getFirstChild(), n = 0;
		for (; null !== e;) {
			if (this.is(e)) return n;
			n++, e = e.getNextSibling();
		}
		return -1;
	}
	getParent() {
		const t = this.getLatest().__parent;
		return null === t ? null : Mo$1(t);
	}
	getParentOrThrow() {
		const e = this.getParent();
		return null === e && t$3(66, this.__key), e;
	}
	getTopLevelElement() {
		let e = this;
		for (; null !== e;) {
			const n = e.getParent();
			if (xs$1(n)) return Pi$1(e) || e === this && Li$1(e) || t$3(194), e;
			e = n;
		}
		return null;
	}
	getTopLevelElementOrThrow() {
		const e = this.getTopLevelElement();
		return null === e && t$3(67, this.__key), e;
	}
	getParents() {
		const t = [];
		let e = this.getParent();
		for (; null !== e;) t.push(e), e = e.getParent();
		return t;
	}
	getParentKeys() {
		const t = [];
		let e = this.getParent();
		for (; null !== e;) t.push(e.__key), e = e.getParent();
		return t;
	}
	getPreviousSibling() {
		const t = this.getLatest().__prev;
		return null === t ? null : Mo$1(t);
	}
	getPreviousSiblings() {
		const t = [], e = this.getParent();
		if (null === e) return t;
		let n = e.getFirstChild();
		for (; null !== n && !n.is(this);) t.push(n), n = n.getNextSibling();
		return t;
	}
	getNextSibling() {
		const t = this.getLatest().__next;
		return null === t ? null : Mo$1(t);
	}
	getNextSiblings() {
		const t = [];
		let e = this.getNextSibling();
		for (; null !== e;) t.push(e), e = e.getNextSibling();
		return t;
	}
	getCommonAncestor(t) {
		const e = Pi$1(this) ? this : this.getParent(), n = Pi$1(t) ? t : t.getParent(), r = e && n ? El$1(e, n) : null;
		return r ? r.commonAncestor : null;
	}
	is(t) {
		return null != t && this.__key === t.__key;
	}
	isBefore(e) {
		const n = El$1(this, e);
		return null !== n && ("descendant" === n.type || ("branch" === n.type ? -1 === Nl$1(n) : ("same" !== n.type && "ancestor" !== n.type && t$3(279), !1)));
	}
	isParentOf(t) {
		const e = El$1(this, t);
		return null !== e && "ancestor" === e.type;
	}
	getNodesBetween(e) {
		const n = this.isBefore(e), r = [], i = /* @__PURE__ */ new Set();
		let o = this;
		for (; null !== o;) {
			const s = o.__key;
			if (i.has(s) || (i.add(s), r.push(o)), o === e) break;
			const l = Pi$1(o) ? n ? o.getFirstChild() : o.getLastChild() : null;
			if (null !== l) {
				o = l;
				continue;
			}
			const c = n ? o.getNextSibling() : o.getPreviousSibling();
			if (null !== c) {
				o = c;
				continue;
			}
			const a = o.getParentOrThrow();
			if (i.has(a.__key) || r.push(a), a === e) break;
			let u = null, f = a;
			do {
				if (null === f && t$3(68), u = n ? f.getNextSibling() : f.getPreviousSibling(), f = f.getParent(), null === f) break;
				null !== u || i.has(f.__key) || r.push(f);
			} while (null === u);
			o = u;
		}
		return n || r.reverse(), r;
	}
	isDirty() {
		const t = _i()._dirtyLeaves;
		return null !== t && t.has(this.__key);
	}
	getLatest() {
		if (Kn$3(this)) return this;
		const e = Mo$1(this.__key);
		return null === e && t$3(113), e;
	}
	getWritable() {
		if (Kn$3(this)) return this;
		di();
		const t = gi(), e = _i(), n = t._nodeMap, r = this.__key, i = this.getLatest(), o = e._cloneNotNeeded, s = $r$2();
		if (null !== s && s.setCachedNodes(null), o.has(r)) return wo$1(i), i;
		const l = Bs(i);
		return o.add(r), wo$1(l), n.set(r, l), l;
	}
	getTextContent() {
		return "";
	}
	getTextContentSize() {
		return this.getTextContent().length;
	}
	createDOM(e, n) {
		t$3(70);
	}
	updateDOM(e, n, r) {
		t$3(71);
	}
	exportDOM(t) {
		return { element: this.createDOM(t._config, t) };
	}
	exportJSON() {
		const t = this.__state ? this.__state.toJSON() : void 0;
		return {
			type: this.__type,
			version: 1,
			...t
		};
	}
	static importJSON(e) {
		t$3(18, this.name);
	}
	updateFromJSON(t) {
		return function(t, e) {
			const n = t.getWritable(), r = e.$;
			let i = r;
			for (const t of ft$5(n).flatKeys) t in e && (void 0 !== i && i !== r || (i = { ...r }), i[t] = e[t]);
			return (n.__state || i) && ut$5(t).updateFromJSON(i), n;
		}(this, t);
	}
	static transform() {
		return null;
	}
	remove(t) {
		Fn$2(this, !0, t);
	}
	replace(e, n) {
		di();
		let r = $r$2();
		null !== r && (r = r.clone()), vs$1(this, e);
		const i = this.getLatest(), o = this.__key, s = e.__key, l = e.getWritable(), c = this.getParentOrThrow().getWritable(), a = c.__size;
		bo$1(l);
		const u = i.getPreviousSibling(), f = i.getNextSibling(), d = i.__prev, h = i.__next, g = i.__parent;
		if (Fn$2(i, !1, !0), null === u) c.__first = s;
		else u.getWritable().__next = s;
		if (l.__prev = d, null === f) c.__last = s;
		else f.getWritable().__prev = s;
		if (l.__next = h, l.__parent = g, c.__size = a, n && (Pi$1(this) && Pi$1(l) || t$3(139), this.getChildren().forEach((t) => {
			l.append(t);
		})), wr(r)) {
			zo$1(r);
			const t = r.anchor, e = r.focus;
			t.key === o && Nr$1(t, l), e.key === o && Nr$1(e, l);
		}
		return Oo$1() === o && Eo$1(s), l;
	}
	insertAfter(t, e = !0) {
		di(), vs$1(this, t);
		const n = this.getWritable(), r = t.getWritable(), i = r.getParent(), o = $r$2();
		let s = !1, l = !1;
		if (null !== i) {
			const e = t.getIndexWithinParent();
			if (bo$1(r), wr(o)) {
				const t = i.__key, n = o.anchor, r = o.focus;
				s = "element" === n.type && n.key === t && n.offset === e + 1, l = "element" === r.type && r.key === t && r.offset === e + 1;
			}
		}
		const c = this.getNextSibling(), a = this.getParentOrThrow().getWritable(), u = r.__key, f = n.__next;
		if (null === c) a.__last = u;
		else c.getWritable().__prev = u;
		if (a.__size++, n.__next = u, r.__next = f, r.__prev = n.__key, r.__parent = n.__parent, e && wr(o)) {
			const t = this.getIndexWithinParent();
			Yr$1(o, a, t + 1);
			const e = a.__key;
			s && o.anchor.set(e, t + 2, "element"), l && o.focus.set(e, t + 2, "element");
		}
		return t;
	}
	insertBefore(t, e = !0) {
		di(), vs$1(this, t);
		const n = this.getWritable(), r = t.getWritable(), i = r.__key;
		bo$1(r);
		const o = this.getPreviousSibling(), s = this.getParentOrThrow().getWritable(), l = n.__prev, c = this.getIndexWithinParent();
		if (null === o) s.__first = i;
		else o.getWritable().__next = i;
		s.__size++, n.__prev = i, r.__prev = l, r.__next = n.__key, r.__parent = n.__parent;
		const a = $r$2();
		if (e && wr(a)) Yr$1(a, this.getParentOrThrow(), c);
		return t;
	}
	isParentRequired() {
		return !1;
	}
	createParentElementNode() {
		return Vi();
	}
	selectStart() {
		return this.selectPrevious();
	}
	selectEnd() {
		return this.selectNext(0, 0);
	}
	selectPrevious(t, e) {
		di();
		const n = this.getPreviousSibling(), r = this.getParentOrThrow();
		if (null === n) return r.select(0, 0);
		if (Pi$1(n)) return n.select();
		if (!yr$1(n)) {
			const t = n.getIndexWithinParent() + 1;
			return r.select(t, t);
		}
		return n.select(t, e);
	}
	selectNext(t, e) {
		di();
		const n = this.getNextSibling(), r = this.getParentOrThrow();
		if (null === n) return r.select();
		if (Pi$1(n)) return n.select(0, 0);
		if (!yr$1(n)) {
			const t = n.getIndexWithinParent();
			return r.select(t, t);
		}
		return n.select(t, e);
	}
	markDirty() {
		this.getWritable();
	}
	reconcileObservedMutation(t, e) {
		this.markDirty();
	}
}, Rn$2 = "historic", Bn = "history-push", Wn$1 = "history-merge", Vn = "skip-dom-selection", qn$1 = "composition-start", Hn$2 = "composition-end";
var Gn$1 = class Gn$1 extends zn$1 {
	static getType() {
		return "linebreak";
	}
	static clone(t) {
		return new Gn$1(t.__key);
	}
	constructor(t) {
		super(t);
	}
	getTextContent() {
		return "\n";
	}
	createDOM() {
		return document.createElement("br");
	}
	updateDOM() {
		return !1;
	}
	isInline() {
		return !0;
	}
	static importDOM() {
		return { br: (t) => function(t) {
			const e = t.parentElement;
			if (null !== e && Fs$1(e)) {
				const n = e.firstChild;
				if (n === t || n.nextSibling === t && tr$1(n)) {
					const n = e.lastChild;
					if (n === t || n.previousSibling === t && tr$1(n)) return !0;
				}
			}
			return !1;
		}(t) || function(t) {
			const e = t.parentElement;
			if (null !== e && Fs$1(e)) {
				const n = e.firstChild;
				if (n === t || n.nextSibling === t && tr$1(n)) return !1;
				const r = e.lastChild;
				if (r === t || r.previousSibling === t && tr$1(r)) return !0;
			}
			return !1;
		}(t) ? null : {
			conversion: Xn$1,
			priority: 0
		} };
	}
	static importJSON(t) {
		return Qn$2().updateFromJSON(t);
	}
};
function Xn$1(t) {
	return { node: Qn$2() };
}
function Qn$2() {
	return Ss$1(new Gn$1());
}
function Zn$1(t) {
	return t instanceof Gn$1;
}
function tr$1(t) {
	return Co$1(t) && /^( |\t|\r?\n)+$/.test(t.textContent || "");
}
function er$1(t, e) {
	return 16 & e ? "code" : e & 128 ? "mark" : 32 & e ? "sub" : 64 & e ? "sup" : null;
}
function nr$2(t, e) {
	return 1 & e ? "strong" : 2 & e ? "em" : "span";
}
function rr$1(t, e, n, r, i) {
	const o = r.classList;
	let s = es$1(i, "base");
	void 0 !== s && o.add(...s), s = es$1(i, "underlineStrikethrough");
	let l = !1;
	const c = 8 & e && 4 & e;
	void 0 !== s && (8 & n && 4 & n ? (l = !0, c || o.add(...s)) : c && o.remove(...s));
	for (const t in z$5) {
		const r = z$5[t];
		if (s = es$1(i, t), void 0 !== s) if (n & r) {
			if (l && ("underline" === t || "strikethrough" === t)) {
				e & r && o.remove(...s);
				continue;
			}
			(0 === (e & r) || c && "underline" === t || "strikethrough" === t) && o.add(...s);
		} else e & r && o.remove(...s);
	}
}
function ir$2(t, e, n) {
	const r = e.firstChild, i = n.isComposing(), s = t + (i ? A$5 : "");
	if (null == r) e.textContent = s;
	else {
		const t = r.nodeValue;
		if (t !== s) if (i || o$3) {
			const [e, n, i] = function(t, e) {
				const n = t.length, r = e.length;
				let i = 0, o = 0;
				for (; i < n && i < r && t[i] === e[i];) i++;
				for (; o + i < n && o + i < r && t[n - o - 1] === e[r - o - 1];) o++;
				return [
					i,
					n - i - o,
					e.slice(i, r - o)
				];
			}(t, s);
			0 !== n && r.deleteData(e, n), r.insertData(e, i);
		} else r.nodeValue = s;
	}
}
function or$2(t, e, n, r, i, o) {
	ir$2(i, t, e);
	const s = o.theme.text;
	void 0 !== s && rr$1(0, 0, r, t, s);
}
function sr$2(t, e) {
	const n = document.createElement(e);
	return n.appendChild(t), n;
}
var lr$2 = class lr$2 extends zn$1 {
	__text;
	__format;
	__style;
	__mode;
	__detail;
	static getType() {
		return "text";
	}
	static clone(t) {
		return new lr$2(t.__text, t.__key);
	}
	afterCloneFrom(t) {
		super.afterCloneFrom(t), this.__text = t.__text, this.__format = t.__format, this.__style = t.__style, this.__mode = t.__mode, this.__detail = t.__detail;
	}
	constructor(t = "", e) {
		super(e), this.__text = t, this.__format = 0, this.__style = "", this.__mode = 0, this.__detail = 0;
	}
	getFormat() {
		return this.getLatest().__format;
	}
	getDetail() {
		return this.getLatest().__detail;
	}
	getMode() {
		return j$8[this.getLatest().__mode];
	}
	getStyle() {
		return this.getLatest().__style;
	}
	isToken() {
		return 1 === this.getLatest().__mode;
	}
	isComposing() {
		return this.__key === Oo$1();
	}
	isSegmented() {
		return 2 === this.getLatest().__mode;
	}
	isDirectionless() {
		return !!(1 & this.getLatest().__detail);
	}
	isUnmergeable() {
		return !!(2 & this.getLatest().__detail);
	}
	hasFormat(t) {
		const e = z$5[t];
		return 0 !== (this.getFormat() & e);
	}
	isSimpleText() {
		return "text" === this.__type && 0 === this.__mode;
	}
	getTextContent() {
		return this.getLatest().__text;
	}
	getFormatFlags(t, e) {
		return To$1(this.getLatest().__format, t, e);
	}
	canHaveFormat() {
		return !0;
	}
	isInline() {
		return !0;
	}
	createDOM(t, e) {
		const n = this.__format, r = er$1(0, n), i = nr$2(0, n), o = null === r ? i : r, s = document.createElement(o);
		let l = s;
		this.hasFormat("code") && s.setAttribute("spellcheck", "false"), null !== r && (l = document.createElement(i), s.appendChild(l));
		or$2(l, this, 0, n, this.__text, t);
		const c = this.__style;
		return "" !== c && (s.style.cssText = c), s;
	}
	updateDOM(e, n, r) {
		const i = this.__text, o = e.__format, s = this.__format, l = er$1(0, o), c = er$1(0, s), a = nr$2(0, o), u = nr$2(0, s);
		if ((null === l ? a : l) !== (null === c ? u : c)) return !0;
		if (l === c && a !== u) {
			const e = n.firstChild;
			e ?? t$3(48);
			const o = document.createElement(u);
			return or$2(o, this, 0, s, i, r), n.replaceChild(o, e), !1;
		}
		let f = n;
		null !== c && null !== l && (f = n.firstChild, f ?? t$3(49)), ir$2(i, f, this);
		const d = r.theme.text;
		void 0 !== d && o !== s && rr$1(0, o, s, f, d);
		const h = e.__style, g = this.__style;
		return h !== g && (n.style.cssText = g), !1;
	}
	static importDOM() {
		return {
			"#text": () => ({
				conversion: dr$1,
				priority: 0
			}),
			b: () => ({
				conversion: ar$2,
				priority: 0
			}),
			code: () => ({
				conversion: _r$1,
				priority: 0
			}),
			em: () => ({
				conversion: _r$1,
				priority: 0
			}),
			i: () => ({
				conversion: _r$1,
				priority: 0
			}),
			mark: () => ({
				conversion: _r$1,
				priority: 0
			}),
			s: () => ({
				conversion: _r$1,
				priority: 0
			}),
			span: () => ({
				conversion: cr$2,
				priority: 0
			}),
			strong: () => ({
				conversion: _r$1,
				priority: 0
			}),
			sub: () => ({
				conversion: _r$1,
				priority: 0
			}),
			sup: () => ({
				conversion: _r$1,
				priority: 0
			}),
			u: () => ({
				conversion: _r$1,
				priority: 0
			})
		};
	}
	static importJSON(t) {
		return pr$2().updateFromJSON(t);
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setTextContent(t.text).setFormat(t.format).setDetail(t.detail).setMode(t.mode).setStyle(t.style);
	}
	exportDOM(e) {
		let { element: n } = super.exportDOM(e);
		return Ms$1(n) || t$3(132), n.style.whiteSpace = "pre-wrap", this.hasFormat("lowercase") ? n.style.textTransform = "lowercase" : this.hasFormat("uppercase") ? n.style.textTransform = "uppercase" : this.hasFormat("capitalize") && (n.style.textTransform = "capitalize"), this.hasFormat("bold") && (n = sr$2(n, "b")), this.hasFormat("italic") && (n = sr$2(n, "i")), this.hasFormat("strikethrough") && (n = sr$2(n, "s")), this.hasFormat("underline") && (n = sr$2(n, "u")), { element: n };
	}
	exportJSON() {
		return {
			detail: this.getDetail(),
			format: this.getFormat(),
			mode: this.getMode(),
			style: this.getStyle(),
			text: this.getTextContent(),
			...super.exportJSON()
		};
	}
	selectionTransform(t, e) {}
	setFormat(t) {
		const e = this.getWritable();
		return e.__format = "string" == typeof t ? z$5[t] : t, e;
	}
	setDetail(t) {
		const e = this.getWritable();
		return e.__detail = "string" == typeof t ? R$3[t] : t, e;
	}
	setStyle(t) {
		const e = this.getWritable();
		return e.__style = t, e;
	}
	toggleFormat(t) {
		const e = To$1(this.getFormat(), t, null);
		return this.setFormat(e);
	}
	toggleDirectionless() {
		const t = this.getWritable();
		return t.__detail ^= 1, t;
	}
	toggleUnmergeable() {
		const t = this.getWritable();
		return t.__detail ^= 2, t;
	}
	setMode(t) {
		const e = J$6[t];
		if (this.__mode === e) return this;
		const n = this.getWritable();
		return n.__mode = e, n;
	}
	setTextContent(t) {
		if (this.__text === t) return this;
		const e = this.getWritable();
		return e.__text = t, e;
	}
	select(t, e) {
		di();
		let n = t, r = e;
		const i = $r$2(), o = this.getTextContent(), s = this.__key;
		if ("string" == typeof o) {
			const t = o.length;
			void 0 === n && (n = t), void 0 === r && (r = t);
		} else n = 0, r = 0;
		if (!wr(i)) return Br$2(s, n, s, r, "text", "text");
		{
			const t = Oo$1();
			t !== i.anchor.key && t !== i.focus.key || Eo$1(s), i.setTextNodeRange(this, n, this, r);
		}
		return i;
	}
	selectStart() {
		return this.select(0, 0);
	}
	selectEnd() {
		const t = this.getTextContentSize();
		return this.select(t, t);
	}
	spliceText(t, e, n, r) {
		const i = this.getWritable(), o = i.__text, s = n.length;
		let l = t;
		l < 0 && (l = s + l, l < 0 && (l = 0));
		const c = $r$2();
		if (r && wr(c)) {
			const e = t + s;
			c.setTextNodeRange(i, e, i, e);
		}
		return i.__text = o.slice(0, l) + n + o.slice(l + e), i;
	}
	canInsertTextBefore() {
		return !0;
	}
	canInsertTextAfter() {
		return !0;
	}
	splitText(...t) {
		di();
		const e = this.getLatest(), n = e.getTextContent();
		if ("" === n) return [];
		const r = e.__key, i = Oo$1(), o = n.length;
		t.sort((t, e) => t - e), t.push(o);
		const s = [], l = t.length;
		for (let e = 0, r = 0; e < o && r <= l; r++) {
			const i = t[r];
			i > e && (s.push(n.slice(e, i)), e = i);
		}
		const c = s.length;
		if (1 === c) return [e];
		const a = s[0], u = e.getParent();
		let f;
		const d = e.getFormat(), h = e.getStyle(), g = e.__detail;
		let _ = !1, p = null, y = null;
		const m = $r$2();
		if (wr(m)) {
			const [t, e] = m.isBackward() ? [m.focus, m.anchor] : [m.anchor, m.focus];
			"text" === t.type && t.key === r && (p = t), "text" === e.type && e.key === r && (y = e);
		}
		e.isSegmented() ? (f = pr$2(a), f.__format = d, f.__style = h, f.__detail = g, f.__state = pt$6(e, f), _ = !0) : f = e.setTextContent(a);
		const x = [f];
		for (let t = 1; t < c; t++) {
			const n = pr$2(s[t]);
			n.__format = d, n.__style = h, n.__detail = g, n.__state = pt$6(e, n);
			const o = n.__key;
			i === r && Eo$1(o), x.push(n);
		}
		const C = p ? p.offset : null, S = y ? y.offset : null;
		let v = 0;
		for (const t of x) {
			if (!p && !y) break;
			const e = v + t.getTextContentSize();
			if (null !== p && null !== C && C <= e && C >= v && (p.set(t.getKey(), C - v, "text"), C < e && (p = null)), null !== y && null !== S && S <= e && S >= v) {
				y.set(t.getKey(), S - v, "text");
				break;
			}
			v = e;
		}
		if (null !== u) {
			(function(t) {
				const e = t.getPreviousSibling(), n = t.getNextSibling();
				null !== e && wo$1(e);
				null !== n && wo$1(n);
			})(this);
			const t = u.getWritable(), e = this.getIndexWithinParent();
			_ ? (t.splice(e, 0, x), this.remove()) : t.splice(e, 1, x), wr(m) && Yr$1(m, u, e, c - 1);
		}
		return x;
	}
	mergeWithSibling(e) {
		const n = e === this.getPreviousSibling();
		n || e === this.getNextSibling() || t$3(50);
		const r = this.__key, i = e.__key, o = this.__text, s = o.length;
		Oo$1() === i && Eo$1(r);
		const l = $r$2();
		if (wr(l)) {
			const t = l.anchor, o = l.focus;
			null !== t && t.key === i && Gr(t, n, r, e, s), null !== o && o.key === i && Gr(o, n, r, e, s);
		}
		const c = e.__text, a = n ? c + o : o + c;
		this.setTextContent(a);
		const u = this.getWritable();
		return e.remove(), u;
	}
	isTextEntity() {
		return !1;
	}
};
function cr$2(t) {
	return {
		forChild: mr$1(t.style),
		node: null
	};
}
function ar$2(t) {
	const e = t, n = "normal" === e.style.fontWeight;
	return {
		forChild: mr$1(e.style, n ? void 0 : "bold"),
		node: null
	};
}
var ur$1 = /* @__PURE__ */ new WeakMap();
function fr(t) {
	if (!Ms$1(t)) return !1;
	if ("PRE" === t.nodeName) return !0;
	const e = t.style.whiteSpace;
	return "string" == typeof e && e.startsWith("pre");
}
function dr$1(e) {
	const n = e;
	null === e.parentElement && t$3(129);
	let r = n.textContent || "";
	if (null !== function(t) {
		let e, n = t.parentNode;
		const r = [t];
		for (; null !== n && void 0 === (e = ur$1.get(n)) && !fr(n);) r.push(n), n = n.parentNode;
		const i = void 0 === e ? n : e;
		for (let t = 0; t < r.length; t++) ur$1.set(r[t], i);
		return i;
	}(n)) {
		const t = r.split(/(\r?\n|\t)/), e = [], n = t.length;
		for (let r = 0; r < n; r++) {
			const n = t[r];
			"\n" === n || "\r\n" === n ? e.push(Qn$2()) : "	" === n ? e.push(Cr$1()) : "" !== n && e.push(pr$2(n));
		}
		return { node: e };
	}
	if (r = r.replace(/\r/g, "").replace(/[ \t\n]+/g, " "), "" === r) return { node: null };
	if (" " === r[0]) {
		let t = n, e = !0;
		for (; null !== t && null !== (t = hr$1(t, !1));) {
			const n = t.textContent || "";
			if (n.length > 0) {
				/[ \t\n]$/.test(n) && (r = r.slice(1)), e = !1;
				break;
			}
		}
		e && (r = r.slice(1));
	}
	if (" " === r[r.length - 1]) {
		let t = n, e = !0;
		for (; null !== t && null !== (t = hr$1(t, !0));) if ((t.textContent || "").replace(/^( |\t|\r?\n)+/, "").length > 0) {
			e = !1;
			break;
		}
		e && (r = r.slice(0, r.length - 1));
	}
	return "" === r ? { node: null } : { node: pr$2(r) };
}
function hr$1(t, e) {
	let n = t;
	for (;;) {
		let t;
		for (; null === (t = e ? n.nextSibling : n.previousSibling);) {
			const t = n.parentElement;
			if (null === t) return null;
			n = t;
		}
		if (n = t, Ms$1(n)) {
			const t = n.style.display;
			if ("" === t && !Ds$1(n) || "" !== t && !t.startsWith("inline")) return null;
		}
		let r = n;
		for (; null !== (r = e ? n.firstChild : n.lastChild);) n = r;
		if (Co$1(n)) return n;
		if ("BR" === n.nodeName) return null;
	}
}
var gr$1 = {
	code: "code",
	em: "italic",
	i: "italic",
	mark: "highlight",
	s: "strikethrough",
	strong: "bold",
	sub: "subscript",
	sup: "superscript",
	u: "underline"
};
function _r$1(t) {
	const e = gr$1[t.nodeName.toLowerCase()];
	return void 0 === e ? { node: null } : {
		forChild: mr$1(t.style, e),
		node: null
	};
}
function pr$2(t = "") {
	return Ss$1(new lr$2(t));
}
function yr$1(t) {
	return t instanceof lr$2;
}
function mr$1(t, e) {
	const n = t.fontWeight, r = t.textDecoration.split(" "), i = "700" === n || "bold" === n, o = r.includes("line-through"), s = "italic" === t.fontStyle, l = r.includes("underline"), c = t.verticalAlign;
	return (t) => yr$1(t) ? (i && !t.hasFormat("bold") && t.toggleFormat("bold"), o && !t.hasFormat("strikethrough") && t.toggleFormat("strikethrough"), s && !t.hasFormat("italic") && t.toggleFormat("italic"), l && !t.hasFormat("underline") && t.toggleFormat("underline"), "sub" !== c || t.hasFormat("subscript") || t.toggleFormat("subscript"), "super" !== c || t.hasFormat("superscript") || t.toggleFormat("superscript"), e && !t.hasFormat(e) && t.toggleFormat(e), t) : t;
}
var xr$1 = class xr$1 extends lr$2 {
	static getType() {
		return "tab";
	}
	static clone(t) {
		return new xr$1(t.__key);
	}
	constructor(t) {
		super("	", t), this.__detail = 2;
	}
	static importDOM() {
		return null;
	}
	createDOM(t) {
		const e = super.createDOM(t), n = es$1(t.theme, "tab");
		if (void 0 !== n) e.classList.add(...n);
		return e;
	}
	static importJSON(t) {
		return Cr$1().updateFromJSON(t);
	}
	setTextContent(t) {
		return "	" !== t && "" !== t && e$1(126), super.setTextContent("	");
	}
	spliceText(e, n, r, i) {
		return "" === r && 0 === n || "	" === r && 1 === n || t$3(286), this;
	}
	setDetail(e) {
		return 2 !== e && t$3(127), this;
	}
	setMode(e) {
		return "normal" !== e && t$3(128), this;
	}
	canInsertTextBefore() {
		return !1;
	}
	canInsertTextAfter() {
		return !1;
	}
};
function Cr$1() {
	return Ss$1(new xr$1());
}
function Sr$1(t) {
	return t instanceof xr$1;
}
var vr$1 = class {
	key;
	offset;
	type;
	_selection;
	constructor(t, e, n) {
		this._selection = null, this.key = t, this.offset = e, this.type = n;
	}
	is(t) {
		return this.key === t.key && this.offset === t.offset && this.type === t.type;
	}
	isBefore(t) {
		if (this.key === t.key) return this.offset < t.offset;
		return kl$1(zl(Ol$1(this, "next")), zl(Ol$1(t, "next"))) < 0;
	}
	getNode() {
		const e = Mo$1(this.key);
		return null === e && t$3(20), e;
	}
	set(t, e, n, r) {
		const i = this._selection, o = this.key;
		r && this.key === t && this.offset === e && this.type === n || (this.key = t, this.offset = e, this.type = n, fi$1() || (Oo$1() === o && Eo$1(t), null !== i && (i.setCachedNodes(null), i.dirty = !0)));
	}
};
function Tr$1(t, e, n) {
	return new vr$1(t, e, n);
}
function kr(t, e) {
	let n = e.__key, r = t.offset, i = "element";
	if (yr$1(e)) {
		i = "text";
		const t = e.getTextContentSize();
		r > t && (r = t);
	} else if (!Pi$1(e)) {
		const t = e.getNextSibling();
		if (yr$1(t)) n = t.__key, r = 0, i = "text";
		else {
			const t = e.getParent();
			t && (n = t.__key, r = e.getIndexWithinParent() + 1);
		}
	}
	t.set(n, r, i);
}
function Nr$1(t, e) {
	if (Pi$1(e)) {
		const n = e.getLastDescendant();
		Pi$1(n) || yr$1(n) ? kr(t, n) : kr(t, e);
	} else kr(t, e);
}
var br = class br {
	_nodes;
	_cachedNodes;
	dirty;
	constructor(t) {
		this._cachedNodes = null, this._nodes = t, this.dirty = !1;
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(t) {
		this._cachedNodes = t;
	}
	is(t) {
		if (!Or$1(t)) return !1;
		const e = this._nodes, n = t._nodes;
		return e.size === n.size && Array.from(e).every((t) => n.has(t));
	}
	isCollapsed() {
		return !1;
	}
	isBackward() {
		return !1;
	}
	getStartEndPoints() {
		return null;
	}
	add(t) {
		this.dirty = !0, this._nodes.add(t), this._cachedNodes = null;
	}
	delete(t) {
		this.dirty = !0, this._nodes.delete(t), this._cachedNodes = null;
	}
	clear() {
		this.dirty = !0, this._nodes.clear(), this._cachedNodes = null;
	}
	has(t) {
		return this._nodes.has(t);
	}
	clone() {
		return new br(new Set(this._nodes));
	}
	extract() {
		return this.getNodes();
	}
	insertRawText(t) {}
	insertText() {}
	insertNodes(t) {
		const e = this.getNodes(), n = e.length, r = e[n - 1];
		let i;
		if (yr$1(r)) i = r.select();
		else {
			const t = r.getIndexWithinParent() + 1;
			i = r.getParentOrThrow().select(t, t);
		}
		i.insertNodes(t);
		for (let t = 0; t < n; t++) e[t].remove();
	}
	getNodes() {
		const t = this._cachedNodes;
		if (null !== t) return t;
		const e = this._nodes, n = [];
		for (const t of e) {
			const e = Mo$1(t);
			null !== e && n.push(e);
		}
		return fi$1() || (this._cachedNodes = n), n;
	}
	getTextContent() {
		const t = this.getNodes();
		let e = "";
		for (let n = 0; n < t.length; n++) e += t[n].getTextContent();
		return e;
	}
	deleteNodes() {
		const t = this.getNodes();
		if (($r$2() || Vr$1()) === this && t[0]) {
			const e = ul$1(t[0], "next");
			Al$1(vl$1(e, e));
		}
		for (const e of t) e.remove();
	}
};
function wr(t) {
	return t instanceof Er;
}
var Er = class Er {
	format;
	style;
	anchor;
	focus;
	_cachedNodes;
	dirty;
	constructor(t, e, n, r) {
		this.anchor = t, this.focus = e, t._selection = this, e._selection = this, this._cachedNodes = null, this.format = n, this.style = r, this.dirty = !1;
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(t) {
		this._cachedNodes = t;
	}
	is(t) {
		return !!wr(t) && this.anchor.is(t.anchor) && this.focus.is(t.focus) && this.format === t.format && this.style === t.style;
	}
	isCollapsed() {
		return this.anchor.is(this.focus);
	}
	getNodes() {
		const t = this._cachedNodes;
		if (null !== t) return t;
		const e = function(t) {
			const e = [], [n, r] = t.getTextSlices();
			n && e.push(n.caret.origin);
			const i = /* @__PURE__ */ new Set(), o = /* @__PURE__ */ new Set();
			for (const n of t) if (sl$1(n)) {
				const { origin: t } = n;
				0 === e.length ? i.add(t) : (o.add(t), e.push(t));
			} else {
				const { origin: t } = n;
				Pi$1(t) && o.has(t) || e.push(t);
			}
			r && e.push(r.caret.origin);
			if (ol$1(t.focus) && Pi$1(t.focus.origin) && null === t.focus.getNodeAtCaret()) for (let n = gl$1(t.focus.origin, "previous"); sl$1(n) && i.has(n.origin) && !n.origin.isEmpty() && n.origin.is(e[e.length - 1]); n = pl$1(n)) i.delete(n.origin), e.pop();
			for (; e.length > 1;) {
				const t = e[e.length - 1];
				if (!Pi$1(t) || o.has(t) || t.isEmpty() || i.has(t)) break;
				e.pop();
			}
			if (0 === e.length && t.isCollapsed()) {
				const n = zl(t.anchor), r = zl(t.anchor.getFlipped()), i = (t) => rl$1(t) ? t.origin : t.getNodeAtCaret(), o = i(n) || i(r) || (t.anchor.getNodeAtCaret() ? n.origin : r.origin);
				e.push(o);
			}
			return e;
		}(Wl$1(Dl$1(this), "next"));
		return fi$1() || (this._cachedNodes = e), e;
	}
	setTextNodeRange(t, e, n, r) {
		this.anchor.set(t.__key, e, "text"), this.focus.set(n.__key, r, "text");
	}
	getTextContent() {
		const t = this.getNodes();
		if (0 === t.length) return "";
		const e = t[0], n = t[t.length - 1], r = this.anchor, i = this.focus, o = r.isBefore(i), [s, l] = Ar$1(this);
		let c = "", a = !0;
		for (let u = 0; u < t.length; u++) {
			const f = t[u];
			if (Pi$1(f) && !f.isInline()) a || (c += "\n"), a = !f.isEmpty();
			else if (a = !1, yr$1(f)) {
				let t = f.getTextContent();
				f === e ? f === n ? "element" === r.type && "element" === i.type && i.offset !== r.offset || (t = s < l ? t.slice(s, l) : t.slice(l, s)) : t = o ? t.slice(s) : t.slice(l) : f === n && (t = o ? t.slice(0, l) : t.slice(0, s)), c += t;
			} else !Li$1(f) && !Zn$1(f) || f === n && this.isCollapsed() || (c += f.getTextContent());
		}
		return c;
	}
	applyDOMRange(t) {
		const e = _i(), n = e.getEditorState()._selection, r = zr$1(t.startContainer, t.startOffset, t.endContainer, t.endOffset, e, n);
		if (null === r) return;
		const [i, o] = r;
		this.anchor.set(i.key, i.offset, i.type, !0), this.focus.set(o.key, o.offset, o.type, !0), Ct$4(this);
	}
	clone() {
		const t = this.anchor, e = this.focus;
		return new Er(Tr$1(t.key, t.offset, t.type), Tr$1(e.key, e.offset, e.type), this.format, this.style);
	}
	toggleFormat(t) {
		this.format = To$1(this.format, t, null), this.dirty = !0;
	}
	setFormat(t) {
		this.format = t, this.dirty = !0;
	}
	setStyle(t) {
		this.style = t, this.dirty = !0;
	}
	hasFormat(t) {
		const e = z$5[t];
		return 0 !== (this.format & e);
	}
	insertRawText(t) {
		const e = t.split(/(\r?\n|\t)/), n = [], r = e.length;
		for (let t = 0; t < r; t++) {
			const r = e[t];
			"\n" === r || "\r\n" === r ? n.push(Qn$2()) : "	" === r ? n.push(Cr$1()) : n.push(pr$2(r));
		}
		this.insertNodes(n);
	}
	insertText(e) {
		const n = this.anchor, r = this.focus, i = this.format, o = this.style;
		let s = n, l = r;
		!this.isCollapsed() && r.isBefore(n) && (s = r, l = n), "element" === s.type && function(t, e, n, r) {
			const i = t.getNode(), o = i.getChildAtIndex(t.offset), s = pr$2();
			if (s.setFormat(n), s.setStyle(r), Yi$1(o)) o.splice(0, 0, [s]);
			else {
				const t = Ki$1(i) ? Vi().append(s) : s;
				null === o ? i.append(t) : o.insertBefore(t);
			}
			t.is(e) && e.set(s.__key, 0, "text"), t.set(s.__key, 0, "text");
		}(s, l, i, o), "element" === l.type && Ml$1(l, zl(Ol$1(l, "next")));
		const c = s.offset;
		let a = l.offset;
		const u = this.getNodes(), f = u.length;
		let d = u[0];
		yr$1(d) || t$3(26);
		const h = d.getTextContent().length, g = d.getParentOrThrow();
		let _ = u[f - 1];
		if (1 === f && "element" === l.type && (a = h, l.set(s.key, a, "text")), this.isCollapsed() && c === h && (xo$1(d) || !d.canInsertTextAfter() || !g.canInsertTextAfter() && null === d.getNextSibling())) {
			let t = d.getNextSibling();
			if (yr$1(t) && t.canInsertTextBefore() && !xo$1(t) || (t = pr$2(), t.setFormat(i), t.setStyle(o), g.canInsertTextAfter() ? d.insertAfter(t) : g.insertAfter(t)), t.select(0, 0), d = t, "" !== e) return void this.insertText(e);
		} else if (this.isCollapsed() && 0 === c && (xo$1(d) || !d.canInsertTextBefore() || !g.canInsertTextBefore() && null === d.getPreviousSibling())) {
			let t = d.getPreviousSibling();
			if (yr$1(t) && !xo$1(t) || (t = pr$2(), t.setFormat(i), g.canInsertTextBefore() ? d.insertBefore(t) : g.insertBefore(t)), t.select(), d = t, "" !== e) return void this.insertText(e);
		} else if (d.isSegmented() && c !== h) {
			const t = pr$2(d.getTextContent());
			t.setFormat(i), d.replace(t), d = t;
		} else if (!this.isCollapsed() && "" !== e) {
			const t = _.getParent();
			if (!g.canInsertTextBefore() || !g.canInsertTextAfter() || Pi$1(t) && (!t.canInsertTextBefore() || !t.canInsertTextAfter())) return this.insertText(""), Kr(this.anchor, this.focus), void this.insertText(e);
		}
		if (1 === f) {
			if (mo$1(d)) {
				const t = pr$2(e);
				t.select(), d.replace(t);
				return;
			}
			const t = d.getFormat(), n = d.getStyle();
			if (c !== a || t === i && n === o) {
				if (Sr$1(d)) {
					const t = pr$2(e);
					t.setFormat(i), t.setStyle(o), t.select(), d.replace(t);
					return;
				}
			} else {
				if ("" !== d.getTextContent()) {
					const t = pr$2(e);
					if (t.setFormat(i), t.setStyle(o), t.select(), 0 === c) d.insertBefore(t, !1);
					else {
						const [e] = d.splitText(c);
						e.insertAfter(t, !1);
					}
					t.isComposing() && "text" === this.anchor.type && (this.anchor.offset -= e.length);
					return;
				}
				d.setFormat(i), d.setStyle(o);
			}
			const r = a - c;
			d = d.spliceText(c, r, e, !0), "" === d.getTextContent() ? d.remove() : "text" === this.anchor.type && (this.format = t, this.style = n, d.isComposing() && (this.anchor.offset -= e.length));
		} else {
			const t = new Set([...d.getParentKeys(), ..._.getParentKeys()]), n = Pi$1(d) ? d : d.getParentOrThrow();
			let r = Pi$1(_) ? _ : _.getParentOrThrow(), i = _;
			if (!n.is(r) && r.isInline()) do
				i = r, r = r.getParentOrThrow();
			while (r.isInline());
			if ("text" === l.type && (0 !== a || "" === _.getTextContent()) || "element" === l.type && _.getIndexWithinParent() < a) if (yr$1(_) && !mo$1(_) && a !== _.getTextContentSize()) {
				if (_.isSegmented()) {
					const t = pr$2(_.getTextContent());
					_.replace(t), _ = t;
				}
				Ki$1(l.getNode()) || "text" !== l.type || (_ = _.spliceText(0, a, "")), t.add(_.__key);
			} else {
				const t = _.getParentOrThrow();
				t.canBeEmpty() || 1 !== t.getChildrenSize() ? _.remove() : t.remove();
			}
			else t.add(_.__key);
			const o = r.getChildren(), s = new Set(u), g = n.is(r), p = n.isInline() && null === d.getNextSibling() ? n : d;
			for (let t = o.length - 1; t >= 0; t--) {
				const e = o[t];
				if (e.is(d) || Pi$1(e) && e.isParentOf(d)) break;
				e.isAttached() && (!s.has(e) || e.is(i) ? g || p.insertAfter(e, !1) : e.remove());
			}
			if (!g) {
				let e = r, n = null;
				for (; null !== e;) {
					const r = e.getChildren(), i = r.length;
					(0 === i || r[i - 1].is(n)) && (t.delete(e.__key), n = e), e = e.getParent();
				}
			}
			if (mo$1(d)) if (c === h) d.select();
			else {
				const t = pr$2(e);
				t.select(), d.replace(t);
			}
			else d = d.spliceText(c, h - c, e, !0), "" === d.getTextContent() ? d.remove() : "text" === this.anchor.type && (this.format = d.getFormat(), this.style = d.getStyle(), d.isComposing() && (this.anchor.offset -= e.length));
			for (let e = 1; e < f; e++) {
				const n = u[e], r = n.__key;
				t.has(r) || n.remove();
			}
		}
	}
	removeText() {
		const t = $r$2() === this;
		Pl$1(this, Kl$1(Dl$1(this))), t && $r$2() !== this && zo$1(this);
	}
	formatText(t, e = null) {
		if (this.isCollapsed()) return this.toggleFormat(t), void Eo$1(null);
		const n = this.getNodes(), r = [];
		for (const t of n) yr$1(t) && r.push(t);
		const i = (e) => {
			n.forEach((n) => {
				if (Pi$1(n)) {
					const r = n.getFormatFlags(t, e);
					n.setTextFormat(r);
				}
			});
		}, o = r.length;
		if (0 === o) return this.toggleFormat(t), Eo$1(null), void i(e);
		const s = this.anchor, l = this.focus, c = this.isBackward(), a = c ? l : s, u = c ? s : l;
		let f = 0, d = r[0], h = "element" === a.type ? 0 : a.offset;
		if ("text" === a.type && h === d.getTextContentSize() && (f = 1, d = r[1], h = 0), null == d) return;
		const g = d.getFormatFlags(t, e);
		i(g);
		const _ = o - 1;
		let p = r[_];
		const y = "text" === u.type ? u.offset : p.getTextContentSize();
		if (d.is(p)) {
			if (h === y) return;
			if (xo$1(d) || 0 === h && y === d.getTextContentSize()) d.setFormat(g);
			else {
				const t = d.splitText(h, y), e = 0 === h ? t[0] : t[1];
				e.setFormat(g), "text" === a.type && a.set(e.__key, 0, "text"), "text" === u.type && u.set(e.__key, y - h, "text");
			}
			this.format = g;
			return;
		}
		0 === h || xo$1(d) || ([, d] = d.splitText(h), h = 0), d.setFormat(g);
		const m = p.getFormatFlags(t, g);
		y > 0 && (y === p.getTextContentSize() || xo$1(p) || ([p] = p.splitText(y)), p.setFormat(m));
		for (let e = f + 1; e < _; e++) {
			const n = r[e], i = n.getFormatFlags(t, m);
			n.setFormat(i);
		}
		"text" === a.type && a.set(d.__key, h, "text"), "text" === u.type && u.set(p.__key, y, "text"), this.format = g | m;
	}
	insertNodes(e) {
		if (0 === e.length) return;
		if (this.isCollapsed() || this.removeText(), "root" === this.anchor.key) {
			this.insertParagraph();
			const n = $r$2();
			return wr(n) || t$3(134), n.insertNodes(e);
		}
		const n = (this.isBackward() ? this.focus : this.anchor).getNode(), r = qs(n, Ls$1), i = e[e.length - 1];
		if (Pi$1(r) && "__language" in r) {
			if ("__language" in e[0]) this.insertText(e[0].getTextContent());
			else {
				const t = ni(this);
				r.splice(t, 0, e), i.selectEnd();
			}
			return;
		}
		if (!e.some((t) => (Pi$1(t) || Li$1(t)) && !t.isInline())) {
			Pi$1(r) || t$3(211, n.constructor.name, n.getType());
			const o = ni(this);
			r.splice(o, 0, e), i.selectEnd();
			return;
		}
		const o = function(t) {
			const e = Vi();
			let n = null;
			for (let r = 0; r < t.length; r++) {
				const i = t[r], o = Zn$1(i);
				if (o || Li$1(i) && i.isInline() || Pi$1(i) && i.isInline() || yr$1(i) || i.isParentRequired()) {
					if (null === n && (n = i.createParentElementNode(), e.append(n), o)) continue;
					null !== n && n.append(i);
				} else e.append(i), n = null;
			}
			return e;
		}(e), s = o.getLastDescendant(), l = o.getChildren(), c = !Pi$1(r) || !r.isEmpty() ? this.insertParagraph() : null, a = l[l.length - 1];
		let u = l[0];
		var f;
		Pi$1(f = u) && Ls$1(f) && !f.isEmpty() && Pi$1(r) && (!r.isEmpty() || r.canMergeWhenEmpty()) && (Pi$1(r) || t$3(211, n.constructor.name, n.getType()), r.append(...u.getChildren()), u = l[1]), u && (null === r && t$3(212, n.constructor.name, n.getType()), function(e, n) {
			const r = n.getParentOrThrow().getLastChild();
			let i = n;
			const o = [n];
			for (; i !== r;) i.getNextSibling() || t$3(140), i = i.getNextSibling(), o.push(i);
			let s = e;
			for (const t of o) s = s.insertAfter(t);
		}(r, u));
		const d = qs(s, Ls$1);
		c && Pi$1(d) && (c.canMergeWhenEmpty() || Ls$1(a)) && (d.append(...c.getChildren()), c.remove()), Pi$1(r) && r.isEmpty() && r.remove(), s.selectEnd();
		const h = Pi$1(r) ? r.getLastChild() : null;
		Zn$1(h) && d !== r && h.remove();
	}
	insertParagraph() {
		if ("root" === this.anchor.key) {
			const t = Vi();
			return Io$1().splice(this.anchor.offset, 0, [t]), t.select(), t;
		}
		const e = ni(this), n = qs(this.anchor.getNode(), Ls$1);
		Pi$1(n) || t$3(213);
		const r = n.getChildAtIndex(e), i = r ? [r, ...r.getNextSiblings()] : [], o = n.insertNewAfter(this, !1);
		return o ? (o.append(...i), o.selectStart(), o) : null;
	}
	insertLineBreak(t) {
		const e = Qn$2();
		if (this.insertNodes([e]), t) {
			const t = e.getParentOrThrow(), n = e.getIndexWithinParent();
			t.select(n, n);
		}
	}
	extract() {
		const t = [...this.getNodes()], e = t.length;
		let n = t[0], r = t[e - 1];
		const [i, o] = Ar$1(this), s = this.isBackward(), [l, c] = s ? [this.focus, this.anchor] : [this.anchor, this.focus], [a, u] = s ? [o, i] : [i, o];
		if (0 === e) return [];
		if (1 === e) {
			if (yr$1(n) && !this.isCollapsed()) {
				const t = n.splitText(a, u), e = 0 === a ? t[0] : t[1];
				return e ? (l.set(e.getKey(), 0, "text"), c.set(e.getKey(), e.getTextContentSize(), "text"), [e]) : [];
			}
			return [n];
		}
		if (yr$1(n) && (a === n.getTextContentSize() ? t.shift() : 0 !== a && ([, n] = n.splitText(a), t[0] = n, l.set(n.getKey(), 0, "text"))), yr$1(r)) {
			const e = r.getTextContent().length;
			0 === u ? t.pop() : u !== e && ([r] = r.splitText(u), t[t.length - 1] = r, c.set(r.getKey(), r.getTextContentSize(), "text"));
		}
		return t;
	}
	modify(t, e, n) {
		if (ii(this, t, e, n)) return;
		const r = "move" === t, i = _i(), o = bs$1(ps$1(i));
		if (!o) return;
		const s = i._blockCursorElement, l = i._rootElement, c = this.focus.getNode();
		if (null === l || null === s || !Pi$1(c) || c.isInline() || c.canBeEmpty() || Ns$1(s, i, l), this.dirty) {
			let t = cs(i, this.anchor.key), e = cs(i, this.focus.key);
			"text" === this.anchor.type && (t = vo$1(t)), "text" === this.focus.type && (e = vo$1(e)), t && e && Xr$1(o, t, this.anchor.offset, e, this.focus.offset);
		}
		if (function(t, e, n, r) {
			t.modify(e, n, r);
		}(o, t, e ? "backward" : "forward", n), o.rangeCount > 0) {
			const t = o.getRangeAt(0), n = this.anchor.getNode(), i = Ki$1(n) ? n : ms$1(n);
			if (this.applyDOMRange(t), this.dirty = !0, !r) {
				const n = this.getNodes(), r = [];
				let s = !1;
				for (let t = 0; t < n.length; t++) {
					const e = n[t];
					gs$1(e, i) ? r.push(e) : s = !0;
				}
				if (s && r.length > 0) if (e) {
					const t = r[0];
					Pi$1(t) ? t.selectStart() : t.getParentOrThrow().selectStart();
				} else {
					const t = r[r.length - 1];
					Pi$1(t) ? t.selectEnd() : t.getParentOrThrow().selectEnd();
				}
				o.anchorNode === t.startContainer && o.anchorOffset === t.startOffset || function(t) {
					const e = t.focus, n = t.anchor, r = n.key, i = n.offset, o = n.type;
					n.set(e.key, e.offset, e.type, !0), e.set(r, i, o, !0);
				}(this);
			}
		}
		"lineboundary" === n && ii(this, t, e, n, "decorators");
	}
	forwardDeletion(t, e, n) {
		if (!n && ("element" === t.type && Pi$1(e) && t.offset === e.getChildrenSize() || "text" === t.type && t.offset === e.getTextContentSize())) {
			const t = e.getParent(), n = e.getNextSibling() || (null === t ? null : t.getNextSibling());
			if (Pi$1(n) && n.isShadowRoot()) return !0;
		}
		return !1;
	}
	deleteCharacter(t) {
		const e = this.isCollapsed();
		if (this.isCollapsed()) {
			const e = this.anchor;
			let n = e.getNode();
			if (this.forwardDeletion(e, n, t)) return;
			const r = Cl$1(Ol$1(e, t ? "previous" : "next"));
			if (r.getTextSlices().every((t) => null === t || 0 === t.distance)) {
				let t = { type: "initial" };
				for (const e of r.iterNodeCarets("shadowRoot")) if (sl$1(e)) if (e.origin.isInline());
				else {
					if (e.origin.isShadowRoot()) {
						if ("merge-block" === t.type) break;
						if (Pi$1(r.anchor.origin) && r.anchor.origin.isEmpty()) {
							const t = zl(e);
							Pl$1(this, vl$1(t, t)), r.anchor.origin.remove();
						}
						return;
					}
					"merge-next-block" !== t.type && "merge-block" !== t.type || (t = {
						block: t.block,
						caret: e,
						type: "merge-block"
					});
				}
				else {
					if ("merge-block" === t.type) break;
					if (ol$1(e)) {
						if (Pi$1(e.origin)) {
							if (e.origin.isInline()) {
								if (!e.origin.isParentOf(r.anchor.origin)) break;
							} else t = {
								block: e.origin,
								type: "merge-next-block"
							};
							continue;
						}
						if (Li$1(e.origin)) {
							if (e.origin.isIsolated());
							else if ("merge-next-block" === t.type && (e.origin.isKeyboardSelectable() || !e.origin.isInline()) && Pi$1(r.anchor.origin) && r.anchor.origin.isEmpty()) {
								r.anchor.origin.remove();
								const t = Jr();
								t.add(e.origin.getKey()), zo$1(t);
							} else e.origin.remove();
							return;
						}
						break;
					}
				}
				if ("merge-block" === t.type) {
					const { caret: e, block: n } = t;
					return Pl$1(this, vl$1(!e.origin.isEmpty() && n.isEmpty() ? Fl$1(ul$1(n, e.direction)) : r.anchor, e)), this.removeText();
				}
			}
			const i = this.focus;
			if (this.modify("extend", t, "character"), this.isCollapsed()) {
				if (t && 0 === e.offset && Pr$1(this, e.getNode())) return;
			} else {
				const r = "text" === i.type ? i.getNode() : null;
				if (n = "text" === e.type ? e.getNode() : null, null !== r && r.isSegmented()) {
					const e = i.offset, o = r.getTextContentSize();
					if (r.is(n) || t && e !== o || !t && 0 !== e) return void Fr$1(r, t, e);
				} else if (null !== n && n.isSegmented()) {
					const i = e.offset, o = n.getTextContentSize();
					if (n.is(r) || t && 0 !== i || !t && i !== o) return void Fr$1(n, t, i);
				}
				(function(t, e) {
					const n = t.anchor, r = t.focus, i = n.getNode();
					if (i === r.getNode() && "text" === n.type && "text" === r.type) {
						const t = n.offset, o = r.offset, s = t < o, l = s ? t : o, c = s ? o : t, a = c - 1;
						if (l !== a) (function(t) {
							return !(Bo(t) || Dr$1(t));
						})(i.getTextContent().slice(l, c)) && (e ? r.set(r.key, a, r.type) : n.set(n.key, a, n.type));
					}
				})(this, t);
			}
		}
		if (this.removeText(), t && !e && this.isCollapsed() && "element" === this.anchor.type && 0 === this.anchor.offset) {
			const t = this.anchor.getNode();
			t.isEmpty() && Ki$1(t.getParent()) && null === t.getPreviousSibling() && Pr$1(this, t);
		}
	}
	deleteLine(t) {
		this.isCollapsed() && this.modify("extend", t, "lineboundary"), this.isCollapsed() ? this.deleteCharacter(t) : this.removeText();
	}
	deleteWord(t) {
		if (this.isCollapsed()) {
			const e = this.anchor, n = e.getNode();
			if (this.forwardDeletion(e, n, t)) return;
			this.modify("extend", t, "word");
		}
		this.removeText();
	}
	isBackward() {
		return this.focus.isBefore(this.anchor);
	}
	getStartEndPoints() {
		return [this.anchor, this.focus];
	}
};
function Or$1(t) {
	return t instanceof br;
}
function Mr$1(t) {
	const e = t.offset;
	if ("text" === t.type) return e;
	const n = t.getNode();
	return e === n.getChildrenSize() ? n.getTextContent().length : 0;
}
function Ar$1(t) {
	const e = t.getStartEndPoints();
	if (null === e) return [0, 0];
	const [n, r] = e;
	return "element" === n.type && "element" === r.type && n.key === r.key && n.offset === r.offset ? [0, 0] : [Mr$1(n), Mr$1(r)];
}
function Pr$1(t, e) {
	for (let n = e; n; n = n.getParent()) {
		if (Pi$1(n)) {
			if (n.collapseAtStart(t)) return !0;
			if (xs$1(n)) break;
		}
		if (n.getPreviousSibling()) break;
	}
	return !1;
}
var Dr$1 = (() => {
	try {
		const t = /* @__PURE__ */ new RegExp("\\p{Emoji}", "u"), e = t.test.bind(t);
		if (e("❤️") && e("#️⃣") && e("👍")) return e;
	} catch (t) {}
	return () => !1;
})();
function Fr$1(t, e, n) {
	const r = t, i = r.getTextContent().split(/(?=\s)/g), o = i.length;
	let s = 0, l = 0;
	for (let t = 0; t < o; t++) {
		const r = t === o - 1;
		if (l = s, s += i[t].length, e && s === n || s > n || r) {
			i.splice(t, 1), r && (l = void 0);
			break;
		}
	}
	const c = i.join("").trim();
	"" === c ? r.remove() : (r.setTextContent(c), r.select(l, l));
}
function Lr(e, n, r, i) {
	let o, s = n;
	if (Ms$1(e)) {
		let l = !1;
		const c = e.childNodes, a = c.length, u = i._blockCursorElement;
		s === a && (l = !0, s = a - 1);
		let f = c[s], d = !1;
		if (f === u) f = c[s + 1], d = !0;
		else if (null !== u) {
			const t = u.parentNode;
			if (e === t) n > Array.prototype.indexOf.call(t.children, u) && s--;
		}
		if (o = Ro(f), yr$1(o)) s = dl$1(o, l ? "next" : "previous");
		else {
			let c = Ro(e);
			if (null === c) return null;
			if (Pi$1(c)) {
				const a = i.getElementByKey(c.getKey());
				null === a && t$3(214);
				const u = c.getDOMSlot(a);
				[c, s] = u.resolveChildIndex(c, a, e, n), Pi$1(c) || t$3(215), l && s >= c.getChildrenSize() && (s = Math.max(0, c.getChildrenSize() - 1));
				let f = c.getChildAtIndex(s);
				if (Pi$1(f) && function(t, e, n) {
					const r = t.getParent();
					return null === n || null === r || !r.canBeEmpty() || r !== n.getNode();
				}(f, 0, r)) {
					const t = l ? f.getLastDescendant() : f.getFirstDescendant();
					null === t ? c = f : (f = t, c = Pi$1(f) ? f : f.getParentOrThrow()), s = 0;
				}
				yr$1(f) ? (o = f, c = null, s = dl$1(f, l ? "next" : "previous")) : f !== c && l && !d && (Pi$1(c) || t$3(216), s = Math.min(c.getChildrenSize(), s + 1));
			} else {
				const t = c.getIndexWithinParent();
				s = 0 === n && Li$1(c) && Ro(e) === c ? t : t + 1, c = c.getParentOrThrow();
			}
			if (Pi$1(c)) return Tr$1(c.__key, s, "element");
		}
	} else o = Ro(e);
	return yr$1(o) ? Tr$1(o.__key, dl$1(o, s, "clamp"), "text") : null;
}
function Ir$1(t, e, n) {
	const r = t.offset, i = t.getNode();
	if (0 === r) {
		const r = i.getPreviousSibling(), o = i.getParent();
		if (e) {
			if ((n || !e) && null === r && Pi$1(o) && o.isInline()) {
				const e = o.getPreviousSibling();
				yr$1(e) && t.set(e.__key, e.getTextContent().length, "text");
			}
		} else Pi$1(r) && !n && r.isInline() ? t.set(r.__key, r.getChildrenSize(), "element") : yr$1(r) && t.set(r.__key, r.getTextContent().length, "text");
	} else if (r === i.getTextContent().length) {
		const r = i.getNextSibling(), o = i.getParent();
		if (e && Pi$1(r) && r.isInline()) t.set(r.__key, 0, "element");
		else if ((n || e) && null === r && Pi$1(o) && o.isInline() && !o.canInsertTextAfter()) {
			const e = o.getNextSibling();
			yr$1(e) && t.set(e.__key, 0, "text");
		}
	}
}
function Kr(t, e, n) {
	if ("text" === t.type && "text" === e.type) {
		const n = t.isBefore(e), r = t.is(e);
		Ir$1(t, n, r), Ir$1(e, !n, r), r && e.set(t.key, t.offset, t.type);
	}
}
function zr$1(t, e, n, r, i, o) {
	if (null === t || null === n || !ho$1(i, t, n)) return null;
	const s = Lr(t, e, wr(o) ? o.anchor : null, i);
	if (null === s) return null;
	const l = Lr(n, r, wr(o) ? o.focus : null, i);
	if (null === l) return null;
	if ("element" === s.type && "element" === l.type) {
		const e = Ro(t), r = Ro(n);
		if (Li$1(e) && Li$1(r)) return null;
	}
	return Kr(s, l), [s, l];
}
function Rr$1(t) {
	return Pi$1(t) && !t.isInline();
}
function Br$2(t, e, n, r, i, o) {
	const s = gi(), l = new Er(Tr$1(t, e, i), Tr$1(n, r, o), 0, "");
	return l.dirty = !0, s._selection = l, l;
}
function Wr() {
	return new Er(Tr$1("root", 0, "element"), Tr$1("root", 0, "element"), 0, "");
}
function Jr() {
	return new br(/* @__PURE__ */ new Set());
}
function Ur$2(t, e, n, r) {
	const i = n._window;
	if (null === i) return null;
	const o = r || i.event, s = o ? o.type : void 0, l = "selectionchange" === s, c = !Y$5 && (l || "beforeinput" === s || "compositionstart" === s || "compositionend" === s || "click" === s && o && 3 === o.detail || "drop" === s || void 0 === s);
	let a, u, f, d;
	if (wr(t) && !c) return t.clone();
	if (null === e) return null;
	if (a = e.anchorNode, u = e.focusNode, f = e.anchorOffset, d = e.focusOffset, (l || void 0 === s) && wr(t) && !ho$1(n, a, u)) return t.clone();
	const h = zr$1(a, f, u, d, n, t);
	if (null === h) return null;
	const [g, _] = h;
	let p = 0, y = "";
	if (wr(t)) {
		const e = t.anchor;
		if (g.key === e.key) p = t.format, y = t.style;
		else {
			const t = g.getNode();
			yr$1(t) ? (p = t.getFormat(), y = t.getStyle()) : Pi$1(t) && (p = t.getTextFormat(), y = t.getTextStyle());
		}
	}
	return new Er(g, _, p, y);
}
function $r$2() {
	return gi()._selection;
}
function Vr$1() {
	return _i()._editorState._selection;
}
function Yr$1(t, e, n, r = 1) {
	const i = t.anchor, o = t.focus, s = i.getNode(), l = o.getNode();
	if (!e.is(s) && !e.is(l)) return;
	const c = e.__key;
	if (t.isCollapsed()) {
		const e = i.offset;
		if (n <= e && r > 0 || n < e && r < 0) {
			const n = Math.max(0, e + r);
			i.set(c, n, "element"), o.set(c, n, "element"), qr$1(t);
		}
	} else {
		const s = t.isBackward(), l = s ? o : i, a = l.getNode(), u = s ? i : o, f = u.getNode();
		if (e.is(a)) {
			const t = l.offset;
			(n <= t && r > 0 || n < t && r < 0) && l.set(c, Math.max(0, t + r), "element");
		}
		if (e.is(f)) {
			const t = u.offset;
			(n <= t && r > 0 || n < t && r < 0) && u.set(c, Math.max(0, t + r), "element");
		}
	}
	qr$1(t);
}
function qr$1(t) {
	const e = t.anchor, n = e.offset, r = t.focus, i = r.offset, o = e.getNode(), s = r.getNode();
	if (t.isCollapsed()) {
		if (!Pi$1(o)) return;
		const t = o.getChildrenSize(), i = n >= t, s = i ? o.getChildAtIndex(t - 1) : o.getChildAtIndex(n);
		if (yr$1(s)) {
			let t = 0;
			i && (t = s.getTextContentSize()), e.set(s.__key, t, "text"), r.set(s.__key, t, "text");
		}
		return;
	}
	if (Pi$1(o)) {
		const t = o.getChildrenSize(), r = n >= t, i = r ? o.getChildAtIndex(t - 1) : o.getChildAtIndex(n);
		if (yr$1(i)) {
			let t = 0;
			r && (t = i.getTextContentSize()), e.set(i.__key, t, "text");
		}
	}
	if (Pi$1(s)) {
		const t = s.getChildrenSize(), e = i >= t, n = e ? s.getChildAtIndex(t - 1) : s.getChildAtIndex(i);
		if (yr$1(n)) {
			let t = 0;
			e && (t = n.getTextContentSize()), r.set(n.__key, t, "text");
		}
	}
}
function Hr(t, e, n, r, i) {
	let o = null, s = 0, l = null;
	null !== r ? (o = r.__key, yr$1(r) ? (s = r.getTextContentSize(), l = "text") : Pi$1(r) && (s = r.getChildrenSize(), l = "element")) : null !== i && (o = i.__key, yr$1(i) ? l = "text" : Pi$1(i) && (l = "element")), null !== o && null !== l ? t.set(o, s, l) : (s = e.getIndexWithinParent(), -1 === s && (s = n.getChildrenSize()), t.set(n.__key, s, "element"));
}
function Gr(t, e, n, r, i) {
	"text" === t.type ? t.set(n, t.offset + (e ? 0 : i), "text") : t.offset > r.getIndexWithinParent() && t.set(t.key, t.offset - 1, "element");
}
function Xr$1(t, e, n, r, i) {
	try {
		t.setBaseAndExtent(e, n, r, i);
	} catch (t) {}
}
function Qr$1(t, e, n) {
	const r = cs(t, e.getKey());
	if (Pi$1(e)) {
		const t = e.getDOMSlot(r);
		return [t.element, n + t.getFirstChildOffset()];
	}
	return [r, n];
}
function Zr$1(t, e, n, r, i, s, l) {
	const c = r.anchorNode, a = r.focusNode, u = r.anchorOffset, f = r.focusOffset, d = document.activeElement;
	if (i.has("collaboration") && d !== s || null !== d && fo$1(d)) return;
	if (!wr(e)) return void (null !== t && ho$1(n, c, a) && r.removeAllRanges());
	const h = e.anchor, g = e.focus, _ = h.getNode(), p = g.getNode(), [y, m] = Qr$1(n, _, h.offset), [x, C] = Qr$1(n, p, g.offset), S = e.format, v = e.style, T = e.isCollapsed();
	let k = y, N = x, b = !1;
	var w, E, O, M, A;
	if (("text" === h.type ? (k = vo$1(y), b = _.getFormat() !== S || _.getStyle() !== v) : wr(t) && "text" === t.anchor.type && (b = !0), "text" === g.type && (N = vo$1(x)), null !== k && null !== N) && (T && (null === t || b || wr(t) && (t.format !== S || t.style !== v)) && (w = S, E = v, O = m, M = h.key, A = performance.now(), gn$1 = [
		w,
		E,
		O,
		M,
		A
	]), u !== m || f !== C || c !== k || a !== N || "Range" === r.type && T || (null !== d && s.contains(d) || i.has("skip-selection-focus") || s.focus({ preventScroll: !0 }), "element" === h.type))) {
		if (Xr$1(r, k, m, N, C), !o$3 || !e.isCollapsed() || null === s || i.has("skip-selection-focus") || null !== document.activeElement && s.contains(document.activeElement) || s.focus({ preventScroll: !0 }), !i.has("skip-scroll-into-view") && e.isCollapsed() && null !== s && s === document.activeElement) {
			const t = wr(e) && "element" === e.anchor.type ? k.childNodes[m] || null : r.rangeCount > 0 ? r.getRangeAt(0) : null;
			if (null !== t) {
				let e;
				if (t instanceof Text) {
					const n = document.createRange();
					n.selectNode(t), e = n.getBoundingClientRect();
				} else e = t.getBoundingClientRect();
				(function(t, e, n) {
					const r = us(n), i = _s$1(r);
					if (null === r || null === i) return;
					let { top: o, bottom: s } = e, l = 0, c = 0, a = n;
					for (; null !== a;) {
						const e = a === r.body;
						if (e) l = 0, c = ps$1(t).innerHeight;
						else {
							const t = a.getBoundingClientRect();
							l = t.top, c = t.bottom;
						}
						let n = 0;
						if (o < l ? n = -(l - o) : s > c && (n = s - c), 0 !== n) if (e) i.scrollBy(0, n);
						else {
							const t = a.scrollTop;
							a.scrollTop += n;
							const e = a.scrollTop - t;
							o -= e, s -= e;
						}
						if (e) break;
						a = as$1(a);
					}
				})(n, e, s);
			}
		}
		ln$2 = !0;
	}
}
function ti$1(t) {
	let e = $r$2() || Vr$1();
	null === e && (e = Io$1().selectEnd()), e.insertNodes(t);
}
function ni(e) {
	let n = e;
	e.isCollapsed() || n.removeText();
	const r = $r$2();
	wr(r) && (n = r), wr(n) || t$3(161);
	const i = n.anchor;
	let o = i.getNode(), s = i.offset;
	for (; !Ls$1(o);) {
		const t = o;
		if ([o, s] = ri$1(o, s), t.is(o)) break;
	}
	return s;
}
function ri$1(t, e) {
	const n = t.getParent();
	if (!n) {
		const t = Vi();
		return Io$1().append(t), t.select(), [Io$1(), 0];
	}
	if (yr$1(t)) {
		const r = t.splitText(e);
		if (0 === r.length) return [n, t.getIndexWithinParent()];
		const i = 0 === e ? 0 : 1;
		return [n, r[0].getIndexWithinParent() + i];
	}
	if (!Pi$1(t) || 0 === e) return [n, t.getIndexWithinParent()];
	const r = t.getChildAtIndex(e);
	if (r) {
		const n = new Er(Tr$1(t.__key, e, "element"), Tr$1(t.__key, e, "element"), 0, ""), i = t.insertNewAfter(n);
		i && i.append(r, ...r.getNextSiblings());
	}
	return [n, t.getIndexWithinParent() + 1];
}
function ii(t, e, n, r, i = "decorators-and-blocks") {
	if ("move" === e && "character" === r && !t.isCollapsed()) {
		const [e, r] = n === t.isBackward() ? [t.focus, t.anchor] : [t.anchor, t.focus];
		return r.set(e.key, e.offset, e.type), !0;
	}
	const o = Ol$1(t.focus, n ? "previous" : "next"), s = "lineboundary" === r, l = "move" === e;
	let c = o, a = "decorators-and-blocks" === i;
	if (!Rl$1(c)) {
		for (const t of c) {
			a = !1;
			const { origin: e } = t;
			if (!Li$1(e) || e.isIsolated() || (c = t, !s || !e.isInline())) break;
		}
		if (a) for (const t of Cl$1(o).iterNodeCarets("extend" === e ? "shadowRoot" : "root")) {
			if (sl$1(t)) t.origin.isInline() || (c = t);
			else {
				if (Pi$1(t.origin)) continue;
				Li$1(t.origin) && !t.origin.isInline() && (c = t);
			}
			break;
		}
	}
	if (c === o) return !1;
	if (l && !s && Li$1(c.origin) && c.origin.isKeyboardSelectable()) {
		const t = Jr();
		return t.add(c.origin.getKey()), zo$1(t), !0;
	}
	return c = zl(c), l && Ml$1(t.anchor, c), Ml$1(t.focus, c), a || !s;
}
var oi$1 = null, si$1 = null, li = !1, ci$1 = !1, ai = 0;
var ui$1 = {
	characterData: !0,
	childList: !0,
	subtree: !0
};
function fi$1() {
	return li || null !== oi$1 && oi$1._readOnly;
}
function di() {
	li && t$3(13);
}
function hi$1() {
	ai > 99 && t$3(14);
}
function gi() {
	return null === oi$1 && t$3(195, pi$1()), oi$1;
}
function _i() {
	return null === si$1 && t$3(196, pi$1()), si$1;
}
function pi$1() {
	let t = 0;
	const e = /* @__PURE__ */ new Set(), n = no.version;
	if ("undefined" != typeof window) for (const r of document.querySelectorAll("[contenteditable]")) {
		const i = po$1(r);
		if (go$1(i)) t++;
		else if (i) {
			let t = String(i.constructor.version || "<0.17.1");
			t === n && (t += " (separately built, likely a bundler configuration issue)"), e.add(t);
		}
	}
	let r = ` Detected on the page: ${t} compatible editor(s) with version ${n}`;
	return e.size && (r += ` and incompatible editors with versions ${Array.from(e).join(", ")}`), r;
}
function yi$1() {
	return si$1;
}
function mi$1(t, e, n) {
	const r = e.__type, i = lo$1(t, r);
	let o = n.get(r);
	void 0 === o && (o = Array.from(i.transforms), n.set(r, o));
	const s = o.length;
	for (let t = 0; t < s && (o[t](e), e.isAttached()); t++);
}
function xi$1(t, e) {
	return void 0 !== t && t.__key !== e && t.isAttached();
}
function Ci(t, e) {
	if (!e) return;
	const n = t._updateTags;
	let r = e;
	Array.isArray(e) || (r = [e]);
	for (const t of r) n.add(t);
}
function Si(t) {
	return vi(t, _i()._nodes);
}
function vi(e, n) {
	const r = e.type, i = n.get(r);
	void 0 === i && t$3(17, r);
	const o = i.klass;
	e.type !== o.getType() && t$3(18, o.name);
	const s = o.importJSON(e), l = e.children;
	if (Pi$1(s) && Array.isArray(l)) for (let t = 0; t < l.length; t++) {
		const e = vi(l[t], n);
		s.append(e);
	}
	return s;
}
function Ti$1(t, e, n) {
	const r = oi$1, i = li, o = si$1;
	oi$1 = e, li = !0, si$1 = t;
	try {
		return n();
	} finally {
		oi$1 = r, li = i, si$1 = o;
	}
}
function ki$1(t, e) {
	const n = t._pendingEditorState, r = t._rootElement, i = t._headless || null === r;
	if (null === n) return;
	const o = t._editorState, s = o._selection, l = n._selection, c = 0 !== t._dirtyType, a = oi$1, u = li, f = si$1, d = t._updating, h = t._observer;
	let g = null;
	if (t._pendingEditorState = null, t._editorState = n, !i && c && null !== h) {
		si$1 = t, oi$1 = n, li = !1, t._updating = !0;
		try {
			const e = t._dirtyType, r = t._dirtyElements, i = t._dirtyLeaves;
			h.disconnect(), g = te$4(o, n, t, e, r, i);
		} catch (e) {
			if (e instanceof Error && t._onError(e), ci$1) throw e;
			Zi$1(t, null, r, n), nt$6(t), t._dirtyType = 2, ci$1 = !0, ki$1(t, o), ci$1 = !1;
			return;
		} finally {
			h.observe(r, ui$1), t._updating = d, oi$1 = a, li = u, si$1 = f;
		}
	}
	n._readOnly || (n._readOnly = !0);
	const _ = t._dirtyLeaves, p = t._dirtyElements, y = t._normalizedNodes, m = t._updateTags, x = t._deferred;
	c && (t._dirtyType = 0, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements = /* @__PURE__ */ new Map(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set()), function(t, e) {
		const n = t._decorators;
		let r = t._pendingDecorators || n;
		const i = e._nodeMap;
		let o;
		for (o in r) i.has(o) || (r === n && (r = Fo(t)), delete r[o]);
	}(t, n);
	const C = i ? null : bs$1(ps$1(t));
	if (t._editable && null !== C && (c || null === l || l.dirty || !l.is(s)) && null !== r && !m.has("skip-dom-selection")) {
		si$1 = t, oi$1 = n;
		try {
			if (null !== h && h.disconnect(), c || null === l || l.dirty) {
				const e = t._blockCursorElement;
				null !== e && Ns$1(e, t, r), Zr$1(s, l, t, C, m, r);
			}
			(function(t, e, n) {
				let r = t._blockCursorElement;
				if (wr(n) && n.isCollapsed() && "element" === n.anchor.type && e.contains(document.activeElement)) {
					const i = n.anchor, o = i.getNode(), s = i.offset;
					let l = !1, c = null;
					if (s === o.getChildrenSize()) ks$1(o.getChildAtIndex(s - 1)) && (l = !0);
					else {
						const e = o.getChildAtIndex(s);
						if (null !== e && ks$1(e)) {
							const n = e.getPreviousSibling();
							(null === n || ks$1(n)) && (l = !0, c = t.getElementByKey(e.__key));
						}
					}
					if (l) {
						const n = t.getElementByKey(o.__key);
						null === r && (t._blockCursorElement = r = function(t) {
							const e = t.theme, n = document.createElement("div");
							n.contentEditable = "false", n.setAttribute("data-lexical-cursor", "true");
							let r = e.blockCursor;
							if (void 0 !== r) {
								if ("string" == typeof r) r = e.blockCursor = Ql$1(r);
								void 0 !== r && n.classList.add(...r);
							}
							return n;
						}(t._config)), e.style.caretColor = "transparent", null === c ? n.appendChild(r) : n.insertBefore(r, c);
						return;
					}
				}
				null !== r && Ns$1(r, t, e);
			})(t, r, l);
		} finally {
			null !== h && h.observe(r, ui$1), si$1 = f, oi$1 = a;
		}
	}
	null !== g && function(t, e, n, r, i) {
		const o = Array.from(t._listeners.mutation), s = o.length;
		for (let t = 0; t < s; t++) {
			const [s, l] = o[t];
			for (const t of l) {
				const o = e.get(t);
				void 0 !== o && s(o, {
					dirtyLeaves: r,
					prevEditorState: i,
					updateTags: n
				});
			}
		}
	}(t, g, m, _, o), wr(l) || null === l || null !== s && s.is(l) || t.dispatchCommand(re$2, void 0);
	const S = t._pendingDecorators;
	null !== S && (t._decorators = S, t._pendingDecorators = null, Ni$1("decorator", t, !0, S)), function(t, e, n) {
		const r = Lo(e), i = Lo(n);
		r !== i && Ni$1("textcontent", t, !0, i);
	}(t, e || o, n), Ni$1("update", t, !0, {
		dirtyElements: p,
		dirtyLeaves: _,
		editorState: n,
		mutatedNodes: g,
		normalizedNodes: y,
		prevEditorState: e || o,
		tags: m
	}), function(t, e) {
		if (t._deferred = [], 0 !== e.length) {
			const n = t._updating;
			t._updating = !0;
			try {
				for (let t = 0; t < e.length; t++) e[t]();
			} finally {
				t._updating = n;
			}
		}
	}(t, x), function(t) {
		const e = t._updates;
		if (0 !== e.length) {
			const n = e.shift();
			if (n) {
				const [e, r] = n;
				wi(t, e, r);
			}
		}
	}(t);
}
function Ni$1(t, e, n, ...r) {
	const i = e._updating;
	e._updating = n;
	try {
		const n = Array.from(e._listeners[t]);
		for (let t = 0; t < n.length; t++) n[t].apply(null, r);
	} finally {
		e._updating = i;
	}
}
function bi(e, n) {
	const r = e._updates;
	let i = n || !1;
	for (; 0 !== r.length;) {
		const n = r.shift();
		if (n) {
			const [r, o] = n, s = e._pendingEditorState;
			let l;
			void 0 !== o && (l = o.onUpdate, o.skipTransforms && (i = !0), o.discrete && (null === s && t$3(191), s._flushSync = !0), l && e._deferred.push(l), Ci(e, o.tag)), null == s ? wi(e, r, o) : r();
		}
	}
	return i;
}
function wi(e, n, r) {
	const i = e._updateTags;
	let o, s = !1, l = !1;
	void 0 !== r && (o = r.onUpdate, Ci(e, r.tag), s = r.skipTransforms || !1, l = r.discrete || !1), o && e._deferred.push(o);
	const c = e._editorState;
	let a = e._pendingEditorState, u = !1;
	(null === a || a._readOnly) && (a = e._pendingEditorState = zi$1(a || c), u = !0), a._flushSync = l;
	const f = oi$1, d = li, h = si$1, g = e._updating;
	oi$1 = a, li = !1, e._updating = !0, si$1 = e;
	const _ = e._headless || null === e.getRootElement();
	io(null);
	try {
		u && (_ ? null !== c._selection && (a._selection = c._selection.clone()) : a._selection = function(t, e) {
			const n = t.getEditorState()._selection, r = bs$1(ps$1(t));
			return wr(n) || null == n ? Ur$2(n, r, t, e) : n.clone();
		}(e, r && r.event || null));
		const i = e._compositionKey;
		n(), s = bi(e, s), function(t, e) {
			const n = e.getEditorState()._selection, r = t._selection;
			if (wr(r)) {
				const t = r.anchor, e = r.focus;
				let i;
				if ("text" === t.type && (i = t.getNode(), i.selectionTransform(n, r)), "text" === e.type) {
					const t = e.getNode();
					i !== t && t.selectionTransform(n, r);
				}
			}
		}(a, e), 0 !== e._dirtyType && (s ? function(t, e) {
			const n = e._dirtyLeaves, r = t._nodeMap;
			for (const t of n) {
				const e = r.get(t);
				yr$1(e) && e.isAttached() && e.isSimpleText() && !e.isUnmergeable() && xt$5(e);
			}
		}(a, e) : function(t, e) {
			const n = e._dirtyLeaves, r = e._dirtyElements, i = t._nodeMap, o = Oo$1(), s = /* @__PURE__ */ new Map();
			let l = n, c = l.size, a = r, u = a.size;
			for (; c > 0 || u > 0;) {
				if (c > 0) {
					e._dirtyLeaves = /* @__PURE__ */ new Set();
					for (const t of l) {
						const r = i.get(t);
						yr$1(r) && r.isAttached() && r.isSimpleText() && !r.isUnmergeable() && xt$5(r), void 0 !== r && xi$1(r, o) && mi$1(e, r, s), n.add(t);
					}
					if (l = e._dirtyLeaves, c = l.size, c > 0) {
						ai++;
						continue;
					}
				}
				e._dirtyLeaves = /* @__PURE__ */ new Set(), e._dirtyElements = /* @__PURE__ */ new Map(), a.delete("root") && a.set("root", !0);
				for (const t of a) {
					const n = t[0], l = t[1];
					if (r.set(n, l), !l) continue;
					const c = i.get(n);
					void 0 !== c && xi$1(c, o) && mi$1(e, c, s);
				}
				l = e._dirtyLeaves, c = l.size, a = e._dirtyElements, u = a.size, ai++;
			}
			e._dirtyLeaves = n, e._dirtyElements = r;
		}(a, e), bi(e), function(t, e, n, r) {
			const i = t._nodeMap, o = e._nodeMap, s = [];
			for (const [t] of r) {
				const e = o.get(t);
				void 0 !== e && (e.isAttached() || (Pi$1(e) && V$4(e, t, i, o, s, r), i.has(t) || r.delete(t), s.push(t)));
			}
			for (const t of s) o.delete(t);
			for (const t of n) {
				const e = o.get(t);
				void 0 === e || e.isAttached() || (i.has(t) || n.delete(t), o.delete(t));
			}
		}(c, a, e._dirtyLeaves, e._dirtyElements));
		i !== e._compositionKey && (a._flushSync = !0);
		const o = a._selection;
		if (wr(o)) {
			const e = a._nodeMap, n = o.anchor.key, r = o.focus.key;
			void 0 !== e.get(n) && void 0 !== e.get(r) || t$3(19);
		} else Or$1(o) && 0 === o._nodes.size && (a._selection = null);
	} catch (t) {
		t instanceof Error && e._onError(t), e._pendingEditorState = c, e._dirtyType = 2, e._cloneNotNeeded.clear(), e._dirtyLeaves = /* @__PURE__ */ new Set(), e._dirtyElements.clear(), ki$1(e);
		return;
	} finally {
		oi$1 = f, li = d, si$1 = h, e._updating = g, ai = 0;
	}
	0 !== e._dirtyType || e._deferred.length > 0 || function(t, e) {
		const n = e.getEditorState()._selection, r = t._selection;
		if (null !== r) {
			if (r.dirty || !r.is(n)) return !0;
		} else if (null !== n) return !0;
		return !1;
	}(a, e) ? a._flushSync ? (a._flushSync = !1, ki$1(e)) : u && ao$1(() => {
		ki$1(e);
	}) : (a._flushSync = !1, u && (i.clear(), e._deferred = [], e._pendingEditorState = null));
}
function Ei$1(t, e, n) {
	si$1 === t && void 0 === n ? e() : wi(t, e, n);
}
var Oi = class Oi {
	element;
	before;
	after;
	constructor(t, e, n) {
		this.element = t, this.before = e || null, this.after = n || null;
	}
	withBefore(t) {
		return new Oi(this.element, t, this.after);
	}
	withAfter(t) {
		return new Oi(this.element, this.before, t);
	}
	withElement(t) {
		return this.element === t ? this : new Oi(t, this.before, this.after);
	}
	insertChild(e) {
		const n = this.before || this.getManagedLineBreak();
		return null !== n && n.parentElement !== this.element && t$3(222), this.element.insertBefore(e, n), this;
	}
	removeChild(e) {
		return e.parentElement !== this.element && t$3(223), this.element.removeChild(e), this;
	}
	replaceChild(e, n) {
		return n.parentElement !== this.element && t$3(224), this.element.replaceChild(e, n), this;
	}
	getFirstChild() {
		const t = this.after ? this.after.nextSibling : this.element.firstChild;
		return t === this.before || t === this.getManagedLineBreak() ? null : t;
	}
	getManagedLineBreak() {
		return this.element.__lexicalLineBreak || null;
	}
	setManagedLineBreak(t) {
		if (null === t) this.removeManagedLineBreak();
		else {
			const e = "decorator" === t && (d$4 || c$2 || l$2);
			this.insertManagedLineBreak(e);
		}
	}
	removeManagedLineBreak() {
		const t = this.getManagedLineBreak();
		if (t) {
			const e = this.element, n = "IMG" === t.nodeName ? t.nextSibling : null;
			n && e.removeChild(n), e.removeChild(t), e.__lexicalLineBreak = void 0;
		}
	}
	insertManagedLineBreak(t) {
		const e = this.getManagedLineBreak();
		if (e) {
			if (t === ("IMG" === e.nodeName)) return;
			this.removeManagedLineBreak();
		}
		const n = this.element, r = this.before, i = document.createElement("br");
		if (n.insertBefore(i, r), t) {
			const t = document.createElement("img");
			t.setAttribute("data-lexical-linebreak", "true"), t.style.cssText = "display: inline !important; border: 0px !important; margin: 0px !important;", t.alt = "", n.insertBefore(t, i), n.__lexicalLineBreak = t;
		} else n.__lexicalLineBreak = i;
	}
	getFirstChildOffset() {
		let t = 0;
		for (let e = this.after; null !== e; e = e.previousSibling) t++;
		return t;
	}
	resolveChildIndex(t, e, n, r) {
		if (n === this.element) {
			const e = this.getFirstChildOffset();
			return [t, Math.min(e + t.getChildrenSize(), Math.max(e, r))];
		}
		const i = Mi(e, n);
		i.push(r);
		const o = Mi(e, this.element);
		let s = t.getIndexWithinParent();
		for (let t = 0; t < o.length; t++) {
			const e = i[t], n = o[t];
			if (void 0 === e || e < n) break;
			if (e > n) {
				s += 1;
				break;
			}
		}
		return [t.getParentOrThrow(), s];
	}
};
function Mi(e, n) {
	const r = [];
	let i = n;
	for (; i !== e && null !== i; i = i.parentNode) {
		let t = 0;
		for (let e = i.previousSibling; null !== e; e = e.previousSibling) t++;
		r.push(t);
	}
	return i !== e && t$3(225), r.reverse();
}
var Ai = class extends zn$1 {
	__first;
	__last;
	__size;
	__format;
	__style;
	__indent;
	__dir;
	__textFormat;
	__textStyle;
	constructor(t) {
		super(t), this.__first = null, this.__last = null, this.__size = 0, this.__format = 0, this.__style = "", this.__indent = 0, this.__dir = null, this.__textFormat = 0, this.__textStyle = "";
	}
	afterCloneFrom(t) {
		super.afterCloneFrom(t), this.__key === t.__key && (this.__first = t.__first, this.__last = t.__last, this.__size = t.__size), this.__indent = t.__indent, this.__format = t.__format, this.__style = t.__style, this.__dir = t.__dir, this.__textFormat = t.__textFormat, this.__textStyle = t.__textStyle;
	}
	getFormat() {
		return this.getLatest().__format;
	}
	getFormatType() {
		return W$3[this.getFormat()] || "";
	}
	getStyle() {
		return this.getLatest().__style;
	}
	getIndent() {
		return this.getLatest().__indent;
	}
	getChildren() {
		const t = [];
		let e = this.getFirstChild();
		for (; null !== e;) t.push(e), e = e.getNextSibling();
		return t;
	}
	getChildrenKeys() {
		const t = [];
		let e = this.getFirstChild();
		for (; null !== e;) t.push(e.__key), e = e.getNextSibling();
		return t;
	}
	getChildrenSize() {
		return this.getLatest().__size;
	}
	isEmpty() {
		return 0 === this.getChildrenSize();
	}
	isDirty() {
		const t = _i()._dirtyElements;
		return null !== t && t.has(this.__key);
	}
	isLastChild() {
		const t = this.getLatest(), e = this.getParentOrThrow().getLastChild();
		return null !== e && e.is(t);
	}
	getAllTextNodes() {
		const t = [];
		let e = this.getFirstChild();
		for (; null !== e;) {
			if (yr$1(e) && t.push(e), Pi$1(e)) {
				const n = e.getAllTextNodes();
				t.push(...n);
			}
			e = e.getNextSibling();
		}
		return t;
	}
	getFirstDescendant() {
		let t = this.getFirstChild();
		for (; Pi$1(t);) {
			const e = t.getFirstChild();
			if (null === e) break;
			t = e;
		}
		return t;
	}
	getLastDescendant() {
		let t = this.getLastChild();
		for (; Pi$1(t);) {
			const e = t.getLastChild();
			if (null === e) break;
			t = e;
		}
		return t;
	}
	getDescendantByIndex(t) {
		const e = this.getChildren(), n = e.length;
		if (t >= n) {
			const t = e[n - 1];
			return Pi$1(t) && t.getLastDescendant() || t || null;
		}
		const r = e[t];
		return Pi$1(r) && r.getFirstDescendant() || r || null;
	}
	getFirstChild() {
		const t = this.getLatest().__first;
		return null === t ? null : Mo$1(t);
	}
	getFirstChildOrThrow() {
		const e = this.getFirstChild();
		return null === e && t$3(45, this.__key), e;
	}
	getLastChild() {
		const t = this.getLatest().__last;
		return null === t ? null : Mo$1(t);
	}
	getLastChildOrThrow() {
		const e = this.getLastChild();
		return null === e && t$3(96, this.__key), e;
	}
	getChildAtIndex(t) {
		const e = this.getChildrenSize();
		let n, r;
		if (t < e / 2) {
			for (n = this.getFirstChild(), r = 0; null !== n && r <= t;) {
				if (r === t) return n;
				n = n.getNextSibling(), r++;
			}
			return null;
		}
		for (n = this.getLastChild(), r = e - 1; null !== n && r >= t;) {
			if (r === t) return n;
			n = n.getPreviousSibling(), r--;
		}
		return null;
	}
	getTextContent() {
		let t = "";
		const e = this.getChildren(), n = e.length;
		for (let r = 0; r < n; r++) {
			const i = e[r];
			t += i.getTextContent(), Pi$1(i) && r !== n - 1 && !i.isInline() && (t += P$4);
		}
		return t;
	}
	getTextContentSize() {
		let t = 0;
		const e = this.getChildren(), n = e.length;
		for (let r = 0; r < n; r++) {
			const i = e[r];
			t += i.getTextContentSize(), Pi$1(i) && r !== n - 1 && !i.isInline() && (t += 2);
		}
		return t;
	}
	getDirection() {
		return this.getLatest().__dir;
	}
	getTextFormat() {
		return this.getLatest().__textFormat;
	}
	hasFormat(t) {
		if ("" !== t) {
			const e = B$8[t];
			return 0 !== (this.getFormat() & e);
		}
		return !1;
	}
	hasTextFormat(t) {
		const e = z$5[t];
		return 0 !== (this.getTextFormat() & e);
	}
	getFormatFlags(t, e) {
		return To$1(this.getLatest().__textFormat, t, e);
	}
	getTextStyle() {
		return this.getLatest().__textStyle;
	}
	select(t, e) {
		di();
		const n = $r$2();
		let r = t, i = e;
		const o = this.getChildrenSize();
		if (!this.canBeEmpty()) {
			if (0 === t && 0 === e) {
				const t = this.getFirstChild();
				if (yr$1(t) || Pi$1(t)) return t.select(0, 0);
			} else if (!(void 0 !== t && t !== o || void 0 !== e && e !== o)) {
				const t = this.getLastChild();
				if (yr$1(t) || Pi$1(t)) return t.select();
			}
		}
		void 0 === r && (r = o), void 0 === i && (i = o);
		const s = this.__key;
		return wr(n) ? (n.anchor.set(s, r, "element"), n.focus.set(s, i, "element"), n.dirty = !0, n) : Br$2(s, r, s, i, "element", "element");
	}
	selectStart() {
		const t = this.getFirstDescendant();
		return t ? t.selectStart() : this.select();
	}
	selectEnd() {
		const t = this.getLastDescendant();
		return t ? t.selectEnd() : this.select();
	}
	clear() {
		const t = this.getWritable();
		return this.getChildren().forEach((t) => t.remove()), t;
	}
	append(...t) {
		return this.splice(this.getChildrenSize(), 0, t);
	}
	setDirection(t) {
		const e = this.getWritable();
		return e.__dir = t, e;
	}
	setFormat(t) {
		return this.getWritable().__format = "" !== t ? B$8[t] : 0, this;
	}
	setStyle(t) {
		return this.getWritable().__style = t || "", this;
	}
	setTextFormat(t) {
		const e = this.getWritable();
		return e.__textFormat = t, e;
	}
	setTextStyle(t) {
		const e = this.getWritable();
		return e.__textStyle = t, e;
	}
	setIndent(t) {
		return this.getWritable().__indent = t, this;
	}
	splice(e, n, r) {
		Kn$3(this) && t$3(324, this.__key, this.__type);
		const i = this.getChildrenSize(), o = this.getWritable();
		e + n <= i || t$3(226, String(e), String(n), String(i));
		const s = o.__key, l = [], c = [], a = this.getChildAtIndex(e + n);
		let u = null, f = i - n + r.length;
		if (0 !== e) if (e === i) u = this.getLastChild();
		else {
			const t = this.getChildAtIndex(e);
			null !== t && (u = t.getPreviousSibling());
		}
		if (n > 0) {
			let e = null === u ? this.getFirstChild() : u.getNextSibling();
			for (let r = 0; r < n; r++) {
				null === e && t$3(100);
				const n = e.getNextSibling(), r = e.__key;
				bo$1(e.getWritable()), c.push(r), e = n;
			}
		}
		let d = u;
		for (const e of r) {
			null !== d && e.is(d) && (u = d = d.getPreviousSibling());
			const n = e.getWritable();
			n.__parent === s && f--, bo$1(n);
			const r = e.__key;
			if (null === d) o.__first = r, n.__prev = null;
			else {
				const t = d.getWritable();
				t.__next = r, n.__prev = t.__key;
			}
			e.__key === s && t$3(76), n.__parent = s, l.push(r), d = e;
		}
		if (e + n === i) {
			if (null !== d) d.getWritable().__next = null, o.__last = d.__key;
		} else if (null !== a) {
			const t = a.getWritable();
			if (null !== d) {
				const e = d.getWritable();
				t.__prev = d.__key, e.__next = a.__key;
			} else t.__prev = null;
		}
		if (o.__size = f, c.length) {
			const t = $r$2();
			if (wr(t)) {
				const e = new Set(c), n = new Set(l), { anchor: r, focus: i } = t;
				Di(r, e, n) && Hr(r, r.getNode(), this, u, a), Di(i, e, n) && Hr(i, i.getNode(), this, u, a), 0 !== f || this.canBeEmpty() || xs$1(this) || this.remove();
			}
		}
		return o;
	}
	getDOMSlot(t) {
		return new Oi(t);
	}
	exportDOM(t) {
		const { element: e } = super.exportDOM(t);
		if (Ms$1(e)) {
			const t = this.getIndent();
			t > 0 && (e.style.paddingInlineStart = 40 * t + "px");
			const n = this.getDirection();
			n && (e.dir = n);
		}
		return { element: e };
	}
	exportJSON() {
		const t = {
			children: [],
			direction: this.getDirection(),
			format: this.getFormatType(),
			indent: this.getIndent(),
			...super.exportJSON()
		}, e = this.getTextFormat(), n = this.getTextStyle();
		return 0 === e && "" === n || xs$1(this) || this.getChildren().some(yr$1) || (0 !== e && (t.textFormat = e), "" !== n && (t.textStyle = n)), t;
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setFormat(t.format).setIndent(t.indent).setDirection(t.direction).setTextFormat(t.textFormat || 0).setTextStyle(t.textStyle || "");
	}
	insertNewAfter(t, e) {
		return null;
	}
	canIndent() {
		return !0;
	}
	collapseAtStart(t) {
		return !1;
	}
	excludeFromCopy(t) {
		return !1;
	}
	canReplaceWith(t) {
		return !0;
	}
	canInsertAfter(t) {
		return !0;
	}
	canBeEmpty() {
		return !0;
	}
	canInsertTextBefore() {
		return !0;
	}
	canInsertTextAfter() {
		return !0;
	}
	isInline() {
		return !1;
	}
	isShadowRoot() {
		return !1;
	}
	canMergeWith(t) {
		return !1;
	}
	extractWithChild(t, e, n) {
		return !1;
	}
	canMergeWhenEmpty() {
		return !1;
	}
	reconcileObservedMutation(t, e) {
		const n = this.getDOMSlot(t);
		let r = n.getFirstChild();
		for (let t = this.getFirstChild(); t; t = t.getNextSibling()) {
			const i = e.getElementByKey(t.getKey());
			null !== i && (null == r ? (n.insertChild(i), r = i) : r !== i && n.replaceChild(i, r), r = r.nextSibling);
		}
	}
};
function Pi$1(t) {
	return t instanceof Ai;
}
function Di(t, e, n) {
	let r = t.getNode();
	for (; r;) {
		const t = r.__key;
		if (e.has(t) && !n.has(t)) return !0;
		r = r.getParent();
	}
	return !1;
}
var Fi$1 = class extends zn$1 {
	decorate(t, e) {
		return null;
	}
	isIsolated() {
		return !1;
	}
	isInline() {
		return !0;
	}
	isKeyboardSelectable() {
		return !0;
	}
};
function Li$1(t) {
	return t instanceof Fi$1;
}
var Ii$1 = class Ii$1 extends Ai {
	__cachedText;
	static getType() {
		return "root";
	}
	static clone() {
		return new Ii$1();
	}
	constructor() {
		super("root"), this.__cachedText = null;
	}
	getTopLevelElementOrThrow() {
		t$3(51);
	}
	getTextContent() {
		const t = this.__cachedText;
		return !fi$1() && 0 !== _i()._dirtyType || null === t ? super.getTextContent() : t;
	}
	remove() {
		t$3(52);
	}
	replace(e) {
		t$3(53);
	}
	insertBefore(e) {
		t$3(54);
	}
	insertAfter(e) {
		t$3(55);
	}
	updateDOM(t, e) {
		return !1;
	}
	splice(e, n, r) {
		for (const e of r) Pi$1(e) || Li$1(e) || t$3(282);
		return super.splice(e, n, r);
	}
	static importJSON(t) {
		return Io$1().updateFromJSON(t);
	}
	collapseAtStart() {
		return !0;
	}
};
function Ki$1(t) {
	return t instanceof Ii$1;
}
function zi$1(t) {
	return new Ji$1(new Map(t._nodeMap));
}
function Ri$1() {
	return new Ji$1(new Map([["root", new Ii$1()]]));
}
function Bi$1(e) {
	const n = e.exportJSON(), r = e.constructor;
	if (n.type !== r.getType() && t$3(130, r.name), Pi$1(e)) {
		const i = n.children;
		Array.isArray(i) || t$3(59, r.name);
		const o = e.getChildren();
		for (let t = 0; t < o.length; t++) {
			const e = Bi$1(o[t]);
			i.push(e);
		}
	}
	return n;
}
function Wi(t) {
	return t instanceof Ji$1;
}
var Ji$1 = class Ji$1 {
	_nodeMap;
	_selection;
	_flushSync;
	_readOnly;
	constructor(t, e) {
		this._nodeMap = t, this._selection = e || null, this._flushSync = !1, this._readOnly = !1;
	}
	isEmpty() {
		return 1 === this._nodeMap.size && null === this._selection;
	}
	read(t, e) {
		return Ti$1(e && e.editor || null, this, t);
	}
	clone(t) {
		const e = new Ji$1(this._nodeMap, void 0 === t ? this._selection : t);
		return e._readOnly = !0, e;
	}
	toJSON() {
		return Ti$1(null, this, () => ({ root: Bi$1(Io$1()) }));
	}
};
var ji$1 = class extends Ai {
	static getType() {
		return "artificial";
	}
	createDOM(t) {
		return document.createElement("div");
	}
};
var Ui$1 = class Ui$1 extends Ai {
	static getType() {
		return "paragraph";
	}
	static clone(t) {
		return new Ui$1(t.__key);
	}
	createDOM(t) {
		const e = document.createElement("p"), n = es$1(t.theme, "paragraph");
		if (void 0 !== n) e.classList.add(...n);
		return e;
	}
	updateDOM(t, e, n) {
		return !1;
	}
	static importDOM() {
		return { p: (t) => ({
			conversion: $i,
			priority: 0
		}) };
	}
	exportDOM(t) {
		const { element: e } = super.exportDOM(t);
		if (Ms$1(e)) {
			this.isEmpty() && e.append(document.createElement("br"));
			const t = this.getFormatType();
			t && (e.style.textAlign = t);
		}
		return { element: e };
	}
	static importJSON(t) {
		return Vi().updateFromJSON(t);
	}
	exportJSON() {
		const t = super.exportJSON();
		if (void 0 === t.textFormat || void 0 === t.textStyle) {
			const e = this.getChildren().find(yr$1);
			e ? (t.textFormat = e.getFormat(), t.textStyle = e.getStyle()) : (t.textFormat = this.getTextFormat(), t.textStyle = this.getTextStyle());
		}
		return t;
	}
	insertNewAfter(t, e) {
		const n = Vi();
		n.setTextFormat(t.format), n.setTextStyle(t.style);
		const r = this.getDirection();
		return n.setDirection(r), n.setFormat(this.getFormatType()), n.setStyle(this.getStyle()), this.insertAfter(n, e), n;
	}
	collapseAtStart() {
		const t = this.getChildren();
		if (0 === t.length || yr$1(t[0]) && "" === t[0].getTextContent().trim()) {
			if (null !== this.getNextSibling()) return this.selectNext(), this.remove(), !0;
			if (null !== this.getPreviousSibling()) return this.selectPrevious(), this.remove(), !0;
		}
		return !1;
	}
};
function $i(t) {
	const e = Vi();
	if (t.style && (e.setFormat(t.style.textAlign), Js$1(t, e)), "" === e.getFormatType()) {
		const n = t.getAttribute("align");
		n && n && n in B$8 && e.setFormat(n);
	}
	return { node: e };
}
function Vi() {
	return Ss$1(new Ui$1());
}
function Yi$1(t) {
	return t instanceof Ui$1;
}
function Zi$1(t, e, n, r) {
	const i = t._keyToDOMMap;
	i.clear(), t._editorState = Ri$1(), t._pendingEditorState = r, t._compositionKey = null, t._dirtyType = 0, t._cloneNotNeeded.clear(), t._dirtyLeaves = /* @__PURE__ */ new Set(), t._dirtyElements.clear(), t._normalizedNodes = /* @__PURE__ */ new Set(), t._updateTags = /* @__PURE__ */ new Set(), t._updates = [], t._blockCursorElement = null;
	const o = t._observer;
	null !== o && (o.disconnect(), t._observer = null), null !== e && (e.textContent = ""), null !== n && (n.textContent = "", i.set("root", n));
}
function to$1(t) {
	const e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set();
	let r = t;
	for (; r;) {
		const { ownNodeConfig: t } = Vs$1(r), i = r.transform;
		if (!n.has(i)) {
			n.add(i);
			const t = r.transform();
			t && e.add(t);
		}
		if (t) {
			const n = t.$transform;
			n && e.add(n), r = t.extends;
		} else {
			const t = Object.getPrototypeOf(r);
			r = t.prototype instanceof zn$1 && t !== zn$1 ? t : void 0;
		}
	}
	return e;
}
function eo$1(t) {
	const e = t || {}, n = yi$1(), r = e.theme || {}, i = void 0 === t ? n : e.parentEditor || null, o = e.disableEvents || !1, s = Ri$1(), l = e.namespace || (null !== i ? i._config.namespace : Jo$2()), c = e.editorState, a = [
		Ii$1,
		lr$2,
		Gn$1,
		xr$1,
		Ui$1,
		ji$1,
		...e.nodes || []
	], { onError: u, html: f } = e, d = void 0 === e.editable || e.editable;
	let h;
	if (void 0 === t && null !== n) h = n._nodes;
	else {
		h = /* @__PURE__ */ new Map();
		for (let t = 0; t < a.length; t++) {
			let e = a[t], n = null, r = null;
			if ("function" != typeof e) {
				const t = e;
				e = t.replace, n = t.with, r = t.withKlass || null;
			}
			Vs$1(e);
			const i = e.getType(), o = to$1(e);
			h.set(i, {
				exportDOM: f && f.export ? f.export.get(e) : void 0,
				klass: e,
				replace: n,
				replaceWithKlass: r,
				sharedNodeState: ct$4(a[t]),
				transforms: o
			});
		}
	}
	const g = new no(s, i, h, {
		disableEvents: o,
		namespace: l,
		theme: r
	}, u || console.error, function(t, e) {
		const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), i = (t) => {
			Object.keys(t).forEach((e) => {
				let r = n.get(e);
				void 0 === r && (r = [], n.set(e, r)), r.push(t[e]);
			});
		};
		return t.forEach((t) => {
			const e = t.klass.importDOM;
			if (null == e || r.has(e)) return;
			r.add(e);
			const n = e.call(t.klass);
			null !== n && i(n);
		}), e && i(e), n;
	}(h, f ? f.import : void 0), d, t);
	return void 0 !== c && (g._pendingEditorState = c, g._dirtyType = 2), function(t) {
		t.registerCommand(se$2, Sn$2, 0), t.registerCommand(le$4, vn$2, 0), t.registerCommand(ce$4, Tn$3, 0), t.registerCommand(ae$3, kn$3, 0), t.registerCommand(Se$2, bn$2, 0);
	}(g), g;
}
var no = class {
	static version;
	_headless;
	_parentEditor;
	_rootElement;
	_editorState;
	_pendingEditorState;
	_compositionKey;
	_deferred;
	_keyToDOMMap;
	_updates;
	_updating;
	_listeners;
	_commands;
	_nodes;
	_decorators;
	_pendingDecorators;
	_config;
	_dirtyType;
	_cloneNotNeeded;
	_dirtyLeaves;
	_dirtyElements;
	_normalizedNodes;
	_updateTags;
	_observer;
	_key;
	_onError;
	_htmlConversions;
	_window;
	_editable;
	_blockCursorElement;
	_createEditorArgs;
	constructor(t, e, n, r, i, o, s, l) {
		this._createEditorArgs = l, this._parentEditor = e, this._rootElement = null, this._editorState = t, this._pendingEditorState = null, this._compositionKey = null, this._deferred = [], this._keyToDOMMap = /* @__PURE__ */ new Map(), this._updates = [], this._updating = !1, this._listeners = {
			decorator: /* @__PURE__ */ new Set(),
			editable: /* @__PURE__ */ new Set(),
			mutation: /* @__PURE__ */ new Map(),
			root: /* @__PURE__ */ new Set(),
			textcontent: /* @__PURE__ */ new Set(),
			update: /* @__PURE__ */ new Set()
		}, this._commands = /* @__PURE__ */ new Map(), this._config = r, this._nodes = n, this._decorators = {}, this._pendingDecorators = null, this._dirtyType = 0, this._cloneNotNeeded = /* @__PURE__ */ new Set(), this._dirtyLeaves = /* @__PURE__ */ new Set(), this._dirtyElements = /* @__PURE__ */ new Map(), this._normalizedNodes = /* @__PURE__ */ new Set(), this._updateTags = /* @__PURE__ */ new Set(), this._observer = null, this._key = Jo$2(), this._onError = i, this._htmlConversions = o, this._editable = s, this._headless = null !== e && e._headless, this._window = null, this._blockCursorElement = null;
	}
	isComposing() {
		return null != this._compositionKey;
	}
	registerUpdateListener(t) {
		const e = this._listeners.update;
		return e.add(t), () => {
			e.delete(t);
		};
	}
	registerEditableListener(t) {
		const e = this._listeners.editable;
		return e.add(t), () => {
			e.delete(t);
		};
	}
	registerDecoratorListener(t) {
		const e = this._listeners.decorator;
		return e.add(t), () => {
			e.delete(t);
		};
	}
	registerTextContentListener(t) {
		const e = this._listeners.textcontent;
		return e.add(t), () => {
			e.delete(t);
		};
	}
	registerRootListener(t) {
		const e = this._listeners.root;
		return t(this._rootElement, null), e.add(t), () => {
			t(null, this._rootElement), e.delete(t);
		};
	}
	registerCommand(e, n, r) {
		void 0 === r && t$3(35);
		const i = this._commands;
		i.has(e) || i.set(e, [
			/* @__PURE__ */ new Set(),
			/* @__PURE__ */ new Set(),
			/* @__PURE__ */ new Set(),
			/* @__PURE__ */ new Set(),
			/* @__PURE__ */ new Set()
		]);
		const o = i.get(e);
		void 0 === o && t$3(36, String(e));
		const s = o[r];
		return s.add(n), () => {
			s.delete(n), o.every((t) => 0 === t.size) && i.delete(e);
		};
	}
	registerMutationListener(t, e, n) {
		const r = this.resolveRegisteredNodeAfterReplacements(this.getRegisteredNode(t)).klass, i = this._listeners.mutation;
		let o = i.get(e);
		void 0 === o && (o = /* @__PURE__ */ new Set(), i.set(e, o)), o.add(r);
		const s = n && n.skipInitialization;
		return void 0 !== s && s || this.initializeMutationListener(e, r), () => {
			o.delete(r), 0 === o.size && i.delete(e);
		};
	}
	getRegisteredNode(e) {
		const n = this._nodes.get(e.getType());
		return void 0 === n && t$3(37, e.name), n;
	}
	resolveRegisteredNodeAfterReplacements(t) {
		for (; t.replaceWithKlass;) t = this.getRegisteredNode(t.replaceWithKlass);
		return t;
	}
	initializeMutationListener(t, e) {
		const n = this._editorState, r = Rs$1(n).get(e.getType());
		if (!r) return;
		const i = /* @__PURE__ */ new Map();
		for (const t of r.keys()) i.set(t, "created");
		i.size > 0 && t(i, {
			dirtyLeaves: /* @__PURE__ */ new Set(),
			prevEditorState: n,
			updateTags: new Set(["registerMutationListener"])
		});
	}
	registerNodeTransformToKlass(t, e) {
		const n = this.getRegisteredNode(t);
		return n.transforms.add(e), n;
	}
	registerNodeTransform(t, e) {
		const n = this.registerNodeTransformToKlass(t, e), r = [n], i = n.replaceWithKlass;
		if (null != i) {
			const t = this.registerNodeTransformToKlass(i, e);
			r.push(t);
		}
		return function(t, e) {
			const n = Rs$1(t.getEditorState()), r = [];
			for (const t of e) {
				const e = n.get(t);
				e && r.push(e);
			}
			if (0 === r.length) return;
			t.update(() => {
				for (const t of r) for (const e of t.keys()) {
					const t = Mo$1(e);
					t && t.markDirty();
				}
			}, null === t._pendingEditorState ? { tag: Wn$1 } : void 0);
		}(this, r.map((t) => t.klass.getType())), () => {
			r.forEach((t) => t.transforms.delete(e));
		};
	}
	hasNode(t) {
		return this._nodes.has(t.getType());
	}
	hasNodes(t) {
		return t.every(this.hasNode.bind(this));
	}
	dispatchCommand(t, e) {
		return ls(this, t, e);
	}
	getDecorators() {
		return this._decorators;
	}
	getRootElement() {
		return this._rootElement;
	}
	getKey() {
		return this._key;
	}
	setRootElement(t) {
		const e = this._rootElement;
		if (t !== e) {
			const n = es$1(this._config.theme, "root"), r = this._pendingEditorState || this._editorState;
			if (this._rootElement = t, Zi$1(this, e, t, r), null !== e && (this._config.disableEvents || Dn$2(e), null != n && e.classList.remove(...n)), null !== t) {
				const e = _s$1(t), r = t.style;
				r.userSelect = "text", r.whiteSpace = "pre-wrap", r.wordBreak = "break-word", t.setAttribute("data-lexical-editor", "true"), this._window = e, this._dirtyType = 2, nt$6(this), this._updateTags.add(Wn$1), ki$1(this), this._config.disableEvents || function(t, e) {
					const n = t.ownerDocument;
					on$2.set(t, n);
					const r = sn$2.get(n) ?? 0;
					r < 1 && n.addEventListener("selectionchange", On$2), sn$2.set(n, r + 1), t.__lexicalEditor = e;
					const i = wn$3(t);
					for (let n = 0; n < Ze$3.length; n++) {
						const [r, o] = Ze$3[n], s = "function" == typeof o ? (t) => {
							An$2(t) || (Mn$1(t), (e.isEditable() || "click" === r) && o(t, e));
						} : (t) => {
							if (An$2(t)) return;
							Mn$1(t);
							const n = e.isEditable();
							switch (r) {
								case "cut": return n && ls(e, je$1, t);
								case "copy": return ls(e, Je$1, t);
								case "paste": return n && ls(e, ge$2, t);
								case "dragstart": return n && ls(e, Re$2, t);
								case "dragover": return n && ls(e, Be$3, t);
								case "dragend": return n && ls(e, We$2, t);
								case "focus": return n && ls(e, He$3, t);
								case "blur": return n && ls(e, Ge$1, t);
								case "drop": return n && ls(e, Ke$2, t);
							}
						};
						t.addEventListener(r, s), i.push(() => {
							t.removeEventListener(r, s);
						});
					}
				}(t, this), null != n && t.classList.add(...n);
			} else this._window = null, this._updateTags.add(Wn$1), ki$1(this);
			Ni$1("root", this, !1, t, e);
		}
	}
	getElementByKey(t) {
		return this._keyToDOMMap.get(t) || null;
	}
	getEditorState() {
		return this._editorState;
	}
	setEditorState(e, n) {
		e.isEmpty() && t$3(38);
		let r = e;
		r._readOnly && (r = zi$1(e), r._selection = e._selection ? e._selection.clone() : null), et$6(this);
		const i = this._pendingEditorState, o = this._updateTags, s = void 0 !== n ? n.tag : null;
		null === i || i.isEmpty() || (null != s && o.add(s), ki$1(this)), this._pendingEditorState = r, this._dirtyType = 2, this._dirtyElements.set("root", !1), this._compositionKey = null, null != s && o.add(s), this._updating || ki$1(this);
	}
	parseEditorState(t, e) {
		return function(t, e, n) {
			const r = Ri$1(), i = oi$1, o = li, s = si$1, l = e._dirtyElements, c = e._dirtyLeaves, a = e._cloneNotNeeded, u = e._dirtyType;
			e._dirtyElements = /* @__PURE__ */ new Map(), e._dirtyLeaves = /* @__PURE__ */ new Set(), e._cloneNotNeeded = /* @__PURE__ */ new Set(), e._dirtyType = 0, oi$1 = r, li = !1, si$1 = e, io(null);
			try {
				const i = e._nodes;
				vi(t.root, i), n && n(), r._readOnly = !0;
			} catch (t) {
				t instanceof Error && e._onError(t);
			} finally {
				e._dirtyElements = l, e._dirtyLeaves = c, e._cloneNotNeeded = a, e._dirtyType = u, oi$1 = i, li = o, si$1 = s;
			}
			return r;
		}("string" == typeof t ? JSON.parse(t) : t, this, e);
	}
	read(t) {
		return ki$1(this), this.getEditorState().read(t, { editor: this });
	}
	update(t, e) {
		(function(t, e, n) {
			t._updating ? t._updates.push([e, n]) : wi(t, e, n);
		})(this, t, e);
	}
	focus(t, e = {}) {
		const n = this._rootElement;
		null !== n && (n.setAttribute("autocapitalize", "off"), Ei$1(this, () => {
			const r = $r$2(), i = Io$1();
			null !== r ? r.dirty || zo$1(r.clone()) : 0 !== i.getChildrenSize() && ("rootStart" === e.defaultSelection ? i.selectStart() : i.selectEnd()), ds("focus"), hs$1(() => {
				n.removeAttribute("autocapitalize"), t && t();
			});
		}), null === this._pendingEditorState && n.removeAttribute("autocapitalize"));
	}
	blur() {
		const t = this._rootElement;
		null !== t && t.blur();
		const e = bs$1(this._window);
		null !== e && e.removeAllRanges();
	}
	isEditable() {
		return this._editable;
	}
	setEditable(t) {
		this._editable !== t && (this._editable = t, Ni$1("editable", this, !0, t));
	}
	toJSON() {
		return { editorState: this._editorState.toJSON() };
	}
};
no.version = "0.41.0+prod.esm";
var ro = null;
function io(t) {
	ro = t;
}
var oo$1 = 1;
function lo$1(e, n) {
	const r = co$1(e, n);
	return void 0 === r && t$3(30, n), r;
}
function co$1(t, e) {
	return t._nodes.get(e);
}
var ao$1 = "function" == typeof queueMicrotask ? queueMicrotask : (t) => {
	Promise.resolve().then(t);
};
function uo$1(t) {
	return Li$1(Do$1(t));
}
function fo$1(t) {
	const e = document.activeElement;
	if (!Ms$1(e)) return !1;
	const n = e.nodeName;
	return Li$1(Do$1(t)) && ("INPUT" === n || "TEXTAREA" === n || "true" === e.contentEditable && null == po$1(e));
}
function ho$1(t, e, n) {
	const r = t.getRootElement();
	try {
		return null !== r && r.contains(e) && r.contains(n) && null !== e && !fo$1(e) && _o$1(e) === t;
	} catch (t) {
		return !1;
	}
}
function go$1(t) {
	return t instanceof no;
}
function _o$1(t) {
	let e = t;
	for (; null != e;) {
		const t = po$1(e);
		if (go$1(t)) return t;
		e = as$1(e);
	}
	return null;
}
function po$1(t) {
	return t ? t.__lexicalEditor : null;
}
function mo$1(t) {
	return Sr$1(t) || t.isToken();
}
function xo$1(t) {
	return mo$1(t) || t.isSegmented();
}
function Co$1(t) {
	return As$1(t) && 3 === t.nodeType;
}
function So(t) {
	return As$1(t) && 9 === t.nodeType;
}
function vo$1(t) {
	let e = t;
	for (; null != e;) {
		if (Co$1(e)) return e;
		e = e.firstChild;
	}
	return null;
}
function To$1(t, e, n) {
	const r = z$5[e];
	if (null !== n && (t & r) === (n & r)) return t;
	let i = t ^ r;
	return "subscript" === e ? i &= ~z$5.superscript : "superscript" === e ? i &= ~z$5.subscript : "lowercase" === e ? (i &= ~z$5.uppercase, i &= ~z$5.capitalize) : "uppercase" === e ? (i &= ~z$5.lowercase, i &= ~z$5.capitalize) : "capitalize" === e && (i &= ~z$5.lowercase, i &= ~z$5.uppercase), i;
}
function ko$1(t) {
	return yr$1(t) || Zn$1(t) || Li$1(t);
}
function No$1(t, e) {
	const n = function() {
		const t = ro;
		return ro = null, t;
	}();
	if (null != (e = e || n && n.__key)) return void (t.__key = e);
	di(), hi$1();
	const r = _i(), i = gi(), o = "" + oo$1++;
	i._nodeMap.set(o, t), Pi$1(t) ? r._dirtyElements.set(o, !0) : r._dirtyLeaves.add(o), r._cloneNotNeeded.add(o), r._dirtyType = 1, t.__key = o;
}
function bo$1(t) {
	const e = t.getParent();
	if (null !== e) {
		const n = t.getWritable(), r = e.getWritable(), i = t.getPreviousSibling(), o = t.getNextSibling(), s = null !== o ? o.__key : null, l = null !== i ? i.__key : null, c = null !== i ? i.getWritable() : null, a = null !== o ? o.getWritable() : null;
		null === i && (r.__first = s), null === o && (r.__last = l), null !== c && (c.__next = s), null !== a && (a.__prev = l), n.__prev = null, n.__next = null, n.__parent = null, r.__size--;
	}
}
function wo$1(e) {
	hi$1(), Kn$3(e) && t$3(323, e.__key, e.__type);
	const n = e.getLatest(), r = n.__parent, i = gi(), o = _i(), s = i._nodeMap, l = o._dirtyElements;
	null !== r && function(t, e, n) {
		let r = t;
		for (; null !== r;) {
			if (n.has(r)) return;
			const t = e.get(r);
			if (void 0 === t) break;
			n.set(r, !1), r = t.__parent;
		}
	}(r, s, l);
	const c = n.__key;
	o._dirtyType = 1, Pi$1(e) ? l.set(c, !0) : o._dirtyLeaves.add(c);
}
function Eo$1(t) {
	di();
	const e = _i(), n = e._compositionKey;
	if (t !== n) {
		if (e._compositionKey = t, null !== n) {
			const t = Mo$1(n);
			null !== t && t.getWritable();
		}
		if (null !== t) {
			const e = Mo$1(t);
			null !== e && e.getWritable();
		}
	}
}
function Oo$1() {
	if (fi$1()) return null;
	return _i()._compositionKey;
}
function Mo$1(t, e) {
	const n = (e || gi())._nodeMap.get(t);
	return void 0 === n ? null : n;
}
function Ao(t, e) {
	const n = Po(t, _i());
	return void 0 !== n ? Mo$1(n, e) : null;
}
function Po(t, e) {
	return t[`__lexicalKey_${e._key}`];
}
function Do$1(t, e) {
	let n = t;
	for (; null != n;) {
		const t = Ao(n, e);
		if (null !== t) return t;
		n = as$1(n);
	}
	return null;
}
function Fo(t) {
	const e = t._decorators, n = Object.assign({}, e);
	return t._pendingDecorators = n, n;
}
function Lo(t) {
	return t.read(() => Io$1().getTextContent());
}
function Io$1() {
	return Ko$1(gi());
}
function Ko$1(t) {
	return t._nodeMap.get("root");
}
function zo$1(t) {
	di();
	const e = gi();
	null !== t && (t.dirty = !0, t.setCachedNodes(null)), e._selection = t;
}
function Ro(t) {
	const e = _i(), n = function(t, e) {
		let n = t;
		for (; null != n;) {
			const t = Po(n, e);
			if (void 0 !== t) return t;
			n = as$1(n);
		}
		return null;
	}(t, e);
	if (null === n) return t === e.getRootElement() ? Mo$1("root") : null;
	return Mo$1(n);
}
function Bo(t) {
	return /[\uD800-\uDBFF][\uDC00-\uDFFF]/g.test(t);
}
function Wo$1(t) {
	const e = [];
	let n = t;
	for (; null !== n;) e.push(n), n = n._parentEditor;
	return e;
}
function Jo$2() {
	return Math.random().toString(36).replace(/[^a-z]+/g, "").substring(0, 5);
}
function jo(t) {
	return Co$1(t) ? t.nodeValue : null;
}
function Uo(t, e, n) {
	const r = bs$1(ps$1(e));
	if (null === r) return;
	const i = r.anchorNode;
	let { anchorOffset: o, focusOffset: s } = r;
	if (null !== i) {
		let e = jo(i);
		const r = Do$1(i);
		if (null !== e && yr$1(r)) {
			if ((e === A$5 || e === D$4) && n) {
				const t = n.length;
				e = n, o = t, s = t;
			}
			null !== e && $o$1(r, e, o, s, t);
		}
	}
}
function $o$1(t, e, n, r, i) {
	let o = t;
	if (o.isAttached() && (i || !o.isDirty())) {
		const s = o.isComposing();
		let a = e;
		if ((s || i) && (e.endsWith(A$5) && (a = e.slice(0, -A$5.length)), i)) {
			const t = D$4;
			let e;
			for (; -1 !== (e = a.indexOf(t));) a = a.slice(0, e) + a.slice(e + t.length), null !== n && n > e && (n = Math.max(e, n - t.length)), null !== r && r > e && (r = Math.max(e, r - t.length));
		}
		const u = o.getTextContent();
		if (i || a !== u) {
			if ("" === a) {
				if (Eo$1(null), l$2 || c$2 || d$4) o.remove();
				else {
					const t = _i();
					setTimeout(() => {
						t.update(() => {
							o.isAttached() && o.remove();
						});
					}, 20);
				}
				return;
			}
			const e = o.getParent(), i = Vr$1(), u = o.getTextContentSize(), f = Oo$1(), h = o.getKey();
			if (o.isToken() || null !== f && h === f && !s || wr(i) && (null !== e && !e.canInsertTextBefore() && 0 === i.anchor.offset || i.anchor.key === t.__key && 0 === i.anchor.offset && !o.canInsertTextBefore() && !s || i.focus.key === t.__key && i.focus.offset === u && !o.canInsertTextAfter() && !s)) return void o.markDirty();
			const g = $r$2();
			if (!wr(g) || null === n || null === r) return void Vo$1(o, a, g);
			if (g.setTextNodeRange(o, n, o, r), o.isSegmented()) {
				const t = pr$2(o.getTextContent());
				o.replace(t), o = t;
			}
			Vo$1(o, a, g);
		}
	}
}
function Vo$1(t, e, n) {
	if (t.setTextContent(e), wr(n)) {
		const e = t.getKey();
		for (const r of ["anchor", "focus"]) {
			const i = n[r];
			"text" === i.type && i.key === e && (i.offset = dl$1(t, i.offset, "clamp"));
		}
	}
}
function Yo(t, e, n) {
	const r = e[n] || !1;
	return "any" === r || r === t[n];
}
function qo(t, e) {
	return Yo(t, e, "altKey") && Yo(t, e, "ctrlKey") && Yo(t, e, "shiftKey") && Yo(t, e, "metaKey");
}
function Ho(t, e, n) {
	if (!qo(t, n)) return !1;
	if (t.key.toLowerCase() === e.toLowerCase()) return !0;
	if (e.length > 1) return !1;
	if (1 === t.key.length && t.key.charCodeAt(0) <= 127) return !1;
	const r = "Key" + e.toUpperCase();
	return t.code === r;
}
var Go$1 = {
	ctrlKey: !i$4,
	metaKey: i$4
}, Xo$1 = {
	altKey: i$4,
	ctrlKey: !i$4
};
function Qo$1(t) {
	return "Backspace" === t.key;
}
function Zo$1(t) {
	return Ho(t, "a", Go$1);
}
function ts(t) {
	const e = Io$1();
	if (wr(t)) {
		const e = t.anchor, n = t.focus, r = e.getNode().getTopLevelElementOrThrow().getParentOrThrow();
		return e.set(r.getKey(), 0, "element"), n.set(r.getKey(), r.getChildrenSize(), "element"), Ct$4(t), t;
	}
	{
		const t = e.select(0, e.getChildrenSize());
		return zo$1(Ct$4(t)), t;
	}
}
function es$1(t, e) {
	void 0 === t.__lexicalClassNameCache && (t.__lexicalClassNameCache = {});
	const n = t.__lexicalClassNameCache, r = n[e];
	if (void 0 !== r) return r;
	const i = t[e];
	if ("string" == typeof i) {
		const t = Ql$1(i);
		return n[e] = t, t;
	}
	return i;
}
function ns(e, n, r, i, o) {
	if (0 === r.size) return;
	const s = i.__type, l = i.__key, c = n.get(s);
	void 0 === c && t$3(33, s);
	const a = c.klass;
	let u = e.get(a);
	void 0 === u && (u = /* @__PURE__ */ new Map(), e.set(a, u));
	const f = u.get(l), d = "destroyed" === f && "created" === o;
	(void 0 === f || d) && u.set(l, d ? "updated" : o);
}
function is(t, e, n) {
	const r = t.getParent();
	let i = n, o = t;
	return null !== r && (e && 0 === n ? (i = o.getIndexWithinParent(), o = r) : e || n !== o.getChildrenSize() || (i = o.getIndexWithinParent() + 1, o = r)), o.getChildAtIndex(e ? i - 1 : i);
}
function os$1(t, e) {
	const n = t.offset;
	if ("element" === t.type) return is(t.getNode(), e, n);
	{
		const r = t.getNode();
		if (e && 0 === n || !e && n === r.getTextContentSize()) {
			const t = e ? r.getPreviousSibling() : r.getNextSibling();
			return null === t ? is(r.getParentOrThrow(), e, r.getIndexWithinParent() + (e ? 0 : 1)) : t;
		}
	}
	return null;
}
function ss(t) {
	const e = ps$1(t).event, n = e && e.inputType;
	return "insertFromPaste" === n || "insertFromPasteAsQuotation" === n;
}
function ls(t, e, n) {
	return function(t, e, n) {
		const r = Wo$1(t);
		for (let i = 4; i >= 0; i--) for (let o = 0; o < r.length; o++) {
			const s = r[o], l = s._commands.get(e);
			if (void 0 !== l) {
				const e = l[i];
				if (void 0 !== e) {
					const r = Array.from(e), i = r.length;
					let o = !1;
					if (Ei$1(s, () => {
						for (let e = 0; e < i; e++) if (r[e](n, t)) return void (o = !0);
					}), o) return o;
				}
			}
		}
		return !1;
	}(t, e, n);
}
function cs(e, n) {
	const r = e._keyToDOMMap.get(n);
	return void 0 === r && t$3(75, n), r;
}
function as$1(t) {
	const e = t.assignedSlot || t.parentElement;
	return Ps(e) ? e.host : e;
}
function us(t) {
	return So(t) ? t : Ms$1(t) ? t.ownerDocument : null;
}
function ds(t) {
	di();
	_i()._updateTags.add(t);
}
function hs$1(t) {
	di();
	_i()._deferred.push(t);
}
function gs$1(t, e) {
	let n = t.getParent();
	for (; null !== n;) {
		if (n.is(e)) return !0;
		n = n.getParent();
	}
	return !1;
}
function _s$1(t) {
	const e = us(t);
	return e ? e.defaultView : null;
}
function ps$1(e) {
	const n = e._window;
	return null === n && t$3(78), n;
}
function ys$1(t) {
	return Pi$1(t) && t.isInline() || Li$1(t) && t.isInline();
}
function ms$1(t) {
	let e = t.getParentOrThrow();
	for (; null !== e;) {
		if (xs$1(e)) return e;
		e = e.getParentOrThrow();
	}
	return e;
}
function xs$1(t) {
	return Ki$1(t) || Pi$1(t) && t.isShadowRoot();
}
function Ss$1(e) {
	const n = _i(), r = e.getType(), i = co$1(n, r);
	void 0 === i && t$3(200, e.constructor.name, r);
	const { replace: o, replaceWithKlass: s } = i;
	if (null !== o) {
		const n = o(e), i = n.constructor;
		return null !== s ? n instanceof s || t$3(201, s.name, s.getType(), i.name, i.getType(), e.constructor.name, r) : n instanceof e.constructor && i !== e.constructor || t$3(202, i.name, i.getType(), e.constructor.name, r), n.__key === e.__key && t$3(203, e.constructor.name, r, i.name, i.getType()), n;
	}
	return e;
}
function vs$1(e, n) {
	!Ki$1(e.getParent()) || Pi$1(n) || Li$1(n) || t$3(99);
}
function Ts$1(e) {
	const n = Mo$1(e);
	return null === n && t$3(63, e), n;
}
function ks$1(t) {
	return (Li$1(t) || Pi$1(t) && !t.canBeEmpty()) && !t.isInline();
}
function Ns$1(t, e, n) {
	n.style.removeProperty("caret-color"), e._blockCursorElement = null;
	const r = t.parentElement;
	null !== r && r.removeChild(t);
}
function bs$1(t) {
	return n$3 ? (t || window).getSelection() : null;
}
function ws$1(t) {
	const e = _s$1(t);
	return e ? e.getSelection() : null;
}
function Os(t) {
	return Ms$1(t) && "A" === t.tagName;
}
function Ms$1(t) {
	return As$1(t) && 1 === t.nodeType;
}
function As$1(t) {
	return "object" == typeof t && null !== t && "nodeType" in t && "number" == typeof t.nodeType;
}
function Ps(t) {
	return As$1(t) && 11 === t.nodeType;
}
function Ds$1(t) {
	const e = /* @__PURE__ */ new RegExp(/^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|mark|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var|#text)$/, "i");
	return null !== t.nodeName.match(e);
}
function Fs$1(t) {
	const e = /* @__PURE__ */ new RegExp(/^(address|article|aside|blockquote|canvas|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|header|hr|li|main|nav|noscript|ol|p|pre|section|table|td|tfoot|ul|video)$/, "i");
	return null !== t.nodeName.match(e);
}
function Ls$1(t) {
	if (Li$1(t) && !t.isInline()) return !0;
	if (!Pi$1(t) || xs$1(t)) return !1;
	const e = t.getFirstChild(), n = null === e || Zn$1(e) || yr$1(e) || e.isInline();
	return !t.isInline() && !1 !== t.canBeEmpty() && n;
}
function Is$1() {
	return _i();
}
var Ks$1 = /* @__PURE__ */ new WeakMap(), zs$1 = /* @__PURE__ */ new Map();
function Rs$1(e) {
	if (!e._readOnly && e.isEmpty()) return zs$1;
	e._readOnly || t$3(192);
	let n = Ks$1.get(e);
	return n || (n = function(t) {
		const e = /* @__PURE__ */ new Map();
		for (const [n, r] of t._nodeMap) {
			const t = r.__type;
			let i = e.get(t);
			i || (i = /* @__PURE__ */ new Map(), e.set(t, i)), i.set(n, r);
		}
		return e;
	}(e), Ks$1.set(e, n)), n;
}
function Bs(t) {
	const e = t.constructor.clone(t);
	return e.afterCloneFrom(t), e;
}
function Ws$1(t) {
	return (e = Bs(t))[In] = !0, e;
	var e;
}
function Js$1(t, e) {
	const n = parseInt(t.style.paddingInlineStart, 10) || 0, r = Math.round(n / 40);
	e.setIndent(r);
}
function js$1(t) {
	t.__lexicalUnmanaged = !0;
}
function Us(t) {
	return !0 === t.__lexicalUnmanaged;
}
function $s(t, e) {
	return function(t, e) {
		return Object.prototype.hasOwnProperty.call(t, e);
	}(t, e) && t[e] !== zn$1[e];
}
function Vs$1(e) {
	const n = $$6 in e.prototype ? e.prototype[$$6]() : void 0, r = function(e) {
		if (!(e === zn$1 || e.prototype instanceof zn$1)) {
			let n = "<unknown>", r = "<unknown>";
			try {
				n = e.getType();
			} catch (t) {}
			try {
				no.version && (r = JSON.parse(no.version));
			} catch (t) {}
			t$3(290, e.name, n, r);
		}
		return e === Fi$1 || e === Ai || e === zn$1;
	}(e), i = !r && $s(e, "getType") ? e.getType() : void 0;
	let o, s = i;
	if (n) if (i) o = n[i];
	else for (const [t, e] of Object.entries(n)) s = t, o = e;
	if (!r && s && ($s(e, "getType") || (e.getType = () => s), $s(e, "clone") || (e.clone = (t) => (io(t), new e())), $s(e, "importJSON") || (e.importJSON = o && o.$importJSON || ((t) => new e().updateFromJSON(t))), !$s(e, "importDOM") && o)) {
		const { importDOM: t } = o;
		t && (e.importDOM = () => t);
	}
	return {
		ownNodeConfig: o,
		ownNodeType: s
	};
}
function Ys$1(t) {
	const e = Is$1();
	di();
	return new (e.resolveRegisteredNodeAfterReplacements(e.getRegisteredNode(t))).klass();
}
var qs = (t, e) => {
	let n = t;
	for (; null != n && !Ki$1(n);) {
		if (e(n)) return n;
		n = n.getParent();
	}
	return null;
}, Hs$1 = {
	next: "previous",
	previous: "next"
};
var Gs$1 = class {
	origin;
	constructor(t) {
		this.origin = t;
	}
	[Symbol.iterator]() {
		return Tl$1({
			hasNext: ol$1,
			initial: this.getAdjacentCaret(),
			map: (t) => t,
			step: (t) => t.getAdjacentCaret()
		});
	}
	getAdjacentCaret() {
		return ul$1(this.getNodeAtCaret(), this.direction);
	}
	getSiblingCaret() {
		return ul$1(this.origin, this.direction);
	}
	remove() {
		const t = this.getNodeAtCaret();
		return t && t.remove(), this;
	}
	replaceOrInsert(t, e) {
		const n = this.getNodeAtCaret();
		return t.is(this.origin) || t.is(n) || (null === n ? this.insert(t) : n.replace(t, e)), this;
	}
	splice(e, n, r = "next") {
		const i = r === this.direction ? n : Array.from(n).reverse();
		let o = this;
		const s = this.getParentAtCaret(), l = /* @__PURE__ */ new Map();
		for (let t = o.getAdjacentCaret(); null !== t && l.size < e; t = t.getAdjacentCaret()) {
			const e = t.origin.getWritable();
			l.set(e.getKey(), e);
		}
		for (const e of i) {
			if (l.size > 0) {
				const n = o.getNodeAtCaret();
				if (n) if (l.delete(n.getKey()), l.delete(e.getKey()), n.is(e) || o.origin.is(e));
				else {
					const t = e.getParent();
					t && t.is(s) && e.remove(), n.replace(e);
				}
				else null === n && t$3(263, Array.from(l).join(" "));
			} else o.insert(e);
			o = ul$1(e, this.direction);
		}
		for (const t of l.values()) t.remove();
		return this;
	}
};
var Xs$1 = class Xs$1 extends Gs$1 {
	type = "child";
	getLatest() {
		const t = this.origin.getLatest();
		return t === this.origin ? this : gl$1(t, this.direction);
	}
	getParentCaret(t = "root") {
		return ul$1(tl$1(this.getParentAtCaret(), t), this.direction);
	}
	getFlipped() {
		const t = Zs$1(this.direction);
		return ul$1(this.getNodeAtCaret(), t) || gl$1(this.origin, t);
	}
	getParentAtCaret() {
		return this.origin;
	}
	getChildCaret() {
		return this;
	}
	isSameNodeCaret(t) {
		return t instanceof Xs$1 && this.direction === t.direction && this.origin.is(t.origin);
	}
	isSamePointCaret(t) {
		return this.isSameNodeCaret(t);
	}
};
var Qs$1 = {
	root: Ki$1,
	shadowRoot: xs$1
};
function Zs$1(t) {
	return Hs$1[t];
}
function tl$1(t, e = "root") {
	return Qs$1[e](t) ? null : t;
}
var el$1 = class el$1 extends Gs$1 {
	type = "sibling";
	getLatest() {
		const t = this.origin.getLatest();
		return t === this.origin ? this : ul$1(t, this.direction);
	}
	getSiblingCaret() {
		return this;
	}
	getParentAtCaret() {
		return this.origin.getParent();
	}
	getChildCaret() {
		return Pi$1(this.origin) ? gl$1(this.origin, this.direction) : null;
	}
	getParentCaret(t = "root") {
		return ul$1(tl$1(this.getParentAtCaret(), t), this.direction);
	}
	getFlipped() {
		const t = Zs$1(this.direction);
		return ul$1(this.getNodeAtCaret(), t) || gl$1(this.origin.getParentOrThrow(), t);
	}
	isSamePointCaret(t) {
		return t instanceof el$1 && this.direction === t.direction && this.origin.is(t.origin);
	}
	isSameNodeCaret(t) {
		return (t instanceof el$1 || t instanceof nl$1) && this.direction === t.direction && this.origin.is(t.origin);
	}
};
var nl$1 = class nl$1 extends Gs$1 {
	type = "text";
	offset;
	constructor(t, e) {
		super(t), this.offset = e;
	}
	getLatest() {
		const t = this.origin.getLatest();
		return t === this.origin ? this : fl$1(t, this.direction, this.offset);
	}
	getParentAtCaret() {
		return this.origin.getParent();
	}
	getChildCaret() {
		return null;
	}
	getParentCaret(t = "root") {
		return ul$1(tl$1(this.getParentAtCaret(), t), this.direction);
	}
	getFlipped() {
		return fl$1(this.origin, Zs$1(this.direction), this.offset);
	}
	isSamePointCaret(t) {
		return t instanceof nl$1 && this.direction === t.direction && this.origin.is(t.origin) && this.offset === t.offset;
	}
	isSameNodeCaret(t) {
		return (t instanceof el$1 || t instanceof nl$1) && this.direction === t.direction && this.origin.is(t.origin);
	}
	getSiblingCaret() {
		return ul$1(this.origin, this.direction);
	}
};
function rl$1(t) {
	return t instanceof nl$1;
}
function ol$1(t) {
	return t instanceof el$1;
}
function sl$1(t) {
	return t instanceof Xs$1;
}
var ll$1 = {
	next: class extends nl$1 {
		direction = "next";
		getNodeAtCaret() {
			return this.origin.getNextSibling();
		}
		insert(t) {
			return this.origin.insertAfter(t), this;
		}
	},
	previous: class extends nl$1 {
		direction = "previous";
		getNodeAtCaret() {
			return this.origin.getPreviousSibling();
		}
		insert(t) {
			return this.origin.insertBefore(t), this;
		}
	}
}, cl$1 = {
	next: class extends el$1 {
		direction = "next";
		getNodeAtCaret() {
			return this.origin.getNextSibling();
		}
		insert(t) {
			return this.origin.insertAfter(t), this;
		}
	},
	previous: class extends el$1 {
		direction = "previous";
		getNodeAtCaret() {
			return this.origin.getPreviousSibling();
		}
		insert(t) {
			return this.origin.insertBefore(t), this;
		}
	}
}, al$1 = {
	next: class extends Xs$1 {
		direction = "next";
		getNodeAtCaret() {
			return this.origin.getFirstChild();
		}
		insert(t) {
			return this.origin.splice(0, 0, [t]), this;
		}
	},
	previous: class extends Xs$1 {
		direction = "previous";
		getNodeAtCaret() {
			return this.origin.getLastChild();
		}
		insert(t) {
			return this.origin.splice(this.origin.getChildrenSize(), 0, [t]), this;
		}
	}
};
function ul$1(t, e) {
	return t ? new cl$1[e](t) : null;
}
function fl$1(t, e, n) {
	return t ? new ll$1[e](t, dl$1(t, n)) : null;
}
function dl$1(t, n, r = "error") {
	const i = t.getTextContentSize();
	let o = "next" === n ? i : "previous" === n ? 0 : n;
	return (o < 0 || o > i) && ("clamp" !== r && e$1(284, String(n), String(i), t.getKey()), o = o < 0 ? 0 : i), o;
}
function hl$1(t, e) {
	return new ml$1(t, e);
}
function gl$1(t, e) {
	return Pi$1(t) ? new al$1[e](t) : null;
}
function _l$1(t) {
	return t && t.getChildCaret() || t;
}
function pl$1(t) {
	return t && _l$1(t.getAdjacentCaret());
}
var yl$1 = class yl$1 {
	type = "node-caret-range";
	direction;
	anchor;
	focus;
	constructor(t, e, n) {
		this.anchor = t, this.focus = e, this.direction = n;
	}
	getLatest() {
		const t = this.anchor.getLatest(), e = this.focus.getLatest();
		return t === this.anchor && e === this.focus ? this : new yl$1(t, e, this.direction);
	}
	isCollapsed() {
		return this.anchor.isSamePointCaret(this.focus);
	}
	getTextSlices() {
		const t = (t) => {
			const e = this[t].getLatest();
			return rl$1(e) ? function(t, e) {
				const { direction: n, origin: r } = t;
				return hl$1(t, dl$1(r, "focus" === e ? Zs$1(n) : n) - t.offset);
			}(e, t) : null;
		}, e = t("anchor"), n = t("focus");
		if (e && n) {
			const { caret: t } = e, { caret: r } = n;
			if (t.isSameNodeCaret(r)) return [hl$1(t, r.offset - t.offset), null];
		}
		return [e, n];
	}
	iterNodeCarets(t = "root") {
		const e = rl$1(this.anchor) ? this.anchor.getSiblingCaret() : this.anchor.getLatest(), n = this.focus.getLatest(), r = rl$1(n), i = (e) => e.isSameNodeCaret(n) ? null : pl$1(e) || e.getParentCaret(t);
		return Tl$1({
			hasNext: (t) => null !== t && !(r && n.isSameNodeCaret(t)),
			initial: e.isSameNodeCaret(n) ? null : i(e),
			map: (t) => t,
			step: i
		});
	}
	[Symbol.iterator]() {
		return this.iterNodeCarets("root");
	}
};
var ml$1 = class {
	type = "slice";
	caret;
	distance;
	constructor(t, e) {
		this.caret = t, this.distance = e;
	}
	getSliceIndices() {
		const { distance: t, caret: { offset: e } } = this, n = e + t;
		return n < e ? [n, e] : [e, n];
	}
	getTextContent() {
		const [t, e] = this.getSliceIndices();
		return this.caret.origin.getTextContent().slice(t, e);
	}
	getTextContentSize() {
		return Math.abs(this.distance);
	}
	removeTextSlice() {
		const { caret: { origin: t, direction: e } } = this, [n, r] = this.getSliceIndices(), i = t.getTextContent();
		return fl$1(t.setTextContent(i.slice(0, n) + i.slice(r)), e, n);
	}
};
function Cl$1(t) {
	return vl$1(t, ul$1(Io$1(), t.direction));
}
function Sl$1(t) {
	return vl$1(t, t);
}
function vl$1(e, n) {
	return e.direction !== n.direction && t$3(265), new yl$1(e, n, e.direction);
}
function Tl$1(t) {
	const { initial: e, hasNext: n, step: r, map: i } = t;
	let o = e;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			if (!n(o)) return {
				done: !0,
				value: void 0
			};
			const t = {
				done: !1,
				value: i(o)
			};
			return o = r(o), t;
		}
	};
}
function kl$1(e, n) {
	const r = El$1(e.origin, n.origin);
	switch (null === r && t$3(275, e.origin.getKey(), n.origin.getKey()), r.type) {
		case "same": {
			const t = "text" === e.type, r = "text" === n.type;
			return t && r ? function(t, e) {
				return Math.sign(t - e);
			}(e.offset, n.offset) : e.type === n.type ? 0 : t ? -1 : r ? 1 : "child" === e.type ? -1 : 1;
		}
		case "ancestor": return "child" === e.type ? -1 : 1;
		case "descendant": return "child" === n.type ? 1 : -1;
		case "branch": return Nl$1(r);
	}
}
function Nl$1(t) {
	const { a: e, b: n } = t, r = e.__key, i = n.__key;
	let o = e, s = n;
	for (; o && s; o = o.getNextSibling(), s = s.getNextSibling()) {
		if (o.__key === i) return -1;
		if (s.__key === r) return 1;
	}
	return null === o ? 1 : -1;
}
function bl$1(t, e) {
	return e.is(t);
}
function wl$1(t) {
	return Pi$1(t) ? [t.getLatest(), null] : [t.getParent(), t.getLatest()];
}
function El$1(e, n) {
	if (e.is(n)) return {
		commonAncestor: e,
		type: "same"
	};
	const r = /* @__PURE__ */ new Map();
	for (let [t, n] = wl$1(e); t; n = t, t = t.getParent()) r.set(t, n);
	for (let [i, o] = wl$1(n); i; o = i, i = i.getParent()) {
		const s = r.get(i);
		if (void 0 !== s) return null === s ? (bl$1(e, i) || t$3(276), {
			commonAncestor: i,
			type: "ancestor"
		}) : null === o ? (bl$1(n, i) || t$3(277), {
			commonAncestor: i,
			type: "descendant"
		}) : ((Pi$1(s) || bl$1(e, s)) && (Pi$1(o) || bl$1(n, o)) && i.is(s.getParent()) && i.is(o.getParent()) || t$3(278), {
			a: s,
			b: o,
			commonAncestor: i,
			type: "branch"
		});
	}
	return null;
}
function Ol$1(e, n) {
	const { type: r, key: i, offset: o } = e, s = Ts$1(e.key);
	return "text" === r ? (yr$1(s) || t$3(266, s.getType(), i), fl$1(s, n, o)) : (Pi$1(s) || t$3(267, s.getType(), i), Jl(s, e.offset, n));
}
function Ml$1(e, n) {
	const { origin: r, direction: i } = n, o = "next" === i;
	rl$1(n) ? e.set(r.getKey(), n.offset, "text") : ol$1(n) ? yr$1(r) ? e.set(r.getKey(), dl$1(r, i), "text") : e.set(r.getParentOrThrow().getKey(), r.getIndexWithinParent() + (o ? 1 : 0), "element") : (sl$1(n) && Pi$1(r) || t$3(268), e.set(r.getKey(), o ? 0 : r.getChildrenSize(), "element"));
}
function Al$1(t) {
	const e = $r$2(), n = wr(e) ? e : Wr();
	return Pl$1(n, t), zo$1(n), n;
}
function Pl$1(t, e) {
	Ml$1(t.anchor, e.anchor), Ml$1(t.focus, e.focus);
}
function Dl$1(t) {
	const { anchor: e, focus: n } = t, r = Ol$1(e, "next"), i = Ol$1(n, "next"), o = kl$1(r, i) <= 0 ? "next" : "previous";
	return vl$1(Bl$1(r, o), Bl$1(i, o));
}
function Fl$1(t) {
	const { direction: e, origin: n } = t, r = ul$1(n, Zs$1(e)).getNodeAtCaret();
	return r ? ul$1(r, e) : gl$1(n.getParentOrThrow(), e);
}
function Ll$1(t, e = "root") {
	const n = [t];
	for (let r = sl$1(t) ? t.getParentCaret(e) : t.getSiblingCaret(); null !== r; r = r.getParentCaret(e)) n.push(Fl$1(r));
	return n;
}
function Il$1(t) {
	return !!t && t.origin.isAttached();
}
function Kl$1(e, n = "removeEmptySlices") {
	if (e.isCollapsed()) return e;
	const r = "root", i = "next";
	let o = n;
	const s = Wl$1(e, i), l = Ll$1(s.anchor, r), c = Ll$1(s.focus.getFlipped(), r), a = /* @__PURE__ */ new Set(), u = [];
	for (const t of s.iterNodeCarets(r)) if (sl$1(t)) a.add(t.origin.getKey());
	else if (ol$1(t)) {
		const { origin: e } = t;
		Pi$1(e) && !a.has(e.getKey()) || u.push(e);
	}
	for (const t of u) t.remove();
	for (const t of s.getTextSlices()) {
		if (!t) continue;
		const { origin: e } = t.caret, n = e.getTextContentSize(), r = Fl$1(ul$1(e, i)), s = e.getMode();
		if (Math.abs(t.distance) === n && "removeEmptySlices" === o || "token" === s && 0 !== t.distance) r.remove();
		else if (0 !== t.distance) {
			o = "removeEmptySlices";
			let e = t.removeTextSlice();
			const n = t.caret.origin;
			if ("segmented" === s) {
				const t = e.origin, n = pr$2(t.getTextContent()).setStyle(t.getStyle()).setFormat(t.getFormat());
				r.replaceOrInsert(n), e = fl$1(n, i, e.offset);
			}
			n.is(l[0].origin) && (l[0] = e), n.is(c[0].origin) && (c[0] = e.getFlipped());
		}
	}
	let f, d;
	for (const t of l) if (Il$1(t)) {
		f = zl(t);
		break;
	}
	for (const t of c) if (Il$1(t)) {
		d = zl(t);
		break;
	}
	const h = function(t, e, n) {
		if (!t || !e) return null;
		const r = t.getParentAtCaret(), i = e.getParentAtCaret();
		if (!r || !i) return null;
		const o = r.getParents().reverse();
		o.push(r);
		const s = i.getParents().reverse();
		s.push(i);
		const l = Math.min(o.length, s.length);
		let c;
		for (c = 0; c < l && o[c] === s[c]; c++);
		const a = (t, e) => {
			let n;
			for (let r = c; r < t.length; r++) {
				const i = t[r];
				if (xs$1(i)) return;
				!n && e(i) && (n = i);
			}
			return n;
		}, u = a(o, Ls$1), f = u && a(s, (t) => n.has(t.getKey()) && Ls$1(t));
		return u && f ? [u, f] : null;
	}(f, d, a);
	if (h) {
		const [t, e] = h;
		gl$1(t, "previous").splice(0, e.getChildren());
		let n = e.getParent();
		for (e.remove(!0); n && n.isEmpty();) {
			const t = n;
			n = n.getParent(), t.remove(!0);
		}
	}
	const g = [
		f,
		d,
		...l,
		...c
	].find(Il$1);
	if (g) return Sl$1(Bl$1(zl(g), e.direction));
	t$3(269, JSON.stringify(l.map((t) => t.origin.__key)));
}
function zl(t) {
	const e = function(t) {
		let e = t;
		for (; sl$1(e);) {
			const t = pl$1(e);
			if (!sl$1(t)) break;
			e = t;
		}
		return e;
	}(t.getLatest()), { direction: n } = e;
	if (yr$1(e.origin)) return rl$1(e) ? e : fl$1(e.origin, n, n);
	const r = e.getAdjacentCaret();
	return ol$1(r) && yr$1(r.origin) ? fl$1(r.origin, n, Zs$1(n)) : e;
}
function Rl$1(t) {
	return rl$1(t) && t.offset !== dl$1(t.origin, t.direction);
}
function Bl$1(t, e) {
	return t.direction === e ? t : t.getFlipped();
}
function Wl$1(t, e) {
	return t.direction === e ? t : vl$1(Bl$1(t.focus, e), Bl$1(t.anchor, e));
}
function Jl(t, e, n) {
	let r = gl$1(t, "next");
	for (let t = 0; t < e; t++) {
		const t = r.getAdjacentCaret();
		if (null === t) break;
		r = t;
	}
	return Bl$1(r, n);
}
function Yl$1(t) {
	return t;
}
function ql$1(...t) {
	return t;
}
function Gl$1(t) {
	return t;
}
function Xl$1(t, e) {
	if (!e || t === e) return t;
	for (const n in e) if (t[n] !== e[n]) return {
		...t,
		...e
	};
	return t;
}
function Ql$1(...t) {
	const e = [];
	for (const n of t) if (n && "string" == typeof n) for (const [t] of n.matchAll(/\S+/g)) e.push(t);
	return e;
}
function Zl$1(t, ...e) {
	const n = Ql$1(...e);
	n.length > 0 && t.classList.add(...n);
}
function tc(t, ...e) {
	const n = Ql$1(...e);
	n.length > 0 && t.classList.remove(...n);
}
function ec(...t) {
	return () => {
		for (let e = t.length - 1; e >= 0; e--) t[e]();
		t.length = 0;
	};
}
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-INBEEENE.js
var F$7 = (t, i) => {
	let e = (0, import_compiler_runtime.c)(24), [s] = o$4(), [c, B] = (0, import_react.useState)(null), [n, D] = (0, import_react.useState)(!1), { closeModal: u, modalState: l, toggleModal: O } = se$3(), r;
	e[0] !== s ? (r = () => {
		s.read(() => {
			B($r$2() ?? Vr$1());
		});
	}, e[0] = s, e[1] = r) : r = e[1];
	let w = r, a;
	e[2] !== s || e[3] !== c ? (a = () => {
		c && s.update(() => {
			zo$1(c.clone());
		}, {
			discrete: !0,
			skipTransforms: !0
		});
	}, e[2] = s, e[3] = c, e[4] = a) : a = e[4];
	let o = a, f;
	e[5] !== u || e[6] !== t ? (f = () => {
		u(t);
	}, e[5] = u, e[6] = t, e[7] = f) : f = e[7];
	let x = f, $ = l?.[t]?.isOpen, m;
	e[8] !== $ || e[9] !== o || e[10] !== t || e[11] !== w || e[12] !== O ? (m = () => {
		$ ? o() : w(), D(!0), O(t);
	}, e[8] = $, e[9] = o, e[10] = t, e[11] = w, e[12] = O, e[13] = m) : m = e[13];
	let C = m, p, d;
	e[14] !== l || e[15] !== i || e[16] !== o || e[17] !== t || e[18] !== n ? (p = () => {
		if (!n) return;
		let M = l[t];
		M && !M?.isOpen && (D(!1), i ? setTimeout(() => {
			o();
		}, 0) : o());
	}, d = [
		l,
		t,
		o,
		n,
		i
	], e[14] = l, e[15] = i, e[16] = o, e[17] = t, e[18] = n, e[19] = p, e[20] = d) : (p = e[19], d = e[20]), (0, import_react.useEffect)(p, d);
	let S;
	return e[21] !== x || e[22] !== C ? (S = {
		closeDrawer: x,
		toggleDrawer: C
	}, e[21] = x, e[22] = C, e[23] = S) : S = e[23], S;
};
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-BZZVLW4U.js
var import_jsx_runtime = require_jsx_runtime();
function B$7() {
	return Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);
}
var w$3 = (0, import_react.createContext)({
	editorConfig: null,
	fieldProps: null,
	uuid: null
}), H$8 = ({ children: o, editorConfig: c, editorContainerRef: d, fieldProps: a, parentContext: n }) => {
	let [f] = o$4(), [l] = (0, import_react.useState)(() => B$7()), r = (0, import_react.useRef)(/* @__PURE__ */ new Map()), [m, C] = (0, import_react.useState)(null), u = (0, import_react.useRef)(/* @__PURE__ */ new Set()), [E, p] = (0, import_react.useState)(), h = at$6();
	return (0, import_jsx_runtime.jsx)(w$3, {
		value: (0, import_react.useMemo)(() => ({
			blurEditor: (t) => {
				u.current.clear();
			},
			childrenEditors: r,
			createdInlineBlock: E,
			editDepth: h,
			editor: f,
			editorConfig: c,
			editorContainerRef: d,
			fieldProps: a,
			focusedEditor: m,
			focusEditor: (t) => {
				let e = t.uuid;
				u.current.has(e) || (u.current.add(e), C(t), n?.uuid && n.focusEditor(t), r.current.forEach((i) => {
					i.focusEditor(t);
				}), u.current.clear());
			},
			parentEditor: n,
			registerChild: (t, e) => {
				if (!r.current.has(t)) {
					let i = new Map(r.current);
					i.set(t, e), r.current = i;
				}
			},
			setCreatedInlineBlock: p,
			unregisterChild: (t) => {
				if (r.current.has(t)) {
					let e = new Map(r.current);
					e.delete(t), r.current = e;
				}
			},
			uuid: l
		}), [
			E,
			p,
			f,
			r,
			c,
			d,
			h,
			a,
			m,
			n,
			l
		]),
		children: o
	});
}, I$4 = () => {
	let o = (0, import_react.use)(w$3);
	if (o === void 0) throw new Error("useEditorConfigContext must be used within an EditorConfigProvider");
	return o;
};
//#endregion
//#region node_modules/@lexical/react/useLexicalEditable.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var c$1 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement ? import_react.useLayoutEffect : import_react.useEffect;
function u$1(e) {
	return {
		initialValueFn: () => e.isEditable(),
		subscribe: (n) => e.registerEditableListener(n)
	};
}
function a$1() {
	return function(n) {
		const [t] = o$4(), u = (0, import_react.useMemo)(() => n(t), [t, n]), [a, l] = (0, import_react.useState)(() => u.initialValueFn()), d = (0, import_react.useRef)(a);
		return c$1(() => {
			const { initialValueFn: e, subscribe: n } = u, t = e();
			return d.current !== t && (d.current = t, l(t)), n((e) => {
				d.current = e, l(e);
			});
		}, [u, n]), a;
	}(u$1);
}
//#endregion
//#region node_modules/@lexical/selection/LexicalSelection.prod.mjs
var import_objectid = /* @__PURE__ */ __toESM(require_objectid(), 1);
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function K$4(e, ...t) {
	const n = new URL("https://lexical.dev/docs/error"), o = new URLSearchParams();
	o.append("code", e);
	for (const e of t) o.append("v", e);
	throw n.search = o.toString(), Error(`Minified Lexical error #${e}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
var E$4 = /* @__PURE__ */ new Map();
function F$6(e) {
	const t = {};
	if (!e) return t;
	const n = e.split(";");
	for (const e of n) if ("" !== e) {
		const [n, o] = e.split(/:([^]+)/);
		n && o && (t[n.trim()] = o.trim());
	}
	return t;
}
function b$3(e) {
	let t = E$4.get(e);
	return void 0 === t && (t = F$6(e), E$4.set(e, t)), t;
}
function R$2(e) {
	let t = "";
	for (const n in e) n && (t += `${n}: ${e[n]};`);
	return t;
}
function z$4(e) {
	const n = Is$1().getElementByKey(e.getKey());
	if (null === n) return null;
	const o = n.ownerDocument.defaultView;
	return null === o ? null : o.getComputedStyle(n);
}
function O$4(e) {
	return z$4(Ki$1(e) ? e : e.getParentOrThrow());
}
function A$4(e) {
	const t = O$4(e);
	return null !== t && "rtl" === t.direction;
}
function M$4(e, t, n = "self") {
	const o = e.getStartEndPoints();
	if (t.isSelected(e) && !xo$1(t) && null !== o) {
		const [l, r] = o, s = e.isBackward(), i = l.getNode(), c = r.getNode(), f = t.is(i), u = t.is(c);
		if (f || u) {
			const [o, l] = Ar$1(e), r = i.is(c), f = t.is(s ? c : i), u = t.is(s ? i : c);
			let d, p = 0;
			if (r) p = o > l ? l : o, d = o > l ? o : l;
			else if (f) p = s ? l : o, d = void 0;
			else if (u) p = 0, d = s ? o : l;
			const h = t.__text.slice(p, d);
			h !== t.__text && ("clone" === n && (t = Ws$1(t)), t.__text = h);
		}
	}
	return t;
}
function _$4(e) {
	if ("text" === e.type) return e.offset === e.getNode().getTextContentSize();
	const t = e.getNode();
	return Pi$1(t) || K$4(177), e.offset === t.getChildrenSize();
}
function $$5(e) {
	const t = e.getStyle(), n = F$6(t);
	E$4.set(t, n);
}
function D$3(t, n) {
	(wr(t) ? t.isCollapsed() : yr$1(t) || Pi$1(t)) || K$4(280);
	const l = b$3(wr(t) ? t.style : yr$1(t) ? t.getStyle() : t.getTextStyle()), r = Object.entries(n).reduce((e, [n, o]) => ("function" == typeof o ? e[n] = o(l[n], t) : null === o ? delete e[n] : e[n] = o, e), { ...l }), s = R$2(r);
	wr(t) || yr$1(t) ? t.setStyle(s) : t.setTextStyle(s), E$4.set(s, r);
}
function U$2(e, t) {
	if (wr(e) && e.isCollapsed()) {
		D$3(e, t);
		const n = e.anchor.getNode();
		Pi$1(n) && n.isEmpty() && D$3(n, t);
	}
	j$6((e) => {
		D$3(e, t);
	});
	const n = e.getNodes();
	if (n.length > 0) {
		const e = /* @__PURE__ */ new Set();
		for (const l of n) {
			if (!Pi$1(l) || !l.canBeEmpty() || 0 !== l.getChildrenSize()) continue;
			const n = l.getKey();
			e.has(n) || (e.add(n), D$3(l, t));
		}
	}
}
function j$6(t) {
	const n = $r$2();
	if (!n) return;
	const o = /* @__PURE__ */ new Map(), l = (e) => o.get(e.getKey()) || [0, e.getTextContentSize()];
	if (wr(n)) for (const e of Dl$1(n).getTextSlices()) e && o.set(e.caret.origin.getKey(), e.getSliceIndices());
	const r = n.getNodes();
	for (const n of r) {
		if (!yr$1(n) || !n.canHaveFormat()) continue;
		const [o, r] = l(n);
		if (r !== o) if (xo$1(n) || 0 === o && r === n.getTextContentSize()) t(n);
		else t(n.splitText(o, r)[0 === o ? 0 : 1]);
	}
	wr(n) && "text" === n.anchor.type && "text" === n.focus.type && n.anchor.key === n.focus.key && H$7(n);
}
function H$7(e) {
	if (e.isBackward()) {
		const { anchor: t, focus: n } = e, { key: o, offset: l, type: r } = t;
		t.set(n.key, n.offset, n.type), n.set(o, l, r);
	}
}
function V$3(e, t) {
	const n = e.getFormatType(), o = e.getIndent();
	n !== t.getFormatType() && t.setFormat(n), o !== t.getIndent() && t.setIndent(o);
}
function W$1(e, t, n = V$3) {
	if (null === e) return;
	const l = e.getStartEndPoints(), r = /* @__PURE__ */ new Map();
	let s = null;
	if (l) {
		const [e, t] = l;
		s = Wr(), s.anchor.set(e.key, e.offset, e.type), s.focus.set(t.key, t.offset, t.type);
		const n = qs(e.getNode(), Ls$1), i = qs(t.getNode(), Ls$1);
		Pi$1(n) && r.set(n.getKey(), n), Pi$1(i) && r.set(i.getKey(), i);
	}
	for (const t of e.getNodes()) if (Pi$1(t) && Ls$1(t)) r.set(t.getKey(), t);
	else if (null === l) {
		const e = qs(t, Ls$1);
		Pi$1(e) && r.set(e.getKey(), e);
	}
	for (const [e, o] of r) {
		const l = t();
		n(o, l), o.replace(l, !0), s && (e === s.anchor.key && s.anchor.set(l.getKey(), s.anchor.offset, s.anchor.type), e === s.focus.key && s.focus.set(l.getKey(), s.focus.offset, s.focus.type));
	}
	s && e.is($r$2()) && zo$1(s);
}
function Q$5(e) {
	const t = Y$4(e);
	return null !== t && "vertical-rl" === t.writingMode;
}
function Y$4(e) {
	const t = e.anchor.getNode();
	return Pi$1(t) ? z$4(t) : O$4(t);
}
function Z$4(e, t) {
	let n = Q$5(e) ? !t : t;
	te$3(e) && (n = !n);
	const l = Ol$1(e.focus, n ? "previous" : "next");
	if (Rl$1(l)) return !1;
	for (const e of Cl$1(l)) {
		if (sl$1(e)) return !e.origin.isInline();
		if (!Pi$1(e.origin)) {
			if (Li$1(e.origin)) return !0;
			break;
		}
	}
	return !1;
}
function ee$4(e, t, n, o) {
	e.modify(t ? "extend" : "move", n, o);
}
function te$3(e) {
	const t = Y$4(e);
	return null !== t && "rtl" === t.direction;
}
function ne$3(e, t, n) {
	const o = te$3(e);
	let l;
	l = Q$5(e) || o ? !n : n, ee$4(e, t, l, "character");
}
function oe$4(e, t, n) {
	const o = b$3(e.getStyle());
	return null !== o && o[t] || n;
}
function le$3(t, n, o = "") {
	let l = null;
	const r = t.getNodes(), s = t.anchor, c = t.focus, f = t.isBackward(), u = f ? c.offset : s.offset, g = f ? c.getNode() : s.getNode();
	if (wr(t) && t.isCollapsed() && "" !== t.style) {
		const e = b$3(t.style);
		if (null !== e && n in e) return e[n];
	}
	for (let t = 0; t < r.length; t++) {
		const s = r[t];
		if ((0 === t || 0 !== u || !s.is(g)) && yr$1(s)) {
			const e = oe$4(s, n, o);
			if (null === l) l = e;
			else if (l !== e) {
				l = "";
				break;
			}
		}
	}
	return null === l ? o : l;
}
//#endregion
//#region node_modules/@lexical/utils/LexicalUtils.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function T$3(t, ...e) {
	const n = new URL("https://lexical.dev/docs/error"), o = new URLSearchParams();
	o.append("code", t);
	for (const t of e) o.append("v", t);
	throw n.search = o.toString(), Error(`Minified Lexical error #${t}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
var B$6 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement, _$3 = B$6 && "documentMode" in document ? document.documentMode : null;
B$6 && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
B$6 && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
!(!B$6 || !("InputEvent" in window) || _$3) && "getTargetRanges" in new window.InputEvent("input");
B$6 && /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
B$6 && /iPad|iPhone|iPod/.test(navigator.userAgent) && window.MSStream;
B$6 && /Android/.test(navigator.userAgent);
B$6 && /^(?=.*Chrome).*/i.test(navigator.userAgent);
B$6 && /AppleWebKit\/[\d.]+/.test(navigator.userAgent);
function vt$5(t, e) {
	let n = t;
	for (; null != n;) {
		if (n instanceof e) return n;
		n = n.getParent();
	}
	return null;
}
function yt$4(t) {
	const e = qs(t, (t) => Pi$1(t) && !t.isInline());
	return Pi$1(e) || T$3(4, t.__key), e;
}
function At$5(t, e) {
	return null !== t && Object.getPrototypeOf(t).constructor.name === e.name;
}
function bt$4(t) {
	const e = $r$2();
	if (!wr(e)) return !1;
	const i = /* @__PURE__ */ new Set(), l = e.getNodes();
	for (let e = 0; e < l.length; e++) {
		const n = l[e], o = n.getKey();
		if (i.has(o)) continue;
		const s = qs(n, (t) => Pi$1(t) && !t.isInline());
		if (null === s) continue;
		const u = s.getKey();
		s.canIndent() && !i.has(u) && (i.add(u), t(s));
	}
	return i.size > 0;
}
function Bt$4(t, e, n) {
	let o = !1;
	for (const i of kt$4(t)) e(i) ? null !== n && n(i) : (o = !0, Pi$1(i) && Bt$4(i, e, n || ((t) => i.insertAfter(t))), i.remove());
	return o;
}
function _t$5(t, e) {
	const n = [], o = Array.from(t).reverse();
	for (let t = o.pop(); void 0 !== t; t = o.pop()) if (e(t)) n.push(t);
	else if (Pi$1(t)) for (const e of kt$4(t)) o.push(e);
	return n;
}
function kt$4(t) {
	return $t$4(gl$1(t, "previous"));
}
function $t$4(t) {
	return Tl$1({
		hasNext: ol$1,
		initial: t.getAdjacentCaret(),
		map: (t) => t.origin.getLatest(),
		step: (t) => t.getAdjacentCaret()
	});
}
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-XFA5M7FY.js
var S$2 = class extends Fi$1 {
	__cacheBuster;
	__fields;
	constructor({ cacheBuster: t, fields: e, key: i }) {
		super(i), this.__fields = e, this.__cacheBuster = t || 0;
	}
	static clone(t) {
		return new this({
			cacheBuster: t.__cacheBuster,
			fields: t.__fields,
			key: t.__key
		});
	}
	static getType() {
		return "inlineBlock";
	}
	static importDOM() {
		return {};
	}
	static importJSON(t) {
		return we$2(t.fields);
	}
	static isInline() {
		return !1;
	}
	canIndent() {
		return !0;
	}
	createDOM(t) {
		let e = document.createElement("span");
		return Zl$1(e, t?.theme?.inlineBlock), e;
	}
	decorate(t, e) {
		return null;
	}
	exportDOM() {
		let t = document.createElement("span");
		t.classList.add("inline-block-container");
		let e = document.createTextNode(this.getTextContent());
		return t.append(e), { element: t };
	}
	exportJSON() {
		return {
			type: "inlineBlock",
			fields: this.getFields(),
			version: 1
		};
	}
	getCacheBuster() {
		return this.getLatest().__cacheBuster;
	}
	getFields() {
		return this.getLatest().__fields;
	}
	getTextContent() {
		return "Block Field";
	}
	isInline() {
		return !0;
	}
	setFields(t, e) {
		let i = this.getWritable();
		i.__fields = t, e || i.__cacheBuster++;
	}
	updateDOM() {
		return !1;
	}
};
function we$2(c) {
	return Ss$1(new S$2({ fields: {
		...c,
		id: c?.id || new import_objectid.default.default().toHexString()
	} }));
}
var Le$3 = import_react.lazy(() => import("./componentInline-A4H3EY3L-CFalxNkE.js").then((c) => ({ default: c.InlineBlockComponent }))), T$2 = class extends S$2 {
	static clone(t) {
		return super.clone(t);
	}
	static getType() {
		return super.getType();
	}
	static importJSON(t) {
		return Pe$3(t.fields);
	}
	decorate(...[t, e, i, f]) {
		return (0, import_jsx_runtime.jsx)(Le$3, {
			cacheBuster: this.getCacheBuster(),
			className: e.theme.inlineBlock ?? "LexicalEditorTheme__inlineBlock",
			CustomBlock: i,
			CustomLabel: f,
			formData: this.getFields(),
			nodeKey: this.getKey()
		});
	}
	exportJSON() {
		return super.exportJSON();
	}
};
function Pe$3(c) {
	return Ss$1(new T$2({ fields: {
		...c,
		id: c?.id || new import_objectid.default.default().toHexString()
	} }));
}
function K$2(c) {
	return c instanceof T$2;
}
var ke$4 = (0, import_react.createContext)({ initialState: !1 }), be$2 = () => import_react.use(ke$4), Dt$5 = (c) => {
	let { cacheBuster: t, className: e, CustomBlock: i, CustomLabel: f, formData: n, nodeKey: a } = c, [k] = o$4(), u = a$1(), { i18n: E, t: b } = WP(), { createdInlineBlock: W, fieldProps: { featureClientSchemaMap: he, initialLexicalFormState: Be, schemaPath: X }, setCreatedInlineBlock: G, uuid: Ce } = I$4(), { fields: D } = tl$2(), { getFormState: I } = Nt$4(), ge = at$6(), U = (0, import_react.useRef)(!1), [m, L] = import_react.useState(() => {
		let o = Be?.[n.id]?.formState;
		return o ? Object.fromEntries(Object.entries(o).map(([l, r]) => [l, l in n ? {
			...r,
			initialValue: n[l],
			value: n[l]
		} : r])) : !1;
	}), q = (0, import_react.useRef)(!1), Q = (0, import_react.useRef)(t);
	(0, import_react.useEffect)(() => {
		q.current ? (Q.current !== t && L(!1), Q.current = t) : q.current = !0;
	}, [t]);
	let [xe] = import_react.useState(() => v4()), [Y, Z] = import_react.useState(() => {
		if (!f) return m?._components?.customComponents?.BlockLabel ?? void 0;
	}), [ee, te] = import_react.useState(() => {
		if (!i) return m?._components?.customComponents?.Block ?? void 0;
	}), ne = (0, import_react.useMemo)(() => i ? (0, import_jsx_runtime.jsx)(i, {
		className: e,
		formData: n,
		isEditor: !0,
		isJSXConverter: !1,
		nodeKey: a,
		useInlineBlockComponentContext: be$2
	}) : ee, [
		i,
		e,
		n,
		a,
		ee
	]), P = (0, import_react.useMemo)(() => f ? (0, import_jsx_runtime.jsx)(f, {
		className: e,
		formData: n,
		isEditor: !0,
		isJSXConverter: !1,
		nodeKey: a,
		useInlineBlockComponentContext: be$2
	}) : Y, [
		f,
		e,
		n,
		a,
		Y
	]), oe = tu$1({
		slug: `lexical-inlineBlocks-create-${Ce}-${n.id}`,
		depth: ge
	}), { toggleDrawer: C } = F$7(oe, !0), _e = (0, import_react.useRef)(null), { id: v, collectionSlug: N, getDocPreferences: w, globalSlug: O } = Ie$3(), { config: Se } = se$4(), ye = `${X}.lexical_internal_feature.blocks.lexical_inline_blocks.${n.blockType}`, g = he.blocks?.[ye]?.[0], d = g.blockReferences ? typeof g?.blockReferences?.[0] == "string" ? Se.blocksMap[g?.blockReferences?.[0]] : g?.blockReferences?.[0] : g?.blocks?.[0], re = d?.fields ?? [];
	(0, import_react.useEffect)(() => {
		!U.current && W?.getKey() === a && (re.length > 2 && C(), G?.(void 0), U.current = !0);
	}, [
		re.length,
		W,
		a,
		G,
		C
	]);
	let le = (0, import_react.useCallback)(() => {
		k.update(() => {
			Mo$1(a)?.remove();
		});
	}, [k, a]), x = d?.labels?.singular ? getTranslation(d?.labels.singular, E) : d?.slug, R = (0, import_react.useRef)(new AbortController()), _ = `${X}.lexical_internal_feature.blocks.lexical_inline_blocks.${d?.slug}.fields`;
	(0, import_react.useEffect)(() => {
		let o = new AbortController();
		return n && !m && (async () => {
			let { state: r } = await I({
				id: v,
				collectionSlug: N,
				data: n,
				docPermissions: { fields: !0 },
				docPreferences: await w(),
				documentFormState: deepCopyObjectSimpleWithoutReactComponents(D, { excludeFiles: !0 }),
				globalSlug: O,
				initialBlockData: n,
				initialBlockFormState: n,
				operation: "update",
				readOnly: !u,
				renderAllFields: !0,
				schemaPath: _,
				signal: o.signal
			});
			if (r) {
				let p = reduceFieldsToValues(deepCopyObjectSimpleWithoutReactComponents(r, { excludeFiles: !0 }), !0);
				k.update(() => {
					let A = Mo$1(a);
					if (A && K$2(A)) {
						let ae = p;
						ae.blockType = n.blockType, A.setFields(ae, !0);
					}
				}, { tag: "skip-dom-selection" }), L(r), f || Z(r._components?.customComponents?.BlockLabel), i || te(r._components?.customComponents?.Block);
			}
		})(), () => {
			le$6(o);
		};
	}, [
		I,
		k,
		a,
		u,
		f,
		i,
		_,
		v,
		n,
		m,
		N,
		O,
		w,
		D
	]);
	let se = (0, import_react.useCallback)(async ({ formState: o, submit: l }) => {
		le$6(R.current);
		let r = new AbortController();
		R.current = r;
		let { state: p } = await I({
			id: v,
			collectionSlug: N,
			docPermissions: { fields: !0 },
			docPreferences: await w(),
			documentFormState: deepCopyObjectSimpleWithoutReactComponents(D, { excludeFiles: !0 }),
			formState: o,
			globalSlug: O,
			initialBlockFormState: o,
			operation: "update",
			readOnly: !u,
			renderAllFields: !!l,
			schemaPath: _,
			signal: r.signal
		});
		return p ? (l && (f || Z(p._components?.customComponents?.BlockLabel), i || te(p._components?.customComponents?.Block)), p) : o;
	}, [
		I,
		v,
		N,
		w,
		D,
		O,
		u,
		_,
		i,
		f
	]);
	(0, import_react.useEffect)(() => {
		let o = (l, r) => Object.keys(r).some((p) => r[p] && l[p] !== r[p].value);
		return () => {
			m && o(n, m) && L(!1), le$6(R.current);
		};
	}, [n, m]);
	let Fe = (0, import_react.useCallback)((o, l) => {
		l.blockType = n.blockType, k.update(() => {
			let r = Mo$1(a);
			r && K$2(r) && r.setFields(l, !0);
		}, { tag: Vn });
	}, [
		k,
		a,
		n
	]), j = (0, import_react.useMemo)(() => () => (0, import_jsx_runtime.jsx)(re$3, {
		buttonStyle: "icon-label",
		className: `${e}__removeButton`,
		disabled: !u,
		icon: "x",
		onClick: (o) => {
			o.preventDefault(), le();
		},
		round: !0,
		size: "small",
		tooltip: b("lexical:blocks:inlineBlocks:remove", { label: x })
	}), [
		e,
		x,
		u,
		le,
		b
	]), ie = (0, import_react.useMemo)(() => () => (0, import_jsx_runtime.jsx)(re$3, {
		buttonStyle: "icon-label",
		className: `${e}__editButton`,
		disabled: !u,
		el: "button",
		icon: "edit",
		onClick: () => {
			C();
		},
		round: !0,
		size: "small",
		tooltip: b("lexical:blocks:inlineBlocks:edit", { label: x })
	}), [
		e,
		x,
		u,
		b,
		C
	]), M = (0, import_react.useMemo)(() => ({ children: o, className: l }) => (0, import_jsx_runtime.jsx)("div", {
		className: [
			`${e}__container`,
			e + "-" + n.blockType,
			l
		].filter(Boolean).join(" "),
		ref: _e,
		children: o
	}), [e, n.blockType]), ce = (0, import_react.useMemo)(() => P ? () => P : () => (0, import_jsx_runtime.jsx)("div", { children: d?.labels ? getTranslation(d?.labels.singular, E) : "" }), [
		P,
		d?.labels,
		E
	]);
	return d ? (0, import_jsx_runtime.jsxs)(Ss$2, {
		beforeSubmit: [async ({ formState: o }) => await se({
			formState: o,
			submit: !0
		})],
		disableValidationOnSubmit: !0,
		el: "div",
		fields: d?.fields,
		initialState: m || {},
		onChange: [se],
		onSubmit: (o, l) => {
			Fe(o, l), C();
		},
		uuid: xe,
		children: [(0, import_jsx_runtime.jsx)(ss$1, { children: (0, import_jsx_runtime.jsx)(Tt$7, {
			className: "",
			slug: oe,
			title: b(`lexical:blocks:inlineBlocks:${n?.id ? "edit" : "create"}`, { label: x ?? b("lexical:blocks:inlineBlocks:label") }),
			children: m ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(Lo$1, {
				fields: d?.fields,
				forceRender: !0,
				parentIndexPath: "",
				parentPath: "",
				parentSchemaPath: _,
				permissions: !0,
				readOnly: !u
			}), (0, import_jsx_runtime.jsx)(Ar$2, {
				programmaticSubmit: !0,
				children: b("fields:saveChanges")
			})] }) : null
		}) }), ne ? (0, import_jsx_runtime.jsx)(ke$4, {
			value: {
				EditButton: ie,
				initialState: m,
				InlineBlockContainer: M,
				Label: ce,
				nodeKey: a,
				RemoveButton: j
			},
			children: ne
		}) : (0, import_jsx_runtime.jsxs)(M, { children: [m ? (0, import_jsx_runtime.jsx)(ce, {}) : (0, import_jsx_runtime.jsx)(le$5, {
			height: "15px",
			width: "40px"
		}), u ? (0, import_jsx_runtime.jsxs)("div", {
			className: `${e}__actions`,
			children: [(0, import_jsx_runtime.jsx)(ie, {}), (0, import_jsx_runtime.jsx)(j, {})]
		}) : null] })]
	}) : (0, import_jsx_runtime.jsxs)(M, {
		className: `${e}-not-found`,
		children: [(0, import_jsx_runtime.jsxs)("span", { children: [
			"Error: Block '",
			n.blockType,
			"' not found"
		] }), u ? (0, import_jsx_runtime.jsx)("div", {
			className: `${e}__actions`,
			children: (0, import_jsx_runtime.jsx)(j, {})
		}) : null]
	});
};
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-DBWINSQN.js
var _$2 = ne$4("INSERT_RELATIONSHIP_WITH_DRAWER_COMMAND");
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-QJ5EETIB.js
var E$3 = ({ data: f, featureKey: e, fieldMapOverride: p, handleDrawerSubmit: h, schemaFieldsPathOverride: o, schemaPath: g, schemaPathSuffix: m }) => {
	let { t: S } = WP(), { id: a, collectionSlug: n, getDocPreferences: i, globalSlug: s } = Ie$3(), { fields: l } = tl$2(), r = a$1(), t = (0, import_react.useRef)(new AbortController()), [c, w] = (0, import_react.useState)(!1), { fieldProps: { featureClientSchemaMap: P } } = I$4(), { getFormState: C } = Nt$4(), u = o ?? `${g}.lexical_internal_feature.${e}${m ? `.${m}` : ""}`, b = p ?? P[e]?.[u];
	(0, import_react.useEffect)(() => {
		let d = new AbortController();
		return (async () => {
			let { state: D } = await C({
				id: a,
				collectionSlug: n,
				data: f ?? {},
				docPermissions: { fields: !0 },
				docPreferences: await i(),
				documentFormState: deepCopyObjectSimpleWithoutReactComponents(l, { excludeFiles: !0 }),
				globalSlug: s,
				initialBlockData: f,
				operation: "update",
				readOnly: !r,
				renderAllFields: !0,
				schemaPath: u,
				signal: d.signal
			});
			w(D);
		})(), () => {
			le$6(d);
		};
	}, [
		u,
		a,
		f,
		C,
		n,
		r,
		s,
		i,
		l
	]);
	let F = (0, import_react.useCallback)(async ({ formState: d }) => {
		le$6(t.current);
		let A = new AbortController();
		t.current = A;
		let { state: D } = await C({
			id: a,
			collectionSlug: n,
			docPermissions: { fields: !0 },
			docPreferences: await i(),
			documentFormState: deepCopyObjectSimpleWithoutReactComponents(l, { excludeFiles: !0 }),
			formState: d,
			globalSlug: s,
			initialBlockFormState: d,
			operation: "update",
			readOnly: !r,
			schemaPath: u,
			signal: A.signal
		});
		return D || d;
	}, [
		C,
		a,
		r,
		n,
		i,
		l,
		s,
		u
	]);
	return (0, import_react.useEffect)(() => () => {
		le$6(t.current);
	}, []), c === !1 ? null : (0, import_jsx_runtime.jsxs)(Ss$2, {
		beforeSubmit: [F],
		disableValidationOnSubmit: !0,
		fields: Array.isArray(b) ? b : [],
		initialState: c,
		onChange: [F],
		onSubmit: h,
		uuid: v4(),
		children: [(0, import_jsx_runtime.jsx)(Lo$1, {
			fields: Array.isArray(b) ? b : [],
			forceRender: !0,
			parentIndexPath: "",
			parentPath: "",
			parentSchemaPath: u,
			permissions: !0,
			readOnly: !r
		}), (0, import_jsx_runtime.jsx)(Ar$2, { children: S("fields:saveChanges") })]
	});
};
var de$3 = (f) => {
	let e = (0, import_compiler_runtime.c)(15), { className: p, data: h, drawerSlug: o, drawerTitle: g, featureKey: m, fieldMapOverride: S, handleDrawerSubmit: a, schemaFieldsPathOverride: n, schemaPath: i, schemaPathSuffix: s } = f, { closeModal: l } = se$3(), r = g ?? "", t;
	e[0] !== l || e[1] !== o || e[2] !== a ? (t = (w, P) => {
		l(o), setTimeout(() => {
			a(w, P);
		}, 1);
	}, e[0] = l, e[1] = o, e[2] = a, e[3] = t) : t = e[3];
	let c;
	return e[4] !== p || e[5] !== h || e[6] !== o || e[7] !== m || e[8] !== S || e[9] !== n || e[10] !== i || e[11] !== s || e[12] !== r || e[13] !== t ? (c = (0, import_jsx_runtime.jsx)(ss$1, { children: (0, import_jsx_runtime.jsx)(Tt$7, {
		className: p,
		slug: o,
		title: r,
		children: (0, import_jsx_runtime.jsx)(E$3, {
			data: h,
			featureKey: m,
			fieldMapOverride: S,
			handleDrawerSubmit: t,
			schemaFieldsPathOverride: n,
			schemaPath: i,
			schemaPathSuffix: s
		})
	}) }), e[4] = p, e[5] = h, e[6] = o, e[7] = m, e[8] = S, e[9] = n, e[10] = i, e[11] = s, e[12] = r, e[13] = t, e[14] = c) : c = e[14], c;
};
var he$2 = ne$4("INSERT_UPLOAD_WITH_DRAWER_COMMAND");
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-F26IQ5RE.js
var G$4 = ($) => {
	let e = (0, import_compiler_runtime.c)(21), [o] = o$4(), [l, k] = (0, import_react.useState)(null), [c, C] = (0, import_react.useState)(!1), [S, w, O] = Gt$5($), { closeDrawer: d, drawerSlug: t } = O, { modalState: n } = se$3(), i;
	e[0] !== o ? (i = () => {
		o.read(() => {
			k($r$2() ?? Vr$1());
		}), C(!0);
	}, e[0] = o, e[1] = i) : i = e[1];
	let g = i, a;
	e[2] !== o || e[3] !== l ? (a = () => {
		l && o.update(() => {
			zo$1(l.clone());
		}, {
			discrete: !0,
			skipTransforms: !0
		});
	}, e[2] = o, e[3] = l, e[4] = a) : a = e[4];
	let u = a, m;
	e[5] !== d ? (m = () => {
		d();
	}, e[5] = d, e[6] = m) : m = e[6];
	let x = m, f, D;
	e[7] !== t || e[8] !== n || e[9] !== u || e[10] !== c ? (f = () => {
		if (!c) return;
		let r = n[t];
		r && !r?.isOpen && (C(!1), setTimeout(() => {
			u();
		}, 1));
	}, D = [
		n,
		t,
		u,
		c
	], e[7] = t, e[8] = n, e[9] = u, e[10] = c, e[11] = f, e[12] = D) : (f = e[11], D = e[12]), (0, import_react.useEffect)(f, D);
	let s;
	e[13] !== w || e[14] !== g ? (s = (r) => (0, import_jsx_runtime.jsx)(w, {
		...r,
		onClick: g
	}), e[13] = w, e[14] = g, e[15] = s) : s = e[15];
	let p;
	return e[16] !== S || e[17] !== x || e[18] !== t || e[19] !== s ? (p = {
		closeDocumentDrawer: x,
		DocumentDrawer: S,
		documentDrawerSlug: t,
		DocumentDrawerToggler: s
	}, e[16] = S, e[17] = x, e[18] = t, e[19] = s, e[20] = p) : p = e[20], p;
};
//#endregion
//#region node_modules/@lexical/extension/LexicalExtension.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var Z$2 = Symbol.for("preact-signals");
function J$4() {
	if (Y$2 > 1) return void Y$2--;
	let t, e = !1;
	for (; void 0 !== Q$3;) {
		let n = Q$3;
		for (Q$3 = void 0, tt$2++; void 0 !== n;) {
			const i = n.o;
			if (n.o = void 0, n.f &= -3, !(8 & n.f) && st$3(n)) try {
				n.c();
			} catch (n) {
				e || (t = n, e = !0);
			}
			n = i;
		}
	}
	if (tt$2 = 0, Y$2--, e) throw t;
}
function H$3(t) {
	if (Y$2 > 0) return t();
	Y$2++;
	try {
		return t();
	} finally {
		J$4();
	}
}
var q$3, Q$3;
function X$3(t) {
	const e = q$3;
	q$3 = void 0;
	try {
		return t();
	} finally {
		q$3 = e;
	}
}
var Y$2 = 0, tt$2 = 0, et$3 = 0;
function nt$4(t) {
	if (void 0 === q$3) return;
	let e = t.n;
	return void 0 === e || e.t !== q$3 ? (e = {
		i: 0,
		S: t,
		p: q$3.s,
		n: void 0,
		t: q$3,
		e: void 0,
		x: void 0,
		r: e
	}, void 0 !== q$3.s && (q$3.s.n = e), q$3.s = e, t.n = e, 32 & q$3.f && t.S(e), e) : -1 === e.i ? (e.i = 0, void 0 !== e.n && (e.n.p = e.p, void 0 !== e.p && (e.p.n = e.n), e.p = q$3.s, e.n = void 0, q$3.s.n = e, q$3.s = e), e) : void 0;
}
function it$2(t, e) {
	this.v = t, this.i = 0, this.n = void 0, this.t = void 0, this.W = null == e ? void 0 : e.watched, this.Z = null == e ? void 0 : e.unwatched, this.name = null == e ? void 0 : e.name;
}
function ot$2(t, e) {
	return new it$2(t, e);
}
function st$3(t) {
	for (let e = t.s; void 0 !== e; e = e.n) if (e.S.i !== e.i || !e.S.h() || e.S.i !== e.i) return !0;
	return !1;
}
function rt$4(t) {
	for (let e = t.s; void 0 !== e; e = e.n) {
		const n = e.S.n;
		if (void 0 !== n && (e.r = n), e.S.n = e, e.i = -1, void 0 === e.n) {
			t.s = e;
			break;
		}
	}
}
function ct$3(t) {
	let e, n = t.s;
	for (; void 0 !== n;) {
		const t = n.p;
		-1 === n.i ? (n.S.U(n), void 0 !== t && (t.n = n.n), void 0 !== n.n && (n.n.p = t)) : e = n, n.S.n = n.r, void 0 !== n.r && (n.r = void 0), n = t;
	}
	t.s = e;
}
function at$3(t, e) {
	it$2.call(this, void 0), this.x = t, this.s = void 0, this.g = et$3 - 1, this.f = 4, this.W = null == e ? void 0 : e.watched, this.Z = null == e ? void 0 : e.unwatched, this.name = null == e ? void 0 : e.name;
}
function ut$4(t) {
	const e = t.u;
	if (t.u = void 0, "function" == typeof e) {
		Y$2++;
		const n = q$3;
		q$3 = void 0;
		try {
			e();
		} catch (e) {
			throw t.f &= -2, t.f |= 8, ft$3(t), e;
		} finally {
			q$3 = n, J$4();
		}
	}
}
function ft$3(t) {
	for (let e = t.s; void 0 !== e; e = e.n) e.S.U(e);
	t.x = void 0, t.s = void 0, ut$4(t);
}
function ht$3(t) {
	if (q$3 !== this) throw new Error("Out-of-order effect");
	ct$3(this), q$3 = t, this.f &= -2, 8 & this.f && ft$3(this), J$4();
}
function lt$2(t, e) {
	this.x = t, this.u = void 0, this.s = void 0, this.o = void 0, this.f = 32, this.name = null == e ? void 0 : e.name;
}
function gt$3(t, e) {
	const n = new lt$2(t, e);
	try {
		n.c();
	} catch (t) {
		throw n.d(), t;
	}
	const i = n.d.bind(n);
	return i[Symbol.dispose] = i, i;
}
function pt$4(t, e = {}) {
	const n = {};
	for (const i in t) {
		const o = e[i];
		n[i] = ot$2(void 0 === o ? t[i] : o);
	}
	return n;
}
it$2.prototype.brand = Z$2, it$2.prototype.h = function() {
	return !0;
}, it$2.prototype.S = function(t) {
	const e = this.t;
	e !== t && void 0 === t.e && (t.x = e, this.t = t, void 0 !== e ? e.e = t : X$3(() => {
		var t;
		null == (t = this.W) || t.call(this);
	}));
}, it$2.prototype.U = function(t) {
	if (void 0 !== this.t) {
		const e = t.e, n = t.x;
		void 0 !== e && (e.x = n, t.e = void 0), void 0 !== n && (n.e = e, t.x = void 0), t === this.t && (this.t = n, void 0 === n && X$3(() => {
			var t;
			null == (t = this.Z) || t.call(this);
		}));
	}
}, it$2.prototype.subscribe = function(t) {
	return gt$3(() => {
		const e = this.value, n = q$3;
		q$3 = void 0;
		try {
			t(e);
		} finally {
			q$3 = n;
		}
	}, { name: "sub" });
}, it$2.prototype.valueOf = function() {
	return this.value;
}, it$2.prototype.toString = function() {
	return this.value + "";
}, it$2.prototype.toJSON = function() {
	return this.value;
}, it$2.prototype.peek = function() {
	const t = q$3;
	q$3 = void 0;
	try {
		return this.value;
	} finally {
		q$3 = t;
	}
}, Object.defineProperty(it$2.prototype, "value", {
	get() {
		const t = nt$4(this);
		return void 0 !== t && (t.i = this.i), this.v;
	},
	set(t) {
		if (t !== this.v) {
			if (tt$2 > 100) throw new Error("Cycle detected");
			this.v = t, this.i++, et$3++, Y$2++;
			try {
				for (let t = this.t; void 0 !== t; t = t.x) t.t.N();
			} finally {
				J$4();
			}
		}
	}
}), at$3.prototype = new it$2(), at$3.prototype.h = function() {
	if (this.f &= -3, 1 & this.f) return !1;
	if (32 == (36 & this.f)) return !0;
	if (this.f &= -5, this.g === et$3) return !0;
	if (this.g = et$3, this.f |= 1, this.i > 0 && !st$3(this)) return this.f &= -2, !0;
	const t = q$3;
	try {
		rt$4(this), q$3 = this;
		const t = this.x();
		(16 & this.f || this.v !== t || 0 === this.i) && (this.v = t, this.f &= -17, this.i++);
	} catch (t) {
		this.v = t, this.f |= 16, this.i++;
	}
	return q$3 = t, ct$3(this), this.f &= -2, !0;
}, at$3.prototype.S = function(t) {
	if (void 0 === this.t) {
		this.f |= 36;
		for (let t = this.s; void 0 !== t; t = t.n) t.S.S(t);
	}
	it$2.prototype.S.call(this, t);
}, at$3.prototype.U = function(t) {
	if (void 0 !== this.t && (it$2.prototype.U.call(this, t), void 0 === this.t)) {
		this.f &= -33;
		for (let t = this.s; void 0 !== t; t = t.n) t.S.U(t);
	}
}, at$3.prototype.N = function() {
	if (!(2 & this.f)) {
		this.f |= 6;
		for (let t = this.t; void 0 !== t; t = t.x) t.t.N();
	}
}, Object.defineProperty(at$3.prototype, "value", { get() {
	if (1 & this.f) throw new Error("Cycle detected");
	const t = nt$4(this);
	if (this.h(), void 0 !== t && (t.i = this.i), 16 & this.f) throw this.v;
	return this.v;
} }), lt$2.prototype.c = function() {
	const t = this.S();
	try {
		if (8 & this.f) return;
		if (void 0 === this.x) return;
		const t = this.x();
		"function" == typeof t && (this.u = t);
	} finally {
		t();
	}
}, lt$2.prototype.S = function() {
	if (1 & this.f) throw new Error("Cycle detected");
	this.f |= 1, this.f &= -9, ut$4(this), rt$4(this), Y$2++;
	const t = q$3;
	return q$3 = this, ht$3.bind(this, t);
}, lt$2.prototype.N = function() {
	2 & this.f || (this.f |= 2, this.o = Q$3, Q$3 = this);
}, lt$2.prototype.d = function() {
	this.f |= 8, 1 & this.f || ft$3(this);
}, lt$2.prototype.dispose = function() {
	this.d();
};
function Et$3(t) {
	return ("function" == typeof t.nodes ? t.nodes() : t.nodes) || [];
}
it$3("format", { parse: (t) => "number" == typeof t ? t : 0 });
function _t$4(t, ...e) {
	const n = new URL("https://lexical.dev/docs/error"), i = new URLSearchParams();
	i.append("code", t);
	for (const t of e) i.append("v", t);
	throw n.search = i.toString(), Error(`Minified Lexical error #${t}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
function jt$3(t, e) {
	if (t && e && !Array.isArray(e) && "object" == typeof t && "object" == typeof e) {
		const n = t, i = e;
		for (const t in i) n[t] = jt$3(n[t], i[t]);
		return t;
	}
	return e;
}
var At$4 = 0, kt$3 = 1, Pt$4 = 2, Kt$3 = 3, $t$3 = 4, zt$2 = 5, Ut$2 = 6, Lt$3 = 7;
function Tt$4(t) {
	return t.id === At$4;
}
function Bt$3(t) {
	return t.id === Pt$4;
}
function Wt$4(t) {
	return function(t) {
		return t.id === kt$3;
	}(t) || _t$4(305, String(t.id), String(kt$3)), Object.assign(t, { id: Pt$4 });
}
var Gt$3 = /* @__PURE__ */ new Set();
var Vt$2 = class {
	builder;
	configs;
	_dependency;
	_peerNameSet;
	extension;
	state;
	_signal;
	constructor(t, e) {
		this.builder = t, this.extension = e, this.configs = /* @__PURE__ */ new Set(), this.state = { id: At$4 };
	}
	mergeConfigs() {
		let t = this.extension.config || {};
		const e = this.extension.mergeConfig ? this.extension.mergeConfig.bind(this.extension) : Xl$1;
		for (const n of this.configs) t = e(t, n);
		return t;
	}
	init(t) {
		const e = this.state;
		Bt$3(e) || _t$4(306, String(e.id));
		const n = {
			getDependency: this.getInitDependency.bind(this),
			getDirectDependentNames: this.getDirectDependentNames.bind(this),
			getPeer: this.getInitPeer.bind(this),
			getPeerNameSet: this.getPeerNameSet.bind(this)
		}, i = {
			...n,
			getDependency: this.getDependency.bind(this),
			getInitResult: this.getInitResult.bind(this),
			getPeer: this.getPeer.bind(this)
		}, o = function(t, e, n) {
			return Object.assign(t, {
				config: e,
				id: Kt$3,
				registerState: n
			});
		}(e, this.mergeConfigs(), n);
		let s;
		this.state = o, this.extension.init && (s = this.extension.init(t, o.config, n)), this.state = function(t, e, n) {
			return Object.assign(t, {
				id: $t$3,
				initResult: e,
				registerState: n
			});
		}(o, s, i);
	}
	build(t) {
		const e = this.state;
		let n;
		e.id !== $t$3 && _t$4(307, String(e.id), String(zt$2)), this.extension.build && (n = this.extension.build(t, e.config, e.registerState));
		const i = {
			...e.registerState,
			getOutput: () => n,
			getSignal: this.getSignal.bind(this)
		};
		this.state = function(t, e, n) {
			return Object.assign(t, {
				id: zt$2,
				output: e,
				registerState: n
			});
		}(e, n, i);
	}
	register(t, e) {
		this._signal = e;
		const n = this.state;
		n.id !== zt$2 && _t$4(308, String(n.id), String(zt$2));
		const i = this.extension.register && this.extension.register(t, n.config, n.registerState);
		return this.state = function(t) {
			return Object.assign(t, { id: Ut$2 });
		}(n), () => {
			const t = this.state;
			t.id !== Lt$3 && _t$4(309, String(n.id), String(Lt$3)), this.state = function(t) {
				return Object.assign(t, { id: zt$2 });
			}(t), i && i();
		};
	}
	afterRegistration(t) {
		const e = this.state;
		let n;
		return e.id !== Ut$2 && _t$4(310, String(e.id), String(Ut$2)), this.extension.afterRegistration && (n = this.extension.afterRegistration(t, e.config, e.registerState)), this.state = function(t) {
			return Object.assign(t, { id: Lt$3 });
		}(e), n;
	}
	getSignal() {
		return void 0 === this._signal && _t$4(311), this._signal;
	}
	getInitResult() {
		void 0 === this.extension.init && _t$4(312, this.extension.name);
		const t = this.state;
		return function(t) {
			return t.id >= $t$3;
		}(t) || _t$4(313, String(t.id), String($t$3)), t.initResult;
	}
	getInitPeer(t) {
		const e = this.builder.extensionNameMap.get(t);
		return e ? e.getExtensionInitDependency() : void 0;
	}
	getExtensionInitDependency() {
		const t = this.state;
		return function(t) {
			return t.id >= Kt$3;
		}(t) || _t$4(314, String(t.id), String(Kt$3)), { config: t.config };
	}
	getPeer(t) {
		const e = this.builder.extensionNameMap.get(t);
		return e ? e.getExtensionDependency() : void 0;
	}
	getInitDependency(t) {
		const e = this.builder.getExtensionRep(t);
		return void 0 === e && _t$4(315, this.extension.name, t.name), e.getExtensionInitDependency();
	}
	getDependency(t) {
		const e = this.builder.getExtensionRep(t);
		return void 0 === e && _t$4(315, this.extension.name, t.name), e.getExtensionDependency();
	}
	getState() {
		const t = this.state;
		return function(t) {
			return t.id >= Lt$3;
		}(t) || _t$4(316, String(t.id), String(Lt$3)), t;
	}
	getDirectDependentNames() {
		return this.builder.incomingEdges.get(this.extension.name) || Gt$3;
	}
	getPeerNameSet() {
		let t = this._peerNameSet;
		return t || (t = new Set((this.extension.peerDependencies || []).map(([t]) => t)), this._peerNameSet = t), t;
	}
	getExtensionDependency() {
		if (!this._dependency) {
			const t = this.state;
			(function(t) {
				return t.id >= zt$2;
			})(t) || _t$4(317, this.extension.name), this._dependency = {
				config: t.config,
				init: t.initResult,
				output: t.output
			};
		}
		return this._dependency;
	}
};
var Zt$2 = { tag: Wn$1 };
function Jt$3() {
	const t = Io$1();
	t.isEmpty() && t.append(Vi());
}
var Ht$3 = Yl$1({
	config: Gl$1({
		setOptions: Zt$2,
		updateOptions: Zt$2
	}),
	init: ({ $initialEditorState: t = Jt$3 }) => ({
		$initialEditorState: t,
		initialized: !1
	}),
	afterRegistration(t, { updateOptions: e, setOptions: n }, i) {
		const o = i.getInitResult();
		if (!o.initialized) {
			o.initialized = !0;
			const { $initialEditorState: i } = o;
			if (Wi(i)) t.setEditorState(i, n);
			else if ("function" == typeof i) t.update(() => {
				i(t);
			}, e);
			else if (i && ("string" == typeof i || "object" == typeof i)) {
				const e = t.parseEditorState(i);
				t.setEditorState(e, n);
			}
		}
		return () => {};
	},
	name: "@lexical/extension/InitialState",
	nodes: [
		Ii$1,
		lr$2,
		Gn$1,
		xr$1,
		Ui$1
	]
}), qt$3 = Symbol.for("@lexical/extension/LexicalBuilder");
function Xt$2() {}
function Yt$3(t) {
	throw t;
}
function te$2(t) {
	return Array.isArray(t) ? t : [t];
}
var ee$3 = "0.41.0+prod.esm";
var ne$2 = class ne$2 {
	roots;
	extensionNameMap;
	outgoingConfigEdges;
	incomingEdges;
	conflicts;
	_sortedExtensionReps;
	PACKAGE_VERSION;
	constructor(t) {
		this.outgoingConfigEdges = /* @__PURE__ */ new Map(), this.incomingEdges = /* @__PURE__ */ new Map(), this.extensionNameMap = /* @__PURE__ */ new Map(), this.conflicts = /* @__PURE__ */ new Map(), this.PACKAGE_VERSION = ee$3, this.roots = t;
		for (const e of t) this.addExtension(e);
	}
	static fromExtensions(t) {
		const e = [te$2(Ht$3)];
		for (const n of t) e.push(te$2(n));
		return new ne$2(e);
	}
	static maybeFromEditor(t) {
		const e = t[qt$3];
		return e && (e.PACKAGE_VERSION !== ee$3 && _t$4(292, e.PACKAGE_VERSION, ee$3), e instanceof ne$2 || _t$4(293)), e;
	}
	static fromEditor(t) {
		const e = ne$2.maybeFromEditor(t);
		return void 0 === e && _t$4(294), e;
	}
	constructEditor() {
		const { $initialEditorState: t, onError: e, ...n } = this.buildCreateEditorArgs(), i = Object.assign(eo$1({
			...n,
			...e ? { onError: (t) => {
				e(t, i);
			} } : {}
		}), { [qt$3]: this });
		for (const t of this.sortedExtensionReps()) t.build(i);
		return i;
	}
	buildEditor() {
		let t = Xt$2;
		function e() {
			try {
				t();
			} finally {
				t = Xt$2;
			}
		}
		const n = Object.assign(this.constructEditor(), {
			dispose: e,
			[Symbol.dispose]: e
		});
		return t = ec(this.registerEditor(n), () => n.setRootElement(null)), n;
	}
	hasExtensionByName(t) {
		return this.extensionNameMap.has(t);
	}
	getExtensionRep(t) {
		const e = this.extensionNameMap.get(t.name);
		if (e) return e.extension !== t && _t$4(295, t.name), e;
	}
	addEdge(t, e, n) {
		const i = this.outgoingConfigEdges.get(t);
		i ? i.set(e, n) : this.outgoingConfigEdges.set(t, new Map([[e, n]]));
		const o = this.incomingEdges.get(e);
		o ? o.add(t) : this.incomingEdges.set(e, new Set([t]));
	}
	addExtension(t) {
		void 0 !== this._sortedExtensionReps && _t$4(296);
		const [n] = te$2(t);
		"string" != typeof n.name && _t$4(297, typeof n.name);
		let i = this.extensionNameMap.get(n.name);
		if (void 0 !== i && i.extension !== n && _t$4(298, n.name), !i) {
			i = new Vt$2(this, n), this.extensionNameMap.set(n.name, i);
			const t = this.conflicts.get(n.name);
			"string" == typeof t && _t$4(299, n.name, t);
			for (const t of n.conflictsWith || []) this.extensionNameMap.has(t) && _t$4(299, n.name, t), this.conflicts.set(t, n.name);
			for (const t of n.dependencies || []) {
				const e = te$2(t);
				this.addEdge(n.name, e[0].name, e.slice(1)), this.addExtension(e);
			}
			for (const [t, e] of n.peerDependencies || []) this.addEdge(n.name, t, e ? [e] : []);
		}
	}
	sortedExtensionReps() {
		if (this._sortedExtensionReps) return this._sortedExtensionReps;
		const t = [], e = (n, i) => {
			let o = n.state;
			if (Bt$3(o)) return;
			const s = n.extension.name;
			var r;
			Tt$4(o) || _t$4(300, s, i || "[unknown]"), Tt$4(r = o) || _t$4(304, String(r.id), String(At$4)), o = Object.assign(r, { id: kt$3 }), n.state = o;
			const c = this.outgoingConfigEdges.get(s);
			if (c) for (const t of c.keys()) {
				const n = this.extensionNameMap.get(t);
				n && e(n, s);
			}
			o = Wt$4(o), n.state = o, t.push(n);
		};
		for (const t of this.extensionNameMap.values()) Tt$4(t.state) && e(t);
		for (const e of t) for (const [t, n] of this.outgoingConfigEdges.get(e.extension.name) || []) if (n.length > 0) {
			const e = this.extensionNameMap.get(t);
			if (e) for (const t of n) e.configs.add(t);
		}
		for (const [t, ...e] of this.roots) if (e.length > 0) {
			const n = this.extensionNameMap.get(t.name);
			void 0 === n && _t$4(301, t.name);
			for (const t of e) n.configs.add(t);
		}
		return this._sortedExtensionReps = t, this._sortedExtensionReps;
	}
	registerEditor(t) {
		const e = this.sortedExtensionReps(), n = new AbortController(), i = [() => n.abort()], o = n.signal;
		for (const n of e) {
			const e = n.register(t, o);
			e && i.push(e);
		}
		for (const n of e) {
			const e = n.afterRegistration(t);
			e && i.push(e);
		}
		return ec(...i);
	}
	buildCreateEditorArgs() {
		const t = {}, e = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), o = {}, s = {}, r = this.sortedExtensionReps();
		for (const c of r) {
			const { extension: r } = c;
			if (void 0 !== r.onError && (t.onError = r.onError), void 0 !== r.disableEvents && (t.disableEvents = r.disableEvents), void 0 !== r.parentEditor && (t.parentEditor = r.parentEditor), void 0 !== r.editable && (t.editable = r.editable), void 0 !== r.namespace && (t.namespace = r.namespace), void 0 !== r.$initialEditorState && (t.$initialEditorState = r.$initialEditorState), r.nodes) for (const t of Et$3(r)) {
				if ("function" != typeof t) {
					const e = n.get(t.replace);
					e && _t$4(302, r.name, t.replace.name, e.extension.name), n.set(t.replace, c);
				}
				e.add(t);
			}
			if (r.html) {
				if (r.html.export) for (const [t, e] of r.html.export.entries()) i.set(t, e);
				r.html.import && Object.assign(o, r.html.import);
			}
			r.theme && jt$3(s, r.theme);
		}
		Object.keys(s).length > 0 && (t.theme = s), e.size && (t.nodes = [...e]);
		const c = Object.keys(o).length > 0, a = i.size > 0;
		(c || a) && (t.html = {}, c && (t.html.import = o), a && (t.html.export = i));
		for (const e of r) e.init(t);
		return t.onError || (t.onError = Yt$3), t;
	}
};
function oe$3(t, e) {
	const n = ne$2.fromEditor(t).extensionNameMap.get(e);
	return n ? n.getExtensionDependency() : void 0;
}
var de$2 = class de$2 extends Fi$1 {
	static getType() {
		return "horizontalrule";
	}
	static clone(t) {
		return new de$2(t.__key);
	}
	static importJSON(t) {
		return fe$3().updateFromJSON(t);
	}
	static importDOM() {
		return { hr: () => ({
			conversion: ue$2,
			priority: 0
		}) };
	}
	exportDOM() {
		return { element: document.createElement("hr") };
	}
	createDOM(t) {
		const e = document.createElement("hr");
		return Zl$1(e, t.theme.hr), e;
	}
	getTextContent() {
		return "\n";
	}
	isInline() {
		return !1;
	}
	updateDOM() {
		return !1;
	}
};
function ue$2() {
	return { node: fe$3() };
}
function fe$3() {
	return Ys$1(de$2);
}
//#endregion
//#region node_modules/@lexical/list/LexicalList.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function $$2(e, ...t) {
	const n = new URL("https://lexical.dev/docs/error"), r = new URLSearchParams();
	r.append("code", e);
	for (const e of t) r.append("v", e);
	throw n.search = r.toString(), Error(`Minified Lexical error #${e}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
function V$2(e) {
	let t = 1, n = e.getParent();
	for (; null != n;) {
		if (ae$1(n)) {
			const e = n.getParent();
			if (me$1(e)) {
				t++, n = e.getParent();
				continue;
			}
			$$2(40);
		}
		return t;
	}
	return t;
}
function z$3(e) {
	let t = e.getParent();
	me$1(t) || $$2(40);
	let n = t;
	for (; null !== n;) n = n.getParent(), me$1(n) && (t = n);
	return t;
}
function X$2(e) {
	let t = [];
	const n = e.getChildren().filter(ae$1);
	for (let e = 0; e < n.length; e++) {
		const r = n[e], i = r.getFirstChild();
		me$1(i) ? t = t.concat(X$2(i)) : t.push(r);
	}
	return t;
}
function j$3(e) {
	return ae$1(e) && me$1(e.getFirstChild());
}
function q$2(e) {
	return ce$2().append(e);
}
function H$2(e, t) {
	return ae$1(e) && (0 === t.length || 1 === t.length && e.is(t[0]) && 0 === e.getChildrenSize());
}
function G$3(e) {
	const t = $r$2();
	if (null !== t) {
		let n = t.getNodes();
		if (wr(t)) {
			const r = t.getStartEndPoints();
			null === r && $$2(143);
			const [i] = r, s = i.getNode(), o = s.getParent();
			if (xs$1(s)) {
				const e = s.getFirstChild();
				if (e) n = e.selectStart().getNodes();
				else {
					const e = Vi();
					s.append(e), n = e.select().getNodes();
				}
			} else if (H$2(s, n)) {
				const t = pe$2(e);
				if (xs$1(o)) {
					s.replace(t);
					const e = ce$2();
					Pi$1(s) && (e.setFormat(s.getFormatType()), e.setIndent(s.getIndent())), t.append(e);
				} else if (ae$1(s)) {
					const e = s.getParentOrThrow();
					Q$2(t, e.getChildren()), e.replace(t);
				}
				return;
			}
		}
		const r = /* @__PURE__ */ new Set();
		for (let t = 0; t < n.length; t++) {
			const i = n[t];
			if (Pi$1(i) && i.isEmpty() && !ae$1(i) && !r.has(i.getKey())) {
				Y$1(i, e);
				continue;
			}
			let s = ko$1(i) ? i.getParent() : ae$1(i) && i.isEmpty() ? i : null;
			for (; null != s;) {
				const t = s.getKey();
				if (me$1(s)) {
					if (!r.has(t)) {
						const n = pe$2(e);
						Q$2(n, s.getChildren()), s.replace(n), r.add(t);
					}
					break;
				}
				{
					const n = s.getParent();
					if (xs$1(n) && !r.has(t)) {
						r.add(t), Y$1(s, e);
						break;
					}
					s = n;
				}
			}
		}
	}
}
function Q$2(e, t) {
	e.splice(e.getChildrenSize(), 0, t);
}
function Y$1(e, t) {
	if (me$1(e)) return e;
	const n = e.getPreviousSibling(), r = e.getNextSibling(), i = ce$2();
	let s;
	if (Q$2(i, e.getChildren()), me$1(n) && t === n.getListType()) n.append(i), me$1(r) && t === r.getListType() && (Q$2(n, r.getChildren()), r.remove()), s = n;
	else if (me$1(r) && t === r.getListType()) r.getFirstChildOrThrow().insertBefore(i), s = r;
	else {
		const n = pe$2(t);
		n.append(i), e.replace(n), s = n;
	}
	i.setFormat(e.getFormatType()), i.setIndent(e.getIndent());
	const o = $r$2();
	return wr(o) && (s.getKey() === o.anchor.key && o.anchor.set(i.getKey(), o.anchor.offset, "element"), s.getKey() === o.focus.key && o.focus.set(i.getKey(), o.focus.offset, "element")), e.remove(), s;
}
function Z$1(e, t) {
	const n = e.getLastChild(), r = t.getFirstChild();
	n && r && j$3(n) && j$3(r) && (Z$1(n.getFirstChild(), r.getFirstChild()), r.remove());
	const i = t.getChildren();
	i.length > 0 && e.append(...i), t.remove();
}
function ee$2() {
	const e = $r$2();
	if (wr(e)) {
		const t = /* @__PURE__ */ new Set(), r = e.getNodes(), i = e.anchor.getNode();
		if (H$2(i, r)) t.add(z$3(i));
		else for (let e = 0; e < r.length; e++) {
			const i = r[e];
			if (ko$1(i)) {
				const e = vt$5(i, se$1);
				null != e && t.add(z$3(e));
			}
		}
		for (const n of t) {
			let t = n;
			const r = X$2(n);
			for (const n of r) {
				const r = Vi().setTextStyle(e.style).setTextFormat(e.format);
				Q$2(r, n.getChildren()), t.insertAfter(r), t = r, n.__key === e.anchor.key && Ml$1(e.anchor, zl(gl$1(r, "next"))), n.__key === e.focus.key && Ml$1(e.focus, zl(gl$1(r, "next"))), n.remove();
			}
			n.remove();
		}
	}
}
function te$1(e) {
	const t = "check" !== e.getListType();
	let n = e.getStart();
	for (const r of e.getChildren()) ae$1(r) && (r.getValue() !== n && r.setValue(n), t && null != r.getLatest().__checked && r.setChecked(void 0), me$1(r.getFirstChild()) || n++);
}
function ne$1(e) {
	const t = /* @__PURE__ */ new Set();
	if (j$3(e) || t.has(e.getKey())) return;
	const n = e.getParent(), r = e.getNextSibling(), i = e.getPreviousSibling();
	if (j$3(r) && j$3(i)) {
		const n = i.getFirstChild();
		if (me$1(n)) {
			n.append(e);
			const i = r.getFirstChild();
			if (me$1(i)) Q$2(n, i.getChildren()), r.remove(), t.add(r.getKey());
		}
	} else if (j$3(r)) {
		const t = r.getFirstChild();
		if (me$1(t)) {
			const n = t.getFirstChild();
			null !== n && n.insertBefore(e);
		}
	} else if (j$3(i)) {
		const t = i.getFirstChild();
		me$1(t) && t.append(e);
	} else if (me$1(n)) {
		const t = ce$2().setTextFormat(e.getTextFormat()).setTextStyle(e.getTextStyle()), s = pe$2(n.getListType()).setTextFormat(n.getTextFormat()).setTextStyle(n.getTextStyle());
		t.append(s), s.append(e), i ? i.insertAfter(t) : r ? r.insertBefore(t) : n.append(t);
	}
}
function re(e) {
	if (j$3(e)) return;
	const t = e.getParent(), n = t ? t.getParent() : void 0;
	if (me$1(n ? n.getParent() : void 0) && ae$1(n) && me$1(t)) {
		const r = t ? t.getFirstChild() : void 0, i = t ? t.getLastChild() : void 0;
		if (e.is(r)) n.insertBefore(e), t.isEmpty() && n.remove();
		else if (e.is(i)) n.insertAfter(e), t.isEmpty() && n.remove();
		else {
			const r = t.getListType(), i = ce$2(), s = pe$2(r);
			i.append(s), e.getPreviousSiblings().forEach((e) => s.append(e));
			const o = ce$2(), l = pe$2(r);
			o.append(l), Q$2(l, e.getNextSiblings()), n.insertBefore(i), n.insertAfter(o), n.replace(e);
		}
	}
}
function ie$2(e = !1) {
	const t = $r$2();
	if (!wr(t) || !t.isCollapsed()) return !1;
	const n = t.anchor.getNode();
	let r = null;
	if (ae$1(n) && 0 === n.getChildrenSize()) r = n;
	else if (yr$1(n)) {
		const e = n.getParent();
		ae$1(e) && e.getChildren().every((e) => yr$1(e) && "" === e.getTextContent().trim()) && (r = e);
	}
	if (null === r) return !1;
	const i = z$3(r), s = r.getParent();
	me$1(s) || $$2(40);
	const o = s.getParent();
	let l;
	if (xs$1(o)) l = Vi(), i.insertAfter(l);
	else {
		if (!ae$1(o)) return !1;
		l = ce$2(), o.insertAfter(l);
	}
	l.setTextStyle(t.style).setTextFormat(t.format).select();
	const c = r.getNextSiblings();
	if (c.length > 0) {
		const t = e ? function(e, t) {
			return e.getStart() + t.getIndexWithinParent();
		}(s, r) : 1, n = pe$2(s.getListType(), t);
		if (ae$1(l)) {
			const e = ce$2();
			e.append(n), l.insertAfter(e);
		} else l.insertAfter(n);
		n.append(...c);
	}
	return function(e) {
		let t = e;
		for (; null == t.getNextSibling() && null == t.getPreviousSibling();) {
			const e = t.getParent();
			if (null == e || !ae$1(e) && !me$1(e)) break;
			t = e;
		}
		t.remove();
	}(r), !0;
}
var se$1 = class extends Ai {
	__value;
	__checked;
	$config() {
		return this.config("listitem", {
			$transform: (e) => {
				if (null == e.__checked) return;
				const t = e.getParent();
				me$1(t) && "check" !== t.getListType() && null != e.getChecked() && e.setChecked(void 0);
			},
			extends: Ai,
			importDOM: Ln$1({ li: () => ({
				conversion: oe$2,
				priority: 0
			}) })
		});
	}
	constructor(e = 1, t = void 0, n) {
		super(n), this.__value = void 0 === e ? 1 : e, this.__checked = t;
	}
	afterCloneFrom(e) {
		super.afterCloneFrom(e), this.__value = e.__value, this.__checked = e.__checked;
	}
	createDOM(e) {
		const t = document.createElement("li");
		return this.updateListItemDOM(null, t, e), t;
	}
	updateListItemDOM(e, t, n) {
		(function(e, t, n) {
			const r = t.getParent();
			!me$1(r) || "check" !== r.getListType() || me$1(t.getFirstChild()) ? (e.removeAttribute("role"), e.removeAttribute("tabIndex"), e.removeAttribute("aria-checked")) : (e.setAttribute("role", "checkbox"), e.setAttribute("tabIndex", "-1"), n && t.__checked === n.__checked || e.setAttribute("aria-checked", t.getChecked() ? "true" : "false"));
		})(t, this, e), t.value = this.__value, function(e, t, n) {
			const s = [], o = [], l = t.list, c = l ? l.listitem : void 0;
			let a;
			l && l.nested && (a = l.nested.listitem);
			void 0 !== c && s.push(...Ql$1(c));
			if (l) {
				const e = n.getParent(), t = me$1(e) && "check" === e.getListType(), r = n.getChecked();
				t && !r || o.push(l.listitemUnchecked), t && r || o.push(l.listitemChecked), t && s.push(r ? l.listitemChecked : l.listitemUnchecked);
			}
			if (void 0 !== a) {
				const e = Ql$1(a);
				n.getChildren().some((e) => me$1(e)) ? s.push(...e) : o.push(...e);
			}
			o.length > 0 && tc(e, ...o);
			s.length > 0 && Zl$1(e, ...s);
		}(t, n.theme, this);
		const s = e ? e.__style : "", o = this.__style;
		s !== o && ("" === o ? t.removeAttribute("style") : t.style.cssText = o), function(e, t, n) {
			const r = b$3(t.__textStyle);
			for (const t in r) e.style.setProperty(`--listitem-marker-${t}`, r[t]);
			if (n) for (const t in b$3(n.__textStyle)) t in r || e.style.removeProperty(`--listitem-marker-${t}`);
		}(t, this, e);
	}
	updateDOM(e, t, n) {
		const r = t;
		return this.updateListItemDOM(e, r, n), !1;
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setValue(e.value).setChecked(e.checked);
	}
	exportDOM(e) {
		const t = this.createDOM(e._config), n = this.getFormatType();
		n && (t.style.textAlign = n);
		const r = this.getDirection();
		return r && (t.dir = r), { element: t };
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			checked: this.getChecked(),
			value: this.getValue()
		};
	}
	append(...e) {
		for (let t = 0; t < e.length; t++) {
			const n = e[t];
			if (Pi$1(n) && this.canMergeWith(n)) {
				const e = n.getChildren();
				this.append(...e), n.remove();
			} else super.append(n);
		}
		return this;
	}
	replace(e, t) {
		if (ae$1(e)) return super.replace(e);
		this.setIndent(0);
		const n = this.getParentOrThrow();
		if (!me$1(n)) return e;
		if (n.__first === this.getKey()) n.insertBefore(e);
		else if (n.__last === this.getKey()) n.insertAfter(e);
		else {
			const t = pe$2(n.getListType());
			let r = this.getNextSibling();
			for (; r;) {
				const e = r;
				r = r.getNextSibling(), t.append(e);
			}
			n.insertAfter(e), e.insertAfter(t);
		}
		return t && (Pi$1(e) || $$2(139), this.getChildren().forEach((t) => {
			e.append(t);
		})), this.remove(), 0 === n.getChildrenSize() && n.remove(), e;
	}
	insertAfter(e, t = !0) {
		const n = this.getParentOrThrow();
		if (me$1(n) || $$2(39), ae$1(e)) return super.insertAfter(e, t);
		const r = this.getNextSiblings();
		if (n.insertAfter(e, t), 0 !== r.length) {
			const i = pe$2(n.getListType());
			r.forEach((e) => i.append(e)), e.insertAfter(i, t);
		}
		return e;
	}
	remove(e) {
		const t = this.getPreviousSibling(), n = this.getNextSibling();
		super.remove(e), t && n && j$3(t) && j$3(n) && (Z$1(t.getFirstChild(), n.getFirstChild()), n.remove());
	}
	insertNewAfter(e, t = !0) {
		const n = ce$2().updateFromJSON(this.exportJSON()).setChecked(!this.getChecked() && void 0);
		return this.insertAfter(n, t), n;
	}
	collapseAtStart(e) {
		const t = Vi();
		this.getChildren().forEach((e) => t.append(e));
		const n = this.getParentOrThrow(), r = n.getParentOrThrow(), i = ae$1(r);
		if (1 === n.getChildrenSize()) if (i) n.remove(), r.select();
		else {
			n.insertBefore(t), n.remove();
			const r = e.anchor, i = e.focus, s = t.getKey();
			"element" === r.type && r.getNode().is(this) && r.set(s, r.offset, "element"), "element" === i.type && i.getNode().is(this) && i.set(s, i.offset, "element");
		}
		else n.insertBefore(t), this.remove();
		return !0;
	}
	getValue() {
		return this.getLatest().__value;
	}
	setValue(e) {
		const t = this.getWritable();
		return t.__value = e, t;
	}
	getChecked() {
		const e = this.getLatest();
		let t;
		const n = this.getParent();
		return me$1(n) && (t = n.getListType()), "check" === t ? Boolean(e.__checked) : void 0;
	}
	setChecked(e) {
		const t = this.getWritable();
		return t.__checked = e, t;
	}
	toggleChecked() {
		const e = this.getWritable();
		return e.setChecked(!e.__checked);
	}
	getIndent() {
		const e = this.getParent();
		if (null === e || !this.isAttached()) return this.getLatest().__indent;
		let t = e.getParentOrThrow(), n = 0;
		for (; ae$1(t);) t = t.getParentOrThrow().getParentOrThrow(), n++;
		return n;
	}
	setIndent(e) {
		"number" != typeof e && $$2(117), (e = Math.floor(e)) >= 0 || $$2(199);
		let t = this.getIndent();
		for (; t !== e;) t < e ? (ne$1(this), t++) : (re(this), t--);
		return this;
	}
	canInsertAfter(e) {
		return ae$1(e);
	}
	canReplaceWith(e) {
		return ae$1(e);
	}
	canMergeWith(e) {
		return ae$1(e) || Yi$1(e);
	}
	extractWithChild(e, t) {
		if (!wr(t)) return !1;
		const n = t.anchor.getNode(), r = t.focus.getNode();
		return this.isParentOf(n) && this.isParentOf(r) && this.getTextContent().length === t.getTextContent().length;
	}
	isParentRequired() {
		return !0;
	}
	createParentElementNode() {
		return pe$2("bullet");
	}
	canMergeWhenEmpty() {
		return !0;
	}
};
function oe$2(e) {
	if (e.classList.contains("task-list-item")) {
		for (const t of e.children) if ("INPUT" === t.tagName) return le$1(t);
	}
	if (e.classList.contains("joplin-checkbox")) {
		for (const t of e.children) if (t.classList.contains("checkbox-wrapper") && t.children.length > 0 && "INPUT" === t.children[0].tagName) return le$1(t.children[0]);
	}
	const t = e.getAttribute("aria-checked");
	return { node: ce$2("true" === t || "false" !== t && void 0) };
}
function le$1(e) {
	if (!("checkbox" === e.getAttribute("type"))) return { node: null };
	return { node: ce$2(e.hasAttribute("checked")) };
}
function ce$2(e) {
	return Ss$1(new se$1(void 0, e));
}
function ae$1(e) {
	return e instanceof se$1;
}
var ue$1 = class extends Ai {
	__tag;
	__start;
	__listType;
	$config() {
		return this.config("list", {
			$transform: (e) => {
				(function(e) {
					const t = e.getNextSibling();
					me$1(t) && e.getListType() === t.getListType() && Z$1(e, t);
				})(e), te$1(e);
			},
			extends: Ai,
			importDOM: Ln$1({
				ol: () => ({
					conversion: de$1,
					priority: 0
				}),
				ul: () => ({
					conversion: de$1,
					priority: 0
				})
			})
		});
	}
	constructor(e = "number", t = 1, n) {
		super(n);
		const r = fe$2[e] || e;
		this.__listType = r, this.__tag = "number" === r ? "ol" : "ul", this.__start = t;
	}
	afterCloneFrom(e) {
		super.afterCloneFrom(e), this.__listType = e.__listType, this.__tag = e.__tag, this.__start = e.__start;
	}
	getTag() {
		return this.getLatest().__tag;
	}
	setListType(e) {
		const t = this.getWritable();
		return t.__listType = e, t.__tag = "number" === e ? "ol" : "ul", t;
	}
	getListType() {
		return this.getLatest().__listType;
	}
	getStart() {
		return this.getLatest().__start;
	}
	setStart(e) {
		const t = this.getWritable();
		return t.__start = e, t;
	}
	createDOM(e, t) {
		const n = this.__tag, r = document.createElement(n);
		return 1 !== this.__start && r.setAttribute("start", String(this.__start)), r.__lexicalListType = this.__listType, ge(r, e.theme, this), r;
	}
	updateDOM(e, t, n) {
		return e.__tag !== this.__tag || e.__listType !== this.__listType || (ge(t, n.theme, this), e.__start !== this.__start && t.setAttribute("start", String(this.__start)), !1);
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setListType(e.listType).setStart(e.start);
	}
	exportDOM(e) {
		const t = this.createDOM(e._config, e);
		return Ms$1(t) && (1 !== this.__start && t.setAttribute("start", String(this.__start)), "check" === this.__listType && t.setAttribute("__lexicalListType", "check")), { element: t };
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			listType: this.getListType(),
			start: this.getStart(),
			tag: this.getTag()
		};
	}
	canBeEmpty() {
		return !1;
	}
	canIndent() {
		return !1;
	}
	splice(e, t, n) {
		let r = n;
		for (let e = 0; e < n.length; e++) {
			const t = n[e];
			ae$1(t) || (r === n && (r = [...n]), r[e] = ce$2().append(!Pi$1(t) || me$1(t) || t.isInline() ? t : pr$2(t.getTextContent())));
		}
		return super.splice(e, t, r);
	}
	extractWithChild(e) {
		return ae$1(e);
	}
};
function ge(e, t, n) {
	const s = [], o = [], l = t.list;
	if (void 0 !== l) {
		const e = l[`${n.__tag}Depth`] || [], t = V$2(n) - 1, r = t % e.length, i = e[r], c = l[n.__tag];
		let a;
		const u = l.nested, g = l.checklist;
		if (void 0 !== u && u.list && (a = u.list), void 0 !== c && s.push(c), void 0 !== g && "check" === n.__listType && s.push(g), void 0 !== i) {
			s.push(...Ql$1(i));
			for (let t = 0; t < e.length; t++) t !== r && o.push(n.__tag + t);
		}
		if (void 0 !== a) {
			const e = Ql$1(a);
			t > 1 ? s.push(...e) : o.push(...e);
		}
	}
	o.length > 0 && tc(e, ...o), s.length > 0 && Zl$1(e, ...s);
}
function he(e) {
	const t = [];
	for (let n = 0; n < e.length; n++) {
		const r = e[n];
		if (ae$1(r)) {
			t.push(r);
			const e = r.getChildren();
			e.length > 1 && e.forEach((e) => {
				me$1(e) && t.push(q$2(e));
			});
		} else t.push(q$2(r));
	}
	return t;
}
function de$1(e) {
	const t = e.nodeName.toLowerCase();
	let n = null;
	if ("ol" === t) n = pe$2("number", e.start);
	else "ul" === t && (n = function(e) {
		if ("check" === e.getAttribute("__lexicallisttype") || e.classList.contains("contains-task-list") || "1" === e.getAttribute("data-is-checklist")) return !0;
		for (const t of e.childNodes) if (Ms$1(t) && t.hasAttribute("aria-checked")) return !0;
		return !1;
	}(e) ? pe$2("check") : pe$2("bullet"));
	return {
		after: he,
		node: n
	};
}
var fe$2 = {
	ol: "number",
	ul: "bullet"
};
function pe$2(e = "number", t = 1) {
	return Ss$1(new ue$1(e, t));
}
function me$1(e) {
	return e instanceof ue$1;
}
var Se$1 = ne$4("UPDATE_LIST_START_COMMAND"), xe = ne$4("INSERT_UNORDERED_LIST_COMMAND"), ke$3 = ne$4("INSERT_ORDERED_LIST_COMMAND"), be$1 = ne$4("REMOVE_LIST_COMMAND");
function Le$2(e, t) {
	return ec(e.registerCommand(ke$3, () => (G$3("number"), !0), 1), e.registerCommand(Se$1, (e) => {
		const { listNodeKey: t, newStart: n } = e, r = Mo$1(t);
		return !!me$1(r) && ("number" === r.getListType() && (r.setStart(n), te$1(r)), !0);
	}, 1), e.registerCommand(xe, () => (G$3("bullet"), !0), 1), e.registerCommand(be$1, () => (ee$2(), !0), 1), e.registerCommand(de$4, () => ie$2(!!(t && t.restoreNumbering)), 1), e.registerNodeTransform(se$1, (e) => {
		const t = e.getFirstChild();
		if (t) {
			if (yr$1(t)) {
				const n = t.getStyle(), r = t.getFormat();
				e.getTextStyle() !== n && e.setTextStyle(n), e.getTextFormat() !== r && e.setTextFormat(r);
			}
		} else {
			const t = $r$2();
			wr(t) && (t.style !== e.getTextStyle() || t.format !== e.getTextFormat()) && t.isCollapsed() && e.is(t.anchor.getNode()) && e.setTextStyle(t.style).setTextFormat(t.format);
		}
	}), e.registerNodeTransform(lr$2, (e) => {
		const t = e.getParent();
		if (ae$1(t) && e.is(t.getFirstChild())) {
			const n = e.getStyle(), r = e.getFormat();
			n === t.getTextStyle() && r === t.getTextFormat() || t.setTextStyle(n).setTextFormat(r);
		}
	}));
}
function Ne$1(e) {
	const t = (e) => {
		const t = e.getParent();
		if (me$1(e.getFirstChild()) || !me$1(t)) return;
		const n = qs(e, (e) => ae$1(e) && me$1(e.getParent()) && ae$1(e.getPreviousSibling()));
		if (null === n && e.getIndent() > 0) e.setIndent(0);
		else if (ae$1(n)) {
			const r = n.getPreviousSibling();
			if (ae$1(r)) {
				const i = function(e) {
					let t = e, n = t.getFirstChild();
					for (; me$1(n);) {
						const e = n.getLastChild();
						if (!ae$1(e)) break;
						t = e, n = t.getFirstChild();
					}
					return t;
				}(r).getParent();
				if (me$1(i)) {
					const n = V$2(i);
					n + 1 < V$2(t) && e.setIndent(n);
				}
			}
		}
	};
	return e.registerNodeTransform(ue$1, (e) => {
		const n = [e];
		for (; n.length > 0;) {
			const e = n.shift();
			if (me$1(e)) {
				for (const r of e.getChildren()) if (ae$1(r)) {
					t(r);
					const e = r.getFirstChild();
					me$1(e) && n.push(e);
				}
			}
		}
	});
}
//#endregion
//#region node_modules/@lexical/html/LexicalHtml.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function m$2(e, n) {
	const t = So(n) ? n.body.childNodes : n.childNodes;
	let l = [];
	const r = [];
	for (const n of t) if (!w$2.has(n.nodeName)) {
		const t = y$1(n, e, r, !1);
		null !== t && (l = l.concat(t));
	}
	return function(e) {
		for (const n of e) n.getNextSibling() instanceof ji$1 && n.insertAfter(Qn$2());
		for (const n of e) {
			const e = n.getChildren();
			for (const t of e) n.insertBefore(t);
			n.remove();
		}
	}(r), l;
}
function g$1(e, n) {
	if ("undefined" == typeof document || "undefined" == typeof window && void 0 === global.window) throw new Error("To use $generateHtmlFromNodes in headless mode please initialize a headless browser implementation such as JSDom before calling this function.");
	const t = document.createElement("div"), o = Io$1().getChildren();
	for (let l = 0; l < o.length; l++) x$1(e, o[l], t, n);
	return t.innerHTML;
}
function x$1(t, o, l, u = null) {
	let f = null === u || o.isSelected(u);
	const a = Pi$1(o) && o.excludeFromCopy("html");
	let d = o;
	null !== u && yr$1(o) && (d = M$4(u, o, "clone"));
	const p = Pi$1(d) ? d.getChildren() : [], h = co$1(t, d.getType());
	let m;
	m = h && void 0 !== h.exportDOM ? h.exportDOM(t, d) : d.exportDOM(t);
	const { element: g, after: w } = m;
	if (!g) return !1;
	const y = document.createDocumentFragment();
	for (let e = 0; e < p.length; e++) {
		const n = p[e], l = x$1(t, n, y, u);
		!f && Pi$1(o) && l && o.extractWithChild(n, u, "html") && (f = !0);
	}
	if (f && !a) {
		if ((Ms$1(g) || Ps(g)) && g.append(y), l.append(g), w) {
			const e = w.call(d, g);
			e && (Ps(g) ? g.replaceChildren(e) : g.replaceWith(e));
		}
	} else l.append(y);
	return f;
}
var w$2 = new Set(["STYLE", "SCRIPT"]);
function y$1(e, n, o, l, i = /* @__PURE__ */ new Map(), s) {
	let c = [];
	if (w$2.has(e.nodeName)) return c;
	let m = null;
	const g = function(e, n) {
		const { nodeName: t } = e, o = n._htmlConversions.get(t.toLowerCase());
		let l = null;
		if (void 0 !== o) for (const n of o) {
			const t = n(e);
			null !== t && (null === l || (l.priority || 0) <= (t.priority || 0)) && (l = t);
		}
		return null !== l ? l.conversion : null;
	}(e, n), x = g ? g(e) : null;
	let b = null;
	if (null !== x) {
		b = x.after;
		const n = x.node;
		if (m = Array.isArray(n) ? n[n.length - 1] : n, null !== m) {
			for (const [, e] of i) if (m = e(m, s), !m) break;
			m && c.push(...Array.isArray(n) ? n : [m]);
		}
		null != x.forChild && i.set(e.nodeName, x.forChild);
	}
	const S = e.childNodes;
	let v = [];
	const N = (null == m || !xs$1(m)) && (null != m && Rr$1(m) || l);
	for (let e = 0; e < S.length; e++) v.push(...y$1(S[e], n, o, N, new Map(i), m));
	return null != b && (v = b(v)), Fs$1(e) && (v = C$2(e, v, N ? () => {
		const e = new ji$1();
		return o.push(e), e;
	} : Vi)), null == m ? v.length > 0 ? c = c.concat(v) : Fs$1(e) && function(e) {
		if (null == e.nextSibling || null == e.previousSibling) return !1;
		return Ds$1(e.nextSibling) && Ds$1(e.previousSibling);
	}(e) && (c = c.concat(Qn$2())) : Pi$1(m) && m.append(...v), c;
}
function C$2(e, n, t) {
	const o = e.style.textAlign, l = [];
	let r = [];
	for (let e = 0; e < n.length; e++) {
		const i = n[e];
		if (Rr$1(i)) o && !i.getFormat() && i.setFormat(o), l.push(i);
		else if (r.push(i), e === n.length - 1 || e < n.length - 1 && Rr$1(n[e + 1])) {
			const e = t();
			e.setFormat(o), e.append(...r), l.push(e), r = [];
		}
	}
	return l;
}
//#endregion
//#region node_modules/@lexical/clipboard/LexicalClipboard.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function v$2(t, ...e) {
	const n = new URL("https://lexical.dev/docs/error"), o = new URLSearchParams();
	o.append("code", t);
	for (const t of e) o.append("v", t);
	throw n.search = o.toString(), Error(`Minified Lexical error #${t}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
function D$1(e, n = $r$2()) {
	return n ?? v$2(166), wr(n) && n.isCollapsed() || 0 === n.getNodes().length ? "" : g$1(e, n);
}
function S$1(t, e = $r$2()) {
	return e ?? v$2(166), wr(e) && e.isCollapsed() || 0 === e.getNodes().length ? null : JSON.stringify(E$2(t, e));
}
function R$1(t, n, o) {
	const r = t.getData("application/x-lexical-editor");
	if (r) try {
		const t = JSON.parse(r);
		if (t.namespace === o._config.namespace && Array.isArray(t.nodes)) return A$3(o, L$2(t.nodes), n);
	} catch (t) {
		console.error(t);
	}
	const c = t.getData("text/html"), a = t.getData("text/plain");
	if (c && a !== c) try {
		return A$3(o, m$2(o, new DOMParser().parseFromString(function(t) {
			if (window.trustedTypes && window.trustedTypes.createPolicy) return window.trustedTypes.createPolicy("lexical", { createHTML: (t) => t }).createHTML(t);
			return t;
		}(c), "text/html")), n);
	} catch (t) {
		console.error(t);
	}
	const u = a || t.getData("text/uri-list");
	if (null != u) if (wr(n)) {
		const t = u.split(/(\r?\n|\t)/);
		"" === t[t.length - 1] && t.pop();
		for (let e = 0; e < t.length; e++) {
			const n = $r$2();
			if (wr(n)) {
				const o = t[e];
				"\n" === o || "\r\n" === o ? n.insertParagraph() : "	" === o ? n.insertNodes([Cr$1()]) : n.insertText(o);
			}
		}
	} else n.insertRawText(u);
}
function A$3(t, e, n) {
	t.dispatchCommand(ie$3, {
		nodes: e,
		selection: n
	}) || (n.insertNodes(e), function(t) {
		if (wr(t) && t.isCollapsed()) {
			const e = t.anchor;
			let n = null;
			const o = Ol$1(e, "previous");
			if (o) if (rl$1(o)) n = o.origin;
			else {
				const t = vl$1(o, gl$1(Io$1(), "next").getFlipped());
				for (const e of t) {
					if (yr$1(e.origin)) {
						n = e.origin;
						break;
					}
					if (Pi$1(e.origin) && !e.origin.isInline()) break;
				}
			}
			if (n && yr$1(n)) {
				const e = n.getFormat(), o = n.getStyle();
				t.format === e && t.style === o || (t.format = e, t.style = o, t.dirty = !0);
			}
		}
	}(n));
}
function P$2(t, e, n, r = []) {
	let i = null === e || n.isSelected(e);
	const l = Pi$1(n) && n.excludeFromCopy("html");
	let s = n;
	null !== e && yr$1(s) && (s = M$4(e, s, "clone"));
	const c = Pi$1(s) ? s.getChildren() : [], a = function(t) {
		const e = t.exportJSON(), n = t.constructor;
		if (e.type !== n.getType() && v$2(58, n.name), Pi$1(t)) {
			const t = e.children;
			Array.isArray(t) || v$2(59, n.name);
		}
		return e;
	}(s);
	yr$1(s) && 0 === s.getTextContentSize() && (i = !1);
	for (let o = 0; o < c.length; o++) {
		const r = c[o], l = P$2(t, e, r, a.children);
		!i && Pi$1(n) && l && n.extractWithChild(r, e, "clone") && (i = !0);
	}
	if (i && !l) r.push(a);
	else if (Array.isArray(a.children)) for (let t = 0; t < a.children.length; t++) {
		const e = a.children[t];
		r.push(e);
	}
	return i;
}
function E$2(t, e) {
	const n = [], o = Io$1().getChildren();
	for (let r = 0; r < o.length; r++) P$2(t, e, o[r], n);
	return {
		namespace: t._config.namespace,
		nodes: n
	};
}
function L$2(t) {
	const e = [];
	for (let o = 0; o < t.length; o++) {
		const r = t[o], i = Si(r);
		yr$1(i) && $$5(i), e.push(i);
	}
	return e;
}
var b$2 = null;
async function F$3(t, e, n) {
	if (null !== b$2) return !1;
	if (null !== e) return new Promise((o, r) => {
		t.update(() => {
			o(M$2(t, e, n));
		});
	});
	const o = t.getRootElement(), i = t._window || window, l = i.document, s = bs$1(i);
	if (null === o || null === s) return !1;
	const c = l.createElement("span");
	c.style.cssText = "position: fixed; top: -1000px;", c.append(l.createTextNode("#")), o.append(c);
	const a = new Range();
	return a.setStart(c, 0), a.setEnd(c, 1), s.removeAllRanges(), s.addRange(a), new Promise((e, o) => {
		const s = t.registerCommand(Je$1, (o) => (At$5(o, ClipboardEvent) && (s(), null !== b$2 && (i.clearTimeout(b$2), b$2 = null), e(M$2(t, o, n))), !0), 4);
		b$2 = i.setTimeout(() => {
			s(), b$2 = null, e(!1);
		}, 50), l.execCommand("copy"), c.remove();
	});
}
function M$2(t, e, n) {
	if (void 0 === n) {
		const e = bs$1(t._window), o = $r$2();
		if (!o || o.isCollapsed()) return !1;
		if (!e) return !1;
		const r = e.anchorNode, l = e.focusNode;
		if (null !== r && null !== l && !ho$1(t, r, l)) return !1;
		n = _$1(o);
	}
	e.preventDefault();
	const o = e.clipboardData;
	return null !== o && (J$3(o, n), !0);
}
var O$1 = [["text/html", D$1], ["application/x-lexical-editor", S$1]];
function _$1(t = $r$2()) {
	const e = { "text/plain": t ? t.getTextContent() : "" };
	if (t) {
		const n = Is$1();
		for (const [o, r] of O$1) {
			const i = r(n, t);
			null !== i && (e[o] = i);
		}
	}
	return e;
}
function J$3(t, e) {
	for (const [n] of O$1) void 0 === e[n] && t.setData(n, "");
	for (const n in e) {
		const o = e[n];
		void 0 !== o && t.setData(n, o);
	}
}
//#endregion
//#region node_modules/@lexical/dragon/LexicalDragon.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function s$2(e) {
	const t = window.location.origin, n = (n) => {
		if (n.origin !== t) return;
		const o = e.getRootElement();
		if (document.activeElement !== o) return;
		const s = n.data;
		if ("string" == typeof s) {
			let t;
			try {
				t = JSON.parse(s);
			} catch (e) {
				return;
			}
			if (t && "nuanria_messaging" === t.protocol && "request" === t.type) {
				const o = t.payload;
				if (o && "makeChanges" === o.functionId) {
					const t = o.args;
					if (t) {
						const [o, s, d, c, g] = t;
						e.update(() => {
							const e = $r$2();
							if (wr(e)) {
								const t = e.anchor;
								let i = t.getNode(), a = 0, l = 0;
								if (yr$1(i) && o >= 0 && s >= 0 && (a = o, l = o + s, e.setTextNodeRange(i, a, i, l)), a === l && "" === d || (e.insertRawText(d), i = t.getNode()), yr$1(i)) {
									a = c, l = c + g;
									const t = i.getTextContentSize();
									a = a > t ? t : a, l = l > t ? t : l, e.setTextNodeRange(i, a, i, l);
								}
								n.stopImmediatePropagation();
							}
						});
					}
				}
			}
		}
	};
	return window.addEventListener("message", n, !0), () => {
		window.removeEventListener("message", n, !0);
	};
}
//#endregion
//#region node_modules/@lexical/rich-text/LexicalRichText.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function pt$3(t, e) {
	if (void 0 !== document.caretRangeFromPoint) {
		const n = document.caretRangeFromPoint(t, e);
		return null === n ? null : {
			node: n.startContainer,
			offset: n.startOffset
		};
	}
	if ("undefined" !== document.caretPositionFromPoint) {
		const n = document.caretPositionFromPoint(t, e);
		return null === n ? null : {
			node: n.offsetNode,
			offset: n.offset
		};
	}
	return null;
}
var ht$2 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement, vt$3 = ht$2 && "documentMode" in document ? document.documentMode : null, Ct$2 = ht$2 && /Mac|iPod|iPhone|iPad/.test(navigator.platform), yt$2 = !(!ht$2 || !("InputEvent" in window) || vt$3) && "getTargetRanges" in new window.InputEvent("input"), xt$2 = ht$2 && /Version\/[\d.]+.*Safari/.test(navigator.userAgent), Dt$3 = ht$2 && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, Nt$1 = ht$2 && /^(?=.*Chrome).*/i.test(navigator.userAgent), wt$3 = ht$2 && /AppleWebKit\/[\d.]+/.test(navigator.userAgent) && Ct$2 && !Nt$1, Et$2 = ne$4("DRAG_DROP_PASTE_FILE");
var _t$3 = class _t$3 extends Ai {
	static getType() {
		return "quote";
	}
	static clone(t) {
		return new _t$3(t.__key);
	}
	createDOM(t) {
		const e = document.createElement("blockquote");
		return Zl$1(e, t.theme.quote), e;
	}
	updateDOM(t, e) {
		return !1;
	}
	static importDOM() {
		return { blockquote: (t) => ({
			conversion: St$3,
			priority: 0
		}) };
	}
	exportDOM(t) {
		const { element: e } = super.exportDOM(t);
		if (Ms$1(e)) {
			this.isEmpty() && e.append(document.createElement("br"));
			const t = this.getFormatType();
			t && (e.style.textAlign = t);
			const n = this.getDirection();
			n && (e.dir = n);
		}
		return { element: e };
	}
	static importJSON(t) {
		return Ot$3().updateFromJSON(t);
	}
	insertNewAfter(t, e) {
		const n = Vi(), r = this.getDirection();
		return n.setDirection(r), this.insertAfter(n, e), n;
	}
	collapseAtStart() {
		const t = Vi();
		return this.getChildren().forEach((e) => t.append(e)), this.replace(t), !0;
	}
	canMergeWhenEmpty() {
		return !0;
	}
};
function Ot$3() {
	return Ss$1(new _t$3());
}
function Pt$3(t) {
	return t instanceof _t$3;
}
var Tt$3 = class Tt$3 extends Ai {
	__tag;
	static getType() {
		return "heading";
	}
	static clone(t) {
		return new Tt$3(t.__tag, t.__key);
	}
	constructor(t, e) {
		super(e), this.__tag = t;
	}
	getTag() {
		return this.__tag;
	}
	setTag(t) {
		const e = this.getWritable();
		return this.__tag = t, e;
	}
	createDOM(t) {
		const e = this.__tag, n = document.createElement(e), r = t.theme.heading;
		if (void 0 !== r) {
			const t = r[e];
			Zl$1(n, t);
		}
		return n;
	}
	updateDOM(t, e, n) {
		return t.__tag !== this.__tag;
	}
	static importDOM() {
		return {
			h1: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			h2: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			h3: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			h4: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			h5: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			h6: (t) => ({
				conversion: At$3,
				priority: 0
			}),
			p: (t) => {
				const e = t.firstChild;
				return null !== e && Ft$3(e) ? {
					conversion: () => ({ node: null }),
					priority: 3
				} : null;
			},
			span: (t) => Ft$3(t) ? {
				conversion: (t) => ({ node: Mt$3("h1") }),
				priority: 3
			} : null
		};
	}
	exportDOM(t) {
		const { element: e } = super.exportDOM(t);
		if (Ms$1(e)) {
			this.isEmpty() && e.append(document.createElement("br"));
			const t = this.getFormatType();
			t && (e.style.textAlign = t);
			const n = this.getDirection();
			n && (e.dir = n);
		}
		return { element: e };
	}
	static importJSON(t) {
		return Mt$3(t.tag).updateFromJSON(t);
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setTag(t.tag);
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			tag: this.getTag()
		};
	}
	insertNewAfter(t, e = !0) {
		const n = t ? t.anchor.offset : 0, r = this.getLastDescendant(), o = !r || t && t.anchor.key === r.getKey() && n === r.getTextContentSize() || !t ? Vi() : Mt$3(this.getTag()), i = this.getDirection();
		if (o.setDirection(i), this.insertAfter(o, e), 0 === n && !this.isEmpty() && t) {
			const t = Vi();
			t.select(), this.replace(t, !0);
		}
		return o;
	}
	collapseAtStart() {
		const t = this.isEmpty() ? Vi() : Mt$3(this.getTag());
		return this.getChildren().forEach((e) => t.append(e)), this.replace(t), !0;
	}
	extractWithChild() {
		return !0;
	}
};
function Ft$3(t) {
	return "span" === t.nodeName.toLowerCase() && "26pt" === t.style.fontSize;
}
function At$3(t) {
	const e = t.nodeName.toLowerCase();
	let n = null;
	return "h1" !== e && "h2" !== e && "h3" !== e && "h4" !== e && "h5" !== e && "h6" !== e || (n = Mt$3(e), null !== t.style && (Js$1(t, n), n.setFormat(t.style.textAlign))), { node: n };
}
function St$3(t) {
	const e = Ot$3();
	return null !== t.style && (e.setFormat(t.style.textAlign), Js$1(t, e)), { node: e };
}
function Mt$3(t = "h1") {
	return Ss$1(new Tt$3(t));
}
function It$3(t) {
	return t instanceof Tt$3;
}
function bt$2(t) {
	let e = null;
	if (At$5(t, DragEvent) ? e = t.dataTransfer : At$5(t, ClipboardEvent) && (e = t.clipboardData), null === e) return [
		!1,
		[],
		!1
	];
	const n = e.types, r = n.includes("Files"), o = n.includes("text/html") || n.includes("text/plain");
	return [
		r,
		Array.from(e.files),
		o
	];
}
function Kt$2(t) {
	return Li$1(Do$1(t));
}
function kt$2(t) {
	for (const e of [
		"lowercase",
		"uppercase",
		"capitalize"
	]) t.hasFormat(e) && t.toggleFormat(e);
}
function Jt$2(n) {
	return ec(n.registerCommand(oe$5, (t) => {
		const e = $r$2();
		return !!Or$1(e) && (e.clear(), !0);
	}, 0), n.registerCommand(ue$3, (t) => {
		const e = $r$2();
		return wr(e) ? (e.deleteCharacter(t), !0) : !!Or$1(e) && (e.deleteNodes(), !0);
	}, 0), n.registerCommand(pe$4, (t) => {
		const e = $r$2();
		return !!wr(e) && (e.deleteWord(t), !0);
	}, 0), n.registerCommand(ye$3, (t) => {
		const e = $r$2();
		return !!wr(e) && (e.deleteLine(t), !0);
	}, 0), n.registerCommand(he$3, (e) => {
		const r = $r$2();
		if ("string" == typeof e) null !== r && r.insertText(e);
		else {
			if (null === r) return !1;
			const o = e.dataTransfer;
			if (null != o) R$1(o, r, n);
			else if (wr(r)) {
				const t = e.data;
				return t && r.insertText(t), !0;
			}
		}
		return !0;
	}, 0), n.registerCommand(_e$3, () => {
		const t = $r$2();
		return !!wr(t) && (t.removeText(), !0);
	}, 0), n.registerCommand(me$3, (t) => {
		const e = $r$2();
		return !!wr(e) && (e.formatText(t), !0);
	}, 0), n.registerCommand(ze$2, (t) => {
		const e = $r$2();
		if (!wr(e) && !Or$1(e)) return !1;
		const n = e.getNodes();
		for (const e of n) {
			const n = qs(e, (t) => Pi$1(t) && !t.isInline());
			null !== n && n.setFormat(t);
		}
		return !0;
	}, 0), n.registerCommand(fe$4, (t) => {
		const e = $r$2();
		return !!wr(e) && (e.insertLineBreak(t), !0);
	}, 0), n.registerCommand(de$4, () => {
		const t = $r$2();
		return !!wr(t) && (t.insertParagraph(), !0);
	}, 0), n.registerCommand(Fe$2, () => {
		const t = Cr$1(), e = $r$2();
		return wr(e) && (t.setFormat(e.format), t.setStyle(e.style)), ti$1([t]), !0;
	}, 0), n.registerCommand(Le$4, () => bt$4((t) => {
		const e = t.getIndent();
		t.setIndent(e + 1);
	}), 0), n.registerCommand(Ie$2, () => bt$4((t) => {
		const e = t.getIndent();
		e > 0 && t.setIndent(Math.max(0, e - 1));
	}), 0), n.registerCommand(be$3, (t) => {
		const e = $r$2();
		if (Or$1(e)) {
			const n = e.getNodes();
			if (n.length > 0) return t.preventDefault(), n[0].selectPrevious(), !0;
		} else if (wr(e)) {
			const n = os$1(e.focus, !0);
			if (!t.shiftKey && Li$1(n) && !n.isIsolated() && !n.isInline()) return n.selectPrevious(), t.preventDefault(), !0;
		}
		return !1;
	}, 0), n.registerCommand(we$3, (t) => {
		const e = $r$2();
		if (Or$1(e)) {
			const n = e.getNodes();
			if (n.length > 0) return t.preventDefault(), n[0].selectNext(0, 0), !0;
		} else if (wr(e)) {
			if (function(t) {
				const e = t.focus;
				return "root" === e.key && e.offset === Io$1().getChildrenSize();
			}(e)) return t.preventDefault(), !0;
			const n = os$1(e.focus, !1);
			if (!t.shiftKey && Li$1(n) && !n.isIsolated() && !n.isInline()) return n.selectNext(), t.preventDefault(), !0;
		}
		return !1;
	}, 0), n.registerCommand(ke$5, (t) => {
		const e = $r$2();
		if (Or$1(e)) {
			const n = e.getNodes();
			if (n.length > 0) return t.preventDefault(), A$4(n[0]) ? n[0].selectNext(0, 0) : n[0].selectPrevious(), !0;
		}
		if (!wr(e)) return !1;
		if (Z$4(e, !0)) {
			const n = t.shiftKey;
			return t.preventDefault(), ne$3(e, n, !0), !0;
		}
		return !1;
	}, 0), n.registerCommand(ve$3, (t) => {
		const e = $r$2();
		if (Or$1(e)) {
			const n = e.getNodes();
			if (n.length > 0) return t.preventDefault(), A$4(n[0]) ? n[0].selectPrevious() : n[0].selectNext(0, 0), !0;
		}
		if (!wr(e)) return !1;
		const n = t.shiftKey;
		return !!Z$4(e, !1) && (t.preventDefault(), ne$3(e, n, !1), !0);
	}, 0), n.registerCommand(Me$2, (t) => {
		if (Kt$2(t.target)) return !1;
		const e = $r$2();
		if (wr(e)) {
			if (function(t) {
				if (!t.isCollapsed()) return !1;
				const { anchor: e } = t;
				if (0 !== e.offset) return !1;
				const n = e.getNode();
				if (Ki$1(n)) return !1;
				const r = yt$4(n);
				return r.getIndent() > 0 && (r.is(n) || n.is(r.getFirstDescendant()));
			}(e)) return t.preventDefault(), n.dispatchCommand(Ie$2, void 0);
			if (Dt$3 && "ko-KR" === navigator.language) return !1;
		} else if (!Or$1(e)) return !1;
		return t.preventDefault(), n.dispatchCommand(ue$3, !0);
	}, 0), n.registerCommand(Pe$4, (t) => {
		if (Kt$2(t.target)) return !1;
		const e = $r$2();
		return !(!wr(e) && !Or$1(e)) && (t.preventDefault(), n.dispatchCommand(ue$3, !1));
	}, 0), n.registerCommand(Ee$3, (t) => {
		const e = $r$2();
		if (!wr(e)) return !1;
		if (kt$2(e), null !== t) {
			if ((Dt$3 || xt$2 || wt$3) && yt$2) return !1;
			if (t.preventDefault(), t.shiftKey) return n.dispatchCommand(fe$4, !1);
		}
		return n.dispatchCommand(de$4, void 0);
	}, 0), n.registerCommand(Ae$3, () => {
		return !!wr($r$2()) && (n.blur(), !0);
	}, 0), n.registerCommand(Ke$2, (t) => {
		const [, e] = bt$2(t);
		if (e.length > 0) {
			const r = pt$3(t.clientX, t.clientY);
			if (null !== r) {
				const { offset: t, node: o } = r, i = Do$1(o);
				if (null !== i) {
					const e = Wr();
					if (yr$1(i)) e.anchor.set(i.getKey(), t, "text"), e.focus.set(i.getKey(), t, "text");
					else {
						const t = i.getParentOrThrow().getKey(), n = i.getIndexWithinParent() + 1;
						e.anchor.set(t, n, "element"), e.focus.set(t, n, "element");
					}
					zo$1(Ct$4(e));
				}
				n.dispatchCommand(Et$2, e);
			}
			return t.preventDefault(), !0;
		}
		return !!wr($r$2());
	}, 0), n.registerCommand(Re$2, (t) => {
		const [e] = bt$2(t), n = $r$2();
		return !(e && !wr(n));
	}, 0), n.registerCommand(Be$3, (t) => {
		const [e] = bt$2(t), n = $r$2();
		if (e && !wr(n)) return !1;
		const r = pt$3(t.clientX, t.clientY);
		if (null !== r) Li$1(Do$1(r.node)) && t.preventDefault();
		return !0;
	}, 0), n.registerCommand(Ue$3, () => (ts(), !0), 0), n.registerCommand(Je$1, (t) => (F$3(n, At$5(t, ClipboardEvent) ? t : null), !0), 0), n.registerCommand(je$1, (t) => (async function(t, n) {
		await F$3(n, At$5(t, ClipboardEvent) ? t : null), n.update(() => {
			const t = $r$2();
			wr(t) ? t.removeText() : Or$1(t) && t.getNodes().forEach((t) => t.remove());
		});
	}(t, n), !0), 0), n.registerCommand(ge$2, (e) => {
		const [, r, o] = bt$2(e);
		if (r.length > 0 && !o) return n.dispatchCommand(Et$2, r), !0;
		if (As$1(e.target) && fo$1(e.target)) return !1;
		return null !== $r$2() && (function(e, n) {
			e.preventDefault(), n.update(() => {
				const r = $r$2(), o = At$5(e, InputEvent) || At$5(e, KeyboardEvent) ? null : e.clipboardData;
				null != o && null !== r && R$1(o, r, n);
			}, { tag: "paste" });
		}(e, n), !0);
	}, 0), n.registerCommand(Oe$4, (t) => {
		const e = $r$2();
		return wr(e) && kt$2(e), !1;
	}, 0), n.registerCommand(De$1, (t) => {
		const e = $r$2();
		return wr(e) && kt$2(e), !1;
	}, 0));
}
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/chunk-QAW5QKEM.js
var at$2 = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u";
function pr$1(n) {
	let t = (0, import_compiler_runtime.c)(2), e = n === void 0 ? 500 : n, o = (0, import_react.useRef)(void 0), r;
	return t[0] !== e ? (r = (c) => new Promise((i) => {
		let l = () => {
			c(), i();
		};
		"requestIdleCallback" in window ? ("cancelIdleCallback" in window && o.current !== void 0 && cancelIdleCallback(o.current), o.current = requestIdleCallback(l, { timeout: e })) : we$1().then(l);
	}), t[0] = e, t[1] = r) : r = t[1], r;
}
function we$1() {
	return new Promise((n) => {
		setTimeout(n, 100), requestAnimationFrame(() => {
			setTimeout(n, 0);
		});
	});
}
var ft$2 = (0, import_react.createContext)({
	currentView: "default",
	inheritable: !1,
	setCurrentView: () => {}
}), Tr = (n) => {
	let t = be(), e = n.currentView !== void 0, o = t.inheritable && (!!t.views || !!t.hasExplicitCurrentView), r = e || t.inheritable && !!t.hasExplicitCurrentView, { children: s, currentView: c, inheritable: i, views: l } = {
		children: n.children,
		currentView: o ? t.currentView : n.currentView,
		inheritable: t.inheritable || n.inheritable,
		views: o && t.views ? t.views : n.views
	}, [a, f] = $e$3(c, "default"), p = l && a !== "default" && !l[a] ? "default" : a;
	return (0, import_jsx_runtime.jsx)(ft$2, {
		value: (0, import_react.useMemo)(() => {
			return {
				currentView: p,
				currentViewMap: l ? l[p] : void 0,
				hasExplicitCurrentView: r,
				inheritable: i,
				isControlledByParent: o,
				setCurrentView: f,
				views: l
			};
		}, [
			p,
			i,
			r,
			o,
			f,
			l
		]),
		children: s
	});
};
function be() {
	return (0, import_react.use)(ft$2);
}
var G$2 = class {
	_x;
	_y;
	constructor(t, e) {
		this._x = t, this._y = e;
	}
	calcDeltaXTo({ x: t }) {
		return this.x - t;
	}
	calcDeltaYTo({ y: t }) {
		return this.y - t;
	}
	calcDistanceTo(t) {
		return Math.sqrt(Math.pow(this.calcDeltaXTo(t), 2) + Math.pow(this.calcDeltaYTo(t), 2));
	}
	calcHorizontalDistanceTo(t) {
		return Math.abs(this.calcDeltaXTo(t));
	}
	calcVerticalDistance(t) {
		return Math.abs(this.calcDeltaYTo(t));
	}
	equals({ x: t, y: e }) {
		return this.x === t && this.y === e;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
};
function ut$3(n) {
	return n instanceof G$2;
}
var He$2 = "slash-menu-popup", pt$2 = (n) => {
	let t = document.getElementById("slash-menu");
	if (!t) return;
	let e = t.getBoundingClientRect();
	e.top + e.height > window.innerHeight && t.scrollIntoView({ block: "center" }), e.top < 0 && t.scrollIntoView({ block: "center" }), n.scrollIntoView({ block: "nearest" });
};
function Ke$1(n, t, e) {
	let o = e;
	for (let r = o; r <= t.length; r++) n.substring(n.length - r) === t.substring(0, r) && (o = r);
	return o;
}
function Ue$2(n) {
	let t = $r$2();
	if (!wr(t) || !t.isCollapsed()) return;
	let e = t.anchor;
	if (e.type !== "text") return;
	let o = e.getNode();
	if (!o.isSimpleText()) return;
	let r = e.offset, s = o.getTextContent().slice(0, r), c = n.replaceableString.length, l = r - Ke$1(s, n.matchingString, c);
	if (l < 0) return;
	let a;
	return l === 0 ? [a] = o.splitText(r) : [, a] = o.splitText(l, r), a;
}
function Ve$1(n, t) {
	let e = getComputedStyle(n), o = e.position === "absolute", r = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
	if (e.position === "fixed") return document.body;
	for (let s = n; s = s.parentElement;) if (e = getComputedStyle(s), !(o && e.position === "static") && r.test(e.overflow + e.overflowY + e.overflowX)) return s;
	return document.body;
}
function gt$2(n, t) {
	let e = n.getBoundingClientRect(), o = t.getBoundingClientRect();
	return e.top > o.top && e.top < o.bottom;
}
function Xe$1(n, t, e, o) {
	let r = (0, import_compiler_runtime.c)(7), [s] = o$4(), c, i;
	r[0] !== s || r[1] !== e || r[2] !== o || r[3] !== n || r[4] !== t ? (c = () => {
		let l = t.current;
		if (l != null && n != null) {
			let a = s.getRootElement(), f = a != null ? Ve$1(a, !1) : document.body, p = !1, m = gt$2(l, f), g = function() {
				p || (window.requestAnimationFrame(function() {
					e(), p = !1;
				}), p = !0);
				let d = gt$2(l, f);
				d !== m && (m = d, o?.(d));
			}, u = new ResizeObserver(e);
			return window.addEventListener("resize", e), document.addEventListener("scroll", g, {
				capture: !0,
				passive: !0
			}), u.observe(l), () => {
				u.disconnect(), window.removeEventListener("resize", e), document.removeEventListener("scroll", g, !0);
			};
		}
	}, i = [
		s,
		o,
		e,
		n,
		t
	], r[0] = s, r[1] = e, r[2] = o, r[3] = n, r[4] = t, r[5] = c, r[6] = i) : (c = r[5], i = r[6]), (0, import_react.useEffect)(c, i);
}
var ht$1 = ne$4("SCROLL_TYPEAHEAD_OPTION_INTO_VIEW_COMMAND");
function Tt$2({ anchorElementRef: n, close: t, editor: e, groups: o, menuRenderFn: r, resolution: s, shouldSplitNodeWithQuery: c = !1 }) {
	let [i, l] = (0, import_react.useState)(null), a = s.match && s.match.matchingString || "", f = (0, import_react.useCallback)((u) => {
		let d = e.getRootElement();
		d !== null && (d.setAttribute("aria-activedescendant", `${He$2}__item-${u.key}`), l(u.key));
	}, [e]), p = (0, import_react.useCallback)(() => {
		if (o !== null && a != null) {
			let u = o.flatMap((d) => d.items);
			if (u.length) {
				let d = u[0];
				f(d);
			}
		}
	}, [
		o,
		f,
		a
	]);
	(0, import_react.useEffect)(() => {
		p();
	}, [a, p]);
	let m = (0, import_react.useCallback)((u) => {
		t(), e.update(() => {
			let d = s.match != null && c ? Ue$2(s.match) : null;
			d && d.remove();
		}), setTimeout(() => {
			let d;
			e.read(() => {
				d = $r$2()?.clone();
			}), e.update(() => {
				d && zo$1(d);
			}), u.onSelect({
				editor: e,
				queryString: s.match ? s.match.matchingString : ""
			});
		}, 0);
	}, [
		e,
		c,
		s.match,
		t
	]);
	(0, import_react.useEffect)(() => () => {
		let u = e.getRootElement();
		u !== null && u.removeAttribute("aria-activedescendant");
	}, [e]), (0, import_react.useLayoutEffect)(() => {
		o === null ? l(null) : i === null && p();
	}, [
		o,
		i,
		f,
		p
	]), (0, import_react.useEffect)(() => ec(e.registerCommand(ht$1, ({ item: u }) => u.ref && u.ref.current != null ? (pt$2(u.ref.current), !0) : !1, 1)), [e, f]), (0, import_react.useEffect)(() => ec(e.registerCommand(we$3, (u) => {
		let d = u;
		if (o !== null && o.length && i !== null) {
			let h = o.flatMap((T) => T.items), x = h.findIndex((T) => T.key === i), E = x !== h.length - 1 ? x + 1 : 0, _ = h[E];
			if (!_) return !1;
			f(_), _.ref != null && _.ref.current && e.dispatchCommand(ht$1, {
				index: E,
				item: _
			}), d.preventDefault(), d.stopImmediatePropagation();
		}
		return !0;
	}, 2), e.registerCommand(be$3, (u) => {
		let d = u;
		if (o !== null && o.length && i !== null) {
			let h = o.flatMap((T) => T.items), x = h.findIndex((T) => T.key === i), _ = h[x !== 0 ? x - 1 : h.length - 1];
			if (!_) return !1;
			f(_), _.ref != null && _.ref.current && pt$2(_.ref.current), d.preventDefault(), d.stopImmediatePropagation();
		}
		return !0;
	}, 2), e.registerCommand(Ae$3, (u) => {
		let d = u;
		return d.preventDefault(), d.stopImmediatePropagation(), t(), !0;
	}, 1), e.registerCommand(De$1, (u) => {
		let d = u;
		if (o === null || i === null) return !1;
		let x = o.flatMap((E) => E.items).find((E) => E.key === i);
		return x ? (d.preventDefault(), d.stopImmediatePropagation(), m(x), !0) : !1;
	}, 2), e.registerCommand(Ee$3, (u) => {
		if (o === null || i === null) return !1;
		let h = o.flatMap((x) => x.items).find((x) => x.key === i);
		return h ? (u !== null && (u.preventDefault(), u.stopImmediatePropagation()), m(h), !0) : !1;
	}, 2)), [
		m,
		t,
		e,
		o,
		i,
		f
	]);
	return r(n, (0, import_react.useMemo)(() => ({
		groups: o,
		selectedItemKey: i,
		selectItemAndCleanUp: m,
		setSelectedItemKey: l
	}), [
		m,
		i,
		o
	]), s.match ? s.match.matchingString : "");
}
function Ge(n, t) {
	t != null && (n.className = t), n.setAttribute("aria-label", "Slash menu"), n.setAttribute("role", "listbox"), n.style.display = "block", n.style.position = "absolute";
}
function wt$2(n, t, e, o) {
	let r = (0, import_compiler_runtime.c)(14), [s] = o$4(), c;
	r[0] === Symbol.for("react.memo_cache_sentinel") ? (c = at$2 ? document.createElement("div") : null, r[0] = c) : c = r[0];
	let i = (0, import_react.useRef)(c), l;
	r[1] !== n || r[2] !== o || r[3] !== s || r[4] !== t ? (l = () => {
		if (i.current === null || parent === void 0) return;
		let u = s.getRootElement(), d = i.current, h = d.firstChild;
		if (u !== null && t !== null) {
			let { height: x, width: E } = t.getRect(), { left: _, top: T } = t.getRect(), y = T;
			if (T = T - (n.getBoundingClientRect().top + window.scrollY), _ = _ - (n.getBoundingClientRect().left + window.scrollX), d.style.left = `${_ + window.scrollX}px`, d.style.height = `${x}px`, d.style.width = `${E}px`, h !== null) {
				let w = h.getBoundingClientRect(), D = w.height, S = w.width, X = u.getBoundingClientRect(), ct = document.dir === "rtl" || document.documentElement.dir === "rtl", ge = n.getBoundingClientRect(), lt = Math.max(0, X.left);
				if (!ct && _ + S > X.right) d.style.left = `${X.right - S + window.scrollX}px`;
				else if (ct && w.left < lt) {
					let Ee = lt + S - ge.left;
					d.style.left = `${Ee + window.scrollX}px`;
				}
				y + D + 32 > window.innerHeight && !(y < 0) ? d.style.top = `${T + 32 - D + window.scrollY - (x + 24)}px` : d.style.top = `${T + window.scrollY + 32}px`;
			}
			d.isConnected || (Ge(d, o), n.append(d)), d.setAttribute("id", "slash-menu"), i.current = d, u.setAttribute("aria-controls", "slash-menu");
		}
	}, r[1] = n, r[2] = o, r[3] = s, r[4] = t, r[5] = l) : l = r[5];
	let a = l, f, p;
	r[6] !== s || r[7] !== a || r[8] !== t ? (f = () => {
		let u = s.getRootElement();
		if (t !== null) return a(), () => {
			u !== null && u.removeAttribute("aria-controls");
			let d = i.current;
			d !== null && d.isConnected && (d.remove(), d.removeAttribute("id"));
		};
	}, p = [
		s,
		a,
		t
	], r[6] = s, r[7] = a, r[8] = t, r[9] = f, r[10] = p) : (f = r[9], p = r[10]), (0, import_react.useEffect)(f, p);
	let m;
	return r[11] !== t || r[12] !== e ? (m = (u) => {
		t !== null && (u || e(null));
	}, r[11] = t, r[12] = e, r[13] = m) : m = r[13], Xe$1(t, i, a, m), i;
}
var $r$1 = `\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'"~=<>_:;`;
function tn$2(n) {
	let t = n.anchor;
	if (t.type !== "text") return null;
	let e = t.getNode();
	if (!e.isSimpleText()) return null;
	let o = t.offset;
	return e.getTextContent().slice(0, o);
}
function Rt$1(n, t, e) {
	let o = bs$1(e);
	if (o === null || !o.isCollapsed) return !1;
	let r = o.anchorNode, s = n, c = o.anchorOffset;
	if (r == null || c == null) return !1;
	try {
		t.setStart(r, s), t.setEnd(r, c > 1 ? c : 1);
	} catch {
		return !1;
	}
	return !0;
}
function en$2(n) {
	let t;
	return n.getEditorState().read(() => {
		let e = $r$2();
		wr(e) && (t = tn$2(e));
	}), t;
}
function kt$1(n, t) {
	return t !== 0 ? !1 : n.getEditorState().read(() => {
		let e = $r$2();
		if (wr(e)) {
			let s = e.anchor.getNode().getPreviousSibling();
			return yr$1(s) && s.isTextEntity();
		}
		return !1;
	});
}
function yt$1(n) {
	import_react.startTransition ? import_react.startTransition(n) : n();
}
var nn$1 = ne$4("ENABLE_SLASH_MENU_COMMAND");
function Br$1({ anchorClassName: n, anchorElem: t, groups: e, menuRenderFn: o, onClose: r, onOpen: s, onQueryChange: c, triggerFn: i }) {
	let [l] = o$4(), [a, f] = (0, import_react.useState)(null), p = wt$2(t, a, f, n), m = (0, import_react.useCallback)(() => {
		f(null), r != null && a !== null && r();
	}, [r, a]), g = (0, import_react.useCallback)((u) => {
		f(u), s != null && a === null && s(u);
	}, [s, a]);
	return (0, import_react.useEffect)(() => ec(l.registerCommand(nn$1, ({ node: u }) => (l.getEditorState().read(() => {
		let d = {
			leadOffset: 0,
			matchingString: "",
			replaceableString: ""
		};
		if (!kt$1(l, d.leadOffset) && u !== null) {
			let h = l._window ?? window, x = h.document.createRange();
			Rt$1(d.leadOffset, x, h) !== null && yt$1(() => g({
				getRect: () => x.getBoundingClientRect(),
				match: d
			}));
			return;
		}
	}), !0), 1)), [l, g]), (0, import_react.useEffect)(() => {
		let u = () => {
			l.getEditorState().read(() => {
				let h = l._window ?? window, x = h.document.createRange(), E = $r$2(), _ = en$2(l);
				if (!wr(E) || !E.isCollapsed() || _ === void 0 || x === null) {
					m();
					return;
				}
				let T = i({
					editor: l,
					query: _
				});
				if (c(T ? T.matchingString : null), T !== null && !kt$1(l, T.leadOffset) && Rt$1(T.leadOffset, x, h) !== null) {
					yt$1(() => g({
						getRect: () => x.getBoundingClientRect(),
						match: T
					}));
					return;
				}
				m();
			});
		}, d = l.registerUpdateListener(u);
		return () => {
			d();
		};
	}, [
		l,
		i,
		c,
		a,
		m,
		g
	]), p.current === null || a === null || l === null ? null : (0, import_jsx_runtime.jsx)(Tt$2, {
		anchorElementRef: p,
		close: m,
		editor: l,
		groups: e,
		menuRenderFn: o,
		resolution: a,
		shouldSplitNodeWithQuery: !0
	});
}
var bt$1 = class n {
	_bottom;
	_left;
	_right;
	_top;
	constructor(t, e, o, r) {
		let [s, c] = e <= r ? [e, r] : [r, e], [i, l] = t <= o ? [t, o] : [o, t];
		this._top = s, this._right = l, this._left = i, this._bottom = c;
	}
	static fromDOM(t) {
		let { height: e, left: o, top: r, width: s } = t.getBoundingClientRect();
		return n.fromLWTH(o, s, r, e);
	}
	static fromDOMRect(t) {
		let { height: e, left: o, top: r, width: s } = t;
		return n.fromLWTH(o, s, r, e);
	}
	static fromLTRB(t, e, o, r) {
		return new n(t, e, o, r);
	}
	static fromLWTH(t, e, o, r) {
		return new n(t, o, t + e, o + r);
	}
	static fromPoints(t, e) {
		let { x: o, y: r } = t, { x: s, y: c } = e;
		return n.fromLTRB(o, r, s, c);
	}
	contains(t) {
		if (ut$3(t)) {
			let { x: c, y: i } = t, l = i < this._top, a = i > this._bottom, f = c < this._left, p = c > this._right;
			return {
				reason: {
					isOnBottomSide: a,
					isOnLeftSide: f,
					isOnRightSide: p,
					isOnTopSide: l
				},
				result: !l && !a && !f && !p
			};
		}
		let { bottom: e, left: o, right: r, top: s } = t;
		return s >= this._top && s <= this._bottom && e >= this._top && e <= this._bottom && o >= this._left && o <= this._right && r >= this._left && r <= this._right;
	}
	distanceFromPoint(t) {
		let e = this.contains(t);
		if (e.result) return {
			distance: 0,
			isOnBottomSide: e.reason.isOnBottomSide,
			isOnLeftSide: e.reason.isOnLeftSide,
			isOnRightSide: e.reason.isOnRightSide,
			isOnTopSide: e.reason.isOnTopSide
		};
		let o = 0, r = 0;
		return t.x < this._left ? o = this._left - t.x : t.x > this._right && (o = t.x - this._right), t.y < this._top ? r = this._top - t.y : t.y > this._bottom && (r = t.y - this._bottom), {
			distance: Math.sqrt(o * o + r * r),
			isOnBottomSide: t.y > this._bottom,
			isOnLeftSide: t.x < this._left,
			isOnRightSide: t.x > this._right,
			isOnTopSide: t.y < this._top
		};
	}
	equals({ bottom: t, left: e, right: o, top: r }) {
		return r === this._top && t === this._bottom && e === this._left && o === this._right;
	}
	generateNewRect({ bottom: t = this.bottom, left: e = this.left, right: o = this.right, top: r = this.top }) {
		return new n(e, r, o, t);
	}
	intersectsWith(t) {
		let { height: e, left: o, top: r, width: s } = t, { height: c, left: i, top: l, width: a } = this, f = o + s >= i + a ? o + s : i + a, p = r + e >= l + c ? r + e : l + c, m = o <= i ? o : i, g = r <= l ? r : l;
		return f - m <= s + a && p - g <= e + c;
	}
	get bottom() {
		return this._bottom;
	}
	get height() {
		return Math.abs(this._bottom - this._top);
	}
	get left() {
		return this._left;
	}
	get right() {
		return this._right;
	}
	get top() {
		return this._top;
	}
	get width() {
		return Math.abs(this._left - this._right);
	}
};
var L$1 = /* @__PURE__ */ new WeakMap();
function Ur$1(n, t) {
	L$1.has(n) || L$1.set(n, /* @__PURE__ */ new Map());
	let e = L$1.get(n);
	for (let [o, r] of Object.entries(t)) if (!(!r || typeof r != "object")) {
		if (o === "blocks") {
			for (let [s, c] of Object.entries(r)) e.set(`block:${s}`, c);
			continue;
		}
		if (o === "inlineBlocks") {
			for (let [s, c] of Object.entries(r)) e.set(`inlineBlock:${s}`, c);
			continue;
		}
		e.set(o, r);
	}
}
function Vr(n) {
	L$1.delete(n);
}
function Ot$2(n, t, e) {
	let o = L$1.get(n);
	if (t === "block" && e?.__fields?.blockType) {
		let r = e.__fields.blockType;
		return o?.get(`block:${r}`);
	}
	if (t === "inlineBlock" && e?.__fields?.blockType) {
		let r = e.__fields.blockType;
		return o?.get(`inlineBlock:${r}`);
	}
	return o?.get(t);
}
function rn$2({ node: n, nodeType: t }) {
	if (!("getType" in n) || n.getType() !== t) return;
	let e = n;
	if (e.prototype._originalDecorate || (e.prototype._originalDecorate = e.prototype.decorate), e.prototype._originalCreateDOM || (e.prototype._originalCreateDOM = e.prototype.createDOM), e.prototype.decorate && !e.prototype._decorateOverridden) {
		e.prototype._decorateOverridden = !0;
		let o = !!e.prototype.createDOM;
		e.prototype.decorate = function(r, s) {
			let c = Ot$2(r, t, this);
			if (c) {
				if (c.Component) return c.Component({
					config: s,
					editor: r,
					isEditor: !0,
					isJSXConverter: !1,
					node: this
				});
				if (c.createDOM && c.html) {
					let l = typeof c.html == "function" ? c.html({
						config: s,
						editor: r,
						isEditor: !0,
						isJSXConverter: !1,
						node: this
					}) : c.html;
					return import_react.createElement("span", { dangerouslySetInnerHTML: { __html: l } });
				}
				if (c.html && o && !c.createDOM) return import_react.createElement(import_react.Fragment);
				if (t === "block") {
					let l = c;
					if (l.Block || l.Label) return e.prototype._originalDecorate.call(this, r, s, l.Block, l.Label);
				} else if (t === "inlineBlock") {
					let l = c;
					if (l.Block || l.Label) return e.prototype._originalDecorate.call(this, r, s, l.Block, l.Label);
				}
			}
			return e.prototype._originalDecorate.call(this, r, s);
		};
	}
	e.prototype.createDOM && !e.prototype._createDOMOverridden && (e.prototype._createDOMOverridden = !0, e.prototype.createDOM = function(o, r) {
		let s = Ot$2(r, t, this);
		if (s) {
			if (s.createDOM) return s.createDOM({
				config: o,
				editor: r,
				node: this
			});
			if (s.html) {
				let c = typeof s.html == "function" ? s.html({
					config: o,
					editor: r,
					isEditor: !0,
					isJSXConverter: !1,
					node: this
				}) : s.html, i = document.createElement("div");
				return i.innerHTML = c, i.firstElementChild || i;
			}
		}
		return e.prototype._originalCreateDOM.call(this, o, r);
	});
}
function Xr({ editorConfig: n, nodeViews: t }) {
	let e = on$1({ nodes: n.features.nodes });
	if (t) {
		let o = /* @__PURE__ */ new Set();
		for (let [r, s] of Object.entries(t)) !s || typeof s != "object" || (r === "blocks" && Object.keys(s).length > 0 ? o.add("block") : r === "inlineBlocks" && Object.keys(s).length > 0 ? o.add("inlineBlock") : o.add(r));
		for (let r of e) if ("getType" in r) {
			let s = r.getType();
			o.has(s) && rn$2({
				node: r,
				nodeType: s
			});
		}
	}
	return e;
}
function on$1({ nodes: n }) {
	return n.map((t) => "node" in t ? t.node : t);
}
var At$2 = /^(\s*)(\d+)\.\s/, Dt$2 = /^(\s*)[-*+]\s/, Q$1 = /^(#{1,6})\s/, Bt$2 = /^>\s/, et$2 = it$3("mdHardLineBreak", { parse: (n) => typeof n == "string" && /^(\\| {2,})$/.test(n) ? n : "" });
function J$2(n) {
	if (n.endsWith("\\")) return [n.slice(0, -1), "\\"];
	let t = n.match(/^(.*?\S)( {2,})$/);
	return t ? [t[1], t[2]] : null;
}
function Sn$1(n, t) {
	for (let e = t - 1; e >= 0; e--) {
		if (Zn$1(n[e])) return !1;
		if (/\S/.test(n[e].getTextContent())) return !0;
	}
	return !1;
}
function Rn$1(n) {
	let t = n.getChildren(), e = t.length - 1, o = t[e];
	if (!yr$1(o)) return null;
	let r = o.getTextContent(), s = J$2(r);
	if (s !== null) {
		let [c, i] = s;
		return o.setTextContent(c), i;
	}
	return /^ {2,}$/.test(r) && Sn$1(t, e) ? (o.setTextContent(""), r) : null;
}
function nt$3(n) {
	let t = Qn$2(), e = Rn$1(n);
	return e !== null && lt$3(t, et$2, e), t;
}
var kn$2 = (n) => (t, e, o) => {
	let r = n(o);
	r.append(...e), t.replace(r), r.select(0, 0);
}, vt$2 = 4;
function yn$1(n) {
	let t = n.match(/\t/g), e = n.match(/ /g), o = 0;
	return t && (o += t.length), e && (o += Math.floor(e.length / vt$2)), o;
}
var rt$3 = (n) => (t, e, o) => {
	let r = t.getPreviousSibling(), s = t.getNextSibling(), c = ce$2(n === "check" ? o[3] === "x" : void 0);
	if (me$1(s) && s.getListType() === n) {
		let l = s.getFirstChild();
		l !== null ? l.insertBefore(c) : s.append(c), t.remove();
	} else if (me$1(r) && r.getListType() === n) r.append(c), t.remove();
	else {
		let l = pe$2(n, n === "number" ? Number(o[2]) : void 0);
		l.append(c), t.replace(l);
	}
	c.append(...e), c.select(0, 0);
	let i = yn$1(o[1]);
	i && c.setIndent(i);
}, B$3 = (n, t, e) => {
	let o = [], r = n.getChildren(), s = 0;
	for (let c of r) if (ae$1(c)) {
		if (c.getChildrenSize() === 1) {
			let f = c.getFirstChild();
			if (me$1(f)) {
				o.push(B$3(f, t, e + 1));
				continue;
			}
		}
		let i = " ".repeat(e * vt$2), l = n.getListType(), a = l === "number" ? `${n.getStart() + s}. ` : l === "check" ? `- [${c.getChecked() ? "x" : " "}] ` : "- ";
		o.push(i + a + t(c)), s++;
	}
	return o.join(`
`);
}, Pt$2 = {
	type: "element",
	dependencies: [Tt$3],
	export: (n, t) => {
		if (!It$3(n)) return null;
		let e = Number(n.getTag().slice(1));
		return "#".repeat(e) + " " + t(n);
	},
	regExp: Q$1,
	replace: kn$2((n) => {
		return Mt$3("h" + n[1].length);
	})
}, Ht$2 = {
	type: "element",
	dependencies: [_t$3],
	export: (n, t) => {
		if (!Pt$3(n)) return null;
		let e = t(n).split(`
`), o = [];
		for (let r of e) o.push("> " + r);
		return o.join(`
`);
	},
	regExp: Bt$2,
	replace: (n, t, e, o) => {
		if (o) {
			let s = n.getPreviousSibling();
			if (Pt$3(s)) {
				s.splice(s.getChildrenSize(), 0, [nt$3(s), ...t]), s.select(0, 0), n.remove();
				return;
			}
		}
		let r = Ot$3();
		r.append(...t), n.replace(r), r.select(0, 0);
	}
}, Kt$1 = {
	type: "element",
	dependencies: [ue$1, se$1],
	export: (n, t) => me$1(n) ? B$3(n, t, 0) : null,
	regExp: Dt$2,
	replace: rt$3("bullet")
};
var Ut$1 = {
	type: "element",
	dependencies: [ue$1, se$1],
	export: (n, t) => me$1(n) ? B$3(n, t, 0) : null,
	regExp: At$2,
	replace: rt$3("number")
}, Vt$1 = {
	type: "text-format",
	format: ["code"],
	tag: "`"
}, Xt$1 = {
	type: "text-format",
	format: ["highlight"],
	tag: "=="
}, Gt$2 = {
	type: "text-format",
	format: ["bold", "italic"],
	tag: "***"
}, zt$1 = {
	type: "text-format",
	format: ["bold", "italic"],
	intraword: !1,
	tag: "___"
}, Wt$2 = {
	type: "text-format",
	format: ["bold"],
	tag: "**"
}, Yt$2 = {
	type: "text-format",
	format: ["bold"],
	intraword: !1,
	tag: "__"
}, jt$2 = {
	type: "text-format",
	format: ["strikethrough"],
	tag: "~~"
}, qt$2 = {
	type: "text-format",
	format: ["italic"],
	tag: "*"
}, Qt$2 = {
	type: "text-format",
	format: ["italic"],
	intraword: !1,
	tag: "_"
};
var C$1 = {
	markdownFormatKind: null,
	regEx: /(?:)/,
	regExForAutoFormatting: /(?:)/,
	requiresParagraphStart: !1
}, R = {
	...C$1,
	requiresParagraphStart: !0
};
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...R });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
({ ...C$1 });
function v$1(n, t) {
	let e = {};
	for (let o of n) {
		let r = t(o);
		r && (e[r] ? e[r].push(o) : e[r] = [o]);
	}
	return e;
}
function F$2(n) {
	let t = v$1(n, (e) => e.type);
	return {
		element: t.element || [],
		multilineElement: t["multiline-element"] || [],
		textFormat: t["text-format"] || [],
		textMatch: t["text-match"] || []
	};
}
var I$1 = /[!-/:-@[-`{-~\s]/;
function U(n, t, e, o, r) {
	let s = [], c = n.getChildren();
	o || (o = []), r || (r = []);
	t: for (let i of c) {
		for (let l of e) {
			if (!l.export) continue;
			let a = l.export(i, (f) => U(f, t, e, o, [...r, ...o]), (f, p) => ee$1(f, p, t, o, r));
			if (a != null) {
				s.push(a);
				continue t;
			}
		}
		Zn$1(i) ? s.push(Hn$1(i)) : yr$1(i) ? s.push(ee$1(i, i.getTextContent(), t, o, r)) : Pi$1(i) ? s.push(U(i, t, e, o, r)) : Li$1(i) && s.push(i.getTextContent());
	}
	return s.join("");
}
function Hn$1(n) {
	return ot$4(n, et$2) + `
`;
}
function ee$1(n, t, e, o, r) {
	let s = t.trim(), c = s;
	n.hasFormat("code") || (c = c.replace(/([*_`~\\])/g, "\\$1"));
	let i = "", l = "", a = "", f = ne(n, !0), p = ne(n, !1), m = /* @__PURE__ */ new Set();
	for (let g of e) {
		let u = g.format[0], d = g.tag;
		P$1(n, u) && !m.has(u) && (m.add(u), (!P$1(f, u) || !o.find((h) => h.tag === d)) && (o.push({
			format: u,
			tag: d
		}), i += d));
	}
	for (let g = 0; g < o.length; g++) {
		let u = o[g], d = P$1(n, u.format), h = P$1(p, u.format);
		if (d && h) continue;
		let x = [...o];
		for (; x.length > g;) {
			let E = x.pop();
			r && E && r.find((_) => _.tag === E.tag) || (E && typeof E.tag == "string" && (d ? h || (a += E.tag) : l += E.tag), o.pop());
		}
		break;
	}
	return c = i + c + a, l + t.replace(s, () => c);
}
function ne(n, t) {
	let e = t ? n.getPreviousSibling() : n.getNextSibling();
	if (!e) {
		let o = n.getParentOrThrow();
		o.isInline() && (e = t ? o.getPreviousSibling() : o.getNextSibling());
	}
	for (; e;) {
		if (Pi$1(e)) {
			if (!e.isInline()) break;
			let o = t ? e.getLastDescendant() : e.getFirstDescendant();
			if (yr$1(o)) return o;
			e = t ? e.getPreviousSibling() : e.getNextSibling();
		}
		if (yr$1(e)) return e;
		if (!Pi$1(e)) return null;
	}
	return null;
}
function P$1(n, t) {
	return yr$1(n) && n.hasFormat(t);
}
function ie$1(n, t) {
	let o = Kn$2(n.getTextContent(), t);
	if (!o) return null;
	let r = o.index || 0;
	return {
		endIndex: r + o[0].length,
		match: o,
		startIndex: r,
		transformer: t.transformersByTag[o[1]]
	};
}
function Kn$2(n, t) {
	let e = n.match(t.openTagsRegExp);
	if (e == null) return null;
	for (let o of e) {
		let r = o.replace(/^\s/, ""), s = t.fullMatchRegExpByTag[r];
		if (s == null) continue;
		let c = n.match(s), i = t.transformersByTag[r];
		if (c != null && i != null) {
			if (i.intraword !== !1) return c;
			let { index: l = 0 } = c, a = n[l - 1], f = n[l + c[0].length];
			if ((!a || I$1.test(a)) && (!f || I$1.test(f))) return c;
		}
	}
	return null;
}
function se(n, t, e, o, r) {
	let s = n.getTextContent(), c, i, l;
	if (r[0] === s ? l = n : t === 0 ? [l, c] = n.splitText(e) : [i, l, c] = n.splitText(t, e), l.setTextContent(r[2]), o) for (let a of o.format) l.hasFormat(a) || l.toggleFormat(a);
	return {
		nodeAfter: c,
		nodeBefore: i,
		transformedNode: l
	};
}
function ce$1(n, t) {
	let e = n, o, r, s, c;
	for (let i of t) {
		if (!i.replace || !i.importRegExp) continue;
		let l = e.getTextContent().match(i.importRegExp);
		if (!l) continue;
		let a = l.index || 0, f = i.getEndIndex ? i.getEndIndex(e, l) : a + l[0].length;
		f !== !1 && (o === void 0 || r === void 0 || a < o && f > r) && (o = a, r = f, s = i, c = l);
	}
	return o === void 0 || r === void 0 || s === void 0 || c === void 0 ? null : {
		endIndex: r,
		match: c,
		startIndex: o,
		transformer: s
	};
}
function le(n, t, e, o, r) {
	let s, c, i;
	if (t === 0 ? [i, s] = n.splitText(e) : [c, i, s] = n.splitText(t, e), !o.replace) return null;
	let l = i ? o.replace(i, r) : void 0;
	return {
		nodeAfter: s,
		nodeBefore: c,
		transformedNode: l || void 0
	};
}
function k$1(n, t, e) {
	let o = ie$1(n, t), r = ce$1(n, e);
	if (o && r && (o.startIndex <= r.startIndex && o.endIndex >= r.endIndex ? r = null : o = null), o) {
		let i = se(n, o.startIndex, o.endIndex, o.transformer, o.match);
		i.nodeAfter && yr$1(i.nodeAfter) && !i.nodeAfter.hasFormat("code") && k$1(i.nodeAfter, t, e), i.nodeBefore && yr$1(i.nodeBefore) && !i.nodeBefore.hasFormat("code") && k$1(i.nodeBefore, t, e), i.transformedNode && yr$1(i.transformedNode) && !i.transformedNode.hasFormat("code") && k$1(i.transformedNode, t, e);
	} else if (r) {
		let i = le(n, r.startIndex, r.endIndex, r.transformer, r.match);
		if (!i) return;
		i.nodeAfter && yr$1(i.nodeAfter) && !i.nodeAfter.hasFormat("code") && k$1(i.nodeAfter, t, e), i.nodeBefore && yr$1(i.nodeBefore) && !i.nodeBefore.hasFormat("code") && k$1(i.nodeBefore, t, e), i.transformedNode && yr$1(i.transformedNode) && !i.transformedNode.hasFormat("code") && k$1(i.transformedNode, t, e);
	}
	let c = n.getTextContent().replace(/\\([*_`~])/g, "$1");
	n.setTextContent(c);
}
function nr$1(n, t, e, o) {
	if (!xs$1(n.getParent()) || n.getFirstChild() !== t) return !1;
	let s = t.getTextContent();
	if (s[e - 1] !== " ") return !1;
	for (let { regExp: c, replace: i } of o) {
		let l = s.match(c);
		if (l && l[0].length === (l[0].endsWith(" ") ? e : e - 1)) {
			let a = t.getNextSiblings(), [f, p] = t.splitText(e);
			f?.remove();
			if (i(n, p ? [p, ...a] : a, l, !1) !== !1) return !0;
		}
	}
	return !1;
}
function rr(n, t, e, o) {
	if (!xs$1(n.getParent()) || n.getFirstChild() !== t) return !1;
	let s = t.getTextContent();
	if (s[e - 1] !== " ") return !1;
	for (let { regExpEnd: c, regExpStart: i, replace: l } of o) {
		if (c && !("optional" in c) || c && "optional" in c && !c.optional) continue;
		let a = s.match(i);
		if (a && a[0].length === (a[0].endsWith(" ") ? e : e - 1)) {
			let f = t.getNextSiblings(), [p, m] = t.splitText(e);
			p?.remove();
			if (l(n, m ? [m, ...f] : f, a, null, null, !1) !== !1) return !0;
		}
	}
	return !1;
}
function or$1(n, t, e) {
	let o = n.getTextContent(), s = e[o[t - 1]];
	if (s == null) return !1;
	t < o.length && (o = o.slice(0, t));
	for (let c of s) {
		if (!c.replace || !c.regExp) continue;
		let i = o.match(c.regExp);
		if (i === null) continue;
		let l = i.index || 0, a = l + i[0].length, f;
		return l === 0 ? [f] = n.splitText(a) : [, f] = n.splitText(l, a), f && (f.selectNext(0, 0), c.replace(f, i)), !0;
	}
	return !1;
}
function ir$1(n, t, e) {
	let o = n.getTextContent(), r = t - 1, s = o[r], c = e[s];
	if (!c) return !1;
	for (let i of c) {
		let { tag: l } = i, a = l.length, f = r - a + 1;
		if (a > 1 && !pe$1(o, f, l, 0, a) || o[f - 1] === " ") continue;
		let p = o[r + 1];
		if (i.intraword === !1 && p && !I$1.test(p)) continue;
		let m = n, g = m, u = ue(o, f, l), d = g;
		for (; u < 0 && (d = d.getPreviousSibling()) && !Zn$1(d);) if (yr$1(d)) {
			let S = d.getTextContent();
			g = d, u = ue(S, S.length, l);
		}
		if (u < 0 || g === m && u + a === f) continue;
		let h = g.getTextContent();
		if (u > 0 && h[u - 1] === s) continue;
		let x = h[u - 1];
		if (i.intraword === !1 && x && !I$1.test(x)) continue;
		let E = m.getTextContent(), _ = E.slice(0, f) + E.slice(r + 1);
		m.setTextContent(_);
		let T = g === m ? _ : h;
		g.setTextContent(T.slice(0, u) + T.slice(u + a));
		let y = $r$2(), w = Wr();
		zo$1(w);
		let D = r - a * (g === m ? 2 : 1) + 1;
		w.anchor.set(g.__key, u, "text"), w.focus.set(m.__key, D, "text");
		for (let S of i.format) w.hasFormat(S) || w.formatText(S);
		w.anchor.set(w.focus.key, w.focus.offset, w.focus.type);
		for (let S of i.format) w.hasFormat(S) && w.toggleFormat(S);
		return wr(y) && (w.format = y.format), !0;
	}
	return !1;
}
function ue(n, t, e) {
	let o = e.length;
	for (let r = t; r >= o; r--) {
		let s = r - o;
		if (pe$1(n, s, e, 0, o) && n[s + o] !== " ") return s;
	}
	return -1;
}
function pe$1(n, t, e, o, r) {
	for (let s = 0; s < r; s++) if (n[t + s] !== e[o + s]) return !1;
	return !0;
}
function Wo(n, t = V$1) {
	let e = F$2(t), o = v$1(e.textFormat, ({ tag: c }) => c[c.length - 1]), r = v$1(e.textMatch, ({ trigger: c }) => c);
	for (let c of t) {
		let i = c.type;
		if (i === "element" || i === "text-match" || i === "multiline-element") {
			let l = c.dependencies;
			for (let a of l) if (!n.hasNode(a)) throw new Error("MarkdownShortcuts: missing dependency %s for transformer. Ensure node dependency is included in editor initial config." + a.getType());
		}
	}
	let s = (c, i, l) => {
		nr$1(c, i, l, e.element) || rr(c, i, l, e.multilineElement) || or$1(i, l, r) || ir$1(i, l, o);
	};
	return n.registerUpdateListener(({ dirtyLeaves: c, editorState: i, prevEditorState: l, tags: a }) => {
		if (a.has("collaboration") || a.has("historic") || n.isComposing()) return;
		let f = i.read($r$2), p = l.read($r$2);
		if (!wr(p) || !wr(f) || !f.isCollapsed() || f.is(p)) return;
		let m = f.anchor.key, g = f.anchor.offset, u = i._nodeMap.get(m);
		!yr$1(u) || !c.has(m) || g !== 1 && g > p.anchor.offset + 1 || n.update(() => {
			if (u.hasFormat("code")) return;
			let d = u.getParent();
			d !== null && s(d, u, f.anchor.offset);
		});
	});
}
var sr$1 = [
	Pt$2,
	Ht$2,
	Kt$1,
	Ut$1
], cr$1 = [], lr$1 = [
	Vt$1,
	Gt$2,
	zt$1,
	Wt$2,
	Yt$2,
	Xt$1,
	qt$2,
	Qt$2,
	jt$2
], ar$1 = [], V$1 = [
	...sr$1,
	...cr$1,
	...lr$1,
	...ar$1
];
//#endregion
//#region node_modules/@lexical/react/LexicalDecoratorBlockNode.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var r = class extends Fi$1 {
	__format;
	constructor(t, r) {
		super(r), this.__format = t || "";
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			format: this.__format || ""
		};
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setFormat(t.format || "");
	}
	canIndent() {
		return !1;
	}
	createDOM() {
		return document.createElement("div");
	}
	updateDOM() {
		return !1;
	}
	setFormat(t) {
		const r = this.getWritable();
		return r.__format = t, r;
	}
	isInline() {
		return !1;
	}
};
function e(t) {
	return t instanceof r;
}
//#endregion
//#region node_modules/jsox/lib/jsox.mjs
var _JSON = JSON;
if ("undefined" === typeof exports) var exports = {};
var JSOX = exports || {};
exports.JSOX = JSOX;
JSOX.version = "1.2.121";
var hasBigInt = typeof BigInt === "function";
var VALUE_UNDEFINED = -1;
var VALUE_UNSET = 0;
var VALUE_NULL = 1;
var VALUE_TRUE = 2;
var VALUE_FALSE = 3;
var VALUE_STRING = 4;
var VALUE_NUMBER = 5;
var VALUE_OBJECT = 6;
var VALUE_NEG_NAN = 7;
var VALUE_NAN = 8;
var VALUE_NEG_INFINITY = 9;
var VALUE_INFINITY = 10;
var VALUE_EMPTY = 12;
var VALUE_ARRAY = 13;
var knownArrayTypeNames = [
	"ab",
	"u8",
	"cu8",
	"s8",
	"u16",
	"s16",
	"u32",
	"s32",
	"u64",
	"s64",
	"f32",
	"f64"
];
var arrayToJSOX = null;
var mapToJSOX = null;
var knownArrayTypes = [
	ArrayBuffer,
	Uint8Array,
	Uint8ClampedArray,
	Int8Array,
	Uint16Array,
	Int16Array,
	Uint32Array,
	Int32Array,
	null,
	null,
	Float32Array,
	Float64Array
];
var WORD_POS_RESET = 0;
var WORD_POS_TRUE_1 = 1;
var WORD_POS_TRUE_2 = 2;
var WORD_POS_TRUE_3 = 3;
var WORD_POS_FALSE_1 = 5;
var WORD_POS_FALSE_2 = 6;
var WORD_POS_FALSE_3 = 7;
var WORD_POS_FALSE_4 = 8;
var WORD_POS_NULL_1 = 9;
var WORD_POS_NULL_2 = 10;
var WORD_POS_NULL_3 = 11;
var WORD_POS_UNDEFINED_1 = 12;
var WORD_POS_UNDEFINED_2 = 13;
var WORD_POS_UNDEFINED_3 = 14;
var WORD_POS_UNDEFINED_4 = 15;
var WORD_POS_UNDEFINED_5 = 16;
var WORD_POS_UNDEFINED_6 = 17;
var WORD_POS_UNDEFINED_7 = 18;
var WORD_POS_UNDEFINED_8 = 19;
var WORD_POS_NAN_1 = 20;
var WORD_POS_NAN_2 = 21;
var WORD_POS_INFINITY_1 = 22;
var WORD_POS_INFINITY_2 = 23;
var WORD_POS_INFINITY_3 = 24;
var WORD_POS_INFINITY_4 = 25;
var WORD_POS_INFINITY_5 = 26;
var WORD_POS_INFINITY_6 = 27;
var WORD_POS_INFINITY_7 = 28;
var WORD_POS_FIELD = 29;
var WORD_POS_AFTER_FIELD = 30;
var WORD_POS_END = 31;
var WORD_POS_AFTER_FIELD_VALUE = 32;
var CONTEXT_UNKNOWN = 0;
var CONTEXT_IN_ARRAY = 1;
var CONTEXT_OBJECT_FIELD = 2;
var CONTEXT_OBJECT_FIELD_VALUE = 3;
var CONTEXT_CLASS_FIELD = 4;
var CONTEXT_CLASS_VALUE = 5;
var CONTEXT_CLASS_FIELD_VALUE = 6;
var keywords = {
	["true"]: true,
	["false"]: false,
	["null"]: null,
	["NaN"]: NaN,
	["Infinity"]: Infinity,
	["undefined"]: void 0
};
var DateNS = class extends Date {
	constructor(a, b) {
		super(a);
		this.ns = b || 0;
	}
};
JSOX.DateNS = DateNS;
var contexts = [];
function getContext() {
	let ctx = contexts.pop();
	if (!ctx) ctx = {
		context: CONTEXT_UNKNOWN,
		current_proto: null,
		current_class: null,
		current_class_field: 0,
		arrayType: -1,
		valueType: VALUE_UNSET,
		elements: null
	};
	return ctx;
}
function dropContext(ctx) {
	contexts.push(ctx);
}
JSOX.updateContext = function() {};
var buffers = [];
function getBuffer() {
	let buf = buffers.pop();
	if (!buf) buf = {
		buf: null,
		n: 0
	};
	else buf.n = 0;
	return buf;
}
function dropBuffer(buf) {
	buffers.push(buf);
}
/**
* @param {string} string 
* @returns {string}
*/
JSOX.escape = function(string) {
	let n;
	let output = "";
	if (!string) return string;
	for (n = 0; n < string.length; n++) {
		if (string[n] == "\"" || string[n] == "\\" || string[n] == "`" || string[n] == "'") output += "\\";
		output += string[n];
	}
	return output;
};
var toProtoTypes = /* @__PURE__ */ new WeakMap();
var toObjectTypes = /* @__PURE__ */ new Map();
var fromProtoTypes = /* @__PURE__ */ new Map();
var commonClasses = [];
JSOX.reset = resetJSOX;
function resetJSOX() {
	toProtoTypes = /* @__PURE__ */ new WeakMap();
	toObjectTypes = /* @__PURE__ */ new Map();
	fromProtoTypes = /* @__PURE__ */ new Map();
	commonClasses = [];
}
/**
* @param {(value:any)} [cb]
* @param {(this: unknown, key: string, value: unknown) => any} [reviver] 
* @returns {none}
*/
JSOX.begin = function(cb, reviver) {
	const val = {
		name: null,
		value_type: VALUE_UNSET,
		string: "",
		contains: null,
		className: null
	};
	const pos = {
		line: 1,
		col: 1
	};
	let n = 0;
	let str;
	let localFromProtoTypes = /* @__PURE__ */ new Map();
	let word = WORD_POS_RESET, status = true, redefineClass = false, negative = false, result = null, rootObject = null, elements = void 0, context_stack = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
			this.length++;
		},
		pop() {
			let result = this.last;
			if (!(this.last = result.prior)) this.first = null;
			result.next = this.saved;
			if (this.last) this.last.next = null;
			if (!result.next) result.first = null;
			this.saved = result;
			this.length--;
			return result.node;
		},
		length: 0
	}, classes = [], protoTypes = {}, current_proto = null, current_class = null, current_class_field = 0, arrayType = -1, parse_context = CONTEXT_UNKNOWN, comment = 0, fromHex = false, decimal = false, exponent = false, exponent_sign = false, exponent_digit = false, inQueue = {
		first: null,
		last: null,
		saved: null,
		push(node) {
			let recover = this.saved;
			if (recover) {
				this.saved = recover.next;
				recover.node = node;
				recover.next = null;
				recover.prior = this.last;
			} else recover = {
				node,
				next: null,
				prior: this.last
			};
			if (!this.last) this.first = recover;
			else this.last.next = recover;
			this.last = recover;
		},
		shift() {
			let result = this.first;
			if (!result) return null;
			if (!(this.first = result.next)) this.last = null;
			result.next = this.saved;
			this.saved = result;
			return result.node;
		},
		unshift(node) {
			let recover = this.saved;
			this.saved = recover.next;
			recover.node = node;
			recover.next = this.first;
			recover.prior = null;
			if (!this.first) this.last = recover;
			this.first = recover;
		}
	}, gatheringStringFirstChar = null, gatheringString = false, gatheringNumber = false, stringEscape = false, cr_escaped = false, unicodeWide = false, stringUnicode = false, stringHex = false, hex_char = 0, hex_char_len = 0, completed = false, date_format = false, isBigInt = false;
	function throwEndError(leader) {
		throw new Error(`${leader} at ${n} [${pos.line}:${pos.col}]`);
	}
	return {
		/**
		* Define a class that can be used to deserialize objects of this type.
		* @param {string} prototypeName 
		* @param {type} o 
		* @param {(any)=>any} f 
		*/
		fromJSOX(prototypeName, o, f) {
			if (localFromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
			function privateProto() {}
			if (!o) o = privateProto;
			if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
			localFromProtoTypes.set(prototypeName, {
				protoCon: o.prototype.constructor,
				cb: f
			});
		},
		registerFromJSOX(prototypeName, o) {
			throw new Error("registerFromJSOX is deprecated, please update to use fromJSOX instead:" + prototypeName + o.toString());
		},
		finalError() {
			if (comment !== 0) {
				if (comment === 1) throwEndError("Comment began at end of document");
				if (comment === 2);
				if (comment === 3) throwEndError("Open comment '/*' is missing close at end of document");
				if (comment === 4) throwEndError("Incomplete '/* *' close at end of document");
			}
			if (gatheringString) throwEndError("Incomplete string");
		},
		value() {
			this.finalError();
			let r = result;
			result = void 0;
			return r;
		},
		/**
		* Reset the parser to a blank state.
		*/
		reset() {
			word = WORD_POS_RESET;
			status = true;
			if (inQueue.last) inQueue.last.next = inQueue.save;
			inQueue.save = inQueue.first;
			inQueue.first = inQueue.last = null;
			if (context_stack.last) context_stack.last.next = context_stack.save;
			context_stack.length = 0;
			context_stack.save = inQueue.first;
			context_stack.first = context_stack.last = null;
			elements = void 0;
			parse_context = CONTEXT_UNKNOWN;
			classes = [];
			protoTypes = {};
			current_proto = null;
			current_class = null;
			current_class_field = 0;
			val.value_type = VALUE_UNSET;
			val.name = null;
			val.string = "";
			val.className = null;
			pos.line = 1;
			pos.col = 1;
			negative = false;
			comment = 0;
			completed = false;
			gatheringString = false;
			stringEscape = false;
			cr_escaped = false;
			date_format = false;
		},
		usePrototype(className, protoType) {
			protoTypes[className] = protoType;
		},
		/**
		* Add input to the parser to get parsed.
		* @param {string} msg 
		*/
		write(msg) {
			let retcode;
			if (typeof msg !== "string" && typeof msg !== "undefined") msg = String(msg);
			if (!status) throw new Error("Parser is still in an error state, please reset before resuming");
			for (retcode = this._write(msg, false); retcode > 0; retcode = this._write()) {
				if (typeof reviver === "function") (function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				})({ "": result }, "");
				result = cb(result);
				if (retcode < 2) break;
			}
		},
		/**
		* Parse a string and return the result.
		* @param {string} msg
		* @param {(key:string,value:any)=>any} [reviver]
		* @returns {any}
		*/
		parse(msg, reviver) {
			if (typeof msg !== "string") msg = String(msg);
			this.reset();
			const writeResult = this._write(msg, true);
			if (writeResult > 0) {
				if (writeResult > 1) {}
				let result = this.value();
				if ("undefined" === typeof result && writeResult > 1) throw new Error("Pending value could not complete");
				result = typeof reviver === "function" ? function walk(holder, key) {
					let k, v, value = holder[key];
					if (value && typeof value === "object") {
						for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== void 0) value[k] = v;
							else delete value[k];
						}
					}
					return reviver.call(holder, key, value);
				}({ "": result }, "") : result;
				return result;
			}
			this.finalError();
		},
		_write(msg, complete_at_end) {
			let cInt;
			let input;
			let buf;
			let retval = 0;
			function throwError(leader, c) {
				throw new Error(`${leader} '${String.fromCodePoint(c)}' unexpected at ${n} (near '${buf.substr(n > 4 ? n - 4 : 0, n > 4 ? 3 : n - 1)}[${String.fromCodePoint(c)}]${buf.substr(n, 10)}') [${pos.line}:${pos.col}]`);
			}
			function RESET_VAL() {
				val.value_type = VALUE_UNSET;
				val.string = "";
				val.contains = null;
			}
			function convertValue() {
				let fp = null;
				switch (val.value_type) {
					case VALUE_NUMBER:
						if ((val.string.length > 13 || val.string.length == 13 && val[0] > "2") && !date_format && !exponent_digit && !exponent_sign && !decimal) isBigInt = true;
						if (isBigInt) if (hasBigInt) return BigInt(val.string);
						else throw new Error("no builtin BigInt()", 0);
						if (date_format) {
							const r = val.string.match(/\.(\d\d\d\d*)/);
							const frac = r ? r[1] : null;
							if (!frac || frac.length < 4) {
								const r = new Date(val.string);
								if (isNaN(r.getTime())) throwError("Bad Date format", cInt);
								return r;
							} else {
								let ns = frac.substr(3);
								while (ns.length < 6) ns = ns + "0";
								const r = new DateNS(val.string, Number(ns));
								if (isNaN(r.getTime())) throwError("Bad DateNS format" + r + r.getTime(), cInt);
								return r;
							}
						}
						return (negative ? -1 : 1) * Number(val.string);
					case VALUE_STRING:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							if (fp && fp.cb) {
								val.className = null;
								return fp.cb.call(val.string);
							} else throw new Error("Double string error, no constructor for: new " + val.className + "(" + val.string + ")");
						}
						return val.string;
					case VALUE_TRUE: return true;
					case VALUE_FALSE: return false;
					case VALUE_NEG_NAN: return NaN;
					case VALUE_NAN: return NaN;
					case VALUE_NEG_INFINITY: return -Infinity;
					case VALUE_INFINITY: return Infinity;
					case VALUE_NULL: return null;
					case VALUE_UNDEFINED: return;
					case VALUE_EMPTY: return;
					case VALUE_OBJECT:
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return val.contains = fp.cb.call(val.contains);
						}
						return val.contains;
					case VALUE_ARRAY:
						if (arrayType >= 0) {
							let ab;
							if (val.contains.length) ab = DecodeBase64(val.contains[0]);
							else ab = DecodeBase64(val.string);
							if (arrayType === 0) {
								arrayType = -1;
								return ab;
							} else {
								const newab = new knownArrayTypes[arrayType](ab);
								arrayType = -1;
								return newab;
							}
						} else if (arrayType === -2) {
							let obj = rootObject;
							let lvl;
							const pathlen = val.contains.length;
							for (lvl = 0; lvl < pathlen; lvl++) {
								const idx = val.contains[lvl];
								let nextObj = obj[idx];
								if (!nextObj) {
									let ctx = context_stack.first;
									let p = 0;
									while (ctx && p < pathlen && p < context_stack.length) {
										const thisKey = val.contains[p];
										if (!ctx.next || thisKey !== ctx.next.node.name) break;
										if (ctx.next) if ("number" === typeof thisKey) {
											const actualObject = ctx.next.node.elements;
											if (actualObject && thisKey >= actualObject.length) if (p === context_stack.length - 1) {
												console.log("This is actually at the current object so use that", p, val.contains, elements);
												nextObj = elements;
												p++;
												ctx = ctx.next;
												break;
											} else {
												if (ctx.next.next && thisKey === actualObject.length) {
													nextObj = ctx.next.next.node.elements;
													ctx = ctx.next;
													p++;
													obj = nextObj;
													continue;
												}
												nextObj = elements;
												p++;
												break;
											}
										} else if (thisKey !== ctx.next.node.name) {
											nextObj = ctx.next.node.elements[thisKey];
											lvl = p;
											break;
										} else if (ctx.next.next) nextObj = ctx.next.next.node.elements;
										else nextObj = elements;
										else nextObj = nextObj[thisKey];
										ctx = ctx.next;
										p++;
									}
									if (p < pathlen) lvl = p - 1;
									else lvl = p;
								}
								if ("object" === typeof nextObj && !nextObj) throw new Error("Path did not resolve properly:" + val.contains + " at " + idx + "(" + lvl + ")");
								obj = nextObj;
							}
							arrayType = -3;
							return obj;
						}
						if (val.className) {
							fp = localFromProtoTypes.get(val.className);
							if (!fp) fp = fromProtoTypes.get(val.className);
							val.className = null;
							if (fp && fp.cb) return fp.cb.call(val.contains);
						}
						return val.contains;
					default:
						console.log("Unhandled value conversion.", val);
						break;
				}
			}
			function arrayPush() {
				if (arrayType == -3) {
					if (val.value_type === VALUE_OBJECT) elements.push(val.contains);
					arrayType = -1;
					return;
				}
				switch (val.value_type) {
					case VALUE_EMPTY:
						elements.push(void 0);
						delete elements[elements.length - 1];
						break;
					default:
						elements.push(convertValue());
						break;
				}
				RESET_VAL();
			}
			function objectPush() {
				if (arrayType === -3 && val.value_type === VALUE_ARRAY) {
					RESET_VAL();
					arrayType = -1;
					return;
				}
				if (val.value_type === VALUE_EMPTY) return;
				if (!val.name && current_class) val.name = current_class.fields[current_class_field++];
				let value = convertValue();
				if (current_proto && current_proto.protoDef && current_proto.protoDef.cb) {
					value = current_proto.protoDef.cb.call(elements, val.name, value);
					if (value) elements[val.name] = value;
				} else elements[val.name] = value;
				RESET_VAL();
			}
			function recoverIdent(cInt) {
				if (word !== WORD_POS_RESET) {
					if (negative) throwError("Negative outside of quotes, being converted to a string (would lose count of leading '-' characters)", cInt);
					switch (word) {
						case WORD_POS_END:
							switch (val.value_type) {
								case VALUE_TRUE:
									val.string += "true";
									break;
								case VALUE_FALSE:
									val.string += "false";
									break;
								case VALUE_NULL:
									val.string += "null";
									break;
								case VALUE_INFINITY:
									val.string += "Infinity";
									break;
								case VALUE_NEG_INFINITY:
									val.string += "-Infinity";
									throwError("Negative outside of quotes, being converted to a string", cInt);
									break;
								case VALUE_NAN:
									val.string += "NaN";
									break;
								case VALUE_NEG_NAN:
									val.string += "-NaN";
									throwError("Negative outside of quotes, being converted to a string", cInt);
									break;
								case VALUE_UNDEFINED:
									val.string += "undefined";
									break;
								case VALUE_STRING: break;
								case VALUE_UNSET: break;
								default: console.log("Value of type " + val.value_type + " is not restored...");
							}
							break;
						case WORD_POS_TRUE_1:
							val.string += "t";
							break;
						case WORD_POS_TRUE_2:
							val.string += "tr";
							break;
						case WORD_POS_TRUE_3:
							val.string += "tru";
							break;
						case WORD_POS_FALSE_1:
							val.string += "f";
							break;
						case WORD_POS_FALSE_2:
							val.string += "fa";
							break;
						case WORD_POS_FALSE_3:
							val.string += "fal";
							break;
						case WORD_POS_FALSE_4:
							val.string += "fals";
							break;
						case WORD_POS_NULL_1:
							val.string += "n";
							break;
						case WORD_POS_NULL_2:
							val.string += "nu";
							break;
						case WORD_POS_NULL_3:
							val.string += "nul";
							break;
						case WORD_POS_UNDEFINED_1:
							val.string += "u";
							break;
						case WORD_POS_UNDEFINED_2:
							val.string += "un";
							break;
						case WORD_POS_UNDEFINED_3:
							val.string += "und";
							break;
						case WORD_POS_UNDEFINED_4:
							val.string += "unde";
							break;
						case WORD_POS_UNDEFINED_5:
							val.string += "undef";
							break;
						case WORD_POS_UNDEFINED_6:
							val.string += "undefi";
							break;
						case WORD_POS_UNDEFINED_7:
							val.string += "undefin";
							break;
						case WORD_POS_UNDEFINED_8:
							val.string += "undefine";
							break;
						case WORD_POS_NAN_1:
							val.string += "N";
							break;
						case WORD_POS_NAN_2:
							val.string += "Na";
							break;
						case WORD_POS_INFINITY_1:
							val.string += "I";
							break;
						case WORD_POS_INFINITY_2:
							val.string += "In";
							break;
						case WORD_POS_INFINITY_3:
							val.string += "Inf";
							break;
						case WORD_POS_INFINITY_4:
							val.string += "Infi";
							break;
						case WORD_POS_INFINITY_5:
							val.string += "Infin";
							break;
						case WORD_POS_INFINITY_6:
							val.string += "Infini";
							break;
						case WORD_POS_INFINITY_7:
							val.string += "Infinit";
							break;
						case WORD_POS_RESET: break;
						case WORD_POS_FIELD: break;
						case WORD_POS_AFTER_FIELD: break;
						case WORD_POS_AFTER_FIELD_VALUE:
							throwError("String-keyword recovery fail (after whitespace)", cInt);
							break;
						default:
					}
					val.value_type = VALUE_STRING;
					if (word < WORD_POS_FIELD) word = WORD_POS_END;
				} else {
					word = WORD_POS_END;
					val.value_type = VALUE_STRING;
				}
				if (cInt == 123) openObject();
				else if (cInt == 91) openArray();
				else if (cInt == 44) {} else {
					if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 65279 || cInt == 8232 || cInt == 8233) return;
					if (cInt == 44 || cInt == 125 || cInt == 93 || cInt == 58) throwError("Invalid character near identifier", cInt);
					else val.string += str;
				}
			}
			function gatherString(start_c) {
				let retval = 0;
				while (retval == 0 && n < buf.length) {
					str = buf.charAt(n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					pos.col++;
					if (cInt == start_c) if (stringEscape) {
						if (stringHex) throwError("Incomplete hexidecimal sequence", cInt);
						else if (stringUnicode) throwError("Incomplete long unicode sequence", cInt);
						else if (unicodeWide) throwError("Incomplete unicode sequence", cInt);
						if (cr_escaped) {
							cr_escaped = false;
							retval = 1;
						} else val.string += str;
						stringEscape = false;
					} else retval = 1;
					else if (stringEscape) {
						if (unicodeWide) {
							if (cInt == 125) {
								val.string += String.fromCodePoint(hex_char);
								unicodeWide = false;
								stringUnicode = false;
								stringEscape = false;
								continue;
							}
							hex_char *= 16;
							if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
							else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
							else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
							else {
								throwError("(escaped character, parsing hex of \\u)", cInt);
								retval = -1;
								unicodeWide = false;
								stringEscape = false;
								continue;
							}
							continue;
						} else if (stringHex || stringUnicode) {
							if (hex_char_len === 0 && cInt === 123) {
								unicodeWide = true;
								continue;
							}
							if (hex_char_len < 2 || stringUnicode && hex_char_len < 4) {
								hex_char *= 16;
								if (cInt >= 48 && cInt <= 57) hex_char += cInt - 48;
								else if (cInt >= 65 && cInt <= 70) hex_char += cInt - 65 + 10;
								else if (cInt >= 97 && cInt <= 102) hex_char += cInt - 97 + 10;
								else {
									throwError(stringUnicode ? "(escaped character, parsing hex of \\u)" : "(escaped character, parsing hex of \\x)", cInt);
									retval = -1;
									stringHex = false;
									stringEscape = false;
									continue;
								}
								hex_char_len++;
								if (stringUnicode) {
									if (hex_char_len == 4) {
										val.string += String.fromCodePoint(hex_char);
										stringUnicode = false;
										stringEscape = false;
									}
								} else if (hex_char_len == 2) {
									val.string += String.fromCodePoint(hex_char);
									stringHex = false;
									stringEscape = false;
								}
								continue;
							}
						}
						switch (cInt) {
							case 13:
								cr_escaped = true;
								pos.col = 1;
								continue;
							case 8232:
							case 8233: pos.col = 1;
							case 10:
								if (!cr_escaped) pos.col = 1;
								else cr_escaped = false;
								pos.line++;
								break;
							case 116:
								val.string += "	";
								break;
							case 98:
								val.string += "\b";
								break;
							case 110:
								val.string += "\n";
								break;
							case 114:
								val.string += "\r";
								break;
							case 102:
								val.string += "\f";
								break;
							case 118:
								val.string += "\v";
								break;
							case 48:
								val.string += "\0";
								break;
							case 120:
								stringHex = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							case 117:
								stringUnicode = true;
								hex_char_len = 0;
								hex_char = 0;
								continue;
							default:
								val.string += str;
								break;
						}
						stringEscape = false;
					} else if (cInt === 92) if (stringEscape) {
						val.string += "\\";
						stringEscape = false;
					} else {
						stringEscape = true;
						hex_char = 0;
						hex_char_len = 0;
					}
					else {
						if (cr_escaped) {
							cr_escaped = false;
							pos.line++;
							pos.col = 2;
						}
						val.string += str;
					}
				}
				return retval;
			}
			function collectNumber() {
				let _n;
				while ((_n = n) < buf.length) {
					str = buf.charAt(_n);
					let cInt = buf.codePointAt(n++);
					if (cInt >= 256) {
						pos.col -= n - _n;
						n = _n;
						break;
					} else {
						if (cInt == 95) continue;
						pos.col++;
						if (cInt >= 48 && cInt <= 57) {
							if (exponent) exponent_digit = true;
							val.string += str;
						} else if (cInt == 45 || cInt == 43) if (val.string.length == 0 || exponent && !exponent_sign && !exponent_digit) {
							if (cInt == 45 && !exponent) negative = !negative;
							val.string += str;
							exponent_sign = true;
						} else {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						}
						else if (cInt == 78) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_NAN_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 73) {
							if (word == WORD_POS_RESET) {
								gatheringNumber = false;
								word = WORD_POS_INFINITY_1;
								return;
							}
							throwError("fault while parsing number;", cInt);
							break;
						} else if (cInt == 58 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 84 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 90 && date_format) {
							if (negative) {
								val.string = "-" + val.string;
								negative = false;
							}
							val.string += str;
							date_format = true;
						} else if (cInt == 46) if (!decimal && !fromHex && !exponent) {
							val.string += str;
							decimal = true;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 110) {
							isBigInt = true;
							break;
						} else if (fromHex && (cInt >= 95 && cInt <= 102 || cInt >= 65 && cInt <= 70)) val.string += str;
						else if (cInt == 120 || cInt == 98 || cInt == 111 || cInt == 88 || cInt == 66 || cInt == 79) if (!fromHex && val.string == "0") {
							fromHex = true;
							val.string += str;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 101 || cInt == 69) if (!exponent) {
							val.string += str;
							exponent = true;
						} else {
							status = false;
							throwError("fault while parsing number;", cInt);
							break;
						}
						else if (cInt == 32 || cInt == 13 || cInt == 10 || cInt == 9 || cInt == 47 || cInt == 35 || cInt == 44 || cInt == 125 || cInt == 93 || cInt == 123 || cInt == 91 || cInt == 34 || cInt == 39 || cInt == 96 || cInt == 58) {
							pos.col -= n - _n;
							n = _n;
							break;
						} else {
							if (complete_at_end) {
								status = false;
								throwError("fault while parsing number;", cInt);
							}
							break;
						}
					}
				}
				if (!complete_at_end && n == buf.length) gatheringNumber = true;
				else {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
				}
			}
			function openObject() {
				let nextMode = CONTEXT_OBJECT_FIELD;
				let cls = null;
				let tmpobj = {};
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(123);
				let protoDef;
				protoDef = getProto();
				if (parse_context == CONTEXT_UNKNOWN) if (word == WORD_POS_FIELD || word == WORD_POS_END && (protoDef || val.string.length)) {
					if (protoDef && protoDef.protoDef && protoDef.protoDef.protoCon) tmpobj = new protoDef.protoDef.protoCon();
					if (!protoDef || !protoDef.protoDef && val.string) {
						cls = classes.find((cls) => cls.name === val.string);
						if (!cls) {
							function privateProto() {}
							classes.push(cls = {
								name: val.string,
								protoCon: protoDef && protoDef.protoDef && protoDef.protoDef.protoCon || privateProto.constructor,
								fields: []
							});
							nextMode = CONTEXT_CLASS_FIELD;
						} else if (redefineClass) {
							cls.fields.length = 0;
							nextMode = CONTEXT_CLASS_FIELD;
						} else {
							tmpobj = new cls.protoCon();
							nextMode = CONTEXT_CLASS_VALUE;
						}
						redefineClass = false;
					}
					current_class = cls;
					word = WORD_POS_RESET;
				} else word = WORD_POS_FIELD;
				else if (word == WORD_POS_FIELD || parse_context === CONTEXT_IN_ARRAY || parse_context === CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) if (word != WORD_POS_RESET || val.value_type == VALUE_STRING) {
					if (protoDef && protoDef.protoDef) tmpobj = new protoDef.protoDef.protoCon();
					else {
						cls = classes.find((cls) => cls.name === val.string);
						if (!cls) {
							function privateProto() {}
							localFromProtoTypes.set(val.string, {
								protoCon: privateProto.prototype.constructor,
								cb: null
							});
							tmpobj = new privateProto();
						} else {
							nextMode = CONTEXT_CLASS_VALUE;
							tmpobj = {};
						}
					}
					word = WORD_POS_RESET;
				} else word = WORD_POS_RESET;
				else if (parse_context == CONTEXT_OBJECT_FIELD && word == WORD_POS_RESET) {
					throwError("fault while parsing; getting field name unexpected ", cInt);
					status = false;
					return false;
				}
				let old_context = getContext();
				val.value_type = VALUE_OBJECT;
				if (parse_context === CONTEXT_UNKNOWN) elements = tmpobj;
				else if (parse_context == CONTEXT_IN_ARRAY) {
					if (arrayType == -1) {}
					val.name = elements.length;
				} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE || parse_context == CONTEXT_CLASS_VALUE) {
					if (!val.name && current_class) val.name = current_class.fields[current_class_field++];
					elements[val.name] = tmpobj;
				}
				old_context.context = parse_context;
				old_context.elements = elements;
				old_context.name = val.name;
				old_context.current_proto = current_proto;
				old_context.current_class = current_class;
				old_context.current_class_field = current_class_field;
				old_context.valueType = val.value_type;
				old_context.arrayType = arrayType;
				old_context.className = val.className;
				val.className = null;
				val.name = null;
				current_proto = protoDef;
				current_class = cls;
				current_class_field = 0;
				elements = tmpobj;
				if (!rootObject) rootObject = elements;
				context_stack.push(old_context);
				RESET_VAL();
				parse_context = nextMode;
				return true;
			}
			function openArray() {
				if (word > WORD_POS_RESET && word < WORD_POS_FIELD) recoverIdent(91);
				if (word == WORD_POS_END && val.string.length) {
					let typeIndex = knownArrayTypeNames.findIndex((type) => type === val.string);
					word = WORD_POS_RESET;
					if (typeIndex >= 0) {
						arrayType = typeIndex;
						val.className = val.string;
						val.string = null;
					} else if (val.string === "ref") {
						val.className = null;
						arrayType = -2;
					} else if (localFromProtoTypes.get(val.string)) val.className = val.string;
					else if (fromProtoTypes.get(val.string)) val.className = val.string;
					else throwError(`Unknown type '${val.string}' specified for array`, cInt);
				} else if (parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || word == WORD_POS_AFTER_FIELD) {
					throwError("Fault while parsing; while getting field name unexpected", cInt);
					status = false;
					return false;
				}
				{
					let old_context = getContext();
					val.value_type = VALUE_ARRAY;
					let tmparr = [];
					if (parse_context == CONTEXT_UNKNOWN) elements = tmparr;
					else if (parse_context == CONTEXT_IN_ARRAY) {
						if (arrayType == -1) elements.push(tmparr);
						val.name = elements.length;
					} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
						if (!val.name) {
							console.log("This says it's resolved.......");
							arrayType = -3;
						}
						if (current_proto && current_proto.protoDef) if (current_proto.protoDef.cb) {
							const newarr = current_proto.protoDef.cb.call(elements, val.name, tmparr);
							if (newarr !== void 0) tmparr = elements[val.name] = newarr;
						} else elements[val.name] = tmparr;
						else elements[val.name] = tmparr;
					}
					old_context.context = parse_context;
					old_context.elements = elements;
					old_context.name = val.name;
					old_context.current_proto = current_proto;
					old_context.current_class = current_class;
					old_context.current_class_field = current_class_field;
					old_context.valueType = val.value_type;
					old_context.arrayType = arrayType == -1 ? -3 : arrayType;
					old_context.className = val.className;
					arrayType = -1;
					val.className = null;
					val.name = null;
					current_proto = null;
					current_class = null;
					current_class_field = 0;
					elements = tmparr;
					if (!rootObject) rootObject = tmparr;
					context_stack.push(old_context);
					RESET_VAL();
					parse_context = CONTEXT_IN_ARRAY;
				}
				return true;
			}
			function getProto() {
				const result = {
					protoDef: null,
					cls: null
				};
				if (result.protoDef = localFromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				} else if (result.protoDef = fromProtoTypes.get(val.string)) {
					if (!val.className) {
						val.className = val.string;
						val.string = null;
					}
				}
				if (val.string) {
					result.cls = classes.find((cls) => cls.name === val.string);
					if (!result.protoDef && !result.cls) {}
				}
				return result.protoDef || result.cls ? result : null;
			}
			if (!status) return -1;
			if (msg && msg.length) {
				input = getBuffer();
				input.buf = msg;
				inQueue.push(input);
			} else {
				if (gatheringNumber) {
					gatheringNumber = false;
					val.value_type = VALUE_NUMBER;
					if (parse_context == CONTEXT_UNKNOWN) completed = true;
					retval = 1;
				}
				if (parse_context !== CONTEXT_UNKNOWN) throwError("Unclosed object at end of stream.", cInt);
			}
			while (status && (input = inQueue.shift())) {
				n = input.n;
				buf = input.buf;
				if (gatheringString) {
					let string_status = gatherString(gatheringStringFirstChar);
					if (string_status < 0) status = false;
					else if (string_status > 0) {
						gatheringString = false;
						if (status) val.value_type = VALUE_STRING;
					}
				}
				if (gatheringNumber) collectNumber();
				while (!completed && status && n < buf.length) {
					str = buf.charAt(n);
					cInt = buf.codePointAt(n++);
					if (cInt >= 65536) {
						str += buf.charAt(n);
						n++;
					}
					pos.col++;
					if (comment) {
						if (comment == 1) if (cInt == 42) comment = 3;
						else if (cInt != 47) return throwError("fault while parsing;", cInt);
						else comment = 2;
						else if (comment == 2) {
							if (cInt == 10 || cInt == 13) comment = 0;
						} else if (comment == 3) {
							if (cInt == 42) comment = 4;
						} else if (cInt == 47) comment = 0;
						else comment = 3;
						continue;
					}
					switch (cInt) {
						case 35:
							comment = 2;
							break;
						case 47:
							comment = 1;
							break;
						case 123:
							openObject();
							break;
						case 91:
							openArray();
							break;
						case 58:
							if (parse_context == CONTEXT_CLASS_VALUE) {
								word = WORD_POS_RESET;
								val.name = val.string;
								val.string = "";
								val.value_type = VALUE_UNSET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_FIELD) if (parse_context == CONTEXT_CLASS_FIELD) {
								if (!Object.keys(elements).length) {
									console.log("This is a full object, not a class def...", val.className);
									const privateProto = () => {};
									localFromProtoTypes.set(context_stack.last.node.current_class.name, {
										protoCon: privateProto.prototype.constructor,
										cb: null
									});
									elements = new privateProto();
									parse_context = CONTEXT_OBJECT_FIELD_VALUE;
									val.name = val.string;
									word = WORD_POS_RESET;
									val.string = "";
									val.value_type = VALUE_UNSET;
									console.log("don't do default;s do a revive...");
								}
							} else {
								if (word != WORD_POS_RESET && word != WORD_POS_END && word != WORD_POS_FIELD && word != WORD_POS_AFTER_FIELD) recoverIdent(32);
								word = WORD_POS_RESET;
								val.name = val.string;
								val.string = "";
								parse_context = parse_context === CONTEXT_OBJECT_FIELD ? CONTEXT_OBJECT_FIELD_VALUE : CONTEXT_CLASS_FIELD_VALUE;
								val.value_type = VALUE_UNSET;
							}
							else if (parse_context == CONTEXT_UNKNOWN) {
								console.log("Override colon found, allow class redefinition", parse_context);
								redefineClass = true;
								break;
							} else {
								if (parse_context == CONTEXT_IN_ARRAY) throwError("(in array, got colon out of string):parsing fault;", cInt);
								else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
								else throwError("(outside any object, got colon out of string):parsing fault;", cInt);
								status = false;
							}
							break;
						case 125:
							if (word == WORD_POS_END) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) if (current_class) {
								if (val.string) current_class.fields.push(val.string);
								RESET_VAL();
								let old_context = context_stack.pop();
								parse_context = CONTEXT_UNKNOWN;
								word = WORD_POS_RESET;
								val.name = old_context.name;
								elements = old_context.elements;
								current_class = old_context.current_class;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								rootObject = null;
								dropContext(old_context);
							} else throwError("State error; gathering class fields, and lost the class", cInt);
							else if (parse_context == CONTEXT_OBJECT_FIELD || parse_context == CONTEXT_CLASS_VALUE) {
								if (val.value_type != VALUE_UNSET) {
									if (current_class) val.name = current_class.fields[current_class_field++];
									objectPush();
								}
								val.value_type = VALUE_OBJECT;
								if (current_proto && current_proto.protoDef) {
									console.log("SOMETHING SHOULD AHVE BEEN REPLACED HERE??", current_proto);
									console.log("The other version only revives on init");
									elements = new current_proto.protoDef.cb(elements, void 0, void 0);
								}
								val.contains = elements;
								val.string = "";
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_class = old_context.current_class;
								current_proto = old_context.current_proto;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
								if (val.value_type === VALUE_UNSET) throwError("Fault while parsing; unexpected", cInt);
								objectPush();
								val.value_type = VALUE_OBJECT;
								val.contains = elements;
								word = WORD_POS_RESET;
								let old_context = context_stack.pop();
								parse_context = old_context.context;
								val.name = old_context.name;
								elements = old_context.elements;
								current_proto = old_context.current_proto;
								current_class = old_context.current_class;
								current_class_field = old_context.current_class_field;
								arrayType = old_context.arrayType;
								val.value_type = old_context.valueType;
								val.className = old_context.className;
								dropContext(old_context);
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError("Fault while parsing; unexpected", cInt);
								status = false;
							}
							negative = false;
							break;
						case 93:
							if (word >= WORD_POS_AFTER_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type != VALUE_UNSET) arrayPush();
								val.contains = elements;
								{
									let old_context = context_stack.pop();
									val.name = old_context.name;
									val.className = old_context.className;
									parse_context = old_context.context;
									elements = old_context.elements;
									current_proto = old_context.current_proto;
									current_class = old_context.current_class;
									current_class_field = old_context.current_class_field;
									arrayType = old_context.arrayType;
									val.value_type = old_context.valueType;
									dropContext(old_context);
								}
								val.value_type = VALUE_ARRAY;
								if (parse_context == CONTEXT_UNKNOWN) completed = true;
							} else {
								throwError(`bad context ${parse_context}; fault while parsing`, cInt);
								status = false;
							}
							negative = false;
							break;
						case 44:
							if (word < WORD_POS_AFTER_FIELD && word != WORD_POS_RESET) recoverIdent(cInt);
							if (word == WORD_POS_END || word == WORD_POS_FIELD) word = WORD_POS_RESET;
							if (parse_context == CONTEXT_CLASS_FIELD) if (current_class) {
								current_class.fields.push(val.string);
								val.string = "";
								word = WORD_POS_FIELD;
							} else throwError("State error; gathering class fields, and lost the class", cInt);
							else if (parse_context == CONTEXT_OBJECT_FIELD) {
								if (current_class) {
									val.name = current_class.fields[current_class_field++];
									if (val.value_type != VALUE_UNSET) {
										objectPush();
										RESET_VAL();
									}
								} else if (val.string || val.value_type) throwError("State error; comma in field name and/or lost the class", cInt);
							} else if (parse_context == CONTEXT_CLASS_VALUE) {
								if (current_class) {
									if (arrayType != -3 && !val.name) val.name = current_class.fields[current_class_field++];
									if (val.value_type != VALUE_UNSET) {
										if (arrayType != -3) objectPush();
										RESET_VAL();
									}
								} else if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								val.name = null;
							} else if (parse_context == CONTEXT_IN_ARRAY) {
								if (val.value_type == VALUE_UNSET) val.value_type = VALUE_EMPTY;
								arrayPush();
								RESET_VAL();
								word = WORD_POS_RESET;
							} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE && val.value_type != VALUE_UNSET) {
								parse_context = CONTEXT_OBJECT_FIELD;
								if (val.value_type != VALUE_UNSET) {
									objectPush();
									RESET_VAL();
								}
								word = WORD_POS_RESET;
							} else {
								status = false;
								throwError("bad context; excessive commas while parsing;", cInt);
							}
							negative = false;
							break;
						default:
							switch (cInt) {
								default:
									if (parse_context == CONTEXT_UNKNOWN || parse_context == CONTEXT_OBJECT_FIELD_VALUE && word == WORD_POS_FIELD || parse_context == CONTEXT_OBJECT_FIELD || word == WORD_POS_FIELD || parse_context == CONTEXT_CLASS_FIELD) switch (cInt) {
										case 96:
										case 34:
										case 39:
											if (word == WORD_POS_RESET || word == WORD_POS_FIELD) {
												if (val.string.length) {
													console.log("IN ARRAY AND FIXING?");
													val.className = val.string;
													val.string = "";
												}
												if (gatherString(cInt)) val.value_type = VALUE_STRING;
												else {
													gatheringStringFirstChar = cInt;
													gatheringString = true;
												}
											} else throwError("fault while parsing; quote not at start of field name", cInt);
											break;
										case 10:
											pos.line++;
											pos.col = 1;
										case 13:
										case 32:
										case 8232:
										case 8233:
										case 9:
										case 65279:
											if (parse_context === CONTEXT_UNKNOWN && word === WORD_POS_END) {
												word = WORD_POS_RESET;
												if (parse_context === CONTEXT_UNKNOWN) completed = true;
												break;
											}
											if (word === WORD_POS_RESET || word === WORD_POS_AFTER_FIELD) {
												if (parse_context == CONTEXT_UNKNOWN && val.value_type) completed = true;
												break;
											} else if (word === WORD_POS_FIELD) {
												if (parse_context === CONTEXT_UNKNOWN) {
													word = WORD_POS_RESET;
													completed = true;
													break;
												}
												if (val.string.length) console.log("STEP TO NEXT TOKEN.");
												word = WORD_POS_AFTER_FIELD;
											} else {
												status = false;
												throwError("fault while parsing; whitepsace unexpected", cInt);
											}
											break;
										default:
											if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
												fromHex = false;
												exponent = false;
												date_format = false;
												isBigInt = false;
												exponent_sign = false;
												exponent_digit = false;
												decimal = false;
												val.string = str;
												input.n = n;
												collectNumber();
												break;
											}
											if (word === WORD_POS_AFTER_FIELD) {
												status = false;
												throwError("fault while parsing; character unexpected", cInt);
											}
											if (word === WORD_POS_RESET) {
												word = WORD_POS_FIELD;
												val.value_type = VALUE_STRING;
												val.string += str;
												break;
											}
											if (val.value_type == VALUE_UNSET) {
												if (word !== WORD_POS_RESET && word !== WORD_POS_END) recoverIdent(cInt);
											} else {
												if (word === WORD_POS_END || word === WORD_POS_FIELD) {
													val.string += str;
													break;
												}
												if (parse_context == CONTEXT_OBJECT_FIELD) {
													if (word == WORD_POS_FIELD) {
														val.string += str;
														break;
													}
													throwError("Multiple values found in field name", cInt);
												}
												if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) throwError("String unexpected", cInt);
											}
											break;
									}
									else {
										if (word == WORD_POS_RESET && (cInt >= 48 && cInt <= 57 || cInt == 43 || cInt == 46 || cInt == 45)) {
											fromHex = false;
											exponent = false;
											date_format = false;
											isBigInt = false;
											exponent_sign = false;
											exponent_digit = false;
											decimal = false;
											val.string = str;
											input.n = n;
											collectNumber();
										} else if (val.value_type == VALUE_UNSET) if (word != WORD_POS_RESET) recoverIdent(cInt);
										else {
											word = WORD_POS_END;
											val.string += str;
											val.value_type = VALUE_STRING;
										}
										else if (parse_context == CONTEXT_OBJECT_FIELD) throwError("Multiple values found in field name", cInt);
										else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											if (val.value_type != VALUE_STRING) {
												if (val.value_type == VALUE_OBJECT || val.value_type == VALUE_ARRAY) throwError("String unexpected", cInt);
												recoverIdent(cInt);
											}
											if (word == WORD_POS_AFTER_FIELD) if (getProto()) val.string = str;
											else throwError("String unexpected", cInt);
											else if (word == WORD_POS_END) val.string += str;
											else throwError("String unexpected", cInt);
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											if (word == WORD_POS_AFTER_FIELD) {
												if (!val.className) {
													val.className = val.string;
													val.string = "";
												}
												val.string += str;
												break;
											} else if (word == WORD_POS_END) val.string += str;
										}
										break;
									}
									break;
								case 96:
								case 34:
								case 39:
									if (val.string) val.className = val.string;
									val.string = "";
									if (gatherString(cInt)) {
										val.value_type = VALUE_STRING;
										word = WORD_POS_END;
									} else {
										gatheringStringFirstChar = cInt;
										gatheringString = true;
									}
									break;
								case 10:
									pos.line++;
									pos.col = 1;
								case 32:
								case 9:
								case 13:
								case 8232:
								case 8233:
								case 65279:
									if (word == WORD_POS_END) {
										if (parse_context == CONTEXT_UNKNOWN) {
											word = WORD_POS_RESET;
											completed = true;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD_VALUE) {
											word = WORD_POS_AFTER_FIELD_VALUE;
											break;
										} else if (parse_context == CONTEXT_OBJECT_FIELD) {
											word = WORD_POS_AFTER_FIELD;
											break;
										} else if (parse_context == CONTEXT_IN_ARRAY) {
											word = WORD_POS_AFTER_FIELD;
											break;
										}
									}
									if (word == WORD_POS_RESET || word == WORD_POS_AFTER_FIELD) break;
									else if (word == WORD_POS_FIELD) {
										if (val.string.length) word = WORD_POS_AFTER_FIELD;
									} else if (word < WORD_POS_END) recoverIdent(cInt);
									break;
								case 116:
									if (word == WORD_POS_RESET) word = WORD_POS_TRUE_1;
									else if (word == WORD_POS_INFINITY_6) word = WORD_POS_INFINITY_7;
									else recoverIdent(cInt);
									break;
								case 114:
									if (word == WORD_POS_TRUE_1) word = WORD_POS_TRUE_2;
									else recoverIdent(cInt);
									break;
								case 117:
									if (word == WORD_POS_TRUE_2) word = WORD_POS_TRUE_3;
									else if (word == WORD_POS_NULL_1) word = WORD_POS_NULL_2;
									else if (word == WORD_POS_RESET) word = WORD_POS_UNDEFINED_1;
									else recoverIdent(cInt);
									break;
								case 101:
									if (word == WORD_POS_TRUE_3) {
										val.value_type = VALUE_TRUE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_4) {
										val.value_type = VALUE_FALSE;
										word = WORD_POS_END;
									} else if (word == WORD_POS_UNDEFINED_3) word = WORD_POS_UNDEFINED_4;
									else if (word == WORD_POS_UNDEFINED_7) word = WORD_POS_UNDEFINED_8;
									else recoverIdent(cInt);
									break;
								case 110:
									if (word == WORD_POS_RESET) word = WORD_POS_NULL_1;
									else if (word == WORD_POS_UNDEFINED_1) word = WORD_POS_UNDEFINED_2;
									else if (word == WORD_POS_UNDEFINED_6) word = WORD_POS_UNDEFINED_7;
									else if (word == WORD_POS_INFINITY_1) word = WORD_POS_INFINITY_2;
									else if (word == WORD_POS_INFINITY_4) word = WORD_POS_INFINITY_5;
									else recoverIdent(cInt);
									break;
								case 100:
									if (word == WORD_POS_UNDEFINED_2) word = WORD_POS_UNDEFINED_3;
									else if (word == WORD_POS_UNDEFINED_8) {
										val.value_type = VALUE_UNDEFINED;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 105:
									if (word == WORD_POS_UNDEFINED_5) word = WORD_POS_UNDEFINED_6;
									else if (word == WORD_POS_INFINITY_3) word = WORD_POS_INFINITY_4;
									else if (word == WORD_POS_INFINITY_5) word = WORD_POS_INFINITY_6;
									else recoverIdent(cInt);
									break;
								case 108:
									if (word == WORD_POS_NULL_2) word = WORD_POS_NULL_3;
									else if (word == WORD_POS_NULL_3) {
										val.value_type = VALUE_NULL;
										word = WORD_POS_END;
									} else if (word == WORD_POS_FALSE_2) word = WORD_POS_FALSE_3;
									else recoverIdent(cInt);
									break;
								case 102:
									if (word == WORD_POS_RESET) word = WORD_POS_FALSE_1;
									else if (word == WORD_POS_UNDEFINED_4) word = WORD_POS_UNDEFINED_5;
									else if (word == WORD_POS_INFINITY_2) word = WORD_POS_INFINITY_3;
									else recoverIdent(cInt);
									break;
								case 97:
									if (word == WORD_POS_FALSE_1) word = WORD_POS_FALSE_2;
									else if (word == WORD_POS_NAN_1) word = WORD_POS_NAN_2;
									else recoverIdent(cInt);
									break;
								case 115:
									if (word == WORD_POS_FALSE_3) word = WORD_POS_FALSE_4;
									else recoverIdent(cInt);
									break;
								case 73:
									if (word == WORD_POS_RESET) word = WORD_POS_INFINITY_1;
									else recoverIdent(cInt);
									break;
								case 78:
									if (word == WORD_POS_RESET) word = WORD_POS_NAN_1;
									else if (word == WORD_POS_NAN_2) {
										val.value_type = negative ? VALUE_NEG_NAN : VALUE_NAN;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 121:
									if (word == WORD_POS_INFINITY_7) {
										val.value_type = negative ? VALUE_NEG_INFINITY : VALUE_INFINITY;
										negative = false;
										word = WORD_POS_END;
									} else recoverIdent(cInt);
									break;
								case 45:
									if (word == WORD_POS_RESET) negative = !negative;
									else recoverIdent(cInt);
									break;
								case 43:
									if (word !== WORD_POS_RESET) recoverIdent(cInt);
									break;
							}
							break;
					}
					if (completed) {
						if (word == WORD_POS_END) word = WORD_POS_RESET;
						break;
					}
				}
				if (n == buf.length) {
					dropBuffer(input);
					if (gatheringString || gatheringNumber || parse_context == CONTEXT_OBJECT_FIELD) retval = 0;
					else if (parse_context == CONTEXT_UNKNOWN && (val.value_type != VALUE_UNSET || result)) {
						completed = true;
						retval = 1;
					}
				} else {
					input.n = n;
					inQueue.unshift(input);
					retval = 2;
				}
				if (completed) {
					rootObject = null;
					break;
				}
			}
			if (!status) return -1;
			if (completed && val.value_type != VALUE_UNSET) {
				word = WORD_POS_RESET;
				result = convertValue();
				negative = false;
				val.string = "";
				val.value_type = VALUE_UNSET;
			}
			completed = false;
			return retval;
		}
	};
};
var _parser = [Object.freeze(JSOX.begin())];
var _parse_level = 0;
/**
* @param {string} msg 
* @param {(this: unknown, key: string, value: unknown) => any} [reviver] 
* @returns {unknown}
*/
JSOX.parse = function(msg, reviver) {
	let parse_level = _parse_level++;
	let parser;
	if (_parser.length <= parse_level) _parser.push(Object.freeze(JSOX.begin()));
	parser = _parser[parse_level];
	if (typeof msg !== "string") msg = String(msg);
	parser.reset();
	const writeResult = parser._write(msg, true);
	if (writeResult > 0) {
		if (writeResult > 1) {}
		let result = parser.value();
		if ("undefined" === typeof result && writeResult > 1) throw new Error("Pending value could not complete");
		result = typeof reviver === "function" ? function walk(holder, key) {
			let k, v, value = holder[key];
			if (value && typeof value === "object") {
				for (k in value) if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = walk(value, k);
					if (v !== void 0) value[k] = v;
					else delete value[k];
				}
			}
			return reviver.call(holder, key, value);
		}({ "": result }, "") : result;
		_parse_level--;
		return result;
	}
	parser.finalError();
};
function this_value() {
	return this && this.valueOf();
}
/**
* Define a class to be used for serialization; the class allows emitting the class fields ahead of time, and just provide values later.
* @param {string} name 
* @param {object} obj 
*/
JSOX.defineClass = function(name, obj) {
	let cls;
	let denormKeys = Object.keys(obj);
	for (let i = 1; i < denormKeys.length; i++) {
		let a, b;
		if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
			denormKeys[i - 1] = b;
			denormKeys[i] = a;
			if (i) i -= 2;
			else i--;
		}
	}
	commonClasses.push(cls = {
		name,
		tag: denormKeys.toString(),
		proto: Object.getPrototypeOf(obj),
		fields: Object.keys(obj)
	});
	for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
		let tmp = cls.fields[n - 1];
		cls.fields[n - 1] = cls.fields[n];
		cls.fields[n] = tmp;
		if (n > 1) n -= 2;
	}
	if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
};
/**
* define a class to be used for serialization
* @param {string} named
* @param {class} ptype
* @param {(any)=>any} f
*/
JSOX.toJSOX = JSOX.registerToJSOX = function(name, ptype, f) {
	if (!ptype.prototype || ptype.prototype !== Object.prototype) {
		if (toProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
		toProtoTypes.set(ptype.prototype, {
			external: true,
			name: name || f.constructor.name,
			cb: f
		});
	} else {
		let key = Object.keys(ptype).toString();
		if (toObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
		toObjectTypes.set(key, {
			external: true,
			name,
			cb: f
		});
	}
};
/**
* define a class to be used for deserialization
* @param {string} prototypeName 
* @param {class} o 
* @param {(any)=>any} f 
*/
JSOX.fromJSOX = function(prototypeName, o, f) {
	function privateProto() {}
	if (!o) o = privateProto.prototype;
	if (fromProtoTypes.get(prototypeName)) throw new Error("Existing fromJSOX has been registered for prototype");
	if (o && !("constructor" in o)) throw new Error("Please pass a prototype like thing...");
	fromProtoTypes.set(prototypeName, {
		protoCon: o.prototype.constructor,
		cb: f
	});
};
JSOX.registerFromJSOX = function(prototypeName, o) {
	throw new Error("deprecated; please adjust code to use fromJSOX:" + prototypeName + o.toString());
};
JSOX.addType = function(prototypeName, prototype, to, from) {
	JSOX.toJSOX(prototypeName, prototype, to);
	JSOX.fromJSOX(prototypeName, prototype, from);
};
JSOX.registerToFrom = function(prototypeName, prototype) {
	throw new Error("registerToFrom deprecated; please use addType:" + prototypeName + prototype.toString());
};
/**
* Create a stringifier to convert objects to JSOX text.  Allows defining custom serialization for objects.
* @returns {Stringifier}
*/
JSOX.stringifier = function() {
	let classes = [];
	let useQuote = "\"";
	let fieldMap = /* @__PURE__ */ new WeakMap();
	const path = [];
	let encoding = [];
	const localToProtoTypes = /* @__PURE__ */ new WeakMap();
	const localToObjectTypes = /* @__PURE__ */ new Map();
	let objectToJSOX = null;
	const stringifying = [];
	let ignoreNonEnumerable = false;
	function getIdentifier(s) {
		if ("string" === typeof s && s === "") return "\"\"";
		if ("number" === typeof s && !isNaN(s)) return [
			"'",
			s.toString(),
			"'"
		].join("");
		if (s.includes("﻿")) return useQuote + JSOX.escape(s) + useQuote;
		return s in keywords || /[0-9\-]/.test(s[0]) || /[\n\r\t #\[\]{}()<>\~!+*/.:,\-"'`]/.test(s) ? useQuote + JSOX.escape(s) + useQuote : s;
	}
	if (!toProtoTypes.get(Object.prototype)) {
		toProtoTypes.set(Object.prototype, {
			external: false,
			name: Object.prototype.constructor.name,
			cb: null
		});
		toProtoTypes.set(Date.prototype, {
			external: false,
			name: "Date",
			cb: function() {
				if (this.getTime() === -621672192e5) return "0000-01-01T00:00:00.000Z";
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(DateNS.prototype, {
			external: false,
			name: "DateNS",
			cb: function() {
				let tzo = -this.getTimezoneOffset(), dif = tzo >= 0 ? "+" : "-", pad = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 10 ? "0" : "") + norm;
				}, pad3 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				}, pad6 = function(num) {
					let norm = Math.floor(Math.abs(num));
					return (norm < 1e5 ? "0" : "") + (norm < 1e4 ? "0" : "") + (norm < 1e3 ? "0" : "") + (norm < 100 ? "0" : "") + (norm < 10 ? "0" : "") + norm;
				};
				return [
					this.getFullYear(),
					"-",
					pad(this.getMonth() + 1),
					"-",
					pad(this.getDate()),
					"T",
					pad(this.getHours()),
					":",
					pad(this.getMinutes()),
					":",
					pad(this.getSeconds()),
					"." + pad3(this.getMilliseconds()) + pad6(this.ns) + dif,
					pad(tzo / 60),
					":",
					pad(tzo % 60)
				].join("");
			}
		});
		toProtoTypes.set(Boolean.prototype, {
			external: false,
			name: "Boolean",
			cb: this_value
		});
		toProtoTypes.set(Number.prototype, {
			external: false,
			name: "Number",
			cb: function() {
				if (isNaN(this)) return "NaN";
				return isFinite(this) ? String(this) : this < 0 ? "-Infinity" : "Infinity";
			}
		});
		toProtoTypes.set(String.prototype, {
			external: false,
			name: "String",
			cb: function() {
				return "\"" + JSOX.escape(this_value.apply(this)) + "\"";
			}
		});
		if (typeof BigInt === "function") toProtoTypes.set(BigInt.prototype, {
			external: false,
			name: "BigInt",
			cb: function() {
				return this + "n";
			}
		});
		toProtoTypes.set(ArrayBuffer.prototype, {
			external: true,
			name: "ab",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this)) + "]";
			}
		});
		toProtoTypes.set(Uint8Array.prototype, {
			external: true,
			name: "u8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint8ClampedArray.prototype, {
			external: true,
			name: "uc8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int8Array.prototype, {
			external: true,
			name: "s8",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint16Array.prototype, {
			external: true,
			name: "u16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int16Array.prototype, {
			external: true,
			name: "s16",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Uint32Array.prototype, {
			external: true,
			name: "u32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Int32Array.prototype, {
			external: true,
			name: "s32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float32Array.prototype, {
			external: true,
			name: "f32",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(Float64Array.prototype, {
			external: true,
			name: "f64",
			cb: function() {
				return "[" + getIdentifier(base64ArrayBuffer(this.buffer)) + "]";
			}
		});
		toProtoTypes.set(RegExp.prototype, mapToJSOX = {
			external: true,
			name: "regex",
			cb: function(o, stringifier) {
				return "'" + escape(this.source) + "'";
			}
		});
		fromProtoTypes.set("regex", {
			protoCon: RegExp,
			cb: function(field, val) {
				return new RegExp(this);
			}
		});
		toProtoTypes.set(Map.prototype, mapToJSOX = {
			external: true,
			name: "map",
			cb: null
		});
		fromProtoTypes.set("map", {
			protoCon: Map,
			cb: function(field, val) {
				if (field) {
					this.set(field, val);
					return;
				}
				return this;
			}
		});
		toProtoTypes.set(Array.prototype, arrayToJSOX = {
			external: false,
			name: Array.prototype.constructor.name,
			cb: null
		});
	}
	const stringifier = {
		defineClass(name, obj) {
			let cls;
			let denormKeys = Object.keys(obj);
			for (let i = 1; i < denormKeys.length; i++) {
				let a, b;
				if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
					denormKeys[i - 1] = b;
					denormKeys[i] = a;
					if (i) i -= 2;
					else i--;
				}
			}
			classes.push(cls = {
				name,
				tag: denormKeys.toString(),
				proto: Object.getPrototypeOf(obj),
				fields: Object.keys(obj)
			});
			for (let n = 1; n < cls.fields.length; n++) if (cls.fields[n] < cls.fields[n - 1]) {
				let tmp = cls.fields[n - 1];
				cls.fields[n - 1] = cls.fields[n];
				cls.fields[n] = tmp;
				if (n > 1) n -= 2;
			}
			if (cls.proto === Object.getPrototypeOf({})) cls.proto = null;
		},
		setDefaultObjectToJSOX(cb) {
			objectToJSOX = cb;
		},
		isEncoding(o) {
			return !!encoding.find((eo, i) => eo === o && i < encoding.length - 1);
		},
		encodeObject(o) {
			if (objectToJSOX) return objectToJSOX.apply(o, [this]);
			return o;
		},
		stringify(o, r, s) {
			return stringify(o, r, s);
		},
		setQuote(q) {
			useQuote = q;
		},
		registerToJSOX(n, p, f) {
			return this.toJSOX(n, p, f);
		},
		toJSOX(name, ptype, f) {
			if (ptype.prototype && ptype.prototype !== Object.prototype) {
				if (localToProtoTypes.get(ptype.prototype)) throw new Error("Existing toJSOX has been registered for prototype");
				localToProtoTypes.set(ptype.prototype, {
					external: true,
					name: name || f.constructor.name,
					cb: f
				});
			} else {
				let key = Object.keys(ptype).toString();
				if (localToObjectTypes.get(key)) throw new Error("Existing toJSOX has been registered for object type");
				localToObjectTypes.set(key, {
					external: true,
					name,
					cb: f
				});
			}
		},
		get ignoreNonEnumerable() {
			return ignoreNonEnumerable;
		},
		set ignoreNonEnumerable(val) {
			ignoreNonEnumerable = val;
		}
	};
	return stringifier;
	/**
	* get a reference to a previously seen object
	* @param {any} here 
	* @returns reference to existing object, or undefined if not found.
	*/
	function getReference(here) {
		if (here === null) return void 0;
		let field = fieldMap.get(here);
		if (!field) {
			fieldMap.set(here, _JSON.stringify(path));
			return;
		}
		return "ref" + field;
	}
	/**
	* find the prototype definition for a class
	* @param {object} o 
	* @param {map} useK 
	* @returns object
	*/
	function matchObject(o, useK) {
		let k;
		let cls;
		let prt = Object.getPrototypeOf(o);
		cls = classes.find((cls) => {
			if (cls.proto && cls.proto === prt) return true;
		});
		if (cls) return cls;
		if (classes.length || commonClasses.length) {
			if (useK) {
				useK = useK.map((v) => {
					if (typeof v === "string") return v;
					else return void 0;
				});
				k = useK.toString();
			} else {
				let denormKeys = Object.keys(o);
				for (let i = 1; i < denormKeys.length; i++) {
					let a, b;
					if ((a = denormKeys[i - 1]) > (b = denormKeys[i])) {
						denormKeys[i - 1] = b;
						denormKeys[i] = a;
						if (i) i -= 2;
						else i--;
					}
				}
				k = denormKeys.toString();
			}
			cls = classes.find((cls) => {
				if (cls.tag === k) return true;
			});
			if (!cls) cls = commonClasses.find((cls) => {
				if (cls.tag === k) return true;
			});
		}
		return cls;
	}
	/**
	* Serialize an object to JSOX text.
	* @param {any} object 
	* @param {(key:string,value:any)=>string} replacer 
	* @param {string|number} space 
	* @returns 
	*/
	function stringify(object, replacer, space) {
		if (object === void 0) return "undefined";
		if (object === null) return;
		let gap;
		let indent;
		let rep;
		let i;
		const spaceType = typeof space;
		const repType = typeof replacer;
		gap = "";
		indent = "";
		if (spaceType === "number") for (i = 0; i < space; i += 1) indent += " ";
		else if (spaceType === "string") indent = space;
		rep = replacer;
		if (replacer && repType !== "function" && (repType !== "object" || typeof replacer.length !== "number")) throw new Error("JSOX.stringify");
		path.length = 0;
		fieldMap = /* @__PURE__ */ new WeakMap();
		const finalResult = str("", { "": object });
		commonClasses.length = 0;
		return finalResult;
		function str(key, holder) {
			var mind = gap;
			const doArrayToJSOX_ = arrayToJSOX.cb;
			const mapToObject_ = mapToJSOX.cb;
			arrayToJSOX.cb = doArrayToJSOX;
			mapToJSOX.cb = mapToObject;
			const v = str_(key, holder);
			arrayToJSOX.cb = doArrayToJSOX_;
			mapToJSOX.cb = mapToObject_;
			return v;
			function doArrayToJSOX() {
				let v;
				let partial = [];
				let thisNodeNameIndex = path.length;
				for (let i = 0; i < this.length; i += 1) {
					path[thisNodeNameIndex] = i;
					partial[i] = str(i, this) || "null";
				}
				path.length = thisNodeNameIndex;
				encoding.length = thisNodeNameIndex;
				v = partial.length === 0 ? "[]" : gap ? [
					"[\n",
					gap,
					partial.join(",\n" + gap),
					"\n",
					mind,
					"]"
				].join("") : "[" + partial.join(",") + "]";
				return v;
			}
			function mapToObject() {
				let tmp = { tmp: null };
				let out = "{";
				let first = true;
				for (let [key, value] of this) {
					tmp.tmp = value;
					let thisNodeNameIndex = path.length;
					path[thisNodeNameIndex] = key;
					out += (first ? "" : ",") + getIdentifier(key) + ":" + str("tmp", tmp);
					path.length = thisNodeNameIndex;
					first = false;
				}
				out += "}";
				return out;
			}
			function str_(key, holder) {
				let i;
				let k;
				let v;
				let length;
				let partialClass;
				let partial;
				let thisNodeNameIndex = path.length;
				let isValue = true;
				let value = holder[key];
				let isObject = typeof value === "object";
				let c;
				if (isObject && value !== null) {
					if (objectToJSOX) {
						if (!stringifying.find((val) => val === value)) {
							stringifying.push(value);
							encoding[thisNodeNameIndex] = value;
							isValue = false;
							value = objectToJSOX.apply(value, [stringifier]);
							isObject = typeof value === "object";
							stringifying.pop();
							encoding.length = thisNodeNameIndex;
							isObject = typeof value === "object";
						}
					}
				}
				const objType = value !== void 0 && value !== null && Object.getPrototypeOf(value);
				let protoConverter = objType && (localToProtoTypes.get(objType) || toProtoTypes.get(objType) || null);
				let objectConverter = !protoConverter && value !== void 0 && value !== null && (localToObjectTypes.get(Object.keys(value).toString()) || toObjectTypes.get(Object.keys(value).toString()) || null);
				if (typeof rep === "function") {
					isValue = false;
					value = rep.call(holder, key, value);
				}
				let toJSOX = protoConverter && protoConverter.cb || objectConverter && objectConverter.cb;
				if (value !== void 0 && value !== null && typeof value === "object" && typeof toJSOX === "function") if (!stringifying.find((val) => val === value)) {
					if (typeof value === "object") {
						v = getReference(value);
						if (v) return v;
					}
					stringifying.push(value);
					encoding[thisNodeNameIndex] = value;
					value = toJSOX.call(value, stringifier);
					isValue = false;
					stringifying.pop();
					if (protoConverter && protoConverter.name) {
						if ("string" === typeof value && value[0] !== "-" && (value[0] < "0" || value[0] > "9") && value[0] !== "\"" && value[0] !== "'" && value[0] !== "`" && value[0] !== "[" && value[0] !== "{") value = " " + value;
					}
					encoding.length = thisNodeNameIndex;
				} else v = getReference(value);
				else if (typeof value === "object") {
					v = getReference(value);
					if (v) return v;
				}
				switch (typeof value) {
					case "bigint": return value + "n";
					case "string": {
						value = isValue ? getIdentifier(value) : value;
						let c = "";
						if (key === "") c = classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") + (gap ? "\n" : "");
						if (protoConverter && protoConverter.external) return c + protoConverter.name + value;
						if (objectConverter && objectConverter.external) return c + objectConverter.name + value;
						return c + value;
					}
					case "number":
					case "boolean":
					case "null": return String(value);
					case "object":
						if (v) return "ref" + v;
						if (!value) return "null";
						gap += indent;
						partialClass = null;
						partial = [];
						if (rep && typeof rep === "object") {
							length = rep.length;
							partialClass = matchObject(value, rep);
							for (i = 0; i < length; i += 1) if (typeof rep[i] === "string") {
								k = rep[i];
								path[thisNodeNameIndex] = k;
								v = str(k, value);
								if (v !== void 0) if (partialClass) partial.push(v);
								else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
							}
							path.splice(thisNodeNameIndex, 1);
						} else {
							partialClass = matchObject(value);
							let keys = [];
							for (k in value) {
								if (ignoreNonEnumerable) {
									if (!Object.prototype.propertyIsEnumerable.call(value, k)) continue;
								}
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									let n;
									for (n = 0; n < keys.length; n++) if (keys[n] > k) {
										keys.splice(n, 0, k);
										break;
									}
									if (n == keys.length) keys.push(k);
								}
							}
							for (let n = 0; n < keys.length; n++) {
								k = keys[n];
								if (Object.prototype.hasOwnProperty.call(value, k)) {
									path[thisNodeNameIndex] = k;
									v = str(k, value);
									if (v !== void 0) if (partialClass) partial.push(v);
									else partial.push(getIdentifier(k) + (gap ? ": " : ":") + v);
								}
							}
							path.splice(thisNodeNameIndex, 1);
						}
						if (key === "") c = (classes.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "") || commonClasses.map((cls) => cls.name + "{" + cls.fields.join(",") + "}").join(gap ? "\n" : "")) + (gap ? "\n" : "");
						else c = "";
						if (protoConverter && protoConverter.external) c = c + getIdentifier(protoConverter.name);
						let ident = null;
						if (partialClass) ident = getIdentifier(partialClass.name);
						v = c + (partial.length === 0 ? "{}" : gap ? (partialClass ? ident : "") + "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : (partialClass ? ident : "") + "{" + partial.join(",") + "}");
						gap = mind;
						return v;
				}
			}
		}
	}
};
var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_";
var decodings = {
	"~": -1,
	"=": -1,
	"$": 62,
	"_": 63,
	"+": 62,
	"-": 62,
	".": 62,
	"/": 63,
	",": 63
};
for (let x = 0; x < 64; x++) decodings[encodings[x]] = x;
Object.freeze(decodings);
function base64ArrayBuffer(arrayBuffer) {
	let base64 = "";
	let bytes = new Uint8Array(arrayBuffer);
	let byteLength = bytes.byteLength;
	let byteRemainder = byteLength % 3;
	let mainLength = byteLength - byteRemainder;
	let a, b, c, d;
	let chunk;
	for (let i = 0; i < mainLength; i = i + 3) {
		chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];
		a = (chunk & 16515072) >> 18;
		b = (chunk & 258048) >> 12;
		c = (chunk & 4032) >> 6;
		d = chunk & 63;
		base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
	}
	if (byteRemainder == 1) {
		chunk = bytes[mainLength];
		a = (chunk & 252) >> 2;
		b = (chunk & 3) << 4;
		base64 += encodings[a] + encodings[b] + "==";
	} else if (byteRemainder == 2) {
		chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];
		a = (chunk & 64512) >> 10;
		b = (chunk & 1008) >> 4;
		c = (chunk & 15) << 2;
		base64 += encodings[a] + encodings[b] + encodings[c] + "=";
	}
	return base64;
}
function DecodeBase64(buf) {
	let outsize;
	if (buf.length % 4 == 1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (buf.length % 4 == 2) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (buf.length % 4 == 3) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else if (decodings[buf[buf.length - 3]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 3;
	else if (decodings[buf[buf.length - 2]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 2;
	else if (decodings[buf[buf.length - 1]] == -1) outsize = ((buf.length + 3) / 4 | 0) * 3 - 1;
	else outsize = ((buf.length + 3) / 4 | 0) * 3;
	let ab = new ArrayBuffer(outsize);
	let out = new Uint8Array(ab);
	let n;
	let l = buf.length + 3 >> 2;
	for (n = 0; n < l; n++) {
		let index0 = decodings[buf[n * 4]];
		let index1 = n * 4 + 1 < buf.length ? decodings[buf[n * 4 + 1]] : -1;
		let index2 = index1 >= 0 && n * 4 + 2 < buf.length ? decodings[buf[n * 4 + 2]] : -1;
		let index3 = index2 >= 0 && n * 4 + 3 < buf.length ? decodings[buf[n * 4 + 3]] : -1;
		if (index1 >= 0) out[n * 3 + 0] = index0 << 2 | index1 >> 4;
		if (index2 >= 0) out[n * 3 + 1] = index1 << 4 | index2 >> 2 & 15;
		if (index3 >= 0) out[n * 3 + 2] = index2 << 6 | index3 & 63;
	}
	return ab;
}
/**
* @param {unknown} object 
* @param {(this: unknown, key: string, value: unknown)} [replacer] 
* @param {string | number} [space] 
* @returns {string}
*/
JSOX.stringify = function(object, replacer, space) {
	return JSOX.stringifier().stringify(object, replacer, space);
};
[[
	0,
	256,
	[
		16767487,
		16739071,
		130048,
		3670016,
		0,
		16777208,
		16777215,
		8388607
	]
]].map((row) => {
	return {
		firstChar: row[0],
		lastChar: row[1],
		bits: row[2]
	};
});
//#endregion
//#region node_modules/@lexical/link/LexicalLink.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var w$1 = new Set([
	"http:",
	"https:",
	"mailto:",
	"sms:",
	"tel:"
]);
var E$1 = class E$1 extends Ai {
	__url;
	__target;
	__rel;
	__title;
	static getType() {
		return "link";
	}
	static clone(t) {
		return new E$1(t.__url, {
			rel: t.__rel,
			target: t.__target,
			title: t.__title
		}, t.__key);
	}
	constructor(t = "", e = {}, n) {
		super(n);
		const { target: r = null, rel: i = null, title: s = null } = e;
		this.__url = t, this.__target = r, this.__rel = i, this.__title = s;
	}
	createDOM(e) {
		const n = document.createElement("a");
		return this.updateLinkDOM(null, n, e), Zl$1(n, e.theme.link), n;
	}
	updateLinkDOM(t, n, r) {
		if (Os(n)) {
			t && t.__url === this.__url || (n.href = this.sanitizeUrl(this.__url));
			for (const e of [
				"target",
				"rel",
				"title"
			]) {
				const r = `__${e}`, i = this[r];
				t && t[r] === i || (i ? n[e] = i : n.removeAttribute(e));
			}
		}
	}
	updateDOM(t, e, n) {
		return this.updateLinkDOM(t, e, n), !1;
	}
	static importDOM() {
		return { a: (t) => ({
			conversion: W,
			priority: 1
		}) };
	}
	static importJSON(t) {
		return K$1().updateFromJSON(t);
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setURL(t.url).setRel(t.rel || null).setTarget(t.target || null).setTitle(t.title || null);
	}
	sanitizeUrl(t) {
		t = Q(t);
		try {
			const e = new URL(Q(t));
			if (!w$1.has(e.protocol)) return "about:blank";
		} catch (e) {
			return t;
		}
		return t;
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			rel: this.getRel(),
			target: this.getTarget(),
			title: this.getTitle(),
			url: this.getURL()
		};
	}
	getURL() {
		return this.getLatest().__url;
	}
	setURL(t) {
		const e = this.getWritable();
		return e.__url = t, e;
	}
	getTarget() {
		return this.getLatest().__target;
	}
	setTarget(t) {
		const e = this.getWritable();
		return e.__target = t, e;
	}
	getRel() {
		return this.getLatest().__rel;
	}
	setRel(t) {
		const e = this.getWritable();
		return e.__rel = t, e;
	}
	getTitle() {
		return this.getLatest().__title;
	}
	setTitle(t) {
		const e = this.getWritable();
		return e.__title = t, e;
	}
	insertNewAfter(t, e = !0) {
		const n = K$1(this.__url, {
			rel: this.__rel,
			target: this.__target,
			title: this.__title
		});
		return this.insertAfter(n, e), n;
	}
	canInsertTextBefore() {
		return !1;
	}
	canInsertTextAfter() {
		return !1;
	}
	canBeEmpty() {
		return !1;
	}
	isInline() {
		return !0;
	}
	extractWithChild(t, e, n) {
		if (!wr(e)) return !1;
		const r = e.anchor.getNode(), i = e.focus.getNode();
		return this.isParentOf(r) && this.isParentOf(i) && e.getTextContent().length > 0;
	}
	isEmailURI() {
		return this.__url.startsWith("mailto:");
	}
	isWebSiteURI() {
		return this.__url.startsWith("https://") || this.__url.startsWith("http://");
	}
};
function W(t) {
	let n = null;
	if (Os(t)) {
		const e = t.textContent;
		(null !== e && "" !== e || t.children.length > 0) && (n = K$1(t.getAttribute("href") || "", {
			rel: t.getAttribute("rel"),
			target: t.getAttribute("target"),
			title: t.getAttribute("title")
		}));
	}
	return { node: n };
}
function K$1(t = "", e) {
	return Ss$1(new E$1(t, e));
}
function B$2(t) {
	return t instanceof E$1;
}
var $$1 = class $$1 extends E$1 {
	__isUnlinked;
	constructor(t = "", e = {}, n) {
		super(t, e, n), this.__isUnlinked = void 0 !== e.isUnlinked && null !== e.isUnlinked && e.isUnlinked;
	}
	static getType() {
		return "autolink";
	}
	static clone(t) {
		return new $$1(t.__url, {
			isUnlinked: t.__isUnlinked,
			rel: t.__rel,
			target: t.__target,
			title: t.__title
		}, t.__key);
	}
	getIsUnlinked() {
		return this.__isUnlinked;
	}
	setIsUnlinked(t) {
		const e = this.getWritable();
		return e.__isUnlinked = t, e;
	}
	createDOM(t) {
		return this.__isUnlinked ? document.createElement("span") : super.createDOM(t);
	}
	updateDOM(t, e, n) {
		return super.updateDOM(t, e, n) || t.__isUnlinked !== this.__isUnlinked;
	}
	static importJSON(t) {
		return z$1().updateFromJSON(t);
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setIsUnlinked(t.isUnlinked || !1);
	}
	static importDOM() {
		return null;
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			isUnlinked: this.__isUnlinked
		};
	}
	insertNewAfter(t, e = !0) {
		const n = z$1(this.__url, {
			isUnlinked: this.__isUnlinked,
			rel: this.__rel,
			target: this.__target,
			title: this.__title
		});
		return this.insertAfter(n, e), n;
	}
};
function z$1(t = "", e) {
	return Ss$1(new $$1(t, e));
}
var q = /^\+?[0-9\s()-]{5,}$/;
function Q(t) {
	return t.match(/^[a-z][a-z0-9+.-]*:/i) || t.match(/^[/#.]/) ? t : t.includes("@") ? `mailto:${t}` : q.test(t) ? `tel:${t}` : `https://${t}`;
}
function Y(t, r, i = {}) {
	const s = (i) => {
		const s = i.target;
		if (!As$1(s)) return;
		const l = _o$1(s);
		if (null === l) return;
		let o = null, a = null;
		if (l.update(() => {
			const t = Do$1(s);
			if (null !== t) {
				const i = qs(t, Pi$1);
				if (!r.disabled.peek()) if (B$2(i)) o = i.sanitizeUrl(i.getURL()), a = i.getTarget();
				else {
					const t = function(t, e) {
						let n = t;
						for (; null != n;) {
							if (e(n)) return n;
							n = n.parentNode;
						}
						return null;
					}(s, Os);
					null !== t && (o = t.href, a = t.target);
				}
			}
		}), null === o || "" === o) return;
		const g = t.getEditorState().read($r$2);
		if (wr(g) && !g.isCollapsed()) return void i.preventDefault();
		const d = "auxclick" === i.type && 1 === i.button;
		window.open(o, r.newTab.peek() || d || i.metaKey || i.ctrlKey || "_blank" === a ? "_blank" : "_self"), i.preventDefault();
	}, l = (t) => {
		1 === t.button && s(t);
	};
	return t.registerRootListener((t, e) => {
		null !== e && (e.removeEventListener("click", s), e.removeEventListener("mouseup", l)), null !== t && (t.addEventListener("click", s, i), t.addEventListener("mouseup", l, i));
	});
}
//#endregion
//#region node_modules/@lexical/mark/LexicalMark.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var a = [];
var f = class f extends Ai {
	__ids;
	static getType() {
		return "mark";
	}
	static clone(t) {
		return new f(t.__ids, t.__key);
	}
	static importDOM() {
		return null;
	}
	static importJSON(t) {
		return d$2().updateFromJSON(t);
	}
	updateFromJSON(t) {
		return super.updateFromJSON(t).setIDs(t.ids);
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			ids: this.getIDs()
		};
	}
	constructor(t = a, e) {
		super(e), this.__ids = t;
	}
	createDOM(t) {
		const e = document.createElement("mark");
		return Zl$1(e, t.theme.mark), this.__ids.length > 1 && Zl$1(e, t.theme.markOverlap), e;
	}
	updateDOM(t, e, r) {
		const n = t.__ids, s = this.__ids, i = n.length, o = s.length, c = r.theme.markOverlap;
		return i !== o && (1 === i ? 2 === o && Zl$1(e, c) : 1 === o && tc(e, c)), !1;
	}
	hasID(t) {
		return this.getIDs().includes(t);
	}
	getIDs() {
		return Array.from(this.getLatest().__ids);
	}
	setIDs(t) {
		const e = this.getWritable();
		return e.__ids = t, e;
	}
	addID(t) {
		const e = this.getWritable();
		return e.__ids.includes(t) ? e : e.setIDs([...e.__ids, t]);
	}
	deleteID(t) {
		const e = this.getWritable(), r = e.__ids.indexOf(t);
		if (-1 === r) return e;
		const n = Array.from(e.__ids);
		return n.splice(r, 1), e.setIDs(n);
	}
	insertNewAfter(t, e = !0) {
		const r = d$2(this.__ids);
		return this.insertAfter(r, e), r;
	}
	canInsertTextBefore() {
		return !1;
	}
	canInsertTextAfter() {
		return !1;
	}
	canBeEmpty() {
		return !1;
	}
	isInline() {
		return !0;
	}
	extractWithChild(t, r, n) {
		if (!wr(r) || "html" === n) return !1;
		const s = r.anchor, i = r.focus, o = s.getNode(), c = i.getNode(), u = r.isBackward() ? s.offset - i.offset : i.offset - s.offset;
		return this.isParentOf(o) && this.isParentOf(c) && this.getTextContent().length === u;
	}
	excludeFromCopy(t) {
		return "clone" !== t;
	}
};
function d$2(t = a) {
	return Ss$1(new f(t));
}
//#endregion
//#region node_modules/@lexical/table/LexicalTable.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var Fe$1 = /^(\d+(?:\.\d+)?)px$/, Ae$1 = {
	BOTH: 3,
	COLUMN: 2,
	NO_STATUS: 0,
	ROW: 1
};
var Ke = class Ke extends Ai {
	__colSpan;
	__rowSpan;
	__headerState;
	__width;
	__backgroundColor;
	__verticalAlign;
	static getType() {
		return "tablecell";
	}
	static clone(e) {
		return new Ke(e.__headerState, e.__colSpan, e.__width, e.__key);
	}
	afterCloneFrom(e) {
		super.afterCloneFrom(e), this.__rowSpan = e.__rowSpan, this.__backgroundColor = e.__backgroundColor, this.__verticalAlign = e.__verticalAlign;
	}
	static importDOM() {
		return {
			td: (e) => ({
				conversion: ke$1,
				priority: 0
			}),
			th: (e) => ({
				conversion: ke$1,
				priority: 0
			})
		};
	}
	static importJSON(e) {
		return Ee$1().updateFromJSON(e);
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setHeaderStyles(e.headerState).setColSpan(e.colSpan || 1).setRowSpan(e.rowSpan || 1).setWidth(e.width || void 0).setBackgroundColor(e.backgroundColor || null).setVerticalAlign(e.verticalAlign || void 0);
	}
	constructor(e = Ae$1.NO_STATUS, t = 1, n, o) {
		super(o), this.__colSpan = t, this.__rowSpan = 1, this.__headerState = e, this.__width = n, this.__backgroundColor = null, this.__verticalAlign = void 0;
	}
	createDOM(t) {
		const n = document.createElement(this.getTag());
		return this.__width && (n.style.width = `${this.__width}px`), this.__colSpan > 1 && (n.colSpan = this.__colSpan), this.__rowSpan > 1 && (n.rowSpan = this.__rowSpan), null !== this.__backgroundColor && (n.style.backgroundColor = this.__backgroundColor), Oe$1(this.__verticalAlign) && (n.style.verticalAlign = this.__verticalAlign), Zl$1(n, t.theme.tableCell, this.hasHeader() && t.theme.tableCellHeader), n;
	}
	exportDOM(e) {
		const t = super.exportDOM(e);
		if (Ms$1(t.element)) {
			const e = t.element;
			e.setAttribute("data-temporary-table-cell-lexical-key", this.getKey()), e.style.border = "1px solid black", this.__colSpan > 1 && (e.colSpan = this.__colSpan), this.__rowSpan > 1 && (e.rowSpan = this.__rowSpan), e.style.width = `${this.getWidth() || 75}px`, e.style.verticalAlign = this.getVerticalAlign() || "top", e.style.textAlign = "start", null === this.__backgroundColor && this.hasHeader() && (e.style.backgroundColor = "#f2f3f5");
		}
		return t;
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			...Oe$1(this.__verticalAlign) && { verticalAlign: this.__verticalAlign },
			backgroundColor: this.getBackgroundColor(),
			colSpan: this.__colSpan,
			headerState: this.__headerState,
			rowSpan: this.__rowSpan,
			width: this.getWidth()
		};
	}
	getColSpan() {
		return this.getLatest().__colSpan;
	}
	setColSpan(e) {
		const t = this.getWritable();
		return t.__colSpan = e, t;
	}
	getRowSpan() {
		return this.getLatest().__rowSpan;
	}
	setRowSpan(e) {
		const t = this.getWritable();
		return t.__rowSpan = e, t;
	}
	getTag() {
		return this.hasHeader() ? "th" : "td";
	}
	setHeaderStyles(e, t = Ae$1.BOTH) {
		const n = this.getWritable();
		return n.__headerState = e & t | n.__headerState & ~t, n;
	}
	getHeaderStyles() {
		return this.getLatest().__headerState;
	}
	setWidth(e) {
		const t = this.getWritable();
		return t.__width = e, t;
	}
	getWidth() {
		return this.getLatest().__width;
	}
	getBackgroundColor() {
		return this.getLatest().__backgroundColor;
	}
	setBackgroundColor(e) {
		const t = this.getWritable();
		return t.__backgroundColor = e, t;
	}
	getVerticalAlign() {
		return this.getLatest().__verticalAlign;
	}
	setVerticalAlign(e) {
		const t = this.getWritable();
		return t.__verticalAlign = e || void 0, t;
	}
	toggleHeaderStyle(e) {
		const t = this.getWritable();
		return (t.__headerState & e) === e ? t.__headerState -= e : t.__headerState += e, t;
	}
	hasHeaderState(e) {
		return (this.getHeaderStyles() & e) === e;
	}
	hasHeader() {
		return this.getLatest().__headerState !== Ae$1.NO_STATUS;
	}
	updateDOM(e) {
		return e.__headerState !== this.__headerState || e.__width !== this.__width || e.__colSpan !== this.__colSpan || e.__rowSpan !== this.__rowSpan || e.__backgroundColor !== this.__backgroundColor || e.__verticalAlign !== this.__verticalAlign;
	}
	isShadowRoot() {
		return !0;
	}
	collapseAtStart() {
		return !0;
	}
	canBeEmpty() {
		return !1;
	}
	canIndent() {
		return !1;
	}
};
function Oe$1(e) {
	return "middle" === e || "bottom" === e;
}
function ke$1(e) {
	const t = e, n = e.nodeName.toLowerCase();
	let o;
	Fe$1.test(t.style.width) && (o = parseFloat(t.style.width));
	let r = Ae$1.NO_STATUS;
	if ("th" === n) r = "col" === t.getAttribute("scope") ? Ae$1.COLUMN : Ae$1.ROW;
	const l = Ee$1(r, t.colSpan, o);
	l.__rowSpan = t.rowSpan;
	const s = t.style.backgroundColor;
	"" !== s && (l.__backgroundColor = s);
	const i = t.style.verticalAlign;
	Oe$1(i) && (l.__verticalAlign = i);
	const c = t.style, a = (c && c.textDecoration || "").split(" "), u = "700" === c.fontWeight || "bold" === c.fontWeight, h = a.includes("line-through"), d = "italic" === c.fontStyle, C = a.includes("underline");
	return {
		after: (e) => {
			const t = [];
			let n = null;
			const o = () => {
				if (n) {
					const e = n.getFirstChild();
					Zn$1(e) && 1 === n.getChildrenSize() && e.remove();
				}
			};
			for (const r of e) ys$1(r) || yr$1(r) || Zn$1(r) ? (yr$1(r) && (u && r.toggleFormat("bold"), h && r.toggleFormat("strikethrough"), d && r.toggleFormat("italic"), C && r.toggleFormat("underline")), n ? n.append(r) : (n = Vi().append(r), t.push(n))) : (t.push(r), o(), n = null);
			return o(), 0 === t.length && t.push(Vi()), t;
		},
		node: l
	};
}
function Ee$1(e = Ae$1.NO_STATUS, t = 1, n) {
	return Ss$1(new Ke(e, t, n));
}
function Me$1(e) {
	return e instanceof Ke;
}
function We$1(e, ...t) {
	const n = new URL("https://lexical.dev/docs/error"), o = new URLSearchParams();
	o.append("code", e);
	for (const e of t) o.append("v", e);
	throw n.search = o.toString(), Error(`Minified Lexical error #${e}; visit ${n.toString()} for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`);
}
var ze = class ze extends Ai {
	__height;
	static getType() {
		return "tablerow";
	}
	static clone(e) {
		return new ze(e.__height, e.__key);
	}
	static importDOM() {
		return { tr: (e) => ({
			conversion: He$1,
			priority: 0
		}) };
	}
	static importJSON(e) {
		return Le$1().updateFromJSON(e);
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setHeight(e.height);
	}
	constructor(e, t) {
		super(t), this.__height = e;
	}
	exportJSON() {
		const e = this.getHeight();
		return {
			...super.exportJSON(),
			...void 0 === e ? void 0 : { height: e }
		};
	}
	createDOM(t) {
		const n = document.createElement("tr");
		return this.__height && (n.style.height = `${this.__height}px`), Zl$1(n, t.theme.tableRow), n;
	}
	extractWithChild(e, t, n) {
		return "html" === n;
	}
	isShadowRoot() {
		return !0;
	}
	setHeight(e) {
		const t = this.getWritable();
		return t.__height = e, t;
	}
	getHeight() {
		return this.getLatest().__height;
	}
	updateDOM(e) {
		return e.__height !== this.__height;
	}
	canBeEmpty() {
		return !1;
	}
	canIndent() {
		return !1;
	}
};
function He$1(e) {
	const n = e;
	let o;
	return Fe$1.test(n.style.height) && (o = parseFloat(n.style.height)), {
		after: (e) => _t$5(e, Me$1),
		node: Le$1(o)
	};
}
function Le$1(e) {
	return Ss$1(new ze(e));
}
function Be$1(e) {
	return e instanceof ze;
}
var Pe$1 = "undefined" != typeof window && void 0 !== window.document && void 0 !== window.document.createElement, De = Pe$1 && "documentMode" in document ? document.documentMode : null;
Pe$1 && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
function Xe(e) {
	const t = qs(e, (e) => yn(e));
	if (yn(t)) return t;
	throw new Error("Expected table cell to be inside of table.");
}
Pe$1 && "InputEvent" in window && !De && new window.InputEvent("input");
function _t$1(e, t, n) {
	const [o, r, l] = St$1(e, t, n);
	return null === r && We$1(207), null === l && We$1(208), [
		o,
		r,
		l
	];
}
function St$1(e, t, n) {
	const o = [];
	let r = null, l = null;
	function s(e) {
		let t = o[e];
		return void 0 === t && (o[e] = t = []), t;
	}
	const i = e.getChildren();
	for (let e = 0; e < i.length; e++) {
		const o = i[e];
		Be$1(o) || We$1(209);
		const c = s(e);
		for (let a = o.getFirstChild(), u = 0; null != a; a = a.getNextSibling()) {
			for (Me$1(a) || We$1(147); void 0 !== c[u];) u++;
			const o = {
				cell: a,
				startColumn: u,
				startRow: e
			}, { __rowSpan: h, __colSpan: d } = a;
			for (let t = 0; t < h && !(e + t >= i.length); t++) {
				const n = s(e + t);
				for (let e = 0; e < d; e++) n[u + e] = o;
			}
			null !== t && null === r && t.is(a) && (r = o), null !== n && null === l && n.is(a) && (l = o);
		}
	}
	return [
		o,
		r,
		l
	];
}
function wt$1(e) {
	let t;
	if (e instanceof Ke) t = e;
	else if ("__type" in e) {
		const o = qs(e, Me$1);
		Me$1(o) || We$1(148), t = o;
	} else {
		const o = qs(e.getNode(), Me$1);
		Me$1(o) || We$1(148), t = o;
	}
	const o = t.getParent();
	Be$1(o) || We$1(149);
	const r = o.getParent();
	return yn(r) || We$1(210), [
		t,
		o,
		r
	];
}
function bt(e, t, n) {
	let o, r = Math.min(t.startColumn, n.startColumn), l = Math.min(t.startRow, n.startRow), s = Math.max(t.startColumn + t.cell.__colSpan - 1, n.startColumn + n.cell.__colSpan - 1), i = Math.max(t.startRow + t.cell.__rowSpan - 1, n.startRow + n.cell.__rowSpan - 1);
	do {
		o = !1;
		for (let t = 0; t < e.length; t++) for (let n = 0; n < e[0].length; n++) {
			const c = e[t][n];
			if (!c) continue;
			const a = c.startColumn + c.cell.__colSpan - 1, u = c.startRow + c.cell.__rowSpan - 1, h = c.startColumn <= s && a >= r, d = c.startRow <= i && u >= l;
			if (h && d) {
				const e = Math.min(r, c.startColumn), t = Math.max(s, a), n = Math.min(l, c.startRow), h = Math.max(i, u);
				e === r && t === s && n === l && h === i || (r = e, s = t, l = n, i = h, o = !0);
			}
		}
	} while (o);
	return {
		maxColumn: s,
		maxRow: i,
		minColumn: r,
		minRow: l
	};
}
function vt$1(e) {
	const [t, , n] = wt$1(e), o = n.getChildren(), r = o.length, l = o[0].getChildren().length, s = new Array(r);
	for (let e = 0; e < r; e++) s[e] = new Array(l);
	for (let e = 0; e < r; e++) {
		const n = o[e].getChildren();
		let r = 0;
		for (let o = 0; o < n.length; o++) {
			for (; s[e][r];) r++;
			const l = n[o], i = l.__rowSpan || 1, c = l.__colSpan || 1;
			for (let t = 0; t < i; t++) for (let n = 0; n < c; n++) s[e + t][r + n] = l;
			if (t === l) return {
				colSpan: c,
				columnIndex: r,
				rowIndex: e,
				rowSpan: i
			};
			r += c;
		}
	}
	return null;
}
function xt(e) {
	const [[t, o, r, l], [s, i, c, a]] = ["anchor", "focus"].map((t) => {
		const o = e[t].getNode(), r = qs(o, Me$1);
		Me$1(r) || We$1(238, t, o.getKey(), o.getType());
		const l = r.getParent();
		Be$1(l) || We$1(239, t);
		const s = l.getParent();
		return yn(s) || We$1(240, t), [
			o,
			r,
			l,
			s
		];
	});
	return l.is(a) || We$1(241), {
		anchorCell: o,
		anchorNode: t,
		anchorRow: r,
		anchorTable: l,
		focusCell: i,
		focusNode: s,
		focusRow: c,
		focusTable: a
	};
}
var Tt$1 = class Tt$1 {
	tableKey;
	anchor;
	focus;
	_cachedNodes;
	dirty;
	constructor(e, t, n) {
		this.anchor = t, this.focus = n, t._selection = this, n._selection = this, this._cachedNodes = null, this.dirty = !1, this.tableKey = e;
	}
	getStartEndPoints() {
		return [this.anchor, this.focus];
	}
	isValid() {
		if ("root" === this.tableKey || "root" === this.anchor.key || "element" !== this.anchor.type || "root" === this.focus.key || "element" !== this.focus.type) return !1;
		const e = Mo$1(this.tableKey), t = Mo$1(this.anchor.key), n = Mo$1(this.focus.key);
		return null !== e && null !== t && null !== n;
	}
	isBackward() {
		return this.focus.isBefore(this.anchor);
	}
	getCachedNodes() {
		return this._cachedNodes;
	}
	setCachedNodes(e) {
		this._cachedNodes = e;
	}
	is(e) {
		return Rt(e) && this.tableKey === e.tableKey && this.anchor.is(e.anchor) && this.focus.is(e.focus);
	}
	set(e, t, n) {
		this.dirty = this.dirty || e !== this.tableKey || t !== this.anchor.key || n !== this.focus.key, this.tableKey = e, this.anchor.key = t, this.focus.key = n, this._cachedNodes = null;
	}
	clone() {
		return new Tt$1(this.tableKey, Tr$1(this.anchor.key, this.anchor.offset, this.anchor.type), Tr$1(this.focus.key, this.focus.offset, this.focus.type));
	}
	isCollapsed() {
		return !1;
	}
	extract() {
		return this.getNodes();
	}
	insertRawText(e) {}
	insertText() {}
	hasFormat(e) {
		let t = 0;
		this.getNodes().filter(Me$1).forEach((e) => {
			const n = e.getFirstChild();
			Yi$1(n) && (t |= n.getTextFormat());
		});
		const n = z$5[e];
		return 0 !== (t & n);
	}
	insertNodes(e) {
		const t = this.focus.getNode();
		Pi$1(t) || We$1(151);
		Ct$4(t.select(0, t.getChildrenSize())).insertNodes(e);
	}
	getShape() {
		const { anchorCell: e, focusCell: t } = xt(this), n = vt$1(e);
		null === n && We$1(153);
		const o = vt$1(t);
		null === o && We$1(155);
		const r = Math.min(n.columnIndex, o.columnIndex), l = Math.max(n.columnIndex + n.colSpan - 1, o.columnIndex + o.colSpan - 1), s = Math.min(n.rowIndex, o.rowIndex), i = Math.max(n.rowIndex + n.rowSpan - 1, o.rowIndex + o.rowSpan - 1);
		return {
			fromX: Math.min(r, l),
			fromY: Math.min(s, i),
			toX: Math.max(r, l),
			toY: Math.max(s, i)
		};
	}
	getNodes() {
		if (!this.isValid()) return [];
		const e = this._cachedNodes;
		if (null !== e) return e;
		const { anchorTable: t, anchorCell: n, focusCell: o } = xt(this), r = o.getParents()[1];
		if (r !== t) {
			if (t.isParentOf(o)) {
				const e = r.getParent();
				e ?? We$1(159), this.set(this.tableKey, o.getKey(), e.getKey());
			} else {
				const e = t.getParent();
				e ?? We$1(158), this.set(this.tableKey, e.getKey(), o.getKey());
			}
			return this.getNodes();
		}
		const [l, s, i] = _t$1(t, n, o), { minColumn: c, maxColumn: a, minRow: u, maxRow: h } = bt(l, s, i), d = new Map([[t.getKey(), t]]);
		let f = null;
		for (let e = u; e <= h; e++) for (let t = c; t <= a; t++) {
			const { cell: n } = l[e][t], o = n.getParent();
			Be$1(o) || We$1(160), o !== f && (d.set(o.getKey(), o), f = o), d.has(n.getKey()) || Kt(n, (e) => {
				d.set(e.getKey(), e);
			});
		}
		const g = Array.from(d.values());
		return fi$1() || (this._cachedNodes = g), g;
	}
	getTextContent() {
		const e = this.getNodes().filter((e) => Me$1(e));
		let t = "";
		for (let n = 0; n < e.length; n++) {
			const o = e[n], r = o.__parent, l = (e[n + 1] || {}).__parent;
			t += o.getTextContent() + (l !== r ? "\n" : "	");
		}
		return t;
	}
};
function Rt(e) {
	return e instanceof Tt$1;
}
function Kt(e, t) {
	const n = [[e]];
	for (let e = n.at(-1); void 0 !== e && n.length > 0; e = n.at(-1)) {
		const o = e.pop();
		void 0 === o ? n.pop() : !1 !== t(o) && Pi$1(o) && n.push(o.getChildren());
	}
}
function Mt$1(e) {
	return Ms$1(e) && "TABLE" === e.nodeName;
}
function $t$1(e, t) {
	if (!t) return t;
	const n = Mt$1(t) ? t : e.getDOMSlot(t).element;
	return "TABLE" !== n.nodeName && We$1(245, t.nodeName), n;
}
function Wt$1(e) {
	return e._window;
}
function zt(e, t) {
	for (let n = t, o = null; null !== n; n = n.getParent()) {
		if (e.is(n)) return o;
		Me$1(n) && (o = n);
	}
	return null;
}
function It$1(e) {
	let t = e;
	for (; null != t;) {
		const e = t.nodeName;
		if ("TD" === e || "TH" === e) {
			const e = t._cell;
			return void 0 === e ? null : e;
		}
		t = t.parentNode;
	}
	return null;
}
function Jt(e, t) {
	const n = [], o = {
		columns: 0,
		domRows: n,
		rows: 0
	};
	let r = $t$1(e, t).querySelector("tr"), l = 0, s = 0;
	for (n.length = 0; null != r;) {
		const e = r.nodeName;
		if ("TD" === e || "TH" === e) {
			const e = {
				elem: r,
				hasBackgroundColor: "" !== r.style.backgroundColor,
				highlighted: !1,
				x: l,
				y: s
			};
			r._cell = e;
			let t = n[s];
			void 0 === t && (t = n[s] = []), t[l] = e;
		} else {
			const e = r.firstChild;
			if (null != e) {
				r = e;
				continue;
			}
		}
		const t = r.nextSibling;
		if (null != t) {
			l++, r = t;
			continue;
		}
		const o = r.parentNode;
		if (null != o) {
			const e = o.nextSibling;
			if (null == e) break;
			s++, l = 0, r = e;
		}
	}
	return o.columns = l + 1, o.rows = s + 1, o;
}
var Vt = (e, t, n, o, r) => {
	const l = "forward" === r;
	switch (r) {
		case "backward":
		case "forward": return n !== (l ? e.table.columns - 1 : 0) ? tn$1(t.getCellNodeFromCordsOrThrow(n + (l ? 1 : -1), o, e.table), l) : o !== (l ? e.table.rows - 1 : 0) ? tn$1(t.getCellNodeFromCordsOrThrow(l ? 0 : e.table.columns - 1, o + (l ? 1 : -1), e.table), l) : l ? t.selectNext() : t.selectPrevious(), !0;
		case "up": return 0 !== o ? tn$1(t.getCellNodeFromCordsOrThrow(n, o - 1, e.table), !1) : t.selectPrevious(), !0;
		case "down": return o !== e.table.rows - 1 ? tn$1(t.getCellNodeFromCordsOrThrow(n, o + 1, e.table), !0) : t.selectNext(), !0;
		default: return !1;
	}
};
function jt$1(e, t) {
	let n, o;
	if (t.startColumn === e.minColumn) n = "minColumn";
	else {
		if (t.startColumn + t.cell.__colSpan - 1 !== e.maxColumn) return null;
		n = "maxColumn";
	}
	if (t.startRow === e.minRow) o = "minRow";
	else {
		if (t.startRow + t.cell.__rowSpan - 1 !== e.maxRow) return null;
		o = "maxRow";
	}
	return [n, o];
}
function Gt$1([e, t]) {
	return ["minColumn" === e ? "maxColumn" : "minColumn", "minRow" === t ? "maxRow" : "minRow"];
}
function Qt$1(e, t, [n, o]) {
	const r = t[o], l = e[r];
	void 0 === l && We$1(250, o, String(r));
	const s = t[n], i = l[s];
	return void 0 === i && We$1(250, n, String(s)), i;
}
function Zt$1(e, t, n, o, r) {
	const l = bt(t, n, o), { topSpan: i, leftSpan: c, bottomSpan: a, rightSpan: u } = function(e, t) {
		const { minColumn: n, maxColumn: o, minRow: r, maxRow: l } = t;
		let s = 1, i = 1, c = 1, a = 1;
		const u = e[r], h = e[l];
		for (let e = n; e <= o; e++) s = Math.max(s, u[e].cell.__rowSpan), a = Math.max(a, h[e].cell.__rowSpan);
		for (let t = r; t <= l; t++) i = Math.max(i, e[t][n].cell.__colSpan), c = Math.max(c, e[t][o].cell.__colSpan);
		return {
			bottomSpan: a,
			leftSpan: i,
			rightSpan: c,
			topSpan: s
		};
	}(t, l), [d, f] = Gt$1(function(e, t) {
		const n = jt$1(e, t);
		return null === n && We$1(249, t.cell.getKey()), n;
	}(l, n));
	let g = l[d], p = l[f];
	"forward" === r ? g += "maxColumn" === d ? 1 : c : "backward" === r ? g -= "minColumn" === d ? 1 : u : "down" === r ? p += "maxRow" === f ? 1 : i : "up" === r && (p -= "minRow" === f ? 1 : a);
	const m = t[p];
	if (void 0 === m) return !1;
	const C = m[g];
	if (void 0 === C) return !1;
	const [_, S] = function(e, t, n) {
		const o = bt(e, t, n), r = jt$1(o, t);
		if (r) return [Qt$1(e, o, r), Qt$1(e, o, Gt$1(r))];
		const l = jt$1(o, n);
		if (l) return [Qt$1(e, o, Gt$1(l)), Qt$1(e, o, l)];
		const s = ["minColumn", "minRow"];
		return [Qt$1(e, o, s), Qt$1(e, o, Gt$1(s))];
	}(t, n, C), w = dn(e, _.cell), b = dn(e, S.cell);
	return e.$setAnchorCellForSelection(w), e.$setFocusCellForSelection(b, !0), !0;
}
function en$1(e, t) {
	if (wr(e) || Rt(e)) {
		const n = t.isParentOf(e.anchor.getNode()), o = t.isParentOf(e.focus.getNode());
		return n && o;
	}
	return !1;
}
function tn$1(e, t) {
	t ? e.selectStart() : e.selectEnd();
}
function ln$1(e) {
	const t = qs(e, yn);
	return yn(t) ? t : null;
}
function sn$1(e, t, o, r, l, s, i) {
	const c = Ol$1(o.focus, l ? "previous" : "next");
	if (Rl$1(c)) return !1;
	let a = c;
	for (const e of Cl$1(c).iterNodeCarets("shadowRoot")) {
		if (!ol$1(e) || !Pi$1(e.origin)) return !1;
		a = e;
	}
	const u = a.getParentAtCaret();
	if (!Me$1(u)) return !1;
	const h = u, d = function(e) {
		for (const t of Cl$1(e).iterNodeCarets("root")) {
			const { origin: n } = t;
			if (Me$1(n)) {
				if (sl$1(t)) return gl$1(n, e.direction);
			} else if (!Be$1(n)) break;
		}
		return null;
	}(ul$1(h, a.direction)), f = qs(h, yn);
	if (!f || !f.is(s)) return !1;
	const g = e.getElementByKey(h.getKey()), p = It$1(g);
	if (!g || !p) return !1;
	if (i.table = Sn(e, f), d) if ("extend" === r) {
		const t = It$1(e.getElementByKey(d.origin.getKey()));
		if (!t) return !1;
		i.$setAnchorCellForSelection(p), i.$setFocusCellForSelection(t, !0);
	} else {
		const e = zl(d);
		Ml$1(o.anchor, e), Ml$1(o.focus, e);
	}
	else if ("extend" === r) i.$setAnchorCellForSelection(p), i.$setFocusCellForSelection(p, !0);
	else {
		const e = function(e) {
			const t = pl$1(e);
			return sl$1(t) ? zl(t) : e;
		}(ul$1(f, c.direction));
		Ml$1(o.anchor, e), Ml$1(o.focus, e);
	}
	return an(t), !0;
}
function cn(e, t, o, r, l) {
	if (("up" === o || "down" === o) && function(e) {
		const t = e.getRootElement();
		if (!t) return !1;
		return t.hasAttribute("aria-controls") && "typeahead-menu" === t.getAttribute("aria-controls");
	}(e)) return !1;
	const s = $r$2();
	if (!en$1(s, r)) {
		if (wr(s)) {
			if ("backward" === o) {
				if (s.focus.offset > 0) return !1;
				const e = function(e) {
					for (let t = e, n = e; null !== n; t = n, n = n.getParent()) if (Pi$1(n)) {
						if (n !== t && n.getFirstChild() !== t) return null;
						if (!n.isInline()) return n;
					}
					return null;
				}(s.focus.getNode());
				if (!e) return !1;
				const n = e.getPreviousSibling();
				return !!yn(n) && (an(t), t.shiftKey ? s.focus.set(n.getParentOrThrow().getKey(), n.getIndexWithinParent(), "element") : n.selectEnd(), !0);
			}
			if (t.shiftKey && ("up" === o || "down" === o)) {
				const e = s.focus.getNode();
				if (!s.isCollapsed() && ("up" === o && !s.isBackward() || "down" === o && s.isBackward())) {
					let l = qs(e, (e) => yn(e));
					if (Me$1(l) && (l = qs(l, yn)), l !== r) return !1;
					if (!l) return !1;
					const i = "down" === o ? l.getNextSibling() : l.getPreviousSibling();
					if (!i) return !1;
					let c = 0;
					"up" === o && Pi$1(i) && (c = i.getChildrenSize());
					let a = i;
					if ("up" === o && Pi$1(i)) a = i.getLastChild() || i, c = yr$1(a) ? a.getTextContentSize() : 0;
					const u = s.clone();
					return u.focus.set(a.getKey(), c, yr$1(a) ? "text" : "element"), zo$1(u), an(t), !0;
				}
				if (xs$1(e)) {
					const e = "up" === o ? s.getNodes()[s.getNodes().length - 1] : s.getNodes()[0];
					if (e) {
						if (null !== zt(r, e)) {
							const e = r.getFirstDescendant(), t = r.getLastDescendant();
							if (!e || !t) return !1;
							const [n] = wt$1(e), [o] = wt$1(t), s = r.getCordsFromCellNode(n, l.table), i = r.getCordsFromCellNode(o, l.table), c = r.getDOMCellFromCordsOrThrow(s.x, s.y, l.table), a = r.getDOMCellFromCordsOrThrow(i.x, i.y, l.table);
							return l.$setAnchorCellForSelection(c), l.$setFocusCellForSelection(a, !0), !0;
						}
					}
					return !1;
				}
				{
					let r = qs(e, (e) => Pi$1(e) && !e.isInline());
					if (Me$1(r) && (r = qs(r, yn)), !r) return !1;
					const i = "down" === o ? r.getNextSibling() : r.getPreviousSibling();
					if (yn(i) && l.tableNodeKey === i.getKey()) {
						const e = i.getFirstDescendant(), n = i.getLastDescendant();
						if (!e || !n) return !1;
						const [r] = wt$1(e), [l] = wt$1(n), c = s.clone();
						return c.focus.set(("up" === o ? r : l).getKey(), "up" === o ? 0 : l.getChildrenSize(), "element"), an(t), zo$1(c), !0;
					}
				}
			}
		}
		return "down" === o && mn(e) && l.setShouldCheckSelection(), !1;
	}
	if (wr(s)) {
		if ("backward" === o || "forward" === o) return sn$1(e, t, s, t.shiftKey ? "extend" : "move", "backward" === o, r, l);
		if (s.isCollapsed()) {
			const { anchor: i, focus: c } = s, a = qs(i.getNode(), Me$1), u = qs(c.getNode(), Me$1);
			if (!Me$1(a) || !a.is(u)) return !1;
			const h = ln$1(a);
			if (h !== r && null != h) {
				const n = $t$1(h, e.getElementByKey(h.getKey()));
				if (null != n) return l.table = Jt(h, n), cn(e, t, o, h, l);
			}
			const d = e.getElementByKey(a.__key), f = e.getElementByKey(i.key);
			if (null == f || null == d) return !1;
			let g;
			if ("element" === i.type) g = f.getBoundingClientRect();
			else {
				const t = bs$1(Wt$1(e));
				if (null === t || 0 === t.rangeCount) return !1;
				g = t.getRangeAt(0).getBoundingClientRect();
			}
			const p = "up" === o ? a.getFirstChild() : a.getLastChild();
			if (null == p) return !1;
			const m = e.getElementByKey(p.__key);
			if (null == m) return !1;
			const C = m.getBoundingClientRect();
			if ("up" === o ? C.top > g.top - g.height : g.bottom + g.height > C.bottom) {
				an(t);
				const e = r.getCordsFromCellNode(a, l.table);
				if (!t.shiftKey) return Vt(l, r, e.x, e.y, o);
				{
					const t = r.getDOMCellFromCordsOrThrow(e.x, e.y, l.table);
					l.$setAnchorCellForSelection(t), l.$setFocusCellForSelection(t, !0);
				}
				return !0;
			}
		}
	} else if (Rt(s)) {
		const { anchor: i, focus: c } = s, a = qs(i.getNode(), Me$1), u = qs(c.getNode(), Me$1), [h] = s.getNodes();
		yn(h) || We$1(251);
		const d = $t$1(h, e.getElementByKey(h.getKey()));
		if (!Me$1(a) || !Me$1(u) || !yn(h) || null == d) return !1;
		l.$updateTableTableSelection(s);
		const f = Jt(h, d), g = r.getCordsFromCellNode(a, f), p = r.getDOMCellFromCordsOrThrow(g.x, g.y, f);
		if (l.$setAnchorCellForSelection(p), an(t), t.shiftKey) {
			const [e, t, n] = _t$1(r, a, u);
			return Zt$1(l, e, t, n, o);
		}
		return u.selectEnd(), !0;
	}
	return !1;
}
function an(e) {
	e.preventDefault(), e.stopImmediatePropagation(), e.stopPropagation();
}
function dn(e, t) {
	const { tableNode: n } = e.$lookup(), o = n.getCordsFromCellNode(t, e.table);
	return n.getDOMCellFromCordsOrThrow(o.x, o.y, e.table);
}
function fn(e, t, n) {
	return zt(e, Do$1(t, n));
}
function gn(t, n, r) {
	if (!n.theme.tableAlignment) return;
	const l = [], s = [];
	for (const e of ["center", "right"]) {
		const t = n.theme.tableAlignment[e];
		t && (e === r ? s : l).push(t);
	}
	tc(t, ...l), Zl$1(t, ...s);
}
var pn = /* @__PURE__ */ new WeakSet();
function mn(e = Is$1()) {
	return pn.has(e);
}
var _n$1 = class _n$1 extends Ai {
	__rowStriping;
	__frozenColumnCount;
	__frozenRowCount;
	__colWidths;
	static getType() {
		return "table";
	}
	getColWidths() {
		return this.getLatest().__colWidths;
	}
	setColWidths(e) {
		const t = this.getWritable();
		return t.__colWidths = e, t;
	}
	static clone(e) {
		return new _n$1(e.__key);
	}
	afterCloneFrom(e) {
		super.afterCloneFrom(e), this.__colWidths = e.__colWidths, this.__rowStriping = e.__rowStriping, this.__frozenColumnCount = e.__frozenColumnCount, this.__frozenRowCount = e.__frozenRowCount;
	}
	static importDOM() {
		return { table: (e) => ({
			conversion: wn$1,
			priority: 1
		}) };
	}
	static importJSON(e) {
		return bn$1().updateFromJSON(e);
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setRowStriping(e.rowStriping || !1).setFrozenColumns(e.frozenColumnCount || 0).setFrozenRows(e.frozenRowCount || 0).setColWidths(e.colWidths);
	}
	constructor(e) {
		super(e), this.__rowStriping = !1, this.__frozenColumnCount = 0, this.__frozenRowCount = 0, this.__colWidths = void 0;
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			colWidths: this.getColWidths(),
			frozenColumnCount: this.__frozenColumnCount ? this.__frozenColumnCount : void 0,
			frozenRowCount: this.__frozenRowCount ? this.__frozenRowCount : void 0,
			rowStriping: this.__rowStriping ? this.__rowStriping : void 0
		};
	}
	extractWithChild(e, t, n) {
		return "html" === n;
	}
	getDOMSlot(e) {
		const t = Mt$1(e) ? e : e.querySelector("table");
		return Mt$1(t) || We$1(229), super.getDOMSlot(e).withElement(t).withAfter(t.querySelector("colgroup"));
	}
	createDOM(t, n) {
		const o = document.createElement("table");
		this.__style && (o.style.cssText = this.__style);
		const r = document.createElement("colgroup");
		if (o.appendChild(r), js$1(r), Zl$1(o, t.theme.table), this.updateTableElement(null, o, t), mn(n)) {
			const n = document.createElement("div"), r = t.theme.tableScrollableWrapper;
			return r ? Zl$1(n, r) : n.style.cssText = "overflow-x: auto;", n.appendChild(o), this.updateTableWrapper(null, n, o, t), n;
		}
		return o;
	}
	updateTableWrapper(t, n, r, l) {
		this.__frozenColumnCount !== (t ? t.__frozenColumnCount : 0) && function(t, n, r, l) {
			l > 0 ? (Zl$1(t, r.theme.tableFrozenColumn), n.setAttribute("data-lexical-frozen-column", "true")) : (tc(t, r.theme.tableFrozenColumn), n.removeAttribute("data-lexical-frozen-column"));
		}(n, r, l, this.__frozenColumnCount), this.__frozenRowCount !== (t ? t.__frozenRowCount : 0) && function(t, n, r, l) {
			l > 0 ? (Zl$1(t, r.theme.tableFrozenRow), n.setAttribute("data-lexical-frozen-row", "true")) : (tc(t, r.theme.tableFrozenRow), n.removeAttribute("data-lexical-frozen-row"));
		}(n, r, l, this.__frozenRowCount);
	}
	updateTableElement(t, n, r) {
		this.__style !== (t ? t.__style : "") && (n.style.cssText = this.__style), this.__rowStriping !== (!!t && t.__rowStriping) && function(t, n, r) {
			r ? (Zl$1(t, n.theme.tableRowStriping), t.setAttribute("data-lexical-row-striping", "true")) : (tc(t, n.theme.tableRowStriping), t.removeAttribute("data-lexical-row-striping"));
		}(n, r, this.__rowStriping), function(e, t, n, o) {
			const r = e.querySelector("colgroup");
			if (!r) return;
			const l = [];
			for (let e = 0; e < n; e++) {
				const t = document.createElement("col"), n = o && o[e];
				n && (t.style.width = `${n}px`), l.push(t);
			}
			r.replaceChildren(...l);
		}(n, 0, this.getColumnCount(), this.getColWidths()), gn(n, r, this.getFormatType());
	}
	updateDOM(e, t, n) {
		const o = this.getDOMSlot(t).element;
		return t === o === mn() || (Ms$1(r = t) && "DIV" === r.nodeName && this.updateTableWrapper(e, t, o, n), this.updateTableElement(e, o, n), !1);
		var r;
	}
	exportDOM(e) {
		const t = super.exportDOM(e), { element: n } = t;
		return {
			after: (n) => {
				if (t.after && (n = t.after(n)), !Mt$1(n) && Ms$1(n) && (n = n.querySelector("table")), !Mt$1(n)) return null;
				gn(n, e._config, this.getFormatType());
				const [o] = St$1(this, null, null), r = /* @__PURE__ */ new Map();
				for (const e of o) for (const t of e) {
					const e = t.cell.getKey();
					r.has(e) || r.set(e, {
						colSpan: t.cell.getColSpan(),
						startColumn: t.startColumn
					});
				}
				const s = /* @__PURE__ */ new Set();
				for (const e of n.querySelectorAll(":scope > tr > [data-temporary-table-cell-lexical-key]")) {
					const t = e.getAttribute("data-temporary-table-cell-lexical-key");
					if (t) {
						const n = r.get(t);
						if (e.removeAttribute("data-temporary-table-cell-lexical-key"), n) {
							r.delete(t);
							for (let e = 0; e < n.colSpan; e++) s.add(e + n.startColumn);
						}
					}
				}
				const i = n.querySelector(":scope > colgroup");
				if (i) {
					const e = Array.from(n.querySelectorAll(":scope > colgroup > col")).filter((e, t) => s.has(t));
					i.replaceChildren(...e);
				}
				const c = n.querySelectorAll(":scope > tr");
				if (c.length > 0) {
					const e = document.createElement("tbody");
					for (const t of c) e.appendChild(t);
					n.append(e);
				}
				return n;
			},
			element: !Mt$1(n) && Ms$1(n) ? n.querySelector("table") : n
		};
	}
	canBeEmpty() {
		return !1;
	}
	isShadowRoot() {
		return !0;
	}
	getCordsFromCellNode(e, t) {
		const { rows: n, domRows: o } = t;
		for (let t = 0; t < n; t++) {
			const n = o[t];
			if (null != n) for (let o = 0; o < n.length; o++) {
				const r = n[o];
				if (null == r) continue;
				const { elem: l } = r, s = fn(this, l);
				if (null !== s && e.is(s)) return {
					x: o,
					y: t
				};
			}
		}
		throw new Error("Cell not found in table.");
	}
	getDOMCellFromCords(e, t, n) {
		const { domRows: o } = n, r = o[t];
		if (null == r) return null;
		const l = r[e < r.length ? e : r.length - 1];
		return null == l ? null : l;
	}
	getDOMCellFromCordsOrThrow(e, t, n) {
		const o = this.getDOMCellFromCords(e, t, n);
		if (!o) throw new Error("Cell not found at cords.");
		return o;
	}
	getCellNodeFromCords(e, t, n) {
		const o = this.getDOMCellFromCords(e, t, n);
		if (null == o) return null;
		const r = Do$1(o.elem);
		return Me$1(r) ? r : null;
	}
	getCellNodeFromCordsOrThrow(e, t, n) {
		const o = this.getCellNodeFromCords(e, t, n);
		if (!o) throw new Error("Node at cords not TableCellNode.");
		return o;
	}
	getRowStriping() {
		return Boolean(this.getLatest().__rowStriping);
	}
	setRowStriping(e) {
		const t = this.getWritable();
		return t.__rowStriping = e, t;
	}
	setFrozenColumns(e) {
		const t = this.getWritable();
		return t.__frozenColumnCount = e, t;
	}
	getFrozenColumns() {
		return this.getLatest().__frozenColumnCount;
	}
	setFrozenRows(e) {
		const t = this.getWritable();
		return t.__frozenRowCount = e, t;
	}
	getFrozenRows() {
		return this.getLatest().__frozenRowCount;
	}
	canSelectBefore() {
		return !0;
	}
	canIndent() {
		return !1;
	}
	getColumnCount() {
		const e = this.getFirstChild();
		if (!e) return 0;
		let t = 0;
		return e.getChildren().forEach((e) => {
			Me$1(e) && (t += e.getColSpan());
		}), t;
	}
};
function Sn(e, t) {
	const n = e.getElementByKey(t.getKey());
	return null === n && We$1(230), Jt(t, n);
}
function wn$1(e) {
	const n = bn$1();
	e.hasAttribute("data-lexical-row-striping") && n.setRowStriping(!0), e.hasAttribute("data-lexical-frozen-column") && n.setFrozenColumns(1), e.hasAttribute("data-lexical-frozen-row") && n.setFrozenRows(1);
	const o = e.querySelector(":scope > colgroup");
	if (o) {
		let e = [];
		for (const t of o.querySelectorAll(":scope > col")) {
			let n = t.style.width || "";
			if (!Fe$1.test(n) && (n = t.getAttribute("width") || "", !/^\d+$/.test(n))) {
				e = void 0;
				break;
			}
			e.push(parseFloat(n));
		}
		e && n.setColWidths(e);
	}
	return {
		after: (e) => _t$5(e, Be$1),
		node: n
	};
}
function bn$1() {
	return Ss$1(new _n$1());
}
function yn(e) {
	return e instanceof _n$1;
}
function On$1(e) {
	const t = Xe(e), n = vt$1(e), o = t.getColWidths();
	if (!n || !o) return;
	const { columnIndex: r, colSpan: l } = n;
	let s = 0;
	for (let e = r; e < r + l; e++) s += o[e];
	return s;
}
function kn$1(e, t, n) {
	const o = e.getColWidths();
	if (!o) return e;
	const r = t - n, l = o.reduce((e, t) => e + t, 0);
	if (l <= r) return e;
	const s = r / l;
	e.setColWidths(o.map((e) => e * s));
	const i = e.getChildren().filter(Be$1);
	for (const e of i) {
		const t = e.getChildren().filter(Me$1);
		for (const e of t) {
			const t = On$1(e);
			if (void 0 !== t) for (const o of e.getChildren().filter(yn)) kn$1(o, t, n);
		}
	}
}
//#endregion
//#region node_modules/@lexical/devtools-core/LexicalDevtoolsCore.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
var x = Object.freeze({
	"	": "\\t",
	"\n": "\\n"
});
new RegExp(Object.keys(x).join("|"), "g");
var S = Object.freeze({
	ancestorHasNextSibling: "|",
	ancestorIsLastChild: " ",
	hasNextSibling: "├",
	isLastChild: "└",
	selectedChar: "^",
	selectedLine: ">"
});
function L(e, t, n = []) {
	const r = e.getChildren(), o = r.length;
	r.forEach((e, r) => {
		t(e, n.concat(r === o - 1 ? S.isLastChild : S.hasNextSibling)), Pi$1(e) && L(e, t, n.concat(r === o - 1 ? S.ancestorIsLastChild : S.ancestorHasNextSibling));
	});
}
function K(e, t) {
	const n = new Array(1 + t++).join("  "), r = new Array(t - 1).join("  ");
	let o;
	for (let i = 0; i < e.children.length; i++) o = document.createTextNode("\n" + n), e.insertBefore(o, e.children[i]), K(e.children[i], t), e.lastElementChild === e.children[i] && (o = document.createTextNode("\n" + r), e.appendChild(o));
	return e;
}
(0, import_react.forwardRef)(function({ treeTypeButtonClassName: e, timeTravelButtonClassName: t, timeTravelPanelSliderClassName: n, timeTravelPanelButtonClassName: r, viewClassName: o, timeTravelPanelClassName: i, editorState: l, setEditorState: s, setEditorReadOnly: a, generateContent: c, commandsLog: u = [] }, f) {
	const [d, y] = (0, import_react.useState)([]), [x, C] = (0, import_react.useState)(""), [S, N] = (0, import_react.useState)(!1), [T, k] = (0, import_react.useState)(!1), j = (0, import_react.useRef)(0), v = (0, import_react.useRef)(null), [L, B] = (0, import_react.useState)(!1), [E, F] = (0, import_react.useState)(!1), [w, _] = (0, import_react.useState)(!1), D = (0, import_react.useRef)(null), O = (0, import_react.useRef)([]), H = (0, import_react.useRef)(0), K = (0, import_react.useCallback)((e) => {
		const t = ++H.current;
		c(e).then((e) => {
			t === H.current && C(e);
		}).catch((e) => {
			t === H.current && C(`Error rendering tree: ${e.message}\n\nStack:\n${e.stack}`);
		});
	}, [c]);
	(0, import_react.useEffect)(() => {
		if (!w && l._nodeMap.size > 1e3 && (F(!0), !w)) return;
		if (D.current !== l || O.current !== u) {
			const e = D.current !== l;
			D.current = l, O.current = u, K(T), !S && e && y((e) => [...e, [Date.now(), l]]);
		}
	}, [
		l,
		K,
		T,
		w,
		S,
		u
	]);
	const A = d.length;
	(0, import_react.useEffect)(() => {
		if (L) {
			let e;
			const t = () => {
				const n = j.current;
				if (n === A - 1) return void B(!1);
				const r = d[n][0], o = d[n + 1][0];
				e = setTimeout(() => {
					j.current++;
					const e = j.current, n = v.current;
					null !== n && (n.value = String(e)), s(d[e][1]), t();
				}, o - r);
			};
			return t(), () => {
				clearTimeout(e);
			};
		}
	}, [
		d,
		L,
		A,
		s
	]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: o,
		children: [
			!w && E ? (0, import_jsx_runtime.jsxs)("div", {
				style: { padding: 20 },
				children: [(0, import_jsx_runtime.jsx)("span", {
					style: { marginRight: 20 },
					children: "Detected large EditorState, this can impact debugging performance."
				}), (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						_(!0);
					},
					style: {
						background: "transparent",
						border: "1px solid white",
						color: "white",
						cursor: "pointer",
						padding: 5
					},
					children: "Show full tree"
				})]
			}) : null,
			w ? null : (0, import_jsx_runtime.jsx)("button", {
				onClick: () => (K(!T), void k(!T)),
				className: e,
				type: "button",
				children: T ? "Tree" : "Export DOM"
			}),
			!S && (w || !E) && A > 2 && (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					a(!0), j.current = A - 1, N(!0);
				},
				className: t,
				type: "button",
				children: "Time Travel"
			}),
			(w || !E) && (0, import_jsx_runtime.jsx)("pre", {
				ref: f,
				children: x
			}),
			S && (w || !E) && (0, import_jsx_runtime.jsxs)("div", {
				className: i,
				children: [
					(0, import_jsx_runtime.jsx)("button", {
						className: r,
						onClick: () => {
							j.current === A - 1 && (j.current = 1), B(!L);
						},
						type: "button",
						children: L ? "Pause" : "Play"
					}),
					(0, import_jsx_runtime.jsx)("input", {
						className: n,
						ref: v,
						onChange: (e) => {
							const t = Number(e.target.value), n = d[t];
							n && (j.current = t, s(n[1]));
						},
						type: "range",
						min: "1",
						max: A - 1
					}),
					(0, import_jsx_runtime.jsx)("button", {
						className: r,
						onClick: () => {
							a(!1);
							const e = d.length - 1, t = d[e];
							s(t[1]);
							const n = v.current;
							null !== n && (n.value = String(e)), N(!1), B(!1);
						},
						type: "button",
						children: "Exit"
					})
				]
			})
		]
	});
});
//#endregion
//#region node_modules/@lexical/react/LexicalClickableLinkPlugin.prod.mjs
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function t({ newTab: t = !0, disabled: l = !1 }) {
	const [n] = o$4();
	return (0, import_react.useEffect)(() => Y(n, pt$4({
		disabled: l,
		newTab: t
	})), [
		n,
		t,
		l
	]), null;
}
//#endregion
//#region node_modules/@lexical/react/LexicalListPlugin.prod.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
/**
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*
*/
function l$1({ hasStrictIndent: l = !1, shouldPreserveNumbering: m = !1 }) {
	const [c] = o$4();
	return (0, import_react.useEffect)(() => {
		if (!c.hasNodes([ue$1, se$1])) throw new Error("ListPlugin: ListNode and/or ListItemNode not registered on editor");
	}, [c]), (0, import_react.useEffect)(() => ec(Le$2(c, { restoreNumbering: m }), l ? Ne$1(c) : () => {}), [
		c,
		l,
		m
	]), function(e) {
		(0, import_react.useEffect)(() => Le$2(e), [e]);
	}(c), null;
}
//#endregion
//#region node_modules/@payloadcms/richtext-lexical/dist/exports/client/index.js
var client_exports = /* @__PURE__ */ __exportAll({
	$createAutoLinkNode: () => yt,
	$createBlockNode: () => Fe,
	$createHorizontalRuleNode: () => Qe,
	$createInlineBlockNode: () => Pe$3,
	$createLinkNode: () => Te,
	$createRelationshipNode: () => We,
	$createUploadNode: () => fe,
	$isAutoLinkNode: () => Se,
	$isBlockNode: () => Ae,
	$isHorizontalRuleNode: () => Lt,
	$isInlineBlockNode: () => K$2,
	$isLinkNode: () => J,
	$isRelationshipNode: () => vr,
	$isUploadNode: () => dt,
	AlignFeatureClient: () => Vc,
	AutoLinkNode: () => we,
	BlockNode: () => ae,
	BlockquoteFeatureClient: () => qc,
	BoldFeatureClient: () => vd,
	CAN_USE_DOM: () => at$2,
	FieldsDrawer: () => de$3,
	FixedToolbarFeatureClient: () => fh,
	HeadingFeatureClient: () => Nm,
	HorizontalRuleNode: () => _e,
	INSERT_BLOCK_COMMAND: () => Ye,
	INSERT_INLINE_BLOCK_COMMAND: () => qe,
	InlineBlockNode: () => T$2,
	InlineToolbarFeatureClient: () => yh,
	ItalicFeatureClient: () => jd,
	LinkFeatureClient: () => Sf,
	LinkNode: () => te,
	NON_BREAKING_SPACE: () => "\xA0",
	NodeFormat: () => A,
	OrderedListFeatureClient: () => Kf,
	ParagraphFeatureClient: () => x0,
	RelationshipNode: () => Ne,
	RichTextField: () => fC,
	RichTextViewProvider: () => Tr,
	StrikethroughFeatureClient: () => Vd,
	TOGGLE_LINK_COMMAND: () => de,
	ToolbarButton: () => Bt,
	ToolbarDropdown: () => jt,
	UnderlineFeatureClient: () => nm,
	UnorderedListFeatureClient: () => t0,
	UploadNode: () => pe,
	createBlockNode: () => cr,
	createClientFeature: () => M,
	defaultEditorLexicalConfig: () => ln,
	getDOMRangeRect: () => Pr,
	getSelectedNode: () => et,
	sanitizeClientEditorConfig: () => sn,
	sanitizeClientFeatures: () => cc,
	setFloatingElemPosition: () => Eo,
	setFloatingElemPositionForLinkEditor: () => fo,
	slashMenuBasicGroupWithItems: () => X,
	toolbarAddDropdownGroupWithItems: () => ke,
	toolbarFeatureButtonsGroupWithItems: () => dr,
	toolbarFormatGroupWithItems: () => z,
	toolbarTextDropdownGroupWithItems: () => ee,
	useBlockComponentContext: () => ie,
	useEditorConfigContext: () => I$4,
	useLexicalDrawer: () => F$7,
	useLexicalListDrawer: () => Pt,
	useRichTextView: () => be
});
function X(t) {
	return {
		items: t,
		key: "basic",
		label: ({ i18n: e }) => e.t("lexical:general:slashMenuBasicGroupLabel")
	};
}
var xn = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 5H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 10H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M5 15H15",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var Cn = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 5H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 10H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 15H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var Zt = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 5H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 10H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 15H12.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var bn = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 5H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.5 10H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M7.5 15H17.5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var M = (t) => (o) => {
	let r = { clientFeatureProps: o };
	if (typeof t == "function") r.feature = ({ config: n, featureClientImportMap: l, featureClientSchemaMap: s, featureProviderMap: i, field: d, resolvedFeatures: c, schemaPath: u, unSanitizedEditorConfig: a }) => {
		let m = t({
			config: n,
			featureClientImportMap: l,
			featureClientSchemaMap: s,
			featureProviderMap: i,
			field: d,
			props: o,
			resolvedFeatures: c,
			schemaPath: u,
			unSanitizedEditorConfig: a
		});
		return m.sanitizedClientFeatureProps === null && (m.sanitizedClientFeatureProps = o), m;
	};
	else {
		let n = { ...t };
		n.sanitizedClientFeatureProps = o, r.feature = n;
	}
	return r;
};
var kn = (t) => ({
	type: "dropdown",
	ChildComponent: Zt,
	items: t,
	key: "align",
	order: 30
});
var ve = (t) => Pi$1(t) ? t.getFormatType() : t.__format, _n = [kn([
	{
		ChildComponent: Zt,
		isActive: ({ selection: t }) => {
			if (!wr(t)) return !1;
			for (let e$3 of t.getNodes()) {
				if ((Pi$1(e$3) || e(e$3)) && ve(e$3) === "left") continue;
				let o = e$3.getParent();
				if (!((Pi$1(o) || e(o)) && ve(o) === "left")) return !1;
			}
			return !0;
		},
		key: "alignLeft",
		label: ({ i18n: t }) => t.t("lexical:align:alignLeftLabel"),
		onSelect: ({ editor: t }) => {
			t.dispatchCommand(ze$2, "left");
		},
		order: 1
	},
	{
		ChildComponent: xn,
		isActive: ({ selection: t }) => {
			if (!wr(t)) return !1;
			for (let e$4 of t.getNodes()) {
				if ((Pi$1(e$4) || e(e$4)) && ve(e$4) === "center") continue;
				let o = e$4.getParent();
				if (!((Pi$1(o) || e(o)) && ve(o) === "center")) return !1;
			}
			return !0;
		},
		key: "alignCenter",
		label: ({ i18n: t }) => t.t("lexical:align:alignCenterLabel"),
		onSelect: ({ editor: t }) => {
			t.dispatchCommand(ze$2, "center");
		},
		order: 2
	},
	{
		ChildComponent: bn,
		isActive: ({ selection: t }) => {
			if (!wr(t)) return !1;
			for (let e$5 of t.getNodes()) {
				if ((Pi$1(e$5) || e(e$5)) && ve(e$5) === "right") continue;
				let o = e$5.getParent();
				if (!((Pi$1(o) || e(o)) && ve(o) === "right")) return !1;
			}
			return !0;
		},
		key: "alignRight",
		label: ({ i18n: t }) => t.t("lexical:align:alignRightLabel"),
		onSelect: ({ editor: t }) => {
			t.dispatchCommand(ze$2, "right");
		},
		order: 3
	},
	{
		ChildComponent: Cn,
		isActive: ({ selection: t }) => {
			if (!wr(t)) return !1;
			for (let e$6 of t.getNodes()) {
				if ((Pi$1(e$6) || e(e$6)) && ve(e$6) === "justify") continue;
				let o = e$6.getParent();
				if (!((Pi$1(o) || e(o)) && ve(o) === "justify")) return !1;
			}
			return !0;
		},
		key: "alignJustify",
		label: ({ i18n: t }) => t.t("lexical:align:alignJustifyLabel"),
		onSelect: ({ editor: t }) => {
			t.dispatchCommand(ze$2, "justify");
		},
		order: 4
	}
])], Gc = () => {
	let t = (0, import_compiler_runtime.c)(3), [e] = o$4(), o, r;
	return t[0] !== e ? (o = () => e.registerCommand(ze$2, Kc, 1), r = [e], t[0] = e, t[1] = o, t[2] = r) : (o = t[1], r = t[2]), (0, import_react.useEffect)(o, r), null;
}, Vc = M({
	plugins: [{
		Component: Gc,
		position: "normal"
	}],
	toolbarFixed: { groups: _n },
	toolbarInline: { groups: _n }
});
function Jc(t) {
	return (Pi$1(t) || e(t)) && !t.isInline();
}
function Kc(t) {
	let e = $r$2();
	if (!wr(e) && !Or$1(e)) return !1;
	let o = e.getNodes();
	for (let r of o) {
		let n = qs(r, Jc);
		n !== null && n.setFormat(t);
	}
	return !0;
}
var Xo = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M13.5353 10.5725C13.5353 9.47709 11.0456 9.99991 11.0456 7.85883C11.0456 6.46464 12.1162 5.61816 13.361 5.61816C14.805 5.61816 16 6.86298 16 8.92937C16 11.2945 14.4564 13.7841 11.1203 14.3816L10.8216 13.1368C12.888 12.4895 13.5353 11.4937 13.5353 10.5725ZM6.71369 10.5725C6.71369 9.47709 4.22407 9.99991 4.22407 7.85883C4.22407 6.46464 5.29461 5.61816 6.53942 5.61816C7.9834 5.61816 9.17842 6.86298 9.17842 8.92937C9.17842 11.2945 7.63485 13.7841 4.29876 14.3816L4 13.1368C6.06639 12.4895 6.71369 11.4937 6.71369 10.5725Z",
		fill: "currentColor"
	})
});
var _t = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "currentColor",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M11.708 14.5H7.79785V13.9414H8.01367C9.00391 13.9414 9.15625 13.9033 9.15625 13.6113V6.70508H8.07715C6.82031 6.70508 6.73145 7.08594 6.28711 8.67285H5.80469L5.91895 6.12109H13.5869L13.7012 8.67285H13.2188C12.7744 7.08594 12.6855 6.70508 11.4287 6.70508H10.3496V13.6113C10.3496 13.9033 10.502 13.9414 11.4922 13.9414H11.708V14.5Z",
		fill: "currentColor"
	})
});
var ee = (t) => ({
	type: "dropdown",
	ChildComponent: _t,
	items: t,
	key: "text",
	order: 25
});
var En = {
	type: "element",
	dependencies: [_t$3],
	export: (t, e) => {
		if (!Pt$3(t)) return null;
		let o = e(t).split(`
`), r = [];
		for (let n of o) r.push("> " + n);
		return r.join(`
`);
	},
	regExp: /^>\s/,
	replace: (t, e, o, r) => {
		if (r) {
			let l = t.getPreviousSibling();
			if (Pt$3(l)) {
				l.splice(l.getChildrenSize(), 0, [...e]), l.select(0, 0), t.remove();
				return;
			}
		}
		let n = Ot$3();
		n.append(...e), t.replace(n), n.select(0, 0);
	}
};
var Ln = [ee([{
	ChildComponent: Xo,
	isActive: ({ selection: t }) => {
		if (!wr(t)) return !1;
		for (let e of t.getNodes()) if (!Pt$3(e) && !Pt$3(e.getParent())) return !1;
		return !0;
	},
	key: "blockquote",
	label: ({ i18n: t }) => t.t("lexical:blockquote:label"),
	onSelect: ({ editor: t }) => {
		t.update(() => {
			W$1($r$2(), () => Ot$3());
		});
	},
	order: 20
}])], qc = M({
	markdownTransformers: [En],
	nodes: [_t$3],
	slashMenu: { groups: [X([{
		Icon: Xo,
		key: "blockquote",
		keywords: ["quote", "blockquote"],
		label: ({ i18n: t }) => t.t("lexical:blockquote:label"),
		onSelect: ({ editor: t }) => {
			t.update(() => {
				W$1($r$2(), () => Ot$3());
			});
		}
	}])] },
	toolbarFixed: { groups: Ln },
	toolbarInline: { groups: Ln }
});
var wt = class extends r {
	__cacheBuster;
	__fields;
	constructor({ cacheBuster: e, fields: o, format: r, key: n }) {
		super(r, n), this.__fields = o, this.__cacheBuster = e || 0;
	}
	static clone(e) {
		return new this({
			cacheBuster: e.__cacheBuster,
			fields: e.__fields,
			format: e.__format,
			key: e.__key
		});
	}
	static getType() {
		return "block";
	}
	static importDOM() {
		return {};
	}
	static importJSON(e) {
		e.version === 1 && (e = {
			...e,
			fields: { ...e.fields.data },
			version: 2
		});
		let o = du(e.fields);
		return o.setFormat(e.format), o;
	}
	static isInline() {
		return !1;
	}
	createDOM(e) {
		let o = document.createElement("div");
		return Zl$1(o, e?.theme?.block), o;
	}
	decorate(e, o) {
		return null;
	}
	exportDOM() {
		let e = document.createElement("div"), o = document.createTextNode(this.getTextContent());
		return e.append(o), { element: e };
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			type: "block",
			fields: this.getFields(),
			version: 2
		};
	}
	getCacheBuster() {
		return this.getLatest().__cacheBuster;
	}
	getFields() {
		return this.getLatest().__fields;
	}
	getTextContent() {
		return "Block Field";
	}
	setFields(e, o) {
		let r = this.getWritable();
		r.__fields = e, o || r.__cacheBuster++;
	}
};
function du(t) {
	return Ss$1(new wt({ fields: {
		...t,
		id: t?.id || new import_objectid.default.default().toHexString()
	} }));
}
var $n = (0, import_react.createContext)({
	baseClass: "LexicalEditorTheme__block",
	BlockCollapsible: () => null,
	BlockDrawer: () => null,
	EditButton: () => null,
	errorCount: 0,
	formSchema: [],
	initialState: !1,
	nodeKey: "",
	RemoveButton: () => null
}), ie = () => import_react.use($n), On = (t) => {
	let e = (0, import_compiler_runtime.c)(4), { Collapsible: o, CustomBlock: r, CustomLabel: n, ...l } = t, { BlockDrawer: s, errorCount: i, formSchema: d } = l, u = fo$2() && i > 0, a = a$1(), m;
	e[0] !== o || e[1] !== i || e[2] !== u ? (m = (f) => {
		let { children: g, ...k } = f;
		return (0, import_jsx_runtime.jsx)(o, {
			errorCount: i,
			fieldHasErrors: u,
			...k,
			children: g
		});
	}, e[0] = o, e[1] = i, e[2] = u, e[3] = m) : m = e[3];
	let p = m, h = {
		...l,
		BlockCollapsible: p
	};
	return r ? (0, import_jsx_runtime.jsxs)($n, {
		value: h,
		children: [r, (0, import_jsx_runtime.jsx)(s, {})]
	}) : (0, import_jsx_runtime.jsx)(p, { children: (0, import_jsx_runtime.jsx)(Lo$1, {
		fields: d,
		forceRender: !0,
		parentIndexPath: "",
		parentPath: "",
		parentSchemaPath: "",
		permissions: !0,
		readOnly: !a
	}) });
};
function An({ fields: t }) {
	for (let e in t) {
		let o = t[e];
		Array.isArray(o?.rows) && "value" in o && (o.disableFormData = !0);
	}
	return t;
}
var Hn = (t) => {
	let { cacheBuster: e, className: o, CustomBlock: r, CustomLabel: n, formData: l, nodeKey: s } = t, i = fo$2(), { id: d, collectionSlug: c, globalSlug: u } = Ie$3(), { fieldProps: { featureClientSchemaMap: a, field: m, initialLexicalFormState: p, schemaPath: h }, uuid: f } = I$4(), { fields: g } = tl$2(), k = (0, import_react.useRef)(new AbortController()), N = at$6(), [R, T] = import_react.useState(0), { config: C } = se$4(), x = tu$1({
		slug: `lexical-blocks-create-${f}-${l.id}`,
		depth: N
	}), { toggleDrawer: b } = F$7(x), { getDocPreferences: _, setDocFieldPreferences: D } = Ie$3(), [I] = o$4(), y = a$1(), S = l.blockType, { getFormState: w } = Nt$4(), L = `${h}.lexical_internal_feature.blocks.lexical_blocks.${S}.fields`, [E, v] = import_react.useState(() => {
		let H = p?.[l.id]?.formState;
		if (!H) return !1;
		let Q = Object.fromEntries(Object.entries(H).map(([W, V]) => [W, W in l ? {
			...V,
			initialValue: l[W],
			value: l[W]
		} : V]));
		return Q.blockName = {
			initialValue: l.blockName,
			passesCondition: !0,
			valid: !0,
			value: l.blockName
		}, Q;
	}), $ = (0, import_react.useRef)(!1), O = (0, import_react.useRef)(e);
	(0, import_react.useEffect)(() => {
		$.current ? (O.current !== e && v(!1), O.current = e) : $.current = !0;
	}, [e]);
	let [F] = import_react.useState(() => v4()), [P, Z] = import_react.useState(() => {
		if (!n) return E?._components?.customComponents?.BlockLabel ?? void 0;
	}), [K, Ve] = import_react.useState(() => {
		if (!r) return E?._components?.customComponents?.Block ?? void 0;
	}), Re = (0, import_react.useMemo)(() => r ? (0, import_jsx_runtime.jsx)(r, {
		className: o,
		formData: l,
		isEditor: !0,
		isJSXConverter: !1,
		nodeKey: s,
		useBlockComponentContext: ie
	}) : K, [
		r,
		o,
		l,
		s,
		K
	]), he = (0, import_react.useMemo)(() => n ? (0, import_jsx_runtime.jsx)(n, {
		className: o,
		formData: l,
		isEditor: !0,
		isJSXConverter: !1,
		nodeKey: s,
		useBlockComponentContext: ie
	}) : P, [
		n,
		o,
		l,
		s,
		P
	]);
	(0, import_react.useEffect)(() => {
		let H = new AbortController();
		return l && !E && (async () => {
			let { state: W } = await w({
				id: d,
				collectionSlug: c,
				data: l,
				docPermissions: { fields: !0 },
				docPreferences: await _(),
				documentFormState: deepCopyObjectSimpleWithoutReactComponents(g, { excludeFiles: !0 }),
				globalSlug: u,
				initialBlockData: l,
				operation: "update",
				readOnly: !y,
				renderAllFields: !0,
				schemaPath: L,
				signal: H.signal
			});
			if (W) {
				W.blockName = {
					initialValue: l.blockName,
					passesCondition: !0,
					valid: !0,
					value: l.blockName
				};
				let V = reduceFieldsToValues(deepCopyObjectSimpleWithoutReactComponents(W, { excludeFiles: !0 }), !0);
				I.update(() => {
					let Y = Mo$1(s);
					if (Y && Ae(Y)) {
						let ne = V;
						ne.blockType = S, Y.setFields(ne, !0);
					}
				}, { tag: "skip-dom-selection" }), v(W), n || Z(W._components?.customComponents?.BlockLabel ?? void 0), r || Ve(W._components?.customComponents?.Block ?? void 0);
			}
		})(), () => {
			le$6(H);
		};
	}, [
		w,
		L,
		y,
		d,
		n,
		r,
		l,
		I,
		s,
		E,
		c,
		u,
		_,
		g,
		S
	]);
	let [re, ge] = import_react.useState(p?.[l.id]?.collapsed ?? !1), Vt = `${h}.lexical_internal_feature.blocks.lexical_blocks.${S}`, se = a.blocks?.[Vt]?.[0], q = se.blockReferences ? typeof se?.blockReferences?.[0] == "string" ? C.blocksMap[se?.blockReferences?.[0]] : se?.blockReferences?.[0] : se?.blocks?.[0], { i18n: pt, t: Ie } = WP(), ft = (0, import_react.useCallback)(async ({ formState: H, submit: Q }) => {
		le$6(k.current);
		let W = new AbortController();
		k.current = W;
		let { state: V } = await w({
			id: d,
			collectionSlug: c,
			docPermissions: { fields: !0 },
			docPreferences: await _(),
			documentFormState: deepCopyObjectSimpleWithoutReactComponents(g, { excludeFiles: !0 }),
			formState: H,
			globalSlug: u,
			initialBlockFormState: H,
			operation: "update",
			readOnly: !y,
			renderAllFields: !!Q,
			schemaPath: L,
			signal: W.signal
		});
		if (!V) return H;
		H.blockName && (V.blockName = H.blockName);
		let Y = reduceFieldsToValues(An({ fields: deepCopyObjectSimpleWithoutReactComponents(V, { excludeFiles: !0 }) }), !0);
		if (setTimeout(() => {
			I.update(() => {
				let ne = Mo$1(s);
				if (ne && Ae(ne)) {
					let Ke = Y;
					Ke.blockType = S, ne.setFields(Ke, !0);
				}
			}, { tag: "skip-dom-selection" });
		}, 0), Q) {
			n || Z(V._components?.customComponents?.BlockLabel ?? void 0), r || Ve(V._components?.customComponents?.Block ?? void 0);
			let ne = 0;
			for (let Ke of Object.values(V)) Ke?.valid === !1 && ne++;
			T(ne);
		}
		return V;
	}, [
		w,
		d,
		c,
		_,
		u,
		L,
		S,
		g,
		y,
		I,
		s,
		r,
		n
	]);
	(0, import_react.useEffect)(() => () => {
		le$6(k.current);
	}, []);
	let cn = (0, import_react.useCallback)(() => {
		I.update(() => {
			Mo$1(s)?.remove();
		});
	}, [I, s]), Je = q?.labels?.singular ? getTranslation(q.labels.singular, pt) : q?.slug, un = (0, import_react.useCallback)((H) => {
		_().then((Q) => {
			let V = Q?.fields?.[m.name]?.collapsed, Y = V && V?.length ? V : [];
			H ? Y.includes(l.id) || Y.push(l.id) : Y.includes(l.id) && Y.splice(Y.indexOf(l.id), 1), D(m.name, {
				collapsed: Y,
				hello: "hi"
			});
		});
	}, [
		_,
		m.name,
		D,
		l.id
	]), Jt = (0, import_react.useMemo)(() => () => (0, import_jsx_runtime.jsx)(re$3, {
		buttonStyle: "icon-label",
		className: `${o}__editButton`,
		disabled: !y,
		el: "button",
		icon: "edit",
		onClick: (H) => (H.preventDefault(), H.stopPropagation(), b(), !1),
		onMouseDown: (H) => {
			H.preventDefault();
		},
		round: !0,
		size: "small",
		tooltip: Ie("lexical:blocks:inlineBlocks:edit", { label: Je })
	}), [
		o,
		y,
		Ie,
		Je,
		b
	]), Kt = (0, import_react.useMemo)(() => () => (0, import_jsx_runtime.jsx)(re$3, {
		buttonStyle: "icon-label",
		className: `${o}__removeButton`,
		disabled: !y,
		icon: "x",
		onClick: (H) => {
			H.preventDefault(), cn();
		},
		round: !0,
		tooltip: "Remove Block"
	}), [
		o,
		y,
		cn
	]), jo = (0, import_react.useMemo)(() => ({ Actions: H, children: Q, className: W, collapsibleProps: V, disableBlockName: Y, editButton: ne, errorCount: Ke, fieldHasErrors: Ho, Label: pn, Pill: fn, removeButton: Ec }) => (0, import_jsx_runtime.jsx)("div", {
		className: `${o}__container ${o}-${S}`,
		children: (0, import_jsx_runtime.jsx)(qi$1, {
			className: [
				`${o}__row`,
				Ho ? `${o}__row--has-errors` : `${o}__row--no-errors`,
				W
			].filter(Boolean).join(" "),
			collapsibleStyle: Ho ? "error" : "default",
			header: (0, import_jsx_runtime.jsxs)("div", {
				className: `${o}__block-header`,
				children: [typeof pn < "u" ? pn : typeof he < "u" ? he : (0, import_jsx_runtime.jsxs)("div", {
					className: `${o}__block-label`,
					children: [
						typeof fn < "u" ? fn : (0, import_jsx_runtime.jsx)(yt$6, {
							className: `${o}__block-pill ${o}__block-pill-${S}`,
							pillStyle: "white",
							size: "small",
							children: Je ?? S
						}),
						!Y && !q?.admin?.disableBlockName && (0, import_jsx_runtime.jsx)(av, {
							path: "blockName",
							readOnly: !y
						}),
						Ho && (0, import_jsx_runtime.jsx)(Io$2, {
							count: Ke ?? 0,
							i18n: pt,
							withMessage: !0
						})
					]
				}), (0, import_jsx_runtime.jsx)("div", {
					className: `${o}__block-actions`,
					children: typeof H < "u" ? H : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [Re && ne !== !1 || !Re && ne ? (0, import_jsx_runtime.jsx)(Jt, {}) : null, Ec !== !1 && y ? (0, import_jsx_runtime.jsx)(Kt, {}) : null] })
				})]
			}),
			isCollapsed: re,
			onToggle: (hn) => {
				un(hn), ge(hn);
			},
			...V || {},
			children: Q
		}, 0)
	}), [
		Re,
		he,
		Jt,
		Kt,
		Je,
		o,
		q?.admin?.disableBlockName,
		S,
		pt,
		re,
		un,
		y
	]), dn = l?.id, mn = (0, import_react.useMemo)(() => () => (0, import_jsx_runtime.jsx)(ss$1, { children: (0, import_jsx_runtime.jsx)(Tt$7, {
		className: "",
		slug: x,
		title: Ie(`lexical:blocks:inlineBlocks:${dn ? "edit" : "create"}`, { label: Je ?? Ie("lexical:blocks:inlineBlocks:label") }),
		children: E ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(Lo$1, {
			fields: q?.fields ?? [],
			forceRender: !0,
			parentIndexPath: "",
			parentPath: "",
			parentSchemaPath: L,
			permissions: !0,
			readOnly: !y
		}), (0, import_jsx_runtime.jsx)(Ar$2, {
			programmaticSubmit: !0,
			children: Ie("fields:saveChanges")
		})] }) : null
	}) }), [
		E,
		x,
		dn,
		Je,
		Ie,
		y,
		q?.fields,
		L
	]), Sc = (0, import_react.useMemo)(() => E ? (0, import_jsx_runtime.jsx)("div", {
		"data-block-drawer-slug": x,
		style: { display: "contents" },
		children: (0, import_jsx_runtime.jsx)(Ss$2, {
			beforeSubmit: [async ({ formState: H }) => await ft({
				formState: H,
				submit: !0
			})],
			el: "div",
			fields: q?.fields ?? [],
			initialState: E,
			onChange: [ft],
			onSubmit: (H, Q) => {
				Q.blockType = S, I.update(() => {
					let W = Mo$1(s);
					W && Ae(W) && W.setFields(Q, !0);
				}, { tag: Vn }), b();
			},
			submitted: i,
			uuid: F,
			children: (0, import_jsx_runtime.jsx)(On, {
				baseClass: o,
				BlockDrawer: mn,
				Collapsible: jo,
				CustomBlock: Re,
				CustomLabel: he,
				EditButton: Jt,
				errorCount: R,
				formSchema: q?.fields ?? [],
				initialState: E,
				nodeKey: s,
				RemoveButton: Kt
			})
		})
	}) : null, [
		jo,
		mn,
		Re,
		he,
		S,
		x,
		Kt,
		Jt,
		o,
		I,
		R,
		b,
		q?.fields,
		F,
		E,
		s,
		ft,
		i
	]);
	return q ? Sc : (0, import_jsx_runtime.jsx)(jo, {
		disableBlockName: !0,
		fieldHasErrors: !0,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: `${o}-not-found`,
			children: [
				"Error: Block '",
				S,
				"' not found in the config but exists in the lexical data"
			]
		})
	});
};
var ae = class extends wt {
	static clone(e) {
		return super.clone(e);
	}
	static getType() {
		return super.getType();
	}
	static importJSON(e) {
		e.version === 1 && (e = {
			...e,
			fields: { ...e.fields.data },
			version: 2
		});
		let o = Fe(e.fields);
		return o.setFormat(e.format), o;
	}
	decorate(...[e, o, r, n]) {
		return (0, import_jsx_runtime.jsx)(Hn, {
			cacheBuster: this.getCacheBuster(),
			className: o.theme.block ?? "LexicalEditorTheme__block",
			CustomBlock: r,
			CustomLabel: n,
			formData: this.getFields(),
			nodeKey: this.getKey()
		});
	}
	exportJSON() {
		return super.exportJSON();
	}
};
function Fe(t) {
	return Ss$1(new ae({ fields: {
		...t,
		id: t?.id || new import_objectid.default.default().toHexString()
	} }));
}
function Ae(t) {
	return t instanceof ae;
}
var Ye = ne$4("INSERT_BLOCK_COMMAND"), qe = ne$4("INSERT_INLINE_BLOCK_COMMAND"), cd = at$2 && "documentMode" in document ? document.documentMode : null;
at$2 && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
at$2 && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
at$2 && "InputEvent" in window && !cd && "getTargetRanges" in new window.InputEvent("input");
at$2 && /Version\/[\d.].*Safari/.test(navigator.userAgent);
at$2 && /iPad|iPhone|iPod/.test(navigator.userAgent) && window.MSStream;
at$2 && /Android/.test(navigator.userAgent);
at$2 && /Win/.test(navigator.platform);
at$2 && /^(?=.*Chrome).*/i.test(navigator.userAgent);
at$2 && /AppleWebKit\/[\d.]+/.test(navigator.userAgent);
var ol = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "currentColor",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M10.6772 15H6.27017V5.718H10.4172C12.6792 5.718 13.8492 6.602 13.8492 8.292C13.8492 9.098 13.1992 9.982 12.4712 10.216C13.3812 10.476 14.1742 11.256 14.1742 12.322C14.1742 14.09 12.9002 15 10.6772 15ZM8.46717 9.501H10.3262C11.3012 9.501 11.7042 9.046 11.7042 8.409C11.7042 7.72 11.2362 7.317 10.3392 7.317H8.46717V9.501ZM8.46717 11.061V13.401H10.4822C11.4702 13.401 11.9642 12.959 11.9642 12.218C11.9642 11.49 11.4702 11.061 10.4822 11.061H8.46717Z",
		fill: "currentColor"
	})
});
var z = (t) => ({
	type: "buttons",
	items: t,
	key: "format",
	order: 40
});
var rl = {
	type: "text-format",
	format: ["bold", "italic"],
	tag: "***"
}, nl = {
	type: "text-format",
	format: ["bold", "italic"],
	intraword: !1,
	tag: "___"
}, ll = {
	type: "text-format",
	format: ["bold"],
	tag: "**"
}, il = {
	type: "text-format",
	format: ["bold"],
	intraword: !1,
	tag: "__"
};
var sl = [z([{
	ChildComponent: ol,
	isActive: ({ selection: t }) => wr(t) || Rt(t) ? t.hasFormat("bold") : !1,
	key: "bold",
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(me$3, "bold");
	},
	order: 1
}])], vd = M(({ featureProviderMap: t }) => {
	let e = [ll, il];
	return t.get("italic") && e.push(nl, rl), {
		enableFormats: ["bold"],
		markdownTransformers: e,
		toolbarFixed: { groups: sl },
		toolbarInline: { groups: sl }
	};
});
var pl = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "currentColor",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M11.311 14.2969L11.0327 15H6.18408L6.4624 14.2969C7.54639 14.2969 7.70752 14.209 7.83936 13.8721L10.8423 6.45996C10.8716 6.38672 10.8862 6.32812 10.8862 6.26953C10.8862 6.09375 10.6519 6.03516 9.80225 6.03516L10.0952 5.33203H14.9438L14.6509 6.03516C13.5669 6.03516 13.4204 6.12305 13.2886 6.45996L10.2856 13.8721C10.2563 13.9453 10.2271 14.0039 10.2271 14.0625C10.2271 14.2383 10.4614 14.2969 11.311 14.2969Z",
		fill: "currentColor"
	})
});
var fl = {
	type: "text-format",
	format: ["italic"],
	tag: "*"
}, hl = {
	type: "text-format",
	format: ["italic"],
	intraword: !1,
	tag: "_"
};
var gl = [z([{
	ChildComponent: pl,
	isActive: ({ selection: t }) => wr(t) || Rt(t) ? t.hasFormat("italic") : !1,
	key: "italic",
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(me$3, "italic");
	},
	order: 2
}])], jd = M({
	enableFormats: ["italic"],
	markdownTransformers: [fl, hl],
	toolbarFixed: { groups: gl },
	toolbarInline: { groups: gl }
});
var Cl = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "currentColor",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [(0, import_jsx_runtime.jsx)("path", {
		d: "M5.50756 12.76H7.42756C7.56256 14.215 8.82256 14.71 10.1576 14.71C11.4326 14.71 12.4226 14.14 12.4226 13.06C12.4226 12.28 11.9576 11.845 10.6676 11.605L8.70256 11.245C7.12756 10.96 5.85256 10.21 5.85256 8.335C5.85256 6.43 7.53256 5.11 9.87256 5.11C12.4226 5.11 13.9526 6.22 14.1626 8.23H12.2876C12.1526 7.18 11.2226 6.595 9.88756 6.595C8.59756 6.595 7.78756 7.27 7.78756 8.215C7.78756 9.1 8.34256 9.385 9.49756 9.61L11.5676 10.015C13.3226 10.345 14.3726 11.215 14.3726 12.94C14.3726 14.89 12.5876 16.18 10.2176 16.18C7.66756 16.18 5.70256 15.115 5.50756 12.76Z",
		fill: "currentColor"
	}), (0, import_jsx_runtime.jsx)("path", {
		d: "M4.99756 11.44H15.0026V12.19H4.99756V11.44Z",
		fill: "currentColor"
	})]
});
var bl = {
	type: "text-format",
	format: ["strikethrough"],
	tag: "~~"
}, kl = [z([{
	ChildComponent: Cl,
	isActive: ({ selection: t }) => wr(t) || Rt(t) ? t.hasFormat("strikethrough") : !1,
	key: "strikethrough",
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(me$3, "strikethrough");
	},
	order: 4
}])], Vd = M({
	enableFormats: ["strikethrough"],
	markdownTransformers: [bl],
	toolbarFixed: { groups: kl },
	toolbarInline: { groups: kl }
});
var yl = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "currentColor",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [(0, import_jsx_runtime.jsx)("path", {
		d: "M13.9656 11.256C13.9656 13.791 12.5096 15.156 10.0006 15.156C7.50461 15.156 6.03561 13.791 6.03561 11.23V5.718H7.76461V11.243C7.76461 12.868 8.50561 13.778 10.0006 13.778C11.4956 13.778 12.2496 12.868 12.2496 11.243V5.718H13.9656V11.256Z",
		fill: "currentColor"
	}), (0, import_jsx_runtime.jsx)("path", {
		d: "M5.09961 16.3H14.9016V16.95H5.09961V16.3Z",
		fill: "currentColor"
	})]
});
var Rl = [z([{
	ChildComponent: yl,
	isActive: ({ selection: t }) => wr(t) || Rt(t) ? t.hasFormat("underline") : !1,
	key: "underline",
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(me$3, "underline");
	},
	order: 3
}])], nm = M({
	enableFormats: ["underline"],
	toolbarFixed: { groups: Rl },
	toolbarInline: { groups: Rl }
});
var $l = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M4.639 13.5V7.074H6.196V9.648H9.076V7.074H10.642V13.5H9.076V10.836H6.196V13.5H4.639ZM11.5656 9.045V8.019C12.6636 8.019 13.1316 7.731 13.2846 7.065H14.4006V13.5H12.8436V9.045H11.5656Z",
		fill: "currentColor"
	})
});
var Al = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M4.139 13.5V7.074H5.696V9.648H8.576V7.074H10.142V13.5H8.576V10.836H5.696V13.5H4.139ZM15.9796 8.973C15.9796 10.116 15.1696 10.656 14.0356 11.232C13.2256 11.646 12.8206 11.943 12.7846 12.294H15.9886V13.5H11.0566V12.951C11.0566 11.601 12.1636 10.845 13.1176 10.287C14.0356 9.756 14.5126 9.486 14.5126 8.946C14.5126 8.46 14.2156 8.145 13.6306 8.145C13.0186 8.145 12.6586 8.613 12.6226 9.198H11.1196C11.2186 7.947 12.1006 6.966 13.6396 6.966C15.0346 6.966 15.9796 7.785 15.9796 8.973Z",
		fill: "currentColor"
	})
});
var Pl = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M4.139 13.5V7.074H5.696V9.648H8.576V7.074H10.142V13.5H8.576V10.836H5.696V13.5H4.139ZM16.1146 11.745C16.1146 12.744 15.2236 13.608 13.6126 13.608C12.0736 13.608 11.0926 12.762 10.9846 11.547H12.4696C12.5146 12.114 13.0006 12.456 13.6126 12.456C14.2876 12.456 14.6746 12.132 14.6746 11.619C14.6746 11.061 14.2426 10.836 13.6216 10.836H12.9826V9.738H13.6036C14.1526 9.738 14.5486 9.486 14.5486 8.937C14.5486 8.46 14.2156 8.127 13.6486 8.127C13.0366 8.127 12.6586 8.514 12.6226 9.045H11.1916C11.2726 7.929 12.1276 6.966 13.6666 6.966C15.1876 6.966 15.9706 7.848 15.9706 8.865C15.9706 9.603 15.5026 10.143 14.8186 10.269C15.6196 10.404 16.1146 10.971 16.1146 11.745Z",
		fill: "currentColor"
	})
});
var jl = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M3.639 13.5V7.074H5.196V9.648H8.076V7.074H9.642V13.5H8.076V10.836H5.196V13.5H3.639ZM15.1736 7.074V10.854H16.3706V12.033H15.1736V13.5H13.6796V12.033H10.5116V10.845L13.4996 7.074H15.1736ZM13.6796 8.46L11.8256 10.854H13.6796V8.46Z",
		fill: "currentColor"
	})
});
var Ul = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M3.639 13.5V7.074H5.196V9.648H8.076V7.074H9.642V13.5H8.076V10.836H5.196V13.5H3.639ZM13.1576 10.269C12.6896 10.269 12.3746 10.494 12.2216 10.737H10.8176L11.1956 7.074H15.2546V8.28H12.3206L12.1856 9.549C12.4016 9.351 12.8516 9.126 13.4636 9.126C14.7866 9.126 15.6596 10.053 15.6596 11.358C15.6596 12.609 14.7326 13.608 13.1756 13.608C11.5826 13.608 10.6556 12.753 10.5566 11.511H12.1136C12.1586 12.06 12.5456 12.465 13.1576 12.465C13.8236 12.465 14.1746 11.97 14.1746 11.376C14.1746 10.764 13.8416 10.269 13.1576 10.269Z",
		fill: "currentColor"
	})
});
var Gl = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M3.639 13.5V7.074H5.196V9.648H8.076V7.074H9.642V13.5H8.076V10.836H5.196V13.5H3.639ZM13.3646 8.127C12.5456 8.127 12.0416 8.937 12.0416 9.999C12.3296 9.54 12.8246 9.207 13.5536 9.207C14.8586 9.207 15.8036 10.134 15.8036 11.376C15.8036 12.645 14.8226 13.608 13.3196 13.608C11.7266 13.608 10.6196 12.393 10.6196 10.395C10.6196 8.316 11.7716 6.966 13.4186 6.966C14.7056 6.966 15.5786 7.749 15.7316 8.829H14.3186C14.2016 8.415 13.9226 8.127 13.3646 8.127ZM13.3106 12.51C13.9586 12.51 14.3816 12.042 14.3816 11.385C14.3816 10.737 13.9586 10.278 13.3106 10.278C12.6536 10.278 12.2126 10.737 12.2126 11.385C12.2126 12.042 12.6536 12.51 13.3106 12.51Z",
		fill: "currentColor"
	})
});
var cr = (t) => (e, o, r) => {
	let n = t(r);
	n && (n.append(...o), e.replace(n), n.select(0, 0));
};
var Vl = (t) => {
	let o = `^(${t.map((n) => Number(n.slice(1))).map((n) => `#{${n}}`).join("|")})\\s`, r = new RegExp(o);
	return {
		type: "element",
		dependencies: [Tt$3],
		export: (n, l) => {
			if (!It$3(n)) return null;
			let s = Number(n.getTag().slice(1));
			return "#".repeat(s) + " " + l(n);
		},
		regExp: r,
		replace: cr((n) => {
			return Mt$3("h" + n[1]?.length);
		})
	};
};
var Kl = (t) => {
	W$1($r$2(), () => Mt$3(t));
}, Xl = {
	h1: $l,
	h2: Al,
	h3: Pl,
	h4: jl,
	h5: Ul,
	h6: Gl
}, Nm = M(({ props: t }) => {
	let { enabledHeadingSizes: e = [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6"
	] } = t, o = [ee(e.map((r, n) => ({
		ChildComponent: Xl[r],
		isActive: ({ selection: l }) => {
			if (!wr(l)) return !1;
			for (let s of l.getNodes()) {
				if (It$3(s) && s.getTag() === r) continue;
				let i = s.getParent();
				if (!(It$3(i) && i.getTag() === r)) return !1;
			}
			return !0;
		},
		key: r,
		label: ({ i18n: l }) => l.t("lexical:heading:label", { headingLevel: r.charAt(1) }),
		onSelect: ({ editor: l }) => {
			l.update(() => {
				Kl(r);
			});
		},
		order: n + 2
	})))];
	return {
		markdownTransformers: [Vl(e)],
		nodes: [Tt$3],
		plugins: [{
			Component: Lm,
			position: "normal"
		}],
		sanitizedClientFeatureProps: t,
		slashMenu: { groups: e?.length ? [X(e.map((r) => ({
			Icon: Xl[r],
			key: `heading-${r.charAt(1)}`,
			keywords: ["heading", r],
			label: ({ i18n: n }) => n.t("lexical:heading:label", { headingLevel: r.charAt(1) }),
			onSelect: ({ editor: n }) => {
				n.update(() => {
					Kl(r);
				});
			}
		})))] : [] },
		toolbarFixed: { groups: e?.length ? o : [] },
		toolbarInline: { groups: e?.length ? o : [] }
	};
}), Lm = (t) => {
	let e = (0, import_compiler_runtime.c)(9), { clientProps: o } = t, { enabledHeadingSizes: r } = o, n;
	e[0] !== r ? (n = r === void 0 ? [
		"h1",
		"h2",
		"h3",
		"h4",
		"h5",
		"h6"
	] : r, e[0] = r, e[1] = n) : n = e[1];
	let l = n, s;
	e[2] !== l ? (s = l.at(-1), e[2] = l, e[3] = s) : s = e[3];
	let i = s, [d] = o$4(), c, u;
	return e[4] !== d || e[5] !== l || e[6] !== i ? (c = () => {
		if (!(!i || l.length === 6)) return d.registerNodeTransform(Tt$3, (a) => {
			l.includes(a.getTag()) || a.setTag(i);
		});
	}, u = [
		d,
		l,
		i
	], e[4] = d, e[5] = l, e[6] = i, e[7] = c, e[8] = u) : (c = e[7], u = e[8]), (0, import_react.useEffect)(c, u), null;
};
var ql = () => (0, import_jsx_runtime.jsxs)("svg", {
	fill: "none",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [(0, import_jsx_runtime.jsx)("path", {
		d: "M5 10h10",
		stroke: "currentColor"
	}), (0, import_jsx_runtime.jsx)("path", {
		d: "M10 15V5",
		stroke: "currentColor"
	})]
});
var ke = (t) => ({
	type: "dropdown",
	ChildComponent: ql,
	items: t,
	key: "add",
	order: 10
});
var Et = class extends Fi$1 {
	static clone(e) {
		return new this(e.__key);
	}
	static getType() {
		return "horizontalrule";
	}
	static importDOM() {
		return { hr: () => ({
			conversion: Dm,
			priority: 0
		}) };
	}
	static importJSON(e) {
		return Ql();
	}
	createDOM(e) {
		let o = document.createElement("hr");
		return Zl$1(o, e.theme.hr), o;
	}
	decorate() {
		return null;
	}
	exportDOM() {
		return { element: document.createElement("hr") };
	}
	exportJSON() {
		return {
			type: "horizontalrule",
			version: 1
		};
	}
	getTextContent() {
		return `
`;
	}
	isInline() {
		return !1;
	}
	updateDOM() {
		return !1;
	}
};
function Dm() {
	return { node: Ql() };
}
function Ql() {
	return Ss$1(new Et());
}
var _e = class extends Et {
	static clone(e) {
		return super.clone(e);
	}
	static getType() {
		return super.getType();
	}
	static importJSON(e) {
		return Qe();
	}
	decorate() {
		return null;
	}
	exportJSON() {
		return super.exportJSON();
	}
};
function Qe() {
	return Ss$1(new _e());
}
function Lt(t) {
	return t instanceof _e;
}
var hi = () => (0, import_jsx_runtime.jsx)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: (0, import_jsx_runtime.jsx)("path", {
		d: "M8.5 11.5L11.5 8.5M8.5 7L9.625 5.875C10.868 4.633 12.882 4.633 14.125 5.875C15.368 7.118 15.368 9.133 14.125 10.375L13 11.5M7 8.5L5.746 9.754C4.56 10.94 4.519 12.85 5.652 14.087C6.814 15.354 8.78 15.449 10.058 14.298L11.5 13",
		stroke: "currentColor",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})
});
function et(t) {
	let { anchor: e } = t, { focus: o } = t, r = t.anchor.getNode(), n = t.focus.getNode();
	return r === n ? r : t.isBackward() ? _$4(o) ? r : n : _$4(e) ? r : n;
}
var dr = (t) => ({
	type: "buttons",
	items: t,
	key: "features",
	order: 50
});
function mr(t) {
	return t = String(t).trim(), t.match(/^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi) != null || t.match(/^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z\d+/]+=*$/i) != null ? t : "https://";
}
var sp = /^(?:[a-zA-Z][a-zA-Z\d+.-]*:(?:\/\/)?(?:[-;:&=+$,\w]+@)?[A-Za-z\d]+(?:\.[A-Za-z\d]+)+|www\.[A-Za-z\d]+(?:\.[A-Za-z\d]+)+|(?:tel|mailto):[\w+.-]+)(?:\/[+~%/\w-]*)?(?:\?[-;&=%\w]*)?(?:#\w+)?$/, ap = /^(?:\/[\w\-./]*(?:\?[-;&=%\w]*)?(?:#[\w-]+)?|#[\w\-]+)$/;
function xi(t) {
	if (!t || t.includes(" ") || /^[a-z][a-z\d+.-]*:\/[^/]/i.test(t)) return !1;
	if (t === "https://" || sp.test(t) || ap.test(t)) return !0;
	try {
		let e = new URL(t);
		return !([
			"ftp:",
			"http:",
			"https:"
		].includes(e.protocol) && !e.hostname.includes("."));
	} catch {}
	return !1;
}
var hp = new Set([
	"http:",
	"https:",
	"mailto:",
	"sms:",
	"tel:"
]), te = class extends Ai {
	__fields;
	__id;
	constructor({ id: e, fields: o = {
		linkType: "custom",
		newTab: !1
	}, key: r }) {
		super(r), this.__fields = o, this.__id = e;
	}
	static clone(e) {
		return new this({
			id: e.__id,
			fields: e.__fields,
			key: e.__key
		});
	}
	static getType() {
		return "link";
	}
	static importDOM() {
		return { a: (e) => ({
			conversion: gp,
			priority: 1
		}) };
	}
	static importJSON(e) {
		let o = Te({}).updateFromJSON(e);
		return e.version === 1 && typeof e.fields?.doc?.value == "object" && e.fields?.doc?.value?.id && (e.fields.doc.value = e.fields.doc.value.id, e.version = 2), e.version === 2 && !e.id && (e.id = new import_objectid.default.default().toHexString(), e.version = 3), o;
	}
	canBeEmpty() {
		return !1;
	}
	canInsertTextAfter() {
		return !1;
	}
	canInsertTextBefore() {
		return !1;
	}
	createDOM(e) {
		let o = document.createElement("a");
		return this.__fields?.linkType === "custom" && (o.href = this.sanitizeUrl(this.__fields.url ?? "")), (this.__fields?.newTab ?? !1) && (o.target = "_blank"), this.__fields?.newTab === !0 && this.__fields?.linkType === "custom" && (o.rel = pr(o.rel, "add", "noopener")), Zl$1(o, e.theme.link), o;
	}
	exportJSON() {
		let e = this.getFields();
		e?.linkType === "internal" ? delete e.url : e?.linkType === "custom" && delete e.doc;
		let o = {
			...super.exportJSON(),
			type: "link",
			fields: e,
			version: 3
		}, r = this.getID();
		return r && (o.id = r), o;
	}
	extractWithChild(e, o, r) {
		if (!wr(o)) return !1;
		let n = o.anchor.getNode(), l = o.focus.getNode();
		return this.isParentOf(n) && this.isParentOf(l) && o.getTextContent().length > 0;
	}
	getFields() {
		return this.getLatest().__fields;
	}
	getID() {
		return this.getLatest().__id;
	}
	insertNewAfter(e, o = !0) {
		let r = this.getParentOrThrow().insertNewAfter(e, o);
		if (Pi$1(r)) {
			let n = Te({ fields: this.__fields });
			return r.append(n), n;
		}
		return null;
	}
	isInline() {
		return !0;
	}
	sanitizeUrl(e) {
		try {
			let o = new URL(e);
			if (!hp.has(o.protocol)) return "about:blank";
		} catch {
			return "https://";
		}
		return e;
	}
	setFields(e) {
		let o = this.getWritable();
		return o.__fields = e, o;
	}
	setID(e) {
		let o = this.getWritable();
		return o.__id = e, o;
	}
	updateDOM(e, o, r) {
		let n = this.__fields?.url, l = this.__fields?.newTab;
		return n != null && n !== e.__fields?.url && this.__fields?.linkType === "custom" && (o.href = n), this.__fields?.linkType === "internal" && e.__fields?.linkType === "custom" && o.removeAttribute("href"), o.rel ??= "", l !== e.__fields?.newTab && (l ?? !1 ? (o.target = "_blank", this.__fields?.linkType === "custom" && (o.rel = pr(o.rel, "add", "noopener"))) : (o.removeAttribute("target"), o.rel = pr(o.rel, "remove", "noopener"))), !1;
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setFields(e.fields).setID(e.id);
	}
};
function gp(t) {
	let e = null;
	if (Os(t)) {
		let o = t.textContent;
		o !== null && o !== "" && (e = Te({
			id: new import_objectid.default.default().toHexString(),
			fields: {
				doc: null,
				linkType: "custom",
				newTab: t.getAttribute("target") === "_blank",
				url: t.getAttribute("href") ?? ""
			}
		}));
	}
	return { node: e };
}
function Te({ id: t, fields: e }) {
	return Ss$1(new te({
		id: t ?? new import_objectid.default.default().toHexString(),
		fields: e
	}));
}
function J(t) {
	return t instanceof te;
}
var de = ne$4("TOGGLE_LINK_COMMAND");
function gr(t) {
	let e = $r$2();
	if (!wr(e) && (t === null || !t.selectedNodes?.length)) return;
	let o = wr(e) ? e.extract() : t === null ? [] : t.selectedNodes;
	if (t === null) {
		o?.forEach((l) => {
			let s = l.getParent();
			J(s) && (s.getChildren().forEach((d) => {
				s.insertBefore(d);
			}), s.remove());
		});
		return;
	}
	if (o?.length === 1) {
		let l = o[0], s = J(l) ? l : xp(l);
		if (s !== null) {
			s.setFields(t.fields), t.text != null && t.text !== s.getTextContent() && (s.append(pr$2(t.text)), s.getChildren().forEach((i) => {
				i !== s.getLastChild() && i.remove();
			}));
			return;
		}
	}
	let r = null, n = null;
	o?.forEach((l) => {
		let s = l.getParent();
		if (!(s === n || s === null || Pi$1(l) && !l.isInline())) {
			if (J(s)) {
				n = s, s.setFields(t.fields), t.text != null && t.text !== s.getTextContent() && (s.append(pr$2(t.text)), s.getChildren().forEach((i) => {
					i !== s.getLastChild() && i.remove();
				}));
				return;
			}
			if (s.is(r) || (r = s, n = Te({ fields: t.fields }), J(s) ? l.getPreviousSibling() === null ? s.insertBefore(n) : s.insertAfter(n) : l.insertBefore(n)), J(l)) {
				if (l.is(n)) return;
				if (n !== null) {
					let i = l.getChildren();
					n.append(...i);
				}
				l.remove();
				return;
			}
			n !== null && n.append(l);
		}
	});
}
function xp(t) {
	return Cp(t, (e) => J(e));
}
function Cp(t, e) {
	let o = t;
	for (; o !== null && (o = o.getParent(), !(o === null || e(o))););
	return o;
}
function pr(t, e, o) {
	let r, n = `${t}`;
	if (e === "add") {
		if (n.includes(o)) {
			let l = new RegExp(o, "g");
			n = n.replace(l, "").trim();
		}
		n = n.trim(), r = n.length === 0 ? `${o}` : `${n} ${o}`;
	} else {
		let l = new RegExp(o, "g");
		r = n.replace(l, "").trim();
	}
	return r;
}
var kp = (t, e) => {
	let [, o, r] = e, n = Te({ fields: {
		doc: null,
		linkType: "custom",
		newTab: !1,
		url: r
	} }), l = pr$2(o);
	return l.setFormat(t.getFormat()), n.append(l), t.replace(n), l;
}, _p = (t) => ({
	type: "text-match",
	dependencies: [te],
	export: (e, o) => {
		if (!J(e)) return null;
		let r = e, n = r.getFields(), l;
		return n.linkType === "internal" ? t?.internalDocToHref ? l = mr(t.internalDocToHref({ linkNode: r.exportJSON() })) : (console.warn("Lexical → Markdown converter: found internal link but internalDocToHref is not provided — link will have an empty href"), l = "") : l = mr(n.url ?? ""), `[${o(r)}](${l})`;
	},
	importRegExp: /(?<!!)\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)/,
	regExp: /(?<!!)\[([^[]+)\]\(([^()\s]+)(?:\s"((?:[^"]*\\")*[^"]*)"\s*)?\)$/,
	replace: kp,
	trigger: ")"
}), ki = _p();
var we = class extends te {
	static clone(e) {
		return new this({
			id: "",
			fields: e.__fields,
			key: e.__key
		});
	}
	static getType() {
		return "autolink";
	}
	static importDOM() {
		return null;
	}
	static importJSON(e) {
		let o = yt({}).updateFromJSON(e);
		return e.version === 1 && typeof e.fields?.doc?.value == "object" && e.fields?.doc?.value?.id && (e.fields.doc.value = e.fields.doc.value.id, e.version = 2), o;
	}
	exportJSON() {
		let e = super.exportJSON();
		return {
			type: "autolink",
			children: e.children,
			direction: e.direction,
			fields: e.fields,
			format: e.format,
			indent: e.indent,
			version: 2
		};
	}
	insertNewAfter(e, o = !0) {
		let r = this.getParentOrThrow().insertNewAfter(e, o);
		if (Pi$1(r)) {
			let n = yt({ fields: this.__fields });
			return r.append(n), n;
		}
		return null;
	}
	updateFromJSON(e) {
		return super.updateFromJSON(e).setFields(e.fields);
	}
};
function yt({ fields: t }) {
	return Ss$1(new we({
		id: "",
		fields: t
	}));
}
function Se(t) {
	return t instanceof we;
}
function Ti(t, e = (o) => o) {
	return (o) => {
		let r = t.exec(o);
		return r === null ? null : {
			index: r.index,
			length: r[0].length,
			text: r[0],
			url: e(r[0])
		};
	};
}
function Ei(t, e) {
	for (let o of e) {
		let r = o(t);
		if (r != null) return r;
	}
	return null;
}
var Mp = /[.,;\s]/;
function po(t) {
	return t !== void 0 && Mp.test(t);
}
function Ni(t) {
	return po(t[t.length - 1]);
}
function Cr(t) {
	return po(t[0]);
}
function Dp(t, e) {
	return e ? /^\.[a-z]{2,}/i.test(t) : /^\.[a-z0-9]+/i.test(t);
}
function Li(t) {
	let e = t.getPreviousSibling();
	return Pi$1(e) && (e = e.getLastDescendant()), e === null || Zn$1(e) || yr$1(e) && Ni(e.getTextContent());
}
function yi(t) {
	let e = t.getNextSibling();
	return Pi$1(e) && (e = e.getFirstDescendant()), e === null || Zn$1(e) || yr$1(e) && Cr(e.getTextContent());
}
function $p(t, e, o, r) {
	return (t > 0 ? po(o[t - 1]) : Li(r[0])) ? e < o.length ? po(o[e]) : yi(r[r.length - 1]) : !1;
}
function Op(t, e, o) {
	let r = [], n = [], l = [], s = 0, i = 0, d = [...t];
	for (; d.length > 0;) {
		let c = d[0], a = c.getTextContent().length, m = i;
		i + a <= e ? (r.push(c), s += a) : m >= o ? l.push(c) : n.push(c), i += a, d.shift();
	}
	return [
		s,
		r,
		n,
		l
	];
}
function Ap(t, e, o, r) {
	let l = yt({ fields: {
		linkType: "custom",
		url: r.url,
		...r.fields
	} });
	if (t.length === 1) {
		let s = t[0], i;
		if (e === 0 ? [i] = s.splitText(o) : [, i] = s.splitText(e, o), i) {
			let d = pr$2(r.text);
			d.setFormat(i.getFormat()), d.setDetail(i.getDetail()), d.setStyle(i.getStyle()), l.append(d), i.replace(l);
		}
		return s;
	} else if (t.length > 1) {
		let s = t[0], i = s.getTextContent().length, d;
		e === 0 ? d = s : [, d] = s.splitText(e);
		let c = [], u;
		if (t.forEach((a) => {
			let p = a.getTextContent().length, h = i, f = i + p;
			if (h < o) if (f <= o) c.push(a);
			else {
				let [g, k] = a.splitText(o - h);
				g && c.push(g), u = k;
			}
			i += p;
		}), d) {
			let a = $r$2(), m = a ? a.getNodes().find(yr$1) : void 0, p = pr$2(d.getTextContent());
			return p.setFormat(d.getFormat()), p.setDetail(d.getDetail()), p.setStyle(d.getStyle()), l.append(p, ...c), m && m === d && (wr(a) ? p.select(a.anchor.offset, a.focus.offset) : Or$1(a) && p.select(0, p.getTextContent().length)), d.replace(l), u;
		}
	}
}
function Fp(t, e, o) {
	let r = [...t], n = r.map((d) => d.getTextContent()).join(""), l = n, s, i = 0;
	for (; (s = Ei(l, e)) != null && s !== null;) {
		let d = s.index, u = d + s.length;
		if ($p(i + d, i + u, n, r)) {
			let [m, , p, h] = Op(r, i + d, i + u), k = Ap(p, i + d - m, i + u - m, s);
			r = k ? [k, ...h] : h, o(s.url, null), i = 0;
		} else i += u;
		l = l.substring(u);
	}
}
function xr(t, e, o) {
	let r = t.getChildren(), n = r.length;
	for (let d = 0; d < n; d++) {
		let c = r[d];
		if (!yr$1(c) || !c.isSimpleText()) {
			mo(t), o(null, t.getFields()?.url ?? null);
			return;
		}
	}
	let l = t.getTextContent(), s = Ei(l, e);
	if (s === null || s.text !== l) {
		mo(t), o(null, t.getFields()?.url ?? null);
		return;
	}
	if (!Li(t) || !yi(t)) {
		mo(t), o(null, t.getFields()?.url ?? null);
		return;
	}
	let i = t.getFields()?.url;
	if (i !== s?.url) {
		let d = t.getFields();
		d.url = s?.url, t.setFields(d), o(s.url, i ?? null);
	}
}
function Pp(t, e, o) {
	let r = t.getPreviousSibling(), n = t.getNextSibling(), l = t.getTextContent();
	if (Se(r)) {
		let s = r.getFields()?.url ? r.getFields()?.url?.startsWith("mailto:") ?? !1 : !1;
		(!Cr(l) || Dp(l, s)) && (r.append(t), xr(r, e, o), o(null, r.getFields()?.url ?? null));
	}
	Se(n) && !Ni(l) && (mo(n), xr(n, e, o), o(null, n.getFields()?.url ?? null));
}
function mo(t) {
	let e = t.getChildren(), o = e.length;
	for (let r = o - 1; r >= 0; r--) t.insertAfter(e[r]);
	return t.remove(), e.map((r) => r.getLatest());
}
function Bp(t) {
	let e = [t], o = t.getNextSibling();
	for (; o !== null && yr$1(o) && o.isSimpleText() && (e.push(o), !/\s/.test(o.getTextContent()));) o = o.getNextSibling();
	return e;
}
function jp(t, e, o) {
	let r = (0, import_compiler_runtime.c)(5), n, l;
	r[0] !== t || r[1] !== e || r[2] !== o ? (n = () => {
		if (!t.hasNodes([we])) throw new Error("LexicalAutoLinkPlugin: AutoLinkNode not registered on editor");
		let s = (i, d) => {
			o?.(i, d);
		};
		return ec(t.registerNodeTransform(lr$2, (i) => {
			let d = i.getParentOrThrow(), c = i.getPreviousSibling();
			if (Se(d)) xr(d, e, s);
			else if (!J(d)) {
				if (i.isSimpleText() && (Cr(i.getTextContent()) || !Se(c))) Fp(Bp(i), e, s);
				Pp(i, e, s);
			}
		}));
	}, l = [
		t,
		e,
		o
	], r[0] = t, r[1] = e, r[2] = o, r[3] = n, r[4] = l) : (n = r[3], l = r[4]), (0, import_react.useEffect)(n, l);
}
var Wp = [Ti(/((https?:\/\/(www\.)?)|(www\.))[-\w@:%.+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b([-\w()@:%+.~#?&/=]*)(?<![-.+():%])/, (t) => t.startsWith("http") ? t : `https://${t}`), Ti(/(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-\d]+\.)+[a-z]{2,}))/i, (t) => `mailto:${t}`)], Ri = () => {
	let [t] = o$4();
	return jp(t, Wp), null;
};
var Ii = () => (0, import_jsx_runtime.jsx)(t, {});
function fo(t, e, o, r = 10, n = 5) {
	let l = o.parentElement;
	if (t === null || l == null) {
		e.style.opacity = "0", e.style.transform = "translate(-10000px, -10000px)";
		return;
	}
	let s = o.getBoundingClientRect(), i = l.getBoundingClientRect(), d = t.top - r, c = t.left - n;
	e.style.width = "max-content", e.style.maxWidth = "none";
	let u = e.scrollWidth, a = i.right - c, m = c - i.left, p;
	if (u <= a) p = e.getBoundingClientRect();
	else {
		let h = m + t.width, f = m > a, k = Math.min(u, f ? h : a);
		k < u && (e.style.width = `${k}px`, e.style.maxWidth = `${k}px`, e.offsetHeight), f && (c = t.right - k), p = e.getBoundingClientRect();
	}
	d < i.top && (d += p.height + t.height + r * 2), c + p.width > i.right && (c = i.right - p.width - n), d -= s.top, c -= s.left, e.style.opacity = "1", e.style.transform = `translate(${c}px, ${d}px)`;
}
var ho = ne$4("TOGGLE_LINK_WITH_MODAL_COMMAND");
function ji(t) {
	t.preventDefault();
}
function Hi({ anchorElem: t }) {
	let [e] = o$4(), [o, r] = (0, import_react.useState)(), n = (0, import_react.useRef)(null), l = (0, import_react.useRef)(null), [s, i] = (0, import_react.useState)(null), [d, c] = (0, import_react.useState)(null), { fieldProps: { schemaPath: u }, uuid: a } = I$4(), m = a$1(), { config: p, getEntityConfig: h } = se$4(), { i18n: f, t: g } = WP(), [k, N] = (0, import_react.useState)(), R = at$6(), [T, C] = (0, import_react.useState)(!1), [x, b] = (0, import_react.useState)([]), _ = xe$2(), [D, I] = (0, import_react.useState)(!1), y = tu$1({
		slug: "lexical-rich-text-link-" + a,
		depth: R
	}), { toggleDrawer: S } = F$7(y), w = (0, import_react.useCallback)(() => {
		C(!1), n && n.current && (n.current.style.opacity = "0", n.current.style.transform = "translate(-10000px, -10000px)"), I(!1), i(null), c(null), b([]), N(void 0);
	}, [
		C,
		i,
		c,
		b
	]), L = (0, import_react.useCallback)(() => {
		let E = $r$2(), v;
		if (!wr(E) || !E) {
			w();
			return;
		}
		let $ = et(E);
		v = e.getElementByKey($.getKey())?.getBoundingClientRect();
		let O = qs($, J), F = E.getNodes().filter((re) => !Zn$1(re)).find((re) => {
			let ge = qs(re, J);
			return O && !O.is(ge) || ge && !ge.is(O);
		});
		if (O == null || F) {
			w();
			return;
		}
		r(O);
		let P = O.getFields(), Z = {
			...P,
			id: O.getID(),
			text: O.getTextContent()
		};
		if (P?.linkType === "custom") i(P?.url ?? null), c(null);
		else {
			i(`${p.routes.admin === "/" ? "" : p.routes.admin}/collections/${P?.doc?.relationTo}/${P?.doc?.value}`);
			let re = P?.doc?.relationTo ? h({ collectionSlug: P?.doc?.relationTo }) : void 0;
			if (!re) c(P?.label ? String(P?.label) : null), i(P?.url ? String(P?.url) : null);
			else {
				let ge = typeof P.doc?.value == "object" ? P.doc.value.id : P.doc?.value, Vt = P.doc?.relationTo;
				if (!ge || !Vt) throw new Error("Focus link parent is missing doc.value or doc.relationTo");
				c(g("fields:linkedTo", { label: `${getTranslation(re.labels.singular, f)} - ${g("lexical:link:loadingWithEllipsis", f)}` }).replace(/<[^>]*>?/g, "")), ce$5.get(formatAdminURL({
					apiRoute: p.routes.api,
					path: `/${Vt}/${ge}`,
					serverURL: p.serverURL
				}), {
					headers: { "Accept-Language": f.language },
					params: {
						depth: 0,
						locale: _?.code
					}
				}).then(async (se) => {
					if (!se.ok) throw new Error(`HTTP error! Status: ${se.status}`);
					let Ie = (await se.json())[re?.admin?.useAsTitle || "id"];
					c(g("fields:linkedTo", { label: `${getTranslation(re.labels.singular, f)} - ${Ie}` }).replace(/<[^>]*>?/g, ""));
				}).catch(() => {
					c(g("fields:linkedTo", { label: `${getTranslation(re.labels.singular, f)} - ${g("general:untitled", f)} - ID: ${ge}` }).replace(/<[^>]*>?/g, ""));
				});
			}
		}
		N(Z), C(!0), b(E ? E?.getNodes() : []), Se(O) ? I(!0) : I(!1);
		let K = n.current, Ve = bs$1(e._window), { activeElement: Re } = document;
		if (K === null) return;
		let he = e.getRootElement();
		return Ve !== null && he !== null && he.contains(Ve.anchorNode) ? (v || (v = Ve.getRangeAt(0).getBoundingClientRect()), v != null && (v.y += 40, l.current = v)) : (Re == null || Re.className !== "link-input") && (he !== null && fo(null, K, t), i(null), c(null)), !0;
	}, [
		e,
		w,
		p.routes.admin,
		p.routes.api,
		p.serverURL,
		h,
		g,
		f,
		_?.code,
		t
	]);
	return (0, import_react.useEffect)(() => ec(e.registerCommand(ho, (E) => (e.dispatchCommand(de, E), L(), S(), !0), 1)), [
		e,
		L,
		S,
		y
	]), (0, import_react.useEffect)(() => {
		let E = t.parentElement, v = () => {
			e.getEditorState().read(() => {
				L();
			});
		};
		return window.addEventListener("resize", v), E?.addEventListener("scroll", v), () => {
			window.removeEventListener("resize", v), E?.removeEventListener("scroll", v);
		};
	}, [
		t.parentElement,
		e,
		L
	]), (0, import_react.useEffect)(() => ec(e.registerUpdateListener(({ editorState: E }) => {
		E.read(() => {
			L();
		});
	}), e.registerCommand(re$2, () => (L(), !0), 1), e.registerCommand(Ae$3, () => T ? (w(), !0) : !1, 3)), [
		e,
		L,
		T,
		w
	]), (0, import_react.useEffect)(() => {
		e.getEditorState().read(() => {
			L();
		});
	}, [e, L]), (0, import_react.useLayoutEffect)(() => {
		!T || !n.current || !t || !l.current || fo(l.current, n.current, t);
	}, [
		s,
		d,
		T,
		t,
		o
	]), (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)("div", {
		className: "link-editor",
		ref: n,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "link-input",
			children: [s && s.length > 0 ? (0, import_jsx_runtime.jsxs)("a", {
				href: s,
				rel: "noopener noreferrer",
				target: "_blank",
				children: [o?.__fields.newTab ? (0, import_jsx_runtime.jsx)(dm, {}) : null, d != null && d.length > 0 ? d : s]
			}) : d != null && d.length > 0 ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [o?.__fields.newTab ? (0, import_jsx_runtime.jsx)(dm, {}) : null, (0, import_jsx_runtime.jsx)("span", {
				className: "link-input__label-pure",
				children: d
			})] }) : null, m && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Edit link",
				className: "link-edit",
				onClick: (E) => {
					E.preventDefault(), S();
				},
				onMouseDown: ji,
				tabIndex: 0,
				type: "button",
				children: (0, import_jsx_runtime.jsx)(yr$2, {})
			}), !D && (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Remove link",
				className: "link-trash",
				onClick: () => {
					e.dispatchCommand(de, null);
				},
				onMouseDown: ji,
				tabIndex: 0,
				type: "button",
				children: (0, import_jsx_runtime.jsx)(iC$1, {})
			})] })]
		})
	}), (0, import_jsx_runtime.jsx)(de$3, {
		className: "lexical-link-edit-drawer",
		data: k,
		drawerSlug: y,
		drawerTitle: g("fields:editLink"),
		featureKey: "link",
		handleDrawerSubmit: (E, v) => {
			let $ = v, O = { ...$ };
			delete O.text, e.update(() => {
				let F = $r$2(), P = null;
				if (wr(F) ? P = et(F).getParent() : x.length && (P = x[0]?.getParent() ?? null), P && Se(P)) {
					let Z = Te({ fields: O });
					P.replace(Z, !0);
				}
			}), e.dispatchCommand(de, {
				fields: O,
				selectedNodes: x,
				text: $.text
			});
		},
		schemaPath: u,
		schemaPathSuffix: "fields"
	})] });
}
var Ui = (t) => {
	let { anchorElem: e = document.body } = t;
	return (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsx)(Hi, { anchorElem: e }), e);
};
var Gi = (t) => {
	let e = (0, import_compiler_runtime.c)(5), { clientProps: o } = t, [r] = o$4(), n, l;
	return e[0] !== o.defaultLinkType || e[1] !== o.defaultLinkURL || e[2] !== r ? (n = () => {
		if (!r.hasNodes([te])) throw new Error("LinkPlugin: LinkNode not registered on editor");
		return ec(r.registerCommand(de, (s) => s === null ? (gr(null), !0) : (s.fields?.linkType || (s.fields.linkType = o.defaultLinkType), s.fields?.url || (s.fields.url = o.defaultLinkURL), gr(s), !0), 1), r.registerCommand(ge$2, (s) => {
			let i = $r$2();
			if (!wr(i) || i.isCollapsed() || !(s instanceof ClipboardEvent) || s.clipboardData == null) return !1;
			let d = s.clipboardData.getData("text");
			if (!xi(d)) return !1;
			if (!i.getNodes().some(Tf)) {
				let c = {
					doc: null,
					linkType: "custom",
					newTab: !1,
					url: d
				};
				return r.dispatchCommand(de, {
					fields: c,
					text: null
				}), s.preventDefault(), !0;
			}
			return !1;
		}, 1));
	}, l = [
		o.defaultLinkType,
		o.defaultLinkURL,
		r
	], e[0] = o.defaultLinkType, e[1] = o.defaultLinkURL, e[2] = r, e[3] = n, e[4] = l) : (n = e[3], l = e[4]), (0, import_react.useEffect)(n, l), null;
};
function Tf(t) {
	return Pi$1(t);
}
var Ji = [dr([{
	ChildComponent: hi,
	isActive: ({ selection: t }) => {
		if (wr(t)) return qs(et(t), J) != null;
		return !1;
	},
	isEnabled: ({ selection: t }) => !!(wr(t) && $r$2()?.getTextContent()?.length),
	key: "link",
	label: ({ i18n: t }) => t.t("lexical:link:label"),
	onSelect: ({ editor: t, isActive: e }) => {
		if (e) t.dispatchCommand(de, null);
		else {
			let o, r = [];
			if (t.getEditorState().read(() => {
				o = $r$2()?.getTextContent(), r = $r$2()?.getNodes() ?? [];
			}), !o?.length) return;
			t.dispatchCommand(ho, {
				fields: { doc: null },
				selectedNodes: r,
				text: o
			});
		}
	},
	order: 1
}])], Sf = M(({ props: t }) => ({
	markdownTransformers: [ki],
	nodes: [te, t?.disableAutoLinks === !0 ? null : we].filter(Boolean),
	plugins: [
		{
			Component: Gi,
			position: "normal"
		},
		t?.disableAutoLinks === !0 || t?.disableAutoLinks === "creationOnly" ? null : {
			Component: Ri,
			position: "normal"
		},
		{
			Component: Ii,
			position: "normal"
		},
		{
			Component: Ui,
			position: "floatingAnchorElem"
		}
	].filter(Boolean),
	sanitizedClientFeatureProps: t,
	toolbarFixed: { groups: Ji },
	toolbarInline: { groups: Ji }
}));
var tt = () => (0, import_jsx_runtime.jsx)(l$1, {});
function xo(t, e) {
	return t === "ordered" ? !e.has("unorderedList") : t === "checklist" ? !e.has("unorderedList") && !e.has("orderedList") : !1;
}
function ot(t) {
	return {
		items: t,
		key: "lists",
		label: ({ i18n: e }) => e.t("lexical:general:slashMenuListGroupLabel")
	};
}
var Xi = 4, rt = (t) => (e, o, r) => {
	let n = e.getPreviousSibling(), l = e.getNextSibling(), s = ce$2(t === "check" ? r[3] === "x" : void 0);
	if (me$1(l) && l.getListType() === t) {
		let d = l.getFirstChild();
		d !== null ? d.insertBefore(s) : l.append(s), e.remove();
	} else if (me$1(n) && n.getListType() === t) n.append(s), e.remove();
	else {
		let d = pe$2(t, t === "number" ? Number(r[2]) : void 0);
		d.append(s), e.replace(d);
	}
	s.append(...o), s.select(0, 0);
	let i = Math.floor(r[1].length / Xi);
	i && s.setIndent(i);
}, He = (t, e, o) => {
	let r = [], n = t.getChildren(), l = 0;
	for (let s of n) if (ae$1(s)) {
		if (s.getChildrenSize() === 1) {
			let u = s.getFirstChild();
			if (me$1(u)) {
				r.push(He(u, e, o + 1));
				continue;
			}
		}
		let i = " ".repeat(o * Xi), d = t.getListType(), c = d === "number" ? `${t.getStart() + l}. ` : d === "check" ? `- [${s.getChecked() ? "x" : " "}] ` : "- ";
		r.push(i + c + e(s)), l++;
	}
	return r.join(`
`);
};
var Sr = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("path", {
			d: "M5.89284 12.479C5.89284 13.368 5.26284 13.788 4.38084 14.236C3.75084 14.558 3.43584 14.789 3.40784 15.062H5.89984V16H2.06384V15.573C2.06384 14.523 2.92484 13.935 3.66684 13.501C4.38084 13.088 4.75184 12.878 4.75184 12.458C4.75184 12.08 4.52084 11.835 4.06584 11.835C3.58984 11.835 3.30984 12.199 3.28184 12.654H2.11284C2.18984 11.681 2.87584 10.918 4.07284 10.918C5.15784 10.918 5.89284 11.555 5.89284 12.479Z",
			fill: "currentColor"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M2.68608 4.535V3.737C3.54008 3.737 3.90408 3.513 4.02308 2.995H4.89108V8H3.68008L3.68008 4.535H2.68608Z",
			fill: "currentColor"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M8 15L17 15",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M8 10L17 10",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M8 5L17 5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var Qi = {
	type: "element",
	dependencies: [ue$1, se$1],
	export: (t, e) => me$1(t) ? He(t, e, 0) : null,
	regExp: /^(\s*)(\d+)\.\s/,
	replace: rt("number")
};
var es = [ee([{
	ChildComponent: Sr,
	isActive: ({ selection: t }) => {
		if (!wr(t)) return !1;
		for (let e of t.getNodes()) {
			if (me$1(e) && e.getListType() === "number") continue;
			let o = e.getParent();
			if (me$1(o) && o.getListType() === "number") continue;
			let r = o?.getParent();
			if (!(me$1(r) && r.getListType() === "number")) return !1;
		}
		return !0;
	},
	key: "orderedList",
	label: ({ i18n: t }) => t.t("lexical:orderedList:label"),
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(ke$3, void 0);
	},
	order: 10
}])], Kf = M(({ featureProviderMap: t }) => {
	let e = xo("ordered", t);
	return {
		markdownTransformers: [Qi],
		nodes: e ? [ue$1, se$1] : [],
		plugins: e ? [{
			Component: tt,
			position: "normal"
		}] : [],
		slashMenu: { groups: [ot([{
			Icon: Sr,
			key: "orderedList",
			keywords: ["ordered list", "ol"],
			label: ({ i18n: o }) => o.t("lexical:orderedList:label"),
			onSelect: ({ editor: o }) => {
				o.dispatchCommand(ke$3, void 0);
			}
		}])] },
		toolbarFixed: { groups: es },
		toolbarInline: { groups: es }
	};
});
var Nr = () => (0, import_jsx_runtime.jsxs)("svg", {
	"aria-hidden": "true",
	className: "icon",
	fill: "none",
	focusable: "false",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [
		(0, import_jsx_runtime.jsx)("circle", {
			cx: "4",
			cy: "5",
			fill: "currentColor",
			r: "1.15",
			stroke: "currentColor",
			strokeWidth: "0.3"
		}),
		(0, import_jsx_runtime.jsx)("circle", {
			cx: "4",
			cy: "10",
			fill: "currentColor",
			r: "1.15",
			stroke: "currentColor",
			strokeWidth: "0.3"
		}),
		(0, import_jsx_runtime.jsx)("circle", {
			cx: "4",
			cy: "15",
			fill: "currentColor",
			r: "1.15",
			stroke: "currentColor",
			strokeWidth: "0.3"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M17 5H7",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M17 10H7",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}),
		(0, import_jsx_runtime.jsx)("path", {
			d: "M17 15H7",
			stroke: "currentColor",
			strokeWidth: "1.5"
		})
	]
});
var os = {
	type: "element",
	dependencies: [ue$1, se$1],
	export: (t, e) => me$1(t) ? He(t, e, 0) : null,
	regExp: /^(\s*)[-*+]\s/,
	replace: rt("bullet")
};
var rs = [ee([{
	ChildComponent: Nr,
	isActive: ({ selection: t }) => {
		if (!wr(t)) return !1;
		for (let e of t.getNodes()) {
			if (me$1(e) && e.getListType() === "bullet") continue;
			let o = e.getParent();
			if (me$1(o) && o.getListType() === "bullet") continue;
			let r = o?.getParent();
			if (!(me$1(r) && r.getListType() === "bullet")) return !1;
		}
		return !0;
	},
	key: "unorderedList",
	label: ({ i18n: t }) => t.t("lexical:unorderedList:label"),
	onSelect: ({ editor: t }) => {
		t.dispatchCommand(xe, void 0);
	},
	order: 11
}])], t0 = M({
	markdownTransformers: [os],
	nodes: [ue$1, se$1],
	plugins: [{
		Component: tt,
		position: "normal"
	}],
	slashMenu: { groups: [ot([{
		Icon: Nr,
		key: "unorderedList",
		keywords: ["unordered list", "ul"],
		label: ({ i18n: t }) => t.t("lexical:unorderedList:label"),
		onSelect: ({ editor: t }) => {
			t.dispatchCommand(xe, void 0);
		}
	}])] },
	toolbarFixed: { groups: rs },
	toolbarInline: { groups: rs }
});
var i0 = import_react.lazy(() => import("./Component-MBLHTKDK-CwgpoeN1.js").then((t) => ({ default: t.UnknownConvertedNodeComponent }))), Mt = class extends Fi$1 {
	__data;
	constructor({ data: e, key: o }) {
		super(o), this.__data = e;
	}
	static clone(e) {
		return new this({
			data: e.__data,
			key: e.__key
		});
	}
	static getType() {
		return "unknownConverted";
	}
	static importJSON(e) {
		return s0({ data: e.data });
	}
	canInsertTextAfter() {
		return !0;
	}
	canInsertTextBefore() {
		return !0;
	}
	createDOM(e) {
		let o = document.createElement("span");
		return Zl$1(o, "unknownConverted"), o;
	}
	decorate() {
		return (0, import_jsx_runtime.jsx)(i0, { data: this.__data });
	}
	exportJSON() {
		return {
			type: this.getType(),
			data: this.__data,
			version: 1
		};
	}
	isInline() {
		return !0;
	}
	updateDOM(e, o) {
		return !1;
	}
};
function s0({ data: t }) {
	return Ss$1(new Mt({ data: t }));
}
var p0 = import_react.lazy(() => import("./Component-DOSSWC76-CP0Ab7lq.js").then((t) => ({ default: t.UnknownConvertedNodeComponent }))), Dt = class extends Fi$1 {
	__data;
	constructor({ data: e, key: o }) {
		super(o), this.__data = e;
	}
	static clone(e) {
		return new this({
			data: e.__data,
			key: e.__key
		});
	}
	static getType() {
		return "unknownConverted";
	}
	static importJSON(e) {
		return f0({ data: e.data });
	}
	canInsertTextAfter() {
		return !0;
	}
	canInsertTextBefore() {
		return !0;
	}
	createDOM(e) {
		let o = document.createElement("span");
		return Zl$1(o, "unknownConverted"), o;
	}
	decorate() {
		return (0, import_jsx_runtime.jsx)(p0, { data: this.__data });
	}
	exportJSON() {
		return {
			type: this.getType(),
			data: this.__data,
			version: 1
		};
	}
	isInline() {
		return !0;
	}
	updateDOM(e, o) {
		return !1;
	}
};
function f0({ data: t }) {
	return Ss$1(new Dt({ data: t }));
}
var as = [ee([{
	ChildComponent: _t,
	isActive: ({ selection: t }) => {
		if (!wr(t)) return !1;
		for (let e of t.getNodes()) if (!Yi$1(e) && !Yi$1(e.getParent())) return !1;
		return !0;
	},
	key: "paragraph",
	label: ({ i18n: t }) => t.t("lexical:paragraph:label2"),
	onSelect: ({ editor: t }) => {
		t.update(() => {
			W$1($r$2(), () => Vi());
		});
	},
	order: 1
}])], x0 = M({
	slashMenu: { groups: [X([{
		Icon: _t,
		key: "paragraph",
		keywords: [
			"normal",
			"paragraph",
			"p",
			"text"
		],
		label: ({ i18n: t }) => t.t("lexical:paragraph:label"),
		onSelect: ({ editor: t }) => {
			t.update(() => {
				W$1($r$2(), () => Vi());
			});
		}
	}])] },
	toolbarFixed: { groups: as },
	toolbarInline: { groups: as }
});
var ms = { quote: ({ node: t, nodesToJSX: e }) => {
	return (0, import_jsx_runtime.jsx)("blockquote", { children: e({ nodes: t.children }) });
} };
var ps = { heading: ({ node: t, nodesToJSX: e }) => {
	let o = e({ nodes: t.children }), r = t.tag;
	return (0, import_jsx_runtime.jsx)(r, { children: o });
} };
var fs = { horizontalrule: (0, import_jsx_runtime.jsx)("hr", {}) };
var hs = { linebreak: (0, import_jsx_runtime.jsx)("br", {}) };
var xs = ({ internalDocToHref: t }) => ({
	autolink: ({ node: e, nodesToJSX: o }) => {
		let r = o({ nodes: e.children }), n = e.fields.newTab ? "noopener noreferrer" : void 0, l = e.fields.newTab ? "_blank" : void 0;
		return (0, import_jsx_runtime.jsx)("a", {
			href: e.fields.url,
			rel: n,
			target: l,
			children: r
		});
	},
	link: ({ node: e, nodesToJSX: o }) => {
		let r = o({ nodes: e.children }), n = e.fields.newTab ? "noopener noreferrer" : void 0, l = e.fields.newTab ? "_blank" : void 0, s = e.fields.url ?? "";
		return e.fields.linkType === "internal" && (t ? s = t({ linkNode: e }) : (console.error("Lexical => JSX converter: Link converter: found internal link, but internalDocToHref is not provided"), s = "#")), (0, import_jsx_runtime.jsx)("a", {
			href: s,
			rel: n,
			target: l,
			children: r
		});
	}
});
var Cs = {
	list: ({ node: t, nodesToJSX: e }) => {
		let o = e({ nodes: t.children }), r = t.tag;
		return (0, import_jsx_runtime.jsx)(r, {
			className: `list-${t?.listType}`,
			children: o
		});
	},
	listitem: ({ node: t, nodesToJSX: e, parent: o }) => {
		let r = t.children.some((l) => l.type === "list"), n = e({ nodes: t.children });
		if ("listType" in o && o?.listType === "check") {
			let l = v4();
			return (0, import_jsx_runtime.jsx)("li", {
				"aria-checked": t.checked ? "true" : "false",
				className: `list-item-checkbox${t.checked ? " list-item-checkbox-checked" : " list-item-checkbox-unchecked"}${r ? " nestedListItem" : ""}`,
				role: "checkbox",
				style: { listStyleType: "none" },
				tabIndex: -1,
				value: t?.value,
				children: r ? n : (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					(0, import_jsx_runtime.jsx)("input", {
						checked: t.checked,
						id: l,
						readOnly: !0,
						type: "checkbox"
					}),
					(0, import_jsx_runtime.jsx)("label", {
						htmlFor: l,
						children: n
					}),
					(0, import_jsx_runtime.jsx)("br", {})
				] })
			});
		} else return (0, import_jsx_runtime.jsx)("li", {
			className: `${r ? "nestedListItem" : ""}`,
			style: r ? { listStyleType: "none" } : void 0,
			value: t?.value,
			children: n
		});
	}
};
var bs = { paragraph: ({ node: t, nodesToJSX: e }) => {
	let o = e({ nodes: t.children });
	return o?.length ? (0, import_jsx_runtime.jsx)("p", { children: o }) : (0, import_jsx_runtime.jsx)("p", { children: (0, import_jsx_runtime.jsx)("br", {}) });
} };
var ks = { tab: "	" };
var _s = {
	table: ({ node: t, nodesToJSX: e }) => {
		return (0, import_jsx_runtime.jsx)("div", {
			className: "lexical-table-container",
			children: (0, import_jsx_runtime.jsx)("table", {
				className: "lexical-table",
				style: { borderCollapse: "collapse" },
				children: (0, import_jsx_runtime.jsx)("tbody", { children: e({ nodes: t.children }) })
			})
		});
	},
	tablecell: ({ node: t, nodesToJSX: e }) => {
		let o = e({ nodes: t.children }), r = t.headerState > 0 ? "th" : "td", n = `lexical-table-cell-header-${t.headerState}`, l = {
			backgroundColor: t.backgroundColor || void 0,
			border: "1px solid #ccc",
			padding: "8px"
		}, s = t.colSpan && t.colSpan > 1 ? t.colSpan : void 0, i = t.rowSpan && t.rowSpan > 1 ? t.rowSpan : void 0;
		return (0, import_jsx_runtime.jsx)(r, {
			className: `lexical-table-cell ${n}`,
			colSpan: s,
			rowSpan: i,
			style: l,
			children: o
		});
	},
	tablerow: ({ node: t, nodesToJSX: e }) => {
		return (0, import_jsx_runtime.jsx)("tr", {
			className: "lexical-table-row",
			children: e({ nodes: t.children })
		});
	}
}, A = {
	DOM_ELEMENT_TYPE: 1,
	DOM_TEXT_TYPE: 3,
	NO_DIRTY_NODES: 0,
	HAS_DIRTY_NODES: 1,
	FULL_RECONCILE: 2,
	IS_NORMAL: 0,
	IS_TOKEN: 1,
	IS_SEGMENTED: 2,
	IS_INERT: 3,
	IS_BOLD: 1,
	IS_ITALIC: 2,
	IS_STRIKETHROUGH: 4,
	IS_UNDERLINE: 8,
	IS_CODE: 16,
	IS_SUBSCRIPT: 32,
	IS_SUPERSCRIPT: 64,
	IS_HIGHLIGHT: 128,
	IS_DIRECTIONLESS: 1,
	IS_UNMERGEABLE: 2,
	IS_ALIGN_LEFT: 1,
	IS_ALIGN_CENTER: 2,
	IS_ALIGN_RIGHT: 3,
	IS_ALIGN_JUSTIFY: 4,
	IS_ALIGN_START: 5,
	IS_ALIGN_END: 6
};
A.IS_BOLD | A.IS_ITALIC | A.IS_STRIKETHROUGH | A.IS_UNDERLINE | A.IS_CODE | A.IS_SUBSCRIPT | A.IS_SUPERSCRIPT | A.IS_HIGHLIGHT;
var Ts = "֑-߿יִ-﷽ﹰ-ﻼ", ws = "A-Za-zÀ-ÖØ-öø-ʸ̀-֐ࠀ-῿‎Ⰰ-﬜︀-﹯﻽-￿";
new RegExp("^[^" + ws + "]*[" + Ts + "]");
new RegExp("^[^" + Ts + "]*[" + ws + "]");
A.IS_BOLD, A.IS_CODE, A.IS_HIGHLIGHT, A.IS_ITALIC, A.IS_STRIKETHROUGH, A.IS_SUBSCRIPT, A.IS_SUPERSCRIPT, A.IS_UNDERLINE;
A.IS_DIRECTIONLESS, A.IS_UNMERGEABLE;
A.IS_ALIGN_CENTER, A.IS_ALIGN_END, A.IS_ALIGN_JUSTIFY, A.IS_ALIGN_LEFT, A.IS_ALIGN_RIGHT, A.IS_ALIGN_START;
A.IS_ALIGN_CENTER, A.IS_ALIGN_END, A.IS_ALIGN_JUSTIFY, A.IS_ALIGN_LEFT, A.IS_ALIGN_RIGHT, A.IS_ALIGN_START;
A.IS_NORMAL, A.IS_SEGMENTED, A.IS_TOKEN;
A.IS_NORMAL, A.IS_SEGMENTED, A.IS_TOKEN;
var Ss = { text: ({ node: t }) => {
	let e = t.text;
	return t.format & A.IS_BOLD && (e = (0, import_jsx_runtime.jsx)("strong", { children: e })), t.format & A.IS_ITALIC && (e = (0, import_jsx_runtime.jsx)("em", { children: e })), t.format & A.IS_STRIKETHROUGH && (e = (0, import_jsx_runtime.jsx)("span", {
		style: { textDecoration: "line-through" },
		children: e
	})), t.format & A.IS_UNDERLINE && (e = (0, import_jsx_runtime.jsx)("span", {
		style: { textDecoration: "underline" },
		children: e
	})), t.format & A.IS_CODE && (e = (0, import_jsx_runtime.jsx)("code", { children: e })), t.format & A.IS_SUBSCRIPT && (e = (0, import_jsx_runtime.jsx)("sub", { children: e })), t.format & A.IS_SUPERSCRIPT && (e = (0, import_jsx_runtime.jsx)("sup", { children: e })), e;
} };
var Es = { upload: ({ node: t }) => {
	let e = t;
	if (typeof e.value != "object") return null;
	let o = e.value, r = e.fields?.alt || o?.alt || "", n = o.url;
	if (!o.mimeType.startsWith("image")) return (0, import_jsx_runtime.jsx)("a", {
		href: n,
		rel: "noopener noreferrer",
		children: o.filename
	});
	if (!o.sizes || !Object.keys(o.sizes).length) return (0, import_jsx_runtime.jsx)("img", {
		alt: r,
		height: o.height,
		src: n,
		width: o.width
	});
	let l = [];
	for (let s in o.sizes) {
		let i = o.sizes[s];
		if (!i || !i.width || !i.height || !i.mimeType || !i.filesize || !i.filename || !i.url) continue;
		let d = i?.url;
		l.push((0, import_jsx_runtime.jsx)("source", {
			media: `(max-width: ${i.width}px)`,
			srcSet: d,
			type: i.mimeType
		}, s));
	}
	return l.push((0, import_jsx_runtime.jsx)("img", {
		alt: r,
		height: o?.height,
		src: n,
		width: o?.width
	}, "image")), (0, import_jsx_runtime.jsx)("picture", { children: l });
} };
({
	...bs,
	...Ss,
	...hs,
	...ms,
	..._s,
	...ps,
	...fs,
	...Cs,
	...xs({}),
	...Es,
	...ks
});
function Rs({ converters: t, disableIndent: e, disableTextAlign: o, nodes: r, parent: n }) {
	let l = t.unknown;
	return r.map((i, d) => {
		let c;
		i.type === "block" ? (c = t?.blocks?.[i?.fields?.blockType], !c && !l && console.error(`Lexical => JSX converter: Blocks converter: found ${i?.fields?.blockType} block, but no converter is provided`)) : i.type === "inlineBlock" ? (c = t?.inlineBlocks?.[i?.fields?.blockType], !c && !l && console.error(`Lexical => JSX converter: Inline Blocks converter: found ${i?.fields?.blockType} inline block, but no converter is provided`)) : c = t[i.type];
		try {
			!c && l && (c = l);
			let u;
			c ? u = typeof c == "function" ? c({
				childIndex: d,
				converters: t,
				node: i,
				nodesToJSX: (p) => Rs({
					converters: p.converters ?? t,
					disableIndent: p.disableIndent ?? e,
					disableTextAlign: p.disableTextAlign ?? o,
					nodes: p.nodes,
					parent: p.parent ?? {
						...i,
						parent: n
					}
				}),
				parent: n
			}) : c : u = (0, import_jsx_runtime.jsx)("span", { children: "unknown node" }, d);
			let a = {};
			if (!o && (!Array.isArray(o) || !o?.includes(i.type)) && "format" in i && i.format) switch (i.format) {
				case "center":
					a.textAlign = "center";
					break;
				case "end":
					a.textAlign = "right";
					break;
				case "justify":
					a.textAlign = "justify";
					break;
				case "left": break;
				case "right":
					a.textAlign = "right";
					break;
				case "start":
					a.textAlign = "left";
					break;
			}
			if (!e && (!Array.isArray(e) || !e?.includes(i.type)) && "indent" in i && i.indent && i.type !== "listitem" && (a.paddingInlineStart = `${Number(i.indent) * 40}px`), import_react.isValidElement(u)) {
				if (a.textAlign || a.paddingInlineStart) {
					let m = {
						...a,
						...u?.props?.style ?? {}
					};
					return import_react.cloneElement(u, {
						key: d,
						style: m
					});
				}
				return import_react.cloneElement(u, { key: d });
			}
			return u;
		} catch (u) {
			return console.error("Error converting lexical node to JSX:", u, "node:", i), null;
		}
	}).filter(Boolean);
}
var j = {
	amber: {
		50: "oklch(0.987 0.022 95.277)",
		100: "oklch(0.962 0.059 95.617)",
		200: "oklch(0.924 0.12 95.746)",
		300: "oklch(0.879 0.169 91.605)",
		400: "oklch(0.828 0.189 84.429)",
		500: "oklch(0.769 0.188 70.08)",
		600: "oklch(0.666 0.179 58.318)",
		700: "oklch(0.555 0.163 48.998)",
		800: "oklch(0.473 0.137 46.201)",
		900: "oklch(0.414 0.112 45.904)",
		950: "oklch(0.279 0.077 45.635)"
	},
	black: "#000",
	blue: {
		50: "oklch(0.97 0.014 254.604)",
		100: "oklch(0.932 0.032 255.585)",
		200: "oklch(0.882 0.059 254.128)",
		300: "oklch(0.809 0.105 251.813)",
		400: "oklch(0.707 0.165 254.624)",
		500: "oklch(0.623 0.214 259.815)",
		600: "oklch(0.546 0.245 262.881)",
		700: "oklch(0.488 0.243 264.376)",
		800: "oklch(0.424 0.199 265.638)",
		900: "oklch(0.379 0.146 265.522)",
		950: "oklch(0.282 0.091 267.935)"
	},
	current: "currentColor",
	cyan: {
		50: "oklch(0.984 0.019 200.873)",
		100: "oklch(0.956 0.045 203.388)",
		200: "oklch(0.917 0.08 205.041)",
		300: "oklch(0.865 0.127 207.078)",
		400: "oklch(0.789 0.154 211.53)",
		500: "oklch(0.715 0.143 215.221)",
		600: "oklch(0.609 0.126 221.723)",
		700: "oklch(0.52 0.105 223.128)",
		800: "oklch(0.45 0.085 224.283)",
		900: "oklch(0.398 0.07 227.392)",
		950: "oklch(0.302 0.056 229.695)"
	},
	emerald: {
		50: "oklch(0.979 0.021 166.113)",
		100: "oklch(0.95 0.052 163.051)",
		200: "oklch(0.905 0.093 164.15)",
		300: "oklch(0.845 0.143 164.978)",
		400: "oklch(0.765 0.177 163.223)",
		500: "oklch(0.696 0.17 162.48)",
		600: "oklch(0.596 0.145 163.225)",
		700: "oklch(0.508 0.118 165.612)",
		800: "oklch(0.432 0.095 166.913)",
		900: "oklch(0.378 0.077 168.94)",
		950: "oklch(0.262 0.051 172.552)"
	},
	fuchsia: {
		50: "oklch(0.977 0.017 320.058)",
		100: "oklch(0.952 0.037 318.852)",
		200: "oklch(0.903 0.076 319.62)",
		300: "oklch(0.833 0.145 321.434)",
		400: "oklch(0.74 0.238 322.16)",
		500: "oklch(0.667 0.295 322.15)",
		600: "oklch(0.591 0.293 322.896)",
		700: "oklch(0.518 0.253 323.949)",
		800: "oklch(0.452 0.211 324.591)",
		900: "oklch(0.401 0.17 325.612)",
		950: "oklch(0.293 0.136 325.661)"
	},
	gray: {
		50: "oklch(0.985 0.002 247.839)",
		100: "oklch(0.967 0.003 264.542)",
		200: "oklch(0.928 0.006 264.531)",
		300: "oklch(0.872 0.01 258.338)",
		400: "oklch(0.707 0.022 261.325)",
		500: "oklch(0.551 0.027 264.364)",
		600: "oklch(0.446 0.03 256.802)",
		700: "oklch(0.373 0.034 259.733)",
		800: "oklch(0.278 0.033 256.848)",
		900: "oklch(0.21 0.034 264.665)",
		950: "oklch(0.13 0.028 261.692)"
	},
	green: {
		50: "oklch(0.982 0.018 155.826)",
		100: "oklch(0.962 0.044 156.743)",
		200: "oklch(0.925 0.084 155.995)",
		300: "oklch(0.871 0.15 154.449)",
		400: "oklch(0.792 0.209 151.711)",
		500: "oklch(0.723 0.219 149.579)",
		600: "oklch(0.627 0.194 149.214)",
		700: "oklch(0.527 0.154 150.069)",
		800: "oklch(0.448 0.119 151.328)",
		900: "oklch(0.393 0.095 152.535)",
		950: "oklch(0.266 0.065 152.934)"
	},
	indigo: {
		50: "oklch(0.962 0.018 272.314)",
		100: "oklch(0.93 0.034 272.788)",
		200: "oklch(0.87 0.065 274.039)",
		300: "oklch(0.785 0.115 274.713)",
		400: "oklch(0.673 0.182 276.935)",
		500: "oklch(0.585 0.233 277.117)",
		600: "oklch(0.511 0.262 276.966)",
		700: "oklch(0.457 0.24 277.023)",
		800: "oklch(0.398 0.195 277.366)",
		900: "oklch(0.359 0.144 278.697)",
		950: "oklch(0.257 0.09 281.288)"
	},
	inherit: "inherit",
	lime: {
		50: "oklch(0.986 0.031 120.757)",
		100: "oklch(0.967 0.067 122.328)",
		200: "oklch(0.938 0.127 124.321)",
		300: "oklch(0.897 0.196 126.665)",
		400: "oklch(0.841 0.238 128.85)",
		500: "oklch(0.768 0.233 130.85)",
		600: "oklch(0.648 0.2 131.684)",
		700: "oklch(0.532 0.157 131.589)",
		800: "oklch(0.453 0.124 130.933)",
		900: "oklch(0.405 0.101 131.063)",
		950: "oklch(0.274 0.072 132.109)"
	},
	neutral: {
		50: "oklch(0.985 0 0)",
		100: "oklch(0.97 0 0)",
		200: "oklch(0.922 0 0)",
		300: "oklch(0.87 0 0)",
		400: "oklch(0.708 0 0)",
		500: "oklch(0.556 0 0)",
		600: "oklch(0.439 0 0)",
		700: "oklch(0.371 0 0)",
		800: "oklch(0.269 0 0)",
		900: "oklch(0.205 0 0)",
		950: "oklch(0.145 0 0)"
	},
	orange: {
		50: "oklch(0.98 0.016 73.684)",
		100: "oklch(0.954 0.038 75.164)",
		200: "oklch(0.901 0.076 70.697)",
		300: "oklch(0.837 0.128 66.29)",
		400: "oklch(0.75 0.183 55.934)",
		500: "oklch(0.705 0.213 47.604)",
		600: "oklch(0.646 0.222 41.116)",
		700: "oklch(0.553 0.195 38.402)",
		800: "oklch(0.47 0.157 37.304)",
		900: "oklch(0.408 0.123 38.172)",
		950: "oklch(0.266 0.079 36.259)"
	},
	pink: {
		50: "oklch(0.971 0.014 343.198)",
		100: "oklch(0.948 0.028 342.258)",
		200: "oklch(0.899 0.061 343.231)",
		300: "oklch(0.823 0.12 346.018)",
		400: "oklch(0.718 0.202 349.761)",
		500: "oklch(0.656 0.241 354.308)",
		600: "oklch(0.592 0.249 0.584)",
		700: "oklch(0.525 0.223 3.958)",
		800: "oklch(0.459 0.187 3.815)",
		900: "oklch(0.408 0.153 2.432)",
		950: "oklch(0.284 0.109 3.907)"
	},
	purple: {
		50: "oklch(0.977 0.014 308.299)",
		100: "oklch(0.946 0.033 307.174)",
		200: "oklch(0.902 0.063 306.703)",
		300: "oklch(0.827 0.119 306.383)",
		400: "oklch(0.714 0.203 305.504)",
		500: "oklch(0.627 0.265 303.9)",
		600: "oklch(0.558 0.288 302.321)",
		700: "oklch(0.496 0.265 301.924)",
		800: "oklch(0.438 0.218 303.724)",
		900: "oklch(0.381 0.176 304.987)",
		950: "oklch(0.291 0.149 302.717)"
	},
	red: {
		50: "oklch(0.971 0.013 17.38)",
		100: "oklch(0.936 0.032 17.717)",
		200: "oklch(0.885 0.062 18.334)",
		300: "oklch(0.808 0.114 19.571)",
		400: "oklch(0.704 0.191 22.216)",
		500: "oklch(0.637 0.237 25.331)",
		600: "oklch(0.577 0.245 27.325)",
		700: "oklch(0.505 0.213 27.518)",
		800: "oklch(0.444 0.177 26.899)",
		900: "oklch(0.396 0.141 25.723)",
		950: "oklch(0.258 0.092 26.042)"
	},
	rose: {
		50: "oklch(0.969 0.015 12.422)",
		100: "oklch(0.941 0.03 12.58)",
		200: "oklch(0.892 0.058 10.001)",
		300: "oklch(0.81 0.117 11.638)",
		400: "oklch(0.712 0.194 13.428)",
		500: "oklch(0.645 0.246 16.439)",
		600: "oklch(0.586 0.253 17.585)",
		700: "oklch(0.514 0.222 16.935)",
		800: "oklch(0.455 0.188 13.697)",
		900: "oklch(0.41 0.159 10.272)",
		950: "oklch(0.271 0.105 12.094)"
	},
	sky: {
		50: "oklch(0.977 0.013 236.62)",
		100: "oklch(0.951 0.026 236.824)",
		200: "oklch(0.901 0.058 230.902)",
		300: "oklch(0.828 0.111 230.318)",
		400: "oklch(0.746 0.16 232.661)",
		500: "oklch(0.685 0.169 237.323)",
		600: "oklch(0.588 0.158 241.966)",
		700: "oklch(0.5 0.134 242.749)",
		800: "oklch(0.443 0.11 240.79)",
		900: "oklch(0.391 0.09 240.876)",
		950: "oklch(0.293 0.066 243.157)"
	},
	slate: {
		50: "oklch(0.984 0.003 247.858)",
		100: "oklch(0.968 0.007 247.896)",
		200: "oklch(0.929 0.013 255.508)",
		300: "oklch(0.869 0.022 252.894)",
		400: "oklch(0.704 0.04 256.788)",
		500: "oklch(0.554 0.046 257.417)",
		600: "oklch(0.446 0.043 257.281)",
		700: "oklch(0.372 0.044 257.287)",
		800: "oklch(0.279 0.041 260.031)",
		900: "oklch(0.208 0.042 265.755)",
		950: "oklch(0.129 0.042 264.695)"
	},
	stone: {
		50: "oklch(0.985 0.001 106.423)",
		100: "oklch(0.97 0.001 106.424)",
		200: "oklch(0.923 0.003 48.717)",
		300: "oklch(0.869 0.005 56.366)",
		400: "oklch(0.709 0.01 56.259)",
		500: "oklch(0.553 0.013 58.071)",
		600: "oklch(0.444 0.011 73.639)",
		700: "oklch(0.374 0.01 67.558)",
		800: "oklch(0.268 0.007 34.298)",
		900: "oklch(0.216 0.006 56.043)",
		950: "oklch(0.147 0.004 49.25)"
	},
	teal: {
		50: "oklch(0.984 0.014 180.72)",
		100: "oklch(0.953 0.051 180.801)",
		200: "oklch(0.91 0.096 180.426)",
		300: "oklch(0.855 0.138 181.071)",
		400: "oklch(0.777 0.152 181.912)",
		500: "oklch(0.704 0.14 182.503)",
		600: "oklch(0.6 0.118 184.704)",
		700: "oklch(0.511 0.096 186.391)",
		800: "oklch(0.437 0.078 188.216)",
		900: "oklch(0.386 0.063 188.416)",
		950: "oklch(0.277 0.046 192.524)"
	},
	transparent: "transparent",
	violet: {
		50: "oklch(0.969 0.016 293.756)",
		100: "oklch(0.943 0.029 294.588)",
		200: "oklch(0.894 0.057 293.283)",
		300: "oklch(0.811 0.111 293.571)",
		400: "oklch(0.702 0.183 293.541)",
		500: "oklch(0.606 0.25 292.717)",
		600: "oklch(0.541 0.281 293.009)",
		700: "oklch(0.491 0.27 292.581)",
		800: "oklch(0.432 0.232 292.759)",
		900: "oklch(0.38 0.189 293.745)",
		950: "oklch(0.283 0.141 291.089)"
	},
	white: "#fff",
	yellow: {
		50: "oklch(0.987 0.026 102.212)",
		100: "oklch(0.973 0.071 103.193)",
		200: "oklch(0.945 0.129 101.54)",
		300: "oklch(0.905 0.182 98.111)",
		400: "oklch(0.852 0.199 91.936)",
		500: "oklch(0.795 0.184 86.047)",
		600: "oklch(0.681 0.162 75.834)",
		700: "oklch(0.554 0.135 66.442)",
		800: "oklch(0.476 0.114 61.907)",
		900: "oklch(0.421 0.095 57.708)",
		950: "oklch(0.286 0.066 53.813)"
	},
	zinc: {
		50: "oklch(0.985 0 0)",
		100: "oklch(0.967 0.001 286.375)",
		200: "oklch(0.92 0.004 286.32)",
		300: "oklch(0.871 0.006 286.286)",
		400: "oklch(0.705 0.015 286.067)",
		500: "oklch(0.552 0.016 285.938)",
		600: "oklch(0.442 0.017 285.786)",
		700: "oklch(0.37 0.013 285.805)",
		800: "oklch(0.274 0.006 286.033)",
		900: "oklch(0.21 0.006 285.885)",
		950: "oklch(0.141 0.005 285.823)"
	}
};
`${j.red[600]}${j.red[400]}`, `${j.orange[600]}${j.orange[400]}`, `${j.yellow[700]}${j.yellow[300]}`, `${j.green[700]}${j.green[400]}`, `${j.blue[600]}${j.blue[400]}`, `${j.purple[600]}${j.purple[400]}`, `${j.pink[600]}${j.pink[400]}`, `${j.red[400]}${j.red[600]}`, `${j.orange[400]}${j.orange[600]}`, `${j.yellow[300]}${j.yellow[700]}`, `${j.green[400]}${j.green[700]}`, `${j.blue[400]}${j.blue[600]}`, `${j.purple[400]}${j.purple[600]}`, `${j.pink[400]}${j.pink[600]}`;
function Z0(t) {
	let e = t.getAttribute("data-lexical-relationship-id"), o = t.getAttribute("data-lexical-relationship-relationTo");
	return e != null && o != null ? { node: Ds({
		relationTo: o,
		value: e
	}) } : null;
}
var Ft = class extends r {
	__data;
	constructor({ data: e, format: o, key: r }) {
		super(o, r), this.__data = e;
	}
	static clone(e) {
		return new this({
			data: e.__data,
			format: e.__format,
			key: e.__key
		});
	}
	static getType() {
		return "relationship";
	}
	static importDOM() {
		return { div: (e) => !e.hasAttribute("data-lexical-relationship-relationTo") || !e.hasAttribute("data-lexical-relationship-id") ? null : {
			conversion: Z0,
			priority: 2
		} };
	}
	static importJSON(e) {
		e.version === 1 && e?.value?.id && (e.value = e.value.id);
		let r = Ds({
			relationTo: e.relationTo,
			value: e.value
		});
		return r.setFormat(e.format), r;
	}
	static isInline() {
		return !1;
	}
	createDOM(e) {
		let o = document.createElement("div");
		return Zl$1(o, e?.theme?.relationship), o;
	}
	decorate(e, o) {
		return null;
	}
	exportDOM() {
		let e = document.createElement("div");
		e.setAttribute("data-lexical-relationship-id", String(typeof this.__data?.value == "object" ? this.__data?.value?.id : this.__data?.value)), e.setAttribute("data-lexical-relationship-relationTo", this.__data?.relationTo);
		let o = document.createTextNode(this.getTextContent());
		return e.append(o), { element: e };
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			...this.getData(),
			type: "relationship",
			version: 2
		};
	}
	getData() {
		return this.getLatest().__data;
	}
	getTextContent() {
		return `${this.__data?.relationTo} relation to ${typeof this.__data?.value == "object" ? this.__data?.value?.id : this.__data?.value}`;
	}
	setData(e) {
		let o = this.getWritable();
		o.__data = e;
	}
};
function Ds(t) {
	return Ss$1(new Ft({ data: t }));
}
var Q0 = import_react.lazy(() => import("./RelationshipComponent-BG3DPV3T-XW94B0Nl.js").then((t) => ({ default: t.RelationshipComponent })));
function e1(t) {
	let e = t.getAttribute("data-lexical-relationship-id"), o = t.getAttribute("data-lexical-relationship-relationTo");
	return e != null && o != null ? { node: We({
		relationTo: o,
		value: e
	}) } : null;
}
var Ne = class extends Ft {
	static clone(e) {
		return super.clone(e);
	}
	static getType() {
		return super.getType();
	}
	static importDOM() {
		return { div: (e) => !e.hasAttribute("data-lexical-relationship-relationTo") || !e.hasAttribute("data-lexical-relationship-id") ? null : {
			conversion: e1,
			priority: 2
		} };
	}
	static importJSON(e) {
		e.version === 1 && e?.value?.id && (e.value = e.value.id);
		let r = We({
			relationTo: e.relationTo,
			value: e.value
		});
		return r.setFormat(e.format), r;
	}
	decorate(e, o) {
		return (0, import_jsx_runtime.jsx)(Q0, {
			className: o.theme.relationship ?? "LexicalEditorTheme__relationship",
			data: this.__data,
			format: this.__format,
			nodeKey: this.getKey()
		});
	}
	exportJSON() {
		return super.exportJSON();
	}
};
function We(t) {
	return Ss$1(new Ne({ data: t }));
}
function vr(t) {
	return t instanceof Ne;
}
var Pt = (t) => {
	let e = (0, import_compiler_runtime.c)(23), [o] = o$4(), [r, n] = (0, import_react.useState)(null), [l, s] = (0, import_react.useState)(!1), [i, d, c] = fa$1(t), { closeDrawer: u, drawerSlug: a, isDrawerOpen: m, openDrawer: p } = c, { modalState: h } = se$3(), f;
	e[0] === Symbol.for("react.memo_cache_sentinel") ? (f = () => {
		n($r$2() ?? Vr$1());
	}, e[0] = f) : f = e[0];
	let g = f, k;
	e[1] !== o || e[2] !== r ? (k = () => {
		r && o.update(() => {
			if (wr(r)) {
				let { anchor: I, focus: y } = r;
				Mo$1(I.key) && Mo$1(y.key) && zo$1(r.clone());
			} else Io$1().selectEnd();
		}, {
			discrete: !0,
			skipTransforms: !0
		});
	}, e[1] = o, e[2] = r, e[3] = k) : k = e[3];
	let N = k, R;
	e[4] !== u ? (R = () => {
		u();
	}, e[4] = u, e[5] = R) : R = e[5];
	let T = R, C, x;
	e[6] !== a || e[7] !== h || e[8] !== N || e[9] !== l ? (C = () => {
		if (!l) return;
		let I = h[a];
		I && !I?.isOpen && (s(!1), setTimeout(() => {
			N();
		}, 1));
	}, x = [
		h,
		a,
		N,
		l
	], e[6] = a, e[7] = h, e[8] = N, e[9] = l, e[10] = C, e[11] = x) : (C = e[10], x = e[11]), (0, import_react.useEffect)(C, x);
	let b;
	e[12] !== d ? (b = (I) => (0, import_jsx_runtime.jsx)(d, {
		...I,
		onClick: () => {
			g();
		}
	}), e[12] = d, e[13] = b) : b = e[13];
	let _;
	e[14] !== p ? (_ = () => {
		g(), p(), s(!0);
	}, e[14] = p, e[15] = _) : _ = e[15];
	let D;
	return e[16] !== i || e[17] !== T || e[18] !== m || e[19] !== a || e[20] !== b || e[21] !== _ ? (D = {
		closeListDrawer: T,
		isListDrawerOpen: m,
		ListDrawer: i,
		listDrawerSlug: a,
		ListDrawerToggler: b,
		openListDrawer: _
	}, e[16] = i, e[17] = T, e[18] = m, e[19] = a, e[20] = b, e[21] = _, e[22] = D) : D = e[22], D;
};
var Gs = "toolbar-popup__button", Bt = (t) => {
	let e = (0, import_compiler_runtime.c)(14), { active: o, children: r, editor: n, enabled: l, item: s } = t, i = o === void 0 ? !1 : o, d = l === void 0 ? !0 : l, c = d ? "" : "disabled", u = i ? "active" : "", a = s.key ? `${Gs}-${s.key}` : "", m;
	e[0] !== c || e[1] !== u || e[2] !== a ? (m = [
		Gs,
		c,
		u,
		a
	].filter(Boolean), e[0] = c, e[1] = u, e[2] = a, e[3] = m) : m = e[3];
	let p = m.join(" "), h;
	e[4] !== i || e[5] !== n || e[6] !== d || e[7] !== s ? (h = () => {
		d && n.focus(() => {
			n.update(P1), s.onSelect?.({
				editor: n,
				isActive: i
			});
		});
	}, e[4] = i, e[5] = n, e[6] = d, e[7] = s, e[8] = h) : h = e[8];
	let f = h, g = B1, k;
	return e[9] !== r || e[10] !== p || e[11] !== f || e[12] !== s.key ? (k = (0, import_jsx_runtime.jsx)("button", {
		className: p,
		"data-button-key": s.key,
		onClick: f,
		onMouseDown: g,
		type: "button",
		children: r
	}), e[9] = r, e[10] = p, e[11] = f, e[12] = s.key, e[13] = k) : k = e[13], k;
};
function P1() {
	ds("toolbar");
}
function B1(t) {
	t.preventDefault();
}
var Js = "toolbar-popup__dropdown-item", Xs = import_react.createContext(null);
function zs({ active: t, children: e, editor: o, enabled: r, Icon: n, item: l, itemKey: s, tooltip: i }) {
	let d = (0, import_react.useMemo)(() => [
		Js,
		r === !1 ? "disabled" : "",
		t ? "active" : "",
		l?.key ? `${Js}-${l.key}` : ""
	].filter(Boolean).join(" "), [
		r,
		t,
		l.key
	]), c = (0, import_react.useRef)(null), u = import_react.use(Xs);
	if (u === null) throw new Error("DropDownItem must be used within a DropDown");
	let { registerItem: a } = u;
	return (0, import_react.useEffect)(() => {
		c?.current != null && a(c);
	}, [c, a]), (0, import_jsx_runtime.jsx)(re$3, {
		"aria-label": i,
		buttonStyle: "none",
		className: d,
		disabled: r === !1,
		extraButtonProps: { "data-item-key": s },
		icon: n,
		iconPosition: "left",
		iconStyle: "none",
		onClick: () => {
			r !== !1 && o.focus(() => {
				o.update(() => {
					ds("toolbar");
				}), l.onSelect?.({
					editor: o,
					isActive: t
				});
			});
		},
		onMouseDown: (m) => {
			m.preventDefault();
		},
		ref: c,
		tooltip: i,
		type: "button",
		children: e
	});
}
function V1({ children: t, dropDownRef: e, itemsContainerClassNames: o, onClose: r }) {
	let [n, l] = (0, import_react.useState)(), [s, i] = (0, import_react.useState)(), d = (0, import_react.useCallback)((a) => {
		l((m) => m != null ? [...m, a] : [a]);
	}, [l]), c = (a) => {
		if (n == null) return;
		let { key: m } = a;
		[
			"ArrowDown",
			"ArrowUp",
			"Escape",
			"Tab"
		].includes(m) && a.preventDefault(), m === "Escape" || m === "Tab" ? r() : m === "ArrowUp" ? i((p) => {
			if (p == null) return n[0];
			let h = n.indexOf(p) - 1;
			return n[h === -1 ? n.length - 1 : h];
		}) : m === "ArrowDown" && i((p) => p == null ? n[0] : n[n.indexOf(p) + 1]);
	}, u = (0, import_react.useMemo)(() => ({ registerItem: d }), [d]);
	return (0, import_react.useEffect)(() => {
		n != null && s == null && i(n[0]), s != null && s?.current != null && s.current.focus();
	}, [n, s]), (0, import_jsx_runtime.jsx)(Xs, {
		value: u,
		children: (0, import_jsx_runtime.jsx)("div", {
			className: (o ?? ["toolbar-popup__dropdown-items"]).join(" "),
			onKeyDown: c,
			ref: e,
			children: t
		})
	});
}
function Zs({ buttonAriaLabel: t, buttonClassName: e, children: o, disabled: r = !1, dropdownKey: n, Icon: l, itemsContainerClassNames: s, label: i, stopCloseOnClickSelf: d }) {
	let c = (0, import_react.useRef)(null), u = (0, import_react.useRef)(null), [a, m] = (0, import_react.useState)(!1), p = () => {
		m(!1), u?.current != null && u.current.focus();
	};
	(0, import_react.useEffect)(() => {
		let f = u.current, g = c.current;
		if (a && f !== null && g !== null) {
			let { left: k, top: N } = f.getBoundingClientRect(), R = window.scrollY || document.documentElement.scrollTop;
			g.style.top = `${N + R + f.offsetHeight + 5}px`, g.style.left = `${Math.min(k - 5, window.innerWidth - g.offsetWidth - 20)}px`;
		}
	}, [
		c,
		u,
		a
	]), (0, import_react.useEffect)(() => {
		let f = u.current;
		if (f !== null && a) {
			let g = (k) => {
				let N = k.target;
				As$1(N) && (d && c.current && c.current.contains(N) || f.contains(N) || m(!1));
			};
			return document.addEventListener("click", g), () => {
				document.removeEventListener("click", g);
			};
		}
	}, [
		c,
		u,
		a,
		d
	]);
	let h = (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsx)(V1, {
		dropDownRef: c,
		itemsContainerClassNames: s,
		onClose: p,
		children: o
	}), document.body);
	return (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsxs)("button", {
		"aria-label": t,
		className: e + (a ? " active" : ""),
		"data-dropdown-key": n,
		disabled: r,
		onClick: (f) => {
			f.preventDefault(), m(!a);
		},
		onMouseDown: (f) => {
			f.preventDefault();
		},
		ref: u,
		type: "button",
		children: [
			l && (0, import_jsx_runtime.jsx)(l, {}),
			i && (0, import_jsx_runtime.jsx)("span", {
				className: "toolbar-popup__dropdown-label",
				children: i
			}),
			(0, import_jsx_runtime.jsx)("i", { className: "toolbar-popup__dropdown-caret" })
		]
	}), a && (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: h })] });
}
var Ar = "toolbar-popup__dropdown", Z1 = (t) => {
	let e = (0, import_compiler_runtime.c)(14), { active: o, anchorElem: r, editor: n, enabled: l, item: s } = t, { i18n: i } = WP(), { fieldProps: d } = I$4(), { featureClientSchemaMap: c, schemaPath: u } = d;
	if (s.Component) {
		let m;
		return e[0] !== o || e[1] !== r || e[2] !== n || e[3] !== l || e[4] !== s ? (m = s?.Component && (0, import_jsx_runtime.jsx)(s.Component, {
			active: o,
			anchorElem: r,
			editor: n,
			enabled: l,
			item: s
		}, s.key), e[0] = o, e[1] = r, e[2] = n, e[3] = l, e[4] = s, e[5] = m) : m = e[5], m;
	}
	let a;
	if (e[6] !== o || e[7] !== n || e[8] !== l || e[9] !== c || e[10] !== i || e[11] !== s || e[12] !== u) {
		let m = s.key, p;
		s.label && (m = typeof s.label == "function" ? s.label({
			featureClientSchemaMap: c,
			i18n: i,
			schemaPath: u
		}) : s.label), m.length > 25 ? p = m.substring(0, 25) + "..." : p = m, a = (0, import_jsx_runtime.jsx)(zs, {
			active: o,
			editor: n,
			enabled: l,
			Icon: s?.ChildComponent ? (0, import_jsx_runtime.jsx)(s.ChildComponent, {}) : void 0,
			item: s,
			itemKey: s.key,
			tooltip: m,
			children: (0, import_jsx_runtime.jsx)("span", {
				className: "text",
				children: p
			})
		}, s.key), e[6] = o, e[7] = n, e[8] = l, e[9] = c, e[10] = i, e[11] = s, e[12] = u, e[13] = a;
	} else a = e[13];
	return a;
}, Y1 = import_react.memo(Z1), jt = ({ anchorElem: t, classNames: e, editor: o, group: r, groupState: n, Icon: l, itemsContainerClassNames: s, label: i }) => {
	let { items: d, key: c } = r, u = (0, import_react.useMemo)(() => d?.length ? d.map((a) => (0, import_jsx_runtime.jsx)(Y1, {
		active: n.activeItemKeys.includes(a.key),
		anchorElem: t,
		editor: o,
		enabled: n.enabledItemKeys.includes(a.key),
		item: a
	}, a.key)) : null, [
		d,
		n.activeItemKeys,
		n.enabledItemKeys,
		t,
		o
	]);
	return (0, import_jsx_runtime.jsx)(Zs, {
		buttonAriaLabel: `${c} dropdown`,
		buttonClassName: [
			Ar,
			`${Ar}-${c}`,
			...e || []
		].filter(Boolean).join(" "),
		disabled: !n.enabledGroup,
		dropdownKey: c,
		Icon: l,
		itemsContainerClassNames: [`${Ar}-items`, ...s || []],
		label: i,
		children: u
	}, c);
};
function nh(t) {
	let e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	if (!t?.length) return {
		groupStates: o,
		itemStates: e
	};
	for (let r of t) {
		let n = [];
		for (let l of r.items) e.set(l.key, {
			active: !1,
			enabled: !0
		}), n.push(l.key);
		o.set(r.key, {
			activeItemKeys: [],
			activeItems: [],
			enabledGroup: !0,
			enabledItemKeys: n
		});
	}
	return {
		groupStates: o,
		itemStates: e
	};
}
function wo(t, e) {
	let [o, r] = (0, import_react.useState)(() => nh(e)), n = (0, import_react.useDeferredValue)(o), l = I$4(), s = (0, import_react.useRef)(l);
	s.current = l;
	let i = (0, import_react.useRef)(e);
	i.current = e;
	let d = pr$1(), c = (0, import_react.useCallback)(() => {
		t.getEditorState().read(() => {
			let u = $r$2();
			if (!u) return;
			let a = i.current;
			if (!a?.length) return;
			let m = s.current, p = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map();
			for (let f of a) {
				let g = [], k = [], N = [], R = f.type === "dropdown" ? f.maxActiveItems ?? 1 : void 0;
				for (let C of f.items) {
					let x = C.isActive ? (!R || g.length < R) && C.isActive({
						editor: t,
						editorConfigContext: m,
						selection: u
					}) : !1, b = C.isEnabled ? C.isEnabled({
						editor: t,
						editorConfigContext: m,
						selection: u
					}) : !0;
					x && (g.push(C.key), k.push(C)), b && N.push(C.key), p.set(C.key, {
						active: x,
						enabled: b
					});
				}
				let T = f.type === "dropdown" && f.isEnabled ? f.isEnabled({
					editor: t,
					editorConfigContext: m,
					selection: u
				}) : !0;
				h.set(f.key, {
					activeItemKeys: g,
					activeItems: k,
					enabledGroup: T,
					enabledItemKeys: N
				});
			}
			r({
				groupStates: h,
				itemStates: p
			});
		});
	}, [t]);
	return (0, import_react.useEffect)(() => {
		d(c);
		let u = () => d(c), a = ec(t.registerUpdateListener(u));
		return document.addEventListener("mouseup", u), () => {
			a(), document.removeEventListener("mouseup", u);
		};
	}, [
		t,
		d,
		c
	]), n;
}
function dh({ active: t, anchorElem: e, editor: o, enabled: r, item: n }) {
	return n.Component ? n?.Component && (0, import_jsx_runtime.jsx)(n.Component, {
		anchorElem: e,
		editor: o,
		item: n
	}, n.key) : n.ChildComponent ? (0, import_jsx_runtime.jsx)(Bt, {
		active: t,
		editor: o,
		enabled: r,
		item: n,
		children: (0, import_jsx_runtime.jsx)(n.ChildComponent, {})
	}, n.key) : null;
}
function mh({ anchorElem: t, editor: e, editorConfig: o, group: r, index: n, toolbarStates: l }) {
	let { i18n: s } = WP(), { fieldProps: { featureClientSchemaMap: i, schemaPath: d } } = I$4(), c = l.groupStates.get(r.key), u = (0, import_react.useMemo)(() => {
		if (r.type !== "dropdown") return;
		let m = c?.activeItems?.[0];
		return m ? m.ChildComponent : r.ChildComponent;
	}, [r, c?.activeItems]), a = (0, import_react.useMemo)(() => {
		if (r.type !== "dropdown") return;
		let m = c?.activeItems;
		if (!m?.length) return;
		if (m.length > 1) return s.t("lexical:general:toolbarItemsActive", { count: m.length });
		let p = m[0], h = p.key;
		return p.label && (h = typeof p.label == "function" ? p.label({
			featureClientSchemaMap: i,
			i18n: s,
			schemaPath: d
		}) : p.label), h.length > 25 && (h = h.substring(0, 25) + "..."), h;
	}, [
		r,
		c?.activeItems,
		s,
		i,
		d
	]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: `fixed-toolbar__group fixed-toolbar__group-${r.key}`,
		"data-toolbar-group-key": r.key,
		children: [
			r.type === "dropdown" && r.items.length && c ? (0, import_jsx_runtime.jsx)(jt, {
				anchorElem: t,
				editor: e,
				group: r,
				groupState: c,
				Icon: u,
				itemsContainerClassNames: ["fixed-toolbar__dropdown-items"],
				label: a
			}) : null,
			r.type === "buttons" && r.items.length ? r.items.map((m) => {
				let p = l.itemStates.get(m.key);
				return (0, import_jsx_runtime.jsx)(dh, {
					active: p?.active ?? !1,
					anchorElem: t,
					editor: e,
					enabled: p?.enabled ?? !0,
					item: m
				}, m.key);
			}) : null,
			n < o.features.toolbarFixed?.groups.length - 1 && (0, import_jsx_runtime.jsx)("div", { className: "divider" })
		]
	}, r.key);
}
function ph({ anchorElem: t, clientProps: e, editor: o, editorConfig: r, parentWithFixedToolbar: n }) {
	let l = import_react.useRef(null), s = a$1(), { y: i } = Am(), d = wo(o, r?.features?.toolbarFixed?.groups), c = (0, import_react.useMemo)(() => {
		if (!n || e?.disableIfParentHasFixedToolbar) return null;
		let a = n.editorContainerRef.current.previousElementSibling;
		for (; a;) {
			if (a.classList.contains("fixed-toolbar")) return a;
			a = a.previousElementSibling;
		}
		return null;
	}, [e?.disableIfParentHasFixedToolbar, n]);
	return Hi$2(() => {
		if (!c) return;
		let u = l.current;
		if (!u) return;
		let a = u.getBoundingClientRect(), m = c.getBoundingClientRect();
		if (!(a.bottom < m.top || a.top > m.bottom)) u.classList.remove("fixed-toolbar"), u.classList.add("fixed-toolbar", "fixed-toolbar--overlapping"), c.classList.remove("fixed-toolbar"), c.classList.add("fixed-toolbar", "fixed-toolbar--hide");
		else {
			if (!u.classList.contains("fixed-toolbar--overlapping")) return;
			u.classList.remove("fixed-toolbar--overlapping"), u.classList.add("fixed-toolbar"), c.classList.remove("fixed-toolbar--hide"), c.classList.add("fixed-toolbar");
		}
	}, 50, [
		l,
		c,
		i
	]), (0, import_jsx_runtime.jsx)("div", {
		className: "fixed-toolbar",
		onFocus: (u) => {
			u.stopPropagation();
		},
		ref: l,
		children: s && (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: r?.features && r.features?.toolbarFixed?.groups.map((u, a) => (0, import_jsx_runtime.jsx)(mh, {
			anchorElem: t,
			editor: o,
			editorConfig: r,
			group: u,
			index: a,
			toolbarStates: d
		}, u.key)) })
	});
}
var Qs = (t) => {
	if (t.parentEditor?.editorConfig) {
		if (t.parentEditor?.editorConfig.resolvedFeatureMap.has("toolbarFixed")) return t.parentEditor;
		if (t.parentEditor) return Qs(t.parentEditor);
	}
	return !1;
}, ea = (t) => {
	let e = (0, import_compiler_runtime.c)(6), { clientProps: o } = t, [r] = o$4(), n = I$4();
	if (!a$1()) return null;
	let { editorConfig: s } = n, i = o.applyToFocusedEditor && n.focusedEditor?.editor || r, d = o.applyToFocusedEditor && n.focusedEditor?.editorConfig || s, c, u;
	if (e[0] !== o || e[1] !== i || e[2] !== d || e[3] !== n) {
		u = Symbol.for("react.early_return_sentinel");
		e: {
			let a = Qs(n);
			if (o?.disableIfParentHasFixedToolbar && a) {
				u = null;
				break e;
			}
			if (!d?.features?.toolbarFixed?.groups?.length) {
				u = null;
				break e;
			}
			c = (0, import_jsx_runtime.jsx)(ph, {
				anchorElem: document.body,
				clientProps: o,
				editor: i,
				editorConfig: d,
				parentWithFixedToolbar: a
			});
		}
		e[0] = o, e[1] = i, e[2] = d, e[3] = n, e[4] = c, e[5] = u;
	} else c = e[4], u = e[5];
	return u !== Symbol.for("react.early_return_sentinel") ? u : c;
};
var fh = M({ plugins: [{
	Component: ea,
	position: "aboveContainer"
}] });
function Pr(t, e) {
	let o = t.getRangeAt(0), r;
	if (t.anchorNode === e) {
		let n = e;
		for (; n.firstElementChild != null;) n = n.firstElementChild;
		r = n.getBoundingClientRect();
	} else r = o.getBoundingClientRect();
	return r;
}
function Eo(t) {
	let { alwaysDisplayOnTop: e = !1, anchorElem: o, anchorFlippedOffset: r = 0, floatingElem: n, horizontalOffset: l = 32, horizontalPosition: s = "left", specialHandlingForCaret: i = !1, targetRect: d, verticalGap: c = 10 } = t, u = o.parentElement;
	if (d === null || u == null) {
		n.style.opacity = "0", n.style.transform = "translate(-10000px, -10000px)";
		return;
	}
	let a = n.getBoundingClientRect(), m = o.getBoundingClientRect(), p = u.getBoundingClientRect(), h = d.top - a.height - c, f = d.left - l;
	s === "center" && (f = d.left + d.width / 2 - a.width / 2);
	let g = 0;
	return !e && h < p.top && !i && (g = a.height + d.height + c * 2, h += g), s === "center" ? f + a.width > p.right ? f = p.right - a.width - l : f < p.left && (f = p.left + l) : f + a.width > p.right && (f = p.right - a.width - l), f -= m.left, n.style.opacity = "1", i && r !== 0 ? (h -= m.bottom - r + a.height - 3, n.style.transform = `translate(${f}px, ${h}px) rotate(180deg)`) : (h -= m.top, n.style.transform = `translate(${f}px, ${h}px)`), g;
}
function Sh({ active: t, anchorElem: e, editor: o, enabled: r, item: n }) {
	return n.Component ? n?.Component && (0, import_jsx_runtime.jsx)(n.Component, {
		anchorElem: e,
		editor: o,
		item: n
	}, n.key) : n.ChildComponent ? (0, import_jsx_runtime.jsx)(Bt, {
		active: t,
		editor: o,
		enabled: r,
		item: n,
		children: (0, import_jsx_runtime.jsx)(n.ChildComponent, {})
	}, n.key) : null;
}
function Eh({ anchorElem: t, editor: e, group: o, index: r, toolbarStates: n }) {
	let { editorConfig: l } = I$4(), s = n.groupStates.get(o.key), i = (0, import_react.useMemo)(() => o.type !== "dropdown" ? void 0 : s?.activeItems?.[0]?.ChildComponent ?? o.ChildComponent, [o, s?.activeItems]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: `inline-toolbar-popup__group inline-toolbar-popup__group-${o.key}`,
		"data-toolbar-group-key": o.key,
		children: [
			o.type === "dropdown" && o.items.length && s ? (0, import_jsx_runtime.jsx)(jt, {
				anchorElem: t,
				editor: e,
				group: o,
				groupState: s,
				Icon: i
			}) : null,
			o.type === "buttons" && o.items.length ? o.items.map((d) => {
				let c = n.itemStates.get(d.key);
				return (0, import_jsx_runtime.jsx)(Sh, {
					active: c?.active ?? !1,
					anchorElem: t,
					editor: e,
					enabled: c?.enabled ?? !0,
					item: d
				}, d.key);
			}) : null,
			r < l.features.toolbarInline?.groups.length - 1 && (0, import_jsx_runtime.jsx)("div", { className: "divider" })
		]
	}, o.key);
}
function Nh({ anchorElem: t, editor: e }) {
	let o = (0, import_react.useRef)(null), r = (0, import_react.useRef)(null), { editorConfig: n } = I$4(), l = wo(e, n?.features?.toolbarInline?.groups), s = (0, import_react.useCallback)(() => {
		if (o?.current) {
			let u = o.current.style.opacity === "0", a = o.current.style.pointerEvents === "none";
			u || (o.current.style.opacity = "0"), a || (o.current.style.pointerEvents = "none");
		}
	}, [o]), i = (0, import_react.useCallback)((u) => {
		if (o?.current && (u.buttons === 1 || u.buttons === 3)) {
			let a = o.current.style.opacity === "0", m = o.current.style.pointerEvents === "none";
			if (!a || !m) {
				let p = u.clientX, h = u.clientY, f = document.elementFromPoint(p, h);
				o.current.contains(f) || s();
			}
		}
	}, [s]), d = (0, import_react.useCallback)(() => {
		o?.current && (o.current.style.opacity !== "1" && (o.current.style.opacity = "1"), o.current.style.pointerEvents !== "auto" && (o.current.style.pointerEvents = "auto"));
	}, []);
	(0, import_react.useEffect)(() => (document.addEventListener("mousemove", i), document.addEventListener("mouseup", d), () => {
		document.removeEventListener("mousemove", i), document.removeEventListener("mouseup", d);
	}), [
		o,
		i,
		d
	]);
	let c = (0, import_react.useCallback)(() => {
		let u = $r$2(), a = bs$1(e._window);
		if (o.current === null) return;
		let m = t.querySelector(":scope > .link-editor"), p = m !== null && "style" in m && m?.style?.opacity === "1", h = e.getRootElement();
		if (u !== null && a !== null && !a.isCollapsed && h !== null && h.contains(a.anchorNode)) {
			let f = Pr(a, h), g = Eo({
				alwaysDisplayOnTop: p,
				anchorElem: t,
				floatingElem: o.current,
				horizontalPosition: "center",
				targetRect: f
			});
			r.current && Eo({
				anchorElem: o.current,
				anchorFlippedOffset: g,
				floatingElem: r.current,
				horizontalOffset: 5,
				horizontalPosition: "center",
				specialHandlingForCaret: !0,
				targetRect: f,
				verticalGap: 8
			});
		} else s();
	}, [
		e,
		s,
		t
	]);
	return (0, import_react.useEffect)(() => {
		let u = t.parentElement, a = () => {
			e.getEditorState().read(() => {
				c();
			});
		};
		return window.addEventListener("resize", a), u && u.addEventListener("scroll", a), () => {
			window.removeEventListener("resize", a), u && u.removeEventListener("scroll", a);
		};
	}, [
		e,
		c,
		t
	]), (0, import_react.useEffect)(() => (e.getEditorState().read(() => {
		c();
	}), ec(e.registerUpdateListener(({ editorState: u }) => {
		u.read(() => {
			c();
		});
	}), e.registerCommand(re$2, () => (c(), !1), 1))), [e, c]), (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-toolbar-popup",
		ref: o,
		children: [(0, import_jsx_runtime.jsx)("div", {
			className: "caret",
			ref: r
		}), n?.features && n.features?.toolbarInline?.groups.map((u, a) => (0, import_jsx_runtime.jsx)(Eh, {
			anchorElem: t,
			editor: e,
			group: u,
			index: a,
			toolbarStates: l
		}, u.key))]
	});
}
function Lh(t, e) {
	let o = (0, import_compiler_runtime.c)(12), [r, n] = (0, import_react.useState)(!1), l = a$1(), s;
	o[0] !== t ? (s = () => {
		t.getEditorState().read(() => {
			if (t.isComposing()) return;
			let p = $r$2(), h = bs$1(t._window), f = t.getRootElement();
			if (h !== null && (!wr(p) || f === null || !f.contains(h.anchorNode))) {
				n(!1);
				return;
			}
			if (!wr(p)) return;
			if (p.getTextContent() !== "") {
				let k = p.getNodes(), N = !1;
				for (let R of k) if (yr$1(R)) {
					n(!0), N = !0;
					break;
				}
				N || n(!1);
			} else n(!1);
			let g = p.getTextContent().replace(/\n/g, "");
			if (!p.isCollapsed() && g === "") {
				n(!1);
				return;
			}
		});
	}, o[0] = t, o[1] = s) : s = o[1];
	let i = s, d, c;
	o[2] !== i ? (d = () => (document.addEventListener("selectionchange", i), document.addEventListener("mouseup", i), () => {
		document.removeEventListener("selectionchange", i), document.removeEventListener("mouseup", i);
	}), c = [i], o[2] = i, o[3] = d, o[4] = c) : (d = o[3], c = o[4]), (0, import_react.useEffect)(d, c);
	let u, a;
	if (o[5] !== t || o[6] !== i ? (u = () => ec(t.registerUpdateListener(() => {
		i();
	}), t.registerRootListener(() => {
		t.getRootElement() === null && n(!1);
	})), a = [t, i], o[5] = t, o[6] = i, o[7] = u, o[8] = a) : (u = o[7], a = o[8]), (0, import_react.useEffect)(u, a), !r || !l) return null;
	let m;
	return o[9] !== e || o[10] !== t ? (m = (0, import_react_dom.createPortal)((0, import_jsx_runtime.jsx)(Nh, {
		anchorElem: e,
		editor: t
	}), e), o[9] = e, o[10] = t, o[11] = m) : m = o[11], m;
}
var sa = (t) => {
	let { anchorElem: e } = t, [o] = o$4();
	return Lh(o, e);
}, yh = M({ plugins: [{
	Component: sa,
	position: "floatingAnchorElem"
}] });
(0, import_react.createContext)({
	cellEditorConfig: null,
	cellEditorPlugins: null,
	set: () => {}
});
function $o(t, e) {
	if (t.hasAttribute("data-lexical-pending-upload-form-id")) {
		let r = t.getAttribute("data-lexical-pending-upload-form-id");
		if (r != null) return { node: e({ data: { pending: {
			formID: r,
			src: t.getAttribute("src") || ""
		} } }) };
	}
	if (t.hasAttribute("data-lexical-upload-relation-to") && t.hasAttribute("data-lexical-upload-id")) {
		let r = t.getAttribute("data-lexical-upload-id"), n = t.getAttribute("data-lexical-upload-relation-to");
		if (r != null && n != null) return { node: e({ data: {
			fields: {},
			relationTo: n,
			value: r
		} }) };
	}
	return { node: e({ data: { pending: {
		formID: new import_objectid.default.default().toHexString(),
		src: t.getAttribute("src") || ""
	} } }) };
}
var Gt = class extends r {
	__data;
	constructor({ data: e, format: o, key: r }) {
		super(o, r), this.__data = e;
	}
	static clone(e) {
		return new this({
			data: e.__data,
			format: e.__format,
			key: e.__key
		});
	}
	static getType() {
		return "upload";
	}
	static importDOM() {
		return { img: (e) => ({
			conversion: (o) => $o(o, Ua),
			priority: 0
		}) };
	}
	static importJSON(e) {
		e.version === 1 && e?.value?.id && (e.value = e.value.id), e.version === 2 && !e?.id && (e.id = new import_objectid.default.default().toHexString(), e.version = 3);
		let r = Ua({ data: {
			id: e.id,
			fields: e.fields,
			pending: e.pending,
			relationTo: e.relationTo,
			value: e.value
		} });
		return r.setFormat(e.format), r;
	}
	static isInline() {
		return !1;
	}
	createDOM(e) {
		let o = document.createElement("div");
		return Zl$1(o, e?.theme?.upload), o;
	}
	decorate() {
		return null;
	}
	exportDOM() {
		let e = document.createElement("img"), o = this.__data;
		return o.pending ? (e.setAttribute("data-lexical-pending-upload-form-id", String(o?.pending?.formID)), e.setAttribute("src", o?.pending?.src || "")) : (e.setAttribute("data-lexical-upload-id", String(o?.value)), e.setAttribute("data-lexical-upload-relation-to", o?.relationTo)), { element: e };
	}
	exportJSON() {
		return {
			...super.exportJSON(),
			...this.getData(),
			type: "upload",
			version: 3
		};
	}
	getData() {
		return this.getLatest().__data;
	}
	setData(e) {
		let o = this.getWritable();
		o.__data = e;
	}
	updateDOM() {
		return !1;
	}
};
function Ua({ data: t }) {
	return t?.id || (t.id = new import_objectid.default.default().toHexString()), Ss$1(new Gt({ data: t }));
}
var Va = () => (0, import_jsx_runtime.jsx)("div", {
	className: "lexical-upload",
	children: (0, import_jsx_runtime.jsx)(le$5, {
		height: "95px",
		width: "203px"
	})
});
var yx = import_react.lazy(() => import("./component-XIHC3W6W-Bxe9spQq.js").then((t) => ({ default: t.UploadComponent }))), pe = class extends Gt {
	static clone(e) {
		return super.clone(e);
	}
	static getType() {
		return super.getType();
	}
	static importDOM() {
		return { img: (e) => ({
			conversion: (o) => $o(o, fe),
			priority: 0
		}) };
	}
	static importJSON(e) {
		e.version === 1 && e?.value?.id && (e.value = e.value.id), e.version === 2 && !e?.id && (e.id = new import_objectid.default.default().toHexString(), e.version = 3);
		let r = fe({ data: {
			id: e.id,
			fields: e.fields,
			pending: e.pending,
			relationTo: e.relationTo,
			value: e.value
		} });
		return r.setFormat(e.format), r;
	}
	decorate(e, o) {
		return this.__data.pending ? (0, import_jsx_runtime.jsx)(Va, {}) : (0, import_jsx_runtime.jsx)(yx, {
			className: o?.theme?.upload ?? "LexicalEditorTheme__upload",
			data: this.__data,
			format: this.__format,
			nodeKey: this.getKey()
		});
	}
	exportJSON() {
		return super.exportJSON();
	}
};
function fe({ data: t }) {
	return t?.id || (t.id = new import_objectid.default.default().toHexString()), Ss$1(new pe({ data: t }));
}
function dt(t) {
	return t instanceof pe;
}
var ln = {
	namespace: "lexical",
	theme: {
		block: "LexicalEditorTheme__block",
		blockCursor: "LexicalEditorTheme__blockCursor",
		characterLimit: "LexicalEditorTheme__characterLimit",
		code: "LexicalEditorTheme__code",
		inlineBlock: "LexicalEditorTheme__inlineBlock",
		heading: {
			h1: "LexicalEditorTheme__h1",
			h2: "LexicalEditorTheme__h2",
			h3: "LexicalEditorTheme__h3",
			h4: "LexicalEditorTheme__h4",
			h5: "LexicalEditorTheme__h5",
			h6: "LexicalEditorTheme__h6"
		},
		hr: "LexicalEditorTheme__hr",
		hrSelected: "LexicalEditorTheme__hrSelected",
		indent: "LexicalEditorTheme__indent",
		link: "LexicalEditorTheme__link",
		list: {
			checklist: "LexicalEditorTheme__checklist",
			listitem: "LexicalEditorTheme__listItem",
			listitemChecked: "LexicalEditorTheme__listItemChecked",
			listitemUnchecked: "LexicalEditorTheme__listItemUnchecked",
			nested: { listitem: "LexicalEditorTheme__nestedListItem" },
			olDepth: [
				"LexicalEditorTheme__ol1",
				"LexicalEditorTheme__ol2",
				"LexicalEditorTheme__ol3",
				"LexicalEditorTheme__ol4",
				"LexicalEditorTheme__ol5"
			],
			ul: "LexicalEditorTheme__ul"
		},
		ltr: "LexicalEditorTheme__ltr",
		mark: "LexicalEditorTheme__mark",
		markOverlap: "LexicalEditorTheme__markOverlap",
		paragraph: "LexicalEditorTheme__paragraph",
		placeholder: "LexicalEditorTheme__placeholder",
		quote: "LexicalEditorTheme__quote",
		relationship: "LexicalEditorTheme__relationship",
		rtl: "LexicalEditorTheme__rtl",
		tab: "LexicalEditorTheme__tabNode",
		table: "LexicalEditorTheme__table",
		tableAddColumns: "LexicalEditorTheme__tableAddColumns",
		tableAddRows: "LexicalEditorTheme__tableAddRows",
		tableAlignment: {
			center: "LexicalEditorTheme__tableAlignmentCenter",
			right: "LexicalEditorTheme__tableAlignmentRight"
		},
		tableCell: "LexicalEditorTheme__tableCell",
		tableCellActionButton: "LexicalEditorTheme__tableCellActionButton",
		tableCellActionButtonContainer: "LexicalEditorTheme__tableCellActionButtonContainer",
		tableCellHeader: "LexicalEditorTheme__tableCellHeader",
		tableCellResizer: "LexicalEditorTheme__tableCellResizer",
		tableCellSelected: "LexicalEditorTheme__tableCellSelected",
		tableFrozenColumn: "LexicalEditorTheme__tableFrozenColumn",
		tableRowStriping: "LexicalEditorTheme__tableRowStriping",
		tableScrollableWrapper: "LexicalEditorTheme__tableScrollableWrapper",
		tableSelected: "LexicalEditorTheme__tableSelected",
		tableSelection: "LexicalEditorTheme__tableSelection",
		text: {
			bold: "LexicalEditorTheme__textBold",
			code: "LexicalEditorTheme__textCode",
			italic: "LexicalEditorTheme__textItalic",
			strikethrough: "LexicalEditorTheme__textStrikethrough",
			subscript: "LexicalEditorTheme__textSubscript",
			superscript: "LexicalEditorTheme__textSuperscript",
			underline: "LexicalEditorTheme__textUnderline",
			underlineStrikethrough: "LexicalEditorTheme__textUnderlineStrikethrough"
		},
		upload: "LexicalEditorTheme__upload"
	}
};
function ac({ config: t, featureClientImportMap: e, featureClientSchemaMap: o, field: r, schemaPath: n, unSanitizedEditorConfig: l }) {
	let s = /* @__PURE__ */ new Map();
	for (let c of l.features) {
		if (!c?.clientFeatureProps?.featureKey || c?.clientFeatureProps?.order === void 0 || c?.clientFeatureProps?.order === null) throw new Error("A Feature you have installed does not return the client props as clientFeatureProps. Please make sure to always return those props, even if they are null, as other important props like order and featureKey are later on injected.");
		s.set(c.clientFeatureProps.featureKey, c);
	}
	l.features = l.features.sort((c, u) => c.clientFeatureProps.order - u.clientFeatureProps.order);
	let i = /* @__PURE__ */ new Map(), d = 0;
	for (let c of l.features) {
		let u = typeof c.feature == "function" ? c.feature({
			config: t,
			featureClientImportMap: e,
			featureClientSchemaMap: o,
			featureProviderMap: s,
			field: r,
			resolvedFeatures: i,
			schemaPath: n,
			unSanitizedEditorConfig: l
		}) : c.feature;
		u.key = c.clientFeatureProps.featureKey, u.order = d, i.set(c.clientFeatureProps.featureKey, u), d++;
	}
	return i;
}
var cc = (t) => {
	let e = {
		enabledFeatures: [],
		enabledFormats: [],
		markdownTransformers: [],
		nodes: [],
		plugins: [],
		providers: [],
		slashMenu: {
			dynamicGroups: [],
			groups: []
		},
		toolbarFixed: { groups: [] },
		toolbarInline: { groups: [] }
	}, o = {};
	if (t.forEach((r) => {
		r.key === "toolbarFixed" && r.sanitizedClientFeatureProps?.customGroups && (o = {
			...o,
			...r.sanitizedClientFeatureProps.customGroups
		});
	}), !t?.size) return e;
	t.forEach((r) => {
		if (r.providers?.length && (e.providers = e.providers.concat(r.providers)), r.enableFormats?.length && e.enabledFormats.push(...r.enableFormats), r.nodes?.length) for (let n of r.nodes) e.nodes.push(n);
		if (r.plugins?.length && r.plugins.forEach((n, l) => {
			e.plugins?.push({
				clientProps: r.sanitizedClientFeatureProps,
				Component: n.Component,
				key: r.key + l,
				position: n.position
			});
		}), r.toolbarInline?.groups?.length) for (let n of r.toolbarInline.groups) {
			let l = e.toolbarInline.groups.find((s) => s.key === n.key);
			l ? e.toolbarInline.groups = e.toolbarInline.groups.filter((s) => s.key !== n.key) : l = {
				...n,
				items: []
			}, n?.items?.length && (l.items = l.items.concat(n.items)), e.toolbarInline?.groups.push(l);
		}
		if (r.toolbarFixed?.groups?.length) for (let n of r.toolbarFixed.groups) {
			let l = e.toolbarFixed.groups.find((s) => s.key === n.key);
			l ? e.toolbarFixed.groups = e.toolbarFixed.groups.filter((s) => s.key !== n.key) : l = {
				...n,
				items: []
			}, n?.items?.length && (l.items = l.items.concat(n.items)), e.toolbarFixed?.groups.push(l);
		}
		if (r.slashMenu?.groups) {
			r.slashMenu.dynamicGroups?.length && (e.slashMenu.dynamicGroups = e.slashMenu.dynamicGroups.concat(r.slashMenu.dynamicGroups));
			for (let n of r.slashMenu.groups) {
				let l = e.slashMenu.groups.find((s) => s.key === n.key);
				l ? e.slashMenu.groups = e.slashMenu.groups.filter((s) => s.key !== n.key) : l = {
					...n,
					items: []
				}, n?.items?.length && (l.items = l.items.concat(n.items)), e.slashMenu.groups.push(l);
			}
		}
		if (r.markdownTransformers?.length) for (let n of r.markdownTransformers) typeof n == "function" ? e.markdownTransformers.push(n({
			allNodes: e.nodes,
			allTransformers: e.markdownTransformers
		})) : e.markdownTransformers.push(n);
		e.enabledFeatures.push(r.key);
	}), Object.keys(o).length > 0 && (e.toolbarFixed.groups = e.toolbarFixed.groups.map((r) => {
		let n = o[r.key];
		return n ? (0, import_cjs.default)(r, n) : r;
	})), e.toolbarInline.groups.sort((r, n) => r.order && n.order ? r.order - n.order : r.order ? -1 : n.order ? 1 : 0), e.toolbarFixed.groups.sort((r, n) => r.order && n.order ? r.order - n.order : r.order ? -1 : n.order ? 1 : 0);
	for (let r of e.toolbarInline.groups) r.items.sort((n, l) => n.order && l.order ? n.order - l.order : n.order ? -1 : l.order ? 1 : 0);
	for (let r of e.toolbarFixed.groups) r.items.sort((n, l) => n.order && l.order ? n.order - l.order : n.order ? -1 : l.order ? 1 : 0);
	return e;
};
function sn(t, e, o, r) {
	return {
		admin: o,
		features: cc(t),
		lexical: e,
		resolvedFeatureMap: t,
		view: r
	};
}
var pC = (0, import_react.lazy)(() => import("./Field-J6MIUIWP-CMnU4c92.js").then((t) => ({ default: t.RichText }))), fC = (t) => (0, import_jsx_runtime.jsx)(Tr, {
	inheritable: !0,
	views: t.views,
	children: (0, import_jsx_runtime.jsx)(hC, { ...t })
}), hC = (t) => {
	let e = (0, import_compiler_runtime.c)(23), { admin: o, clientFeatures: r, featureClientImportMap: n, featureClientSchemaMap: l, field: s, lexicalEditorConfig: i, schemaPath: d, views: c } = t, u;
	e[0] !== o ? (u = o === void 0 ? {} : o, e[0] = o, e[1] = u) : u = e[1];
	let a = u, m;
	e[2] !== n ? (m = n === void 0 ? {} : n, e[2] = n, e[3] = m) : m = e[3];
	let p = m, h = i === void 0 ? ln : i, { currentView: f } = be(), g = c?.[f]?.admin ?? a, k = c?.[f]?.lexical, N;
	e[4] !== h || e[5] !== k ? (N = typeof k == "function" ? k(h) : k ?? h, e[4] = h, e[5] = k, e[6] = N) : N = e[6];
	let R = N, { config: T } = se$4(), [C, x] = (0, import_react.useState)(null), b, _;
	e[7] !== r || e[8] !== T || e[9] !== f || e[10] !== g || e[11] !== R || e[12] !== p || e[13] !== l || e[14] !== s || e[15] !== C || e[16] !== d || e[17] !== c ? (b = () => {
		if (C && C.view === f) return;
		let I = c?.[f], y = I?.filterFeatures ? I.filterFeatures(r) : r, S = [];
		for (let L of Object.values(y)) L.clientFeatureProvider && S.push(L.clientFeatureProvider(L.clientFeatureProps));
		x(sn(ac({
			config: T,
			featureClientImportMap: p,
			featureClientSchemaMap: l,
			field: s,
			schemaPath: d ?? s.name,
			unSanitizedEditorConfig: {
				features: S,
				lexical: R
			}
		}), R, g, f));
	}, _ = [
		g,
		r,
		T,
		p,
		l,
		s,
		C,
		R,
		d,
		f,
		c
	], e[7] = r, e[8] = T, e[9] = f, e[10] = g, e[11] = R, e[12] = p, e[13] = l, e[14] = s, e[15] = C, e[16] = d, e[17] = c, e[18] = b, e[19] = _) : (b = e[18], _ = e[19]), (0, import_react.useEffect)(b, _);
	let D;
	return e[20] !== C || e[21] !== t ? (D = (0, import_jsx_runtime.jsx)(import_react.Suspense, {
		fallback: (0, import_jsx_runtime.jsx)(le$5, { height: "35vh" }),
		children: C && (0, import_react.createElement)(pC, {
			...t,
			editorConfig: C,
			key: C.view
		})
	}), e[20] = C, e[21] = t, e[22] = D) : D = e[22], D;
};
//#endregion
export { Do$1 as $, H$3 as A, me$3 as At, be$2 as B, xs$1 as Bt, bt$2 as C, Yi$1 as Ct, se$1 as D, ec as Dt, ke$3 as E, be$3 as Et, G$4 as F, qs as Ft, a$1 as G, o$4 as Gt, U$2 as H, z$5 as Ht, de$3 as I, re$2 as It, F$7 as J, H$8 as K, r$3 as Kt, he$2 as L, we$3 as Lt, ne$2 as M, qe$2 as Mt, oe$3 as N, ql$1 as Nt, ue$1 as O, eo$1 as Ot, pt$4 as P, qn$1 as Pt, Ce$2 as Q, _$2 as R, wr as Rt, _t$3 as S, Ye$2 as St, F$3 as T, Zn$1 as Tt, W$1 as U, ze$2 as Ut, At$5 as V, yr$1 as Vt, le$3 as W, zo$1 as Wt, $r$2 as X, $e$2 as Y, Bn as Z, pr$1 as _, Rn$2 as _t, we as a, Io$1 as at, Ot$3 as b, Vi as bt, Br$1 as c, Jr as ct, Vr as d, Me$2 as dt, Ge$1 as et, Wo as f, Mo$1 as ft, nn$1 as g, Pi$1 as gt, bt$1 as h, Pe$4 as ht, te as i, Ii$1 as it, gt$3 as j, oe$5 as jt, xe as k, lr$2 as kt, G$2 as l, Ki$1 as lt, be as m, Or$1 as mt, Te as n, He$3 as nt, l$1 as o, Is$1 as ot, Xr as p, Ms$1 as pt, I$4 as q, t$4 as qt, client_exports as r, Hn$2 as rt, $r$1 as s, Je$1 as st, J as t, Gl$1 as tt, Ur$1 as u, Li$1 as ut, Jt$2 as v, Ue$3 as vt, s$2 as w, Yl$1 as wt, Tt$3 as x, Wn$1 as xt, Mt$3 as y, Ve$2 as yt, Dt$5 as z, xe$1 as zt };
