import Colors from "@CB/Recipes/ColorsRecipe.vue";
import Socket from "@CB/Recipes/SocketRecipe.vue";

import AsyncValue from "@CB/RecipesComponents/AsyncValueRecipe.vue";
import Breadcrumb from "@CB/RecipesComponents/BreadcrumbRecipe.vue";
import Button from "@CB/RecipesComponents/ButtonRecipe.vue";
import ButtonToggle from "@CB/RecipesComponents/ButtonToggleRecipe.vue";
import Card from "@CB/RecipesComponents/CardRecipe.vue";
import Checkbox from "@CB/RecipesComponents/CheckboxRecipe.vue";
import Table from "@CB/RecipesComponents/TableRecipe.vue";
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

export const routes = [
  { path: "/", redirect: { name: "colors" } },
  {
    path: "/colors",
    name: "colors",
    component: Colors,
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
    path: "/components/checkbox",
    name: "checkbox",
    component: Checkbox,
  },
  {
    path: "/components/data-table",
    name: "data-table",
    component: Table,
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
