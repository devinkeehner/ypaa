import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { I as Ze, bn as se, cn as fieldIsArrayType, dn as groupHasName, it as hw, ln as fieldIsBlockType, mn as WP, un as fieldShouldBeLocalized } from "./client-CJQLBaQM.js";
//#region node_modules/payload/dist/utilities/getUniqueListBy.js
function getUniqueListBy(arr, key) {
	return [...new Map(arr.map((item) => [item[key], item])).values()];
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/utilities/fieldHasChanges.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var import_compiler_runtime = require_compiler_runtime();
function fieldHasChanges(a, b) {
	return JSON.stringify(a) !== JSON.stringify(b);
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/utilities/getFieldsForRowComparison.js
/**
* Get the fields for a row in an iterable field for comparison.
* - Array fields: the fields of the array field, because the fields are the same for each row.
* - Blocks fields: the union of fields from the comparison and version row,
*   because the fields from the version and comparison rows may differ.
*/
function getFieldsForRowComparison({ baseVersionField, config, field, row, valueFromRow, valueToRow }) {
	let fields = [];
	let versionFields = [];
	if (field.type === "array" && "fields" in field) {
		fields = field.fields;
		versionFields = baseVersionField.rows?.length ? baseVersionField.rows[row] : baseVersionField.fields;
	} else if (field.type === "blocks") if (valueToRow?.blockType === valueFromRow?.blockType) {
		fields = (config?.blocksMap?.[valueToRow?.blockType] ?? (("blocks" in field || "blockReferences" in field) && (field.blockReferences ?? field.blocks)?.find((block) => typeof block !== "string" && block.slug === valueToRow?.blockType) || { fields: [] })).fields;
		versionFields = baseVersionField.rows?.length ? baseVersionField.rows[row] : baseVersionField.fields;
	} else {
		const matchedVersionBlock = config?.blocksMap?.[valueToRow?.blockType] ?? (("blocks" in field || "blockReferences" in field) && (field.blockReferences ?? field.blocks)?.find((block) => typeof block !== "string" && block.slug === valueToRow?.blockType) || { fields: [] });
		const matchedComparisonBlock = config?.blocksMap?.[valueFromRow?.blockType] ?? (("blocks" in field || "blockReferences" in field) && (field.blockReferences ?? field.blocks)?.find((block) => typeof block !== "string" && block.slug === valueFromRow?.blockType) || { fields: [] });
		fields = getUniqueListBy([...matchedVersionBlock.fields, ...matchedComparisonBlock.fields], "name");
		versionFields = baseVersionField.rows?.length ? baseVersionField.rows[row] : baseVersionField.fields;
	}
	return {
		fields,
		versionFields
	};
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/utilities/countChangedFields.js
/**
* Recursively counts the number of changed fields between comparison and
* version data for a given set of fields.
*/
function countChangedFields({ config, fields, locales, parentIsLocalized, valueFrom, valueTo }) {
	let count = 0;
	fields.forEach((field) => {
		if ("name" in field && field.name === "id") return;
		const fieldType = field.type;
		switch (fieldType) {
			case "array":
			case "blocks":
				if (locales && fieldShouldBeLocalized({
					field,
					parentIsLocalized
				})) locales.forEach((locale) => {
					const valueFromRows = valueFrom?.[field.name]?.[locale] ?? [];
					const valueToRows = valueTo?.[field.name]?.[locale] ?? [];
					count += countChangedFieldsInRows({
						config,
						field,
						locales,
						parentIsLocalized: parentIsLocalized || field.localized,
						valueFromRows,
						valueToRows
					});
				});
				else {
					const valueFromRows = valueFrom?.[field.name] ?? [];
					const valueToRows = valueTo?.[field.name] ?? [];
					count += countChangedFieldsInRows({
						config,
						field,
						locales,
						parentIsLocalized: parentIsLocalized || field.localized,
						valueFromRows,
						valueToRows
					});
				}
				break;
			case "checkbox":
			case "code":
			case "date":
			case "email":
			case "join":
			case "json":
			case "number":
			case "point":
			case "radio":
			case "relationship":
			case "richText":
			case "select":
			case "text":
			case "textarea":
			case "upload":
				if (locales && fieldShouldBeLocalized({
					field,
					parentIsLocalized
				})) locales.forEach((locale) => {
					if (fieldHasChanges(valueTo?.[field.name]?.[locale], valueFrom?.[field.name]?.[locale])) count++;
				});
				else if (fieldHasChanges(valueTo?.[field.name], valueFrom?.[field.name])) count++;
				break;
			case "collapsible":
			case "row":
				count += countChangedFields({
					config,
					fields: field.fields,
					locales,
					parentIsLocalized: parentIsLocalized || field.localized,
					valueFrom,
					valueTo
				});
				break;
			case "group":
				if (groupHasName(field)) if (locales && fieldShouldBeLocalized({
					field,
					parentIsLocalized
				})) locales.forEach((locale) => {
					count += countChangedFields({
						config,
						fields: field.fields,
						locales,
						parentIsLocalized: parentIsLocalized || field.localized,
						valueFrom: valueFrom?.[field.name]?.[locale],
						valueTo: valueTo?.[field.name]?.[locale]
					});
				});
				else count += countChangedFields({
					config,
					fields: field.fields,
					locales,
					parentIsLocalized: parentIsLocalized || field.localized,
					valueFrom: valueFrom?.[field.name],
					valueTo: valueTo?.[field.name]
				});
				else count += countChangedFields({
					config,
					fields: field.fields,
					locales,
					parentIsLocalized: parentIsLocalized || field.localized,
					valueFrom,
					valueTo
				});
				break;
			case "tabs":
				field.tabs.forEach((tab) => {
					if ("name" in tab && locales && tab.localized) locales.forEach((locale) => {
						count += countChangedFields({
							config,
							fields: tab.fields,
							locales,
							parentIsLocalized: parentIsLocalized || tab.localized,
							valueFrom: valueFrom?.[tab.name]?.[locale],
							valueTo: valueTo?.[tab.name]?.[locale]
						});
					});
					else if ("name" in tab) count += countChangedFields({
						config,
						fields: tab.fields,
						locales,
						parentIsLocalized: parentIsLocalized || tab.localized,
						valueFrom: valueFrom?.[tab.name],
						valueTo: valueTo?.[tab.name]
					});
					else count += countChangedFields({
						config,
						fields: tab.fields,
						locales,
						parentIsLocalized: parentIsLocalized || tab.localized,
						valueFrom,
						valueTo
					});
				});
				break;
			case "ui": break;
			default: throw new Error(`Unexpected field.type in countChangedFields : ${String(fieldType)}`);
		}
	});
	return count;
}
function countChangedFieldsInRows({ config, field, locales, parentIsLocalized, valueFromRows = [], valueToRows = [] }) {
	let count = 0;
	let i = 0;
	while (valueFromRows[i] || valueToRows[i]) {
		const valueFromRow = valueFromRows?.[i] || {};
		const valueToRow = valueToRows?.[i] || {};
		const { fields: rowFields } = getFieldsForRowComparison({
			baseVersionField: {
				type: "text",
				fields: [],
				path: "",
				schemaPath: ""
			},
			config,
			field,
			row: i,
			valueFromRow,
			valueToRow
		});
		count += countChangedFields({
			config,
			fields: rowFields,
			locales,
			parentIsLocalized: parentIsLocalized || field.localized,
			valueFrom: valueFromRow,
			valueTo: valueToRow
		});
		i++;
	}
	return count;
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Version/RenderFieldsToDiff/DiffCollapser/index.js
var baseClass = "diff-collapser";
var DiffCollapser = (t0) => {
	const $ = (0, import_compiler_runtime.c)(19);
	const { children, field, fields, hideGutter: t1, initCollapsed: t2, isIterable: t3, Label, locales, parentIsLocalized, valueFrom, valueTo } = t0;
	const hideGutter = t1 === void 0 ? false : t1;
	const initCollapsed = t2 === void 0 ? false : t2;
	const isIterable = t3 === void 0 ? false : t3;
	const { t } = WP();
	const [isCollapsed, setIsCollapsed] = (0, import_react.useState)(initCollapsed);
	const { config } = se();
	let t4;
	if ($[0] !== Label || $[1] !== children || $[2] !== config || $[3] !== field || $[4] !== fields || $[5] !== hideGutter || $[6] !== isCollapsed || $[7] !== isIterable || $[8] !== locales || $[9] !== parentIsLocalized || $[10] !== t || $[11] !== valueFrom || $[12] !== valueTo) {
		let changeCount;
		if (isIterable) {
			if (!fieldIsArrayType(field) && !fieldIsBlockType(field)) throw new Error("DiffCollapser: field must be an array or blocks field when isIterable is true");
			const valueFromRows = valueFrom ?? [];
			const valueToRows = valueTo ?? [];
			if (!Array.isArray(valueFromRows) || !Array.isArray(valueToRows)) throw new Error("DiffCollapser: valueFrom and valueTro must be arrays when isIterable is true");
			changeCount = countChangedFieldsInRows({
				config,
				field,
				locales,
				parentIsLocalized,
				valueFromRows,
				valueToRows
			});
		} else changeCount = countChangedFields({
			config,
			fields,
			locales,
			parentIsLocalized,
			valueFrom,
			valueTo
		});
		const t5 = isCollapsed && `${baseClass}__content--is-collapsed`;
		const t6 = hideGutter && `${baseClass}__content--hide-gutter`;
		let t7;
		if ($[14] !== t5 || $[15] !== t6) {
			t7 = [
				`${baseClass}__content`,
				t5,
				t6
			].filter(Boolean);
			$[14] = t5;
			$[15] = t6;
			$[16] = t7;
		} else t7 = $[16];
		const contentClassNames = t7.join(" ");
		let t8;
		if ($[17] !== isCollapsed) {
			t8 = () => setIsCollapsed(!isCollapsed);
			$[17] = isCollapsed;
			$[18] = t8;
		} else t8 = $[18];
		t4 = (0, import_jsx_runtime.jsxs)("div", {
			className: baseClass,
			children: [(0, import_jsx_runtime.jsxs)(hw, { children: [(0, import_jsx_runtime.jsxs)("button", {
				"aria-label": isCollapsed ? "Expand" : "Collapse",
				className: `${baseClass}__toggle-button`,
				onClick: t8,
				type: "button",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: `${baseClass}__label`,
					children: Label
				}), (0, import_jsx_runtime.jsx)(Ze, {
					direction: isCollapsed ? "right" : "down",
					size: "small"
				})]
			}), changeCount > 0 && isCollapsed && (0, import_jsx_runtime.jsx)("span", {
				className: `${baseClass}__field-change-count`,
				children: t("version:changedFieldsCount", { count: changeCount })
			})] }), (0, import_jsx_runtime.jsx)("div", {
				className: contentClassNames,
				children
			})]
		});
		$[0] = Label;
		$[1] = children;
		$[2] = config;
		$[3] = field;
		$[4] = fields;
		$[5] = hideGutter;
		$[6] = isCollapsed;
		$[7] = isIterable;
		$[8] = locales;
		$[9] = parentIsLocalized;
		$[10] = t;
		$[11] = valueFrom;
		$[12] = valueTo;
		$[13] = t4;
	} else t4 = $[13];
	return t4;
};
//#endregion
export { getFieldsForRowComparison as n, DiffCollapser as t };
