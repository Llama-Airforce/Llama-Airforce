import { type PageLAF } from "@LAF/Pages/Page";

import Pirex from "@LAF/Pages/Pirex/Pirex.page.vue";

import menuHeader from "@/Assets/Menu/pirex.webp";

export const pagePirexRoutes = [
  {
    path: "/pirex",
    name: "pirex",
    component: Pirex,
  },
];

export const pagePirex: PageLAF = {
  title: "Pirex",
  titleRoute: "/pirex",
  visible: true,
  planeX: 165,
  menuHeader,
  menuItems: [],
  forceShowMenu: false,
};
