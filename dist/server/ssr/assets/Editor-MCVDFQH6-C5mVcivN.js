import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { E as init_react_import, T as __spreadValues, b as useAppStoreApi, c as o, l as EditorInner, u as LoadedRichTextMenu, w as __spreadProps, y as useAppStore } from "./config-Z15zxwKW.js";
import { t as PuckRichText } from "./chunk-2CNEFIQP-Bog8-e8o.js";
import { n as useEditor, t as EditorContent } from "./dist-BmhQsVYI.js";
//#region node_modules/@puckeditor/core/dist/Editor-MCVDFQH6.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
init_react_import();
init_react_import();
function useSyncedEditor({ content, onChange, extensions, editable = true, onFocusChange, name }) {
	const [debouncedState, setDebouncedState] = o(null, 50, {
		leading: true,
		maxWait: 200
	});
	const syncingRef = (0, import_react.useRef)(false);
	const lastSyncedRef = (0, import_react.useRef)("");
	const editTimer = (0, import_react.useRef)(null);
	const isPending = !!editTimer.current;
	const isFocused = useAppStore((s) => s.state.ui.field.focus === name);
	const resetTimer = (clearOn) => {
		if (editTimer.current) clearTimeout(editTimer.current);
		editTimer.current = setTimeout(() => {
			if (lastSyncedRef.current === clearOn) editTimer.current = null;
		}, 200);
	};
	const appStoreApi = useAppStoreApi();
	const editor = useEditor({
		extensions,
		content,
		editable,
		immediatelyRender: false,
		parseOptions: { preserveWhitespace: "full" },
		onUpdate: ({ editor: editor2 }) => {
			if (syncingRef.current || !isFocused) {
				appStoreApi.getState().setUi({ field: { focus: name } });
				return;
			}
			const html = editor2.getHTML();
			const { from, to } = editor2.state.selection;
			setDebouncedState({
				from,
				to,
				html
			});
			resetTimer(html);
			lastSyncedRef.current = html;
		}
	});
	(0, import_react.useEffect)(() => {
		if (!editor) return;
		const handleFocus = () => {
			onFocusChange?.(editor);
		};
		editor.on("focus", handleFocus);
		return () => {
			editor.off("focus", handleFocus);
		};
	}, [editor, onFocusChange]);
	(0, import_react.useEffect)(() => {
		if (debouncedState) {
			const { ui } = appStoreApi.getState().state;
			onChange(debouncedState.html, { field: __spreadProps(__spreadValues({}, ui.field), { metadata: {
				from: debouncedState.from,
				to: debouncedState.to
			} }) });
		}
	}, [
		editor,
		debouncedState,
		onChange,
		appStoreApi,
		name
	]);
	(0, import_react.useEffect)(() => {
		editor?.setEditable(editable);
	}, [editor, editable]);
	(0, import_react.useEffect)(() => {
		var _a;
		if (!editor) return;
		if (isPending) return;
		if (editor.getHTML() === content) return;
		syncingRef.current = true;
		editor.commands.setContent(content, { emitUpdate: false });
		const { ui } = appStoreApi.getState().state;
		if (typeof ((_a = ui.field.metadata) == null ? void 0 : _a.from) !== "undefined") editor.commands.setTextSelection({
			from: ui.field.metadata.from,
			to: ui.field.metadata.to
		});
		syncingRef.current = false;
	}, [
		content,
		editor,
		appStoreApi
	]);
	return editor;
}
var Editor = (0, import_react.memo)((props) => {
	const { onChange, content, readOnly = false, field, inline = false, onFocus, id, name } = props;
	const { tiptap = {}, options } = field;
	const { extensions = [] } = tiptap;
	const loadedExtensions = (0, import_react.useMemo)(() => [PuckRichText.configure(options), ...extensions], [field, extensions]);
	const appStoreApi = useAppStoreApi();
	const focusName = `${name}${inline ? "::inline" : ""}`;
	const editor = useSyncedEditor({
		content,
		onChange,
		extensions: loadedExtensions,
		editable: !readOnly,
		name: focusName,
		onFocusChange: (editor2) => {
			if (editor2) {
				const s = appStoreApi.getState();
				appStoreApi.setState({
					currentRichText: {
						field,
						editor: editor2,
						id,
						inline
					},
					state: __spreadProps(__spreadValues({}, s.state), { ui: __spreadProps(__spreadValues({}, s.state.ui), { field: __spreadProps(__spreadValues({}, s.state.ui.field), { focus: focusName }) }) })
				});
				onFocus?.(editor2);
			}
		}
	});
	const menuEditor = useAppStore((s) => {
		var _a, _b;
		if (!inline && ((_a = s.currentRichText) == null ? void 0 : _a.id) === id && ((_b = s.currentRichText) == null ? void 0 : _b.inlineComponentId)) return s.currentRichText.editor;
		return editor;
	});
	if (!editor) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorInner, __spreadProps(__spreadValues({}, props), {
		editor,
		menu: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadedRichTextMenu, {
			field,
			editor: menuEditor,
			readOnly
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditorContent, {
			editor,
			className: "rich-text"
		})
	}));
});
Editor.displayName = "Editor";
//#endregion
export { Editor };
