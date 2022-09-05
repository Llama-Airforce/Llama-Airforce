export default class PoolRevenue {
  timestamp: number;
  pool: string;
  revenue: number;
}

export class ChainRevenue {
  chain: string;
  totalDailyFeesUSD: number;
}
