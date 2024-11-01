import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

import Colors from "@CB/Recipes/ColorsRecipe.vue";
import Socket from "@CB/Recipes/SocketRecipe.vue";

import AsyncValue from "@CB/RecipesComponents/AsyncValueRecipe.vue";
import Blockie from "@CB/RecipesComponents/BlockieRecipe.vue";
import Breadcrumb from "@CB/RecipesComponents/BreadcrumbRecipe.vue";
import Button from "@CB/RecipesComponents/ButtonRecipe.vue";
import ButtonToggle from "@CB/RecipesComponents/ButtonToggleRecipe.vue";
import Card from "@CB/RecipesComponents/CardRecipe.vue";
import ChartTV from "@CB/RecipesComponents/ChartTVRecipe.vue";
import Checkbox from "@CB/RecipesComponents/CheckboxRecipe.vue";
import Table from "@CB/RecipesComponents/TableRecipe.vue";
import InputAddress from "@CB/RecipesComponents/InputAddressRecipe.vue";
import InputText from "@CB/RecipesComponents/InputTextRecipe.vue";
import InputNumber from "@CB/RecipesComponents/InputNumberRecipe.vue";
import Legend from "@CB/RecipesComponents/LegendRecipe.vue";
import Modal from "@CB/RecipesComponents/ModalRecipe.vue";
import Pagination from "@CB/RecipesComponents/PaginationRecipe.vue";
import RadioButton from "@CB/RecipesComponents/RadioButtonRecipe.vue";
import Select from "@CB/RecipesComponents/SelectRecipe.vue";
import Slider from "@CB/RecipesComponents/SliderRecipe.vue";
import Spinner from "@CB/RecipesComponents/SpinnerRecipe.vue";
import Tabs from "@CB/RecipesComponents/TabsRecipe.vue";
import Tooltip from "@CB/RecipesComponents/TooltipRecipe.vue";

import UseApprove from "@CB/RecipesComposables/UseApproveRecipe.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "colors" } },
  {
    path: "/colors",
    name: "colors",
    component: Colors,
  },
  {
    path: "/socket",
    component: Socket,
  },
  {
    path: "/components",
    children: [
      {
        path: "async-value",
        component: AsyncValue,
      },
      {
        path: "blockie",
        component: Blockie,
      },
      {
        path: "breadcrumb",
        component: Breadcrumb,
      },
      {
        path: "button",
        component: Button,
      },
      {
        path: "toggle-button",
        component: ButtonToggle,
      },
      {
        path: "card",
        component: Card,
      },
      {
        path: "chart-tv",
        component: ChartTV,
      },
      {
        path: "checkbox",
        component: Checkbox,
      },
      {
        path: "data-table",
        component: Table,
      },
      {
        path: "input-address",
        component: InputAddress,
      },
      {
        path: "input-text",
        component: InputText,
      },
      {
        path: "input-number",
        component: InputNumber,
      },
      {
        path: "legend",
        component: Legend,
      },
      {
        path: "modal",
        component: Modal,
      },
      {
        path: "pagination",
        component: Pagination,
      },
      {
        path: "radio-button",
        component: RadioButton,
      },
      {
        path: "select",
        component: Select,
      },
      {
        path: "slider",
        component: Slider,
      },
      {
        path: "spinner",
        component: Spinner,
      },
      {
        path: "tabs",
        component: Tabs,
      },
      {
        path: "tooltip",
        component: Tooltip,
      },
    ],
  },
  {
    path: "/composables",
    children: [
      {
        path: "use-approve",
        component: UseApprove,
      },
    ],
  },
];
