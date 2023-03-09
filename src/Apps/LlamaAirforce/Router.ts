import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";
import { usePageStore } from "@LAF/Pages/Store";

import Home from "@LAF/Pages/Home.vue";

import NotFound from "@LAF/Pages/NotFound.vue";
import Code from "@LAF/Pages/Code.vue";
import Debug from "@LAF/Pages/Debug/Debug.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
    { path: "/", component: Home },

    { path: "/code", component: Code },
    { path: "/debug", component: Debug },

    // Add all page routes.
    ...pageStore.pages.flatMap((page) => page.routes),

    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ];

  const router = createVueRouter({
    history: createWebHashHistory(),
    routes,
  });

  return router;
}
