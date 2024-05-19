import { type MenuLeaf, type MenuNode } from "@/Framework/Monitor/Menu";

export type Page = {
  titleRoute: string | string[];
  menuItems: (MenuNode | MenuLeaf)[];
};
