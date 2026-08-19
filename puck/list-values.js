function lines(value) {
  if (typeof value === "string") {
    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) return value;
  return [];
}

function pair(value) {
  if (typeof value !== "string") return ["", ""];
  const separator = value.includes("—") ? "—" : value.includes(" – ") ? " – " : " - ";
  const index = value.indexOf(separator);
  if (index < 0) return [value.trim(), ""];
  return [value.slice(0, index).trim(), value.slice(index + separator.length).trim()];
}

function text(record, keys) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function richTextStorage(record) {
  const value = record?.puckRichText;
  return value && typeof value === "object" && !Array.isArray(value)
    ? { puckRichText: value }
    : {};
}

/** @param {unknown} value */
export function normalizeImportantDates(value) {
  return lines(value)
    .map((item) => {
      if (typeof item === "string") {
        const [date, label] = pair(item);
        return { date, label };
      }
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      return {
        ...richTextStorage(item),
        date: text(item, ["date", "when"]),
        label: text(item, ["label", "title", "name", "details", "value"]),
      };
    })
    .filter((item) => item && (item.date || item.label));
}

/** @param {unknown} value */
export function normalizePastEvents(value) {
  return lines(value)
    .map((item) => {
      if (typeof item === "string") {
        const [title, date] = pair(item);
        return { title, date };
      }
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      return {
        ...richTextStorage(item),
        title: text(item, ["title", "name", "label", "value"]),
        date: text(item, ["date", "when"]),
        image:
          item.image && typeof item.image === "object" && !Array.isArray(item.image)
            ? item.image
            : null,
      };
    })
    .filter((item) => item && (item.title || item.date));
}

/** @param {unknown} value */
export function normalizeMeetings(value) {
  return lines(value)
    .map((item) => {
      if (typeof item === "string") {
        const [name, location] = pair(item);
        return { name, location };
      }
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      const meeting = {
        name: text(item, ["name", "title", "label", "value"]),
        location: text(item, ["location", "place", "state", "region"]),
      };
      const date = text(item, ["date", "when"]);
      const url = text(item, ["url", "href", "link"]);
      return { ...richTextStorage(item), ...meeting, ...(date ? { date } : {}), ...(url ? { url } : {}) };
    })
    .filter((item) => item && (item.name || item.location));
}

/** @param {unknown} value */
export function normalizeUpcomingEvents(value) {
  return lines(value)
    .map((item) => {
      if (typeof item === "string") {
        const [title, date] = pair(item);
        return { title, date };
      }
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      return {
        ...richTextStorage(item),
        title: text(item, ["title", "name", "label", "value"]),
        date: text(item, ["date", "when"]),
      };
    })
    .filter((item) => item && (item.title || item.date));
}

/** @param {unknown} value */
export function normalizeScheduleMeetings(value) {
  return lines(value)
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) return null;
      return {
        ...richTextStorage(item),
        day: text(item, ["day", "date"]),
        time: text(item, ["time"]),
        name: text(item, ["name", "title", "label"]),
        url: text(item, ["url", "href", "link"]),
        location: text(item, ["location", "venue", "place"]),
        city: text(item, ["city", "town"]),
        attendance: text(item, ["attendance", "format"]),
        address: text(item, ["address"]),
        types: text(item, ["types", "meetingTypes"]),
      };
    })
    .filter((item) => item && (item.name || item.location));
}
