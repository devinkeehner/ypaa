import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
//#region node_modules/@payloadcms/ui/dist/hooks/useIntersect.js
var import_jsx_runtime = require_jsx_runtime();
var import_compiler_runtime = require_compiler_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var useIntersect = (t0, disable) => {
	const $ = (0, import_compiler_runtime.c)(8);
	const { root: t1, rootMargin: t2, threshold: t3 } = t0 === void 0 ? {} : t0;
	const root = t1 === void 0 ? null : t1;
	const rootMargin = t2 === void 0 ? "0px" : t2;
	const threshold = t3 === void 0 ? 0 : t3;
	const [entry, updateEntry] = (0, import_react.useState)();
	const [node, setNode] = (0, import_react.useState)(null);
	const observer = (0, import_react.useRef)(typeof window !== "undefined" && "IntersectionObserver" in window && !disable ? new window.IntersectionObserver((t4) => {
		const [ent] = t4;
		return updateEntry(ent);
	}, {
		root,
		rootMargin,
		threshold
	}) : null);
	let t5;
	let t6;
	if ($[0] !== disable || $[1] !== node) {
		t5 = () => {
			if (disable) return;
			const { current: currentObserver } = observer;
			currentObserver.disconnect();
			if (node) currentObserver.observe(node);
			return () => currentObserver.disconnect();
		};
		t6 = [node, disable];
		$[0] = disable;
		$[1] = node;
		$[2] = t5;
		$[3] = t6;
	} else {
		t5 = $[2];
		t6 = $[3];
	}
	(0, import_react.useEffect)(t5, t6);
	let t7;
	if ($[4] !== entry || $[5] !== node || $[6] !== setNode) {
		t7 = [
			setNode,
			entry,
			node
		];
		$[4] = entry;
		$[5] = node;
		$[6] = setNode;
		$[7] = t7;
	} else t7 = $[7];
	return t7;
};
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Tooltip/index.js
var Tooltip = (props) => {
	const { alignCaret = "center", boundingRef, children, className, delay = 350, position: positionFromProps, show: showFromProps = true, staticPositioning = false } = props;
	const [show, setShow] = import_react.useState(showFromProps);
	const [position, setPosition] = import_react.useState("top");
	const getTitleAttribute = (content) => typeof content === "string" ? content : "";
	const [ref, intersectionEntry] = useIntersect({
		root: boundingRef?.current || null,
		rootMargin: "-145px 0px 0px 100px",
		threshold: 0
	}, staticPositioning);
	(0, import_react.useEffect)(() => {
		let timerID;
		if (delay && showFromProps) timerID = setTimeout(() => {
			setShow(showFromProps);
		}, delay);
		else setShow(showFromProps);
		return () => {
			if (timerID) clearTimeout(timerID);
		};
	}, [showFromProps, delay]);
	(0, import_react.useEffect)(() => {
		if (staticPositioning) return;
		setPosition(intersectionEntry?.isIntersecting ? "top" : "bottom");
	}, [intersectionEntry, staticPositioning]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [!staticPositioning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		"aria-hidden": "true",
		className: [
			"tooltip",
			className,
			`tooltip--caret-${alignCaret}`,
			"tooltip--position-top"
		].filter(Boolean).join(" "),
		ref,
		style: { opacity: "0" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tooltip-content",
			children
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: [
			"tooltip",
			className,
			show && "tooltip--show",
			`tooltip--caret-${alignCaret}`,
			`tooltip--position-${positionFromProps || position}`
		].filter(Boolean).join(" "),
		title: getTitleAttribute(children),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tooltip-content",
			children
		})
	})] });
};
//#endregion
export { Tooltip as t };
