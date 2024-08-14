import type {
  MenuNode,
  MenuLeaf,
  MenuExternal,
} from "@/Framework/Monitor/Menu";

export type Page = {
  titleRoute: string | string[];
  menuItems: (MenuNode | MenuLeaf | MenuExternal)[];
};
