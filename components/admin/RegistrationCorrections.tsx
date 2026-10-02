"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Search, UserRound } from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { fetchAllCRMRecords } from "@/lib/crm-pagination";
import { canEditCRM } from "@/lib/crm-access";

import styles from "./registration-corrections.module.css";

type ID = string | number;
type Contact = { id: ID; contactKey?: string; displayName: string; email: string; phone?: string; state?: string; homegroupCommittee?: string; tags?: string[]; notes?: string };
type Registration = { id: ID; updatedAt?: string; sourceKey: string; contact?: Contact | ID; checkoutOrder?: ID; entitlement?: ID; attendeeName: string; attendeeEmail: string; state: string; homegroupCommittee?: string; accommodations?: string; notes?: string; rawMetadata?: Record<string, unknown>; purchaserName: string; purchaserEmail: string; registrationPriceCents: number; attendanceStatus: string; attendanceBasis: string; paymentSource: string; paymentStatus: string; dataOrigin: string; purchasedAt: string; policyAcknowledgments?: Record<string, unknown>; canonicalNameConfirmed?: boolean; stripeCheckoutSessionId?: string; stripeChargeId?: string; stripePaymentIntentId?: string; stripeCustomerId?: string };
type BreakfastTicket = { id: ID; sourceKey?: string; ticketCode?: string; attendee?: ID; breakfastDay: string; status?: string; purchaserName?: string; purchaserEmail?: string; holderContact?: ID; rawMetadata?: Record<string, unknown>; stripeCheckoutSessionId?: string; stripePaymentIntentId?: string; stripeChargeId?: string };
type CheckoutOrder = { id: ID; sourceKey?: string; purchaserName: string; purchaserEmail: string; purchaserContact?: ID; subtotalCents?: number; processingFeeCents?: number; totalCents?: number; paymentStatus?: string; purchasedAt?: string; cardholderName?: string; cardBrand?: string; cardLast4?: string; cardFingerprint?: string; paymentSourceType?: string; checkoutLineItemSummary?: string; order?: Record<string, unknown>; rawMetadata?: Record<string, unknown>; stripeCheckoutSessionId?: string; stripeChargeId?: string; stripePaymentIntentId?: string; stripeCustomerId?: string };
type Entitlement = { id: ID; updatedAt?: string; sourceKey: string; checkoutOrder?: ID; purchaserContact?: ID; entitlementType: string; status: string; attendeeContact?: ID; registration?: ID; assignmentNote?: string; sourceMetadata?: Record<string, unknown> };
type ScholarshipContribution = { id: ID; sourceKey: string; checkoutOrder: ID; contributorContact: ID; contributionType: string; amountCents: number; allocatedCents: number; availableCents: number; fundedEntitlements?: ID[]; purchasedAt: string; notes?: string; sourceMetadata?: Record<string, unknown> };
type Correction = { id: ID; registration: ID | Registration; correctionType: string; reason: string; changedAt: string; fromContact?: Contact | ID; toContact?: Contact | ID; changedBy?: { email?: string } | ID; before?: Record<string, unknown>; after?: Record<string, unknown> };
type User = { id: ID; email?: string; role?: string };
type SearchCategory = "Contacts" | "Registrations" | "Scholarship Fund" | "Payments" | "Breakfast" | "Entitlements" | "Corrections";
type SearchRecord = { key: string; category: SearchCategory; title: string; subtitle: string; detail: string; href: string; registrationID?: ID; search: string };
const EMPTY_ENTITLEMENTS: Entitlement[] = [];
const SEARCH_CATEGORIES: SearchCategory[] = ["Contacts", "Registrations", "Scholarship Fund", "Entitlements", "Payments", "Breakfast", "Corrections"];
const SEARCH_PAGE_SIZE = 6;


const idOf = (value: unknown): ID | undefined => value && typeof value === "object" && "id" in value ? (value as { id: ID }).id : typeof value === "string" || typeof value === "number" ? value : undefined;
const text = (value: unknown) => typeof value === "string" ? value : "";
const searchable = (value: unknown) => JSON.stringify(value, (_key, item) => item ?? "").toLowerCase();
const money = (cents?: number) => typeof cents === "number" ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100) : "Amount unavailable";
const candidateFrom = (entitlement: Entitlement) => {
  const metadata = entitlement.sourceMetadata || {};
  const scholarship = entitlement.entitlementType === "specific_scholarship";
  return {
    name: text(metadata[scholarship ? "scholarship_recipient_name" : "attendee_name"]),
    email: text(metadata[scholarship ? "scholarship_recipient_email" : "attendee_email"]),
    state: text(metadata[scholarship ? "scholarship_recipient_state" : "attendee_state"]),
    homegroupCommittee: text(metadata[scholarship ? "scholarship_recipient_homegroup" : "homegroup_committee"]),
  };
};


