import type { Page } from "@LAF/Pages/Page";

import menuHeader from "@/Assets/Menu/union.png";

export const pagePoundersRoutes = [
  {
    path: "/pounders/",
    component: () => import("@Pounders/Pounders.page.vue"),
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
