export function CRMDemoNotice() {
  const demo = process.env.CRM_DEMO_MODE === "true" || process.env.NODE_ENV === "development";
  if (!demo) return null;
  const importedThrough = process.env.CRM_IMPORT_THROUGH;
  return <aside role="note" style={{ padding: "12px 16px", marginBottom: 20, border: "1px solid #c9a44b", borderRadius: 8, background: "#fff8e5", color: "#493b16" }}>
    <strong>Local preview</strong> — {importedThrough ? `CRM data imported through: ${importedThrough}.` : "Synthetic records only; no real payment was collected."} Changes here are saved to this local database. Use a practice registration to demonstrate a correction.
  </aside>;
}
