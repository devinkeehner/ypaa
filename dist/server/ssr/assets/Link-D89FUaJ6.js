import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { r as useRouter } from "./navigation-CdlVNq_2.js";
import { t as Link$1 } from "./link-B4TgbXTk.js";
require_compiler_runtime();
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var RouteTransitionContext = /* @__PURE__ */ import_react.createContext({
	isTransitioning: false,
	startRouteTransition: (callback) => {
		if (typeof callback === "function") callback();
	},
	transitionProgress: 0
});
/**
* Use this hook to access the `RouteTransitionContext` provided by the `RouteTransitionProvider`.
* To start a transition, fire the `startRouteTransition` method with a provided callback to run while the transition takes place.
* @returns The `RouteTransitionContext` needed for transitioning between routes, including `isTransitioning`, `startRouteTransition`, and `transitionProgress`.
* @example
* 'use client'
* import React, { useCallback } from 'react'
* import { useTransition } from '@payloadcms/ui'
* import { useRouter } from 'next/navigation'
*
* const MyComponent: React.FC = () => {
*   const router = useRouter()
*   const { startRouteTransition } = useRouteTransition()
*
*   const redirectSomewhere = useCallback(() => {
*     startRouteTransition(() => router.push('/somewhere'))
*   }, [startRouteTransition, router])
*
*   // ...
* }
*/
var useRouteTransition = () => import_react.use(RouteTransitionContext);
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Link/formatUrl.js
var slashedProtocols = /https?|ftp|gopher|file/;
function stringifyUrlQueryParam(param) {
	if (typeof param === "string" || typeof param === "number" && !isNaN(param) || typeof param === "boolean") return String(param);
	else return "";
}
function urlQueryToSearchParams(urlQuery) {
	const result = new URLSearchParams();
	Object.entries(urlQuery).forEach(([key, value]) => {
		if (Array.isArray(value)) value.forEach((item) => result.append(key, stringifyUrlQueryParam(item)));
		else result.set(key, stringifyUrlQueryParam(value));
	});
	return result;
}
function formatUrl(urlObj) {
	let { auth } = urlObj;
	const { hostname } = urlObj;
	let protocol = urlObj.protocol || "";
	let pathname = urlObj.pathname || "";
	let hash = urlObj.hash || "";
	let query = urlObj.query || "";
	let host = false;
	auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@" : "";
	if (urlObj.host) host = auth + urlObj.host;
	else if (hostname) {
		host = auth + (~hostname.indexOf(":") ? `[${hostname}]` : hostname);
		if (urlObj.port) host += ":" + urlObj.port;
	}
	if (query && typeof query === "object") query = String(urlQueryToSearchParams(query));
	let search = urlObj.search || query && `?${query}` || "";
	if (protocol && !protocol.endsWith(":")) protocol += ":";
	if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
		host = "//" + (host || "");
		if (pathname && pathname[0] !== "/") pathname = "/" + pathname;
	} else if (!host) host = "";
	if (hash && hash[0] !== "#") hash = "#" + hash;
	if (search && search[0] !== "?") search = "?" + search;
	pathname = pathname.replace(/[?#]/g, encodeURIComponent);
	search = search.replace("#", "%23");
	return `${protocol}${host}${pathname}${search}${hash}`;
}
//#endregion
//#region node_modules/@payloadcms/ui/dist/elements/Link/index.js
var NextLink = "default" in Link$1 ? Link$1.default : Link$1;
function isModifiedEvent(event) {
	const target = event.currentTarget.getAttribute("target");
	return target && target !== "_self" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.nativeEvent && event.nativeEvent.which === 2;
}
var Link = ({ children, href, onClick, preventDefault = true, ref, replace, scroll, ...rest }) => {
	const router = useRouter();
	const { startRouteTransition } = useRouteTransition();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NextLink, {
		href,
		onClick: (e) => {
			if (isModifiedEvent(e)) return;
			if (onClick) onClick(e);
			if (preventDefault) e.preventDefault();
			const url = typeof href === "string" ? href : formatUrl(href);
			const navigate = () => {
				if (replace) router.replace(url, { scroll });
				else router.push(url, { scroll });
			};
			startRouteTransition(navigate);
		},
		ref,
		...rest,
		children
	});
};
//#endregion
export { Link as t };
