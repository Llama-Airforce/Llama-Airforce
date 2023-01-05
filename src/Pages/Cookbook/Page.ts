import { Page } from "@/Pages/Page";

import CookbookDashboard from "@/Pages/Cookbook/Dashboard.vue";

import CookbookAsyncValue from "@/Pages/Cookbook/Framework/AsyncValue.vue";
import CookbookButton from "@/Pages/Cookbook/Framework/Button.vue";
import CookbookButtonToggle from "@/Pages/Cookbook/Framework/ButtonToggle.vue";
import CookbookCard from "@/Pages/Cookbook/Framework/Card.vue";
import CookbookDataTable from "@/Pages/Cookbook/Framework/DataTable.vue";

export const pageCookbook: Page = {
  title: "Cookbook",
  titleRoute: "/cookbook",
  visible: false,
  planeX: 15,
  routes: [
    { path: "/cookbook", redirect: { name: "button" } },
    {
      path: "/cookbook/dashboard",
      name: "dashboard",
      component: CookbookDashboard,
    },
    {
      path: "/cookbook/async-value",
      name: "async-value",
      component: CookbookAsyncValue,
    },
    {
      path: "/cookbook/button",
      name: "button",
      component: CookbookButton,
    },
    {
      path: "/cookbook/toggle-button",
      name: "toggle-button",
      component: CookbookButtonToggle,
    },
    {
      path: "/cookbook/card",
      name: "card",
      component: CookbookCard,
    },
    {
      path: "/cookbook/data-table",
      name: "data-table",
      component: CookbookDataTable,
    },
  ],
  menuHeader: "headers/cookbook.png",
  menuItems: [
    {
      to: "/cookbook/dashboard",
      label: "Dashboard",
    },
    {
      icon: "fas fa-toolbox",
      label: "Framework",
      children: [
        {
          to: "/cookbook/async-value",
          label: "AsyncValue",
        },
        {
          to: "/cookbook/button",
          label: "Button",
        },
        {
          to: "/cookbook/toggle-button",
          label: "ButtonToggle",
        },
        {
          to: "/cookbook/card",
          label: "Card",
        },
        {
          to: "/cookbook/data-table",
          label: "DataTable",
        },
      ],
    },
  ],
};
