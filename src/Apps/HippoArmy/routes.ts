import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("@HA/pages/home/Home.page.vue") },
  { path: "/code", component: () => import("@HA/pages/Code.page.vue") },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@HA/pages/NotFound.page.vue"),
  },
];
