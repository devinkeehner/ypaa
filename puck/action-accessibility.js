export function contextualActionName(visibleLabel, context) {
  const visible = String(visibleLabel ?? "").replace(/\s+/g, " ").trim();
  const extra = String(context ?? "").replace(/\s+/g, " ").trim();
  if (!extra) return undefined;
  if (!visible || extra.toLocaleLowerCase().startsWith(visible.toLocaleLowerCase())) return extra;
  return `${visible} — ${extra}`;
}
