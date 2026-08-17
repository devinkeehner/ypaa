import { n as require_jsx_runtime } from "../index.js";
import { A as Re } from "./client-CJQLBaQM.js";
var hex_color_field_module_default = {
	field: "_field_i8ioy_1",
	controls: "_controls_i8ioy_7",
	picker: "_picker_i8ioy_11",
	swatch: "_swatch_i8ioy_13",
	description: "_description_i8ioy_15",
	error: "_error_i8ioy_15"
};
//#endregion
//#region components/admin/HexColorField.tsx
var import_jsx_runtime = require_jsx_runtime();
var HEX = /^#[0-9a-f]{6}$/i;
var HexColorField = ({ field, path }) => {
	const { errorMessage, setValue, showError, value } = Re({ path });
	const textValue = typeof value === "string" ? value : "";
	const pickerValue = HEX.test(textValue) ? textValue : "#000000";
	const label = typeof field.label === "string" ? field.label : field.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: hex_color_field_module_default.field,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor: `${path}-hex`,
				children: [label, field.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " *" }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: hex_color_field_module_default.controls,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": `${label} color picker`,
						className: hex_color_field_module_default.picker,
						onChange: (event) => setValue(event.target.value.toUpperCase()),
						type: "color",
						value: pickerValue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-invalid": showError || void 0,
						id: `${path}-hex`,
						maxLength: 7,
						onChange: (event) => setValue(event.target.value.toUpperCase()),
						placeholder: "#E85E27",
						type: "text",
						value: textValue
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						className: hex_color_field_module_default.swatch,
						style: { background: pickerValue }
					})
				]
			}),
			showError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: hex_color_field_module_default.error,
				children: String(errorMessage || "Enter a valid six-digit hex color.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: hex_color_field_module_default.description,
				children: "Choose a color or paste an exact six-digit hex code."
			})
		]
	});
};
//#endregion
export { HexColorField, HexColorField as default };
