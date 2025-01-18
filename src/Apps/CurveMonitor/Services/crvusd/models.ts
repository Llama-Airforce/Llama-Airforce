export type Market = {
  name: string;
  address: string;
  factory: string;
  llamma: string;
  rate: number;
  borrowed: number;
  borrowable: number;
  collateral: number;
  collateralUsd: number;
  loans: number;
  collateral_token: {
    symbol: string;
    address: string;
  };
  stablecoin_token: {
    symbol: string;
    address: string;
  };
  fees: {
    pending: number;
    collected: number;
  };
};

export type Snapshot = {
  timestamp: number;
  rate: number;
  nLoans: number;
  minted: number;
  redeemed: number;
  totalCollateral: number;
  totalCollateralUsd: number;
  totalStablecoin: number;
  totalDebt: number;
  priceAMM: number;
  priceOracle: number;
  borrowable: number;
  discountLiquidation: number;
  discountLoan: number;
};

export type PoolPrice = {
  timestamp: number;
  [token: string]: number;
};

export type PriceHistogram = {
  x: number[];
  y: number[];
};

export type CrvUsdSupply = {
  timestamp: number;
  market: string;
  supply: number;
  borrowable: number;
};

export type Keeper = {
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
};

/** More specifically, the markets where a user holds a position */
export type UserMarkets = {
  collateral: string;
  controller: string;
  snapshotFirst: number;
  snapshotLast: number;
}[];

export type UserMarketStats = {
  health: number;
  healthFull: number;
  n1: number;
  n2: number;
  n: number;
  debt: number;
  collateral: number;
  stablecoin: number;
  softLiquidation: boolean;
  totalDeposited: number;
  loss: number;
  lossPct: number;
  collateralUp: number;
  oraclePrice: number;
  blockNumber: number;
  timestamp: number;
};

export type UserMarketSnapshots = UserMarketStats[];

export type UserCollateralEvents = {
  controller: string;
  user: string;
  totalDeposit: number;
  totalDepositPrecise: string;
  totalDepositUsd: number;
  totalBorrowed: number;
  totalBorrowedPrecise: string;
  events: {
    timestamp: number;
    txHash: string;
    type: "Borrow" | "Deposit";
    user: string;
    collateralChange: number;
    collateralChangeUsd?: number;
    loanChange: number;
    loanChangeUsd?: number;
    liquidation?: {
      user: string;
      liquidator: string;
      collateralReceived: number;
      collateralReceivedUsd: number;
      stablecoinReceived: number;
      debt: number;
    };
    n1: number;
    n2: number;
    oraclePrice: number;
  }[];
};
