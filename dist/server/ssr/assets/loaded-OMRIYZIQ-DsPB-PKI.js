import { n as require_jsx_runtime } from "../index.js";
import { E as init_react_import, g as Heading, p as useHeadingOptions, v as SelectControl, x as useControlContext } from "./config-Z15zxwKW.js";
import { r as useEditorState } from "./dist-BmhQsVYI.js";
//#region node_modules/@puckeditor/core/dist/loaded-OMRIYZIQ.mjs
var import_jsx_runtime = require_jsx_runtime();
init_react_import();
function HeadingSelectLoaded() {
	const { options } = useControlContext();
	const headingOptions = useHeadingOptions(options);
	const { editor } = useControlContext();
	const currentValue = useEditorState({
		editor,
		selector: (ctx) => {
			var _a, _b;
			if ((_a = ctx.editor) == null ? void 0 : _a.isActive("paragraph")) return "p";
			for (let level = 1; level <= 6; level++) if ((_b = ctx.editor) == null ? void 0 : _b.isActive("heading", { level })) return `h${level}`;
			return "p";
		}
	});
	const handleChange = (val) => {
		const chain = editor == null ? void 0 : editor.chain();
		if (val === "p") chain?.focus().setParagraph().run();
		else {
			const level = parseInt(val.replace("h", ""), 10);
			chain?.focus().toggleHeading({ level }).run();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectControl, {
		options: headingOptions,
		onChange: handleChange,
		value: currentValue != null ? currentValue : "p",
		defaultValue: "p",
		renderDefaultIcon: Heading
	});
}
//#endregion
export { HeadingSelectLoaded };
