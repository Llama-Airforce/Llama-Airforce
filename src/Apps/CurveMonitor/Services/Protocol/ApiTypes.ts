import type { Chain } from "@CM/Models/Chain";

export type GetLiquidityTopResponse = {
  liquidity_use: {
    pool: string;
    chain: Chain;
    name: string;
    liq_use: number;
  }[];
};

export type GetTradesLargeResponse = {
  large_trades: {
    pool: string;
    chain: Chain;
    name: string;
    tx: string;
    value: number;
  }[];
};

type TvlGrowth = {
  pool: string;
  chain: Chain;
  name: string;
  tvl_growth: number;
};

export type GetTvlGainersResponse = {
  tvl_gainers: TvlGrowth[];
};

export type GetTvlLosersResponse = {
  tvl_losers: TvlGrowth[];
};

export type GetTvlBreakdownTypeResponse = {
  tvl_breakdown_type: {
    type: string;
    tvl: number;
  }[];
};

export type GetTvlBreakdownChainResponse = {
  tvl_breakdown_chain: {
    chain: Chain;
    tvl: number;
  }[];
};

export type GetVolumeBreakdownTypeResponse = {
  volume_breakdown_type: {
    type: string;
    volumeUSD: number;
  }[];
};

export type GetVolumeBreakdownChainResponse = {
  volume_breakdown_chain: {
    chain: Chain;
    volumeUSD: number;
  }[];
};
