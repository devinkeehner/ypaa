import { C as require_react, j as __toESM, k as __exportAll, n as require_jsx_runtime } from "../index.js";
//#region components/site/TenantThemeProvider.tsx
var TenantThemeProvider_exports = /* @__PURE__ */ __exportAll({
	TenantThemeProvider: () => TenantThemeProvider,
	defaultTenantTheme: () => defaultTenantTheme,
	useTenantTheme: () => useTenantTheme
});
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var defaultTenantTheme = {
	logoAlt: "NECYPAA XXXVI",
	primary: "#E85E27",
	secondary: "#31275A",
	accent: "#FFD76A",
	background: "#0C0D0E",
	surface: "#15181A",
	lightBackground: "#F5EEE1",
	darkText: "#171614",
	lightText: "#F4E8D3"
};
var TenantContext = (0, import_react.createContext)(defaultTenantTheme);
function TenantThemeProvider({ children, settings }) {
	const style = {
		"--tenant-primary": settings.primary,
		"--tenant-secondary": settings.secondary,
		"--tenant-accent": settings.accent,
		"--tenant-background": settings.background,
		"--tenant-surface": settings.surface,
		"--tenant-light-background": settings.lightBackground,
		"--tenant-dark-text": settings.darkText,
		"--tenant-light-text": settings.lightText
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TenantContext.Provider, {
		value: settings,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tenant-theme",
			style,
			children
		})
	});
}
function useTenantTheme() {
	return (0, import_react.useContext)(TenantContext);
}
//#endregion
export { useTenantTheme as n, TenantThemeProvider_exports as t };
