import { Page } from "@/Pages/Page";

import BribesRounds from "@/Pages/Bribes/Rounds/Rounds.vue";
import BribesOverview from "@/Pages/Bribes/Overview/Overview.vue";
import FraxMatch from "@/Pages/Bribes/FraxMatch/FraxMatch.vue";

export const pageBribes: Page = {
  title: "Bribes",
  titleRoute: "/bribes",
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
  ],
  menuHeader: "headers/votium.png",
  menuItems: [
    {
      to: "/bribes/overview",
      icon: "fas fa-file-alt",
      label: "Overview",
    },
    {
      to: "/bribes/rounds",
      icon: "far fa-chart-bar",
      label: "Rounds",
    },
    {
      to: "/bribes/fraxmatch",
      icon: "fas fa-gift",
      label: "Frax Match",
    },
  ],
};
