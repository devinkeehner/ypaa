import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import "./navigation-CdlVNq_2.js";
import { t as enUS } from "./en-US-BnXdOesP.js";
import { t as Tooltip } from "./Tooltip-D6Q6qfyv.js";
//#region node_modules/@payloadcms/ui/dist/icons/Lock/index.scss
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var import_compiler_runtime = require_compiler_runtime();
//#endregion
//#region node_modules/@payloadcms/ui/dist/icons/Lock/index.js
var LockIcon = ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
	className: ["icon icon--lock", className].filter(Boolean).join(" "),
	fill: "none",
	height: "20",
	viewBox: "0 0 20 20",
	width: "20",
	xmlns: "http://www.w3.org/2000/svg",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M7.5 9.5V7.5C7.5 6.83696 7.76339 6.20107 8.23223 5.73223C8.70107 5.26339 9.33696 5 10 5C10.663 5 11.2989 5.26339 11.7678 5.73223C12.2366 6.20107 12.5 6.83696 12.5 7.5V9.5",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		strokeOpacity: "1"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		className: "stroke",
		d: "M13.5 9.5H6.5C5.94772 9.5 5.5 9.94772 5.5 10.5V14C5.5 14.5523 5.94772 15 6.5 15H13.5C14.0523 15 14.5 14.5523 14.5 14V10.5C14.5 9.94772 14.0523 9.5 13.5 9.5Z",
		stopOpacity: "1",
		strokeLinecap: "round",
		strokeLinejoin: "round"
	})]
});
//#endregion
//#region node_modules/@payloadcms/ui/dist/providers/Translation/index.js
var Context = /* @__PURE__ */ (0, import_react.createContext)({
	i18n: {
		dateFNS: enUS,
		dateFNSKey: "en-US",
		fallbackLanguage: "en",
		language: "en",
		t: (key) => key,
		translations: {}
	},
	languageOptions: void 0,
	switchLanguage: void 0,
	t: (key) => void 0
});
var useTranslation = () => (0, import_react.use)(Context);
//#endregion
//#region node_modules/@payloadcms/ui/dist/utilities/isClientUserObject.js
var isClientUserObject = (user) => {
	return user && typeof user === "object";
};
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Locked/index.js
var baseClass = "locked";
var Locked = (t0) => {
	const $ = (0, import_compiler_runtime.c)(8);
	const { className, user } = t0;
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const { t } = useTranslation();
	const userToUse = isClientUserObject(user) ? user.email ?? user.id : t("general:anotherUser");
	let t1;
	if ($[0] !== className) {
		t1 = [baseClass, className].filter(Boolean);
		$[0] = className;
		$[1] = t1;
	} else t1 = $[1];
	const t2 = t1.join(" ");
	let t3;
	let t4;
	if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
		t3 = () => setHovered(true);
		t4 = () => setHovered(false);
		$[2] = t3;
		$[3] = t4;
	} else {
		t3 = $[2];
		t4 = $[3];
	}
	const t5 = `${userToUse} ${t("general:isEditing")}`;
	let t6;
	if ($[4] !== hovered || $[5] !== t2 || $[6] !== t5) {
		t6 = (0, import_jsx_runtime.jsxs)("div", {
			className: t2,
			onMouseEnter: t3,
			onMouseLeave: t4,
			role: "button",
			tabIndex: 0,
			children: [(0, import_jsx_runtime.jsx)(Tooltip, {
				alignCaret: "left",
				className: `${baseClass}__tooltip`,
				position: "top",
				show: hovered,
				children: t5
			}), (0, import_jsx_runtime.jsx)(LockIcon, {})]
		});
		$[4] = hovered;
		$[5] = t2;
		$[6] = t5;
		$[7] = t6;
	} else t6 = $[7];
	return t6;
};
//#endregion
export { Locked };
