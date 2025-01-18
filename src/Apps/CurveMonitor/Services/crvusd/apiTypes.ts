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

export type GetUserMarketsResponse = {
  user: string;
  page: number;
  per_page: number;
  count: number;
  markets: {
    collateral: string;
    controller: string;
    first_snapshot: string;
    last_snapshot: string;
  }[];
};

type UserMarketStats = {
  health: number;
  health_full: number;
  n1: number;
  n2: number;
  n: number;
  debt: number;
  collateral: number;
  stablecoin: number;
  soft_liquidation: boolean;
  total_deposited: number;
  loss: number;
  loss_pct: number;
  collateral_up: number;
  oracle_price: number;
  block_number: number;
  timestamp: string;
};

export type GetUserMarketStatsResponse = UserMarketStats;

export type GetUserMarketSnapshotsResponse = {
  user: string;
  page: number;
  per_page: number;
  count: number;
  data: UserMarketStats[];
};

export type GetUserCollateralEventsResponse = {
  controller: string;
  user: string;
  total_deposit: number;
  total_borrowed: number;
  total_deposit_precise: string;
  total_borrowed_precise: string;
  total_deposit_usd_value: number;
  count: number;
  pagination: number;
  page: number;
  data: [
    {
      dt: string;
      transaction_hash: string;
      type: "Borrow" | "Deposit";
      user: string;
      collateral_change: number;
      collateral_change_usd: number | null;
      loan_change: number;
      loan_change_usd: number | null;
      liquidation: {
        user: string;
        liquidator: string;
        collateral_received: number;
        collateral_received_usd: number;
        stablecoin_received: number;
        debt: number;
      } | null;
      n1: number;
      n2: number;
      oracle_price: number;
    }
  ];
};
