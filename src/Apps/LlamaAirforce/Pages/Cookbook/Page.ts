import { Page } from "@LAF/Pages/Page";

import CookbookColors from "@LAF/Pages/Cookbook/Colors.vue";
import CookbookDashboard from "@LAF/Pages/Cookbook/Dashboard.vue";
import CookbookSocket from "@LAF/Pages/Cookbook/Socket.vue";

import CookbookAsyncValue from "@LAF/Pages/Cookbook/Framework/AsyncValue.vue";
import CookbookButton from "@LAF/Pages/Cookbook/Framework/Button.vue";
import CookbookButtonToggle from "@LAF/Pages/Cookbook/Framework/ButtonToggle.vue";
import CookbookCard from "@LAF/Pages/Cookbook/Framework/Card.vue";
import CookbookCardGraph from "@LAF/Pages/Cookbook/Framework/CardGraph.vue";
import CookbookDataTable from "@LAF/Pages/Cookbook/Framework/DataTable.vue";
import CookbookInputText from "@LAF/Pages/Cookbook/Framework/InputText.vue";
import CookbookInputNumber from "@LAF/Pages/Cookbook/Framework/InputNumber.vue";
import CookbookModal from "@LAF/Pages/Cookbook/Framework/Modal.vue";
import CookbookPagination from "@LAF/Pages/Cookbook/Framework/Pagination.vue";
import CookbookSelect from "@LAF/Pages/Cookbook/Framework/Select.vue";
import CookbookSlider from "@LAF/Pages/Cookbook/Framework/Slider.vue";
import CookbookSpinner from "@LAF/Pages/Cookbook/Framework/Spinner.vue";
import CookbookTabs from "@LAF/Pages/Cookbook/Framework/Tabs.vue";
import CookbookTooltip from "@LAF/Pages/Cookbook/Framework/Tooltip.vue";

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
      path: "/cookbook/socket",
      name: "socket",
      component: CookbookSocket,
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
      path: "/cookbook/graph-card",
      name: "graph-card",
      component: CookbookCardGraph,
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
      path: "/cookbook/select",
      name: "select",
      component: CookbookSelect,
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
    {
      path: "/cookbook/tooltip",
      name: "tooltip",
      component: CookbookTooltip,
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
      to: "/cookbook/socket",
      label: "Socket.IO",
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
          to: "/cookbook/graph-card",
          label: "CardGraph",
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
          to: "/cookbook/select",
          label: "Select",
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
        {
          to: "/cookbook/tooltip",
          label: "Tooltip",
        },
      ],
    },
  ],
};
