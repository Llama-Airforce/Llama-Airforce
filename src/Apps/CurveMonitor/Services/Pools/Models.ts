type Coin = {
  poolIndex: number;
  symbol: string;
  address: string;
};

export type PoolsTotals = {
  tvl: number;
  tradingVolume24h: number;
  tradingFee24h: number;
  liquidityVolume24h: number;
  liquidityFee24h: number;
};

export type Pool = {
  name: string;
  address: string;
  numCoins: number;
  tvlUsd: number;
  tradingVolume24h: number;
  tradingFee24h: number;
  liquidityVolume24h: number;
  liquidityFee24h: number;
  coins: Coin[];
  baseDailyApr: number;
  baseWeeklyApr: number;
  virtualPrice: number;
  poolMethods: string[];
};

export type Volume = {
  timestamp: number;
  volume: number;
  fees: number;
};

export type Tvl = {
  timestamp: number;
  tvlUSD: number;
  balances: number[];
};
