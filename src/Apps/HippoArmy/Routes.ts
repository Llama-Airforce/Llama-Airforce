import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

import Home from "@HA/Pages/Home/Home.page.vue";
import Code from "@HA/Pages/Code.page.vue";
import NotFound from "@HA/Pages/NotFound.page.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/code", component: Code },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
