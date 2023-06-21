export type PoolId = string;

export type Pool = {
  address: string;
  name: string;
  symbol: string;
  cumulateVolumeUsd: number;
  coins: string[];
};
