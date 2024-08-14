export type Tag = "alpha" | "beta";

export type MenuItem = {
  label: string | (() => string);
  tag?: Tag;
  icon?: string;
};

export type MenuNode = MenuItem & {
  children: MenuLeaf[]; // We don't allow infinite nesting for now.
  initCollapsed?: boolean;
};

export type MenuLeaf = MenuItem & {
  to: string;
};

export type MenuExternal = MenuItem & {
  url: string;
};

export function isNode(menuItem: MenuItem): menuItem is MenuNode {
  return !!(menuItem as MenuNode).children;
}

export function isLeaf(menuItem: MenuItem): menuItem is MenuLeaf {
  return !!(menuItem as MenuLeaf).to;
}

export function isExternal(menuItem: MenuItem): menuItem is MenuExternal {
  return !!(menuItem as MenuExternal).url;
}
