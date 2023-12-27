import { type Page } from "@/Framework/Monitor";

import Colors from "@CB/Recipes/Colors.vue";
import Dashboard from "@CB/Recipes/Dashboard.vue";
import Socket from "@CB/Recipes/Socket.vue";

import AsyncValue from "@CB/Recipes/AsyncValue.vue";
import Breadcrumb from "@CB/Recipes/Breadcrumb.vue";
import Button from "@CB/Recipes/Button.vue";
import ButtonToggle from "@CB/Recipes/ButtonToggle.vue";
import Card from "@CB/Recipes/Card.vue";
import CardGraph from "@CB/Recipes/CardGraph.vue";
import DataTable from "@CB/Recipes/DataTable.vue";
import InputText from "@CB/Recipes/InputText.vue";
import InputNumber from "@CB/Recipes/InputNumber.vue";
import Modal from "@CB/Recipes/Modal.vue";
import Pagination from "@CB/Recipes/Pagination.vue";
import Select from "@CB/Recipes/Select.vue";
import Slider from "@CB/Recipes/Slider.vue";
import Spinner from "@CB/Recipes/Spinner.vue";
import Tabs from "@CB/Recipes/Tabs.vue";
import Tooltip from "@CB/Recipes/Tooltip.vue";

export const pageMain: Page = {
  titleRoute: "/",
  routes: [
    { path: "/", redirect: { name: "button" } },
    {
      path: "/colors",
      name: "colors",
      component: Colors,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/socket",
      name: "socket",
      component: Socket,
    },
    {
      path: "/async-value",
      name: "async-value",
      component: AsyncValue,
    },
    {
      path: "/breadcrumb",
      name: "breadcrumb",
      component: Breadcrumb,
    },
    {
      path: "/button",
      name: "button",
      component: Button,
    },
    {
      path: "/toggle-button",
      name: "toggle-button",
      component: ButtonToggle,
    },
    {
      path: "/card",
      name: "card",
      component: Card,
    },
    {
      path: "/graph-card",
      name: "graph-card",
      component: CardGraph,
    },
    {
      path: "/data-table",
      name: "data-table",
      component: DataTable,
    },
    {
      path: "/input-text",
      name: "input-text",
      component: InputText,
    },
    {
      path: "/input-number",
      name: "input-number",
      component: InputNumber,
    },
    {
      path: "/modal",
      name: "modal",
      component: Modal,
    },
    {
      path: "/pagination",
      name: "pagination",
      component: Pagination,
    },
    {
      path: "/select",
      name: "select",
      component: Select,
    },
    {
      path: "/slider",
      name: "slider",
      component: Slider,
    },
    {
      path: "/spinner",
      name: "spinner",
      component: Spinner,
    },
    {
      path: "/tabs",
      name: "tabs",
      component: Tabs,
    },
    {
      path: "/tooltip",
      name: "tooltip",
      component: Tooltip,
    },
  ],
  menuItems: [
    {
      to: "/colors",
      label: "Colors",
    },
    {
      to: "/dashboard",
      label: "Dashboard",
    },
    {
      to: "/socket",
      label: "Socket.IO",
    },
    {
      label: "Framework",
      children: [
        {
          to: "/async-value",
          label: "AsyncValue",
        },
        {
          to: "/breadcrumb",
          label: "Breadcrumb",
        },
        {
          to: "/button",
          label: "Button",
        },
        {
          to: "/toggle-button",
          label: "ButtonToggle",
        },
        {
          to: "/card",
          label: "Card",
        },
        {
          to: "/graph-card",
          label: "CardGraph",
        },
        {
          to: "/data-table",
          label: "DataTable",
        },
        {
          to: "/input-text",
          label: "InputText",
        },
        {
          to: "/input-number",
          label: "InputNumber",
        },
        {
          to: "/modal",
          label: "Modal",
        },
        {
          to: "/pagination",
          label: "Pagination",
        },
        {
          to: "/select",
          label: "Select",
        },
        {
          to: "/slider",
          label: "Slider",
        },
        {
          to: "/spinner",
          label: "Spinner",
        },
        {
          to: "/tabs",
          label: "Tabs",
        },
        {
          to: "/tooltip",
          label: "Tooltip",
        },
      ],
    },
  ],
};
