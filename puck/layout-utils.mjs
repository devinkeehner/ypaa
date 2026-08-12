export function layoutColumnCount(layout) {
  return layout === "one" ? 1 : layout === "three" ? 3 : layout === "four" ? 4 : 2;
}

export function normalizeLayoutColumns(layout, columns) {
  const next = Array.isArray(columns) ? [...columns] : [];
  const required = layoutColumnCount(layout);
  while (next.length < required) next.push({ label: `Column ${next.length + 1}` });
  return next;
}
