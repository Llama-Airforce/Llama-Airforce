export const routes = [
  { path: "/", component: () => import("@LAF/Pages/Home.page.vue") },

  { path: "/code", component: () => import("@LAF/Pages/Code.page.vue") },
  {
    path: "/debug",
    component: () => import("@LAF/Pages/Debug/Debug.page.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@LAF/Pages/NotFound.page.vue"),
  },
];
