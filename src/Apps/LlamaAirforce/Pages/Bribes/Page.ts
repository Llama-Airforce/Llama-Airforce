import { type Page } from "@LAF/Pages/Page";

import BribesRounds from "@LAF/Pages/Bribes/Rounds/Rounds.vue";
import BribesOverview from "@LAF/Pages/Bribes/Overview/Overview.vue";
import FraxMatch from "@LAF/Pages/Bribes/FraxMatch/FraxMatch.vue";

export const pageBribes: Page = {
  title: "Bribes",
  titleRoute: ["/incentives", "/bribes"],
  visible: true,
  planeX: 420,
  routes: [
    { path: "/votium", redirect: { name: "rounds" } },
    { path: "/votium/bribes/:round?", redirect: { name: "rounds" } },
    { path: "/bribes", redirect: { name: "rounds" } },
    {
      path: "/bribes/rounds/:platform?/:protocol?/:round?",
      name: "rounds",
      component: BribesRounds,
      alias: ["/incentives/"],
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
      alias: ["/incentives/"],
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
  ],
  menuHeader: "headers/votium.png",
  menuItems: [
    {
      to: "/incentives/overview",
      icon: "fas fa-file-alt",
      label: "Overview",
    },
    {
      to: "/incentives/rounds",
      icon: "far fa-chart-bar",
      label: "Rounds",
    },
    {
      to: "/incentives/fraxmatch",
      icon: "fas fa-gift",
      label: "Frax Match",
    },
  ],
};
