import type { RouteParamsRaw } from "vue-router";

export type Crumb = {
  id: string;
  label: string;
  pathName?: string;
  hint?: boolean;
  params?: () => RouteParamsRaw;
};
