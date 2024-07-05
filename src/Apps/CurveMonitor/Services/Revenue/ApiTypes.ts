export type GetCushionsResponse = {
  data: {
    pool: string;
    name: string;
    admin_fees: number[];
    usd_value: number;
  }[];
};

export type GetBreakdownResponse = {
  revenue: {
    week: number;
    label: string;
    total_fees: number;
  }[];
};

export type GetByChainResponse = {
  revenue: {
    chain: string;
    totalDailyFeesUSD: number;
  }[];
};

export type GetTopPoolsResponse = {
  revenue: {
    name: string;
    totalDailyFeesUSD: number;
  }[];
};

export type GetDistributionsResponse = {
  distributions: {
    timestamp: string;
    fees_usd: number;
  }[];
};

export type GetCowSwapSettlementsResponse = {
  data: {
    coin: {
      lp_token: boolean;
      symbol: string;
      address: string;
      precision: number;
    };
    amount: string;
    fee_amount: string;
    amount_received: number;
    router_received: number;
    epoch: number;
    tx_hash: string;
    block_number: number;
    dt: string;
  }[];
};
