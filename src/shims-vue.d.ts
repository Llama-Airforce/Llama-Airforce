/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*.json" {
  const value: { [key: string]: any };
  export default value;
}

// Shim exists so the app still compiles in case the Union git submodule is not loaded.
declare module "@LAF/Pages/Union/Page" {
  import { type RouteRecordRaw } from "vue-router";
  import type { Page } from "@LAF/Pages/Page";
  const pageUnion: Page;
  const pageUnionRoutes: RouteRecordRaw[];

  export { pageUnion, pageUnionRoutes };
}
