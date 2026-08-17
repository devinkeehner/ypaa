import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as require_compiler_runtime } from "./compiler-runtime-BbVP7FK0.js";
import { At as xe, B as aee, Bt as DragOverlay, Ct as te, Et as us, Gt as useDraggable, Ht as KeyboardSensor, I as Ze, Jt as useSensors, Kt as useDroppable, M as Ss, Mt as yr, P as Tt, S as Lo, St as st, T as Nt, Ut as MouseSensor, Vt as KeyboardCode, Wt as TouchSensor, Yt as getEventCoordinates, bn as se, bt as se$1, dt as lu, en as PREFERENCE_KEYS, fn as tabHasName, gt as pt, l as Er, lt as it, mn as WP, n as Ar, o as Ce, on as fieldAffectsData, pn as RP, qt as useSensor, sn as fieldHasSubFields, st as io, yn as le, yt as re, zt as DndContext } from "./client-CJQLBaQM.js";
import { t as v4 } from "./v4-DiJ-vc2V.js";
import { i as le$1 } from "./shared-jREwlcRe.js";
//#region node_modules/@dnd-kit/modifiers/dist/modifiers.esm.js
var import_jsx_runtime = require_jsx_runtime();
var import_compiler_runtime = require_compiler_runtime();
var snapCenterToCursor = (_ref) => {
	let { activatorEvent, draggingNodeRect, transform } = _ref;
	if (draggingNodeRect && activatorEvent) {
		const activatorCoordinates = getEventCoordinates(activatorEvent);
		if (!activatorCoordinates) return transform;
		const offsetX = activatorCoordinates.x - draggingNodeRect.left;
		const offsetY = activatorCoordinates.y - draggingNodeRect.top;
		return {
			...transform,
			x: transform.x + offsetX - draggingNodeRect.width / 2,
			y: transform.y + offsetY - draggingNodeRect.height / 2
		};
	}
	return transform;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/DashboardStepNav.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function DashboardStepNav(t0) {
	const $ = (0, import_compiler_runtime.c)(15);
	const { addWidget, cancel, isEditing, resetLayout, saveLayout, setIsEditing, widgets } = t0;
	const { t } = WP();
	const { setStepNav } = Er();
	const drawerSlug = `widgets-drawer-${(0, import_react.useId)()}`;
	let t1;
	let t2;
	if ($[0] !== cancel || $[1] !== drawerSlug || $[2] !== isEditing || $[3] !== resetLayout || $[4] !== saveLayout || $[5] !== setIsEditing || $[6] !== setStepNav) {
		t1 = () => {
			setStepNav([{ label: (0, import_jsx_runtime.jsx)(DashboardBreadcrumbDropdown, {
				isEditing,
				onCancel: cancel,
				onEditClick: () => setIsEditing(true),
				onResetLayout: resetLayout,
				onSaveChanges: saveLayout,
				widgetsDrawerSlug: drawerSlug
			}) }]);
		};
		t2 = [
			isEditing,
			drawerSlug,
			cancel,
			resetLayout,
			saveLayout,
			setIsEditing,
			setStepNav
		];
		$[0] = cancel;
		$[1] = drawerSlug;
		$[2] = isEditing;
		$[3] = resetLayout;
		$[4] = saveLayout;
		$[5] = setIsEditing;
		$[6] = setStepNav;
		$[7] = t1;
		$[8] = t2;
	} else {
		t1 = $[7];
		t2 = $[8];
	}
	(0, import_react.useEffect)(t1, t2);
	let t3;
	if ($[9] !== addWidget || $[10] !== drawerSlug || $[11] !== isEditing || $[12] !== t || $[13] !== widgets) {
		t3 = (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: isEditing && (0, import_jsx_runtime.jsx)(aee, {
			drawerSlug,
			items: widgets,
			onItemClick: (widget) => addWidget(widget.slug),
			searchPlaceholder: t("dashboard:searchWidgets"),
			title: t("dashboard:addWidget")
		}) });
		$[9] = addWidget;
		$[10] = drawerSlug;
		$[11] = isEditing;
		$[12] = t;
		$[13] = widgets;
		$[14] = t3;
	} else t3 = $[14];
	return t3;
}
function DashboardBreadcrumbDropdown(props) {
	const $ = (0, import_compiler_runtime.c)(12);
	const { isEditing, onCancel, onEditClick, onResetLayout, onSaveChanges, widgetsDrawerSlug } = props;
	const { t } = WP();
	if (isEditing) {
		let t0;
		if ($[0] !== onCancel || $[1] !== onSaveChanges || $[2] !== t || $[3] !== widgetsDrawerSlug) {
			t0 = (0, import_jsx_runtime.jsxs)("div", {
				className: "dashboard-breadcrumb-dropdown__editing",
				children: [(0, import_jsx_runtime.jsx)("span", { children: t("dashboard:editingDashboard") }), (0, import_jsx_runtime.jsxs)("div", {
					className: "dashboard-breadcrumb-dropdown__actions",
					children: [
						(0, import_jsx_runtime.jsx)(us, {
							className: "drawer-toggler--unstyled",
							slug: widgetsDrawerSlug,
							children: (0, import_jsx_runtime.jsx)(re, {
								buttonStyle: "pill",
								el: "span",
								size: "small",
								children: t("dashboard:addButton")
							})
						}),
						(0, import_jsx_runtime.jsx)(re, {
							buttonStyle: "pill",
							onClick: onSaveChanges,
							size: "small",
							children: t("fields:saveChanges")
						}),
						(0, import_jsx_runtime.jsx)(re, {
							buttonStyle: "pill",
							onClick: onCancel,
							size: "small",
							children: t("general:cancel")
						})
					]
				})]
			});
			$[0] = onCancel;
			$[1] = onSaveChanges;
			$[2] = t;
			$[3] = widgetsDrawerSlug;
			$[4] = t0;
		} else t0 = $[4];
		return t0;
	}
	let t0;
	if ($[5] !== onEditClick || $[6] !== onResetLayout || $[7] !== t) {
		const options = [{
			label: t("dashboard:editDashboard"),
			value: "edit"
		}, {
			label: t("dashboard:resetLayout"),
			value: "reset"
		}];
		let t1;
		if ($[9] !== onEditClick || $[10] !== onResetLayout) {
			t1 = (selectedOption) => {
				const option = Array.isArray(selectedOption) ? selectedOption[0] : selectedOption;
				if (option?.value === "edit") onEditClick();
				else if (option?.value === "reset") onResetLayout();
			};
			$[9] = onEditClick;
			$[10] = onResetLayout;
			$[11] = t1;
		} else t1 = $[11];
		t0 = (0, import_jsx_runtime.jsx)(pt, {
			className: "dashboard-breadcrumb-select",
			isClearable: false,
			isSearchable: false,
			menuIsOpen: void 0,
			onChange: t1,
			options,
			placeholder: t("general:dashboard"),
			value: {
				label: t("general:dashboard"),
				value: "dashboard"
			}
		});
		$[5] = onEditClick;
		$[6] = onResetLayout;
		$[7] = t;
		$[8] = t0;
	} else t0 = $[8];
	return t0;
}
//#endregion
//#region node_modules/@dnd-kit/sortable/dist/sortable.esm.js
/**
* Move an array item to a different position. Returns a new array with the item moved to the new position.
*/
function arrayMove(array, from, to) {
	const newArray = array.slice();
	newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
	return newArray;
}
KeyboardCode.Down, KeyboardCode.Right, KeyboardCode.Up, KeyboardCode.Left;
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/renderWidget/RenderWidget.js
/**
* Utility to render a widget on-demand on the client.
*/
var RenderWidget = (t0) => {
	const $ = (0, import_compiler_runtime.c)(10);
	const { widgetData, widgetId } = t0;
	const [Component, setComponent] = import_react.useState(null);
	const { serverFunction } = Nt();
	const requestIDRef = (0, import_react.useRef)(0);
	let t1;
	if ($[0] !== serverFunction || $[1] !== widgetData || $[2] !== widgetId) {
		t1 = () => {
			(async function render() {
				const requestID = requestIDRef.current = requestIDRef.current + 1;
				setComponent(null);
				try {
					const result = await serverFunction({
						name: "render-widget",
						args: {
							widgetData,
							widgetSlug: widgetId.slice(0, widgetId.lastIndexOf("-"))
						}
					});
					if (requestID !== requestIDRef.current) return;
					setComponent(result.component);
				} catch (t2) {
					if (requestID !== requestIDRef.current) return;
					setComponent(import_react.createElement("div", { style: {
						background: "var(--theme-error-50)",
						border: "1px solid var(--theme-error-200)",
						borderRadius: "4px",
						color: "var(--theme-error-text)",
						padding: "20px",
						textAlign: "center"
					} }, "Failed to load widget. Please try again later."));
				}
			})();
		};
		$[0] = serverFunction;
		$[1] = widgetData;
		$[2] = widgetId;
		$[3] = t1;
	} else t1 = $[3];
	const renderWidget = t1;
	let t2;
	let t3;
	if ($[4] !== renderWidget) {
		t2 = () => {
			renderWidget();
		};
		t3 = [renderWidget];
		$[4] = renderWidget;
		$[5] = t2;
		$[6] = t3;
	} else {
		t2 = $[5];
		t3 = $[6];
	}
	(0, import_react.useEffect)(t2, t3);
	if (!Component) {
		let t4;
		if ($[7] === Symbol.for("react.memo_cache_sentinel")) {
			t4 = (0, import_jsx_runtime.jsx)(le, { height: "100%" });
			$[7] = t4;
		} else t4 = $[7];
		return t4;
	}
	let t4;
	if ($[8] !== Component) {
		t4 = (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: Component });
		$[8] = Component;
		$[9] = t4;
	} else t4 = $[9];
	return t4;
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/useDashboardLayout.js
function useDashboardLayout(initialLayout) {
	const setLayoutPreference = useSetLayoutPreference();
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const { widgets = [] } = se().config.admin.dashboard ?? {};
	const [currentLayout, setCurrentLayout] = (0, import_react.useState)(initialLayout);
	const { openModal } = se$1();
	const cancelModalSlug = "cancel-dashboard-changes";
	const { serverFunction } = Nt();
	const { t } = WP();
	(0, import_react.useEffect)(() => {
		if (!isEditing) setCurrentLayout(initialLayout);
	}, [initialLayout]);
	const saveLayout = (0, import_react.useCallback)(async () => {
		try {
			const layoutData = currentLayout.map((item) => item.item);
			setIsEditing(false);
			await setLayoutPreference(layoutData);
		} catch {
			setIsEditing(true);
			te.error(t("error:failedToSaveLayout"));
		}
	}, [setLayoutPreference, currentLayout]);
	const resetLayout = (0, import_react.useCallback)(async () => {
		try {
			await setLayoutPreference(null);
			setCurrentLayout((await serverFunction({
				name: "get-default-layout",
				args: {}
			})).layout);
			setIsEditing(false);
		} catch {
			te.error(t("error:failedToResetLayout"));
		}
	}, [setLayoutPreference, serverFunction]);
	const performCancel = (0, import_react.useCallback)(() => {
		setCurrentLayout(initialLayout);
		setIsEditing(false);
	}, [initialLayout]);
	const cancel = (0, import_react.useCallback)(() => {
		if (currentLayout.length !== initialLayout.length || currentLayout.some((widget, index) => {
			const initialWidget = initialLayout[index];
			return !initialWidget || widget.item.id !== initialWidget.item.id || widget.item.width !== initialWidget.item.width || JSON.stringify(widget.item.data || {}) !== JSON.stringify(initialWidget.item.data || {});
		})) openModal(cancelModalSlug);
		else performCancel();
	}, [
		currentLayout,
		initialLayout,
		openModal,
		cancelModalSlug,
		performCancel
	]);
	const moveWidget = (0, import_react.useCallback)(({ moveFromIndex, moveToIndex }) => {
		if (moveFromIndex === moveToIndex || moveFromIndex < 0 || moveToIndex < 0) return;
		setCurrentLayout((prev) => {
			return arrayMove(prev, moveFromIndex, moveToIndex);
		});
	}, []);
	const addWidget = (0, import_react.useCallback)((widgetSlug) => {
		if (!isEditing) return;
		const widgetId = `${widgetSlug}-${Date.now()}`;
		const widget = widgets.find((widget) => widget.slug === widgetSlug);
		const newWidgetInstance = {
			component: import_react.createElement(RenderWidget, {
				widgetData: {},
				widgetId
			}),
			item: {
				id: widgetId,
				data: {},
				maxWidth: widget?.maxWidth ?? "full",
				minWidth: widget?.minWidth ?? "x-small",
				width: widget?.minWidth ?? "x-small"
			}
		};
		setCurrentLayout((prev) => [...prev, newWidgetInstance]);
		setTimeout(() => {
			const element = document.getElementById(widgetId);
			if (element) {
				element.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
				const widget = element.closest(".widget");
				if (widget) {
					widget.classList.add("widget--highlight");
					setTimeout(() => {
						widget.classList.remove("widget--highlight");
					}, 1500);
				}
			}
		}, 100);
	}, [isEditing, widgets]);
	const deleteWidget = (0, import_react.useCallback)((widgetId) => {
		if (!isEditing) return;
		setCurrentLayout((prev) => prev.filter((item) => item.item.id !== widgetId));
	}, [isEditing]);
	const resizeWidget = (0, import_react.useCallback)((widgetId, newWidth) => {
		if (!isEditing) return;
		setCurrentLayout((prev) => prev.map((item) => item.item.id === widgetId ? {
			...item,
			item: {
				...item.item,
				width: newWidth
			}
		} : item));
	}, [isEditing]);
	const updateWidgetData = (0, import_react.useCallback)((widgetId, data) => {
		if (!isEditing) return;
		setCurrentLayout((prev) => prev.map((item) => item.item.id === widgetId ? {
			component: import_react.createElement(RenderWidget, {
				widgetData: data,
				widgetId
			}),
			item: {
				...item.item,
				data
			}
		} : item));
	}, [isEditing]);
	return {
		addWidget,
		cancel,
		cancelModal: import_react.createElement(st, {
			body: t("dashboard:discardMessage"),
			confirmLabel: t("dashboard:discardConfirmLabel"),
			heading: t("dashboard:discardTitle"),
			modalSlug: cancelModalSlug,
			onConfirm: performCancel
		}),
		currentLayout,
		deleteWidget,
		isEditing,
		moveWidget,
		resetLayout,
		resizeWidget,
		saveLayout,
		setIsEditing,
		updateWidgetData
	};
}
function useSetLayoutPreference() {
	const { setPreference } = io();
	return (0, import_react.useCallback)(async (layout) => {
		await setPreference(PREFERENCE_KEYS.DASHBOARD_LAYOUT, { layouts: layout }, false);
	}, [setPreference]);
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/utils/collisionDetection.js
/**
* Collision detection that considers the X
* axis only with respect to the position of the pointer (or collisionRect for keyboard)
*/ var closestInXAxis = (args) => {
	const collisions = [];
	let x;
	let y;
	if (args.pointerCoordinates) {
		x = args.pointerCoordinates.x;
		y = args.pointerCoordinates.y;
	} else if (args.collisionRect) {
		x = args.collisionRect.left + args.collisionRect.width / 2;
		y = args.collisionRect.top + args.collisionRect.height / 2;
	} else return [];
	for (const container of args.droppableContainers) {
		const rect = args.droppableRects.get(container.id);
		if (!rect) continue;
		if (y >= rect.top && y <= rect.bottom) {
			const centerX = rect.left + rect.width / 2;
			const distance = Math.abs(x - centerX);
			collisions.push({
				id: String(container.id),
				data: { value: distance }
			});
		}
	}
	return collisions.sort((a, b) => a.data.value - b.data.value);
};
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/utils/sensors.js
/**
* Get all droppable widget positions, filtering out overlapping "before" droppables
* and assigning row numbers based on Y position.
*/
function getDroppablePositions() {
	const positionTolerance = 5;
	const rowTolerance = 10;
	const result = [];
	let currentRow = 0;
	let currentY = null;
	const allDroppables = Array.from(document.querySelectorAll(".droppable-widget"));
	for (let i = 0; i < allDroppables.length; i++) {
		const element = allDroppables[i];
		const rect = element.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) continue;
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const isBeforeDroppable = (element.getAttribute("data-testid") || "").endsWith("-before");
		if (isBeforeDroppable) {
			if (allDroppables.some((other, otherIndex) => {
				if (otherIndex === i) return false;
				const otherRect = other.getBoundingClientRect();
				const otherCenterX = otherRect.left + otherRect.width / 2;
				const otherCenterY = otherRect.top + otherRect.height / 2;
				return Math.abs(otherCenterX - centerX) < positionTolerance && Math.abs(otherCenterY - centerY) < positionTolerance;
			})) continue;
		}
		if (currentY === null) currentY = centerY;
		else if (Math.abs(centerY - currentY) >= rowTolerance) {
			currentRow++;
			currentY = centerY;
		}
		result.push({
			centerX,
			centerY,
			element,
			isBeforeDroppable,
			rect,
			row: currentRow
		});
	}
	return result;
}
/**
* Find the row with the closest Y position to the given posY.
* Returns the row index, or null if no droppables exist.
*/
function findClosestRow(droppables, posY) {
	if (droppables.length === 0) return null;
	let closestRow = droppables[0].row;
	let minYDistance = Infinity;
	for (const droppable of droppables) {
		const yDistance = Math.abs(droppable.centerY - posY);
		if (yDistance < minYDistance) {
			minYDistance = yDistance;
			closestRow = droppable.row;
		}
	}
	return closestRow;
}
/**
* Find the closest droppable within a specific row by X position.
* Returns the droppable and its index, or null if no droppables in that row.
*/
function findClosestDroppableInRow(droppables, rowIndex, posX) {
	let closestIndex = -1;
	let minXDistance = Infinity;
	for (let i = 0; i < droppables.length; i++) {
		const droppable = droppables[i];
		if (droppable.row === rowIndex) {
			const xDistance = Math.abs(droppable.centerX - posX);
			if (xDistance < minXDistance) {
				minXDistance = xDistance;
				closestIndex = i;
			}
		}
	}
	if (closestIndex === -1) return null;
	return {
		droppable: droppables[closestIndex],
		index: closestIndex
	};
}
/**
* Find the target droppable based on direction
* - ArrowRight/Left: Next/previous in DOM order (now that overlapping droppables are filtered)
* - ArrowUp/Down: Closest in adjacent row (row +1 or -1) by X position
*/
function findTargetDroppable(droppables, currentCenterX, currentCenterY, direction) {
	const currentRow = findClosestRow(droppables, currentCenterY);
	if (currentRow === null) return null;
	const currentDroppable = findClosestDroppableInRow(droppables, currentRow, currentCenterX);
	if (!currentDroppable) return null;
	const { index: currentIndex } = currentDroppable;
	switch (direction) {
		case "ArrowDown": return findClosestDroppableInRow(droppables, currentRow + 1, currentCenterX)?.droppable || null;
		case "ArrowLeft": return droppables[currentIndex - 1] || null;
		case "ArrowRight": return droppables[currentIndex + 1] || null;
		case "ArrowUp": return findClosestDroppableInRow(droppables, currentRow - 1, currentCenterX)?.droppable || null;
		default: return null;
	}
}
/**
* Custom coordinate getter that jumps directly to droppable positions
* instead of moving in pixel increments. This works better with scrolling
* and provides more predictable navigation.
*/
var droppableJumpKeyboardCoordinateGetter = (event, { context, currentCoordinates }) => {
	const { collisionRect } = context;
	const { code } = event;
	if (!collisionRect) return currentCoordinates;
	if (![
		"ArrowDown",
		"ArrowLeft",
		"ArrowRight",
		"ArrowUp"
	].includes(code)) return currentCoordinates;
	event.preventDefault();
	if (context.scrollableAncestors) context.scrollableAncestors.length = 0;
	const droppables = getDroppablePositions();
	if (droppables.length === 0) return currentCoordinates;
	const currentCenterX = collisionRect.left + collisionRect.width / 2;
	const currentCenterY = collisionRect.top + collisionRect.height / 2;
	const targetDroppable = findTargetDroppable(droppables, currentCenterX, currentCenterY, code);
	if (targetDroppable) {
		const viewportHeight = window.innerHeight;
		const targetRect = targetDroppable.rect;
		const scrollPadding = 20;
		const isAboveViewport = targetRect.top < scrollPadding;
		const isBelowViewport = targetRect.bottom > viewportHeight - scrollPadding;
		if (isAboveViewport) {
			const scrollAmount = targetRect.top - scrollPadding;
			window.scrollBy({
				behavior: "instant",
				top: scrollAmount
			});
		} else if (isBelowViewport) {
			const scrollAmount = targetRect.bottom - viewportHeight + scrollPadding;
			window.scrollBy({
				behavior: "instant",
				top: scrollAmount
			});
		}
		const newTargetRect = targetDroppable.element.getBoundingClientRect();
		const newTargetCenterX = newTargetRect.left + newTargetRect.width / 2;
		const newTargetCenterY = newTargetRect.top + newTargetRect.height / 2;
		const deltaX = newTargetCenterX - currentCenterX;
		const deltaY = newTargetCenterY - currentCenterY;
		return {
			x: currentCoordinates.x + deltaX,
			y: currentCoordinates.y + deltaY
		};
	}
	return currentCoordinates;
};
/**
* Custom KeyboardSensor that only activates when focus is directly on the
* draggable element, not on any of its descendants. This allows interactive
* elements inside draggables (like buttons) to work normally with the keyboard.
*/
var DirectFocusKeyboardSensor = class extends KeyboardSensor {
	static activators = [{
		eventName: "onKeyDown",
		handler: (event, { keyboardCodes = {
			cancel: [KeyboardCode.Esc],
			end: [KeyboardCode.Space, KeyboardCode.Enter],
			start: [KeyboardCode.Space, KeyboardCode.Enter]
		}, onActivation }, { active }) => {
			const { code } = event.nativeEvent;
			if (event.target !== active.node.current) return false;
			if (keyboardCodes.start.includes(code)) {
				event.preventDefault();
				onActivation?.({ event: event.nativeEvent });
				return true;
			}
			return false;
		}
	}];
};
function useDashboardSensors() {
	return useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), useSensor(TouchSensor, { activationConstraint: {
		delay: 200,
		tolerance: 5
	} }), useSensor(DirectFocusKeyboardSensor, { coordinateGetter: droppableJumpKeyboardCoordinateGetter }));
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/utils/localeUtils.js
function isLocalized(field) {
	return "localized" in field && Boolean(field.localized);
}
function getObjectValue(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) ? value : {};
}
/**
* Extracts locale-specific data from widget data stored in preferences.
*
* Localized fields are stored as `{ fieldName: { en: "Hello", de: "Hallo" } }` in preferences.
* This function flattens them to `{ fieldName: "Hello" }` for the given locale,
* which is the format the form state builder expects.
*
* Recursively handles nested field types (group, row, collapsible, tabs).
*/
function extractLocaleData(widgetData, locale, fields) {
	const result = {};
	for (const field of fields) {
		if (field.type === "tabs") {
			for (const tab of field.tabs) {
				const tabFields = tab.fields;
				if (tabHasName(tab)) result[tab.name] = extractLocaleData(getObjectValue(widgetData[tab.name]), locale, tabFields);
				else Object.assign(result, extractLocaleData(widgetData, locale, tabFields));
			}
			continue;
		}
		if (fieldHasSubFields(field) && !fieldAffectsData(field)) {
			Object.assign(result, extractLocaleData(widgetData, locale, field.fields));
			continue;
		}
		if (!fieldAffectsData(field)) continue;
		const { name } = field;
		const value = widgetData[name];
		if (fieldHasSubFields(field)) {
			result[name] = extractLocaleData(getObjectValue(value), locale, field.fields);
			continue;
		}
		if (isLocalized(field) && value !== void 0 && typeof value === "object" && value !== null && !Array.isArray(value)) result[name] = value[locale];
		else result[name] = value;
	}
	return result;
}
/**
* Merges locale-specific form data back into the full widget data structure.
*
* Non-localized fields are stored directly. Localized fields are stored as
* `{ fieldName: { en: "Hello", de: "Hallo" } }` so each locale's value is preserved independently.
*
* Recursively handles nested field types (group, row, collapsible, tabs).
*/
function mergeLocaleData(existingData, formData, locale, fields) {
	const result = { ...existingData };
	for (const field of fields) {
		if (field.type === "tabs") {
			for (const tab of field.tabs) {
				const tabFields = tab.fields;
				if (tabHasName(tab)) result[tab.name] = mergeLocaleData(getObjectValue(result[tab.name]), getObjectValue(formData[tab.name]), locale, tabFields);
				else Object.assign(result, mergeLocaleData(result, formData, locale, tabFields));
			}
			continue;
		}
		if (fieldHasSubFields(field) && !fieldAffectsData(field)) {
			Object.assign(result, mergeLocaleData(result, formData, locale, field.fields));
			continue;
		}
		if (!fieldAffectsData(field)) continue;
		const { name } = field;
		if (fieldHasSubFields(field)) {
			result[name] = mergeLocaleData(getObjectValue(result[name]), getObjectValue(formData[name]), locale, field.fields);
			continue;
		}
		if (isLocalized(field)) result[name] = {
			...getObjectValue(result[name]),
			[locale]: formData[name]
		};
		else result[name] = formData[name];
	}
	return result;
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/WidgetConfigDrawer.js
var EMPTY_WIDGET_PREFERENCES = { fields: {} };
function WidgetConfigDrawer({ drawerSlug, onSave, widget, widgetData }) {
	const { closeModal, modalState } = se$1();
	const { getFormState } = Nt();
	const { t } = WP();
	const localeCode = xe()?.code ?? "en";
	const onChangeAbortControllerRef = (0, import_react.useRef)(null);
	const [initialState, setInitialState] = (0, import_react.useState)(false);
	const isOpen = Boolean(modalState?.[drawerSlug]?.isOpen);
	const formUUID = (0, import_react.useMemo)(() => v4(), []);
	const widgetLabel = (0, import_react.useMemo)(() => typeof widget.label === "string" ? widget.label : widget.slug, [widget.label, widget.slug]);
	const fields = (0, import_react.useMemo)(() => widget.fields ?? [], [widget.fields]);
	(0, import_react.useEffect)(() => {
		if (!isOpen || fields.length === 0) {
			setInitialState(false);
			return;
		}
		const controller = new AbortController();
		const loadInitialState = async () => {
			const { state } = await getFormState({
				data: extractLocaleData(widgetData ?? {}, localeCode, fields),
				docPermissions: { fields: true },
				docPreferences: EMPTY_WIDGET_PREFERENCES,
				locale: localeCode,
				operation: "update",
				renderAllFields: true,
				schemaPath: widget.slug,
				signal: controller.signal,
				widgetSlug: widget.slug
			});
			if (state) setInitialState(state);
		};
		loadInitialState();
		return () => {
			le$1(controller);
		};
	}, [
		fields,
		getFormState,
		isOpen,
		localeCode,
		widget.slug,
		widgetData
	]);
	const onChange = (0, import_react.useCallback)(async ({ formState: prevFormState }) => {
		le$1(onChangeAbortControllerRef.current);
		const controller_0 = new AbortController();
		onChangeAbortControllerRef.current = controller_0;
		const { state: state_0 } = await getFormState({
			docPermissions: { fields: true },
			docPreferences: EMPTY_WIDGET_PREFERENCES,
			formState: prevFormState,
			operation: "update",
			schemaPath: widget.slug,
			signal: controller_0.signal,
			widgetSlug: widget.slug
		});
		if (!state_0) return prevFormState;
		return state_0;
	}, [getFormState, widget.slug]);
	(0, import_react.useEffect)(() => {
		return () => {
			le$1(onChangeAbortControllerRef.current);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tt, {
		slug: drawerSlug,
		title: `${t("general:edit")} ${widgetLabel}`,
		children: initialState === false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(le, { height: "250px" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(lu, {
			operation: "update",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ss, {
				fields,
				initialState,
				onChange: [onChange],
				onSubmit: (_, data) => {
					onSave(mergeLocaleData(widgetData ?? {}, data, localeCode, fields));
					closeModal(drawerSlug);
				},
				uuid: formUUID,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lo, {
					fields,
					forceRender: true,
					parentIndexPath: "",
					parentPath: "",
					parentSchemaPath: widget.slug,
					permissions: true,
					readOnly: false
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ar, { children: t("fields:saveChanges") })]
			})
		})
	});
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/WidgetEditControl.js
var getWidgetSlugFromID = (widgetID) => widgetID.slice(0, widgetID.lastIndexOf("-"));
function WidgetEditControl(t0) {
	const $ = (0, import_compiler_runtime.c)(7);
	const { onSave, widgetData, widgetID } = t0;
	const { t } = WP();
	const { openModal } = se$1();
	const { widgets: t1 } = se().config.admin.dashboard ?? {};
	const configWidgets = t1 === void 0 ? [] : t1;
	let t2;
	if ($[0] !== widgetID) {
		t2 = getWidgetSlugFromID(widgetID);
		$[0] = widgetID;
		$[1] = t2;
	} else t2 = $[1];
	const widgetSlug = t2;
	let t3;
	if ($[2] !== widgetSlug) {
		t3 = (widget) => widget.slug === widgetSlug;
		$[2] = widgetSlug;
		$[3] = t3;
	} else t3 = $[3];
	const widgetConfig = configWidgets.find(t3);
	const hasEditableFields = Boolean(widgetConfig?.fields?.length);
	const drawerSlug = `widget-editor-${(0, import_react.useId)()}`;
	if (!hasEditableFields) return null;
	let t4;
	if ($[4] !== drawerSlug || $[5] !== openModal) {
		t4 = () => {
			openModal(drawerSlug);
		};
		$[4] = drawerSlug;
		$[5] = openModal;
		$[6] = t4;
	} else t4 = $[6];
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsxs)("button", {
		className: "widget-wrapper__edit-btn",
		onClick: t4,
		type: "button",
		children: [(0, import_jsx_runtime.jsxs)("span", {
			className: "sr-only",
			children: [
				t("general:edit"),
				" ",
				widgetID
			]
		}), (0, import_jsx_runtime.jsx)(yr, {})]
	}), (0, import_jsx_runtime.jsx)(WidgetConfigDrawer, {
		drawerSlug,
		onSave,
		widget: widgetConfig,
		widgetData
	})] });
}
//#endregion
//#region node_modules/@payloadcms/next/dist/views/Dashboard/Default/ModularDashboard/index.client.js
/**
* Custom modifier that only applies snapCenterToCursor for pointer events.
* During keyboard navigation, we handle positioning ourselves via the coordinate getter.
*/
var snapCenterToCursorOnlyForPointer = (args) => {
	const { activatorEvent } = args;
	if (activatorEvent && "key" in activatorEvent) return args.transform;
	return snapCenterToCursor(args);
};
var WIDTH_TO_PERCENTAGE = {
	"x-small": 25,
	small: 1 / 3 * 100,
	medium: 50,
	large: 2 / 3 * 100,
	"x-large": 75,
	full: 100
};
function ModularDashboardClient(t0) {
	const $ = (0, import_compiler_runtime.c)(22);
	const { clientLayout: initialLayout, widgets } = t0;
	const { t } = WP();
	const { addWidget, cancel, cancelModal, currentLayout, deleteWidget, isEditing, moveWidget, resetLayout, resizeWidget, saveLayout, setIsEditing, updateWidgetData } = useDashboardLayout(initialLayout);
	const [activeDragId, setActiveDragId] = (0, import_react.useState)(null);
	const sensors = useDashboardSensors();
	let t1;
	if ($[0] !== activeDragId || $[1] !== addWidget || $[2] !== cancel || $[3] !== cancelModal || $[4] !== currentLayout || $[5] !== deleteWidget || $[6] !== isEditing || $[7] !== moveWidget || $[8] !== resetLayout || $[9] !== resizeWidget || $[10] !== saveLayout || $[11] !== sensors || $[12] !== setIsEditing || $[13] !== t || $[14] !== updateWidgetData || $[15] !== widgets) {
		let t2;
		if ($[17] === Symbol.for("react.memo_cache_sentinel")) {
			t2 = () => {
				setActiveDragId(null);
			};
			$[17] = t2;
		} else t2 = $[17];
		let t3;
		if ($[18] !== currentLayout || $[19] !== moveWidget) {
			t3 = (event) => {
				if (!event.over) {
					setActiveDragId(null);
					return;
				}
				const droppableId = event.over.id;
				const i = droppableId.lastIndexOf("-");
				const slug = droppableId.slice(0, i);
				const position = droppableId.slice(i + 1);
				if (slug === event.active.id) return;
				const moveFromIndex = currentLayout?.findIndex((widget) => widget.item.id === event.active.id);
				let moveToIndex = currentLayout?.findIndex((widget_0) => widget_0.item.id === slug);
				if (moveFromIndex < moveToIndex) moveToIndex--;
				if (position === "after") moveToIndex++;
				moveWidget({
					moveFromIndex,
					moveToIndex
				});
				setActiveDragId(null);
			};
			$[18] = currentLayout;
			$[19] = moveWidget;
			$[20] = t3;
		} else t3 = $[20];
		let t4;
		if ($[21] === Symbol.for("react.memo_cache_sentinel")) {
			t4 = (event_0) => {
				setActiveDragId(event_0.active.id);
			};
			$[21] = t4;
		} else t4 = $[21];
		t1 = (0, import_jsx_runtime.jsxs)("div", { children: [
			(0, import_jsx_runtime.jsx)(DndContext, {
				autoScroll: {
					enabled: true,
					threshold: {
						x: 0,
						y: .2
					}
				},
				collisionDetection: closestInXAxis,
				id: "dashboard-dnd-context",
				onDragCancel: t2,
				onDragEnd: t3,
				onDragStart: t4,
				sensors,
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: `modular-dashboard ${isEditing ? "editing" : ""}`,
					style: {
						display: "flex",
						flexWrap: "wrap"
					},
					children: [
						currentLayout?.length === 0 && (0, import_jsx_runtime.jsx)("div", {
							className: "modular-dashboard__empty",
							children: (0, import_jsx_runtime.jsx)("p", { children: t("dashboard:noItems") })
						}),
						currentLayout?.map((widget_1, _index) => (0, import_jsx_runtime.jsx)(import_react.Fragment, { children: (0, import_jsx_runtime.jsx)(DraggableItem, {
							disabled: !isEditing,
							id: widget_1.item.id,
							style: {
								width: `${WIDTH_TO_PERCENTAGE[widget_1.item.width]}%`,
								padding: "6px"
							},
							width: widget_1.item.width,
							children: (0, import_jsx_runtime.jsxs)("div", {
								className: `widget-wrapper ${isEditing ? "widget-wrapper--editing" : ""}`,
								children: [(0, import_jsx_runtime.jsx)("div", {
									"aria-hidden": isEditing,
									className: "widget-content",
									inert: isEditing,
									children: widget_1.component
								}), isEditing && (0, import_jsx_runtime.jsxs)("div", {
									className: "widget-wrapper__controls",
									onPointerDown: _temp,
									children: [
										(0, import_jsx_runtime.jsx)(WidgetEditControl, {
											onSave: (data) => {
												updateWidgetData(widget_1.item.id, data);
											},
											widgetData: widget_1.item.data,
											widgetID: widget_1.item.id
										}),
										(0, import_jsx_runtime.jsx)(WidgetWidthDropdown, {
											currentWidth: widget_1.item.width,
											maxWidth: widget_1.item.maxWidth,
											minWidth: widget_1.item.minWidth,
											onResize: (width) => resizeWidget(widget_1.item.id, width)
										}),
										(0, import_jsx_runtime.jsxs)("button", {
											className: "widget-wrapper__delete-btn",
											onClick: () => deleteWidget(widget_1.item.id),
											type: "button",
											children: [(0, import_jsx_runtime.jsx)("span", {
												className: "sr-only",
												children: t("dashboard:deleteWidget", { id: widget_1.item.id })
											}), (0, import_jsx_runtime.jsx)(RP, {})]
										})
									]
								})]
							})
						}) }, widget_1.item.id)),
						(0, import_jsx_runtime.jsx)(DragOverlay, {
							className: "drag-overlay",
							dropAnimation: { duration: 100 },
							modifiers: [snapCenterToCursorOnlyForPointer],
							children: activeDragId ? (() => {
								const draggedWidget = currentLayout?.find((widget_2) => widget_2.item.id === activeDragId);
								return draggedWidget ? (0, import_jsx_runtime.jsx)("div", {
									style: { transform: "scale(0.25)" },
									children: (0, import_jsx_runtime.jsx)("div", {
										className: `widget-wrapper ${isEditing ? "widget-wrapper--editing" : ""}`,
										children: (0, import_jsx_runtime.jsx)("div", {
											className: "widget-content",
											children: draggedWidget.component
										})
									})
								}) : null;
							})() : null
						})
					]
				})
			}),
			(0, import_jsx_runtime.jsx)(DashboardStepNav, {
				addWidget,
				cancel,
				isEditing,
				resetLayout,
				saveLayout,
				setIsEditing,
				widgets
			}),
			cancelModal
		] });
		$[0] = activeDragId;
		$[1] = addWidget;
		$[2] = cancel;
		$[3] = cancelModal;
		$[4] = currentLayout;
		$[5] = deleteWidget;
		$[6] = isEditing;
		$[7] = moveWidget;
		$[8] = resetLayout;
		$[9] = resizeWidget;
		$[10] = saveLayout;
		$[11] = sensors;
		$[12] = setIsEditing;
		$[13] = t;
		$[14] = updateWidgetData;
		$[15] = widgets;
		$[16] = t1;
	} else t1 = $[16];
	return t1;
}
function _temp(e) {
	return e.stopPropagation();
}
function WidgetWidthDropdown({ currentWidth, maxWidth, minWidth, onResize }) {
	const validOptions = (0, import_react.useMemo)(() => {
		const minPercentage = WIDTH_TO_PERCENTAGE[minWidth];
		const maxPercentage = WIDTH_TO_PERCENTAGE[maxWidth];
		return Object.entries(WIDTH_TO_PERCENTAGE).map(([key, value]) => ({
			width: key,
			percentage: value
		})).filter((option) => option.percentage >= minPercentage && option.percentage <= maxPercentage);
	}, [minWidth, maxWidth]);
	if (validOptions.length <= 1) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(it, {
		button: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: "widget-wrapper__size-btn",
			onPointerDown: (e) => e.stopPropagation(),
			type: "button",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "widget-wrapper__size-btn-text",
				children: currentWidth
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ze, { className: "widget-wrapper__size-btn-icon" })]
		}),
		buttonType: "custom",
		render: ({ close }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ce.ButtonGroup, { children: validOptions.map((option_0) => {
			const isSelected = option_0.width === currentWidth;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Ce.Button, {
				active: isSelected,
				onClick: () => {
					onResize(option_0.width);
					close();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "widget-wrapper__size-btn-label",
					children: option_0.width
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "widget-wrapper__size-btn-percentage",
					children: [option_0.percentage.toFixed(0), "%"]
				})]
			}, option_0.width);
		}) }),
		size: "small",
		verticalAlign: "bottom"
	});
}
function DraggableItem(props) {
	const $ = (0, import_compiler_runtime.c)(13);
	let t0;
	if ($[0] !== props.disabled || $[1] !== props.id) {
		t0 = {
			id: props.id,
			disabled: props.disabled
		};
		$[0] = props.disabled;
		$[1] = props.id;
		$[2] = t0;
	} else t0 = $[2];
	const { attributes, isDragging, listeners, setNodeRef } = useDraggable(t0);
	const t1 = isDragging ? .3 : 1;
	let t2;
	if ($[3] !== attributes || $[4] !== listeners || $[5] !== props.children || $[6] !== props.disabled || $[7] !== props.id || $[8] !== props.style || $[9] !== props.width || $[10] !== setNodeRef || $[11] !== t1) {
		const mergedStyles = {
			...props.style,
			opacity: t1,
			position: "relative"
		};
		const draggableProps = props.disabled ? {} : {
			...listeners,
			...attributes
		};
		t2 = (0, import_jsx_runtime.jsxs)("div", {
			className: "widget",
			"data-slug": props.id,
			"data-width": props.width,
			style: mergedStyles,
			children: [
				(0, import_jsx_runtime.jsx)(DroppableItem, {
					id: props.id,
					position: "before"
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "draggable",
					id: props.id,
					ref: setNodeRef,
					...draggableProps,
					style: {
						width: "100%",
						height: "100%"
					},
					children: props.children
				}),
				(0, import_jsx_runtime.jsx)(DroppableItem, {
					id: props.id,
					position: "after"
				})
			]
		});
		$[3] = attributes;
		$[4] = listeners;
		$[5] = props.children;
		$[6] = props.disabled;
		$[7] = props.id;
		$[8] = props.style;
		$[9] = props.width;
		$[10] = setNodeRef;
		$[11] = t1;
		$[12] = t2;
	} else t2 = $[12];
	return t2;
}
function DroppableItem(t0) {
	const $ = (0, import_compiler_runtime.c)(11);
	const { id, position } = t0;
	const t1 = `${id}-${position}`;
	let t2;
	if ($[0] !== position) {
		t2 = { position };
		$[0] = position;
		$[1] = t2;
	} else t2 = $[1];
	let t3;
	if ($[2] !== t1 || $[3] !== t2) {
		t3 = {
			id: t1,
			data: t2
		};
		$[2] = t1;
		$[3] = t2;
		$[4] = t3;
	} else t3 = $[4];
	const { setNodeRef, isOver } = useDroppable(t3);
	const t4 = `${id}-${position}`;
	const t5 = position === "before" ? -2 : "auto";
	const t6 = position === "after" ? -2 : "auto";
	const t7 = isOver ? "var(--theme-success-400)" : "transparent";
	let t8;
	if ($[5] !== setNodeRef || $[6] !== t4 || $[7] !== t5 || $[8] !== t6 || $[9] !== t7) {
		t8 = (0, import_jsx_runtime.jsx)("div", {
			className: "droppable-widget",
			"data-testid": t4,
			ref: setNodeRef,
			style: {
				position: "absolute",
				left: t5,
				right: t6,
				top: 0,
				bottom: 0,
				borderRadius: "1000px",
				width: "4px",
				backgroundColor: t7,
				marginBottom: "10px",
				marginTop: "10px",
				pointerEvents: "none",
				zIndex: 1e3
			}
		});
		$[5] = setNodeRef;
		$[6] = t4;
		$[7] = t5;
		$[8] = t6;
		$[9] = t7;
		$[10] = t8;
	} else t8 = $[10];
	return t8;
}
//#endregion
export { ModularDashboardClient };
