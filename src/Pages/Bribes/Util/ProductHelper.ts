import type { Product } from "@/Pages/Bribes/Models/Product";

export function equals(x: Product, y: Product): boolean {
  return x.platform === y.platform && x.protocol === y.protocol;
}
