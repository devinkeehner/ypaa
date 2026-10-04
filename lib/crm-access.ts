import type { Access, CollectionConfig, GlobalConfig } from "payload";

export const CONTENT_AREAS = ["merch", "program", "registration"] as const;
export type ContentArea = typeof CONTENT_AREAS[number];
type AccessUser = { collection?: string; id?: string | number; role?: string | null; contentAreas?: ContentArea[] | null; accessLevel?: string | null };
const account = (user: unknown): AccessUser | null => user && typeof user === "object" && !Array.isArray(user) ? user as AccessUser : null;

// Accounts created before roles were introduced retain administrator access.
export const isAdministrator = (user: unknown): boolean => {
  const value = account(user);
  return Boolean(value && (!value.collection || value.collection === "users") && (value.role == null || value.role === "admin"));
};
export const isViewer = (user: unknown): boolean => account(user)?.role === "viewer";
export const isMerchChair = (user: unknown): boolean => account(user)?.role === "merch";
export const isRestrictedStaff = (user: unknown): boolean => account(user)?.role === "staff";
export const isReadOnlyUser = (user: unknown): boolean => !isAdministrator(user) && !(isRestrictedStaff(user) && account(user)?.accessLevel === "manage");

export function canAccessArea(user: unknown, area: ContentArea, write = false): boolean {
  if (isAdministrator(user)) return true;
  if (isViewer(user)) return !write;
  if (isMerchChair(user)) return area === "merch" && !write;
  const value = account(user);
  return Boolean(value?.role === "staff" && Array.isArray(value.contentAreas) && value.contentAreas.includes(area) && (!write || value.accessLevel === "manage"));
}

const COLLECTION_AREAS: Record<string, ContentArea> = {
  merchandise: "merch", "merchandise-orders": "merch",
  "program-sessions": "program", rooms: "program", "venue-maps": "program",
  contacts: "registration", attendees: "registration", "registration-entitlements": "registration",
  "breakfast-tickets": "registration", "access-codes": "registration", "cash-transactions": "registration",
  "checkout-orders": "registration", "scholarship-contributions": "registration", "registration-corrections": "registration", "registration-help-requests": "registration",
};

export function canReadCollection(user: unknown, slug: string): boolean {
  if (isAdministrator(user)) return true;
  if (slug === "users") return false; // Accounts and permission management are admin-only.
  if (slug === "registration-imports") return false;
  if (isViewer(user)) return true;
  if (isMerchChair(user)) return slug === "merchandise-orders";
  if (slug === "media") return CONTENT_AREAS.some((area) => canAccessArea(user, area));
  return Boolean(COLLECTION_AREAS[slug] && canAccessArea(user, COLLECTION_AREAS[slug]));
}

export const canEditCRM = (user: unknown): boolean => canAccessArea(user, "registration", true);
export const crmWrite: Access = ({ req }) => canEditCRM(req.user);

export function withViewerAccess(collection: CollectionConfig): CollectionConfig {
  const access = { ...collection.access };
  const originalRead = access.read;
  access.admin = ({ req }) => collection.slug === "users"
    ? isAdministrator(req.user) || isViewer(req.user) || isMerchChair(req.user) || isRestrictedStaff(req.user)
    : canReadCollection(req.user, collection.slug);
  access.read = (args) => {
    const user = args.req.user;
    if (collection.slug === "users" && user && !isAdministrator(user)) return { id: { equals: user.id } };
    if (user && !canReadCollection(user, collection.slug)) return false;
    return originalRead ? originalRead(args) : Boolean(user);
  };
  const originalVersions = access.readVersions;
  access.readVersions = (args) => canReadCollection(args.req.user, collection.slug)
    ? originalVersions ? originalVersions(args) : originalRead ? originalRead(args) : true
    : false;
  for (const operation of ["create", "update", "delete", "unlock"] as const) {
    const original = access[operation];
    access[operation] = (args) => {
      const user = args.req.user;
      if (collection.slug === "users" && !isAdministrator(user)) {
        return operation === "update" && user ? { id: { equals: user.id } } : false;
      }
      if (!isAdministrator(user)) {
        // Shared public assets can be uploaded, but only admins may replace or
        // delete them because other teams' pages can reference the same media.
        const allowed = collection.slug === "media"
          ? operation === "create" && CONTENT_AREAS.some((area) => canAccessArea(user, area, true))
          : COLLECTION_AREAS[collection.slug] && canAccessArea(user, COLLECTION_AREAS[collection.slug], true);
        if (!allowed) return false;
      }
      return original ? original(args) : Boolean(user);
    };
  }
  return { ...collection, admin: collection.slug === "users" ? { ...collection.admin, hidden: ({ user }) => !isAdministrator(user) } : collection.admin, access };
}

export function withViewerGlobalAccess(global: GlobalConfig): GlobalConfig {
  const originalRead = global.access?.read;
  const originalUpdate = global.access?.update;
  const originalVersions = global.access?.readVersions;
  return { ...global, access: {
    ...global.access,
    read: (args) => args.req.user && !isAdministrator(args.req.user) && !isViewer(args.req.user)
      ? false : originalRead ? originalRead(args) : Boolean(args.req.user),
    readVersions: (args) => isAdministrator(args.req.user) || isViewer(args.req.user)
      ? originalVersions ? originalVersions(args) : originalRead ? originalRead(args) : true
      : false,
    update: (args) => !isAdministrator(args.req.user) ? false : originalUpdate ? originalUpdate(args) : true,
  } };
}
