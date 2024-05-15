import type { Chain } from "@CM/Models/Chain";

export type Liquidity = {
  pool: string;
  chain: Chain;
  name: string;
  liq_use: number;
};

export type Trade = {
  pool: string;
  chain: Chain;
  name: string;
  tx: string;
  value: number;
};

export type TvlGrower = {
  pool: string;
  chain: Chain;
  name: string;
  tvl_growth: number;
};

export type TvlBreakdownType = {
  type: string;
  tvl: number;
};

export type TvlBreakdownChain = {
  chain: Chain;
  tvl: number;
};

export type VolumeBreakdownType = {
  type: string;
  volumeUSD: number;
};

export type VolumeBreakdownChain = {
  chain: Chain;
  volumeUSD: number;
};
