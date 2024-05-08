export type Market = {
  name: string;
  controller: string;
  vault: string;
  llamma: string;
  policy: string;
  oracle: string;
  rate: number;
  borrow_apy: number;
  lend_apy: number;
  n_loans: number;
  price_oracle: number;
  amm_price: number;
  total_debt: number;
  total_assets: number;
  total_debt_usd: number;
  total_assets_usd: number;
  minted: number;
  redeemed: number;
  minted_usd: number;
  redeemed_usd: number;
  collateral_balance: number;
  borrowed_balance: number;
  collateral_balance_usd: number;
  borrowed_balance_usd: number;
  collateral_token: {
    symbol: string;
    address: string;
  };
  borrowed_token: {
    symbol: string;
    address: string;
  };
};

export const tvl = (market?: Market) =>
  market ? market.total_assets_usd + market.collateral_balance_usd : 0;

export type MarketPair = { long?: Market; short?: Market };

export type Snapshot = {
  rate: number;
  borrowApy: number;
  lendApy: number;
  numLoans: number;
  priceOracle: number;
  ammPrice: number;
  totalDebt: number;
  totalAssets: number;
  minted: number;
  redeemed: number;
  collateralBalance: number;
  borrowedBalance: number;
  timestamp: number;
};

export type SoftLiqRatio = {
  timestamp: number;
  proportion: number;
};

export type LiqHistory = {
  timestamp: number;
  self_count: number;
  hard_count: number;
  self_value: number;
  hard_value: number;
  price: number;
};
