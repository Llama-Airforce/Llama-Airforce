import type { Component } from "vue";
import type { Menu } from "@/Framework/Monitor/Shell/Menu";

export type Page = Menu & {
  title: string;
  visible: boolean;
  planeX: number;
  menuHeader: string;
  items: (MenuNode | MenuLeaf)[];
  forceShowMenu: boolean;
};

export type MenuItem = {
  icon?: Component;
  label: string;
};

export type MenuNode = MenuItem & {
  children: MenuLeaf[]; // We don't allow infinite nesting for now.
};

export type MenuLeaf = MenuItem & {
  to: string;
};

export function isNode(menuItem: MenuItem): menuItem is MenuNode {
  return Array.isArray((menuItem as MenuNode).children);
}

export function isLeaf(menuItem: MenuItem): menuItem is MenuLeaf {
  return typeof (menuItem as MenuLeaf).to === "string";
}
