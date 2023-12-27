import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";
import { usePageStore } from "@CB/Stores";

import NotFound from "@CB/NotFound.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
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
