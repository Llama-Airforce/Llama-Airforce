import Home from "@LAF/Pages/Home.page.vue";

import NotFound from "@LAF/Pages/NotFound.page.vue";
import Code from "@LAF/Pages/Code.page.vue";
import Debug from "@LAF/Pages/Debug/Debug.page.vue";

export const routes = [
  { path: "/", component: Home },

  { path: "/code", component: Code },
  { path: "/debug", component: Debug },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];
