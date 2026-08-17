import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { bn as se, l as Er, mn as WP, yt as re, z as _o } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/views/NotFound/index.client.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "not-found";
var NotFoundClient = (props) => {
	const $ = (0, import_compiler_runtime.c)(10);
	const { marginTop: t0 } = props;
	const marginTop = t0 === void 0 ? "large" : t0;
	const { setStepNav } = Er();
	const { t } = WP();
	const { config: t1 } = se();
	const { routes: t2 } = t1;
	const { admin: adminRoute } = t2;
	let t3;
	let t4;
	if ($[0] !== setStepNav || $[1] !== t) {
		t3 = () => {
			setStepNav([{ label: t("general:notFound") }]);
		};
		t4 = [setStepNav, t];
		$[0] = setStepNav;
		$[1] = t;
		$[2] = t3;
		$[3] = t4;
	} else {
		t3 = $[2];
		t4 = $[3];
	}
	(0, import_react.useEffect)(t3, t4);
	const t5 = marginTop && `${baseClass}--margin-top-${marginTop}`;
	let t6;
	if ($[4] !== t5) {
		t6 = [baseClass, t5].filter(Boolean);
		$[4] = t5;
		$[5] = t6;
	} else t6 = $[5];
	const t7 = t6.join(" ");
	let t8;
	if ($[6] !== adminRoute || $[7] !== t || $[8] !== t7) {
		t8 = (0, import_jsx_runtime.jsx)("div", {
			className: t7,
			children: (0, import_jsx_runtime.jsxs)(_o, {
				className: `${baseClass}__wrap`,
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}__content`,
					children: [(0, import_jsx_runtime.jsx)("h1", { children: t("general:nothingFound") }), (0, import_jsx_runtime.jsx)("p", { children: t("general:sorryNotFound") })]
				}), (0, import_jsx_runtime.jsx)(re, {
					className: `${baseClass}__button`,
					el: "link",
					size: "large",
					to: adminRoute,
					children: t("general:backToDashboard")
				})]
			})
		});
		$[6] = adminRoute;
		$[7] = t;
		$[8] = t7;
		$[9] = t8;
	} else t8 = $[9];
	return t8;
};
//#endregion
export { NotFoundClient };
