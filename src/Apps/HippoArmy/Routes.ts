import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

import Home from "@HA/Pages/Home/Home.page.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: Home },
  { path: "/code", component: () => import("@HA/Pages/Code.page.vue") },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@HA/Pages/NotFound.page.vue"),
  },
];
