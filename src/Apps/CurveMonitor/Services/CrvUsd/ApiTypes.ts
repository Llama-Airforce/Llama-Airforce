export type GetMarketsResponse = {
  data: {
    address: string;
    factory_address: string;
    llamma: string;
    rate: number;
    total_debt: number;
    n_loans: number;
    debt_ceiling: number;
    borrowable: number;
    pending_fees: number;
    collected_fees: number;
    collateral_amount: number;
    collateral_amount_usd: number;
    stablecoin_amount: number;
    collateral_token: {
      symbol: string;
      address: string;
    };
    stablecoin_token: {
      symbol: string;
      address: string;
    };
  }[];
  count: number;
};

export type GetSnapshotsResponse = {
  data: {
    rate: number;
    minted: number;
    redeemed: number;
    total_collateral: number;
    total_collateral_usd: number;
    total_stablecoin: number;
    total_debt: number;
    n_loans: number;
    amm_price: number;
    price_oracle: number;
    borrowable: number;
    dt: string;
  }[];
};

export type GetKeepersResponse = {
  keepers: {
    address: string;
    pool: string;
    pool_address: string;
    pair: {
      symbol: string;
      address: string;
    }[];
    active: boolean;
    total_debt: number;
    total_profit: number;
    tvl: number;
    volume: number;
  }[];
};

export type GetSupplyResponse = {
  data: {
    market: string;
    supply: number;
    borrowable: number;
    timestamp: string;
  }[];
};

export type GetSoftLiqRatiosResponse = {
  data: {
    timestamp: string;
    proportion: number;
  }[];
};

export type GetLiqsDetailedResponse = {
  data: {
    user: string;
    liquidator: string;
    self: boolean;
    collateral_received: number;
    collateral_received_usd: number;
    stablecoin_received: number;
    oracle_price: number;
    debt: number;
    n1: number;
    n2: number;
    dt: string;
    tx: string;
    block: number;
  }[];
};

export type GetLiqsAggregateResponse = {
  data: {
    timestamp: string;
    self_count: number;
    hard_count: number;
    self_value: number;
    hard_value: number;
    price: number;
  }[];
};

export type GetLiqOverviewResponse = {
  soft_liquidation_users: number;
  median_health: number;
  average_health: number;
  collat_ratio: number;
  liquidatable_positions: number;
  liquidatable_pos_debt: string;
  liquidatable_stablecoin: string;
  liquidatable_collateral: string;
  liquidatable_pos_debt_usd: number;
  liquidatable_collateral_usd: number;
  liquidatable_stablecoin_usd: number;
};
