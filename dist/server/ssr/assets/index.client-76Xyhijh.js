import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { $ as gK, O as Qt, Qt as formatAdminURL, R as _K, bn as se, gn as getTranslation, mn as WP } from "./client-CJQLBaQM.js";
import { n as usePathname } from "./navigation-CdlVNq_2.js";
import { o as x } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/elements/Nav/index.client.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var baseClass = "nav";
/**
* @internal
*/
var DefaultNavClient = (t0) => {
	const $ = (0, import_compiler_runtime.c)(13);
	const { groups, navPreferences } = t0;
	const pathname = usePathname();
	const { config: t1 } = se();
	const { admin: t2, folders, routes: t3 } = t1;
	const { routes: t4 } = t2;
	const { browseByFolder: foldersRoute } = t4;
	const { admin: adminRoute } = t3;
	const { i18n } = WP();
	let t5;
	if ($[0] !== adminRoute || $[1] !== folders || $[2] !== foldersRoute || $[3] !== groups || $[4] !== i18n || $[5] !== navPreferences?.groups || $[6] !== pathname) {
		const folderURL = formatAdminURL({
			adminRoute,
			path: foldersRoute
		});
		const viewingRootFolderView = pathname.startsWith(folderURL);
		let t6;
		if ($[8] !== adminRoute || $[9] !== i18n || $[10] !== navPreferences?.groups || $[11] !== pathname) {
			t6 = (t7, key) => {
				const { entities, label } = t7;
				return (0, import_jsx_runtime.jsx)(gK, {
					isOpen: navPreferences?.groups?.[label]?.open,
					label,
					children: entities.map((t8, i) => {
						const { slug, type, label: label_0 } = t8;
						let href;
						let id;
						if (type === x.collection) {
							href = formatAdminURL({
								adminRoute,
								path: `/collections/${slug}`
							});
							id = `nav-${slug}`;
						}
						if (type === x.global) {
							href = formatAdminURL({
								adminRoute,
								path: `/globals/${slug}`
							});
							id = `nav-global-${slug}`;
						}
						const Label = (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [pathname.startsWith(href) && ["/", void 0].includes(pathname[href.length]) && (0, import_jsx_runtime.jsx)("div", { className: `${baseClass}__link-indicator` }), (0, import_jsx_runtime.jsx)("span", {
							className: `${baseClass}__link-label`,
							children: getTranslation(label_0, i18n)
						})] });
						if (pathname === href) return (0, import_jsx_runtime.jsx)("div", {
							className: `${baseClass}__link`,
							id,
							children: Label
						}, i);
						return (0, import_jsx_runtime.jsx)(Qt, {
							className: `${baseClass}__link`,
							href,
							id,
							prefetch: false,
							children: Label
						}, i);
					})
				}, key);
			};
			$[8] = adminRoute;
			$[9] = i18n;
			$[10] = navPreferences?.groups;
			$[11] = pathname;
			$[12] = t6;
		} else t6 = $[12];
		t5 = (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [folders && folders.browseByFolder && (0, import_jsx_runtime.jsx)(_K, { active: viewingRootFolderView }), groups.map(t6)] });
		$[0] = adminRoute;
		$[1] = folders;
		$[2] = foldersRoute;
		$[3] = groups;
		$[4] = i18n;
		$[5] = navPreferences?.groups;
		$[6] = pathname;
		$[7] = t5;
	} else t5 = $[7];
	return t5;
};
//#endregion
export { DefaultNavClient };
