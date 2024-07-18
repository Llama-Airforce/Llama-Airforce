import { createRouter as createVueRouter, createWebHistory } from "vue-router";
import { usePageStore } from "@/Framework/Stores";

import Home from "@LAF/Pages/Home.page.vue";

import NotFound from "@LAF/Pages/NotFound.page.vue";
import Code from "@LAF/Pages/Code.page.vue";
import Debug from "@LAF/Pages/Debug/Debug.page.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
    { path: "/", component: Home },

    { path: "/code", component: Code },
    { path: "/debug", component: Debug },

    // Add all page routes.
    ...pageStore.routes.flatMap((routes) => routes),

    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ];

  const router = createVueRouter({
    history: createWebHistory(),
    routes,
  });

  return router;
}
