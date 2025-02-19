import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", component: () => import("@HA/Pages/Home/Home.page.vue") },
  { path: "/code", component: () => import("@HA/Pages/Code.page.vue") },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@HA/Pages/NotFound.page.vue"),
  },
];
