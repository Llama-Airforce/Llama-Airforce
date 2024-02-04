export type Tag = "beta";

export type MenuItem = {
  label: string;
  tag?: Tag;
  icon?: string;
};

export type MenuNode = MenuItem & {
  children: MenuLeaf[]; // We don't allow infinite nesting for now.
};

export type MenuLeaf = MenuItem & {
  to: string;
};

export function isNode(menuItem: MenuItem): menuItem is MenuNode {
  return (menuItem as MenuNode)?.children !== undefined;
}

export function isLeaf(menuItem: MenuItem): menuItem is MenuLeaf {
  return (menuItem as MenuLeaf)?.to !== undefined;
}
