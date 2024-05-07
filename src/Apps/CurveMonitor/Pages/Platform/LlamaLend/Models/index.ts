export type Market = {
  name: string;
  controller: string;
  numLoans: number;
  borrowRate: number;
  lendRate: number;
  priceOracle: number;
  totalAssets: number;
  collateralBalance: number;
};

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
