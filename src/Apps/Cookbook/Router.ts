import {
  createRouter as createVueRouter,
  createWebHashHistory,
} from "vue-router/auto";

export default function createRouter() {
  const router = createVueRouter({
    history: createWebHashHistory(),
    extendRoutes(routes) {
      routes.push({
        path: "/",
        redirect: { path: "/button" },
      });

      return routes;
    },
  });

  return router;
}
