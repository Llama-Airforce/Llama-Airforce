export type PoolId = string;

export type Pool = {
  address: string;
  name: string;
  symbol: string;
  cumulativeVolumeUSD: number;
  coins: string[];
};
