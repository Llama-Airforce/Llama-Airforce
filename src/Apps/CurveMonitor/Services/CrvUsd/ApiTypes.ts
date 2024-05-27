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
    liquidation_discount: number;
    loan_discount: number;
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
