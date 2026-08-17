import { n as require_jsx_runtime } from "../index.js";
import { E as init_react_import, _ as List, f as useListOptions, v as SelectControl, x as useControlContext } from "./config-Z15zxwKW.js";
import { r as useEditorState } from "./dist-BmhQsVYI.js";
//#region node_modules/@puckeditor/core/dist/loaded-Y4ZWZC55.mjs
var import_jsx_runtime = require_jsx_runtime();
init_react_import();
function ListSelectLoaded() {
	const { options } = useControlContext();
	const listOptions = useListOptions(options);
	const { editor } = useControlContext();
	const currentValue = useEditorState({
		editor,
		selector: (ctx) => {
			var _a, _b;
			if ((_a = ctx.editor) == null ? void 0 : _a.isActive("bulletList")) return "ul";
			if ((_b = ctx.editor) == null ? void 0 : _b.isActive("orderedList")) return "ol";
			return "p";
		}
	});
	const handleChange = (val) => {
		const chain = editor == null ? void 0 : editor.chain();
		if (val === "p") chain?.focus().setParagraph().run();
		else if (val === "ol") chain?.focus().toggleOrderedList().run();
		else if (val === "ul") chain?.focus().toggleBulletList().run();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectControl, {
		options: listOptions,
		onChange: handleChange,
		value: currentValue != null ? currentValue : "p",
		defaultValue: "p",
		renderDefaultIcon: List
	});
}
//#endregion
export { ListSelectLoaded };
