import { type Swap } from "./Swap";
import { type Zap } from "./Zap";

export * from "./Airdrop";
export * from "./Distributor";
export * from "./Fees";
export * from "./Pounder";
export * from "./PounderState";
export * from "./Swap";
export * from "./Zap";

export function isZap(item: Zap | Swap): item is Zap {
  return (item as Zap).zap !== undefined;
}

export function isSwap(item: Zap | Swap): item is Swap {
  return (item as Swap).buy !== undefined && (item as Swap).sell !== undefined;
}
