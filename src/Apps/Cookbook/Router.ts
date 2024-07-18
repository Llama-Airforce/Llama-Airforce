import { createRouter as createVueRouter, createWebHistory } from "vue-router";
import { usePageStore } from "@/Framework/Stores";

import NotFound from "@CB/NotFound.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
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
