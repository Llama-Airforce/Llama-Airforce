import { type PageLAF } from "@LAF/Pages/Page";

import Curve from "@LAF/Pages/Curve/Curve.vue";

export const pageCurve: PageLAF = {
  title: "Curve",
  titleRoute: "/curve",
  visible: true,
  planeX: 105,
  routes: [{ path: "/curve", component: Curve }],
  menuHeader: "headers/curve.png",
  menuItems: [],
};
