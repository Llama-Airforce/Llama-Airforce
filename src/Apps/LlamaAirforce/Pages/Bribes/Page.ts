import { type PageLAF } from "@LAF/Pages/Page";

import BribesRounds from "@LAF/Pages/Bribes/Rounds/Rounds.page.vue";
import BribesOverview from "@LAF/Pages/Bribes/Overview/Overview.page.vue";
import FraxMatch from "@LAF/Pages/Bribes/FraxMatch/FraxMatch.page.vue";

import menuHeader from "@/Assets/Menu/votium.png";

export const pageBribesRoutes = [
  { path: "/votium", redirect: { name: "rounds-incentives" } },
  { path: "/votium/bribes/:round?", redirect: { name: "rounds-incentives" } },
  { path: "/bribes", redirect: { name: "rounds-incentives" } },
  {
    path: "/bribes/rounds/:platform?/:protocol?/:round?",
    name: "rounds",
    component: BribesRounds,
  },
  {
    path: "/bribes/overview/:platform?/:protocol?",
    name: "overview",
    component: BribesOverview,
  },
  {
    path: "/bribes/fraxmatch",
    name: "fraxmatch",
    component: FraxMatch,
  },

  { path: "/incentives", redirect: { name: "rounds-incentives" } },
  {
    path: "/incentives/rounds/:platform?/:protocol?/:round?",
    name: "rounds-incentives",
    component: BribesRounds,
  },
  {
    path: "/incentives/overview/:platform?/:protocol?",
    name: "overview-incentives",
    component: BribesOverview,
  },
  {
    path: "/incentives/fraxmatch",
    name: "fraxmatch-incentives",
    component: FraxMatch,
  },
];

export const pageBribes: PageLAF = {
  title: "Bribes",
  titleRoute: ["/incentives", "/bribes"],
  visible: true,
  planeX: 400,
  menuHeader,
  menuItems: [
    {
      to: "/incentives/rounds",
      icon: "far fa-chart-bar",
      label: "Rounds",
    },
    {
      to: "/incentives/overview",
      icon: "fas fa-file-alt",
      label: "Overview",
    },
    /*
     * {
     *   to: "/incentives/fraxmatch",
     *   icon: "fas fa-gift",
     *   label: "Frax Match",
     * },
     */
  ],
  forceShowMenu: false,
};
