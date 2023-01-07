import { Page } from "@/Pages/Page";

import CookbookColors from "@/Pages/Cookbook/Colors.vue";
import CookbookDashboard from "@/Pages/Cookbook/Dashboard.vue";

import CookbookAsyncValue from "@/Pages/Cookbook/Framework/AsyncValue.vue";
import CookbookButton from "@/Pages/Cookbook/Framework/Button.vue";
import CookbookButtonToggle from "@/Pages/Cookbook/Framework/ButtonToggle.vue";
import CookbookCard from "@/Pages/Cookbook/Framework/Card.vue";
import CookbookDataTable from "@/Pages/Cookbook/Framework/DataTable.vue";
import CookbookInputText from "@/Pages/Cookbook/Framework/InputText.vue";
import CookbookInputNumber from "@/Pages/Cookbook/Framework/InputNumber.vue";
import CookbookModal from "@/Pages/Cookbook/Framework/Modal.vue";
import CookbookPagination from "@/Pages/Cookbook/Framework/Pagination.vue";
import CookbookSlider from "@/Pages/Cookbook/Framework/Slider.vue";
import CookbookSpinner from "@/Pages/Cookbook/Framework/Spinner.vue";
import CookbookTabs from "@/Pages/Cookbook/Framework/Tabs.vue";

export const pageCookbook: Page = {
  title: "Cookbook",
  titleRoute: "/cookbook",
  visible: false,
  planeX: 15,
  routes: [
    { path: "/cookbook", redirect: { name: "button" } },
    {
      path: "/cookbook/colors",
      name: "colors",
      component: CookbookColors,
    },
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
    {
      path: "/cookbook/input-text",
      name: "input-text",
      component: CookbookInputText,
    },
    {
      path: "/cookbook/input-number",
      name: "input-number",
      component: CookbookInputNumber,
    },
    {
      path: "/cookbook/modal",
      name: "modal",
      component: CookbookModal,
    },
    {
      path: "/cookbook/pagination",
      name: "pagination",
      component: CookbookPagination,
    },
    {
      path: "/cookbook/slider",
      name: "slider",
      component: CookbookSlider,
    },
    {
      path: "/cookbook/spinner",
      name: "spinner",
      component: CookbookSpinner,
    },
    {
      path: "/cookbook/tabs",
      name: "tabs",
      component: CookbookTabs,
    },
  ],
  menuHeader: "headers/cookbook.png",
  menuItems: [
    {
      to: "/cookbook/colors",
      label: "Colors",
    },
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
        {
          to: "/cookbook/input-text",
          label: "InputText",
        },
        {
          to: "/cookbook/input-number",
          label: "InputNumber",
        },
        {
          to: "/cookbook/modal",
          label: "Modal",
        },
        {
          to: "/cookbook/pagination",
          label: "Pagination",
        },
        {
          to: "/cookbook/slider",
          label: "Slider",
        },
        {
          to: "/cookbook/spinner",
          label: "Spinner",
        },
        {
          to: "/cookbook/tabs",
          label: "Tabs",
        },
      ],
    },
  ],
};
