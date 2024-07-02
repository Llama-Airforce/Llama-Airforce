import { type PageLAF } from "@LAF/Pages/Page";

import UnionPounders from "@Pounders/Pounders.page.vue";

import menuHeader from "@/Assets/Menu/union.png";

export const pagePoundersRoutes = [
  {
    path: "/pounders/",
    component: UnionPounders,
  },
];

export const pagePounders: PageLAF = {
  title: "Pounders",
  titleRoute: "/pounders",
  visible: true,
  planeX: 215,
  menuHeader,
  menuItems: [],
  forceShowMenu: false,
};
