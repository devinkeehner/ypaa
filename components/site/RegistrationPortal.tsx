"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Minus, Plus } from "lucide-react";

import { BREAKFAST_PRICE_CENTS, BREAKFASTS, POLICY_KEYS, REGISTRATION_PRICE_CENTS, calculateProcessingFee, orderSubtotalCents, type RegistrationOrder } from "@/lib/registration";
import { SiteFrame } from "./SiteFrame";

const policyLabels: Record<(typeof POLICY_KEYS)[number], string> = {
  readPolicy: "I have received, read, and understand the NECYPAA Anti-Harassment and Non-Discrimination Policy.",
  understandQuestions: "I understand that questions about this policy may be directed to NECYPAA Advisory members.",
  acknowledgeBehavior: "I acknowledge that behavior deemed unsafe or discriminatory may result in removal and could lead to a ban from future NECYPAA events.",
  understandAdmission: "I understand that I will not be admitted if I do not complete every required acknowledgment.",
  understandReporting: "I understand that I may report unsafe or discriminatory behavior to NECYPAA Advisory or the Host Committee.",
  understandInvestigation: "I understand that reports will be investigated by NECYPAA Advisory.",
  signatureAgreement: "I understand that checking every box serves as my signature and agreement to follow this policy.",
};

const initialOrder: RegistrationOrder = {
  purchaserName: "",
  purchaserEmail: "",
  selfRegistration: true,
  attendee: { name: "", state: "", email: "", accommodations: "", interpretationNeeded: false, mobilityAccessibility: false, willingToServe: false, homegroupCommittee: "" },
  policy: Object.fromEntries(POLICY_KEYS.map((key) => [key, false])) as RegistrationOrder["policy"],
  breakfast: { friday: 0, saturday: 0, sunday: 0 },
  scholarship: { enabled: false, kind: "general", amountCents: REGISTRATION_PRICE_CENTS, recipientName: "", recipientEmail: "", attribution: "" },
};

function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <div className="registration-quantity"><button aria-label="Decrease quantity" onClick={() => onChange(Math.max(0, value - 1))} type="button"><Minus /></button><span>{value}</span><button aria-label="Increase quantity" onClick={() => onChange(Math.min(20, value + 1))} type="button"><Plus /></button></div>;
}

