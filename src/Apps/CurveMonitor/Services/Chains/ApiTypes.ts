export type GetChainInfoResponse = {
  chain: string;
  total: {
    total_tvl: number;
    trading_volume_24h: number;
    trading_fee_24h: number;
    liquidity_volume_24h: number;
    liquidity_fee_24h: number;
  };
};
