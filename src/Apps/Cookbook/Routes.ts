import type { RouteRecordRaw } from "vue-router";
declare module "vue-router" {
  interface RouteMeta {
    crumbs?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", redirect: { name: "colors" } },
  {
    path: "/colors",
    name: "colors",
    component: () => import("@CB/Recipes/ColorsRecipe.vue"),
  },
  {
    path: "/socket",
    component: () => import("@CB/Recipes/SocketRecipe.vue"),
  },
  {
    path: "/components",
    children: [
      {
        path: "async-value",
        component: () => import("@CB/RecipesComponents/AsyncValueRecipe.vue"),
      },
      {
        path: "blockie",
        component: () => import("@CB/RecipesComponents/BlockieRecipe.vue"),
      },
      {
        path: "breadcrumb",
        component: () => import("@CB/RecipesComponents/BreadcrumbRecipe.vue"),
      },
      {
        path: "button",
        component: () => import("@CB/RecipesComponents/ButtonRecipe.vue"),
      },
      {
        path: "toggle-button",
        component: () => import("@CB/RecipesComponents/ButtonToggleRecipe.vue"),
      },
      {
        path: "card",
        component: () => import("@CB/RecipesComponents/CardRecipe.vue"),
      },
      {
        path: "chart-tv",
        component: () => import("@CB/RecipesComponents/ChartTVRecipe.vue"),
      },
      {
        path: "checkbox",
        component: () => import("@CB/RecipesComponents/CheckboxRecipe.vue"),
      },
      {
        path: "table",
        component: () => import("@CB/RecipesComponents/TableRecipe.vue"),
      },
      {
        path: "input-address",
        component: () => import("@CB/RecipesComponents/InputAddressRecipe.vue"),
      },
      {
        path: "input-text",
        component: () => import("@CB/RecipesComponents/InputTextRecipe.vue"),
      },
      {
        path: "input-number",
        component: () => import("@CB/RecipesComponents/InputNumberRecipe.vue"),
      },
      {
        path: "legend",
        component: () => import("@CB/RecipesComponents/LegendRecipe.vue"),
      },
      {
        path: "modal",
        component: () => import("@CB/RecipesComponents/ModalRecipe.vue"),
      },
      {
        path: "pagination",
        component: () => import("@CB/RecipesComponents/PaginationRecipe.vue"),
      },
      {
        path: "radio-button",
        component: () => import("@CB/RecipesComponents/RadioButtonRecipe.vue"),
      },
      {
        path: "select",
        component: () => import("@CB/RecipesComponents/SelectRecipe.vue"),
      },
      {
        path: "slider",
        component: () => import("@CB/RecipesComponents/SliderRecipe.vue"),
      },
      {
        path: "spinner",
        component: () => import("@CB/RecipesComponents/SpinnerRecipe.vue"),
      },
      {
        path: "swagger",
        component: () => import("@CB/RecipesComponents/SwaggerRecipe.vue"),
      },
      {
        path: "tabs",
        component: () => import("@CB/RecipesComponents/TabsRecipe.vue"),
      },
      {
        path: "tooltip",
        component: () => import("@CB/RecipesComponents/TooltipRecipe.vue"),
      },
    ],
  },
  {
    path: "/composables",
    children: [
      {
        path: "use-approve",
        component: () => import("@CB/RecipesComposables/UseApproveRecipe.vue"),
      },
    ],
  },
];
