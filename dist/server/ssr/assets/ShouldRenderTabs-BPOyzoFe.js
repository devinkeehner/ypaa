import { g as Ie } from "./client-CJQLBaQM.js";
//#region node_modules/@payloadcms/next/dist/elements/DocumentHeader/Tabs/ShouldRenderTabs.js
var ShouldRenderTabs = (t0) => {
	const { children } = t0;
	const { id: idFromContext, collectionSlug, globalSlug } = Ie();
	if (collectionSlug && (idFromContext !== "create" ? idFromContext : null) || globalSlug) return children;
	return null;
};
//#endregion
export { ShouldRenderTabs };
