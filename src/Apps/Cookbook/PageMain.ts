import { type Page } from "@/Framework/Monitor/Page";

import Colors from "@CB/Recipes/ColorsRecipe.vue";
import Dashboard from "@CB/Recipes/DashboardRecipe.vue";
import Socket from "@CB/Recipes/SocketRecipe.vue";

import AsyncValue from "@CB/RecipesComponents/AsyncValueRecipe.vue";
import Breadcrumb from "@CB/RecipesComponents/BreadcrumbRecipe.vue";
import Button from "@CB/RecipesComponents/ButtonRecipe.vue";
import ButtonToggle from "@CB/RecipesComponents/ButtonToggleRecipe.vue";
import Card from "@CB/RecipesComponents/CardRecipe.vue";
import CardChart from "@CB/RecipesComponents/CardChartRecipe.vue";
import Checkbox from "@CB/RecipesComponents/CheckboxRecipe.vue";
import DataTable from "@CB/RecipesComponents/DataTableRecipe.vue";
import InputText from "@CB/RecipesComponents/InputTextRecipe.vue";
import InputNumber from "@CB/RecipesComponents/InputNumberRecipe.vue";
import Modal from "@CB/RecipesComponents/ModalRecipe.vue";
import Pagination from "@CB/RecipesComponents/PaginationRecipe.vue";
import RadioButton from "@CB/RecipesComponents/RadioButtonRecipe.vue";
import Select from "@CB/RecipesComponents/SelectRecipe.vue";
import Slider from "@CB/RecipesComponents/SliderRecipe.vue";
import Spinner from "@CB/RecipesComponents/SpinnerRecipe.vue";
import Tabs from "@CB/RecipesComponents/TabsRecipe.vue";
import Tooltip from "@CB/RecipesComponents/TooltipRecipe.vue";

import UseApprove from "@CB/RecipesComposables/UseApproveRecipe.vue";

export const pageMainRoutes = [
  { path: "/", redirect: { name: "colors" } },
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

  // Components
  {
    path: "/components/async-value",
    name: "async-value",
    component: AsyncValue,
  },
  {
    path: "/components/breadcrumb",
    name: "breadcrumb",
    component: Breadcrumb,
  },
  {
    path: "/components/button",
    name: "button",
    component: Button,
  },
  {
    path: "/components/toggle-button",
    name: "toggle-button",
    component: ButtonToggle,
  },
  {
    path: "/components/card",
    name: "card",
    component: Card,
  },
  {
    path: "/components/card-chart",
    name: "card-chart",
    component: CardChart,
  },
  {
    path: "/components/checkbox",
    name: "checkbox",
    component: Checkbox,
  },
  {
    path: "/components/data-table",
    name: "data-table",
    component: DataTable,
  },
  {
    path: "/components/input-text",
    name: "input-text",
    component: InputText,
  },
  {
    path: "/components/input-number",
    name: "input-number",
    component: InputNumber,
  },
  {
    path: "/components/modal",
    name: "modal",
    component: Modal,
  },
  {
    path: "/components/pagination",
    name: "pagination",
    component: Pagination,
  },
  {
    path: "/components/radio-button",
    name: "radio-button",
    component: RadioButton,
  },
  {
    path: "/components/select",
    name: "select",
    component: Select,
  },
  {
    path: "/components/slider",
    name: "slider",
    component: Slider,
  },
  {
    path: "/components/spinner",
    name: "spinner",
    component: Spinner,
  },
  {
    path: "/components/tabs",
    name: "tabs",
    component: Tabs,
  },
  {
    path: "/components/tooltip",
    name: "tooltip",
    component: Tooltip,
  },

  // Composables
  {
    path: "/composables/use-approve",
    name: "use-approve",
    component: UseApprove,
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
      label: "Components",
      initCollapsed: true,
      children: [
        {
          to: "/components/async-value",
          label: "AsyncValue",
        },
        {
          to: "/components/breadcrumb",
          label: "Breadcrumb",
        },
        {
          to: "/components/button",
          label: "Button",
        },
        {
          to: "/components/toggle-button",
          label: "ButtonToggle",
        },
        {
          to: "/components/card",
          label: "Card",
        },
        {
          to: "/components/card-chart",
          label: "CardChart",
        },
        {
          to: "/components/checkbox",
          label: "Checkbox",
        },
        {
          to: "/components/data-table",
          label: "DataTable",
        },
        {
          to: "/components/input-text",
          label: "InputText",
        },
        {
          to: "/components/input-number",
          label: "InputNumber",
        },
        {
          to: "/components/modal",
          label: "Modal",
        },
        {
          to: "/components/pagination",
          label: "Pagination",
        },
        {
          to: "/components/radio-button",
          label: "RadioButton",
        },
        {
          to: "/components/select",
          label: "Select",
        },
        {
          to: "/components/slider",
          label: "Slider",
        },
        {
          to: "/components/spinner",
          label: "Spinner",
        },
        {
          to: "/components/tabs",
          label: "Tabs",
        },
        {
          to: "/components/tooltip",
          label: "Tooltip",
        },
      ],
    },
    {
      label: "Composables",
      initCollapsed: true,
      children: [
        {
          to: "/composables/use-approve",
          label: "useApprove",
        },
      ],
    },
  ],
};
