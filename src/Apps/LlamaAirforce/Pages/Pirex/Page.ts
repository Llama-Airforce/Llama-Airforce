import type { Page } from "@LAF/Pages/Page";

import Pirex from "@LAF/Pages/Pirex/Pirex.page.vue";
import Futures from "@LAF/Pages/Pirex/Futures.page.vue";

import menuHeader from "@/Assets/Menu/pirex.webp";

export const pagePirexRoutes = [
  {
    path: "/pirex",
    name: "pirex",
    component: Pirex,
  },
  {
    path: "/pirex/futures",
    name: "futures",
    component: Futures,
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
