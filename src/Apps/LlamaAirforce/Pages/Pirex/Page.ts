import type { Page } from "@LAF/Pages/Page";

import menuHeader from "@/Assets/Menu/pirex.webp";

export const pagePirexRoutes = [
  {
    path: "/pirex",
    name: "pirex",
    component: () => import("@LAF/Pages/Pirex/Pirex.page.vue"),
  },
  {
    path: "/pirex/futures",
    name: "futures",
    component: () => import("@LAF/Pages/Pirex/Futures.page.vue"),
  },
];

export const pagePirex: Page = {
  title: "Pirex",
  titleRoute: "/pirex",
  visible: true,
  planeX: 165,
  menuHeader,
  items: [],
  forceShowMenu: false,
};
