export type ChainInfo = {
  chain: string;
  total: {
    tvl: number;
    tradingVolume24h: number;
    tradingFee24h: number;
    liquidityVolume24h: number;
    liquidityFee24h: number;
  };
};
