import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router";

import CurveMonitor from "@CM/Dashboard.vue";
import NotFound from "@CM/NotFound.vue";

export default function createRouter() {
  // Configure all routes, including all pages.
  const routes = [
    { path: "/:pool?", name: "curvemonitor", component: CurveMonitor },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ];

  const router = createVueRouter({
    history: createWebHashHistory(),
    routes,
  });

  return router;
}
