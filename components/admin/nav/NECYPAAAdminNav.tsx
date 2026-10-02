import type {
  PayloadRequest,
  SanitizedPermissions,
  ServerProps,
} from "payload";
import type { NavGroupType } from "@payloadcms/ui/shared";
import {
  EntityType,
  getVisibleEntities,
  groupNavItems,
} from "@payloadcms/ui/shared";
import React from "react";

import {
  EVENT_WORKSPACE_NAV_AREAS,
  type EventWorkspaceNavArea,
} from "@/components/admin/eventWorkspace";
import { isMerchChair } from "@/lib/crm-access";

import { NECYPAAAdminNavClient } from "./NECYPAAAdminNavClient";

type Props = ServerProps & {
  documentSubViewType?: string;
  permissions?: SanitizedPermissions;
  req?: PayloadRequest;
  viewType?: string;
};

type NavEntity = NavGroupType["entities"][number];

/**
 * Groups event tools into a compact rail with contextual navigation. The registry in
 * eventWorkspace.ts is the only place where event collections are grouped.
 */
export async function NECYPAAAdminNav(props: Props) {
  const { i18n, permissions, req } = props;

  if (!req || !permissions) return null;

  const { collections, globals } = req.payload.config;
  const visibleEntities = getVisibleEntities({ req });
  const payloadGroups = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities.collections.includes(slug))
        .map((collection) => ({
          entity: collection,
          type: EntityType.collection,
        })),
      ...globals
        .filter(({ slug }) => visibleEntities.globals.includes(slug))
        .map((global) => ({
          entity: global,
          type: EntityType.global,
        })),
    ] as Parameters<typeof groupNavItems>[0],
    permissions,
    i18n,
  );

  const visibleNavEntities = payloadGroups.flatMap(
    (group) => group.entities,
  ) as NavEntity[];
  const entityBySlug = new Map(
    visibleNavEntities.map((entity) => [String(entity.slug), entity]),
  );
  const assignedSlugs = new Set<string>();
  const areas: Array<EventWorkspaceNavArea & { entities: NavEntity[] }> =
    EVENT_WORKSPACE_NAV_AREAS.map((area) => {
      const entities = area.slugs
        .map((slug) => entityBySlug.get(slug))
        .filter((entity): entity is NavEntity => Boolean(entity));

      entities.forEach((entity) => assignedSlugs.add(String(entity.slug)));

      return {
        ...area,
        entities,
      };
    });

  const remainingEntities = visibleNavEntities.filter(
    (entity) => !assignedSlugs.has(String(entity.slug)),
  );
  const moreArea = areas.find(
    (area) => area.key === "more",
  );

  if (moreArea && remainingEntities.length > 0) {
    moreArea.entities.push(...remainingEntities);
  }

  return <NECYPAAAdminNavClient areas={areas.filter((area) => area.entities.length > 0 || area.primaryAction)} isMerchChair={isMerchChair(req.user)} />;
}
