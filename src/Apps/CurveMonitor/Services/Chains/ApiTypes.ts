type Coin = {
  pool_index: number;
  symbol: string;
  address: string;
};

type Pool = {
  name: string;
  address: string;
  n_coins: number;
  tvl_usd: number;
  trading_volume_24h: number;
  trading_fee_24h: number;
  liquidity_volume_24h: number;
  liquidity_fee_24h: number;
  coins?: Coin[];
  base_daily_apr: number;
  base_weekly_apr: number;
  virtual_price: number;
  pool_methods?: string[];
};

export type GetChainInfoResponse = {
  chain: string;
  total: {
    total_tvl: number;
    trading_volume_24h: number;
    trading_fee_24h: number;
    liquidity_volume_24h: number;
    liquidity_fee_24h: number;
  };
  data: Pool[];
};
