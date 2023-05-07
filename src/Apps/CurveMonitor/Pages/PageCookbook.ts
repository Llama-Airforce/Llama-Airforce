import { Page } from "@CM/Pages/Page";

import Colors from "@/Framework/Cookbook/Colors.vue";
import Dashboard from "@/Framework/Cookbook/Dashboard.vue";
import Socket from "@/Framework/Cookbook/Socket.vue";

import AsyncValue from "@/Framework/Cookbook/AsyncValue.vue";
import Button from "@/Framework/Cookbook/Button.vue";
import ButtonToggle from "@/Framework/Cookbook/ButtonToggle.vue";
import Card from "@/Framework/Cookbook/Card.vue";
import CardGraph from "@/Framework/Cookbook/CardGraph.vue";
import DataTable from "@/Framework/Cookbook/DataTable.vue";
import InputText from "@/Framework/Cookbook/InputText.vue";
import InputNumber from "@/Framework/Cookbook/InputNumber.vue";
import Modal from "@/Framework/Cookbook/Modal.vue";
import Pagination from "@/Framework/Cookbook/Pagination.vue";
import Select from "@/Framework/Cookbook/Select.vue";
import Slider from "@/Framework/Cookbook/Slider.vue";
import Spinner from "@/Framework/Cookbook/Spinner.vue";
import Tabs from "@/Framework/Cookbook/Tabs.vue";
import Tooltip from "@/Framework/Cookbook/Tooltip.vue";

export const pageCookbook: Page = {
  titleRoute: "/cookbook",
  routes: [
    { path: "/cookbook", redirect: { name: "button" } },
    {
      path: "/cookbook/colors",
      name: "colors",
      component: Colors,
    },
    {
      path: "/cookbook/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/cookbook/socket",
      name: "socket",
      component: Socket,
    },
    {
      path: "/cookbook/async-value",
      name: "async-value",
      component: AsyncValue,
    },
    {
      path: "/cookbook/button",
      name: "button",
      component: Button,
    },
    {
      path: "/cookbook/toggle-button",
      name: "toggle-button",
      component: ButtonToggle,
    },
    {
      path: "/cookbook/card",
      name: "card",
      component: Card,
    },
    {
      path: "/cookbook/graph-card",
      name: "graph-card",
      component: CardGraph,
    },
    {
      path: "/cookbook/data-table",
      name: "data-table",
      component: DataTable,
    },
    {
      path: "/cookbook/input-text",
      name: "input-text",
      component: InputText,
    },
    {
      path: "/cookbook/input-number",
      name: "input-number",
      component: InputNumber,
    },
    {
      path: "/cookbook/modal",
      name: "modal",
      component: Modal,
    },
    {
      path: "/cookbook/pagination",
      name: "pagination",
      component: Pagination,
    },
    {
      path: "/cookbook/select",
      name: "select",
      component: Select,
    },
    {
      path: "/cookbook/slider",
      name: "slider",
      component: Slider,
    },
    {
      path: "/cookbook/spinner",
      name: "spinner",
      component: Spinner,
    },
    {
      path: "/cookbook/tabs",
      name: "tabs",
      component: Tabs,
    },
    {
      path: "/cookbook/tooltip",
      name: "tooltip",
      component: Tooltip,
    },
  ],
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
