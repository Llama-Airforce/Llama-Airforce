import type { Page } from "@LAF/Pages/Page";

import UnionPounders from "@Pounders/Pounders.page.vue";

import menuHeader from "@/Assets/Menu/union.png";

export const pagePoundersRoutes = [
  {
    path: "/pounders/",
    component: UnionPounders,
  },
];

export const pagePounders: Page = {
  title: "Pounders",
  titleRoute: "/pounders",
  visible: true,
  planeX: 270,
  menuHeader,
  items: [],
  forceShowMenu: false,
};
