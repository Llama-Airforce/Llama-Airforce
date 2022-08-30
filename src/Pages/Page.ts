import { RouteRecordRaw } from "vue-router";

export type Page = {
  title: string;
  titleRoute: string;
  planeX: number;
  /*
   * menu: {
   *   label: string;
   *   icon: string;
   *   route: string;
   * }[];
   */
  routes: RouteRecordRaw[];
  menuHeader: string;
  menuItems: {
    icon?: string;
    label: string;
    to: string;
  }[];
};