export function RegistrationPortal({ cash = false }: { cash?: boolean }) {
  const [order, setOrder] = useState(initialOrder);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState<string | null>(null);
  const subtotal = useMemo(() => orderSubtotalCents(order), [order]);
  const processingFee = cash || subtotal === 0 ? 0 : calculateProcessingFee(subtotal);
  const total = subtotal + processingFee;
  const money = (cents: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

  const updateAttendee = (field: keyof RegistrationOrder["attendee"], value: string | boolean) => setOrder((current) => ({ ...current, attendee: { ...current.attendee, [field]: value } }));
  const updateScholarship = (field: keyof RegistrationOrder["scholarship"], value: string | boolean | number) => setOrder((current) => ({ ...current, scholarship: { ...current.scholarship, [field]: value } }));

  const submit = async () => {
    setSubmitting(true); setError("");
    try {
      const response = await fetch(cash ? "/api/cash" : "/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cash ? { code, order } : order) });
      const result = await response.json() as { error?: string; url?: string; reference?: string };
      if (!response.ok) throw new Error(result.error || "The order could not be submitted.");
      if (cash) setComplete(result.reference || "recorded");
      else if (result.url) window.location.assign(result.url);
      else throw new Error("Stripe did not return a checkout link.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The order could not be submitted.");
    } finally { setSubmitting(false); }
  };

  if (complete) return <SiteFrame mainId="registration-main"><main className="registration-page" id="registration-main"><div className="registration-shell registration-complete"><CheckCircle2 /><h1>Cash order recorded</h1><p>The Stripe customer record and local cash transaction were created successfully.</p><strong>Reference {complete}</strong></div></main></SiteFrame>;

  return (
    <SiteFrame mainId="registration-main">
      <main className="registration-page" id="registration-main">
        <header className="registration-hero"><div className="registration-shell"><p>{cash ? "Authorized in-person entry" : "Convention registration"}</p><h1>{cash ? "Record a cash order" : "Build your NECYPAA order"}</h1><span>Registration $40 · Breakfast $25 each · Scholarships from $40</span></div></header>
        <div className="registration-shell registration-layout">
          <div className="registration-form-stack">
            {cash ? <section className="registration-card registration-code"><h2>Access code</h2><p>This code authorizes an in-person cash order and controls redemption limits.</p><label><span>Code *</span><input autoComplete="one-time-code" onChange={(event) => setCode(event.target.value.toUpperCase())} value={code} /></label></section> : null}

            <section className="registration-card"><h2>Purchaser</h2><div className="registration-grid"><label><span>Name *</span><input onChange={(event) => setOrder({ ...order, purchaserName: event.target.value })} value={order.purchaserName} /></label><label><span>Email *</span><input onChange={(event) => setOrder({ ...order, purchaserEmail: event.target.value })} type="email" value={order.purchaserEmail} /></label></div></section>

            <section className="registration-card"><div className="registration-card-heading"><div><h2>Convention registration</h2><p>Registering yourself activates attendee details and the required policy acknowledgment.</p></div><label className="registration-switch"><input checked={order.selfRegistration} onChange={(event) => setOrder({ ...order, selfRegistration: event.target.checked })} type="checkbox" /><span>{order.selfRegistration ? "Included" : "Not included"}</span></label></div>
              {order.selfRegistration ? <div className="registration-grid"><label><span>Attendee name *</span><input onChange={(e) => updateAttendee("name", e.target.value)} value={order.attendee.name} /></label><label><span>State *</span><input onChange={(e) => updateAttendee("state", e.target.value)} value={order.attendee.state} /></label><label><span>Attendee email *</span><input onChange={(e) => updateAttendee("email", e.target.value)} type="email" value={order.attendee.email} /></label><label><span>Homegroup / committee *</span><input onChange={(e) => updateAttendee("homegroupCommittee", e.target.value)} value={order.attendee.homegroupCommittee} /></label><label className="registration-full"><span>Accommodation needs</span><textarea onChange={(e) => updateAttendee("accommodations", e.target.value)} value={order.attendee.accommodations} /></label><div className="registration-full registration-checks"><label><input checked={order.attendee.interpretationNeeded} onChange={(e) => updateAttendee("interpretationNeeded", e.target.checked)} type="checkbox" /> Interpretation needed</label><label><input checked={order.attendee.mobilityAccessibility} onChange={(e) => updateAttendee("mobilityAccessibility", e.target.checked)} type="checkbox" /> Mobility accessibility needed</label><label><input checked={order.attendee.willingToServe} onChange={(e) => updateAttendee("willingToServe", e.target.checked)} type="checkbox" /> Willing to be of service</label></div></div> : null}
            </section>

            <section className="registration-card"><h2>Breakfast tickets</h2><p>Choose any quantity for Friday, Saturday, or Sunday morning.</p><div className="registration-products">{BREAKFASTS.map((item) => <div key={item.id}><div><strong>{item.name}</strong><span>{money(BREAKFAST_PRICE_CENTS)} each</span></div><Quantity value={order.breakfast[item.id]} onChange={(value) => setOrder((current) => ({ ...current, breakfast: { ...current.breakfast, [item.id]: value } }))} /></div>)}</div></section>

            <section className="registration-card"><div className="registration-card-heading"><div><h2>Registration scholarship</h2><p>Reserve one for a person or contribute to the general door fund.</p></div><label className="registration-switch"><input checked={order.scholarship.enabled} onChange={(e) => updateScholarship("enabled", e.target.checked)} type="checkbox" /><span>{order.scholarship.enabled ? "Included" : "Not included"}</span></label></div>{order.scholarship.enabled ? <div className="registration-grid"><label><span>Scholarship type</span><select onChange={(e) => updateScholarship("kind", e.target.value)} value={order.scholarship.kind}><option value="general">General scholarship fund</option><option value="specific">Specific person</option></select></label>{order.scholarship.kind === "general" ? <label><span>Contribution amount *</span><input min="40" onChange={(e) => updateScholarship("amountCents", Math.max(4000, Math.round(Number(e.target.value || 40) * 100)))} step="1" type="number" value={order.scholarship.amountCents / 100} /></label> : <><label><span>Recipient name *</span><input onChange={(e) => updateScholarship("recipientName", e.target.value)} value={order.scholarship.recipientName} /></label><label><span>Recipient email *</span><input onChange={(e) => updateScholarship("recipientEmail", e.target.value)} type="email" value={order.scholarship.recipientEmail} /></label></>}<label className="registration-full"><span>AA entity attribution (optional)</span><input onChange={(e) => updateScholarship("attribution", e.target.value)} placeholder="Meeting, YPAA committee, district, area, or state" value={order.scholarship.attribution} /></label></div> : null}</section>

            {order.selfRegistration ? <section className="registration-card registration-policy"><h2>Non-Discrimination and Anti-Harassment Policy</h2><div className="registration-policy-text"><p>NECYPAA is committed to an environment free of discrimination and harassment, including sexual harassment, for Advisory Council and Host Committee members, Bid Committee members, conference attendees, and participants in NECYPAA-operated online spaces.</p><h3>Non-discrimination</h3><p>NECYPAA prohibits discrimination based on age, race, color, religion, sex, national origin, creed, disability, veteran status, sexual orientation, gender identity, or gender expression.</p><h3>Anti-harassment</h3><p>Harassment and sexual harassment are prohibited. This includes unwelcome verbal, physical, or visual conduct that creates an intimidating, hostile, or offensive environment; unwelcome sexual advances or requests; and conduct used as the basis for decisions affecting another person.</p><h3>Reporting, retaliation, and corrective action</h3><p>Unsafe, discriminatory, or harassing conduct should be reported to NECYPAA Advisory or the Host Committee. Retaliation for reporting is prohibited. Violations may lead to removal, dismissal, or exclusion from future events. Crimes or immediate safety threats should be reported to the proper authorities.</p><h3>Safety statement</h3><p>Everyone is asked to help maintain a secure and welcoming environment, refrain from behavior that may compromise another person’s safety, and take appropriate action when safety is jeopardized.</p></div><div className="registration-policy-checks">{POLICY_KEYS.map((key) => <label key={key}><input checked={order.policy[key]} onChange={(e) => setOrder((current) => ({ ...current, policy: { ...current.policy, [key]: e.target.checked } }))} type="checkbox" /><span>{policyLabels[key]} *</span></label>)}</div></section> : null}
          </div>

          <aside className="registration-summary"><p>Order summary</p>{order.selfRegistration ? <div><span>Registration</span><strong>{money(REGISTRATION_PRICE_CENTS)}</strong></div> : null}{BREAKFASTS.map((item) => order.breakfast[item.id] ? <div key={item.id}><span>{item.name} × {order.breakfast[item.id]}</span><strong>{money(order.breakfast[item.id] * BREAKFAST_PRICE_CENTS)}</strong></div> : null)}{order.scholarship.enabled ? <div><span>{order.scholarship.kind === "general" ? "General scholarship fund" : "Specific-person scholarship"}</span><strong>{money(order.scholarship.amountCents)}</strong></div> : null}<div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>{!cash && subtotal > 0 ? <div><span>Processing fee</span><strong>{money(processingFee)}</strong></div> : null}<div className="registration-total"><span>{cash ? "Cash value" : "Total"}</span><strong>{money(total)}</strong></div>{error ? <p className="registration-error">{error}</p> : null}<button disabled={submitting || subtotal <= 0 || (cash && !code)} onClick={submit} type="button">{submitting ? "Submitting…" : cash ? "Record cash order" : "Continue to secure payment"}</button><small>{cash ? "Creates or updates a Stripe customer and records the transaction without charging a card." : "You’ll finish payment on Stripe’s secure checkout."}</small></aside>
        </div>
      </main>
    </SiteFrame>
  );
}
