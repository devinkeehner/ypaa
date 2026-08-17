import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { Qt as formatAdminURL, yt as re } from "./client-CJQLBaQM.js";
import { i as useSearchParams, n as usePathname, t as useParams } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/elements/DocumentHeader/Tabs/Tab/TabLink.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
require_react();
var DocumentTabLink = (t0) => {
	const $ = (0, import_compiler_runtime.c)(13);
	const { adminRoute, ariaLabel, baseClass, children, href: hrefFromProps, isActive: isActiveFromProps, newTab } = t0;
	const pathname = usePathname();
	const params = useParams();
	const locale = useSearchParams().get("locale");
	const [entityType, entitySlug, segmentThree, segmentFour] = params.segments || [];
	const isCollection = entityType === "collections";
	const t1 = `/${isCollection ? "collections" : "globals"}/${entitySlug}`;
	let t2;
	if ($[0] !== adminRoute || $[1] !== t1) {
		t2 = formatAdminURL({
			adminRoute,
			path: t1
		});
		$[0] = adminRoute;
		$[1] = t1;
		$[2] = t2;
	} else t2 = $[2];
	let docPath = t2;
	if (isCollection) {
		if (segmentThree === "trash" && segmentFour) docPath = docPath + `/trash/${segmentFour}`;
		else if (segmentThree) docPath = docPath + `/${segmentThree}`;
	}
	const href = `${docPath}${hrefFromProps}`;
	const hrefWithLocale = `${href}${locale ? `?locale=${locale}` : ""}`;
	let t3;
	if ($[3] !== ariaLabel || $[4] !== baseClass || $[5] !== children || $[6] !== docPath || $[7] !== href || $[8] !== hrefWithLocale || $[9] !== isActiveFromProps || $[10] !== newTab || $[11] !== pathname) {
		const isActive = href === docPath && pathname === docPath || href !== docPath && pathname.startsWith(href) || isActiveFromProps;
		t3 = (0, import_jsx_runtime.jsx)(re, {
			"aria-label": ariaLabel,
			buttonStyle: "tab",
			className: [baseClass, isActive && `${baseClass}--active`].filter(Boolean).join(" "),
			disabled: isActive,
			el: !isActive || href !== pathname ? "link" : "div",
			margin: false,
			newTab,
			size: "medium",
			to: !isActive || href !== pathname ? hrefWithLocale : void 0,
			children
		});
		$[3] = ariaLabel;
		$[4] = baseClass;
		$[5] = children;
		$[6] = docPath;
		$[7] = href;
		$[8] = hrefWithLocale;
		$[9] = isActiveFromProps;
		$[10] = newTab;
		$[11] = pathname;
		$[12] = t3;
	} else t3 = $[12];
	return t3;
};
//#endregion
export { DocumentTabLink };
