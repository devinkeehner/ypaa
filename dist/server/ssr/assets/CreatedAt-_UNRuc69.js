import { C as require_react, n as require_jsx_runtime } from "../index.js";
import { O as Qt, Qt as formatAdminURL, bn as se, mn as WP } from "./client-CJQLBaQM.js";
import { t as M } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/views/Versions/cells/CreatedAt/index.js
var import_jsx_runtime = require_jsx_runtime();
require_react();
var CreatedAtCell = (t0) => {
	const { collectionSlug, docID, globalSlug, isTrashed, rowData: t1 } = t0;
	const { id, updatedAt } = t1 === void 0 ? {} : t1;
	const { config: t2 } = se();
	const { admin: t3, routes: t4 } = t2;
	const { dateFormat } = t3;
	const { admin: adminRoute } = t4;
	const { i18n } = WP();
	const trashedDocPrefix = isTrashed ? "trash/" : "";
	let to;
	if (collectionSlug) to = formatAdminURL({
		adminRoute,
		path: `/collections/${collectionSlug}/${trashedDocPrefix}${docID}/versions/${id}`
	});
	if (globalSlug) to = formatAdminURL({
		adminRoute,
		path: `/globals/${globalSlug}/versions/${id}`
	});
	return (0, import_jsx_runtime.jsx)(Qt, {
		href: to,
		prefetch: false,
		children: M({
			date: updatedAt,
			i18n,
			pattern: dateFormat
		})
	});
};
//#endregion
export { CreatedAtCell };
