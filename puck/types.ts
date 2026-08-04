import type { Data } from "@puckeditor/core";

export type PageRootProps = {
  title?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type NECYPAAData = Data<Record<string, Record<string, unknown>>, PageRootProps>;

export type PageDocument = {
  id?: number | string;
  title?: string | null;
  slug?: string | null;
  builderData?: NECYPAAData | null;
  layout?: Array<Record<string, unknown>> | null;
  meta?: { title?: string | null; description?: string | null } | null;
};
