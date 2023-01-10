export type PoolId = string;

export type Pool = {
  id: PoolId;
  name: string;
  symbol: string;
  cumulateVolumeUsd: number;
  coins: string[];
};
