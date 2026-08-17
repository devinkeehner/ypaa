import { n as require_jsx_runtime } from "../index.js";
import { E as init_react_import, h as AlignLeft, m as useAlignOptions, v as SelectControl, x as useControlContext } from "./config-Z15zxwKW.js";
import { r as useEditorState } from "./dist-BmhQsVYI.js";
//#region node_modules/@puckeditor/core/dist/loaded-54625GTL.mjs
var import_jsx_runtime = require_jsx_runtime();
init_react_import();
function AlignSelectLoaded() {
	var _a;
	const { options } = useControlContext();
	const alignOptions = useAlignOptions(options);
	const { editor } = useControlContext();
	const currentValue = (_a = useEditorState({
		editor,
		selector: (ctx) => {
			var _a2, _b, _c, _d;
			if ((_a2 = ctx.editor) == null ? void 0 : _a2.isActive({ textAlign: "center" })) return "center";
			else if ((_b = ctx.editor) == null ? void 0 : _b.isActive({ textAlign: "right" })) return "right";
			else if ((_c = ctx.editor) == null ? void 0 : _c.isActive({ textAlign: "justify" })) return "justify";
			return (options == null ? void 0 : options.textAlign) ? (_d = options.textAlign.defaultAlignment) != null ? _d : "left" : "left";
		}
	})) != null ? _a : "left";
	const handleChange = (val) => {
		(editor == null ? void 0 : editor.chain())?.focus().setTextAlign(val).run();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectControl, {
		options: alignOptions,
		onChange: handleChange,
		value: currentValue,
		defaultValue: "left",
		renderDefaultIcon: AlignLeft
	});
}
//#endregion
export { AlignSelectLoaded };