export function RegistrationCorrections({ demo = false }: { demo?: boolean }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tickets, setTickets] = useState<BreakfastTicket[]>([]);
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [contributions, setContributions] = useState<ScholarshipContribution[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [selectedID, setSelectedID] = useState<ID>();
  const [selectedEntitlementID, setSelectedEntitlementID] = useState<ID>();
  const [query, setQuery] = useState("");
  const [showRecords, setShowRecords] = useState(false);
  const [category, setCategory] = useState<SearchCategory>("Payments");
  const [resultPage, setResultPage] = useState(0);
  const [browse, setBrowse] = useState(false);
  const [editStep, setEditStep] = useState<"overview" | "details" | "review" | "done">("overview");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [resolution, setResolution] = useState<"same_person_name_variation" | "attendee_reassigned">("same_person_name_variation");
  const [contactID, setContactID] = useState("");
  const [newContact, setNewContact] = useState({ displayName: "", email: "", state: "", homegroupCommittee: "" });
  const [canonicalContact, setCanonicalContact] = useState({ displayName: "", email: "", state: "", homegroupCommittee: "" });
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "unauthorized" | "error">("loading");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const auth = await fetch("/api/users/me", { credentials: "same-origin" });
      const authJSON = auth.ok ? await auth.json() as { user?: User } : {};
      if (!authJSON.user) { setStatus("unauthorized"); return; }
      setUser(authJSON.user);
      const [nextRegistrations, nextContacts, nextTickets, nextOrders, nextEntitlements, nextContributions, nextCorrections] = await Promise.all([
        fetchAllCRMRecords<Registration>("/api/attendees?depth=1&sort=attendeeName,id"),
        fetchAllCRMRecords<Contact>("/api/contacts?depth=0&sort=displayName,id"),
        fetchAllCRMRecords<BreakfastTicket>("/api/breakfast-tickets?depth=0&sort=id"),
        fetchAllCRMRecords<CheckoutOrder>("/api/checkout-orders?depth=0&sort=id"),
        fetchAllCRMRecords<Entitlement>("/api/registration-entitlements?depth=0&sort=id"),
        fetchAllCRMRecords<ScholarshipContribution>("/api/scholarship-contributions?depth=0&sort=purchasedAt,id"),
        fetchAllCRMRecords<Correction>("/api/registration-corrections?depth=1&sort=-changedAt,id"),
      ]);
      setRegistrations(nextRegistrations);
      setContacts(nextContacts);
      setTickets(nextTickets);
      setOrders(nextOrders);
      setEntitlements(nextEntitlements);
      setContributions(nextContributions);
      setCorrections(nextCorrections);

      setStatus("ready");
    } catch (error) { setStatus(error instanceof Error && error.message === "unauthorized" ? "unauthorized" : "error"); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const registrationMap = useMemo(() => new Map(registrations.map((registration) => [String(registration.id), registration])), [registrations]);
  const contactMap = useMemo(() => new Map(contacts.map((contact) => [String(contact.id), contact])), [contacts]);
  const orderMap = useMemo(() => new Map(orders.map((order) => [String(order.id), order])), [orders]);
  const entitlementsByRegistration = useMemo(() => {
    const map = new Map<string, Entitlement[]>();
    for (const entitlement of entitlements) {
      const registrationID = idOf(entitlement.registration);
      if (!registrationID) continue;
      const key = String(registrationID);
      map.set(key, [...(map.get(key) || []), entitlement]);
    }
    return map;
  }, [entitlements]);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const searchIndex = useMemo<SearchRecord[]>(() => {
    const records: SearchRecord[] = [];
    const registrationForOrder = new Map<string, ID>();
    const registrationForContact = new Map<string, ID>();
    for (const entitlement of entitlements) {
      const registrationID = idOf(entitlement.registration);
      if (registrationID) registrationForOrder.set(String(idOf(entitlement.checkoutOrder)), registrationID);
    }
    for (const registration of registrations) registrationForContact.set(String(idOf(registration.contact)), registration.id);
    for (const order of orders) {
      const registrationID = registrationForOrder.get(String(order.id));
      if (registrationID && order.purchaserContact) registrationForContact.set(String(idOf(order.purchaserContact)), registrationID);
    }
    for (const contact of contacts) records.push({
      key: `contact:${contact.id}`,
      category: "Contacts",
      title: contact.displayName,
      subtitle: contact.email,
      detail: [contact.phone, contact.state, contact.homegroupCommittee, contact.tags?.join(", ")].filter(Boolean).join(" · ") || "Contact",
      href: `/admin/collections/contacts/${contact.id}`,
      registrationID: registrationForContact.get(String(contact.id)),
      search: searchable(contact),
    });
    for (const registration of registrations) records.push({
      key: `registration:${registration.id}`,
      category: "Registrations",
      title: registration.attendeeName,
      subtitle: `${registration.attendeeEmail} · purchased by ${registration.purchaserName}`,
      detail: [registration.attendanceStatus, registration.attendanceBasis.replaceAll("_", " "), registration.state, registration.homegroupCommittee].filter(Boolean).join(" · "),
      href: `/admin/collections/attendees/${registration.id}`,
      registrationID: registration.id,
      search: searchable(registration),
    });
    for (const contribution of contributions) {
      const contributor = contactMap.get(String(idOf(contribution.contributorContact)));
      const fundedEntitlements = (contribution.fundedEntitlements || []).map((value) => entitlements.find((entitlement) => String(entitlement.id) === String(idOf(value)))).filter(Boolean);
      const linkedRegistration = fundedEntitlements.find((entitlement) => idOf(entitlement?.registration));
      records.push({
        key: `scholarship-contribution:${contribution.id}`,
        category: "Scholarship Fund",
        title: contributor?.displayName || "Scholarship contributor",
        subtitle: `${contribution.contributionType.replaceAll("_", " ")} · ${money(contribution.amountCents)}`,
        detail: `${fundedEntitlements.length} funded seat${fundedEntitlements.length === 1 ? "" : "s"} · ${money(contribution.availableCents)} unallocated`,
        href: `/admin/collections/scholarship-contributions/${contribution.id}`,
        registrationID: idOf(linkedRegistration?.registration),
        search: searchable({ contribution, contributor }),
      });
    }
    for (const order of orders) records.push({
      key: `order:${order.id}`,
      category: "Payments",
      title: order.purchaserName,
      subtitle: `${order.purchaserEmail} · ${money(order.totalCents)}`,
      detail: [order.paymentStatus, order.cardholderName && `cardholder ${order.cardholderName}`, order.cardLast4 && `${order.cardBrand || "card"} •••• ${order.cardLast4}`, order.stripePaymentIntentId || order.stripeChargeId].filter(Boolean).join(" · "),
      href: `/admin/collections/checkout-orders/${order.id}`,
      registrationID: registrationForOrder.get(String(order.id)),
      search: searchable(order),
    });
    for (const ticket of tickets) records.push({
      key: `ticket:${ticket.id}`,
      category: "Breakfast",
      title: `${ticket.breakfastDay[0]?.toUpperCase()}${ticket.breakfastDay.slice(1)} breakfast`,
      subtitle: `${ticket.purchaserName || "Purchaser unavailable"} · ${ticket.purchaserEmail || "email unavailable"}`,
      detail: [ticket.ticketCode, ticket.status, ticket.stripePaymentIntentId || ticket.stripeChargeId].filter(Boolean).join(" · "),
      href: `/admin/collections/breakfast-tickets/${ticket.id}`,
      registrationID: idOf(ticket.attendee),
      search: searchable(ticket),
    });
    for (const entitlement of entitlements) {
      const candidate = candidateFrom(entitlement);
      records.push({
        key: `entitlement:${entitlement.id}`,
        category: "Entitlements",
        title: candidate.name || entitlement.entitlementType.replaceAll("_", " "),
        subtitle: candidate.email || "No assigned attendee email",
        detail: `${entitlement.entitlementType.replaceAll("_", " ")} · ${entitlement.status}`,
        href: `/admin/collections/registration-entitlements/${entitlement.id}`,
        registrationID: idOf(entitlement.registration),
        search: searchable(entitlement),
      });
    }
    for (const correction of corrections) records.push({
      key: `correction:${correction.id}`,
      category: "Corrections",
      title: correction.reason,
      subtitle: correction.correctionType.replaceAll("_", " "),
      detail: new Date(correction.changedAt).toLocaleString(),
      href: `/admin/collections/registration-corrections/${correction.id}`,
      registrationID: idOf(correction.registration),
      search: searchable(correction),
    });
    return records;
  }, [contactMap, contacts, contributions, corrections, entitlements, orders, registrations, tickets]);
  const searchResults = useMemo(() => deferredQuery ? searchIndex.filter((record) => record.search.includes(deferredQuery)) : [], [deferredQuery, searchIndex]);
  const groupedSearchResults = useMemo(() => new Map(SEARCH_CATEGORIES.map((category) => [category, searchResults.filter((record) => record.category === category)])), [searchResults]);
  const scholarshipSummary = useMemo(() => ({
    generalFundCents: contributions.filter((item) => item.contributionType !== "specific_person_scholarship").reduce((sum, item) => sum + item.amountCents, 0),
    fundedGeneralSeats: entitlements.filter((item) => item.entitlementType === "general_scholarship").length,
    availableGeneralSeats: entitlements.filter((item) => item.entitlementType === "general_scholarship" && item.status === "unassigned").length,
    specificSeats: entitlements.filter((item) => item.entitlementType === "specific_scholarship").length,
  }), [contributions, entitlements]);
  const selected = registrationMap.get(String(selectedID));
  const selectedEntitlements = entitlementsByRegistration.get(String(selectedID)) || EMPTY_ENTITLEMENTS;
  const selectedEntitlement = selectedEntitlements.find((entitlement) => String(entitlement.id) === String(selectedEntitlementID))
    || selectedEntitlements.find((entitlement) => String(entitlement.id) === String(idOf(selected?.entitlement)))
    || selectedEntitlements[0];
  const selectedOrder = selectedEntitlement ? orderMap.get(String(idOf(selectedEntitlement.checkoutOrder))) : undefined;
  const selectedOrderID = idOf(selectedOrder?.id);
  const ambiguousTickets = selectedEntitlements.some((seat) => seat.id !== selectedEntitlement?.id && String(idOf(seat.checkoutOrder)) === String(selectedOrderID));
  const selectedTickets = tickets.filter((ticket) => {
    if (String(idOf(ticket.attendee)) !== String(selectedID) || ambiguousTickets) return false;
    const hasPaymentReference = Boolean(selectedOrder?.stripeCheckoutSessionId || selectedOrder?.stripePaymentIntentId || selectedOrder?.stripeChargeId);
    if (!selectedOrderID || !hasPaymentReference) return true;
    return Boolean(
      (selectedOrder?.stripeCheckoutSessionId && ticket.stripeCheckoutSessionId === selectedOrder.stripeCheckoutSessionId)
      || (selectedOrder?.stripePaymentIntentId && ticket.stripePaymentIntentId === selectedOrder.stripePaymentIntentId)
      || (selectedOrder?.stripeChargeId && ticket.stripeChargeId === selectedOrder.stripeChargeId),
    );
  });
  const selectedCorrections = corrections.filter((correction) => String(idOf(correction.registration)) === String(selectedID));

  useEffect(() => {
    if (!selected) return;
    const entitlement = selectedEntitlements.find((item) => String(item.id) === String(selectedEntitlementID))
      || selectedEntitlements.find((item) => String(item.id) === String(idOf(selected.entitlement)))
      || selectedEntitlements[0];
    setSelectedEntitlementID(entitlement?.id);
    const candidate = entitlement ? candidateFrom(entitlement) : undefined;
    const candidateDiffers = Boolean(candidate?.name && candidate.name.toLowerCase() !== selected.attendeeName.toLowerCase());
    const candidateContact = contacts.find((contact) => candidate?.name && contact.displayName.toLowerCase() === candidate.name.toLowerCase() && (!candidate.email || contact.email.toLowerCase() === candidate.email.toLowerCase()));
    setContactID(String(candidateContact?.id || idOf(selected.contact) || ""));
    setNewContact({
      displayName: candidate?.name || selected.attendeeName,
      email: candidate?.email || selected.attendeeEmail,
      state: candidate?.state || selected.state,
      homegroupCommittee: candidate?.homegroupCommittee || selected.homegroupCommittee || "",
    });
    setResolution(candidateDiffers && selectedEntitlements.length > 1 ? "attendee_reassigned" : "same_person_name_variation");
    setMode(candidateDiffers && !candidateContact ? "new" : "existing");
    setCanonicalContact({
      displayName: selected.attendeeName,
      email: selected.attendeeEmail,
      state: selected.state,
      homegroupCommittee: selected.homegroupCommittee || "",
    });
    setReason("");
  }, [contacts, selected, selectedEntitlementID, selectedEntitlements]);

  const filtered = useMemo(() => {
    if (!deferredQuery) return registrations;
    const matchingRegistrationIDs = new Set(searchResults.map((record) => record.registrationID).filter(Boolean).map(String));
    return registrations.filter((registration) => matchingRegistrationIDs.has(String(registration.id)) || searchable(registration).includes(deferredQuery));
  }, [deferredQuery, registrations, searchResults]);

  function selectRegistration(registration: Registration) {
    setEditStep("overview");
    setSelectedID(registration.id);
    setSelectedEntitlementID(undefined);
    setContactID(String(idOf(registration.contact) || ""));
    setNewContact({ displayName: registration.attendeeName, email: registration.attendeeEmail, state: registration.state, homegroupCommittee: registration.homegroupCommittee || "" });
    setCanonicalContact({ displayName: registration.attendeeName, email: registration.attendeeEmail, state: registration.state, homegroupCommittee: registration.homegroupCommittee || "" });
    setResolution("same_person_name_variation");
    setReason("");
    setMessage("");
  }

  function openCorrection(registrationID: ID) {
    const registration = registrationMap.get(String(registrationID));
    if (!registration) return;
    selectRegistration(registration);

  }

  function changeQuery(value: string) {
    setQuery(value);
    setResultPage(0);
  }

  function backToResults() {
    setSelectedID(undefined);
    setEditStep("overview");
    setMessage("");
    requestAnimationFrame(() => searchRef.current?.focus());
  }

  function beginEdit(nextResolution: typeof resolution) {
    if (!selected) return;
    setResolution(nextResolution);
    setCanonicalContact({ displayName: selected.attendeeName, email: selected.attendeeEmail, state: selected.state, homegroupCommittee: selected.homegroupCommittee || "" });
    const candidate = selectedEntitlement ? candidateFrom(selectedEntitlement) : undefined;
    const different = candidate?.name && candidate.name.toLowerCase() !== selected.attendeeName.toLowerCase();
    setNewContact({ displayName: different ? candidate.name : "", email: different ? candidate.email : "", state: different ? candidate.state : "", homegroupCommittee: different ? candidate.homegroupCommittee : "" });
    setMode("new"); setContactID(""); setReason(""); setMessage(""); setMessageError(false);
    setEditStep("details");
  }

  useEffect(() => {
    if (selectedID) { headingRef.current?.focus(); window.scrollTo({ top: 0, behavior: "instant" }); }
  }, [selectedID, editStep]);

  function selectEntitlement(entitlement: Entitlement) {
    setSelectedEntitlementID(entitlement.id);
    const candidate = candidateFrom(entitlement);
    const differs = Boolean(candidate.name && candidate.name.toLowerCase() !== selected?.attendeeName.toLowerCase());
    const candidateContact = contacts.find((contact) => candidate.name && contact.displayName.toLowerCase() === candidate.name.toLowerCase() && (!candidate.email || contact.email.toLowerCase() === candidate.email.toLowerCase()));
    setNewContact({
      displayName: candidate.name || selected?.attendeeName || "",
      email: candidate.email || selected?.attendeeEmail || "",
      state: candidate.state || selected?.state || "",
      homegroupCommittee: candidate.homegroupCommittee || selected?.homegroupCommittee || "",
    });
    setResolution(differs && selectedEntitlements.length > 1 ? "attendee_reassigned" : "same_person_name_variation");
    setContactID(String(candidateContact?.id || ""));
    setMode(differs && !candidateContact ? "new" : "existing");
    setReason("");
    setMessage("");
  }

  async function saveCorrection(event: React.FormEvent) {
    event.preventDefault();
    if (editStep !== "review") {
      if (!selected) return;
      const unchangedDetails = canonicalContact.displayName.trim() === selected.attendeeName.trim()
        && canonicalContact.email.trim().toLowerCase() === selected.attendeeEmail.trim().toLowerCase()
        && canonicalContact.state.trim().toUpperCase() === selected.state.trim().toUpperCase()
        && canonicalContact.homegroupCommittee.trim() === (selected.homegroupCommittee || "").trim();
      const unchangedAttendee = resolution === "same_person_name_variation"
        ? unchangedDetails
        : mode === "existing"
          ? Boolean(contactID) && contactID === String(idOf(selected.contact) || "")
          : newContact.displayName.trim() === selected.attendeeName.trim()
            && newContact.email.trim().toLowerCase() === selected.attendeeEmail.trim().toLowerCase();
      if (unchangedAttendee) {
        setMessage("No meaningful change detected. Update a detail or choose a different attendee before reviewing.");
        setMessageError(true);
        return;
      }
      setMessage("");
      setMessageError(false);
      setEditStep("review");
      return;
    }
    if (!selected || !user || !canEditCRM(user) || !reason.trim()) { setMessage("Add a correction note before saving."); return; }
    setSaving(true); setMessage(""); setMessageError(false);
    try {
      const response = await fetch("/api/admin/crm-correction", {
        method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationID: selected.id, entitlementID: selectedEntitlement?.id,
          expectedUpdatedAt: selected.updatedAt, expectedEntitlementUpdatedAt: selectedEntitlement?.updatedAt,
          resolution, mode, contactID, contact: resolution === "same_person_name_variation" ? canonicalContact : newContact,
          reason: reason.trim() }),
      });
      const result = await response.json() as { error?: string; split?: boolean; ambiguousTickets?: boolean; registrationID?: ID };
      if (!response.ok) throw new Error(result.error || "The correction could not be saved.");
      await load();
      if (result.registrationID) setSelectedID(result.registrationID);
      setEditStep("done");
      if (result.ambiguousTickets) { setMessage("Correction saved. Breakfast tickets were left in place because this payment funds more than one seat; review ticket ownership separately."); return; }
      setMessage(result.split ? "Separate registration created. Original payments were preserved." : "Correction saved with its audit history.");
    } catch (error) { setMessageError(true); setMessage(error instanceof Error ? error.message : "The correction could not be saved."); }
    finally { setSaving(false); }
  }

  const recordResults = groupedSearchResults.get(category) || [];
  const visiblePeople = deferredQuery || browse ? filtered : [];
  const resultCount = showRecords ? recordResults.length : visiblePeople.length;
  const pageCount = Math.max(1, Math.ceil(resultCount / SEARCH_PAGE_SIZE));
  const page = Math.min(resultPage, pageCount - 1);
  const target = resolution === "same_person_name_variation" ? canonicalContact : mode === "new" ? newContact : contacts.find((contact) => String(contact.id) === contactID);
  const mayEdit = canEditCRM(user) && Boolean(selectedEntitlement) && !["refunded", "voided", "redeemed"].includes(selectedEntitlement?.status || "");
  const changeTitle = resolution === "same_person_name_variation" ? "Fix name or contact details" : "Someone else is attending";

  if (status === "unauthorized") return <div className={styles.page}><h1>Sign in to view registrations</h1><a href="/admin/login">Sign in</a></div>;
  if (status === "error") return <div className={styles.page}><h1>We couldn’t load the records</h1><p>Your changes may already be saved. Reload to check the latest record.</p><button onClick={() => void load()} type="button">Try again</button></div>;

  return <main className={`${styles.page} ${selected ? styles.registration : ""}`}>
    {!selected ? <>
      <header className={styles.header}><span className={styles.eyebrow}>Event CRM</span><h1>Find a registration</h1><p>Find someone, view their tickets, or make a change.</p></header>
      <section className={styles.searchPanel} aria-label="Find a person">
        <label className={styles.searchLabel} htmlFor="crm-search">Name, email, or payment reference</label>
        <div className={styles.searchBox}><Search aria-hidden="true" /><input id="crm-search" ref={searchRef} autoComplete="off" disabled={status !== "ready"} onChange={(event) => changeQuery(event.target.value)} placeholder={status === "loading" ? "Loading records…" : "Start with a name or email"} value={query} />{query ? <button onClick={() => changeQuery("")} type="button">Clear</button> : null}</div>
        <div className={styles.searchActions}><button className={styles.textButton} disabled={status !== "ready"} onClick={() => { setBrowse(true); setShowRecords(false); setResultPage(0); }} type="button">Browse all registrations</button>{demo ? <button className={styles.textButton} disabled={status !== "ready"} onClick={() => { changeQuery("DEMO"); setShowRecords(false); }} type="button">Browse practice registrations</button> : null}</div>
      </section>
      {status === "loading" ? <p role="status" className={styles.muted}>Loading registrations and related records…</p> : deferredQuery || browse ? <section aria-label="Search results">
        <div className={styles.resultsHeading}><h2>{showRecords ? "Other records" : "Registrations"} <span>{resultCount}</span></h2>{deferredQuery ? <button className={styles.textButton} onClick={() => { setShowRecords(!showRecords); setResultPage(0); }} type="button">{showRecords ? "Show registrations" : "Search payments and other records"}</button> : null}</div>
        {showRecords ? <label className={styles.categoryLabel}>Record type<select aria-label="Record type" value={category} onChange={(event) => { setCategory(event.target.value as SearchCategory); setResultPage(0); }}>{SEARCH_CATEGORIES.map((item) => <option key={item} value={item}>{item === "Entitlements" ? "Paid places & scholarships" : item} ({groupedSearchResults.get(item)?.length || 0})</option>)}</select></label> : null}
        <div className={styles.results}>
          {showRecords ? recordResults.slice(page * SEARCH_PAGE_SIZE, (page + 1) * SEARCH_PAGE_SIZE).map((record) => <article className={styles.recordRow} key={record.key}><div><strong>{record.title}</strong><span>{record.subtitle}</span><small>{record.detail}</small></div>{record.registrationID ? <button onClick={() => openCorrection(record.registrationID!)} type="button">View person</button> : <a href={record.href}>Open record</a>}</article>) : visiblePeople.slice(page * SEARCH_PAGE_SIZE, (page + 1) * SEARCH_PAGE_SIZE).map((registration) => {
            const seats = entitlementsByRegistration.get(String(registration.id)) || [];
            const otherNames = [...new Set(seats.map((seat) => candidateFrom(seat).name).filter((name) => name && name.toLowerCase() !== registration.attendeeName.toLowerCase()))];
            return <button className={styles.personRow} key={registration.id} type="button" onClick={() => selectRegistration(registration)}><span className={styles.personIcon}><UserRound aria-hidden="true" /></span><span className={styles.personText}><strong>{registration.attendeeName}</strong><span>{registration.attendeeEmail}</span>{otherNames.length ? <small>Also listed on this purchase: {otherNames.join(", ")}</small> : null}</span><span className={styles.openLabel}>View <ArrowRight aria-hidden="true" /></span></button>;
          })}
          {!resultCount ? <div className={styles.empty}><h3>No {showRecords ? "records" : "registrations"} found</h3><p>Try another spelling, an email, or a payment reference.{!showRecords ? " You can also search payments and other records above." : ""}</p></div> : null}
        </div>
        {resultCount > SEARCH_PAGE_SIZE ? <nav className={styles.pagination} aria-label="Result pages"><span>{page * SEARCH_PAGE_SIZE + 1}–{Math.min((page + 1) * SEARCH_PAGE_SIZE, resultCount)} of {resultCount}</span><div><button aria-label="Previous page" disabled={page === 0} onClick={() => setResultPage(page - 1)} type="button"><ChevronLeft /></button><span>Page {page + 1} of {pageCount}</span><button aria-label="Next page" disabled={page + 1 >= pageCount} onClick={() => setResultPage(page + 1)} type="button"><ChevronRight /></button></div></nav> : null}
      </section> : <div className={styles.startHint}><UserRound aria-hidden="true" /><p>Start with the person you want to help.<br /><span>Their details will open on the next screen.</span></p></div>}
      <footer className={styles.tools}>
        <details><summary>Scholarship fund</summary><p>{money(scholarshipSummary.generalFundCents)} contributed · {scholarshipSummary.availableGeneralSeats} places available · {scholarshipSummary.specificSeats} named scholarships</p><a href="/admin/collections/scholarship-contributions">View contribution ledger</a></details>
        <details><summary>What do the different records mean?</summary><p><strong>Contact:</strong> a person’s name and contact details. <strong>Registration:</strong> their place on the event roster. <strong>Paid place (entitlement):</strong> the registration or scholarship purchased for someone. <strong>Payment:</strong> the original purchase and payer.</p></details>
      </footer>
    </> : <>
      <button className={styles.back} disabled={saving} onClick={backToResults} type="button"><ArrowLeft aria-hidden="true" /> Back to results</button>
      <header className={styles.header}><span className={styles.eyebrow}>Registration</span><h1>{selected.attendeeName}</h1><p>{selected.attendeeEmail}</p></header>
      {message ? <div className={styles.message} data-error={messageError || undefined} role={messageError ? "alert" : "status"}>{message}</div> : null}
      {editStep === "overview" ? <>
        <div className={styles.facts} aria-label="Registration summary">
          <span><strong>{selected.paymentStatus.replaceAll("_", " ")}</strong>Payment status</span>
          <span><strong>{selected.attendanceStatus.replaceAll("_", " ")}</strong>Attendance</span>
          <span><strong>{selectedOrder?.purchaserName || selected.purchaserName}</strong>Paid by · {money(selectedOrder?.totalCents ?? selected.registrationPriceCents)}</span>
          <span><strong>{tickets.filter((ticket) => String(idOf(ticket.attendee)) === String(selected.id)).length}</strong>Breakfast tickets</span>
        </div>
        <section className={styles.panel}>
          <h2 ref={headingRef} tabIndex={-1}>Resolve a registration issue</h2>
          <p>Choose whether this is a detail correction or a change to who will attend. The original purchaser and payment stay attached to the order.</p>
          {selectedEntitlements.length > 1 ? <div className={styles.seatChoice}><p>This registration has {selectedEntitlements.length} paid places attached. Choose the purchase you want to work on.</p><label>Paid place<select value={String(selectedEntitlement?.id || "")} onChange={(event) => { const seat = selectedEntitlements.find((item) => String(item.id) === event.target.value); if (seat) selectEntitlement(seat); }}>{selectedEntitlements.map((seat) => <option key={seat.id} value={String(seat.id)}>{candidateFrom(seat).name || "Unnamed place"} — paid by {orderMap.get(String(idOf(seat.checkoutOrder)))?.purchaserName || "Unknown"}</option>)}</select></label></div> : null}
          {!canEditCRM(user) ? <p className={styles.readOnly}>You have read-only access. A registration manager can make changes.</p> : !mayEdit ? <p className={styles.readOnly}>This registration’s paid place needs administrator review before it can be changed here.</p> : null}
          <div className={styles.actionChoices}><button disabled={!mayEdit || status !== "ready"} onClick={() => beginEdit("same_person_name_variation")} type="button"><span><strong>Fix name or contact details</strong><small>It’s the same person; something is misspelled or out of date.</small></span><ArrowRight aria-hidden="true" /></button><button disabled={!mayEdit || status !== "ready"} onClick={() => beginEdit("attendee_reassigned")} type="button"><span><strong>Someone else is attending</strong><small>Give this paid place to the person who will actually attend.</small></span><ArrowRight aria-hidden="true" /></button></div>
        </section>
      </> : editStep === "done" ? <section className={`${styles.panel} ${styles.complete}`}><CheckCircle2 aria-hidden="true" /><h2 ref={headingRef} tabIndex={-1}>Change saved</h2><p>The change is recorded in the history below.</p><div className={styles.formActions}><button className={styles.secondary} onClick={() => setEditStep("overview")} type="button">View this registration</button><button className={styles.primary} onClick={backToResults} type="button">Find another person</button></div></section> : <section className={styles.panel}>
        <ol className={styles.steps} aria-label="Correction progress"><li aria-current={editStep === "details" ? "step" : undefined}>1. Make the change</li><li aria-current={editStep === "review" ? "step" : undefined}>2. Review & save</li></ol>
        <h2 ref={headingRef} tabIndex={-1}>{editStep === "review" ? "Review your change" : changeTitle}</h2>
        <form onSubmit={saveCorrection}>
          {editStep === "details" ? <>
            {resolution === "attendee_reassigned" ? <><p>Who will use this paid place?</p><div className={styles.mode}><button aria-pressed={mode === "new"} onClick={() => setMode("new")} type="button">Enter their details</button><button aria-pressed={mode === "existing"} onClick={() => setMode("existing")} type="button">Choose an existing contact</button></div></> : <p>Update the details that need correcting.</p>}
            {resolution === "attendee_reassigned" && mode === "existing" ? <label>Attendee contact<select required value={contactID} onChange={(event) => { setContactID(event.target.value); setMessage(""); setMessageError(false); }}><option value="">Choose a person</option>{contacts.map((contact) => <option key={contact.id} value={String(contact.id)}>{contact.displayName} — {contact.email}</option>)}</select></label> : <div className={styles.fields}>{([['displayName', 'Name'], ['email', 'Email'], ['state', 'State'], ['homegroupCommittee', 'Homegroup / committee']] as const).map(([key, label]) => <label key={key}>{label}{key === 'state' || key === 'homegroupCommittee' ? <small>Optional</small> : null}<input required={key === "displayName" || key === "email"} type={key === "email" ? "email" : "text"} value={(resolution === "same_person_name_variation" ? canonicalContact : newContact)[key]} onChange={(event) => { const value = event.target.value; setMessage(""); setMessageError(false); if (resolution === "same_person_name_variation") setCanonicalContact((current) => ({ ...current, [key]: value })); else setNewContact((current) => ({ ...current, [key]: value })); }} /></label>)}</div>}
            <div className={styles.formActions}><button className={styles.secondary} onClick={() => setEditStep("overview")} type="button">Cancel</button><button className={styles.primary} disabled={!canEditCRM(user)} type="submit">Review change <ArrowRight aria-hidden="true" /></button></div>
          </> : <>
            <div className={styles.review}><div><small>Current attendee</small><strong>{selected.attendeeName}</strong><span>{selected.attendeeEmail}</span></div><ArrowRight aria-hidden="true" /><div><small>{resolution === "same_person_name_variation" ? "Updated details" : "New attendee"}</small><strong>{target?.displayName}</strong><span>{target?.email}</span><span>{target?.state || "State not specified"}{target?.homegroupCommittee ? ` · ${target.homegroupCommittee}` : ""}</span></div></div>
            <div className={styles.reviewNotes} aria-label="What stays attached to this purchase">
              {resolution === "attendee_reassigned" && selectedEntitlements.length > 1 ? <p>A separate registration will be created for this person.</p> : null}
              <div><strong>Payment</strong><span>The original payment remains with {selectedOrder?.purchaserName || selected.purchaserName}.</span></div>
              <div><strong>Breakfast</strong><span>{ambiguousTickets ? "This purchase covers multiple places. Tickets will stay where they are until their owner is reviewed separately." : selectedTickets.length ? `${selectedTickets.length} ticket${selectedTickets.length === 1 ? "" : "s"} will stay linked to this paid place.` : "No breakfast tickets are linked to this paid place."}</span></div>
            </div>
            <label>Why are you making this change?<textarea required maxLength={4000} rows={3} value={reason} onChange={(event) => setReason(event.target.value)} placeholder="For example: Jamie paid for Alex’s registration." /></label>
            <div className={styles.formActions}><button className={styles.secondary} disabled={saving} onClick={() => setEditStep("details")} type="button">Back</button><button className={styles.primary} disabled={saving || status !== "ready" || !canEditCRM(user)} type="submit">{saving ? "Saving…" : "Save change"}</button></div>
          </>}
        </form>
      </section>}
      {editStep === "overview" || editStep === "done" ? <div className={styles.tools}>
        <details><summary>Payment & breakfast details</summary><dl className={styles.paymentDetails}><div><dt>Paid by</dt><dd>{selectedOrder?.purchaserName || selected.purchaserName}</dd></div><div><dt>Payment amount</dt><dd>{money(selectedOrder?.totalCents)}</dd></div><div><dt>Card</dt><dd>{selectedOrder?.cardLast4 ? `${selectedOrder.cardBrand || "Card"} ending ${selectedOrder.cardLast4}` : "No card details"}</dd></div><div><dt>Payment reference</dt><dd>{selectedOrder?.stripePaymentIntentId || selectedOrder?.stripeChargeId || "Not available"}</dd></div></dl><p>Breakfast: {tickets.filter((ticket) => String(idOf(ticket.attendee)) === String(selected.id)).map((ticket) => ticket.breakfastDay).join(", ") || "No tickets linked"}</p></details>
        <details><summary>Change history ({selectedCorrections.length})</summary>{selectedCorrections.length ? selectedCorrections.map((correction) => <article className={styles.historyItem} key={correction.id}><strong>{correction.reason}</strong><span>{new Date(correction.changedAt).toLocaleString()}</span></article>) : <p>No changes recorded yet.</p>}</details>
        <a className={styles.recordLink} href={`/admin/collections/attendees/${selected.id}`}>Open full registration record</a>
      </div> : null}
    </>}
  </main>;
}
