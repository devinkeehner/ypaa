import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { g as Ie } from "./client-CJQLBaQM.js";
//#region components/admin/delete-page-button.module.css
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var delete_page_button_module_default = {
	wrapper: "_wrapper_13yed_1",
	button: "_button_13yed_13",
	status: "_status_13yed_57"
};
//#endregion
//#region components/admin/DeletePageButton.tsx
var import_jsx_runtime = require_jsx_runtime();
function DeletePageButton({ id }) {
	const { hasDeletePermission, id: documentID } = Ie();
	const [status, setStatus] = (0, import_react.useState)("");
	const resolvedID = id ?? documentID;
	const pageID = resolvedID === void 0 || resolvedID === null ? "" : String(resolvedID);
	if (!pageID || hasDeletePermission === false) return null;
	async function deletePage() {
		if (!window.confirm("Delete this page permanently? This cannot be undone.")) return;
		setStatus("Deleting…");
		try {
			const response = await fetch(`/api/pages/${encodeURIComponent(pageID)}?depth=0`, {
				credentials: "same-origin",
				method: "DELETE"
			});
			if (!response.ok) {
				const body = await response.text();
				throw new Error(body || "Payload could not delete this page.");
			}
			window.location.assign("/admin/collections/pages");
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Unable to delete this page.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: delete_page_button_module_default.wrapper,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			className: delete_page_button_module_default.button,
			onClick: () => void deletePage(),
			type: "button",
			children: "Delete page"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			"aria-live": "polite",
			className: delete_page_button_module_default.status,
			role: "status",
			children: status
		})]
	});
}
//#endregion
export { DeletePageButton as default };
