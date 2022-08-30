import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";
import { usePageStore } from "@/Pages/Store";

import Home from "@/Pages/Home.vue";

import NotFound from "@/Pages/NotFound.vue";
import Contracts from "@/Pages/Contracts.vue";
import Debug from "@/Pages/Debug/Debug.vue";

export default function createRouter() {
  // Load in configured pages.
  const pageStore = usePageStore();

  // Configure all routes, including all pages.
  const routes = [
    { path: "/", component: Home },

    { path: "/contracts", component: Contracts },
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
