export type PoolRevenue = {
  timestamp: number;
  pool: string;
  revenue: number;
};

export type ChainRevenue = {
  chain: string;
  totalDailyFeesUSD: number;
};

export type ChainTopPoolRevenue = {
  name: string;
  totalDailyFeesUSD: number;
};
