function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function resourceID(value) {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (!isRecord(value)) return null;
  const id = value.id ?? value._id ?? value.value;
  return typeof id === "string" || typeof id === "number" ? String(id) : null;
}

function isExpandedMedia(value) {
  return isRecord(value) && typeof value.url === "string" && Boolean(value.url.trim());
}

function arrayItemID(value) {
  if (!isRecord(value)) return null;
  if (isRecord(value.props)) return resourceID(value.props.id);
  return resourceID(value.id);
}

/**
 * Payload stores relationship IDs in builderData but returns populated media
 * objects in layout at depth 1. Keep builderData authoritative while borrowing
 * only those populated media resources from the compatible layout copy.
 */
export function hydrateExpandedMedia(value, expandedValue) {
  if (isExpandedMedia(expandedValue)) {
    const valueID = resourceID(value);
    const expandedID = resourceID(expandedValue);
    if (valueID && expandedID && valueID === expandedID) {
      return isRecord(value) ? { ...expandedValue, ...value } : { ...expandedValue };
    }
  }

  if (Array.isArray(value)) {
    if (!Array.isArray(expandedValue)) return value;
    return value.map((item, index) => {
      const id = arrayItemID(item);
      const expandedItem = id
        ? expandedValue.find((candidate) => arrayItemID(candidate) === id) ?? expandedValue[index]
        : expandedValue[index];
      return hydrateExpandedMedia(item, expandedItem);
    });
  }

  if (!isRecord(value) || !isRecord(expandedValue)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, entry]) => [key, hydrateExpandedMedia(entry, expandedValue[key])]),
  );
}

export function isRenderableMediaString(value) {
  if (typeof value !== "string") return false;
  const source = value.trim();
  return /^(?:(?:https?:)?\/\/|\/|data:(?:image|video)\/|blob:)/i.test(source);
}
