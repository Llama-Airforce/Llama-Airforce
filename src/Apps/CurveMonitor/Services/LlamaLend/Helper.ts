import { type Market } from "@CM/Services/LlamaLend/Models";

export function tvl(market?: Market) {
  return market ? market.total_assets_usd + market.collateral_balance_usd : 0;
}
