import { C as require_react, j as __toESM } from "../index.js";
//#region components/admin/AdminRuntimeRecovery.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var RELOAD_KEY = "necypaa-admin-runtime-reload";
var RELOAD_GUARD_MS = 3e4;
function messageFrom(value) {
	if (value instanceof Error) return value.message;
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && "message" in value) return String(value.message || "");
	return "";
}
function isStaleAssetError(value) {
	return /chunkloaderror|failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed|loading chunk .+ failed/i.test(messageFrom(value));
}
function AdminRuntimeRecovery({ children }) {
	(0, import_react.useEffect)(() => {
		const invalidDocumentRoute = window.location.pathname.match(/^(\/admin\/collections\/[^/]+)\/null\/?$/);
		if (invalidDocumentRoute) {
			window.location.replace(invalidDocumentRoute[1]);
			return;
		}
		const recover = () => {
			const previous = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);
			if (Date.now() - previous < RELOAD_GUARD_MS) return;
			window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
			window.location.reload();
		};
		const onError = (event) => {
			const target = event.target;
			if (target instanceof HTMLScriptElement && target.src.includes("/assets/") || event instanceof ErrorEvent && isStaleAssetError(event.error || event.message)) recover();
		};
		const onUnhandledRejection = (event) => {
			if (isStaleAssetError(event.reason)) recover();
		};
		window.addEventListener("error", onError, true);
		window.addEventListener("unhandledrejection", onUnhandledRejection);
		return () => {
			window.removeEventListener("error", onError, true);
			window.removeEventListener("unhandledrejection", onUnhandledRejection);
		};
	}, []);
	return children;
}
//#endregion
export { AdminRuntimeRecovery as default };
