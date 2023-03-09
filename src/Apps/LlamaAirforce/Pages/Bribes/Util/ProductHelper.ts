import type { Product } from "@LAF/Pages/Bribes/Models";

export function equals(x: Product, y: Product): boolean {
  return x.platform === y.platform && x.protocol === y.protocol;
}
