import type { Data } from "@puckeditor/core";

export type NECYPAAData = Data;

export type PageDocument = {
  id?: number | string;
  title?: string | null;
  slug?: string | null;
  builderData?: NECYPAAData | null;
};
