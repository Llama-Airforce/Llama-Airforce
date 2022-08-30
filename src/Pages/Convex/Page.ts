import { Page } from "@/Pages/Page";

import ConvexFlyer from "@/Pages/Convex/Flyer/Flyer.vue";
import ConvexPools from "@/Pages/Convex/Pools/Pools.vue";

export const pageConvex: Page = {
  title: "Convex",
  titleRoute: "/convex",
  planeX: 255,
  routes: [
    { path: "/convex", redirect: { name: "flyer" } },
    { path: "/convex/flyer", name: "flyer", component: ConvexFlyer },
    {
      path: "/convex/pools/:pool?",
      name: "convexpools",
      component: ConvexPools,
    },
  ],
  menuHeader: "headers/convex.png",
  menuItems: [
    {
      to: "/convex/flyer",
      icon: "fas fa-plane",
      label: "Flyer",
    },
    {
      to: "/convex/pools",
      icon: "fas fa-chart-pie",
      label: "Pools",
    },
  ],
};
