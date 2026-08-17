import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as Link } from "./link-B4TgbXTk.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
import { t as ArrowLeft } from "./arrow-left-Y8Wot3rg.js";
import { n as CalendarDays, t as SESSION_TYPE_LABELS } from "./program-types-CCKzS0sz.js";
import { t as ChevronRight } from "./chevron-right-iKKN5M3j.js";
import { t as Plus } from "./plus-wFo5VM3v.js";
import { t as Save } from "./save-CqjgGUiN.js";
import { t as Trash2 } from "./trash-2-D8muVtgh.js";
import { t as X } from "./x-Dc2IBGkZ.js";
//#region node_modules/lucide-react/dist/esm/icons/building-2.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Building2 = createLucideIcon("Building2", [
	["path", {
		d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z",
		key: "1b4qmf"
	}],
	["path", {
		d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2",
		key: "i71pzd"
	}],
	["path", {
		d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2",
		key: "10jefs"
	}],
	["path", {
		d: "M10 6h4",
		key: "1itunk"
	}],
	["path", {
		d: "M10 10h4",
		key: "tcdvrf"
	}],
	["path", {
		d: "M10 14h4",
		key: "kelpxr"
	}],
	["path", {
		d: "M10 18h4",
		key: "1ulq68"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/chevron-left.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var ChevronLeft = createLucideIcon("ChevronLeft", [["path", {
	d: "m15 18-6-6 6-6",
	key: "1wnfg3"
}]]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/grip-vertical.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var GripVertical = createLucideIcon("GripVertical", [
	["circle", {
		cx: "9",
		cy: "12",
		r: "1",
		key: "1vctgf"
	}],
	["circle", {
		cx: "9",
		cy: "5",
		r: "1",
		key: "hp0tcf"
	}],
	["circle", {
		cx: "9",
		cy: "19",
		r: "1",
		key: "fkjjf6"
	}],
	["circle", {
		cx: "15",
		cy: "12",
		r: "1",
		key: "1tmaij"
	}],
	["circle", {
		cx: "15",
		cy: "5",
		r: "1",
		key: "19l28e"
	}],
	["circle", {
		cx: "15",
		cy: "19",
		r: "1",
		key: "f4zoj3"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/pencil.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Pencil = createLucideIcon("Pencil", [["path", {
	d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
	key: "1a8usu"
}], ["path", {
	d: "m15 5 4 4",
	key: "1mk7zo"
}]]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/rotate-cw.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var RotateCw = createLucideIcon("RotateCw", [["path", {
	d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8",
	key: "1p45f6"
}], ["path", {
	d: "M21 3v5h-5",
	key: "1q7to0"
}]]);
//#endregion
//#region components/admin/ProgramBoard.tsx
var import_jsx_runtime = require_jsx_runtime();
var CONVENTION_DAYS = [
	"2026-12-31",
	"2027-01-01",
	"2027-01-02",
	"2027-01-03"
];
var EMPTY_FORM = {
	title: "",
	sessionType: "panel",
	date: CONVENTION_DAYS[0],
	startTime: "09:00",
	endTime: "10:00",
	room: "",
	shortDescription: "",
	language: "English",
	audience: "",
	accessibility: "",
	status: "published",
	featured: false,
	internalNotes: ""
};
var EMPTY_ROOM_FORM = {
	name: "",
	shortLabel: "",
	floor: "Convention level",
	capacity: "",
	accessible: true,
	directions: "",
	displayOrder: "0",
	mapX: "",
	mapY: "",
	color: "#E85E27",
	notes: ""
};
var TIME_ZONE = "America/New_York";
function dateKey(value) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(new Date(value));
	const find = (type) => parts.find((part) => part.type === type)?.value || "";
	return `${find("year")}-${find("month")}-${find("day")}`;
}
function timeValue(value) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(new Date(value));
	return `${parts.find((part) => part.type === "hour")?.value || "00"}:${parts.find((part) => part.type === "minute")?.value || "00"}`;
}
function dayLabel(key) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		weekday: "short",
		month: "short",
		day: "numeric"
	}).format(/* @__PURE__ */ new Date(`${key}T12:00:00-05:00`));
}
function iso(date, time) {
	return (/* @__PURE__ */ new Date(`${date}T${time}:00-05:00`)).toISOString();
}
function slugify(value) {
	return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
function relationshipID(value) {
	return /^\d+$/.test(value) ? Number(value) : value;
}
function normalizeRoom(value) {
	if (!value || typeof value !== "object") return null;
	const room = value;
	return {
		id: room.id,
		name: String(room.name || "Room"),
		shortLabel: String(room.shortLabel || room.name || "Room"),
		floor: typeof room.floor === "string" ? room.floor : null,
		capacity: typeof room.capacity === "number" ? room.capacity : null,
		accessible: room.accessible !== false,
		directions: typeof room.directions === "string" ? room.directions : "",
		displayOrder: Number(room.displayOrder || 0),
		mapX: typeof room.mapX === "number" ? room.mapX : null,
		mapY: typeof room.mapY === "number" ? room.mapY : null,
		color: typeof room.color === "string" ? room.color : null,
		notes: typeof room.notes === "string" ? room.notes : ""
	};
}
function normalizeSession(value, rooms) {
	if (!value || typeof value !== "object") return null;
	const doc = value;
	const room = normalizeRoom(doc.room) || rooms.find((candidate) => String(candidate.id) === String(doc.room));
	if (!room) return null;
	return {
		id: doc.id,
		title: String(doc.title || "Untitled session"),
		slug: String(doc.slug || doc.id),
		sessionType: String(doc.sessionType || "panel"),
		startAt: String(doc.startAt),
		endAt: String(doc.endAt),
		room,
		shortDescription: typeof doc.shortDescription === "string" ? doc.shortDescription : null,
		language: typeof doc.language === "string" ? doc.language : null,
		audience: typeof doc.audience === "string" ? doc.audience : null,
		accessibility: typeof doc.accessibility === "string" ? doc.accessibility : null,
		featured: Boolean(doc.featured),
		status: typeof doc.status === "string" ? doc.status : null,
		tracks: Array.isArray(doc.tracks) ? doc.tracks.map(String) : null
	};
}
function ProgramBoard() {
	const [state, setState] = (0, import_react.useState)("loading");
	const [rooms, setRooms] = (0, import_react.useState)([]);
	const [sessions, setSessions] = (0, import_react.useState)([]);
	const [day, setDay] = (0, import_react.useState)(CONVENTION_DAYS[0]);
	const [form, setForm] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [draggedSessionID, setDraggedSessionID] = (0, import_react.useState)(null);
	const [dropTarget, setDropTarget] = (0, import_react.useState)(null);
	const [movingSessionIDs, setMovingSessionIDs] = (0, import_react.useState)(() => /* @__PURE__ */ new Set());
	const [roomForm, setRoomForm] = (0, import_react.useState)(null);
	const [roomSaving, setRoomSaving] = (0, import_react.useState)(false);
	const [roomMessage, setRoomMessage] = (0, import_react.useState)("");
	const [roomOrdering, setRoomOrdering] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		try {
			const authResponse = await fetch("/api/users/me", { credentials: "same-origin" });
			if (!(authResponse.ok ? await authResponse.json() : null)?.user) {
				setState("unauthorized");
				return;
			}
			const [roomResponse, sessionResponse] = await Promise.all([fetch("/api/rooms?limit=100&sort=displayOrder&depth=0", { credentials: "same-origin" }), fetch("/api/program-sessions?limit=500&sort=startAt&depth=1", { credentials: "same-origin" })]);
			if (roomResponse.status === 401 || roomResponse.status === 403 || sessionResponse.status === 401 || sessionResponse.status === 403) {
				setState("unauthorized");
				return;
			}
			if (!roomResponse.ok || !sessionResponse.ok) throw new Error("Unable to load program data");
			const nextRooms = ((await roomResponse.json()).docs || []).map(normalizeRoom).filter((value) => Boolean(value));
			const nextSessions = ((await sessionResponse.json()).docs || []).map((value) => normalizeSession(value, nextRooms)).filter((value) => Boolean(value));
			setRooms(nextRooms);
			setSessions(nextSessions);
			setState("ready");
		} catch {
			setState("error");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => {
			load();
		}, 0);
		return () => window.clearTimeout(timer);
	}, [load]);
	const daySessions = (0, import_react.useMemo)(() => sessions.filter((session) => dateKey(session.startAt) === day), [day, sessions]);
	function startCreate(roomID, startTime = "09:00") {
		const [hour, minute] = startTime.split(":").map(Number);
		const endMinutes = hour * 60 + minute + 60;
		setMessage("");
		setForm({
			...EMPTY_FORM,
			date: day,
			startTime,
			endTime: `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`,
			room: roomID || String(rooms[0]?.id || "")
		});
	}
	function startEdit(session) {
		setMessage("");
		setForm({
			id: session.id,
			title: session.title,
			sessionType: session.sessionType,
			date: dateKey(session.startAt),
			startTime: timeValue(session.startAt),
			endTime: timeValue(session.endAt),
			room: String(session.room.id),
			shortDescription: session.shortDescription || "",
			language: session.language || "English",
			audience: session.audience || "",
			accessibility: session.accessibility || "",
			status: session.status || "published",
			featured: Boolean(session.featured),
			internalNotes: ""
		});
	}
	function startCreateRoom() {
		const nextOrder = rooms.length ? Math.max(...rooms.map((room) => room.displayOrder)) + 10 : 0;
		setRoomMessage("");
		setRoomForm({
			...EMPTY_ROOM_FORM,
			displayOrder: String(nextOrder)
		});
	}
	function startEditRoom(room) {
		setRoomMessage("");
		setRoomForm({
			id: room.id,
			name: room.name,
			shortLabel: room.shortLabel,
			floor: room.floor || "",
			capacity: room.capacity == null ? "" : String(room.capacity),
			accessible: room.accessible,
			directions: room.directions,
			displayOrder: String(room.displayOrder),
			mapX: room.mapX == null ? "" : String(room.mapX),
			mapY: room.mapY == null ? "" : String(room.mapY),
			color: room.color || "#E85E27",
			notes: room.notes
		});
	}
	async function saveRoom(event) {
		event.preventDefault();
		if (!roomForm) return;
		setRoomSaving(true);
		setRoomMessage("");
		const payload = {
			name: roomForm.name,
			shortLabel: roomForm.shortLabel,
			floor: roomForm.floor,
			capacity: roomForm.capacity === "" ? null : Number(roomForm.capacity),
			accessible: roomForm.accessible,
			directions: roomForm.directions,
			displayOrder: Number(roomForm.displayOrder),
			mapX: roomForm.mapX === "" ? null : Number(roomForm.mapX),
			mapY: roomForm.mapY === "" ? null : Number(roomForm.mapY),
			color: roomForm.color,
			notes: roomForm.notes
		};
		const response = await fetch(roomForm.id ? `/api/rooms/${roomForm.id}` : "/api/rooms", {
			method: roomForm.id ? "PATCH" : "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		setRoomSaving(false);
		if (!response.ok) {
			setRoomMessage((await response.json().catch(() => ({}))).errors?.[0]?.message || "The room could not be saved.");
			return;
		}
		setRoomForm(null);
		await load();
	}
	async function moveRoom(roomID, direction) {
		const currentIndex = rooms.findIndex((room) => String(room.id) === roomID);
		const nextIndex = currentIndex + direction;
		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= rooms.length || roomOrdering) return;
		const previousRooms = rooms;
		const reordered = [...rooms];
		[reordered[currentIndex], reordered[nextIndex]] = [reordered[nextIndex], reordered[currentIndex]];
		const normalized = reordered.map((room, index) => ({
			...room,
			displayOrder: index * 10
		}));
		setRooms(normalized);
		setRoomOrdering(true);
		setMessage("Saving room order…");
		try {
			if ((await Promise.all(normalized.map((room) => fetch(`/api/rooms/${room.id}`, {
				method: "PATCH",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ displayOrder: room.displayOrder })
			})))).some((response) => !response.ok)) throw new Error("Room order failed");
			setMessage("Room order saved.");
		} catch {
			setRooms(previousRooms);
			setMessage("The room order could not be saved.");
			await load();
		} finally {
			setRoomOrdering(false);
		}
	}
	function overlapping(candidate) {
		const start = new Date(candidate.startAt).getTime();
		const end = new Date(candidate.endAt).getTime();
		return sessions.find((session) => String(session.id) !== String(candidate.id || "") && String(session.room.id) === candidate.room && start < new Date(session.endAt).getTime() && end > new Date(session.startAt).getTime());
	}
	async function save(event) {
		event.preventDefault();
		if (!form) return;
		const startAt = iso(form.date, form.startTime);
		const endAt = iso(form.date, form.endTime);
		if (new Date(endAt) <= new Date(startAt)) {
			setMessage("End time must be later than start time.");
			return;
		}
		const conflict = overlapping({
			id: form.id,
			room: form.room,
			startAt,
			endAt
		});
		if (conflict) {
			setMessage(`That overlaps “${conflict.title}” in the same room.`);
			return;
		}
		setSaving(true);
		setMessage("");
		const payload = {
			title: form.title,
			slug: `${slugify(form.title)}-${form.date}-${form.startTime.replace(":", "")}`,
			sessionType: form.sessionType,
			startAt,
			endAt,
			room: relationshipID(form.room),
			shortDescription: form.shortDescription,
			language: form.language,
			audience: form.audience,
			accessibility: form.accessibility,
			status: form.status,
			featured: form.featured,
			internalNotes: form.internalNotes
		};
		const response = await fetch(form.id ? `/api/program-sessions/${form.id}` : "/api/program-sessions", {
			method: form.id ? "PATCH" : "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		setSaving(false);
		if (!response.ok) {
			setMessage((await response.json().catch(() => ({}))).errors?.[0]?.message || "The session could not be saved.");
			return;
		}
		setForm(null);
		await load();
	}
	async function remove() {
		if (!form?.id || !window.confirm(`Delete “${form.title}”? This cannot be undone.`)) return;
		setSaving(true);
		const response = await fetch(`/api/program-sessions/${form.id}`, {
			method: "DELETE",
			credentials: "same-origin"
		});
		setSaving(false);
		if (!response.ok) {
			setMessage("The session could not be deleted.");
			return;
		}
		setForm(null);
		await load();
	}
	async function moveSession(sessionID, roomID, startTime) {
		const session = sessions.find((candidate) => String(candidate.id) === sessionID);
		if (!session) return;
		const duration = new Date(session.endAt).getTime() - new Date(session.startAt).getTime();
		const startAt = iso(day, startTime);
		const endAt = new Date(new Date(startAt).getTime() + duration).toISOString();
		const conflict = overlapping({
			id: session.id,
			room: roomID,
			startAt,
			endAt
		});
		if (conflict) {
			setMessage(`Move blocked: “${conflict.title}” already uses that room and time.`);
			return;
		}
		const nextRoom = rooms.find((room) => String(room.id) === roomID);
		if (!nextRoom) return;
		setSessions((current) => current.map((candidate) => String(candidate.id) === sessionID ? {
			...candidate,
			room: nextRoom,
			startAt,
			endAt
		} : candidate));
		setMovingSessionIDs((current) => new Set(current).add(sessionID));
		setMessage("Saving move…");
		const response = await fetch(`/api/program-sessions/${session.id}`, {
			method: "PATCH",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				room: relationshipID(roomID),
				startAt,
				endAt
			})
		});
		if (!response.ok) {
			const result = await response.json().catch(() => ({}));
			setSessions((current) => current.map((candidate) => String(candidate.id) === sessionID ? session : candidate));
			setMovingSessionIDs((current) => {
				const next = new Set(current);
				next.delete(sessionID);
				return next;
			});
			setMessage(result.errors?.[0]?.message || "The move could not be saved.");
			return;
		}
		setMovingSessionIDs((current) => {
			const next = new Set(current);
			next.delete(sessionID);
			return next;
		});
		setMessage("Move saved.");
	}
	if (state === "unauthorized") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "program-board-gate",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { "aria-hidden": "true" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Program Board" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sign in to Payload before opening the committee planning board." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				href: "/admin",
				children: "Sign in to Payload"
			})
		]
	});
	if (state === "error") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "program-board-gate",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Program Board" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The schedule could not be loaded." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					setState("loading");
					load();
				},
				type: "button",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { "aria-hidden": "true" }), " Try again"]
			})
		]
	});
	const startMinute = 480;
	const slots = 32;
	const slotHeight = 58;
	const draggedSession = sessions.find((session) => String(session.id) === draggedSessionID);
	const dropStartIndex = dropTarget ? (Number(dropTarget.time.slice(0, 2)) * 60 + Number(dropTarget.time.slice(3, 5)) - startMinute) / 30 : -1;
	const dropDurationSlots = draggedSession ? Math.max(1, Math.ceil((new Date(draggedSession.endAt).getTime() - new Date(draggedSession.startAt).getTime()) / 18e5)) : 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "program-board-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "program-board-header",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						href: "/admin",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { "aria-hidden": "true" }), " Payload admin"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Program Board" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Drag sessions to move them. Click an empty time to add one." })
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/program",
						target: "_blank",
						children: "View public program"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "program-board-secondary-action",
						onClick: startCreateRoom,
						type: "button",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { "aria-hidden": "true" }), " Add room"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => startCreate(),
						type: "button",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { "aria-hidden": "true" }), " Add session"]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "program-board-toolbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					role: "tablist",
					"aria-label": "Convention day",
					children: CONVENTION_DAYS.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-selected": day === value,
						onClick: () => setDay(value),
						role: "tab",
						type: "button",
						children: dayLabel(value)
					}, value))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"aria-live": "polite",
					children: message || `${daySessions.length} sessions · ${rooms.length} rooms`
				})]
			}),
			state === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-board-loading",
				children: "Loading program records…"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-board-scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "program-board-grid",
					style: {
						"--room-count": rooms.length,
						"--slot-height": `${slotHeight}px`
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "program-board-corner",
							children: "Time"
						}),
						rooms.map((room, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "program-board-room",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { background: room.color || void 0 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: room.shortLabel }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: room.floor }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "program-board-room-actions",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": `Move ${room.name} left`,
											disabled: index === 0 || roomOrdering,
											onClick: () => void moveRoom(String(room.id), -1),
											title: "Move room left",
											type: "button",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { "aria-hidden": "true" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": `Edit ${room.name}`,
											onClick: () => startEditRoom(room),
											title: `Edit ${room.name}`,
											type: "button",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { "aria-hidden": "true" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											"aria-label": `Move ${room.name} right`,
											disabled: index === rooms.length - 1 || roomOrdering,
											onClick: () => void moveRoom(String(room.id), 1),
											title: "Move room right",
											type: "button",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { "aria-hidden": "true" })
										})
									]
								})
							]
						}, room.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "program-board-axis",
							style: { height: slots * slotHeight },
							children: Array.from({ length: slots }, (_, index) => {
								const minutes = startMinute + index * 30;
								const hour = Math.floor(minutes / 60);
								const minute = minutes % 60;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { top: index * slotHeight },
									children: new Intl.DateTimeFormat("en-US", {
										hour: "numeric",
										minute: "2-digit"
									}).format(/* @__PURE__ */ new Date(`${day}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00-05:00`))
								}, index);
							})
						}),
						rooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "program-board-track",
							onDragLeave: (event) => {
								if (!event.currentTarget.contains(event.relatedTarget)) setDropTarget(null);
							},
							style: { height: slots * slotHeight },
							children: [Array.from({ length: slots }, (_, index) => {
								const minutes = startMinute + index * 30;
								const time = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
								const highlighted = dropTarget?.roomID === String(room.id) && index >= dropStartIndex && index < dropStartIndex + dropDurationSlots;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": `Add session in ${room.name} at ${time}`,
									className: "program-board-cell",
									"data-drop-active": highlighted || void 0,
									"data-drop-end": highlighted && index === dropStartIndex + dropDurationSlots - 1 || void 0,
									"data-drop-start": highlighted && index === dropStartIndex || void 0,
									onClick: () => startCreate(String(room.id), time),
									onDragEnter: (event) => {
										event.preventDefault();
										setDropTarget({
											roomID: String(room.id),
											time
										});
									},
									onDragOver: (event) => {
										event.preventDefault();
										event.dataTransfer.dropEffect = "move";
									},
									onDrop: (event) => {
										event.preventDefault();
										const sessionID = event.dataTransfer.getData("text/program-session");
										setDropTarget(null);
										setDraggedSessionID(null);
										moveSession(sessionID, String(room.id), time);
									},
									style: {
										height: slotHeight,
										top: index * slotHeight
									},
									type: "button"
								}, time);
							}), daySessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => {
								const sessionID = String(session.id);
								const [hour, minute] = timeValue(session.startAt).split(":").map(Number);
								const top = Math.max(0, (hour * 60 + minute - startMinute) / 30 * slotHeight + 3);
								const height = Math.max(slotHeight - 6, (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / 6e4 / 30 * slotHeight - 6);
								const moving = movingSessionIDs.has(sessionID);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									"aria-busy": moving,
									className: "program-board-event",
									"data-moving": moving || void 0,
									draggable: !moving,
									onClick: () => startEdit(session),
									onDragEnd: () => {
										setDraggedSessionID(null);
										setDropTarget(null);
									},
									onDragStart: (event) => {
										event.dataTransfer.effectAllowed = "move";
										event.dataTransfer.setData("text/program-session", sessionID);
										setDraggedSessionID(sessionID);
									},
									style: {
										background: room.color || void 0,
										height,
										top
									},
									type: "button",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { "aria-hidden": "true" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: timeValue(session.startAt) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session.title }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: moving ? "Saving…" : SESSION_TYPE_LABELS[session.sessionType] || session.sessionType })
									]
								}, session.id);
							})]
						}, room.id))
					]
				})
			}),
			form ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-board-modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "program-form-title",
					"aria-modal": "true",
					className: "program-board-modal",
					role: "dialog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: form.id ? "Edit program record" : "New program record" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "program-form-title",
						children: form.id ? form.title : "Add a session"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Close form",
						onClick: () => setForm(null),
						type: "button",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" })
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: save,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Title" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									onChange: (event) => setForm({
										...form,
										title: event.target.value
									}),
									required: true,
									value: form.title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								onChange: (event) => setForm({
									...form,
									sessionType: event.target.value
								}),
								value: form.sessionType,
								children: Object.entries(SESSION_TYPE_LABELS).map(([value, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value,
									children: label
								}, value))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Room" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								onChange: (event) => setForm({
									...form,
									room: event.target.value
								}),
								required: true,
								value: form.room,
								children: rooms.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: String(value.id),
									children: value.name
								}, value.id))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setForm({
									...form,
									date: event.target.value
								}),
								required: true,
								type: "date",
								value: form.date
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Starts" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setForm({
									...form,
									startTime: event.target.value
								}),
								required: true,
								step: "1800",
								type: "time",
								value: form.startTime
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ends" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setForm({
									...form,
									endTime: event.target.value
								}),
								required: true,
								step: "1800",
								type: "time",
								value: form.endTime
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								onChange: (event) => setForm({
									...form,
									status: event.target.value
								}),
								value: form.status,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "published",
										children: "Published"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "draft",
										children: "Draft"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cancelled",
										children: "Cancelled"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Public description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									onChange: (event) => setForm({
										...form,
										shortDescription: event.target.value
									}),
									rows: 3,
									value: form.shortDescription
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Language" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setForm({
									...form,
									language: event.target.value
								}),
								value: form.language
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Audience / affinity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setForm({
									...form,
									audience: event.target.value
								}),
								value: form.audience
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Accessibility information" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									onChange: (event) => setForm({
										...form,
										accessibility: event.target.value
									}),
									rows: 2,
									value: form.accessibility
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Internal committee notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									onChange: (event) => setForm({
										...form,
										internalNotes: event.target.value
									}),
									rows: 2,
									value: form.internalNotes
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-check",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									checked: form.featured,
									onChange: (event) => setForm({
										...form,
										featured: event.target.checked
									}),
									type: "checkbox"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Mark as featured ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Saved for future homepage or program spotlight sections; it does not currently change the schedule display." })] })]
							}),
							message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "program-board-form-error",
								children: message
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [form.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "program-board-delete",
								disabled: saving,
								onClick: () => void remove(),
								type: "button",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { "aria-hidden": "true" }), " Delete"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setForm(null),
								type: "button",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: saving,
								type: "submit",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { "aria-hidden": "true" }),
									" ",
									saving ? "Saving…" : "Save session"
								]
							})] })] })
						]
					})]
				})
			}) : null,
			roomForm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-board-modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "room-form-title",
					"aria-modal": "true",
					className: "program-board-modal",
					role: "dialog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: roomForm.id ? "Edit room record" : "New room record" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "room-form-title",
						children: roomForm.id ? roomForm.name : "Add a room"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "Close room form",
						onClick: () => setRoomForm(null),
						type: "button",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" })
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: saveRoom,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Full room name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									onChange: (event) => setRoomForm({
										...roomForm,
										name: event.target.value
									}),
									required: true,
									value: roomForm.name
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Short grid label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								maxLength: 30,
								onChange: (event) => setRoomForm({
									...roomForm,
									shortLabel: event.target.value
								}),
								required: true,
								value: roomForm.shortLabel
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Floor / area" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setRoomForm({
									...roomForm,
									floor: event.target.value
								}),
								value: roomForm.floor
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Capacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								min: "0",
								onChange: (event) => setRoomForm({
									...roomForm,
									capacity: event.target.value
								}),
								type: "number",
								value: roomForm.capacity
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grid order" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								onChange: (event) => setRoomForm({
									...roomForm,
									displayOrder: event.target.value
								}),
								required: true,
								type: "number",
								value: roomForm.displayOrder
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Room color" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "program-board-color-input",
								onChange: (event) => setRoomForm({
									...roomForm,
									color: event.target.value
								}),
								type: "color",
								value: roomForm.color
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Map position X (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								max: "100",
								min: "0",
								onChange: (event) => setRoomForm({
									...roomForm,
									mapX: event.target.value
								}),
								type: "number",
								value: roomForm.mapX
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Map position Y (%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								max: "100",
								min: "0",
								onChange: (event) => setRoomForm({
									...roomForm,
									mapY: event.target.value
								}),
								type: "number",
								value: roomForm.mapY
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Public directions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									onChange: (event) => setRoomForm({
										...roomForm,
										directions: event.target.value
									}),
									rows: 2,
									value: roomForm.directions
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-wide",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Internal room notes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									onChange: (event) => setRoomForm({
										...roomForm,
										notes: event.target.value
									}),
									rows: 2,
									value: roomForm.notes
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "program-board-check",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									checked: roomForm.accessible,
									onChange: (event) => setRoomForm({
										...roomForm,
										accessible: event.target.checked
									}),
									type: "checkbox"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Accessible room" })]
							}),
							roomMessage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "program-board-form-error",
								children: roomMessage
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setRoomForm(null),
								type: "button",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								disabled: roomSaving,
								type: "submit",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { "aria-hidden": "true" }),
									" ",
									roomSaving ? "Saving…" : "Save room"
								]
							})] })] })
						]
					})]
				})
			}) : null
		]
	});
}
//#endregion
export { ProgramBoard };
