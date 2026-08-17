import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { F as Yu, at as hx, kt as xF, mn as WP, pt as mt, w as NC } from "./client-CJQLBaQM.js";
import { i as useSearchParams } from "./navigation-CdlVNq_2.js";
//#region node_modules/@payloadcms/next/dist/views/Versions/index.client.js
var import_compiler_runtime = require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var VersionsViewClient = (props) => {
	const $ = (0, import_compiler_runtime.c)(13);
	const { baseClass, columns, paginationLimits } = props;
	const { data, handlePageChange, handlePerPageChange } = mt();
	const searchParams = useSearchParams();
	let t0;
	if ($[0] !== searchParams) {
		t0 = searchParams.get("limit");
		$[0] = searchParams;
		$[1] = t0;
	} else t0 = $[1];
	const limit = t0;
	const { i18n } = WP();
	const versionCount = data?.totalDocs || 0;
	const t1 = !data;
	let t2;
	if ($[2] !== baseClass || $[3] !== columns || $[4] !== data || $[5] !== handlePageChange || $[6] !== handlePerPageChange || $[7] !== i18n || $[8] !== limit || $[9] !== paginationLimits || $[10] !== t1 || $[11] !== versionCount) {
		t2 = (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
			(0, import_jsx_runtime.jsx)(xF, {
				name: "versions",
				show: t1
			}),
			versionCount === 0 && (0, import_jsx_runtime.jsx)("div", {
				className: `${baseClass}__no-versions`,
				children: i18n.t("version:noFurtherVersionsFound")
			}),
			versionCount > 0 && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsx)(NC, {
				columns,
				data: data?.docs
			}), (0, import_jsx_runtime.jsxs)("div", {
				className: `${baseClass}__page-controls`,
				children: [(0, import_jsx_runtime.jsx)(Yu, {
					hasNextPage: data.hasNextPage,
					hasPrevPage: data.hasPrevPage,
					limit: data.limit,
					nextPage: data.nextPage,
					numberOfNeighbors: 1,
					onChange: handlePageChange,
					page: data.page,
					prevPage: data.prevPage,
					totalPages: data.totalPages
				}), data?.totalDocs > 0 && (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [(0, import_jsx_runtime.jsxs)("div", {
					className: `${baseClass}__page-info`,
					children: [
						data.page * data.limit - (data.limit - 1),
						"-",
						data.totalPages > 1 && data.totalPages !== data.page ? data.limit * data.page : data.totalDocs,
						" ",
						i18n.t("general:of"),
						" ",
						data.totalDocs
					]
				}), (0, import_jsx_runtime.jsx)(hx, {
					handleChange: handlePerPageChange,
					limit: limit ? Number(limit) : 10,
					limits: paginationLimits
				})] })]
			})] })
		] });
		$[2] = baseClass;
		$[3] = columns;
		$[4] = data;
		$[5] = handlePageChange;
		$[6] = handlePerPageChange;
		$[7] = i18n;
		$[8] = limit;
		$[9] = paginationLimits;
		$[10] = t1;
		$[11] = versionCount;
		$[12] = t2;
	} else t2 = $[12];
	return t2;
};
//#endregion
export { VersionsViewClient };
