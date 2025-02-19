import type { Page } from "@LAF/Pages/Page";

import menuHeader from "@/Assets/Menu/votium.png";

import { ChartNoAxesColumn, BookOpen } from "lucide-vue-next";

export const pageBribesRoutes = [
  { path: "/votium", redirect: { name: "rounds-incentives" } },
  { path: "/votium/bribes/:round?", redirect: { name: "rounds-incentives" } },
  { path: "/bribes", redirect: { name: "rounds-incentives" } },
  {
    path: "/bribes/rounds/:platform?/:protocol?/:round?",
    name: "rounds",
    component: () => import("@LAF/Pages/Bribes/Rounds/Rounds.page.vue"),
  },
  {
    path: "/bribes/overview/:platform?/:protocol?",
    name: "overview",
    component: () => import("@LAF/Pages/Bribes/Overview/Overview.page.vue"),
  },

  { path: "/incentives", redirect: { name: "rounds-incentives" } },
  {
    path: "/incentives/rounds/:platform?/:protocol?/:round?",
    name: "rounds-incentives",
    component: () => import("@LAF/Pages/Bribes/Rounds/Rounds.page.vue"),
  },
  {
    path: "/incentives/overview/:platform?/:protocol?",
    name: "overview-incentives",
    component: () => import("@LAF/Pages/Bribes/Overview/Overview.page.vue"),
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
