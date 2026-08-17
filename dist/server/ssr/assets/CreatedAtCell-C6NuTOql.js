import { n as require_jsx_runtime } from "../index.js";
import { b as Ke, bn as se, bt as se$1, mn as WP } from "./client-CJQLBaQM.js";
import { i as useSearchParams, n as usePathname, r as useRouter } from "./navigation-CdlVNq_2.js";
import { t as M } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/views/Version/SelectComparison/VersionDrawer/CreatedAtCell.js
var import_jsx_runtime = require_jsx_runtime();
var VersionDrawerCreatedAtCell = (t0) => {
	const { rowData: t1 } = t0;
	const { id, updatedAt } = t1 === void 0 ? {} : t1;
	const { config: t2 } = se();
	const { admin: t3 } = t2;
	const { dateFormat } = t3;
	const { closeAllModals } = se$1();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { startRouteTransition } = Ke();
	const { i18n } = WP();
	return (0, import_jsx_runtime.jsx)("button", {
		className: "created-at-cell",
		onClick: () => {
			closeAllModals();
			const current = new URLSearchParams(Array.from(searchParams.entries()));
			if (id) current.set("versionFrom", String(id));
			const search = current.toString();
			const query = search ? `?${search}` : "";
			startRouteTransition(() => router.push(`${pathname}${query}`));
		},
		type: "button",
		children: M({
			date: updatedAt,
			i18n,
			pattern: dateFormat
		})
	});
};
//#endregion
export { VersionDrawerCreatedAtCell };
