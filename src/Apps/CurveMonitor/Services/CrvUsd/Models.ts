export type Market = {
  name: string;
  address: string;
  factory: string;
  llamma: string;
  rate: number;
  borrowed: number;
  borrowable: number;
  collateral: number;
  collateralUsd: number;
  loans: number;
  collateral_token: {
    symbol: string;
    address: string;
  };
  stablecoin_token: {
    symbol: string;
    address: string;
  };
};

export type Snapshot = {
  timestamp: number;
  rate: number;
  nLoans: number;
  minted: number;
  redeemed: number;
  totalCollateral: number;
  totalCollateralUsd: number;
  totalStablecoin: number;
  totalDebt: number;
  priceAMM: number;
  priceOracle: number;
  borrowable: number;
};

export type MarketDecile = {
  debt: number;
  collateral: number;
  collateralUsd: number;
  stableCoin: number;
};

export type MarketState = MarketDecile & {
  index: number;
  user: string;
  N: number;
  health: number;
};

export type PoolStats = {
  address: string;
  name: string;
  tvl: number;
  normalizedReserves: [number, number];
  reservesUSD: [number, number];
  volumeUSD: number;
};

export type PoolPrice = {
  timestamp: number;
  [token: string]: number;
};

export type PriceHistogram = {
  x: number[];
  y: number[];
};

export type CrvUsdSupply = {
  timestamp: number;
  market: string;
  supply: number;
  borrowable: number;
};

export type Fees = {
  pending: number;
  collected: number;
};

export type FeesBreakdown = {
  market: string;
  crvUsdAdminFees: number;
  adminBorrowingFees: number;
  collateralAdminFeesUsd: number;
};

export type Keeper = {
  address: string;
  pool: string;
  pool_address: string;
  pair: {
    symbol: string;
    address: string;
  }[];
  active: boolean;
  total_debt: number;
  total_profit: number;
  tvl: number;
  volume: number;
};

export type Yield = {
  platform: string;
  pool: string;
  apy: number;
};

export type LiquidatorRevenue = {
  timestamp: number;
  amount: number;
  discount: number;
};
