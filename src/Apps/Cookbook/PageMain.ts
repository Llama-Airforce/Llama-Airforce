import { type Page } from "@/Framework/Monitor/Page";

import Colors from "@CB/Recipes/ColorsRecipe.vue";
import Dashboard from "@CB/Recipes/DashboardRecipe.vue";
import Socket from "@CB/Recipes/SocketRecipe.vue";

import AsyncValue from "@CB/Recipes/AsyncValueRecipe.vue";
import Breadcrumb from "@CB/Recipes/BreadcrumbRecipe.vue";
import Button from "@CB/Recipes/ButtonRecipe.vue";
import ButtonToggle from "@CB/Recipes/ButtonToggleRecipe.vue";
import Card from "@CB/Recipes/CardRecipe.vue";
import CardChart from "@CB/Recipes/CardChartRecipe.vue";
import Checkbox from "@CB/Recipes/CheckboxRecipe.vue";
import DataTable from "@CB/Recipes/DataTableRecipe.vue";
import InputText from "@CB/Recipes/InputTextRecipe.vue";
import InputNumber from "@CB/Recipes/InputNumberRecipe.vue";
import Modal from "@CB/Recipes/ModalRecipe.vue";
import Pagination from "@CB/Recipes/PaginationRecipe.vue";
import Select from "@CB/Recipes/SelectRecipe.vue";
import Slider from "@CB/Recipes/SliderRecipe.vue";
import Spinner from "@CB/Recipes/SpinnerRecipe.vue";
import Tabs from "@CB/Recipes/TabsRecipe.vue";
import Tooltip from "@CB/Recipes/TooltipRecipe.vue";

export const pageMainRoutes = [
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
    path: "/card-chart",
    name: "card-chart",
    component: CardChart,
  },
  {
    path: "/checkbox",
    name: "checkbox",
    component: Checkbox,
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
];

export const pageMain: Page = {
  titleRoute: "/",
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
          to: "/card-chart",
          label: "CardChart",
        },
        {
          to: "/checkbox",
          label: "Checkbox",
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
