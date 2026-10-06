/** Header navigation supports two levels: top-level items and child links. */
export const HEADER_CHILD_LIMIT = 12;

export type HeaderChildLink = {
  id?: string;
  label: string;
  url: string;
  newTab?: boolean;
  showWarning?: boolean;
};

export type HeaderNavigationItem = HeaderChildLink & {
  style: "link" | "button";
  appearance?: "solid" | "outline";
  children?: HeaderChildLink[];
};

export function validNavigationLabel(value: unknown): boolean {
  return typeof value === "string" && Boolean(value.trim()) && !/[\u0000-\u001f\u007f]/.test(value);
}

export function validNavigationUrl(value: unknown): boolean {
  if (typeof value !== "string" || !value.trim()) return false;
  const url = value.trim();
  if (/[\s\\\u0000-\u001f\u007f]/.test(url)) return false;
  if (url.startsWith("#")) return url.length > 1;
  if (url.startsWith("/")) return !/^\/(?:\/|%2f|%5c)/i.test(url);
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return /^https?:\/\//i.test(url) && Boolean(parsed.hostname);
    return /^(mailto:|tel:)$/.test(parsed.protocol) && Boolean(parsed.pathname);
  } catch {
    return false;
  }
}

export function validateNavigationLabel(value: unknown): true | string {
  return validNavigationLabel(value) || "Enter a non-empty link label without control characters.";
}

export function validateNavigationUrl(value: unknown): true | string {
  return validNavigationUrl(value) || "Enter a root-relative path, #fragment, or an http, https, mailto or tel URL without spaces.";
}

export function validateNavigationRows(value: unknown): true | string {
  if (value == null) return true;
  if (!Array.isArray(value)) return "Navigation links must be an array.";
  const ids = new Set<string>();
  for (const row of value) {
    if (!row || typeof row !== "object") return "Each navigation link needs a label and URL.";
    const item = row as Record<string, unknown>;
    if (!validNavigationLabel(item.label) || !validNavigationUrl(item.url)) return "Each navigation link needs a non-empty label and a valid URL.";
    if (typeof item.id === "string" && item.id) {
      if (ids.has(item.id)) return "Navigation row IDs must be unique within each group.";
      ids.add(item.id);
    }
  }
  return true;
}

export function validateHeaderChildren(value: unknown, siblingData?: Record<string, unknown>): true | string {
  const valid = validateNavigationRows(value);
  if (valid !== true) return valid;
  if (!Array.isArray(value) || !value.length) return true;
  if (siblingData?.style === "button") return "Child links belong to navigation links; button / action items remain direct links.";
  if (value.length > HEADER_CHILD_LIMIT) return `Use at most ${HEADER_CHILD_LIMIT} child links per item.`;
  if (value.some((item) => item.children?.length)) return "Only two navigation levels are supported.";
  return true;
}

function normalizeLink(value: unknown): HeaderChildLink | undefined {
  if (!value || typeof value !== "object") return;
  const item = value as Record<string, unknown>;
  if (!validNavigationLabel(item.label) || !validNavigationUrl(item.url)) return;
  return {
    ...(typeof item.id === "string" && item.id ? { id: item.id } : {}),
    label: (item.label as string).trim(),
    url: (item.url as string).trim(),
    newTab: item.newTab === true,
    showWarning: item.showWarning === true,
  };
}

/** Never invent destinations for malformed CMS rows. Unknown deeper levels are ignored. */
export function normalizeHeaderNavigation(value: unknown): HeaderNavigationItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    const link = normalizeLink(row);
    if (!link) return [];
    const style = row.style === "button" ? "button" : "link";
    const children = style === "link" && Array.isArray(row.children)
      ? row.children.slice(0, HEADER_CHILD_LIMIT).flatMap((child: unknown) => {
        const normalized = normalizeLink(child);
        return normalized ? [normalized] : [];
      }) : [];
    return [{ ...link, style, appearance: row.appearance === "outline" ? "outline" : "solid", ...(children.length ? { children } : {}) } as HeaderNavigationItem];
  });
}

export function filterHeaderNavigation(items: HeaderNavigationItem[], allow: (url: string) => boolean): HeaderNavigationItem[] {
  return items.filter((item) => allow(item.url)).map((item) => ({
    ...item,
    ...(item.children ? { children: item.children.filter((child) => allow(child.url)) } : {}),
  }));
}

// Index keeps keys unique even for legacy/imported rows with duplicate or missing IDs.
export function headerNavigationKey(item: HeaderChildLink, index: number): string {
  return `${index}:${item.id ?? item.url}`;
}
