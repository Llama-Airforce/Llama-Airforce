import type { Market } from "./models";

export function tvl(market?: Market) {
  return market ? market.total_assets_usd + market.collateral_balance_usd : 0;
}
