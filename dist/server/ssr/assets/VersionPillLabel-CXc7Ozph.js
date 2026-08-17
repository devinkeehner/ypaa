import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { At as xe, Nt as yt, bn as se, mn as WP } from "./client-CJQLBaQM.js";
import { t as M } from "./shared-jREwlcRe.js";
//#region node_modules/@payloadcms/next/dist/views/Version/VersionPillLabel/getVersionLabel.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var import_compiler_runtime = require_compiler_runtime();
/**
* Gets the appropriate version label and version pill styling
* given existing versions and the current version status.
*/ function getVersionLabel({ currentLocale, currentlyPublishedVersion, latestDraftVersion, t, version }) {
	const status = version.version._status;
	if (status === "draft") {
		if (currentlyPublishedVersion?.updatedAt > latestDraftVersion?.updatedAt) return {
			name: "draft",
			label: t("version:draft"),
			pillStyle: "light"
		};
		const isCurrentDraft = version.id === latestDraftVersion?.id;
		return {
			name: isCurrentDraft ? "currentDraft" : "draft",
			label: isCurrentDraft ? t("version:currentDraft") : t("version:draft"),
			pillStyle: "light"
		};
	}
	if (status === "published" && version.publishedLocale && currentLocale !== version.publishedLocale) return {
		name: "currentDraft",
		label: t("version:currentDraft"),
		pillStyle: "light"
	};
	const isCurrentlyPublished = currentlyPublishedVersion && version.id === currentlyPublishedVersion.id;
	return {
		name: isCurrentlyPublished ? "currentlyPublished" : "previouslyPublished",
		label: isCurrentlyPublished ? t("version:currentlyPublished") : t("version:previouslyPublished"),
		pillStyle: isCurrentlyPublished ? "success" : "light"
	};
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/VersionPillLabel/VersionPillLabel.js
var baseClass = "version-pill-label";
var renderPill = (label, pillStyle) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(yt, {
		pillStyle,
		size: "small",
		children: label
	});
};
var VersionPillLabel = (t0) => {
	const $ = (0, import_compiler_runtime.c)(14);
	const { currentlyPublishedVersion, disableDate: t1, doc, labelFirst: t2, labelOverride, labelStyle: t3, labelSuffix, latestDraftVersion } = t0;
	const disableDate = t1 === void 0 ? false : t1;
	const labelFirst = t2 === void 0 ? false : t2;
	const labelStyle = t3 === void 0 ? "pill" : t3;
	const { config: t4 } = se();
	const { admin: t5, localization } = t4;
	const { dateFormat } = t5;
	const { i18n, t } = WP();
	const { code: currentLocale } = xe();
	let t6;
	if ($[0] !== currentLocale || $[1] !== currentlyPublishedVersion || $[2] !== dateFormat || $[3] !== disableDate || $[4] !== doc || $[5] !== i18n || $[6] !== labelFirst || $[7] !== labelOverride || $[8] !== labelStyle || $[9] !== labelSuffix || $[10] !== latestDraftVersion || $[11] !== localization || $[12] !== t) {
		const { label, pillStyle } = getVersionLabel({
			currentLocale,
			currentlyPublishedVersion,
			latestDraftVersion,
			t,
			version: doc
		});
		const labelText = (0, import_jsx_runtime.jsxs)("span", { children: [labelOverride || label, labelSuffix] });
		const showDate = !disableDate && doc.updatedAt;
		const formattedDate = showDate ? M({
			date: doc.updatedAt,
			i18n,
			pattern: dateFormat
		}) : null;
		const localeCode = Array.isArray(doc.publishedLocale) ? doc.publishedLocale[0] : doc.publishedLocale;
		const locale = localization && localization?.locales ? localization.locales.find((loc) => loc.code === localeCode) : null;
		const localeLabel = locale ? locale?.label?.[i18n?.language] || locale?.label : null;
		t6 = (0, import_jsx_runtime.jsxs)("div", {
			className: baseClass,
			children: [labelFirst ? (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [labelStyle === "pill" ? renderPill(labelText, pillStyle) : (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}-text`,
				children: labelText
			}), showDate && (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}-date`,
				children: formattedDate
			})] }) : (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [showDate && (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}-date`,
				children: formattedDate
			}), labelStyle === "pill" ? renderPill(labelText, pillStyle) : (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}-text`,
				children: labelText
			})] }), localeLabel && (0, import_jsx_runtime.jsx)(yt, {
				size: "small",
				children: localeLabel
			})]
		});
		$[0] = currentLocale;
		$[1] = currentlyPublishedVersion;
		$[2] = dateFormat;
		$[3] = disableDate;
		$[4] = doc;
		$[5] = i18n;
		$[6] = labelFirst;
		$[7] = labelOverride;
		$[8] = labelStyle;
		$[9] = labelSuffix;
		$[10] = latestDraftVersion;
		$[11] = localization;
		$[12] = t;
		$[13] = t6;
	} else t6 = $[13];
	return t6;
};
//#endregion
export { VersionPillLabel };
