import { C as require_react, j as __toESM, k as __exportAll, n as require_jsx_runtime } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
import { n as CalendarDays, t as SESSION_TYPE_LABELS } from "./program-types-CCKzS0sz.js";
import { t as X } from "./x-Dc2IBGkZ.js";
import { t as Search } from "./search-Bb93QS8I.js";
//#region node_modules/lucide-react/dist/esm/icons/map-pin.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var MapPin = createLucideIcon("MapPin", [["path", {
	d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
	key: "1r0f0z"
}], ["circle", {
	cx: "12",
	cy: "10",
	r: "3",
	key: "ilqhr7"
}]]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/accessibility.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Accessibility = createLucideIcon("Accessibility", [
	["circle", {
		cx: "16",
		cy: "4",
		r: "1",
		key: "1grugj"
	}],
	["path", {
		d: "m18 19 1-7-6 1",
		key: "r0i19z"
	}],
	["path", {
		d: "m5 8 3-3 5.5 3-2.36 3.5",
		key: "9ptxx2"
	}],
	["path", {
		d: "M4.24 14.5a5 5 0 0 0 6.88 6",
		key: "10kmtu"
	}],
	["path", {
		d: "M13.76 17.5a5 5 0 0 0-6.88-6",
		key: "2qq6rc"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/clock-3.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Clock3 = createLucideIcon("Clock3", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["polyline", {
	points: "12 6 12 12 16.5 12",
	key: "1aq6pp"
}]]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/grid-3x3.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Grid3x3 = createLucideIcon("Grid3x3", [
	["rect", {
		width: "18",
		height: "18",
		x: "3",
		y: "3",
		rx: "2",
		key: "afitv7"
	}],
	["path", {
		d: "M3 9h18",
		key: "1pudct"
	}],
	["path", {
		d: "M3 15h18",
		key: "5xshup"
	}],
	["path", {
		d: "M9 3v18",
		key: "fh3hqa"
	}],
	["path", {
		d: "M15 3v18",
		key: "14nvp0"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/list.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var List = createLucideIcon("List", [
	["path", {
		d: "M3 12h.01",
		key: "nlz23k"
	}],
	["path", {
		d: "M3 18h.01",
		key: "1tta3j"
	}],
	["path", {
		d: "M3 6h.01",
		key: "1rqtza"
	}],
	["path", {
		d: "M8 12h13",
		key: "1za7za"
	}],
	["path", {
		d: "M8 18h13",
		key: "1lx6n3"
	}],
	["path", {
		d: "M8 6h13",
		key: "ik3vkj"
	}]
]);
//#endregion
//#region node_modules/lucide-react/dist/esm/icons/map.js
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var Map = createLucideIcon("Map", [
	["path", {
		d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
		key: "169xi5"
	}],
	["path", {
		d: "M15 5.764v15",
		key: "1pn4in"
	}],
	["path", {
		d: "M9 3.236v15",
		key: "1uimfh"
	}]
]);
//#endregion
//#region components/site/ProgramExplorer.tsx
var ProgramExplorer_exports = /* @__PURE__ */ __exportAll({ ProgramExplorer: () => ProgramExplorer });
var import_jsx_runtime = require_jsx_runtime();
var TIME_ZONE = "America/New_York";
var EMPTY_DATA = {
	rooms: [],
	sessions: [],
	maps: []
};
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
function dayLabel(key) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		weekday: "long",
		month: "short",
		day: "numeric"
	}).format(/* @__PURE__ */ new Date(`${key}T12:00:00-05:00`));
}
function timeLabel(value) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		hour: "numeric",
		minute: "2-digit"
	}).format(new Date(value));
}
function minutesInDay(value) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone: TIME_ZONE,
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).formatToParts(new Date(value));
	const hour = Number(parts.find((part) => part.type === "hour")?.value || 0);
	const minute = Number(parts.find((part) => part.type === "minute")?.value || 0);
	return hour * 60 + minute;
}
function typeLabel(type) {
	return SESSION_TYPE_LABELS[type] || type.replaceAll("_", " ");
}
function SessionCard({ session, onOpen, compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: "program-session-card",
		"data-compact": compact,
		"data-type": session.sessionType,
		onClick: () => onOpen(session),
		type: "button",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "program-session-time",
				children: [timeLabel(session.startAt), compact ? "" : `–${timeLabel(session.endAt)}`]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: session.title }),
			!compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "program-session-room",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { "aria-hidden": "true" }), session.room.shortLabel]
			}) : null
		]
	});
}
function Agenda({ sessions, onOpen }) {
	if (!sessions.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "program-empty",
		children: "No sessions match these filters."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "program-agenda",
		children: sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionCard, {
			onOpen,
			session
		}, session.id))
	});
}
function ScheduleGrid({ rooms, sessions, onOpen }) {
	const startMinute = 480;
	const endMinute = 1440;
	const slotHeight = 54;
	const slots = (endMinute - startMinute) / 30;
	const visibleRooms = rooms.filter((room) => sessions.some((session) => String(session.room.id) === String(room.id)));
	if (!sessions.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "program-empty",
		children: "No sessions match these filters."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "program-grid-scroll",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "program-grid",
			style: {
				"--room-count": Math.max(visibleRooms.length, 1),
				"--slot-height": `${slotHeight}px`
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "program-grid-corner",
					children: "Time"
				}),
				visibleRooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "program-grid-room",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: room.shortLabel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: room.floor })]
				}, room.id)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "program-time-axis",
					style: { height: slots * slotHeight },
					children: Array.from({ length: slots }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { top: index * slotHeight },
						children: timeLabel(/* @__PURE__ */ new Date(`2027-01-01T${String(8 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}:00-05:00`))
					}, index))
				}),
				visibleRooms.map((room) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "program-room-track",
					style: { height: slots * slotHeight },
					children: sessions.filter((session) => String(session.room.id) === String(room.id)).map((session) => {
						const top = Math.max(0, (minutesInDay(session.startAt) - startMinute) / 30 * slotHeight);
						const duration = Math.max(30, (new Date(session.endAt).getTime() - new Date(session.startAt).getTime()) / 6e4);
						const height = Math.max(slotHeight - 8, Math.min(duration / 30 * slotHeight - 8, slots * slotHeight - top - 4));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "program-grid-event",
							style: {
								background: room.color || void 0,
								height,
								top
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionCard, {
								compact: true,
								onOpen,
								session
							})
						}, session.id);
					})
				}, room.id))
			]
		})
	});
}
function VenueMapView({ data }) {
	const map = data.maps[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "program-map-section",
		id: "hotel-map",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "program-map-copy",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Find your room" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: map?.title || "Convention-level map" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: map?.description || "A planning map for the convention rooms. Upload the final hotel floor plan in Payload when it is available." })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "program-map",
			"data-has-image": Boolean(map?.image?.url),
			children: [map?.image?.url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				alt: map.image.alt || map.altText,
				src: map.image.url
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-map-schematic",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "program-map-core",
					children: [
						"Registration",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"Elevators"
					]
				})
			}), data.rooms.map((room) => room.mapX != null && room.mapY != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "program-map-pin",
				style: {
					left: `${room.mapX}%`,
					top: `${room.mapY}%`,
					"--room-color": room.color || "var(--tenant-primary)"
				},
				children: room.shortLabel
			}, room.id) : null)]
		})]
	});
}
function ProgramExplorer({ initialData, heading = "Your weekend, mapped out", introduction = "Search the convention program, compare rooms, and open any session for details.", embedded = false }) {
	const [data, setData] = (0, import_react.useState)(initialData || EMPTY_DATA);
	const [loading, setLoading] = (0, import_react.useState)(!initialData);
	const [search, setSearch] = (0, import_react.useState)("");
	const [day, setDay] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [room, setRoom] = (0, import_react.useState)("all");
	const [view, setView] = (0, import_react.useState)("grid");
	const [selected, setSelected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (initialData) return;
		let active = true;
		fetch("/api/program-data").then((response) => response.json()).then((result) => {
			if (active) setData(result);
		}).finally(() => {
			if (active) setLoading(false);
		});
		return () => {
			active = false;
		};
	}, [initialData]);
	const days = (0, import_react.useMemo)(() => Array.from(new Set(data.sessions.map((session) => dateKey(session.startAt)))).sort(), [data.sessions]);
	const selectedDay = day || days[0] || "";
	const sessionTypes = (0, import_react.useMemo)(() => Array.from(new Set(data.sessions.map((session) => session.sessionType))).sort(), [data.sessions]);
	const filtered = (0, import_react.useMemo)(() => {
		const needle = search.trim().toLowerCase();
		return data.sessions.filter((session) => {
			if (selectedDay && dateKey(session.startAt) !== selectedDay) return false;
			if (type !== "all" && session.sessionType !== type) return false;
			if (room !== "all" && String(session.room.id) !== room) return false;
			if (needle && ![
				session.title,
				session.shortDescription,
				session.room.name,
				...session.tracks || []
			].join(" ").toLowerCase().includes(needle)) return false;
			return true;
		}).sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
	}, [
		data.sessions,
		room,
		search,
		selectedDay,
		type
	]);
	(0, import_react.useEffect)(() => {
		if (!selected) return;
		const close = (event) => {
			if (event.key === "Escape") setSelected(null);
		};
		window.addEventListener("keydown", close);
		return () => window.removeEventListener("keydown", close);
	}, [selected]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: embedded ? "program-embed" : "program-page",
		children: [
			!embedded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "program-hero",
				id: "program",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "program-shell",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
						"Convention",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "program" })
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: introduction })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "program-explorer-section",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "program-shell",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "program-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "NECYPAA XXXVI" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: heading }),
								embedded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "program-heading-description",
									children: introduction
								}) : null
							] }), !embedded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "#hotel-map",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { "aria-hidden": "true" }), " Hotel map"]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "program-day-tabs",
							role: "tablist",
							"aria-label": "Program day",
							children: days.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								"aria-selected": selectedDay === value,
								onClick: () => setDay(value),
								role: "tab",
								type: "button",
								children: dayLabel(value)
							}, value))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "program-toolbar",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "program-search",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { "aria-hidden": "true" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "sr-only",
											children: "Search sessions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (event) => setSearch(event.target.value),
											placeholder: "Search sessions, topics, or rooms",
											value: search
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Session type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									onChange: (event) => setType(event.target.value),
									value: type,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All types"
									}), sessionTypes.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value,
										children: typeLabel(value)
									}, value))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "sr-only",
									children: "Room"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									onChange: (event) => setRoom(event.target.value),
									value: room,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All rooms"
									}), data.rooms.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: String(value.id),
										children: value.shortLabel
									}, value.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "program-view-toggle",
									"aria-label": "Schedule view",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										"aria-pressed": view === "agenda",
										onClick: () => setView("agenda"),
										type: "button",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { "aria-hidden": "true" }), " Agenda"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										"aria-pressed": view === "grid",
										onClick: () => setView("grid"),
										type: "button",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { "aria-hidden": "true" }), " Room grid"]
									})]
								})
							]
						}),
						loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "program-empty",
							children: "Loading the program…"
						}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduleGrid, {
							onOpen: setSelected,
							rooms: data.rooms,
							sessions: filtered
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Agenda, {
							onOpen: setSelected,
							sessions: filtered
						})
					]
				})
			}),
			!embedded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-shell",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenueMapView, { data })
			}) : null,
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "program-dialog-backdrop",
				onMouseDown: (event) => {
					if (event.target === event.currentTarget) setSelected(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-labelledby": "program-dialog-title",
					"aria-modal": "true",
					className: "program-dialog",
					role: "dialog",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Close session details",
							onClick: () => setSelected(null),
							type: "button",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: typeLabel(selected.sessionType) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "program-dialog-title",
							children: selected.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { "aria-hidden": "true" }), "Time"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
								dayLabel(dateKey(selected.startAt)),
								", ",
								timeLabel(selected.startAt),
								"–",
								timeLabel(selected.endAt)
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { "aria-hidden": "true" }), "Room"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [selected.room.name, selected.room.floor ? ` · ${selected.room.floor}` : ""] })] }),
							selected.accessibility ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dt", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accessibility, { "aria-hidden": "true" }), "Accessibility"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: selected.accessibility })] }) : null
						] }),
						selected.shortDescription ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "program-dialog-description",
							children: selected.shortDescription
						}) : null,
						selected.tracks?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: selected.tracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: track }, track)) }) : null
					]
				})
			}) : null
		]
	});
}
//#endregion
export { MapPin as i, ProgramExplorer_exports as n, List as r, ProgramExplorer as t };
