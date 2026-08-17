import { C as require_react, j as __toESM, n as require_jsx_runtime } from "../index.js";
import { t as createLucideIcon } from "./createLucideIcon-hDPz0_4O.js";
import { t as Plus } from "./plus-wFo5VM3v.js";
import { t as Minus } from "./minus-oEkXEeYh.js";
import { SiteFrame } from "./SiteFrame-5pF_eYdh.js";
//#region node_modules/lucide-react/dist/esm/icons/circle-check.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* @license lucide-react v0.468.0 - ISC
*
* This source code is licensed under the ISC license.
* See the LICENSE file in the root directory of this source tree.
*/
var CircleCheck = createLucideIcon("CircleCheck", [["circle", {
	cx: "12",
	cy: "12",
	r: "10",
	key: "1mglay"
}], ["path", {
	d: "m9 12 2 2 4-4",
	key: "dzmm74"
}]]);
//#endregion
//#region lib/registration.ts
var REGISTRATION_PRICE_CENTS = 4e3;
var BREAKFAST_PRICE_CENTS = 2500;
var BREAKFASTS = [
	{
		id: "friday",
		name: "New Year's Day Breakfast - Friday"
	},
	{
		id: "saturday",
		name: "Breakfast - Saturday"
	},
	{
		id: "sunday",
		name: "Breakfast - Sunday"
	}
];
var POLICY_KEYS = [
	"readPolicy",
	"understandQuestions",
	"acknowledgeBehavior",
	"understandAdmission",
	"understandReporting",
	"understandInvestigation",
	"signatureAgreement"
];
function breakfastCount(order) {
	return BREAKFASTS.reduce((total, item) => total + order.breakfast[item.id], 0);
}
function orderSubtotalCents(order) {
	return (order.selfRegistration ? REGISTRATION_PRICE_CENTS : 0) + breakfastCount(order) * BREAKFAST_PRICE_CENTS + (order.scholarship.enabled ? order.scholarship.amountCents : 0);
}
function calculateProcessingFee(amountInCents) {
	return Math.round((amountInCents + 30) / .971 - amountInCents);
}
//#endregion
//#region components/site/RegistrationPortal.tsx
var import_jsx_runtime = require_jsx_runtime();
var policyLabels = {
	readPolicy: "I have received, read, and understand the NECYPAA Anti-Harassment and Non-Discrimination Policy.",
	understandQuestions: "I understand that questions about this policy may be directed to NECYPAA Advisory members.",
	acknowledgeBehavior: "I acknowledge that behavior deemed unsafe or discriminatory may result in removal and could lead to a ban from future NECYPAA events.",
	understandAdmission: "I understand that I will not be admitted if I do not complete every required acknowledgment.",
	understandReporting: "I understand that I may report unsafe or discriminatory behavior to NECYPAA Advisory or the Host Committee.",
	understandInvestigation: "I understand that reports will be investigated by NECYPAA Advisory.",
	signatureAgreement: "I understand that checking every box serves as my signature and agreement to follow this policy."
};
var initialOrder = {
	purchaserName: "",
	purchaserEmail: "",
	selfRegistration: true,
	attendee: {
		name: "",
		state: "",
		email: "",
		accommodations: "",
		interpretationNeeded: false,
		mobilityAccessibility: false,
		willingToServe: false,
		homegroupCommittee: ""
	},
	policy: Object.fromEntries(POLICY_KEYS.map((key) => [key, false])),
	breakfast: {
		friday: 0,
		saturday: 0,
		sunday: 0
	},
	scholarship: {
		enabled: false,
		kind: "general",
		amountCents: REGISTRATION_PRICE_CENTS,
		recipientName: "",
		recipientEmail: "",
		recipientState: "",
		recipientHomegroupCommittee: "",
		recipientAccommodations: "",
		recipientInterpretationNeeded: false,
		recipientMobilityAccessibility: false,
		recipientWillingToServe: false,
		attribution: ""
	}
};
function Quantity({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "registration-quantity",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Decrease quantity",
				onClick: () => onChange(Math.max(0, value - 1)),
				type: "button",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				"aria-label": "Increase quantity",
				onClick: () => onChange(Math.min(20, value + 1)),
				type: "button",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
			})
		]
	});
}
function RegistrationPortal({ cash = false }) {
	const [order, setOrder] = (0, import_react.useState)(initialOrder);
	const [code, setCode] = (0, import_react.useState)("");
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [complete, setComplete] = (0, import_react.useState)(null);
	const subtotal = (0, import_react.useMemo)(() => orderSubtotalCents(order), [order]);
	const processingFee = cash || subtotal === 0 ? 0 : calculateProcessingFee(subtotal);
	const total = subtotal + processingFee;
	const money = (cents) => new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	}).format(cents / 100);
	const updateAttendee = (field, value) => setOrder((current) => ({
		...current,
		attendee: {
			...current.attendee,
			[field]: value
		}
	}));
	const updateScholarship = (field, value) => setOrder((current) => ({
		...current,
		scholarship: {
			...current.scholarship,
			[field]: value
		}
	}));
	const submit = async () => {
		setSubmitting(true);
		setError("");
		try {
			const response = await fetch(cash ? "/api/cash" : "/api/stripe/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(cash ? {
					code,
					order
				} : order)
			});
			const result = await response.json();
			if (!response.ok) throw new Error(result.error || "The order could not be submitted.");
			if (cash) setComplete(result.reference || "recorded");
			else if (result.url) window.location.assign(result.url);
			else throw new Error("Stripe did not return a checkout link.");
		} catch (cause) {
			setError(cause instanceof Error ? cause.message : "The order could not be submitted.");
		} finally {
			setSubmitting(false);
		}
	};
	if (complete) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
		mainId: "registration-main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "registration-page",
			id: "registration-main",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "registration-shell registration-complete",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Cash order recorded" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Stripe customer record and local cash transaction were created successfully." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["Reference ", complete] })
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
		mainId: "registration-main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "registration-page",
			id: "registration-main",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "registration-hero",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "registration-shell",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: cash ? "Authorized in-person entry" : "Convention registration" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: cash ? "Record a cash order" : "Build your NECYPAA order" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Registration $40 · Breakfast $25 each · Scholarships from $40" })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "registration-shell registration-layout",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "registration-form-stack",
					children: [
						cash ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card registration-code",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Access code" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This code authorizes an in-person cash order and controls redemption limits." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Code *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoComplete: "one-time-code",
									onChange: (event) => setCode(event.target.value.toUpperCase()),
									value: code
								})] })
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Purchaser" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "registration-grid",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									onChange: (event) => setOrder({
										...order,
										purchaserName: event.target.value
									}),
									value: order.purchaserName
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									onChange: (event) => setOrder({
										...order,
										purchaserEmail: event.target.value
									}),
									type: "email",
									value: order.purchaserEmail
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "registration-card-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Convention registration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Registering yourself activates attendee details and the required policy acknowledgment." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "registration-switch",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										checked: order.selfRegistration,
										onChange: (event) => setOrder({
											...order,
											selfRegistration: event.target.checked
										}),
										type: "checkbox"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.selfRegistration ? "Included" : "Not included" })]
								})]
							}), order.selfRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "registration-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Attendee name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										onChange: (e) => updateAttendee("name", e.target.value),
										value: order.attendee.name
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "State *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										onChange: (e) => updateAttendee("state", e.target.value),
										value: order.attendee.state
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Attendee email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										onChange: (e) => updateAttendee("email", e.target.value),
										type: "email",
										value: order.attendee.email
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Homegroup / committee *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										onChange: (e) => updateAttendee("homegroupCommittee", e.target.value),
										value: order.attendee.homegroupCommittee
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "registration-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Accommodation needs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											onChange: (e) => updateAttendee("accommodations", e.target.value),
											value: order.attendee.accommodations
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "registration-full registration-checks",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												checked: order.attendee.interpretationNeeded,
												onChange: (e) => updateAttendee("interpretationNeeded", e.target.checked),
												type: "checkbox"
											}), " Interpretation needed"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												checked: order.attendee.mobilityAccessibility,
												onChange: (e) => updateAttendee("mobilityAccessibility", e.target.checked),
												type: "checkbox"
											}), " Mobility accessibility needed"] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												checked: order.attendee.willingToServe,
												onChange: (e) => updateAttendee("willingToServe", e.target.checked),
												type: "checkbox"
											}), " Willing to be of service"] })
										]
									})
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Breakfast tickets" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Choose any quantity for Friday, Saturday, or Sunday morning." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "registration-products",
									children: BREAKFASTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [money(BREAKFAST_PRICE_CENTS), " each"] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quantity, {
										value: order.breakfast[item.id],
										onChange: (value) => setOrder((current) => ({
											...current,
											breakfast: {
												...current.breakfast,
												[item.id]: value
											}
										}))
									})] }, item.id))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "registration-card-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Registration scholarship" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Reserve one for a person or contribute to the general door fund." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "registration-switch",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										checked: order.scholarship.enabled,
										onChange: (e) => updateScholarship("enabled", e.target.checked),
										type: "checkbox"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.scholarship.enabled ? "Included" : "Not included" })]
								})]
							}), order.scholarship.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "registration-grid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scholarship type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										onChange: (e) => updateScholarship("kind", e.target.value),
										value: order.scholarship.kind,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "general",
											children: "General scholarship fund"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "specific",
											children: "Specific person"
										})]
									})] }),
									order.scholarship.kind === "general" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Contribution amount *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										min: "40",
										onChange: (e) => updateScholarship("amountCents", Math.max(4e3, Math.round(Number(e.target.value || 40) * 100))),
										step: "1",
										type: "number",
										value: order.scholarship.amountCents / 100
									})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipient name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (e) => updateScholarship("recipientName", e.target.value),
											value: order.scholarship.recipientName
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipient email *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (e) => updateScholarship("recipientEmail", e.target.value),
											type: "email",
											value: order.scholarship.recipientEmail
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipient state *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (e) => updateScholarship("recipientState", e.target.value),
											value: order.scholarship.recipientState
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Homegroup / committee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (e) => updateScholarship("recipientHomegroupCommittee", e.target.value),
											value: order.scholarship.recipientHomegroupCommittee
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "registration-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recipient accommodation needs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												onChange: (e) => updateScholarship("recipientAccommodations", e.target.value),
												value: order.scholarship.recipientAccommodations
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "registration-full registration-checks",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													checked: order.scholarship.recipientInterpretationNeeded,
													onChange: (e) => updateScholarship("recipientInterpretationNeeded", e.target.checked),
													type: "checkbox"
												}), " Interpretation needed"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													checked: order.scholarship.recipientMobilityAccessibility,
													onChange: (e) => updateScholarship("recipientMobilityAccessibility", e.target.checked),
													type: "checkbox"
												}), " Mobility accessibility needed"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													checked: order.scholarship.recipientWillingToServe,
													onChange: (e) => updateScholarship("recipientWillingToServe", e.target.checked),
													type: "checkbox"
												}), " Willing to be of service"] })
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "registration-full",
											children: "The recipient will be added to the attendee roster. Their policy status will remain pending until they personally sign it."
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "registration-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AA entity attribution (optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											onChange: (e) => updateScholarship("attribution", e.target.value),
											placeholder: "Meeting, YPAA committee, district, area, or state",
											value: order.scholarship.attribution
										})]
									})
								]
							}) : null]
						}),
						order.selfRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "registration-card registration-policy",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Non-Discrimination and Anti-Harassment Policy" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "registration-policy-text",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "NECYPAA is committed to an environment free of discrimination and harassment, including sexual harassment, for Advisory Council and Host Committee members, Bid Committee members, conference attendees, and participants in NECYPAA-operated online spaces." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Non-discrimination" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "NECYPAA prohibits discrimination based on age, race, color, religion, sex, national origin, creed, disability, veteran status, sexual orientation, gender identity, or gender expression." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Anti-harassment" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Harassment and sexual harassment are prohibited. This includes unwelcome verbal, physical, or visual conduct that creates an intimidating, hostile, or offensive environment; unwelcome sexual advances or requests; and conduct used as the basis for decisions affecting another person." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Reporting, retaliation, and corrective action" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Unsafe, discriminatory, or harassing conduct should be reported to NECYPAA Advisory or the Host Committee. Retaliation for reporting is prohibited. Violations may lead to removal, dismissal, or exclusion from future events. Crimes or immediate safety threats should be reported to the proper authorities." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Safety statement" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Everyone is asked to help maintain a secure and welcoming environment, refrain from behavior that may compromise another person’s safety, and take appropriate action when safety is jeopardized." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "registration-policy-checks",
									children: POLICY_KEYS.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										checked: order.policy[key],
										onChange: (e) => setOrder((current) => ({
											...current,
											policy: {
												...current.policy,
												[key]: e.target.checked
											}
										})),
										type: "checkbox"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [policyLabels[key], " *"] })] }, key))
								})
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "registration-summary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Order summary" }),
						order.selfRegistration ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Registration" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(REGISTRATION_PRICE_CENTS) })] }) : null,
						BREAKFASTS.map((item) => order.breakfast[item.id] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							item.name,
							" × ",
							order.breakfast[item.id]
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(order.breakfast[item.id] * BREAKFAST_PRICE_CENTS) })] }, item.id) : null),
						order.scholarship.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.scholarship.kind === "general" ? "General scholarship fund" : "Specific-person scholarship" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(order.scholarship.amountCents) })] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(subtotal) })] }),
						!cash && subtotal > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Processing fee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(processingFee) })] }) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "registration-total",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cash ? "Cash value" : "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: money(total) })]
						}),
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "registration-error",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							disabled: submitting || subtotal <= 0 || cash && !code,
							onClick: submit,
							type: "button",
							children: submitting ? "Submitting…" : cash ? "Record cash order" : "Continue to secure payment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: cash ? "Creates or updates a Stripe customer and records the transaction without charging a card." : "You’ll finish payment on Stripe’s secure checkout." })
					]
				})]
			})]
		})
	});
}
//#endregion
export { RegistrationPortal };
