"use client";

import { useField } from "@payloadcms/ui";
import type { PurchaseDetails } from "@/lib/checkout-order-details";
import { fulfillmentLabel } from "@/lib/checkout-order-details";

const known = (value: unknown) => value === null || value === undefined ? "Unknown" : String(value);
const money = (value: number | null) => value === null ? "Unknown" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value / 100);

export function PurchaseDetailsView({ details }: { details: PurchaseDetails }) {
  return <section aria-label="Purchase details" style={{ marginBlock: "1.5rem", overflowWrap: "anywhere" }}>
    <h2>Purchase details</h2>
    <p><strong>{details.summary}</strong></p>
    <p>Payment method: {details.paymentMethod}</p>
    {details.categories.includes("registration") && <p>Registration quantity: {known(details.registrationQuantity)}</p>}
    {details.scholarship && <div><h3>Scholarship</h3><dl>
      <dt>Type</dt><dd>{details.scholarship.kind === "specific" ? "Specific recipient" : details.scholarship.kind === "general" ? "General scholarship fund" : "Unknown"}</dd>
      <dt>Quantity</dt><dd>{known(details.scholarship.quantity)}</dd>
      <dt>Recorded contribution amount</dt><dd>{money(details.scholarship.amountCents)}</dd>
      {details.scholarship.recipientName && <><dt>Recipient</dt><dd>{details.scholarship.recipientName}</dd></>}
      {details.scholarship.recipientEmail && <><dt>Recipient email</dt><dd>{details.scholarship.recipientEmail}</dd></>}
      {details.scholarship.attribution && <><dt>Attribution</dt><dd>{details.scholarship.attribution}</dd></>}
    </dl></div>}
    {details.categories.includes("breakfast") && <div><h3>Breakfast</h3><p>Total tickets: {known(details.breakfast.totalQuantity)}</p><ul>{details.breakfast.days.map(({ day, quantity }) => <li key={day}>{day[0].toUpperCase()}{day.slice(1)} × {quantity}</li>)}</ul>{(details.breakfast.unassignedQuantity === null || details.breakfast.unassignedQuantity > 0) && <p>Day unknown: {known(details.breakfast.unassignedQuantity)} tickets</p>}</div>}
    {details.categories.includes("merchandise") && <div><h3>Merchandise</h3><p>Quantity: {known(details.merchandise.quantity)}</p><p>Delivery choice: {fulfillmentLabel(details.merchandise.fulfillment)}</p>{details.merchandise.shippingStatus && <p>Shipping status: {details.merchandise.shippingStatus.replaceAll("_", " ")}</p>}
      <ul>{details.merchandise.items.map((item, index) => <li key={index}><strong>{item.name || item.slug || item.sku || "Merchandise item"}</strong> × {known(item.quantity)}<br />Size: {known(item.size)} · Color: {known(item.color)} · SKU: {known(item.sku)} · Variant: {known(item.variantId)} · Recorded unit price: {money(item.unitPriceCents)}</li>)}</ul>
      {details.merchandise.records.map((record) => <p key={record.id}><a href={`/admin/collections/merchandise-orders/${encodeURIComponent(record.id)}`}>Related merchandise order</a>{record.status ? ` · Inventory status: ${record.status}` : ""}</p>)}
    </div>}
    {details.merchandise.reportedLineItems && <div><h3>Reported checkout line items</h3><p style={{ whiteSpace: "pre-wrap" }}>{details.merchandise.reportedLineItems}</p></div>}
    {details.notes.length > 0 && <div><h3>Source detail notes</h3><ul>{details.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>}
    <p><small>Derived from stored purchase fields, original metadata and permitted related records. Financial totals and payment status remain in the fields below.</small></p>
  </section>;
}

export function CheckoutOrderDetails({ path }: { path: string }) {
  const { value } = useField<PurchaseDetails>({ path });
  return value?.version === 1 ? <PurchaseDetailsView details={value} /> : <p>Purchase details are unavailable. Save a new order or reopen an existing order to read its source details.</p>;
}
