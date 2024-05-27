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
  fees: {
    pending: number;
    collected: number;
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
  discountLiquidation: number;
  discountLoan: number;
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
};

export type Yield = {
  platform: string;
  pool: string;
  apy: number;
};
