import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";
import { usePageStore } from "@/Framework/Stores";

import NotFound from "@LAF/Pages/NotFound.vue";
import Code from "@LAF/Pages/Code.vue";
import Debug from "@LAF/Pages/Debug/Debug.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  const homePage =
    import.meta.env.VITE_UNION === "true" ? "union" : "rounds-incentives";

  // Configure all routes, including all pages.
  const routes = [
    { path: "/", redirect: { name: homePage } },

    { path: "/code", component: Code },
    { path: "/debug", component: Debug },

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
