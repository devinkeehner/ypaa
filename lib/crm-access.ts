import type { Access, CollectionConfig, GlobalConfig } from "payload";

export const isViewer = (user: unknown): boolean => Boolean(user && typeof user === "object" && "role" in user && user.role === "viewer");
export const isMerchChair = (user: unknown): boolean => Boolean(user && typeof user === "object" && "role" in user && user.role === "merch");
export const isReadOnlyUser = (user: unknown): boolean => isViewer(user) || isMerchChair(user);
export const canEditCRM = (user: unknown): boolean => Boolean(user) && !isReadOnlyUser(user);
export const crmWrite: Access = ({ req }) => canEditCRM(req.user);

// Merch accounts can only read the merchandise sales ledger. Other collection
// rules are preserved for admins and regular read-only viewers.
export function withViewerAccess(collection: CollectionConfig): CollectionConfig {
  const access = { ...collection.access };
  const originalRead = access.read;
  access.read = (args) => {
    if (isMerchChair(args.req.user)) return collection.slug === "merchandise-orders";
    return originalRead ? originalRead(args) : Boolean(args.req.user);
  };
  for (const operation of ["create", "update", "delete", "unlock"] as const) {
    const original = access[operation];
    access[operation] = (args) => isReadOnlyUser(args.req.user) ? false : original ? original(args) : Boolean(args.req.user);
  }
  return { ...collection, access };
}

export function withViewerGlobalAccess(global: GlobalConfig): GlobalConfig {
  const originalRead = global.access?.read;
  const original = global.access?.update;
  return { ...global, access: {
    ...global.access,
    read: (args) => isMerchChair(args.req.user) ? false : originalRead ? originalRead(args) : Boolean(args.req.user),
    update: (args) => isReadOnlyUser(args.req.user) ? false : original ? original(args) : Boolean(args.req.user),
  } };
}
