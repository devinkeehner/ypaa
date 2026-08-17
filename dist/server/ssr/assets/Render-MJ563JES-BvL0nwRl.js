import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { C as styles_module_default, E as init_react_import, S as get_class_name_factory_default } from "./config-Z15zxwKW.js";
import { F as DOMSerializer, L as Node, P as DOMParser, g as getSchema } from "./dist-DT7nY1jx.js";
import { t as PuckRichText } from "./chunk-2CNEFIQP-Bog8-e8o.js";
//#region node_modules/@tiptap/html/dist/index.js
function getHTMLFromFragment(doc, schema, options) {
	if (typeof window === "undefined") throw new Error("getHTMLFromFragment can only be used in a browser environment\nIf you want to use this in a Node environment, use the `@tiptap/html/server` import instead.");
	if (options == null ? void 0 : options.document) {
		const wrap2 = options.document.createElement("div");
		DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document: options.document }, wrap2);
		return wrap2.innerHTML;
	}
	const wrap = window.document.createElement("div");
	DOMSerializer.fromSchema(schema).serializeFragment(doc.content, { document: window.document }, wrap);
	return wrap.innerHTML;
}
function generateHTML(doc, extensions) {
	if (typeof window === "undefined") throw new Error("generateHTML can only be used in a browser environment\nIf you want to use this in a Node environment, use the `@tiptap/html/server` import instead.");
	const schema = getSchema(extensions);
	return getHTMLFromFragment(Node.fromJSON(schema, doc), schema);
}
function generateJSON(html, extensions, options) {
	if (typeof window === "undefined") throw new Error("generateJSON can only be used in a browser environment\nIf you want to use this in a Node environment, use the `@tiptap/html/server` import instead.");
	const schema = getSchema(extensions);
	const doc = new window.DOMParser().parseFromString(html, "text/html");
	if (!doc) throw new Error("Failed to parse HTML string");
	return DOMParser.fromSchema(schema).parse(doc.body, options).toJSON();
}
//#endregion
//#region node_modules/@puckeditor/core/dist/Render-MJ563JES.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
init_react_import();
var getClassName = get_class_name_factory_default("RichTextEditor", styles_module_default);
function RichTextRender({ content, field }) {
	const { tiptap = {}, options } = field;
	const { extensions = [] } = tiptap;
	const loadedExtensions = (0, import_react.useMemo)(() => [PuckRichText.configure(options), ...extensions], [field, extensions]);
	const normalized = (0, import_react.useMemo)(() => {
		if (typeof content === "object" && (content == null ? void 0 : content.type) === "doc") return content;
		if (typeof content === "string") {
			if (!content) return {
				type: "doc",
				content: []
			};
			if (/<\/?[a-z][\s\S]*>/i.test(content)) return generateJSON(content, loadedExtensions);
			return {
				type: "doc",
				content: [{
					type: "paragraph",
					content: [{
						type: "text",
						text: content
					}]
				}]
			};
		}
		return {
			type: "doc",
			content: []
		};
	}, [content, loadedExtensions]);
	const html = (0, import_react.useMemo)(() => {
		return generateHTML(normalized, loadedExtensions);
	}, [normalized, loadedExtensions]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: getClassName(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rich-text",
			dangerouslySetInnerHTML: { __html: html }
		})
	});
}
//#endregion
export { RichTextRender };
