import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";
import { usePageStore } from "@/Framework/Stores";

import NotFound from "@PM/Pages/NotFound.vue";
import Code from "@PM/Pages/Code.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
    { path: "/code", component: Code },

    // Add all page routes.
    ...pageStore.routes.flatMap((routes) => routes),

    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ];

  const router = createVueRouter({
    history: createWebHashHistory(),
    routes,
  });

  return router;
}
