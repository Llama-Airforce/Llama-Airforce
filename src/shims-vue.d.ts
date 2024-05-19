/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue3-popper" {
  import { Component } from "vue";
  const file: Component;
  export default file;
}

declare module "*.json" {
  const value: { [key: string]: any };
  export default value;
}

// Shim exists so the app still compiles in case the Union git submodule is not loaded.
declare module "@LAF/Pages/Union/Page" {
  import { type RouteRecordRaw } from "vue-router";
  import type { PageLAF } from "@LAF/Pages/Page";
  const pageUnion: PageLAF;
  const pageUnionRoutes: RouteRecordRaw[];

  const pagePounders: PageLAF;
  const pagePoundersRoutes: RouteRecordRaw[];
  export { pageUnion, pageUnionRoutes, pagePounders, pagePoundersRoutes };
}

declare module "vue3-apexcharts" {
  import { Component } from "vue";
  const VueApexCharts: any;
  export default VueApexCharts;
}

declare module "highlight.js/lib/languages/xml" {
  import { Component } from "vue";
  const xml: any;
  export default xml;
}

declare module "highlight.js/lib/languages/scss" {
  import { Component } from "vue";
  const scss: any;
  export default scss;
}

declare module "highlight.js/lib/languages/typescript" {
  import { Component } from "vue";
  const typescript: any;
  export default typescript;
}
