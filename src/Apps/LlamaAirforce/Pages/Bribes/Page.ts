import type { Page } from "@LAF/Pages/Page";

import BribesRounds from "@LAF/Pages/Bribes/Rounds/Rounds.page.vue";
import BribesOverview from "@LAF/Pages/Bribes/Overview/Overview.page.vue";

import menuHeader from "@/Assets/Menu/votium.png";

import { ChartNoAxesColumn, BookOpen } from "lucide-vue-next";

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
];

export const pageBribes: Page = {
  title: "Bribes",
  titleRoute: ["/incentives", "/bribes"],
  visible: true,
  planeX: 410,
  menuHeader,
  items: [
    {
      to: "/incentives/rounds",
      label: "Rounds",
      icon: ChartNoAxesColumn,
    },
    {
      to: "/incentives/overview",
      label: "Overview",
      icon: BookOpen,
    },
  ],
  forceShowMenu: false,
};
