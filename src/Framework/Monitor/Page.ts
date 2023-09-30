import { type RouteRecordRaw } from "vue-router";
import { type MenuLeaf, type MenuNode } from "@/Framework/Monitor";

export type Page = {
  titleRoute: string;
  routes: RouteRecordRaw[];
  menuItems: (MenuNode | MenuLeaf)[];
};
