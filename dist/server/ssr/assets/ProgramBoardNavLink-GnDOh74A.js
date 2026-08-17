import { n as require_jsx_runtime } from "../index.js";
import { n as usePathname } from "./navigation-CdlVNq_2.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
//#region node_modules/lucide-react/dist/esm/icons/calendar-range.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CalendarRange = createLucideIcon("CalendarRange", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "4",
		rx: "2",
		key: "1hopcy"
	}],
	["path", {
		d: "M16 2v4",
		key: "4m81vk"
	}],
	["path", {
		d: "M3 10h18",
		key: "8toen8"
	}],
	["path", {
		d: "M8 2v4",
		key: "1cmpym"
	}],
	["path", {
		d: "M17 14h-6",
		key: "bkmgh3"
	}],
	["path", {
		d: "M13 18H7",
		key: "bb0bb7"
	}],
	["path", {
		d: "M7 14h.01",
		key: "1qa3f1"
	}],
	["path", {
		d: "M17 18h.01",
		key: "1bdyru"
	}]
]);
//#endregion
//#region components/admin/ProgramBoardNavLink.tsx
var import_jsx_runtime = require_jsx_runtime();
function ProgramBoardNavLink() {
	const active = usePathname() === "/admin/program-board";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { margin: "8px 12px" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			"aria-current": active ? "page" : void 0,
			href: "/admin/program-board",
			style: {
				alignItems: "center",
				background: active ? "var(--theme-elevation-100)" : "transparent",
				borderRadius: 4,
				color: "var(--theme-text)",
				display: "flex",
				fontSize: 13,
				fontWeight: 600,
				gap: 10,
				padding: "10px 12px",
				textDecoration: "none"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarRange, {
				"aria-hidden": "true",
				size: 17
			}), "Program Board"]
		})
	});
}
//#endregion
export { ProgramBoardNavLink as default };
