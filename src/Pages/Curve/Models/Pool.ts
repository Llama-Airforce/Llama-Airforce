export type PoolId = string;

export default class Pool {
  id: PoolId;
  name: string;
  symbol: string;
  cumulateVolumeUsd: number;
  coins: string[];
}
